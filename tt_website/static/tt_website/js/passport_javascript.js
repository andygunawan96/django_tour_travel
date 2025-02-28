list_passenger = [];
count_price_detail = [];

function visa_autocomplete(type,page){
    if(type == 'consulate'){
        document.getElementById('visa_consulate_id_hidden').value = document.getElementById('select2-visa_consulate_id-container').innerHTML;
    }else if(type == 'destination'){
        document.getElementById('visa_destination_id_hidden').value = document.getElementById('select2-visa_destination_id-container').innerHTML;
        get_consulate(page);
    }
}

function get_consulate(type){
    consulate_box = document.getElementById('passport_consulate_id');
    consulate_box.innerHTML = '';
    try{
        var found_consulate = false
        for(i in visa_config){
            if(document.getElementById('passport_destination_id_hidden').value == i){
                for(j in visa_config[i]){
                    var node = document.createElement("option");
                    node.text = visa_config[i][j];
                    node.value = visa_config[i][j];
                    if(j == 0 && type == 'home'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('passport_consulate_id_hidden').value = visa_config[i][j];
                        found_consulate = true;
                    }else if(type == 'search'){
                        if(visa_request['consulate'] == visa_config[i][j]){
                            node.setAttribute('selected', 'selected');
                            document.getElementById('passport_consulate_id_hidden').value = visa_config[i][j];
                            found_consulate = true;
                        }
                    }
                    consulate_box.add(node);
                }
                if(!found_consulate){
                    for(j in visa_config[i]){
                        if(j == 0){
                            node.setAttribute('selected', 'selected');
                            document.getElementById('passport_consulate_id_hidden').value = visa_config[i][j];
                            found_consulate = true;
                            break;
                        }
                    }
                }

            }
        }
    }catch(err){

    }
}

function set_total_price_visa(){
    price = 0;
    for(i in visa){
        qty = document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value;
        price += parseInt(qty) * visa[i].sale_price.total_price;
    }
    //tinggal set html
}

function set_commission_price_visa(){
    price = 0;
    for(i in visa){
        qty = document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value;
        price += parseInt(qty) * visa[i].sale_price.commission;
    }
    //tinggal set html
}

