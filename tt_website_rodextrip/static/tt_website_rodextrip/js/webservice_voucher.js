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

function render_voucher(currency, discount,state='booked'){
    text_voucher = `
    <div style="background-color: white; padding: 10px; border: 1px solid rgb(241, 90, 34); margin-top: 15px; position: relative; z-index: 5;"><h4 style="color:#f15a22;">Voucher</h4><hr>
        <div class="alert alert-success" role="alert">
            <h6>Discount `;
            if(state == 'booked')
                text_voucher+=`up to `;
            text_voucher+=currency+` `+getrupiah(discount)+`</h6>
        </div>`;
    if(state == 'booked'){
        text_voucher+=`
        <button class="primary-btn-ticket issued_booking_btn" type="button" style="width:100%; margin-top:15px;" onclick="use_voucher();">
            Change Voucher Code
        </button>
        <h6><span style="color:red">* </span>This will be use if you issued</h6>`;
    }
    text_voucher +=`
    </div>`;
    document.getElementById('voucher_discount').innerHTML = text_voucher;
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
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'passport'){
            try{
                for(i in passport.list_of_passport){
                    if(provider_id.includes(passport.list_of_passport[i].provider) == false)
                        provider_id.push(passport.list_of_passport[i].provider);
                }
                order_number = passport.journey.name;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'ppob'){
            try{
                for(i in bills_get_detail.result.response.provider_booking){
                    provider_id.push(bills_get_detail.result.response.provider_booking[i].provider)
                }
                order_number = bills_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
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
                if(price_itinerary.hasOwnProperty('price_itinerary_provider'))
                    for(i in price_itinerary.price_itinerary_provider)
                        provider_id.push(price_itinerary.price_itinerary_provider[i].provider)
                else if(price_itinerary.hasOwnProperty('sell_journey_provider'))
                    for(i in price_itinerary.sell_journey_provider)
                        provider_id.push(price_itinerary.sell_journey_provider[i].provider)
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
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'train'){
            try{
                for(i in train_get_detail.result.response.provider_bookings){
                    provider_id.push(train_get_detail.result.response.provider_bookings[i].provider)
                }
            }catch(err){
                for(i in train_data){
                    provider_id.push(train_data[i].provider);
                }
            }
            try{
                order_number = train_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'activity'){
            try{
                provider_id.push(response.provider)
            }catch(err){
//                console.log(act_get_booking.result.response.provider);
                for(idx in act_get_booking.result.response.provider_booking){
                    provider_id.push(act_get_booking.result.response.provider_booking[idx].provider);
                }
            }
            try{
                order_number = act_get_booking.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'tour'){
            try{
                provider_id.push(provider);
            }catch(err){
                for(idx in tr_get_booking.result.response.provider_booking){
                    provider_id.push(tr_get_booking.result.response.provider_booking[idx].provider);
                }
            }
            try{
                order_number = tr_get_booking.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            //pending RESPONSE BELOM FIX
//            console.log(price_data);
//            console.log(grand_total);
        }else if(provider_type_id == 'hotel'){
            provider_id.push(hotel_price.provider);
            try{
                order_number = hotel_get_detail.result.response.booking_name;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'event'){
            provider_id.push('event_internal');
            try{
                order_number = event_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'bus'){
            for(idx in bus_get_detail.result.response.provider_bookings){
                provider_id.push(bus_get_detail.result.response.provider_bookings[idx].provider);
            }
            try{
                order_number = bus_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'medical' || provider_type_id == 'phc' || provider_type_id == 'periksain'){
            for(idx in medical_get_detail.result.response.provider_bookings){
                provider_id.push(medical_get_detail.result.response.provider_bookings[idx].provider);
            }
            provider_type_id = medical_get_detail.result.response.provider_type;
            try{
                order_number = medical_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'medical_global'){
            for(idx in medical_get_detail.result.response.provider_bookings){
                provider_id.push(medical_get_detail.result.response.provider_bookings[idx].provider);
            }
            provider_type_id = medical_get_detail.result.response.provider_type;
            try{
                order_number = medical_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'swab_express'){
            for(idx in medical_get_detail.result.response.provider_bookings){
                provider_id.push(medical_get_detail.result.response.provider_bookings[idx].provider);
            }
            provider_type_id = medical_get_detail.result.response.provider_type;
            try{
                order_number = medical_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'lab_pintar'){
            for(idx in medical_get_detail.result.response.provider_bookings){
                provider_id.push(medical_get_detail.result.response.provider_bookings[idx].provider);
            }
            provider_type_id = medical_get_detail.result.response.provider_type;
            try{
                order_number = medical_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'mitra_keluarga'){
            for(idx in medical_get_detail.result.response.provider_bookings){
                provider_id.push(medical_get_detail.result.response.provider_bookings[idx].provider);
            }
            provider_type_id = medical_get_detail.result.response.provider_type;
            try{
                order_number = medical_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'sentra_medika'){
            for(idx in medical_get_detail.result.response.provider_bookings){
                provider_id.push(medical_get_detail.result.response.provider_bookings[idx].provider);
            }
            provider_type_id = medical_get_detail.result.response.provider_type;
            try{
                order_number = medical_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'insurance'){
            for(idx in insurance_get_detail.result.response.provider_bookings){
                provider_id.push(insurance_get_detail.result.response.provider_bookings[idx].provider);
            }
            try{
                order_number = insurance_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'issued_offline'){
            provider_type_id = 'offline';
            try{
                order_number = offline_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }else if(provider_type_id == 'group_booking'){
            for(idx in group_booking_get_detail.result.response.provider_bookings){
                provider_id.push(group_booking_get_detail.result.response.provider_bookings[idx].provider);
            }
            provider_type_id = 'groupbooking';
            try{
                order_number = group_booking_get_detail.result.response.order_number;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
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
                    if(window.location.href.includes('booking') == false){
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
                        }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                        }
                    }else{
                        if(provider_type_id == 'activity')
                            activity_get_booking(act_order_number)
                        else if(provider_type_id == 'airline')
                            airline_get_booking(order_number)
                        else if(provider_type_id == 'bus')
                            bus_get_booking(order_number)
                        else if(provider_type_id == 'event')
                            event_get_booking(order_number)
                        else if(provider_type_id == 'groupbooking')
                            group_booking_get_booking(order_number)
                        else if(provider_type_id == 'hotel')
                            hotel_get_booking(order_number)
                        else if(provider_type_id == 'insurance')
                            insurance_get_booking(order_number)
                        else if(provider_type_id == 'offline')
                            get_booking_offline(order_number)
                        else if(provider_type_id == 'labpintar')
                            lab_pintar_get_booking(order_number)
                        else if(provider_type_id == 'phc' || provider_type_id == 'periksain')
                            medical_get_booking(order_number)
                        else if(provider_type_id == 'medical')
                            medical_global_get_booking(order_number)
                        else if(provider_type_id == 'mitrakeluarga')
                            mitra_keluarga_get_booking(order_number)
                        else if(provider_type_id == 'passport')
                            passport_get_data(order_number)
                        else if(provider_type_id == 'sentramedika')
                            sentra_medika_get_booking(order_number)
                        else if(provider_type_id == 'swabexpress')
                            swab_express_get_booking(order_number)
                        else if(provider_type_id == 'tour')
                            tour_get_booking(tour_order_number)
                        else if(provider_type_id == 'train')
                            train_get_booking(order_number)
                        else if(provider_type_id == 'visa')
                            visa_get_data(order_number)
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
