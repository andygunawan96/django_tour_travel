function toggle_show_attach_pay_ref() {
    if(document.getElementById('is_attach_pay_ref').checked == true)
    {
        document.getElementById("attach_pay_ref").style.display = "block";
    }
    else
    {
        document.getElementById("attach_pay_ref").style.display = "none";
        document.getElementById("pay_ref_text").value = "";
        document.getElementById("pay_ref_file").value = null;
    }
}

total_price_payment_acq = 100000000;

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
            payment_acq2 = {};
            type_render = type
            val_render = val;
            try{
                $("#show_loading_booking_airline").hide();
            }catch(err){
                console.log(err) //ada element yg tidak ada
            }
            for(i in msg.result.response['customer']){
                for(j in msg.result.response['customer'][i]){
                    for(k in msg.result.response['customer'][i][j]){
                        msg.result.response['customer'][i][j][k].method = i;
                        payment_acq2[j] = msg.result.response['customer'][i][j];
                        if(total_price_payment_acq > msg.result.response['customer'][i][j][k].total_amount)
                            total_price_payment_acq = msg.result.response['customer'][i][j][k].total_amount
                    }
                }
                payment_ho = msg.result.response['agent'];
            }
            if('cash' in payment_acq2 == false && user_login.co_agent_frontend_security.includes('corp_limitation') == false){
                if(window.location.href.includes('confirm_order') == false)
                    if(document.getElementById('id_login_booking'))
                        document.getElementById('id_login_booking').style.display = 'block';
            }
            try{
                if(commission < 0)
                    total_commission_payment_acquirer = commission *-1;
                else
                    total_commission_payment_acquirer = commission;
            }catch(err){console.log(err)}
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
            if(type_render == 'top_up')
                text=`<h4 style="color:`+color+`;">Payment Method</h4><hr/>`;
            else
                text=`<h4 style="color:`+color+`;">Payment Method</h4><hr/>`;

            payment_counter = 1;
            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                if(typeof(payment_ho) !== 'undefined' && payment_ho.length > 1 && total_price_payment_acq > 0 && type_render != 'top_up'){
                    text+=`
                        <h6 style="padding-bottom:10px;">`+payment_counter+`. Payment to HO: </h6>`;
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
                            text+=`<select class="nice-select-default rounded payment_method" id="payment_ho_id" onchange="set_payment_method_ho();">`;
                        }else{
                            text+=`<select class="payment_method" id="payment_ho_id" onchange="set_payment_method_ho();">`;
                        }
                        for(i in payment_ho){
                            text+=`<option value="`+payment_ho[i].payment_method+`">`+payment_ho[i].name+`</option>`;
                        }
                        text+=`</select>
                        </div>
                    </div>
                    <div id="payment_method_ho_detail">
                    </div>
                    <hr id="payment_method_ho_break_div" style="display:none;"/>`;
                    payment_counter++;
                }
            }

            text+=`
                <div class="row">
                    <div class="col-lg-12">
                        <label class="check_box_custom">
                            <span class="span-search-ticket" style="color:black;">Attach Payment Reference</span>
                            <input type="checkbox" id="is_attach_pay_ref" name="is_attach_pay_ref" value="is_attach_pay_ref" onclick="toggle_show_attach_pay_ref();">
                            <span class="check_box_span_custom"></span>
                        </label><br/>
                    </div>
                </div>
            `;
            text+=`
                <div id="attach_pay_ref" style="display:none; margin-bottom:15px;">
                    <span class="control-label" for="pay_ref_text">Payment Reference</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control o_website_form_input" id="pay_ref_text" name="pay_ref_text" placeholder="Payment Reference"/>
                    </div>

                    <span class="control-label" for="pay_ref_file">Payment Ref Attachment</span>
                    <div class="input-container-search-ticket">
                        <input type="file" class="form-control o_website_form_input" id="pay_ref_file" name="pay_ref_file" multiple/>
                    </div>
                </div>`;
            if(payment_counter == 1) // agar tidak binggung kalau b2c
                text+=`
            <h6 style="padding-bottom:10px;">`+payment_counter+`. Payment: </h6>`;
            else // untuk agent agar bisa bedakan payment customer / payment ke HO (untuk agent yg punya credit limit saja)
                text+=`
            <h6 style="padding-bottom:10px;">`+payment_counter+`. Payment Customer to Agent: </h6>`;
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
            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                if(typeof(payment_ho) !== 'undefined' && payment_ho.length > 1){
                    $('#payment_ho_id').niceSelect();
                }
            }
            payment_counter++;
            set_payment_method_ho();
            set_payment(val_render,type_render);
        //            focus_box('payment_acq');
        //            document.getElementById('payment_acq').hidden = false;
        }else{
            text = `There's no `+name+` gateway payment available right now <br/>`;
            try{
                if(type_render == 'top_up')
                    text +=  `please use online payment`;
            }catch(err){
                console.log(err) //ada element yg tidak ada
            }
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

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
       },timeout: 60000
    });
}

