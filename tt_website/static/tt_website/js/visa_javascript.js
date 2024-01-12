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
    consulate_box = document.getElementById('visa_consulate_id');
    consulate_box.innerHTML = '';
    try{
        var found_consulate = false
        for(i in visa_config){
            if(document.getElementById('visa_destination_id_hidden').value == i){
                for(j in visa_config[i]){
                    var node = document.createElement("option");
                    node.text = visa_config[i][j];
                    node.value = visa_config[i][j];
                    if(j == 0 && type == 'home'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_consulate_id_hidden').value = visa_config[i][j];
                        found_consulate = true;
                    }else if(type == 'search'){
                        if(visa_request['consulate'] == visa_config[i][j]){
                            node.setAttribute('selected', 'selected');
                            document.getElementById('visa_consulate_id_hidden').value = visa_config[i][j];
                            found_consulate = true
                        }
                    }
                    consulate_box.add(node);
                }
                if(!found_consulate){
                    for(j in visa_config[i]){
                        if(j == 0){
                            node.setAttribute('selected', 'selected');
                            document.getElementById('visa_consulate_id_hidden').value = visa_config[i][j];
                            found_consulate = true
                            break;
                        }
                    }
                }

            }
        }
    }catch(err){

    }
}

function set_price_visa(val){
    price = 0;
    qty = document.getElementById('qty_pax_'+val).value;
    currency = '';
    for(i in visa[val].service_charge_summary){
        for(j in visa[val].service_charge_summary[i].service_charges){
            if(!currency)
                price += visa[val].service_charge_summary[i].service_charges[j].currency
            if(visa[val].service_charge_summary[i].service_charges[j].charge_type != 'RAC')
                price += parseInt(qty) * visa[val].service_charge_summary[i].service_charges[j].amount;
        }
    }
    document.getElementById('fare'+val).innerHTML = currency + ' '+ getrupiah(price.toString());
}

