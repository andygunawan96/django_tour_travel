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
        if(provider_type_id == 'visa'){
            provider_id = ['visa_rodextrip']
        }else if(provider_type_id == 'airline'){
            provider_id = [];
            try{
                //booking
                for(i in airline_get_detail.result.response.provider_bookings){
                    provider_id.push(airline_get_detail.result.response.provider_bookings[i].provider)
                }
            }catch(err){
                //review
                for(i in price_itinerary.price_itinerary_provider)
                    provider_id.push(price_itinerary.price_itinerary_provider[i].provider)
                console.log(price_itinerary);
            }
        }else if(provider_type_id == 'train'){

        }else if(provider_type_id == 'activity'){

        }else if(provider_type_id == 'tour'){

        }else if(provider_type_id == 'hotel'){

        }
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
                'provider_id': JSON.stringify(provider_id),
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
                            for(i in msg.result.response.provider){
                                if(msg.result.response.provider[i].able_to_use == true){
                                    if(msg.result.response.voucher_type == 'percent'){
                                        discount_voucher['discount'] += total_price_provider[i] * msg.result.response.voucher_value / 100;

                                    }else if(msg.result.response.voucher_type == 'amount'){
                                        discount_voucher['discount'] += msg.result.response.voucher_value;
                                    }
                                }
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
                        try{
                            if(airline_get_detail.result.response.total_price > msg.result.response.voucher_minimum_purchase){
                                if(msg.result.response.voucher_type == 'percent'){
                                    discount_voucher['discount'] = airline_get_detail.result.response.total_price * msg.result.response.voucher_value / 100;
                                }else if(msg.result.response.voucher_type == 'amount'){
                                    discount_voucher['discount'] = msg.result.response.voucher_value;
                                }
                                discount_voucher['currency'] = msg.result.response.voucher_currency;
        //                        if(discount > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
        //                            discount = msg.result.response.voucher_cap
                            }
                        }catch(err){
                            if(total_price > msg.result.response.voucher_minimum_purchase){
                                if(msg.result.response.voucher_type == 'percent'){
                                    for(j in airline_price[i]){
                                        //cuman fare
                                        discount_voucher['discount'] += airline_price[i][j]['fare'] * msg.result.response.voucher_value / 100;
                                    }
                                }else if(msg.result.response.voucher_type == 'amount'){
                                    discount_voucher['discount'] = msg.result.response.voucher_value;
                                }
                                discount_voucher['currency'] = msg.result.response.voucher_currency;
        //                        if(discount > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
        //                            discount = msg.result.response.voucher_cap
                            }
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
