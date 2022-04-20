activity_data = [];
activity_type = [];
activity_type_pick = '';
activity_date = [];
activity_timeslot = '';
additional_price = 0;
event_pick = 0;
pricing_days = 1;
high_price_slider = 0;
low_price_slider = 99999999;
step_slider = 0;
last_session = '';
var month = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
}

function activity_redirect_signup(type){
    if(type != 'signin'){
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/activity",
           headers:{
                'action': 'login',
           },
    //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
           data: {},
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    activity_signature = msg.result.response.signature;
                    new_login_signature = msg.result.response.signature;

                    if(type != 'search'){
                        $.ajax({
                           type: "POST",
                           url: "/webservice/activity",
                           headers:{
                                'action': 'search',
                           },
                           data: {
                               'use_cache': true,
                               'signature': new_login_signature
                           },
                           success: function(msg) {
                               if(msg.result.error_code == 0){
                                    if(type != 'get_details'){
                                        $.ajax({
                                           type: "POST",
                                           url: "/webservice/activity",
                                           headers:{
                                                'action': 'get_details',
                                           },
                                           data: {
                                              'use_cache': true,
                                              'signature': new_login_signature,
                                           },
                                           success: function(msg) {
                                                if(type != 'get_price' && msg.result.error_code == 0){
                                                    $.ajax({
                                                       type: "POST",
                                                       url: "/webservice/activity",
                                                       headers:{
                                                            'action': 'get_pricing',
                                                       },
                                                       data: {
                                                            'signature': new_login_signature,
                                                            'use_cache': true,
                                                       },
                                                       success: function(msg) {
                                                            if(msg.result.error_code == 0){
                                                                if(type != 'sell_journeys'){
                                                                    $.ajax({
                                                                       type: "POST",
                                                                       url: "/webservice/activity",
                                                                       headers:{
                                                                            'action': 'sell_activity',
                                                                       },
                                                                       data: {
                                                                            'signature': new_login_signature,
                                                                       },
                                                                       success: function(msg) {
                                                                           if(msg.result.error_code == 0){
                                                                                $.ajax({
                                                                                   type: "POST",
                                                                                   url: "/webservice/activity",
                                                                                   headers:{
                                                                                        'action': 'update_contact',
                                                                                   },
                                                                                   data: {
                                                                                        'signature': new_login_signature
                                                                                   },
                                                                                   success: function(msg) {
                                                                                        $.ajax({
                                                                                           type: "POST",
                                                                                           url: "/webservice/activity",
                                                                                           headers:{
                                                                                                'action': 'update_passengers',
                                                                                           },
                                                                                           data: {
                                                                                                'signature': new_login_signature
                                                                                           },
                                                                                           success: function(msg) {
                                                                                                $.ajax({
                                                                                                   type: "POST",
                                                                                                   url: "/webservice/activity",
                                                                                                   headers:{
                                                                                                        'action': 'update_options',
                                                                                                   },
                                                                                                   data: {
                                                                                                        'signature': new_login_signature
                                                                                                   },
                                                                                                   success: function(msg) {
                                                                                                        signature = new_login_signature;
                                                                                                        if(type == 'review'){
                                                                                                            //ambil pax
                                                                                                             $.ajax({
                                                                                                               type: "POST",
                                                                                                               url: "/webservice/activity",
                                                                                                               headers:{
                                                                                                                    'action': 'activity_review_booking',
                                                                                                               },
                                                                                                               data: {
                                                                                                                    'signature': new_login_signature
                                                                                                               },
                                                                                                               success: function(msg) {
                                                                                                                    //bikin form isi input airline_pick csrf_token time_limit_input signature
                                                                                                                    document.getElementById('reload_page').innerHTML +=`
                                                                                                                        <input type='hidden' name="time_limit_input" value="`+time_limit+`"/>
                                                                                                                        <input type='hidden' id="activity_review_booking" name="activity_review_booking" value=""/>
                                                                                                                        <input type='hidden' id="pax_count" name="pax_count" value=""/>
                                                                                                                        <input type='hidden' id="all_price" name="all_price" value=""/>
                                                                                                                        <input type='hidden' id="printout_prices" name="printout_prices" value=""/>
                                                                                                                        <input type='hidden' id="printout_paxs" name="printout_paxs" value=""/>
                                                                                                                        <input type='hidden' id="additional_price" name="additional_price" value="`+additional_price+`"/>
                                                                                                                        <input type='hidden' name="signature" value='`+new_login_signature+`'/>
                                                                                                                    `;
                                                                                                                    try{
                                                                                                                        document.getElementById('activity_review_booking').value = JSON.stringify(msg);
                                                                                                                        document.getElementById('pax_count').value = JSON.stringify(pax_count);
                                                                                                                        document.getElementById('all_price').value = JSON.stringify(price);
                                                                                                                        document.getElementById('printout_prices').value = JSON.stringify(printout_prices);
                                                                                                                        document.getElementById('printout_paxs').value = JSON.stringify(printout_paxs);

                                                                                                                    }catch(err){
                                                                                                                        console.log(err); // error kalau ada element yg tidak ada
                                                                                                                    }
                                                                                                                    document.getElementById('reload_page').submit();
                                                                                                               },error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                                                               },timeout: 60000
                                                                                                             });
                                                                                                        }else{
                                                                                                            //bikin form isi input airline_pick csrf_token time_limit_input signature
                                                                                                            document.getElementById('reload_page').innerHTML +=`
                                                                                                                <input type='hidden' name="time_limit_input" value="`+time_limit+`"/>
                                                                                                                <input type='hidden' id="airline_pick" name="airline_pick" value=""/>
                                                                                                                <input type='hidden' id="airline_price_itinerary" name="airline_price_itinerary" value=""/>
                                                                                                                <input type='hidden' id="airline_price_itinerary_request" name="airline_price_itinerary_request" value=""/>
                                                                                                                <input type='hidden' id="additional_price_input" name="additional_price_input" value=""/>
                                                                                                                <input type='hidden' name="signature" value='`+new_login_signature+`'/>
                                                                                                            `;
                                                                                                            try{
                                                                                                                document.getElementById('airline_pick').value = JSON.stringify(airline_pick);
                                                                                                                document.getElementById('airline_price_itinerary').value = JSON.stringify(price_itinerary);
                                                                                                                document.getElementById('airline_price_itinerary_request').value = JSON.stringify(airline_get_price_request);
                                                                                                                document.getElementById('additional_price_input').value = JSON.stringify(additional_price);
                                                                                                            }catch(err){
                                                                                                                console.log(err); // error kalau ada element yg tidak ada
                                                                                                            }
                                                                                                            document.getElementById('reload_page').submit();
                                                                                                        }
                                                                                                        //location.reload();
                                                                                                   },
                                                                                                   error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                                                   },timeout: 60000
                                                                                                });
                                                                                           },
                                                                                           error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                                           },timeout: 60000
                                                                                        });
                                                                                   },
                                                                                   error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                                   },timeout: 60000
                                                                                });
                                                                           }
                                                                       },
                                                                       error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                       },timeout: 60000
                                                                    });
                                                                }else{
                                                                    signature = new_login_signature;
                                                                    $('#myModalSignin').modal('hide');
                                                                    location.reload();
                                                                }
                                                            }
                                                       },
                                                       error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                       },timeout: 60000
                                                    });
                                                }
                                           },
                                           error: function(XMLHttpRequest, textStatus, errorThrown) {
                                           },timeout: 120000
                                        });
                                    }else{
                                        signature = new_login_signature;
                                        $('#myModalSignin').modal('hide');
                                        location.reload();
                                    }
                               }
                           },
                           error: function(XMLHttpRequest, textStatus, errorThrown) {
                           },timeout: 120000 // sets timeout to 120 seconds
                        });
                    }else{
                        signature = new_login_signature;
                        $('#myModalSignin').modal('hide');
                        location.reload();
                    }
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

function activity_login(data, type=''){
    getToken();
    //document.getElementById('activity_category').value.split(' - ')[1]
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'login',
       },
       data: {

       },
       success: function(msg) {

           if(msg.result.error_code == 0){
               signature = msg.result.response.signature;
               get_carriers_activity();
               if(type == '' || data == ''){
                   activity_search();
               }else if(type == 'get_booking'){
                   activity_get_booking(data);
               }else if(type == 'get_details'){
                   activity_get_detail(data);
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $('#loading-search-activity').hide();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity login');
            $('#loading-search-activity').hide();
       },timeout: 60000
    });
}

function activity_passenger_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'passenger_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            price = msg.price;
            detail = msg.detail;
            passenger = msg.pax_count;
            activity_pax_data = msg.activity_pax_data;
            highlights = msg.highlights;
            response = msg.response;
            activity_table_detail2('passenger')

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-hotel').hide();
       },timeout: 180000
   });
}

function activity_review_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'review_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            pax_count = msg.pax_count;
            printout_paxs = msg.printout_paxs;
            printout_prices = msg.printout_prices;
            price = msg.price;
            detail = msg.options;
            passenger = msg.pax_count;
            booker = msg.booker;
            contact = msg.contact_person;
            all_pax = msg.all_pax;
            highlights = msg.highlights;
            response = msg.response;

            activity_table_detail2('review');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-hotel').hide();
       },timeout: 180000
   });
}

function get_carriers_activity(){
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           activity_carriers = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_activity_config(type, val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_data',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            activity_country = [];
            activity_categories = [];
            sub_category = {};

            var country_selection = document.getElementById('activity_countries');
            var type_selection = document.getElementById('activity_type');
            var category_selection = document.getElementById('activity_category');

            for(i in msg.activity_locations){
                for(j in msg.activity_locations[i].states)
                {
                    var city = [];
                    for(k in msg.activity_locations[i].states[j].cities)
                    {
                        city.push({
                            'name': msg.activity_locations[i].states[j].cities[k].name,
                            'id': msg.activity_locations[i].states[j].cities[k].uuid
                        });
                    }
                }
                activity_country.push({
                    'city': city,
                    'name': msg.activity_locations[i].name,
                    'id': msg.activity_locations[i].uuid
                });
            }

            for (i in msg.activity_categories)
            {
                var sub_cats = [];
                for(j in msg.activity_categories[i].children)
                {
                    sub_cats.push({
                        'name': msg.activity_categories[i].children[j].name,
                        'id': msg.activity_categories[i].children[j].uuid
                    });
                }
                activity_categories.push({
                    'sub_categories': sub_cats,
                    'name': msg.activity_categories[i].name,
                    'id': msg.activity_categories[i].uuid
                });
            }

            country_txt = '';
            type_txt = '';
            category_txt = '';
            if(type == 'search')
            {
                if (!parsed_country || parsed_country == 0)
                {
                    country_txt += `<option value="" selected="">All Countries</option>`;
                }
                else
                {
                    country_txt += `<option value="">All Countries</option>`;
                }
                for(i in activity_country)
                {
                    if (activity_country[i].id == parsed_country)
                    {
                        country_txt += `<option value="`+activity_country[i].id+`" selected>`+activity_country[i].name+`</option>`;
                        document.getElementById('search_country_name').innerHTML = activity_country[i].name;
                    }
                    else
                    {
                        country_txt += `<option value="`+activity_country[i].id+`">`+activity_country[i].name+`</option>`;
                    }
                }

                if (!parsed_type || parsed_type == 0)
                {
                    type_txt += `<option value="0" selected="">All Types</option>`;
                }
                else
                {
                    type_txt += `<option value="0">All Types</option>`;
                }
                for(i in msg.activity_types)
                {
                    if (msg.activity_types[i].uuid == parsed_type)
                    {
                        type_txt += `<option value="`+msg.activity_types[i].uuid+`" selected>`+msg.activity_types[i].name+`</option>`;
                        document.getElementById('search_type_name').innerHTML = msg.activity_types[i].name;
                    }
                    else
                    {
                        type_txt += `<option value="`+msg.activity_types[i].uuid+`">`+msg.activity_types[i].name+`</option>`;
                    }
                }

                if (!parsed_category || parsed_category == 0)
                {
                    category_txt += `<option value="0" selected="">All Categories</option>`;
                }
                else
                {
                    category_txt += `<option value="0">All Categories</option>`;
                }
                for(i in activity_categories)
                {
                    if (activity_categories[i].uuid == parsed_category)
                    {
                        category_txt += `<option value="`+activity_categories[i].id+` - `+activity_categories[i].name+`" selected>`+activity_categories[i].name+`</option>`;
                        document.getElementById('search_category_name').innerHTML = activity_categories[i].name;
                    }
                    else
                    {
                        category_txt += `<option value="`+activity_categories[i].id+` - `+activity_categories[i].name+`">`+activity_categories[i].name+`</option>`;
                    }
                }
            }
            else
            {
                country_txt += `<option value="" selected="">All Countries</option>`;
                for(i in activity_country)
                {
                    country_txt += `<option value="`+activity_country[i].id+`">`+activity_country[i].name+`</option>`;
                }

                type_txt += `<option value="0" selected="">All Types</option>`;
                for(i in msg.activity_types)
                {
                    type_txt += `<option value="`+msg.activity_types[i].uuid+`">`+msg.activity_types[i].name+`</option>`;
                }

                category_txt += `<option value="0" selected="">All Categories</option>`;
                for(i in activity_categories)
                {
                    category_txt += `<option value="`+activity_categories[i].id+` - `+activity_categories[i].name+`">`+activity_categories[i].name+`</option>`;
                }
            }
            if(country_txt != ''){
                document.getElementById('activity_countries').innerHTML = country_txt;
                if(template == 1 || template == 2 || template == 5){
                    $('#activity_countries').niceSelect('update');
                }
            }
            if(type_txt != ''){
                type_selection.innerHTML = type_txt;
                if(template == 1 || template == 2 || template == 5){
                    $('#activity_type').niceSelect('update');
                }
            }
            if(category_txt != ''){
                category_selection.innerHTML = category_txt;
                if(template == 1 || template == 2 || template == 5){
                    $('#activity_category').niceSelect('update');
                }
            }

            country_selection.setAttribute("onchange", "auto_complete_activity('activity_countries');");
            category_selection.setAttribute("onchange", "auto_complete_activity('activity_category');");
            if(type == 'search')
            {
                if (parsed_country)
                {
                    auto_complete_activity('activity_countries', parsed_city);
                    get_city_search_name(parsed_city);
                }
                if (parsed_category)
                {
                    auto_complete_activity('activity_category', parsed_sub_category);
                    get_sub_cat_name(parsed_sub_category);
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity config');
       },timeout: 60000
    });
}

