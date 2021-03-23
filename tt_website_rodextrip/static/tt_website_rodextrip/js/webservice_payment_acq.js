function get_payment_acq(val,booker_seq_id,order_number,transaction_type,signature,type,agent_seq_id,top_up_name){
    order_number_id = order_number;
    $.ajax({
       type: "POST",
       url: "/webservice/payment",
       headers:{
            'action': 'get_payment_acquirer',
       },
       data: {
            'order_number': order_number,
            'booker_seq_id': booker_seq_id,
            'transaction_type': transaction_type,
            'signature': signature,
            'type': type,
            'agent_seq_id': agent_seq_id,
            'top_up_name': top_up_name
       },
       success: function(msg) {
            console.log(msg);
            console.log(type);
            payment_acq2 = {};
            type_render = type;
            val_render = val;
            try{
                $("#show_loading_booking_airline").hide();
            }catch(err){}
            for(i in msg.result.response){
                for(j in msg.result.response[i]){
                    for(k in msg.result.response[i][j]){
                        msg.result.response[i][j][k].method = i;
                        payment_acq2[j] = msg.result.response[i][j];
                    }
                }
            }
            render_payment();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment acq');
       },timeout: 60000
    });
}
function render_payment(){
    try{
        if(Object.keys(payment_acq2).length != 0){
//            if(merchant_espay){
//                for(i in payment_acq2){
//                    if(i == 'payment_gateway'){
//                        for(j in payment_acq2[i]){
//                            console.log(payment_acq2[i][j].name);
//                            if(payment_acq2[i][j].name == "Payment Gateway"){
//                                payment_acq_temp = payment_acq2[i].splice(j,1)[0]
//                                break;
//                            }
//                        }
//                        break;
//                    }
//                }
//                try{
//                    for(i in payment_acq2){
//                        if(i == 'payment_gateway'){
//                            for(j in merchant_espay.result.response){
//                                if(merchant_espay.result.response[j].productCode != 'CREDITCARD'){
//                                    payment_acq_temp['bank']['code'] = merchant_espay.result.response[j]['bankCode']
//                                    payment_acq_temp['bank']['name'] = merchant_espay.result.response[j]['productCode']
//                                    payment_acq_temp['name'] = merchant_espay.result.response[j]['productName']
//                                    payment_acq2[i].push(JSON.parse(JSON.stringify(payment_acq_temp)));
//                                }
//                            }
//                            break;
//                        }
//                    }
//                }catch(err){
//                    console.log(err);
//                }
//            }
            if(type_render == 'top_up')
                text=`<h4 style="color:`+color+`;">Payment Method</h4><hr/>`;
            else
                text=`<h4 style="color:`+color+`;">Customer Payment Method</h4><hr/>`;
            text+=`
            <h6 style="padding-bottom:10px;">1. Payment Via: </h6>`;
            if(template == 1 || template == 5){
                text+=`<div class="input-container-search-ticket btn-group">`;
            }else if(template == 4){
                text+=`<div style="display:flex; margin-bottom:15px; width:100%;">`;
            }else{
                text+=`<div>`;
            }
            if(template == 1 || template == 2 || template == 4 || template == 5){
                text+=`<div class="form-select" id="default-select">`;
            }else if(template == 3){
                text+=`<div class="default-select" style="margin-bottom:15px;">`;
            }

            if(template == 4){
                text+=`<select class="nice-select-default rounded payment_method" id="payment_via" onchange="set_payment('`+val_render+`','`+type_render+`');">`;
            }else{
                text+=`<select class="payment_method" id="payment_via" onchange="set_payment('`+val_render+`','`+type_render+`');">`;
            }
            for(i in payment_acq2){
                print = '';
                if(i == 'va')
                    print = 'Virtual Account';
                else{
                    data_temp = i.split('_').join(' ')
                    print = data_temp.charAt(0).toUpperCase() + data_temp.slice(1).toLowerCase();
                }
                text+=`<option value="`+i+`">`+print+`</option>`;
            }
            text+=`</select>
            </div>
        </div>`;

            text+=`
            <div id="payment_description" style="text-align:left;"></div>`;
            text+=`
                </div>`;
            document.getElementById('payment_acq').innerHTML = text;
            $('.payment_acq_btn').prop('disabled', false);
            $('.payment_acq_btn').removeClass("running");
            $("#loading_payment_acq").hide();

            $('#payment_via').niceSelect();
            set_payment(val_render,type_render);
        //            focus_box('payment_acq');
        //            document.getElementById('payment_acq').hidden = false;
        }else{
            text = `There's no `+name+` gateway payment available right now <br/>`;
            try{
                if(type_render == 'top_up')
                    text +=  `please use online payment`;
            }catch(err){}
            Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: text,
               })
            $('.payment_acq_btn').prop('disabled', false);
            $('.payment_acq_btn').removeClass("running");
            close_div('payment_acq');
            $("#loading_payment_acq").hide();
        }
    }catch(err){console.log(err)}
}

