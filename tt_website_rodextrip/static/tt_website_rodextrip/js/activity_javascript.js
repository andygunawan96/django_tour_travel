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

function set_sub_category(category_id, current_sub_id=0){
    var text = `<option value="0" selected="">All Sub Categories</option>`;
    var sub_category_list = sub_category[category_id.split(' - ')[1]];
    if (current_sub_id == 0)
    {
        for(i in sub_category_list){
            text +=`<option value="`+sub_category_list[i].id+`">`+sub_category_list[i].name+`</option>`;
        }
    }
    else
    {
        for(i in sub_category_list){
            if (sub_category_list[i].id == current_sub_id)
            {
                text +=`<option value="`+sub_category_list[i].id+`" selected>`+sub_category_list[i].name+`</option>`;
            }
            else
            {
                text +=`<option value="`+sub_category_list[i].id+`">`+sub_category_list[i].name+`</option>`;
            }
        }
    }

    console.log(text);
    document.getElementById('activity_sub_category').innerHTML = text;
    $('#activity_sub_category').niceSelect('update');
//    activity_sub_category
}

function set_city(country_id, current_city_id=0){
    var text = `<option value="" selected="">All Cities</option>`;
    var country = {};
    for(i in activity_country){
       console.log(parseInt(country_id));
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
    var sub_category_list = sub_category[category_id.split(' - ')[1]];
    for(i in sub_category_list){
        if (sub_category_list[i].id == current_sub_id)
        {
            search_sub_cat_name = sub_category_list[i].name;
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

function pick_activity(val){
    console.log(val);
}

function update_pax(){
    activity_table_detail();
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

function activity_table_detail(){
   var grand_total = 0;
   var grand_commission = 0;
   text = '';
   name = response.name.replace(/&#39;/g,"'");
   name = name.replace(/&amp;/g, '&');
   $test = '';
   $test += response.name+'\n';
   if(response.name != document.getElementById('product_type_title').innerHTML)
       $test += document.getElementById('product_type_title').innerHTML + '\n';

   var visit_date_txt = document.getElementById('activity_date').value;
   $test +='Visit Date : '+document.getElementById('activity_date').value+
           '\n';
   try{
        if(document.getElementById('timeslot_1').value)
        {
            $test += 'Time slot: '+ document.getElementById('timeslot_1').options[document.getElementById('timeslot_1').selectedIndex].text+'\n\n';
            visit_date_txt += ' (' + document.getElementById('timeslot_1').options[document.getElementById('timeslot_1').selectedIndex].text + ')';
        }
   }catch(err){

   }
   document.getElementById('product_visit_date').innerHTML = visit_date_txt;
   try{
       skus = activity_date[event_pick][activity_date_pick].prices;
       for (sku in skus)
       {
            low_sku_id = sku.toLowerCase();
            if(document.getElementById(low_sku_id+'_passenger'))
            {
                if(document.getElementById(low_sku_id+'_passenger').value != 0){
                   text+= `<div class="row">
                                <div class="col-xs-1">`+document.getElementById(low_sku_id+'_passenger').value+`x</div>
                                <div class="col-xs-1">`+skus[sku].sku_title+`</div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-4" style="text-align: right;">IDR @`;

                   if(document.getElementById(low_sku_id+'_passenger').value in skus[sku])
                   {
                       text+= getrupiah(parseInt(skus[sku][document.getElementById(low_sku_id+'_passenger').value.toString()].sale_price))+`</div><div class="col-xs-4" style="text-align: right;">IDR `;
                       text+= getrupiah(parseInt(document.getElementById(low_sku_id+'_passenger').value) * skus[sku][document.getElementById(low_sku_id+'_passenger').value.toString()].sale_price);
                       $test += document.getElementById(low_sku_id+'_passenger').value.toString() + ' ' + skus[sku].sku_title + ' Price @IDR ' + getrupiah(skus[sku][document.getElementById(low_sku_id+'_passenger').value.toString()].sale_price)+'\n';
                       grand_total += parseInt(document.getElementById(low_sku_id+'_passenger').value) * skus[sku][document.getElementById(low_sku_id+'_passenger').value].sale_price;
                       grand_commission += parseInt(document.getElementById(low_sku_id+'_passenger').value) * skus[sku][document.getElementById(low_sku_id+'_passenger').value].commission_price;
                   }
                   else
                   {
                       text+= getrupiah(parseInt(skus[sku]['1'].sale_price))+`</div><div class="col-xs-4" style="text-align: right;">IDR `;
                       text+= getrupiah(parseInt(document.getElementById(low_sku_id+'_passenger').value) * skus[sku]['1'].sale_price);
                       $test += document.getElementById(low_sku_id+'_passenger').value.toString() + ' ' + skus[sku].sku_title + ' Price @IDR ' + getrupiah(skus[sku]['1'].sale_price)+'\n';
                       grand_total += parseInt(document.getElementById(low_sku_id+'_passenger').value) * skus[sku]['1'].sale_price;
                       grand_commission += parseInt(document.getElementById(low_sku_id+'_passenger').value) * skus[sku]['1'].commission_price;
                   }
                   text+= `</div></div>`;
               }
            }
       }
       if(document.getElementById('infant_passenger'))
       {
            if(document.getElementById('infant_passenger').value != 0){
               text+= `<div class="row">
                            <div class="col-xs-1">`+document.getElementById('infant_passenger').value+`x</div>
                            <div class="col-xs-1">Infant</div>
                            <div class="col-xs-2"></div>
                            <div class="col-xs-4" style="text-align: right;">IDR @0></div>
                            <div class="col-xs-4">`;

               text+= getrupiah(0);
               $test += document.getElementById('infant_passenger').value.toString() + ' Infant Price @IDR ' + getrupiah(0)+'\n';
               text+= `</div></div>`;
           }
       }
   }catch(err){

   }

   if(additional_price != 0)
       $test += 'Additional price @IDR '+getrupiah(additional_price)+'\n';

   if(grand_total != 0)
       $test+= '\nGrand Total : IDR '+ getrupiah(grand_total)+
               '\nPrices and availability may change at any time';
   console.log(grand_total);
   if (additional_price)
   {
        text+= `<div class="row">
                <div class="col-xs-8">Additional Charge</div>
                <div class="col-xs-4" style="text-align: right;">IDR <span id='additional_price'>`+additional_price+`</span></div>
           </div>`;
   }
   else
   {
        text+= `<div class="row">
                <div class="col-xs-8">Additional Charge</div>
                <div class="col-xs-4" style="text-align: right;">IDR <span id='additional_price'>0</span></div>
           </div>`;
   }
   text+= `<hr style="padding:0px;">
           <div class="row">
                <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(grand_total)+`</div>
           </div>
           <div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    } else {
                        text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    }

                text+=`
                </div>
           </div>
           <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12" style="margin-top:10px; text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(grand_commission)+`</span><br>
                    </div>
                </div>
           </div>

           <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12">
                   <input type="button" class="primary-btn-ticket" onclick="copy_data();" value="Copy" style="width:100%;"/>
               </div>
           </div>
           <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-lg-12" style="padding-bottom:10px;">
                    <input type="button" id="show_commission_button" class="primary-btn-ticket" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
               </div>
           </div>
           `;

   document.getElementById('activity_detail_table').innerHTML = text;
   text_btn = `
       <center>
       <button type="button" class="primary-btn-ticket" value="Next" onclick='check_detail();' style="width:100%;">
            Next
            <i class="fas fa-angle-right"></i>
       </button><br/>
       </center>
   `;
   document.getElementById('activity_detail_next_btn').innerHTML = text_btn;
   document.getElementById('activity_detail_next_btn2').innerHTML = text_btn;
}


function activity_table_detail2(pagetype){
   grand_total = 0;
   var grand_commission = 0;
   text = '';
   name = response.name.replace(/&#39;/g,"'");
   name = name.replace(/&amp;/g, '&');
   $test = response.name+'\n';
   if (document.getElementById('product_type_title'))
   {
       $test += document.getElementById('product_type_title').innerHTML+
           '\n';
   }
   var visit_date_txt = price.date.split('-')[2]+' '+month[price.date.split('-')[1]]+' '+price.date.split('-')[0];
   $test += 'Visit Date : '+price.date.split('-')[2]+' '+month[price.date.split('-')[1]]+' '+price.date.split('-')[0]+
           '\n';
   if(time_slot_pick != '')
   {
       $test += 'Time slot: ' + time_slot_pick + '\n\n';
       visit_date_txt += ' (' + time_slot_pick + ')';
   }
   else
   {
       $test += '\n';
   }

   document.getElementById('product_visit_date').innerHTML = visit_date_txt;

   try{
        for(i in all_pax){
            if(i == 0)
                $test += 'Passengers:\n';
            $test += all_pax[i].title + ' ' + all_pax[i].first_name + ' ' + all_pax[i].last_name + '\n';
        }
        $test +='\n';
   }catch(err){}

   try{
       skus = price.prices;
       for (sku in skus)
       {
            low_sku_id = sku.toLowerCase();
            if(passenger[low_sku_id] && passenger[low_sku_id] != 0)
            {
               text+= `<div class="row">
                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">`+passenger[low_sku_id]+`x</div>
                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">`+skus[sku].sku_title+`</div>
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"></div>
                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align: right;">IDR @`;

               if(passenger[low_sku_id] in skus[sku])
               {
                   text+= getrupiah(parseInt(skus[sku][passenger[low_sku_id]].sale_price))+`</div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align: right;">IDR `;
                   text+= getrupiah(parseInt(passenger[low_sku_id]) * skus[sku][passenger[low_sku_id]].sale_price);
                   $test += passenger[low_sku_id].toString() + ' ' + skus[sku].sku_title + ' Price @IDR ' + getrupiah(skus[sku][passenger[low_sku_id]].sale_price)+'\n';
                   grand_total += parseInt(passenger[low_sku_id]) * skus[sku][passenger[low_sku_id]].sale_price;
                   grand_commission += parseInt(passenger[low_sku_id]) * skus[sku][passenger[low_sku_id]].commission_price;
               }
               else
               {
                   text+= getrupiah(parseInt(skus[sku]['1'].sale_price))+`</div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align: right;">IDR `;
                   text+= getrupiah(parseInt(passenger[low_sku_id]) * skus[sku]['1'].sale_price);
                   $test += passenger[low_sku_id].toString() + ' ' + skus[sku].sku_title + ' Price @IDR ' + getrupiah(skus[sku]['1'].sale_price)+'\n';
                   grand_total += parseInt(passenger[low_sku_id]) * skus[sku]['1'].sale_price;
                   grand_commission += parseInt(passenger[low_sku_id]) * skus[sku]['1'].commission_price;
               }
               text+= `</div></div>`;
           }
       }
       if (passenger['infant'] && passenger['infant'] != 0)
       {
           text+= `<div class="row">
                       <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">`+passenger['infant']+`x</div>
                       <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">Infant</div>
                       <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"></div>
                       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align: right;">IDR @0</div>
                       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">`;

           text+= getrupiah(0);
           $test += passenger['infant'].toString() + ' Infant Price @IDR ' + getrupiah(0)+'\n';
           text+= `</div></div>`;
       }

   }catch(err){

   }

   if(additional_price != 0)
       $test += 'Additional price @IDR '+getrupiah(additional_price)+'\n';


   $test+= '\nGrand Total : IDR '+ getrupiah(grand_total)+
           '\nPrices and availability may change at any time';
   console.log(grand_total);
   if (additional_price)
   {
        text+= `<div class="row">
                <div class="col-xs-8">Additional Charge</div>
                <div class="col-xs-4" style="text-align: right;">IDR <span id='additional_price'>`+additional_price+`</span></div>
           </div>`;
   }
   else
   {
        text+= `<div class="row">
                <div class="col-xs-8">Additional Charge</div>
                <div class="col-xs-4" style="text-align: right;">IDR <span id='additional_price'>0</span></div>
           </div>`;
   }
   text+= `<hr style="padding:0px;">
           <div class="row">
                <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(grand_total)+`</div>
           </div>

           <div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    } else {
                        text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    }

                text+=`
                </div>
           </div>

           <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12 col-xs-12" style="margin-top:10px; text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(grand_commission)+`</span><br>
                    </div>
                </div>
           </div>

           <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-xs-12">
                     <input type="button" class="primary-btn-ticket" onclick="copy_data();" value="Copy" style="width:100%;"/>
               </div>
           </div>`;

   text+= `</div>
           </div>
           <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-xs-12" style="padding-bottom:10px;">
                    <input type="button" id="show_commission_button" class="primary-btn-ticket" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
               </div>
           </div>
           `;
   document.getElementById('activity_detail_table').innerHTML = text;
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
    console.log(activity_date_pick);
    console.log(activity_date[event_pick][parseInt(activity_date_pick)].date);
    console.log(activity_date[event_pick][parseInt(activity_date_pick)].available);

    date = document.getElementById('activity_date').value.split(' ')[2]+'-'+month[document.getElementById('activity_date').value.split(' ')[1]]+'-'+document.getElementById('activity_date').value.split(' ')[0]
    console.log(date);
    //check tiket
    if(activity_date[event_pick][parseInt(activity_date_pick)].date == date && activity_date[event_pick][parseInt(activity_date_pick)].available == false)
        text+='Visit date not available, please pick other date!\n';

    //check pax
    console.log(activity_type[activity_type_pick]);
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

    console.log(pax);
    console.log(activity_type[activity_type_pick].maxPax);
    if(pax > activity_type[activity_type_pick].maxPax)
        text+= 'Total Passenger must be below than '+activity_type[activity_type_pick].maxPax+'</br>\n';
    if(pax < activity_type[activity_type_pick].minPax)
        text+= 'Total Passenger must be more than '+activity_type[activity_type_pick].minPax+'</br>\n';

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
                        console.log(document.getElementById('perbooking'+i+j).checked);
                        if(document.getElementById('perbooking'+i+j).checked==true)
                            check=1;
                    }
                    console.log(check);
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
        detail_to_passenger_page();
    }else{
        document.getElementById('show_error_log').innerHTML = text;
        $("#myModalErrorDetail").modal('show');
    }
}

function check_passenger(adult, senior, child, infant){
    $('.loader-rodextrip').fadeIn();
    //booker
    error_log = '';
    //check booker jika teropong
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
    }if(document.getElementById('booker_first_name').value == '' || check_word(document.getElementById('booker_first_name').value) == false){
        if(document.getElementById('booker_first_name').value == '')
            error_log+= 'Please fill booker first name!</br>\n';
        else if(check_word(document.getElementById('booker_first_name').value) == false)
            error_log+= 'Please use alpha characters for booker first name!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
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
    length_name = 25;

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
       }if(document.getElementById('adult_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for adult guest '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_passport_number'+i).value != '' ||
          document.getElementById('adult_passport_expired_date'+i).value != '' ||
          document.getElementById('adult_country_of_issued'+i).value != ''){
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
           }if(document.getElementById('adult_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for adult guest '+i+'!</br>\n';
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
       }if(document.getElementById('senior_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for senior guest '+i+'!</br>\n';
           document.getElementById('senior_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('senior_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('senior_passport_number'+i).value != '' ||
          document.getElementById('senior_passport_expired_date'+i).value != '' ||
          document.getElementById('senior_country_of_issued'+i).value != ''){
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
           }if(document.getElementById('senior_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for senior guest '+i+'!</br>\n';
               document.getElementById('senior_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('senior_country_of_issued'+i).style['border-color'] = '#EFEFEF';
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
       }if(document.getElementById('child_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for child guest '+i+'!</br>\n';
           document.getElementById('child_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_passport_number'+i).value != '' ||
          document.getElementById('child_passport_expired_date'+i).value != '' ||
          document.getElementById('child_country_of_issued'+i).value != ''){
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
           }if(document.getElementById('child_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for child guest '+i+'!</br>\n';
               document.getElementById('child_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_country_of_issued'+i).style['border-color'] = '#EFEFEF';
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
       }if(document.getElementById('infant_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for infant guest '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_passport_number'+i).value != '' ||
          document.getElementById('infant_passport_expired_date'+i).value != '' ||
          document.getElementById('infant_country_of_issued'+i).value != ''){
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
           }if(document.getElementById('infant_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for infant guest '+i+'!</br>\n';
               document.getElementById('infant_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }

   }
   if(error_log==''){
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
            document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=senior;i++){
            document.getElementById('senior_birth_date'+i).disabled = false;
            document.getElementById('senior_passport_expired_date'+i).disabled = false;
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
       document.getElementById('additional_price').value = additional_price;
       document.getElementById('activity_review').submit();
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
    activity_table_detail();
}

function timeslot_change(){
    activity_timeslot = document.getElementById('timeslot_1').value + ' ~ ' + document.getElementById('timeslot_1').options[document.getElementById('timeslot_1').selectedIndex].text;
    activity_table_detail();
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
    activity_table_detail();
}

function input_type11_change_perbooking(val){
    if(document.getElementById('perbooking'+val).value != ''){
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick + activity_type[activity_type_pick].options.perBooking[val].price;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = activity_type[activity_type_pick].options.perBooking[val].price;
    }else{
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = 0;
    }
    activity_table_detail();
}

function input_type5_change_perbooking(val){
    if(document.getElementById('perbooking'+val).checked == true){
        additional_price += activity_type[activity_type_pick].options.perBooking[val].price;
    }else if(document.getElementById('perbooking'+val).checked == false){
        additional_price -= activity_type[activity_type_pick].options.perBooking[val].price;
    }
    activity_table_detail();
}

function input_type1_change_perbooking(val){
    for(i in activity_type[activity_type_pick].options.perBooking[val].items){
        if(document.getElementById('perbooking'+val).value == activity_type[activity_type_pick].options.perBooking[val].items[i].value){
            additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick + activity_type[activity_type_pick].options.perBooking[val].items[i].price;
            activity_type[activity_type_pick].options.perBooking[val].price_pick = activity_type[activity_type_pick].options.perBooking[val].items[i].price;
            break;
        }
    }
    activity_table_detail();
}

function input_type2_change_perbooking(val,val1){
    additional_price -= activity_type[activity_type_pick].options.perBooking[val].price_pick;
    activity_type[activity_type_pick].options.perBooking[val].price_pick = 0;
    for(i in activity_type[activity_type_pick].options.perBooking[val].items){
        if(document.getElementById('perbooking'+val+val1).checked == true)
            activity_type[activity_type_pick].options.perBooking[val].price_pick += activity_type[activity_type_pick].options.perBooking[val].items[i].price;
    }
    additional_price += additional_price + activity_type[activity_type_pick].options.perBooking[val].price_pick;
    activity_table_detail();
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

    console.log(detail.perPax);
    console.log(inputType);
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

    var node = document.createElement("div");
    text = '';
    text+= `
    <span style="font-size:14px; font-weight:600;">Session Time <span style="font-size:16px; font-weight:700; color:#f15a22;" id="session_time"> </span></span>
    <hr/>
    <span style="font-size:14px; font-weight:600;">Elapsed Time <span style="font-size:16px; font-weight:700; color:#f15a22;" id="elapse_time"> </span></span>`;

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("session_timer").appendChild(node);
    node = document.createElement("div");

    var node = document.createElement("div");
    text = '';
    text+= `<h4>Filter</h4>
    <hr/>
    <div class="banner-right">
        <div class="form-wrap" style="padding:0px; text-align:left;">
            <h6 class="filter_general" onclick="show_hide_general('activityName');">Activity Name <i class="fas fa-chevron-down" id="activityName_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="activityName_generalUp" style="float:right; display:block;"></i></h6>
            <div id="activityName_generalShow" style="display:inline-block;">
                <input type="text" style="margin-bottom:unset;" class="form-control" id="activity_filter_name" placeholder="Activity Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Activity Name '" autocomplete="off" onkeyup="filter_name(1);"/>
            </div>
            <hr/>
            <h6 class="filter_general" onclick="show_hide_general('activityPrice');">Price Range <i class="fas fa-chevron-down" id="activityPrice_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="activityPrice_generalUp" style="float:right; display:block;"></i></h6>
            <div class="wrapper" id="activityPrice_generalShow" style="display:inline-block;">
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
        </div>
    </div>`;

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

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
            <h6 style="padding-bottom:10px;">Activity Name</h6>`;
    text+= `
            <div class="banner-right">
                <div class="form-wrap" style="padding:0px; text-align:left;">
                    <input type="text" style="margin-bottom:unset;" class="form-control" id="activity_filter_name2" placeholder="Activity Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Activity Name '" autocomplete="off" onkeyup="filter_name(2);"/>
                </div>
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

   }else if(value == 'score'){
       if(sorting_value == '' || sorting_value == 'Lowest Score'){
           sorting_value = 'Highest Score';
           document.getElementById("img-sort-down-score").style.display = "none";
           document.getElementById("img-sort-up-score").style.display = "block";
       }else{
           sorting_value = 'Lowest Score';
           document.getElementById("img-sort-down-score").style.display = "block";
           document.getElementById("img-sort-up-score").style.display = "none";
       }
   }else{
       sorting_value = value;
   }
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
       console.log(data);
       sort(data, check);
   }else if(type == 'sort'){
       sort(activity_data, check);
   }
}

function sort(activity_dat, check){
    console.log(activity_dat);
    if (activity_dat.length == 0 && check != 0){
        document.getElementById("activity_ticket").innerHTML = '';
        text = '';
        text += `
            <div class="col-lg-12">
                <div style="text-align:center">
                    <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="" title="" />
                    <br/>
                </div>
                <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
            </div>`;
        document.getElementById("activity_ticket").innerHTML = text;
        $('#pagination-container').hide();
        $('#pagination-container2').hide();
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
        console.log(activity_dat);
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
               <div class="col-lg-4 col-md-6">
                   <form action='/activity/detail' method=POST id='myForm`+activity_dat[i].sequence+`'>
                        <div id='csrf`+activity_dat[i].sequence+`'></div>
                        <input type='hidden' value='`+JSON.stringify(activity_dat[i]).replace(/[']/g, /["]/g)+`'/>
                        <input id='uuid' name='uuid' type=hidden value='`+activity_dat[i].uuid+`'/>
                        <input id='sequence' name='sequence' type=hidden value='`+activity_dat[i].sequence+`'/>
                        <div class="single-recent-blog-post item activity_box" style="cursor:pointer;" onclick="go_to_detail('`+activity_dat[i].sequence+`')">
                            <div class="single-destination relative">
                                <div class="thumb relative" style="margin: auto; width:100%; height:200px; background-image: url('http://static.rodextrip.com/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                    <div class="overlay overlay-bg"></div>
                                    <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: cover;">
                                </div>
                                <div class="card card-effect-promotion">
                                    <div class="card-body">
                                        <div class="row details">
                                            <div class="col-lg-12" style="text-align:left;">
                                                <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+activity_dat[i].name+`">`+activity_dat[i].name+`</h6>`;
                                                for(j in activity_dat[i].locations) {
                                                    text+=`
                                                        <span class="span-activity-desc" style="font-size:13px;"> <i style="color:red !important;" class="fas fa-map-marker-alt"></i> `+activity_dat[i].locations[j].city_name+`, `+activity_dat[i].locations[j].country_name+` </span>
                                                        <br/>`;
                                                }
                                            text+=`
                                            <span class="span-activity-desc" style="font-size:13px;"> `+activity_dat[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+activity_dat[i].reviewCount+`)</span>
                                            <br/><br/>
                                            </div>
                                            <div class="col-lg-12" style="text-align:right;">
                                                <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(activity_dat[i].activity_price)+`  </span>
                                                <a href="#" class="btn btn-primary" onclick="go_to_detail('`+activity_dat[i].sequence+`')">BUY</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </form>
               </div>`;
           }
           check_pagination += 1;
        }
        if (text == '' && check != 0)
        {
            text += `
            <div class="col-lg-12">
                <div style="text-align:center">
                    <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="" title="" />
                    <br/>
                </div>
                <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
            </div>`;
            check_pagination = 0;
        }
        document.getElementById('activity_ticket').innerHTML += text;

        var items = $(".activity_box");
        var numItems = items.length;
        var perPage = 21;
        items.slice(perPage).hide();
        $('#pagination-container').pagination({
            items: numItems,
            itemsOnPage: perPage,
            prevText: "<i class='fas fa-angle-left'/>",
            nextText: "<i class='fas fa-angle-right'/>",
            onPageClick: function (pageNumber) {
                var showFrom = perPage * (pageNumber - 1);
                var showTo = showFrom + perPage;
                items.hide().slice(showFrom, showTo).show();
                $('#pagination-container2').pagination('drawPage', pageNumber);
            }
        });

        $('#pagination-container2').pagination({
            items: numItems,
            itemsOnPage: perPage,
            prevText: "<i class='fas fa-angle-left'/>",
            nextText: "<i class='fas fa-angle-right'/>",
            onPageClick: function (pageNumber) {
                var showFrom = perPage * (pageNumber - 1);
                var showTo = showFrom + perPage;
                items.hide().slice(showFrom, showTo).show();
                $('#pagination-container').pagination('drawPage', pageNumber);
            }
        });

        if(check_pagination == 0){
            $('#pagination-container').hide();
            $('#pagination-container2').hide();
        }
        else{
            $('#pagination-container').show();
            $('#pagination-container2').show();
        }
    }
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