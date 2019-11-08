list_passenger = [];
function visa_autocomplete(type){
    if(type == 'consulate'){
        document.getElementById('visa_consulate_id_hidden').value = document.getElementById('select2-visa_consulate_id-container').innerHTML;
    }else if(type == 'destination'){
        document.getElementById('visa_destination_id_hidden').value = document.getElementById('select2-visa_destination_id-container').innerHTML;
        document.getElementById('visa_consulate_id_hidden').value = document.getElementById('select2-visa_destination_id-container').innerHTML;
        get_consulate();
    }
}

function get_consulate(type){
    consulate_box = document.getElementById('visa_consulate_id');
    try{
        if(consulate_box.options.length > 1)
            for(i = consulate_box.options.length - 1 ; i >= 0 ; i--){
                consulate_box.remove(i);
            }
        for(i in visa_config){
            if(document.getElementById('visa_destination_id_hidden').value == i){
                for(j in visa_config[i]){
                    var node = document.createElement("option");
                    node.text = visa_config[i][j];
                    node.value = visa_config[i][j];
                    if(j == 0 && type == 'home'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_consulate_id_hidden').value = visa_config[i][j];
                    }else if(type == 'search'){
                        if(visa_request['consulate'] == visa_config[i][j]){
                            node.setAttribute('selected', 'selected');
                            document.getElementById('visa_consulate_id_hidden').value = visa_config[i][j];
                        }
                    }
                    consulate_box.add(node);
                }

            }
        }
    }catch(err){

    }
}

function set_price_visa(val){
    price = 0;
    qty = document.getElementById('qty_pax_'+val).value;
    price += parseInt(qty) * visa[val].sale_price.total_price;
    document.getElementById('fare'+val).innerHTML = 'IDR '+ getrupiah(price.toString());
}

function set_total_price_visa(){
    price = 0;
    for(i in visa){
        qty = document.getElementById('qty_pax_'+i).value;
        price += parseInt(qty) * visa[i].sale_price.total_price;
    }
    //tinggal set html
}

function set_commission_price_visa(){
    price = 0;
    for(i in visa){
        qty = document.getElementById('qty_pax_'+i).value;
        price += parseInt(qty) * visa[i].sale_price.commission;
    }
    //tinggal set html
}

