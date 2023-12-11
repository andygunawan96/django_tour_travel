var tour_data = [];
tour_carrier_data = {
    'adult_length_name': 60,
    'child_length_name': 60,
    'infant_length_name': 60
};
offset = 0;
high_price_slider = 0;
low_price_slider = 99999999;
step_slider = 0;
last_session = '';

function tour_redirect_signup(type){
    if(type != 'signin'){
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
           url: "/webservice/tour",
           headers:{
                'action': 'signin',
           },
           data: data_send,
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    tour_signature = msg.result.response.signature;
                    new_login_signature = msg.result.response.signature;
                    $('#myModalSignin').modal('hide');
                    window.location.href = '/';
//                    if(type != 'search'){
//                        $.ajax({
//                           type: "POST",
//                           url: "/webservice/tour",
//                           headers:{
//                                'action': 'search',
//                           },
//                           data: {
//                               'use_cache': true,
//                               'signature': new_login_signature
//                           },
//                           success: function(msg) {
//                               if(msg.result.error_code == 0){
//                                    if(type != 'get_details'){
//                                        $.ajax({
//                                           type: "POST",
//                                           url: "/webservice/tour",
//                                           headers:{
//                                                'action': 'get_details',
//                                           },
//                                           data: {
//                                              'use_cache': true,
//                                              'signature': new_login_signature,
//                                           },
//                                           success: function(msg) {
//                                                if(msg.result.error_code == 0 && type != 'get_pricing'){
//                                                    $.ajax({
//                                                       type: "POST",
//                                                       url: "/webservice/tour",
//                                                       headers:{
//                                                            'action': 'get_pricing',
//                                                       },
//                                                       data: {
//                                                            'use_cache': true,
//                                                            'signature': new_login_signature
//                                                       },
//                                                       success: function(msg) {
//                                                            if(type != 'sell_journeys' && msg.result.error_code == 0){
//
//                                                            }else{
//                                                                signature = new_login_signature;
//                                                                $('#myModalSignin').modal('hide');
//                                                                location.reload();
//
//                                                            }
//                                                    },error: function(XMLHttpRequest, textStatus, errorThrown) {
//                                                       },timeout: 60000
//                                                    });
//                                                }else{
//                                                    signature = new_login_signature;
//                                                    $('#myModalSignin').modal('hide');
//                                                    location.reload();
//
//                                                }
//                                           },
//                                           error: function(XMLHttpRequest, textStatus, errorThrown) {
//                                           },timeout: 120000
//                                        });
//                                    }else{
//                                        signature = new_login_signature;
//                                        $('#myModalSignin').modal('hide');
//                                        location.reload();
//                                    }
//                               }
//                           },
//                           error: function(XMLHttpRequest, textStatus, errorThrown) {
//                           },timeout: 120000 // sets timeout to 120 seconds
//                        });
//                    }else{
//                        signature = new_login_signature;
//                        $('#myModalSignin').modal('hide');
//                        location.reload();
//                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                }
           }catch(err){
               console.log(err)
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
              error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline signin');
              $("#barFlightSearch").hide();
              $("#waitFlightSearch").hide();
              $('.loader-rodextrip').fadeOut();
              try{
                $("#show_loading_booking_airline").hide();
              }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
              }
           },timeout: 60000
        });
    }
}

function tour_login(data, type=''){
    //document.getElementById('activity_category').value.split(' - ')[1]
    if(typeof(frontend_signature) === 'undefined')
        frontend_signature = '';
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
        "timezone": timezone,
        "frontend_signature": frontend_signature
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'signin',
       },
       data: data_send,
       success: function(msg) {
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
                get_agent_currency_rate();
                get_carriers_tour();
                if(type == '' || data == ''){
                    tour_search();
                }else if(type == 'get_booking'){
                    tour_get_booking(data);
                }else if(type == 'get_details'){
                    tour_get_details(data);
                }else if(type == 'get_details_by_slug'){
                    tour_get_details_by_slug(data);
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
            }else{
                Swal.fire({
                    type: 'error',
                    title: 'Oops!',
                    html: msg.result.error_msg,
                })
                try{
                    $('#loading-search-tour').hide();
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour login');
            try{
                $('#loading-search-tour').hide();
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
       },timeout: 60000
    });
}

function tour_page_search(){
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'page_search',
       },
       data: {
            'signature': signature,
            'frontend_signature': frontend_signature
       },
       success: function(msg) {
            tour_request = msg.tour_request;
            tour_login('');
            get_dept_year();
            get_tour_auto_complete('search');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour page search');
       },timeout: 300000
    });
}

function tour_page_review(){
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'page_review',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            all_pax = msg.all_pax;

            booker = msg.booker;
            upsell_price_dict = msg.upsell_price_dict;
            get_price_itinerary_cache('review');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error get data review page tour')
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get data swab express');
       },timeout: 300000
    });
}

function get_carriers_tour(){
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           tour_carriers = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_tour_auto_complete(type){
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_auto_complete_sync',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            get_tour_config(type);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error tour config')
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour config');
       },timeout: 60000
    });
}

function get_tour_config(type, val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_data',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            tour_country = [];
            sub_category = {};
            var tour_search_template = msg.tour_search_template;
            var country_selection = document.getElementById('tour_countries');
            tour_type_list = [{
                value:'All',
                real_val: 'all',
                status: true
            }]
            for (rec_type in msg.tour_types){
                tour_type_list.push({
                    value: msg.tour_types[rec_type].name,
                    real_val: msg.tour_types[rec_type].seq_id,
                    status: false
                })
            }

            for(i in msg.tour_countries){
                var city = [];
                for(j in msg.tour_countries[i].states)
                {
                    for(k in msg.tour_countries[i].states[j].cities)
                    {
                        city.push({
                            'name': msg.tour_countries[i].states[j].cities[k].name,
                            'id': msg.tour_countries[i].states[j].cities[k].uuid
                        });
                    }
                }
                tour_country.push({
                    'city': city,
                    'name': msg.tour_countries[i].name,
                    'code': msg.tour_countries[i].code,
                    'id': msg.tour_countries[i].uuid,
                    'image': msg.tour_countries[i].image
                });
            }

            //add template
            country_txt = '';
            if(type == 'search')
            {
                if (dest_country == 0)
                {
                    country_txt += `<option value="0" selected="">All Countries</option>`;
                }
                else
                {
                    country_txt += `<option value="0">All Countries</option>`;
                }
                for(i in tour_country)
                {
                    if (tour_country[i].id == dest_country)
                    {
                        country_txt += `<option value="`+tour_country[i].id+`" selected>`+tour_country[i].name+`</option>`;
                        document.getElementById('search_country_name').innerHTML = tour_country[i].name;
                    }
                    else
                    {
                        country_txt += `<option value="`+tour_country[i].id+`">`+tour_country[i].name+`</option>`;
                    }
                }
            }
            else
            {
                if(tour_search_template == 'country_search')
                {
                    country_txt += `<div class="row">`;
                    for(i in tour_country){
//                        country_txt += `
//                        <label class="radio-img" style="margin-bottom:15px; margin-right:15px; border: 2px solid #cdcdcd; height:130px; width:190px; background: linear-gradient(0deg, rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.1)),url('`+tour_country[i].image+`') !important; background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;">
//                            <input type="radio" name="tour_countries" value="`+tour_country[i].id+`">
//                            <span style="display:inline-flex; float:left; padding-top:10px; padding-left:10px; font-size:18px; color:`+text_color+`; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">`+tour_country[i].name+`</span>
//                        </label>`;
//                          country_txt += `
//                          <label class="radio-img" style="margin-bottom:15px; margin-right:15px; border: 2px solid #cdcdcd; height:130px; width:190px; background: linear-gradient(0deg, rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.1)) !important; background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;">
//                              <input type="radio" name="tour_countries" value="`+tour_country[i].id+`">
//                              <span style="display:inline-flex; margin-top: 30%; font-size:18px; color:`+text_color+`; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">`+tour_country[i].name+`</span>
//                          </label>`;
                          if(template == 3 || template == 7){
                            country_txt += `<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12" title="`+tour_country[i].name+`">`;
                          }else{
                            country_txt += `<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" title="`+tour_country[i].name+`">`;
                          }
                          country_txt += `
                              <label class="radio-img search_country_tour" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;max-width: 100%;">
                                  <input type="radio" name="tour_countries" value="`+tour_country[i].id+`">
                                  <span><i class="fas fa-map-marker-alt"></i> `+tour_country[i].name+`</span>
                              </label>
                          </div>`;
                    }
                    country_txt += `</div>`;
                }
                else
                {
                    country_txt += `<option value="0" selected="">All Countries</option>`;
                    for(i in tour_country)
                    {
                        country_txt += `<option value="`+tour_country[i].id+`">`+tour_country[i].name+`</option>`;
                    }
                }
            }

            country_selection.innerHTML = country_txt;

            if(tour_search_template == 'country_search')
            {
                $('input[type=radio][name=tour_countries]').on('change', function() {
                    $('#tour_search_form').submit();
                });
            }
            else
            {
                if(template == 1 || template == 2 || template == 5){
                    $('#tour_countries').niceSelect('update');
                }
                country_selection.setAttribute("onchange", "auto_complete_tour('tour_countries');");
            }

            if(type == 'search')
            {
                if (dest_country)
                {
                    auto_complete_tour('tour_countries', dest_city);
                    tour_get_city_search_name(dest_city);
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour get data');
       },timeout: 60000
    });
}

function tour_search(){
    if (offset > 0)
    {
        offset++;
    }
    get_new = false;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'search',
       },
       data: {
           'signature': signature,
           'search_request': JSON.stringify(tour_request)
       },
       success: function(msg) {
        if(google_analytics != '')
            gtag('event', 'tour_search', {});
           var text = '';
           var counter = 0;
           data=[]
           if(msg.result.error_code == 0){
               tour_data = msg.result.response.result;
               $('#loading-search-tour').hide();
               for(i in tour_data){
                   if(high_price_slider < tour_data[i].est_starting_price){
                        high_price_slider = tour_data[i].est_starting_price;
                   }

                   if(low_price_slider > tour_data[i].est_starting_price){
                        low_price_slider = tour_data[i].est_starting_price;
                   }
               }
               if(high_price_slider <= 1000000){
                step_slider = 50000;
               }
               else if(high_price_slider > 1000000 && high_price_slider <= 10000000 ){
                step_slider = 100000;
               }
               else{
                step_slider = 200000;
               }
               document.getElementById("price-from").value = low_price_slider;
               document.getElementById("price-to").value = high_price_slider;
               document.getElementById("price-from2").value = low_price_slider;
               document.getElementById("price-to2").value = high_price_slider;
               $minPrice = low_price_slider;
               $maxPrice = high_price_slider;
               filtering('sort',1);
               $(".js-range-slider").data("ionRangeSlider").update({
                    from: low_price_slider,
                    to: high_price_slider,
                    min: low_price_slider,
                    max: high_price_slider,
                    step: step_slider
               });
               $(".js-range-slider").data("ionRangeSlider").reset();

               $(".js-range-slider2").data("ionRangeSlider").update({
                    from: low_price_slider,
                    to: high_price_slider,
                    min: low_price_slider,
                    max: high_price_slider,
                    step: step_slider
               });
               $(".js-range-slider2").data("ionRangeSlider").reset();

               offset++;
               document.getElementById('tour_ticket').innerHTML += text;

               document.getElementById("tour_result").innerHTML = '';
               text = '';
               var node = document.createElement("div");
               text+=`
               <div style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px;">
                   <span style="font-weight:bold; font-size:14px;"> Tour - `+tour_data.length+` results</span>
               </div>`;
               node.innerHTML = text;
               document.getElementById("tour_result").appendChild(node);
               node = document.createElement("div");

               for(i in tour_data){
                   content_pop_date = '';
                   content_pop_question = '';
                   title_pop_date = '';
                   content_pop_question+=`<b>`+tour_data[i].tour_type.name+`: </b>`+tour_data[i].tour_type.description;

                    new jBox('Tooltip', {
                        attach: '#pop_question'+i,
                        width: 280,
                        closeOnMouseleave: true,
                        animation: 'zoomIn',
                        content: content_pop_question
                    });

                    if(tour_data[i].tour_line_amount != 0){
                        for (j in tour_data[i].tour_lines){
                            sch_count = parseInt(j)+1;
                            if(!tour_data[i].tour_type.is_open_date){
                                content_pop_date += `<h6>Schedule - `+sch_count+`</h6>`;
                                title_pop_date += 'Available Date';
                            }else{
                                content_pop_date += `<h6>Period - `+sch_count+`</h6>`;
                                title_pop_date += 'Period Date';
                            }
                            content_pop_date += `<span>`+tour_data[i].tour_lines[j].departure_date_str+` - `+tour_data[i].tour_lines[j].arrival_date_str+`</span><hr/>`;
                        }

                        new jBox('Tooltip', {
                            attach: '#pop_date'+i,
                            target: '#pop_date'+i,
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
                            content: content_pop_date,
                            onOpen: function () {
                              this.source.addClass('active').html('Close');
                            },
                            onClose: function () {
                              this.source.removeClass('active').html('See Date');
                            }
                        });
                    }
               }

               if(msg.result.response.length != 0)
                   get_new = true;
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error tour search </span>' + msg.result.error_msg,
                })
            //error
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour search');
       },timeout: 60000
    });
}