function activity_search(){
    get_new = false;
    getToken();
    //document.getElementById('activity_category').value.split(' - ')[1]
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'search',
       },
       data: {
          'search_request': JSON.stringify(activity_request),
          'signature': signature
       },
       success: function(msg) {
        if(google_analytics != '')
           gtag('event', 'activity_search', {});
           var text = '';
           var counter = 0;
           document.getElementById('activity_ticket').innerHTML = "";
           data=[];
           if(msg.result.error_code == 0){
               activity_data = msg.result.response;
               $('#loading-search-activity').hide();
               if (activity_data.length == 0)
               {
                    text += `
                    <div class="col-lg-12">
                        <div style="text-align:center">
                            <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" alt="Not Found Activity" style="width:70px; height:70px;" title="" />
                            <br/>
                        </div>
                        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
                    </div>`;
               }
               for(i in activity_data){
                   if(high_price_slider < activity_data[i].activity_price){
                        high_price_slider = activity_data[i].activity_price;
                    }

                   if(low_price_slider > activity_data[i].activity_price){
                        low_price_slider = activity_data[i].activity_price;
                   }

                   if (activity_data[i].images.length > 0)
                   {
                       img_src = activity_data[i].images[0].url+activity_data[i].images[0].path;
                   }
                   else
                   {
                       img_src = static_path_url_server+`/public/tour_packages/not_found.png`;
                   }

                   text+=`
                   <div class="col-lg-6 col-md-6 activity_box" style="min-height:unset;">
                       <form action='/activity/detail/`+activity_data[i].uuid+`' method=POST id='myForm`+activity_data[i].sequence+`'>
                            <div id='csrf`+activity_data[i].sequence+`'></div>
                            <input type='hidden' value='`+JSON.stringify(activity_data[i]).replace(/[']/g, /["]/g)+`'/>
                            <input id='uuid`+activity_data[i].sequence+`' name='uuid' type=hidden value='`+activity_data[i].uuid+`'/>
                            <input id='sequence`+activity_data[i].sequence+`' name='sequence' type=hidden value='`+activity_data[i].sequence+`'/>`;
                            temp_arr_loc = [];
                            temp_arr_ctg = [];
                            for(j in activity_data[i].locations){
                                temp_arr_loc.push(activity_data[i].locations[j].country_name);
                            }
                            for(j in activity_data[i].categories){
                                temp_arr_ctg.push(activity_data[i].categories[j].category_name);
                            }
                            temp_arr_loc = get_unique_list_data(temp_arr_loc);

                            if(template == 1){
                                text+=`
                                <div class="single-recent-blog-post item" style="border:1px solid #cdcdcd;">
                                    <div class="single-destination relative">`;
                                        if(img_src){
                                            text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+img_src+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+activity_data[i].sequence+`')">`;
                                        }else{
                                            text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+activity_data[i].sequence+`')">`;
                                        }
                                        text+=`
                                            <div class="overlay overlay-bg"></div>
                                        </div>
                                        <div class="card card-effect-promotion" style="border:unset;">
                                            <div class="card-body">
                                                <div class="row details">
                                                    <div class="col-lg-12" style="text-align:left;">`;
                                                        //text+=`<span style="font-weight:500; margin-bottom:5px; padding:0px 10px; background: `+color+`; color: `+text_color+`;">TYPE ACTIVITY</span>`;
                                                        text+=`<h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-top:5px;" title="`+activity_data[i].name+`">`+activity_data[i].name+`</h6>
                                                        <div class="row">
                                                            <div class="col-lg-6" style="text-align:left;">`;
                                                            if(activity_data[i].reviewCount != 0){
                                                                text+=`<span class="span-activity-desc" style="font-size:13px;"> `+activity_data[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+activity_data[i].reviewCount+`)</span><br/>`;
                                                            }else{
                                                                text+=`<span style="font-size:13px;"><i style="color:#FFC801 !important;" class="fas fa-star"></i> No Rating</span><br/>`;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <div class="col-lg-6" style="text-align:right;">
                                                                <span style="font-size:12px; font-weight:600; cursor:pointer;"> <i class="fas fa-tags"></i>`;
                                                                text+=`<span id="pop_ctg`+i+`" class="span-activity-desc" style="color:`+color+`; cursor:pointer;"> `+temp_arr_ctg.length+` Category</span>`;
                                                                text+=`
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-lg-12" style="height:30px;">
                                                                <span style="font-size:12px; font-weight:600; cursor:pointer;"> <i class="fas fa-map-marker-alt"></i>`;
                                                                for(ct in temp_arr_loc){
                                                                    if(ct == 0){
                                                                        text+=`<span id="pop_loc`+i+``+ct+`" class="span-activity-desc" style="color:`+color+`; cursor:pointer;"> `+temp_arr_loc[ct].data_country+` (`+temp_arr_loc[ct].count+`)</span>`;
                                                                    }else{
                                                                        text+=`<span id="pop_loc`+i+``+ct+`" class="span-activity-desc" style="color:`+color+`; cursor:pointer;">, `+temp_arr_loc[ct].data_country+` (`+temp_arr_loc[ct].count+`) </span>`;
                                                                    }
                                                                }
                                                                text+=`
                                                                </span>
                                                            </div>
                                                        </div>
                                                        `;
                                                    text+=`
                                                    </div>
                                                    <div class="col-lg-12">
                                                        <span style="float:left; font-size:16px;font-weight:bold;">IDR `+getrupiah(activity_data[i].activity_price)+`  </span>
                                                        <button style="float:right; line-height:32px;" type="button" class="primary-btn" onclick="go_to_detail('`+activity_data[i].sequence+`')">BUY</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            }else{
                                if(template == 5){
                                    text+=`<div class="single-post-area" style="margin-bottom:15px; cursor:pointer; border:1px solid #cdcdcd; transform:unset; -webkit-transform:unset;">`;
                                }else{
                                    text+=`<div class="single-post-area" style="margin-bottom:15px; cursor:pointer; border:unset; transform:unset; -webkit-transform:unset;">`;
                                }
                                text+=`
                                    <div class="single-destination avail-sd relative">`;
                                        if(img_src){
                                            text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+img_src+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+activity_data[i].sequence+`')">`;
                                        }else{
                                            text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+activity_data[i].sequence+`')">`;
                                        }
                                        if(template != 5 && template != 6){
                                            text+=`<div class="overlay overlay-bg"></div>`;
                                        }
                                        text+=`
                                        </div>
                                        <div class="card card-effect-promotion" style="border:unset;">
                                            <div class="card-body" style="padding:10px; border:unset;">
                                                <div class="row details">
                                                    <div class="col-lg-12" style="text-align:left; height:90px;">
                                                        <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+activity_data[i].name+`">`+activity_data[i].name+`</h6>
                                                        <div class="col-lg-12" style="padding:0px;">`;
                                                            if(activity_data[i].reviewCount != 0){
                                                                text+=`<span class="span-activity-desc" style="font-size:13px;"> `+activity_data[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+activity_data[i].reviewCount+` reviews)</span><br/>`;
                                                            }else{
                                                                text+=`<span style="font-size:13px;"><i style="color:#FFC801 !important;" class="fas fa-star"></i> No Rating</span><br/>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <span style="font-size:12px; font-weight:600; cursor:pointer;"> <i class="fas fa-map-marker-alt"></i>`;
                                                        for(ct in temp_arr_loc){
                                                            if(ct == 0){
                                                                text+=`<span id="pop_loc`+i+``+ct+`" class="span-activity-desc" style="color:`+color+`; cursor:pointer;"> `+temp_arr_loc[ct].data_country+` (`+temp_arr_loc[ct].count+`)</span>`;
                                                            }else{
                                                                text+=`<span id="pop_loc`+i+``+ct+`" class="span-activity-desc" style="color:`+color+`; cursor:pointer;">, `+temp_arr_loc[ct].data_country+` (`+temp_arr_loc[ct].count+`) </span>`;
                                                            }
                                                        }
                                                        text+=`</span><br/>`;
                                                    text+=`
                                                    </div>
                                                    <div class="col-lg-12">
                                                        <span style="float:left; font-size:16px;font-weight:bold;">IDR `+getrupiah(activity_data[i].activity_price)+`  </span>
                                                        <button style="float:right; line-height:32px;" type="button" class="primary-btn" onclick="go_to_detail('`+activity_data[i].sequence+`')">BUY</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            }
                            text+=`
                       </form>
                   </div>`;
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

               document.getElementById('activity_ticket').innerHTML += text;

               for(i in activity_data){
                    temp_arr_loc = [];
                    temp_arr_ctg = [];
                    for(j in activity_data[i].locations){
                        temp_arr_loc.push(activity_data[i].locations[j].country_name);
                    }
                    for(j in activity_data[i].categories){
                        temp_arr_ctg.push(activity_data[i].categories[j].category_name);
                    }
                    temp_arr_loc = get_unique_list_data(temp_arr_loc);

                    for(ct in temp_arr_loc){
                        content_pop_loc = '';

                        for(j in activity_data[i].locations){
                            if(temp_arr_loc[ct].data_country == activity_data[i].locations[j].country_name)
                            content_pop_loc+=`
                            <span class="span-activity-desc" style="font-size:13px;">
                                <i style="color:`+color+` !important;" class="fas fa-map-marker-alt"></i>
                                `+activity_data[i].locations[j].city_name+`, `+activity_data[i].locations[j].country_name+`
                            </span><br/>`;
                        }

                        new jBox('Tooltip', {
                            attach: '#pop_loc'+i+ct,
                            target: '#pop_loc'+i+ct,
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
                            content: content_pop_loc,
                        });
                    }

                    content_pop_ctg = '';
                    for(ct in temp_arr_ctg){
                        content_pop_ctg+=`
                        <span class="span-activity-desc" style="font-size:13px;">
                            <i style="color:`+color+` !important;" class="fas fa-tags"></i>
                            `+temp_arr_ctg[ct]+`
                        </span><br/>`;
                    }
                    new jBox('Tooltip', {
                        attach: '#pop_ctg'+i,
                        target: '#pop_ctg'+i,
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
                        content: content_pop_ctg,
                    });
               }

               document.getElementById("activity_result").innerHTML = '';
               text = '';
               var node = document.createElement("div");
               text+=`
               <div style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px;">
                   <span style="font-weight:bold; font-size:14px;"> Activity - `+activity_data.length+` results</span>
               </div>`;
               node.innerHTML = text;
               document.getElementById("activity_result").appendChild(node);
               node = document.createElement("div");

               var items = $(".activity_box");
               var numItems = items.length;
               var perPage = 21;
               items.slice(perPage).hide();
               $('#pagination-container').pagination({
                   items: numItems,
                   itemsOnPage: perPage,
                   prevText: "<i class='fas fa-angle-left'/>",
                   nextText: "<i class='fas fa-angle-right'/>",
                   onPageClick: function (pageNumber) {
                       var showFrom = perPage * (pageNumber - 1);
                       var showTo = showFrom + perPage;
                       items.hide().slice(showFrom, showTo).show();
                       $('#pagination-container2').pagination('drawPage', pageNumber);
                   }
               });

               $('#pagination-container2').pagination({
                   items: numItems,
                   itemsOnPage: perPage,
                   prevText: "<i class='fas fa-angle-left'/>",
                   nextText: "<i class='fas fa-angle-right'/>",
                   onPageClick: function (pageNumber) {
                       var showFrom = perPage * (pageNumber - 1);
                       var showTo = showFrom + perPage;
                        items.hide().slice(showFrom, showTo).show();
                       $('#pagination-container').pagination('drawPage', pageNumber);
                   }
               });
               $('#pagination-container').show();
               $('#pagination-container2').show();
               if(msg.result.response.length!=0)
                   get_new = true;
           }else{
              $('#loading-search-activity').hide();
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error activity search </span>' + msg.result.error_msg,
                })
              text += `
              <div class="col-lg-12">
                  <div style="text-align:center">
                      <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" alt="Not Found Activity" style="width:70px; height:70px;" alt="" title="" />
                      <br/>
                  </div>
                  <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
              </div>`;
              document.getElementById('activity_ticket').innerHTML += text;
              $('#pagination-container').hide();
              $('#pagination-container2').hide();
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity search');
          text += `
          <div class="col-lg-12">
              <div style="text-align:center">
                  <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="Not Found Activity" title="" />
                  <br/>
              </div>
              <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
          </div>`;
          document.getElementById('activity_ticket').innerHTML += text;
       },timeout: 120000
    });
}