function set_payment_method_ho(){
    var text= '';
    if(document.getElementById('payment_ho_id') && document.getElementById('payment_ho_id').value == 'credit_limit' && typeof(total_commission_payment_acquirer) !== 'undefined'){
        text += `
                <div class="row">
                    <div class="col-sm-5" style="text-align:left;">
                        <span style="font-size:13px;"> Price: </span><br>
                        <span style="font-size:13px;;"> Fee: </span><br>
                        <span style="font-size:14px; font-weight:500;">Grand Total</span><br>
                    </div>
                    <div class="col-sm-7" style="text-align:right;">
                        <span style="font-size:13px;">`+payment_ho[0].currency+` `+getrupiah(payment_ho[0].price_component.amount)+`</span><br>
                        <span style="font-size:13px;">`+payment_ho[0].currency+` `+getrupiah(payment_ho[0].price_component.fee)+`</span><br>
                        <span style="font-size:14px;font-weight:500;">`+payment_ho[0].currency+` `+getrupiah(payment_ho[0].total_amount)+`</span><br>
                    </div>
                </div>
                <div class="row mt-3" id="show_commission_payment_acq_ho" style="display: block;">
                    <div class="col-lg-12 col-xs-12" style="text-align:center;">
                        <div class="alert alert-success">
                            <div class="row">
                                <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                    <span style="font-size:13px; font-weight:bold;">YPM</span>
                                </div>
                                <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                    <span style="font-size:13px; font-weight:bold;">`+payment_ho[0].currency+` `+getrupiah(total_commission_payment_acquirer)+`</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <input class="primary-btn-white" id="show_commission_payment_acq_ho_button" style="width:100%;" type="button" onclick="show_commission_payment_acq();" value="Hide YPM">
                </div>`;
    }
    if(document.getElementById('payment_method_ho_detail'))
        document.getElementById('payment_method_ho_detail').innerHTML = text;
    try{
        if(text == '')
            document.getElementById('payment_method_ho_break_div').style.display = 'none';
        else
            document.getElementById('payment_method_ho_break_div').style.display = 'block';
    }catch(err){console.log(err)}
}

function show_commission_payment_acq(){
    var sc = document.getElementById("show_commission_payment_acq_ho");
    var scs = document.getElementById("show_commission_payment_acq_ho_button");
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide YPM";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show YPM";
    }
}