function update_table(type){
    text = ''
    if(type == 'search'){
        text += `<div style="background-color:white; padding:10px; border:1px solid #cdcdcd;">
                <h4>Price detail</h4><hr/>
                <table style="width:100%;">`;
        price = 0;
        commission = 0;
        for(i in visa){
            pax_count = parseInt(document.getElementById('qty_pax_'+i).value);
            if(isNaN(pax_count))
                pax_count = 0;

            text+=`
                    <tr>
                        <td>`+pax_count+` `+visa[i].pax_type[1]+`</td>
                        <td>x</td>
                        <td>`+visa[i].sale_price.currency+` `+getrupiah(visa[i].sale_price.total_price)+` </td>
                        <td style="text-align:right;">`+visa[i].sale_price.currency+` `+getrupiah(visa[i].sale_price.total_price*pax_count)+`</td>
                    </tr>`;
            try{

                price += pax_count * visa[i].sale_price.total_price;
                commission += pax_count * visa[i].sale_price.commission;
            }catch(err){

            }
        }

        text+=`</table>`;
        text+=`
            <div class="row" style="padding-bottom:15px;">
                <div class="col-lg-12">
                    <hr/>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                    <h6>Grand Total</h6>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                    <h6>`+visa[0].sale_price.currency+` `+getrupiah(price)+`</h6>
                </div>
            </div>`;
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
            <div class="row" id="show_commission" style="display: `+display+`;">
                <div class="col-lg-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight:bold;">Your Commission: `+visa[0].sale_price.currency+` `+getrupiah(commission)+`</span><br>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br>
                </div>
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('search');" value="Copy">
                </div>
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <button class="primary-btn-ticket next-loading ld-ext-right" style="width:100%;" onclick="show_loading();visa_check_search();" type="button" value="Next">
                        Next
                        <div class="ld ld-ring ld-cycle"></div>
                    </button>
                </div>
            </div>
        </div>`;
    }else if(type == 'passenger'){
        text += `<h4>Price detail</h4><hr/>
                <table style="width:100%; margin-bottom:10px;">`;
        price = 0;
        commission = 0;
        for(i in visa.list_of_visa){
            text+=`
                    <tr>
                        <td>`+visa.list_of_visa[i].total_pax+`x `+visa.list_of_visa[i].pax_type[1]+`</td>
                        <td>x</td>
                        <td>`+visa.list_of_visa[i].sale_price.currency+` `+getrupiah(visa.list_of_visa[i].sale_price.total_price)+`</td>
                        <td style="text-align:right;">`+visa.list_of_visa[i].sale_price.currency+` `+getrupiah(visa.list_of_visa[i].sale_price.total_price*visa.list_of_visa[i].total_pax)+`</td>
                    </tr>`;
            try{

                price += visa.list_of_visa[i].total_pax * visa.list_of_visa[i].sale_price.total_price;
                commission += visa.list_of_visa[i].total_pax * visa.list_of_visa[i].sale_price.commission;
            }catch(err){

            }
        }

        text+=`</table>`;

        text+=`
            <div class="row" style="padding-bottom:15px;">
                <div class="col-lg-12">
                    <hr/>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                    <h6>Grand Total</h6>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                    <h6>`+visa.list_of_visa[0].sale_price.currency+` `+getrupiah(price)+`</h6>
                </div>
            </div>`;
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
            <div class="row" id="show_commission" style="display: `+display+`;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight:bold;">Your Commission: `+visa.list_of_visa[0].sale_price.currency+` `+getrupiah(commission)+`</span><br>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br>
                </div>
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
                </div>
            </div>`;
    }else if(type == 'review'){

        text += `<h4>Price detail</h4><hr/>`;
        price = 0;
        commission = 0;
        currency = '';
        price_pax = 0;
        if(list_passenger.length > 0){
            text+=`<table style="width:100%; margin-bottom:10px;">`;
            for(i in list_passenger){
                currency = list_passenger[i].currency;
                price += list_passenger[i].Fare;
                commission += list_passenger[i].Commission;
                price_pax = list_passenger[i].Fare;
                text+=`
                        <tr>
                            <td>`+list_passenger[i].name+`</td>
                            <td style="text-align:right;">`+currency+` `+getrupiah(price_pax)+`</td>
                        </tr>`;

            }

            text+=`</table>`;
        }else{
            text+=`<h6>Select visa first!</h6>`;
        }

        text+=`
            <div class="row" style="padding-bottom:15px;">
                <div class="col-lg-12">
                    <hr/>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                    <h6>Grand Total</h6>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                    <h6>`+currency+` `+getrupiah(price)+`</h6>
                </div>
            </div>`;
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
                <div class="row" id="show_commission" style="display: `+display+`;">
                    <div class="col-lg-12" style="text-align:center;">
                        <div class="alert alert-success">
                            <span style="font-size:13px; font-weight:bold;">Your Commission: `+currency+` `+getrupiah(commission)+`</span><br>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br>
                    </div>
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('review');" value="Copy">
                    </div>
                </div>
                `;
    }else if(type == 'booking'){
        text += `<h4>Price detail</h4><hr/>
                <table style="width:100%; margin-bottom:10px;">`;
        price = 0;
        price_pax = 0;
        commission = 0;
        currency = '';
        for(i in visa.passengers){
            for(j in visa.passengers[i].visa.price){
                if(visa.passengers[i].visa.price[j].charge_code == 'fare'){
                    price += visa.passengers[i].visa.price[j].amount;
                    price_pax = visa.passengers[i].visa.price[j].amount;
                    currency = visa.passengers[i].visa.price[j].currency;
                }else if(visa.passengers[i].visa.price[j].charge_code == 'rac')
                    commission += (visa.passengers[i].visa.price[j].amount) *-1;
            }
            text+=`
                    <tr>
                        <td>`+visa.passengers[i].title+` `+visa.passengers[i].first_name+` `+visa.passengers[i].last_name+`</td>
                        <td style="text-align:right;">`+currency+` `+getrupiah(price_pax)+`</td>
                    </tr>`;

        }

        text+=`</table>`;

        text+=`
            <div class="row" style="padding-bottom:15px;">
                <div class="col-lg-12">
                    <hr/>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                    <h6>Grand Total</h6>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                    <h6>`+currency+` `+getrupiah(price)+`</h6>
                </div>
            </div>`;
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`<div style="text-align:right; cursor:pointer; padding-bottom:10px;" onclick="show_repricing();"><i class="image-rounded-icon"><img src="/static/tt_website_skytors/img/bank.png" style="width:30px; height:30px;"/></i></div>`;
        text+=`
        <div class="row" id="show_commission" style="display: `+display+`;">
            <div class="col-lg-12" style="text-align:center;">
                <div class="alert alert-success">
                    <span style="font-size:13px; font-weight:bold;">Your Commission: `+currency+` `+getrupiah(commission)+`</span><br>
                </div>
            </div>
        </div>`;
        text+=`
        <div class="row">
            <div class="col-lg-12" style="padding-bottom:10px;">
                <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br>
            </div>
            <div class="col-lg-12" style="padding-bottom:10px;">
                <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('review');" value="Copy">
            </div>
        </div>`;
    }
    document.getElementById('detail').innerHTML = text;
    $("#select_visa_first").hide();
}

function show_commission(){
    if(document.getElementById('show_commission').style.display == 'none'){
        document.getElementById('show_commission').style.display = 'block';
        document.getElementById('show_commission_button').value = 'Hide Commission';
    }else{
        document.getElementById('show_commission').style.display = 'none';
        document.getElementById('show_commission_button').value = 'Show Commission';
    }
}

function copy_data(type){
    $text = '';
    if(type == 'search'){
        for(i in visa){
            $text += 'Visa '+ country +'('+visa[i].sale_price.currency+ ' ' +getrupiah(visa[i].sale_price.total_price)+')\n';
            $text += visa[i].pax_type[1]+ ' ' + visa[i].visa_type[1] + ' ' + visa[i].entry_type[1] + ' ' + visa[i].type.process_type[1] + ' ' + visa[i].type.duration + ' day(s)' + '\n\n';
            $text += 'Consulate Address :\n';
            $text += visa[i].consulate.address + ', ' + visa[i].consulate.city + '\n\n';
            if(visa[i].requirements.length == 0){
                $text += 'Visa Requirement:\n';

                for(j in visa[i].requirements){
                    $text += visa[i].requirements[j].name;
                    if(visa[i].requirements[j].description)
                        $text += ': ' + visa[i].requirements[j].description;
                    $text += '\n';
                }
                $text += '\n';
            }
        }
    }else{
        for(i in visa.list_of_visa){
            $text += 'Visa '+ visa_request.country +'('+visa.list_of_visa[i].sale_price.currency+ ' ' +getrupiah(visa.list_of_visa[i].sale_price.total_price)+')\n';
            $text += visa.list_of_visa[i].pax_type[1]+ ' ' + visa.list_of_visa[i].visa_type[1] + ' ' + visa.list_of_visa[i].entry_type[1] + ' ' + visa.list_of_visa[i].type.process_type[1] + ' ' + visa.list_of_visa[i].type.duration + ' day(s)' + '\n\n';
            $text += 'Consulate Address :\n';
            $text += visa.list_of_visa[i].consulate.address + ', ' + visa.list_of_visa[i].consulate.city + '\n\n';
            if(visa.list_of_visa[i].requirements.length == 0){
                $text += 'Visa Requirement:\n';

                for(j in visa.list_of_visa[i].requirements){
                    $text += visa.list_of_visa[i].requirements[j].name;
                    if(visa.list_of_visa[i].requirements[j].description)
                        $text += ': ' + visa.list_of_visa[i].requirements[j].description;
                    $text += '\n';
                }
                $text += '\n';
            }
        }
    }
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function visa_check_search(){
    error_log = '';
    for(i in visa){
        if(check_number(document.getElementById('qty_pax_'+i).value) == false){
            error_log = 'Please input number in pax type '+ visa[i].pax_type[1]+'\n';

        }
    }
    check = 0;
    for(i in visa){
        if(document.getElementById('qty_pax_'+i).value != '' && document.getElementById('qty_pax_'+i).value != '0'){
            check = 1;
        }
    }
    if(check == 0){
        for(i in visa){
            document.getElementById('qty_pax_'+i).style['border-color'] = 'red';
        }
        alert('Please input pax')
        $('.next-loading').removeClass("running");
    }else if(error_log == ''){
        document.getElementById('visa_passenger').submit();
    }else{
        alert(error_log);
    }
}

function check_passenger(adult, child, infant){
    //booker
    error_log = '';
    for(i in passenger_data_pick){
        if(passenger_data_pick[i].sequence != 'booker'){
            passenger_check = {
                'type': passenger_data_pick[i].sequence.substr(0, passenger_data_pick[i].sequence.length-1),
                'number': passenger_data_pick[i].sequence.substr(passenger_data_pick[i].sequence.length-1, passenger_data_pick[i].sequence.length)
            }
            if(document.getElementById(passenger_check.type+'_title'+passenger_check.number).value != passenger_data_pick[i].title ||
               document.getElementById(passenger_check.type+'_first_name'+passenger_check.number).value != passenger_data_pick[i].first_name ||
               document.getElementById(passenger_check.type+'_last_name'+passenger_check.number).value != passenger_data_pick[i].last_name)
               error_log += "Search "+passenger_check.type+" "+passenger_check.number+" doesn't match!</br>\nPlease don't use inspect element!</br>\n";
       }else if(passenger_data_pick[i].sequence == 'booker'){
            if(document.getElementById('booker_title').value != passenger_data_pick[i].title ||
                document.getElementById('booker_first_name').value != passenger_data_pick[i].first_name ||
                document.getElementById('booker_last_name').value != passenger_data_pick[i].last_name)
                error_log += "Search booker doesn't match!</br>\nPlease don't use inspect element!</br>\n";
       }
    }
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
    length = 25;

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
       document.getElementById('visa_review').submit();
   else{
       alert(error_log);
       $('.next-loading').removeClass("running");
    }
}

function get_visa_review(){

}

function check_on_off_radio(pax_type,number,value){
    pax_required = '';
    pax_check = '';
    pax_visa = '';
    pax_entry = '';
    pax_process = '';
    pax_price = '';
    name = '';
    list_of_name = []
    if(pax_type == 'adult'){
        pax_required = document.getElementById('adult_required'+number);
        pax_check = document.getElementById('adult_check'+number);
        pax_visa = document.getElementsByName('adult_visa_type'+number);
        pax_entry = document.getElementsByName('adult_entry_type'+number);
        pax_process = document.getElementsByName('adult_process_type'+number);
        pax_price = document.getElementById('adult_price'+number);
        name = document.getElementById('adult_name'+number).innerHTML;
    }else if(pax_type == 'child'){
        pax_required = document.getElementById('child_required'+number);
        pax_check = document.getElementById('child_check'+number);
        pax_visa = document.getElementsByName('child_visa_type'+number);
        pax_entry = document.getElementsByName('child_entry_type'+number);
        pax_process = document.getElementsByName('child_process_type'+number);
        pax_price = document.getElementById('child_price'+number);
        name = document.getElementById('child_name'+number).innerHTML;
    }else if(pax_type == 'infant'){
        pax_required = document.getElementById('infant_required'+number);
        pax_check = document.getElementById('infant_check'+number);
        pax_visa = document.getElementsByName('infant_visa_type'+number);
        pax_entry = document.getElementsByName('infant_entry_type'+number);
        pax_process = document.getElementsByName('infant_process_type'+number);
        pax_price = document.getElementById('infant_price'+number);
        name = document.getElementById('infant_name'+number).innerHTML;
    }
    if(value == 'visa'){
        if(pax_check.value != 'false'){
            visa.list_of_visa[parseInt(pax_check.value)].total_pax++;
            pax_required.innerHTML = '';
            pax_check.value = 'false';
        }
        var radios = pax_visa;
        visa_type = '';
        for (var j = 0, length = radios.length; j < length; j++) {
            if(radios[j].checked == true){
                visa_type = radios[j].value;
            }
        }
        radios = pax_entry;
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].disabled = true;
            radios[j].checked = false;
        }
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].pax_type[1].toLowerCase() == pax_type && visa.list_of_visa[i].visa_type[0] == visa_type){
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].value == visa.list_of_visa[i].entry_type[0] && visa.list_of_visa[i].total_pax > 0){
                        radios[j].disabled = false;
                    }
                }
            }
        }
        radios = pax_process;
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].disabled = true;
            radios[j].checked = false;
        }
        pax_price.innerHTML = '-';
        //check max pax
    }else if(value == 'entry'){
        if(pax_check.value != 'false'){
            visa.list_of_visa[parseInt(pax_check.value)].total_pax++;
            pax_required.innerHTML = '';
            pax_check.value = 'false';
        }
        var radios = pax_visa;
        visa_type = '';
        for (var j = 0, length = radios.length; j < length; j++) {
            if(radios[j].checked == true){
                visa_type = radios[j].value;
            }
        }
        radios = pax_entry;
        entry_type = '';
        for (var j = 0, length = radios.length; j < length; j++) {
            if(radios[j].checked == true){
                entry_type = radios[j].value;
            }
        }
        radios = pax_process;
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].disabled = true;
            radios[j].checked = false;
        }
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].pax_type[1].toLowerCase() == pax_type && visa.list_of_visa[i].visa_type[0] == visa_type && visa.list_of_visa[i].entry_type[0] == entry_type){
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].value == visa.list_of_visa[i].type.process_type[0] && visa.list_of_visa[i].total_pax > 0){
                        radios[j].disabled = false;
                    }
                }
            }
        }
        pax_price.innerHTML = '-';
    }else if(value == 'process'){
        var radios = pax_visa;
        visa_type = '';
        for (var j = 0, length = radios.length; j < length; j++) {
            if(radios[j].checked == true){
                visa_type = radios[j].value;
            }
        }
        radios = pax_entry;
        entry_type = '';
        for (var j = 0, length = radios.length; j < length; j++) {
            if(radios[j].checked == true){
                entry_type = radios[j].value;
            }
        }
        radios = pax_process;
        process_type = '';
        for (var j = 0, length = radios.length; j < length; j++) {
            if(radios[j].checked == true){
                process_type = radios[j].value;
            }
        }
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].pax_type[1].toLowerCase() == pax_type &&
                visa.list_of_visa[i].visa_type[0] == visa_type &&
                visa.list_of_visa[i].entry_type[0] == entry_type &&
                visa.list_of_visa[i].type.process_type[0] == process_type){
                pax_price.innerHTML = visa.list_of_visa[i].sale_price.currency + ' ' + visa.list_of_visa[i].sale_price.total_price.toString();
                text_requirements = '';
                for(j in visa.list_of_visa[i].requirements){
                    if(visa.list_of_visa[i].requirements[j].required == true){
                        text_requirements += `
                        <label class="check_box_custom">
                            <span style="font-size:13px;">`+visa.list_of_visa[i].requirements[j].name+` Copy</span>
                            <input type="checkbox" id="`+pax_type+`_required`+number+`_`+j+`_copy"/>
                            <span class="check_box_span_custom"></span>
                        </label>
                        <label class="check_box_custom">
                            <span style="font-size:13px;">`+visa.list_of_visa[i].requirements[j].name+` Original</span>
                            <input type="checkbox" id="`+pax_type+`_required`+number+`_`+j+`_original"/>
                            <span class="check_box_span_custom"></span>
                        </label>`;
                    }
                }
                pax_required.innerHTML = text_requirements;
                console.log(visa.list_of_visa[i].total_pax);
                visa.list_of_visa[i].total_pax = visa.list_of_visa[i].total_pax - 1;
                pax_check.value = i;
                list_of_name = name.split(' ');
                list_of_name.shift();
                list_of_name.shift();
                list_of_name = list_of_name.join(' ');

                console.log(list_of_name);
                check = 0;
                for(j in list_passenger){
                    if(list_passenger[j].name == list_of_name)
                        check = 1;
                }
                if(check == 0)
                    list_passenger.push({
                        'name': list_of_name,
                        'Fare': visa.list_of_visa[i].sale_price.total_price,
                        'currency':visa.list_of_visa[i].sale_price.currency,
                        'commission':visa.list_of_visa[i].sale_price.commission,
                    });
                update_table('review');


            }
        }
    }
}

function set_value_radio_first(pax_type,number){
    if(pax_type == 'adult'){
        var radios = document.getElementsByName('adult_entry_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
            radios[j].disabled = true;
        }
        radios = document.getElementsByName('adult_visa_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
        }
        radios = document.getElementsByName('adult_process_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
            radios[j].disabled = true;
        }
        document.getElementById('adult_price'+number).innerHTML = '-';
        if(document.getElementById('adult_check'+number).value != 'false'){
            visa.list_of_visa[parseInt(document.getElementById('adult_check'+number).value)].total_pax++;
            document.getElementById('adult_check'+number).value = 'false';
            document.getElementById('adult_required'+number).innerHTML = '';
        }
        try{
            list_of_name = document.getElementById('adult_name'+number).innerHTML;
            list_of_name = list_of_name.split(' ');
            list_of_name.shift();
            list_of_name.shift();
            list_of_name = list_of_name.join(' ');
            for(i in list_passenger){
                if(list_of_name == list_passenger[i].name){
                    list_passenger.pop(i);
                    break;
                }
            }
        }catch(err){

        }
    }else if(pax_type == 'child'){
        var radios = document.getElementsByName('child_entry_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
            radios[j].disabled = true;
        }
        radios = document.getElementsByName('child_visa_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
        }
        radios = document.getElementsByName('child_process_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
            radios[j].disabled = true;
        }
        document.getElementById('child_price'+number).innerHTML = '-';
        if(document.getElementById('child_check'+number).value != 'false'){
            visa.list_of_visa[parseInt(document.getElementById('child_check'+number).value)].total_pax++;
            document.getElementById('child_check'+number).value = 'false';
            document.getElementById('child_required'+number).innerHTML = '';
        }
        try{
            list_of_name = document.getElementById('child_name'+number).innerHTML;
            list_of_name = list_of_name.split(' ');
            list_of_name.shift();
            list_of_name.shift();
            list_of_name = list_of_name.join(' ');
            for(i in list_passenger){
                if(list_of_name == list_passenger[i].name){
                    list_passenger.pop(i);
                    break;
                }
            }
        }catch(err){

        }
    }else if(pax_type == 'infant'){
        var radios = document.getElementsByName('infant_entry_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
            radios[j].disabled = true;
        }
        radios = document.getElementsByName('infant_visa_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
        }
        radios = document.getElementsByName('infant_process_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
            radios[j].disabled = true;
        }
        document.getElementById('infant_price'+number).innerHTML = '-';
        if(document.getElementById('infant_check'+number).value != 'false'){
            visa.list_of_visa[parseInt(document.getElementById('infant_check'+number).value)].total_pax++;
            document.getElementById('infant_check'+number).value = 'false';
            document.getElementById('infant_required'+number).innerHTML = '';
        }
        try{
            list_of_name = document.getElementById('infant_name'+number).innerHTML;
            list_of_name = list_of_name.split(' ');
            list_of_name.shift();
            list_of_name.shift();
            list_of_name = list_of_name.join(' ');
            for(i in list_passenger){
                if(list_of_name == list_passenger[i].name){
                    list_passenger.pop(i);
                    break;
                }
            }
        }catch(err){

        }
    }else if(pax_type == 'elder'){
        var radios = document.getElementsByName('elder_entry_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
            radios[j].disabled = true;
        }
        radios = document.getElementsByName('elder_visa_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
        }
        radios = document.getElementsByName('elder_process_type'+number);
        for (var j = 0, length = radios.length; j < length; j++) {
            radios[j].checked = false;
            radios[j].disabled = true;
        }
        document.getElementById('elder_price'+number).innerHTML = '-';
        if(document.getElementById('elder_check'+number).value != 'false'){
            visa.list_of_visa[parseInt(document.getElementById('elder_check'+number).value)].total_pax++;
            document.getElementById('elder_check'+number).value = 'false';
            document.getElementById('elder_required'+number).innerHTML = '';
        }
        try{
            list_of_name = document.getElementById('elder_name'+number).innerHTML;
            list_of_name = list_of_name.split(' ');
            list_of_name.shift();
            list_of_name.shift();
            list_of_name = list_of_name.join(' ');
            for(i in list_passenger){
                if(list_of_name == list_passenger[i].name){
                    list_passenger.pop(i);
                    break;
                }
            }
        }catch(err){

        }
    }
    update_table('review');
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

function check_before_calculate(){
    check = 0;
    for(i in visa.list_of_visa)
        if(visa.list_of_visa[i].total_pax != 0){
            check = 1;
        }
    if(check == 0)
        calculate('visa');
    else
        alert('Please fill all visa type, entry type, and process type!');
}

function check_before_add_repricing(){
    check = 0;
    console.log(visa.list_of_visa);
    for(i in visa.list_of_visa){
        if(visa.list_of_visa[i].total_pax != 0){
            check = 1;
        }
    }
    if(check == 0)
        add_table_of_equation();
    else
        alert('Please fill all visa type, entry type, and process type!');
}

function show_repricing(){
    $("#myModalRepricing").modal();
}