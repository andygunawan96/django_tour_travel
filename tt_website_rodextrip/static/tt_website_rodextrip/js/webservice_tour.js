var tour_data = [];
offset = 0;
high_price_slider = 0;
low_price_slider = 99999999;
step_slider = 0;

function tour_login(data){
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
               if(data == ''){
                   tour_search();
               }else if(data != ''){
                   tour_get_booking(data);
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour login </span>' + errorThrown,
            })
            try{
                $('#loading-search-tour').hide();
            }catch(err){}
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
                for(j in msg.tour_countries[i].city.response)
                {
                    city.push({
                        'name': msg.tour_countries[i].city.response[j].name,
                        'id': msg.tour_countries[i].city.response[j].id
                    });
                }
                tour_country.push({
                    'city': city,
                    'name': msg.tour_countries[i].name,
                    'id': msg.tour_countries[i].id
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour config </span>' + errorThrown,
            })
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
                                <img src="/static/tt_website_rodextrip/images/nofound/no-tour.png" style="width:70px; height:70px;" alt="" title="" />
                                <br/>
                            </div>
                            <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Tour not found. Please try again or search another tour. </h6></div></center>
                        </div>
                    `;
               }
               for(i in tour_data){
                   if(high_price_slider < tour_data[i].adult_sale_price){
                        high_price_slider = tour_data[i].adult_sale_price;
                   }

                   if(low_price_slider > tour_data[i].adult_sale_price){
                        low_price_slider = tour_data[i].adult_sale_price;
                   }

                   if (tour_data[i].images_obj.length > 0)
                   {
                       img_src = tour_data[i].images_obj[0].url;
                   }
                   else
                   {
                       img_src = static_path_url_server+`/public/tour_packages/not_found.png`;
                   }

                   dat_content1 = ``+tour_data[i].departure_date_str+` - `+tour_data[i].arrival_date_str;
                   dat_content2 = ``+tour_data[i].seat+`/`+tour_data[i].quota + ` Available`;

                   text+=`

                   <div class="col-lg-4 col-md-6">
                        <form action='/tour/detail' method='POST' id='myForm`+tour_data[i].sequence+`'>
                            <div id='csrf`+tour_data[i].sequence+`'></div>
                            <input type='hidden' value='`+JSON.stringify(tour_data[i]).replace(/[']/g, /["]/g)+`'/>
                            <input id='uuid' name='uuid' type='hidden' value='`+tour_data[i].id+`'/>
                            <input id='sequence' name='sequence' type='hidden' value='`+tour_data[i].sequence+`'/>`;
                            if(template == 1){
                                if (tour_data[i].state == 'sold' || tour_data[i].seat <= 0)
                                {
                                    text+=`
                                    <div class="single-recent-blog-post disabled-post item" style="cursor:not-allowed;" onclick="" disabled>
                                        <div class="single-destination relative">
                                            <div style="background:red; position:absolute; right:0px; padding:20px; z-index:1;">
                                                <h5 style="color:`+text_color+`;">SOLD OUT</h5>
                                            </div>
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <div class="overlay overlay-bg-disabled"></div>
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion" style="background: rgba(150, 150, 150, 0.5) !important;">
                                                <div class="card-body">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color:#616161;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold; color:#616161;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`  </span>
                                                            <button href="#" class="primary-btn-custom" onclick="" disabled>SOLD OUT</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                                else
                                {
                                    text+=`
                                    <div class="single-recent-blog-post item" style="cursor:pointer;" onclick="go_to_detail('`+tour_data[i].sequence+`')">
                                        <div class="single-destination avail-sd relative">
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <div class="overlay overlay-bg"></div>
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion">
                                                <div class="card-body">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`  </span>
                                                            <button href="#" class="primary-btn-custom" onclick="go_to_detail('`+tour_data[i].sequence+`')">BOOK</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }

                            }else if(template == 2){
                                if (tour_data[i].state == 'sold' || tour_data[i].seat <= 0)
                                {
                                    text+=`
                                    <div class="single-post-area mb-30 disabled-post" onclick="" style="cursor:not-allowed;">
                                        <div class="single-destination relative">
                                            <div style="background:red; position:absolute; right:0px; padding:20px; z-index:10;">
                                                <h5 style="color:`+text_color+`;">SOLD OUT</h5>
                                            </div>
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <div class="overlay overlay-bg overlay-bg-disabled"></div>
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion" style="background: rgba(150, 150, 150, 0.5) !important;">
                                                <div class="card-body" style="padding:15px;">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color:#616161;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold; color:#616161;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`  </span>
                                                            <br/>
                                                            <button href="#" class="primary-btn-custom" onclick="" disabled>SOLD OUT</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                                else
                                {
                                    text+=`
                                    <div class="single-post-area mb-30" onclick="go_to_detail('`+tour_data[i].sequence+`')" style="cursor:pointer;">
                                        <div class="single-destination avail-sd relative">
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <div class="overlay overlay-bg"></div>
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion">
                                                <div class="card-body" style="padding:15px;">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`</span>
                                                            <br/>
                                                            <button type="button" class="primary-btn-custom" onclick="go_to_detail('`+tour_data[i].sequence+`')">BOOK</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                            }else if(template == 3){
                                if (tour_data[i].state == 'sold' || tour_data[i].seat <= 0)
                                {
                                    text+=`
                                    <div class="single-post-area mb-30 disabled-post" onclick="" style="cursor:not-allowed;">
                                        <div class="single-destination relative">
                                            <div style="background:red; position:absolute; right:0px; padding:20px; z-index:10;">
                                                <h5 style="color:`+text_color+`;">SOLD OUT</h5>
                                            </div>
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <div class="overlay overlay-bg overlay-bg-disabled"></div>
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion" style="background: rgba(150, 150, 150, 0.5) !important;">
                                                <div class="card-body" style="padding:15px;">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color:#616161;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold; color:#616161;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`  </span>
                                                            <br/>
                                                            <button href="#" class="primary-btn-custom" onclick="" disabled>SOLD OUT</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                                else
                                {
                                    text+=`
                                    <div class="single-post-area mb-30" onclick="go_to_detail('`+tour_data[i].sequence+`')" style="cursor:pointer;">
                                        <div class="single-destination avail-sd relative">
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <div class="overlay overlay-bg"></div>
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion">
                                                <div class="card-body" style="padding:15px;">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`</span>
                                                            <br/>
                                                            <button type="button" class="primary-btn-custom" onclick="go_to_detail('`+tour_data[i].sequence+`')">BOOK</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                            }else if(template == 4){
                                if (tour_data[i].state == 'sold' || tour_data[i].seat <= 0)
                                {
                                    text+=`
                                    <div class="single-post-area mb-30 disabled-post" onclick="" style="cursor:not-allowed;">
                                        <div class="single-destination overlay-bg-disabled relative">
                                            <div style="background:red; position:absolute; padding:20px; z-index:10;">
                                                <h5 style="color:`+text_color+`;">SOLD OUT</h5>
                                            </div>
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion" style="background: rgba(150, 150, 150, 0.5) !important;">
                                                <div class="card-body" style="padding:15px;">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color:#616161;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold; color:#616161;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`  </span>
                                                            <br/>
                                                            <button href="#" class="primary-btn-custom" onclick="" disabled>SOLD OUT</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                                else
                                {
                                    text+=`
                                    <div class="single-post-area mb-30" onclick="go_to_detail('`+tour_data[i].sequence+`')" style="cursor:pointer;">
                                        <div class="single-destination avail-sd relative">
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <div class="overlay overlay-bg"></div>
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion">
                                                <div class="card-body" style="padding:15px;">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`</span>
                                                            <br/>
                                                            <button type="button" class="primary-btn-custom" onclick="go_to_detail('`+tour_data[i].sequence+`')">BOOK</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                            }else if(template == 5){
                                if (tour_data[i].state == 'sold' || tour_data[i].seat <= 0)
                                {
                                    text+=`
                                    <div class="single-post-area mb-30 disabled-post" onclick="" style="cursor:not-allowed;">
                                        <div class="single-destination overlay-bg-disabled relative">
                                            <div style="background:red; position:absolute; padding:20px; z-index:10;">
                                                <h5 style="color:`+text_color+`;">SOLD OUT</h5>
                                            </div>
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion" style="background: rgba(150, 150, 150, 0.5) !important;">
                                                <div class="card-body" style="padding:15px;">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color:#616161;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px; color:#616161;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold; color:#616161;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`  </span>
                                                            <br/>
                                                            <button href="#" class="primary-btn-custom" onclick="" disabled>SOLD OUT</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                                else
                                {
                                    text+=`
                                    <div class="single-post-area mb-30" onclick="go_to_detail('`+tour_data[i].sequence+`')" style="cursor:pointer;">
                                        <div class="single-destination avail-sd relative">
                                            <div class="thumb relative" style="margin: auto; width:100%; height:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                                <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: fill;">
                                            </div>
                                            <div class="card card-effect-promotion">
                                                <div class="card-body" style="padding:15px;">
                                                    <div class="row details">
                                                        <div class="col-lg-12" style="text-align:left;">
                                                            <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_data[i].name+`">`+tour_data[i].name+`</h6>
                                                            <span style="font-size:13px;"><i class="fas fa-calendar-alt"></i> `+dat_content1+`</span><br/>
                                                            <span style="font-size:13px;"><i class="fas fa-users"></i> `+dat_content2+`</span><br/><br/>
                                                        </div>
                                                        <div class="col-lg-12" style="text-align:right;">
                                                            <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`</span>
                                                            <br/>
                                                            <button type="button" class="primary-btn-custom" onclick="go_to_detail('`+tour_data[i].sequence+`')">BOOK</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour search </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function tour_get_details(package_id){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_details',
       },
       data: {
           'id': package_id,
           'signature': signature
       },
       success: function(msg) {
        console.log(msg);
           var country_text = '';
           var print_doc_text = '';
           var image_text = '';
           var itinerary_text = '';
           var flight_details_text = '';
           var other_info_text = '';
           var room_list_text = '';
           var counter = 0;
           var include_flight = 0;
           var index = 0;
           var total_additional_price = 0;
           var total_additional_amount = 0;
           var package_id = 0;
           data=[]
           if(msg.result.error_code == 0){
               tour_data = msg.result.response.selected_tour;
                package_id = tour_data.id;
                country_text += `<br/><span style="font-weight: bold; color: black; font-size: 16px;"> <i class="fa fa-map-marker" aria-hidden="true"></i>`;
                for (j in tour_data.country_names)
                {
                    country_text += ` ` + tour_data.country_names[j] + ` |`;
                }
                country_text += `</span><br/>`;
                if (tour_data.tour_category != 'fit')
                {
                    country_text += `<span>Available Quota : ` + tour_data.seat + `</span><br/>`;
                }
                country_text += `<br/><span style="font-size: 14px;"><i class="fa fa-calendar" aria-hidden="true"></i> `;
                country_text += tour_data.departure_date_f + ` - ` + tour_data.arrival_date_f;
                country_text += `</span>`;
                if (tour_data.duration)
                {
                    country_text += `<br/><span><i class="fa fa-clock-o" aria-hidden="true"></i> ` + tour_data.duration + ` Days</span>`;
                }
                country_text += `<br/><span><i class="fa fa-tag" aria-hidden="true"></i> Adult @ ` + getrupiah(tour_data.adult_sale_price) + `</span>`;
                if (tour_data.child_sale_price > 0)
                {
                    country_text += `<span> | Child @ ` + getrupiah(tour_data.child_sale_price) + `</span>`;
                }
                if (tour_data.infant_sale_price > 0)
                {
                    country_text += `<span> | Infant @ ` + getrupiah(tour_data.infant_sale_price) + `</span>`;
                }

                country_text += `<br/>`;

                country_text += `<br/><span><i class="fa fa-hotel" aria-hidden="true"></i> Hotel(s) :</span>`;
                idx = 1
                for (k in tour_data.hotel_names)
                {
                    country_text += `<br/><span>` + String(idx) + `. ` + tour_data.hotel_names[k] + `</span>`;
                    idx += 1;
                }
                if (tour_data.document_url)
                {
                    print_doc_text += `<div style="float:right;">
                                         <a class="btn btn-tour btn-chgsearch" style="border-radius:6px; border: 1px solid #ddd;" href="`+tour_data.document_url+`" target="_blank">
                                             <i class="fa fa-print" aria-hidden="true"></i> Print Document
                                         </a>
                                     </div>`;
                }

                image_text += `<div class="owl-carousel-tour-img owl-theme">`;
                for (j in tour_data.images_obj)
                {
                    image_text +=`
                    <div class="item">
                        <div class="single-destination relative">
                            <div class="thumb relative">
                                <img class="img-fluid zoom-img" src="`+tour_data.images_obj[j].url+`" alt="">
                            </div>
                        </div>
                    </div>`;
                }
                if (tour_data.images_obj.length == 0)
                {
                    image_text += `
                    <div class="item">
                        <div class="single-destination relative">
                            <div class="thumb relative">
                                <img class="img-fluid zoom-img" src="`+static_path_url_server+`/public/tour_packages/not_found.png" alt="">
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
                            <div class="col-lg-4" style="margin-bottom:10px;">
                                <h5 style="border:1px solid #cdcdcd; padding:10px; cursor:pointer; overflow-y: hidden;" onclick="show_hide_itinerary_tour(`+it_idx+`)"> Day `+tour_data.itinerary_ids[it_idx].day+` - `+tour_data.itinerary_ids[it_idx].name+` <i class="fas fa-chevron-right" id="itinerary_day`+it_idx+`_down" style="float:right; color:`+color+`; display:none;"></i><i class="fas fa-chevron-left" id="itinerary_day`+it_idx+`_up" style="float:right; color:`+color+`; display:inline-block;"></i></h5>
                            </div>
                            <div class="col-lg-8" style="display:block;" id="div_itinerary_day`+it_idx+`">
                                <div style="border:1px solid #cdcdcd; padding:15px 15px 0px 15px;">
                                <div class="row">
                                <div class="col-lg-12">
                                    <h5>Day `+tour_data.itinerary_ids[it_idx].day+` - `+tour_data.itinerary_ids[it_idx].name+`</h5>
                                    <hr/>
                                </div>`;
                                for(it_item in tour_data.itinerary_ids[it_idx].items)
                                {
                                    itinerary_text += `<div class="col-lg-3">`;
                                    if (tour_data.itinerary_ids[it_idx].items[it_item].timeslot){
                                        itinerary_text += `<h5>`+tour_data.itinerary_ids[it_idx].items[it_item].timeslot+`</h5>`;
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
                                        <img id="image_itinerary`+it_idx+``+it_item+`" src="`+tour_data.itinerary_ids[it_idx].items[it_item].image+`" style="width: 200px; height: 200px; border:1px solid #cdcdcd; object-fit: cover; display:none;"/>`;
                                    }

                                    itinerary_text += `</div>`;
                                }
                            itinerary_text += `</div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
                itinerary_text += `</div>`;

                if (tour_data.flight == 'include')
                {
                    include_flight = 1;
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
                            flight_details_text += `<img src="`+static_path_url_server+`/public/airline_logo/` + tour_data.flight_segments[k].carrier_code + `.png" title="`+tour_data.flight_segments[k].carrier_id+`" width="50" height="50"/>`;
                        }

//                            flight_details_text += `</td><td class="hidden-sm hidden-md hidden-lg hidden-xl">`;
//                            if (tour_data.flight_segments[k].carrier_code)
//                            {
//                                flight_details_text += `<img src="`+static_path_url_server+`/public/airline_logo/` + tour_data.flight_segments[k].carrier_code + `.png" width="40" height="40"/>`+tour_data.flight_segments[k].carrier_code;
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

                        flight_details_text += `<td colspan="2">`+tour_data.flight_segments[k].destination_id+`<br/>`+tour_data.flight_segments[k]._date_fmt;
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
                }

                other_info_text += generate_other_info(tour_data.other_infos)

                for (n in tour_data.accommodations)
                {
                    room_list_text += `
                    <tr>
                        <td style="width:30%;">`+tour_data.accommodations[n].hotel+`</td>
                        <td style="width:20%;">`+tour_data.accommodations[n].name+` `+tour_data.accommodations[n].bed_type+`<br/>Max `+tour_data.accommodations[n].pax_limit+` persons</td>
                        <td style="width:40%;">`+tour_data.accommodations[n].description+`</td>`;
                    room_list_text += `
                        <td style="width:10%;"><button type="button" class="primary-btn-ticket btn-add-rooms" value="`+tour_data.accommodations[n].id+`" onclick="add_tour_room(`+n+`)">Add</button></td>
                    </tr>
                    `;
                }

               document.getElementById('tour_data').value = JSON.stringify(tour_data).replace(/'/g,'');
               document.getElementById('tour_carousel').innerHTML += image_text;
               document.getElementById('country_list_tour').innerHTML += country_text;
               document.getElementById('print_doc_btn_div').innerHTML += print_doc_text;
               document.getElementById('itinerary').innerHTML += itinerary_text;
               document.getElementById('other_info').innerHTML += other_info_text;
               document.getElementById('tour_hotel_room_list').innerHTML += room_list_text;

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
               if (include_flight == 1)
               {
                   document.getElementById('flight_details').innerHTML += flight_details_text;
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour details </span>' + errorThrown,
            })
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
                $("#waitingTransaction").modal('hide');
              }
            })

            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update sell tour </span>' + errorThrown,
            }).then((result) => {
              if (result.value) {
                $("#waitingTransaction").modal('hide');
              }
            })
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
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
                $("#waitingTransaction").modal('hide');
              }
            })

            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update contact tour </span>' + errorThrown,
            }).then((result) => {
              if (result.value) {
                $("#waitingTransaction").modal('hide');
              }
            })
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
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
            'room_id': document.getElementById("room_id_"+String(temp_room_seq)).value,
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
            if(val == 0)
                commit_booking_tour(val);
            else if(val == 1){
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
                $("#waitingTransaction").modal('hide');
              }
            })

            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update passengers tour </span>' + errorThrown,
            }).then((result) => {
              if (result.value) {
                $("#waitingTransaction").modal('hide');
              }
            })
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
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
           if(msg.result.error_code == 0){
               var booking_num = msg.result.response.order_number;
               if(val == 1){
                    document.getElementById('order_number').value = msg.result.response.order_number;
                    document.getElementById('issued').action = '/tour/booking';
                    document.getElementById('issued').submit();
               }else{
                    document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
                    document.getElementById('tour_booking').submit();
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error tour commit booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $("#waitingTransaction").modal('hide');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour commit booking </span>' + errorThrown,
            }).then((result) => {
              if (result.value) {
                $("#waitingTransaction").modal('hide');
              }
            })
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
       },timeout: 60000
    });
}

function get_payment_rules(id)
{
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_payment_rules',
       },
       data: {
           'id': id,
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour payment rules </span>' + errorThrown,
            })
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
                   $("#waitingTransaction").modal('hide');
                   document.getElementById("overlay-div-box").style.display = "none";
               }
           }else if(msg.result.error_code == 1009){
               price_arr_repricing = {};
               pax_type_repricing = [];
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('payment_acq').hidden = true;
               $("#issuedModal").modal('hide');
               $("#waitingTransaction").modal('hide');
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
                    $("#waitingTransaction").modal('hide');
                  }
                })
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('payment_acq').hidden = true;
                $("#issuedModal").modal('hide');
                $("#waitingTransaction").modal('hide');
                document.getElementById("overlay-div-box").style.display = "none";
                document.getElementById('tour_final_info').innerHTML = text;
                document.getElementById('product_title').innerHTML = '';
                document.getElementById('product_type_title').innerHTML = '';
                document.getElementById('tour_detail_table').innerHTML = '';
                tour_get_booking(order_number);
                $("#issuedModal").modal('hide');
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $("#waitingTransaction").modal('hide');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour issued booking </span>' + errorThrown,
            }).then((result) => {
              if (result.value) {
                $("#waitingTransaction").modal('hide');
              }
            })
            price_arr_repricing = {};
            pax_type_repricing = [];
            document.getElementById('payment_acq').innerHTML = '';
            document.getElementById('payment_acq').hidden = true;
            $("#issuedModal").modal('hide');
            $("#waitingTransaction").modal('hide');
            document.getElementById("overlay-div-box").style.display = "none";
            document.getElementById('tour_final_info').innerHTML = text;
            document.getElementById('product_title').innerHTML = '';
            document.getElementById('product_type_title').innerHTML = '';
            document.getElementById('tour_detail_table').innerHTML = '';
            tour_get_booking(order_number);
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour update service charge </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function tour_get_booking(order_number)
{
    price_arr_repricing = {};
    get_balance('false');
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
           var book_obj = msg.result.response;
           var tour_package = msg.result.response.tour_details;
           var passengers = msg.result.response.passengers;
           var rooms = msg.result.response.rooms;
           var contact = msg.result.response.contacts;
           var payment = msg.result.response.payment_rules;
           var cur_state = msg.result.response.state;

           tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
           localTime  = moment.utc(tes).toDate();
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
                                    <tr>
                                        <td>`+book_obj.pnr+`</td>
                                        <td>`+moment(localTime).format('DD MMM YYYY HH:mm')+`</td>
                                        <td>`+conv_status+`</td>
                                    </tr>
                                 </table>
                            </div>
                        </div>
                    </div>
            `;
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
                                <span>`+tour_package.flight+` Flight, `+tour_package.visa+` Visa</span>
                                <br/>
                            </div>
                        </div>
                    </div>`;
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

            if(contact.gender == 'female' && contact.marital_status == 'married')
               {
                    title = 'MRS';
               }
               else if(contact.gender == 'female' && contact.marital_status != 'married')
               {
                    title = 'MS';
               }
               else
               {
                    title = 'MR';
               }

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
                                            <td>`+title+`. `+contact.name+`</td>
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
                            <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
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
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <span class="control-label" for="Name">Name</span>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    <span class="control-label" for="Additional Information">Additional Information</span>
                                                    <div class="input-container-search-ticket">
                                                        <textarea style="width:100%;" rows="4" id="additional_information" name="additional_information" placeholder="Additional Information"></textarea>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    <span class="control-label" for="Address">Address</span>
                                                    <div class="input-container-search-ticket">
                                                        <textarea style="width:100%;" rows="4" id="bill_address" name="bill_address" placeholder="Address"></textarea>
                                                        <!--<input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_address" placeholder="Address" required="1"/>-->
                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div style="text-align:right;">
                                                <span>Don't want to edit? just submit</span>
                                                <br/>
                                                <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+book_obj.order_number+`', 'invoice','tour');"/>
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
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'DISC'];

            //repricing
            type_amount_repricing = ['Repricing'];
            //repricing
            counter_service_charge = 0;
            $test += '\nPrice:\n';
            for(i in msg.result.response.passengers[0].sale_service_charges){
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
                    try{
                        price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;

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
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price['DISC']))+`</span>`;
                        }else{
                            price_text+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price['DISC']))+`</span>`;
                        }
                        price_text+=`
                        </div>
                    </div>`;
                    if(counter_service_charge == 0){
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price['DISC']);
                        $test += msg.result.response.passengers[j].name + ' ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price['DISC']))+'\n';
                    }else{
                        $test += msg.result.response.passengers[j].name + ' ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.FARE + price['DISC']))+'\n';
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price['DISC']);
                    }
                    commission += parseInt(price.RAC);
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
             if(msg.result.response.state != 'issued')
             price_text+=`
             <div style="text-align:right; padding-bottom:10px; margin-top:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
             price_text+=`<div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        price_text+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    } else {
                        price_text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    }

                price_text+=`
                </div>
             </div>
             <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(parseInt(commission)*-1)+`</span><br>
                    </div>
                </div>
             </div>

             <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-xs-12">
                    <input type="button" class="primary-btn-ticket" onclick="copy_data();" value="Copy" style="width:100%;"/>
               </div>
             </div>
             <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-xs-12" style="padding-bottom:10px;">
                    <input type="button" class="primary-btn-ticket" id="show_commission_button" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
               </div>
             </div>
           `;
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
               get_payment_acq('Issued', book_obj.booker_seq_id, order_number, 'billing',signature,'tour');
               document.getElementById("final_issued_btn").style.display = "block";
           }
           else
           {
               $('#final_issued_btn').remove();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour get booking </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function get_price_itinerary(request,type) {
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_pricing',
       },
       data: {
           'req': request
       },
       success: function(msg) {
            console.log(msg);
            table_price_update(msg,type);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour price itinerary </span>' + errorThrown,
            })
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
                    <div class="col-lg-3" id="`+i+`_`+k+`">`+k+`</div>
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
    }
    grand_total = 0;
    var grand_commission = 0;
    $test = '';
    temp_copy_adt = '';
    temp_copy_chd = '';
    temp_copy_inf = '';
    temp_copy2 = '';

    $('#loading-price-tour').hide();
    price_tour_info = msg.result.tour_info;
    $test += price_tour_info.name + '\n';
    $test += price_tour_info.departure_date_str + ' - ' + price_tour_info.arrival_date_str + '\n\n';

    try{
        for(i in all_pax){
            if(i == 0)
                $test += 'Passengers:\n';
            $test += all_pax[i].title + ' ' + all_pax[i].first_name + ' ' + all_pax[i].last_name + '\n';
        }
        $test +='\n';
    }catch(err){}

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
    for(var j=0; j<room_amount; j++)
    {
        price_txt2 += `<br/><div class="row"><div class="col-xs-12"><span style="font-weight: bold;">Room `+String(j+1)+`</span></div></div>`;
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
    }
    try{
        grand_total += upsell_price;
    }catch(err){}
    price_txt = price_txt_adt + price_txt_chd + price_txt_inf + price_txt2;
    $test += temp_copy_adt + temp_copy_chd + temp_copy_inf + temp_copy2;
    $test += '\nGrand Total : IDR '+ getrupiah(grand_total)+
    '\nPrices and availability may change at any time';
    price_txt += `<hr style="padding:0px;">`;
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
        price_txt +=`<div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
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
                                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                                    <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                            } else {
                                price_txt+=`
                                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                                    <a href="mailto:?subject=This is the tour price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                            }

                        price_txt+=`
                        </div>
                   </div>
                   <div class="row" id="show_commission" style="display:none;">
                        <div class="col-lg-12" style="margin-top:10px; text-align:center;">
                            <div class="alert alert-success">
                                <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(grand_commission)+`</span><br>
                            </div>
                        </div>
                   </div>

                   <div class="row" style="margin-top:10px; text-align:center;">
                       <div class="col-lg-12">
                           <input type="button" class="primary-btn-ticket" onclick="copy_data();" value="Copy" style="width:100%;"/>
                       </div>
                   </div>
                   <div class="row" style="margin-top:10px; text-align:center;">
                       <div class="col-lg-12" style="padding-bottom:10px;">
                            <input type="button" id="show_commission_button" class="primary-btn-ticket" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
                       </div>
                   </div>`;


    document.getElementById('tour_detail_table').innerHTML = price_txt;
    if(type == 'detail'){
        if(agent_security.includes('book_reservation') == true)
        next_btn_txt = `<center>
                        <button type="button" class="primary-btn-ticket" value="Next" onclick="check_detail();" style="width:100%;">
                            Next
                            <i class="fas fa-angle-right"></i>
                        </button>
                    </center>`;
        else
        next_btn_txt = '';
        document.getElementById('tour_detail_next_btn').innerHTML = next_btn_txt;
    }else if(type == 'passenger'){
        next_btn_txt = `<center>
                        <button type="button" class="primary-btn-ticket" value="Next" onclick="next_disabled();check_passenger(adult, child, infant);" style="width:100%;">
                            Next
                            <i class="fas fa-angle-right"></i>
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour price itinerary </span>' + errorThrown,
            })
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
               alert(errorThrown);
           }
        });
    }, 150);
}