function set_total_price_visa(){
    price = 0;
    for(i in visa){
        qty = document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value;
        for(j in visa[i].service_charge_summary){
            for(k in visa[i].service_charge_summary[j].service_charges){
                if(visa[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                    price += parseInt(qty) * visa[i].service_charge_summary[j].service_charges[k].amount;
            }
        }
    }
    //tinggal set html
}

function set_commission_price_visa(){
    price = 0;
    for(i in visa){
        qty = document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value;
        for(j in visa[i].service_charge_summary){
            for(k in visa[i].service_charge_summary[j].service_charges){
                if(visa[i].service_charge_summary[j].service_charges.charge_type == 'RAC')
                    price += parseInt(qty) * visa[i].service_charge_summary[j].service_charges[k].amount;
            }
        }
    }
    //tinggal set html
}

function update_table_new(type){
    text = '';
    $text = '';
    var check_price_detail = 0;
    if(type == 'search'){
        check_visa = 0;
        text += `<div style="background-color:white; padding:15px; border:1px solid #cdcdcd;">
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail `+visa_request.destination+`</h4>
            </div>
        </div>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in visa){
            if(moment(visa_request.departure) >= moment().subtract(visa[i].type.duration*-1,'days'))
                check_visa = 1;
            pax_count = parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value);
            if(isNaN(pax_count)){
                pax_count = 0;
            }

            currency = '';
            price_perpax = 0;
            for(j in visa[i].service_charge_summary){
                for(k in visa[i].service_charge_summary[j].service_charges){
                    if(visa[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                        price_perpax += visa[i].service_charge_summary[j].service_charges[k].amount;
                    if(currency == '')
                        currency = visa[i].service_charge_summary[j].service_charges[k].currency;
                }
            }

            if(pax_count != 0){
                count_price_detail[i] = 1;
                text+=`
                <div class="row">
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+pax_count+` `+visa[i].pax_type[1]+` <br/> `+visa[i].visa_type[1]+`, `+visa[i].entry_type[1]+` <br/> `+currency+` `+getrupiah(price_perpax)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+currency+` `+getrupiah(price_perpax*pax_count)+`</span>
                    </div>
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;
                count_i = count_i+1;
                $text += count_i + '. ';
                $text += 'Visa '+ country +'\n';
                $text += visa[i].pax_type[1]+ ' ' + visa[i].visa_type[1] + ' ' + visa[i].entry_type[1] + ' ' + visa[i].type.process_type[1] + ' ' + visa[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += visa[i].consulate.address + ', ' + visa[i].consulate.city + '\n\n';
                if(visa[i].notes.length != 0){
                    $text += 'Visa Requirement:\n';

                    for(j in visa[i].notes){
                        $text += visa[i].notes[j] + '\n';
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
                for(j in visa[i].service_charge_summary){
                    for(k in visa[i].service_charge_summary[j].service_charges){
                        if(visa[i].service_charge_summary[j].service_charges[k].charge_type == 'RAC')
                            commission += pax_count * (visa[i].service_charge_summary[j].service_charges[k].amount * -1);
                        else
                            price += pax_count * visa[i].service_charge_summary[j].service_charges[k].amount;
                    }
                }
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
                    <h6>Please choose your visa first!<h6>
                </div>
            </div>`;
        }
        else{
            $text += 'Price\n';
            for(i in visa){
                pax_count = parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value);
                if(isNaN(pax_count)){
                    pax_count = 0;
                }
                price_perpax = 0;
                currency = '';
                for(j in visa[i].service_charge_summary){
                    for(k in visa[i].service_charge_summary[j].service_charges){
                        if(currency == '')
                            currency = visa[i].service_charge_summary[j].service_charges[k].currency
                        if(visa[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += visa[i].service_charge_summary[j].service_charges[k].amount;
                    }
                }
                if(pax_count != 0){
                    $text += pax_count + ' ' + visa[i].pax_type[1] + ' ' + visa[i].visa_type[1] + ',' + visa[i].entry_type[1];
                    $text += ' @'+ currency + ' ' +getrupiah(price_perpax);
                    $text += '\n';
                }
            }

            text+=`
                <div class="row" style="padding-bottom:15px;">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <h6>Grand Total</h6>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <h6 id="total_price"`;
                if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                    text+= `style="cursor:pointer;"`;
                }
                text+= `>`+currency+` `+getrupiah(price);
                if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                    text += `<i class="fas fa-caret-down"></i>`;
                }
                text+=`</h6>
                    </div>
                </div>`;
            if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && price){
                if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                    for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                        try{
                            if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                price_convert = (price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                if(price_convert%1 == 0)
                                    price_convert = parseInt(price_convert);
                                text+=`
                                    <div class="row" style="margin-bottom:15px;">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                            <h6> Estimated `+k+` `+price_convert+`</h6>
                                        </div>
                                    </div>`;
                            }
                        }catch(err){
                            console.log(err);
                        }
                    }
                }
            }
            $text += '\n';
            $text += 'Grand Total: '+currency + ' '+getrupiah(price);
            try{
                display = document.getElementById('show_commission').style.display;
            }catch(err){
                display = 'none';
            }
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission,'show_commission', currency)
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
                            <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                    } else {
                        text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                            <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
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
                if(agent_security.includes('book_reservation') == true && check_visa == 1 && user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                    text+=
                `<div class="row" style="margin-top:10px; text-align:center;">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <button id="visa_btn_search" class="primary-btn-ticket next-loading ld-ext-right" style="width:100%;" onclick="show_loading();visa_check_availability();" type="button" value="Next">
                            Get Price
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>
                </div>`;
                }
            text+=`</div>`;
            if(check_visa == 0){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "You can't buy this visa for your departure date!",
                })
            }
        }
    }
    else if(type == 'passenger'){
        text += `
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail `+visa_request.destination+`</h4>
            </div>
        </div>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in sell_visa.search_data){
            if(sell_visa.search_data[i].pax != 0){
                currency = '';
                price_perpax = 0;
                for(j in sell_visa.search_data[i].service_charge_summary){
                    for(k in sell_visa.search_data[i].service_charge_summary[j].service_charges){
                        if(sell_visa.search_data[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += sell_visa.search_data[i].service_charge_summary[j].service_charges[k].total / sell_visa.search_data[i].pax;
                        if(currency == '')
                            currency = sell_visa.search_data[i].service_charge_summary[j].service_charges[k].currency;
                    }
                }
                count_price_detail[i] = 1;
                text+=`
                <div class="row">
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+sell_visa.search_data[i].pax+` `;
                        if(sell_visa.search_data[i].pax_type == 'ADT'){
                            text+=`Adult`;
                        }else if(sell_visa.search_data[i].pax_type == 'CHD'){
                            text+=`Child`;
                        }else if(sell_visa.search_data[i].pax_type == 'INF'){
                            text+=`Infant`;
                        }

                        text+=`<br/> `+sell_visa.search_data[i].visa_type+`, `+sell_visa.search_data[i].entry_type+` <br/> `+currency+` `+getrupiah(price_perpax)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+currency+` `+getrupiah(price_perpax * sell_visa.search_data[i].pax)+`</span>
                    </div>
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;

                count_i = count_i+1;
                $text += count_i + '. ';
                $text += 'Visa '+ visa_request.destination +'\n';
                $text += sell_visa.search_data[i].pax_type+ ' ' + sell_visa.search_data[i].visa_type + ' ' + sell_visa.search_data[i].entry_type + ' ' + sell_visa.search_data[i].type.process_type + ' ' + sell_visa.search_data[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += sell_visa.search_data[i].consulate.address + ', ' + sell_visa.search_data[i].consulate.city + '\n\n';
                if(sell_visa.search_data[i].notes.length != 0){
                    $text += 'Visa Requirement:\n';

                    for(j in sell_visa.search_data[i].notes){
                        $text += sell_visa.search_data[i].notes[j] + '\n';
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
                price += sell_visa.search_data[i].pax * price_perpax;
                for(j in sell_visa.search_data[i].service_charge_summary){
                    for(k in sell_visa.search_data[i].service_charge_summary[j].service_charges){
                        if(sell_visa.search_data[i].service_charge_summary[j].service_charges[k].charge_type == 'RAC')
                            commission += sell_visa.search_data[i].service_charge_summary[j].service_charges[k].total;
                    }
                }
            }catch(err){

            }
        }

        $text += 'Price\n';
        for(i in sell_visa.search_data){
            $text += sell_visa.search_data[i].pax + ' ' + sell_visa.search_data[i].pax_type;
            $text += ' @'+ currency+ ' ' +getrupiah(price_perpax) + '\n';
        }

        text+=`
            <div class="row" style="padding-bottom:15px;">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                    <h6>Grand Total</h6>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                    <h6 id="total_price"`;
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        text+= `style="cursor:pointer;"`;
                    }
                    text+= `>`+currency+` `+getrupiah(price);
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        text += `<i class="fas fa-caret-down"></i>`;
                    }
                    text+=`
                    </h6>
                </div>
            </div>`;
        if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && price){
            if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                    try{
                        if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                            price_convert = (price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                            if(price_convert%1 == 0)
                                price_convert = parseInt(price_convert);
                            text+=`
                                <div class="row" style="margin-bottom:15px;">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                        <h6> Estimated `+k+` `+price_convert+`</h6>
                                    </div>
                                </div>`;
                        }
                    }catch(err){
                        console.log(err);
                    }
                }
            }
        }
        $text += '\n';
        $text += 'Grand Total: '+currency + ' '+getrupiah(price);
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
                        <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                }
                text +=`</div>
            </div>`;
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission*-1,'show_commission', currency)
            text+=`
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                    <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
               </div>
            </div>`;
//            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                text+=`
//                <div class="row" style="margin-top:10px; text-align:center;">
//                   <div class="col-lg-12" style="padding-bottom:10px;">
//                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br>
//                   </div>
//                </div>`;
    }
    else if(type == 'review'){
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
                        if(price_arr_repricing.hasOwnProperty(passenger[i][j].pax_type) == false){
                            price_arr_repricing[passenger[i][j].pax_type] = {}
                            pax_type_repricing.push([passenger[i][j].pax_type, passenger[i][j].pax_type]);
                        }
                        price_arr_repricing[passenger[i][j].pax_type][passenger[i][j].first_name +passenger[i][j].last_name] = {
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
                for(l in price_arr_repricing[k]){
                    text_repricing += `
                    <div class="col-lg-12">
                        <div style="padding:5px;" class="row" id="adult">
                            <div class="col-lg-6" id="`+j+`_`+k+`">`+l+`</div>
                            <div hidden id="`+l+`_price">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                            if(price_arr_repricing[k][l].Repricing == 0)
                                text_repricing+=`<div class="col-lg-6" id="`+l+`_repricing">-</div>`;
                            else
                                text_repricing+=`<div class="col-lg-6" id="`+l+`_repricing">`+getrupiah(price_arr_repricing[k][l].Repricing)+`</div>`;
                            text_repricing+=`<div hidden id="`+l+`_total">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                        </div>
                    </div>`;
                }
            }
            text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
            document.getElementById('repricing_div').innerHTML = text_repricing;
            //repricing
        }
        text += `
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail `+visa_request.destination+`</h4>
            </div>
        </div>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in sell_visa.search_data){
            if(sell_visa.search_data[i].pax_count != 0){
                count_price_detail[i] = 1;
                currency = '';
                price_perpax = 0;
                for(j in sell_visa.search_data[i].service_charge_summary){
                    for(k in sell_visa.search_data[i].service_charge_summary[j].service_charges){
                        if(sell_visa.search_data[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += sell_visa.search_data[i].service_charge_summary[j].service_charges[k].total / sell_visa.search_data[i].pax;
                        if(currency == '')
                            currency = sell_visa.search_data[i].service_charge_summary[j].service_charges[k].currency;
                    }
                }
                text+=`
                <div class="row">`;
                if(typeof upsell_price_dict !== 'undefined' && upsell_price_dict.hasOwnProperty(sell_visa.search_data[i].pax_type)){ //with upsell
                    text+=`
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+sell_visa.search_data[i].pax_count+` `+sell_visa.search_data[i].pax_type+` <br/> `+sell_visa.search_data[i].visa_type[1]+`, `+sell_visa.search_data[i].entry_type+` <br/> `+currency+` `+getrupiah((price_perpax + upsell_price_dict[sell_visa.search_data[i].pax_type]))+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+currency+` `+getrupiah((price_perpax + upsell_price_dict[sell_visa.search_data[i].pax_type])*sell_visa.search_data[i].pax)+`</span>
                    </div>`;
                    commission += upsell_price_dict[sell_visa.search_data[i].pax_type]
                }else{
                    text+=`
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+sell_visa.search_data[i].pax_count+` `+sell_visa.search_data[i].pax_type+` <br/> `+sell_visa.search_data[i].visa_type+`, `+sell_visa.search_data[i].entry_type+` <br/> `+currency+` `+getrupiah(price_perpax)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+currency+` `+getrupiah(price_perpax*sell_visa.search_data[i].pax_count)+`</span>
                    </div>`;
                }
                text+=`
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;

//                text+=`
//                <tr>
//                    <td>`+visa.list_of_visa[i].pax_count+` `+visa.list_of_visa[i].pax_type[1]+` <br/> `+visa.list_of_visa[i].visa_type[1]+`, `+visa.list_of_visa[i].entry_type[1]+`</td>
//                    <td>x</td>
//                    <td>`+currency+` `+getrupiah(price_perpax)+`</td>
//                    <td style="text-align:right;">`+currency+` `+getrupiah(price_perpax*visa.list_of_visa[i].pax_count)+`</td>
//                </tr>`;

                count_i = count_i+1;
                $text += count_i + '. ';
                $text += 'Visa '+ visa_request.destination +'\n';
                $text += sell_visa.search_data[i].pax_type+ ' ' + sell_visa.search_data[i].visa_type + ' ' + sell_visa.search_data[i].entry_type + ' ' + sell_visa.search_data[i].type.process_type + ' ' + sell_visa.search_data[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += sell_visa.search_data[i].consulate.address + ', ' + sell_visa.search_data[i].consulate.city + '\n\n';

                if(sell_visa.search_data[i].notes.length != 0){
                    $text += 'Visa Requirement:\n';

                    for(j in sell_visa.search_data[i].notes){
                        $text += sell_visa.search_data[i].notes[j] + '\n';
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
                price += price_perpax * sell_visa.search_data[i].pax_count;
                for(j in sell_visa.search_data[i].service_charge_summary){
                    for(k in sell_visa.search_data[i].service_charge_summary[j].service_charges){
                        if(sell_visa.search_data[i].service_charge_summary[j].service_charges[k].charge_type == 'RAC')
                            commission += (sell_visa.search_data[i].service_charge_summary[j].service_charges[k].total * -1);
                    }
                }
            }catch(err){

            }
        }
        $text += 'Booker:\n';
        $text += passenger.booker.title + ' ' + passenger.booker.first_name + ' ' + passenger.booker.last_name + '\n';
        $text += passenger.booker.email + '\n';
        $text += passenger.booker.mobile + '\n\n';

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
        for(i in sell_visa.search_data){
            if(sell_visa.search_data[i].pax_count != 0){
                currency = '';
                price_perpax = 0;
                for(j in sell_visa.search_data[i].service_charge_summary){
                    for(k in sell_visa.search_data[i].service_charge_summary[j].service_charges){
                        if(sell_visa.search_data[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += sell_visa.search_data[i].service_charge_summary[j].service_charges[k].amount;
                        if(currency == '')
                            currency = sell_visa.search_data[i].service_charge_summary[j].service_charges[k].currency;
                    }
                }
                if(typeof upsell_price_dict !== 'undefined' && upsell_price_dict.hasOwnProperty(sell_visa.search_data[i].pax_type)){ //with upsell
                    $text += sell_visa.search_data[i].pax_count + ' ' + sell_visa.search_data[i].pax_type;
                    $text += ' @'+ currency+ ' ' +getrupiah(price_perpax + (upsell_price_dict[sell_visa.search_data[i].pax_type]/sell_visa.search_data[i].pax)) + '\n';
                }else{
                    $text += sell_visa.search_data[i].pax_count + ' ' + sell_visa.search_data[i].pax_type;
                    $text += ' @'+ currency+ ' ' +getrupiah(price_perpax) + '\n';
                }
            }
        }
        //pindah upsell ke pax
//        try{
//            if(upsell_price != 0){
//                text+=`<div class="row" style="padding-bottom:15px;">`
//                text+=`
//                <div class="col-lg-7" style="text-align:left;">
//                    <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
//                </div>
//                <div class="col-lg-5" style="text-align:right;">`;
//                if(currency == 'IDR')
//                text+=`
//                    <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(upsell_price)+`</span><br/>`;
//                else
//                text+=`
//                    <span style="font-size:13px; font-weight:500;">`+currency+` `+upsell_price+`</span><br/>`;
//                text+=`</div></div>`;
//            }
//        }catch(err){
//            console.log(err) //ada element yg tidak ada
//        }
        try{
            grand_total_price = price;
            for(i in upsell_price_dict)
                grand_total_price += upsell_price_dict[i];
        }catch(err){
            console.log(err) //ada element yg tidak ada
        }
        text+=`
        <div class="row" style="padding-bottom:15px;">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                <h6>Grand Total</h6>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                <h6 id="total_price"`;
            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                text+= `style="cursor:pointer;"`;
            }
            text+= `>`+currency+` `+getrupiah(grand_total_price);
            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                text += `<i class="fas fa-caret-down"></i>`;
            }
        text+=`</h6>
            </div>
        </div>`;
        if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && grand_total_price){
            if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                    try{
                        if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                            price_convert = (grand_total_price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                            if(price_convert%1 == 0)
                                price_convert = parseInt(price_convert);
                            text+=`
                                <div class="row" style="margin-bottom:15px;">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                        <h6> Estimated `+k+` `+price_convert+`</h6>
                                    </div>
                                </div>`;
                        }
                    }catch(err){
                        console.log(err);
                    }
                }
            }
        }
        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
            text+=`<div style="text-align:right;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;

        $text += '\n';
        $text += 'Grand Total: '+currency + ' '+getrupiah(grand_total_price);
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
                        <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                }
                text +=`</div>
            </div>`;
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission,'show_commission', currency)

            text+=`
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                    <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
               </div>
            </div>`;
//            if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                text+=`
//                <div class="row" style="margin-top:10px; text-align:center;">
//                   <div class="col-lg-12" style="padding-bottom:10px;">
//                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br>
//                   </div>
//                </div>`;
    }
    else if(type == 'booking'){
        price = 0;
        price_pax = 0;
        commission = 0;
        disc = 0;
        csc = 0;
        currency = '';

        $text = '';
        $text += 'Order Number: '+ visa.journey.name+'\n';
        $text += visa.journey.country + ' ' + visa.journey.departure_date + ' ' + visa.journey.state_visa + '\n';
        $text += visa.journey.state_visa + '\n'

        $text += '\nContact Person:\n';
        $text += visa.contact.title + ' ' + visa.contact.name + '\n';
        $text += visa.contact.email + '\n';
        if(visa.contact.phone != '')
            $text += visa.contact.phone + '\n';

        text = '';
        tax = 0;
        fare = 0;
        total_price = 0;
        commission = 0;
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'CSC'];
        text_detail=`
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail</h4>
            </div>
        </div>`;

        //repricing
        type_amount_repricing = ['Repricing'];
        //repricing
        counter_service_charge = 0;
        disc = 0;

        total_price_provider = [];
        $text += '\nPrice:\n';
        for(i in visa.provider_bookings){
            try{
                csc = 0;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || visa.state == 'issued')
                    text_detail+=`
                        <div style="text-align:left">
                            <span style="font-weight:500; font-size:14px;">PNR: `+visa.provider_bookings[i].pnr+` </span>
                        </div>`;
                for(j in visa.passengers){
                    price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                    for(k in visa.passengers[j].sale_service_charges[visa.provider_bookings[i].pnr]){
                        price[k] += visa.passengers[j].sale_service_charges[visa.provider_bookings[i].pnr][k].amount;
                        if(price['currency'] == '')
                            price['currency'] = visa.passengers[j].sale_service_charges[visa.provider_bookings[i].pnr][k].currency;
                    }
                    disc -= price['DISC'];
                    try{
                        if(visa.passengers[j].channel_service_charges.hasOwnProperty('amount')){
//                            price['CSC'] = visa.passengers[j].channel_service_charges.amount;
                            csc += visa.passengers[j].channel_service_charges.amount;
                        }
                    }catch(err){
                        console.log(err) //ada element yg tidak ada
                    }
                    //repricing
                    check = 0;
                    if(price_arr_repricing.hasOwnProperty(visa.passengers[j].pax_type) == false){
                        price_arr_repricing[visa.passengers[j].pax_type] = {}
                        pax_type_repricing.push([visa.passengers[j].pax_type, visa.passengers[j].pax_type]);
                    }
                    price_arr_repricing[visa.passengers[j].pax_type][visa.passengers[j].name] = {
                        'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                        'Tax': price['TAX'] + price['ROC'] - csc,
                        'Repricing': csc
                    }
                    text_repricing = `
                    <div class="col-lg-12">
                        <div style="padding:5px;" class="row">
                            <div class="col-lg-3"></div>
                            <div class="col-lg-3">Price</div>
                            <div class="col-lg-3">Repricing</div>
                            <div class="col-lg-3">Total</div>
                        </div>
                    </div>`;
                    for(k in price_arr_repricing){
                        for(l in price_arr_repricing[k]){
                            text_repricing += `
                            <div class="col-lg-12">
                                <div style="padding:5px;" class="row" id="adult">
                                    <div class="col-lg-3" id="`+l+`_`+k+`">`+l+`</div>
                                    <div class="col-lg-3" id="`+l+`_price">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                                    if(price_arr_repricing[k][l].Repricing == 0)
                                        text_repricing+=`<div class="col-lg-3" id="`+l+`_repricing">-</div>`;
                                    else
                                        text_repricing+=`<div class="col-lg-3" id="`+l+`_repricing">`+getrupiah(price_arr_repricing[k][l].Repricing)+`</div>`;
                                    text_repricing+=`<div class="col-lg-3" id="`+l+`_total">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                                </div>
                            </div>`;
                        }
                    }
                    text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                    document.getElementById('repricing_div').innerHTML = text_repricing;
                    //repricing

                    text_detail+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">`+visa.passengers[j].name+`</span>`;
                        text_detail+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                            <span style="font-size:13px;`;
                            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                                text_detail+=`cursor:pointer;" id="passenger_breakdown`+j+`"`;
                            }else{
                                text_detail+=`"`;
                            }
                        if(counter_service_charge == 0)
                            text_detail+=`
                            >`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT + price.CSC));
                        else
                            text_detail+=`
                            >`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT));
                        if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                            text_detail+=`<i class="fas fa-caret-down"></i>`;
                        text_detail += `</span>`;
                        text_detail+=`
                        </div>
                    </div>`;
                    $text += visa.passengers[j].title +' '+ visa.passengers[j].name + ' ['+visa.provider_bookings[i].pnr+'] ';


                    if(counter_service_charge == 0){ // with upsell
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                        $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                    }else{
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                        $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.DISC))+'\n';
                    }
                    commission += parseInt(price.RAC);
                    total_price_provider.push({
                        'pnr': visa.provider_bookings[i].pnr,
                        'provider': visa.provider_bookings[i].provider,
                        'price': JSON.parse(JSON.stringify(price))
                    });
                }
                // digabung ke pax