//testing webhook
function payment(){
    $.ajax({
       type: "POST",
       url: "/webservice/payment",
       headers:{
            'action': 'payment',
       },
       data: {},
       success: function(msg) {
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
       },timeout: 60000
    });
}

function set_payment(val, type){
    payment_method = document.getElementById('payment_via').value;
    text= '';
    for(i in payment_acq2[payment_method]){
//        <span style="font-size:14px;">`+payment_acq.result.response.acquirers[payment_method][i].name+`</span>
        if(payment_method == 'credit_limit')
        text+=`

        <label class="radio-button-custom">
            <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][i].name+`<br></span>
            <input type="radio" name="radio_payment_type" value="`+i+`" onclick="set_price('`+val+`','`+type+`');">
            <span class="checkmark-radio"></span>
        </label>
        <br/>`;
        else{
            text+=`

            <label class="radio-button-custom">
                <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][i].name+`<br>`;

            if(payment_acq2[payment_method][i].image){
                text+=`<img width="50px" height="auto" alt="Logo `+payment_acq2[payment_method][i].name+`" src="`+payment_acq2[payment_method][i].image+`"/></span>`;
            }

            text+=`
                <input type="radio" name="radio_payment_type" value="`+i+`" onclick="set_price('`+val+`','`+type+`');">
                <span class="checkmark-radio"></span>
            </label>
            <br/>`;
        }
    }
    text += '<div id="set_detail"></div><br/><div id="set_price"></div>'
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
    if(+payment_acq2[payment_method][selected].hasOwnProperty('description_msg') == true)
        document.getElementById('set_detail').innerHTML = `<i>`+payment_acq2[payment_method][selected].description_msg +'</i>';
    text += ` <h6 style="padding-bottom:10px;">2. Payment Detail: </h6>`;
    if(payment_method != 'credit_limit'){
        if(payment_method == 'payment_gateway' && payment_acq2[payment_method][selected].online_wallet == true){
            text+=`<div class='row'>
                <div class="col-sm-5" style='text-align:left;'>
                <span style="font-size:13px;"> Phone Number: </span>

                </div>
                <div class="col-sm-7" style='text-align:right;'>
                    <input type='text' id="phone_number"/>
                </div>`;
        }else{
        text+=`<div class='row'>
                <div class="col-sm-5" style='text-align:left;'>
                <span style="font-size:13px;"> Account: </span><br>
                <span style="font-size:13px;;"> Account Name: </span>

                </div>
                <div class="col-sm-7" style='text-align:right;'>
                    <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][selected].account_number+`<br/>
                    <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][selected].account_name+`<br>
                </div>`;
        }
    }else if(payment_method == 'credit_limit'){
        text+=`<div class='row'>
                <div class="col-sm-5" style='text-align:left;'>
                <span style="font-size:13px;;"> Account Name: </span>

                </div>
                <div class="col-sm-7" style='text-align:right;'>
                    <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][selected].name+`<br>
                </div>`;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Credit Limit:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].credit_limit)+`</span>
                </div>`;
        usage = payment_acq2[payment_method][selected].credit_limit - payment_acq2[payment_method][selected].actual_balance;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Usage:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(usage)+`</span>
                </div>`;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Balance:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].actual_balance)+`</span>
                </div>`;

    }
    if(type == 'top_up' && payment_method == 'va'){
        var temp = payment_acq2[payment_method][selected].name.split(' ');
        var temp_data = '';
        for(i in temp)
          if(i > 1)
            temp_data += temp[i] + ' '
        text+= `<div class="col-sm-12" data-id="253" data-token="">

            <div>
            <div id="mandiri_va_acquirer">
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                <p><strong>Transfer Instruction</strong></p>
                <div class="panel panel-default">
                    <div class="instruction-heading" role="tab" id="headingOne">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseFour">
                                `+temp_data+` - Mobile Banking
                            </a>
                        </h4>
                    </div>
                    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne" style="">
                        <div class="panel-body">
                            <div style="margin:0px auto;max-width:600px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                                                <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>

                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        1. Login into your Mobile Banking account
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        2. Select <strong>Payment &gt; Create New Payment &gt; Multipayment &gt; Espay</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        3. Input <strong>16 digits Virtual Account Number</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        4. Input the <strong>minimum TOP UP amount of Rp. 50.000 and transaction fee Rp. 5000</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        5. Once everything are set, input <strong>OTP and SMS Banking Pin, then click OK</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        6. `+name+` balance will be added automatically (REAL TIME) after your payment is complete
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="instruction-heading" role="tab" id="headingTwo">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseFour">
                                ATM Bersama - Mobile Banking
                            </a>
                        </h4>
                    </div>
                    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                        <div class="panel-body">
                            <div style="margin:0px auto;max-width:600px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                                                <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>

                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        1. Login into your Mobile Banking account
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        2. Select <strong>Transfer &gt; Transfer to another bank &gt; Mandiri Bank</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        3. Input <strong>16 digits Virtual Account Number</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        4. Input the <strong>minimum TOP UP amount of Rp. 50.000 and transaction fee Rp. 5000</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        5. Once everything are set, input <strong>OTP and SMS Banking Pin, then click OK</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        6. `+name+` balance will be added automatically (REAL TIME) after your payment is complete
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="instruction-heading" role="tab" id="headingThree">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseFour">
                                ATM Prima - Mobile Banking
                            </a>
                        </h4>
                    </div>
                    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                        <div class="panel-body">
                            <div style="margin:0px auto;max-width:600px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                                                <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        1. Login into your Mobile Banking account
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        2. Select <strong>Transfer &gt; Transfer to another bank &gt; Mandiri Bank</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        3. Input <strong>16 digits Virtual Account Number</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        4. Input the <strong>minimum TOP UP amount of Rp. 50.000 and transaction fee Rp. 5000</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        5. Once everything are set, input <strong>OTP and SMS Banking Pin, then click OK</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        6. `+name+` balance will be added automatically (REAL TIME) after your payment is complete
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="instruction-heading" role="tab" id="headingFour">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                ATM Mandiri
                            </a>
                        </h4>
                    </div>
                    <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
                        <div class="panel-body">
                            <div style="margin:0px auto;max-width:600px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                                                <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>

                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        1. Enter your Mandiri ATM card, then input your PIN
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        2. Select <strong>Pay/Buy &gt; Others &gt; Others,</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        3. Select <strong>Multi Payment &gt; Espay</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        4. Input <strong>16 digits Virtual Account Number</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        5. Input the <strong>minimum TOP UP amount of Rp. 50.000 and transaction fee Rp. 5000</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        6. Once everything are set, press 1 and select Yes
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        7. `+name+` balance will be added automatically (REAL TIME) after your payment is complete
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="instruction-heading" role="tab" id="headingFive">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseFour">
                                ATM Prima
                            </a>
                        </h4>
                    </div>
                    <div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">
                        <div class="panel-body">
                            <div style="margin:0px auto;max-width:600px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                                                <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>

                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        1. Enter your Mandiri ATM card, then input your PIN
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        2. Select <strong>Transfer &gt; Transfer to another bank &gt; Mandiri Bank</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        3. Input <strong>16 digits Virtual Account Number</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        4. Input the <strong>minimum TOP UP amount of Rp. 50.000 and transaction fee Rp. 5000</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        5. Confirm Transaction
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        6. `+name+` balance will be added automatically (REAL TIME) after your payment is complete
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="instruction-heading" role="tab" id="headingSix">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="false" aria-controls="collapseFive">
                                ATM Bersama
                            </a>
                        </h4>
                    </div>
                    <div id="collapseSix" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSix">
                        <div class="panel-body">
                            <div style="margin:0px auto;max-width:600px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                                                <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>

                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        1. Enter your Mandiri ATM card, then input your PIN
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        2. Select <strong>Transfer &gt; Transfer to another bank &gt; Mandiri Bank</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        3. Input <strong>16 digits Virtual Account Number</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        4. Input the <strong>minimum TOP UP amount of Rp. 50.000 and transaction fee Rp. 5000</strong>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        5. Confirm Transaction
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;">
                                                                    <p style="font-size:1px;margin:0px auto;border-top:1px dashed lightgrey;width:100%;"></p>
                                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left">
                                                                    <div class="" style="cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;text-align:left;">
                                                                        6. `+name+` balance will be added automatically (REAL TIME) after your payment is complete
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


                    <button type="button" onclick="window.location.href='/'" width="100px" class="btn btn-primary pull-right">

                        <span>Selesai (HOME)<span class="fa fa-long-arrow-right"></span></span>
                    </button>


                <script type="text/javascript" src="/tt_payment_gw_edc/static/src/js/jquery.payment.js"></script>
            </div>
        </div>
    </div>`;

    }else{
        //price
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Price:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span id="payment_method_price">`+payment_acq2[payment_method][selected].currency+` `;
                    text += getrupiah(payment_acq2[payment_method][selected].price_component.amount)

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
        try{
            if(Object.keys(discount_voucher).length != 0){
                payment_total = 0;
                text += `
                    <div class='col-sm-6' style='text-align:left;'>
                        <span>Discount:</span>
                    </div>
                    <div class='col-sm-6' style='text-align:right;'>
                        <span>`+discount_voucher['currency']+` -`+getrupiah(discount_voucher['discount'])+`</span>
                    </div>`;
                payment_total = payment_acq2[payment_method][selected].total_amount - discount_voucher['discount'];
            }else{
                payment_total = payment_acq2[payment_method][selected].total_amount;
            }
        }catch(err){
            try{
                payment_total = payment_acq2[payment_method][selected].total_amount;
            }catch(err){}
        }
    //    grand total
            text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span style='font-weight:500;'>Grand Total:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span style='font-weight:500;' id="payment_method_grand_total">`+payment_acq2[payment_method][selected].currency+` `;
                    text += getrupiah(payment_total)

                    text+=`</span>
                </div>`;
        text+= `</div><br/>`;
    }
    try{
        if(type_payment != {}){
            grand_total = payment_total;
            document.getElementById('full_payment_amt').innerHTML = payment_acq2[payment_method][selected].currency + ' ' +getrupiah(grand_total);
            print_payment_rules(type_payment);
        }
    }catch(err){}
    if(type == 'top_up' && payment_method != 'va')
        text += `<button type="button" id="submit_top_up" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="commit_top_up();" style="width:100%;">Submit <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(payment_method == 'payment_gateway')
        text += `<button type="button" id="payment_gtw" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="get_payment_order_number('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'visa')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="visa_pre_create_booking(1);" style="width:100%;">Request Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'passport')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="passport_pre_create_booking(1);" style="width:100%;">Request Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'registration')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="" style="width:100%;">Request Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'train')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="train_issued('`+train_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline_review')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="force_issued_airline(1);" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="airline_issued('`+airline_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'ppob')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="ppob_issued('`+bills_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline_reissue')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="update_booking_after_sales();" style="width:100%;">Reschedule <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline_after_sales')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="update_booking_after_sales();" style="width:100%;">Proceed Request <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'hotel_review')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="force_issued_hotel(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'activity_review')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="force_issued_activity(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'activity')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="activity_pre_issued_booking('`+activity_order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'issued_offline')
        text += `<button type="button" id="submit_top_up" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="commit_booking();" style="width:100%;">Submit <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'tour')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="tour_pre_create_booking();" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'event')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="event_issued('`+order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    document.getElementById('set_price').innerHTML = text;
}

