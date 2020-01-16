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
    text = '';
    $text = '';
    var check_price_detail = 0;
    if(type == 'search'){
        check_visa = 0;
        text += `<div style="background-color:white; padding:10px; border:1px solid #cdcdcd;">
                <h4>Price detail `+visa_request.destination+`</h4><hr/>
                <table style="width:100%;">`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in visa){
            if(moment(visa_request.departure) >= moment().subtract(visa[i].type.duration*-1,'days'))
                check_visa = 1;
            pax_count = parseInt(document.getElementById('qty_pax_'+i).value);
            if(isNaN(pax_count)){
                pax_count = 0;
            }

            if(pax_count != 0){
                count_price_detail[i] = 1;
                text+=`
                <tr>
                    <td>`+pax_count+` `+visa[i].pax_type[1]+` <br/> `+visa[i].visa_type[1]+`, `+visa[i].entry_type[1]+`</td>
                    <td>x</td>
                    <td>`+visa[i].sale_price.currency+` `+getrupiah(visa[i].sale_price.total_price)+` </td>
                    <td style="text-align:right;">`+visa[i].sale_price.currency+` `+getrupiah(visa[i].sale_price.total_price*pax_count)+`</td>
                </tr>`;
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
                price += pax_count * visa[i].sale_price.total_price;
                commission += pax_count * (visa[i].commission[0].amount * -1);
            }catch(err){

            }
        }
        text+=`</table>`;

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
                pax_count = parseInt(document.getElementById('qty_pax_'+i).value);
                if(isNaN(pax_count)){
                    pax_count = 0;
                }

                if(pax_count != 0){
                    $text += pax_count + ' ' + visa[i].pax_type[1] + ' ' + visa[i].visa_type[1] + ',' + visa[i].entry_type[1];
                    $text += ' @'+ visa[i].sale_price.currency + ' ' +getrupiah(visa[i].sale_price.total_price);
                    $text += '\n';
                }
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
                        <h6>`+visa[0].sale_price.currency+` `+getrupiah(price)+`</h6>
                    </div>
                </div>`;
            $text += '\n';
            $text += 'Grand Total: '+visa[0].sale_price.currency + ' '+getrupiah(price);
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
                    <div class="col-lg-12" style="padding-bottom:15px;">
                        <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    } else {
                        text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    }
                    text +=`</div>

                </div>
                <div class="row" id="show_commission" style="display: `+display+`;">
                    <div class="col-lg-12" style="text-align:center;">
                        <div class="alert alert-success">
                            <span style="font-size:13px; font-weight:bold;">Your Commission: `+visa[0].sale_price.currency+` `+getrupiah(commission)+`</span><br>
                        </div>
                    </div>
                </div>
                <div class="row" style="margin-top:10px; text-align:center;">
                   <div class="col-lg-12">
                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('search');" value="Copy">
                   </div>
                </div>
                <div class="row" style="margin-top:10px; text-align:center;">
                   <div class="col-lg-12">
                        <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br>
                   </div>
                </div>`;
                if(agent_security.includes('book_reservation') == true && check_visa == 1)
                text+=
                `<div class="row" style="margin-top:10px; text-align:center;">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <button class="primary-btn-ticket next-loading ld-ext-right" style="width:100%;" onclick="show_loading();visa_check_search();" type="button" value="Next">
                            Next
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
        text += `<h4>Price detail `+visa_request.destination+`</h4><hr/>
                <table style="width:100%;">`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].total_pax != 0){
                count_price_detail[i] = 1;
                text+=`
                <tr>
                    <td>`+visa.list_of_visa[i].total_pax+` `+visa.list_of_visa[i].pax_type[1]+` <br/> `+visa.list_of_visa[i].visa_type[1]+`, `+visa.list_of_visa[i].entry_type[1]+`</td>
                    <td>x</td>
                    <td>`+visa.list_of_visa[i].sale_price.currency+` `+getrupiah(visa.list_of_visa[i].sale_price.total_price)+`</td>
                    <td style="text-align:right;">`+visa.list_of_visa[i].sale_price.currency+` `+getrupiah(visa.list_of_visa[i].sale_price.total_price*visa.list_of_visa[i].total_pax)+`</td>
                </tr>`;

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
                price += visa.list_of_visa[i].total_pax * visa.list_of_visa[i].sale_price.total_price;
                commission += visa.list_of_visa[i].total_pax * (visa.list_of_visa[i].commission[0].amount * -1);
            }catch(err){

            }
        }
        text+=`</table>`;

        $text += 'Price\n';
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].total_pax != 0){
                $text += visa.list_of_visa[i].total_pax + ' ' + visa.list_of_visa[i].pax_type[1];
                $text += ' @'+ visa.list_of_visa[i].sale_price.currency+ ' ' +getrupiah(visa.list_of_visa[i].sale_price.total_price) + '\n';
            }
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
                    <h6>`+visa.list_of_visa[0].sale_price.currency+` `+getrupiah(price)+`</h6>
                </div>
            </div>`;
        $text += '\n';
        $text += 'Grand Total: '+visa.list_of_visa[0].sale_price.currency + ' '+getrupiah(price);
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
            <div class="row">
                <div class="col-lg-12" style="padding-bottom:15px;">
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                }
                text +=`</div>
            </div>
            <div class="row" id="show_commission" style="display: `+display+`;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight:bold;">Your Commission: `+visa.list_of_visa[0].sale_price.currency+` `+getrupiah(commission)+`</span><br>
                    </div>
                </div>
            </div>
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                    <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
               </div>
            </div>
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12" style="padding-bottom:10px;">
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br>
               </div>
            </div>
            `;
    }else if(type == 'review'){

        text += `<h4>Price detail `+visa_request.destination+`</h4><hr/>
                <table style="width:100%;">`;
        price = 0;
        commission = 0;
        count_i = 0;
        for(i in visa.list_of_visa){
            if(visa.list_of_visa[i].pax_count != 0){
                count_price_detail[i] = 1;
                text+=`
                <tr>
                    <td>`+visa.list_of_visa[i].pax_count+` `+visa.list_of_visa[i].pax_type[1]+` <br/> `+visa.list_of_visa[i].visa_type[1]+`, `+visa.list_of_visa[i].entry_type[1]+`</td>
                    <td>x</td>
                    <td>`+visa.list_of_visa[i].sale_price.currency+` `+getrupiah(visa.list_of_visa[i].sale_price.total_price)+`</td>
                    <td style="text-align:right;">`+visa.list_of_visa[i].sale_price.currency+` `+getrupiah(visa.list_of_visa[i].sale_price.total_price*visa.list_of_visa[i].pax_count)+`</td>
                </tr>`;

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
                price += visa.list_of_visa[i].pax_count * visa.list_of_visa[i].sale_price.total_price;
                commission += visa.list_of_visa[i].pax_count * (visa.list_of_visa[i].commission[0].amount * -1);
            }catch(err){

            }
        }
        text+=`</table>`;
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
                $text += visa.list_of_visa[i].pax_count + ' ' + visa.list_of_visa[i].pax_type[1];
                $text += ' @'+ visa.list_of_visa[i].sale_price.currency+ ' ' +getrupiah(visa.list_of_visa[i].sale_price.total_price) + '\n';
            }
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
                    <h6>`+visa.list_of_visa[0].sale_price.currency+` `+getrupiah(price)+`</h6>
                </div>
            </div>`;
        $text += '\n';
        $text += 'Grand Total: '+visa.list_of_visa[0].sale_price.currency + ' '+getrupiah(price);
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`
            <div class="row">
                <div class="col-lg-12" style="padding-bottom:15px;">
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                }
                text +=`</div>
            </div>
            <div class="row" id="show_commission" style="display: `+display+`;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight:bold;">Your Commission: `+visa.list_of_visa[0].sale_price.currency+` `+getrupiah(commission)+`</span><br>
                    </div>
                </div>
            </div>
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                    <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('passenger');" value="Copy">
               </div>
            </div>
            <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12" style="padding-bottom:10px;">
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br>
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

        $text = '';
        $text += 'Order Number: '+ visa.journey.name+'\n';
        $text += visa.journey.country + ' ' + visa.journey.departure_date + ' ' + visa.journey.state_visa + '\n';
        $text += visa.journey.state_visa + '\n'

        for(i in visa.passengers){
            if(i == 0)
                $text += '\nPassengers\n';
            $text += visa.passengers[i].sequence + ' ' + visa.passengers[i].title + ' ' + visa.passengers[i].first_name + ' ' + visa.passengers[i].last_name + '\n';
            if(visa.passengers[i].passport_number != '')
                $text += visa.passengers[i].passport_number + ' ' + visa.passengers[i].passport_expdate + '\n';
            $text += visa.passengers[i].visa.entry_type + ' ' + visa.passengers[i].visa.visa_type + ' ' + visa.passengers[i].visa.process + '\n';
            $text += 'Consulate: '+ visa.passengers[i].visa.immigration_consulate + '\n';
            $text += 'Process: ' + visa.passengers[i].visa.duration + ' Days';
            if(visa.journey.in_process_date != '')
                $text += ' from '+ visa.journey.in_process_date + '\n';
            else
                $text == '\n';
            for(j in visa.passengers[i].visa.requirements){
                if(j == 0)
                    $text += '\nRequirements\n';
                $text += visa.passengers[i].visa.requirements[j].name + '\n';
            }
            if(visa.passengers[i].visa.interview.needs == true){
                $text += '\nInterview\b'
                for(j in visa.passengers[i].visa.interview.interview_list){
                    $text += visa.passengers[i].visa.interview.interview_list[j].location + ' ' + visa.passengers[i].visa.interview.interview_list[j].datetime + '\n';
                }
            }
            if(visa.passengers[i].visa.biometrics.needs == true){
                $text += '\nInterview\b'
                for(j in visa.passengers[i].visa.biometrics.biometrics_list){
                    $text += visa.passengers[i].visa.biometrics.biometrics_list[j].location + ' ' + visa.passengers[i].visa.biometrics.biometrics_list[j].datetime + '\n';
                }
            }
            price_pax = 0;
            for(j in visa.passengers[i].visa.price){
                if(visa.passengers[i].visa.price[j].charge_code == 'total'){
                    price += visa.passengers[i].visa.price[j].amount;
                    price_pax += visa.passengers[i].visa.price[j].amount;
                    currency = visa.passengers[i].visa.price[j].currency;
                }else if(visa.passengers[i].visa.price[j].charge_code == 'rac'){
                    commission += (visa.passengers[i].visa.price[j].amount) *-1;
                }else if(visa.passengers[i].visa.price[j].charge_code == 'csc'){
                    price += visa.passengers[i].visa.price[j].amount;
                    price_pax += visa.passengers[i].visa.price[j].amount;
                }
            }
            $text += 'Price '+ visa.passengers[i].visa.price[j].currency + ' ' + getrupiah(price_pax) + '\n';
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
        $text += `\nGrand total `+currency+` `+getrupiah(price);
        try{
            display = document.getElementById('show_commission').style.display;
        }catch(err){
            display = 'none';
        }
        text+=`<div style="text-align:right; cursor:pointer; padding-bottom:10px;" onclick="show_repricing();"><i class="image-rounded-icon"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:30px; height:30px;"/></i></div>`;
        text+=`
        <div class="row" id="show_commission" style="display: `+display+`;">
            <div class="col-lg-12" style="text-align:center;">
                <div class="alert alert-success">
                    <span style="font-size:13px; font-weight:bold;">Your Commission: `+currency+` `+getrupiah(commission)+`</span><br>
                </div>
            </div>
        </div>`;
        text+=`
        <div class="row" style="margin-top:10px; text-align:center;">
           <div class="col-lg-12">
                <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data('review');" value="Copy">
           </div>
        </div>
        <div class="row" style="margin-top:10px; text-align:center;">
           <div class="col-lg-12" style="padding-bottom:10px;">
                <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br>
           </div>
        </div>
        `;

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
        document.getElementById('time_limit_input').value = time_limit;
        document.getElementById('visa_passenger').submit();
    }else{
        alert(error_log);
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
                if(document.getElementById(passenger_check.type+'_title'+passenger_check.number).value != passenger_data_pick[i].title ||
                   document.getElementById(passenger_check.type+'_first_name'+passenger_check.number).value != passenger_data_pick[i].first_name ||
                   document.getElementById(passenger_check.type+'_last_name'+passenger_check.number).value != passenger_data_pick[i].last_name)
                   if(document.getElementById(passenger_check.type+passenger_check.number).value == passenger_data_pick[i].seq_id)
                   error_log += "Search "+passenger_check.type+" "+passenger_check.number+" doesn't match!</br>\nPlease don't use inspect element!</br>\n";
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
                        if(template != 2){
                            text_requirements += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">`;
                        }else{
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
                pax_check.value = i;
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

function share_data(){
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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