function set_payment(val, type){
    payment_method = document.getElementById('payment_via').value;
    text = ''
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
            if(payment_method != 'payment_gateway' || payment_acq2[payment_method][i].show_device_type != 'mobile'){
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
    }
    text += '<div id="set_detail"></div><br/><div id="set_price"></div><div id="detail_description_msg"></div>'
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
    text += ` <h6 style="padding-bottom:10px;">`+payment_counter+`. Payment Detail: </h6>`;
    if(payment_method != 'credit_limit'){
        if(payment_method == 'payment_gateway' && payment_acq2[payment_method][selected].online_wallet == true){
            text+=`<div class='row'>
                <div class="col-sm-12" style='text-align:left;'>
                <span style="font-size:13px;"> Phone Number: </span>

                </div>
                <div class="col-sm-12">
                    <input class="form-control" placeholder="Phone Number" type='text' id="phone_number"/>
                </div>`;
        }else{
        text+=`<div class='row'>
                <div class="col-sm-5" style='text-align:left;'>
                <span style="font-size:13px;"> Account Number: </span><br>
                <span style="font-size:13px;;"> Account Name: </span>

                </div>
                <div class="col-sm-7" style='text-align:right;'>`;
                if(payment_acq2[payment_method][selected].account_number)
                    text+=`
                    <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][selected].account_number+`</span>`;
                else
                    text+=`
                    <span style="font-size:14px; font-weight:500;">-</span>`;
                if(type == 'top_up' && payment_acq2[payment_method][selected].account_number){
                    text+=`
                    <span style="float: right; cursor: pointer;color:`+color+`" onclick="copy_data_acount('`+payment_acq2[payment_method][selected].account_number+`');">
                        <i class="fa fa-clone" aria-hidden="true"></i>
                    </span>`
                }
                text+=`<br/>
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

            <button type="button" onclick="window.location.href='/'" class="primary-btn pull-right">
                Back to Home <i class="fas fa-home"></i>
            </button>


                <script type="text/javascript" src="/tt_payment_gw_edc/static/src/js/jquery.payment.js"></script>
            </div>
        </div>
    </div>`;

    }else{
        var free_reservation = false;
        if (typeof discount_voucher !== 'undefined' && Object.keys(discount_voucher).length != 0 && discount_voucher['discount'] >= payment_acq2[payment_method][selected].total_amount)
                free_reservation = true;
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
                    <span id="fee_span">`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].price_component.fee)+`</span>
                </div>`;
        //unique amount
        if(payment_acq2[payment_method][selected].price_component.unique_amount){
            text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Unique Amount:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].price_component.unique_amount)+`</span>
                </div>`;
        }
//        text += `
//                <div class='col-sm-6' style='text-align:left;'>
//                    <span>Unique Amount:</span>
//                </div>
//                <div class='col-sm-6' style='text-align:right;'>`;
//        if(free_reservation == false)
//            text+=`
//                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].price_component.unique_amount)+`</span>
//                </div>`;
//        else
//            text+=`
//                <span>`+payment_acq2[payment_method][selected].currency+` 0</span>
//            </div>`;
        try{
            if(Object.keys(discount_voucher).length != 0 && window.location.href.includes('booking') == false){
                payment_total = 0;
                text += `
                    <div class='col-sm-6' style='text-align:left;'>
                        <span>Discount:</span>
                    </div>
                    <div class='col-sm-6' style='text-align:right;'>
                        <span>`+discount_voucher['currency']+` -`+getrupiah(discount_voucher['discount'])+`</span>
                    </div>`;
                if(free_reservation == true)
                    payment_total = 0;
                else
                    payment_total = payment_acq2[payment_method][selected].total_amount - discount_voucher['discount'];
            }else{
                payment_total = payment_acq2[payment_method][selected].total_amount;
            }
        }catch(err){
            try{
                payment_total = payment_acq2[payment_method][selected].total_amount;
            }catch(err){
                console.log(err) //ada element yg tidak ada
            }
        }
        can_use_point = 0;
        if(typeof(get_balance_response) !== 'undefined' && type != 'top_up' && get_balance_response.result.response.is_show_point_reward && total_price_payment_acq > 0){
            text+=`
                <div class="col-sm-5" style='text-align:left;'>
                    <span style="font-size:13px;"> Use Points: </span>
                </div>
                <div class="col-sm-7">
                    <div class='row' style="justify-content:right;">
                        <label class="radio-button-custom crlabel" style="margin-bottom:0px;">
                            <span style="font-size:13px; color:`+color+`;">No</span>
                            <input type="radio" checked="checked" name="use_point" value="false" onclick="onchange_use_point(false);"/>
                            <span class="checkmark-radio"></span>
                        </label>
                        <label class="radio-button-custom crlabel" style="margin-bottom:0px;">
                            <span style="font-size:13px; color:`+color+`;">Yes</span>
                            <input type="radio" name="use_point" value="true" onclick="onchange_use_point(true);"/>
                            <span class="checkmark-radio"></span>
                        </label>
                    </div>
                </div>
                <div class='col-sm-12' style="display:none;" id="use_point_div">
                    <div class='row'>
                        <div class="col-sm-5">
                        </div>
                        <div class="col-sm-7" style="text-align:right;">
                            <span style="font-size:13px;" id="point_span"> `+get_balance_response.result.response.currency_code+` `+getrupiah(can_use_point)+`</span>
                        </div>
                    </div>
                </div>
            `;
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
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }

    if(type == 'top_up' && payment_method != 'va')
        text += `<button type="button" id="submit_top_up" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="commit_top_up();" style="width:100%;">Submit <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(payment_method == 'payment_gateway')
        if(free_reservation == false)
            text += `<button type="button" id="payment_gtw" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="get_payment_order_number('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
            text += button_payment(type,'payment');
        }else{
            text += button_payment(type,'reservation');
        }
    else
        if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
            text += button_payment(type,'payment');
        }else{
            text += button_payment(type,'reservation');
        }
    document.getElementById('set_price').innerHTML = text;
}

