data_counter = 0;
data_search = [];
function table_reservation(data, mode_view, restart=false){
    //check here
    text= '';

    if(restart){
        document.getElementById("table_reservation").innerHTML = '';
        data_counter = 0;
    }

    if(mode_view == "table_mode"){
        if(document.getElementById('reservation_table_mode_id') == null){

            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                text+=`<div style="overflow:auto;">`;
            }else{
                text+=`<div style="overflow:auto; max-height:600px;">`;
            }

            text+=`
            <table style="margin-top:15px; background:white; width:100%;" id="reservation_table_mode_id" class="list-of-reservation">`;
            text+=`
            <tr>
                <th><div style="width:30px;">No.</div></th>
                <th><div style="width:150px;">PNR, Order Number</div></th>
                <th><div style="width:100px;">Provider</div></th>
                <th><div style="width:150px;">State</div></th>
                <th><div style="width:90px;">Hold Date</div></th>
                <th><div style="width:150px;">Booker Name</div></th>`;
                if($("input[name='filter']:checked").val() == 'airline')
                    text+=`<th><div style="width:100px;">Flight Number</div></th>`;
                text+=`<th><div style="width:200px;">Info</div></th>`;
                if($("input[name='filter']:checked").val() == 'hotel'){
                    text+=`<th><div style="width:80px;">R/N</div></th>`;
                }else{
                    text+=`<th><div style="width:80px;">Pax</div></th>`;
                }

                text+=`
                <th><div style="width:150px;">Agent Name</div></th>
                <th><div style="width:170px;">Booked</div></th>
                <th><div style="width:170px;">Issued</div></th>
            </tr>`;
        }
        for(i in data){
            text+=`
            <tr>
                <form action="" method="POST" id="gotobooking`+data_counter+`">
                    <td>
                    <h6 class="mb-1">
                        `+(data_counter+1)+`.`;
                    text+=`
                    </h6>`;

                    text+=`<td>`;
                    if(data[i].state != 'fail_booking')
                        text+= `<b class="span_link" type="button" onclick="goto_detail_reservation(`+data_counter+`)">PNR <i class="fas fa-external-link-alt" style="color:`+color+`; padding-left:5px; font-size:18px;"><span style="font-size:13px;">open</span></i>`;
                    else
                        text+= `<b>PNR`;
                    text+=`</b>`;

                    if(data[i].pnr){
                        text+=`<br/>`+data[i].pnr+`<br/>`;
                    }
                    else{
                        text+= `<br/>-<br/>`;
                    }

                    text+=`<b>Order Number</b><br/><span name="order_number">`+data[i].order_number;
                    text+=`</span>`;
                    text+=`</td>`;

                    text+=`</td>`;

                    try{
                        if(data[i].carrier_names == '')
                            text+=`<td><b>`+data[i].provider_type+`</b></td>`;
                        else
                            text+=`<td><b>`+data[i].carrier_names+`</b></td>`;
                    }catch(err){

                    }

                    text+= `<td>`;

                    if(data[i].state_description == 'Issued' || data[i].state_description == 'Done'){
                        text+=`<b style="background:#30b330; font-size:13px; color:white; padding:5px 15px; display:unset;">`;
                    }else if(data[i].state_description == 'Booked'){
                        text+=`<b style="background:#3fa1e8; font-size:13px; color:white; padding:5px 15px; display:unset;">`;
                    }else if(data[i].state_description == 'Refund' || data[i].state_description == 'Draft' || data[i].state_description == 'Pending' || data[i].state_description == 'New'){
                        text+=`<b style="background:#8c8d8f; font-size:13px; color:white; padding:5px 15px; display:unset;">`;
                    }else if(data[i].state_description == 'Booking Failed' || data[i].state_description == 'Expired'
                            || data[i].state_description == 'Cancelled'){
                        text+=`<b style="background:#DC143C; font-size:13px; color:white; padding:5px 15px; display:unset;">`;
                    }else{
                        text+=`<b>`;
                    }

                    text+=data[i].state_description+`</b></td>`;

                    if(data[i].hold_date == false){
                        text+= `<td>-</td>`;
                    }
                    else{
                        let date_text = data[i].hold_date.slice(0, 12);
                        let time_text = data[i].hold_date.slice(12);
                        text+= `<td>`+date_text+`<br/>`+time_text+`</td>`;
                    }
                    text+= `<td>`+data[i].booker.name+`</td>`;

                    if($("input[name='filter']:checked").val() == 'airline'){
                        var flightArr = data[i].flight_number.split(';');
                        text+=`<td>`;
                        for(fl in flightArr){
                            text+=flightArr[fl]+`<br/>`;
                        }
                        text+=`</td>`;
                    }

                    if(data[i].transaction_additional_info != '')
                        text+= `<td>`+data[i].transaction_additional_info+`</td>`;
                    else
                        text+= `<td>-</td>`;
                    text+=`<td>`+data[i].total_pax+`</b></td>`;
                    text+= `<td>`+data[i].agent_name+`</td>`;

                    text+= `<td>`;
                    if(data[i].booked_date)
                        text+= `<b>Date</b><br/>`+data[i].booked_date+`<br/>`;
                    else
                        text+= `<b>Date</b><br/>-<br/>`;

                    if(data[i].booked_uid == false){
                        text+= `<b>by</b><br/>-`;
                    }
                    else{
                        text+= `<b>by</b><br/>`+data[i].booked_uid;
                    }

                    text+= `</td>`;

                    text+= `<td>`;
                    if(data[i].issued_date == false){
                        text+= `<b>Date</b><br/>-<br/>`;
                    }
                    else{
                        text+= `<b>Date</b><br/>`+data[i].issued_date+`<br/>`;
                    }
                    if(data[i].issued_uid == false){
                        text+= `<b>by</b><br/>-`;
                    }
                    else{
                        text+= `<b>by</b><br/>`+data[i].issued_uid;
                    }
                    text+= `</td>`;
                    text+=`
                </form>
            </tr>`;
        //                   document.getElementById('airlines_ticket').innerHTML += text;
            data_counter++;
            if(data.length == 80){
                load_more = true;
            }
        }
        if(document.getElementById('reservation_table_mode_id') == null)
            text+=`</table></div>`;

        if(document.getElementById('reservation_table_mode_id') == null)
            document.getElementById("table_reservation").innerHTML += text;
        else
            document.getElementById("reservation_table_mode_id").innerHTML += text;

        $('#loading-search-reservation').hide();
    }
    else{
        for(i in data){
            text+=`
            <div class="col-lg-12">
                <div class="row">
                    <form action="" class="form-wrap" method="POST" id="gotobooking`+data_counter+`" style="width:100%; margin-bottom:30px;"/>
                    <div class="col-lg-12" style="background:white; border:1px solid #cdcdcd; width:100%; padding:15px 15px 0px 15px;">`;
                    text+=`
                    <div class="row">
                        <div class="col-lg-6 mb-3">
                            <h4 class="single_border_custom_left" style="padding-left:10px;">`;

                            if(data[i].provider_type == "airline"){
                                text += `<img src="/static/tt_website/images/icon/product/b-airline.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "train"){
                                text += `<img src="/static/tt_website/images/icon/train_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "hotel"){
                                text += `<img src="/static/tt_website/images/icon/hotel_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "activity"){
                                text += `<img src="/static/tt_website/images/icon/product/b-activity.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "tour"){
                                text += `<img src="/static/tt_website/images/icon/tour_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "visa"){
                                text += `<img src="/static/tt_website/images/icon/visa_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "passport"){
                                text += `<img src="/static/tt_website/images/icon/passport_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "ppob"){
                                text += `<img src="/static/tt_website/images/icon/ppob_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "event"){
                                text += `<img src="/static/tt_website/images/icon/product/b-event.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "bus"){
                                text += `<img src="/static/tt_website/images/icon/product/b-bus.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "insurance"){
                                text += `<img src="/static/tt_website/images/icon/insurance_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }else if(data[i].provider_type == "offline"){
                                text += `<img src="/static/tt_website/images/icon/offline_black.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                            }else if(data[i].provider_type == "groupbooking"){
                                text += `<img src="/static/tt_website/images/icon/product/b-group.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                            }else if(data[i].provider_type == "mitrakeluarga"){
                                text += `<img src="/static/tt_website/images/icon/mitra_keluarga.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                            }else if(data[i].provider_type == "phc"){
                                text += `<img src="/static/tt_website/images/icon/phc_logo.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                            }else if(data[i].provider_type == "labpintar"){
                                text += `<img src="/static/tt_website/images/icon/lab_pintar.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                            }else if(data[i].provider_type == "sentramedika"){
                                text += `<img src="/static/tt_website/images/icon/sentra_medika.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                            }else if(data[i].provider_type == "periksain"){
                                text += `<img src="/static/tt_website/images/icon/periksain.png" alt="`+data[i].provider_type+`" style="width:auto; height:20px;">`;
                            }else{
                                text += `<img src="/static/tt_website/images/icon/wallet_black.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;">`;
                            }

                            text+=`
                                `+(data_counter+1)+`.
                                <span name="order_number" style="padding-right:5px;">`+data[i].order_number+` </span>`;
                            text+=`</h4>
                        </div>
                        <div class="col-lg-6 mb-3" style="text-align:right;">
                            <b style="padding-right:10px;"><i>State:</b></i>`;
                                if(data[i].state_description == 'Issued' || data[i].state_description == 'Done'){
                                    text+=`<b style="background:#30b330; font-size:13px; color:white; padding:5px 15px; display:unset;">`;
                                }else if(data[i].state_description == 'Booked'){
                                    text+=`<b style="background:#3fa1e8; font-size:13px; color:white; padding:5px 15px; display:unset;">`;
                                }else if(data[i].state_description == 'Refund' || data[i].state_description == 'Draft' || data[i].state_description == 'Pending' || data[i].state_description == 'New'){
                                    text+=`<b style="background:#8c8d8f; font-size:13px; color:white; padding:5px 15px; display:unset;">`;
                                }else if(data[i].state_description == 'Booking Failed' || data[i].state_description == 'Expired'
                                        || data[i].state_description == 'Cancelled'){
                                    text+=`<b style="background:#DC143C; font-size:13px; color:white; padding:5px 15px; display:unset;">`;
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
                        <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                            <b>Description: </b><br/>`;
                            if(data[i].transaction_addtional_info != '')
                                text+= `<i>`+data[i].transaction_addtional_info+`</i>`;
                            else
                                text+= `<span>-</span></td>`;
                    text+=`
                        </div>`;
                    text+=`
                        <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">`;
                        if($("input[name='filter']:checked").val() == 'hotel'){
                            text+=`
                            <b>Total R/N </b><br/>`;
                        }else{
                            text+=`
                            <b>Total Pax </b><br/>`;
                        }
                            text+= `<i>`+data[i].total_pax+`</i>
                        </div>`;
                    if($("input[name='filter']:checked").val() == 'airline'){
                        text+=`
                        <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                            <b>Flight Number: </b><br/>`;
                            text+= `<i>`+data[i].flight_number+`</i>
                        </div>`;
                    }else{
                        text+=`<div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;"></div>`;
                    }


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
        //                                    <h4 class="modal-title">Invoice</h4>
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
                                Detail <i class="fas fa-external-link-alt"></i>
                            </button>
                        </div>`;

                    text+= `
                        </div>
                    </div>
                </div>
            </div>`;
            document.getElementById("table_reservation").innerHTML += text;
            $('#load_more_reservation').show();
            $('#loading-search-reservation').hide();
    //                   document.getElementById('airlines_ticket').innerHTML += text;
            text = '';
            data_counter++;
            if(data.length == 80){
                load_more = true;
            }
        }
    }

    if(load_more == false)
        $('#load_more_reservation').hide();
    else
        $('#load_more_reservation').show();

}

function auto_complete(type){
//    try{
//        //di buat try catch untuk airline edit pax after sales
//        if(type.includes('country_of_issued') && document.getElementById('select2-'+type+'_id-container').innerHTML == 'Country Of Issued' || type.includes('country_of_issued') && document.getElementById('select2-'+type+'_id-container').innerHTML == 'Select Country Of Issued') //prevent otomatis dari contact autofill
//            document.getElementById(type).value = '';
//        else if(type.includes('nationality') && document.getElementById('select2-'+type+'_id-container').innerHTML == 'Nationality' || type.includes('country_of_issued') && document.getElementById('select2-'+type+'_id-container').innerHTML == 'Select Nationality') //prevent otomatis dari contact autofill
//            document.getElementById(type).value = '';
//        else
//            document.getElementById(type).value = document.getElementById('select2-'+type+'_id-container').innerHTML;
//    }catch(err){console.log(err);}
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

function toggle_corpor_mode_div(prov_type){
    if(document.getElementById('checkbox_corpor_mode_'+prov_type).checked == true){
        if(typeof(agent_corpor_data) === 'undefined'){
            get_corpor_list(prov_type);
        }
        else
        {
            text = ``;
            for(i in agent_corpor_data){
                text += `<option value="`+i+`">`+agent_corpor_data[i].name+`</option>`;
            }
            document.getElementById(prov_type+'_corpor_select').innerHTML = text;
            document.getElementById('div_corpor_mode_'+prov_type).style.display = "block";
            $('#'+prov_type+'_corpor_select').select2();
            if(text != '')
            {
                render_corbooker_list(prov_type);
            }
            document.getElementById('div_corpor_mode_'+prov_type).style.display = "block";
        }
    }
    else{
        document.getElementById('div_corpor_mode_'+prov_type).style.display = "none";
    }
}

function render_corbooker_list(prov_type){
    var cor_selection = document.getElementById(prov_type+'_corpor_select');
    var cor_sel_value = cor_selection.options[cor_selection.selectedIndex].value;
    document.getElementById(prov_type+'_corpor_select_post').value = cor_sel_value;
    text = ``;
    for(i in agent_corpor_data[cor_sel_value].booker_data){
        text += `<option value="`+i+`">`+agent_corpor_data[cor_sel_value].booker_data[i].name+`</option>`;
    }
    document.getElementById(prov_type+'_corbooker_select').innerHTML = text;
    $('#'+prov_type+'_corbooker_select').select2();
    if(text != ''){
        set_corbooker_post_value(prov_type);
    }
}

function set_corbooker_post_value(prov_type){
    var corbooker_selection = document.getElementById(prov_type+'_corbooker_select');
    var corbooker_sel_value = corbooker_selection.options[corbooker_selection.selectedIndex].value;
    document.getElementById(prov_type+'_corbooker_select_post').value = corbooker_sel_value;
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