function update_table(type){
    text = '';
    $text = '';
    var check_price_detail = 0;
    if(type == 'search'){
        text += `<div style="background-color:white; padding:10px; border:1px solid #cdcdcd;">
                <h4>Price detail `+passport_request.passport_type+` - `+passport_request.passport_apply_type+`</h4><hr/>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in passport){
            pax_count = parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value);
            if(isNaN(pax_count)){
                pax_count = 0;
            }

            if(pax_count != 0){
                count_price_detail[i] = 1;
                text+=`
                <div class="row">
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+pax_count+` `+passport[i].apply_type+`, `+passport[i].type.process_type+` <br/> `+passport[i].sale_price.currency+` `+getrupiah(passport[i].sale_price.total_price)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+passport[i].sale_price.currency+` `+getrupiah(passport[i].sale_price.total_price*pax_count)+`</span>
                    </div>
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;
                count_i = count_i+1;
                $text += count_i + '. ';
                $text += passport[i].apply_type + ' ' + passport[i].type.process_type + ' ' + passport[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += passport[i].consulate.address + ', ' + passport[i].consulate.city + '\n\n';
                if(passport[i].notes.length != 0){
                    $text += 'Passport Requirement:\n';

                    for(j in passport[i].notes){
                        $text += passport[i].notes[j] + '\n';
//                        if(visa[i].requirements[j].description){
//                            if(visa[i].requirements[j].description != "-"){
//                                $text += ': ' + visa[i].requirements[j].description;
//                            }
//                        }
//                        $text += ;
                    }
                    $text += '\n';
                }
            }
            else{
                count_price_detail[i] = 0;
            }
            try{
                price += pax_count * passport[i].sale_price.total_price;
                commission += pax_count * (passport[i].commission[0].amount * -1);
            }catch(err){

            }
        }

        for(i in count_price_detail){
            if(count_price_detail[i] == 1){
                check_price_detail = 1;
                break;
            }
            else{
                check_price_detail = 0;
            }
        }

        if(check_price_detail == 0){
            text+=`<div class="row">
                <div class="col-lg-12">
                    <h6>Please choose your passport first!<h6>
                </div>
            </div>`;
        }
        else{
            $text += 'Price\n';
            for(i in passport){
                pax_count = parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value);
                if(isNaN(pax_count)){
                    pax_count = 0;
                }

                if(pax_count != 0){
                    $text += pax_count + ' ' + passport[i].apply_type + ',' + passport[i].type.process_type ;
                    $text += ' @'+ passport[i].sale_price.currency + ' ' +getrupiah(passport[i].sale_price.total_price);
                    $text += '\n';
                }
            }

            text+=`
                <div class="row" style="padding-bottom:15px;">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <h6>Grand Total</h6>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <h6>`+passport[0].sale_price.currency+` `+getrupiah(price)+`</h6>
                    </div>
                </div>`;
            $text += '\n';
            $text += 'Grand Total: '+passport[0].sale_price.currency + ' '+getrupiah(price);
            try{
                display = document.getElementById('show_commission').style.display;
            }catch(err){
                display = 'none';
            }
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission,'show_commission',passport[0].sale_price.currency)

            text+=`
                <div class="row">
                    <div class="col-lg-12" style="padding-bottom:15px;">
                        <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                            <a href="mailto:?subject=This is the passport price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                    } else {
                        text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                            <a href="mailto:?subject=This is the passport price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                    }
                    text +=`</div>

                </div>`;
                text+=`
                <div class="row" style="margin-top:10px; text-align:center;">
                   <div class="col-lg-12">
                        <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data('search');" value="Copy">
                   </div>
                </div>`;
//                if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                text+=`
//                <div class="row" style="margin-top:10px; text-align:center;">
//                   <div class="col-lg-12">
//                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br>
//                   </div>
//                </div>`;
                if(agent_security.includes('book_reservation') == true)
                text+=
                `<div class="row" style="margin-top:10px; text-align:center;">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <button id="passport_btn_search" class="primary-btn-ticket next-loading ld-ext-right" style="width:100%;" onclick="show_loading();passport_check_availability();" type="button" value="Next">
                            Get Price
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>
                </div>`;
            text+=`</div>`;
        }
    }else if(type == 'passenger'){
        text += `<h4>Price detail `+passport_request.passport_type+` - `+passport_request.passport_apply_type+`</h4><hr/>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in passport.list_of_passport){
            if(passport.list_of_passport[i].total_pax != 0){
                count_price_detail[i] = 1;
                text+=`
                <div class="row">
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+passport.list_of_passport[i].total_pax+` `+passport.list_of_passport[i].apply_type+`, `+passport.list_of_passport[i].type.process_type+` <br/> `+passport.list_of_passport[i].sale_price.currency+` `+getrupiah(passport.list_of_passport[i].sale_price.total_price)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+passport.list_of_passport[i].sale_price.currency+` `+getrupiah(passport.list_of_passport[i].sale_price.total_price*passport.list_of_passport[i].total_pax)+`</span>
                    </div>
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;

                count_i = count_i+1;
                $text += count_i + '. ';
                $text += passport.list_of_passport[i].apply_type + ' ' + passport.list_of_passport[i].type.process_type + ' ' + passport.list_of_passport[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += passport.list_of_passport[i].consulate.address + ', ' + passport.list_of_passport[i].consulate.city + '\n\n';
                if(passport.list_of_passport[i].notes.length != 0){
                    $text += 'Passport Requirement:\n';

                    for(j in passport.list_of_passport[i].notes){
                        $text += passport.list_of_passport[i].notes[j] + '\n';
//                        if(visa[i].requirements[j].description){
//                            if(visa[i].requirements[j].description != "-"){
//                                $text += ': ' + visa[i].requirements[j].description;
//                            }
//                        }
//                        $text += ;
                    }
                    $text += '\n';
                }

            }
            try{
                price += passport.list_of_passport[i].total_pax * passport.list_of_passport[i].sale_price.total_price;
                commission += passport.list_of_passport[i].total_pax * (passport.list_of_passport[i].commission[0].amount * -1);
            }catch(err){

            }
        }

        $text += 'Price\n';
        for(i in passport.list_of_passport){
            if(passport.list_of_passport[i].total_pax != 0){
                $text += passport.list_of_passport[i].total_pax;
                $text += ' @'+ passport.list_of_passport[i].sale_price.currency+ ' ' +getrupiah(passport.list_of_passport[i].sale_price.total_price) + '\n';
            }
        }

        text+=`
            <div class="row" style="padding-bottom:15px;">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                    <h6>Grand Total</h6>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                    <h6>`+passport.list_of_passport[0].sale_price.currency+` `+getrupiah(price)+`</h6>
                </div>
            </div>`;
        $text += '\n';
        $text += 'Grand Total: '+passport.list_of_passport[0].sale_price.currency + ' '+getrupiah(price);
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
            <div class="row">
                <div class="col-lg-12" style="padding-bottom:15px;">
                    <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the passport price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the passport price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                }
                text +=`</div>
            </div>`;
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission,'show_commission',passport.list_of_passport[0].sale_price.currency)
            text+=`
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                    <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
               </div>
            </div>`;
//            if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//            text+=`
//            <div class="row" style="margin-top:10px; text-align:center;">
//               <div class="col-lg-12" style="padding-bottom:10px;">
//                    <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br>
//               </div>
//            </div>`;
    }else if(type == 'review'){
        if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){
            tax = 0;
            fare = 0;
            total_price = 0;
            total_price_provider = [];
            price_provider = 0;
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
            type_amount_repricing = ['Repricing'];
            for(i in passenger){
                if(i != 'booker' && i != 'contact'){
                    for(j in passenger[i]){
                        pax_type_repricing.push([passenger[i][j].first_name +passenger[i][j].last_name, passenger[i][j].first_name +passenger[i][j].last_name]);
                        price_arr_repricing[passenger[i][j].first_name +passenger[i][j].last_name] = {
                            'Fare': 0,
                            'Tax': 0,
                            'Repricing': 0
                        }
                    }
                }
            }
            //repricing
            text_repricing = `
            <div class="col-lg-12">
                <div style="padding:5px;" class="row">
                    <div class="col-lg-6"></div>
                    <div class="col-lg-6">Repricing</div>
                </div>
            </div>`;
            for(k in price_arr_repricing){
               text_repricing += `
               <div class="col-lg-12">
                    <div style="padding:5px;" class="row" id="adult">
                        <div class="col-lg-6" id="`+j+`_`+k+`">`+k+`</div>
                        <div hidden id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                        if(price_arr_repricing[k].Repricing == 0)
                        text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">-</div>`;
                        else
                        text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                        text_repricing+=`<div hidden id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                    </div>
                </div>`;
            }
            text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
            document.getElementById('repricing_div').innerHTML = text_repricing;
            //repricing
        }
        text += `<h4>Price detail `+passport_request.passport_type+` - `+passport_request.passport_apply_type+`</h4><hr/>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in passport.list_of_passport){
            if(passport.list_of_passport[i].pax_count != 0){
                count_price_detail[i] = 1;
                text+=`
                <div class="row">
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+passport.list_of_passport[i].pax_count+` `+passport.list_of_passport[i].apply_type+`, `+passport.list_of_passport[i].type.process_type+` <br/> `+passport.list_of_passport[i].sale_price.currency+` `+getrupiah(passport.list_of_passport[i].sale_price.total_price)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+passport.list_of_passport[i].sale_price.currency+` `+getrupiah(passport.list_of_passport[i].sale_price.total_price*passport.list_of_passport[i].pax_count)+`</span>
                    </div>
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;

                count_i = count_i+1;
                $text += count_i + '. ';

                $text += passport.list_of_passport[i].apply_type + ' ' + passport.list_of_passport[i].type.process_type + ' ' + passport.list_of_passport[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += passport.list_of_passport[i].consulate.address + ', ' + passport.list_of_passport[i].consulate.city + '\n\n';

                if(passport.list_of_passport[i].notes.length != 0){
                    $text += 'Visa Requirement:\n';

                    for(j in passport.list_of_passport[i].notes){
                        $text += passport.list_of_passport[i].notes[j] + '\n';
//                        if(visa[i].requirements[j].description){
//                            if(visa[i].requirements[j].description != "-"){
//                                $text += ': ' + visa[i].requirements[j].description;
//                            }
//                        }
//                        $text += ;
                    }
                    $text += '\n';
                }

            }
            try{
                price += passport.list_of_passport[i].pax_count * passport.list_of_passport[i].sale_price.total_price;
                commission += passport.list_of_passport[i].pax_count * (passport.list_of_passport[i].commission[0].amount * -1);
            }catch(err){

            }
        }

        $text += 'Contact Person:\n';
        $text += passenger.contact[0].title + ' ' + passenger.contact[0].first_name + ' ' + passenger.contact[0].last_name + '\n';
        $text += passenger.contact[0].email + '\n';
        $text += passenger.contact[0].calling_code + ' - ' +passenger.contact[0].mobile + '\n\n';

        $text += 'Passenger\n';
        for(i in passenger){
            if(i != 'booker' && i != 'contact'){
                for(j in passenger[i]){
                    $text += passenger[i][j].first_name + ' ' + passenger[i][j].last_name + '\n';
                }
            }
        }

        $text += '\nPrice\n';
        for(i in passport.list_of_passport){
            if(passport.list_of_passport[i].pax_count != 0){
                $text += passport.list_of_passport[i].pax_count + ' ' + passport.list_of_passport[i].name;
                $text += ' @'+ passport.list_of_passport[i].sale_price.currency+ ' ' +getrupiah(passport.list_of_passport[i].sale_price.total_price) + '\n';
            }
        }
        try{
            if(upsell_price != 0){
                text+=`<div class="row" style="padding-bottom:15px;">`
                text+=`
                <div class="col-lg-7" style="text-align:left;">
                    <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
                </div>
                <div class="col-lg-5" style="text-align:right;">`;
                if(visa.list_of_visa[0].sale_price.currency == 'IDR')
                text+=`
                    <span style="font-size:13px; font-weight:500;">`+passport.list_of_passport[0].sale_price.currency+` `+getrupiah(upsell_price)+`</span><br/>`;
                else
                text+=`
                    <span style="font-size:13px; font-weight:500;">`+passport.list_of_passport[0].sale_price.currency+` `+upsell_price+`</span><br/>`;
                text+=`</div></div>`;
            }
        }catch(err){
            console.log(err); //kalau upsell tidak ketemu
        }
        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
            text+=`<div style="text-align:right;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
        try{
            grand_total_price = price;
            grand_total_price += upsell_price;
        }catch(err){
            console.log(err);
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
                    <h6>`+passport.list_of_passport[0].sale_price.currency+` `+getrupiah(grand_total_price)+`</h6>
                </div>
            </div>`;
        $text += '\n';
        $text += 'Grand Total: '+passport.list_of_passport[0].sale_price.currency + ' '+getrupiah(grand_total_price);
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
            <div class="row">
                <div class="col-lg-12" style="padding-bottom:15px;">
                    <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the passport price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the passport price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                }
                text +=`</div>
            </div>`;
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission,'show_commission',passport.list_of_passport[0].sale_price.currency)
            text+=`
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                    <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
               </div>
            </div>`;
//            if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//            text+=`
//            <div class="row" style="margin-top:10px; text-align:center;">
//               <div class="col-lg-12" style="padding-bottom:10px;">
//                    <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br>
//               </div>
//            </div>`;
    }else if(type == 'booking'){
        text += `<h4>Price detail</h4><hr/>
                <table style="width:100%; margin-bottom:10px;">`;
        price = 0;
        price_pax = 0;
        commission = 0;
        currency = '';

        $text = '';
        $text += 'Order Number: '+ passport.journey.name+'\n';
        $text += passport.journey.state_passport + '\n'

        $text += '\nContact Person:\n';
        $text += passport.contact.title + ' ' + passport.contact.name + '\n';
        $text += passport.contact.email + '\n';
        if(passport.contact.phone != '')
            $text += passport.contact.phone + '\n';

        for(i in passport.passengers){
            if(i == 0)
                $text += '\nPassengers\n';
            $text += passport.passengers[i].sequence + ' ' + passport.passengers[i].title + ' ' + passport.passengers[i].first_name + ' ' + passport.passengers[i].last_name + '\n';
            if(passport.passengers[i].passport_number != '')
                $text += passport.passengers[i].passport_number + ' ' + passport.passengers[i].passport_expdate + '\n';
            $text += passport.passengers[i].passport.passport_type + ' ' + passport.passengers[i].passport.apply_type + ' ' + passport.passengers[i].passport.process_type + '\n';
            $text += 'Consulate: '+ passport.passengers[i].passport.immigration_consulate + '\n';
            $text += 'Process: ' + passport.passengers[i].passport.duration + ' Days';
            if(passport.journey.in_process_date != '')
                $text += ' from '+ passport.journey.in_process_date + '\n';
            else
                $text == '\n';
            for(j in passport.passengers[i].passport.requirements){
                if(j == 0)
                    $text += '\nRequirements\n';
                $text += passport.passengers[i].passport.requirements[j].name + '\n';
            }
            try{
                if(passport.passengers[i].passport.interview.needs == true){
                    $text += '\nInterview\b'
                    for(j in passport.passengers[i].passport.interview.interview_list){
                        $text += passport.passengers[i].passport.interview.interview_list[j].location + ' ' + passport.passengers[i].passport.interview.interview_list[j].datetime + '\n';
                    }
                }
            }catch(err){
                console.log(err);
            }
            try{
                if(passport.passengers[i].passport.biometrics.needs == true){
                    $text += '\nInterview\b'
                    for(j in passport.passengers[i].passport.biometrics.biometrics_list){
                        $text += passport.passengers[i].passport.biometrics.biometrics_list[j].location + ' ' + passport.passengers[i].passport.biometrics.biometrics_list[j].datetime + '\n';
                    }
                }
            }catch(err){
                console.log(err);
            }
            price_pax = 0;
            for(j in passport.passengers[i].passport.price){
                if(passport.passengers[i].passport.price[j].charge_code == 'total'){
                    price += passport.passengers[i].passport.price[j].amount;
                    price_pax += passport.passengers[i].passport.price[j].amount;
                    currency = passport.passengers[i].passport.price[j].currency;
                }else if(passport.passengers[i].passport.price[j].charge_code == 'rac'){
                    commission += (passport.passengers[i].passport.price[j].amount) *-1;
                }else if(passport.passengers[i].passport.price[j].charge_code == 'csc'){
                    price += passport.passengers[i].passport.price[j].amount;
                    price_pax += passport.passengers[i].passport.price[j].amount;
                }
            }
            $text += 'Price '+ passport.passengers[i].passport.price[j].currency + ' ' + getrupiah(price_pax) + '\n';
            text+=`
                    <tr>
                        <td>`+passport.passengers[i].title+` `+passport.passengers[i].first_name+` `+passport.passengers[i].last_name+`</td>
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
        $text += `\nGrand total `+currency+` `+getrupiah(price);
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        if(passport.journey.state == 'booked')
            text+=`<div style="text-align:right; cursor:pointer; padding-bottom:10px;" onclick="show_repricing();"><i class="image-rounded-icon"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" style="width:auto; height:30px;" alt="Bank"/></i></div>`;

        //edit ypm passport
        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
        text+=`
        <div class="row" id="show_commission" style="display: block;">
            <div class="col-lg-12" style="text-align:center;">
                <div class="alert alert-success">
                    <div class="row">
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:bold;">YPM</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(parseInt(commission))+`</span>
                        </div>
                    </div>`;
                    if(passport.hasOwnProperty('agent_nta') == true){
                        total_nta = 0;
                        total_nta = passport.agent_nta;
                        text+=`<div class="row">
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:bold;">Agent NTA</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(total_nta)+`</span>
                        </div>
                    </div>`;
                    }
                    if(passport.hasOwnProperty('total_nta') == true){
                        total_nta = 0;
                        total_nta = passport.total_nta;
                        text+=`<div class="row">
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:bold;">HO NTA</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(total_nta)+`</span>
                        </div>
                    </div>`;
                    }
                    text+=`
                </div>
            </div>
        </div>`;
        }
        text+=`
        <div class="row" style="margin-top:10px; text-align:center;">
           <div class="col-lg-12">
                <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('review');" value="Copy">
           </div>
        </div>`;
//        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//        text+=`
//        <div class="row" style="margin-top:10px; text-align:center;">
//           <div class="col-lg-12" style="padding-bottom:10px;">
//                <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br>
//           </div>
//        </div>`;
    }
    document.getElementById('detail').innerHTML = text;
    $("#select_visa_first").hide();
}

