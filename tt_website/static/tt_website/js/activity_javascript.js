sorting_value = '';
var myVar;
var activityAutoCompleteVar;
var activity_choices = [];
var check_pagination = 0;
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
        value:'Highest Score',
        status: false
    },
    {
        value:'Lowest Score',
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
        value:'Score',
        status: false
    }
]

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

function set_sub_category(category_id, current_sub_id=0){
    var text = `<option value="0" selected="">All Sub Categories</option>`;

    var temp_category = {};
    for(i in activity_categories){
       if(activity_categories[i].id == parseInt(category_id)){
           temp_category = activity_categories[i];
           break;
       }
    }
    if (current_sub_id == 0)
    {
        for(i in temp_category.sub_categories){
            text +=`<option value="`+temp_category.sub_categories[i].id+`">`+temp_category.sub_categories[i].name+`</option>`;
        }
    }
    else
    {
        for(i in temp_category.sub_categories){
            if (temp_category.sub_categories[i].id == current_sub_id)
            {
                text +=`<option value="`+temp_category.sub_categories[i].id+`" selected>`+temp_category.sub_categories[i].name+`</option>`;
            }
            else
            {
                text +=`<option value="`+temp_category.sub_categories[i].id+`">`+temp_category.sub_categories[i].name+`</option>`;
            }
        }
    }

    document.getElementById('activity_sub_category').innerHTML = text;
    $('#activity_sub_category').niceSelect('update');
//    activity_sub_category
}

