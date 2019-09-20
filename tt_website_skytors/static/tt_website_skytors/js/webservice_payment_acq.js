function get_payment_acq(val,booker_seq_id,order_number,transaction_type,signature,type,agent_seq_id,top_up_name){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/payment",
       headers:{
            'action': 'get_payment_acquirer',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'order_number': order_number,
            'booker_seq_id': booker_seq_id,
            'order_number': order_number,
            'transaction_type': transaction_type,
            'signature': signature,
            'type': type,
            'agent_seq_id': agent_seq_id,
            'top_up_name': top_up_name
       },
       success: function(msg) {
            console.log(msg);
            payment_acq2 = {};

            for(i in msg.result.response){
                for(j in msg.result.response[i]){
                    for(k in msg.result.response[i][j]){
                        msg.result.response[i][j][k].method = i;
                        payment_acq2[j] = msg.result.response[i][j];
                    }
                }
            }
            text=`<h4>Payment Method</h4><hr/>
            <h6 style="padding-bottom:10px;">1. Payment Via: </h6>
            <div class="input-container-search-ticket btn-group">

        <div class="form-select" id="default-select">
            <select class="payment_method" id="payment_via" onchange="set_payment('`+val+`','`+type+`');">`;
            for(i in payment_acq2){

                if(i == 'transfer')
                    print = 'Transfer';
                else if(i == 'va')
                    print = 'Virtual Account';
                else if(i == 'cash')
                    print = 'Cash';
                else if(i == 'installment')
                    print = 'Installment';
                else if(i == 'credit_limit')
                    print = 'Credit Limit';

                text+=`<option value="`+i+`">`+print+`</option>`;
            }
            text+=`</select>
            </div>
        </div>`;

            text+=`
            <div id="payment_description"></div>`;
            text+=`
                </div>`;
            document.getElementById('payment_acq').innerHTML = text;
            $('select').niceSelect();
            set_payment(val,type);
            document.getElementById('payment_acq').hidden = false;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function set_payment(val, type){
    payment_method = document.getElementById('payment_via').value;
    text= '';
    for(i in payment_acq2[payment_method]){
//        <span style="font-size:14px;">`+payment_acq.result.response.acquirers[payment_method][i].name+`</span>
        if(payment_method != 'transfer')
        text+=`

        <label class="radio-button-custom">
            <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][i].name+`<br>
            <img width="50px" height="auto" src="`+payment_acq2[payment_method][i].image+`"/></span>
            <input type="radio" name="radio_payment_type" value="`+i+`" onclick="set_price('`+val+`','`+type+`');">
            <span class="checkmark-radio"></span>
        </label><br/>`;
        else
        text+=`

        <label class="radio-button-custom">
            <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][i].name+`<br>
            <img width="50px" height="auto" src="`+payment_acq2[payment_method][i].image+`"/></span>
            <input type="radio" name="radio_payment_type" value="`+i+`" onclick="set_price('`+val+`','`+type+`');">
            <span class="checkmark-radio"></span>
        </label>
        <label class="radio-button-custom">
            <span style="font-size:14px; font-weight:500;"> Account: `+payment_acq2[payment_method][i].account_number+`<br>
            <span style="font-size:14px; font-weight:500;"> Account Name: `+payment_acq2[payment_method][i].account_name+`<br>
        </label>
        <br/>`;
    }
    text += '<div id="set_price"></div>'
    document.getElementById('payment_description').innerHTML = text;
}

function set_price(val, type, product_type){
    selected = '';
    var radios = document.getElementsByName('radio_payment_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            selected = parseInt(radios[j].value);
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    text = '';
    text += ` <h6 style="padding-bottom:10px;">2. Payment Detail: </h6>`;
    text+= `<div class='row'>`;
    if(payment_method == 'cash'){
        //price
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Price:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span id="payment_method_price">`+payment_acq2[payment_method][selected].currency+` `;
                    try{
                        text+=getrupiah((top_up_amount_list[parseInt(document.getElementById('amount').selectedIndex)].amount * parseInt(document.getElementById('qty').value)));
                    }catch(err){
                        text += getrupiah(payment_acq2[payment_method][selected].price_component.amount)
                    }
                    text+=`</span>
                </div>`;
        //fee
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Fee:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].price_component.fee)+`</span>
                </div>`;
        //unique amount
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Unique Amount:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].price_component.unique_amount)+`</span>
                </div>`;

    //    grand total
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span style='font-weight:500;'>Grand Total:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span style='font-weight:500;' id="payment_method_grand_total">`+payment_acq2[payment_method][selected].currency+` `;
                    try{
                        text+=getrupiah((top_up_amount_list[parseInt(document.getElementById('amount').selectedIndex)].amount * parseInt(document.getElementById('qty').value)) + payment_acq2[payment_method][selected].price_component.unique_amount);
                    }catch(err){
                        text += getrupiah(payment_acq2[payment_method][selected].price_component.amount + payment_acq2[payment_method][selected].price_component.unique_amount)
                    }
                    text+=`</span>
                </div>`;
        text+= `</div><br/>`;
    }
    else if(payment_method == 'credit_limit'){
        usage = payment_acq2[payment_method][selected].credit_limit - payment_acq2[payment_method][selected].actual_balance;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Usage:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+getrupiah(usage)+`</span>
                </div>`;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Balance:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+getrupiah(payment_acq2[payment_method][selected].actual_balance)+`</span>
                </div>`;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Credit Limit:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+getrupiah(payment_acq2[payment_method][selected].credit_limit)+`</span>
                </div>`;
        text+= `</div><br/>`;
    }
    else if(payment_method == 'transfer'){
        //price
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Price:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span id="payment_method_price">`+payment_acq2[payment_method][selected].currency+` `;
                    try{
                        text+=getrupiah((top_up_amount_list[parseInt(document.getElementById('amount').selectedIndex)].amount * parseInt(document.getElementById('qty').value)));
                    }catch(err){
                        text += getrupiah(payment_acq2[payment_method][selected].price_component.amount)
                    }
                    text+=`</span>
                </div>`;
        //fee
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Fee:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].price_component.fee)+`</span>
                </div>`;
        //unique amount
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Unique Amount:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].price_component.unique_amount)+`</span>
                </div>`;

    //    grand total
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span style='font-weight:500;'>Grand Total:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span style='font-weight:500;' id="payment_method_grand_total">`+payment_acq2[payment_method][selected].currency+` `;
                    try{
                        text+=getrupiah((top_up_amount_list[parseInt(document.getElementById('amount').selectedIndex)].amount * parseInt(document.getElementById('qty').value)) + payment_acq2[payment_method][selected].price_component.unique_amount);
                    }catch(err){
                        text += getrupiah(payment_acq2[payment_method][selected].price_component.amount + payment_acq2[payment_method][selected].price_component.unique_amount)
                    }
                    text+=`</span>
                </div>`;
        text+= `</div><br/>`;

    }
    if(type == 'visa')
        text += `<button type="button" class="primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="show_loading();check_hold_booking();" style="width:100%;">Issued <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline_review')
        text += `<button type="button" class="primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="show_loading();airline_hold_booking(1);" style="width:100%;">Issued Booking<div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline')
        text += `<button type="button" class="primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="show_loading();airline_issued('`+airline_get_detail.result.response.order_number+`');" style="width:100%;">Issued <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'top_up')
        text += `<button type="button" id="submit_top_up" class="primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="show_loading();check_top_up();" style="width:100%;">Submit <div class="ld ld-ring ld-cycle"></div></button>`;
    document.getElementById('set_price').innerHTML = text;
}

function testing_bca(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bca",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
        'username':$('#username').val(),
        'password':$('#password').val()
       },
       success: function(msg) {
        if(msg == 0){
            gotoForm();
        }else{
            alert('Wrong Username or Password !');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}