function tour_get_details(tour_code){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_details',
       },
       data: {
           'tour_code': tour_code,
           'signature': signature
       },
       success: function(msg) {
           var prod_date_text = '';
           var country_text = '';
           var print_doc_text = '';
           var image_text = '';
           var itinerary_text = '';
           var flight_details_text = '';
           var other_info_text = '';
           var room_list_text = '';
           var date_list_text = '';
           var counter = 0;
           var index = 0;
           var total_additional_price = 0;
           var total_additional_amount = 0;
           data=[]
           if(msg.result.error_code == 0){
               tour_data = msg.result.response.selected_tour;
               content_pop_question = '';
                if (selected_tour_date)
                {
                    prod_date_text += selected_tour_date;
                }
                country_text += `
                <div style="display:flex; margin-top:4px; margin-bottom:4px;">
                    <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                    if(tour_data.tour_type.is_open_date){
                        country_text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_data.tour_type_str+`</span>`;
                    }else{
                        country_text+=tour_data.tour_type_str;
                    }

                content_pop_question+=`<b>`+tour_data.tour_type.name+`: </b>`+tour_data.tour_type.description;

                country_text+=`
                    </div>
                    <span id="pop_question" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>`;
                    if (tour_data.duration)
                    {
                        country_text += `<span> | <i class="fa fa-clock-o" aria-hidden="true"></i> ` + tour_data.duration + ` Days</span>`;
                    }
                country_text+=`</div>`;
                country_text += `<span> <i class="fa fa-map-marker-alt" aria-hidden="true"></i>`;
                for (j in tour_data.country_names)
                {
                    country_text += ` ` + tour_data.country_names[j];
                    if(j != tour_data.country_names.length-1){
                        country_text += ` |`;
                    }
                }
                country_text += `</span>`;

                country_text += `<div style="background:#dbdbdb; margin-bottom:5px; margin-top:5px; padding:10px;"><span><i class="fa fa-tag" aria-hidden="true"></i> Starting From `+tour_data.currency_code+` <b style="color:`+color+`; font-size:14px;"> ` + getrupiah(tour_data.est_starting_price) + `</b></span>`;
                if (tour_data.child_sale_price > 0)
                {
                    country_text += `<span> | Child `+tour_data.currency_code+` <b style="color:`+color+`; font-size:14px;"> ` + getrupiah(tour_data.child_sale_price) + `</b></span>`;
                }
                if (tour_data.infant_sale_price > 0)
                {
                    country_text += `<span> | Infant `+tour_data.currency_code+` <b style="color:`+color+`; font-size:14px;">` + getrupiah(tour_data.infant_sale_price) + `</b></span>`;
                }

                country_text += `</div>`;

                if (tour_data.description)
                {
                    country_text += `<div style="max-height:100px; overflow:auto; padding:15px; margin-top:10px;margin-bottom:5px; border:1px solid #cdcdcd;"><span style="font-weight:600;">Description</span><br/>`;
                    country_text += `<span>`+tour_data.description+`</span></div>`;
                }else{
                    country_text += ``;
                }
                country_text += `<span><i class="fa fa-hotel" aria-hidden="true"></i> Accommodation(s) :</span>`;
                idx = 1
                for (k in tour_data.hotel_names)
                {
                    country_text += `<br/><span>` + String(idx) + `. ` + tour_data.hotel_names[k] + `</span>`;
                    idx += 1;
                }
                if (tour_data.document_url)
                {
                    print_doc_text += `<div class="mb-3" style="text-align:right;">
                                         <button class="primary-btn btn-tour btn-chgsearch" style="border-radius:6px; border: 1px solid #ddd;" onclick="window.location.href='`+tour_data.document_url+`'" target="_blank">
                                             <i class="fa fa-print" aria-hidden="true"></i> Download Document
                                         </button>
                                     </div>`;
                }

                image_text += `<div class="owl-carousel-tour-img owl-theme">`;
                for (j in tour_data.images_obj)
                {
                    image_text +=`
                    <div class="item" style="float:none; height:360px; display: flex; justify-content: center; align-items: center;">
                        <div class="single-destination relative">
                            <div class="thumb relative">
                                <img class="img-fluid zoom-img" src="`+tour_data.images_obj[j].url+`" alt="Tour">
                            </div>
                        </div>
                    </div>`;
                }
                if (tour_data.images_obj.length == 0)
                {
                    image_text += `
                    <div class="item" style="float:none; height:360px; display: flex; justify-content: center; align-items: center;">
                        <div class="single-destination relative">
                            <div class="thumb relative">
                                <img class="img-fluid zoom-img" src="`+static_path_url_server+`/public/tour_packages/not_found.png" alt="Not Found Tour">
                            </div>
                        </div>
                    </div>`;
                }
                image_text += `</div>`;

                itinerary_text += `<div class="row">`;
                for (it_idx in tour_data.itinerary_ids)
                {
                    itinerary_text += `
                    <div class="col-lg-12" style="margin-bottom:10px;">
                        <div class="row">
                            <div class="col-lg-12">
                                <h6 style="border:1px solid #cdcdcd; padding:10px; background:`+color+`; cursor:pointer; overflow-y: hidden; color:`+text_color+`" onclick="show_hide_itinerary_tour(`+it_idx+`)">
                                    Day `+tour_data.itinerary_ids[it_idx].day+`</span>`;
                                    if(tour_data.itinerary_ids[it_idx].name)
                                        itinerary_text+=` - `+tour_data.itinerary_ids[it_idx].name;
                                    itinerary_text += `
                                    <i class="fas fa-chevron-up" id="itinerary_day`+it_idx+`_down" style="float:right; color:`+text_color+`; display:none;"></i>
                                    <i class="fas fa-chevron-down" id="itinerary_day`+it_idx+`_up" style="float:right; color:`+text_color+`; display:inline-block;"></i>
                                </h6>
                            </div>
                            <div class="col-lg-12" style="display:block;" id="div_itinerary_day`+it_idx+`">
                                <div style="border-width:0px 1px 1px 1px; border-style: solid; border-color:#cdcdcd; padding:15px 15px 0px 15px;">
                                    <div class="row row_itinerary_tour">`;
                                    for(it_item in tour_data.itinerary_ids[it_idx].items)
                                    {
                                        itinerary_text += `<div class="col-lg-3">`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].timeslot){
                                            itinerary_text += `<h5><i class="fas fa-angle-right" style="color:`+color+`;"></i> `+tour_data.itinerary_ids[it_idx].items[it_item].timeslot+`</h5>`;
                                        }
                                        itinerary_text += `</div>
                                        <div class="col-lg-9" style="padding-bottom:15px;">`;
                                        if(tour_data.itinerary_ids[it_idx].items[it_item].name)
                                            itinerary_text += `
                                            <h5>`+tour_data.itinerary_ids[it_idx].items[it_item].name+`</h5>`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].description){
                                            if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                                itinerary_text += `<a style="padding: 0 1.5em 1.5em 1.5em;position: relative;width: 100%;" href="`+tour_data.itinerary_ids[it_idx].items[it_item].hyperlink+`" style="font-size: 13px;">`;
                                            else
                                                itinerary_text += `<span style="font-size: 13px;">`;
                                            if(tour_data.itinerary_ids[it_idx].items[it_item].description)
                                                itinerary_text += tour_data.itinerary_ids[it_idx].items[it_item].description;
                                            else if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                                itinerary_text += 'Description';
                                            if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                                itinerary_text += `</a><br/>`;
                                            else
                                                itinerary_text += `</span><br/>`;
                                        }
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].image){
                                            itinerary_text += `
                                            <span id="show_image_itinerary`+it_idx+``+it_item+`" onclick="showImageItinerary(`+it_idx+`,`+it_item+`);" style="color:`+color+`; font-weight:700; cursor:pointer;">Show image</span>
                                            <img id="image_itinerary`+it_idx+``+it_item+`" alt="Tour" src="`+tour_data.itinerary_ids[it_idx].items[it_item].image+`" style="width: auto; height: 250px; border:1px solid #cdcdcd; object-fit: cover; display:none;"/>`;
                                        }

                                        itinerary_text += `</div>`;
                                    }
                                    itinerary_text += `
                                    </div>

                                    <ul class="eventstep step_itinerary_tour" style="margin: 0px 15px 15px 15px;">`;
                                    for(it_item in tour_data.itinerary_ids[it_idx].items)
                                    {
                                        itinerary_text += `
                                        <li>
                                            <time>`;
                                                if (tour_data.itinerary_ids[it_idx].items[it_item].timeslot){
                                                    itinerary_text += tour_data.itinerary_ids[it_idx].items[it_item].timeslot;
                                                }
                                        itinerary_text += `
                                            </time>
                                            <span>`;
                                        if(tour_data.itinerary_ids[it_idx].items[it_item].name)
                                            itinerary_text +=`
                                            <strong>`+tour_data.itinerary_ids[it_idx].items[it_item].name+`</strong>`;
                                        if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                            itinerary_text += `<a style="padding: 0 1.5em 1.5em 1.5em;position: relative;width: 100%;" href="`+tour_data.itinerary_ids[it_idx].items[it_item].hyperlink+`">`;
                                        else
                                            itinerary_text += `<span>`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].description){
                                            itinerary_text += tour_data.itinerary_ids[it_idx].items[it_item].description;
                                        }else if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                            itinerary_text += 'Description'
                                        if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                            itinerary_text += `</a>`;
                                        else
                                            itinerary_text += `</span>`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].image){
                                            itinerary_text += `
                                            <br/>
                                            <label id="show_image_itinerary2`+it_idx+``+it_item+`" onclick="showImageItinerary(`+it_idx+`,`+it_item+`);" style="color:`+color+`; font-weight:700; cursor:pointer;">Show image</label>
                                            <img id="image_itinerary2`+it_idx+``+it_item+`" alt="Tour" src="`+tour_data.itinerary_ids[it_idx].items[it_item].image+`" style="width: auto; height: 250px; border:1px solid #cdcdcd; object-fit: cover; display:none;"/>`;
                                        }

                                        itinerary_text += `
                                            </span>
                                        </li>`;
                                    }
                                    itinerary_text += `
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
                itinerary_text += `</div>`;

                flight_details_text += `<div class="row" style="margin:0px;">
                                            <table class="table table-condensed" style="width:100%;">
                                                <thead>
                                                    <th>Airline</th>
                                                    <th class="hidden-xs">Flight Number</th>
                                                    <th colspan="2">Origin</th>
                                                    <th colspan="2">Destination</th>
                                                    <th class="hidden-xs">Transit Duration</th>
                                                </thead>`;
                for (k in tour_data.flight_segments)
                {
                    flight_details_text += `
                        <tr>
                            <td class="hidden-xs">`;
                    if (tour_data.flight_segments[k].carrier_code)
                    {
                        flight_details_text += `<img src="`+static_path_url_server+`/public/airline_logo/` + tour_data.flight_segments[k].carrier_code + `.png" alt="`+tour_data.flight_segments[k].carrier_id+`" title="`+tour_data.flight_segments[k].carrier_id+`" width="50" height="50"/>`;
                    }

//                            flight_details_text += `</td><td class="hidden-sm hidden-md hidden-lg hidden-xl">`;
//                            if (tour_data.flight_segments[k].carrier_code)
//                            {
//                                flight_details_text += `<img alt="" src="`+static_path_url_server+`/public/airline_logo/` + tour_data.flight_segments[k].carrier_code + `.png" width="40" height="40"/>`+tour_data.flight_segments[k].carrier_code;
//                            }

                    flight_details_text += `</td>`;

                    flight_details_text += `
                        <td class="hidden-xs">`+tour_data.flight_segments[k].carrier_number+`</td>
                    `;
                    flight_details_text += `<td colspan="2">`+tour_data.flight_segments[k].origin_id+`<br/>`+tour_data.flight_segments[k].departure_date_fmt;
                    if(tour_data.flight_segments[k].origin_terminal)
                    {
                        flight_details_text += `<br/>Terminal : ` + tour_data.flight_segments[k].origin_terminal;
                    }
                    flight_details_text += `</td>`;

                    flight_details_text += `<td colspan="2">`+tour_data.flight_segments[k].destination_id+`<br/>`+tour_data.flight_segments[k].arrival_date_fmt;
                    if(tour_data.flight_segments[k].destination_terminal)
                    {
                        flight_details_text += `<br/>Terminal : ` + tour_data.flight_segments[k].destination_terminal;
                    }
                    flight_details_text += `</td>`;

                    flight_details_text += `<td class="hidden-xs">`+tour_data.flight_segments[k].delay+`</td>
                        </tr>
                    `;
                }
                flight_details_text += `</table>
                                     </div>`;

                other_info_text += generate_other_info(tour_data.other_infos)

                if (tour_data.tour_type.is_open_date)
                {
                    header_list_text = `
                    <th style="width:20%;">Available From</th>
                    <th style="width:20%;">Available Until</th>
                    <th style="width:20%;">Quota</th>
                    <th style="width:20%;">Status</th>
                    <th style="width:20%;">Action</th>
                    `;
                }
                else
                {
                    header_list_text = `
                    <th style="width:20%;">Departure Date</th>
                    <th style="width:20%;">Arrival Date</th>
                    <th style="width:20%;">Quota</th>
                    <th style="width:20%;">Status</th>
                    <th style="width:20%;">Action</th>
                    `;
                }

                for (n in tour_data.tour_lines)
                {
                    date_list_text += `
                    <tr>
                        <td style="width:20%;">`+tour_data.tour_lines[n].departure_date_str+`</td>
                        <td style="width:20%;">`+tour_data.tour_lines[n].arrival_date_str+`</td>
                        <td style="width:20%;">`+tour_data.tour_lines[n].seat+`/`+tour_data.tour_lines[n].quota+` Available</td>
                        <td style="width:20%;">`+tour_data.tour_lines[n].state_str+`</td>
                        <td style="width:20%;">`;
                        if(tour_data.tour_lines[n].seat <= 0 || (tour_data.tour_lines[n].state != 'open' && tour_data.tour_lines[n].state != 'definite')){
                            date_list_text += `<button type="button" class="primary-btn-ticket btn-add-rooms" disabled>Select</button>`;
                        }else{
                            date_list_text += `<button type="button" class="primary-btn-ticket btn-add-rooms" value="`+tour_data.tour_lines[n].tour_line_code+`" onclick="select_tour_date(`+n+`)">Select</button>`;
                        }
                    date_list_text += `
                        </td>
                    </tr>
                    `;
                }

                for (n in tour_data.accommodations){
                    room_list_text += `<div class="col-lg-12 mb-3" style="border:1px solid #cdcdcd; padding: 15px;">
                        <b>Hotel: `+tour_data.accommodations[n].hotel+`</b> <br/>
                        Room: `+tour_data.accommodations[n].name+` `+tour_data.accommodations[n].bed_type+` <br/>
                        Description: `+tour_data.accommodations[n].description+` <br/>
                        <div class="row" style="padding:0px 15px;">
                            <div class="col-xs-6" style="padding:0px;">
                                <span style="display:none; color:`+color+`; font-weight:bold; cursor:pointer;" id="pricing_detail_modal`+n+`_up" onclick="show_hide_div('pricing_detail_modal`+n+`');">See Price Detail <i class="fas fa-chevron-up"></i></span>
                                <span style="display:inline-block; color:`+color+`; font-weight:bold; cursor:pointer;" id="pricing_detail_modal`+n+`_down" onclick="show_hide_div('pricing_detail_modal`+n+`');">See Price Detail <i class="fas fa-chevron-down"></i></span>
                            </div>
                            <div class="col-xs-6" style="padding:0px; text-align:right;">
                                <button type="button" class="primary-btn-ticket btn-add-rooms" style="line-height:26px;" value="`+tour_data.accommodations[n].room_code+`" data-dismiss="modal" onclick="add_tour_room(`+n+`)">Add</button>
                            </div>
                            <div class="col-lg-12" style="display:none;" id="pricing_detail_modal`+n+`_div">
                                <div class="row">`;
                                for (prc in tour_data.accommodations[n].pricing){
                                    room_list_text += `
                                    <div class="col-lg-12" style="margin-top:10px; border:1px solid #cdcdcd;">
                                        <span style="font-weight:bold;">Min: `+tour_data.accommodations[n].pricing[prc].min_pax+` guest </span>`;

                                    if(tour_data.accommodations[n].pricing[prc].is_infant_included == false){
                                        room_list_text+=`<span>(*excluding infant).</span>`;
                                    }else{
                                        room_list_text+=`<span>(*including infant).</span>`;
                                    }

                                    room_list_text+=`
                                        <br/>
                                        <span>Pricing (/guest): </span>
                                        Adult: <span style="color:`+color+`;font-weight:bold;">`+tour_data.accommodations[n].pricing[prc].currency_id+` `+getrupiah(tour_data.accommodations[n].pricing[prc].adult_price)+`</span>,
                                        Child: <span style="color:`+color+`;font-weight:bold;">`+tour_data.accommodations[n].pricing[prc].currency_id+` `+getrupiah(tour_data.accommodations[n].pricing[prc].child_price)+`</span>,
                                        Infant: <span style="color:`+color+`;font-weight:bold;">`+tour_data.accommodations[n].pricing[prc].currency_id+` `+getrupiah(tour_data.accommodations[n].pricing[prc].infant_price)+`</span>
                                    </div>`;
                                }
                            room_list_text+=`
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
//                for (n in tour_data.accommodations)
//                {
//                    room_list_text += `
//                    <tr>
//                        <td style="width:30%;">`+tour_data.accommodations[n].hotel+`</td>
//                        <td style="width:20%;">`+tour_data.accommodations[n].name+` `+tour_data.accommodations[n].bed_type+`<br/>Max `+tour_data.accommodations[n].pax_limit+` persons</td>
//                        <td style="width:40%;">`+tour_data.accommodations[n].description+`</td>`;
//                    room_list_text += `
//                        <td style="width:10%;"><button type="button" class="primary-btn-ticket btn-add-rooms" value="`+tour_data.accommodations[n].room_code+`" onclick="add_tour_room(`+n+`)">Add</button></td>
//                    </tr>
//                    `;
//                }

               document.getElementById('tour_data').value = JSON.stringify(tour_data).replace(/'/g,'');
               document.getElementById('title_search').innerHTML += tour_data.name;
               document.getElementById('main_tour_name').innerHTML += tour_data.name;
               document.getElementById('product_title').innerHTML += tour_data.name;
               document.getElementById('product_date').innerHTML += prod_date_text;
               document.getElementById('tour_carousel').innerHTML += image_text;
               document.getElementById('country_list_tour').innerHTML += country_text;
               document.getElementById('print_doc_btn_div').innerHTML += print_doc_text;
               document.getElementById('itinerary').innerHTML += itinerary_text;
               document.getElementById('other_info').innerHTML += other_info_text;
               document.getElementById('tour_hotel_room_list').innerHTML += room_list_text;
               document.getElementById('tour_available_header_list').innerHTML += header_list_text;
               document.getElementById('tour_available_date_list').innerHTML += date_list_text;

               new jBox('Tooltip', {
                   attach: '#pop_question',
                   width: 280,
                   closeOnMouseleave: true,
                   animation: 'zoomIn',
                   content: content_pop_question
               });


               $('.owl-carousel-tour-img').owlCarousel({
                    loop:true,
                    nav: true,
                    rewind: true,
                    margin: 20,
                    responsiveClass:true,
                    dots: false,
                    lazyLoad:true,
                    merge: false,
                    smartSpeed:500,
                    autoplay: true,
                    autoplayTimeout:6000,
                    autoplayHoverPause:false,
                    navText: ['<i class="fa fa-caret-left owl-wh"/>', '<i class="fa fa-caret-right owl-wh"/>'],
                    responsive:{
                        0:{
                            items:1,
                            nav:true
                        },
                        600:{
                            items:1,
                            nav:false
                        },
                        1000:{
                            items:1,
                            nav:true,
                        }
                    }
                });
               if (flight_details_text != '')
               {
                   document.getElementById('flight_details').innerHTML += flight_details_text;
               }
               else
               {
                   document.getElementById('flight_details').innerHTML = `
                        <div class="row" style="margin:0px;">
                            <table class="table table-condensed" style="width:100%;">
                                <tr><th>This tour does not include flights.</th></tr>
                            </table>
                        </div>
                   `;
               }
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error tour details </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour details');
       },timeout: 60000
    });
}