function show_commission(val){
    var sc = '';
    var scs = '';
    if(val == 'show_commission_new'){
        sc = document.getElementById("show_commission_new");
        scs = document.getElementById("show_commission_new_button");
    }else if(val == 'show_commission'){
        var sc = document.getElementById("show_commission");
        var scs = document.getElementById("show_commission_button");
    }else{
        sc = document.getElementById("show_commission_old");
        scs = document.getElementById("show_commission_old_button");
    }
    if (sc.style.display === "none"){
        sc.style.display = "inline";
        scs.innerHTML = `<span style="float:right;">hide <i class="fas fa-eye-slash"></i></span>`;
    }
    else{
        sc.style.display = "none";
        scs.innerHTML = `<span style="float:right;">show <i class="fas fa-eye"></i></span>`;
    }
}

function copy_data(type){
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
}

function passport_check_availability(){
    error_log = '';
    provider_pick = [];
    reference_code = [];
    for(i in passport){
        if(check_number(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value) == false){
            error_log = 'Please input number in pax type '+ passport[i].name+'\n';
        }else{
            if(provider_pick.includes(passport[i]['provider']) == false && parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value) > 0){
                provider_pick.push(passport[i]['provider']);
                reference_code.push(passport[i]['id']);
            }
        }
    }
    check = 0;
    for(i in passport){
        if(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value != '' && document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value != '0'){
            check = 1;
        }
    }
    if(provider_pick.length > 1)
        error_log += 'Please choose 1 provider';
    if(check == 0){
        for(i in passport){
            document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).style['border-color'] = 'red';
        }
        alert('Please input pax')
        $('.next-loading').removeClass("running");
    }else if(error_log == ''){
        get_availability();
    }else{
        alert(error_log);
        document.getElementById('passport_btn_search').disabled = false;
        $('.next-loading').removeClass("running");
    }
}

