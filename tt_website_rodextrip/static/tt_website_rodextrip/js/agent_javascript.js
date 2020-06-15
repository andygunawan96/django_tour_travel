data_counter = 0;
data_search = [];
function table_reservation(data){
    //check here
    text= '';
    var node = document.createElement("tr");
    for(i in data){
        data_search.push(data[i]);
        text+=`
        <form action="" class="form-wrap" method="POST" id="gotobooking`+data_counter+`" />
        <tr>
            <td>`+(data_counter+1)+`</td>
            <td name="order_number">`+data[i].order_number+`</td>`;
        try{
            if(data[i].carrier_names == '')
                text+=`<td>`+data[i].provider_type+`</td>`;
            else
                text+=`<td>`+data[i].carrier_names+`</td>`;
        }catch(err){

        }
        text+= `<td>`+data[i].booked_date+`</td>`;
        text+= `<td>`+data[i].booker.name+`</td>`;
        if(data[i].hold_date == false){
            text+= `<td>-</td>`;
        }
        else{
            text+= `<td>`+data[i].hold_date+`</td>`;
        }

        text+= `<td>`+data[i].state_description+`</td>`;

        text+= `<td>`+data[i].pnr+`</td>`;

        if(data[i].issued_date == false){
            text+= `<td>-</td>`;
        }
        else{
            text+= `<td>`+data[i].issued_date+`</td>`;
        }

        if(data[i].issued_uid == false){
            text+= `<td>-</td>`;
        }
        else{
            text+= `<td>`+data[i].issued_uid+`</td>`;
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
            text+= `<td><input type='button' value='Search' class="primary-btn-custom" onclick="goto_detail_reservation(`+data_counter+`)" /></td>`;
        else{
            text+= `<td> - </td>`;
        }
        text+= `</tr>`;
        node.innerHTML = text;
        document.getElementById("table_reservation").appendChild(node);
        node = document.createElement("tr");
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
                            <span title="`+response.non_member[i][j].name+`"> <img class="img img-responsive" src="" style="max-width: 60px; display: inline-block"> `+response.non_member[i][j].name+`</span>
                            <input type="radio" checked="checked" name="acquirer" value="`+response.non_member[i][j].seq_id+`" checked="checked" onclick="set_radio_payment('`+i+`');">
                            <span class="checkmark-radio"></span>
                        </label>
                    </div><hr/>`;
                }else{
                    text += `
                    <div>
                        <label class="radio-button-custom">
                            <span title="`+response.non_member[i][j].name+`"> <img class="img img-responsive" src="" style="max-width: 60px; display: inline-block"> `+response.non_member[i][j].name+`</span>
                            <input type="radio" name="acquirer" value="`+response.non_member[i][j].seq_id+`" onclick="set_radio_payment('`+i+`');">
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