function tour_get_details_by_slug(tour_slug){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_details',
       },
       data: {
           'tour_slug': tour_slug,
           'signature': signature
       },
       success: function(msg) {
           var prod_date_text = '';
           var country_text = '';
           var print_doc_text = '';
           var image_text = '';
           var itinerary_text = '';
           var flight_details_text = '';
           var other_info_text = '';
           var room_list_text = '';
           var date_list_text = '';
           var counter = 0;
           var index = 0;
           var total_additional_price = 0;
           var total_additional_amount = 0;
           data=[]
           if(msg.result.error_code == 0){
               tour_data = msg.result.response.selected_tour;
               content_pop_question = '';
                if (selected_tour_date)
                {
                    prod_date_text += selected_tour_date;
                }
                country_text += `
                <div style="display:flex; margin-top:4px; margin-bottom:4px;">
                    <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                    if(tour_data.tour_type.is_open_date){
                        country_text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_data.tour_type_str+`</span>`;
                    }else{
                        country_text+=tour_data.tour_type_str;
                    }
                content_pop_question+=`<b>`+tour_data.tour_type.name+`: </b>`+tour_data.tour_type.description;

                country_text+=`
                    </div>
                    <span id="pop_question" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>`;
                    if (tour_data.duration)
                    {
                        country_text += `<span> | <i class="fa fa-clock-o" aria-hidden="true"></i> ` + tour_data.duration + ` Days</span>`;
                    }
                country_text+=`</div>`;
                country_text += `<span> <i class="fa fa-map-marker-alt" aria-hidden="true"></i>`;
                for (j in tour_data.country_names)
                {
                    country_text += ` ` + tour_data.country_names[j];
                    if(j != tour_data.country_names.length-1){
                        country_text += ` |`;
                    }
                }
                country_text += `</span>`;

                country_text += `<div style="background:#dbdbdb; margin-bottom:5px; margin-top:5px; padding:10px;"><span><i class="fa fa-tag" aria-hidden="true"></i> Starting From `+tour_data.currency_code+` <b style="color:`+color+`; font-size:14px;"> ` + getrupiah(tour_data.est_starting_price) + `</b></span>`;
                if (tour_data.child_sale_price > 0)
                {
                    country_text += `<span> | Child `+tour_data.currency_code+` <b style="color:`+color+`; font-size:14px;"> ` + getrupiah(tour_data.child_sale_price) + `</b></span>`;
                }
                if (tour_data.infant_sale_price > 0)
                {
                    country_text += `<span> | Infant `+tour_data.currency_code+` <b style="color:`+color+`; font-size:14px;">` + getrupiah(tour_data.infant_sale_price) + `</b></span>`;
                }

                country_text += `</div>`;

                if (tour_data.description)
                {
                    country_text += `<div style="max-height:100px; overflow:auto; padding:15px; margin-top:10px;margin-bottom:5px; border:1px solid #cdcdcd;"><span style="font-weight:600;">Description</span><br/>`;
                    country_text += `<span>`+tour_data.description+`</span></div>`;
                }else{
                    country_text += ``;
                }
                country_text += `<span><i class="fa fa-hotel" aria-hidden="true"></i> Accommodation(s) :</span>`;
                idx = 1
                for (k in tour_data.hotel_names)
                {
                    country_text += `<br/><span>` + String(idx) + `. ` + tour_data.hotel_names[k] + `</span>`;
                    idx += 1;
                }
                if (tour_data.document_url)
                {
                    print_doc_text += `<div class="mb-3" style="text-align:right;">
                                         <button class="primary-btn btn-tour btn-chgsearch" style="border-radius:6px; border: 1px solid #ddd;" onclick="window.location.href='`+tour_data.document_url+`'" target="_blank">
                                             <i class="fa fa-print" aria-hidden="true"></i> Download Document
                                         </button>
                                     </div>`;
                }

                image_text += `<div class="owl-carousel-tour-img owl-theme">`;
                for (j in tour_data.images_obj)
                {
                    image_text +=`
                    <div class="item" style="float:none; height:360px; display: flex; justify-content: center; align-items: center;">
                        <div class="single-destination relative">
                            <div class="thumb relative">
                                <img class="img-fluid zoom-img" src="`+tour_data.images_obj[j].url+`" alt="Tour">
                            </div>
                        </div>
                    </div>`;
                }
                if (tour_data.images_obj.length == 0)
                {
                    image_text += `
                    <div class="item" style="float:none; height:360px; display: flex; justify-content: center; align-items: center;">
                        <div class="single-destination relative">
                            <div class="thumb relative">
                                <img class="img-fluid zoom-img" src="`+static_path_url_server+`/public/tour_packages/not_found.png" alt="Not Found Tour">
                            </div>
                        </div>
                    </div>`;
                }
                image_text += `</div>`;

                itinerary_text += `<div class="row">`;
                for (it_idx in tour_data.itinerary_ids)
                {
                    itinerary_text += `
                    <div class="col-lg-12" style="margin-bottom:10px;">
                        <div class="row">
                            <div class="col-lg-12">
                                <h6 style="border:1px solid #cdcdcd; padding:10px; background:`+color+`; cursor:pointer; overflow-y: hidden; color:`+text_color+`" onclick="show_hide_itinerary_tour(`+it_idx+`)">
                                    Day `+tour_data.itinerary_ids[it_idx].day+`</span>`;
                                    if(tour_data.itinerary_ids[it_idx].name)
                                        itinerary_text+=` - `+tour_data.itinerary_ids[it_idx].name;
                                    itinerary_text += `
                                    <i class="fas fa-chevron-up" id="itinerary_day`+it_idx+`_down" style="float:right; color:`+text_color+`; display:none;"></i>
                                    <i class="fas fa-chevron-down" id="itinerary_day`+it_idx+`_up" style="float:right; color:`+text_color+`; display:inline-block;"></i>
                                </h6>
                            </div>
                            <div class="col-lg-12" style="display:block;" id="div_itinerary_day`+it_idx+`">
                                <div style="border-width:0px 1px 1px 1px; border-style: solid; border-color:#cdcdcd; padding:15px 15px 0px 15px;">
                                    <div class="row row_itinerary_tour">`;
                                    for(it_item in tour_data.itinerary_ids[it_idx].items)
                                    {
                                        itinerary_text += `<div class="col-lg-3">`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].timeslot){
                                            itinerary_text += `<h5><i class="fas fa-angle-right" style="color:`+color+`;"></i> `+tour_data.itinerary_ids[it_idx].items[it_item].timeslot+`</h5>`;
                                        }
                                        itinerary_text += `</div>
                                        <div class="col-lg-9" style="padding-bottom:15px;">`;
                                        if(tour_data.itinerary_ids[it_idx].items[it_item].name)
                                            itinerary_text += `
                                            <h5>`+tour_data.itinerary_ids[it_idx].items[it_item].name+`</h5>`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].description){
                                            if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                                itinerary_text += `<a style="padding: 0 1.5em 1.5em 1.5em;position: relative;width: 100%;" href="`+tour_data.itinerary_ids[it_idx].items[it_item].hyperlink+`" style="font-size: 13px;">`;
                                            else
                                                itinerary_text += `<span style="font-size: 13px;">`;
                                            if(tour_data.itinerary_ids[it_idx].items[it_item].description)
                                                itinerary_text += tour_data.itinerary_ids[it_idx].items[it_item].description;
                                            else if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                                itinerary_text += 'Description';
                                            if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                                itinerary_text += `</a><br/>`;
                                            else
                                                itinerary_text += `</span><br/>`;
                                        }
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].image){
                                            itinerary_text += `
                                            <span id="show_image_itinerary`+it_idx+``+it_item+`" onclick="showImageItinerary(`+it_idx+`,`+it_item+`);" style="color:`+color+`; font-weight:700; cursor:pointer;">Show image</span>
                                            <img id="image_itinerary`+it_idx+``+it_item+`" alt="Tour" src="`+tour_data.itinerary_ids[it_idx].items[it_item].image+`" style="width: auto; height: 250px; border:1px solid #cdcdcd; object-fit: cover; display:none;"/>`;
                                        }

                                        itinerary_text += `</div>`;
                                    }
                                    itinerary_text += `
                                    </div>

                                    <ul class="eventstep step_itinerary_tour" style="margin: 0px 15px 15px 15px;">`;
                                    for(it_item in tour_data.itinerary_ids[it_idx].items)
                                    {
                                        itinerary_text += `
                                        <li>
                                            <time>`;
                                                if (tour_data.itinerary_ids[it_idx].items[it_item].timeslot){
                                                    itinerary_text += tour_data.itinerary_ids[it_idx].items[it_item].timeslot;
                                                }
                                        itinerary_text += `
                                            </time>
                                            <span>`;
                                        if(tour_data.itinerary_ids[it_idx].items[it_item].name)
                                            itinerary_text +=`
                                            <strong>`+tour_data.itinerary_ids[it_idx].items[it_item].name+`</strong>`;
                                        if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                            itinerary_text += `<a style="padding: 0 1.5em 1.5em 1.5em;position: relative;width: 100%;" href="`+tour_data.itinerary_ids[it_idx].items[it_item].hyperlink+`">`;
                                        else
                                            itinerary_text += `<span>`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].description){
                                            itinerary_text += tour_data.itinerary_ids[it_idx].items[it_item].description;
                                        }else if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                            itinerary_text += 'Description'
                                        if(tour_data.itinerary_ids[it_idx].items[it_item].hasOwnProperty('hyperlink') && tour_data.itinerary_ids[it_idx].items[it_item].hyperlink)
                                            itinerary_text += `</a>`;
                                        else
                                            itinerary_text += `</span>`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].image){
                                            itinerary_text += `
                                            <br/>
                                            <label id="show_image_itinerary2`+it_idx+``+it_item+`" onclick="showImageItinerary(`+it_idx+`,`+it_item+`);" style="color:`+color+`; font-weight:700; cursor:pointer;">Show image</label>
                                            <img id="image_itinerary2`+it_idx+``+it_item+`" alt="Tour" src="`+tour_data.itinerary_ids[it_idx].items[it_item].image+`" style="width: auto; height: 250px; border:1px solid #cdcdcd; object-fit: cover; display:none;"/>`;
                                        }

                                        itinerary_text += `
                                            </span>
                                        </li>`;
                                    }
                                    itinerary_text += `
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
                itinerary_text += `</div>`;

                flight_details_text += `<div class="row" style="margin:0px;">
                                            <table class="table table-condensed" style="width:100%;">
                                                <thead>
                                                    <th>Airline</th>
                                                    <th class="hidden-xs">Flight Number</th>
                                                    <th colspan="2">Origin</th>
                                                    <th colspan="2">Destination</th>
                                                    <th class="hidden-xs">Transit Duration</th>
                                                </thead>`;
                for (k in tour_data.flight_segments)
                {
                    flight_details_text += `
                        <tr>
                            <td class="hidden-xs">`;
                    if (tour_data.flight_segments[k].carrier_code)
                    {
                        flight_details_text += `<img src="`+static_path_url_server+`/public/airline_logo/` + tour_data.flight_segments[k].carrier_code + `.png" alt="`+tour_data.flight_segments[k].carrier_id+`" title="`+tour_data.flight_segments[k].carrier_id+`" width="50" height="50"/>`;
                    }

//                            flight_details_text += `</td><td class="hidden-sm hidden-md hidden-lg hidden-xl">`;
//                            if (tour_data.flight_segments[k].carrier_code)
//                            {
//                                flight_details_text += `<img alt="" src="`+static_path_url_server+`/public/airline_logo/` + tour_data.flight_segments[k].carrier_code + `.png" width="40" height="40"/>`+tour_data.flight_segments[k].carrier_code;
//                            }

                    flight_details_text += `</td>`;

                    flight_details_text += `
                        <td class="hidden-xs">`+tour_data.flight_segments[k].carrier_number+`</td>
                    `;
                    flight_details_text += `<td colspan="2">`+tour_data.flight_segments[k].origin_id+`<br/>`+tour_data.flight_segments[k].departure_date_fmt;
                    if(tour_data.flight_segments[k].origin_terminal)
                    {
                        flight_details_text += `<br/>Terminal : ` + tour_data.flight_segments[k].origin_terminal;
                    }
                    flight_details_text += `</td>`;

                    flight_details_text += `<td colspan="2">`+tour_data.flight_segments[k].destination_id+`<br/>`+tour_data.flight_segments[k].arrival_date_fmt;
                    if(tour_data.flight_segments[k].destination_terminal)
                    {
                        flight_details_text += `<br/>Terminal : ` + tour_data.flight_segments[k].destination_terminal;
                    }
                    flight_details_text += `</td>`;

                    flight_details_text += `<td class="hidden-xs">`+tour_data.flight_segments[k].delay+`</td>
                        </tr>
                    `;
                }
                flight_details_text += `</table>
                                     </div>`;

                other_info_text += generate_other_info(tour_data.other_infos)

                if (tour_data.tour_type.is_open_date)
                {
                    header_list_text = `
                    <th style="width:20%;">Available From</th>
                    <th style="width:20%;">Available Until</th>
                    <th style="width:20%;">Quota</th>
                    <th style="width:20%;">Status</th>
                    <th style="width:20%;">Action</th>
                    `;
                }
                else
                {
                    header_list_text = `
                    <th style="width:20%;">Departure Date</th>
                    <th style="width:20%;">Arrival Date</th>
                    <th style="width:20%;">Quota</th>
                    <th style="width:20%;">Status</th>
                    <th style="width:20%;">Action</th>
                    `;
                }

                for (n in tour_data.tour_lines)
                {
                    date_list_text += `
                    <tr>
                        <td style="width:20%;">`+tour_data.tour_lines[n].departure_date_str+`</td>
                        <td style="width:20%;">`+tour_data.tour_lines[n].arrival_date_str+`</td>
                        <td style="width:20%;">`+tour_data.tour_lines[n].seat+`/`+tour_data.tour_lines[n].quota+` Available</td>
                        <td style="width:20%;">`+tour_data.tour_lines[n].state_str+`</td>
                        <td style="width:20%;">`;
                        if(tour_data.tour_lines[n].seat <= 0 || (tour_data.tour_lines[n].state != 'open' && tour_data.tour_lines[n].state != 'definite')){
                            date_list_text += `<button type="button" class="primary-btn-ticket btn-add-rooms" disabled>Select</button>`;
                        }else{
                            date_list_text += `<button type="button" class="primary-btn-ticket btn-add-rooms" value="`+tour_data.tour_lines[n].tour_line_code+`" onclick="select_tour_date(`+n+`)">Select</button>`;
                        }
                    date_list_text += `
                        </td>
                    </tr>
                    `;
                }

                for (n in tour_data.accommodations){
                    room_list_text += `<div class="col-lg-12 mb-3" style="border:1px solid #cdcdcd; padding: 15px;">
                        <b>Hotel: `+tour_data.accommodations[n].hotel+`</b> <br/>
                        Room: `+tour_data.accommodations[n].name+` `+tour_data.accommodations[n].bed_type+` <br/>
                        Description: `+tour_data.accommodations[n].description+` <br/>
                        <div class="row" style="padding:0px 15px;">
                            <div class="col-xs-6" style="padding:0px;">
                                <span style="display:none; color:`+color+`; font-weight:bold; cursor:pointer;" id="pricing_detail_modal`+n+`_up" onclick="show_hide_div('pricing_detail_modal`+n+`');">See Price Detail <i class="fas fa-chevron-up"></i></span>
                                <span style="display:inline-block; color:`+color+`; font-weight:bold; cursor:pointer;" id="pricing_detail_modal`+n+`_down" onclick="show_hide_div('pricing_detail_modal`+n+`');">See Price Detail <i class="fas fa-chevron-down"></i></span>
                            </div>
                            <div class="col-xs-6" style="padding:0px; text-align:right;">
                                <button type="button" class="primary-btn-ticket btn-add-rooms" style="line-height:26px;" value="`+tour_data.accommodations[n].room_code+`" data-dismiss="modal" onclick="add_tour_room(`+n+`)">Add</button>
                            </div>
                            <div class="col-lg-12" style="display:none;" id="pricing_detail_modal`+n+`_div">
                                <div class="row">`;
                                for (prc in tour_data.accommodations[n].pricing){
                                    room_list_text += `
                                    <div class="col-lg-12" style="margin-top:10px; border:1px solid #cdcdcd;">
                                        <span style="font-weight:bold;">Min: `+tour_data.accommodations[n].pricing[prc].min_pax+` guest </span>`;

                                    if(tour_data.accommodations[n].pricing[prc].is_infant_included == false){
                                        room_list_text+=`<span>(*excluding infant).</span>`;
                                    }else{
                                        room_list_text+=`<span>(*including infant).</span>`;
                                    }

                                    room_list_text+=`
                                        <br/>
                                        <span>Pricing (/guest): </span>
                                        Adult: <span style="color:`+color+`;font-weight:bold;">`+tour_data.accommodations[n].pricing[prc].currency_id+` `+getrupiah(tour_data.accommodations[n].pricing[prc].adult_price)+`</span>,
                                        Child: <span style="color:`+color+`;font-weight:bold;">`+tour_data.accommodations[n].pricing[prc].currency_id+` `+getrupiah(tour_data.accommodations[n].pricing[prc].child_price)+`</span>,
                                        Infant: <span style="color:`+color+`;font-weight:bold;">`+tour_data.accommodations[n].pricing[prc].currency_id+` `+getrupiah(tour_data.accommodations[n].pricing[prc].infant_price)+`</span>
                                    </div>`;
                                }
                            room_list_text+=`
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
//                for (n in tour_data.accommodations)
//                {
//                    room_list_text += `
//                    <tr>
//                        <td style="width:30%;">`+tour_data.accommodations[n].hotel+`</td>
//                        <td style="width:20%;">`+tour_data.accommodations[n].name+` `+tour_data.accommodations[n].bed_type+`<br/>Max `+tour_data.accommodations[n].pax_limit+` persons</td>
//                        <td style="width:40%;">`+tour_data.accommodations[n].description+`</td>`;
//                    room_list_text += `
//                        <td style="width:10%;"><button type="button" class="primary-btn-ticket btn-add-rooms" value="`+tour_data.accommodations[n].room_code+`" onclick="add_tour_room(`+n+`)">Add</button></td>
//                    </tr>
//                    `;
//                }

               document.getElementById('tour_data').value = JSON.stringify(tour_data).replace(/'/g,'');
               document.getElementById('title_search').innerHTML += tour_data.name;
               document.getElementById('main_tour_name').innerHTML += tour_data.name;
               document.getElementById('product_title').innerHTML += tour_data.name;
               document.getElementById('product_date').innerHTML += prod_date_text;
               document.getElementById('tour_carousel').innerHTML += image_text;
               document.getElementById('country_list_tour').innerHTML += country_text;
               document.getElementById('print_doc_btn_div').innerHTML += print_doc_text;
               document.getElementById('itinerary').innerHTML += itinerary_text;
               document.getElementById('other_info').innerHTML += other_info_text;
               document.getElementById('tour_hotel_room_list').innerHTML += room_list_text;
               document.getElementById('tour_available_header_list').innerHTML += header_list_text;
               document.getElementById('tour_available_date_list').innerHTML += date_list_text;

               new jBox('Tooltip', {
                   attach: '#pop_question',
                   width: 280,
                   closeOnMouseleave: true,
                   animation: 'zoomIn',
                   content: content_pop_question
               });


               $('.owl-carousel-tour-img').owlCarousel({
                    loop:true,
                    nav: true,
                    rewind: true,
                    margin: 20,
                    responsiveClass:true,
                    dots: false,
                    lazyLoad:true,
                    merge: false,
                    smartSpeed:500,
                    autoplay: true,
                    autoplayTimeout:6000,
                    autoplayHoverPause:false,
                    navText: ['<i class="fa fa-caret-left owl-wh"/>', '<i class="fa fa-caret-right owl-wh"/>'],
                    responsive:{
                        0:{
                            items:1,
                            nav:true
                        },
                        600:{
                            items:1,
                            nav:false
                        },
                        1000:{
                            items:1,
                            nav:true,
                        }
                    }
                });
               if (flight_details_text != '')
               {
                   document.getElementById('flight_details').innerHTML += flight_details_text;
               }
               else
               {
                   document.getElementById('flight_details').innerHTML = `
                        <div class="row" style="margin:0px;">
                            <table class="table table-condensed" style="width:100%;">
                                <tr><th>This tour does not include flights.</th></tr>
                            </table>
                        </div>
                   `;
               }
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error tour details </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour details');
       },timeout: 60000
    });
}