function passport_check_search(){
    error_log = '';
    provider_pick = [];
    for(i in passport){
        if(check_number(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value) == false){
            error_log = 'Please input number in pax type '+ passport[i].pax_type[1]+'\n';
        }else{
            if(provider_pick.includes(passport[i]['provider']) == false && parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value) > 0)
                provider_pick.push(passport[i]['provider']);
        }
    }
    check = 0;
    for(i in passport){
        if(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value != '' && document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value != '0'){
            check = 1;
        }
    }
    if(provider_pick.length > 1)
        error_log += 'Please choose 1 provider';
    if(check == 0){
        for(i in passport){
            document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).style['border-color'] = 'red';
        }
        alert('Please input pax')
        $('.next-loading').removeClass("running");
    }else if(error_log == ''){
        document.getElementById('time_limit_input').value = time_limit;
        document.getElementById('passport_list').value = JSON.stringify(passport);
        document.getElementById('passport_passenger').submit();
    }else{
        alert(error_log);
        document.getElementById('passport_btn_search').disabled = false;
        $('.next-loading').removeClass("running");
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
    }if(document.getElementById('booker_title').value == ''){
        error_log+= 'Please choose booker title!</br>\n';
        $("#booker_title").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        $("#booker_title").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
        });
    }if(document.getElementById('booker_first_name').value == ''){
        error_log+= 'Please fill booker first name!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_phone_code_id').value==''){
        error_log+= 'Please choose phone number code for booker!</br>\n';
        $("#booker_phone_code_id").each(function() {
          $(this).siblings(".select2-container").css('border', '1px solid red');
        });
        document.getElementById('booker_phone').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
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
       }if(document.getElementById('adult_title'+i).value == ''){
           error_log+= 'Please choose title of adult passenger '+i+'!</br>\n';
           $("#adult_title"+i).each(function() {
               $(this).parent().find('.nice-select').css('border', '1px solid red');
           });
       }else{
           $("#adult_title"+i).each(function() {
               $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
           });
       }if(document.getElementById('adult_first_name'+i).value == ''){
           error_log+= 'Please input first name of adult passenger '+i+'!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_passport_number'+i).value != '' ||
          document.getElementById('adult_passport_expired_date'+i).value != '' ||
          document.getElementById('adult_country_of_issued'+i+'_id').value != ''){
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
           }if(document.getElementById('adult_country_of_issued'+i+'_id').value == ''){
               error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
               $("#adult_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid red');
               });
           }else{
               $("#adult_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
               });
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
       }if(document.getElementById('child_title'+i).value == ''){
           error_log+= 'Please choose title of child passenger '+i+'!</br>\n';
           $("#child_title"+i).each(function() {
               $(this).parent().find('.nice-select').css('border', '1px solid red');
           });
       }else{
           $("#child_title"+i).each(function() {
               $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
           });
       }if(document.getElementById('child_first_name'+i).value == ''){
           error_log+= 'Please input first name of child passenger '+i+'!</br>\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('child_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger child '+i+'!</br>\n';
           document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger child '+i+'!</br>\n';
           document.getElementById('child_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('child_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_passport_number'+i).value != '' ||
          document.getElementById('child_passport_expired_date'+i).value != '' ||
          document.getElementById('child_country_of_issued'+i+'_id').value != ''){
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
           }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
               error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
               $("#child_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid red');
               });
           }else{
               $("#child_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
               });
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
       }if(document.getElementById('infant_title'+i).value == ''){
           error_log+= 'Please choose title of infant passenger '+i+'!</br>\n';
           $("#infant_title"+i).each(function() {
               $(this).parent().find('.nice-select').css('border', '1px solid red');
           });
       }else{
           $("#infant_title"+i).each(function() {
               $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
           });
       }if(document.getElementById('infant_first_name'+i).value == ''){
           error_log+= 'Please input first name of infant passenger '+i+'!</br>\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_passport_number'+i).value != '' ||
          document.getElementById('infant_passport_expired_date'+i).value != '' ||
          document.getElementById('infant_country_of_issued'+i+'_id').value != ''){
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
           }if(document.getElementById('infant_country_of_issued'+i+'_id').value == ''){
               error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
               $("#infant_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid red');
               });
           }else{
               $("#infant_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
               });
           }
       }

   }
   if(error_log=='')
   {
       document.getElementById('booker_nationality_id').disabled = false;
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
            document.getElementById('adult_nationality'+i + '_id').disabled = false;
//            document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=child;i++){
            document.getElementById('child_birth_date'+i).disabled = false;
            document.getElementById('child_nationality'+i + '_id').disabled = false;
//            document.getElementById('child_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=infant;i++){
            document.getElementById('infant_birth_date'+i).disabled = false;
            document.getElementById('infant_nationality'+i + '_id').disabled = false;
//            document.getElementById('infant_passport_expired_date'+i).disabled = false;
       }
       document.getElementById('time_limit_input').value = time_limit;
       document.getElementById('visa_review').submit();
   }
   else{
       document.getElementById('show_error_log').innerHTML = error_log;
       $("#myModalErrorPassenger").modal('show');
       $('.next-loading').removeClass("running");
       $('.next-loading').prop('disabled', false);
       $('.loader-rodextrip').fadeOut();
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
        pax_required_up = document.getElementById('adult_required_up'+number);
        pax_required_down = document.getElementById('adult_required_down'+number);
        pax_check = document.getElementById('adult_check'+number);
        pax_visa = document.getElementsByName('adult_visa_type'+number);
        pax_entry = document.getElementsByName('adult_entry_type'+number);
        pax_process = document.getElementsByName('adult_process_type'+number);
        pax_price = document.getElementById('adult_price'+number);
        name = document.getElementById('adult_name'+number).innerHTML;
    }else if(pax_type == 'child'){
        pax_required = document.getElementById('child_required'+number);
        pax_required_up = document.getElementById('child_required_up'+number);
        pax_required_down = document.getElementById('child_required_down'+number);
        pax_check = document.getElementById('child_check'+number);
        pax_visa = document.getElementsByName('child_visa_type'+number);
        pax_entry = document.getElementsByName('child_entry_type'+number);
        pax_process = document.getElementsByName('child_process_type'+number);
        pax_price = document.getElementById('child_price'+number);
        name = document.getElementById('child_name'+number).innerHTML;
    }else if(pax_type == 'infant'){
        pax_required = document.getElementById('infant_required'+number);
        pax_required_up = document.getElementById('infant_required_up'+number);
        pax_required_down = document.getElementById('infant_required_down'+number);
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
            pax_required.innerHTML = 'Please select visa, entry and process!';
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
        pax_required.style.display = "block";
        pax_required_up.style.display = "block";
        pax_required_down.style.display = "none";
        //check max pax
    }else if(value == 'entry'){
        if(pax_check.value != 'false'){
            visa.list_of_visa[parseInt(pax_check.value)].total_pax++;
            pax_required.innerHTML = 'Please select visa, entry and process!';
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
        pax_required.style.display = "block";
        pax_required_up.style.display = "block";
        pax_required_down.style.display = "none";
    }else if(value == 'process'){
        if(pax_check.value != 'false'){
            visa.list_of_visa[parseInt(pax_check.value)].total_pax++;
            pax_required.innerHTML = 'Please select visa, entry and process!';
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
                visa.list_of_visa[i].type.process_type[0] == process_type &&
                visa.list_of_visa[i].pax_count != 0){
                pax_price.innerHTML = visa.list_of_visa[i].sale_price.currency + ' ' + getrupiah(visa.list_of_visa[i].sale_price.total_price.toString());
                text_requirements = '';
                text_requirements+=`<div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><h6>Document</h6><br/></div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><h6>Original</h6><br/></div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><h6>Copy</h6><br/></div>`;
                for(j in visa.list_of_visa[i].requirements){
//                    if(visa.list_of_visa[i].requirements[j].required == true){
                        if(template == 1){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">`;
                        }else if(template == 2 || template == 3){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:15px;">`;
                        }else if(template == 4 || template == 5 || template == 6){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:20px;">`;
                        }
                        text_requirements += `
                            <label class="check_box_custom" style="padding-left:unset;">
                                <span style="font-size:13px;">`+visa.list_of_visa[i].requirements[j].name+` </span>`;
                                    if(visa.list_of_visa[i].requirements[j].required == true){
                                        text_requirements +=`<span style="color:red; font-weight:500; font-size:16px;">*</span>`;
                                    }
                                text_requirements +=`
                            </label>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <label class="check_box_custom">
                                <span style="font-size:13px;"></span>
                                <input type="checkbox" id="`+pax_type+`_required`+number+`_`+j+`_original"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <label class="check_box_custom">
                                <span style="font-size:13px;"></span>
                                <input type="checkbox" id="`+pax_type+`_required`+number+`_`+j+`_copy"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                        </div>`;
//                    }
                }
                text_requirements+=`</div>`;

                pax_required.innerHTML = text_requirements;
                pax_required.style.display = "block";
                pax_required_up.style.display = "block";
                pax_required_down.style.display = "none";

                visa.list_of_visa[i].total_pax = visa.list_of_visa[i].total_pax - 1;
                pax_check.value = visa.list_of_visa[i].id;
                list_of_name = name.split(' ');
                list_of_name.shift();
                list_of_name.shift();
                list_of_name = list_of_name.join(' ');

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
                        'type':{
                            'entry': visa.list_of_visa[i].entry_type[1],
                            'type': visa.list_of_visa[i].type.process_type[1],
                            'visa': visa.list_of_visa[i].visa_type[1],
                        }
                    });
                update_table('review');
            }
        }
    }
}