function goto_embed_payment_method(provider, order_number){
    window.location.href = '/payment/' + provider + '/' + order_number;
}

function get_payment_order_number(order_number){
     $('#payment_gtw').prop('disabled', true);
     $('#payment_gtw').addClass("running");

    $.ajax({
       type: "POST",
       url: "/webservice/payment",
       headers:{
            'action': 'get_order_number',
       },
       data: {
            'order_number': order_number,
            'signature': signature,
            'seq_id': payment_acq2[payment_method][selected].seq_id,
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                if(payment_acq2[payment_method][selected].account_number == ""){
//                    window.location.href = '/payment/espay/' + msg.result.response.order_number;
                    get_order_number_frontend(msg.result.response.order_number);
                }else
                    window.location.href = '/payment/'+name+'/' + msg.result.response.order_number;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get signature');
       },timeout: 60000
    });
}

function get_order_number_frontend(order_number){
    $.ajax({
       type: "POST",
       url: "/webservice/payment",
       headers:{
            'action': 'get_order_number_frontend',
       },
       data: {
            'order_number': order_number,
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            get_payment_espay(msg.result.response.order_number)
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get signature');
       },timeout: 60000
    });
}

function check_payment_payment_method(order_number,btn_name,booker,type,provider_type,signature, payment_acq_booking){
    if(Object.keys(payment_acq_booking).length == 0)
        get_payment_acq(btn_name, booker, order_number, type, signature, provider_type);
    else{
        //print
        data_gmt = moment(payment_acq_booking.time_limit)._d.toString().split(' ')[5];
        gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, ''); //ambil gmt
        timezone = data_gmt.replace (/[^\d.]/g, ''); //ambil timezone
        timezone = timezone.split('') //split per char
        timezone = timezone.filter(item => item !== '0') //hapus angka 0 di timezone
        tes = moment.utc(payment_acq_booking.time_limit).format('YYYY-MM-DD HH:mm:ss')
        localTime  = moment.utc(tes).toDate();
        payment_acq_booking.time_limit = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
        text=`<h4 style="color:`+color+`;">Customer Payment Method</h4><hr/>`;
        text+=` <h6 style="padding-bottom:10px;">Payment Detail: </h6>`;
        if(payment_acq_booking.nomor_rekening != ''){
            text+=`<div class='row'>
                    <div class="col-sm-5" style='text-align:left;'>
                        <span style="font-size:13px;"> Account: </span><br>
                    </div>
                    <div class="col-sm-7" style='text-align:right;'>
                        <span style="font-size:14px; font-weight:500;">`+payment_acq_booking.nomor_rekening+`<br/>
                    </div>
                    <div class="col-sm-5" style='text-align:left;'>
                        <span style="font-size:13px;;"> Account Name: </span>
                    </div>
                    <div class="col-sm-7" style='text-align:right;'>
                        <span style="font-size:14px; font-weight:500;">`+payment_acq_booking.account_name+`<br>
                    </div>
                    <div class="col-sm-5" style='text-align:left;'>
                        <span style="font-size:13px;;"> Time Limit: </span>
                    </div>
                    <div class="col-sm-7" style='text-align:right;'>
                        <span style="font-size:14px; font-weight:500;">`+payment_acq_booking.time_limit+`<br>
                    </div>
                    <div class="col-sm-5" style='text-align:left;'>
                        <span style="font-size:13px;;"> Grand Total: </span>
                    </div>
                    <div class="col-sm-7" style='text-align:right;'>
                        <span style="font-size:14px; font-weight:500;">IDR `+getrupiah(payment_acq_booking.amount)+`<br>
                    </div>
                   </div>`;
            text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="window.location.href = '/payment/`+name+`/`+payment_acq_booking.order_number+`'" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        }else{
            text += `<div class='row'>
                        <div class="col-sm-5" style='text-align:left;'>
                            <span style="font-size:13px;;"> Time Limit: </span>
                        </div>
                        <div class="col-sm-7" style='text-align:right;'>
                            <span style="font-size:14px; font-weight:500;">`+payment_acq_booking.time_limit+`<br>
                        </div>
                        <div class="col-sm-5" style='text-align:left;'>
                            <span style="font-size:13px;;"> Grand Total: </span>
                        </div>
                        <div class="col-sm-7" style='text-align:right;'>
                            <span style="font-size:14px; font-weight:500;">IDR `+getrupiah(payment_acq_booking.amount)+`<br>
                        </div>
                     </div>`;
            if(payment_acq_booking.va_number != false)
                text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="window.location.href = '/payment/espay/`+payment_acq_booking.order_number+`'" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
            else
                text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="window.location.href = '/payment/`+name+`/`+payment_acq_booking.order_number+`'" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        }

        document.getElementById('payment_acq').innerHTML = text;
    }