function get_tour_carrier_data(){
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_tour_carrier_data',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           tour_carrier_data = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function update_sell_tour(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'sell_tour',
       },
       data: {
           'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            update_contact_tour(val);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update sell tour </span>' + msg.result.error_msg,
            }).then((result) => {
              if (result.value) {
                hide_modal_waiting_transaction();
              }
            })

            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update sell tour');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function update_contact_tour(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'update_contact',
       },
       data: {
           'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            update_passengers_tour(val);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update contact tour </span>' + msg.result.error_msg,
            }).then((result) => {
              if (result.value) {
                hide_modal_waiting_transaction();
              }
            })

            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update contact tour');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function update_passengers_tour(val){
    room_choice_dict = {};
    for (var i=0; i < total_pax_amount; i++)
    {
        var temp_room_seq = document.getElementById("room_select_pax"+String(i+1)).value;
        var temp_pax_id = document.getElementById("temp_pax_id"+String(i+1)).value;
        temp_dict = {
            'room_code': document.getElementById("room_code_"+String(temp_room_seq)).value,
            'room_seq': 'Room ' + String(temp_room_seq)
        }
        room_choice_dict[temp_pax_id] = temp_dict;
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'update_passengers',
       },
       data: {
           'room_choice': JSON.stringify(room_choice_dict),
           'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            if(val == 0){
                document.getElementById("passengers").value = JSON.stringify({'booker':booker});
                document.getElementById("signature").value = signature;
                document.getElementById("provider").value = 'tour';
                document.getElementById("type").value = 'tour';
                document.getElementById("voucher_code").value = voucher_code;
                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                document.getElementById("session_time_input").value = time_limit;
                document.getElementById("payment").value = JSON.stringify(payment);
                commit_booking_tour(val);
            }else if(val == 1){
                document.getElementById("passengers").value = JSON.stringify({'booker':booker});
                document.getElementById("signature").value = signature;
                document.getElementById("provider").value = 'tour';
                document.getElementById("type").value = 'tour_review';
                document.getElementById("voucher_code").value = voucher_code;
                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                document.getElementById("session_time_input").value = time_limit;
                document.getElementById("payment").value = JSON.stringify(payment);
                document.getElementById('tour_issued').submit();

            }


        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update passengers tour </span>' + msg.result.error_msg,
            }).then((result) => {
              if (result.value) {
                hide_modal_waiting_transaction();
              }
            })

            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update passengers tour');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function commit_booking_tour(val)
{
    if(val == 1)
    {
        payment_method_choice = '';
        var radios = document.getElementsByName('payment_opt');
        for (var i = 0; i < radios.length; i++)
        {
            if (radios[i].checked)
            {
                payment_method_choice = radios[i].value;
                break;
            }
        }
    }
    var formData = new FormData($('#global_payment_form').get(0));
    formData.append('value', val);
    formData.append('signature', signature);
    if(typeof(voucher_code) !== 'undefined')
        formData.append('voucher_code', voucher_code);
    try{
        formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
        formData.append('member', payment_acq2[payment_method][selected].method);
        formData.append('payment_method', payment_method_choice);
        default_payment_to_ho = ''
        if(total_price_payment_acq == 0)
            default_payment_to_ho = 'balance'
        formData.append('agent_payment', document.getElementById('payment_ho_id') ? document.getElementById('payment_ho_id').value : default_payment_to_ho);
        if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
        {
            formData.append('payment_reference', document.getElementById('pay_ref_text').value);
        }
    }catch(err){
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
            url: "/webservice/tour",
            headers:{
                'action': 'commit_booking',
            },
            data: formData,
            success: function(msg) {
                if(google_analytics != ''){
                    if(formData.get('member'))
                        gtag('event', 'tour_issued', {});
                    else
                        gtag('event', 'tour_hold_booking', {});
                }
                if(msg.result.error_code == 0){
                    var booking_num = msg.result.response.order_number;
                    if(val == 1){
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                            send_url_booking('tour', btoa(msg.result.response.order_number), msg.result.response.order_number);
                        document.getElementById('order_number').value = msg.result.response.order_number;
                        document.getElementById('issued').action = '/tour/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('issued').submit();
                    }else{
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
    //                        send_url_booking('tour', btoa(msg.result.response.order_number), msg.result.response.order_number);
    //                        document.getElementById('order_number').value = msg.result.response.order_number;
    //                        document.getElementById('tour_issued').submit();
                            Swal.fire({
                                title: "Success, booking has been made. We'll sent you an email for your reservation",
                                type: 'success',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: 'blue',
                                confirmButtonText: 'Payment',
                                cancelButtonText: 'View Booking'
                            }).then((result) => {
                                if (result.value) {
                                    $('.hold-seat-booking-train').addClass("running");
                                    $('.hold-seat-booking-train').attr("disabled", true);
                                    please_wait_transaction();
                                    send_url_booking('tour', btoa(msg.result.response.order_number), msg.result.response.order_number);
                                    document.getElementById('order_number').value = msg.result.response.order_number;
                                    document.getElementById('tour_issued').submit();

                                }else{
                                    document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
                                    document.getElementById('tour_booking').action = '/tour/booking/' + btoa(msg.result.response.order_number);
                                    document.getElementById('tour_booking').submit();
                                }
                            })
                        }else{
                            document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
                            document.getElementById('tour_booking').action = '/tour/booking/' + btoa(msg.result.response.order_number);
                            document.getElementById('tour_booking').submit();
    //                        document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
    //                        document.getElementById('tour_booking').action = '/tour/booking/' + btoa(msg.result.response.order_number);
    //                        document.getElementById('tour_booking').submit();
                        }
                    }
                }else{
                    Swal.fire({
                        type: 'error',
                        title: 'Oops!',
                        html: '<span style="color: #ff9900;">Error tour commit booking </span>' + msg.result.error_msg,
                    }).then((result) => {
                        if (result.value) {
                            hide_modal_waiting_transaction();
                        }
                    })
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    hide_modal_waiting_transaction();
                }
           },
           contentType:false,
           processData:false,
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour commit booking');
                hide_modal_waiting_transaction();
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
           },timeout: 60000
        });
    }
}