function reset_value(pax_type,number){
    if(pax_type == 'adult'){
        if(document.getElementById('adult_passport'+number).value != ''){
            passport.list_of_passport[parseInt(document.getElementById('adult_check'+number).value)].total_pax++;
            document.getElementById('adult_passport'+number).value = '';
            document.getElementById('adult_check'+number).value = 'false';
            $('#adult_passport'+number).niceSelect('update');
            document.getElementById('adult_required'+number).innerHTML = 'Please select passport, entry and process!';
        }
    }
}

function set_value(pax_type,number){
    if(pax_type == 'adult'){
        if(document.getElementById('adult_check'+number).value == 'false'){
            passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].total_pax--;
        }else{
            passport.list_of_passport[parseInt(document.getElementById('adult_check'+number).value)].total_pax++;
            if(document.getElementById('adult_passport'+number).value != '')
                passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].total_pax--;
        }
        text_requirements = '';
        if(document.getElementById('adult_passport'+number).value != ''){
            document.getElementById('adult_check'+number).value = document.getElementById('adult_passport'+number).value;
            document.getElementById('adult_price'+number).innerHTML = passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].sale_price.currency + ' ' + getrupiah(passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].sale_price.total_price);
            name = document.getElementById('adult_name'+number).innerHTML;
            list_of_name = name.split(' ');
            list_of_name.shift();
            list_of_name.shift();
            list_of_name = list_of_name.join(' ');
                text_requirements+=`<div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><h6>Document</h6><br/></div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><h6>Original</h6><br/></div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><h6>Copy</h6><br/></div>`;
                for(j in passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].requirements){
//                    if(visa.list_of_visa[i].requirements[j].required == true){
                        if(template == 1){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">`;
                        }else if(template == 2 || template == 3){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:15px;">`;
                        }else if(template == 4 || template == 5 || template == 6){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:20px;">`;
                        }
                        text_requirements += `
                            <label class="check_box_custom" style="padding-left:unset;">
                                <span style="font-size:13px;">`+passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].requirements[j].name+` </span>`;
                                    if(passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].requirements[j].required == true){
                                        text_requirements +=`<span style="color:red; font-weight:500; font-size:16px;">*</span>`;
                                    }
                                text_requirements +=`
                            </label>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <label class="check_box_custom">
                                <span style="font-size:13px;"></span>
                                <input type="checkbox" id="`+pax_type+`_required`+number+`_`+j+`_original"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <label class="check_box_custom">
                                <span style="font-size:13px;"></span>
                                <input type="checkbox" id="`+pax_type+`_required`+number+`_`+j+`_copy"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                        </div>`;
