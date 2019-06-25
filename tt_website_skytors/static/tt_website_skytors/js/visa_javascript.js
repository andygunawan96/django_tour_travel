

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
    if(consulate_box.options.length > 1)
        for(i = consulate_box.options.length - 1 ; i >= 0 ; i--){
            consulate_box.remove(i);
        }
    for(i in visa_config){
        if(document.getElementById('visa_destination_id_hidden').value == visa_config[i].country){
            for(j in visa_config[i].consulate){
                var node = document.createElement("option");
                node.text = visa_config[i].consulate[j];
                node.value = visa_config[i].consulate[j];
                if(j == 0 && type == 'home'){
                    node.setAttribute('selected', 'selected');
                    document.getElementById('visa_consulate_id_hidden').value = visa_config[i].consulate[j];
                }else if(type == 'search'){
                    if(visa_request['consulate'] == visa_config[i].consulate[j]){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_consulate_id_hidden').value = visa_config[i].consulate[j];
                    }
                }
                consulate_box.add(node);
            }

        }
    }
    if(type == 'search')
        visa_signin('');
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
        text += `<h4>Price detail</h4>
                <table width="100%">`;
        price = 0;
        commission = 0;
        for(i in visa){
            pax_count = parseInt(document.getElementById('qty_pax_'+i).value);
            if(isNaN(pax_count))
                pax_count = 0;
            text+=`
                    <tr>
                        <td>`+pax_count+`x `+visa[i].pax_type[1]+`</td>
                        <td style="text-align:right;">IDR `+getrupiah(visa[i].sale_price.total_price)+`</td>
                    </tr>`;
            try{

                price += pax_count * visa[i].sale_price.total_price;
                commission += pax_count * visa[i].sale_price.commission;
            }catch(err){

            }
        }

        text+=`
                    <tr>
                        <td>Grand Total</td>
                        <td style="text-align:right;">IDR `+getrupiah(price)+`</td>
                    </tr>
                </table>`;
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
                <div class="row" id="show_commission" style="display: `+display+`;">
                    <div class="col-lg-12 col-xs-12" style="text-align:center;">
                        <div class="alert alert-success">
                            <span style="font-size:13px;">Your Commission: IDR `+getrupiah(commission)+`</span><br>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12" style="padding-bottom:5px;">
                        <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Hide Commission"><br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
                        <button class="primary-btn-ticket next-search-train ld-ext-right" style="width:100%;" onclick="show_loading();visa_check_search();" type="button" value="Next">
                            Next
                            <i class="fas fa-angle-right"></i>
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>
                </div>
                `;
    }else if(type == 'passenger'){
        text += `<h4>Price detail</h4>
                <table width="100%">`;
        price = 0;
        commission = 0;
        for(i in visa.list_of_visa){
            pax_count = passenger[visa.list_of_visa[i].pax_type[1].toLowerCase()];
            console.log(pax_count);
            text+=`
                    <tr>
                        <td>`+pax_count+`x `+visa.list_of_visa[i].pax_type[1]+`</td>
                        <td style="text-align:right;">IDR `+getrupiah(visa.list_of_visa[i].sale_price.total_price)+`</td>
                    </tr>`;
            try{

                price += pax_count * visa.list_of_visa[i].sale_price.total_price;
                commission += pax_count * visa.list_of_visa[i].sale_price.commission;
            }catch(err){

            }
        }

        text+=`
                    <tr>
                        <td>Grand Total</td>
                        <td style="text-align:right;">IDR `+getrupiah(price)+`</td>
                    </tr>
                </table>`;
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
                <div class="row" id="show_commission" style="display: `+display+`;">
                    <div class="col-lg-12 col-xs-12" style="text-align:center;">
                        <div class="alert alert-success">
                            <span style="font-size:13px;">Your Commission: IDR `+getrupiah(commission)+`</span><br>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12" style="padding-bottom:5px;">
                        <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Hide Commission"><br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
                        <button class="primary-btn-ticket next-search-train ld-ext-right" style="width:100%;" onclick="show_loading();visa_check_search();" type="button" value="Next">
                            Next
                            <i class="fas fa-angle-right"></i>
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>
                </div>
                `;
    }else if(type == 'review'){
        text += `<h4>Price detail</h4>
                <table width="100%">`;
        price = 0;
        commission = 0;
        for(i in visa.list_of_visa){
            pax_count = passenger[visa.list_of_visa[i].pax_type[1].toLowerCase()];
            console.log(pax_count);
            text+=`
                    <tr>
                        <td>`+pax_count+`x `+visa.list_of_visa[i].pax_type[1]+`</td>
                        <td style="text-align:right;">IDR `+getrupiah(visa.list_of_visa[i].sale_price.total_price)+`</td>
                    </tr>`;
            try{

                price += pax_count * visa.list_of_visa[i].sale_price.total_price;
                commission += pax_count * visa.list_of_visa[i].sale_price.commission;
            }catch(err){

            }
        }

        text+=`
                    <tr>
                        <td>Grand Total</td>
                        <td style="text-align:right;">IDR `+getrupiah(price)+`</td>
                    </tr>
                </table>`;
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
                <div class="row" id="show_commission" style="display: `+display+`;">
                    <div class="col-lg-12 col-xs-12" style="text-align:center;">
                        <div class="alert alert-success">
                            <span style="font-size:13px;">Your Commission: IDR `+getrupiah(commission)+`</span><br>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
                        <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Hide Commission"><br>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
                    </div>
                </div>
                `;
    }
    document.getElementById('detail').innerHTML = text;
}

function show_commission(){
    if(document.getElementById('show_commission').style.display == 'none')
        document.getElementById('show_commission').style.display = 'block';
    else
        document.getElementById('show_commission').style.display = 'none';
}

function copy_data(){
    $text = '';
    for(i in visa){
        $text += 'Visa '+ country +'('+getrupiah(visa[i].sale_price.total_price)+')\n';
        $text += visa[i].pax_type[1]+ ' ' + visa[i].visa_type[1] + ' ' + visa[i].entry_type[1] + ' ' + visa[i].type.process_type[1] + ' ' + visa[i].type.duration + ' day(s)' + '\n\n';
        $text += 'Consulate Address :\n';
        $text += visa[i].consulate.address + ', ' + visa[i].consulate.city + '\n\n';
        $text += 'Visa Requirement:\n';
        for(j in visa[i].requirements){
            $text += visa[i].requirements[j].name;
            if(visa[i].requirements[j].description)
                $text += ': ' + visa[i].requirements[j].description;
            $text += '\n';
        }
        $text += '\n';
    }
    console.log($text);
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
        console.log(check_number(document.getElementById('qty_pax_'+i).value));
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
    }else if(error_log == ''){
        document.getElementById('visa_passenger').submit();
    }else{
        alert(error_log);
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
       document.getElementById('visa_review').submit();
   else
       alert(error_log);

}

function get_visa_review(){

}