function onchange_use_point(value){
    if(value == true){
        try{
            var can_use_point = 0;
            if(payment_method == 'cash'){ // cash minimal bayar 1 rupiah untuk bypass check 0 di gateway
                if(payment_total > get_balance_response.result.response.point_reward)
                    can_use_point = get_balance_response.result.response.point_reward;
                else
                    can_use_point = payment_total - 1;
            }else{ //selain cash sesuaikan dengan minimum amount dari setiap payment acquirer

                if(payment_total - payment_acq2[payment_method][selected].minimum_amount > get_balance_response.result.response.point_reward)
                    can_use_point = get_balance_response.result.response.point_reward;
                else
                    can_use_point = payment_total - payment_acq2[payment_method][selected].minimum_amount['with_point']; // minimal transfer untuk payment gateway
            }
            document.getElementById('point_span').innerHTML = payment_acq2[payment_method][selected].currency + ' ' + getrupiah(can_use_point);
            document.getElementById('fee_span').innerHTML = payment_acq2[payment_method][selected].currency + ' ' + getrupiah(payment_acq2[payment_method][selected].price_component_with_point.fee);
            document.getElementById('use_point_div').style.display = 'block';
            document.getElementById('payment_method_grand_total').innerHTML = payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_total - can_use_point);
        }catch(err){
            console.log(err);
            document.getElementById('payment_method_grand_total').innerHTML = payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_total);
        }
    }else{
        document.getElementById('fee_span').innerHTML = payment_acq2[payment_method][selected].currency + ' ' + getrupiah(payment_acq2[payment_method][selected].price_component.fee);
        document.getElementById('use_point_div').style.display = 'none';
        document.getElementById('payment_method_grand_total').innerHTML = payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_total);
    }
}