function get_payment_rules(tour_code, tour_line_code)
{
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_payment_rules',
       },
       data: {
           'tour_code': tour_code,
           'tour_line_code': tour_line_code,
           'signature': signature
       },
       success: function(msg) {
           payment = msg.result.response.payment_rules;
//           if (payment)
//           {
//               print_payment_rules(payment);
//           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour payment rules');
       },timeout: 60000
    });
}

function tour_pre_issued_booking(order_number)
{
    Swal.fire({
      title: 'Are you sure want to Issued this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $("#issuedModal").modal('hide');
        please_wait_transaction()
        $('.next-loading-issued').addClass("running");
        $('.next-loading-issued').prop('disabled', true);
        tour_issued_booking(order_number);
        document.getElementById('voucher_discount').innerHTML = '';
      }
    })
}

function tour_issued_booking(order_number)
{
    var temp_data = {}
    if(typeof(tr_get_booking) !== 'undefined')
        temp_data = JSON.stringify(tr_get_booking)
    payment_method_choice = '';
    var radios = document.getElementsByName('payment_opt');
    for (var i = 0; i < radios.length; i++)
    {
        if (radios[i].checked)
        {
            payment_method_choice = radios[i].value;
            break;
        }
    }

    if(document.getElementById('tour_booking'))
    {
        var formData = new FormData($('#tour_booking').get(0));
    }
    else
    {
        var formData = new FormData($('#global_payment_form').get(0));
    }
    formData.append('order_number', order_number);
    formData.append('payment_method', payment_method_choice);
    formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
    formData.append('member', payment_acq2[payment_method][selected].method);
    formData.append('agent_payment', document.getElementById('payment_ho_id') ? document.getElementById('payment_ho_id').value : '');
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
            url: "/webservice/tour",
            headers:{
                'action': 'issued_booking',
            },
            data: formData,
            success: function(msg) {
                if(google_analytics != '')
                    gtag('event', 'tour_issued', {});
                if(msg.result.error_code == 0){
                    try{
                        if(msg.result.response.state == 'issued')
                            print_success_issued();
                        else
                            print_fail_issued();
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                    if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/tour/booking/' + btoa(order_number);
                    }else{
                        var booking_num = msg.result.response.order_number;
                        if (booking_num)
                        {
                            price_arr_repricing = {};
                            pax_type_repricing = [];
                            tour_get_booking(order_number);
                            document.getElementById('payment_acq').innerHTML = '';
                            document.getElementById('payment_acq').hidden = true;
                            $("#issuedModal").modal('hide');
                            hide_modal_waiting_transaction();
                            document.getElementById("overlay-div-box").style.display = "none";
                        }
                    }
                }else if(msg.result.error_code == 1009){
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('payment_acq').hidden = true;
                    $("#issuedModal").modal('hide');
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";
                    document.getElementById('tour_final_info').innerHTML = text;
                    document.getElementById('product_title').innerHTML = '';
                    document.getElementById('product_type_title').innerHTML = '';
                    document.getElementById('tour_detail_table').innerHTML = '';
                    tour_get_booking(order_number);
                }else{
                    if(msg.result.error_code != 1007){
                        Swal.fire({
                            type: 'error',
                            title: 'Oops!',
                            html: '<span style="color: red;">Error tour issued booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                            if (result.value) {
                                hide_modal_waiting_transaction();
                            }
                        })
                    }else{
                        Swal.fire({
                            type: 'error',
                            title: 'Error tour issued '+ msg.result.error_msg,
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
                                    window.location.href = '/tour/booking/'+order_number;
                                }
                            }
                        })
                    }
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('payment_acq').hidden = true;
                    $("#issuedModal").modal('hide');
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";
                    document.getElementById('tour_final_info').innerHTML = text;
                    document.getElementById('product_title').innerHTML = '';
                    document.getElementById('product_type_title').innerHTML = '';
                    document.getElementById('tour_detail_table').innerHTML = '';
                    tour_get_booking(order_number);
                    $("#issuedModal").modal('hide');
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    hide_modal_waiting_transaction();
                }
            },
            contentType:false,
            processData:false,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour issued booking');
                hide_modal_waiting_transaction();
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('payment_acq').hidden = true;
                $("#issuedModal").modal('hide');
                document.getElementById("overlay-div-box").style.display = "none";
                document.getElementById('tour_final_info').innerHTML = text;
                document.getElementById('product_title').innerHTML = '';
                document.getElementById('product_type_title').innerHTML = '';
                document.getElementById('tour_detail_table').innerHTML = '';
                tour_get_booking(order_number);
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
            },timeout: 60000
        });
    }
}

function tour_request_issued(req_order_number){
    Swal.fire({
      title: 'Are you sure want to Request Issued for this booking?',
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
           url: "/webservice/content",
           headers:{
                'action': 'create_reservation_issued_request',
           },
           data: {
               'order_number': req_order_number,
               'table_name': 'tour',
               'signature': signature
           },
           success: function(msg) {
               if(msg.result.error_code == 0){
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('payment_acq').hidden = true;
                    document.getElementById("overlay-div-box").style.display = "none";
                    hide_modal_waiting_transaction();
                    window.location.href = '/reservation_request/' + btoa(msg.result.response.request_number);
               }
               else {
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error tour request issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('payment_acq').hidden = true;
                    $("#issuedModal").modal('hide');
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";
                    document.getElementById('tour_final_info').innerHTML = text;
                    document.getElementById('product_title').innerHTML = '';
                    document.getElementById('product_type_title').innerHTML = '';
                    document.getElementById('tour_detail_table').innerHTML = '';
                    tour_get_booking(req_order_number);
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                hide_modal_waiting_transaction();
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('payment_acq').hidden = true;
                $("#issuedModal").modal('hide');
                document.getElementById("overlay-div-box").style.display = "none";
                document.getElementById('tour_final_info').innerHTML = text;
                document.getElementById('product_title').innerHTML = '';
                document.getElementById('product_type_title').innerHTML = '';
                document.getElementById('tour_detail_table').innerHTML = '';
                tour_get_booking(req_order_number);
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
           },timeout: 300000
        });
      }
    })
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = [];
        currency = '';
        for(i in tr_get_booking.result.response.passengers){
            if(currency == '')
                for(j in tr_get_booking.result.response.passengers[i].sale_service_charges){
                    currency = tr_get_booking.result.response.passengers[i].sale_service_charges[j].FARE.currency;
                    break;
                }
            list_price = []
            if(document.getElementById(tr_get_booking.result.response.passengers[i].name+'_repricing').innerHTML != '-'){
                list_price.push({
                    'amount': parseInt(document.getElementById(tr_get_booking.result.response.passengers[i].name+'_repricing').innerHTML.split(',').join('')),
                    'currency_code': currency
                });
                upsell.push({
                    'sequence': tr_get_booking.result.response.passengers[i].sequence,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
            }
        }
        repricing_order_number = tour_order_number;
    }else{
        upsell_price_dict = {};
        upsell = []
        counter_pax = 0;
        currency = '';
        for(i in tour_price.result.response.service_charges){
            if(!currency)
                currency = tour_price.result.response.service_charges[i].currency;
            else
                break;
        }
        for(i in all_pax){
            if(all_pax[i].pax_type in upsell_price_dict == false)
                upsell_price_dict[all_pax[i].pax_type] = 0;
            list_price = [];
            if(document.getElementById(all_pax[i].first_name+all_pax[i].last_name+'_repricing').innerHTML != '-' && document.getElementById(all_pax[i].first_name+all_pax[i].last_name+'_repricing').innerHTML != '0'){
                list_price.push({
                    'amount': parseInt(document.getElementById(all_pax[i].first_name+all_pax[i].last_name+'_repricing').innerHTML.split(',').join('')),
                    'currency_code': currency
                });
                upsell_price_dict[all_pax[i].pax_type] += parseInt(document.getElementById(all_pax[i].first_name+all_pax[i].last_name+'_repricing').innerHTML.split(',').join(''));
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price)),
                    'pax_type': all_pax[i].pax_type
                });
                list_price = [];
            }
            counter_pax++;
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
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
                    tour_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error tour update service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour update service charge');
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
       url: "/webservice/tour",
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
                        tour_get_booking(repricing_order_number);
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                    }
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error tour update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}