//    if(provider_type == 'airline')
//        $(".issued_booking_btn").show();
//    else if(provider_type == 'activity' || provider_type == 'tour')
//        document.getElementById("final_issued_btn").style.display = "block";
//    $.ajax({
//       type: "POST",
//       url: "/webservice/payment",
//       headers:{
//            'action': 'check_payment_payment_method',
//       },
//       data: {
//            'order_number': order_number,
//            'signature': signature,
//       },
//       success: function(msg) {
//            console.log(msg);
//            if(msg.result.error_code != 0){
//                get_payment_acq(btn_name, booker, order_number, type, signature, provider_type);
//                if(provider_type == 'airline')
//                    $(".issued_booking_btn").show();
//                else if(provider_type == 'activity' || provider_type == 'tour')
//                    document.getElementById("final_issued_btn").style.display = "block";
//
//            }
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//            if(XMLHttpRequest.status == 500){
//                Swal.fire({
//                  type: 'error',
//                  title: 'Oops!',
//                  html: '<span style="color: red;">Error get signature </span>' + errorThrown,
//                })
//            }
//       },timeout: 60000
//    });
}

function get_va_bank(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_va_bank',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                text = '';
                payment_information = msg.result.response;
                for(i in payment_information){
                    text += `<option value='`+payment_information[i].seq_id+`'>`+payment_information[i].name+`</option>`;
                }
                document.getElementById('payment_information_choose').innerHTML = text;
                $('#payment_information_choose').niceSelect('update');
                change_payment_information();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get va bank');
       }
    });
}