function set_city(country_id, current_city_id=0){
    var text = `<option value="" selected="">All Cities</option>`;
    var country = {};
    for(i in activity_country){
       if(activity_country[i].id == parseInt(country_id)){
           country = activity_country[i];
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

    document.getElementById('activity_cities').innerHTML = text;
    $('#activity_cities').niceSelect('update');
}

function get_sub_cat_name(current_sub_id=0){
    search_sub_cat_name = 'All Sub Categories';
    sel_objs = $('#activity_category').select2('data');
    category_id = 0;
    for (i in sel_objs)
    {
        category_id = sel_objs[i].id;
    }

    var temp_category = {};
    for(i in activity_categories){
       if(activity_categories[i].id == parseInt(category_id)){
           temp_category = activity_categories[i];
           break;
       }
    }
    for(i in temp_category.sub_categories){
        if (temp_category.sub_categories[i].id == current_sub_id)
        {
            search_sub_cat_name = temp_category.sub_categories[i].name;
        }
    }

    document.getElementById('search_sub_category_name').innerHTML = search_sub_cat_name;
}

function get_city_search_name(current_city_id=0){
    search_city_name = 'All Cities';
    sel_objs = $('#activity_countries').select2('data');
    country_id = 0;
    for (i in sel_objs)
    {
        country_id = sel_objs[i].id;
    }
    var country = {};
    for(i in activity_country){
       if(activity_country[i].id == parseInt(country_id)){
           country = activity_country[i];
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

function auto_complete_activity(type, current_opt=0){
    sel_objs = $('#'+type).select2('data');
    temp_obj_id = 0;
    for (i in sel_objs)
    {
        temp_obj_id = sel_objs[i].id;
    }
    if (type == 'activity_countries')
    {
        set_city(temp_obj_id, current_opt);
    }
    else if (type == 'activity_category')
    {
        set_sub_category(temp_obj_id, current_opt);
    }
    auto_complete_text_activity(type);
}

function triggered(){
    try{
        if($state == 0){
            document.getElementById('search').hidden = true;
            $state = 1;
        }else{
            document.getElementById('search').hidden = false;
            $state = 0;
        }
    }catch(err){
        document.getElementById('search').hidden = false;
        $state = 0;
    }
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
            for(idrupiah=0;idrupiah<pj;idrupiah++){
                if((pj-idrupiah)%3==0 && idrupiah!=0){
                    priceshow+=",";
                }
                priceshow+=temp.charAt(idrupiah);
            }
            if(temp.split('.').length == 2){
                for(idrupiah=pj;idrupiah<pj+3;idrupiah++){
                    priceshow+=temp.charAt(idrupiah);
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

function pick_activity(val){
    console.log(val);
}

function update_pax(){
    reset_activity_table_detail();
}

function share_data(){
//    const el = document.createElement('textarea');
//    el.value = $test;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($test);
}

function print_activity_ticket(){
    for(i in act_get_booking.result.response.voucher_url)
    {
        openInNewTab(act_get_booking.result.response.voucher_url[i]);
    }
}

function activity_table_detail(){
   var grand_total = 0;
   var grand_commission = 0;
   text = '';
   name = activity_data.name.replace(/&#39;/g,"'");
   name = name.replace(/&amp;/g, '&');
   $test = '';
   $test += activity_data.name+'\n';
   if(activity_data.name != document.getElementById('product_type_title').innerHTML)
       $test += document.getElementById('product_type_title').innerHTML + '\n';

   var visit_date_txt = '<i class="fas fa-calendar-alt"></i> '+document.getElementById('activity_date').value;
   $test +='‣ Visit Date : '+document.getElementById('activity_date').value+
           '\n';
   try{
        if(document.getElementById('timeslot_1').value)
        {
            $test += '‣ Time slot: '+ document.getElementById('timeslot_1').options[document.getElementById('timeslot_1').selectedIndex].text+'\n\n';
            visit_date_txt += ' (' + document.getElementById('timeslot_1').options[document.getElementById('timeslot_1').selectedIndex].text + ')';
        }
   }catch(err){

   }
   document.getElementById('product_visit_date').innerHTML = visit_date_txt;
   currency = '';
   $test += '‣ Price \n';
   try{
       for (price in activity_date.service_charge_summary)
       {
            text+= `
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                    <span style="font-size:13px; font-weight:500;">
                        `+activity_date.service_charge_summary[price].pax_count+`x `;

            if(activity_date.service_charge_summary[price].pax_type == "YCD")
                text+=`Senior`;
            else if(activity_date.service_charge_summary[price].pax_type == "ADT")
                text+=`Adult`;
            else if(activity_date.service_charge_summary[price].pax_type == "CHD")
                text+=`Child`;
            else if(activity_date.service_charge_summary[price].pax_type == "INF")
                text+=`Infant`;
            currency = activity_date.service_charge_summary[price].service_charges[0].currency;
            text+=` @ `+currency;
            text+= getrupiah(activity_date.service_charge_summary[price].base_price)+`</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"><span style="font-size:13px; font-weight:500;">`+currency+` `;
            text+= getrupiah(activity_date.service_charge_summary[price].total_price)+`</span></div>`;
            text+= `</div>`;
            $test += activity_date.service_charge_summary[price].pax_count + 'x ' + activity_date.service_charge_summary[price].pax_type + ' Price @'+currency+' ' + getrupiah(activity_date.service_charge_summary[price].base_price)+'\n';
            grand_total += activity_date.service_charge_summary[price].total_price;
            grand_commission -= activity_date.service_charge_summary[price].total_commission;
       }
       if(document.getElementById('infant_passenger'))
       {
            if(document.getElementById('infant_passenger').value != 0){
               text+= `<div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px; font-weight:500;">`+document.getElementById('infant_passenger').value+`x Infant @`+currency+` 0</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                                <span style="font-size:13px; font-weight:500;">`+currency+` `;

               text+= getrupiah(0);
               $test += document.getElementById('infant_passenger').value.toString() + ' Infant Price @'+currency+' ' + getrupiah(0)+'\n';
               text+= `</span></div>
                   <div class="col-lg-12">
                        <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                   </div>
               </div>`;
           }
       }
   }catch(err){

   }

   if(additional_price != 0)
       $test += '‣ Additional price @'+currency+' '+getrupiah(additional_price)+'\n';

   if(grand_total != 0)
       $test+= '\n‣ Grand Total : '+currency+' '+ getrupiah(grand_total)+
               '\nPrices and availability may change at any time';
   if (additional_price)
   {
        text+= `<div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span style="font-size:13px; font-weight:500;">Additional Charge</span></div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"><span style="font-size:13px; font-weight:500;">`+currency+` </span><span id='additional_price' style="font-size:13px; font-weight:500;">`+additional_price+`</span></div>
           </div>`;
   }
   else
   {
        text+= `<div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span style="font-size:13px; font-weight:500;">Additional Charge</span></div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"><span style="font-size:13px; font-weight:500;">`+currency+` </span><span id='additional_price' style="font-size:13px; font-weight:500;">0</span></div>
           </div>`;
   }
   text+= `<hr style="padding:0px;">
           <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><span style="font-weight:bold">Grand Total</span></div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"><span id="total_price" style="font-weight:bold;`;
           if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+='cursor:pointer;';
           text+=`">`+currency+` `+getrupiah(grand_total);
           if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+=`<i class="fas fa-caret-down"></i>`;
           text+=`</span>
                </div>
           </div>`;
   if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && grand_total){
        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                try{
                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                        price_convert = (grand_total/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                        if(price_convert%1 == 0)
                            price_convert = parseInt(price_convert);
                        text+=`
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align: right;">
                                    <span style="font-weight:bold;">Estimated `+k+` `+getrupiah(price_convert)+`</span>
                                </div>
                            </div>`;
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }else{
            for(j in currency_rate_data.result.response.agent){ // asumsi hanya HO
                for(k in currency_rate_data.result.response.agent[j]){
                    try{
                        price_convert = (grand_total/currency_rate_data.result.response.agent[j][k].rate).toFixed(2);
                        if(price_convert%1 == 0)
                            price_convert = parseInt(price_convert);
                        text+=`
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align: right;">
                                    <span style="font-weight:bold;">Estimated `+k+` `+getrupiah(price_convert)+`</span>
                                </div>
                            </div>`;
                    }catch(err){
                        console.log(err);
                    }
                }
                break;
            }
        }
   }

   text+=`<div style="margin-top:10px;"></div>`;

   if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
       text+= print_commission(grand_commission,'show_commission', currency)

   text+=`
   <div class="row">
        <div class="col-lg-12" style="padding-bottom:10px;">
            <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
            share_data();
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                text+=`
                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                    <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
            } else {
                text+=`
                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                    <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
            }

            text+=`
            <div style="float:right">
                <button class="btn_standard_sm" type="button" onclick="copy_data();">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
        </div>
   </div>`;

           //cenedit
//           if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//               text+=`
//               <div class="row" style="margin-top:10px; text-align:center;">
//                   <div class="col-lg-12" style="padding-bottom:10px;">
//                        <input type="button" id="show_commission_button" class="primary-btn-white" value="Show YPM" style="width:100%;" onclick="show_commission();"/>
//                   </div>
//               </div>`;

   document.getElementById('activity_detail_table').innerHTML = text;
   if(agent_security.includes('book_reservation') == true)
        text_btn = `
       <center>
       <button type="button" class="btn-next primary-btn-ticket ld-ext-right" value="Next" onclick='check_detail();' style="width:100%;">
            Next
            <i class="fas fa-angle-right"></i>
            <div class="ld ld-ring ld-cycle"></div>
       </button><br/>
       </center>`;
   else
        text_btn = '';
   document.getElementById('activity_detail_next_btn').innerHTML = text_btn;
   document.getElementById('activity_detail_next_btn2').innerHTML = text_btn;

   if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
        var price_breakdown = {};
        var currency_breakdown = '';
        for(i in activity_date.service_charge_summary){
            if(currency_breakdown == ''){
                for(j in activity_date.service_charge_summary[i].service_charges){
                    currency_breakdown = activity_date.service_charge_summary[i].service_charges[j].currency;
                }
            }
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
            if(!price_breakdown.hasOwnProperty('NTA ACTIVITY'))
                price_breakdown['NTA ACTIVITY'] = 0;
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

            price_breakdown['FARE'] += activity_date.service_charge_summary[i].total_fare;
            price_breakdown['TAX'] += activity_date.service_charge_summary[i].total_tax;
            price_breakdown['BREAKDOWN'] = 0;
            price_breakdown['UPSELL'] += (activity_date.service_charge_summary[i].total_upsell * -1);
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                price_breakdown['COMMISSION'] += (activity_date.service_charge_summary[i].total_commission_vendor * -1);
            price_breakdown['NTA ACTIVITY'] += activity_date.service_charge_summary[i].total_nta_vendor;
            price_breakdown['SERVICE FEE'] += activity_date.service_charge_summary[i].total_fee_ho;
            price_breakdown['VAT'] += activity_date.service_charge_summary[i].total_vat_ho;
            price_breakdown['OTT'] += activity_date.service_charge_summary[i].total_price_ott;
            price_breakdown['TOTAL PRICE'] += activity_date.service_charge_summary[i].total_price;
            price_breakdown['NTA AGENT'] += activity_date.service_charge_summary[i].total_nta;
            if(user_login.co_agent_frontend_security.includes('agent_ho'))
                price_breakdown['COMMISSION HO'] += activity_date.service_charge_summary[i].total_commission_ho * -1;
        }
        // upsell
        if(typeof upsell_price_dict !== 'undefined'){
            for(i in upsell_price_dict){
                if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                    price_breakdown['CHANNEL UPSELL'] = 0;
                price_breakdown['CHANNEL UPSELL'] += upsell_price_dict[i];
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
}

function reset_activity_table_detail(){
   document.getElementById('activity_check_price').innerHTML = `
   <div style="text-align:center; margin-top:15px;">
       <button type="button" id="check_price_btn" class="btn-next primary-btn-ticket ld-ext-right" value="Check Price" onclick='activity_get_price_date();' style="width:200px; line-height:unset;">
            Check Price
       </button>
   </div>`;
   document.getElementById('product_visit_date').innerHTML = '';
   document.getElementById('activity_detail_table').innerHTML = '';
   document.getElementById('activity_detail_next_btn').innerHTML = '';
   document.getElementById('activity_detail_next_btn2').innerHTML = '';
}


function activity_table_detail2(pagetype){
   if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){
        tax = 0;
        fare = 0;
        total_price = 0;
        total_price_provider = [];
        price_provider = 0;
        commission = 0;
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
        type_amount_repricing = ['Repricing'];
        for(i in all_pax){
            if(price_arr_repricing.hasOwnProperty(all_pax[i].pax_type) == false){
                price_arr_repricing[all_pax[i].pax_type] = {}
                pax_type_repricing.push([all_pax[i].pax_type, all_pax[i].pax_type]);
            }
            price_arr_repricing[all_pax[i].pax_type][all_pax[i].first_name +all_pax[i].last_name] = {
                'Fare': 0,
                'Tax': 0,
                'Repricing': 0
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
                        <div class="col-lg-6" id="`+l+`_`+k+`">`+l+`</div>
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
   var grand_total = 0;
   var grand_commission = 0;
   text = '';
   $test = '';
   if (document.getElementById('product_title'))
   {
       $test += document.getElementById('product_title').innerHTML+
           '\n';
   }
   if (document.getElementById('product_type_title'))
   {
       $test += document.getElementById('product_type_title').innerHTML+
           '\n';
   }
   var visit_date_txt = price.date.split('-')[2]+' '+month[price.date.split('-')[1]]+' '+price.date.split('-')[0];
   $test += '‣ Visit Date : '+price.date.split('-')[2]+' '+month[price.date.split('-')[1]]+' '+price.date.split('-')[0]+
           '\n';
   if(time_slot_pick != '')
   {
       $test += '‣ Time slot: ' + time_slot_pick + '\n\n';
       visit_date_txt += ' (' + time_slot_pick + ')';
   }
   else
   {
       $test += '\n';
   }

   document.getElementById('product_visit_date').innerHTML = visit_date_txt;

   try{
        if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){
           $test += '‣ Contact Person:\n';
           $test += contact[0].title + ' ' + contact[0].first_name + ' ' + contact[0].last_name + '\n';
           $test += contact[0].email + '\n';
           $test += contact[0].calling_code + ' - ' + contact[0].mobile + '\n\n';
        }
        for(i in all_pax){
            if(i == 0)
                $test += '‣ Passengers:\n';
            $test += all_pax[i].title + ' ' + all_pax[i].first_name + ' ' + all_pax[i].last_name + '\n';
        }
        $test +='\n';
   }catch(err){
        console.log(err) //ada element yg tidak ada
   }

   $test += '‣ Price:\n';
   try{
       for (pri in price.service_charge_summary)
       {
            text+= `<div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;">`+price.service_charge_summary[pri].pax_count+`x `;

                if(price.service_charge_summary[pri].pax_type == "YCD")
                    text+=`Senior`;
                else if(price.service_charge_summary[pri].pax_type == "ADT")
                    text+=`Adult`;
                else if(price.service_charge_summary[pri].pax_type == "CHD")
                    text+=`Child`;
                else if(price.service_charge_summary[pri].pax_type == "INF")
                    text+=`Infant`;
            text+=`@ `+price.service_charge_summary[pri].service_charges[0].currency+` `;
            price_type = {
                'fare': 0,
                'tax':  0,
                'rac':  0,
                'roc':  0,
                'disc':  0,
                'currency': price.service_charge_summary[pri].service_charges[0].currency
            }
            for(x in price.service_charge_summary[pri].service_charges){
                if(price.service_charge_summary[pri].service_charges[x].charge_code == 'fare'){
                    price_type['fare'] += price.service_charge_summary[pri].service_charges[x].total;
                }else if(price.service_charge_summary[pri].service_charges[x].charge_code == 'tax'){
                    price_type['tax'] += price.service_charge_summary[pri].service_charges[x].total;
                }else if(price.service_charge_summary[pri].service_charges[x].charge_code == 'roc'){
                    price_type['roc'] += price.service_charge_summary[pri].service_charges[x].total;
                }else if(price.service_charge_summary[pri].service_charges[x].charge_code == 'rac'){
                    price_type['rac'] += price.service_charge_summary[pri].service_charges[x].total;
                }else if(price.service_charge_summary[pri].service_charges[x].charge_code == 'disc'){
                    price_type['disc'] += price.service_charge_summary[pri].service_charges[x].total;
                }
            }
            if(typeof upsell_price_dict !== 'undefined' && upsell_price_dict.hasOwnProperty(price.service_charge_summary[pri].pax_type)){ //with upsell
                text+= getrupiah(price.service_charge_summary[pri].base_price + (upsell_price_dict[price.service_charge_summary[pri].pax_type] / price.service_charge_summary[pri].pax_count))+`</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"><span style="font-size:13px; font-weight:500;">`+price.service_charge_summary[pri].service_charges[0].currency+` `;
                text+= getrupiah(price.service_charge_summary[pri].total_price + (upsell_price_dict[price.service_charge_summary[pri].pax_type]))+`</span></div>`;
                $test += price.service_charge_summary[pri].pax_count + ' ' + price.service_charge_summary[pri].pax_type + ' Price @'+price.service_charge_summary[pri].service_charges[0].currency+' ' + getrupiah(price.service_charge_summary[pri].base_price + (upsell_price_dict[price.service_charge_summary[pri].pax_type] / price.service_charge_summary[pri].pax_count))+'\n';
            }else{
                text+= getrupiah(price.service_charge_summary[pri].base_price)+`</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"><span style="font-size:13px; font-weight:500;">`+price.service_charge_summary[pri].service_charges[0].currency+` `;
                text+= getrupiah(price.service_charge_summary[pri].total_price)+`</span></div>`;
                $test += price.service_charge_summary[pri].pax_count + ' ' + price.service_charge_summary[pri].pax_type + ' Price @'+price.service_charge_summary[pri].service_charges[0].currency+' ' + getrupiah(price.service_charge_summary[pri].base_price)+'\n';
            }

            try{
                total_price_provider.push({
                    'provider': response.provider_code,
                    'price': price_type
                });
            }catch(err){
                console.log(err);
            }

            text+= `</div>`;
            grand_total += price.service_charge_summary[pri].total_price;
            grand_commission -= price.service_charge_summary[pri].total_commission;
            if(typeof upsell_price_dict !== 'undefined' && upsell_price_dict.hasOwnProperty(price.service_charge_summary[pri].pax_type)){ //with upsell
                grand_commission += upsell_price_dict[price.service_charge_summary[pri].pax_type]
            }
       }
       if (passenger['infant'] && passenger['infant'] != 0)
       {
           text+= `<div class="row">
                       <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;">`+passenger['infant']+`x Infant @ `+price_type.currency+` 0</span>
                       </div>
                       <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                            <span style="font-size:13px; font-weight:500;">`+price_type.currency+` `;

           text+= getrupiah(0);
           $test += passenger['infant'].toString() + ' Infant Price @'+price_type.currency+' ' + getrupiah(0)+'\n';
           text+= `</span></div>
               <div class="col-lg-12">
                   <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
               </div>
           </div>`;
       }

   }catch(err){
        console.log(err)
   }

   if(additional_price != 0)
       $test += '‣ Additional price @'+price_type.currency+' '+getrupiah(additional_price)+'\n';

   try{
        for(i in upsell_price_dict)
            grand_total += upsell_price_dict[i];
   }catch(err){
   }

   $test+= '\n‣ Grand Total : '+price_type.currency+' '+ getrupiah(grand_total)+
           '\nPrices and availability may change at any time';
   if (additional_price)
   {
        text+= `<div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span style="font-size:13px; font-weight:500;">Additional Charge</span></div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"><span style="font-size:13px; font-weight:500;">`+price_type.currency+` </span><span id='additional_price'>`+additional_price+`</span></div>
           </div>`;
   }
   else
   {
        text+= `<div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span style="font-size:13px; font-weight:500;">Additional Charge</span></div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"><span style="font-size:13px; font-weight:500;">`+price_type.currency+` </span><span id='additional_price' style="font-size:13px; font-weight:500;">0</span></div>
           </div>`;
   }
   text += `<hr style="padding:0px;">`;
//    try{
//        if(upsell_price != 0){
//            text+=`<div class="row" style="padding-bottom:15px;">`
//            text+=`
//            <div class="col-lg-7" style="text-align:left;">
//                <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
//            </div>
//            <div class="col-lg-5" style="text-align:right;">`;
//            text+=`
//                <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(upsell_price)+`</span><br/>`;
//            text+=`</div></div>`;
//        }
//    }catch(err){
//        console.log(err) //ada element yg tidak ada
//    }
   text+= `
           <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span style="font-weight:bold">Grand Total</span>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                    <span id="total_price" style="font-weight:bold;`;
                if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                    text+= "cursor:pointer;";
                }
                text+= `">`+price_type.currency+` `+getrupiah(grand_total);
                if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                    text+= ` <i class="fas fa-caret-down"></i>`;
                }
                text+=`</span>
                </div>`;
                if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && grand_total){
                    if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                        for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                            try{
                                if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == price_type.currency){
                                    price_convert = (Math.ceil(grand_total)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                    if(price_convert%1 == 0)
                                        price_convert = parseInt(price_convert);
                                    text+=`
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align: right;">
                                            <span style="font-weight:bold;">Estimated `+k+` `+getrupiah(price_convert)+`</span>
                                        </div>`;
                                }
                            }catch(err){
                                console.log(err);
                            }
                        }
                    }
               }
               if(document.URL.split('/')[document.URL.split('/').length-2] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                   text +=`<div class="col-lg-12 mt-2" style="text-align:right;"><img alt="Bank" src="/static/tt_website/images/icon/symbol/upsell_price.png" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
               }
           text+=`
           </div>
           <div style="margin-top:15px;"></div>`;

           if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
               text+= print_commission(grand_commission,'show_commission', price_type.currency)

           text+=`
           <div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share this on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website/images/logo/apps/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website/images/logo/apps/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website/images/logo/apps/telegram.png"/></a>
                            <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website/images/logo/apps/email.png"/></a>`;
                    } else {
                        text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website/images/logo/apps/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website/images/logo/apps/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website/images/logo/apps/telegram.png"/></a>
                            <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website/images/logo/apps/email.png"/></a>`;
                    }
                text+=`
                    <div style="float:right">
                        <button class="btn_standard_sm" type="button" onclick="copy_data();">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
           </div>`;

//           text+=`
//           <div class="row" style="margin-top:10px; text-align:center;">
//               <div class="col-xs-12">
//                     <input type="button" class="primary-btn-white" onclick="copy_data();" value="Copy" style="width:100%;"/>
//               </div>
//           </div>

           text+=`</div></div>`;

           //cenedit
//           if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//               text+= `
//               <div class="row" style="margin-top:10px; text-align:center;">
//                   <div class="col-xs-12" style="padding-bottom:10px;">
//                        <input type="button" id="show_commission_button" class="primary-btn-white" value="Show YPM" style="width:100%;" onclick="show_commission();"/>
//                   </div>
//               </div>`;
   document.getElementById('activity_detail_table').innerHTML = text;

   if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
        var price_breakdown = {};
        var currency_breakdown = '';
        for(i in price.service_charge_summary){
            if(currency_breakdown == ''){
                for(j in price.service_charge_summary[i].service_charges){
                    currency_breakdown = price.service_charge_summary[i].service_charges[j].currency;
                }
            }
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
            if(!price_breakdown.hasOwnProperty('NTA ACTIVITY'))
                price_breakdown['NTA ACTIVITY'] = 0;
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

            price_breakdown['FARE'] += price.service_charge_summary[i].total_fare;
            price_breakdown['TAX'] += price.service_charge_summary[i].total_tax;
            price_breakdown['BREAKDOWN'] = 0;
            price_breakdown['UPSELL'] += price.service_charge_summary[i].total_upsell;
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                price_breakdown['COMMISSION'] += (price.service_charge_summary[i].total_commission_vendor * -1);
            price_breakdown['NTA ACTIVITY'] += price.service_charge_summary[i].total_nta_vendor;
            price_breakdown['SERVICE FEE'] += price.service_charge_summary[i].total_fee_ho;
            price_breakdown['VAT'] += price.service_charge_summary[i].total_vat_ho;
            price_breakdown['OTT'] += price.service_charge_summary[i].total_price_ott;
            price_breakdown['TOTAL PRICE'] += price.service_charge_summary[i].total_price;
            price_breakdown['NTA AGENT'] += price.service_charge_summary[i].total_nta;
            if(user_login.co_agent_frontend_security.includes('agent_ho'))
                price_breakdown['COMMISSION HO'] += price.service_charge_summary[i].total_commission_ho * -1;
        }

        // upsell
        if(typeof upsell_price_dict !== 'undefined'){
            for(i in upsell_price_dict){
                if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                    price_breakdown['CHANNEL UPSELL'] = 0;
                price_breakdown['CHANNEL UPSELL'] += upsell_price_dict[i];
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
   if (pagetype == 'passenger')
   {
        text_btn = `
            <center>
            <button type="button" class="btn-next primary-btn next-passenger-train ld-ext-right" value="Next" onclick='next_disabled();check_passenger(`+adult+`,`+senior+`,`+child+`,`+infant+`);' style="width:100%;">
                Next
                <div class="ld ld-ring ld-cycle"></div>
            </button>
            <br/>
            </center>
       `;
       document.getElementById('activity_detail_next_btn').innerHTML = text_btn;
   }
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

function activity_search_form_submit(){
    $('.button-search').addClass("running");
    document.getElementById('activity_search_form').submit();
}

function check_flight(value){
    var checkword = "^[A-Z0-9][A-Z0-9][0-9]{0,4}$";
    if(value.match(checkword)!=null){
        return true;
    }else{

        return false;
    }
}

//check detail
function check_detail(){
    text = '' ;
    check = 0;
    pax = 0;
    $('.btn-next').addClass("running");
    $('.btn-next').prop('disabled', true);

    date = document.getElementById('activity_date').value.split(' ')[2]+'-'+month[document.getElementById('activity_date').value.split(' ')[1]]+'-'+document.getElementById('activity_date').value.split(' ')[0]
    //check tiket
    if(activity_date.available == false)
        text+='Visit date not available, please pick other date!\n';

    //check pax
    for (pax_check in activity_type[activity_type_pick].skus)
    {
        low_sku_id_check = String(activity_type[activity_type_pick].skus[pax_check].sku_id).toLowerCase();
        if(activity_type[activity_type_pick].skus[pax_check].minPax <= document.getElementById(low_sku_id_check+'_passenger').value)
        {
            pax += parseInt(document.getElementById(low_sku_id_check+'_passenger').value);
        }
        else
        {
            text += 'Minimum passenger for ' + activity_type[activity_type_pick].skus[pax_check].title + ' is ' + activity_type[activity_type_pick].skus[pax_check].minPax +'!</br>\n';
        }
    }

    if(pax > activity_type[activity_type_pick].maxPax)
        text+= 'Total Passenger must be below than '+activity_type[activity_type_pick].maxPax+'</br>\n';
    if(pax < activity_type[activity_type_pick].minPax && pax > 0)
        text+= 'Total Passenger must be '+activity_type[activity_type_pick].minPax+' or more</br>\n';
    if(pax <= 0)
        text+= 'Total Passenger must be more than 0';

    //check perbooking
    for(i in activity_type[activity_type_pick].options.perBooking){
        if(activity_type[activity_type_pick].options.perBooking[i].name != 'Guest age' &&
           activity_type[activity_type_pick].options.perBooking[i].name != 'Full name' &&
           activity_type[activity_type_pick].options.perBooking[i].name != 'Gender' &&
           activity_type[activity_type_pick].options.perBooking[i].name != 'Nationality' &&
           activity_type[activity_type_pick].options.perBooking[i].name != 'Date of birth'){
            if(activity_type[activity_type_pick].options.perBooking[i].required == true){
                //use regex bemyguest
                if(activity_type[activity_type_pick].options.perBooking[i].formatRegex != false){
                    if(!document.getElementById('perbooking'+i).value || check_regex(document.getElementById('perbooking'+i).value, activity_type[activity_type_pick].options.perBooking[i].formatRegex)==false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }
                //no regex
                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 1){
                    if(document.getElementById('perbooking'+i).value == '')
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 2){
                    for(j in activity_type[activity_type_pick].options.perBooking[i].items){
                        if(document.getElementById('perbooking'+i+j).checked==true)
                            check=1;
                    }
                    if(check==0)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                    check=0;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 3)
                {
                    if(!document.getElementById('perbooking'+i).value || check_number(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }

                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 4)
                {
                    if(!document.getElementById('perbooking'+i).value || (check_word(document.getElementById('perbooking'+i).value) == false && activity_type[activity_type_pick].options.perBooking[i].name != 'Flight Number'))
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }

                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 6)
                {
                    if(!document.getElementById('perbooking'+i).value || check_date(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }

                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 7){
                    console.log(document.getElementById('perbooking'+i));

                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 8){
                    console.log(document.getElementById('perbooking'+i));

                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 10)
                {
                    if(!document.getElementById('perbooking'+i).value || check_time(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }

                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 11)
                {
                    if(check_date_time(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }
                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 12)
                {
                    if(!document.getElementById('perbooking'+i).value || check_word(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }
                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 14)
                {
                    if(!document.getElementById('perbooking'+i).value || check_flight(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }
                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 50)
                {
                    if(!document.getElementById('perbooking'+i).value)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'</br>\n';
                }
            }
        }
    }

    //cek timeslot
    if(activity_type[activity_type_pick].timeslots.length > 0){

        var sel = document.getElementById('timeslot_1');
        if (sel.value != '') {
            check=1;
        }
        if(check==0){
            text+= 'Please pick timeslot!</br>\n';
        }
    }

    if(text==''){
        document.getElementById('additional_price_input').value = document.getElementById('additional_price').innerHTML;
        document.getElementById('time_limit_input').value = time_limit;
        update_sell_activity();

    }else{
        document.getElementById('show_error_log').innerHTML = text;
        $("#myModalErrorDetail").modal('show');
        $('.btn-next').removeClass("running");
        $('.btn-next').prop('disabled', false);
    }
}

function check_passenger(adult, senior, child, infant){
    $('.loader-rodextrip').fadeIn();
    //booker
    error_log = '';
    //check booker jika teropong
    length_name = 100;
    if(length_name > activity_carrier_data.adult_length_name)
    {
        length_name = activity_carrier_data.adult_length_name;
    }

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
                    length_name) == false){
        error_log+= 'Total of Booker name maximum '+length_name+' characters!</br>\n';
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
    }if(document.getElementById('booker_first_name').value == '' || check_word(document.getElementById('booker_first_name').value) == false){
        if(document.getElementById('booker_first_name').value == '')
            error_log+= 'Please fill booker first name!</br>\n';
        else if(check_word(document.getElementById('booker_first_name').value) == false)
            error_log+= 'Please use alpha characters for booker first name!</br>\n';
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
        if(check_phone_number(document.getElementById('booker_phone').value) == false)
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

    try{
        var radios = document.getElementsByName('myRadios');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                booker_copy = radios[j].value;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        if(booker_copy == 'yes')
            if(document.getElementById('booker_title').value != document.getElementById('adult_title1').value ||
               document.getElementById('booker_first_name').value != document.getElementById('adult_first_name1').value ||
               document.getElementById('booker_last_name').value != document.getElementById('adult_last_name1').value)
                    error_log += 'Copy booker to passenger true, value title, first name, and last name has to be same!</br>\n';
    }
    catch{
        booker_copy = 'no';
    }

    length_name = 100;
    if(length_name > activity_carrier_data.adult_length_name)
    {
        length_name = activity_carrier_data.adult_length_name;
    }
    //adult
    for(i=1;i<=adult;i++){

        if(check_name(document.getElementById('adult_title'+i).value,
            document.getElementById('adult_first_name'+i).value,
            document.getElementById('adult_last_name'+i).value,
            length_name) == false){
            error_log+= 'Total of adult '+i+' name maximum '+length_name+' characters!</br>\n';
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
        }if(document.getElementById('adult_first_name'+i).value == '' || check_word(document.getElementById('adult_first_name'+i).value) == false){
            if(document.getElementById('adult_first_name'+i).value == '')
                error_log+= 'Please input first name of adult guest '+i+'!</br>\n';
            else if(check_word(document.getElementById('adult_first_name'+i).value) == false)
                error_log+= 'Please use alpha characters first name of adult guest '+i+'!</br>\n';
            document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
        }if(document.getElementById('adult_last_name'+i).value != ''){
            if(check_word(document.getElementById('adult_last_name'+i).value) == false)
            {
                error_log+= 'Please use alpha characters last name of adult guest '+i+'!</br>\n';
                document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
            }
            else
            {
                document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
            }
        }else{
            document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
        }
        if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
            error_log+= 'Birth date wrong for adult guest '+i+'!</br>\n';
            document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
        }if(document.getElementById('adult_nationality'+i+'_id').value == ''){
            error_log+= 'Please fill nationality for adult guest '+i+'!</br>\n';
            document.getElementById('adult_nationality'+i+'_id').style['border-color'] = 'red';
        }else{
            document.getElementById('adult_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_passport_number'+i).value != '' ||
            document.getElementById('adult_passport_expired_date'+i).value != '' ||
            document.getElementById('adult_country_of_issued'+i+'_id').value != ''){
            if(document.getElementById('adult_passport_number'+i).value == ''){
                error_log+= 'Please fill passport number for adult guest '+i+'!</br>\n';
                document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('adult_passport_expired_date'+i).value == ''){
                error_log+= 'Please fill passport expired date for adult guest '+i+'!</br>\n';
                document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('adult_country_of_issued'+i+'_id').value == ''){
                error_log+= 'Please fill country of issued for adult guest '+i+'!</br>\n';
                $("#adult_country_of_issued"+i+"_id").each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid red');
                });
            }else{
                $("#adult_country_of_issued"+i+"_id").each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                });
            }

            if(document.getElementById('adult_identity_first_name'+i).value != '')
            {
                if(check_name(document.getElementById('adult_title'+i).value,
                    document.getElementById('adult_identity_first_name'+i).value,
                    document.getElementById('adult_identity_last_name'+i).value,
                    length_name) == false){
                    error_log+= 'Total of adult '+i+' identity name maximum '+length_name+' characters!</br>\n';
                    document.getElementById('adult_identity_first_name'+i).style['border-color'] = 'red';
                    document.getElementById('adult_identity_last_name'+i).style['border-color'] = 'red';
                }else if(check_word(document.getElementById('adult_identity_first_name'+i).value) == false){
                    error_log+= 'Please use alpha characters identity first name of adult passenger '+i+'!</br>\n';
                    document.getElementById('adult_identity_first_name'+i).style['border-color'] = 'red';
                }else if(document.getElementById('adult_identity_last_name'+i).value != '' && check_word(document.getElementById('adult_identity_last_name'+i).value) == false){
                    error_log+= 'Please use alpha characters identity last name of adult passenger '+i+'!</br>\n';
                    document.getElementById('adult_identity_last_name'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('adult_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                    document.getElementById('adult_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                }
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
       perpax_count = 1
       for(j in detail.perPax){
           if(detail.perPax[j].name != 'Gender' && detail.perPax[j].name !=  'Full name' && detail.perPax[j].name !=  'Guest age' && detail.perPax[j].name !=  'Nationality' && detail.perPax[j].name !=  'Date of birth' && detail.perPax[j].name !=  'Passport number' && detail.perPax[j].name !=  'Passport expiry date'){
                if(detail.perPax[j].required == true){
                    //use regex bemyguest
                    if(detail.perPax[j].formatRegex != false){
                        if(check_regex(document.getElementById('adult_perpax'+i+'_'+perpax_count).value, detail.perPax[j].formatRegex)==false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                    //no regex
                    else if(detail.perPax[j].inputType == 1){
                        if(document.getElementById('adult_perpax'+i+'_'+perpax_count).value=='')
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }else if(detail.perPax[j].inputType == 2){
                        k_item_count = 1
                        for(k in detail.perPax[j].items){
                            if(document.getElementById('adult_perpax'+i+'_'+perpax_count+'_'+k_item_count).checked==true)
                            {
                                check=1;
                            }
                            k_item_count += 1;
                        }
                        if(check==0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                        check=0;
                    }else if(detail.perPax[j].inputType == 3)
                    {
                        if(check_number(document.getElementById('adult_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 4)
                    {
                        if(check_word(document.getElementById('adult_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 6)
                    {
                        if(check_date(document.getElementById('adult_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 7){
                        if(document.getElementById('adult_perpax'+i+'_'+perpax_count).files.length == 0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }

                    }else if(detail.perPax[j].inputType == 8){
                        if(document.getElementById('adult_perpax'+i+'_'+perpax_count).files.length == 0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }

                    }else if(detail.perPax[j].inputType == 10)
                    {
                        if(check_time(document.getElementById('adult_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 11)
                    {
                        if(check_date_time(document.getElementById('adult_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 12)
                    {
                        if(check_word(document.getElementById('adult_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 14)
                    {
                        if(check_flight(document.getElementById('adult_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 50)
                    {
                        if(check_word(document.getElementById('adult_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
                        }
                    }
                }
           }
           else if(detail.perPax[j].name == 'Passport number')
           {
               if(detail.perPax[j].required == true){
                   if(document.getElementById('adult_passport_number'+i).value=='')
                       error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
               }
           }
           else if(detail.perPax[j].name == 'Passport expiry date')
           {
               if(detail.perPax[j].required == true){
                   if(document.getElementById('adult_passport_expired_date'+i).value=='')
                       error_log+= 'Please check your '+detail.perPax[j].name+' for adult guest '+i+'</br>\n';
               }
           }
           perpax_count += 1;
       }
   }

   length_name = 100;
   if(length_name > activity_carrier_data.adult_length_name)
   {
       length_name = activity_carrier_data.adult_length_name;
   }
   //senior
   for(i=1;i<=senior;i++){
       if(check_name(document.getElementById('senior_title'+i).value,
       document.getElementById('senior_first_name'+i).value,
       document.getElementById('senior_last_name'+i).value,
       length_name) == false){
           error_log+= 'Total of senior '+i+' name maximum '+length_name+' characters!</br>\n';
           document.getElementById('senior_first_name'+i).style['border-color'] = 'red';
           document.getElementById('senior_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('senior_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('senior_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('senior_title'+i).value == ''){
            error_log+= 'Please choose title of senior passenger '+i+'!</br>\n';
           $("#senior_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid red');
            });
       }else{
           $("#senior_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
       }if(document.getElementById('senior_first_name'+i).value == '' || check_word(document.getElementById('senior_first_name'+i).value) == false){
           if(document.getElementById('senior_first_name'+i).value == '')
               error_log+= 'Please input first name of senior guest '+i+'!</br>\n';
           else if(check_word(document.getElementById('senior_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of senior guest '+i+'!</br>\n';
           document.getElementById('senior_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('senior_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('senior_last_name'+i).value != ''){
           if(check_word(document.getElementById('senior_last_name'+i).value) == false)
           {
                error_log+= 'Please use alpha characters last name of senior guest '+i+'!</br>\n';
                document.getElementById('senior_last_name'+i).style['border-color'] = 'red';
           }
           else
           {
                document.getElementById('senior_last_name'+i).style['border-color'] = '#EFEFEF';
           }
       }else{
           document.getElementById('senior_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('senior_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for senior guest '+i+'!</br>\n';
           document.getElementById('senior_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('senior_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('senior_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for senior guest '+i+'!</br>\n';
           document.getElementById('senior_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('senior_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }if(document.getElementById('senior_passport_number'+i).value != '' ||
            document.getElementById('senior_passport_expired_date'+i).value != '' ||
            document.getElementById('senior_country_of_issued'+i+'_id').value != ''){
            if(document.getElementById('senior_passport_number'+i).value == ''){
                error_log+= 'Please fill passport number for senior guest '+i+'!</br>\n';
                document.getElementById('senior_passport_number'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('senior_passport_number'+i).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('senior_passport_expired_date'+i).value == ''){
                error_log+= 'Please fill passport expired date for senior guest '+i+'!</br>\n';
                document.getElementById('senior_passport_expired_date'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('senior_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('senior_country_of_issued'+i+'_id').value == ''){
                error_log+= 'Please fill country of issued for senior guest '+i+'!</br>\n';
                $("#senior_country_of_issued"+i+"_id").each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid red');
                });
            }else{
                $("#senior_country_of_issued"+i+"_id").each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                });
            }



            if(document.getElementById('senior_identity_first_name'+i).value != '')
            {
                if(check_name(document.getElementById('senior_title'+i).value,
                    document.getElementById('senior_identity_first_name'+i).value,
                    document.getElementById('senior_identity_last_name'+i).value,
                    length_name) == false){
                    error_log+= 'Total of senior '+i+' identity name maximum '+length_name+' characters!</br>\n';
                    document.getElementById('senior_identity_first_name'+i).style['border-color'] = 'red';
                    document.getElementById('senior_identity_last_name'+i).style['border-color'] = 'red';
                }else if(check_word(document.getElementById('senior_identity_first_name'+i).value) == false){
                    error_log+= 'Please use alpha characters identity first name of senior passenger '+i+'!</br>\n';
                    document.getElementById('senior_identity_first_name'+i).style['border-color'] = 'red';
                }else if(document.getElementById('senior_identity_last_name'+i).value != '' && check_word(document.getElementById('senior_identity_last_name'+i).value) == false){
                    error_log+= 'Please use alpha characters identity last name of senior passenger '+i+'!</br>\n';
                    document.getElementById('senior_identity_last_name'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('senior_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                    document.getElementById('senior_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                }
            }
       }
       perpax_count = 1
       for(j in detail.perPax){
           if(detail.perPax[j].name != 'Gender' && detail.perPax[j].name !=  'Full name' && detail.perPax[j].name !=  'Guest age' && detail.perPax[j].name !=  'Nationality' && detail.perPax[j].name !=  'Date of birth' && detail.perPax[j].name !=  'Passport number' && detail.perPax[j].name !=  'Passport expiry date'){
                if(detail.perPax[j].required == true){
                    //use regex bemyguest
                    if(detail.perPax[j].formatRegex != false){
                        if(check_regex(document.getElementById('senior_perpax'+i+'_'+perpax_count).value, detail.perPax[j].formatRegex)==false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                    //no regex
                    else if(detail.perPax[j].inputType == 1){
                        if(document.getElementById('senior_perpax'+i+'_'+perpax_count).value=='')
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }else if(detail.perPax[j].inputType == 2){
                        k_item_count = 1
                        for(k in detail.perPax[j].items){
                            if(document.getElementById('senior_perpax'+i+'_'+perpax_count+'_'+k_item_count).checked==true)
                            {
                                check=1;
                            }
                            k_item_count += 1;
                        }
                        if(check==0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                        check=0;
                    }else if(detail.perPax[j].inputType == 3)
                    {
                        if(check_number(document.getElementById('senior_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 4)
                    {
                        if(check_word(document.getElementById('senior_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 6)
                    {
                        if(check_date(document.getElementById('senior_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 7){
                        if(document.getElementById('senior_perpax'+i+'_'+perpax_count).files.length == 0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }

                    }else if(detail.perPax[j].inputType == 8){
                        if(document.getElementById('senior_perpax'+i+'_'+perpax_count).files.length == 0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }

                    }else if(detail.perPax[j].inputType == 10)
                    {
                        if(check_time(document.getElementById('senior_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 11)
                    {
                        if(check_date_time(document.getElementById('senior_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 12)
                    {
                        if(check_word(document.getElementById('senior_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 14)
                    {
                        if(check_flight(document.getElementById('senior_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 50)
                    {
                        if(check_word(document.getElementById('senior_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
                        }
                    }
                }
           }
           else if(detail.perPax[j].name == 'Passport number')
           {
               if(detail.perPax[j].required == true){
                   if(document.getElementById('senior_passport_number'+i).value=='')
                       error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
               }
           }
           else if(detail.perPax[j].name == 'Passport expiry date')
           {
               if(detail.perPax[j].required == true){
                   if(document.getElementById('senior_passport_expired_date'+i).value=='')
                       error_log+= 'Please check your '+detail.perPax[j].name+' for senior guest '+i+'</br>\n';
               }
           }
           perpax_count += 1;
       }
   }

   length_name = 100;
   if(length_name > activity_carrier_data.child_length_name)
   {
       length_name = activity_carrier_data.child_length_name;
   }
   //child
   for(i=1;i<=child;i++){
       if(check_name(document.getElementById('child_title'+i).value,
       document.getElementById('child_first_name'+i).value,
       document.getElementById('child_last_name'+i).value,
       length_name) == false){
           error_log+= 'Total of child '+i+' name maximum '+length_name+' characters!</br>\n';
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
       }if(document.getElementById('child_first_name'+i).value == '' || check_word(document.getElementById('child_first_name'+i).value) == false){
           if(document.getElementById('child_first_name'+i).value == '')
               error_log+= 'Please input first name of child guest '+i+'!</br>\n';
           else if(check_word(document.getElementById('child_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of child guest '+i+'!</br>\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_last_name'+i).value != ''){
           if(check_word(document.getElementById('child_last_name'+i).value) == false)
           {
                error_log+= 'Please use alpha characters last name of child guest '+i+'!</br>\n';
                document.getElementById('child_last_name'+i).style['border-color'] = 'red';
           }
           else
           {
                document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
           }
       }else{
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('child_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for child guest '+i+'!</br>\n';
           document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for child guest '+i+'!</br>\n';
           document.getElementById('child_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('child_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_passport_number'+i).value != '' ||
          document.getElementById('child_passport_expired_date'+i).value != '' ||
          document.getElementById('child_country_of_issued'+i+'_id').value != ''){
           if(document.getElementById('child_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for child guest '+i+'!</br>\n';
               document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('child_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for child guest '+i+'!</br>\n';
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
               error_log+= 'Please fill country of issued for child guest '+i+'!</br>\n';
               $("#child_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid red');
               });
           }else{
               $("#child_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
               });
           }


            if(document.getElementById('child_identity_first_name'+i).value != '')
            {
                if(check_name(document.getElementById('child_title'+i).value,
                    document.getElementById('child_identity_first_name'+i).value,
                    document.getElementById('child_identity_last_name'+i).value,
                    length_name) == false){
                    error_log+= 'Total of child '+i+' identity name maximum '+length_name+' characters!</br>\n';
                    document.getElementById('child_identity_first_name'+i).style['border-color'] = 'red';
                    document.getElementById('child_identity_last_name'+i).style['border-color'] = 'red';
                }else if(check_word(document.getElementById('child_identity_first_name'+i).value) == false){
                    error_log+= 'Please use alpha characters identity first name of child passenger '+i+'!</br>\n';
                    document.getElementById('child_identity_first_name'+i).style['border-color'] = 'red';
                }else if(document.getElementById('child_identity_last_name'+i).value != '' && check_word(document.getElementById('child_identity_last_name'+i).value) == false){
                    error_log+= 'Please use alpha characters identity last name of child passenger '+i+'!</br>\n';
                    document.getElementById('child_identity_last_name'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('child_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                    document.getElementById('child_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                }
            }

       }
       perpax_count = 1
       for(j in detail.perPax){
           if(detail.perPax[j].name != 'Gender' && detail.perPax[j].name !=  'Full name' && detail.perPax[j].name !=  'Guest age' && detail.perPax[j].name !=  'Nationality' && detail.perPax[j].name !=  'Date of birth' && detail.perPax[j].name !=  'Passport number' && detail.perPax[j].name !=  'Passport expiry date'){
                if(detail.perPax[j].required == true){
                    //use regex bemyguest
                    if(detail.perPax[j].formatRegex != false){
                        if(check_regex(document.getElementById('child_perpax'+i+'_'+perpax_count).value, detail.perPax[j].formatRegex)==false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                    //no regex
                    else if(detail.perPax[j].inputType == 1){
                        if(document.getElementById('child_perpax'+i+'_'+perpax_count).value=='')
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }else if(detail.perPax[j].inputType == 2){
                        k_item_count = 1
                        for(k in detail.perPax[j].items){
                            if(document.getElementById('child_perpax'+i+'_'+perpax_count+'_'+k_item_count).checked==true)
                            {
                                check=1;
                            }
                            k_item_count += 1;
                        }
                        if(check==0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                        check=0;
                    }else if(detail.perPax[j].inputType == 3)
                    {
                        if(check_number(document.getElementById('child_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 4)
                    {
                        if(check_word(document.getElementById('child_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 6)
                    {
                        if(check_date(document.getElementById('child_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 7){
                        if(document.getElementById('child_perpax'+i+'_'+perpax_count).files.length == 0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }

                    }else if(detail.perPax[j].inputType == 8){
                        if(document.getElementById('child_perpax'+i+'_'+perpax_count).files.length == 0)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }

                    }else if(detail.perPax[j].inputType == 10)
                    {
                        if(check_time(document.getElementById('child_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 11)
                    {
                        if(check_date_time(document.getElementById('child_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 12)
                    {
                        if(check_word(document.getElementById('child_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 14)
                    {
                        if(check_flight(document.getElementById('child_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                    else if(detail.perPax[j].inputType == 50)
                    {
                        if(check_word(document.getElementById('child_perpax'+i+'_'+perpax_count).value) == false)
                        {
                            error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
                        }
                    }
                }
           }
           else if(detail.perPax[j].name == 'Passport number')
           {
               if(detail.perPax[j].required == true){
                   if(document.getElementById('child_passport_number'+i).value=='')
                       error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
               }
           }
           else if(detail.perPax[j].name == 'Passport expiry date')
           {
               if(detail.perPax[j].required == true){
                   if(document.getElementById('child_passport_expired_date'+i).value=='')
                       error_log+= 'Please check your '+detail.perPax[j].name+' for child guest '+i+'</br>\n';
               }
           }
           perpax_count += 1;
       }
   }

   length_name = 100;
   if(length_name > activity_carrier_data.infant_length_name)
   {
       length_name = activity_carrier_data.infant_length_name;
   }
   //infant
   for(i=1;i<=infant;i++){
       if(check_name(document.getElementById('infant_title'+i).value,
       document.getElementById('infant_first_name'+i).value,
       document.getElementById('infant_last_name'+i).value,
       length_name) == false){
           error_log+= 'Total of infant '+i+' name maximum '+length_name+' characters!</br>\n';
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
       }if(document.getElementById('infant_first_name'+i).value == '' || check_word(document.getElementById('infant_first_name'+i).value) == false){
           if(document.getElementById('infant_first_name'+i).value == '')
               error_log+= 'Please input first name of infant guest '+i+'!</br>\n';
           else if(check_word(document.getElementById('infant_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of infant guest '+i+'!</br>\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_last_name'+i).value != ''){
           if(check_word(document.getElementById('infant_last_name'+i).value) == false)
           {
                error_log+= 'Please use alpha characters last name of infant guest '+i+'!</br>\n';
                document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
           }
           else
           {
                document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
           }
       }else{
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for infant guest '+i+'!</br>\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for infant guest '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_passport_number'+i).value != '' ||
          document.getElementById('infant_passport_expired_date'+i).value != '' ||
          document.getElementById('infant_country_of_issued'+i+'_id').value != ''){
           if(document.getElementById('infant_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for infant guest '+i+'!</br>\n';
               document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('infant_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for infant guest '+i+'!</br>\n';
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('infant_country_of_issued'+i+'_id').value == ''){
               error_log+= 'Please fill country of issued for infant guest '+i+'!</br>\n';
               $("#infant_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid red');
               });
           }else{
               $("#infant_country_of_issued"+i+"_id").each(function() {
                 $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
               });
           }

            if(document.getElementById('infant_identity_first_name'+i).value != '')
            {
                if(check_name(document.getElementById('infant_title'+i).value,
                    document.getElementById('infant_identity_first_name'+i).value,
                    document.getElementById('infant_identity_last_name'+i).value,
                    length_name) == false){
                    error_log+= 'Total of infant '+i+' identity name maximum '+length_name+' characters!</br>\n';
                    document.getElementById('infant_identity_first_name'+i).style['border-color'] = 'red';
                    document.getElementById('infant_identity_last_name'+i).style['border-color'] = 'red';
                }else if(check_word(document.getElementById('infant_identity_first_name'+i).value) == false){
                    error_log+= 'Please use alpha characters identity first name of infant passenger '+i+'!</br>\n';
                    document.getElementById('infant_identity_first_name'+i).style['border-color'] = 'red';
                }else if(document.getElementById('infant_identity_last_name'+i).value != '' && check_word(document.getElementById('infant_identity_last_name'+i).value) == false){
                    error_log+= 'Please use alpha characters identity last name of infant passenger '+i+'!</br>\n';
                    document.getElementById('infant_identity_last_name'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('infant_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                    document.getElementById('infant_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                }
            }
       }

   }
   if(error_log==''){
       document.getElementById('booker_nationality_id').disabled = false;
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
            document.getElementById('adult_nationality'+i + '_id').disabled = false;
            document.getElementById('adult_country_of_issued'+i + '_id').disabled = false;
//            document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=senior;i++){
            document.getElementById('senior_birth_date'+i).disabled = false;
            document.getElementById('senior_nationality'+i + '_id').disabled = false;
            document.getElementById('senior_country_of_issued'+i + '_id').disabled = false;
//            document.getElementById('senior_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=child;i++){
            document.getElementById('child_birth_date'+i).disabled = false;
            document.getElementById('child_nationality'+i + '_id').disabled = false;
            document.getElementById('child_country_of_issued'+i + '_id').disabled = false;
//            document.getElementById('child_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=infant;i++){
            document.getElementById('infant_birth_date'+i).disabled = false;
            document.getElementById('infant_nationality'+i + '_id').disabled = false;
            document.getElementById('infant_country_of_issued'+i + '_id').disabled = false;
//            document.getElementById('infant_passport_expired_date'+i).disabled = false;
       }
       document.getElementById('time_limit_input').value = time_limit;
       document.getElementById('additional_price').value = additional_price;
       upload_image();

   }
   else{
       document.getElementById('show_error_log').innerHTML = error_log;
       $("#myModalErrorPassenger").modal('show');
       $('.btn-next').removeClass("running");
       $('.btn-next').prop('disabled', false);
       $('.loader-rodextrip').fadeOut();
   }
}

function change_event(val){
    event_pick = val;
    reset_activity_table_detail();
}

function timeslot_change(){
    activity_timeslot = document.getElementById('timeslot_1').value + ' ~ ' + document.getElementById('timeslot_1').options[document.getElementById('timeslot_1').selectedIndex].text;
    reset_activity_table_detail();
}

//perbooking

function input_type_change_perbooking(val){
    if(document.getElementById('perbooking'+val).value != ''){
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick + activity_type[activity_type_pick].options.perBooking[val].price;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = activity_type[activity_type_pick].options.perBooking[val].price;
    }else{
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = 0;
    }
    reset_activity_table_detail();
}

function input_type11_change_perbooking(val){
    if(document.getElementById('perbooking'+val).value != ''){
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick + activity_type[activity_type_pick].options.perBooking[val].price;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = activity_type[activity_type_pick].options.perBooking[val].price;
    }else{
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = 0;
    }
    reset_activity_table_detail();
}

function input_type5_change_perbooking(val){
    if(document.getElementById('perbooking'+val).checked == true){
        additional_price += activity_type[activity_type_pick].options.perBooking[val].price;
    }else if(document.getElementById('perbooking'+val).checked == false){
        additional_price -= activity_type[activity_type_pick].options.perBooking[val].price;
    }
    reset_activity_table_detail();
}

function input_type1_change_perbooking(val){
    for(i in activity_type[activity_type_pick].options.perBooking[val].items){
        if(document.getElementById('perbooking'+val).value == activity_type[activity_type_pick].options.perBooking[val].items[i].value){
            additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick + activity_type[activity_type_pick].options.perBooking[val].items[i].price;
            activity_type[activity_type_pick].options.perBooking[val].price_pick = activity_type[activity_type_pick].options.perBooking[val].items[i].price;
            break;
        }
    }
    reset_activity_table_detail();
}

function input_type2_change_perbooking(val,val1){
    additional_price -= activity_type[activity_type_pick].options.perBooking[val].price_pick;
    activity_type[activity_type_pick].options.perBooking[val].price_pick = 0;
    for(i in activity_type[activity_type_pick].options.perBooking[val].items){
        if(document.getElementById('perbooking'+val+val1).checked == true)
            activity_type[activity_type_pick].options.perBooking[val].price_pick += activity_type[activity_type_pick].options.perBooking[val].items[i].price;
    }
    additional_price += additional_price + activity_type[activity_type_pick].options.perBooking[val].price_pick;
    reset_activity_table_detail();
}

//perpax

function input_type_change_perpax(val, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = document.getElementById('adult_perpax'+val+'_'+inputType).value;
    else if(type == 'infant')
        perpax = document.getElementById('infant_perpax'+val+'_'+inputType).value;
    else if(type == 'child')
        perpax = document.getElementById('child_perpax'+val+'_'+inputType).value;
    else if(type == 'senior')
        perpax = document.getElementById('senior_perpax'+val+'_'+inputType).value;
    if(perpax != ''){
        additional_price = additional_price - detail.perPax[inputType-1].price_pick + detail.perPax[inputType-1].price;
        detail.perPax[inputType-1].price_pick = detail.perPax[inputType-1].price;
    }else{
        additional_price = additional_price - detail.perPax.price_pick;
        detail.perPax[inputType-1].price_pick = 0;
    }
    activity_table_detail2();
}

function input_type11_change_perpax(val, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = document.getElementById('adult_perpax'+val+'_'+inputType).value;
    else if(type == 'infant')
        perpax = document.getElementById('infant_perpax'+val+'_'+inputType).value;
    else if(type == 'child')
        perpax = document.getElementById('child_perpax'+val+'_'+inputType).value;
    else if(type == 'senior')
        perpax = document.getElementById('senior_perpax'+val+'_'+inputType).value;

    if(perpax != ''){
        additional_price = additional_price - detail.perPax[inputType-1].price_pick + detail.perPax[inputType-1].price;
        detail.perPax[inputType-1].price_pick = detail.perPax[inputType-1].price;
    }else{
        additional_price = additional_price - detail.perPax[inputType-1].price_pick;
        detail.perPax[inputType-1].price_pick = 0;
    }
    activity_table_detail2();
}

function input_type5_change_perpax(val, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = document.getElementById('adult_perpax'+val+'_'+inputType).checked;
    else if(type == 'infant')
        perpax = document.getElementById('infant_perpax'+val+'_'+inputType).checked;
    else if(type == 'child')
        perpax = document.getElementById('child_perpax'+val+'_'+inputType).checked;
    else if(type == 'senior')
        perpax = document.getElementById('senior_perpax'+val+'_'+inputType).checked;

    if(perpax == true){
        additional_price += detail.perPax[inputType-1].price;
    }else if(perpax == false){
        additional_price -= detail.perPax[inputType-1].price;
    }
    activity_table_detail2();
}

function input_type1_change_perpax(val, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = document.getElementById('adult_perpax'+val+'_'+inputType).value;
    else if(type == 'infant')
        perpax = document.getElementById('infant_perpax'+val+'_'+inputType).value;
    else if(type == 'child')
        perpax = document.getElementById('child_perpax'+val+'_'+inputType).value;
    else if(type == 'senior')
        perpax = document.getElementById('senior_perpax'+val+'_'+inputType).value;

    for(i in detail.perPax[inputType-1].items){
        if(perpax == detail.perPax[inputType-1].items[i].value){
            additional_price = additional_price - detail.perPax[inputType-1].price_pick + detail.perPax[inputType-1].items[i].price;
            detail.perPax[inputType-1].price_pick = detail.perPax[inputType-1].items[i].price;
            break;
        }
    }
    activity_table_detail2();
}

function input_type2_change_perpax(val,val1, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = 'adult_perpax'+val+'_'+inputType;
    else if(type == 'infant')
        perpax = 'infant_perpax'+val+'_'+inputType;
    else if(type == 'child')
        perpax = 'child_perpax'+val+'_'+inputType;
    else if(type == 'senior')
        perpax = 'senior_perpax'+val+'_'+inputType;

    additional_price -= detail.perPax[inputType-1].price_pick;
    detail.perPax[inputType-1].price_pick = 0;
    for(i in detail.perPax[inputType-1].items){
        if(document.getElementById(perpax+'_'+val1).checked == true)
            detail.perPax[inputType-1].price_pick += detail.perPax[inputType-1].items[i].price;
    }
    additional_price += additional_price - detail.perPax[inputType-1].price_pick;
    activity_table_detail2();
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

function activity_filter_render(){

//    var node = document.createElement("div");
//    text = '';
//    text+= `
//    <span style="font-size:14px; font-weight:600;">Session Time <span class="count_time" id="session_time"> </span></span>
//    <hr/>
//    <span style="font-size:14px; font-weight:600;">Elapsed Time <span class="count_time" id="elapse_time"> </span></span>`;
//
//    node = document.createElement("div");
//    node.innerHTML = text;
//    document.getElementById("session_timer").appendChild(node);
//    node = document.createElement("div");
    document.getElementById("filter").innerHTML = '';
    var node = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
    <hr/>`;

    text+=`
    <div class="form-wrap" style="padding:0px; text-align:left;">
        <h6 class="filter_general" onclick="show_hide_general('activityName');">Activity Name <i class="fas fa-chevron-down" id="activityName_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="activityName_generalUp" style="float:right; display:block;"></i></h6>
        <div id="activityName_generalShow" style="display:inline-block; width:100%;">
            <input type="text" style="margin-bottom:0px !important;" class="form-control" id="activity_filter_name" placeholder="Activity Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Activity Name '" autocomplete="off" onkeyup="filter_name(1);"/>
        </div>
        <hr/>
        <h6 class="filter_general" onclick="show_hide_general('activityPrice');">Price Range <i class="fas fa-chevron-down" id="activityPrice_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="activityPrice_generalUp" style="float:right; display:block;"></i></h6>
        <div id="activityPrice_generalShow" style="display:inline-block;">
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
        </div>
    </div>`;

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text='';
    document.getElementById("sorting-flight").innerHTML = '';

    text+=`
    <div style="margin-bottom:10px;">
        <h6 style="display: inline;">Sort by</h6>
    </div>
    <div class="drop_inline" style="width:100%;">
        <div class="dropdown-toggle remove-arrow-dt div-dropdown-txt primary-btn-white" data-toggle="dropdown" style="width:100%; line-height:unset; padding:10px">
            <span type="button" style=" cursor:pointer; margin-bottom:0px !important; text-align:left;">
                <span id="sort_by_span">---Sort by---</span>
            </span>
            <ul class="dropdown-menu" role="menu" style="padding:15px;">`;
            for(i in sorting_list){
                text+=`
                <label class="radio-button-custom">
                    <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                    <input type="radio" id="radio_sorting`+i+`" name="radio_sorting" onclick="sort_button('`+sorting_list[i].value+`', '`+i+`');" value="`+sorting_list[i].value+`">
                    <span class="checkmark-radio"></span>
                </label></br>`;
            }
            text+=`
            </ul>
        </div>
    </div>`;

    node = document.createElement("div");
    node.className = 'sorting-box';
    node.innerHTML = text;
    document.getElementById("sorting-flight").appendChild(node);

    var node2 = document.createElement("div");
    text = '';
    text+= `<a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
            <br/>
            <h6 style="padding-bottom:10px;">Activity Name</h6>`;
            text+=`
            <div class="form-wrap" style="padding:0px; text-align:left;">
                <input type="text" style="margin-bottom:0px; !important" class="form-control" id="activity_filter_name2" placeholder="Activity Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Activity Name '" autocomplete="off" onkeyup="filter_name(2);"/>
            </div>`;
            text+=`
        <hr/>
        <h6>Price Range</h6><br/>
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
    for(i in sorting_list){
        text+=`
        <label class="radio-button-custom">
            <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
            <input type="radio" id="radio_sorting2`+i+`" name="radio_sorting2" onclick="sort_button('`+sorting_list[i].value+`', '`+i+`');" value="`+sorting_list[i].value+`">
            <span class="checkmark-radio"></span>
        </label></br>`;
    }
    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("sorting-flight2").appendChild(node2);
}

function sort_button(value, id){
//    if(value == 'name'){
//       if(sorting_value == '' || sorting_value == 'Name A-Z'){
//           sorting_value = 'Name Z-A';
//           document.getElementById("img-sort-down-name").style.display = "none";
//           document.getElementById("img-sort-up-name").style.display = "block";
//       }else{
//           sorting_value = 'Name A-Z';
//           document.getElementById("img-sort-down-name").style.display = "block";
//           document.getElementById("img-sort-up-name").style.display = "none";
//       }
//   }else if(value == 'price'){
//       if(sorting_value == '' || sorting_value == 'Lowest Price'){
//           sorting_value = 'Highest Price';
//           document.getElementById("img-sort-down-price").style.display = "none";
//           document.getElementById("img-sort-up-price").style.display = "block";
//       }else{
//           sorting_value = 'Lowest Price';
//           document.getElementById("img-sort-down-price").style.display = "block";
//           document.getElementById("img-sort-up-price").style.display = "none";
//       }
//
//   }else if(value == 'score'){
//       if(sorting_value == '' || sorting_value == 'Lowest Score'){
//           sorting_value = 'Highest Score';
//           document.getElementById("img-sort-down-score").style.display = "none";
//           document.getElementById("img-sort-up-score").style.display = "block";
//       }else{
//           sorting_value = 'Lowest Score';
//           document.getElementById("img-sort-down-score").style.display = "block";
//           document.getElementById("img-sort-up-score").style.display = "none";
//       }
//   }else{
//       sorting_value = value;
//   }

    sorting_value = value;
    $('#sort_by_span').text(value);
    document.getElementById('radio_sorting'+id).checked = true;
    document.getElementById('radio_sorting2'+id).checked = true;
    filtering('filter', 1);
}

function filter_name(name_num){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        change_filter('activity_name' + String(name_num), 1);
    }, 500);
}

function change_filter(type, value){
    var check = 0;
    if(type == 'activity_name1'){
        document.getElementById('activity_filter_name2').value = document.getElementById('activity_filter_name').value;
    }
    else if(type == 'activity_name2'){
        document.getElementById('activity_filter_name').value = document.getElementById('activity_filter_name2').value;
    }
    filtering('filter', value);
}

function filtering(type, check){
   var temp_data = [];
   var searched_name = $('#activity_filter_name').val();
   data = activity_data;

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
            acivity_filter = data;
            temp_data = [];
   }

   if(type == 'filter'){
       sort(data, check);
   }else if(type == 'sort'){
       sort(activity_data, check);
   }
}

function sort(activity_dat, check){
    if (activity_dat.length == 0 && check != 0){
        document.getElementById("activity_ticket").innerHTML = '';
        text = '';
        text += `
            <div class="col-lg-12">
                <div style="text-align:center">
                    <img src="/static/tt_website/images/no_found/no-activity.png" alt="Not Found Activity" style="width:70px; height:70px;" title="" />
                    <br/>
                </div>
                <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
            </div>`;
        document.getElementById("activity_ticket").innerHTML = text;
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
        for(var i = 0; i < activity_dat.length-1; i++) {
            for(var j = i+1; j < activity_dat.length; j++) {
                if(sorting == '' || sorting == 'Name A-Z'){
                    if(activity_dat[i].name > activity_dat[j].name){
                        var temp = activity_dat[i];
                        activity_dat[i] = activity_dat[j];
                        activity_dat[j] = temp;
                    }
                }
                if(sorting == 'Name Z-A'){
                    if(activity_dat[i].name < activity_dat[j].name){
                        var temp = activity_dat[i];
                        activity_dat[i] = activity_dat[j];
                        activity_dat[j] = temp;
                    }
                }else if(sorting == 'Lowest Price'){
                    if(activity_dat[i].activity_price > activity_dat[j].activity_price){
                        var temp = activity_dat[i];
                        activity_dat[i] = activity_dat[j];
                        activity_dat[j] = temp;
                    }
                }else if(sorting == 'Highest Price'){
                    if(activity_dat[i].activity_price < activity_dat[j].activity_price){
                        var temp = activity_dat[i];
                        activity_dat[i] = activity_dat[j];
                        activity_dat[j] = temp;
                    }
                }else if(sorting == 'Lowest Score'){
                    if(activity_dat[i].reviewAverageScore > activity_dat[j].reviewAverageScore){
                        var temp = activity_dat[i];
                        activity_dat[i] = activity_dat[j];
                        activity_dat[j] = temp;
                    }
                }else if(sorting == 'Highest Score'){
                    if(activity_dat[i].reviewAverageScore < activity_dat[j].reviewAverageScore){
                        var temp = activity_dat[i];
                        activity_dat[i] = activity_dat[j];
                        activity_dat[j] = temp;
                    }
                }

            }
        }
        activity_data_filter = activity_dat;
        document.getElementById("activity_ticket").innerHTML = '';
        text = '';
        check_available = 0;
        for(i in activity_dat)
        {
           if (activity_dat[i].activity_price >= $minPrice && activity_dat[i].activity_price <= $maxPrice)
           {
               if (activity_dat[i].images.length > 0)
               {
                   img_src = activity_dat[i].images[0].url+activity_dat[i].images[0].path;
               }
               else
               {
                   img_src = static_path_url_server+`/public/tour_packages/not_found.png`;
               }

               text+=`
               <div class="col-lg-12 activity_box" style="min-height:unset; margin-bottom:5px;">
                   <form action='/activity/detail/`+activity_dat[i].uuid+`' method=POST id='myForm`+activity_dat[i].sequence+`'>
                       <div id='csrf`+activity_dat[i].sequence+`'></div>
                       <input type='hidden' value='`+JSON.stringify(activity_dat[i]).replace(/[']/g, /["]/g)+`'/>
                       <input id='uuid`+activity_dat[i].sequence+`' name='uuid' type=hidden value='`+activity_dat[i].uuid+`'/>
                       <input id='sequence`+activity_dat[i].sequence+`' name='sequence' type=hidden value='`+activity_dat[i].sequence+`'/>`;

                       temp_arr_loc = [];
                       temp_arr_ctg = [];
                       for(j in activity_dat[i].locations){
                           temp_arr_loc.push(activity_dat[i].locations[j].country_name);
                       }
                       for(j in activity_dat[i].categories){
                           temp_arr_ctg.push(activity_dat[i].categories[j].category_name);
                       }
                       temp_arr_loc = get_unique_list_data(temp_arr_loc);

                        text+=`
                        <div class="single-recent-blog-post item div_box_default" style="padding:0px 15px;">
                            <div class="single-destination relative">
                                <div class="row">`;
                                    if(img_src){
                                        text+=`<div class="col-lg-3 col-md-4 thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:175px; background: url('`+img_src+`'), url('/static/tt_website/images/no_found/no-image-activity.jpg'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+activity_dat[i].sequence+`')"></div>`;
                                    }else{
                                        text+=`<div class="col-lg-3 col-md-4 thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:175px; background: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+activity_dat[i].sequence+`')"></div>`;
                                    }
                                    text+=`
                                    <div class="col-lg-9 col-md-8">
                                        <div class="row details">
                                            <div class="col-lg-12" style="text-align:left;">
                                                <div style="padding-top:15px">
                                                    <h5 style="padding-bottom:5px;" title="`+activity_dat[i].name+`">`+activity_dat[i].name+`</h5>
                                                </div>
                                            </div>
                                            <div class="col-lg-8 col-md-8" style="text-align:left;">
                                                <div class="row">
                                                    <div class="col-lg-12" style="text-align:left; margin-bottom:5px;">`;
                                                        if(activity_dat[i].reviewCount != 0){
                                                            text+=`<span class="span-activity-desc" style="font-size:14px; font-weight:bold; padding:2px 5px; border:2px solid `+color+`; color:`+color+`; border-radius:5px;">`+activity_dat[i].reviewAverageScore+`/5</span><span><i style="color:#FFC801 !important; padding-left:5px; font-size:16px;" class="fas fa-star"></i> (`+activity_dat[i].reviewCount+`)</span><br/>`;
                                                        }else{
                                                            text+=`<span class="span-activity-desc" style="font-size:14px; font-weight:bold; padding:2px 5px; border:2px solid `+color+`; color:`+color+`; border-radius:5px;">No rating</span><span><i style="color:#FFC801 !important; padding-left:5px; font-size:16px;" class="fas fa-star"></i></span><br/>`;
                                                        }
                                                    text+=`
                                                    </div>`;
//                                                        text+=`
//                                                        <div class="col-lg-6" style="text-align:right;">
//                                                            <span style="font-size:14px; font-weight:600; cursor:pointer;"> <i class="fas fa-tags"></i>
//                                                            <span id="pop_ctg`+i+`" class="span-activity-desc" style="color:`+color+`; cursor:pointer;"> `+temp_arr_ctg.length+` Category</span>
//                                                            </span>
//                                                        </div>`;

                                                    text+=`
                                                </div>
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <span style="font-size:14px; font-weight:600; cursor:pointer;"><i class="fas fa-map-marker-alt" style="font-size:16px;"></i>`;
                                                        for(ct in temp_arr_loc){
                                                            if(ct == 0){
                                                                text+=`<span id="pop_loc`+i+``+ct+`" class="span-activity-desc" style="color:`+color+`; cursor:pointer;"> `+temp_arr_loc[ct].data_country+` (`+temp_arr_loc[ct].count+`)</span>`;
                                                            }else{
                                                                text+=`<span id="pop_loc`+i+``+ct+`" class="span-activity-desc" style="color:`+color+`; cursor:pointer;">, `+temp_arr_loc[ct].data_country+` (`+temp_arr_loc[ct].count+`) </span>`;
                                                            }
                                                        }
                                                        text+=`
                                                        </span>
                                                    </div>`;
                                                    text+=`
                                                    <div class="col-lg-12">
                                                        <span style="font-size:13px; cursor:pointer;">
                                                            <span class="span-activity-desc"> <i class="fas fa-tags" style="padding-right:5px;"></i>`;
                                                                for(j in activity_dat[i].categories){
                                                                    text+=activity_dat[i].categories[j].category_name;
                                                                    if(j > 0 && j != activity_dat[i].categories.length-1){
                                                                        text+=` | `;
                                                                    }
                                                                }
                                                            text+=`
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-lg-4 col-md-4" style="text-align:right;">`;
                                                if(activity_dat[i].activity_price > 0){
                                                    text+=`<span style="font-size:15px;font-weight:bold; color:`+color+`;">`+activity_dat[i].currency_code+` `+getrupiah(activity_dat[i].activity_price)+`  </span>`;
                                                    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && activity_dat[i].activity_price){
                                                        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                                            text+=`<br/><span class="span_link" id="estimated_popup_activity`+i+`" style="color:`+color+` !important; font-size:13px;">Estimated <i class="fas fa-coins"></i></span>`;
                                                        }
                                                    }
                                                }
                                                else{
                                                    text+=`<span style="font-size:14px;font-weight:bold;">No Estimated Price</span>`;
                                                }
                                                text+=`
                                                <br/><button style="width:100%; margin-top:10px; margin-bottom:15px;" type="button" class="primary-btn" onclick="go_to_detail('`+activity_dat[i].sequence+`')">BUY</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </form>
               </div>`;
           }
        }
        if (text == '' && check != 0)
        {
            text += `
            <div class="col-lg-12">
                <div style="text-align:center">
                    <img src="/static/tt_website/images/no_found/no-activity.png" alt="Not Found Activity" style="width:70px; height:70px;" title="" />
                    <br/>
                </div>
                <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
            </div>`;
        }
        document.getElementById('activity_ticket').innerHTML += text;

        for(i in activity_dat){
            temp_arr_loc = [];
            temp_arr_ctg = [];
            for(j in activity_dat[i].locations){
                temp_arr_loc.push(activity_dat[i].locations[j].country_name);
            }
            for(j in activity_dat[i].categories){
                temp_arr_ctg.push(activity_dat[i].categories[j].category_name);
            }

            temp_arr_loc = get_unique_list_data(temp_arr_loc);

            for(ct in temp_arr_loc){
                content_pop_loc = '';

                for(j in activity_dat[i].locations){
                    if(temp_arr_loc[ct].data_country == activity_dat[i].locations[j].country_name)
                    content_pop_loc+=`
                    <span class="span-activity-desc" style="font-size:13px;">
                        <i style="color:`+color+` !important;" class="fas fa-map-marker-alt"></i>
                        `+activity_dat[i].locations[j].city_name+`, `+activity_dat[i].locations[j].country_name+`
                    </span><br/>`;
                }

                new jBox('Tooltip', {
                    attach: '#pop_loc'+i+ct,
                    target: '#pop_loc'+i+ct,
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
                    content: content_pop_loc,
                });
            }

            content_pop_ctg = '';
            for(ct in temp_arr_ctg){
                content_pop_ctg+=`
                <span class="span-activity-desc" style="font-size:13px;">
                    <i style="color:`+color+` !important;" class="fas fa-tags"></i>
                    `+temp_arr_ctg[ct]+`
                </span><br/>`;
            }
            new jBox('Tooltip', {
                attach: '#pop_ctg'+i,
                target: '#pop_ctg'+i,
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
                content: content_pop_ctg,
            });

       }

        var items = $(".activity_box");
        var numItems = items.length;

//        document.getElementById("activity_result").innerHTML = '';
//        text = '';
//        var node = document.createElement("div");
//        text+=`
//        <div style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px;">
//            <span style="font-weight:bold; font-size:14px;"> Activity - `+numItems+` results</span>
//        </div>`;
//        node.innerHTML = text;
//        document.getElementById("activity_result").appendChild(node);
//        node = document.createElement("div");
    }
}

function activity_pre_create_booking(value){
    if(value == 0)
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
        show_loading();
        please_wait_transaction();
        update_contact_activity(value);
      }
    })
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
    document.getElementById('activity_filter_name').value = '';
    document.getElementById('price-from').value = low_price_slider;
    document.getElementById('price-to').value = high_price_slider;
    filter_name(1);
    price_update(1, 1);
    price_slider_true(1, 1);
}

function auto_complete_text_activity(type){
    sel_objs_act = $('#'+type).select2('data');
    if (type == 'activity_countries'){
        document.getElementById('show_country_activity').innerHTML = sel_objs_act[0].text;
        if(sel_objs_act[0].text == 'All Countries'){
            document.getElementById('show_city_activity').innerHTML = 'All Cities';
        }
    }
    else if (type == 'activity_cities'){
        document.getElementById('show_city_activity').innerHTML = sel_objs_act[0].text;
    }
    else if (type == 'activity_type'){
        document.getElementById('show_type_activity').innerHTML = sel_objs_act[0].text;
    }
    else if (type == 'activity_category'){
        document.getElementById('show_category_activity').innerHTML = sel_objs_act[0].text;
        if(sel_objs_act[0].text == 'All Categories'){
            document.getElementById('show_sub_category_activity').innerHTML = 'All Sub Categories';
        }
    }
    else if (type == 'activity_sub_category'){
        document.getElementById('show_sub_category_activity').innerHTML = sel_objs_act[0].text;
    }
}