function tour_get_booking(order_number)
{
    price_arr_repricing = {};
    get_vendor_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_booking',
       },
       data: {
           'order_number': order_number,
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
               price_arr_repricing = {};
               pax_type_repricing = [];
               tour_order_number = order_number;
               tr_get_booking = msg;
               can_issued = msg.result.response.can_issued;
               document.getElementById('button_new_offline').hidden = false;
               document.getElementById('booking_data_product').value = JSON.stringify(msg);
               $('#loading-search-tour').hide();
               hide_modal_waiting_transaction();
               document.getElementById('button-home').hidden = false;
               document.getElementById('button-new-reservation').hidden = false;
               try{
                   var book_obj = msg.result.response;
                   var tour_package = msg.result.response.tour_details;
                   var passengers = msg.result.response.passengers;
                   var rooms = msg.result.response.rooms;
                   var contact = msg.result.response.contact;
                   var payment = msg.result.response.payment_rules;
                   var cur_state = msg.result.response.state;
                   var cur_state_desc = msg.result.response.state_description;

                   tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                   localTime  = moment.utc(tes).toDate();
                   var now = moment();
                   var hold_date_time = moment(localTime, "DD MMM YYYY HH:mm");
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
                   if(cur_state == 'booked'){
                        conv_status = 'Booked';
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
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
                    }
                    else if(cur_state == 'issued'){
                        conv_status = 'Issued';
                        document.getElementById('issued-breadcrumb').classList.add("br-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-success" role="alert">
                            <h5>Your booking has been successfully Issued!</h5>
                        </div>`;
                    }
                    else if(cur_state == 'refund'){
                       //document.getElementById('issued-breadcrumb').classList.remove("current");
                       //document.getElementById('issued-breadcrumb').classList.add("active");
                       document.getElementById('issued-breadcrumb').classList.add("br-active");
                       document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                       document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                       document.getElementById('alert-state').innerHTML = `
                       <div class="alert alert-dark" role="alert">
                           <h5>Your booking has been Refunded!</h5>
                       </div>`;
                    }
                    else if(cur_state == 'cancel'){
                        conv_status = 'Cancelled';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Cancelled!</h5>
                        </div>`;
                    }
                    else if(cur_state == 'cancel2'){
                        conv_status = 'Expired';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Expired!</h5>
                        </div>`;
                    }
                    else if(cur_state == 'fail_issued'){
                        conv_status = 'Fail Issued';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Issued`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Failed, Please Try Again';
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Failed!</h5>
                        </div>`;
                    }
                    else if(cur_state == 'fail_booked'){
                        conv_status = 'Fail Booked';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Booked`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Failed, Please Try Again';
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Failed!</h5>
                        </div>`;
                    }
                    else if(cur_state == 'fail_refunded'){
                        conv_status = 'Fail Refunded';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Refunded`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Failed and Your Balance Has Been Refunded';
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Failed!</h5>
                        </div>`;
                    }
                    else if(cur_state == 'pending'){
                        conv_status = 'Pending';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-pending");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-pending");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-clock"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Pending`;
                        document.getElementById('order_state').innerHTML = 'Your Order Is Currently ' + conv_status;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-info" role="alert">
                            <h5>Your booking is currently Pending!</h5>
                        </div>`;
                    }
                    else{
                        document.getElementById('issued-breadcrumb-span').innerHTML = cur_state_desc;
                        document.getElementById('order_state').innerHTML = 'Your Order Status Is ' + cur_state_desc;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been `+cur_state_desc+`!</h5>
                        </div>`;
                    }

                   try{
                        if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                            document.getElementById('voucher_discount').style.display = 'block';
                        else
                            document.getElementById('voucher_discount').style.display = 'none';
                   }catch(err){console.log(err);}
                   document.getElementById('voucher_discount').style.display = 'block';

                   text = `
                            <div class="row">
                                <div class="col-lg-12">
                                    <div id="tour_booking_detail" style="border:1px solid #cdcdcd; padding:15px; background-color:white">
                                        <div class="row">
                                            <div class="col-lg-12 mb-3" style="padding-bottom:15px; border-bottom:1px solid #cdcdcd;">
                                                <h4>
                                                    <i class="fas fa-scroll"></i> Order Number: `+book_obj.order_number+`
                                                </h4>
                                            </div>
                                        </div>
                                        <table style="width:100%;">
                                            <tr>
                                                <th>PNR</th>`;
                                                if(book_obj.state == 'booked')
                                                    text+=`<th>Hold Date</th>`;
                                            text+=`
                                                <th>Status</th>
                                            </tr>
                                            <tr>`;

                                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                                text+=`
                                                <td>`+book_obj.pnr+`</td>`;
                                            else
                                                text+=`<td> - </td>`;

                                            if(book_obj.state == 'booked')
                                                text+=`<td>`+book_obj.hold_date+`</td>`;

                                            text+=`
                                                <td>`;
                                            if(conv_status == 'Expired'){
                                                text+=`<span style="background:#DC143C; color:white; padding:0px 15px; border-radius:14px;">`;
                                            }
                                            else if(conv_status == 'Booked'){
                                                text+=`<span style="background:#3fa1e8; color:white; padding:0px 15px; border-radius:14px;">`;
                                            }
                                            else if(conv_status == 'Issued'){
                                                text+=`<span style="background:#30b330; color:white; padding:0px 15px; border-radius:14px;">`;
                                            }
                                            else{
                                                text+=`<span>`;
                                            }
                                            text+=`
                                                    `+conv_status+`
                                                </span>
                                                </td>
                                            </tr>
                                        </table>

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
                                </div>
                            </div>
                    `;

                   if (tour_package.tour_type.is_open_date)
                   {
                       text += `
                       <div class="row">
                           <div class="col-lg-12">
                               <div id="tour_booking_info" style="border:1px solid #cdcdcd; padding:15px; background-color:white;">
                                   <div class="row">
                                       <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                           <h4 class="mb-3">
                                               <img src="/static/tt_website/images/icon/product/b-tour.png" alt="undefined" style="width:20px; height:20px;">
                                               Tour Information
                                           </h4>
                                       </div>
                                   </div>
                                   <h4>`+tour_package.name+`</h4>
                                   <span><i class="fa fa-clock-o" aria-hidden="true"></i> `+tour_package.duration+` Days</span>
                                   <br/>
                                   <span>Period: `+tour_package.departure_date_str+` - `+tour_package.arrival_date_str+`</span>
                                   <br/>
                               </div>
                           </div>
                       </div>`;
                   }
                   else{
                       text += `
                       <div class="row">
                           <div class="col-lg-12 mt-3">
                               <div id="tour_booking_info" style="border:1px solid #cdcdcd; padding:15px; background-color:white;">
                                   <div class="row">
                                       <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                           <h4 class="mb-3">
                                                <img src="/static/tt_website/images/icon/product/b-tour.png" alt="undefined" style="width:20px; height:20px;">
                                               Tour Information
                                           </h4>
                                       </div>
                                   </div>
                                   <h4>`+tour_package.name+`</h4>
                                    <span><i class="fa fa-calendar" aria-hidden="true"></i>
                                   `+tour_package.departure_date_f+` - `+tour_package.arrival_date_f+`
                                    </span>
                                   <br/>
                                   <span><i class="fa fa-clock-o" aria-hidden="true"></i> `+tour_package.duration+` Days</span>
                                   <br/>
                               </div>
                           </div>
                       </div>`;
                   }

                   text += `
                   <div class="row" style="margin-top: 15px;">
                        <div class="col-lg-12">
                            <div id="tour_review_rooms" style="padding:15px; background-color:white; border:1px solid #cdcdcd;">
                                <div class="row">
                                    <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                        <h4 class="mb-3">
                                            <img src="/static/tt_website/images/icon/product/b-hotel.png" alt="undefined" style="width:20px; height:20px;">
                                            Accommodation(s)
                                        </h4>
                                    </div>
                                </div>`;
                                for(i in rooms){
                                    text+=`
                                    <h5 class="single_border_custom_left" style="padding-left:5px;">
                                        `+rooms[i].room_index+`. `+rooms[i].room_name+`
                                    </h5>`;
                                    if(rooms[i].room_bed_type != 'none')
                                    {
                                        text+=`<b>Type: </b><i>`+rooms[i].room_bed_type+`</i><br>`;
                                    }
                                    if(rooms[i].room_hotel)
                                    {
                                        text+=`<b>Hotel: </b><i>`+rooms[i].room_hotel+`</i><br>`;
                                    }
                                    text+=`
                                    <b>Description: </b><i>`+rooms[i].room_desc+`</i><br>
                                    <b>Notes: </b><i>`+rooms[i].room_notes+`</i><br>`;
                                    if(parseInt(i) != (rooms.length-1)){
                                        text+=`<hr/>`;
                                    }
                                }
                                text += `
                            </div>
                        </div>
                    </div>`;

                    text += `
                    <div class="row" style="margin-top: 15px;">
                        <div class="col-lg-12">
                            <div id="tour_review_booker" style="border:1px solid #cdcdcd; padding:15px; background-color:white; margin-top:20px;">
                                <div class="row">
                                    <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">
                                        <h4 class="mb-3"><i class="fas fa-user"></i> Contact Information</h4>
                                    </div>
                                </div>
                                <h4>
                                    `+contact.title+`. `+contact.name+`
                                </h4>
                                <b>Email: </b><i>`+contact.email+`</i><br>
                                <b>Phone: </b><i>`+contact.phone+`</i><br>
                            </div>
                        </div>
                    </div>`;

                   text += `
                   <div class="row" style="margin-top: 15px;">
                        <div class="col-lg-12">
                            <div id="tour_review_passenger" style="border:1px solid #cdcdcd; padding:15px; background-color:white; margin-top:20px;">
                                <div class="row">
                                    <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">
                                        <h4 class="mb-3"><i class="fas fa-users"></i> List of Guest(s)</h4>
                                    </div>
                                </div>`;
                                temp_pax_seq = 1
                                for(i in passengers){
                                    text+=`
                                    <h5 class="single_border_custom_left" style="padding-left:5px;">
                                        `+temp_pax_seq+`. `+passengers[i].title+`. `+msg.result.response.passengers[i].name+`
                                        <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                                            <i class="fas fa-user"></i> `;
                                            if(passengers[i].pax_type == 'ADT'){
                                                 text+=` Adult`;
                                            }else if(passengers[i].pax_type == 'CHD'){
                                                 text+=` Child`;
                                            }else if(passengers[i].pax_type == 'INF'){
                                                 text+=` Infant`;
                                            }
                                        text+=`
                                        </b>
                                    </h5>
                                    <b>Birth Date: </b><i>`+passengers[i].birth_date+`</i><br>
                                    <b>Room: </b><i>`+passengers[i].tour_room_string+`</i><br>`;
                                    if(parseInt(i) != (passengers.length-1)){
                                        text+=`<hr/>`;
                                    }
                                    temp_pax_seq += 1;
                                }
                               text += `
                            </div>
                        </div>
                    </div>`;

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

                    <div class="row" style="margin-top: 20px;">
                        <div class="col-lg-6" id="voucher" style="padding-bottom:10px;">`;

                       if(book_obj.state == 'booked')
                       {
                            text+=`
                                <button type="button" id="button-print-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+book_obj.order_number+`', 'itinerary','tour');">
                                    Print Form
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                       }

                       text += `</div>
                                <div class="col-lg-6" style="padding-bottom:10px;">`;
                       if(book_obj.state == 'booked')
                       {
                            text+=`
                                <button type="button" id="button-print-itin-price" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+book_obj.order_number+`', 'itinerary_price','tour');">
                                    Print Form (Price)
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                       }
                       else if(book_obj.state == 'issued'){
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

                                                    <div class="row">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2">
                                                            <span class="control-label" for="Name">Included Passengers</span>
                                                            <table style="border: 1px solid; width:100%;">`;
                                                            for (resv_pax in tr_get_booking.result.response.passengers)
                                                            {
                                                                text += `<tr>
                                                                    <td><span id="resv_pax_value`+resv_pax+`">`+tr_get_booking.result.response.passengers[resv_pax].name+`, `+tr_get_booking.result.response.passengers[resv_pax].title+`</span></td>
                                                                    <td><input type="checkbox" id="resv_pax_checkbox`+resv_pax+`" name="resv_pax_checkbox`+i+`" checked /></td>
                                                                </tr>`;
                                                            }
                                               text += `</table></div>
                                                    </div>

                                                    <br/>
                                                    <div style="text-align:right;">
                                                        <span>Don't want to edit? just submit</span>
                                                        <br/>
                                                        <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+book_obj.order_number+`', 'invoice','tour');">
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
                                `;
                       }
                       text += `</div>
                            </div>
                       `;
                    document.getElementById('tour_final_info').innerHTML = text;
                    document.getElementById('product_title').innerHTML = tour_package.name;
                    document.getElementById('product_type_title').innerHTML = book_obj.departure_date_str+' - '+book_obj.arrival_date_str;
                    price_text = '';
                    $test = tour_package.name+'\n'+book_obj.departure_date_str+' - '+book_obj.arrival_date_str+'\n';
                    $test += '‣ Status: ' + conv_status+'\n';

                    //detail
                    text = '';
                    tax = 0;
                    fare = 0;
                    total_price = 0;
                    total_price_for_discount = 0;
                    commission = 0;
                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'DISC'];
                    disc = 0;
                    //repricing
                    type_amount_repricing = ['Repricing'];
                    //repricing

                    $test += '\n‣ Contact Person:\n';
                    $test += msg.result.response.contact.title + ' ' + msg.result.response.contact.name + '\n';
                    $test += msg.result.response.contact.email + '\n';
                    $test += msg.result.response.contact.phone+ '\n';

                    counter_service_charge = 0;
                    $test += '\n‣ Price:\n';
                    currency = '';
                    for(i in msg.result.response.provider_booking){
                        try{
                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                price_text+=`
                                    <div style="text-align:left">
                                        <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_booking[i].pnr+` </span>
                                    </div>`;
                                for(j in msg.result.response.passengers){
                                    price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                                    csc = 0;
                                    for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_booking[i].pnr]){
                                        price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_booking[i].pnr][k].amount;
                                        if(price['currency'] == ''){
                                            price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_booking[i].pnr][k].currency;
                                            currency = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_booking[i].pnr][k].currency;
                                        }
                                    }
                                    disc -= price['DISC'];
                                    if(i ==0 ){
                                        //HANYA PROVIDER PERTAMA KARENA UPSELL PER PASSENGER BUKAN PER JOURNEY
                                        try{
    //                                        price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
                                            csc += msg.result.response.passengers[j].channel_service_charges.amount;
                                        }catch(err){
                                            console.log(err); // error kalau ada element yg tidak ada
                                        }
                                    }
                                    //repricing
                                    check = 0;
                                    if(price_arr_repricing.hasOwnProperty(msg.result.response.passengers[j].pax_type) == false){
                                        price_arr_repricing[msg.result.response.passengers[j].pax_type] = {}
                                        pax_type_repricing.push([msg.result.response.passengers[j].pax_type, msg.result.response.passengers[j].pax_type]);
                                    }
                                    price_arr_repricing[msg.result.response.passengers[j].pax_type][msg.result.response.passengers[j].name] = {
                                        'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                                        'Tax': price['TAX'] + price['ROC'] - csc,
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

                                    price_text+=`
                                    <div class="row" style="margin-bottom:5px;">
                                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                            <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` </span>`;
                                        price_text+=`</div>
                                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                            <span style="font-size:13px;`;
                                            if(is_show_breakdown_price){
                                                price_text+=`cursor:pointer;" id="passenger_breakdown`+j+`"`;
                                            }else{
                                                price_text+=`"`;
                                            }

//                                        if(counter_service_charge == 0){
//                                        price_text+=`
//                                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC))+`</span>`;
//                                        }else{
//                                            price_text+=`
//                                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC))+`</span>`;
//                                        }
                                        price_text+=`
                                            >`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC));
                                        if(is_show_breakdown_price)
                                            price_text+=`<i class="fas fa-caret-down"></i>`;
                                        price_text += `</span>`;
                                        price_text+=`
                                        </div>
                                    </div>`;
                                    if(counter_service_charge == 0){
                                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.DISC);
                                        total_price_for_discount += parseInt(price.FARE);
                                        $test += msg.result.response.passengers[j].name + ' ['+msg.result.response.provider_booking[i].pnr+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.DISC))+'\n';
                                    }else{
                                        $test += msg.result.response.passengers[j].name + ' ['+msg.result.response.provider_booking[i].pnr+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.FARE + price.DISC))+'\n';
                                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.DISC);
                                        total_price_for_discount += parseInt(price.FARE);
                                    }
                                    commission += parseInt(price.RAC);
                                    total_price_provider.push({
                                        'pnr': msg.result.response.provider_booking[i].pnr,
                                        'provider': msg.result.response.provider_booking[i].provider,
                                        'price': JSON.parse(JSON.stringify(price))
                                    });
                                }
    //                            if(csc != 0){
    //                                price_text+=`
    //                                    <div class="row" style="margin-bottom:5px;">
    //                                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
    //                                            <span style="font-size:12px;">Other service charges</span>`;
    //                                        price_text+=`</div>
    //                                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
    //                                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(csc))+`</span>
    //                                        </div>
    //                                    </div>`;
    //                            }
                                counter_service_charge++;
                        }catch(err){
                            console.log(err)
                        }
                    }

                    grand_total = total_price;
                    if(disc != 0){
                        price_text+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Discount</span>`;
                                price_text+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` -`+getrupiah(parseInt(disc))+`</span>
                                </div>
                            </div>`;
                    }
                    price_text+= `
                     <hr style="padding:0px;">
                     <div class="row">
                          <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                               <span style="font-weight:bold">Grand Total</span>
                          </div>
                          <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                               <span id="total_price" style="font-weight:bold;`;
                            if(is_show_breakdown_price)
                                price_text+='cursor:pointer;';
                            price_text +=`;">`+price.currency+` `+getrupiah(Math.ceil(total_price));
                            if(is_show_breakdown_price)
                                price_text+=`<i class="fas fa-caret-down"></i>`;
                            price_text+=`
                                </span>
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
                                            price_text+=`
                                                <div class="col-lg-12" style="text-align:right;">
                                                    <span style="font-size:13px; font-weight:bold;" id="total_price_`+k+`"> Estimated `+k+` `+price_convert+`</span><br/>
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
                            price_text+=`
                                    <div class="row">
                                        <div class="col-lg-12" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;" id="total_price_`+msg.result.response.estimated_currency.other_currency[k].currency+`"> Estimated `+msg.result.response.estimated_currency.other_currency[k].currency+` `+getrupiah(msg.result.response.estimated_currency.other_currency[k].amount)+`</span><br/>
                                        </div>
                                    </div>`;
                        }
                    }
                    if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        price_text+=`
                     <div style="text-align:right; padding-bottom:10px; margin-top:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                    else if(msg.result.response.state == 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        price_text+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_booker.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                        document.getElementById('repricing_type').innerHTML = '<option value="booker">Booker</option>';
                        $('#repricing_type').niceSelect('update');
                        reset_repricing();
                    }
                     price_text+=`<div class="row">
                        <div class="col-lg-12" style="padding-bottom:10px;">
                            <hr/>
                            <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                            share_data();
                            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                            if (isMobile) {
                                price_text+=`
                                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                            } else {
                                price_text+=`
                                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                            }

                        price_text+=`
                        </div>
                     </div>`;
                     if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false && user_login.co_agent_frontend_security.includes('see_commission')){
                        price_text+=`
                         <div class="row" id="show_commission" style="display:none;">
                            <div class="col-lg-12 col-xs-12" style="text-align:center;">
                                <div class="alert alert-success">
                                    <div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">YPM</span>
                                        </div>
                                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span>
                                        </div>
                                    </div>`;
                                    if(msg.result.response.hasOwnProperty('agent_nta') == true){
                                        total_nta = 0;
                                        total_nta = msg.result.response.agent_nta;
                                        price_text+=`<div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">Agent NTA</span>
                                        </div>
                                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(total_nta)+`</span>
                                        </div>
                                    </div>`;
                                    }
                                    if(msg.result.response.hasOwnProperty('total_nta') == true){
                                        total_nta = 0;
                                        total_nta = msg.result.response.total_nta;
                                        price_text+=`<div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">HO NTA</span>
                                        </div>
                                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(total_nta)+`</span>
                                        </div>
                                    </div>`;
                                    }
                                    price_text+=`
                                </div>
                            </div>
                         </div>`;
                     }
                     price_text+=`

                     <div class="row" style="margin-top:10px; text-align:center;">
                       <div class="col-xs-12">
                            <input type="button" class="primary-btn-white" onclick="copy_data();" value="Copy" style="width:100%;"/>
                       </div>
                     </div>`;
                     if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                         price_text+=`
                         <div class="row" style="margin-top:10px; text-align:center;">
                           <div class="col-xs-12" style="padding-bottom:10px;">
                                <input type="button" class="primary-btn-white" id="show_commission_button" value="Show YPM" style="width:100%;" onclick="show_commission();"/>
                           </div>
                         </div>`;
                    $test+= '\n‣ Grand Total: '+`+price.currency+`+' '+ getrupiah(Math.ceil(total_price))+'\nPrices and availability may change at any time';
                    document.getElementById('tour_detail_table').innerHTML = price_text;

                    if(is_show_breakdown_price){
                        var price_breakdown = {};
                        var currency_breakdown = '';
                        for(i in tr_get_booking.result.response.passengers){
                            price_breakdown = {};
                            for(j in tr_get_booking.result.response.passengers[i].service_charge_details){
                                for(k in tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges){
                                    for(l in tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                        currency_breakdown = tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges[k][l].currency;
                                        break;
                                    }
                                }
                                if(!price_breakdown.hasOwnProperty('FARE'))
                                    price_breakdown['FARE'] = 0;
                                if(!price_breakdown.hasOwnProperty('TAX'))
                                    price_breakdown['TAX'] = 0;
                                if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                                    price_breakdown['BREAKDOWN'] = 0;
                                if(!price_breakdown.hasOwnProperty('COMMISSION'))
                                    price_breakdown['COMMISSION'] = 0;
                                if(!price_breakdown.hasOwnProperty('NTA TOUR'))
                                    price_breakdown['NTA TOUR'] = 0;
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
                                if(!price_breakdown.hasOwnProperty('COMMISSION HO'))
                                    price_breakdown['COMMISSION HO'] = 0;

                                price_breakdown['FARE'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_fare_ori;
                                price_breakdown['TAX'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_tax_ori;
                                price_breakdown['BREAKDOWN'] = 0;
                                price_breakdown['COMMISSION'] = (tr_get_booking.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                                price_breakdown['NTA TOUR'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                                price_breakdown['SERVICE FEE'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                                price_breakdown['VAT'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                                price_breakdown['OTT'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_price_ori;
                                price_breakdown['TOTAL PRICE'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_price;
                                price_breakdown['NTA AGENT'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_nta;
                                price_breakdown['COMMISSION HO'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                                for(k in tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges){
                                    if(k == 'ROC'){
                                        for(l in tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                            if(tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                                price_breakdown['CHANNEL UPSELL'] = tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                                var breakdown_text = '';
                                for(k in price_breakdown){
                                    if(breakdown_text)
                                        breakdown_text += '<br/>';
                                    breakdown_text += '<b>'+k+'</b> ';
                                    if(j != 'BREAKDOWN')
                                        breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[k]);
                                }
                                new jBox('Tooltip', {
                                    attach: '#passenger_breakdown'+i,
                                    target: '#passenger_breakdown'+i,
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
                                price_breakdown = {};
                                breakdown_text = '';
                                currency_breakdown = '';
                            }
                        }

                        price_breakdown = {};
                        for(i in tr_get_booking.result.response.passengers){
                            for(j in tr_get_booking.result.response.passengers[i].service_charge_details){
                                if(!price_breakdown.hasOwnProperty('FARE'))
                                    price_breakdown['FARE'] = 0;
                                if(!price_breakdown.hasOwnProperty('TAX'))
                                    price_breakdown['TAX'] = 0;
                                if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                                    price_breakdown['BREAKDOWN'] = 0;
                                if(!price_breakdown.hasOwnProperty('COMMISSION'))
                                    price_breakdown['COMMISSION'] = 0;
                                if(!price_breakdown.hasOwnProperty('NTA TRAIN'))
                                    price_breakdown['NTA TOUR'] = 0;
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
                                if(!price_breakdown.hasOwnProperty('COMMISSION HO'))
                                    price_breakdown['COMMISSION HO'] = 0;
                                if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                                    price_breakdown['CHANNEL UPSELL'] = 0;

                                price_breakdown['FARE'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_fare_ori;
                                price_breakdown['TAX'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_tax_ori;
                                price_breakdown['BREAKDOWN'] = 0;
                                price_breakdown['COMMISSION'] += (tr_get_booking.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                                price_breakdown['NTA TOUR'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                                price_breakdown['SERVICE FEE'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                                price_breakdown['VAT'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                                price_breakdown['OTT'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_price_ori;
                                price_breakdown['TOTAL PRICE'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_price;
                                price_breakdown['NTA AGENT'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_nta;
                                price_breakdown['COMMISSION HO'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                                for(k in tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges){
                                    if(k == 'ROC'){
                                        for(l in tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                            if(tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                                price_breakdown['CHANNEL UPSELL'] += tr_get_booking.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
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
                            add_breakdown = true
                            if(j == 'CHANNEL UPSELL' && price_breakdown[j] == 0)
                                add_breakdown = false;
                            if(add_breakdown){
                                if(breakdown_text)
                                    breakdown_text += '<br/>';
                                breakdown_text += '<b>'+j+'</b> ';
                                if(j != 'BREAKDOWN')
                                    breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
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
                    add_repricing();
                    if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                        try{
                            render_voucher(price.currency,msg.result.response.voucher_discount, msg.result.response.state)
                        }catch(err){console.log(err);}
                    }
                   if(cur_state == 'booked')
                   {
                       grand_total = total_price;
                       full_pay_opt = document.getElementById('full_payment_amt');
                       if (full_pay_opt)
                       {
                           full_pay_opt.innerHTML = price.currency + ' ' + getrupiah(grand_total);
                       }
                       print_payment_rules(payment);
                       try{
                           if(can_issued){
                               if(user_login.co_job_position_is_request_required == true && msg.result.response.issued_request_status != "approved")
                               {
                                    document.getElementById('final_issued_btn').setAttribute("onClick", "tour_request_issued('"+msg.result.response.order_number+"');");
                                    if(msg.result.response.issued_request_status == "on_process")
                                    {
                                        document.getElementById('final_issued_btn').innerHTML = "Issued Booking Requested";
                                        document.getElementById('final_issued_btn').disabled = true;
                                    }
                                    else
                                    {
                                        document.getElementById('final_issued_btn').innerHTML = "Request Issued Booking";
                                    }
                               }
                               check_payment_payment_method(order_number, 'Issued', book_obj.booker.seq_id, 'billing', 'tour', signature, msg.result.response.payment_acquirer_number, msg);
            //                   get_payment_acq('Issued', book_obj.booker.seq_id, order_number, 'billing',signature,'tour');
                               document.getElementById("final_issued_btn").style.display = "block";
                           }
                       }catch(err){
                           console.log(err); // error kalau ada element yg tidak ada
                       }
                   }
                   else
                   {
                       $('#final_issued_btn').remove();
                   }
               }catch(err){
                   console.log(err);
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error tour booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                    }).then((result) => {
                      window.location.href = '/reservation';
                    })
               }
            }else if(msg.result.error_code == 1035){
                    document.getElementById('tour_detail').hidden = true;
                    render_login('tour');
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error tour booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour get booking');
       },timeout: 60000
    });
}

function get_price_itinerary(request,type) {
    dict_req = JSON.parse(request);
    get_price_req = {
       'tour_code': dict_req.tour_code,
       'room_list': JSON.stringify(dict_req.room_list),
       'provider': tour_data.provider,
       'signature': signature
    }
    if (tour_data.tour_type.is_open_date)
    {
        get_price_req['tour_line_code'] = dict_req.tour_line_code;
        get_price_req['departure_date'] = dict_req.departure_date;
    }
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_pricing',
       },
       data: get_price_req,
       success: function(msg) {
            last_session = 'sell_journeys'
            table_price_update(msg,type);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour price itinerary');
       },timeout: 60000
    });
}

function table_price_update(msg,type){
    if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){
        tax = 0;
        fare = 0;
        total_price = 0;
        total_price_provider = [];
        price_provider = 0;
        commission = 0;
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
        type_amount_repricing = ['Repricing'];
        for(i in all_pax){
            if(price_arr_repricing.hasOwnProperty(all_pax[i].pax_type) == false){
                price_arr_repricing[all_pax[i].pax_type] = {}
                pax_type_repricing.push([all_pax[i].pax_type, all_pax[i].pax_type]);
            }
            price_arr_repricing[all_pax[i].pax_type][all_pax[i].first_name +all_pax[i].last_name] = {
                'Fare': 0,
                'Tax': 0,
                'Repricing': 0
            }
        }
        //repricing
        text_repricing = `
        <div class="col-lg-12">
            <div style="padding:5px;" class="row">
                <div class="col-lg-6"></div>
                <div class="col-lg-6">Repricing</div>
            </div>
        </div>`;
        for(k in price_arr_repricing){
            for(l in price_arr_repricing[k]){
                text_repricing += `
                <div class="col-lg-12">
                    <div style="padding:5px;" class="row" id="adult">
                        <div class="col-lg-6" id="`+l+`_`+k+`">`+l+`</div>
                        <div hidden id="`+l+`_price">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                        if(price_arr_repricing[k][l].Repricing == 0)
                            text_repricing+=`<div class="col-lg-6" id="`+l+`_repricing">-</div>`;
                        else
                            text_repricing+=`<div class="col-lg-6" id="`+l+`_repricing">`+getrupiah(price_arr_repricing[k][l].Repricing)+`</div>`;
                        text_repricing+=`<div hidden id="`+l+`_total">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                    </div>
                </div>`;
            }
        }
        text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
        document.getElementById('repricing_div').innerHTML = text_repricing;
        //repricing
        price_discount = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
        for(i in msg.result.response.service_charges){
            price_discount[msg.result.response.service_charges[i].charge_type] += msg.result.response.service_charges[i].total;
        }
        total_price_provider.push({
            'provider': provider,
            'price': price_discount
        });
    }
    grand_total = 0;
    var grand_commission = 0;
    $test = '';
    temp_copy_adt = '';
    temp_copy_chd = '';
    temp_copy_inf = '';
    temp_copy2 = '';

    $('#loading-price-tour').hide();
    price_tour_info = msg.result.response.tour_info;
    $test += price_tour_info.name + '\n';
    try{
        if (document.getElementById('product_date').innerHTML != ' - ' && document.getElementById('product_date').innerHTML != '')
        {
            $test += document.getElementById('product_date').innerHTML + '\n\n';
        }
        else
        {
            $test += '\n';
        }
    }catch(err){
        $test += '\n';
    }

    if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){
        try{
             if (booker)
             {
                $test += 'Booker:\n';
                $test += booker.title + ' ' + booker.first_name + ' ' + booker.last_name + '\n';
                $test += booker.email + '\n';
                $test += booker.mobile + '\n\n';
             }
            for(i in all_pax){
                if(i == 0)
                    $test += 'Passengers:\n';
                $test += all_pax[i].title + ' ' + all_pax[i].first_name + ' ' + all_pax[i].last_name + '\n';
            }
            $test +='\n';
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
    }

    price_data = msg.result.response.service_charges;
    price_txt_adt = ``;
    price_txt_chd = ``;
    price_txt_inf = ``;
    price_txt2 = ``;
    adt_price = 0;
    chd_price = 0;
    inf_price = 0;
    adt_amt = 0;
    chd_amt = 0;
    inf_amt = 0;
    room_prices = [];
    total_charge = 0;
    currency = '';
    for (i in price_data)
    {
        if(!price_data[i].charge_code.split('.').includes('room'))
        {
            if(['fare', 'roc'].includes(price_data[i].charge_code))
            {
                if(price_data[i].pax_type == 'ADT')
                {
                    if(price_data[i].pax_count != 0){
                        if(price_data[i].hasOwnProperty('currency') && !currency)
                            currency = price_data[i].currency;
                        price_txt_adt += `
                        <div class="row">
                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                               <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+`</span>
                           </div>
                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"></div>
                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align:left;">
                               @`+currency+` `+getrupiah(price_data[i].amount)+`
                           </div>
                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align: right;">
                               <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(price_data[i].total)+`</span>
                           </div>
                        </div>`;
                        temp_copy_adt += String(price_data[i].pax_count) + ' ' + price_data[i].description + ' @'+currency+' ' + getrupiah(price_data[i].amount) + '\n';
                        grand_total += price_data[i].total;
                        total_charge += price_data[i].total;
                    }
                }
                else if(price_data[i].pax_type == 'CHD')
                {
                    if(price_data[i].pax_count != 0){
                        if(price_data[i].hasOwnProperty('currency') && !currency)
                            currency = price_data[i].currency;
                        price_txt_chd += `
                        <div class="row">
                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                               <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+`</span>
                           </div>
                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"></div>
                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align: left;">
                               @ `+currency+` `+getrupiah(price_data[i].amount)+`
                           </div>
                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align: right;">
                               <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(price_data[i].total)+`</span>
                           </div>
                        </div>`;
                        temp_copy_chd += String(price_data[i].pax_count) + ' ' + price_data[i].description + ' @'+currency+' ' + getrupiah(price_data[i].amount) + '\n';
                        grand_total += price_data[i].total;
                        total_charge += price_data[i].total;
                    }
                }
                else if(price_data[i].pax_type == 'INF')
                {
                    if(price_data[i].pax_count != 0){
                        if(price_data[i].hasOwnProperty('currency') && !currency)
                            currency = price_data[i].currency;
                        price_txt_inf += `
                        <div class="row">
                             <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                 <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+`</span>
                             </div>
                             <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;"></div>
                             <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align:left;">
                                 @ `+currency+` `+getrupiah(price_data[i].amount)+`
                             </div>
                             <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align: right;">
                                 <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(price_data[i].total)+`</span>
                             </div>
                        </div>`;
                        temp_copy_inf += String(price_data[i].pax_count) + ' ' + price_data[i].description + ' @'+currency+' ' + getrupiah(price_data[i].amount) + '\n';
                        grand_total += price_data[i].total;
                        total_charge += price_data[i].total;
                    }
                }
            }
            else if(price_data[i].charge_type != 'RAC')
            {
                if(price_data[i].pax_count != 0){
                    if(price_data[i].hasOwnProperty('currency') && !currency)
                        currency = price_data[i].currency;
                    price_txt2 += `<div class="row">`;

                    if(i == 0){
                        price_txt2 +=`
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:bold;">Charge</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">

                        </div>`;
                    }
                    if(typeof upsell_price_dict !== 'undefined' && price_data[i].pax_type in upsell_price_dict && price_data[i].charge_type == 'FARE' && price_data[i].charge_code == 'fare.flight')
                        price_txt2 += `
                        <div class="col-lg-12" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+` </span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align:left;">
                            @ `+currency+` `+getrupiah(price_data[i].amount + (upsell_price_dict[price_data[i].pax_type]/price_data[i].pax_count))+`
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align: right;">
                            <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(price_data[i].total + upsell_price_dict[price_data[i].pax_type])+`</span>
                        </div>`;
                    else
                        price_txt2 += `
                        <div class="col-lg-12" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+`</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align:left;">
                            @ `+currency+` `+getrupiah(price_data[i].amount)+`
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align: right;">
                            <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(price_data[i].total)+`</span>
                        </div>`;
                    price_txt2 += `
                    </div>`;
                    temp_copy2 += String(price_data[i].pax_count) + ' ' + price_data[i].description + ' @'+currency+' ' + getrupiah(price_data[i].amount) + '\n';
                    grand_total += price_data[i].total;
                    total_charge += price_data[i].total;
                }
            }
            else if(price_data[i].charge_code == 'rac')
            {
                grand_commission += (price_data[i].total * -1);
            }
        }
        else
        {
            room_prices.push(price_data[i]);
        }
    }
    var pax_type = ''
    for(i in price_data){
        if(pax_type != price_data[i].pax_type){
            if(typeof upsell_price_dict !== 'undefined' && price_data[i].pax_type in upsell_price_dict){
                grand_commission += upsell_price_dict[price_data[i].pax_type];
            }
            pax_type = price_data[i].pax_type;
        }
    }
    price_txt2 += `
    <div class="row mt-2">
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
            <span style="font-size:13px; font-weight:bold;">Total Charge</span>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
            <span style="font-size:13px; font-weight:bold;" id="total_charge_pd"></span>
        </div>
        <div class="col-lg-12">
            <hr/>
        </div>
    </div>`;
    price_txt2 += `<div class="row">
    <div class="col-lg-12">
        <center><h6 style="margin-top:10px; color:`+color+`; display:block; cursor:pointer;" id="price_detail_tour_down" onclick="show_hide_div('price_detail_tour_div');">See Detail <i class="fas fa-chevron-down" style="font-size:14px;"></i></h6></center>
    </div>
    <div class="col-lg-12 mt-1" id="price_detail_tour_div" style="display:none;">`;
    for(var j=0; j<room_amount; j++)
    {
        sub_total_count = 0;
        price_txt2 += `<div class="row"><div class="col-xs-12"><span style="font-weight: bold; color:`+color+`;">Room #`+String(j+1)+`</span></div></div>`;
        temp_copy2 += '\nRoom ' + String(j+1) + '\n';
        found_room_price = false;
        for(var k=0; k<room_prices.length; k++)
        {
            if(room_prices[k].charge_code.split('.').includes(String(j+1)))
            {
                found_room_price = true;
                price_txt2 += `
                <div class="row">
                    <div class="col-lg-12" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">`+room_prices[k].pax_count+`x `+room_prices[k].description+`</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align:left;">
                        @ `+currency+` `+getrupiah(room_prices[k].amount)+`
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-2" style="text-align: right;">
                        <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(room_prices[k].total)+`</span>
                    </div>
                </div>`;
                sub_total_count += room_prices[k].total;
                grand_total += room_prices[k].total;
                temp_copy2 += String(room_prices[k].pax_count) + ' ' + room_prices[k].description + ' @'+currency+' ' + getrupiah(room_prices[k].amount) + '\n';
            }
        }

        price_txt2 += `
        <div class="row mt-2">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                <span style="font-size:13px; font-weight:bold;">Subtotal</span>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(sub_total_count)+`</span>
            </div>
        </div>`;

        if (!found_room_price)
        {
            price_txt2 += `<div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                    <span style="font-size:13px; font-weight:500;">(No Charge)</span>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                                    <span style="font-size:13px; font-weight:500;">N/A</span>
                                </div>
                           </div>`;
            temp_copy2 += '(No Charge)\n';
        }
        price_txt2 += `<div class="row"><div class="col-lg-12"><hr/></div></div>`;
    }
    price_txt2+=`
    <div class="col-lg-12">
        <center><h6 style="color:`+color+`; display:block; cursor:pointer;" id="price_detail_tour_up" onclick="show_hide_div('price_detail_tour_div');">Show Less <i class="fas fa-chevron-up" style="font-size:14px;"></i></h6></center>
    </div>`;
    price_txt2 += `</div></div>`;
    try{
        for(i in upsell_price_dict)
            grand_total += upsell_price_dict[i];
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    price_txt = price_txt_adt + price_txt_chd + price_txt_inf + price_txt2;
    $test += '‣ Price\n';
    $test += temp_copy_adt + temp_copy_chd + temp_copy_inf + temp_copy2;
    $test += '\n‣ Grand Total : '+currency+' '+ getrupiah(grand_total)+
    '\nPrices and availability may change at any time';
    price_txt += `<hr style="padding:0px;">`;
    if(document.URL.split('/')[document.URL.split('/').length-2] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
        price_txt +=`<div style="text-align:right;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
    }
    // pindah ke pax
//    try{
//        if(upsell_price != 0){
//            price_txt+=`<div class="row" style="padding-bottom:15px;">`
//            price_txt+=`
//            <div class="col-lg-7" style="text-align:left;">
//                <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
//            </div>
//            <div class="col-lg-5" style="text-align:right;">`;
//            price_txt+=`
//                <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(upsell_price)+`</span><br/>`;
//            price_txt+=`</div></div>`;
//        }
//    }catch(err){
//        console.log(err); // error kalau ada element yg tidak ada
//    }
    price_txt += `
                   <div class="row">
                        <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                        <div class="col-xs-4" style="text-align: right;"><span id="total_price" style="font-weight:bold;`;
//                    if(is_show_breakdown_price){
//                        price_txt+= "cursor:pointer;";
//                    }
                    price_txt += `">`+currency+` `+getrupiah(grand_total);
//                    if(is_show_breakdown_price)
//                        price_txt+=`<i class="fas fa-caret-down"></i>`;
                    price_txt+=`</span>
                        </div>
                   </div>`;
    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && grand_total){
        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                try{
                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                        price_convert = (parseFloat(grand_total)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                        if(price_convert%1 == 0)
                            price_convert = parseInt(price_convert);
                        price_txt+=`
                            <div class="row">
                                <div class="col-xs-12" style="text-align: right;">
                                    <span style="font-weight:bold" id="total_price_`+k+`"> Estimated `+k+` `+price_convert+`</span>
                                </div>
                            </div>`;
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
    }
    price_txt +=`
                   <div class="row">
                        <div class="col-lg-12" style="padding-bottom:10px;">
                            <hr/>
                            <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                            share_data();
                            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                            if (isMobile) {
                                price_txt+=`
                                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                            } else {
                                price_txt+=`
                                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                            }

                        price_txt+=`
                        </div>
                   </div>`;
                   if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                       price_txt+= print_commission(grand_commission,'show_commission', currency)
                   price_txt+=`
                   <div class="row" style="margin-top:10px; text-align:center;">
                       <div class="col-lg-12">
                           <input type="button" class="primary-btn-white" onclick="copy_data();" value="Copy" style="width:100%;"/>
                       </div>
                   </div>`;
                   if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                       price_txt+=`
                       <div class="row" style="margin-top:10px; text-align:center;">
                           <div class="col-lg-12" style="padding-bottom:10px;">
                                <input type="button" id="show_commission_button" class="primary-btn-white" value="Show YPM" style="width:100%;" onclick="show_commission();"/>
                           </div>
                       </div>`;


    document.getElementById('tour_detail_table').innerHTML = price_txt;

//    if(is_show_breakdown_price){
//        var price_breakdown = {};
//        var currency_breakdown = '';
//        for (i in price_data){
//            for(var j=0; j<room_amount; j++)
//            {
//                for(var k=0; k<room_prices.length; k++)
//                {
//                    if(price_data[i].charge_type != 'RAC'){
//                        if(!price_breakdown.hasOwnProperty(price_data[i].charge_type))
//                            price_breakdown[price_data[i].charge_type] = 0;
//                        price_breakdown[price_data[i].charge_type] += price_data[i].total;
//                    }
//                    if(currency_breakdown == '')
//                        currency_breakdown = price_data[i].currency;
//                }
//            }
//        }
//
//        if(typeof upsell_price_dict !== 'undefined'){
//            for(i in upsell_price_dict){
//                if(!price_breakdown.hasOwnProperty('ROC'))
//                    price_breakdown['ROC'] = 0;
//                price_breakdown['ROC'] += upsell_price_dict[i];
//            }
//        }
//
//        var breakdown_text = '';
//        for(j in price_breakdown){
//            if(breakdown_text)
//                breakdown_text += '<br/>';
//            if(j != 'ROC')
//                breakdown_text += '<b>'+j+'</b> ';
//            else
//                breakdown_text += '<b>CONVENIENCE FEE</b> ';
//            breakdown_text += currency+' ' + getrupiah(price_breakdown[j]);
//        }
//        new jBox('Tooltip', {
//            attach: '#total_price',
//            target: '#total_price',
//            theme: 'TooltipBorder',
//            trigger: 'click',
//            adjustTracker: true,
//            closeOnClick: 'body',
//            closeButton: 'box',
//            animation: 'move',
//            position: {
//              x: 'left',
//              y: 'top'
//            },
//            outside: 'y',
//            pointer: 'left:20',
//            offset: {
//              x: 25
//            },
//            content: breakdown_text
//        });
//    }

    document.getElementById('total_charge_pd').innerHTML = `<span>`+currency+` `+getrupiah(total_charge)+`</span>`;
    if(type == 'detail'){
        if(agent_security.includes('book_reservation') == true)
        next_btn_txt = `<center>
                        <button type="button" class="btn-next primary-btn-ticket ld-ext-right" value="Next" onclick="check_detail();" style="width:100%;">
                            Next
                            <i class="fas fa-angle-right"></i>
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </center>`;
        else
        next_btn_txt = '';
        document.getElementById('tour_detail_next_btn').innerHTML = next_btn_txt;
    }else if(type == 'passenger'){
        next_btn_txt = `<center>
                        <button type="button" class="btn-next primary-btn-ticket ld-ext-right" value="Next" onclick="next_disabled();check_passenger(adult, child, infant);" style="width:100%;">
                            Next
                            <i class="fas fa-angle-right"></i>
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </center>`;
        document.getElementById('tour_detail_next_btn').innerHTML = next_btn_txt;
    }else if(type == 'review'){
        full_pay_opt = document.getElementById('full_payment_amt');
        if (full_pay_opt)
        {
            full_pay_opt.innerHTML = currency+' ' + getrupiah(grand_total);
        }
    }

}

function get_price_itinerary_cache(type) {
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_pricing_cache',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            tour_price = msg;
            table_price_update(msg,type);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour price itinerary');
       },timeout: 60000
    });
}

function tour_search_autocomplete(term,suggest){
    clearTimeout(tourAutoCompleteVar);
    term = term.toLowerCase();
    check = 0;
    var priority = [];

    getToken();
    tourAutoCompleteVar = setTimeout(function() {
        $.ajax({
           type: "POST",
           url: "/webservice/tour",
           headers:{
                'action': 'get_auto_complete',
           },
           data: {
                'name':term,
                'signature': signature
           },
           success: function(msg) {
            tour_choices = msg;
            suggest(tour_choices);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
           }
        });
    }, 150);
}

function show_hide_div(key){
    var show_div = document.getElementById(key+'_div');
    var btn_down = document.getElementById(key+'_down');
    var btn_up = document.getElementById(key+'_up');

    if (btn_down.style.display === "none") {
        btn_up.style.display = "none";
        btn_down.style.display = "inline-block";
        show_div.style.display = "none";
    }
    else {
        btn_up.style.display = "inline-block";
        btn_down.style.display = "none";
        show_div.style.display = "block";
    }
}

function upload_image(){
    var formData = new FormData($('#tour_review').get(0));
    formData.append('signature', signature)
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'update_image_passenger',
       },
       data: formData,
       success: function(msg) {
            if(msg.result.error_code == 0){
                img_list = msg.result.response;
                //adult
                for(var i=0;i<adult;i++){
                    index = i+1;
                    //list gambar identity
                    for(var j=0;j<100;j++){
                        try{
                            if(document.getElementById('adult_identity'+index+'_'+j+'_delete').checked == true)
                                img_list.push([document.getElementById('adult_identity'+index+'_'+j+'_image_seq_id').value, 2, "adult_files_attachment_identity1"]);
                        }catch(err){
                            //gambar habis
                            break;
                        }
                    }

                }
                //child
                for(var i=0;i<child;i++){
                    index = i+1;
                    //list gambar identity
                    for(var j=0;j<100;j++){
                        try{
                            if(document.getElementById('child_identity'+index+'_'+j+'_delete').checked == true)
                                img_list.push([document.getElementById('child_identity'+index+'_'+j+'_image_seq_id').value, 2, 'child_files_attachment_identity1']);
                        }catch(err){
                            //gambar habis
                            break;
                        }
                    }

                }
                //infant
                for(var i=0;i<infant;i++){
                    index = i+1;
                    //list gambar identity
                    for(var j=0;j<100;j++){
                        try{
                            if(document.getElementById('infant_identity'+index+'_'+j+'_delete').checked == true)
                                img_list.push([document.getElementById('infant_identity'+index+'_'+j+'_image_seq_id').value, 2, 'infant_files_attachment_identity1']);
                        }catch(err){
                            //gambar habis
                            break;
                        }
                    }

                }
                document.getElementById('image_list_data').value = JSON.stringify(img_list)
                document.getElementById('tour_review').submit();
                //document.getElementById('form_admin').submit();
            }else{
                //swal error image tidak terupload
                document.getElementById('tour_review').submit();
            }
       },
       contentType:false,
       processData:false,
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update passenger');
            document.getElementById('update_passenger_customer').disabled = false;
       }
    });
}