function change_payment_information(){
    for(i in payment_information){
        if(payment_information[i].seq_id == document.getElementById('payment_information_choose').value){
            CKEDITOR.instances['body_payment_information'].setData(payment_information[i].html)
            document.getElementById('payment_information_heading').value = payment_information[i].heading;
//            document.getElementById('body_printout').innerHTML = printout[i].html;
            break;
        }
    }
}

function set_payment_information(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'set_payment_information',
       },
       data: {
            'signature': signature,
            'title': document.getElementById('payment_information_choose').value,
            'body': CKEDITOR.instances['body_payment_information'].getData(),
            'heading': document.getElementById('payment_information_heading').value
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                location.reload();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get va bank');
       }
    });
}

function get_va_number(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_va_number',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            text = '';
            text += `
                <div class="col-lg-12" id="radio_top_up" style="padding:0px; text-align:left;margin-bottom:10px;" onchange="change_top_up_method();">
                    <label class="radio-button-custom" style="margin-bottom:0px;">
                        <span style="font-size:13px; color:`+color+`;"> `+name+` Gateway</span>
                        <input type="radio" checked="checked" name="top_up_radio" value="`+name+`">
                        <span class="checkmark-radio"></span>
                    </label>`;
                    try{
                        if(msg.result.response.va.length != 0)
                        text+=`
                        <label class="radio-button-custom" style="margin-bottom:0px;">
                            <span style="font-size:13px; color:`+color+`;"> Top Up real time 24 hours All Bank</span>
                            <input type="radio" name="top_up_radio" value="online_payment">
                            <span class="checkmark-radio"></span>
                        </label>`;
                        va_number = msg.result.response.va;
                        payment_how_to_obj = msg.result.response;
                    }catch(err){}
                    text+=`
                </div>`;
            document.getElementById('top_up_method_div').innerHTML = text + document.getElementById('top_up_method_div').innerHTML;
            change_top_up_method();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get va number');
       }
    });
}

