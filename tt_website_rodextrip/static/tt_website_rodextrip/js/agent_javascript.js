data_counter = 0;
data_search = [];
function table_reservation(data){
    //check here
    text= '';
    for(i in data){
        data_search.push(data[i]);
        text+=`
        <form action="" class="form-wrap" method="POST" id="gotobooking`+data_counter+`" style="width:100%; margin-bottom:30px;"/>
        <div class="col-lg-12" style="background:white; border:1px solid #cdcdcd; width:100%; padding:15px 15px 0px 15px;">`;
        text+=`
        <div class="row">
            <div class="col-lg-6 mb-3">
                <h5 class="single_border_custom_left" style="padding-left:10px;">
                    `+(data_counter+1)+`.
                    <span name="order_number" style="padding-right:5px;">`+data[i].order_number+` </span>`;

                    if(data[i].provider_type == "airline"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/airlines_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "train"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/train_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "hotel"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/hotel_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "activity"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/activity_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "tour"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/tour_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "visa"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/visa_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "passport"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/passport_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "ppob"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/ppob_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "event"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/event_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "bus"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/bus_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "insurance"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/insurance_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }else if(data[i].provider_type == "offline"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/offline_black.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                    }else if(data[i].provider_type == "groupbooking"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/groupbooking_black.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                    }else if(data[i].provider_type == "mitrakeluarga"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/mitra_keluarga.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                    }else if(data[i].provider_type == "phc"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/phc_logo.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                    }else if(data[i].provider_type == "labpintar"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/lab_pintar.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                    }else if(data[i].provider_type == "sentramedika"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/sentra_medika.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                    }else if(data[i].provider_type == "periksain"){
                        text += `<img src="/static/tt_website_rodextrip/images/icon/periksain.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                    }else{
                        text += `<img src="/static/tt_website_rodextrip/images/icon/wallet_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                    }
                text+=`</h5>
            </div>
            <div class="col-lg-6 mb-3" style="text-align:right;">
                <b style="padding-right:10px;"><i>State:</b></i>`;
                    if(data[i].state_description == 'Issued' || data[i].state_description == 'Done'){
                        text+=`<b style="background:#30b330; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                    }else if(data[i].state_description == 'Booked'){
                        text+=`<b style="background:#3fa1e8; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                    }else if(data[i].state_description == 'Refund' || data[i].state_description == 'Draft' || data[i].state_description == 'Pending' || data[i].state_description == 'New'){
                        text+=`<b style="background:#8c8d8f; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                    }else if(data[i].state_description == 'Booking Failed' || data[i].state_description == 'Expired'
                            || data[i].state_description == 'Cancelled'){
                        text+=`<b style="background:#DC143C; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                    }else{
                        text+=`<b>`;
                    }

                    text+=``+data[i].state_description+`
                </b>
            </div>`;
        text+=`
            <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                <span><b>PNR </b><br/><i>`;
                if(data[i].pnr != ''){
                    text+=``+data[i].pnr+``;
                }else{
                    text+=`-`;
                }
            text+=`
                    </i>
                </span>
            </div>
            <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                <span><b>Hold Date</b><br/>`;
                if(data[i].hold_date == false){
                    text+= `<i>-</i>`;
                }
                else{
                    text+= `<i>`+moment(data[i].hold_date).format('ddd, DD MMM YYYY HH:mm:ss')+`</i>`;
                }
                text+=`</span>
            </div>
            <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">`;
            try{
                if(data[i].carrier_names == '')
                    text+=`<span><b>Provider</b><br/><i>`+data[i].provider_type+`</i></span></hr>`;
                else
                    text+=`<span><b>Provider</b><br/><i>`+data[i].carrier_names+`</i></span>`;
            }catch(err){

            }
            text+=`
            </div>
            <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                <span><b>Booked by</b><br/><i>`;
                if(data[i].booked_uid == false){
                    text+= `-`;
                }
                else{
                    text+= ``+data[i].booked_uid+``;
                }
                text+=`
                </i></span>
            </div>
            <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                <span><b>Booked Date</b><br/><i>`;
                if(data[i].booked_date == false){
                    text+= `-`;
                }
                else{
                    text+= ``+data[i].booked_date+``;
                }
            text+=`</i>
                </span>
            </div>
            <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                <span><b>Booker Name</b><br/><i>`+data[i].booker.name+`</i></span>
            </div>
            <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                <span><b>Issued by</b><br/><i>`;
                if(data[i].issued_uid == false){
                    text+= `-`;
                }
                else{
                    text+= ``+data[i].issued_uid+``;
                }
                text+=`
                </i></span>
            </div>
            <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                <span><b>Issued Date</b><br/><i>`;
                if(data[i].issued_date == false){
                    text+= `-`;
                }
                else{
                    text+= ``+data[i].issued_date+``;
                }
                text+=`
                </i></span>
            </div>`;

        text+=`
            <div class="col-lg-4 for-show-website" style="border-bottom: 1px solid #cdcdcd; padding: 15px;"></div>
            <div class="col-lg-6 mb-2" style="padding: 15px;">
                <b>Description: </b><br/>`;
                if(data[i].transaction_addtional_info != '')
                    text+= `<span>`+data[i].transaction_addtional_info+`</span>`;
                else
                    text+= `<span>-</td>`;
        text+=`
            </div>`;

//        if(data[i].provider_type == 'offline'){
//            text+= `<td>`;
//            if(data[i].state == 'booked' || data[i].state == 'issued'){
//                text+=
//                    `<a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
//                        <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
//                        <div class="ld ld-ring ld-cycle"></div>
//                    </a>
//                    <div class="modal fade" id="printInvoice" role="dialog" data-keyboard="false">
//                        <div class="modal-dialog">
//
//                          <!-- Modal content-->
//                            <div class="modal-content">
//                                <div class="modal-header">
//                                    <h4 class="modal-title" style="color:`+text_color+`">Invoice</h4>
//                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
//                                </div>
//                                <div class="modal-body">
//                                    <div class="row">
//                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//                                            <span class="control-label" for="Name">Name</span>
//                                            <div class="input-container-search-ticket">
//                                                <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
//                                            </div>
//                                        </div>
//                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
//                                            <span class="control-label" for="Additional Information">Additional Information</span>
//                                            <div class="input-container-search-ticket">
//                                                <textarea style="width:100%;" rows="4" id="additional_information" name="additional_information" placeholder="Additional Information"></textarea>
//                                            </div>
//                                        </div>
//                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
//                                            <span class="control-label" for="Address">Address</span>
//                                            <div class="input-container-search-ticket">
//                                                <textarea style="width:100%;" rows="4" id="bill_address" name="bill_address" placeholder="Address"></textarea>
//                                                <!--<input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_address" placeholder="Address" required="1"/>-->
//                                            </div>
//                                        </div>
//                                    </div>
//                                    <br/>
//                                    <div style="text-align:right;">
//                                        <span>Don't want to edit? just submit</span>
//                                        <br/>
//                                        <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+data[i].order_number+`', 'invoice','`+data[i].provider_type+`');"/>
//                                    </div>
//                                </div>
//                                <div class="modal-footer">
//                                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
//                                </div>
//                            </div>
//                        </div>
//                    </div>`;
//            }
//            if(data[i].state == 'issued')
//            text+=`
//                    <!--<input type='button' value='Search' class="primary-btn-custom" onclick="goto_detail_reservation(`+data_counter+`)" />-->
//                    <!--<input type='button' value='Search' class="primary-btn-custom" onclick="goto_detail_reservation(`+data_counter+`)" />-->
//                    </td>`;
//        }else
        if(data[i].state != 'fail_booking')
            text+= `
            <div class="col-lg-6 mb-2" style="text-align:right; padding: 15px;">
                <button type='button' class="primary-btn-custom" onclick="goto_detail_reservation(`+data_counter+`)">
                    Check <i class="fas fa-search"></i>
                </button>
            </div>`;

        text+= `</div></div>`;
        document.getElementById("table_reservation").innerHTML += text;
        $('#loading-search-reservation').hide();
//                   document.getElementById('airlines_ticket').innerHTML += text;
        text = '';
        data_counter++;
        if(data.length == 80){
            load_more = true;
        }
    }
}

function auto_complete(type){
    if(type.includes('country_of_issued') && document.getElementById('select2-'+type+'_id-container').innerHTML == 'Country Of Issued' || type.includes('country_of_issued') && document.getElementById('select2-'+type+'_id-container').innerHTML == 'Select Country Of Issued') //prevent otomatis dari contact autofill
        document.getElementById(type).value = '';
    else if(type.includes('nationality') && document.getElementById('select2-'+type+'_id-container').innerHTML == 'Nationality' || type.includes('country_of_issued') && document.getElementById('select2-'+type+'_id-container').innerHTML == 'Select Nationality') //prevent otomatis dari contact autofill
        document.getElementById(type).value = '';
    else
        document.getElementById(type).value = document.getElementById('select2-'+type+'_id-container').innerHTML;
//    $('#'+type).niceSelect('update');
//    console.log(type);
//    $('#'+type).val(document.getElementById('select2-'+type+'_id-container').innerHTML);
//    $("#"+type).val("").trigger("change")
//    $('#'+type).select2().trigger('change');
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
            for(x=0;x<pj;x++){
                if((pj-x)%3==0 && x!=0){
                    priceshow+=",";
                }
                priceshow+=temp.charAt(x);
            }
            if(temp.split('.').length == 2){
                for(x=pj;x<pj+3;x++){
                    priceshow+=temp.charAt(x);
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

function payment_top_up(){
    text = '';
    for(i in response.non_member){
        if(i == document.getElementById('payment_selection').value){
            for(j in response.non_member[i]){
                if(j == 0){
                    text += `
                    <div>
                        <label class="radio-button-custom">
                            <span title="`+response.non_member[i][j].name+`"> <img class="img img-responsive" src="" alt="`+response.non_member[i][j].name+`" style="max-width: 60px; display: inline-block"> `+response.non_member[i][j].name+`</span>
                            <input type="radio" checked="checked" name="acquirer" value="`+response.non_member[i][j].acquirer_seq_id+`" checked="checked" onclick="set_radio_payment('`+i+`');">
                            <span class="checkmark-radio"></span>
                        </label>
                    </div><hr/>`;
                }else{
                    text += `
                    <div>
                        <label class="radio-button-custom">
                            <span title="`+response.non_member[i][j].name+`"> <img class="img img-responsive" src="" alt="`+response.non_member[i][j].name+`" style="max-width: 60px; display: inline-block"> `+response.non_member[i][j].name+`</span>
                            <input type="radio" name="acquirer" value="`+response.non_member[i][j].acquirer_seq_id+`" onclick="set_radio_payment('`+i+`');">
                            <span class="checkmark-radio"></span>
                        </label>
                    </div><hr/>`;
                }
            }
            document.getElementById('payment').innerHTML = text;

            if(i == 'transfer'){
                set_radio_payment('transfer');
                document.getElementById('total_amount').innerHTML = `<span>Total IDR `+getrupiah(response.non_member[i][0].total_amount)+`</span>`;
            }else if('sgo_va'){
                set_radio_payment('sgo_va');
                document.getElementById('total_amount').innerHTML = `<span>Total IDR `+getrupiah(response.non_member[i][0].amount)+`</span>`;
            }else{
                document.getElementById('total_amount').innerHTML = `<span>Total IDR `+getrupiah(response.non_member[i][0].amount)+`</span>`;
            }


            break;
        }
    }
}

function set_radio_payment(type){
    var radios = document.getElementsByName('acquirer');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            id = j;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    for(i in response.non_member){
        if(i == document.getElementById('payment_selection').value){
            for(j in response.non_member[i]){
                if(j == id){
                    if(type == 'transfer'){
                        document.getElementById('desc').innerHTML = `
                        <h4>Bank `+response.non_member[i][j].name+`</h4>
                        <br/>
                        <span style="font-size:16px; font-weight:bold;">Account Name: `+response.non_member[i][j].account_name+`</span>
                        <br/>
                        <span style="font-size:16px; font-weight:bold;">No Rekening: `+response.non_member[i][j].account_number+`</span>`;
                    }
                    else if(type == 'sgo_va')
                        document.getElementById('desc').innerHTML = `
                        <h4>`+response.acquirers[i][j].name+`</h4>
                        <br/>
                        <span style="font-size:16px; font-weight:bold;">No Virtual Account: `+response.non_member[i][j].number+`</span>`;
                }
            }
        }
    }
}

//    if(document.getElementById('payment_selection').value == 'cash'){
//        text = '';
//        for(i in response.acquirers.cash){
//            text += `
//            <label>
//                <input type="radio" name="acquirer" value="`+response.acquirers.cash[i].id+`" checked="checked">
//                <span title="Cash"><img class="img img-responsive" src="data:image/jpeg;base64, `+response.acquirers.cash[i].image+`" style="max-width: 60px; display: inline-block"></span>
//                <span>Cash</span>
//            </label>`;
//        }
//        document.getElementById('payment').innerHTML = text;
//        document.getElementById('total_amount').innerHTML = `<span>`+response.acquirer.cash[0].amount+`</span>`;
//
//    }else if(document.getElementById('payment_selection').value == 'transfer'){
//        console.log(response);
//        text = '';
//        for(i in response.acquirers.tt_transfer){
//            text += `
//            <label>
//                <input type="radio" name="acquirer" value="`+response.acquirers.tt_transfer[i].id+`" checked="checked">
//                <span title="Transfer"><img class="img img-responsive" src="data:image/jpeg;base64, `+response.acquirers.tt_transfer[i].image+`" style="max-width: 60px; display: inline-block"></span>
//                <span>response.acquirers.tt_transfer[i].name</span>
//                <span>response.acquirers.tt_transfer[i].number</span>
//            </label>`;
//        }
//        document.getElementById('payment').innerHTML = text;
//        document.getElementById('total_amount').innerHTML = `<span>`+response.acquirer.tt_transfer[0].amount+`</span>`;
//    }