//                if(csc != 0){
//                    text_detail+=`
//                        <div class="row" style="margin-bottom:5px;">
//                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                <span style="font-size:12px;">Other service charges</span>`;
//                            text_detail+=`</div>
//                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(csc))+`</span>
//                            </div>
//                        </div>`;
//                }
                counter_service_charge++;
            }catch(err){console.log(err);}
        }
        try{
            $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
            if(visa.state == 'booked')
            $text += '\n\nPrices and availability may change at any time';
            if(disc != 0){
                text_detail+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">Discount</span>`;
                        text_detail+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                            <span style="font-size:13px;">`+price.currency+` -`+getrupiah(parseInt(disc))+`</span>
                        </div>
                    </div>`;
            }
            text_detail+=`
            <div>
                <hr/>
            </div>
            <div class="row" style="margin-bottom:10px;">
                <div class="col-lg-6 col-xs-6" style="text-align:left;">
                    <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                </div>
                <div class="col-lg-6 col-xs-6" style="text-align:right;">
                    <span id="total_price" style="font-size:13px; font-weight: bold;`;
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        text_detail+='cursor:pointer;';
                    text_detail +=`">`;
                    try{
                        text_detail+= price.currency+` `+getrupiah(total_price);
                    }catch(err){

                    }
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        text_detail+=`<i class="fas fa-caret-down"></i>`;
                    text_detail+= `</span>
                </div>
            </div>`;

            if(['booked', 'partial_booked', 'partial_issued', 'halt_booked', 'issued'].includes(visa.state)){
                if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price){
                    if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                        for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                            try{
                                if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == price.currency){
                                    price_convert = (total_price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                    if(price_convert%1 == 0)
                                        price_convert = parseInt(price_convert);
                                    text_detail+=`
                                        <div class="row" style="margin-bottom:10px;">
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                                <h6> Estimated `+k+` `+price_convert+`</h6>
                                            </div>
                                        </div>`;
                                }
                            }catch(err){
                                console.log(err);
                            }
                        }
                    }
                }
            }

            if(visa.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
            }
            text_detail+=`<div class="row">
            <div class="col-lg-12" style="padding-bottom:10px;">
                <hr/>
                <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text_detail+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                } else {
                    text_detail+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                }

            text_detail+=`
                </div>
            </div>`;

            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false && user_login.co_agent_frontend_security.includes('see_commission')){
                text_detail+=`
                <div class="alert alert-success" style="margin-top:10px;">
                    <div style="color:black; font-weight:bold; cursor:pointer; font-size:15px; text-align:left; width:100%;" onclick="show_commission('show_commission');">
                        <span>YPM </span>
                        <span id="show_commission_button">`;
                            text_detail+=`<span style="float:right;">show <i class="fas fa-eye"></i></span>`;
                        text_detail+=`
                        </span>`;

                        text_detail+=`<span id="show_commission" style="display:none;">`;

                        text_detail+=`<span style="font-size:14px; font-weight: bold; color:`+color+`;"> `+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span><br/>`;

                        if(visa.hasOwnProperty('agent_nta') == true){
                            total_nta = 0;
                            total_nta = visa.agent_nta;
                            text_detail+=`
                            <span style="font-size:14px; font-weight:bold;">Agent NTA: </span>
                            <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(total_nta)+`</span><br/>`;
                        }
                        if(visa.hasOwnProperty('total_nta') == true){
                            total_nta = 0;
                            total_nta = msg.result.response.total_nta;
                            text_detail+=`
                            <span style="font-size:14px; font-weight:bold;">HO NTA: </span>
                            <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(total_nta)+`</span><br/>`;
                        }
                        text_detail+=`
                        </span>
                    </div>
                </div>`;
            }

            text_detail+=`<center>

            <div style="padding-bottom:10px;">
                <center>
                    <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                </center>
            </div>`;
