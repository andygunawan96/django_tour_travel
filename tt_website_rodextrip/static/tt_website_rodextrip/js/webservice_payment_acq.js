function get_payment_acq(val,booker_seq_id,order_number,transaction_type,signature,type,agent_seq_id,top_up_name){
    getToken();
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
            payment_acq2 = {};
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
            if(type == 'top_up')
                text=`<h4 style="color:`+color+`;">Payment Method</h4><hr/>`;
            else
                text=`<h4 style="color:`+color+`;">Customer Payment Method</h4><hr/>`;
            text+=`
            <h6 style="padding-bottom:10px;">1. Payment Via: </h6>`;
            if(template == 1){
                text+=`<div class="input-container-search-ticket btn-group">`;
            }else{
                text+=`<div>`;
            }
        if(template == 1 || template == 2){
            text+=`<div class="form-select" id="default-select">`;
        }else if(template == 3){
            text+=`<div class="default-select" style="margin-bottom:15px;">`;
        }else if(template == 4){
            text+=`<div class="select-wrap" style="margin-bottom:15px;">
            <span class="icon"><span class="icon-keyboard_arrow_down"></span></span>`;
        }

        if(template == 4){
            text+=`<select class="form-control payment_method" id="payment_via" onchange="set_payment('`+val+`','`+type+`');">`;
        }else{
            text+=`<select class="payment_method" id="payment_via" onchange="set_payment('`+val+`','`+type+`');">`;
        }
            for(i in payment_acq2){
                print = '';
                if(i == 'va')
                    print = 'Virtual Account';
                else
                    print = i.charAt(0).toUpperCase() + i.slice(1).toLowerCase();
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
            set_payment(val,type);
//            focus_box('payment_acq');
//            document.getElementById('payment_acq').hidden = false;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error payment acq </span>' + errorThrown,
            })
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
        else
        text+=`

        <label class="radio-button-custom">
            <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][i].name+`<br>
            <img width="50px" height="auto" src="`+payment_acq2[payment_method][i].image+`"/></span>
            <input type="radio" name="radio_payment_type" value="`+i+`" onclick="set_price('`+val+`','`+type+`');">
            <span class="checkmark-radio"></span>
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
    if(payment_method != 'credit_limit')
        text+=`<div class='row'>
                <div class="col-sm-5" style='text-align:left;'>
                <span style="font-size:13px;"> Account: </span><br>
                <span style="font-size:13px;;"> Account Name: </span>

                </div>
                <div class="col-sm-7" style='text-align:right;'>
                    <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][selected].account_number+`<br/>
                    <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][selected].account_name+`<br>
                </div>`;
    else if(payment_method == 'credit_limit'){
        text+=`<div class='row'>
                <div class="col-sm-5" style='text-align:left;'>
                <span style="font-size:13px;;"> Account Name: </span>

                </div>
                <div class="col-sm-7" style='text-align:right;'>
                    <span style="font-size:14px; font-weight:500;">`+payment_acq2[payment_method][selected].name+`<br>
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
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Credit Limit:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2[payment_method][selected].currency+` `+getrupiah(payment_acq2[payment_method][selected].credit_limit)+`</span>
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
                                                                        1. Log In ke Akun Mobile Banking
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
                                                                        2. Pilih <strong>Pembayaran &gt; Buat Pembayaran Baru &gt; Multipayment &gt; Pilih Espay</strong>
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
                                                                        3. Masukkan <strong>16 digit Nomor Virtual Account</strong>
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
                                                                        4. Masukkan jumlah nominal <strong>TOP UP Minimum Rp. 50.000 dan transaction fee Rp. 5000</strong>
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
                                                                        5. Jika sudah sesuai, masukkan <strong>OTP dan Pin SMS Banking, lalu klik OK</strong>
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
                                                                        6. Saldo SKYTORS akan bertambah secara otomatis (REAL TIME) setelah pembayaran berhasil dilakukan
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
                                                                        1. Log In ke Akun Mobile Banking
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
                                                                        2. Pilih <strong>Transfer &gt; Transfer ke bank lain &gt; Bank Mandiri</strong>
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
                                                                        3. Masukkan <strong>16 digit Nomor Virtual Account</strong>
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
                                                                        4. Masukkan jumlah nominal <strong>TOP UP Minimum Rp. 50.000 dan transaction fee Rp. 5000</strong>
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
                                                                        5. Jika sudah sesuai, masukkan <strong>OTP dan Pin SMS Banking, lalu klik OK</strong>
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
                                                                        6. Saldo SKYTORS akan bertambah secara otomatis (REAL TIME) setelah pembayaran berhasil dilakukan
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
                                                                        1. Log In ke Akun Mobile Banking
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
                                                                        2. Pilih <strong>Transfer &gt; Transfer ke bank lain &gt; Bank Mandiri</strong>
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
                                                                        3. Masukkan <strong>16 digit Nomor Virtual Account</strong>
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
                                                                        4. Masukkan jumlah nominal <strong>TOP UP Minimum Rp. 50.000 dan transaction fee Rp. 5000</strong>
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
                                                                        5. Jika sudah sesuai, masukkan <strong>OTP dan Pin SMS Banking, lalu klik OK</strong>
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
                                                                        6. Saldo SKYTORS akan bertambah secara otomatis (REAL TIME) setelah pembayaran berhasil dilakukan
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
                                                                        1. Masukkan kartu ATM Mandiri dan PIN Anda
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
                                                                        2. Pilih menu <strong>Bayar/Beli &gt; Lainnya &gt; Lainnya,</strong>
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
                                                                        3. Pilih <strong>Multi Payment &gt; Pilih Espay</strong>
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
                                                                        4. Masukkan <strong>16 digit Nomor Virtual Account</strong>
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
                                                                        5. Masukkan jumlah nominal <strong>TOP UP Minimum Rp. 50.000 dan Transaction fee Rp. 5000</strong>
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
                                                                        6. Jika sudah sesuai, tekan 1 dan lanjutkan dengan menekan Ya
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
                                                                        7. Saldo SKYTORS akan bertambah secara otomatis (REAL TIME) setelah pembayaran berhasil dilakukan
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
                                                                        1. Masukkan kartu ATM Mandiri dan PIN Anda
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
                                                                        2. Pilih <strong>Transfer &gt; Transfer ke bank lain &gt; Bank Mandiri</strong>
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
                                                                        3. Masukkan <strong>16 digit Nomor Virtual Account</strong>
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
                                                                        4. Masukkan jumlah nominal <strong>TOP UP Minimum Rp. 50.000 dan Transaction fee Rp. 5000</strong>
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
                                                                        6. Saldo SKYTORS akan bertambah secara otomatis (REAL TIME) setelah pembayaran berhasil dilakukan
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
                                                                        1. Masukkan kartu ATM Mandiri dan PIN Anda
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
                                                                        2. Pilih <strong>Transfer &gt; Transfer ke bank lain &gt; Bank Mandiri</strong>
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
                                                                        3. Masukkan <strong>16 digit Nomor Virtual Account</strong>
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
                                                                        4. Masukkan jumlah nominal <strong>TOP UP Minimum Rp. 50.000 dan transaction fee Rp. 5000</strong>
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
                                                                        6. Saldo SKYTORS akan bertambah secara otomatis (REAL TIME) setelah pembayaran berhasil dilakukan
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


                    <button type="submit" width="100px" class="btn btn-primary pull-right">

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
                        <span>`+discount_voucher['currency']+` `+getrupiah(discount_voucher['discount'])+`</span>
                    </div>`;
                payment_total = parseInt(payment_acq2[payment_method][selected].price_component.amount) + parseInt(payment_acq2[payment_method][selected].price_component.fee) + parseInt(payment_acq2[payment_method][selected].price_component.unique_amount) - discount_voucher['discount'];
            }else{
                payment_total = parseInt(payment_acq2[payment_method][selected].price_component.amount) + parseInt(payment_acq2[payment_method][selected].price_component.fee) + parseInt(payment_acq2[payment_method][selected].price_component.unique_amount);
            }
        }catch(err){
            try{
                payment_total = parseInt(payment_acq2[payment_method][selected].price_component.amount) + parseInt(payment_acq2[payment_method][selected].price_component.fee) + parseInt(payment_acq2[payment_method][selected].price_component.unique_amount);
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

    if(type == 'visa')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="force_issued_visa(1);" style="width:100%;">Request Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'train')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="train_issued('`+train_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline_review')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="force_issued_airline(1);" style="width:100%;">Pay Now<div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="airline_issued('`+airline_get_detail.result.response.order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'airline_reissue')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="reissue_airline_commit_booking(1);" style="width:100%;">Issued <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'hotel_review')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="force_issued_hotel();" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'activity_review')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="force_issued_activity(1);" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'activity')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="activity_pre_issued_booking('`+activity_order_number+`');" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'top_up' && payment_method != 'va')
        text += `<button type="button" id="submit_top_up" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="commit_top_up();" style="width:100%;">Submit <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'issued_offline')
        text += `<button type="button" id="submit_top_up" class="btn-next primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="commit_booking();" style="width:100%;">Submit <div class="ld ld-ring ld-cycle"></div></button>`;
    else if(type == 'tour')
        text += `<button type="button" class="btn-next primary-btn hold-seat-booking-train next-loading-issued ld-ext-right" onclick="tour_pre_create_booking();" style="width:100%;">Pay Now <div class="ld ld-ring ld-cycle"></div></button>`;
    document.getElementById('set_price').innerHTML = text;
}

