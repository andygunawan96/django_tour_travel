function get_voucher(){
    $.ajax({
       type: "POST",
       url: "/webservice/voucher",
       headers:{
            'action': 'get_voucher',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error voucher signin </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function set_voucher(type){
    $.ajax({
       type: "POST",
       url: "/webservice/voucher",
       headers:{
            'action': 'set_voucher',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error voucher signin </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function check_voucher(){
    if(document.getElementById('voucher_code').value != ''){
        provider_type_id = window.location.href.split('/')[window.location.href.split('/').length-2];
        provider_id = 'amadeus'; //amadeus
        voucher_reference = document.getElementById('voucher_code').value; //lalala.testing
//        voucher_reference = "TEST001";
        $.ajax({
           type: "POST",
           url: "/webservice/voucher",
           headers:{
                'action': 'check_voucher',
           },
           data: {
                'signature': signature,
                'provider_type_id': provider_type_id,
                'provider_id': provider_id,
                'voucher_reference': voucher_reference
           },
           success: function(msg) {
                console.log(msg);

                if(msg.result.error_code == 0){
                    voucher_code = voucher_reference;
                    if(provider_type_id == 'visa'){
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        if(price > msg.result.response.voucher_minimum_purchase){
                            if(msg.result.response.voucher_type == 'percent'){
                                discount_voucher['discount'] = price * msg.result.response.voucher_value / 100;
                            }else if(msg.result.response.voucher_type == 'amount'){
                                discount_voucher['discount'] = price * msg.result.response.voucher_value / 100;
                            }
                            discount_voucher['currency'] = msg.result.response.voucher_currency;
    //                        if(discount > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
    //                            discount = msg.result.response.voucher_cap
                        }

                        document.getElementById('voucher').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Expected discount `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                        </div>`;
                    }else if(provider_type_id == 'airline'){
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        console.log(airline_get_detail.result.response.total_price);
                        if(airline_get_detail.result.response.total_price > msg.result.response.voucher_minimum_purchase){
                            if(msg.result.response.voucher_type == 'percent'){
                                discount_voucher['discount'] = airline_get_detail.result.response.total_price * msg.result.response.voucher_value / 100;
                            }else if(msg.result.response.voucher_type == 'amount'){
                                discount_voucher['discount'] = airline_get_detail.result.response.total_price * msg.result.response.voucher_value / 100;
                            }
                            discount_voucher['currency'] = msg.result.response.voucher_currency;
    //                        if(discount > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
    //                            discount = msg.result.response.voucher_cap
                        }

                        document.getElementById('voucher').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Expected discount `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                        </div>`;
                    }
                }else{

                }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error voucher signin </span>' + errorThrown,
                })
           },timeout: 60000
        });
    }else{
        Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: 'Please fill voucher code',
            })
    }
}