function activity_get_detail(activity_uuid){
    getToken();
    //document.getElementById('activity_category').value.split(' - ')[1]
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_details',
       },
       data: {
          'activity_uuid': activity_uuid,
          'signature': signature
       },
       success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                   last_session = 'get_price'
                   activity_data = msg.result.response;
                   activity_type = msg.result.response.activity_lines;
                   var counti = 0;
                   var temp = ``;
                   for(i in activity_type){
                       if (counti == 0){
                           temp += `
                           <label class="btn btn-activity active" style="width:unset; z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                               <input type="radio" class="activity" name="product_type" autocomplete="off" checked="checked"/><span>`+activity_type[i].name+`</span>
                           </label>
                       `;
                       }
                       else {
                           temp += `
                           <label class="btn btn-activity" style="width:unset; z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                               <input type="radio" class="activity" name="product_type" autocomplete="off"/><span>`+activity_type[i].name+`</span>
                           </label>
                       `;
                       }
                       counti++;
                   }
                   activity_location_txt = ``;
                   for (i in activity_data.locations)
                   {
                        if(i == 0){
                            activity_location_txt += `<i class="fas fa-map-marker-alt" style="color:`+color+`; "></i> `+activity_data.locations[i].city_name + ` ` + activity_data.locations[i].country_name;
                        }else{
                            activity_location_txt += `<i class="fas fa-map-marker-alt" style="color:`+color+`; padding-left:10px; "></i> `+activity_data.locations[i].city_name + `, ` + activity_data.locations[i].country_name;
                        }
                   }

                   activity_desc_bar_txt = ``;
                   if (template == 1)
                   {
                        activity_desc_bar_txt += `<div class="style-scrollbar" style="overflow:auto; white-space:nowrap; background: white;">
                                        <ul class="create_tabs" style="background:white;">
                                            <li class="create_tab-link current" data-tab="detail"><label><i class="fa fa-info-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Details</span></label></li>
                                            <li class="create_tab-link" data-tab="rules"><label><i class="fa fa-exclamation-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Rules</span></label></li>
                                            <li class="create_tab-link" data-tab="vouchers"><label><i class="fa fa-ticket-alt" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Vouchers</span></label></li>`;
                                            if (activity_data.itinerary != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <li class="create_tab-link" data-tab="price_itinerary"><label><i class="fa fa-list-ul" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Price Itinerary</span></label></li>
                                                `;
                                            }
                                         activity_desc_bar_txt += `
                                        </ul>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div id="detail" class="create_tab-content current" style="border-top:2px solid #cdcdcd;">`;
                                            if (activity_data.description != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Description</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.description+`</p>`;
                                            }
                                            if (activity_data.highlights != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Highlights</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.highlights+`</p>`;
                                            }
                                            if (activity_data.additionalInfo != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Additional Info</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.additionalInfo+`</p>`;
                                            }
                                            if (activity_data.priceIncludes != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Price Includes</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.priceIncludes+`</p>`;
                                            }
                                            if (activity_data.priceExcludes != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Price Excludes</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.priceExcludes+`</p>`;
                                            }
                                        activity_desc_bar_txt += `
                                             </div>
                                            <div id="rules" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.warnings != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Warnings</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.warnings+`</p>`;
                                                }
                                                if (activity_data.safety != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Safety</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.safety+`</p>`;
                                                }
                                             activity_desc_bar_txt += `</div>
                                            <div id="vouchers" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.voucher_validity != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Validity</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucher_validity+`</p>`;
                                                }
                                                if (activity_data.voucherUse != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Use</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherUse+`</p>`;
                                                }
                                                if (activity_data.voucherRedemptionAddress != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Address</h4>
                                                    <p style="padding:0 15px; text-align:justify;">`+activity_data.voucherRedemptionAddress+`</p>`;
                                                }
                                                if (activity_data.voucherRequiresPrinting != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Print</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherRequiresPrinting+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="price_itinerary" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.itinerary != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Itinerary</h4>
                                                    <p style="padding:0 15px; text-align:justify">`+activity_data.itinerary+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                        </div>
                                    </div>`;
                   }
                   else if (template == 2)
                   {
                        activity_desc_bar_txt += `<div class="style-scrollbar" style="overflow:auto; white-space:nowrap; background: white;">
                                        <ul class="create_tabs" style="background:white;">
                                            <li class="create_tab-link current" data-tab="detail"><label><i class="fa fa-info-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Details</span></label></li>
                                            <li class="create_tab-link" data-tab="rules"><label><i class="fa fa-exclamation-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Rules</span></label></li>
                                            <li class="create_tab-link" data-tab="vouchers"><label><i class="fa fa-ticket-alt" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Vouchers</span></label></li>`;
                                            if (activity_data.itinerary != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <li class="create_tab-link" data-tab="price_itinerary"><label><i class="fa fa-list-ul" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Price Itinerary</span></label></li>
                                                `;
                                            }
                                         activity_desc_bar_txt += `
                                        </ul>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div id="detail" class="create_tab-content current" style="border-top:2px solid #cdcdcd;">`;
                                            if (activity_data.description != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Description</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.description+`</p>`;
                                            }
                                            if (activity_data.highlights != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Highlights</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.highlights+`</p>`;
                                            }
                                            if (activity_data.additionalInfo != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Additional Info</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.additionalInfo+`</p>`;
                                            }
                                            if (activity_data.priceIncludes != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Price Includes</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.priceIncludes+`</p>`;
                                            }
                                            if (activity_data.priceExcludes != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <h4 style="padding:0 15px; margin-bottom:10px;">Price Excludes</h4>
                                                <p style="padding:0 15px;text-align:justify">`+activity_data.priceExcludes+`</p>`;
                                            }
                                        activity_desc_bar_txt += `
                                             </div>
                                            <div id="rules" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.warnings != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Warnings</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.warnings+`</p>`;
                                                }
                                                if (activity_data.safety != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Safety</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.safety+`</p>`;
                                                }
                                             activity_desc_bar_txt += `</div>
                                            <div id="vouchers" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.voucher_validity != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Validity</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucher_validity+`</p>`;
                                                }
                                                if (activity_data.voucherUse != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Use</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherUse+`</p>`;
                                                }
                                                if (activity_data.voucherRedemptionAddress != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Address</h4>
                                                    <p style="padding:0 15px; text-align:justify;">`+activity_data.voucherRedemptionAddress+`</p>`;
                                                }
                                                if (activity_data.voucherRequiresPrinting != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Print</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherRequiresPrinting+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="price_itinerary" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.itinerary != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Itinerary</h4>
                                                    <p style="padding:0 15px; text-align:justify">`+activity_data.itinerary+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                        </div>
                                    </div>`;
                   }
                   else if (template == 3)
                   {
                        activity_desc_bar_txt += `<div class="style-scrollbar" style="overflow:auto; white-space:nowrap; background: white;">
                                        <ul class="create_tabs" style="background:white;">
                                            <li class="create_tab-link current" data-tab="detail"><label><i class="fa fa-info-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Details</span></label></li>
                                            <li class="create_tab-link" data-tab="rules"><label><i class="fa fa-exclamation-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Rules</span></label></li>
                                            <li class="create_tab-link" data-tab="vouchers"><label><i class="fa fa-ticket-alt" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Vouchers</span></label></li>`;
                                            if (activity_data.itinerary != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <li class="create_tab-link" data-tab="price_itinerary"><label><i class="fa fa-list-ul" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Price Itinerary</span></label></li>
                                                `;
                                            }
                                    activity_desc_bar_txt += `
                                        </ul>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div id="detail" class="create_tab-content current" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.description != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Description</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.description+`</p>`;
                                                }
                                                if (activity_data.highlights != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Highlights</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.highlights+`</p>`;
                                                }
                                                if (activity_data.additionalInfo != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Additional Info</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.additionalInfo+`</p>`;
                                                }
                                                if (activity_data.priceIncludes != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Price Includes</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.priceIncludes+`</p>`;
                                                }
                                                if (activity_data.priceExcludes != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Price Excludes</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.priceExcludes+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="rules" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.warnings != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Warnings</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.warnings+`</p>`;
                                                }
                                                if (activity_data.safety != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Safety</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.safety+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="vouchers" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.voucher_validity != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Validity</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucher_validity+`</p>`;
                                                }
                                                if (activity_data.voucherUse != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Use</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherUse+`</p>`;
                                                }
                                                if (activity_data.voucherRedemptionAddress != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Address</h4>
                                                    <p style="padding:0 15px; text-align:justify;">`+activity_data.voucherRedemptionAddress+`</p>`;
                                                }
                                                if (activity_data.voucherRequiresPrinting != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Print</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherRequiresPrinting+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="price_itinerary" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.itinerary != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Itinerary</h4>
                                                    <p style="padding:0 15px; text-align:justify">`+activity_data.itinerary+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                        </div>
                                    </div>`;
                   }
                   else if (template == 4)
                   {
                        activity_desc_bar_txt += `<div class="style-scrollbar" style="overflow:auto; white-space:nowrap; background: white;">
                                        <ul class="create_tabs" style="background:white;">
                                            <li class="create_tab-link current" data-tab="detail"><label><i class="fa fa-info-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Details</span></label></li>
                                            <li class="create_tab-link" data-tab="rules"><label><i class="fa fa-exclamation-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Rules</span></label></li>
                                            <li class="create_tab-link" data-tab="vouchers"><label><i class="fa fa-ticket-alt" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Vouchers</span></label></li>`;
                                            if (activity_data.itinerary != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <li class="create_tab-link" data-tab="price_itinerary"><label><i class="fa fa-list-ul" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Price Itinerary</span></label></li>
                                                `;
                                            }
                                        activity_desc_bar_txt += `
                                        </ul>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div id="detail" class="create_tab-content current" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.description != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Description</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.description+`</p>`;
                                                }
                                                if (activity_data.highlights != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Highlights</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.highlights+`</p>`;
                                                }
                                                if (activity_data.additionalInfo != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Additional Info</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.additionalInfo+`</p>`;
                                                }
                                                if (activity_data.priceIncludes != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Price Includes</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.priceIncludes+`</p>`;
                                                }
                                                if (activity_data.priceExcludes != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Price Excludes</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.priceExcludes+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="rules" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.warnings != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Warnings</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.warnings+`</p>`;
                                                }
                                                if (activity_data.safety != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Safety</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.safety+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="vouchers" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.voucher_validity != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Validity</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucher_validity+`</p>`;
                                                }
                                                if (activity_data.voucherUse != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Use</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherUse+`</p>`;
                                                }
                                                if (activity_data.voucherRedemptionAddress != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Address</h4>
                                                    <p style="padding:0 15px; text-align:justify;">`+activity_data.voucherRedemptionAddress+`</p>`;
                                                }
                                                if (activity_data.voucherRequiresPrinting != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Print</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherRequiresPrinting+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="price_itinerary" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.itinerary != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Itinerary</h4>
                                                    <p style="padding:0 15px; text-align:justify">`+activity_data.itinerary+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                        </div>
                                    </div>`;
                   }
                   else
                   {
                        activity_desc_bar_txt += `<div class="style-scrollbar" style="overflow:auto; white-space:nowrap; background: white;">
                                        <ul class="create_tabs" style="background:white;">
                                            <li class="create_tab-link current" data-tab="detail"><label><i class="fa fa-info-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Details</span></label></li>
                                            <li class="create_tab-link" data-tab="rules"><label><i class="fa fa-exclamation-circle" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Rules</span></label></li>
                                            <li class="create_tab-link" data-tab="vouchers"><label><i class="fa fa-ticket-alt" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Vouchers</span></label></li>`;
                                            if (activity_data.itinerary != '')
                                            {
                                                activity_desc_bar_txt += `
                                                <li class="create_tab-link" data-tab="price_itinerary"><label><i class="fa fa-list-ul" aria-hidden="true" title="details" style="font-size: 18px;"></i><span class="hidden-xs"> Price Itinerary</span></label></li>
                                                `;
                                            }
                                        activity_desc_bar_txt += `
                                        </ul>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div id="detail" class="create_tab-content current" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.description != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Description</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.description+`</p>`;
                                                }
                                                if (activity_data.highlights != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Highlights</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.highlights+`</p>`;
                                                }
                                                if (activity_data.additionalInfo != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Additional Info</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.additionalInfo+`</p>`;
                                                }
                                                if (activity_data.priceIncludes != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Price Includes</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.priceIncludes+`</p>`;
                                                }
                                                if (activity_data.priceExcludes != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Price Excludes</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.priceExcludes+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="rules" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.warnings != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Warnings</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.warnings+`</p>`;
                                                }
                                                if (activity_data.safety != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Safety</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.safety+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="vouchers" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.voucher_validity != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Validity</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucher_validity+`</p>`;
                                                }
                                                if (activity_data.voucherUse != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Use</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherUse+`</p>`;
                                                }
                                                if (activity_data.voucherRedemptionAddress != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Address</h4>
                                                    <p style="padding:0 15px; text-align:justify;">`+activity_data.voucherRedemptionAddress+`</p>`;
                                                }
                                                if (activity_data.voucherRequiresPrinting != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Voucher Print</h4>
                                                    <p style="padding:0 15px;text-align:justify">`+activity_data.voucherRequiresPrinting+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                            <div id="price_itinerary" class="create_tab-content" style="border-top:2px solid #cdcdcd;">`;
                                                if (activity_data.itinerary != '')
                                                {
                                                    activity_desc_bar_txt += `
                                                    <h4 style="padding:0 15px; margin-bottom:10px;">Itinerary</h4>
                                                    <p style="padding:0 15px; text-align:justify">`+activity_data.itinerary+`</p>`;
                                                }
                                            activity_desc_bar_txt += `</div>
                                        </div>
                                    </div>`;
                   }

                   activity_media_txt = ``;
                   activity_media_thumb_txt = ``;
                   for (i in activity_data.videos)
                   {
                        if(activity_data.videos[i].url != '')
                        {
                             activity_media_txt += `<div class="item" style="background: rgba(0,0,0,0.9);">
                                                        <video controls id="video_activity" height="350px" width="100%">
                                                            <source src="`+activity_data.videos[i].url+`" type="video/mp4">
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>`;

                             activity_media_thumb_txt += `<div class="item" style="text-align:center;">
                                                              <div class="dark-img" style="cursor:pointer;">
                                                                  <img class="img-fluid owl-current-click" alt="Activity" id="video_activity2" style="max-width:100%; height:75px;">
                                                                  <span class="text-block-img" id="icon_video_activity" style="cursor:pointer; color:`+text_color+`; font-size:12px; text-align:center;"></span>
                                                              </div>
                                                          </div>`;
                        }
                   }
                   for (i in activity_data.images)
                   {
                        activity_media_txt += `<div class="item" style="background: rgba(0,0,0,0.9);">
                                                        <img class="img-fluid" src="`+activity_data.images[i].url+``+activity_data.images[i].path+`" alt="Activity" style="display: block; width:100%; height:350px; object-fit: contain;">
                                                </div>`;

                        activity_media_thumb_txt += `<div class="item" style="text-align:center; cursor:pointer;">
                                                        <img class="img-fluid owl-current-click" alt="Activity" src="`+activity_data.images[i].url+``+activity_data.images[i].path+`" style="max-width:100%; height:75px;">
                                                    </div>`;
                   }

                   activity_carousel_txt = `
                        <div class="owl-carousel-activity-img owl-theme">
                            `+activity_media_txt+`
                        </div>
                        <div class="owl-carousel-activity owl-theme" style="padding-top:15px;">
                            `+activity_media_thumb_txt+`
                        </div>
                   `;

                   $('#ticket_type').html(temp);
                   document.getElementById('activity_uuid').value = activity_data.uuid;
                   document.getElementById('title_search').innerHTML += activity_data.name;
                   document.getElementById('main_activity_name').innerHTML = activity_data.name;
                   document.getElementById('product_title').innerHTML = activity_data.name;
                   document.getElementById('activity_avg_score').innerHTML += activity_data.reviewAverageScore + ` (` + activity_data.reviewCount + `)`;
                   document.getElementById('activity_locations').innerHTML += activity_location_txt;
                   document.getElementById('activity_desc_bar').innerHTML += activity_desc_bar_txt;
                   document.getElementById('activity_carousel').innerHTML = activity_carousel_txt;

                   $('.owl-carousel-activity-img').owlCarousel({
                        loop:false,
                        nav: true,
                        rewind: true,
                        video: true,
                        margin: 20,
                        responsiveClass:true,
                        dots: false,
                        lazyLoad:true,
                        merge: false,
                        smartSpeed:1000,
                        autoHeight: true,
                        autoplay: false,
                        autoplayTimeout:6000,
                        autoplayHoverPause:false,
                        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
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

                   $('.owl-carousel-activity').owlCarousel({
                        loop:false,
                        nav: true,
                        navRewind:true,
                        rewind: true,
                        margin: 20,
                        responsiveClass:true,
                        dots: true,
                        merge: false,
                        lazyLoad:true,
                        smartSpeed:1000,
                        autoplay: false,
                        autoplayTimeout:6000,
                        autoplayHoverPause:false,
                        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                        responsive:{
                            0:{
                                items:4,
                                nav:true
                            },
                            600:{
                                items:5,
                                nav:true
                            },
                            1000:{
                                items:8,
                                nav:true,
                            }
                        }
                   });

                   $('.owl-carousel-activity-vid').owlCarousel({
                        loop:false,
                        nav: true,
                        rewind: true,
                        margin: 20,
                        responsiveClass:true,
                        dots: false,
                        lazyLoad:true,
                        merge: false,
                        smartSpeed:500,
                        autoplay: false,
                        autoplayTimeout:6000,
                        autoplayHoverPause:false,
                        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
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

                   var current=0;
                   var check_counter_idx = 0;
                   var check_video_play = 0;
                   var check_video_slider = 0;

                   $('.owl-carousel-activity-img').on('changed.owl.carousel',function(property){
       current = property.item.index;
       var total = property.item.count;
       var check_index = total - current;
       var video = $("#video_activity").get(0);

       if(current != 0){
         if(video != undefined)
             $('#video_activity').get(0).pause();
             $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
         check_video_slider = 1;
       }else{
         check_video_slider = 0;
       }

       if(current == total-1){
            $('.owl-carousel-activity').data("owl.carousel").to(total-5, 500, true);
       }
       else{
           if(check_index > 4){
                $('.owl-carousel-activity').data("owl.carousel").to(current, 500, true);
           }
       }

       $('.owl-carousel-activity').find('.owl-item').each(function() {
          $(this).removeClass("owl-bg-border");
       });
       $('.owl-carousel-activity').find('.owl-item').eq(current).addClass('owl-bg-border');
        //       document.getElementById("total_image_hotel").innerHTML = current+1 + " of " + $lengthimg;
        //       document.getElementById("total_image_hotel-modal").innerHTML = current+1 + " of " + $lengthimg;
    });
                   $('.owl-carousel-activity').find('.owl-item').eq(current).addClass('owl-bg-border');
                   $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
                   $('.owl-carousel-activity').on("click", ".owl-item", function(e) {
       e.preventDefault();
       check_counter_idx =0;
       $('.owl-item').each(function() {
          $(this).removeClass("owl-bg-border");
       });
       var number = $(this).index();
       var video = $("#video_activity").get(0);
       if(number == 0){
        if(check_video_play == 0){
            if(video != undefined){
                video.play();
                $('#icon_video_activity').html("<i class='fas fa-pause-circle' style='font-size:26px;'></i>");
                check_video_play = 1;
            }
        }
        else{
            if(video != undefined){
                video.pause();
                $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
                check_video_play = 0;
            }
        }
       }else{
        if(video != undefined){
            video.pause();
            $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
            check_video_play = 0;
        }
       }
       $('.owl-carousel-activity-img').data("owl.carousel").to(number, 500, true);
       $(this).addClass("owl-bg-border");
         });
                       $("#video_activity").click(function() {
            var video = $("#video_activity").get(0);
            if ( video.paused ) {
                if(check_video_slider != 1){
                    video.play();
                    $('#icon_video_activity').html("<i class='fas fa-pause-circle' style='font-size:26px;'></i>");
                }
            } else {
                video.pause();
                $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
            }
            return false;
        });
                       $('#video_activity').bind('play', function (e) {
            $('#video_activity').get(0).play();
            $('#icon_video_activity').html("<i class='fas fa-pause-circle' style='font-size:26px;'></i>");
        });
                       $('#video_activity').bind('pause', function (e) {
            $('#video_activity').get(0).pause();
            $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
        });

                   activity_get_price(0, true);
               }else{
                   try{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error activity details </span>' + msg.result.error_msg,
                        })
                      var temp = ``;
                      temp += `
                      <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                          <span>No product type available</span>
                      </label>`;
                      $('#ticket_type').html(temp);
                   }catch(err){
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error activity get details </span>' + msg.error_msg,
                        })
                      var temp = ``;
                      temp += `
                      <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                          <span>No product type available</span>
                      </label>`;
                      $('#ticket_type').html(temp);
                   }
               }
           }catch(err){
               try{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error activity get details </span>' + msg.error_msg,
                    })
                  var temp = ``;
                  temp += `
                  <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                      <span>No product type available</span>
                  </label>`;
                  $('#ticket_type').html(temp);
               }catch(err){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error activity detail </span>' + msg.result.error_msg,
                    })
                  var temp = ``;
                  temp += `
                  <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                      <span>No product type available</span>
                  </label>`;
                  $('#ticket_type').html(temp);
               }
           }


       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity detail');
            var temp = ``;
            temp += `
                <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                <span>No product type available</span>
                </label>`;
            $('#ticket_type').html(temp);
       },timeout: 60000
    });
}

function activity_get_price(val, bool){
    if(parseInt(activity_type_pick) != val || bool == true){
        activity_type_pick = val;
        if(document.getElementById('product_title').innerHTML != activity_type[activity_type_pick].name)
            document.getElementById('product_type_title').innerHTML = activity_type[activity_type_pick].name;

        text = '';
           detail_for_session = JSON.stringify(activity_type).replace(/'/g, '');
           for(i in activity_type[activity_type_pick].skus)
           {
                low_sku_id = activity_type[activity_type_pick].skus[i].sku_id.toLowerCase();
                text+= `<div class="col-lg-3">
                    <input type="hidden" id="sku_id" name="sku_id" value="`+activity_type[activity_type_pick].skus[i].sku_id+`"/>
                    <label>`+activity_type[activity_type_pick].skus[i].title+`</label>`;
                    if(template == 1){
                        text+=`
                        <div class="input-container-search-ticket">
                            <div class="form-select" style="margin-bottom:5px;">
                                <select class='activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='reset_activity_table_detail()'>`;
                                for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                text+=`
                                    <option>`+j+`</option>`;
                                text+=`</select>
                            </div>
                        </div>`;
                    }else if(template == 2){
                        text+=`
                        <div class="form-select" style="margin-bottom:5px;">
                            <select class='activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='reset_activity_table_detail()'>`;
                            for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                            text+=`
                                <option>`+j+`</option>`;
                            text+=`</select>
                        </div>`;

                    }else if(template == 3){
                        text+=`
                        <div class="form-group">
                            <div class="default-select" style="margin-bottom:5px;">
                                <select class='activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='reset_activity_table_detail()'>`;
                                for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                text+=`
                                    <option>`+j+`</option>`;
                                text+=`</select>
                            </div>
                        </div>`;
                    }else if(template == 4){
                        text+=`
                        <div class="input-container-search-ticket">
                            <div class="form-select" style="margin-bottom:5px;">
                                <select class='nice-select-default rounded activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='reset_activity_table_detail()'>`;
                                for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                text+=`
                                    <option>`+j+`</option>`;
                                text+=`</select>
                            </div>
                        </div>`;
                    }else if(template == 5){
                        text+=`
                        <div class="input-container-search-ticket">
                            <div class="form-select" style="margin-bottom:5px;">
                                <select class='nice-select-default rounded activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='reset_activity_table_detail()'>`;
                                for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                text+=`
                                    <option>`+j+`</option>`;
                                text+=`</select>
                            </div>
                        </div>`;
                    }else if(template == 6){
                        text+=`
                        <div class="input-container-search-ticket">
                            <div class="form-select" style="margin-bottom:5px;">
                                <select class='activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='reset_activity_table_detail()'>`;
                                for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                text+=`
                                    <option>`+j+`</option>`;
                                text+=`</select>
                            </div>
                        </div>`;
                    }
                if(activity_type[activity_type_pick].skus[i].minAge != null)
                {
                    text+= `<small id="activity_age_range`+i+`" class="hidden">(`+activity_type[activity_type_pick].skus[i].minAge+` - `+activity_type[activity_type_pick].skus[i].maxAge+` years old)</small>
                            <input type="hidden" id="`+low_sku_id+`_min_age" name="`+low_sku_id+`_min_age" value="`+activity_type[activity_type_pick].skus[i].minAge+`"/>
                            <input type="hidden" id="`+low_sku_id+`_max_age" name="`+low_sku_id+`_max_age" value="`+activity_type[activity_type_pick].skus[i].maxAge+`"/>`;
                }
                text+= `</div>`;
           }
           document.getElementById('pax').innerHTML = text;
           $('select').niceSelect();
           document.getElementById('details_div').innerHTML = `<input type='hidden' id='details_data' name='details_data' value='`+detail_for_session+`'/>`;
           text = '';
           for(i in activity_type[activity_type_pick].options.perBooking){
                if(activity_type[activity_type_pick].options.perBooking[i].name != 'Guest age' &&
                   activity_type[activity_type_pick].options.perBooking[i].name != 'Full name' &&
                   activity_type[activity_type_pick].options.perBooking[i].name != 'Gender' &&
                   activity_type[activity_type_pick].options.perBooking[i].name != 'Nationality' &&
                   activity_type[activity_type_pick].options.perBooking[i].name != 'Date of birth'){
                    text+=`<div class="col-lg-12" style="margin-bottom:10px;">`
                    text+=`<span style='display:block;'>`+activity_type[activity_type_pick].options.perBooking[i].name+`</span>`;
                    if(activity_type[activity_type_pick].options.perBooking[i].inputType == 1){
                        //selection button
                        text+=`
                        <div class="form-select" style="margin-bottom: unset;">
                        <select id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type1_change_perbooking(`+i+`)'>`;
                        for(j in activity_type[activity_type_pick].options.perBooking[i].items){
                            text+=`<option value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`">`+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</option>`;
    //                        text+=`<label style="width:20%">
    //                               <input type="radio" id="perbooking`+i+`" name="perbooking`+i+`" value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`" onchange='input_type1_change_perbooking(`+i+`,`+j+`)' />`+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</label>`;
                        }
                        text+=`</select></div>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 2){
                        //checkbox
                        for(j in activity_type[activity_type_pick].options.perBooking[i].items){
                            text+=`
                                    <label class="check_box_custom">
                                        <span style="font-size:13px;">`+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</span>
                                        <input type="checkbox" id="perbooking`+i+j+`" name="perbooking`+i+j+`" onchange="input_type2_change_perbooking(`+i+`,`+j+`)" value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`">
                                        <span class="check_box_span_custom"></span>
                                    </label>
                            `;
                            if(template != 1){
                                text+=`<br/>`;
                            }

                        }
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 3){
                        //number validation
                        text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 4){
                        //string validation
                        text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;' />`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 5){
                        //boolean checkbox true false
                        text+=`<input type="checkbox" id="perbooking`+i+`"  name="perbooking`+i+`" onchange='input_type5_change_perbooking(`+i+`)' style='margin-bottom: unset;'/>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 6){
                        //date
                        text+=`<input type="text" style="margin-bottom: unset;" class="form-control" id="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' name="perbooking`+i+`" />`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 7){
                        //file //pdf
                        text+=`<input type="file" class="form-control" accept="application/JSON, application/pdf" onchange='input_type_change_perbooking(`+i+`)' required="" name="perbooking`+i+`" id="perbooking`+i+`" style="margin-bottom: unset;"/>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 8){
                        //image
                        text+=`<input type="file" class="form-control" accept="image/*" required="" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' id="perbooking`+i+`" style="margin-bottom: unset;"/>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 9){
                        //address no validation maybe from bemyguest
                        text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 10){
                        //time validation
                        text+=`<input type="time" class="form-control" style="margin-bottom: unset;" id="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' name="perbooking`+i+`" />`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 11){
                        //datetime validation
                        text+=`<input class="form-control" type="text" id="perbooking`+i+`" onchange='input_type11_change_perbooking(`+i+`)' name="perbooking`+i+`" style="margin-bottom: unset;"/>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 12){
                        //string country
                        text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 13){
                        //deprecated
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 14){
                        //flight number
                        text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                    }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 50){
                        //string validation
                        text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                    }
                    text+=`<span>`+activity_type[activity_type_pick].options.perBooking[i].description+`</span><br/></div>`;
                }
            }
           document.getElementById('perbooking').innerHTML = text;
           for(i in activity_type[activity_type_pick].options.perBooking){
                if(activity_type[activity_type_pick].options.perBooking[i].inputType==11)
                    $('#perbooking'+i).daterangepicker({
                          timePicker: true,
                          singleDatePicker: true,
                          autoUpdateInput: true,
                          showDropdowns: true,
                          opens: 'center',
                          locale: {
                              format: 'YYYY-MM-DD hh:mm',
                          }
                     });
                else if(activity_type[activity_type_pick].options.perBooking[i].inputType==6)
                    $('#perbooking'+i).daterangepicker({
                          singleDatePicker: true,
                          autoUpdateInput: true,
                          showDropdowns: true,
                          opens: 'center',
                          locale: {
                              format: 'YYYY-MM-DD',
                          }
                     });

            }
            text = '';

           if(activity_type[activity_type_pick].timeslots.length>0){
               text += `<div class="col-xs-12">Timeslot</div>
                        <div class="col-xs-12">`;
               if(template == 1 || template == 2 || template == 4 || template == 5 || template == 6){
                    text+=`<div class="form-select">`;
               }else if(template == 3){
                    text+=`<div class="default-select">`;
               }

               if(template == 4){
                    text+=`<select class="nice-select-default rounded" style="width:100%;" name="timeslot_1" id="timeslot_1" onchange="timeslot_change();">`;
               }else{
                    text+=`<select style="width:100%;" name="timeslot_1" id="timeslot_1" onchange="timeslot_change();">`;
               }
               text += `<option value=''>Please Pick a Timeslot!</option></div>`;
               for(j in activity_type[activity_type_pick].timeslots)
               {
                    var newStartTime = activity_type[activity_type_pick].timeslots[j].startTime;
                    var newEndTime = activity_type[activity_type_pick].timeslots[j].endTime;
                    if(newStartTime.split(":").length > 2)
                    {
                        newStartTime = newStartTime.split(":")[0].toString() + ":" + newStartTime.split(":")[1].toString();
                    }
                    if(newEndTime.split(":").length > 2)
                    {
                        newEndTime = newEndTime.split(":")[0].toString() + ":" + newEndTime.split(":")[1].toString();
                    }
                    text += `<option value="`+activity_type[activity_type_pick].timeslots[j].uuid+`">`+newStartTime+` - `+newEndTime+`</option>`;
               }
               text += `</select></div>`;
           }
           document.getElementById('timeslot').innerHTML = text;
           $('select').niceSelect();

           if(activity_type[activity_type_pick].instantConfirmation){
                ins_text = `<span style="font-weight:700;">Instant Confirmation</span>`;
           }
           else{
                ins_text = `<span style="font-weight:700; color:red;">On Request (max 3 working days)</span>`;
           }
           document.getElementById('instantConfirmation').innerHTML = ins_text;

        voucher_text = '';
        if(activity_type[activity_type_pick].voucher_validity != ''){
           voucher_text+=`<h4 style="padding:0 15px;">Validity</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].voucher_validity+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherUse != ''){
           voucher_text+=`<h4 style="padding:0 15px;">Voucher Use</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].voucherUse+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherRedemptionAddress != ''){
           voucher_text+=`<h4 style="padding:0 15px;">Voucher Address</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].voucherRedemptionAddress+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherRequiresPrinting != ''){
           voucher_text+=`<h4 style="padding:0 15px;">Voucher Type</h4>`;
           if(activity_type[activity_type_pick].voucherRequiresPrinting)
           {
                voucher_text+=`<p style="padding:0 15px;">Physical voucher is required. Please print the voucher before your visit!</p>`;
           }
           else
           {
                voucher_text+=`<p style="padding:0 15px;">You can use either physical or electronic voucher.</p>`;
           }
        }
        if(activity_type[activity_type_pick].cancellationPolicies != ''){
           voucher_text+=`<h4 style="padding:0 15px;">Cancellation Policies</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].cancellationPolicies+`</p>`;
        }
        document.getElementById('vouchers').innerHTML = voucher_text;
        document.getElementById('date').innerHTML = `
            <div class="col-lg-6 form-group departure_date">
                <label id="departure_date_activity_label" for="activity_date"><span style="color:red;">* </span><i class="fas fa-calendar-alt"></i> Visit Date</label>
                <input id="activity_date" name="activity_date" onchange="reset_activity_table_detail();" class="form-control" style="margin-bottom:unset; background:white;" type="text" placeholder="Please Select a Date" autocomplete="off" readonly/>
            </div>
       `;

       $('#activity_date').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: moment(),
          minDate: moment(),
          showDropdowns: true,
          opens: 'center',
          locale: {
              format: 'DD MMM YYYY',
          }
       });
       reset_activity_table_detail();

    }else{

    }
}

function activity_get_price_date(){
    if (activity_type_pick !== '')
    {
        $('#loading-detail-activity').show();
        $("#ticket_detail *").children().prop('disabled',true);
        $("#ticket_type").hide();
        document.getElementById("check_price_btn").disabled = true;
        startingDate = document.getElementById('activity_date').value;
        check_price_sku_data = {}
        for(i in activity_type[activity_type_pick].skus)
        {
            low_sku_id = activity_type[activity_type_pick].skus[i].sku_id.toLowerCase();
            check_price_sku_data[activity_type[activity_type_pick].skus[i].sku_id] = parseInt(document.getElementById(low_sku_id+'_passenger').value);
        }
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/activity",
           headers:{
                'action': 'get_pricing',
           },
           data: {
              'product_type_uuid': activity_type[activity_type_pick].uuid,
              'pricing_days': pricing_days,
              'startingDate': startingDate,
              'sku_data': JSON.stringify(check_price_sku_data),
              'signature': signature
           },
           success: function(msg) {
               if(msg.result.error_code == 0){
                   last_session = 'sell_journeys'
                   activity_date = msg.result.response;
                   is_avail = 0;
                   act_date_data = JSON.stringify(activity_date).replace(/'/g, '');
                   $("#ticket_detail *").children().prop('disabled',false);
                   $("#ticket_type").show();
                   document.getElementById("check_price_btn").disabled = false;
                   document.getElementById('activity_date_div').innerHTML = `<input type='hidden' id='activity_date_data' name='activity_date_data' value='`+act_date_data+`'/>`;
                   if(activity_date.available){
                       is_avail = 1;
                   }
                   $('#loading-detail-activity').hide();
                   if (is_avail == 0)
                   {
                       Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Ticket is unavailable on this date</span>',
                       });
                       reset_activity_table_detail();
                   }
                   else
                   {
                       activity_table_detail();
                   }
               }
               else
               {
                    $("#ticket_detail *").children().prop('disabled',false);
                    $("#ticket_type").show();
                    $('#loading-detail-activity').hide();
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Ticket is unavailable on this date</span>',
                    });
                    reset_activity_table_detail();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity price date');
                $("#ticket_detail *").children().prop('disabled',false);
                $("#ticket_type").show();
                $('#loading-detail-activity').hide();
           },timeout: 60000
       });
    }
    else
    {
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: #ff9900;">Please Select Activity Type.</span>',
        })
    }
}

function update_sell_activity(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'sell_activity',
       },
       data: {
           'signature': signature,
           "promotion_codes_booking": [],
           "product_type_uuid": activity_type[activity_type_pick].uuid,
           "product_uuid": activity_data.uuid,
           "visit_date": moment(document.getElementById('activity_date').value).format('YYYY-MM-DD'),
           "timeslot": activity_timeslot.split(' ~ ')[0],
           "event_seq": event_pick
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            detail_to_passenger_page();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update sell activity </span>' + msg.result.error_msg,
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update sell activity');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function update_contact_activity(value){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'update_contact',
       },
       data: {
           'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            update_passengers_activity(value);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update contact activity </span>' + msg.result.error_msg,
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update contact activity');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function update_passengers_activity(value){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'update_passengers',
       },
       data: {
           'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            update_options_activity(value);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update passengers activity </span>' + msg.result.error_msg,
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error submit top up');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function update_options_activity(value){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'update_options',
       },
       data: {
           'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            if (!act_booker_id)
            {
                act_booker_id = '';
            }
            try{
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                    get_payment_acq('Issued', act_booker_id, '', 'billing', signature, 'activity_review');
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            prepare_booking(value);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update options activity </span>' + msg.result.error_msg,
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update options activity');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function prepare_booking(value){
    if(value == 0){
        document.getElementById("passengers").value = JSON.stringify({'booker':booker});
        document.getElementById("signature").value = signature;
        document.getElementById("provider").value = 'activity';
        document.getElementById("type").value = 'activity_review';
        document.getElementById("voucher_code").value = voucher_code;
        document.getElementById("discount").value = JSON.stringify(discount_voucher);
        document.getElementById("session_time_input").value = time_limit;
        activity_commit_booking(value);
    }else{
        document.getElementById("passengers").value = JSON.stringify({'booker':booker});
        document.getElementById("signature").value = signature;
        document.getElementById("provider").value = 'activity';
        document.getElementById("type").value = 'activity_review';
        document.getElementById("voucher_code").value = voucher_code;
        document.getElementById("discount").value = JSON.stringify(discount_voucher);
        document.getElementById("session_time_input").value = time_limit;
        document.getElementById('activity_issued').submit();
    }
}

function activity_pre_issued_booking(order_number){
    Swal.fire({
      title: 'Are you sure you want to Issued this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        show_loading();
        please_wait_transaction();
        $('.next-loading-issued').addClass("running");
        $('.next-loading-issued').prop('disabled', true);
        activity_issued_booking(order_number);
      }
    })
}

function force_issued_activity(val){
    //tambah swal
    if(val == 0)
    {
        var temp_title = 'Are you sure you want to Hold Booking?';
    }
    else
    {
        var temp_title = 'Are you sure you want to Force Issued this booking?';
    }
    Swal.fire({
      title: temp_title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        please_wait_transaction();
        $('.next-loading-issued').addClass("running");
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').prop('disabled', true);
        $('.issued_booking_btn').prop('disabled', true);
        activity_commit_booking(val);
      }
    })

}

function activity_commit_booking(val){
    data = {
        'value': val,
        'signature': signature
    }
    try{
        data['acquirer_seq_id'] = payment_acq2[payment_method][selected].acquirer_seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['voucher_code'] =  voucher_code;
    }catch(err){
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
        if(google_analytics != ''){
            if(data.hasOwnProperty('member') == true)
                gtag('event', 'activity_issued', {});
            else
                gtag('event', 'activity_hold_booking', {});
        }
        if(msg.result.error_code == 0){
            if(val == 0){
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
//                    send_url_booking('activity', btoa(msg.result.response.order_number), msg.result.response.order_number);
//                    document.getElementById('order_number').value = msg.result.response.order_number;
//                    document.getElementById('activity_issued').submit();
                    Swal.fire({
                      title: 'Success',
                      type: 'success',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: 'blue',
                      confirmButtonText: 'Payment',
                      cancelButtonText: 'View Booking'
                    }).then((result) => {
                      if (result.value) {
                        send_url_booking('activity', btoa(msg.result.response.order_number), msg.result.response.order_number);
                        document.getElementById('order_number').value = msg.result.response.order_number;
                        document.getElementById('activity_issued').submit();

                      }else{
                        document.getElementById('activity_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('activity_booking').action = '/activity/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('activity_booking').submit();
                      }
                    })
                }else if(user_login.hasOwnProperty('co_job_position_is_request_required') && user_login.co_job_position_is_request_required == true){
                    Swal.fire({
                      title: 'Success',
                      type: 'success',
                      confirmButtonColor: 'blue',
                      confirmButtonText: 'View Booking',
                    }).then((result) => {
                        document.getElementById('activity_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('activity_booking').action = '/activity/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('activity_booking').submit();
                    })
                }else{
                    Swal.fire({
                      title: 'Success',
                      type: 'success',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: 'blue',
                      confirmButtonText: 'Payment',
                      cancelButtonText: 'View Booking'
                    }).then((result) => {
                      if (result.value) {
                        send_url_booking('activity', btoa(msg.result.response.order_number), msg.result.response.order_number);
                        document.getElementById('order_number').value = msg.result.response.order_number;
                        document.getElementById('activity_issued').submit();

                      }else{
                        document.getElementById('activity_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('activity_booking').action = '/activity/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('activity_booking').submit();
                      }
                    })
//                    document.getElementById('activity_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
//                    document.getElementById('activity_booking').action = '/activity/booking/' + btoa(msg.result.response.order_number);
//                    document.getElementById('activity_booking').submit();
                }
            }else{
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                    send_url_booking('activity', btoa(msg.result.response.order_number), msg.result.response.order_number);
                document.getElementById('order_number').value = msg.result.response.order_number;
                document.getElementById('issued').action = '/activity/booking/' + btoa(msg.result.response.order_number);
                document.getElementById('issued').submit();
            }
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error activity commit booking </span>' + msg.result.error_msg,
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error submit top up');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function activity_issued_booking(order_number)
{
    getToken();
    var temp_data = {}
    if(typeof(act_get_booking) !== 'undefined')
        temp_data = JSON.stringify(act_get_booking)
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'issued_booking',
       },
       data: {
           'order_number': order_number,
           'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
           'member': payment_acq2[payment_method][selected].method,
           'signature': signature,
           'voucher_code': voucher_code,
           'booking': temp_data
       },
       success: function(msg) {
           if(google_analytics != '')
               gtag('event', 'activity_issued', {});
           if(msg.result.error_code == 0){
               if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                    window.location.href = '/activity/booking/' + btoa(order_number);
               }else{
                   try{
                       if(msg.result.response.state == 'issued')
                            print_success_issued();
                       else
                            print_fail_issued();
                   }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                   }
                   var booking_num = msg.result.response.order_number;
                   if (booking_num)
                   {
                       price_arr_repricing = {};
                       pax_type_repricing = [];
                       activity_get_booking(order_number);
                       document.getElementById('payment_acq').innerHTML = '';
                       document.getElementById('payment_acq').hidden = true;
                       document.getElementById("overlay-div-box").style.display = "none";
                       hide_modal_waiting_transaction();
                   }
               }
           }else if(msg.result.error_code == 1009){
               price_arr_repricing = {};
               pax_type_repricing = [];
               document.getElementById('activity_final_info').innerHTML = '';
               document.getElementById('product_title').innerHTML = '';
               document.getElementById('product_visit_date').innerHTML = '';
               document.getElementById('repricing_div').innerHTML = '';
               document.getElementById('activity_detail_table').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('payment_acq').hidden = true;
               document.getElementById("overlay-div-box").style.display = "none";
               hide_modal_waiting_transaction();
               activity_get_booking(order_number);
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error activity issued booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                hide_modal_waiting_transaction();
           }else{
                if(msg.result.error_code != 1007){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error activity issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Error activity issued '+ msg.result.error_msg,
                      showCancelButton: true,
                      cancelButtonText: 'Ok',
                      confirmButtonColor: '#f15a22',
                      cancelButtonColor: '#3085d6',
                      confirmButtonText: 'Top Up'
                    }).then((result) => {
                        if (result.value) {
                            window.location.href = '/top_up';
                        }
                    })
                }
                price_arr_repricing = {};
                pax_type_repricing = [];
                activity_get_booking(order_number);
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                document.getElementById("overlay-div-box").style.display = "none";
                hide_modal_waiting_transaction();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error submit top up');
            hide_modal_waiting_transaction();
            price_arr_repricing = {};
            pax_type_repricing = [];
            activity_get_booking(booking_num);
            document.getElementById('payment_acq').innerHTML = '';
            document.getElementById('payment_acq').hidden = true;
            document.getElementById("overlay-div-box").style.display = "none";
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function copy_data(){
    const el = document.createElement('textarea');
    el.value = $test;
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

function activity_request_issued(req_order_number){
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
               'table_name': 'activity',
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
                      html: '<span style="color: #ff9900;">Error activity request issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    document.getElementById("overlay-div-box").style.display = "none";
                    hide_modal_waiting_transaction();
                    activity_get_booking(req_order_number);
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity request issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('payment_acq').hidden = true;
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                hide_modal_waiting_transaction();
                activity_get_booking(req_order_number);
           },timeout: 300000
        });
      }
    })
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = []
        for(i in act_get_booking.result.response.passengers){
            for(j in act_get_booking.result.response.passengers[i].sale_service_charges){
                currency = act_get_booking.result.response.passengers[i].sale_service_charges[j].FARE.currency;
            }
            list_price = []
            for(j in list){
                if(act_get_booking.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                }

            }
            upsell.push({
                'sequence': act_get_booking.result.response.passengers[i].sequence,
                'pricing': JSON.parse(JSON.stringify(list_price))
            });
        }
        repricing_order_number = act_order_number;
    }else{
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
       url: "/webservice/activity",
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
                    please_wait_transaction();
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    activity_get_booking(repricing_order_number);
                }else{
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    activity_table_detail2('review');
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error activity update service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity update service charge');
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
       url: "/webservice/activity",
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
                        activity_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error activity update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}

function activity_get_booking(data){
    price_arr_repricing = {};
    get_vendor_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_booking',
       },
       data: {
           'order_number': data,
           'signature': signature
       },
       success: function(msg) {
       act_order_number = data;
       act_get_booking = msg;
       $('#loading-search-activity').hide();
       document.getElementById('button-home').hidden = false;
       document.getElementById('button-new-reservation').hidden = false;
       hide_modal_waiting_transaction();
       try{
            if(msg.result.error_code == 0){
                price_arr_repricing = {};
                pax_type_repricing = [];
                can_issued = msg.result.response.can_issued;
                tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                localTime  = moment.utc(tes).toDate();
                msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                data_gmt = moment(msg.result.response.hold_date)._d.toString().split(' ')[5];
                gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                timezone = data_gmt.replace (/[^\d.]/g, '');
                timezone = timezone.split('')
                timezone = timezone.filter(item => item !== '0')

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
                var now = moment();
                var hold_date_time = moment(msg.result.response.hold_date, "DD MMM YYYY HH:mm");
                if(msg.result.response.no_order_number){
                    text = ``;
                    voucher_text = ``;
                }
                else{
                    if(msg.result.response.state == 'issued'){
                        try{
                            document.getElementById('voucher_discount').style.display = 'none';
                        }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                        }
                        conv_status = 'Issued';
                        document.getElementById('issued-breadcrumb').classList.add("br-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Issued`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-success" role="alert">
                            <h5>Your booking has been successfully Issued!</h5>
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
                    }
                    else if(msg.result.response.state == 'booked'){
                        document.getElementById('voucher_discount').style.display = '';
                        conv_status = 'Booked';
                        document.getElementById('issued-breadcrumb').classList.add("br-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Booked`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Booked`;

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
                    else if(msg.result.response.state == 'rejected'){
                        conv_status = 'Rejected';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Rejected`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Rejected`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Rejected!</h5>
                        </div>`;
                    }
                    else if(msg.result.response.state == 'cancel'){
                        conv_status = 'Cancelled';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Cancelled`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Cancelled!</h5>
                        </div>`;
                    }
                    else if(msg.result.response.state == 'cancel2'){
                        conv_status = 'Expired';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Expired`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Expired!</h5>
                        </div>`;
                    }
                    else if(msg.result.response.state == 'fail_issued'){
                        conv_status = 'Failed (Issue)';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Issue)`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Issue)`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Failed (Issue)!</h5>
                        </div>`;
                    }
                    else if(msg.result.response.state == 'fail_booked'){
                        conv_status = 'Failed (Book)';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Book)`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Book)`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Failed (Book)!</h5>
                        </div>`;
                    }
                    else if(msg.result.response.state == 'fail_refunded'){
                        conv_status = 'Failed (Refunded)';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Refunded)`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Refunded)`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            <h5>Your booking has been Failed (Refunded)!</h5>
                        </div>`;
                    }
                    else if(msg.result.response.state == 'refund'){
                        conv_status = 'Refunded';
                        document.getElementById('issued-breadcrumb').classList.add("br-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Refunded`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Refunded`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-success" role="alert">
                            <h5>Your booking has been Refunded!</h5>
                        </div>`;
                    }
                    else if(msg.result.response.state == 'reissue'){
                        conv_status = 'Reissued';
                        document.getElementById('issued-breadcrumb').classList.add("br-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Reissued`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Reissued`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-success" role="alert">
                            <h5>Your booking has been Reissued!</h5>
                        </div>`;
                    }
                    else if(msg.result.response.state == 'paid' || msg.result.response.state == 'pending'){
                        conv_status = 'On Request (max 3 working days)';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-pending");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-pending");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-clock"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `On Request (max 3 working days)`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Requested`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-info" role="alert">
                            <h5>Your booking has been Requested!</h5>
                        </div>`;
                    }
                    else{
                        conv_status = 'On Request (max 3 working days)';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-pending");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-pending");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-clock"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `On Request (max 3 working days)`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Requested`;
                        document.getElementById('alert-state').innerHTML = `
                        <div class="alert alert-success" role="alert">
                            <h5>Your booking has been Requested!</h5>
                        </div>`;
                    }

                    text = `
                            <div class="row">
                                <div class="col-lg-12">
                                    <div id="activity_booking_detail" style="border:1px solid #cdcdcd; padding:10px; background-color:white">
                                        <h6>Order Number : `+msg.result.response.order_number+`</h6><br/>
                                         <table style="width:100%;">
                                            <tr>
                                                <th>PNR</th>`;
                                                if(msg.result.response.state == 'booked')
                                                    text+=`<th>Hold Date</th>`;
                                            text+=`
                                                <th>Status</th>
                                            </tr>
                                            <tr>`;
                                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                                text+=`
                                                <td>`+msg.result.response.pnr+`</td>`;
                                            else
                                                text+=`<td> - </td>`;

                                            if(msg.result.response.state == 'booked'){
                                                text+=`<td>`+msg.result.response.hold_date+` `+gmt+timezone+`</td>`;
                                            }

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

                                        <hr/>
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <h6>Booked</h6>
                                                <span>Date: <b>`;
                                                    if(msg.result.response.booked_date != ""){
                                                        text+=``+msg.result.response.booked_date+``;
                                                    }else{
                                                        text+=`-`
                                                    }
                                                    text+=`</b>
                                                </span>
                                                <br/>
                                                <span>by <b>`+msg.result.response.booked_by+`</b><span>
                                            </div>

                                            <div class="col-lg-6 mb-3">`;
                                                if(msg.result.response.state == 'issued'){
                                                    text+=`<h6>Issued</h6>
                                                        <span>Date: <b>`;
                                                        if(msg.result.response.issued_date != ""){
                                                            text+=``+msg.result.response.issued_date+``;
                                                        }else{
                                                            text+=`-`
                                                        }
                                                    text+=`</b>
                                                    </span>
                                                    <br/>
                                                    <span>by <b>`+msg.result.response.issued_by+`</b><span>`;
                                                }
                                                text+=`
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                    `;

                    act_name = '';
                    act_type_name = '';
                    act_visit_date = '';
                    act_timeslot = '';
                    for(i in msg.result.response.provider_booking)
                    {
                        for(j in msg.result.response.provider_booking[i].activity_details)
                        {
                            act_name = msg.result.response.provider_booking[i].activity_details[j].activity;
                            act_type_name = msg.result.response.provider_booking[i].activity_details[j].activity_type;
                            act_visit_date = msg.result.response.provider_booking[i].activity_details[j].visit_date;
                            text += `
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div id="activity_booking_info" style="padding:10px; margin-top: 15px; background-color:white; border:1px solid #cdcdcd;">
                                            <h4> Activity Information </h4>
                                            <hr/>
                                            <h4>`+msg.result.response.provider_booking[i].activity_details[j].activity+`</h4>
                                            <span>`+msg.result.response.provider_booking[i].activity_details[j].activity_type+`</span>
                                            <br/>
                                            <span><i class="fa fa-calendar" aria-hidden="true"></i>
                                                `+msg.result.response.provider_booking[i].activity_details[j].visit_date+`
                                            </span>`;

                            if (msg.result.response.provider_booking[i].activity_details[j].timeslot)
                            {
                                act_timeslot = msg.result.response.provider_booking[i].activity_details[j].timeslot;
                                text += `<br/>
                                <span><i class="fa fa-clock-o" aria-hidden="true"></i>
                                    `+msg.result.response.provider_booking[i].activity_details[j].timeslot+`
                                </span>`;
                            }

                           text += `<br/>
                                            </div>
                                        </div>
                                    </div>

                            `;
                        }
                    }

                   if(msg.result.response.booking_options.length > 0){
                        text += `
                            <div class="row" style="margin-top: 15px;">
                            <div class="col-lg-12">
                                <div id="activity_review_perbooking" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                                    <div style="padding:10px;">
                                        <h4> Additional Information </h4>
                                        <hr/>
                                        <table style="width:100%;" id="list-of-perbooking" class="list-of-passenger-class">
                                            <tr>
                                                <th style="width:5%;" class="list-of-passenger-left">No</th>
                                                <th style="width:65%;">Information</th>
                                                <th style="width:30%;">Value</th>
                                            </tr>
                        `;
                        temp_seq = 1;
                        for(i in msg.result.response.booking_options){
                            text += `
                                <tr>
                                    <td>`+temp_seq+`</td>
                                    <td>`+msg.result.response.booking_options[i].name+`</td>
                                    <td>`+msg.result.response.booking_options[i].description+`</td>
                                </tr>
                            `;
                            temp_seq += 1;
                        }
                        text += `
                            </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                   }
                   text += `
                        <div class="row" style="margin-top: 15px;">
                            <div class="col-lg-12">
                                <div id="activity_review_booker" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                                    <div style="padding:10px;">
                                        <h4> Contact Information </h4>
                                        <hr/>
                                        <table style="width:100%;" id="list-of-bookers" class="list-of-passenger-class">
                                            <tr>
                                                <th style="width:5%;" class="list-of-passenger-left">No</th>
                                                <th style="width:45%;">Full Name</th>
                                                <th style="width:25%;">Email</th>
                                                <th style="width:25%;" class="list-of-passenger-right">Mobile Phone</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <td>`+msg.result.response.contact.title+`. `+msg.result.response.contact.name+`</td>
                                                <td>`+msg.result.response.contact.email+`</td>
                                                <td>`+msg.result.response.contact.phone+`</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                   `;

                   text += `
                       <div class="row" style="margin-top: 15px;">
                            <div class="col-lg-12">
                                <div id="activity_review_passenger" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                                    <div style="padding:10px;">
                                        <h4> List of Guest(s) </h4>
                                        <hr/>
                                        <table style="width:100%;" id="list-of-passengers" class="list-of-passenger-class">
                                            <tr>
                                                <th style="width:5%;" class="list-of-passenger-left">No</th>
                                                <th style="width:45%;">Full Name</th>
                                                <th style="width:10%;">Type</th>
                                                <th style="width:25%;">Birth Date</th>
                                                <th style="width:15%;" class="list-of-passenger-right">Ticket</th>
                                            </tr>
                   `;

                   temp_pax_seq = 1
                   for(i in msg.result.response.passengers)
                   {
                        text += `
                            <tr>
                                <td>`+temp_pax_seq+`</td>
                                <td>`+msg.result.response.passengers[i].title+`. `+msg.result.response.passengers[i].name+`</td>
                                <td>`+msg.result.response.passengers[i].pax_type+`</td>
                                <td>`+msg.result.response.passengers[i].birth_date+`</td>
                                <td>`+msg.result.response.passengers[i].sku_name+`</td>
                            </tr>
                        `;
                        temp_pax_seq += 1;
                   }

                   text += `
                                         </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="margin-top: 20px;">
                            <div class="col-lg-4" id="voucher" style="padding-bottom:10px;">`;
                   if(msg.result.response.state == 'issued'){
                        if (msg.result.response.voucher_url.length > 0)
                        {
                            text += `<button class="primary-btn hold-seat-booking-train next-loading-ticket ld-ext-right" type="button" onclick="openInNewTab('`+msg.result.response.voucher_url[0]+`');" style="width:100%;">
                                        Print Voucher
                                        <div class="ld ld-ring ld-cycle"></div>
                                     </button>`;
                        }
                        else
                        {
                            text += `<button class="primary-btn hold-seat-booking-train next-loading-ticket ld-ext-right" type="button" onclick="activity_get_voucher('`+msg.result.response.order_number+`');" style="width:100%;">
                                        Print Voucher
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;
                        }
                   }
                   text += `</div>
                            <div class="col-lg-4" style="padding-bottom:10px;">`;
                   if(msg.result.response.state == 'pending' || msg.result.response.state == 'paid')
                   {
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
                                            <h4 class="modal-title" style="color:`+text_color+`">Invoice</h4>
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
                                                <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','activity');">
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
                            <div class="col-lg-4" style="padding-bottom:10px;">`;

                   if(msg.result.response.state == 'issued'){
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
                                            <h4 class="modal-title" style="color:`+text_color+`">Invoice</h4>
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
                                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-2 unset">
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
                                                <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','activity');">
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
                }
                document.getElementById('activity_final_info').innerHTML = text;
                document.getElementById('product_title').innerHTML = act_name;
                if(act_name != act_type_name)
                    document.getElementById('product_type_title').innerHTML = act_type_name;
                price_text = '';
                $test = 'Order Number: '+ msg.result.response.order_number + '\n';
                $test += 'Booking Code: '+ msg.result.response.pnr+'\n';
                $test += 'Status: '+ conv_status+'\n\n';

                $test += act_name+'\n';
                if(act_name != act_type_name)
                    $test += act_type_name+'\n';
                var visit_date_txt = act_visit_date;
                $test += 'Visit Date : '+act_visit_date+'\n';
                if(msg.result.response.timeslot != '')
                {
                    $test += 'Time slot: '+ act_timeslot +'\n';
                    visit_date_txt += ' (' + act_timeslot + ')';
                }

                document.getElementById('product_visit_date').innerHTML = visit_date_txt;
                //detail
                text = '';
                tax = 0;
                fare = 0;
                total_price = 0;
                total_price_for_discount = 0;
                commission = 0;
                service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'DISC'];

                //repricing
                type_amount_repricing = ['Repricing'];
                total_price_provider = [];
                //repricing
                counter_service_charge = 0;
                disc = 0;

                $test += '\nContact Person:\n';
                $test += msg.result.response.contact.title + ' ' + msg.result.response.contact.name + '\n';
                $test += msg.result.response.contact.email + '\n';
                $test += msg.result.response.contact.phone+ '\n';

                $test += '\nPrice:\n';
                csc = 0;
                for(i in msg.result.response.provider_booking){
                    try{
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                            price_text+=`
                                <div style="text-align:left">
                                    <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_booking[i].pnr+` </span>
                                </div>`;
                            for(j in msg.result.response.passengers){
                                price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                                for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_booking[i].pnr]){
                                    price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_booking[i].pnr][k].amount;
                                    if(price['currency'] == '')
                                        price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_booking[i].pnr][k].currency;
                                }
                                disc -= price['DISC'];
                                if(i ==0 ){
                                    //HANYA PROVIDER PERTAMA KARENA UPSELL PER PASSENGER BUKAN PER JOURNEY
                                    try{
                                        price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
                                        csc += msg.result.response.passengers[j].channel_service_charges.amount;
                                    }catch(err){
                                        console.log(err); // error kalau ada element yg tidak ada
                                    }
                                }
                                //repricing
                                check = 0;
                                for(k in pax_type_repricing){
                                    if(pax_type_repricing[k][0] == msg.result.response.passengers[j].name)
                                        check = 1;
                                }
                                if(check == 0){
                                    pax_type_repricing.push([msg.result.response.passengers[j].name, msg.result.response.passengers[j].name]);
                                    price_arr_repricing[msg.result.response.passengers[j].name] = {
                                        'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                                        'Tax': price['TAX'] + price['ROC'],
                                        'Repricing': price['CSC']
                                    }
                                }else{
                                    price_arr_repricing[msg.result.response.passengers[j].name] = {
                                        'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'] + price['SEAT'],
                                        'Tax': price_arr_repricing[msg.result.response.passengers[j].name]['Tax'] + price['TAX'] + price['ROC'],
                                        'Repricing': price['CSC']
                                    }
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
                                   text_repricing += `
                                   <div class="col-lg-12">
                                        <div style="padding:5px;" class="row" id="adult">
                                            <div class="col-lg-3" id="`+j+`_`+k+`">`+k+`</div>
                                            <div class="col-lg-3" id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                                            if(price_arr_repricing[k].Repricing == 0)
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">-</div>`;
                                            else
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                                        </div>
                                    </div>`;
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
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;

                                    if(counter_service_charge == 0){
                                    price_text+=`
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC))+`</span>`;
                                    }else{
                                        price_text+=`
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC))+`</span>`;
                                    }
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
                            if(csc != 0){
                                price_text+=`
                                    <div class="row" style="margin-bottom:5px;">
                                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                            <span style="font-size:12px;">Other service charges</span>`;
                                        price_text+=`</div>
                                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(csc))+`</span>
                                        </div>
                                    </div>`;
                            }
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
                           <span style="font-weight:bold">IDR `+getrupiah(Math.ceil(total_price))+`</span>
                      </div>
                 </div>`;
                 if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                    price_text+=`
                 <div style="text-align:right; padding-bottom:10px; margin-top:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                 }
                 if(msg.result.response.state == 'booked')
                 price_text+=`<div class="row">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <hr/>
                        <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                        share_data();
                        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        if (isMobile) {
                            price_text+=`
                                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        } else {
                            price_text+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the activity price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        }

                    price_text+=`
                    </div>
                 </div>`;
                 if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                     price_text+=`
                     <div class="row" id="show_commission" style="display:block;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">YPM</span>
                                    </div>
                                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:bold;">IDR `+getrupiah(parseInt(commission)*-1)+`</span>
                                    </div>
                                </div>`;
                                if(msg.result.response.hasOwnProperty('agent_nta') == true){
                                    total_nta = 0;
                                    total_nta = msg.result.response.agent_nta;
                                    price_text+=`<div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">Total NTA</span>
                                    </div>
                                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:bold;">IDR `+getrupiah(total_nta)+`</span>
                                    </div>
                                </div>`;
                                }
                                if(msg.result.response.hasOwnProperty('total_nta') == true){
                                    total_nta = 0;
                                    total_nta = msg.result.response.total_nta;
                                    price_text+=`<div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">Total NTA</span>
                                    </div>
                                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:bold;">IDR `+getrupiah(total_nta)+`</span>
                                    </div>
                                </div>`;
                                }
                                if(msg.result.response.hasOwnProperty('booker_insentif') == true){
                                    booker_insentif = 0;
                                    booker_insentif = msg.result.response.booker_insentif;
                                    text_detail+=`<div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">Booker Insentif</span>
                                    </div>
                                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(booker_insentif)+`</span>
                                    </div>
                                </div>`;
                                }
                                if(commission == 0){
                                    text_detail+=`
                                    <div class="row">
                                        <div class="col-lg-12 col-xs-12" style="text-align:left;">
                                            <span style="font-size:13px; color:red;">* Please mark up the price first</span>
                                        </div>
                                    </div>`;
                                }
                                price_text+=`
                            </div>
                        </div>
                     </div>`;
                 price_text+=`
                 <div class="row" style="margin-top:10px; text-align:center;">
                   <div class="col-xs-12">
                        <input type="button" class="primary-btn-white" onclick="copy_data();" value="Copy" style="width:100%;"/>
                   </div>
                 </div>`;
                 if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                     price_text+=`
                     <div class="row" style="margin-top:10px; text-align:center;">
                       <div class="col-xs-12">
                            <input type="button" class="primary-btn-white" id="show_commission_button" value="Hide Commission" style="width:100%;" onclick="show_commission();"/>
                       </div>
                     </div>`;
                $test+= '\nGrand Total : IDR '+ getrupiah(Math.ceil(total_price))+'\nPrices and availability may change at any time';
                document.getElementById('activity_detail_table').innerHTML = price_text;
                add_repricing();

                if(msg.result.response.state == 'booked')
                {
                    try{
                        if(can_issued){
                            if(user_login.co_job_position_is_request_required == true && msg.result.response.issued_request_status != "approved")
                            {
                                document.getElementById('final_issued_btn').setAttribute("onClick", "activity_request_issued('"+msg.result.response.order_number+"');");
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
                            check_payment_payment_method(activity_order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'activity', signature, msg.result.response.payment_acquirer_number);
        //                    get_payment_acq('Issued', msg.result.response.booker.seq_id, activity_order_number, 'billing',signature,'activity', signature);
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

                if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                    try{
                        render_voucher(price.currency,msg.result.response.voucher_discount, msg.result.response.state)
                    }catch(err){console.log(err);}
                }
                try{
                    if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                        document.getElementById('voucher_discount').style.display = 'block';
                    else
                        document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){console.log(err);}
            }else if(msg.result.error_code == 1035){
                    document.getElementById('activity_detail').hidden = true;
                    render_login('activity');
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error activity booking </span>' + msg.result.error_msg,
                })
            }
        }catch(err){
            text = '';
            Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error activity booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
            }).then((result) => {
              window.location.href = '/reservation';
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity booking');
       },timeout: 60000
    });
}

function activity_get_voucher(order_number){
    $('.next-loading-ticket').addClass("running");
    $('.next-loading-ticket').prop('disabled', true);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_voucher',
       },
       data: {
            'order_number': order_number,
            'signature': signature
       },
       success: function(msg) {
        $('.next-loading-ticket').removeClass("running");
        $('.next-loading-ticket').prop('disabled', false);
        if(msg.result.error_code == 0){
            openInNewTab(msg.result.response[0].name);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error activity voucher </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activity voucher');
       },timeout: 60000
    });
}

function activity_search_autocomplete(term,suggest){
    clearTimeout(activityAutoCompleteVar);
    term = term.toLowerCase();
    check = 0;
    var priority = [];

    getToken();
    activityAutoCompleteVar = setTimeout(function() {
        $.ajax({
           type: "POST",
           url: "/webservice/activity",
           headers:{
                'action': 'get_auto_complete',
           },
           data: {
                'name':term,
           },
           success: function(msg) {
            activity_choices = msg;
            suggest(activity_choices);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
           }
        });
    }, 150);
}

function datepicker(val){
    $('#'+val).daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          showDropdowns: true,
          opens: 'center',
          locale: {
              format: 'YYYY-MM-DD',
          }
     });
}

function get_unique_list_data(data){
  unique = [];
  for(rec in data){
    check = 0;
    for(rec1 in unique){
      if(unique[rec1].data_country == data[rec]){
        unique[rec1]['count'] += 1
        check = 1;
      }

    }
    if(check == 0){
      unique.push({
        'data_country': data[rec],
        'count': 1
      })
    }
  }
  return unique;
}