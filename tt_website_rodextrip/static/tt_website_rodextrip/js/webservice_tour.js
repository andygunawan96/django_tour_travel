var tour_data = [];
offset = 0;
high_price_slider = 0;
low_price_slider = 99999999;
step_slider = 0;
last_session = '';

function tour_redirect_signup(type){
    if(type != 'signin'){
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/tour",
           headers:{
                'action': 'signin',
           },
    //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
           data: {},
           success: function(msg) {
           try{
               console.log(msg);
               if(msg.result.error_code == 0){
                    tour_signature = msg.result.response.signature;
                    new_login_signature = msg.result.response.signature;

                    if(type != 'search'){
                        $.ajax({
                           type: "POST",
                           url: "/webservice/tour",
                           headers:{
                                'action': 'search',
                           },
                           data: {
                               'use_cache': true,
                               'signature': new_login_signature
                           },
                           success: function(msg) {
                           console.log(msg);
                               if(msg.result.error_code == 0){
                                    if(type != 'get_details'){
                                        $.ajax({
                                           type: "POST",
                                           url: "/webservice/tour",
                                           headers:{
                                                'action': 'get_details',
                                           },
                                           data: {
                                              'use_cache': true,
                                              'signature': new_login_signature,
                                           },
                                           success: function(msg) {
                                                console.log(msg);
                                                if(msg.result.error_code == 0 && type != 'get_pricing'){
                                                    $.ajax({
                                                       type: "POST",
                                                       url: "/webservice/tour",
                                                       headers:{
                                                            'action': 'get_pricing',
                                                       },
                                                       data: {
                                                            'use_cache': true,
                                                            'signature': new_login_signature
                                                       },
                                                       success: function(msg) {
                                                            console.log(msg);
                                                            if(type != 'sell_journeys' && msg.result.error_code == 0){

                                                            }else{
                                                                signature = new_login_signature;
                                                                $('#myModalSignin').modal('hide');
                                                                location.reload();

                                                            }
                                                    },error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                       },timeout: 60000
                                                    });
                                                }else{
                                                    signature = new_login_signature;
                                                    $('#myModalSignin').modal('hide');
                                                    location.reload();

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
              }catch(err){}
           },timeout: 60000
        });
    }
}

function tour_login(data, type=''){
    //document.getElementById('activity_category').value.split(' - ')[1]
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'signin',
       },
       data: {

       },
       success: function(msg) {
           if(msg.result.error_code == 0){
               signature = msg.result.response.signature;
               get_carriers_tour();
               if(type == '' || data == ''){
                   tour_search();
               }else if(type == 'get_booking'){
                   tour_get_booking(data);
               }else if(type == 'get_details'){
                   tour_get_details(data);
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $('#loading-search-tour').hide();
               }catch(err){}
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour login');
            try{
                $('#loading-search-tour').hide();
            }catch(err){}
       },timeout: 60000
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
           console.log(msg);
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
            console.log(msg);
            get_tour_config(type);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour config');
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
            console.log(msg);
            tour_country = [];
            sub_category = {};

            var country_selection = document.getElementById('tour_countries');

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
                    'id': msg.tour_countries[i].uuid
                });
            }

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
                country_txt += `<option value="0" selected="">All Countries</option>`;
                for(i in tour_country)
                {
                    country_txt += `<option value="`+tour_country[i].id+`">`+tour_country[i].name+`</option>`;
                }
            }

            country_selection.innerHTML = country_txt;
            if(template == 1 || template == 2 || template == 5){
                $('#tour_countries').niceSelect('update');
            }

            country_selection.setAttribute("onchange", "auto_complete_tour('tour_countries');");
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
        console.log(msg);
        if(google_analytics != '')
            gtag('event', 'tour_search', {});
           var text = '';
           var counter = 0;
           data=[]
           if(msg.result.error_code == 0){
               tour_data = msg.result.response.result;
               $('#loading-search-tour').hide();
               if (tour_data.length == 0)
               {
                    text += `
                        <div class="col-lg-12">
                            <div style="text-align:center">
                                <img src="/static/tt_website_rodextrip/images/nofound/no-tour.png" style="width:70px; height:70px;" alt="Not Found Tour" title="" />
                                <br/>
                            </div>
                            <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Tour not found. Please try again or search another tour. </h6></div></center>
                        </div>
                    `;
               }
               for(i in tour_data){
                   if(high_price_slider < tour_data[i].est_starting_price){
                        high_price_slider = tour_data[i].est_starting_price;
                   }

                   if(low_price_slider > tour_data[i].est_starting_price){
                        low_price_slider = tour_data[i].est_starting_price;
                   }

                   if (tour_data[i].images_obj.length > 0)
                   {
                       img_src = tour_data[i].images_obj[0].url;
                   }
                   else
                   {
                       img_src = static_path_url_server+`/public/tour_packages/not_found.png`;
                   }

                   text+=`
                   <div class="col-lg-4 col-md-6">
                        <form action='/tour/detail/`+tour_data[i].tour_code+`' method='POST' id='tour_select_form`+tour_data[i].tour_code+`'>
                            <div id='csrf`+tour_data[i].tour_code+`'></div>
                            <input type='hidden' value='`+JSON.stringify(tour_data[i]).replace(/[']/g, /["]/g)+`'/>
                            <input id='uuid`+tour_data[i].tour_code+`' name='uuid' type='hidden' value='`+tour_data[i].id+`'/>
                            <input id='sequence`+tour_data[i].tour_code+`' name='sequence' type='hidden' value='`+tour_data[i].sequence+`'/>`;
                            if(template == 1){
                                text+=`
                                    <div class="single-recent-blog-post item" style="cursor:unset;">
                                        <div class="single-destination avail-sd relative">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border:1px solid #cdcdcd; height:200px; background: white url('`+img_src+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion">
                                                <div class="card-body">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h5>`;
                                                            if(tour_data[i].tour_line_amount != 0){
                                                                if(tour_data[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_data[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_data[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_data[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_data[i].est_starting_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_data[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;

                            }else if(template == 2){
                                text+=`
                                    <div class="single-post-area mb-30" style="transform:unset;">
                                        <div class="single-destination avail-sd relative" style="border:unset;">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+img_src+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body" style="padding:10px; border:unset;">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h5>`;
                                                            if(tour_data[i].tour_line_amount != 0){
                                                                if(tour_data[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_data[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_data[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_data[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_data[i].est_starting_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_data[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }else if(template == 3){
                                text+=`
                                    <div class="single-post-area mb-30">
                                        <div class="single-destination avail-sd relative">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+img_src+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body" style="padding:10px; border:unset;">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h5>`;
                                                            if(tour_data[i].tour_line_amount != 0){
                                                                if(tour_data[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_data[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_data[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_data[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_data[i].est_starting_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_data[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }else if(template == 4){
                                text+=`
                                    <div class="single-post-area mb-30">
                                        <div class="single-destination avail-sd relative">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+img_src+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body" style="padding:10px; border:unset;">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h5>`;
                                                            if(tour_data[i].tour_line_amount != 0){
                                                                if(tour_data[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_data[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_data[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_data[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_data[i].est_starting_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_data[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }else if(template == 5){
                                text+=`
                                    <div class="single-post-area mb-30">
                                        <div class="single-destination avail-sd relative" style="border:1px solid #cdcdcd;">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+img_src+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_data[i].tour_code+`')">`;
                                            }
                                            text+=`
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body" style="padding:10px; border:unset;">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h5>`;
                                                            if(tour_data[i].tour_line_amount != 0){
                                                                if(tour_data[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_data[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_data[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_data[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_data[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_data[i].est_starting_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_data[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }
                            text+=`
                        </form>
                    </div>
                   `;
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

               offset++;
               document.getElementById('tour_ticket').innerHTML += text;

               for(i in tour_data){
                   content_pop_date = '';
                   content_pop_question = '';
                   title_pop_date = '';
                   if(tour_data[i].tour_type == 'series'){
                        content_pop_question+=`<b>Series: </b>Organized Public Tour with Tour Leader.`;
                    }
                    else if(tour_data[i].tour_type == 'sic'){
                        content_pop_question+=`<b>SIC: </b>Organized Public Tour without Tour Leader.`;
                    }
                    else if(tour_data[i].tour_type == 'land'){
                        content_pop_question+=`<b>Land Only: </b>Organized Tour with its price not including accommodation nor transportation.`;
                    }
                    else if(tour_data[i].tour_type == 'city'){
                        content_pop_question+=`<b>City Tour: </b>Tour visiting various favorite destinations of a certain city.`;
                    }
                    else if(tour_data[i].tour_type == 'open'){
                        content_pop_question+=`<b>Open Trip: </b>Unorganized Tour where tour participants can choose their own Departure Date within certain period.`;
                    }
                    else if(tour_data[i].tour_type == 'private'){
                        content_pop_question+=`<b>Private Tour: </b>Private Tour organized according to the participant's request.`;
                    }

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
                            if(tour_data[i].tour_type != 'open'){
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
        console.log(msg);
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
                    if(tour_data.tour_type == 'open'){
                        country_text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_data.tour_type_str+`</span>`;
                    }else{
                        country_text+=tour_data.tour_type_str;
                    }

               if(tour_data.tour_type == 'series'){
                    content_pop_question+=`<b>Series: </b>Organized Public Tour with Tour Leader.`;
                }
                else if(tour_data.tour_type == 'sic'){
                    content_pop_question+=`<b>SIC: </b>Organized Public Tour without Tour Leader.`;
                }
                else if(tour_data.tour_type == 'land'){
                    content_pop_question+=`<b>Land Only: </b>Organized Tour with its price not including accommodation nor transportation.`;
                }
                else if(tour_data.tour_type == 'city'){
                    content_pop_question+=`<b>City Tour: </b>Tour visiting various favorite destinations of a certain city.`;
                }
                else if(tour_data.tour_type == 'open'){
                    content_pop_question+=`<b>Open Trip: </b>Unorganized Tour where tour participants can choose their own Departure Date within certain period.`;
                }
                else if(tour_data.tour_type == 'private'){
                    content_pop_question+=`<b>Private Tour: </b>Private Tour organized according to the participant's request.`;
                }

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
                country_text += `<span><i class="fa fa-hotel" aria-hidden="true"></i> Hotel(s) :</span>`;
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
                                             <i class="fa fa-print" aria-hidden="true"></i> Print Document
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
                                    Day `+tour_data.itinerary_ids[it_idx].day+`</span> - `+tour_data.itinerary_ids[it_idx].name+`
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
                                        <div class="col-lg-9" style="padding-bottom:15px;">
                                            <h5>`+tour_data.itinerary_ids[it_idx].items[it_item].name+`</h5>`;
                                        if (tour_data.itinerary_ids[it_idx].items[it_item].description){
                                            itinerary_text += `<span style="font-size: 13px;">`+tour_data.itinerary_ids[it_idx].items[it_item].description+`</span><br/>`;
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
                                            <span>
                                                <strong>`+tour_data.itinerary_ids[it_idx].items[it_item].name+`</strong>`;

                                                if (tour_data.itinerary_ids[it_idx].items[it_item].description){
                                                    itinerary_text += tour_data.itinerary_ids[it_idx].items[it_item].description;
                                                }
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

                if (tour_data.tour_type == 'open')
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

                console.log(tour_data);
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
                                <button type="button" class="primary-btn-ticket btn-add-rooms" style="line-height:26px;" value="`+tour_data.accommodations[n].room_code+`" onclick="add_tour_room(`+n+`)">Add</button>
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
        console.log(msg);
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
        console.log(msg);
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
        console.log(msg);
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
                document.getElementById("type").value = 'tour';
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
    data = {
        'value': val,
        'signature': signature
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['payment_method'] = payment_method_choice;
        data['voucher_code'] =  voucher_code;
    }catch(err){
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
           console.log(msg);
           if(google_analytics != ''){
               if(data.hasOwnProperty('member') == true)
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
                        send_url_booking('tour', btoa(msg.result.response.order_number), msg.result.response.order_number);
                        document.getElementById('order_number').value = msg.result.response.order_number;
                        document.getElementById('tour_issued').submit();
                    }else{
                        document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
                        document.getElementById('tour_booking').action = '/tour/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('tour_booking').submit();
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
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour commit booking');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
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
           console.log(msg);
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
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'issued_booking',
       },
       data: {
           'order_number': order_number,
           'payment_method': payment_method_choice,
           'seq_id': payment_acq2[payment_method][selected].seq_id,
           'member': payment_acq2[payment_method][selected].method,
           'signature': signature,
           'voucher_code': voucher_code
       },
       success: function(msg) {
           console.log(msg);
           if(google_analytics != '')
               gtag('event', 'tour_issued', {});
           if(msg.result.error_code == 0){
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
           }else
           {
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error tour issued booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
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
                tour_get_booking(order_number);
                $("#issuedModal").modal('hide');
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                hide_modal_waiting_transaction();
           }
       },
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

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = []
        for(i in tr_get_booking.result.response.passengers){
            for(j in tr_get_booking.result.response.passengers[i].sale_service_charges){
                currency = tr_get_booking.result.response.passengers[i].sale_service_charges[j].FARE.currency;
            }
            list_price = []
            for(j in list){
                if(tr_get_booking.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                }

            }
            upsell.push({
                'sequence': tr_get_booking.result.response.passengers[i].sequence,
                'pricing': JSON.parse(JSON.stringify(list_price))
            });
        }
        repricing_order_number = tour_order_number;
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
           console.log(msg);
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
           console.log(msg);
           tour_order_number = order_number;
           tr_get_booking = msg;
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

               tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
               localTime  = moment.utc(tes).toDate();
               var now = moment();
               var hold_date_time = moment(localTime, "DD MMM YYYY HH:mm");
               data_gmt = moment(msg.result.response.hold_date)._d.toString().split(' ')[5];
               gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
               timezone = data_gmt.replace (/[^\d.]/g, '');
               timezone = timezone.split('')
               timezone = timezone.filter(item => item !== '0')
               if(cur_state == 'booked'){
                    conv_status = 'Booked';
                    document.getElementById('voucher_discount').style.display = '';
                    document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                }
                else if(cur_state == 'issued'){
                    conv_status = 'Issued';
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                    document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                    document.getElementById('voucher_discount').innerHTML = '';
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
                    document.getElementById('voucher_discount').innerHTML = '';
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
                    document.getElementById('voucher_discount').innerHTML = '';
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
                    document.getElementById('voucher_discount').innerHTML = '';
                }
                else{
                    conv_status = 'Pending';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-pending");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-pending");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-clock"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Pending`;
                    document.getElementById('order_state').innerHTML = 'Your Order Is Currently ' + conv_status;
                }

               text = `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="tour_booking_detail" style="border:1px solid #cdcdcd; padding:10px; background-color:white">
                                    <h6>Order Number : `+book_obj.order_number+`</h6><br/>
                                     <table style="width:100%;">
                                        <tr>
                                            <th>PNR</th>
                                            <th>Hold Date</th>
                                            <th>Status</th>
                                        </tr>
                                        <tr>`;
                                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                            text+=`
                                            <td>`+book_obj.pnr+`</td>`;
                                        else
                                            text+=`<td> - </td>`;
                                        text+=`
                                            <td>`+moment(localTime).format('DD MMM YYYY HH:mm')+` `+gmt+timezone+`</td>
                                            <td>`+conv_status+`</td>
                                        </tr>
                                     </table>
                                </div>
                            </div>
                        </div>
                `;

                if (tour_package.tour_type == 'open')
                {
                    text += `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="tour_booking_info" style="padding:10px; margin-top: 15px; background-color:white; border:1px solid #cdcdcd;">
                                    <h4> Tour Information </h4>
                                    <hr/>
                                    <h4>`+tour_package.name+`</h4>
                                    <span><i class="fa fa-clock-o" aria-hidden="true"></i> `+tour_package.duration+` Days</span>
                                    <br/>
                                    <span>Period: `+tour_package.departure_date_str+` - `+tour_package.arrival_date_str+`</span>
                                    <br/>
                                </div>
                            </div>
                        </div>`;
                }
                else
                {
                    text += `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="tour_booking_info" style="padding:10px; margin-top: 15px; background-color:white; border:1px solid #cdcdcd;">
                                    <h4> Tour Information </h4>
                                    <hr/>
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
                                <div id="tour_review_rooms" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                                    <div style="padding:10px;">
                                        <h4> List of Room(s) </h4>
                                        <hr/>
                                        <table style="width:100%;" id="list-of-passengers" class="list-of-passenger-class">
                                            <tr>
                                                <th style="width:5%;" class="list-of-passenger-left">No</th>
                                                <th style="width:15%;">Name</th>
                                                <th style="width:15%;">Type</th>
                                                <th style="width:15%;">Hotel</th>
                                                <th style="width:25%;">Description</th>
                                                <th style="width:25%;" class="list-of-passenger-right">Notes</th>
                                            </tr>
                   `;

                for(i in rooms)
                {
                    text += `
                        <tr>
                            <td>`+rooms[i].room_index+`</td>
                            <td>`+rooms[i].room_name+`</td>
                            <td>`+rooms[i].room_bed_type+`</td>
                            <td>`+rooms[i].room_hotel+`</td>
                            <td>`+rooms[i].room_desc+`</td>
                            <td>`+rooms[i].room_notes+`</td>
                        </tr>
                    `;
                }
                text += `
                                     </table>
                                </div>
                            </div>
                        </div>
                    </div>`;

                   text += `
                        <div class="row" style="margin-top: 15px;">
                            <div class="col-lg-12">
                                <div id="tour_review_booker" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
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
                                                <td>`+contact.title+`. `+contact.name+`</td>
                                                <td>`+contact.email+`</td>
                                                <td>`+contact.phone+`</td>
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
                                <div id="tour_review_passenger" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                                    <div style="padding:10px;">
                                        <h4> List of Guest(s) </h4>
                                        <hr/>
                                        <table style="width:100%;" id="list-of-passengers" class="list-of-passenger-class">
                                            <tr>
                                                <th style="width:5%;" class="list-of-passenger-left">No</th>
                                                <th style="width:45%;">Full Name</th>
                                                <th style="width:10%;">Type</th>
                                                <th style="width:20%;">Birth Date</th>
                                                <th style="width:20%;" class="list-of-passenger-right">Room</th>
                                            </tr>
                   `;

                   temp_pax_seq = 1
                   for(i in passengers)
                   {
                        text += `
                            <tr>
                                <td>`+temp_pax_seq+`</td>
                                <td>`+passengers[i].title+`. `+msg.result.response.passengers[i].name+`</td>
                                <td>`+passengers[i].pax_type+`</td>
                                <td>`+passengers[i].birth_date+`</td>
                                <td>`+passengers[i].tour_room_string+`</td>
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

                   text += `</div>
                            <div class="col-lg-4" style="padding-bottom:10px;">`;
                   if(book_obj.state == 'issued'){
    //                    text += `<button class="primary-btn hold-seat-booking-train" type="button" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.tour/`+book_obj.order_number+`/4')" style="width:100%;">
    //                                Print Invoice
    //                             </button>`;
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
                            <div class="col-lg-4" style="padding-bottom:10px;">

                            </div>
                        </div>
                   `;
                document.getElementById('tour_final_info').innerHTML = text;
                document.getElementById('product_title').innerHTML = tour_package.name;
                document.getElementById('product_type_title').innerHTML = book_obj.departure_date_str+' - '+book_obj.arrival_date_str;
                price_text = '';
                $test = tour_package.name+'\n'+book_obj.departure_date_str+' - '+book_obj.arrival_date_str+'\n';
                $test += 'Status: ' + conv_status+'\n';

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

                $test += '\nContact Person:\n';
                $test += msg.result.response.contact.title + ' ' + msg.result.response.contact.name + '\n';
                $test += msg.result.response.contact.email + '\n';
                $test += msg.result.response.contact.phone+ '\n';

                counter_service_charge = 0;
                $test += '\nPrice:\n';
                for(i in msg.result.response.passengers[0].sale_service_charges){
                    csc = 0;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                        price_text+=`
                            <div style="text-align:left">
                                <span style="font-weight:500; font-size:14px;">PNR: `+i+` </span>
                            </div>`;
                    for(j in msg.result.response.passengers){
                        price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'DISC': 0};
                        for(k in msg.result.response.passengers[j].sale_service_charges[i]){
                            price[k] += msg.result.response.passengers[j].sale_service_charges[i][k].amount;
                            price['currency'] = msg.result.response.passengers[j].sale_service_charges[i][k].currency;
                        }
                        disc -= price['DISC']
                        try{
                            price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
                            csc += msg.result.response.passengers[j].channel_service_charges.amount;
                        }catch(err){

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
                                'Fare': price['FARE'] + price['DISC'],
                                'Tax': price['TAX'] + price['ROC'],
                                'Repricing': price['CSC']
                            }
                        }else{
                            price_arr_repricing[msg.result.response.passengers[j].name] = {
                                'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'] + price['DISC'],
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
                                    <div class="col-lg-3" id="`+k+`_`+i+`">`+k+`</div>
                                    <div class="col-lg-3" id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                                    if(price_arr_repricing[k].Repricing == 0)
                                    text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">-</div>`;
                                    else
                                    text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                                    text_repricing+=`<div class="col-lg-3" id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                                </div>
                            </div>`;
                        }
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
                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price['DISC']);
                            total_price_for_discount += parseInt(price.FARE);
                            $test += msg.result.response.passengers[j].name + ' ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price['DISC']))+'\n';
                        }else{
                            $test += msg.result.response.passengers[j].name + ' ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.FARE + price['DISC']))+'\n';
                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price['DISC']);
                            total_price_for_discount += parseInt(price.FARE);
                        }
                        commission += parseInt(price.RAC);
                        total_price_provider.push({
                            'pnr': msg.result.response.pnr,
                            'provider': msg.result.response.provider,
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
                }

    //           if(msg.result.response.price_itinerary.additional_charge_total)
    //           {
    //                price_text+= `
    //                    <div class="row">
    //                        <div class="col-xs-8">Additional Charge</div>
    //                        <div class="col-xs-3" style="padding-right: 0; text-align: right;" id='additional_price'>`+msg.result.response.price_itinerary.additional_charge_total+`</div>
    //                    </div>
    //                `;
    //                $test += 'Additional price IDR '+getrupiah(msg.result.response.price_itinerary.additional_charge_total)+'\n';
    //           }
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
                 if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                 price_text+=`
                 <div style="text-align:right; padding-bottom:10px; margin-top:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
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
                                <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        } else {
                            price_text+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        }

                    price_text+=`
                    </div>
                 </div>`;
                 if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                    price_text+=`
                     <div class="row" id="show_commission" style="display:none;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">Commission</span>
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
                                if(msg.result.response.hasOwnProperty('agent_nta') == true || msg.result.response.hasOwnProperty('total_nta') == true){
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
                 if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                     price_text+=`
                     <div class="row" style="margin-top:10px; text-align:center;">
                       <div class="col-xs-12" style="padding-bottom:10px;">
                            <input type="button" class="primary-btn-white" id="show_commission_button" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
                       </div>
                     </div>`;
                $test+= '\nGrand Total : IDR '+ getrupiah(Math.ceil(total_price))+'\nPrices and availability may change at any time';
                document.getElementById('tour_detail_table').innerHTML = price_text;
                add_repricing();

               if(cur_state == 'booked')
               {
                   grand_total = total_price;
                   full_pay_opt = document.getElementById('full_payment_amt');
                   if (full_pay_opt)
                   {
                       full_pay_opt.innerHTML = 'IDR ' + getrupiah(grand_total);
                   }
                   print_payment_rules(payment);
                   try{
                       if(now.diff(hold_date_time, 'minutes')<0){
                           check_payment_payment_method(order_number, 'Issued', book_obj.booker.seq_id, 'billing', 'tour', signature, msg.result.response.payment_acquirer_number);
        //                   get_payment_acq('Issued', book_obj.booker.seq_id, order_number, 'billing',signature,'tour');
                           document.getElementById("final_issued_btn").style.display = "block";
                       }
                   }catch(err){}
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
       'provider': tour_data.provider
    }
    if (tour_data.tour_type == 'open')
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
            console.log(msg);
            last_session = 'sell_journeys'
            table_price_update(msg,type);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error tour price itinerary');
       },timeout: 60000
    });
}

function table_price_update(msg,type){
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
        tax = 0;
        fare = 0;
        total_price = 0;
        total_price_provider = [];
        price_provider = 0;
        commission = 0;
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
        type_amount_repricing = ['Repricing'];
        for(i in all_pax){
            pax_type_repricing.push([all_pax[i].first_name +all_pax[i].last_name, all_pax[i].first_name +all_pax[i].last_name]);
            price_arr_repricing[all_pax[i].first_name +all_pax[i].last_name] = {
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
           text_repricing += `
           <div class="col-lg-12">
                <div style="padding:5px;" class="row" id="adult">
                    <div class="col-lg-6" id="`+j+`_`+k+`">`+k+`</div>
                    <div hidden id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                    if(price_arr_repricing[k].Repricing == 0)
                    text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">-</div>`;
                    else
                    text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                    text_repricing+=`<div hidden id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                </div>
            </div>`;
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

    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
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
        }catch(err){}
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
    for (i in price_data)
    {
        if(!price_data[i].charge_code.split('.').includes('room'))
        {
            if(['fare', 'roc'].includes(price_data[i].charge_code))
            {
                if(price_data[i].pax_type == 'ADT')
                {
                    price_txt_adt += `<div class="row">
                                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                               <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+` @IDR `+getrupiah(price_data[i].amount)+`</span>
                                           </div>
                                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                                               <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(price_data[i].total)+`</span>
                                           </div>
                                      </div>`;
                    temp_copy_adt += String(price_data[i].pax_count) + ' ' + price_data[i].description + ' @IDR ' + getrupiah(price_data[i].amount) + '\n';
                    grand_total += price_data[i].total;
                }
                else if(price_data[i].pax_type == 'CHD')
                {
                    price_txt_chd += `<div class="row">
                                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                               <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+` @IDR `+getrupiah(price_data[i].amount)+`</span>
                                           </div>
                                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                                               <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(price_data[i].total)+`</span>
                                           </div>
                                      </div>`;
                    temp_copy_chd += String(price_data[i].pax_count) + ' ' + price_data[i].description + ' @IDR ' + getrupiah(price_data[i].amount) + '\n';
                    grand_total += price_data[i].total;
                }
                else if(price_data[i].pax_type == 'INF')
                {
                    price_txt_inf += `<div class="row">
                                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                               <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+` @IDR `+getrupiah(price_data[i].amount)+`</span>
                                           </div>
                                           <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                                               <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(price_data[i].total)+`</span>
                                           </div>
                                      </div>`;
                    temp_copy_inf += String(price_data[i].pax_count) + ' ' + price_data[i].description + ' @IDR ' + getrupiah(price_data[i].amount) + '\n';
                    grand_total += price_data[i].total;
                }
            }
            else if(price_data[i].charge_type != 'RAC')
            {
                price_txt2 += `<div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:500;">`+price_data[i].pax_count+`x `+price_data[i].description+` @IDR `+getrupiah(price_data[i].amount)+`</span>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                                        <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(price_data[i].total)+`</span>
                                    </div>
                               </div>`;
                temp_copy2 += String(price_data[i].pax_count) + ' ' + price_data[i].description + ' @IDR ' + getrupiah(price_data[i].amount) + '\n';
                grand_total += price_data[i].total;
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
    price_txt2 += `<div class="row">
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
            <span style="font-size:13px; font-weight:500;">Total Charge</span>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
            <span style="font-size:13px; font-weight:500;" id="total_charge_pd"></span>
        </div>
    </div>`;
    total_charge = 0;
    price_txt2 += `<div class="row">
    <div class="col-lg-12">
        <center><h6 style="color:`+color+`; display:block; cursor:pointer;" id="price_detail_tour_down" onclick="show_hide_div('price_detail_tour');">See Detail <i class="fas fa-chevron-down" style="font-size:14px;"></i></h6></center>
    </div>
    <div class="col-lg-12 mt-3" id="price_detail_tour_div" style="display:none;">`;
    for(var j=0; j<room_amount; j++)
    {
        price_txt2 += `<div class="row"><div class="col-xs-12"><span style="font-weight: bold; color:`+color+`;">Room #`+String(j+1)+`</span></div></div>`;
        temp_copy2 += '\nRoom ' + String(j+1) + '\n';
        found_room_price = false;
        for(var k=0; k<room_prices.length; k++)
        {
            if(room_prices[k].charge_code.split('.').includes(String(j+1)))
            {
                found_room_price = true;
                price_txt2 += `<div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:500;">`+room_prices[k].pax_count+`x `+room_prices[k].description+` @IDR `+getrupiah(room_prices[k].amount)+`</span>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align: right;">
                                        <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(room_prices[k].total)+`</span>
                                    </div>
                               </div>`;
                total_charge += room_prices[k].total;
                grand_total += room_prices[k].total;
                temp_copy2 += String(room_prices[k].pax_count) + ' ' + room_prices[k].description + ' @IDR ' + getrupiah(room_prices[k].amount) + '\n';
            }
        }
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
        <center><h6 style="color:`+color+`; display:block; cursor:pointer;" id="price_detail_tour_up" onclick="show_hide_div('price_detail_tour');">Show Less <i class="fas fa-chevron-up" style="font-size:14px;"></i></h6></center>
    </div>`;
    price_txt2 += `</div></div>`;
    try{
        grand_total += upsell_price;
    }catch(err){}
    price_txt = price_txt_adt + price_txt_chd + price_txt_inf + price_txt2;
    $test += temp_copy_adt + temp_copy_chd + temp_copy_inf + temp_copy2;
    $test += '\nGrand Total : IDR '+ getrupiah(grand_total)+
    '\nPrices and availability may change at any time';
    price_txt += `<hr style="padding:0px;">`;
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
        price_txt +=`<div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
    }
    try{
        console.log(upsell_price);
        if(upsell_price != 0){
            price_txt+=`<div class="row" style="padding-bottom:15px;">`
            price_txt+=`
            <div class="col-lg-7" style="text-align:left;">
                <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            price_txt+=`
                <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(upsell_price)+`</span><br/>`;
            price_txt+=`</div></div>`;
        }
    }catch(err){}
    price_txt += `
                   <div class="row">
                        <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                        <div class="col-xs-4" style="text-align: right;"><span style="font-weight:bold">IDR `+getrupiah(grand_total)+`</span></div>
                   </div>
                   <div class="row">
                        <div class="col-lg-12" style="padding-bottom:10px;">
                            <hr/>
                            <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                            share_data();
                            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                            if (isMobile) {
                                price_txt+=`
                                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                            } else {
                                price_txt+=`
                                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                            }

                        price_txt+=`
                        </div>
                   </div>`;
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                       price_txt+=`
                       <div class="row" id="show_commission" style="display:none;">
                            <div class="col-lg-12" style="margin-top:10px; text-align:center;">
                                <div class="alert alert-success">
                                    <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(grand_commission)+`</span><br>
                                </div>
                            </div>
                       </div>`;
                   price_txt+=`
                   <div class="row" style="margin-top:10px; text-align:center;">
                       <div class="col-lg-12">
                           <input type="button" class="primary-btn-white" onclick="copy_data();" value="Copy" style="width:100%;"/>
                       </div>
                   </div>`;
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                       price_txt+=`
                       <div class="row" style="margin-top:10px; text-align:center;">
                           <div class="col-lg-12" style="padding-bottom:10px;">
                                <input type="button" id="show_commission_button" class="primary-btn-white" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
                           </div>
                       </div>`;


    document.getElementById('tour_detail_table').innerHTML = price_txt;
    document.getElementById('total_charge_pd').innerHTML = `<span>IDR `+getrupiah(total_charge)+`</span>`;
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
            full_pay_opt.innerHTML = 'IDR ' + getrupiah(grand_total);
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

       },
       success: function(msg) {
            console.log(msg);
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
    console.log(term);
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