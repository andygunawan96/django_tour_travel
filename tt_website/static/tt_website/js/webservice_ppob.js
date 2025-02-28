function signin_ppob(data){
    try{
        $('.btn-next').addClass("running");
        $('.btn-next').prop('disabled', true);
    }catch(err){
        console.log(err); //error kalau tidak ada button next bisa di tambah class runnning & disabled
    }
    if(typeof(platform) === 'undefined'){
            platform = '';
    }
    if(typeof(unique_id) === 'undefined'){
        unique_id = '';
    }
    if(typeof(web_vendor) === 'undefined'){
        web_vendor = '';
    }
    if(typeof(timezone) === 'undefined'){
        timezone = '';
    }
    data_send = {
        "platform": platform,
        "unique_id": unique_id,
        "browser": web_vendor,
        "timezone": timezone
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'signin',
       },
       data: data_send,
       success: function(msg) {
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
                get_agent_currency_rate();
                if(data == '')
                {
                    search_ppob();
                }
                else
                {
                    ppob_get_provider_list();
                    ppob_get_booking(data);
                }
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else if(msg.result.error_code == 1040){
                $('#myModalSignIn').modal('show');
                try{
                    document.getElementById('keep_me_sign_in_div').hidden = true;
                }catch(err){}
                try{
                    document.getElementById('forget_password_label').hidden = true;
                }catch(err){}
                try{
                    setTimeout(() => {
                      document.getElementById('email_otp_input1').select();
                    }, 500);
                }catch(err){}
//                Swal.fire({
//                    type: 'warning',
//                    html: 'Input OTP'
//                });
                if(document.getElementById('otp_div')){
                    document.getElementById('otp_information').innerHTML = 'An OTP has been sent, Please check your email!';
                    document.getElementById('otp_information').hidden = false;
                    document.getElementById('otp_type_div').hidden = false;
                    document.getElementById('otp_div').hidden = false;
                    document.getElementById('otp_time_limit').hidden = false;
                    document.getElementById('username_div').hidden = true;
                    document.getElementById('password_div').hidden = true;
                    document.getElementById('signin_btn').onclick = function() {get_captcha('g-recaptcha-response','signin_product_otp');}
                    document.getElementById("btn_otp_resend").onclick = function() {signin_product_otp(true);}

                    now = new Date().getTime();

                    time_limit_otp = msg.result.error_msg.split(', ')[1];
                    tes = moment.utc(time_limit_otp).format('YYYY-MM-DD HH:mm:ss');
                    localTime  = moment.utc(tes).toDate();

                    data_gmt = moment(time_limit_otp)._d.toString().split(' ')[5];
                    gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                    timezone = data_gmt.replace (/[^\d.]/g, '');
                    timezone = timezone.split('')
                    timezone = timezone.filter(item => item !== '0')
                    time_limit_otp = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                    time_limit_otp = parseInt((new Date(time_limit_otp.replace(/-/g, "/")).getTime() - now) / 1000);
                    session_otp_time_limit();
                }
                $('.loading-button').prop('disabled', false);
                $('.loading-button').removeClass("running");
            }else if(msg.result.error_code == 1041){
                Swal.fire({
                    type: 'warning',
                    html: msg.result.error_msg
                });
                $('.loading-button').prop('disabled', false);
                $('.loading-button').removeClass("running");
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error signin ppob');
            $('.payment_acq_btn').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function get_config_ppob(){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_config',
       },
       data: {},
       success: function(msg) {
            ppob_data = msg;
            text = '';
            prov_counter = 0;
            first_prov_loop = ''
            for (prov_loop in provider_list_data_ppob)
            {
                text+=`
                <label class="radio-button-custom" style="margin-bottom:20px;">
                <span style="font-size:13px; color:`+text_color+`;">`+provider_list_data_ppob[prov_loop].name+`</span>`;
                if(prov_counter == 0){
                    first_prov_loop = prov_loop;
                    text+=`<input type="radio" checked="checked" name="bills_provider" onclick="get_carrier_setup('`+prov_loop+`');" value="`+prov_loop+`">`;
                }else{
                    text+=`<input type="radio" name="bills_provider" onclick="get_carrier_setup('`+prov_loop+`');" value="`+prov_loop+`">`;
                }
                text+=`
                    <span class="checkmark-radio"></span>
                </label>`;

                prov_counter++;
            }
            text += '<br/>'
            document.getElementById('radio_bill_search').innerHTML = text;
            get_carrier_setup(first_prov_loop);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error get config ppob')
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config ppob');
       },timeout: 60000
    });
}

function get_carriers_ppob(){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                carrier_ppob = msg.result.response;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error get carriers ppob')
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get carriers ppob');
       },timeout: 60000
    });
}

function get_carrier_providers_ppob(){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_carrier_providers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                carrier_provider_ppob = msg.result.response;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error get carrier providers ppob')
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get carrier providers ppob');
       },timeout: 60000
    });
}

function ppob_get_provider_list(is_get_config=false){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_provider_list',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           provider_list_data_ppob = msg;
           if (is_get_config)
           {
               for (ppob_prov in provider_list_data_ppob)
               {
                   for (ppob_prov_backend in provider_list_ppob)
                   {
                        if (provider_list_ppob[ppob_prov_backend].code == provider_list_data_ppob[ppob_prov].provider)
                        {
                            provider_list_data_ppob[ppob_prov]['name'] = provider_list_ppob[ppob_prov_backend].name
                        }
                   }
               }
               get_config_ppob();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error ppob get provider list');
       },timeout: 60000
    });
}

function get_providers_ppob(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_provider_list_backend',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
               provider_list_ppob = msg.result.response;
               ppob_get_provider_list(true);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error ppob get providers')
//           error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error ppob get providers');
       },timeout: 60000
    });

}