//            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                text_detail+=`
//                <div style="margin-bottom:5px;">
//                    <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show YPM"/>
//                </div>`;
            text_detail+=`
        </div>`;
        }catch(err){
            console.log(err);
        }
        try{
            testing_price = price.currency;
            text += text_detail;
        }catch(err){

        }
        add_repricing();
    }
    document.getElementById('detail').innerHTML = text;

    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
        var price_breakdown = {};
        var currency_breakdown = '';
        if(type == 'search'){
            for(i in visa){
                pax_count = parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value);
                for(j in visa[i].service_charge_summary){
                    if(!price_breakdown.hasOwnProperty('FARE'))
                        price_breakdown['FARE'] = 0;
                    if(!price_breakdown.hasOwnProperty('TAX'))
                        price_breakdown['TAX'] = 0;
                    price_breakdown['FARE'] += visa[i].service_charge_summary[j].base_fare * pax_count;
                    price_breakdown['TAX'] += visa[i].service_charge_summary[j].base_tax * pax_count;
                    if(currency_breakdown == ''){
                        for(k in visa[i].service_charge_summary[j].service_charges){
                            currency_breakdown = visa[i].service_charge_summary[j].service_charges[k].currency;
                        }
                    }
                }
            }
        }else if(['passenger','review'].includes(type)){
            for(i in sell_visa.search_data){
                if(sell_visa.search_data[i].pax != 0){
                    for(j in sell_visa.search_data[i].service_charge_summary){
                        if(!price_breakdown.hasOwnProperty('FARE'))
                            price_breakdown['FARE'] = 0;
                        if(!price_breakdown.hasOwnProperty('TAX'))
                            price_breakdown['TAX'] = 0;
                        if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                            price_breakdown['BREAKDOWN'] = 0;
                        if(!price_breakdown.hasOwnProperty('UPSELL'))
                            price_breakdown['UPSELL'] = 0;
                        if(!price_breakdown.hasOwnProperty('COMMISSION'))
                            price_breakdown['COMMISSION'] = 0;
                        if(!price_breakdown.hasOwnProperty('NTA VISA'))
                            price_breakdown['NTA VISA'] = 0;
                        if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                            price_breakdown['SERVICE FEE'] = 0;
                        if(!price_breakdown.hasOwnProperty('VAT'))
                            price_breakdown['VAT'] = 0;
                        if(!price_breakdown.hasOwnProperty('OTT'))
                            price_breakdown['OTT'] = 0;
                        if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                            price_breakdown['TOTAL PRICE'] = 0;
                        if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                            price_breakdown['NTA AGENT'] = 0;
                        if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                            price_breakdown['COMMISSION HO'] = 0;
                        price_breakdown['FARE'] += sell_visa.search_data[i].service_charge_summary[j].base_fare;
                        price_breakdown['TAX'] += sell_visa.search_data[i].service_charge_summary[j].base_tax;
                        price_breakdown['BREAKDOWN'] = 0;
                        price_breakdown['UPSELL'] += sell_visa.search_data[i].service_charge_summary[j].base_upsell;
                        if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                            price_breakdown['COMMISSION'] += (sell_visa.search_data[i].service_charge_summary[j].base_commission_vendor * -1);
                        price_breakdown['NTA VISA'] += sell_visa.search_data[i].service_charge_summary[j].base_nta_vendor;
                        price_breakdown['SERVICE FEE'] += sell_visa.search_data[i].service_charge_summary[j].base_fee_ho;
                        price_breakdown['VAT'] += sell_visa.search_data[i].service_charge_summary[j].base_vat_ho;
                        price_breakdown['OTT'] += sell_visa.search_data[i].service_charge_summary[j].base_price_ott;
                        price_breakdown['TOTAL PRICE'] += sell_visa.search_data[i].service_charge_summary[j].base_price;
                        price_breakdown['NTA AGENT'] += sell_visa.search_data[i].service_charge_summary[j].base_nta;
                        if(user_login.co_agent_frontend_security.includes('agent_ho'))
                            price_breakdown['COMMISSION HO'] += sell_visa.search_data[i].service_charge_summary[j].base_commission_ho * -1;
                        if(currency_breakdown == ''){
                            for(k in sell_visa.search_data[i].service_charge_summary[j].service_charges){
                                currency_breakdown = sell_visa.search_data[i].service_charge_summary[j].service_charges[k].currency;
                            }
                        }
                    }
                }
            }
        }else if(type == 'booking'){
            for(i in visa_get_detail.result.response.passengers){
                var price_breakdown = {};
                for(j in visa_get_detail.result.response.passengers[i].service_charge_details){
                    if(!price_breakdown.hasOwnProperty('FARE'))
                        price_breakdown['FARE'] = 0;
                    if(!price_breakdown.hasOwnProperty('TAX'))
                        price_breakdown['TAX'] = 0;
                    if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                        price_breakdown['BREAKDOWN'] = 0;
                    if(!price_breakdown.hasOwnProperty('UPSELL'))
                        price_breakdown['UPSELL'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION'))
                        price_breakdown['COMMISSION'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA VISA'))
                        price_breakdown['NTA VISA'] = 0;
                    if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                        price_breakdown['SERVICE FEE'] = 0;
                    if(!price_breakdown.hasOwnProperty('VAT'))
                        price_breakdown['VAT'] = 0;
                    if(!price_breakdown.hasOwnProperty('OTT'))
                        price_breakdown['OTT'] = 0;
                    if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                        price_breakdown['TOTAL PRICE'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                        price_breakdown['NTA AGENT'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] = 0;
                    if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                        price_breakdown['CHANNEL UPSELL'] = 0;

                    price_breakdown['FARE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_fare;
                    price_breakdown['TAX'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_tax;
                    price_breakdown['BREAKDOWN'] = 0;
                    price_breakdown['UPSELL'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_upsell;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        price_breakdown['COMMISSION'] += (visa_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                    price_breakdown['NTA VISA'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                    price_breakdown['SERVICE FEE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                    price_breakdown['VAT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                    price_breakdown['OTT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_price_ott;
                    price_breakdown['TOTAL PRICE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_price;
                    price_breakdown['NTA AGENT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_nta;
                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                    for(k in visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges){
                        if(k == 'ROC'){
                            for(l in visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                if(visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                    price_breakdown['CHANNEL UPSELL'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                var breakdown_text = '';
                for(j in price_breakdown){
                    if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                        if(breakdown_text)
                            breakdown_text += '<br/>';
                        breakdown_text += '<b>'+j+'</b> ';
                        breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
                    }else if(j == 'BREAKDOWN'){
                        if(breakdown_text)
                            breakdown_text += '<br/>';
                        breakdown_text += '<b>'+j+'</b> ';
                    }
                }
                new jBox('Tooltip', {
                    attach: '#passenger_breakdown'+i,
                    target: '#passenger_breakdown'+i,
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
                    content: breakdown_text
                });
                price_breakdown = {};
                breakdown_text = '';
                currency_breakdown = '';
            }
            for(i in visa_get_detail.result.response.passengers){
                var price_breakdown = {};
                for(j in visa_get_detail.result.response.passengers[i].service_charge_details){
                    if(!price_breakdown.hasOwnProperty('FARE'))
                        price_breakdown['FARE'] = 0;
                    if(!price_breakdown.hasOwnProperty('TAX'))
                        price_breakdown['TAX'] = 0;
                    if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                        price_breakdown['BREAKDOWN'] = 0;
                    if(!price_breakdown.hasOwnProperty('UPSELL'))
                        price_breakdown['UPSELL'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION'))
                        price_breakdown['COMMISSION'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA VISA'))
                        price_breakdown['NTA VISA'] = 0;
                    if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                        price_breakdown['SERVICE FEE'] = 0;
                    if(!price_breakdown.hasOwnProperty('VAT'))
                        price_breakdown['VAT'] = 0;
                    if(!price_breakdown.hasOwnProperty('OTT'))
                        price_breakdown['OTT'] = 0;
                    if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                        price_breakdown['TOTAL PRICE'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                        price_breakdown['NTA AGENT'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] = 0;
                    if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                        price_breakdown['CHANNEL UPSELL'] = 0;

                    price_breakdown['FARE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_fare;
                    price_breakdown['TAX'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_tax;
                    price_breakdown['BREAKDOWN'] = 0;
                    price_breakdown['UPSELL'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_upsell;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        price_breakdown['COMMISSION'] += (visa_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                    price_breakdown['NTA VISA'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                    price_breakdown['SERVICE FEE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                    price_breakdown['VAT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                    price_breakdown['OTT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_price_ott;
                    price_breakdown['TOTAL PRICE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_price;
                    price_breakdown['NTA AGENT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_nta;
                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                    for(k in visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges){
                        if(k == 'ROC'){
                            for(l in visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                if(visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                    price_breakdown['CHANNEL UPSELL'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                var breakdown_text = '';
                for(j in price_breakdown){
                    if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                        if(breakdown_text)
                            breakdown_text += '<br/>';
                        breakdown_text += '<b>'+j+'</b> ';
                        breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
                    }else if(j == 'BREAKDOWN'){
                        if(breakdown_text)
                            breakdown_text += '<br/>';
                        breakdown_text += '<b>'+j+'</b> ';
                    }
                }
                new jBox('Tooltip', {
                    attach: '#passenger_breakdown'+i,
                    target: '#passenger_breakdown'+i,
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
                    content: breakdown_text
                });
                price_breakdown = {};
                breakdown_text = '';
                currency_breakdown = '';
            }

            for(i in visa_get_detail.result.response.passengers){
                for(j in visa_get_detail.result.response.passengers[i].service_charge_details){
                    if(!price_breakdown.hasOwnProperty('FARE'))
                        price_breakdown['FARE'] = 0;
                    if(!price_breakdown.hasOwnProperty('TAX'))
                        price_breakdown['TAX'] = 0;
                    if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                        price_breakdown['BREAKDOWN'] = 0;
                    if(!price_breakdown.hasOwnProperty('UPSELL'))
                        price_breakdown['UPSELL'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION'))
                        price_breakdown['COMMISSION'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA VISA'))
                        price_breakdown['NTA VISA'] = 0;
                    if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                        price_breakdown['SERVICE FEE'] = 0;
                    if(!price_breakdown.hasOwnProperty('VAT'))
                        price_breakdown['VAT'] = 0;
                    if(!price_breakdown.hasOwnProperty('OTT'))
                        price_breakdown['OTT'] = 0;
                    if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                        price_breakdown['TOTAL PRICE'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                        price_breakdown['NTA AGENT'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] = 0;
                    if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                        price_breakdown['CHANNEL UPSELL'] = 0;

                    price_breakdown['FARE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_fare;
                    price_breakdown['TAX'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_tax;
                    price_breakdown['BREAKDOWN'] = 0;
                    price_breakdown['UPSELL'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_upsell;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        price_breakdown['COMMISSION'] += (visa_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                    price_breakdown['NTA VISA'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                    price_breakdown['SERVICE FEE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                    price_breakdown['VAT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                    price_breakdown['OTT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_price_ott;
                    price_breakdown['TOTAL PRICE'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_price;
                    price_breakdown['NTA AGENT'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_nta;
                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                    for(k in visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges){
                        if(k == 'ROC'){
                            for(l in visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                if(visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                    price_breakdown['CHANNEL UPSELL'] += visa_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                var breakdown_text = '';
                for(j in price_breakdown){
                    if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                        if(breakdown_text)
                            breakdown_text += '<br/>';
                        breakdown_text += '<b>'+j+'</b> ';
                        breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
                    }else if(j == 'BREAKDOWN'){
                        if(breakdown_text)
                            breakdown_text += '<br/>';
                        breakdown_text += '<b>'+j+'</b> ';
                    }
                }
            }

        }
        if(typeof upsell_price_dict !== 'undefined'){
            for(i in upsell_price_dict){
                if(!price_breakdown.hasOwnProperty('ROC'))
                    price_breakdown['ROC'] = 0;
                price_breakdown['ROC'] += upsell_price_dict[i];
            }
        }

        var breakdown_text = '';
        for(j in price_breakdown){
            if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                if(breakdown_text)
                    breakdown_text += '<br/>';
                breakdown_text += '<b>'+j+'</b> ';
                breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
            }else if(j == 'BREAKDOWN'){
                if(breakdown_text)
                    breakdown_text += '<br/>';
                breakdown_text += '<b>'+j+'</b> ';
            }
        }
        new jBox('Tooltip', {
            attach: '#total_price',
            target: '#total_price',
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
            content: breakdown_text
        });
    }
    $("#select_visa_first").hide();
}

function update_table(type){
    text = '';
    $text = '';
    var check_price_detail = 0;
    if(type == 'search'){
        check_visa = 0;
        text += `<div style="background-color:white; padding:15px; border:1px solid #cdcdcd;">
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail `+visa_request.destination+`</h4>
            </div>
        </div>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in visa){
            if(moment(visa_request.departure) >= moment().subtract(visa[i].type.duration*-1,'days'))
                check_visa = 1;
            pax_count = parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value);
            if(isNaN(pax_count)){
                pax_count = 0;
            }

            currency = '';
            price_perpax = 0;
            for(j in visa[i].service_charge_summary){
                for(k in visa[i].service_charge_summary[j].service_charges){
                    if(visa[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                        price_perpax += visa[i].service_charge_summary[j].service_charges[k].amount;
                    if(currency == '')
                        currency = visa[i].service_charge_summary[j].service_charges[k].currency;
                }
            }

            if(pax_count != 0){
                count_price_detail[i] = 1;
                text+=`
                <div class="row">
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+pax_count+` `+visa[i].pax_type[1]+` <br/> `+visa[i].visa_type[1]+`, `+visa[i].entry_type[1]+` <br/> `+currency+` `+getrupiah(price_perpax)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+currency+` `+getrupiah(price_perpax*pax_count)+`</span>
                    </div>
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;
                count_i = count_i+1;
                $text += count_i + '. ';
                $text += 'Visa '+ country +'\n';
                $text += visa[i].pax_type[1]+ ' ' + visa[i].visa_type[1] + ' ' + visa[i].entry_type[1] + ' ' + visa[i].type.process_type[1] + ' ' + visa[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += visa[i].consulate.address + ', ' + visa[i].consulate.city + '\n\n';
                if(visa[i].notes.length != 0){
                    $text += 'Visa Requirement:\n';

                    for(j in visa[i].notes){
                        $text += visa[i].notes[j] + '\n';
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
                for(j in visa[i].service_charge_summary){
                    for(k in visa[i].service_charge_summary[j].service_charges){
                        if(visa[i].service_charge_summary[j].service_charges[k].charge_type == 'RAC')
                            commission += pax_count * (visa[i].service_charge_summary[j].service_charges[k].amount * -1);
                        else
                            price += pax_count * visa[i].service_charge_summary[j].service_charges[k].amount;
                    }
                }
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
                    <h6>Please choose your visa first!<h6>
                </div>
            </div>`;
        }
        else{
            $text += 'Price\n';
            for(i in visa){
                pax_count = parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value);
                if(isNaN(pax_count)){
                    pax_count = 0;
                }
                price_perpax = 0;
                currency = '';
                for(j in visa[i].service_charge_summary){
                    for(k in visa[i].service_charge_summary[j].service_charges){
                        if(currency == '')
                            currency = visa[i].service_charge_summary[j].service_charges[k].currency
                        if(visa[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += visa[i].service_charge_summary[j].service_charges[k].amount;
                    }
                }
                if(pax_count != 0){
                    $text += pax_count + ' ' + visa[i].pax_type[1] + ' ' + visa[i].visa_type[1] + ',' + visa[i].entry_type[1];
                    $text += ' @'+ currency + ' ' +getrupiah(price_perpax);
                    $text += '\n';
                }
            }

            text+=`
                <div class="row" style="padding-bottom:15px;">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <h6>Grand Total</h6>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <h6>`+currency+` `+getrupiah(price)+`</h6>
                    </div>
                </div>`;
            if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && price){
                if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                    for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                        try{
                            if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                price_convert = (price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                if(price_convert%1 == 0)
                                    price_convert = parseInt(price_convert);
                                text+=`
                                    <div class="row" style="margin-bottom:15px;">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                            <h6> Estimated `+k+` `+price_convert+`</h6>
                                        </div>
                                    </div>`;
                            }
                        }catch(err){
                            console.log(err);
                        }
                    }
                }
            }
            $text += '\n';
            $text += 'Grand Total: '+currency + ' '+getrupiah(price);
            try{
                display = document.getElementById('show_commission').style.display;
            }catch(err){
                display = 'none';
            }
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission,'show_commission', currency)
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
                            <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                    } else {
                        text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                            <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
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
                if(agent_security.includes('book_reservation') == true && check_visa == 1)
                text+=
                `<div class="row" style="margin-top:10px; text-align:center;">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <button id="visa_btn_search" class="primary-btn-ticket next-loading ld-ext-right" style="width:100%;" onclick="show_loading();visa_check_availability();" type="button" value="Next">
                            Get Price
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>
                </div>`;
            text+=`</div>`;
            if(check_visa == 0){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "You can't buy this visa for your departure date!",
                })
            }
        }
    }else if(type == 'passenger'){
        text += `
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail `+visa_request.destination+`</h4>
            </div>
        </div>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].total_pax != 0){
                currency = '';
                price_perpax = 0;
                for(j in visa.list_of_visa[i].service_charge_summary){
                    for(k in visa.list_of_visa[i].service_charge_summary[j].service_charges){
                        if(visa.list_of_visa[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += visa.list_of_visa[i].service_charge_summary[j].service_charges[k].amount;
                        if(currency == '')
                            currency = visa.list_of_visa[i].service_charge_summary[j].service_charges[k].currency;
                    }
                }
                count_price_detail[i] = 1;
                text+=`
                <div class="row">
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+visa.list_of_visa[i].total_pax+` `+visa.list_of_visa[i].pax_type[1]+` <br/> `+visa.list_of_visa[i].visa_type[1]+`, `+visa.list_of_visa[i].entry_type[1]+` <br/> `+currency+` `+getrupiah(price_perpax)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+currency+` `+getrupiah(price_perpax)+`</span>
                    </div>
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;

                count_i = count_i+1;
                $text += count_i + '. ';
                $text += 'Visa '+ visa_request.destination +'\n';
                $text += visa.list_of_visa[i].pax_type[1]+ ' ' + visa.list_of_visa[i].visa_type[1] + ' ' + visa.list_of_visa[i].entry_type[1] + ' ' + visa.list_of_visa[i].type.process_type[1] + ' ' + visa.list_of_visa[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += visa.list_of_visa[i].consulate.address + ', ' + visa.list_of_visa[i].consulate.city + '\n\n';
                if(visa.list_of_visa[i].notes.length != 0){
                    $text += 'Visa Requirement:\n';

                    for(j in visa.list_of_visa[i].notes){
                        $text += visa.list_of_visa[i].notes[j] + '\n';
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
                price += visa.list_of_visa[i].total_pax * price_perpax;
                for(j in visa.list_of_visa[i].service_charge_summary){
                    for(k in visa.list_of_visa[i].service_charge_summary[j].service_charges){
                        if(visa.list_of_visa[i].service_charge_summary[j].service_charges[k].charge_type == 'RAC')
                            commission += visa.list_of_visa[i].total_pax * (visa.list_of_visa[i].service_charge_summary[j].service_charges[k].amount * -1);
                    }
                }
            }catch(err){

            }
        }

        $text += 'Price\n';
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].total_pax != 0){
                $text += visa.list_of_visa[i].total_pax + ' ' + visa.list_of_visa[i].pax_type[1];
                $text += ' @'+ currency+ ' ' +getrupiah(price_perpax) + '\n';
            }
        }

        text+=`
            <div class="row" style="padding-bottom:15px;">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                    <h6>Grand Total</h6>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                    <h6>`+currency+` `+getrupiah(price)+`</h6>
                </div>
            </div>`;
        if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && price){
            if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                    try{
                        if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                            price_convert = (price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                            if(price_convert%1 == 0)
                                price_convert = parseInt(price_convert);
                            text+=`
                                <div class="row" style="margin-bottom:15px;">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                        <h6> Estimated `+k+` `+price_convert+`</h6>
                                    </div>
                                </div>`;
                        }
                    }catch(err){
                        console.log(err);
                    }
                }
            }
        }
        $text += '\n';
        $text += 'Grand Total: '+currency + ' '+getrupiah(price);
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
                        <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                }
                text +=`</div>
            </div>`;
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission,'show_commission', currency)
            text+=`
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                    <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
               </div>
            </div>`;
//            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                text+=`
//                <div class="row" style="margin-top:10px; text-align:center;">
//                   <div class="col-lg-12" style="padding-bottom:10px;">
//                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br>
//                   </div>
//                </div>`;
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
        text += `
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail `+visa_request.destination+`</h4>
            </div>
        </div>`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].pax_count != 0){
                count_price_detail[i] = 1;
                currency = '';
                price_perpax = 0;
                for(j in visa.list_of_visa[i].service_charge_summary){
                    for(k in visa.list_of_visa[i].service_charge_summary[j].service_charges){
                        if(visa.list_of_visa[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += visa.list_of_visa[i].service_charge_summary[j].service_charges[k].amount;
                        if(currency == '')
                            currency = visa.list_of_visa[i].service_charge_summary[j].service_charges[k].currency;
                    }
                }
                text+=`
                <div class="row">`;
                if(typeof upsell_price_dict !== 'undefined' && upsell_price_dict.hasOwnProperty(visa.list_of_visa[i].pax_type[1].toLowerCase())){ //with upsell
                    text+=`
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+visa.list_of_visa[i].pax_count+` `+visa.list_of_visa[i].pax_type[1]+` <br/> `+visa.list_of_visa[i].visa_type[1]+`, `+visa.list_of_visa[i].entry_type[1]+` <br/> `+currency+` `+getrupiah(price_perpax + (upsell_price_dict[visa.list_of_visa[i].pax_type[1].toLowerCase()] / visa.list_of_visa[i].pax_count))+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+currency+` `+getrupiah(price_perpax*visa.list_of_visa[i].pax_count + upsell_price_dict[visa.list_of_visa[i].pax_type[1].toLowerCase()])+`</span>
                    </div>`;
                }else{
                    text+=`
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+visa.list_of_visa[i].pax_count+` `+visa.list_of_visa[i].pax_type[1]+` <br/> `+visa.list_of_visa[i].visa_type[1]+`, `+visa.list_of_visa[i].entry_type[1]+` <br/> `+currency+` `+getrupiah(price_perpax)+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+currency+` `+getrupiah(price_perpax*visa.list_of_visa[i].pax_count)+`</span>
                    </div>`;
                }
                text+=`
                    <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                    </div>
                </div>`;

//                text+=`
//                <tr>
//                    <td>`+visa.list_of_visa[i].pax_count+` `+visa.list_of_visa[i].pax_type[1]+` <br/> `+visa.list_of_visa[i].visa_type[1]+`, `+visa.list_of_visa[i].entry_type[1]+`</td>
//                    <td>x</td>
//                    <td>`+currency+` `+getrupiah(price_perpax)+`</td>
//                    <td style="text-align:right;">`+currency+` `+getrupiah(price_perpax*visa.list_of_visa[i].pax_count)+`</td>
//                </tr>`;

                count_i = count_i+1;
                $text += count_i + '. ';
                $text += 'Visa '+ visa_request.destination +'\n';
                $text += visa.list_of_visa[i].pax_type[1]+ ' ' + visa.list_of_visa[i].visa_type[1] + ' ' + visa.list_of_visa[i].entry_type[1] + ' ' + visa.list_of_visa[i].type.process_type[1] + ' ' + visa.list_of_visa[i].type.duration + ' day(s)' + '\n\n';
                $text += 'Consulate Address :\n';
                $text += visa.list_of_visa[i].consulate.address + ', ' + visa.list_of_visa[i].consulate.city + '\n\n';

                if(visa.list_of_visa[i].notes.length != 0){
                    $text += 'Visa Requirement:\n';

                    for(j in visa.list_of_visa[i].notes){
                        $text += visa.list_of_visa[i].notes[j] + '\n';
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
                price += visa.list_of_visa[i].pax_count * price_perpax;
                for(j in visa.list_of_visa[i].service_charge_summary){
                    for(k in visa.list_of_visa[i].service_charge_summary[j].service_charges){
                        if(visa.list_of_visa[i].service_charge_summary[j].service_charges[k].charge_type == 'RAC')
                            commission += visa.list_of_visa[i].total_pax * (visa.list_of_visa[i].service_charge_summary[j].service_charges[k].amount * -1);
                    }
                }
            }catch(err){

            }
        }
        $text += 'Booker:\n';
        $text += passenger.booker.title + ' ' + passenger.booker.first_name + ' ' + passenger.booker.last_name + '\n';
        $text += passenger.booker.email + '\n';
        $text += passenger.booker.mobile + '\n\n';

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
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].pax_count != 0){
                currency = '';
                price_perpax = 0;
                for(j in visa.list_of_visa[i].service_charge_summary){
                    for(k in visa.list_of_visa[i].service_charge_summary[j].service_charges){
                        if(visa.list_of_visa[i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += visa.list_of_visa[i].service_charge_summary[j].service_charges[k].amount;
                        if(currency == '')
                            currency = visa.list_of_visa[i].service_charge_summary[j].service_charges[k].currency;
                    }
                }
                $text += visa.list_of_visa[i].pax_count + ' ' + visa.list_of_visa[i].pax_type[1];
                $text += ' @'+ currency+ ' ' +getrupiah(price_perpax) + '\n';
            }
        }
//        try{
//            if(upsell_price != 0){
//                text+=`<div class="row" style="padding-bottom:15px;">`
//                text+=`
//                <div class="col-lg-7" style="text-align:left;">
//                    <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
//                </div>
//                <div class="col-lg-5" style="text-align:right;">`;
//                if(currency == 'IDR')
//                text+=`
//                    <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(upsell_price)+`</span><br/>`;
//                else
//                text+=`
//                    <span style="font-size:13px; font-weight:500;">`+currency+` `+upsell_price+`</span><br/>`;
//                text+=`</div></div>`;
//            }
//        }catch(err){
//            console.log(err) //ada element yg tidak ada
//        }
        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
            text+=`<div style="text-align:right;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
        try{
            grand_total_price = price;
            for(i in upsell_price_dict)
                grand_total_price += upsell_price_dict[i];
        }catch(err){
            console.log(err) //ada element yg tidak ada
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
                    <h6>`+currency+` `+getrupiah(grand_total_price)+`</h6>
                </div>
            </div>`;
        if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && grand_total_price){
            if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                    try{
                        if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                            price_convert = (grand_total_price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                            if(price_convert%1 == 0)
                                price_convert = parseInt(price_convert);
                            text+=`
                                <div class="row" style="margin-bottom:15px;">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                        <h6> Estimated `+k+` `+price_convert+`</h6>
                                    </div>
                                </div>`;
                        }
                    }catch(err){
                        console.log(err);
                    }
                }
            }
        }
        $text += '\n';
        $text += 'Grand Total: '+currency + ' '+getrupiah(grand_total_price);
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
                        <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the visa price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                }
                text +=`</div>
            </div>`;
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+= print_commission(commission,'show_commission', currency)

            text+=`
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                    <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
               </div>
            </div>`;
//            if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                text+=`
//                <div class="row" style="margin-top:10px; text-align:center;">
//                   <div class="col-lg-12" style="padding-bottom:10px;">
//                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br>
//                   </div>
//                </div>`;
    }else if(type == 'booking'){
        price = 0;
        price_pax = 0;
        commission = 0;
        disc = 0;
        csc = 0;
        currency = '';

        $text = '';
        $text += 'Order Number: '+ visa.journey.name+'\n';
        $text += visa.journey.country + ' ' + visa.journey.departure_date + ' ' + visa.journey.state_visa + '\n';
        $text += visa.journey.state_visa + '\n'

        $text += '\nContact Person:\n';
        $text += visa.contact.title + ' ' + visa.contact.name + '\n';
        $text += visa.contact.email + '\n';
        if(visa.contact.phone != '')
            $text += visa.contact.phone + '\n';

        text = '';
        tax = 0;
        fare = 0;
        total_price = 0;
        commission = 0;
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'CSC'];
        text_detail=`
        <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
            <h5> Price Detail</h5>
        <hr/>`;

        //repricing
        type_amount_repricing = ['Repricing'];
        //repricing
        counter_service_charge = 0;
        disc = 0;

        total_price_provider = [];
        $text += '\nPrice:\n';
        for(i in visa.provider_bookings){
            try{
                csc = 0;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || visa.state == 'issued')
                    text_detail+=`
                        <div style="text-align:left">
                            <span style="font-weight:500; font-size:14px;">PNR: `+visa.provider_bookings[i].pnr+` </span>
                        </div>`;
                for(j in visa.passengers){
                    price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                    for(k in visa.passengers[j].sale_service_charges[visa.provider_bookings[i].pnr]){
                        price[k] += visa.passengers[j].sale_service_charges[visa.provider_bookings[i].pnr][k].amount;
                        if(price['currency'] == '')
                            price['currency'] = visa.passengers[j].sale_service_charges[visa.provider_bookings[i].pnr][k].currency;
                    }
                    disc -= price['DISC'];
                    try{
                        if(visa.passengers[j].channel_service_charges.hasOwnProperty('amount')){
                            price['CSC'] = visa.passengers[j].channel_service_charges.amount;
                            csc += visa.passengers[j].channel_service_charges.amount;
                        }
                    }catch(err){
                        console.log(err) //ada element yg tidak ada
                    }
                    //repricing
                    check = 0;
                    for(k in pax_type_repricing){
                        if(pax_type_repricing[k][0] == visa.passengers[j].name)
                            check = 1;
                    }
                    if(check == 0){
                        pax_type_repricing.push([visa.passengers[j].name, visa.passengers[j].name]);
                        price_arr_repricing[visa.passengers[j].name] = {
                            'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                            'Tax': price['TAX'] + price['ROC'],
                            'Repricing': price['CSC']
                        }
                    }else{
                        price_arr_repricing[visa.passengers[j].name] = {
                            'Fare': price_arr_repricing[visa.passengers[j].name]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'] + price['SEAT'],
                            'Tax': price_arr_repricing[visa.passengers[j].name]['Tax'] + price['TAX'] + price['ROC'],
                            'Repricing': price['CSC']
                        }
                    }
                    text_repricing = `
                    <div class="col-lg-12">
                        <div style="padding:5px;" class="row">
                            <div class="col-lg-3"></div>
                            <div class="col-lg-3">Price</div>
                            <div class="col-lg-3">Repricing</div>
                            <div class="col-lg-3">Total</div>
                        </div>
                    </div>`;
                    for(k in price_arr_repricing){
                       text_repricing += `
                       <div class="col-lg-12">
                            <div style="padding:5px;" class="row" id="adult">
                                <div class="col-lg-3" id="`+j+`_`+k+`">`+k+`</div>
                                <div class="col-lg-3" id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                                if(price_arr_repricing[k].Repricing == 0)
                                text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">-</div>`;
                                else
                                text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                                text_repricing+=`<div class="col-lg-3" id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                            </div>
                        </div>`;
                    }
                    text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                    document.getElementById('repricing_div').innerHTML = text_repricing;
                    //repricing

                    text_detail+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">`+visa.passengers[j].name+`</span>`;
                        text_detail+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT))+`</span>
                        </div>
                    </div>`;
                    $text += visa.passengers[j].title +' '+ visa.passengers[j].name + ' ['+visa.provider_bookings[i].pnr+'] ';

                    $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                    if(counter_service_charge == 0){
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                    }else{
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                    }
                    commission += parseInt(price.RAC);
                    total_price_provider.push({
                        'pnr': visa.provider_bookings[i].pnr,
                        'provider': visa.provider_bookings[i].provider,
                        'price': JSON.parse(JSON.stringify(price))
                    });
                }
                if(csc != 0){
                    text_detail+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">Other service charges</span>`;
                            text_detail+=`</div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(csc))+`</span>
                            </div>
                        </div>`;
                }
                counter_service_charge++;
            }catch(err){console.log(err);}
        }
        try{
            $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
            if(visa.state == 'booked')
            $text += '\n\nPrices and availability may change at any time';
            if(disc != 0){
                text_detail+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">Discount</span>`;
                        text_detail+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                            <span style="font-size:13px;">`+price.currency+` -`+getrupiah(parseInt(disc))+`</span>
                        </div>
                    </div>`;
            }
            text_detail+=`
            <div>
                <hr/>
            </div>
            <div class="row" style="margin-bottom:10px;">
                <div class="col-lg-6 col-xs-6" style="text-align:left;">
                    <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                </div>
                <div class="col-lg-6 col-xs-6" style="text-align:right;">
                    <span style="font-size:13px; font-weight: bold;">`;
                    try{
                        if(total_price != 0)
                            text_detail+= price.currency+` `+getrupiah(total_price);
                        else
                            text_detail+= 'Free';
                    }catch(err){

                    }
                    text_detail+= `</span>
                </div>
            </div>`;

            if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price){
                if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                    for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                        try{
                            if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == price.currency){
                                price_convert = (total_price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                if(price_convert%1 == 0)
                                    price_convert = parseInt(price_convert);
                                text_detail+=`
                                    <div class="row" style="margin-bottom:10px;">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                            <h6> Estimated `+k+` `+price_convert+`</h6>
                                        </div>
                                    </div>`;
                            }
                        }catch(err){
                            console.log(err);
                        }
                    }
                }
            }

            if(visa.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
            }
            text_detail+=`<div class="row">
            <div class="col-lg-12" style="padding-bottom:10px;">
                <hr/>
                <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text_detail+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                } else {
                    text_detail+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                }

            text_detail+=`
                </div>
            </div>`;

            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false && user_login.co_agent_frontend_security.includes('see_commission')){
                text_detail+=`
                <div class="alert alert-success" style="margin-top:10px;">
                    <div style="color:black; font-weight:bold; cursor:pointer; font-size:15px; text-align:left; width:100%;" onclick="show_commission('show_commission');">
                        <span>YPM </span>
                        <span id="show_commission_button">`;
                            text_detail+=`<span style="float:right;">show <i class="fas fa-eye"></i></span>`;
                        text_detail+=`
                        </span>`;

                        text_detail+=`<span id="show_commission" style="display:none;">`;

                        text_detail+=`<span style="font-size:14px; font-weight: bold; color:`+color+`;"> `+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span><br/>`;

                        if(visa.hasOwnProperty('agent_nta') == true){
                            total_nta = 0;
                            total_nta = visa.agent_nta;
                            text_detail+=`
                            <span style="font-size:14px; font-weight:bold;">Agent NTA: </span>
                            <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(total_nta)+`</span><br/>`;
                        }
                        if(visa.hasOwnProperty('total_nta') == true){
                            total_nta = 0;
                            total_nta = visa.response.total_nta;
                            text_detail+=`
                            <span style="font-size:14px; font-weight:bold;">HO NTA: </span>
                            <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(total_nta)+`</span><br/>`;
                        }
                        text_detail+=`
                        </span>
                    </div>
                </div>`;
            }

            text_detail+=`<center>
            <div style="padding-bottom:10px;">
                <center>
                    <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                </center>
            </div>`;
//            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                text_detail+=`
//                <div style="margin-bottom:5px;">
//                    <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show YPM"/>
//                </div>`;
            text_detail+=`
        </div>`;
        }catch(err){
            console.log(err);
        }
        try{
            testing_price = price.currency;
            text += text_detail;
        }catch(err){

        }
        add_repricing();
//        document.getElementById('show_title_train').hidden = false;
//        document.getElementById('show_loading_booking_train').hidden = true;
//        document.getElementById('train_detail').innerHTML = text;






//        for(k in visa.provider_bookings){
//            for(i in visa.passengers){
//                if(i == 0)
//                    $text += '\nPassengers\n';
//                $text += visa.passengers[i].sequence + ' ' + visa.passengers[i].title + ' ' + visa.passengers[i].first_name + ' ' + visa.passengers[i].last_name + '\n';
//                if(visa.passengers[i].passport_number != '')
//                    $text += visa.passengers[i].passport_number + ' ' + visa.passengers[i].passport_expdate + '\n';
//                $text += visa.passengers[i].visa.entry_type + ' ' + visa.passengers[i].visa.visa_type + ' ' + visa.passengers[i].visa.process + '\n';
//                $text += 'Consulate: '+ visa.passengers[i].visa.immigration_consulate + '\n';
//                $text += 'Process: ' + visa.passengers[i].visa.duration + ' Days';
//                if(visa.journey.in_process_date != '')
//                    $text += ' from '+ visa.journey.in_process_date + '\n';
//                else
//                    $text == '\n';
//                for(j in visa.passengers[i].visa.requirements){
//                    if(j == 0)
//                        $text += '\nRequirements\n';
//                    $text += visa.passengers[i].visa.requirements[j].name + '\n';
//                }
//                if(visa.passengers[i].visa.interview.needs == true){
//                    $text += '\nInterview\b'
//                    for(j in visa.passengers[i].visa.interview.interview_list){
//                        $text += visa.passengers[i].visa.interview.interview_list[j].location + ' ' + visa.passengers[i].visa.interview.interview_list[j].datetime + '\n';
//                    }
//                }
//                if(visa.passengers[i].visa.biometrics.needs == true){
//                    $text += '\nInterview\b'
//                    for(j in visa.passengers[i].visa.biometrics.biometrics_list){
//                        $text += visa.passengers[i].visa.biometrics.biometrics_list[j].location + ' ' + visa.passengers[i].visa.biometrics.biometrics_list[j].datetime + '\n';
//                    }
//                }
//                price_pax = 0;
//                for(j in visa.passengers[i].sale_service_charges[msg.result.response.provider_bookings[k].pnr]){
//                    if(visa.passengers[i].sale_service_charges[msg.result.response.provider_bookings[k].pnr][j].charge_code == 'total'){
//                        price += visa.passengers[i].sale_service_charges[j].amount;
//                        price_pax += visa.passengers[i].sale_service_charges[j].amount;
//                        currency = visa.passengers[i].sale_service_charges[j].currency;
//                    }else if(visa.passengers[i].sale_service_charges[j].charge_code == 'rac'){
//                        commission += (visa.passengers[i].sale_service_charges[j].amount) *-1;
//                    }else if(visa.passengers[i].sale_service_charges[j].charge_code == 'csc'){
//                        price += visa.passengers[i].sale_service_charges[j].amount;
//                        csc += visa.passengers[i].sale_service_charges[j].amount;
//                    }else if(visa.passengers[i].sale_service_charges[j].charge_code == 'disc'){
//                        price += visa.passengers[i].sale_service_charges[j].amount;
//                        disc -= visa.passengers[i].sale_service_charges[j].amount;
//                    }
//                }
//                $text += 'Price '+ currency + ' ' + getrupiah(price_pax) + '\n';
//
//                text+=`
//                <div class="row">
//                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
//                        <span style="font-size:13px;">`+visa.passengers[i].title+` `+visa.passengers[i].first_name+` `+visa.passengers[i].last_name+`</span>
//                    </div>
//                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
//                        <span style="font-size:13px;">`+currency+` `+getrupiah(price_pax)+`</span>
//                    </div>
//                    <div class="col-lg-12">
//                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
//                    </div>
//                </div>`;
//            }
//        }
//
//        if(csc != 0){
//            text+=`
//                <div class="row" style="margin-bottom:5px;">
//                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                        <span style="font-size:12px;">Other service charges</span>`;
//                    text+=`</div>
//                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                        <span style="font-size:13px;">`+currency+` `+getrupiah(parseInt(csc))+`</span>
//                    </div>
//                </div>`;
//        }
//        if(disc != 0){
//            text+=`
//                <div class="row" style="margin-bottom:5px;">
//                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                        <span style="font-size:12px;">Discount</span>`;
//                    text+=`</div>
//                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                        <span style="font-size:13px;">`+currency+` -`+getrupiah(parseInt(disc))+`</span>
//                    </div>
//                </div>`;
//        }
//        text+=`
//            <div class="row" style="padding-bottom:15px;">
//                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
//                    <h6>Grand Total</h6>
//                </div>
//                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
//                    <h6>`+currency+` `+getrupiah(price)+`</h6>
//                </div>
//            </div>`;
//
//        $text += `\nGrand total `+currency+` `+getrupiah(price);
//        try{
//            display = document.getElementById('show_commission').style.display;
//        }catch(err){
//            display = 'none';
//        }
//        if(visa.journey.state == 'booked')
//        text+=`<div style="text-align:right; cursor:pointer; padding-bottom:10px;" onclick="show_repricing();"><i class="image-rounded-icon"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:30px; height:30px;"/></i></div>`;
//        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
//            text+=`
//            <div class="row" id="show_commission" style="display: block;">
//                <div class="col-lg-12" style="text-align:center;">
//                    <div class="alert alert-success">
//                        <div class="row">
//                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
//                                <span style="font-size:13px; font-weight:bold;">YPM</span>
//                            </div>
//                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
//                                <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(parseInt(commission))+`</span>
//                            </div>
//                        </div>`;
//                        if(visa.hasOwnProperty('agent_nta') == true){
//                            total_nta = 0;
//                            total_nta = visa.agent_nta;
//                            text+=`<div class="row">
//                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
//                                <span style="font-size:13px; font-weight:bold;">Agent NTA</span>
//                            </div>
//                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
//                                <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(total_nta)+`</span>
//                            </div>
//                        </div>`;
//                        }
//                        if(visa.hasOwnProperty('total_nta') == true){
//                            total_nta = 0;
//                            total_nta = visa.total_nta;
//                            text+=`<div class="row">
//                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
//                                <span style="font-size:13px; font-weight:bold;">HO NTA</span>
//                            </div>
//                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
//                                <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(total_nta)+`</span>
//                            </div>
//                        </div>`;
//                        }
//                        text+=`
//                    </div>
//                </div>
//            </div>`;
//        }
//        text+=`
//        <div class="row" style="margin-top:10px; text-align:center;">
//           <div class="col-lg-12">
//                <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('review');" value="Copy">
//           </div>
//        </div>`;
//        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//            text+=`
//            <div class="row" style="margin-top:10px; text-align:center;">
//               <div class="col-lg-12" style="padding-bottom:10px;">
//                    <button class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('show_commission');">
//                        Show YPM
//                    <button>
//               </div>
//            </div>`;

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

function visa_check_availability(){
    error_log = '';
    provider_pick = [];
    reference_code = [];
    for(i in visa){
        if(check_number(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value) == false){
            error_log = 'Please input number in pax type '+ visa[i].pax_type[1]+'\n';
        }else{
            if(provider_pick.includes(visa[i]['provider']) == false && parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value) > 0){
                provider_pick.push(visa[i]['provider']);
                reference_code.push(visa[i]['id']);
            }
        }
    }
    check = 0;
    for(i in visa){
        if(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value != '' && document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value != '0'){
            check = 1;
        }
    }
    if(provider_pick.length > 1)
        error_log += 'Please choose 1 provider';
    if(check == 0){
        for(i in visa){
            document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).style['border-color'] = 'red';
        }
        alert('Please input pax')
        $('.next-loading').removeClass("running");
    }else if(error_log == ''){
        get_availability();
    }else{
        alert(error_log);
        document.getElementById('visa_btn_search').disabled = false;
        $('.next-loading').removeClass("running");
    }
}

function visa_check_search(){
    error_log = '';
    provider_pick = [];
    for(i in visa){
        if(check_number(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value) == false){
            error_log = 'Please input number in pax type '+ visa[i].pax_type[1]+'\n';
        }else{
            if(provider_pick.includes(visa[i]['provider']) == false && parseInt(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value) > 0)
                provider_pick.push(visa[i]['provider']);
        }
    }
    check = 0;
    for(i in visa){
        if(document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value != '' && document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).value != '0'){
            check = 1;
        }
    }
    if(provider_pick.length > 1)
        error_log += 'Please choose 1 provider';
    if(check == 0){
        for(i in visa){
            document.getElementById('qty_pax_'+parseInt(parseInt(i)+1)).style['border-color'] = 'red';
        }
        alert('Please input pax')
        $('.next-loading').removeClass("running");
    }else if(error_log == ''){
        document.getElementById('time_limit_input').value = time_limit;
        document.getElementById('visa_list').value = JSON.stringify(visa);
        if(!document.getElementById('visa_passenger').action.includes(signature))
            document.getElementById('visa_passenger').action += '/' + signature;
        document.getElementById('visa_passenger').submit();
    }else{
        alert(error_log);
        document.getElementById('visa_btn_search').disabled = false;
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
    var max_length = 60;
    if(typeof(visa_carriers) !== 'undefined'){
        if(visa_carriers.hasOwnProperty('VISA'))
            max_length = visa_carriers['VISA'].adult_length_name;
    }
    if(check_name(document.getElementById('booker_title').value,
                    document.getElementById('booker_first_name').value,
                    document.getElementById('booker_last_name').value,
                    max_length) == false){
        error_log+= 'Total of Booker name maximum '+max_length+' characters!</br>\n';
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

   //adult
   for(i=1;i<=adult;i++){

       if(check_name(document.getElementById('adult_title'+i).value,
       document.getElementById('adult_first_name'+i).value,
       document.getElementById('adult_last_name'+i).value,
       max_length) == false){
           error_log+= 'Total of adult '+i+' name maximum '+max_length+' characters!</br>\n';
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

   if(typeof(visa_carriers) !== 'undefined'){
        if(visa_carriers.hasOwnProperty('VISA'))
            max_length = visa_carriers['VISA'].child_length_name;
   }

   //child
   for(i=1;i<=child;i++){
       if(check_name(document.getElementById('child_title'+i).value,
       document.getElementById('child_first_name'+i).value,
       document.getElementById('child_last_name'+i).value,
       max_length) == false){
           error_log+= 'Total of child '+i+' name maximum '+max_length+' characters!</br>\n';
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

   if(typeof(visa_carriers) !== 'undefined'){
        if(visa_carriers.hasOwnProperty('VISA'))
            max_length = visa_carriers['VISA'].infant_length_name;
   }
   //infant
   for(i=1;i<=infant;i++){
       if(check_name(document.getElementById('infant_title'+i).value,
       document.getElementById('infant_first_name'+i).value,
       document.getElementById('infant_last_name'+i).value,
       max_length) == false){
           error_log+= 'Total of infant '+i+' name maximum '+max_length+' characters!</br>\n';
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
       upload_image();
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
    if(pax_type == 'adt'){
        pax_required = document.getElementById('adult_required'+number);
        pax_required_up = document.getElementById('adult_required_up'+number);
        pax_required_down = document.getElementById('adult_required_down'+number);
        pax_check = document.getElementById('adult_check'+number);
        pax_visa = document.getElementsByName('adult_visa_type'+number);
        pax_entry = document.getElementsByName('adult_entry_type'+number);
        pax_process = document.getElementsByName('adult_process_type'+number);
        pax_price = document.getElementById('adult_price'+number);
        name = document.getElementById('adult_name'+number).innerHTML;
        other_currency_rate = document.getElementById('adult_other_price'+number);
    }else if(pax_type == 'chd'){
        pax_required = document.getElementById('child_required'+number);
        pax_required_up = document.getElementById('child_required_up'+number);
        pax_required_down = document.getElementById('child_required_down'+number);
        pax_check = document.getElementById('child_check'+number);
        pax_visa = document.getElementsByName('child_visa_type'+number);
        pax_entry = document.getElementsByName('child_entry_type'+number);
        pax_process = document.getElementsByName('child_process_type'+number);
        pax_price = document.getElementById('child_price'+number);
        name = document.getElementById('child_name'+number).innerHTML;
        other_currency_rate = document.getElementById('child_other_price'+number);
    }else if(pax_type == 'inf'){
        pax_required = document.getElementById('infant_required'+number);
        pax_required_up = document.getElementById('infant_required_up'+number);
        pax_required_down = document.getElementById('infant_required_down'+number);
        pax_check = document.getElementById('infant_check'+number);
        pax_visa = document.getElementsByName('infant_visa_type'+number);
        pax_entry = document.getElementsByName('infant_entry_type'+number);
        pax_process = document.getElementsByName('infant_process_type'+number);
        pax_price = document.getElementById('infant_price'+number);
        name = document.getElementById('infant_name'+number).innerHTML;
        other_currency_rate = document.getElementById('infant_other_price'+number);
    }
    if(value == 'visa'){
        if(pax_check.value != 'false'){
            sell_visa['search_data'][parseInt(pax_check.value)].total_pax++;
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
        for(i in sell_visa['search_data']){
            if(sell_visa['search_data'][i].pax_type.toLowerCase() == pax_type && sell_visa['search_data'][i].visa_type == visa_type){
                for (var j = 0, length = radios.length; j < length; j++) {
                    console.log(radios[j].value);
                    console.log(sell_visa['search_data'][i].entry_type);
                    console.log(sell_visa['search_data'][i].total_pax);
                    if(radios[j].value == sell_visa['search_data'][i].entry_type && sell_visa['search_data'][i].total_pax > 0){
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
        if(pax_type == 'adt'){
            document.getElementById('entry_type_adult_div'+number).style.display = 'block';
            document.getElementById('process_type_adult_div'+number).style.display = 'none';
        }else if(pax_type == 'chd'){
            document.getElementById('entry_type_child_div'+number).style.display = 'block';
            document.getElementById('process_type_child_div'+number).style.display = 'none';
        }else if(pax_type == 'inf'){
            document.getElementById('entry_type_infant_div'+number).style.display = 'block';
            document.getElementById('process_type_infant_div'+number).style.display = 'none';
        }
        //check max pax
    }else if(value == 'entry'){
        if(pax_check.value != 'false'){
            sell_visa['search_data'][parseInt(pax_check.value)].total_pax++;
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
        for(i in sell_visa['search_data']){
            if(sell_visa['search_data'][i].pax_type.toLowerCase() == pax_type && sell_visa['search_data'][i].visa_type == visa_type && sell_visa['search_data'][i].entry_type == entry_type){
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].value == sell_visa['search_data'][i].type.process_type && sell_visa['search_data'][i].total_pax > 0){
                        radios[j].disabled = false;
                    }
                }
            }
        }
        pax_price.innerHTML = '-';
        pax_required.style.display = "block";
        pax_required_up.style.display = "block";
        pax_required_down.style.display = "none";
        if(pax_type == 'adt'){
            document.getElementById('entry_type_adult_div'+number).style.display = 'block';
            document.getElementById('process_type_adult_div'+number).style.display = 'block';
        }else if(pax_type == 'chd'){
            document.getElementById('entry_type_child_div'+number).style.display = 'block';
            document.getElementById('process_type_child_div'+number).style.display = 'block';
        }else if(pax_type == 'inf'){
            document.getElementById('entry_type_infant_div'+number).style.display = 'block';
            document.getElementById('process_type_infant_div'+number).style.display = 'block';
        }
    }else if(value == 'process'){
        if(pax_check.value != 'false'){
            sell_visa['search_data'][parseInt(pax_check.value)].total_pax++;
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
        for(i in sell_visa['search_data']){
            if(sell_visa['search_data'][i].pax_type.toLowerCase() == pax_type &&
                sell_visa['search_data'][i].visa_type == visa_type &&
                sell_visa['search_data'][i].entry_type == entry_type &&
                sell_visa['search_data'][i].type.process_type == process_type &&
                sell_visa['search_data'][i].pax_count != 0){
                currency = '';
                price_perpax = 0;
                for(j in sell_visa['search_data'][i].service_charge_summary){
                    for(k in sell_visa['search_data'][i].service_charge_summary[j].service_charges){
                        if(sell_visa['search_data'][i].service_charge_summary[j].service_charges[k].charge_type != 'RAC')
                            price_perpax += sell_visa['search_data'][i].service_charge_summary[j].service_charges[k].amount;
                        if(currency == '')
                            currency = sell_visa['search_data'][i].service_charge_summary[j].service_charges[k].currency;
                    }
                }
                pax_price.innerHTML = currency + ' ' + getrupiah(price_perpax.toString());

//                if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
//                    var price_breakdown = {};
//                    var currency_breakdown = '';
//                    for(j in sell_visa['search_data'][i].service_charges){
//                        if(sell_visa['search_data'][i].service_charges[j].charge_type != 'RAC'){
//                            if(!price_breakdown.hasOwnProperty(sell_visa['search_data'][i].service_charges[j].charge_type))
//                                price_breakdown[sell_visa['search_data'][i].service_charges[j].charge_type] = 0;
//                            price_breakdown[sell_visa['search_data'][i].service_charges[j].charge_type] += sell_visa['search_data'][i].service_charges[j].total;
//                        }
//                        if(currency_breakdown == '')
//                            currency_breakdown = sell_visa['search_data'][i].service_charges[j].currency;
//                    }
//                    var breakdown_text = '';
//                    for(j in price_breakdown){
//                        if(breakdown_text)
//                            breakdown_text += '<br/>';
//                        if(j != 'ROC')
//                            breakdown_text += '<b>'+j+'</b> ';
//                        else
//                            breakdown_text += '<b>CONVENIENCE FEE</b> ';
//                        breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
//                    }
//                    pax_price.style.cursor = 'pointer';
//                    new jBox('Tooltip', {
//                        attach: '#'+pax_price.id,
//                        target: '#'+pax_price.id,
//                        theme: 'TooltipBorder',
//                        trigger: 'click',
//                        adjustTracker: true,
//                        closeOnClick: 'body',
//                        closeButton: 'box',
//                        animation: 'move',
//                        position: {
//                          x: 'left',
//                          y: 'top'
//                        },
//                        outside: 'y',
//                        pointer: 'left:20',
//                        offset: {
//                          x: 25
//                        },
//                        content: breakdown_text
//                    });
//                }

                if(other_currency_rate){
                    text_currency = ''
                    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && price_perpax){
                        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                try{
                                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                        price_convert = (price_perpax/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                        if(price_convert%1 == 0)
                                            price_convert = parseInt(price_convert);
                                        text_currency+=`
                                            <h6> Estimated `+k+` `+price_convert+`</h6>`;
                                    }
                                }catch(err){
                                    console.log(err);
                                }
                            }
                        }
                    }
                    if(text_currency)
                        other_currency_rate.innerHTML = text_currency;
                }
                text_requirements = '';
                text_requirements+=`<div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><h6>Document</h6><br/></div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><h6>Original</h6><br/></div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"><h6>Copy</h6><br/></div>`;
                if(sell_visa['search_data'][i].requirements.length != 0){
                    for(j in sell_visa['search_data'][i].requirements){
//                    if(sell_visa['search_data'][i].requirements[j].required == true){
                        if(template == 1){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">`;
                        }else if(template == 2 || template == 3){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:15px;">`;
                        }else if(template == 4 || template == 5 || template == 6){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:20px;">`;
                        }
                        text_requirements += `
                            <label class="check_box_custom" style="padding-left:unset;">
                                <span style="font-size:13px;">`+sell_visa['search_data'][i].requirements[j].name+` </span>`;
                                    if(sell_visa['search_data'][i].requirements[j].required == true){
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
                }else{
                    text_requirements+=`<div class="col-lg-12" style="text-align:center;"><h6>Sorry, No Document Needed</h6><br/></div>`;
                }
                text_requirements+=`</div>`;

                pax_required.innerHTML = text_requirements;
                pax_required.style.display = "block";
                pax_required_up.style.display = "block";
                pax_required_down.style.display = "none";

                sell_visa['search_data'][i].total_pax = sell_visa['search_data'][i].total_pax - 1;
                pax_check.value = sell_visa['search_data'][i].sequence;
                list_of_name = name.split(' ');
                list_of_name.shift();
                list_of_name.shift();
                list_of_name = list_of_name.join(' ');

                check = 0;
                for(j in list_passenger){
                    if(list_passenger[j].name == list_of_name)
                        check = 1;
                }
                commission = 0;
                for(j in sell_visa['search_data'][i].service_charge_summary){
                    for(k in sell_visa['search_data'][i].service_charge_summary[j].service_charges){
                        if(sell_visa['search_data'][i].service_charge_summary[j].service_charges[k].charge_type == 'RAC')
                            price_perpax += sell_visa['search_data'][i].service_charge_summary[j].service_charges[k].amount;
                    }
                }
                if(check == 0)
                    list_passenger.push({
                        'name': list_of_name,
                        'Fare': price_perpax,
                        'currency':currency,
                        'commission':commission,
                        'type':{
                            'entry': sell_visa['search_data'][i].entry_type,
                            'type': sell_visa['search_data'][i].type.process_type,
                            'visa': sell_visa['search_data'][i].visa_type
                        }
                    });
                update_table_new('review');
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
            sell_visa['search_data'][parseInt(document.getElementById('adult_check'+number).value)].total_pax++;
            document.getElementById('adult_check'+number).value = 'false';
            document.getElementById('adult_required'+number).innerHTML = '';
            document.getElementById('adult_other_price'+number).innerHTML = '';
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
    }
    else if(pax_type == 'child'){
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
            sell_visa['search_data'][parseInt(document.getElementById('child_check'+number).value)].total_pax++;
            document.getElementById('child_check'+number).value = 'false';
            document.getElementById('child_required'+number).innerHTML = '';
            document.getElementById('child_other_price'+number).innerHTML = '';
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
    }
    else if(pax_type == 'infant'){
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
            sell_visa['search_data'][parseInt(document.getElementById('infant_check'+number).value)].total_pax++;
            document.getElementById('infant_check'+number).value = 'false';
            document.getElementById('infant_required'+number).innerHTML = '';
            document.getElementById('infant_other_price'+number).innerHTML = '';
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
    }
    update_table_new('review');
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