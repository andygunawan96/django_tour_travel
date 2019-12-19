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
        provider_id = [];
        if(provider_type_id == 'visa'){
            provider_id = ['visa_rodextrip']
        }else if(provider_type_id == 'airline'){
            try{
                //booking
                for(i in airline_get_detail.result.response.provider_bookings){
                    provider_id.push(airline_get_detail.result.response.provider_bookings[i].provider)
                }
            }catch(err){
                //review
                for(i in price_itinerary.price_itinerary_provider)
                    provider_id.push(price_itinerary.price_itinerary_provider[i].provider)
            }
        }else if(provider_type_id == 'train'){

        }else if(provider_type_id == 'activity'){
            try{
                provider_id.push(response.provider)
            }catch(err){
//                console.log(act_get_booking.result.response.provider);
                provider_id.push(act_get_booking.result.response.provider);
            }
        }else if(provider_type_id == 'tour'){
            try{
                provider_id.push(provider);
            }catch(err){
                provider_id.push(tr_get_booking.result.response.provider);
            }
            //pending RESPONSE BELOM FIX
//            console.log(price_data);
//            console.log(grand_total);
        }else if(provider_type_id == 'hotel'){
            provider_id.push(hotel_pick_provider.provider);
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
                voucher_code = voucher_reference;
                voucher_discount_response = msg;
                if(msg.result.error_code == 0){
                    if(provider_type_id == 'visa'){
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        if(price > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                            if(msg.result.response.provider[i].able_to_use == true){
                                if(msg.result.response.voucher_type == 'percent'){
                                    discount_voucher['discount'] += price * msg.result.response.voucher_value / 100;

                                }else if(msg.result.response.voucher_type == 'amount'){
                                    discount_voucher['discount'] += msg.result.response.voucher_value;
                                }
                            }
                        }
                        discount_voucher['currency'] = msg.result.response.voucher_currency;
                        if(discount > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
                            discount = msg.result.response.voucher_cap


                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Expected discount `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','visa');
                        }catch(err){}
                    }else if(provider_type_id == 'airline'){
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        try{
                            for(i in airline_get_detail.result.response.provider_bookings){
                                if(total_price_provider[i].price > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                                    if(msg.result.response.provider[i].able_to_use == true){
                                        if(msg.result.response.voucher_type == 'percent'){
                                            discount_voucher['discount'] += total_price_provider[i].price * msg.result.response.voucher_value / 100;

                                        }else if(msg.result.response.voucher_type == 'amount'){
                                            discount_voucher['discount'] += msg.result.response.voucher_value;
                                        }
                                    }
                                }
                                discount_voucher['currency'] = msg.result.response.voucher_currency;
                                if(discount_voucher['discount'] > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
                                    discount_voucher['discount'] = msg.result.response.voucher_cap
                            }
                        }catch(err){
                            if(total_price > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                                if(msg.result.response.voucher_type == 'percent' ){
                                    for(j in airline_price[i]){
                                        //cuman fare
                                        discount_voucher['discount'] += airline_price[i][j]['fare'] * msg.result.response.voucher_value / 100;
                                    }
                                }else if(msg.result.response.voucher_type == 'amount'){
                                    discount_voucher['discount'] = msg.result.response.voucher_value;
                                }
                                discount_voucher['currency'] = msg.result.response.voucher_currency;
                                if(discount_voucher['discount'] > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
                                    discount_voucher['discount'] = msg.result.response.voucher_cap
                            }
                        }

                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Expected discount `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','airline');
                        }catch(err){}
                    }else if(provider_type_id == 'activity'){
                        //console.log(grand_total)
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        if(grand_total > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                            for(i in msg.result.response.provider){
                                if(msg.result.response.provider[i].able_to_use == true){
                                    if(msg.result.response.voucher_type == 'percent'){
                                        discount_voucher['discount'] += grand_total * msg.result.response.voucher_value / 100;

                                    }else if(msg.result.response.voucher_type == 'amount'){
                                        discount_voucher['discount'] += msg.result.response.voucher_value;
                                    }
                                }
                            }
                            discount_voucher['currency'] = msg.result.response.voucher_currency;
                            if(discount_voucher['discount'] > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
                                discount_voucher['discount'] = msg.result.response.voucher_cap
                        }

                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Expected discount `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','activity');
                        }catch(err){}
                    }else if(provider_type_id == 'tour'){
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        try{
                            for(i in airline_get_detail.result.response.provider_bookings){
                                if(total_price_provider[i].price > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                                    if(msg.result.response.provider[i].able_to_use == true){
                                        if(msg.result.response.voucher_type == 'percent'){
                                            discount_voucher['discount'] += total_price_provider[i].price * msg.result.response.voucher_value / 100;

                                        }else if(msg.result.response.voucher_type == 'amount'){
                                            discount_voucher['discount'] += msg.result.response.voucher_value;
                                        }
                                    }
                                }
                                discount_voucher['currency'] = msg.result.response.voucher_currency;
                                if(discount_voucher['discount'] > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
                                    discount_voucher['discount'] = msg.result.response.voucher_cap
                            }
                        }catch(err){
                            //review
                            if(grand_total > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                                if(msg.result.response.voucher_type == 'percent' ){
                                    discount_voucher['discount'] += grand_total * msg.result.response.voucher_value / 100;

                                }else if(msg.result.response.voucher_type == 'amount'){
                                    discount_voucher['discount'] = msg.result.response.voucher_value;
                                }
                                discount_voucher['currency'] = msg.result.response.voucher_currency;
                                if(discount_voucher['discount'] > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
                                    discount_voucher['discount'] = msg.result.response.voucher_cap
                            }
                        }

                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Expected discount `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','tour');
                        }catch(err){}
                    }else if(provider_type_id == 'hotel'){
                        console.log(grand_total)
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        if(hotel_pick_provider.price_total > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                            for(i in msg.result.response.provider){
                                if(msg.result.response.provider[i].able_to_use == true){
                                    if(msg.result.response.voucher_type == 'percent'){
                                        discount_voucher['discount'] += hotel_pick_provider.price_total * msg.result.response.voucher_value / 100;

                                    }else if(msg.result.response.voucher_type == 'amount'){
                                        discount_voucher['discount'] += msg.result.response.voucher_value;
                                    }
                                }
                            }
                            discount_voucher['currency'] = msg.result.response.voucher_currency;
                            if(discount_voucher['discount'] > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
                                discount_voucher['discount'] = msg.result.response.voucher_cap
                        }

                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Expected discount `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','hotel');
                        }catch(err){}
                    }else if(provider_type_id == 'train'){
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        for(i in train_get_detail.result.response.provider_bookings){
                            if(total_price_provider[i].price > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                                if(msg.result.response.provider[i].able_to_use == true){
                                    if(msg.result.response.voucher_type == 'percent'){
                                        discount_voucher['discount'] += total_price_provider[i].price * msg.result.response.voucher_value / 100;

                                    }else if(msg.result.response.voucher_type == 'amount'){
                                        discount_voucher['discount'] += msg.result.response.voucher_value;
                                    }
                                }
                            }
                        }
                        if(discount_voucher['discount'] > msg.result.response.voucher_cap && msg.result.response.voucher_cap != false)
                            discount_voucher['discount'] = msg.result.response.voucher_cap
                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Expected discount `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','train');
                        }catch(err){}
                    }
                }else{
                    document.getElementById('voucher_discount').innerHTML = `
                    <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                        <div class="alert alert-danger" role="alert">
                            <h6>Sorry, Voucher can't be use</h6>
                        </div>
                        <button class="primary-btn issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                            Change Voucher Code
                        </button>
                    </div>`;
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