function search_ppob(){
    product_code = '';
    amount_of_month = 0;
    total = 0;
    e_voucher = '';
    error_log = '';
    customer_number = document.getElementById('bpjs_number').value;
    game_zone_id = '';
    customer_email = '';
    check_break = false;
    if(bill_type == 'bpjs'){
        var prod_selection = document.getElementById('bpjs_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        amount_of_month = document.getElementById('bpjs_month').value;
        if($bpjs_type_name.includes('BPJS Kesehatan')){
            if(check_number(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $bpjs_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $bpjs_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }
    }else if(bill_type == 'pln'){
        var prod_selection = document.getElementById('pln_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if($pln_type_name.includes('PLN Prepaid')){
            if(check_pln_prepaid(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
            total = document.getElementById('pln_nominal').value
        }else if($pln_type_name.includes('PLN Postpaid')){
            if(check_pln_postpaid(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }else if($pln_type_name.includes('PLN Non Tagihan')){
            if(check_pln_non_tagihan(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }
    }else if(bill_type == 'e-voucher'){
        var prod_selection = document.getElementById('evoucher_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_evoucher(customer_number, product_code) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $evoucher_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $evoucher_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
        if($evoucher_type_name.includes('Prepaid Mobile')){
            var radios_nominal = document.getElementsByName('e-voucher_nominal');
            for (var k = 0, length = radios_nominal.length; k < length; k++) {
                if (radios_nominal[k].checked) {
                    e_voucher = radios_nominal[k].value;
                    break;
                }
            }
            if (e_voucher == ''){
                error_log += 'Please choose voucher!';
            }
        }
        else if($evoucher_type_name.includes('Game Voucher')){
            var game_voucher_selection = document.getElementById('game_voucher')
            e_voucher = game_voucher_selection.options[game_voucher_selection.selectedIndex].value;
            if (e_voucher == ''){
                error_log += 'Please choose voucher!';
            }
            game_zone_id = document.getElementById('game_zone_id').value;
        }
        else if($evoucher_type_name.includes('Other Voucher')){
            var other_voucher_selection = document.getElementById('other_voucher')
            e_voucher = other_voucher_selection.options[other_voucher_selection.selectedIndex].value;
            if (e_voucher == ''){
                error_log += 'Please choose voucher!';
            }
        }
    }else if(bill_type == 'cable tv'){
        var prod_selection = document.getElementById('cable_tv_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_cable_tv(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $cable_tv_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $cable_tv_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
        if($cable_tv_type_name.includes('Indovision') || $cable_tv_type_name.includes('Indovision Top TV') || $cable_tv_type_name.includes('Indovision Oke Vision') || $cable_tv_type_name.includes('First Media'))
        {
            total = document.getElementById('cable_tv_nominal').value;
            if (total == 0 || total == '')
            {
                error_log += 'Please fill payment amount!';
            }
        }
    }else if(bill_type == 'internet'){
        var prod_selection = document.getElementById('internet_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_internet(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $internet_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $internet_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
        if($internet_type_name.includes('CBN') || $internet_type_name.includes('Indosatnet') || $internet_type_name.includes('Centrinnet'))
        {
            total = document.getElementById('internet_nominal').value;
            if (total == 0 || total == '')
            {
                error_log += 'Please fill payment amount!';
            }
        }
    }else if(bill_type == 'telephone'){
        var prod_selection = document.getElementById('telephone_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_telephone(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $telephone_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $telephone_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
    }else if(bill_type == 'insurance'){
        var prod_selection = document.getElementById('insurance_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_insurance(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $insurance_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $insurance_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
        total = document.getElementById('insurance_nominal').value;
        if (total == 0 || total == '')
        {
            error_log += 'Please fill payment amount!';
        }
    }else if(bill_type == 'pdam'){
        var prod_selection = document.getElementById('pdam_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_pdam(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $pdam_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $pdam_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
        var pdam_voucher_selection = document.getElementById('pdam_voucher')
        e_voucher = pdam_voucher_selection.options[pdam_voucher_selection.selectedIndex].value;
        if (e_voucher == ''){
            error_log += 'Please choose area!';
        }
    }else if(bill_type == 'pbb'){
        var prod_selection = document.getElementById('pbb_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_pbb(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $pbb_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $pbb_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
        var pbb_voucher_selection = document.getElementById('pbb_voucher')
        e_voucher = pbb_voucher_selection.options[pbb_voucher_selection.selectedIndex].value;
        if (e_voucher == ''){
            error_log += 'Please choose area!';
        }
    }else if(bill_type == 'gas'){
        var prod_selection = document.getElementById('gas_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_gas(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $gas_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $gas_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
    }else if(bill_type == 'credit installment'){
        var prod_selection = document.getElementById('credit_installment_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_credit_installment(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $credit_installment_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $credit_installment_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
        total = document.getElementById('credit_installment_nominal').value;
        if (total == 0 || total == '')
        {
            error_log += 'Please fill payment amount!';
        }
    }else if(bill_type == 'credit card'){
        var prod_selection = document.getElementById('credit_card_type');
        product_code = prod_selection.options[prod_selection.selectedIndex].value;

        if(check_credit_card(customer_number) == true){
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $credit_card_type_name){
                            if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                }else{
                                    error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                }
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }else{
            for(i in ppob_data.product_data){
                if(check_break == false){
                    for(j in ppob_data.product_data[i]){
                        if(ppob_data.product_data[i][j].name == $credit_card_type_name){
                            if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                error_log += 'Please check customer number must be between '+ppob_data.product_data[i][j].min_cust_number+ ' and '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }else{
                                error_log += 'Please check customer number must be at least '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }
                }else{
                    break;
                }
            }
        }
        total = document.getElementById('credit_card_nominal').value;
        if (total == 0 || total == '')
        {
            error_log += 'Please fill payment amount!';
        }
    }
    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
        customer_email = document.getElementById('customer_email').value
        if (customer_email == '')
        {
            error_log += 'Please fill your email address!';
        }
    }
    if(product_code != '' && customer_number != '' && error_log == ''){
        var search_provider_ppob = '';
        var prov_radios = document.getElementsByName('bills_provider');
        for (var j = 0, prov_length = prov_radios.length; j < prov_length; j++) {
            if (prov_radios[j].checked) {
                // do whatever you want with the checked radio
                search_provider_ppob = prov_radios[j].value;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        $.ajax({
           type: "POST",
           url: "/webservice/ppob",
           headers:{
                'action': 'search',
           },
           data: {
                'customer_number': customer_number,
                'game_zone_id': game_zone_id,
                'product_code': product_code,
                'provider': search_provider_ppob,
                'signature': signature,
                'total': total,
                'e_voucher_code': e_voucher,
                'amount_of_month': amount_of_month,
                'customer_email': customer_email
           },
           success: function(msg) {
                if(google_analytics != '')
                    gtag('event', 'ppob_hold_booking', {});
                bill_response = msg;
                if(msg.result.error_code == 0){
                    currency = '';
                    total_price = 0;
                    commission = 0;
                    for(i in msg.result.response.passengers){
                        for(j in msg.result.response.passengers[i].sale_service_charges){
                            for(k in msg.result.response.passengers[i].sale_service_charges[j]){
                                if(currency == '')
                                    currency = msg.result.response.passengers[i].sale_service_charges[j][k].currency;
                                if(k != 'RAC')
                                    total_price += msg.result.response.passengers[i].sale_service_charges[j][k].amount;
                                else
                                    commission += msg.result.response.passengers[i].sale_service_charges[j][k].amount;
                            }
                        }
                    }
                    //open modal
                    document.getElementById('bills_response').innerHTML = `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;font-weight:500;">Number:</span></div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;">`+msg.result.response.provider_booking[0].customer_number+`</span></div>
                        </div>`;

                    if(product_code != 'prepaid_mobile'){
                        document.getElementById('bills_response').innerHTML += `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;font-weight:500;">Name:</span></div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;">`+msg.result.response.provider_booking[0].customer_name+`</span></div>
                        </div>`;
                    }
                    var text_ppob = '';
                    text_ppob += `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;font-weight:500;">Total:</span></div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span id="total_price_ppob" style="font-size:15px;`;
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        text_ppob+='cursor:pointer;';
                    text_ppob += `">`+currency+` `+getrupiah(total_price);
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        text_ppob+=`<i class="fas fa-caret-down"></i>`;
                    text_ppob +=`</span></div>
                        </div>`;
                    document.getElementById('bills_response').innerHTML += text_ppob

                    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price){
                        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                try{
                                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                        price_convert = (Math.ceil(total_price)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                        if(price_convert%1 == 0)
                                            price_convert = parseInt(price_convert);
                                        document.getElementById('bills_response').innerHTML +=`
                                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                                        </div>
                                        <div class="col-lg-9 col-md-8 col-sm-6 col-xs-6">
                                            <div style="padding-bottom:15px;"><span style="font-size:15px;">Estimated `+k+` `+getrupiah(price_convert)+`</span></div>
                                        </div>`;
                                    }
                                }catch(err){
                                    console.log(err);
                                }
                            }
                        }
                    }
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        var price_breakdown = {};
                        var currency_breakdown = '';

                        for(i in bill_response.result.response.passengers){
                            for(j in bill_response.result.response.passengers[i].service_charge_details){
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
                                if(!price_breakdown.hasOwnProperty('NTA PPOB'))
                                    price_breakdown['NTA PPOB'] = 0;
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
                                if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                                    price_breakdown['CHANNEL UPSELL'] = 0;

                                price_breakdown['FARE'] += bill_response.result.response.passengers[i].service_charge_details[j].base_fare;
                                price_breakdown['TAX'] += bill_response.result.response.passengers[i].service_charge_details[j].base_tax;
                                price_breakdown['BREAKDOWN'] = 0;
                                price_breakdown['UPSELL'] += bill_response.result.response.passengers[i].service_charge_details[j].base_upsell;
                                if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                                    price_breakdown['COMMISSION'] += (bill_response.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                                price_breakdown['NTA PPOB'] += bill_response.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                                price_breakdown['SERVICE FEE'] += bill_response.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                                price_breakdown['VAT'] += bill_response.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                                price_breakdown['OTT'] += bill_response.result.response.passengers[i].service_charge_details[j].base_price_ott;
                                price_breakdown['TOTAL PRICE'] += bill_response.result.response.passengers[i].service_charge_details[j].base_price;
                                price_breakdown['NTA AGENT'] += bill_response.result.response.passengers[i].service_charge_details[j].base_nta;
                                if(user_login.co_agent_frontend_security.includes('agent_ho'))
                                    price_breakdown['COMMISSION HO'] += bill_response.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                                for(k in bill_response.result.response.passengers[i].service_charge_details[j].service_charges){
                                    if(k == 'ROC'){
                                        for(l in bill_response.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                            if(bill_response.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                                price_breakdown['CHANNEL UPSELL'] += bill_response.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
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
                            attach: '#total_price_ppob',
                            target: '#total_price_ppob',
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
                    $('#myModalBills').modal('show');
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error check price </span>' + msg.result.error_msg,
                    })
                }
                $('.btn-next').removeClass("running");
                $('.btn-next').prop('disabled', false);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error ppob check price');
                $('.btn-next').removeClass("running");
                $('.btn-next').prop('disabled', false);
           },timeout: 60000
        });
    }else{
        $('.btn-next').removeClass("running");
        $('.btn-next').prop('disabled', false);
        if(error_log == '')
            alert_message_swal('Please fill all the blank!');
        else
            alert_message_swal(error_log);
    }
}

function bills_ppob(){
    $('.btn-next').addClass("running");
    $('.btn-next').prop('disabled', true);
    if(user_login.co_agent_frontend_security.includes('b2c_limitation')){
        document.getElementById("passengers").value = JSON.stringify({"booker":{"booker_seq_id":bill_response.result.response.booker.seq_id}});
        document.getElementById("signature").value = signature;
        document.getElementById("provider").value = 'ppob';
        document.getElementById("type").value = 'ppob';
        document.getElementById("voucher_code").value = '';
        document.getElementById("discount").value = JSON.stringify({});
        document.getElementById("session_time_input").value = 600;
        send_url_booking('bills', btoa(bill_response.result.response.order_number), bill_response.result.response.order_number);
        document.getElementById('order_number').value = bill_response.result.response.order_number;
        document.getElementById('ppob_issued').submit();
    }else{
        document.getElementById('bill_searchForm').innerHTML+= '<input type="hidden" name="order_number" value='+bill_response.result.response.order_number+'>';
        document.getElementById('bill_searchForm').action = '/ppob/booking/' + btoa(bill_response.result.response.order_number);
        document.getElementById('bill_searchForm').submit();
    }
    //testing
//    document.getElementById('bill_searchForm').innerHTML+= '<input type="hidden" name="order_number" value='+bill_response.result.response.order_number+'>';
//    document.getElementById('bill_searchForm').action = '/ppob/booking/' + btoa(bill_response.result.response.order_number);
//    document.getElementById('bill_searchForm').submit();

}

function ppob_get_booking(data){
    price_arr_repricing = {};
    get_vendor_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
           bills_get_detail = msg;
           get_payment = false;
           hide_modal_waiting_transaction();
           document.getElementById('button-home').hidden = false;
           document.getElementById('button-new-reservation').hidden = false;
           try{
               //get booking view edit here
               if(msg.result.error_code == 0){
                can_issued = msg.result.response.can_issued;
                document.getElementById('button_new_offline').hidden = false;
                document.getElementById('booking_data_product').value = JSON.stringify(msg);
                var text = '';
                $text = '';
                csc = 0;
//                for(i in msg.result.response.passengers){
//                    try{
//                        csc += msg.result.response.passengers[i].channel_service_charges.amount;
//                    }catch(err){
//                        console.log(err);
//                    }
//                }
                check_provider_booking = 0;
                if(msg.result.response.hold_date != false && msg.result.response.hold_date != ''){
                    tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                    localTime  = moment.utc(tes).toDate();
                    msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                    var now = moment();
                    var hold_date_time = moment(msg.result.response.hold_date, "DD MMM YYYY HH:mm");
                    data_gmt = moment(msg.result.response.hold_date)._d.toString().split(' ')[5];
                    gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                    timezone = data_gmt.replace (/[^\d.]/g, '');
                    timezone = timezone.split('')
                    timezone = timezone.filter(item => item !== '0')
                    msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    if(msg.result.response.booked_date != ''){
                        tes = moment.utc(msg.result.response.booked_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        msg.result.response.booked_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    }
                    if(msg.result.response.issued_date != ''){
                        tes = moment.utc(msg.result.response.issued_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        msg.result.response.issued_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    }
                }
                if(msg.result.response.state == 'cancel'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Cancelled!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'cancel2'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Expired!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'fail_issued'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Issued`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Failed!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'fail_refunded'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Refunded`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Failed!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'fail_booked'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Booked`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Failed!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'booked'){
                   try{
                       if(can_issued)
                           check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'ppob', signature, msg.result.response.payment_acquirer_number, msg);
                       get_payment = true;
    //                   get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                       //document.getElementById('issued-breadcrumb').classList.remove("active");
                       //document.getElementById('issued-breadcrumb').classList.add("current");
                       document.getElementById('issued-breadcrumb').classList.add("br-active");
                       document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                       var check_error_msg_provider = 0;
                       for(co_error in msg.result.response.provider_booking){
                           if(msg.result.response.provider_booking[co_error].error_msg != ''){
                                check_error_msg_provider = 1;
                           }
                           break;
                       }
                       if(check_error_msg_provider != 1){
                           document.getElementById('alert-state').innerHTML = `
                           <div class="alert alert-success" role="alert">
                               <h5>Your booking has been successfully Booked. Please proceed to payment or review your booking again.</h5>
                           </div>`;
                       }
                   }catch(err){
                       console.log(err);
                   }
                }else if(msg.result.response.state == 'draft'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('Booking-breadcrumb').classList.remove("br-book");
                   document.getElementById('Booking-breadcrumb').classList.add("br-fail");
                   document.getElementById('Booking-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('Booking-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('Booking-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-info" role="alert">
                       <h5>Your booking has not been processed!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'refund'){
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('issued-breadcrumb').classList.add("active");
                   document.getElementById('issued-breadcrumb').classList.add("br-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-dark" role="alert">
                       <h5>Your booking has been Refunded!</h5>
                   </div>`;
                }else{
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('issued-breadcrumb').classList.add("active");
                   document.getElementById('issued-breadcrumb').classList.add("br-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-success" role="alert">
                       <h5>Your booking has been successfully Issued!</h5>
                   </div>`;
                }

                if(msg.result.response.state == 'issued'){
                   //tanya ko sam kalau nyalain
    //                document.getElementById('ssr_request_after_sales').hidden = false;
    //                document.getElementById('ssr_request_after_sales').innerHTML = `
    //                        <input class="primary-btn-ticket" style="width:100%;margin-bottom:10px;" type="button" onclick="set_new_request_ssr()" value="Request New SSR">
    //                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="set_new_request_seat()" value="Request New Seat">`;
    //                document.getElementById('reissued').hidden = false;
    //                document.getElementById('reissued').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="reissued_btn();" value="Reissued">`;
                    provider_list = [];
                    for(i in msg.result.response.provider_bookings){
                        provider_list.push(msg.result.response.provider_bookings[i].provider);
                    }

                }
                if(msg.result.response.state == 'booked'){
                    try{
                        if(can_issued)
                            $(".issued_booking_btn").show();
                    }catch(err){
                        console.log(err); //kalau tidak ada button issued
                    }
                    check_provider_booking++;
                    try{
                       check_cancel = 0;
                       for(i in msg.result.response.provider_booking){
                            if(provider_list_data_ppob[msg.result.response.provider_booking[i].provider].is_post_booked_cancel){
                                check_cancel = 1;
                            }
                       }
                       if(check_cancel){
                            document.getElementById('cancel').hidden = false;
                            document.getElementById('cancel').innerHTML = `<button class="primary-btn-white" style="width:100%;" type="button" onclick="cancel_btn();">Cancel Booking <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i></button>`;
                       }
                    }catch(err){

                    }
                }
                else{
                    //$(".issued_booking_btn").remove();
                    $('.loader-rodextrip').fadeOut();
                    hide_modal_waiting_transaction();
                }

                $text += 'Order Number: '+ msg.result.response.order_number + '\n';

                //$text += 'Hold Date: ' + msg.result.response.hold_date + '\n';
                $text += msg.result.response.state_description + '\n';
                var localTime;
                currency = ''
                for(j in msg.result.response.provider_booking[0].service_charges){
                    if(currency == ''){
                        currency = msg.result.response.provider_booking[0].service_charges[j].currency;
                        break;
                    }
                }
                text += `
                <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-bottom:20px;">
                    <div class="row">
                        <div class="col-lg-12 mb-3" style="padding-bottom:15px; border-bottom:1px solid #cdcdcd;">
                            <h4>
                                <i class="fas fa-scroll"></i> Order Number: `+msg.result.response.order_number+`
                            </h4>
                        </div>
                    </div>
                    <table style="width:100%;">
                        <tr>
                            <th>PNR</th>`;
                            if(msg.result.response.state == 'booked')
                                text+=`<th>Hold Date</th>`;
                        text+=`
                            <th>Status</th>
                        </tr>`;
                        printed_hold_date = false;
                        for(i in msg.result.response.provider_booking){
                            if(msg.result.response.state == 'booked' && printed_hold_date == false){
                                if(get_payment == false){
                                   check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'ppob', signature, msg.result.response.payment_acquirer_number, msg);
                                   get_payment = true;
                                }
    //                                check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature);
    //                            get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                                $text += 'PLEASE MAKE PAYMENT BEFORE '+ msg.result.response.hold_date + `\n`;
                                try{
                                    if(now.diff(hold_date_time, 'minutes')<0)
                                        $(".issued_booking_btn").show();
                                }catch(err){
                                    console.log(err); //error kalau tidak ada button issued
                                }
                                check_provider_booking++;
                                printed_hold_date = true;
                            }
                            //datetime utc to local
                            if(msg.result.response.provider_booking[i].error_msg.length != 0 && msg.result.response.state != 'issued')
                                text += `<div class="alert alert-danger">
                                    `+msg.result.response.provider_booking[i].error_msg+`
                                    <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-1.9vh;">x</a>
                                </div>`;
                            //
                            text+=`<tr>`;
                            if(user_login.hasOwnProperty('co_is_agent_btc') && !user_login.co_is_agent_btc || msg.result.response.state == 'issued')
                                text+=`
                                    <td>`+msg.result.response.provider_booking[i].pnr+`</td>`;
                            else
                                text += `<td> - </td>`;

                            if(msg.result.response.state == 'booked')
                                text+=`<td>`+msg.result.response.hold_date+`</td>`;

                            text+=`
                                <td id='pnr'>`;
                            if(msg.result.response.state_description == 'Expired'){
                                text+=`<span style="background:#DC143C; color:white; padding:0px 15px; border-radius:14px;">`;
                            }
                            else if(msg.result.response.state_description == 'Booked'){
                                text+=`<span style="background:#3fa1e8; color:white; padding:0px 15px; border-radius:14px;">`;
                            }
                            else if(msg.result.response.state_description == 'Issued'){
                                text+=`<span style="background:#30b330; color:white; padding:0px 15px; border-radius:14px;">`;
                            }
                            else{
                                text+=`<span>`;
                            }
                            text+=`
                                    `+msg.result.response.state_description+`
                                </span>
                                </td>
                            </tr>`;
                        }
                        if(check_provider_booking == 0 && msg.result.response.state != 'issued'){
                            $text += msg.result.response.state_description+'\n';
                            check_provider_booking++;
                            $(".issued_booking_btn").remove();
                        }
                        $text +='\n';
                text+=`</table>
                    <hr/>`;

                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                    text+=`
                    <div class="row mb-3">
                        <div class="col-lg-6">
                            <b>Agent: </b><i>`+msg.result.response.agent_name+`</i>
                        </div>
                        <div class="col-lg-6">`;
                            if(msg.result.response.customer_parent_name){
                                text+=`<b>Customer: </b><i>`+msg.result.response.customer_parent_type_name+` `+msg.result.response.customer_parent_name+`</i>`;
                            }
                        text+=`
                        </div>
                    </div>`;
                }
                text+=`
                <div class="row">
                    <div class="col-lg-3">
                        <span>
                            <b>Booked by</b><br><i>`+msg.result.response.booked_by+`</i>
                        </span>
                    </div>
                    <div class="col-lg-9 mb-3">
                        <span>
                            <b>Booked Date </b><br/>`;
                            if(msg.result.response.booked_date != ""){
                                text+=`<i>`+msg.result.response.booked_date+`</i>`;
                            }else{
                                text+=`-`;
                            }
                        text+=`
                        </span>
                    </div>
                </div>`;

                if(msg.result.response.state == 'issued'){
                    text+=`
                    <div class="row">
                        <div class="col-lg-3 mb-3">
                            <span>
                                <b>Issued by</b><br><i>`+msg.result.response.issued_by+`</i>
                            </span>
                        </div>
                        <div class="col-lg-5 mb-3">
                            <span>
                                <b>Issued Date </b><br/>`;
                                if(msg.result.response.issued_date != ""){
                                    text+=`<i>`+msg.result.response.issued_date+`</i>`;
                                }else{
                                    text+=`-`;
                                }
                            text+=`
                            </span>
                        </div>
                    </div>`;
                }

                text+=`
                </div>
                <div style="background-color:white; border:1px solid #cdcdcd;">
                    <div class="row">
                        <div class="col-lg-12">
                            <div style="padding:15px; background-color:white;">
                            <div class="row">
                                <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">
                                    <h4 class="mb-3"><img src="/static/tt_website/images/icon/product/b-ppob.png" alt="undefined" style="width:20px; height:20px;"> Bill Detail</h4>
                                </div>
                            </div>`;
                        check = 0;
                        flight_counter = 1;
                        for(i in msg.result.response.provider_booking){
                            $text += 'Booking Code: ' + msg.result.response.provider_booking[i].pnr+'\n';
                            if(i != 0){
                                text+=`<hr/>`;
                            }
                            text+=`<h5>PNR: `+msg.result.response.provider_booking[i].pnr+`</h5>`;
                            flight_counter++;
                            text+=`<div class="row">
                                    <div class="col-lg-4">
                                        <span style="font-weight:500;">Type</span><br/>
                                        <span style="font-weight:500;">Number</span><br/>
                                        <span style="font-weight:500;">Name</span>
                                    </div>
                                    <div class="col-lg-8">
                                        <span>`+msg.result.response.provider_booking[i].carrier_name+`</span><br/>
                                        <span>`+msg.result.response.provider_booking[i].customer_number+`</span><br/>
                                        <span>`+msg.result.response.provider_booking[i].customer_name+`</span>
                                    </div>
                                   </div>`;
                        }
                        text+=`
                            </div>
                        </div>
                    </div>
                </div>`;
                if(msg.result.response.provider_booking[0].bill_details.length != 0){
                text+=`


                <div style="border:1px solid #cdcdcd; padding:15px; background-color:white; margin-top:20px;">
                    <div class="row">
                        <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">
                            <h4 class="mb-3"><i class="fas fa-users"></i> List of Family</h4>
                        </div>
                    </div>`;
                    passenger_count = 1;
                    for(i in msg.result.response.provider_booking){
                        for(j in msg.result.response.provider_booking[i].bill_details){
                            text+=`
                            <h5 class="single_border_custom_left" style="padding-left:5px;">`+(passenger_count)+`. `+msg.result.response.provider_booking[i].bill_details[j].customer_name+`</h5>
                            <b>Number: </b><i>`+msg.result.response.provider_booking[i].bill_details[j].customer_number+`</i><br>
                            <b>Total: </b><i>`+currency+` `+getrupiah(msg.result.response.provider_booking[i].bill_details[j].total)+`</i><br>`;
                            if(j != parseInt(msg.result.response.provider_booking[i].bill_details.length-1)){
                                text+=`<hr/>`;
                            }
                            passenger_count++;
                        }
                    }

                    text+=`
                    </div>`;
                }

                if(msg.result.response.provider_booking[0].description != ''){
                    text+=`
                    <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                        <h5> Additional Information</h5>
                        <hr/>
                        `+msg.result.response.provider_booking[0].description+`
                    </div>
                    `;
                }

                text += `
                <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <div class="row">`;
                if (msg.result.response.state == 'issued'){
                    text+=`
                        <div class="col-lg-6">
                            <label class="check_box_custom">
                                <span class="span-search-ticket" style="color:black;">Hide agent logo on tickets</span>
                                <input type="checkbox" id="is_hide_agent_logo" name="is_hide_agent_logo"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                        </div>`;
                }
                text+=`
                        <div class="col-lg-6">
                            <label class="check_box_custom">
                                <span class="span-search-ticket" style="color:black;">Force get new printout</span>
                                <input type="checkbox" id="is_force_get_new_printout" name="is_force_get_new_printout"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                        </div>`;
                text += `
                    </div>
                </div>`;

                text+=`
                <div class="row" style="margin-top:20px;">
                    <div class="col-lg-6" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state == 'issued'){
                                text+=`
                                <button type="button" class="primary-btn ld-ext-right" id="button-choose-print" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','ppob');">
                                    Print Ticket
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }else if (msg.result.response.state  == 'booked'){
                                text+=`
                                <button type="button" id="button-print-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','ppob');">
                                    Print Form
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                        }
                        text+=`
                    </div>
                    <div class="col-lg-6" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state  == 'booked'){
                                text+=`
                                <button type="button" id="button-print-itin-price" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary_price','ppob');">
                                    Print Form (Price)
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                            if (msg.result.response.state == 'issued'){
                                text+=`
                                <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                    <input type="button" class="primary-btn" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
                                    <div class="ld ld-ring ld-cycle"></div>
                                </a>`;
                                // modal invoice
                                text+=`
                                    <div class="modal fade" id="printInvoice" role="dialog" data-keyboard="false">
                                        <div class="modal-dialog">

                                          <!-- Modal content-->
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title">Invoice</h4>
                                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="row">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2">
                                                            <span class="control-label" for="Name">Name</span>
                                                            <div class="input-container-search-ticket">
                                                                <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-2">
                                                            <span class="control-label" for="Additional Information">Additional Information</span>
                                                            <div class="input-container-search-ticket">
                                                                <textarea style="width:100%; resize: none;" rows="4" id="additional_information" name="additional_information" placeholder="Additional Information"></textarea>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-2">
                                                            <span class="control-label" for="Address">Address</span>
                                                            <div class="input-container-search-ticket">
                                                                <textarea style="width:100%; resize: none;" rows="4" id="bill_address" name="bill_address" placeholder="Address"></textarea>
                                                                <!--<input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_address" placeholder="Address" required="1"/>-->
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <div style="text-align:right;">
                                                        <span>Don't want to edit? just submit</span>
                                                        <br/>
                                                        <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','ppob');">
                                                            Submit
                                                            <div class="ld ld-ring ld-cycle"></div>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                `;
                            }
                        }
                    text+=`
                    </div>
                </div>`;
                document.getElementById('bills_booking').innerHTML = text;

                //detail
                text = '';
                tax = 0;
                fare = 0;
                total_price = 0;
                total_price_for_discount = 0;
                total_price_provider = [];
                disc = 0;
                price_provider = 0;
                commission = 0;
                service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
                text_detail=`
                <div style="background-color:white; padding:15px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                    <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                        <h4 class="mb-3">Price Detail</h4>
                    </div>`;

                //repricing
                type_amount_repricing = ['Repricing'];
                //repricing
                counter_service_charge = 0;
                total_price_dict = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                $text += '\nPrice:\n';
                for(i in msg.result.response.provider_booking){
                    try{
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                            text_detail+=`
                                <div style="text-align:left">
                                    <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_booking[i].pnr+` </span>
                                </div>`;
                        rac = 0;
                        currency = '';
                        roc = 0;
                        pax = msg.result.response.provider_booking[i].bill_details.length;
                        if(pax == 0)
                            pax = msg.result.response.provider_booking[i].bill_data.length;
                        for(j in msg.result.response.passengers){
                            for(k in msg.result.response.passengers[j].sale_service_charges){
                                for(l in msg.result.response.passengers[j].sale_service_charges[k]){
                                    if(currency == '')
                                        currency = msg.result.response.passengers[j].sale_service_charges[k][l].currency;
                                    if(l == 'RAC')
                                        rac += msg.result.response.passengers[j].sale_service_charges[k][l].amount;
                                    else if(l == 'ROC' )
                                        roc += msg.result.response.passengers[j].sale_service_charges[k][l].amount;
                                    else if(l == 'TAX' )
                                        roc += msg.result.response.passengers[j].sale_service_charges[k][l].amount;
                                }
                            }
                        }
                        price_discount = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                        for(j in msg.result.response.passengers){
                            for(k in msg.result.response.passengers[j].sale_service_charges){
                                for(l in msg.result.response.passengers[j].sale_service_charges[k])
                                    price_discount[l] += msg.result.response.passengers[j].sale_service_charges[k][l].amount
                            }
                        }
                        disc -= price_discount['DISC'];
                        total_price_provider.push({
                            'pnr': msg.result.response.provider_booking[i].pnr,
                            'provider': msg.result.response.provider_booking[i].provider,
                            'price': JSON.parse(JSON.stringify(price_discount))
                        });
                        if(msg.result.response.provider_booking[i].bill_details.length != 0){
                            if(roc != 0)
                                msg.result.response.provider_booking[i].bill_details.push({
                                    "customer_name": "Service Charges",
                                    "currency": currency,
                                    "total": roc
                                })
//                            if(csc != 0)
//                                msg.result.response.provider_booking[i].bill_details.push({
//                                    "customer_name": "Other Service Charges",
//                                    "currency": currency,
//                                    "total": csc
//                                })
                            for(j in msg.result.response.provider_booking[i].bill_details){
                                price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                                price['FARE'] = msg.result.response.provider_booking[i].bill_details[j].total;
                                if(rac != 0)
                                    price['RAC'] = rac / pax;
                                else
                                    price['RAC'] = 0;
                                price['currency'] = currency;

                                text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+msg.result.response.provider_booking[i].bill_details[j].customer_name+`</span>`;
                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;
                                if(i == 0 && j == 0) //bill pertama & pnr pertama yg di upsell
                                    text_detail+=`
                                    <span style="font-size:13px;">`+currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC + csc))+`</span>`;
                                else
                                    text_detail+=`
                                    <span style="font-size:13px;">`+currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC))+`</span>`;
                                    text_detail+=`</div>
                                </div>`;
                                $text += msg.result.response.provider_booking[i].bill_details[j].customer_name + ' ['+msg.result.response.provider_booking[i].pnr+'] ';

                                $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
//                                if(counter_service_charge == 0){
//                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + csc + price.SSR + price.DISC);
//                                    price.CSC = csc;
//                                    total_price_for_discount += parseInt(price.FARE);
//                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + csc + price.SSR + price.DISC);
//                                }else{
//                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
//                                    total_price_for_discount += parseInt(price.FARE);
//                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
//                                }
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                total_price_for_discount += parseInt(price.FARE);
                                price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
//                                commission += parseInt(price.RAC);
                                total_price_dict = {
                                    'FARE': total_price_dict['FARE'] + price['FARE'],
                                    'RAC': total_price_dict['RAC'] + price['RAC'],
                                    'ROC': total_price_dict['ROC'] + price['ROC'],
                                    'TAX': total_price_dict['TAX'] + price['TAX'],
                                    'currency': price.currency,
                                    'CSC': total_price_dict['CSC'] + price['CSC'],
                                    'SSR': total_price_dict['SSR'] + price['SSR'],
                                    'DISC': total_price_dict['DISC'] + price['DISC'],
                                    'SEAT': total_price_dict['SEAT'] + price['SEAT']
                                }
                                counter_service_charge++;
                            }
                        }else{
                            if(roc != 0)
                                msg.result.response.provider_booking[i].bill_data.push({
                                    "period_date": "Service Charges",
                                    "currency": currency,
                                    "total": roc
                                })
//                            if(csc != 0)
//                                msg.result.response.provider_booking[i].bill_data.push({
//                                    "period_date": "Other Service Charges",
//                                    "currency": currency,
//                                    "total": csc
//                                })
                            for(j in msg.result.response.provider_booking[i].bill_data){
                                price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                                price['FARE'] = msg.result.response.provider_booking[i].bill_data[j].total;
                                if(rac != 0)
                                    price['RAC'] = rac / pax;
                                else
                                    price['RAC'] = 0;
                                price['currency'] = currency;


                                text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+msg.result.response.provider_booking[i].bill_data[j].period_date+`</span>`;
                        text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;
                                if(i == 0 && j == 0) //bill pertama & pnr pertama yg di upsell
                                    text_detail+=`
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT + price.DISC))+`</span>`;
                                else
                                    text_detail+=`
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC))+`</span>`;
                                    text_detail+=`
                                    </div>
                                </div>`;
                                $text += msg.result.response.provider_booking[i].bill_data[j].period_date + ' ['+msg.result.response.provider_booking[i].pnr+'] ';


//                                if(counter_service_charge == 0 && j == 0){ //upsell hanya provider pertama, & hanya untuk bill pertama
//                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.SSR + price.DISC);
////                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + csc + price.SSR + price.DISC);
//                                    price.CSC = csc;
//                                    total_price_for_discount += parseInt(price.FARE);
//                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
//                                    $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.DISC))+'\n';
////                                    $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + csc + price.DISC))+'\n';
//                                }else{
//                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
//                                    total_price_for_discount += parseInt(price.FARE);
//                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
//                                    $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.DISC))+'\n';
//                                }
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                    total_price_for_discount += parseInt(price.FARE);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                    $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.DISC))+'\n';
//                                commission += parseInt(price.RAC);
                                total_price_dict = {
                                    'FARE': total_price_dict['FARE'] + price['FARE'],
                                    'RAC': total_price_dict['RAC'] + price['RAC'],
                                    'ROC': total_price_dict['ROC'] + price['ROC'],
                                    'TAX': total_price_dict['TAX'] + price['TAX'],
                                    'currency': price.currency,
                                    'CSC': total_price_dict['CSC'] + price['CSC'],
                                    'SSR': total_price_dict['SSR'] + price['SSR'],
                                    'DISC': total_price_dict['DISC'] + price['DISC'],
                                    'SEAT': total_price_dict['SEAT'] + price['SEAT']
                                }
                                counter_service_charge++;
                            }
                        }
                        price_provider = 0;
                    }catch(err){
                        console.log(err);
                    }
                    if(i == 0){
                        //repricing
                        check = 0;
                        if(price_arr_repricing.hasOwnProperty('Reservation') == false){
                            price_arr_repricing['Reservation'] = {}
                            pax_type_repricing.push(['Reservation', 'Reservation']);
                        }
                        price_arr_repricing['Reservation']['Reservation'] = {
                            'Fare': total_price_dict['FARE'] + total_price_dict['SSR'] + total_price_dict['SEAT'] + total_price_dict['DISC'],
                            'Tax': total_price_dict['TAX'] + total_price_dict['ROC'] - csc,
                            'Repricing': csc
                        }
                        text_repricing = `
                        <div class="col-lg-12">
                            <div style="padding:5px;" class="row">
                                <div class="col-lg-3"></div>
                                <div class="col-lg-3">Price</div>
                                <div class="col-lg-3">Repricing</div>
                                <div class="col-lg-3">Total</div>
                            </div>
                        </div>`;
                        for(k in price_arr_repricing){
                            for(l in price_arr_repricing[k]){
                                text_repricing += `
                                <div class="col-lg-12">
                                    <div style="padding:5px;" class="row" id="adult">
                                        <div class="col-lg-3" id="`+j+`_`+k+`">`+l+`</div>
                                        <div class="col-lg-3" id="`+l+`_price">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                                        if(price_arr_repricing[k][l].Repricing == 0)
                                            text_repricing+=`<div class="col-lg-3" id="`+l+`_repricing">-</div>`;
                                        else
                                            text_repricing+=`<div class="col-lg-3" id="`+l+`_repricing">`+getrupiah(price_arr_repricing[k][l].Repricing)+`</div>`;
                                        text_repricing+=`<div class="col-lg-3" id="`+l+`_total">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                                    </div>
                                </div>`;
                            }
                        }
                        //booker
                        booker_insentif = '-';
                        if(msg.result.response.hasOwnProperty('booker_insentif'))
                            booker_insentif = getrupiah(msg.result.response.booker_insentif)
                        text_repricing += `
                        <div class="col-lg-12">
                            <div style="padding:5px;" class="row" id="booker_repricing" hidden>
                            <div class="col-lg-6" id="repricing_booker_name">Booker Insentif</div>
                            <div class="col-lg-3" id="repriring_booker_repricing"></div>
                            <div class="col-lg-3" id="repriring_booker_total">`+booker_insentif+`</div>
                            </div>
                        </div>`;
                        text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                        document.getElementById('repricing_div').innerHTML = text_repricing;

                        //repricing
                    }
                }
                try{
                    total_price -= disc;
                    bills_get_detail.result.response.total_price = total_price;
                    $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
                    if(check_provider_booking != 0 && msg.result.response.state == 'booked'){
                        $text += '\n\nPrices and availability may change at any time';
                    }
                    if(disc != 0){
                        text_detail+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Discount</span>`;
                                text_detail+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` -`+getrupiah(parseInt(disc))+`</span>
                                </div>
                            </div>`;
                    }
                    text_detail+=`
                    <div>
                        <hr/>
                    </div>
                    <div class="row" style="margin-bottom:10px;">
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span id="total_price" style="font-size:13px; font-weight: bold;`;
                            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                                text_detail+='cursor:pointer;';
                            text_detail+=`">`;
                            try{
                                text_detail+= price.currency+` `+getrupiah(total_price);
                            }catch(err){

                            }
                            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                                text_detail+=`<i class="fas fa-caret-down"></i>`;
                            text_detail+= `</span>
                        </div>
                    </div>`;
                    if(['booked', 'partial_booked', 'partial_issued', 'halt_booked'].includes(msg.result.response.state)){
                        if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price){
                            if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                    try{
                                        if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == price.currency){
                                            price_convert = (parseFloat(total_price)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                            if(price_convert%1 == 0)
                                                price_convert = parseInt(price_convert);
                                            text_detail+=`
                                                <div class="row" style="margin-bottom:10px;">
                                                    <div class="col-lg-12" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:bold;" id="total_price_`+k+`"> Estimated `+k+` `+price_convert+`</span><br/>
                                                    </div>
                                                </div>`;
                                        }
                                    }catch(err){
                                        console.log(err);
                                    }
                                }
                            }
                        }
                    }else if(msg.result.response.hasOwnProperty('estimated_currency') && msg.result.response.estimated_currency.hasOwnProperty('other_currency') && Object.keys(msg.result.response.estimated_currency.other_currency).length > 0){
                        for(k in msg.result.response.estimated_currency.other_currency){
                            text_detail+=`
                                        <div class="col-lg-12" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;" id="total_price_`+msg.result.response.estimated_currency.other_currency[k].currency+`"> Estimated `+msg.result.response.estimated_currency.other_currency[k].currency+` `+getrupiah(msg.result.response.estimated_currency.other_currency[k].amount)+`</span><br/>
                                        </div>`;
                        }
                    }
                    if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                    else if(msg.result.response.state == 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_booker.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                        document.getElementById('repricing_type').innerHTML = '<option value="booker">Booker</option>';
                        $('#repricing_type').niceSelect('update');
                        reset_repricing();
                    }
                    text_detail+=`<div class="row">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <hr/>
                        <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                        share_data();
                        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        if (isMobile) {
                            text_detail+=`
                                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the bill price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the bill price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                        }

                    text_detail+=`
                        </div>
                    </div>`;
                    commission = rac;

                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false && user_login.co_agent_frontend_security.includes('see_commission')){
                        text_detail+=`
                        <div class="alert alert-success" style="margin-top:10px;">
                            <div style="color:black; font-weight:bold; cursor:pointer; font-size:15px; text-align:left; width:100%;" onclick="show_commission('show_commission');">
                                <span>YPM </span>
                                <span id="show_commission_button">`;
                                    text_detail+=`<span style="float:right;">show <i class="fas fa-eye"></i></span>`;
                                text_detail+=`
                                </span>`;

                                text_detail+=`<span id="show_commission" style="display:none;">`;

                                text_detail+=`<span style="font-size:14px; font-weight: bold; color:`+color+`;"> `+price.currency+` `+getrupiah(parseInt(rac)*-1)+`</span><br/>`;

                                if(msg.result.response.hasOwnProperty('agent_nta') == true){
                                    total_nta = 0;
                                    total_nta = msg.result.response.agent_nta;
                                    text_detail+=`
                                    <span style="font-size:14px; font-weight:bold;">Agent NTA: </span>
                                    <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(total_nta)+`</span><br/>`;
                                }
                                if(msg.result.response.hasOwnProperty('total_nta') == true){
                                    total_nta = 0;
                                    total_nta = msg.result.response.total_nta;
                                    text_detail+=`
                                    <span style="font-size:14px; font-weight:bold;">HO NTA: </span>
                                    <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(total_nta)+`</span><br/>`;
                                }
                                if(msg.result.response.hasOwnProperty('booker_insentif') == true){
                                    booker_insentif = 0;
                                    booker_insentif = msg.result.response.booker_insentif;
                                    text_detail+=`
                                    <span style="font-size:14px; font-weight:bold;">Booker Insentif: </span>
                                    <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(booker_insentif)+`</span>`;
                                }
                                if(rac == 0){
                                    text_detail+=`<span style="font-size:13px; font-weight: bold;color:red">* Please mark up the price first</span>`;
                                }
                                text_detail+=`
                                </span>
                            </div>
                        </div>`;
                    }
                    text_detail+=`<center>

                    <div style="padding-bottom:10px;">
                        <center>
                            <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                        </center>
                    </div>`;
//                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                    text_detail+=`
//                    <div style="margin-bottom:10px;">
//                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show YPM"/>
//                    </div>`;
                    if(msg.result.response.state == 'fail_issued' || msg.result.response.state == 'fail_refunded')
                    text_detail+=`
                    <div style="margin-bottom:10px;">
                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="resync_status();" value="Resync"/>
                    </div>`;
                    text+=`
                </div>`;
                }catch(err){
                    console.log(err);
                }
                document.getElementById('bills_detail').innerHTML = text_detail;
                $("#show_loading_booking_bills").hide();

                if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                    var price_breakdown = {};
                    var currency_breakdown = '';

                    for(i in bills_get_detail.result.response.passengers){
                        for(j in bills_get_detail.result.response.passengers[i].service_charge_details){
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
                            if(!price_breakdown.hasOwnProperty('NTA TRAIN'))
                                price_breakdown['NTA PPOB'] = 0;
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
                            if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                                price_breakdown['CHANNEL UPSELL'] = 0;

                            price_breakdown['FARE'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_fare;
                            price_breakdown['TAX'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_tax;
                            price_breakdown['BREAKDOWN'] = 0;
                            price_breakdown['UPSELL'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_upsell;
                            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                                price_breakdown['COMMISSION'] += (bills_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                            price_breakdown['NTA PPOB'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                            price_breakdown['SERVICE FEE'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                            price_breakdown['VAT'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                            price_breakdown['OTT'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_price_ott;
                            price_breakdown['TOTAL PRICE'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_price;
                            price_breakdown['NTA AGENT'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_nta;
                            if(user_login.co_agent_frontend_security.includes('agent_ho'))
                                price_breakdown['COMMISSION HO'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                            for(k in bills_get_detail.result.response.passengers[i].service_charge_details[j].service_charges){
                                if(k == 'ROC'){
                                    for(l in bills_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                        if(bills_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                            price_breakdown['CHANNEL UPSELL'] += bills_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
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

                //
                text = `
                <div class="modal fade" id="myModal" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Price Change <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div id="search_result" style="max-height:600px; overflow:auto; padding:15px;">
                                    <div class="col-sm-12">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div style="text-align:center" id="old_price">
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div style="text-align:center" id="new_price">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal" onclick="ppob_issued('`+msg.result.response.order_number+`');">Force Issued</button>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="myModal_reissue" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Ticket <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" onclick="dismiss_reissue();">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div id="search_result" style="max-height:600px; overflow:auto; padding:15px;">
                                    <div id="bills_ticket_pick">

                                    </div>
                                    <div class="col-sm-12" id="render_ticket_reissue">

                                    </div>

                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="myModal_price_itinerary" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Price Change <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" onclick="dismiss_reissue_get_price();">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div id="search_result" style="max-height:600px; overflow:auto; padding:15px;">
                                    <div id="bills_detail">

                                    </div>

                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                //
                document.getElementById('bills_booking').innerHTML += text;
                document.getElementById('show_title_bills').hidden = false;
                document.getElementById('show_loading_booking_bills').hidden = true;
                add_repricing();
                if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                    try{
                        render_voucher(price.currency,msg.result.response.voucher_discount, msg.result.response.state)
                    }catch(err){console.log(err);}
                }
                try{
                    if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                        document.getElementById('voucher_div').style.display = 'block';
                    else
                        document.getElementById('voucher_div').style.display = 'none';
                }catch(err){console.log(err);}
                if (msg.result.response.state != 'booked'){
    //                document.getElementById('issued-breadcrumb').classList.add("active");
                }

               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                   auto_logout();
               }else if(msg.result.error_code == 1035){
                    document.getElementById('show_loading_booking_bills').hidden = true;
                    render_login('ppob');
               }else{
                    text += `<div class="alert alert-danger">
                            <h5>
                                `+msg.result.error_code+`
                            </h5>
                            `+msg.result.error_msg+`
                        </div>`;
                    document.getElementById('bills_booking').innerHTML = text;
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error bills booking </span>' + msg.result.error_msg,
                    })
                    $('#show_loading_booking_bills').hide();
                    $('.loader-rodextrip').fadeOut();
               }
           }catch(err){
               text += `<div class="alert alert-danger">
                            <h5>
                                Error
                            </h5>
                        </div>`;
               document.getElementById('bills_booking').innerHTML = text;
               $('#show_loading_booking_bills').hide();
               $('.loader-rodextrip').fadeOut();
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bills booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bills get booking');
            $("#show_loading_booking_bills").hide();
            $("#show_error_booking_bills").show();
            hide_modal_waiting_transaction();
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function cancel_btn(){
    Swal.fire({
      title: 'Are you sure want to Cancel this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        show_loading();
        please_wait_transaction();
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/ppob",
           headers:{
                'action': 'cancel',
           },
           data: {
               'order_number': bills_get_detail.result.response.order_number,
               'signature': signature
           },
           success: function(msg) {
               if(msg.result.error_code == 0){
                   //update ticket
                   window.location = "/ppob/booking/" + bills_get_detail.result.response.order_number;
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   hide_modal_waiting_transaction();
                   document.getElementById('show_loading_booking_bills').hidden = false;
                   document.getElementById('bills_booking').innerHTML = '';
                   document.getElementById('bills_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_bills').style.display = 'block';
                   document.getElementById('show_loading_booking_bills').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").remove();
                   ppob_get_booking(bills_get_detail.result.response.order_number);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error ppob cancel </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        document.getElementById('show_loading_booking_bills').hidden = false;
                        document.getElementById('bills_booking').innerHTML = '';
                        document.getElementById('bills_detail').innerHTML = '';
                        document.getElementById('payment_acq').innerHTML = '';
                        document.getElementById('show_loading_booking_bills').style.display = 'block';
                        document.getElementById('show_loading_booking_bills').hidden = false;
                        document.getElementById('payment_acq').hidden = true;

                        hide_modal_waiting_transaction();
                        document.getElementById("overlay-div-box").style.display = "none";

                        $('.hold-seat-booking-train').prop('disabled', false);
                        $('.hold-seat-booking-train').removeClass("running");
                        ppob_get_booking(bills_get_detail.result.response.order_number);
                      }
                    })
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error ppob cancel booking');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_bills').hidden = false;
                document.getElementById('bills_booking').innerHTML = '';
                document.getElementById('bills_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_bills').style.display = 'block';
                document.getElementById('show_loading_booking_bills').hidden = false;
                document.getElementById('payment_acq').hidden = true;

                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                ppob_get_booking(bills_get_detail.result.response.order_number);
           },timeout: 300000
        });
      }
    })
}

function resync_status(){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'resync_status',
       },
       data: {
            'order_number': bills_get_detail.result.response.order_number,
            'signature': signature
       },
       success: function(msg) {
           if (msg.result.error_code == 0){
                ppob_get_booking(bills_get_detail.result.response.order_number)
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
               auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bills resync </span>' + msg.result.error_msg,
                })
                $('#show_loading_booking_bills').hide();
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bills sync status');
            $("#show_loading_booking_bills").hide();
            $("#show_error_booking_bills").show();
            hide_modal_waiting_transaction();
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });

}

function ppob_issued(data){
    var temp_data = {}
    if(typeof(bills_get_detail) !== 'undefined')
        temp_data = JSON.stringify(bills_get_detail)
    Swal.fire({
        title: 'Are you sure want to Issued this booking?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            show_loading();
            please_wait_transaction();

            if(document.getElementById('ppob_form'))
            {
                var formData = new FormData($('#ppob_form').get(0));
            }
            else
            {
                var formData = new FormData($('#global_payment_form').get(0));
            }
            formData.append('order_number', data);
            formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
            formData.append('member', payment_acq2[payment_method][selected].method);
            default_payment_to_ho = ''
            if(total_price_payment_acq == 0)
                default_payment_to_ho = 'balance'
            formData.append('agent_payment', document.getElementById('payment_ho_id') ? document.getElementById('payment_ho_id').value : default_payment_to_ho);
            formData.append('signature', signature);
            formData.append('voucher_code', voucher_code);
            formData.append('booking', temp_data);

            if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
            {
                formData.append('payment_reference', document.getElementById('pay_ref_text').value);
            }
            var error_log = '';
            if(document.getElementById('pin')){
                if(document.getElementById('pin').value)
                    formData.append('pin', document.getElementById('pin').value);
                else
                    error_log = 'Please input PIN!';
            }

            if(error_log){
                Swal.fire({
                    type: 'error',
                    title: 'Oops!',
                    html: error_log,
                })
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                setTimeout(function(){
                    hide_modal_waiting_transaction();
                }, 500);
            }else{
                getToken();
                $.ajax({
                    type: "POST",
                    url: "/webservice/ppob",
                    headers:{
                        'action': 'issued',
                    },
                    data: formData,
                    success: function(msg) {
                        if(google_analytics != '')
                            gtag('event', 'ppob_issued', {});
                        if(msg.result.error_code == 0){
                            if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                                window.location.href = '/ppob/booking/' + btoa(data);
                            }else{
                                //update ticket
                                price_arr_repricing = {};
                                pax_type_repricing = [];
                                hide_modal_waiting_transaction();
                                document.getElementById('show_loading_booking_bills').hidden = false;
                                document.getElementById('bills_booking').innerHTML = '';
                                document.getElementById('bills_detail').innerHTML = '';
                                document.getElementById('payment_acq').innerHTML = '';
                                document.getElementById('show_loading_booking_bills').style.display = 'block';
                                document.getElementById('show_loading_booking_bills').hidden = false;
                                document.getElementById('cancel').hidden = true;
                                document.getElementById('payment_acq').hidden = true;
                                document.getElementById("overlay-div-box").style.display = "none";
                                $(".issued_booking_btn").remove();
                                ppob_get_booking(data);
                            }
                        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                            auto_logout();
                        }else{
                            if(msg.result.error_code != 1007){
                                Swal.fire({
                                    type: 'error',
                                    title: 'Oops!',
                                    html: '<span style="color: #ff9900;">Error bills issued </span>' + msg.result.error_msg,
                                })
                            }else{
                                Swal.fire({
                                    type: 'error',
                                    title: 'Error bills issued '+ msg.result.error_msg,
                                    showCancelButton: true,
                                    cancelButtonText: 'Ok',
                                    confirmButtonColor: color,
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Top Up'
                                }).then((result) => {
                                    if (result.value) {
                                        window.location.href = '/top_up';
                                    }else{
                                        if(window.location.href.includes('payment')){
                                            window.location.href = '/ppob/booking/'+data;
                                        }
                                    }
                                })
                            }
                            price_arr_repricing = {};
                            pax_type_repricing = [];
                            document.getElementById('show_loading_booking_bills').hidden = false;
                            document.getElementById('bills_booking').innerHTML = '';
                            document.getElementById('bills_detail').innerHTML = '';
                            document.getElementById('payment_acq').innerHTML = '';
                            document.getElementById('show_loading_booking_bills').style.display = 'block';
                            document.getElementById('show_loading_booking_bills').hidden = false;
                            document.getElementById('cancel').hidden = true;
                            document.getElementById('payment_acq').hidden = true;

                            hide_modal_waiting_transaction();
                            document.getElementById("overlay-div-box").style.display = "none";

                            $('.hold-seat-booking-train').prop('disabled', false);
                            $('.hold-seat-booking-train').removeClass("running");
                            ppob_get_booking(data);
                        }
                    },
                    contentType:false,
                    processData:false,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bills issued');
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        document.getElementById('show_loading_booking_bills').hidden = false;
                        document.getElementById('bills_booking').innerHTML = '';
                        document.getElementById('bills_detail').innerHTML = '';
                        document.getElementById('payment_acq').innerHTML = '';
                        document.getElementById('show_loading_booking_bills').style.display = 'block';
                        document.getElementById('show_loading_booking_bills').hidden = false;
                        document.getElementById('cancel').hidden = true;
                        document.getElementById('payment_acq').hidden = true;
                        hide_modal_waiting_transaction();
                        document.getElementById("overlay-div-box").style.display = "none";
                        $('.hold-seat-booking-train').prop('disabled', false);
                        $('.hold-seat-booking-train').removeClass("running");
                        ppob_get_booking(data);
                    },timeout: 300000
                });
            }
        }
    })
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = []
        list_price = [];
        currency = ''
        for(i in bills_get_detail.result.response.passengers){
            for(j in bills_get_detail.result.response.passengers[i].sale_service_charges){
                for(k in bills_get_detail.result.response.passengers[i].sale_service_charges[j]){
                    if(!currency)
                        currency = bills_get_detail.result.response.passengers[i].sale_service_charges[j][k].currency;
                }
            }
        }
        for(j in list){
            list_price.push({
                'amount': list[j],
                'currency_code': currency
            });
        }
        upsell.push({
            'sequence': 0,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
        repricing_order_number = bills_get_detail.result.response.order_number;
    }else{
        // TIDAK TERPAKAI
        upsell_price = 0;
        upsell = []
        counter_pax = -1;
        currency = 'IDR';
        for(i in all_pax){
            list_price = [];
            for(j in list){
                if(all_pax[i].first_name+all_pax[i].last_name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                    upsell_price += list[j];
                }
            }
            counter_pax++;
            if(list_price.length != 0)
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': JSON.stringify(repricing_order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                if(type == 'booking'){
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    please_wait_transaction();
                    ppob_get_booking(repricing_order_number);
                }else{
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    get_price_itinerary_cache('review');
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bill update service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bill update service charge');
       },timeout: 60000
    });
}

function update_insentif_booker(type){
    repricing_order_number = '';
    if(type == 'booking'){
        booker_insentif = {}
        total_price = 0
        for(j in list){
            total_price += list[j];
        }
        booker_insentif = {
            'amount': total_price
        };
        repricing_order_number = order_number;
    }
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'booker_insentif_booking',
       },
       data: {
           'order_number': JSON.stringify(repricing_order_number),
           'booker': JSON.stringify(booker_insentif),
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                try{
                    if(type == 'booking'){
                        please_wait_transaction();
                        ppob_get_booking(repricing_order_number);
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                    }
                }catch(err){
                    console.log(err);
                }
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bills update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bills update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}