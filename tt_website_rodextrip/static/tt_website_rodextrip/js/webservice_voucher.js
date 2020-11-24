discount_voucher = {};
voucher_code = '';
total_price_provider = [];
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error voucher signin');
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error set voucher');
       },timeout: 60000
    });
}

function check_voucher(){
    if(document.getElementById('voucher_code').value != ''){
        provider_type_id = window.location.href.split('/')[window.location.href.split('/').length-2 + 5 - window.location.href.split('/').length];
        provider_id = [];
        passenger_list = [];
        order_number = '';
        if(provider_type_id == 'visa'){
            try{
                for(i in visa.list_of_visa){
                    if(provider_id.includes(visa.list_of_visa[i].provider) == false)
                        provider_id.push(visa.list_of_visa[i].provider);
                }
                order_number = visa.journey.name;
            }catch(err){}
        }else if(provider_type_id == 'passport'){
            try{
                for(i in passport.list_of_passport){
                    if(provider_id.includes(passport.list_of_passport[i].provider) == false)
                        provider_id.push(passport.list_of_passport[i].provider);
                }
                order_number = passport.journey.name;
            }catch(err){}
        }else if(provider_type_id == 'ppob'){
            try{
                for(i in bills_get_detail.result.response.provider_booking){
                    provider_id.push(bills_get_detail.result.response.provider_booking[i].provider)
                }
                order_number = bills_get_detail.result.response.order_number;
            }catch(err){}
        }else if(provider_type_id == 'airline'){
            try{
                //booking
                for(i in airline_get_detail.result.response.provider_bookings){
                    provider_id.push(airline_get_detail.result.response.provider_bookings[i].provider)
                }
                for(i in airline_get_detail.result.response.passengers){
                    passenger_list.push({
                        'first_name': airline_get_detail.result.response.passengers[i].first_name,
                        'last_name': airline_get_detail.result.response.passengers[i].last_name
                    })
                }

            }catch(err){
                //review
                for(i in price_itinerary.price_itinerary_provider)
                    provider_id.push(price_itinerary.price_itinerary_provider[i].provider)
                for(i in passengers){
                    if(i == 'adult' || i == 'child' || i == 'infant'){
                        for(j in passengers[i]){
                            passenger_list.push({
                                'first_name': passengers[i][j].first_name,
                                'last_name': passengers[i][j].last_name
                            })
                        }
                    }
                }
            }
            try{
                order_number = airline_get_detail.result.response.order_number;
            }catch(err){}
        }else if(provider_type_id == 'train'){
            provider_id = ['kai'];
            try{
                order_number = train_get_detail.result.response.order_number;
            }catch(err){}
        }else if(provider_type_id == 'activity'){
            try{
                provider_id.push(response.provider)
            }catch(err){
//                console.log(act_get_booking.result.response.provider);
                provider_id.push(act_get_booking.result.response.provider);
            }
            try{
                order_number = act_get_booking.result.response.order_number;
            }catch(err){}
        }else if(provider_type_id == 'tour'){
            try{
                provider_id.push(provider);
            }catch(err){
                provider_id.push(tr_get_booking.result.response.provider);
            }
            try{
                order_number = tr_get_booking.result.response.order_number;
            }catch(err){}
            //pending RESPONSE BELOM FIX
//            console.log(price_data);
//            console.log(grand_total);
        }else if(provider_type_id == 'hotel'){
            provider_id.push(hotel_price.provider);
            try{
                order_number = hotel_get_detail.result.response.booking_name;
            }catch(err){}
        }else if(provider_type_id == 'event'){
            provider_id.push('event_internal');
            try{
                order_number = hotel_get_detail.result.response.booking_name;
            }catch(err){}
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
                'voucher_reference': voucher_reference,
                'order_number': order_number,
                'passengers': JSON.stringify(passenger_list)
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
                            for(i in msg.result.response.provider){
                                if(msg.result.response.provider[i].able_to_use == true){
                                    if(msg.result.response.voucher_type == 'percent'){
                                        discount_voucher['discount'] += price * msg.result.response.voucher_value / 100;

                                    }else if(msg.result.response.voucher_type == 'amount'){
                                        if(price > msg.result.response.voucher_value)
                                            discount_voucher['discount'] += msg.result.response.voucher_value;
                                        else
                                            discount_voucher['discount'] += price;
                                    }
                                }
                            }
                            discount_voucher['currency'] = msg.result.response.voucher_currency;
                            if(msg.result.response.voucher_cap != false && discount_voucher['discount'] > msg.result.response.voucher_cap)
                                discount_voucher['discount'] = msg.result.response.voucher_cap
                        }

                        discount_voucher['currency'] = msg.result.response.voucher_currency;
                        if(msg.result.response.voucher_cap != false && discount > msg.result.response.voucher_cap)
                            discount = msg.result.response.voucher_cap


                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Discount up to `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn-ticket issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','visa');
                        }catch(err){}
                    }
                    else if(provider_type_id == 'passport'){
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        if(price > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                            for(i in msg.result.response.provider){
                                if(msg.result.response.provider[i].able_to_use == true){
                                    if(msg.result.response.voucher_type == 'percent'){
                                        discount_voucher['discount'] += price * msg.result.response.voucher_value / 100;

                                    }else if(msg.result.response.voucher_type == 'amount'){
                                        if(price > msg.result.response.voucher_value)
                                            discount_voucher['discount'] += msg.result.response.voucher_value;
                                        else
                                            discount_voucher['discount'] += price;
                                    }
                                }
                            }
                            discount_voucher['currency'] = msg.result.response.voucher_currency;
                            if(msg.result.response.voucher_cap != false && discount_voucher['discount'] > msg.result.response.voucher_cap)
                                discount_voucher['discount'] = msg.result.response.voucher_cap
                        }

                        discount_voucher['currency'] = msg.result.response.voucher_currency;
                        if(msg.result.response.voucher_cap != false && discount > msg.result.response.voucher_cap)
                            discount = msg.result.response.voucher_cap


                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Discount up to `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn-ticket issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','visa');
                        }catch(err){}
                    }
                    else if(provider_type_id == 'event'){
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        try{
                            if(event_get_detail.result.response.total_price > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                                if(msg.result.response.provider[i].able_to_use == true){
                                    if(msg.result.response.voucher_type == 'percent'){
                                        discount_voucher['discount'] += event_get_detail.result.response.total_price * msg.result.response.voucher_value / 100;

                                    }else if(msg.result.response.voucher_type == 'amount'){
                                        if(total_price > msg.result.response.voucher_value)
                                            discount_voucher['discount'] += msg.result.response.voucher_value;
                                        else
                                            discount_voucher['discount'] += event_get_detail.result.response.total_price;
                                    }
                                }
                            }
                            discount_voucher['currency'] = msg.result.response.voucher_currency;
                            if(msg.result.response.voucher_cap != false && discount_voucher['discount'] > msg.result.response.voucher_cap)
                                discount_voucher['discount'] = msg.result.response.voucher_cap
                        }catch(err){
                            if(grand_total_option > msg.result.response.voucher_minimum_purchase || msg.result.response.voucher_minimum_purchase == false){
                                if(msg.result.response.voucher_type == 'percent' ){
                                    discount_voucher['discount'] += grand_total_option * msg.result.response.voucher_value / 100;
                                }else if(msg.result.response.voucher_type == 'amount'){
                                    if(grand_total_option > msg.result.response.voucher_value)
                                        discount_voucher['discount'] = msg.result.response.voucher_value;
                                    else
                                        discount_voucher['discount'] = grand_total_option;
                                }
                                discount_voucher['currency'] = msg.result.response.voucher_currency;
                                if(msg.result.response.voucher_cap != false && discount_voucher['discount'] > msg.result.response.voucher_cap)
                                    discount_voucher['discount'] = msg.result.response.voucher_cap
                            }
                        }

                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Discount up to `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn-ticket issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            set_price('Issued','event');
                        }catch(err){}
                    }
                    else{
                        discount_voucher = {
                            'discount': 0,
                            'currency': ''
                        };
                        for(i in msg.result.response.provider){
                            if(msg.result.response.provider[i].able_to_use == true){
                                total_price_discount = 0;
                                disc = 0;
                                if(msg.result.response.voucher_type == 'percent' ){
                                    if(msg.result.response.voucher_effect_all){
                                        for(j in total_price_provider){
                                            if(msg.result.response.provider[i].provider == total_price_provider[j].provider){
                                                for(k in total_price_provider[j].price){
                                                    if(k != 'currency' && k != 'RAC' && k != 'rac' && k != 'CSC' && k != 'csc'){
                                                        disc += total_price_provider[j].price[k] * msg.result.response.voucher_value / 100;
                                                        total_price_discount += total_price_provider[j].price[k];
                                                    }
                                                }
                                            }
                                        }
                                    }else{
                                        for(j in total_price_provider){
                                            if(msg.result.response.provider[i].provider == total_price_provider[j].provider){
                                                for(k in total_price_provider[j].price){
                                                    if(k == 'fare' || k == 'FARE'){
                                                        disc += total_price_provider[j].price[k] * msg.result.response.voucher_value / 100;
                                                    }
                                                    if(k != 'currency' && k != 'RAC' && k != 'rac' && k != 'CSC' && k != 'csc'){
                                                        total_price_discount += total_price_provider[j].price[k];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }else if(msg.result.response.voucher_type == 'amount'){
                                    if(msg.result.response.voucher_effect_all){
                                        for(j in total_price_provider){
                                            if(msg.result.response.provider[i].provider == total_price_provider[j].provider){
                                                for(k in total_price_provider[j].price){
                                                    if(k != 'currency' && k != 'RAC' && k != 'rac' && k != 'CSC' && k != 'csc'){
                                                        disc += total_price_provider[j].price[k];
                                                        total_price_discount += total_price_provider[j].price[k];
                                                    }
                                                }
                                            }
                                        }
                                    }else{
                                        for(j in total_price_provider){
                                            if(msg.result.response.provider[i].provider == total_price_provider[j].provider){
                                                for(k in total_price_provider[j].price){
                                                    if(k == 'fare' || k == 'FARE'){
                                                        disc += total_price_provider[j].price[k];
                                                    }
                                                    if(k != 'currency' && k != 'RAC' && k != 'rac' && k != 'CSC' && k != 'csc'){
                                                        total_price_discount += total_price_provider[j].price[k];
                                                    }
                                                }
                                            }
                                        }
                                    }

                                }
                                if(msg.result.response.voucher_minimum_purchase == false || total_price_discount > msg.result.response.voucher_minimum_purchase)
                                    discount_voucher['discount'] = disc
                                if(discount_voucher['discount'] > msg.result.response.voucher_value && msg.result.response.voucher_type == 'amount')
                                    discount_voucher['discount'] = msg.result.response.voucher_value;
                                discount_voucher['currency'] = msg.result.response.voucher_currency;

                            }
                        }
                        if(msg.result.response.voucher_cap != false && discount_voucher['discount'] > msg.result.response.voucher_cap)
                            discount_voucher['discount'] = msg.result.response.voucher_cap

                        document.getElementById('voucher_discount').innerHTML = `
                        <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                            <div class="alert alert-success" role="alert">
                                <h6>Discount up to `+msg.result.response.voucher_currency+` `+getrupiah(discount_voucher['discount'])+`</h6>
                            </div>
                            <button class="primary-btn-ticket issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                                Change Voucher Code
                            </button>
                            <h6><span style="color:red">* </span>This will be use if you issued</h6>
                        </div>`;
                        try{
                            if(provider_type_id == 'ppob')
                                set_price('Issued','ppob');
                            else if(provider_type_id == 'airline')
                                set_price('Issued','airline');
                            else if(provider_type_id == 'activity')
                                set_price('Issued','activity');
                            else if(provider_type_id == 'tour')
                                set_price('Issued','tour');
                            else if(provider_type_id == 'train')
                                set_price('Issued','train');
                            else if(provider_type_id == 'hotel')
                                set_price('Issued','hotel');
                        }catch(err){}
                    }
                }else{
                    discount_voucher = {};
                    document.getElementById('voucher_discount').innerHTML = `
                    <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
                        <div class="alert alert-danger" role="alert">
                            <h6>Sorry, Voucher can't be used</h6>
                        </div>
                        <button class="primary-btn-ticket issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
                            Change Voucher Code
                        </button>
                    </div>`;
                }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error check voucher');
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