function button_payment(type, page){
    temp_text = '';
    if(type == 'visa'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="visa_pre_create_booking(1);" style="width:100%;">Request Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'passport'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="passport_pre_create_booking(1);" style="width:100%;">Request Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'registration'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="" style="width:100%;">Request Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'train'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="train_issued('`+train_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="train_issued('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'bus'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="bus_issued('`+bus_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="bus_issued('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'airline_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="airline_issued('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'airline_book_then_issued'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="airline_issued('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'airline'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="airline_issued('`+airline_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="airline_issued('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'ppob'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="ppob_issued('`+bills_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="ppob_issued('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'airline_reissue'){
//        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="update_booking_after_sales();" style="width:100%;">Reschedule <div class="ld ld-ring ld-cycle"></div></button>`;
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="post_issued_after_sales('reschedule', true);" style="width:100%;">Reschedule <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'airline_after_sales'){
//        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="update_booking_after_sales();" style="width:100%;">Proceed Request <div class="ld ld-ring ld-cycle"></div></button>`;
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="post_issued_after_sales('`+addons_type+`');" style="width:100%;">Proceed Request <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'hotel_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="force_issued_hotel(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'hotel'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="hotel_issued('`+hotel_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="force_issued_hotel(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'medical_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="medical_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'medical'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="medical_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="medical_commit_booking(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'medical_global_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="medical_global_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'medical_global'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="medical_global_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="medical_global_commit_booking(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'mitra_keluarga_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="mitra_keluarga_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'mitrakeluarga'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="mitra_keluarga_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="mitra_keluarga_commit_booking(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'sentra_medika_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="sentra_medika_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'sentramedika'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="sentra_medika_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="sentra_medika_commit_booking(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'insurance_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="insurance_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'insurance'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="insurance_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="insurance_commit_booking(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'swab_express_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="swab_express_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'swabexpress'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="swab_express_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="swap_express_commit_booking(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'lab_pintar_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="lab_pintar_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'labpintar'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="lab_pintar_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="lab_pintar_commit_booking(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'activity_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="force_issued_activity(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'activity'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="activity_pre_issued_booking('`+activity_order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="activity_pre_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'issued_offline'){
        temp_text += `<button type="button" id="submit_top_up" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="commit_booking();" style="width:100%;">Submit <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'tour_review'){
        temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="tour_pre_create_booking(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'tour'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="tour_pre_create_booking();" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="tour_pre_issued_booking('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }else if(type == 'groupbooking'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="groupbooking_modal_issued();" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }
    else if(type == 'event'){
        if(page == 'reservation')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="event_issued('`+order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        else if(page == 'payment')
            temp_text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="event_issued('`+order_number_id+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    }
    return temp_text;
}

function goto_embed_payment_method(provider, order_number){
    window.location.href = '/payment/' + provider + '/' + order_number;
}

function get_payment_order_number(order_number){
    $('#payment_gtw').prop('disabled', true);
    $('#payment_gtw').addClass("running");
    check_phone_number_fill = false;
    if(document.getElementById('phone_number'))
        if(document.getElementById('phone_number').value == '')
            check_phone_number_fill = true;
    use_point = false
    try{
        var radios = document.getElementsByName('use_point');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                if(radios[j].value == 'true')
                    use_point = true
                break;
            }
        }

    }catch(err){console.log(err)}
    if(check_phone_number_fill != true){
        $.ajax({
           type: "POST",
           url: "/webservice/payment",
           headers:{
                'action': 'get_order_number',
           },
           data: {
                'order_number': order_number,
                'signature': signature,
                'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
                'show_device_type': payment_acq2[payment_method][selected].show_device_type,
                'url_back': window.location.href,
                'voucher_reference': typeof voucher_code === 'string' ? voucher_code : '',
                'use_point': use_point
           },
           success: function(msg) {
                if(msg.result.error_code == 0){
                    if(payment_acq2[payment_method][selected].account_number == ""){
                        //payment gateway espay
                        if(payment_acq2[payment_method][selected].name == 'OVO')
                            document.getElementById('detail_description_msg').innerHTML += `<span style="font-size:13px;">`+payment_acq2[payment_method][selected].description_msg+` </span>`;
                        get_order_number_frontend(msg.result.response.order_number);
                    }else{
                        //payment gateway transfer manual
                        window.location.href = '/payment/'+name+'/' + msg.result.response.order_number;
                    }
                }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get signature');
           },timeout: 60000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: 'Please fill phone number!',
        }).then((result) => {
          if (result.value) {
            $('#payment_gtw').prop('disabled', false);
            $('#payment_gtw').removeClass("running");
          }
        })
    }
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
        if(payment_acq_booking.nomor_rekening != false) //BCA
            tes = (moment.utc(payment_acq_booking.time_limit).subtract(16,"minutes")).format('YYYY-MM-DD HH:mm:ss');
        else // ESPAY
            tes = (moment.utc(payment_acq_booking.time_limit)).format('YYYY-MM-DD HH:mm:ss');
        localTime  = moment.utc(tes).toDate();
        payment_acq_booking.time_limit = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
        text=`<h4 style="color:`+color+`;">Payment Method</h4><hr/>`;
        text+=` <h6 style="padding-bottom:10px;">Payment Detail: </h6>`;
        if(payment_acq_booking.nomor_rekening != ''){
            text+=`<div class='row'>
                    <div class="col-sm-5" style='text-align:left;'>
                        <span style="font-size:13px;"> Account Number: </span><br>
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
            text += `<div class='row'>`;
            if(payment_acq_booking.va_number)
                text +=`
                        <div class="col-sm-5" style='text-align:left;'>
                            <span style="font-size:13px;;"> VA Number: </span>
                        </div>
                        <div class="col-sm-7" style='text-align:right;'>
                            <span style="font-size:14px; font-weight:500;">`+payment_acq_booking.va_number+`<br>
                        </div>`;
            text +=`
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
            if(payment_acq_booking.url != ''){
                text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="window.location.href = '`+payment_acq_booking.url+`'" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
            }else if(payment_acq_booking.va_number != false){
                text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="window.location.href = '/payment/espay/`+payment_acq_booking.order_number+`'" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
            }else
                text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="window.location.href = '/payment/`+name+`/`+payment_acq_booking.order_number+`'" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
        }
        text += `<input class="primary-btn-white" style="width:100%;margin-top:15px;" type="button" onclick="cancel_payment_method('`+order_number+`','`+provider_type+`');" value="Cancel Payment">`;
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
            if(msg.result.error_code == 0){
                text = '';
                payment_information = msg.result.response;
                for(i in payment_information){
                    text += `<option value='`+payment_information[i].acquirer_seq_id+`'>`+payment_information[i].name+`</option>`;
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
        if(payment_information[i].acquirer_seq_id == document.getElementById('payment_information_choose').value){
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
            text = '';
            text += `
                <div class="col-lg-12" id="radio_top_up" style="padding:0px; text-align:left;margin-bottom:10px;" onchange="change_top_up_method();">
                    <label class="radio-button-custom" style="margin-bottom:0px;">
                        <span style="font-size:13px;"> `+name+` Gateway</span>
                        <input type="radio" checked="checked" name="top_up_radio" value="`+name+`">
                        <span class="checkmark-radio"></span>
                    </label>`;
                    try{
                        if(msg.result.response.va.length != 0)
                        text+=`
                        <label class="radio-button-custom" style="margin-bottom:0px;">
                            <span style="font-size:13px;"> Top Up real time 24 hours All Bank</span>
                            <input type="radio" name="top_up_radio" value="online_payment">
                            <span class="checkmark-radio"></span>
                        </label>`;
                        va_number = msg.result.response.va;
                        payment_how_to_obj = msg.result.response;
                    }catch(err){
                        console.log(err) //ada element yg tidak ada
                    }
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
    if(top_up_select == 'online_payment'){
        text = `<div class="col-sm-12" data-id="253" data-token="">
        <div class="row">`;
        for(i in va_number){
            if(i==0){
                text+=`<div class="col-lg-12" style="cursor:pointer; background:`+text_color+`; border:1px solid #cdcdcd; padding:15px; display:block;" id="up_`+va_number[i].name+`" onclick="div_dropdown('`+va_number[i].name+`');">`;
            }else{
                text+=`<div class="col-lg-12" style="cursor:pointer; background:`+text_color+`; border:1px solid #cdcdcd; padding:15px; display:none;" id="up_`+va_number[i].name+`" onclick="div_dropdown('`+va_number[i].name+`');">`;
            }
            text+=`
                <div class="row">
                    <div class="col-lg-12" style="display: flex;align-items: center;">
                        <h5 class="single_border_custom_left" style="padding-left:10px;">`;
//                        if(va_number[i].image){
//                            text+=`<img style="width:auto; height:50px;" alt="Logo `+va_number[i].name+`" src="`+va_number[i].image+`"/>`;
//                        }else{
//                            text+=`<img style="width:auto; height:50px;" alt="Logo `+va_number[i].name+`" src="/static/tt_website_rodextrip/images/no pic/no-bank.png"/>`;
//                        }
                        if(va_number[i].heading){
                            text+=`<b style="padding-left:10px;">`+va_number[i].heading+`</b>`;
                        }else{
                            text+=`<b style="padding-left:10px;">`+va_number[i].name+`</b>`;
                        }
                        text+=`
                            <b style="padding-left:10px;padding-right:10px; color:`+color+`">
                                <i class="fas fa-chevron-up"></i>
                            </b>
                        </h5>
                    </div>
                </div>
            </div>`;
            if(i==0){
                text+=`<div class="col-lg-12 mb-3" style="cursor:pointer; background:`+text_color+`; border:1px solid #cdcdcd; padding:15px; display:none;" id="down_`+va_number[i].name+`" onclick="div_dropdown('`+va_number[i].name+`');">`;
            }else{
                text+=`<div class="col-lg-12 mb-3" style="cursor:pointer; background:`+text_color+`; border:1px solid #cdcdcd; padding:15px; display:block;" id="down_`+va_number[i].name+`" onclick="div_dropdown('`+va_number[i].name+`');">`;
            }
            text+=`
                <div class="row">
                    <div class="col-lg-12" style="display: flex;align-items: center;">
                        <h5 class="single_border_custom_left" style="padding-left:10px;">`;
                        if(va_number[i].image){
                            text+=`<img style="width:auto; height:50px;" alt="Logo `+va_number[i].name+`" src="`+va_number[i].image+`"/>`;
                        }else{
                            text+=`<img style="width:auto; height:50px;" alt="Logo `+va_number[i].name+`" src="/static/tt_website_rodextrip/images/no pic/no-bank.png"/>`;
                        }
                        if(va_number[i].heading){
                            text+=`<b style="padding-left:10px;">`+va_number[i].heading+`</b>`;
                        }else{
                            text+=`<b style="padding-left:10px;">`+va_number[i].name+`</b>`;
                        }
                        text+=`
                            <b style="padding-left:10px;padding-right:10px; color:`+color+`">
                                <i class="fas fa-chevron-down"></i>
                            </b>
                        </h5>
                    </div>
                </div>
            </div>`;

            if(i==0){
                text += `<div class="col-lg-12 mb-3" style="background:white; border:1px solid #cdcdcd; padding:15px; display:block;" id="div_`+va_number[i].name+`">`;
            }else{
                text += `<div class="col-lg-12 mb-3" style="background:white; border:1px solid #cdcdcd; padding:15px; display:none;" id="div_`+va_number[i].name+`">`;
            }

            text+=`
            <div class="row">
                <div class="col-lg-12 mb-1">
                    <h4 class="mb-2">`+va_number[i].name+`</h4>
                    <b style="color:`+color+`; font-size:20px; padding-right:5px;">`+va_number[i].account_number+`</b>
                    <span onclick="copy_value('`+va_number[i].account_number+`');" style="cursor:pointer; font-weight:500;color:`+color+`; font-size:14px;">
                        COPY <i class="fas fa-copy"></i>
                    </span>

                    <hr/>
                    <strong>Fee Top Up (exclude bank charges): </strong><br/>
                    <span>`+va_number[i].currency+` `+getrupiah(va_number[i].price_component.fee)+`</span>
                </div>`;

                if(va_number[i].description_msg != ''){
                    text+=`
                    <div style="margin:0px 15px; width:100%;">
                        <div class="col-lg-12" style="background:#f7f7f7; border:1px solid #cdcdcd; padding:15px;">
                            <strong>Description: </strong><br/>
                            `+va_number[i].description_msg+`
                        </div>
                    </div>`;
                }
                if(va_number[i].html != ''){
                    account_number = `<a style="cursor:pointer;" onclick="copy_value('`+va_number[i].account_number+`');"><b style="color:`+color+`;">`+va_number[i].account_number+`</b></a>`;
                    text+=`
                    <div style="margin:0px 15px; width:100%;">
                        <div class="col-lg-12" style="background:#f7f7f7; border:1px solid #cdcdcd; padding:15px;">
                            <strong>Guide: </strong><br/>
                            `+va_number[i].html.replace('[%VA%]', account_number)+`
                        </div>
                    </div>`;
                }
                    text+=`
                </div>
            </div>`;
        }
        text+=`
        </div>
        <div class="row">`;
            for(i in payment_how_to_obj){
                if(i == 'other'){
                    for(j in payment_how_to_obj[i]){
                        if(payment_how_to_obj[i][j].heading != ''){
                            text+=`
                            <div class="col-lg-12" style="cursor:pointer; background:`+text_color+`; border:1px solid #cdcdcd; padding:15px; display:none;" id="up_other_bank" onclick="div_dropdown('other_bank');">
                                <div class="row">
                                    <div class="col-lg-12" style="display: flex;align-items: center;">
                                        <h5 class="single_border_custom_left" style="padding-left:10px;">`;
                                            text+=`<img style="width:auto; height:50px;" alt="Logo Other Bank" src="/static/tt_website_rodextrip/images/no pic/no-bank.png"/>`;
                                            text+=`<b style="padding-left:10px;">`+payment_how_to_obj[i][j].heading+`</b>`;
                                            text+=`
                                            <b style="padding-left:10px;padding-right:10px; color:`+color+`">
                                                <i class="fas fa-chevron-up"></i>
                                            </b>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12" style="cursor:pointer; background:`+text_color+`; border:1px solid #cdcdcd; padding:15px; display:block;" id="down_other_bank" onclick="div_dropdown('other_bank');">
                                <div class="row">
                                    <div class="col-lg-12" style="display: flex;align-items: center;">
                                        <h5 class="single_border_custom_left" style="padding-left:10px;">
                                            <img style="width:auto; height:50px;" alt="Logo Other Bank" src="/static/tt_website_rodextrip/images/no pic/no-bank.png"/>
                                            <b style="padding-left:10px;">`+payment_how_to_obj[i][j].heading+`</b>
                                            <b style="padding-left:10px;padding-right:10px; color:`+color+`">
                                                 <i class="fas fa-chevron-down"></i>
                                             </b>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12" style="background:white; border:1px solid #cdcdcd; padding:15px; display:none;" id="div_other_bank">
                                <div style="margin:15px 0px; width:100%;">
                                    <div class="col-lg-12" style="background:#f7f7f7; border:1px solid #cdcdcd; padding:15px;">
                                        <strong>Guide: </strong><br/>
                                        `+payment_how_to_obj[i][j].html+`
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                }
            }
            text+=`
            <script type="text/javascript" src="/tt_payment_gw_edc/static/src/js/jquery.payment.js"></script>
        </div>
    </div>`;
    }
    else{
        text = `
        <div class="col-lg-12" style="background:white; border:1px solid #cdcdcd; padding:15px;">
            <div class="row">
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
            msg = msg.replace(/&lt;/g, '<');
            msg = msg.replace(/&gt;/g, '>');
            document.getElementById('topup_tac').innerHTML = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get signature');
       },timeout: 60000
    });
}

function cancel_payment_method(order_number, provider_type){
    show_loading();
    please_wait_transaction();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'cancel_payment_method_api',
       },
       data: {
            "order_number": order_number,
            "signature": signature
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                if(provider_type == 'airline'){
                    airline_get_booking(order_number);
                }else if(provider_type == 'train'){
                    train_get_booking(order_number);
                }else if(provider_type == 'hotel'){
                    hotel_get_booking(order_number);
                }else if(provider_type == 'activity'){
                    activity_get_booking(order_number);
                }else if(provider_type == 'tour'){
                    tour_get_booking(order_number);
                }else if(provider_type == 'visa'){
                    visa_get_data(order_number);
                }else if(provider_type == 'passport'){
                    passport_get_data(order_number);
                }else if(provider_type == 'ppob'){
                    ppob_get_booking(order_number);
                }else if(provider_type == 'event'){
                    event_get_booking(order_number);
                }else if(provider_type == 'issued_offline'){
                    get_booking_offline(order_number);
                }else if(provider_type == 'medical'){
                    medical_get_booking(order_number);
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
                })
            }
            hide_modal_waiting_transaction();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update dynamic page');
       }
    });
}

function copy_data_acount(data){
    //
        text_copy = data.split('.').join('');
        const el = document.createElement('textarea');
        el.value = text_copy;
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