function copy_value(val){
    const el = document.createElement('textarea');
    el.value = val;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $text_share = window.encodeURIComponent(val);
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

function change_top_up_method(){
    var top_up_select = '';
    var get_term = false;
    var radios = document.getElementsByName('top_up_radio');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            top_up_select = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    console.log(top_up_select);
    if(top_up_select == 'online_payment'){
        text = `<div class="col-sm-12" data-id="253" data-token="">`;
        for(i in va_number){
            if(i != 0)
                text += `<br/>`;
            text += `
                    <div class="row">
                        <div class="col-sm-3">
                            `+va_number[i].name+`
                        </div>
                        <div class="col-sm-2" style="text-align:right">
                            <strong>`+va_number[i].account_number+`</strong>
                        </div>
                        <div class="col-sm-2" style="text-align:right">
                            <button type="button" class="payment_acq_btn primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="copy_value('`+va_number[i].account_number+`');" style="width:100%;">
                                Copy
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-3">
                            Fee Top Up (exclude bank charges)
                        </div>
                        <div class="col-sm-2" style="text-align:right">
                            <strong>`+va_number[i].currency+` `+getrupiah(va_number[i].price_component.fee)+`</strong>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-1">
                            Description
                        </div>
                        <div class="col-sm-4" style="text-align:right">
                            `+va_number[i].description_msg+`
                        </div>
                    </div>
            `;
        }

        text+=`<div>
            <br/>
            <div id="mandiri_va_acquirer">
                <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">`;
                for(i in payment_how_to_obj){
                    if(i != 'other'){
                        for(j in payment_how_to_obj[i]){
                            if(payment_how_to_obj[i][j].heading != '')
                                text+=`<div class="panel panel-default">
                                        <div class="panel-heading-sgo" role="tab" id="headingFour">
                                            <h4 class="panel-title">
                                                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#`+payment_how_to_obj[i][j].seq_id+`" aria-expanded="false" aria-controls="`+payment_how_to_obj[i][j].seq_id+`">
                                                    `+payment_how_to_obj[i][j].heading+`
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="`+payment_how_to_obj[i][j].seq_id+`" class="panel-collapse collapse" role="tabpanel" aria-labelledby="`+payment_how_to_obj[i][j].seq_id+`" style="height: 0px;">
                                            <div class="panel-body">
                                                `+payment_how_to_obj[i][j].html+`
                                            </div>
                                        </div>
                                    </div>`
                        }
                    }
                }
                for(i in payment_how_to_obj){
                    if(i == 'other'){
                        for(j in payment_how_to_obj[i]){
                            if(payment_how_to_obj[i][j].heading != '')
                                text+=`<div class="panel panel-default">
                                        <div class="panel-heading-sgo" role="tab" id="headingFour">
                                            <h4 class="panel-title">
                                                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#`+payment_how_to_obj[i][j].seq_id+`" aria-expanded="false" aria-controls="`+payment_how_to_obj[i][j].seq_id+`">
                                                    `+payment_how_to_obj[i][j].heading+`
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="`+payment_how_to_obj[i][j].seq_id+`" class="panel-collapse collapse" role="tabpanel" aria-labelledby="`+payment_how_to_obj[i][j].seq_id+`" style="height: 0px;">
                                            <div class="panel-body">
                                                `+payment_how_to_obj[i][j].html+`
                                            </div>
                                        </div>
                                    </div>`
                        }
                    }
                }
                text+=`

                <button type="button" onclick="window.location.href='/'" width="100px" class="btn btn-primary pull-right">

                    <span>Selesai (HOME) <span class="fas fa-arrow-right"></span></span>
                </button>


                <script type="text/javascript" src="/tt_payment_gw_edc/static/src/js/jquery.payment.js"></script>
            </div>
        </div>
    </div>`;
    }else{
        text = `
            <div class="col-lg-12">
                <h3>TOP UP SALDO</h3>
            </div>

            <div class="col-lg-12">
                <span>Amount</span><br/>
                <div class="input-container-search-ticket">
                    <input min="50000" step="50000" name="amount" id="amount" class="form-control" required="required" onkeyup="`;
        text+=`total_price_top_up();`;
        text+=`" placeholder="Min IDR 50,000">
                </div>
            </div>

            <div class="col-lg-12">
                <span>Total</span><br/>
                <div class="input-container-search-ticket">
                    <input type="text" style="background-color:#eee;" class="form-control" id="total_amount" name="total_amount" tabindex="1" readonly="readonly"/>
                </div>
            </div>

            <!--<div class="col-lg-12">-->
            <!--<span>Payment Method</span><br/>-->
            <!--<div class="input-container-search-ticket btn-group">-->
            <!--<div class="form-select" id="default-select">-->
            <!--<select id="payment_method" name="payment_method" required="required">-->
            <!--<option id="rodex_gateway" value="rodex_gateway">Rodex Gateway (8AM - 8PM)</option>-->
            <!--&lt;!&ndash;<option id="online_payment" value="online_payment">Online Payment</option>&ndash;&gt;-->
            <!--</select>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->


            <div class="col-lg-12" style="margin-top:15px;">
                <div id="footer-info" class="footer-info">
                    <label class="check_box_custom">
                        <span class="span-search-ticket" style="color:black;margin-bottom:20px;">I've read and accept the <a class="highlight" data-toggle="modal" data-target="#tacModal" style="text-decoration: underline; color:blue;">Terms &amp; Conditions</a> of `+web_name+` top up</span>
                        <input type="checkbox" name="tac_checkbox" id="tac_checkbox" required="required">
                        <span class="check_box_span_custom"></span>
                    </label>
                </div>
            </div>
            <div class="col-lg-12" style="margin-top:15px;">
                <button type="button" id="submit_name" class="payment_acq_btn primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="check_top_up();" style="width:100%;">
                    Submit
                    <div class="ld ld-ring ld-cycle"></div>
                </button>
            </div>

            <div class="modal fade" id="tacModal" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:`+text_color+`;">Term & Condition </h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="modal-body">
                                <ol id="topup_tac">
                                    <h6>BANK TRANSFER / CASH</h6>
                                    <li>1. Before you click SUBMIT, please make sure you have inputted the correct amount of TOP UP. If there is a mismatch data, such as the transferred amount/bank account is different from the requested amount/bank account, so the TOP UP will be approved by tomorrow (D+1).<br></li>
                                    <li>2. Bank Transfer / CASH TOP UP can be used on Monday-Sunday: 8 AM - 8 PM (GMT +7)<br></li>
                                    <li>3. Bank Transfer (BCA or Mandiri) auto validate in 15 minutes<br></li>
                                    <h6>National Holiday included</h6>
                                    <h6>For CASH you have to send money to RODEX HO (Jl. Raya Darmo 177 B Surabaya)</h6><br/>
                                    <h6>VIRTUAL ACCOUNT</h6>

                                    <li>1. Top Up Transaction from ATM / LLG open for 24 hours. Balance will be added automatically (REAL TIME) after payment. Top up fee will be charged to user and if there's other charge for LLG it will be charged to user too. LLG will be added ± 2 hours from payment.<br><br></li>
                                    <h6>MANDIRI INTERNET BANKING</h6>
                                    <li>1. Transaction Top up from internet banking mandiri open for 24 hours. Balance will be added automatically (REAL TIME) after payment with additional admin Top Up.<br><br></li>
                                </ol>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>`;
        get_term = true;
    }
    document.getElementById('top_up_div').innerHTML = text;
    if(get_term == true){
        func_get_term();
    }
}

function func_get_term(){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_top_up_term',
       },
       data: {
       },
       success: function(msg) {
            console.log(msg);
            msg = msg.replace(/&lt;/g, '<');
            msg = msg.replace(/&gt;/g, '>');
            document.getElementById('topup_tac').innerHTML = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get signature');
       },timeout: 60000
    });
}