//                    }
                }
                text_requirements+=`</div>`;
        }else{
            name = document.getElementById('adult_name'+number).innerHTML;
            document.getElementById('adult_check'+number).value = 'false';
            document.getElementById('adult_price'+number).innerHTML = ' -';
            list_of_name = name.split(' ');
            list_of_name.shift();
            list_of_name.shift();
            list_of_name = list_of_name.join(' ');
            for(i in list_passenger){
                if(list_passenger[i].name == list_of_name){
                    list_passenger.pop(i);
                }
            }
        }
        pax_required = document.getElementById('adult_required'+number);
        pax_required_up = document.getElementById('adult_required_up'+number);
        pax_required_down = document.getElementById('adult_required_down'+number);
        if(document.getElementById('adult_passport'+number).value != ''){
            check = 0;
            for(i in list_passenger){
                if(list_passenger[i].name == list_of_name)
                    check = 1;
            }
            if(check == 0)
                list_passenger.push({
                    'name': list_of_name,
                    'Fare': passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].sale_price.total_price,
                    'currency':passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].sale_price.currency,
                    'commission':passport.list_of_passport[parseInt(document.getElementById('adult_passport'+number).value)].sale_price.commission,
                });
        }
        if(text_requirements == '')
            text_requirements = `Please select passport type!`;
        pax_required.innerHTML = text_requirements;
        pax_required.style.display = "block";
        pax_required_up.style.display = "block";
        pax_required_down.style.display = "none";
        update_table('review');
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

function share_data(){
//    const el = document.createElement('textarea');
//    el.value = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function show_hide_required(pax_type, counter){
    var req_div = document.getElementById(pax_type+'_required'+counter);
    var req_down = document.getElementById(pax_type+'_required_down'+counter);
    var req_up = document.getElementById(pax_type+'_required_up'+counter);

    if (req_div.style.display === "none") {
        req_div.style.display = "block";
        req_up.style.display = "block";
        req_down.style.display = "none";
    }
    else{
        req_div.style.display = "none";
        req_up.style.display = "none";
        req_down.style.display = "block";
    }

}