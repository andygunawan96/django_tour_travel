var tour_data = [];
offset = 0;
high_price_slider = 0;
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
           signature = msg.result.response.signature;
           if(data == ''){
               tour_search();
           }else if(data != ''){
               tour_get_booking(data);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour login </span>' + errorThrown,
            })
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
            $('#tour_countries').niceSelect('update');
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
           'offset': offset,
           'signature': signature
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

                   if (tour_data[i].images_obj.length > 0)
                   {
                       img_src = tour_data[i].images_obj[0].url;
                   }
                   else
                   {
                       img_src = static_path_url_server+`/public/tour_packages/not_found.png`;
                   }

                   if (tour_data[i].state_tour == 'sold')
                   {
                       dat_content1 = ``+tour_data[i].departure_date+` - `+tour_data[i].return_date;
                       dat_content2 = `Sold Out`;
                   }
                   else
                   {
                       dat_content1 = ``+tour_data[i].departure_date+` - `+tour_data[i].return_date;
                       var count_quota = tour_data[i].quota - tour_data[i].seat;
                       dat_content2 = ``+count_quota+`/`+tour_data[i].quota;
                   }

                   text+=`

                   <div class="col-lg-4 col-md-6">
                        <form action='/tour/detail' method='POST' id='myForm`+tour_data[i].sequence+`'>
                            <div id='csrf`+tour_data[i].sequence+`'></div>
                            <input type='hidden' value='`+JSON.stringify(tour_data[i]).replace(/[']/g, /["]/g)+`'/>
                            <input id='uuid' name='uuid' type='hidden' value='`+tour_data[i].id+`'/>
                            <input id='sequence' name='sequence' type='hidden' value='`+tour_data[i].sequence+`'/>
                            <div class="single-recent-blog-post item" style="cursor:pointer;" onclick="go_to_detail('`+tour_data[i].sequence+`')">
                                <div class="single-destination relative">
                                    <div class="thumb relative" style="margin: auto; width:100%; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                        <div class="overlay overlay-bg"></div>
                                        <img class="img-fluid" src="`+img_src+`" alt="">
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
                                                    <a href="#" class="btn btn-primary" onclick="go_to_detail('`+tour_data[i].sequence+`')">BOOK</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
               document.getElementById("price-to").value = high_price_slider;
               $maxPrice = high_price_slider;
               $(".js-range-slider").data("ionRangeSlider").update({
                    from: 0,
                    to: high_price_slider,
                    min: 0,
                    max: high_price_slider,
                    step: step_slider
               });
               $(".js-range-slider").data("ionRangeSlider").reset();

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
           var image_text = '';
           var itinerary_text = '';
           var flight_details_text = '';
           var room_list_text = '';
           var remarks_text = '';
           var counter = 0;
           var include_flight = 0;
           var index = 0;
           var total_additional_price = 0;
           var total_additional_amount = 0;
           var package_id = 0;
           data=[]
           if(msg.result.error_code == 0){
               tour_data = msg.result.response.result;
               com_agent = msg.result.response.commission_agent_type;
               console.log(tour_data)
               for (i in tour_data)
               {
                    package_id = tour_data[i].id;
                    country_text += `<br/><span style="font-weight: bold; color: black; font-size: 16px;"> <i class="fa fa-map-marker" aria-hidden="true"></i>`;
                    for (j in tour_data[i].country_names)
                    {
                        country_text += ` ` + tour_data[i].country_names[j] + ` |`;
                    }
                    country_text += `</span><br/>`;
                    if (tour_data[i].tour_category != 'fit')
                    {
                        country_text += `<span>Available Quota : ` + tour_data[i].seat + `</span><br/>`;
                    }
                    country_text += `<br/><span style="font-size: 14px;"><i class="fa fa-calendar" aria-hidden="true"></i> `;
                    country_text += tour_data[i].departure_date_f + ` - ` + tour_data[i].return_date_f;
                    country_text += `</span>`;
                    if (tour_data[i].duration)
                    {
                        country_text += `<br/><span><i class="fa fa-clock-o" aria-hidden="true"></i> ` + tour_data[i].duration + ` Days</span>`;
                    }
                    country_text += `<br/><span><i class="fa fa-tag" aria-hidden="true"></i> Adult @ ` + getrupiah(tour_data[i].adult_sale_price) + `</span>`;
                    if (tour_data[i].child_sale_price > 0)
                    {
                        country_text += `<span> | Child @ ` + getrupiah(tour_data[i].child_sale_price) + `</span>`;
                    }
                    if (tour_data[i].infant_sale_price > 0)
                    {
                        country_text += `<span> | Infant @ ` + getrupiah(tour_data[i].infant_sale_price) + `</span>`;
                    }

                    country_text += `<br/>`;

                    country_text += `<br/><span><i class="fa fa-hotel" aria-hidden="true"></i> Hotel(s) :</span>`;
                    idx = 1
                    for (k in tour_data[i].hotel_names)
                    {
                        country_text += `<br/><span>` + String(idx) + `. ` + tour_data[i].hotel_names[k] + `</span>`;
                        idx += 1;
                    }
                    country_text += `<div style="position: absolute; bottom: 10px; right: 15px;">
                                        <a class="btn btn-tour btn-chgsearch" style="border-radius:6px; border: 1px solid #ddd;" href="#">
                                            <i class="fa fa-print" aria-hidden="true"></i> Print Itinerary
                                        </a>
                                    </div>`;

                    image_text += `<div class="owl-carousel-tour-img owl-theme">`;
                    for (j in tour_data[i].images_obj)
                    {
                        image_text +=`
                        <div class="item">
                            <div class="single-destination relative">
                                <div class="thumb relative">
                                    <img class="img-fluid zoom-img" src="`+tour_data[i].images_obj[j].url+`" alt="">
                                </div>
                            </div>
                        </div>`;
                    }
                    if (tour_data[i].images_obj.length == 0)
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
                    for (it_idx in tour_data[i].itinerary_ids)
                    {
                        itinerary_text += `
                        <div class="col-lg-12" style="margin-bottom:10px;">
                            <div class="row">
                                <div class="col-lg-4" style="margin-bottom:10px;">
                                    <h5 style="border:1px solid #cdcdcd; padding:10px; cursor:pointer;" onclick="show_hide_itinerary_tour(`+it_idx+`)"> Day `+tour_data[i].itinerary_ids[it_idx].day+` - `+tour_data[i].itinerary_ids[it_idx].name+` <i class="fas fa-chevron-right" id="itinerary_day`+it_idx+`_down" style="float:right; color:#f15a22; display:none;"></i><i class="fas fa-chevron-left" id="itinerary_day`+it_idx+`_up" style="float:right; color:#f15a22; display:inline-block;"></i></h5>
                                </div>
                                <div class="col-lg-8" style="display:block;" id="div_itinerary_day`+it_idx+`">
                                    <div style="border:1px solid #cdcdcd; padding:15px 15px 0px 15px;">
                                    <div class="row">
                                    <div class="col-lg-12">
                                        <h5>Day `+tour_data[i].itinerary_ids[it_idx].day+` - `+tour_data[i].itinerary_ids[it_idx].name+`</h5>
                                        <hr/>
                                    </div>`;
                                    for(it_item in tour_data[i].itinerary_ids[it_idx].items)
                                    {
                                        itinerary_text += `<div class="col-lg-3">`;
                                        if (tour_data[i].itinerary_ids[it_idx].items[it_item].timeslot){
                                            itinerary_text += `<h5>`+tour_data[i].itinerary_ids[it_idx].items[it_item].timeslot+`</h5>`;
                                        }
                                        itinerary_text += `</div>
                                        <div class="col-lg-9" style="padding-bottom:15px;">
                                            <h5>`+tour_data[i].itinerary_ids[it_idx].items[it_item].name+`</h5>`;
                                        if (tour_data[i].itinerary_ids[it_idx].items[it_item].description){
                                            itinerary_text += `<span style="font-size: 13px;">`+tour_data[i].itinerary_ids[it_idx].items[it_item].description+`</span><br/>`;
                                        }
                                        if (tour_data[i].itinerary_ids[it_idx].items[it_item].image){
                                            itinerary_text += `
                                            <span id="show_image_itinerary`+it_idx+``+it_item+`" onclick="showImageItinerary(`+it_idx+`,`+it_item+`);" style="color:#f15a22; font-weight:700; cursor:pointer;">Show image</span>
                                            <img id="image_itinerary`+it_idx+``+it_item+`" src="`+tour_data[i].itinerary_ids[it_idx].items[it_item].image+`" style="width: 150px; height: 150px; border:1px solid #cdcdcd; object-fit: cover; display:none;"/>`;
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

                    if (tour_data[i].flight == 'include')
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
                        for (k in tour_data[i].flight_segment_ids)
                        {
                            flight_details_text += `
                                <tr>
                                    <td class="hidden-xs">`;
                            if (tour_data[i].flight_segment_ids[k].carrier_code)
                            {
                                flight_details_text += `<img src="`+static_path_url_server+`/public/airline_logo/` + tour_data[i].flight_segment_ids[k].carrier_code + `.png" title="`+tour_data[i].flight_segment_ids[k].carrier_id+`" width="50" height="50"/>`;
                            }

//                            flight_details_text += `</td><td class="hidden-sm hidden-md hidden-lg hidden-xl">`;
//                            if (tour_data[i].flight_segment_ids[k].carrier_code)
//                            {
//                                flight_details_text += `<img src="`+static_path_url_server+`/public/airline_logo/` + tour_data[i].flight_segment_ids[k].carrier_code + `.png" width="40" height="40"/>`+tour_data[i].flight_segment_ids[k].carrier_code;
//                            }

                            flight_details_text += `</td>`;

                            flight_details_text += `
                                <td class="hidden-xs">`+tour_data[i].flight_segment_ids[k].carrier_number+`</td>
                            `;
                            flight_details_text += `<td colspan="2">`+tour_data[i].flight_segment_ids[k].origin_id+`<br/>`+tour_data[i].flight_segment_ids[k].departure_date_fmt;
                            if(tour_data[i].flight_segment_ids[k].origin_terminal)
                            {
                                flight_details_text += `<br/>Terminal : ` + tour_data[i].flight_segment_ids[k].origin_terminal;
                            }
                            flight_details_text += `</td>`;

                            flight_details_text += `<td colspan="2">`+tour_data[i].flight_segment_ids[k].destination_id+`<br/>`+tour_data[i].flight_segment_ids[k].return_date_fmt;
                            if(tour_data[i].flight_segment_ids[k].destination_terminal)
                            {
                                flight_details_text += `<br/>Terminal : ` + tour_data[i].flight_segment_ids[k].destination_terminal;
                            }
                            flight_details_text += `</td>`;

                            flight_details_text += `<td class="hidden-xs">`+tour_data[i].flight_segment_ids[k].delay+`</td>
                                </tr>
                            `;
                        }
                        flight_details_text += `</table>
                                             </div>`;
                    }
                    for (n in tour_data[i].accommodations)
                    {
                    console.log(tour_data[i].accommodations[n]);
                        room_list_text += `
                        <tr>
                            <td style="width:30%;">`+tour_data[i].accommodations[n].hotel+`</td>
                            <td style="width:20%;">`+tour_data[i].accommodations[n].name+` `+tour_data[i].accommodations[n].bed_type+`<br/>Max `+tour_data[i].accommodations[n].pax_limit+` persons</td>
                            <td style="width:40%;">`+tour_data[i].accommodations[n].description+`</td>`;
                        room_list_text += `
                            <td style="width:10%;"><button type="button" class="primary-btn-ticket btn-add-rooms" value="`+tour_data[i].accommodations[n].id+`" onclick="add_tour_room(`+i+`,`+n+`)">Add</button></td>
                        </tr>
                        `;
                    }
               }

               document.getElementById('tour_data').value = JSON.stringify(tour_data[0]).replace(/'/g,'');
               document.getElementById('tour_carousel').innerHTML += image_text;
               document.getElementById('country_list_tour').innerHTML += country_text;
               document.getElementById('itinerary').innerHTML += itinerary_text;
               document.getElementById('remarks').innerHTML += remarks_text;
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


function update_sell_tour(){
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
            update_contact_tour();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update sell tour </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $('.loader-rodextrip').fadeOut();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update sell tour </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });
}

function update_contact_tour(){
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
            update_passengers_tour();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update contact tour </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $('.loader-rodextrip').fadeOut();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update contact tour </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });
}

function update_passengers_tour(){
    room_choice_dict = {};
    for (var i=0; i < total_pax_amount; i++)
    {
        var temp_room_seq = document.getElementById("room_select_pax"+String(i+1)).value;
        var temp_pax_id = document.getElementById("temp_pax_id"+String(i+1)).value;
        temp_dict = {
            'room_id': document.getElementById("room_id_"+String(temp_room_seq)).value
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
            commit_booking_tour();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update passengers tour </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $('.loader-rodextrip').fadeOut();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update passengers tour </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });
}

function commit_booking_tour()
{
    force_issued_val = document.getElementById('force_issued_opt').value;
    if(force_issued_val == 1)
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
        'value': force_issued_val,
        'signature': signature
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['payment_method'] = payment_method_choice;
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
           var booking_num = msg.result.response.order_number;
           if (booking_num)
           {
               document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
               document.getElementById('tour_booking').submit();
           }
           else
           {
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Booking process failed, please try again! </span>',
                })
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour commit booking </span>' + errorThrown,
            })
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $('.loader-rodextrip').fadeOut();
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
           var today = new Date();
           var dd = String(today.getDate()).padStart(2, '0');
           var mm = String(today.getMonth() + 1).padStart(2, '0');
           var yyyy = today.getFullYear();
           date_today = yyyy + '-' + mm + '-' + dd;
           pay_text = ``;
           payment = msg.result.response.payment_rules;
           var idx = 1;
           for (i in payment)
           {
               var payment_price = 0;
               if(payment[i].payment_type == 'percentage')
               {
                   payment_price = (parseInt(payment[i].payment_percentage) / 100) * grand_total;
               }
               else
               {
                   payment_price = parseInt(payment[i].payment_amount);
               }
               pay_text += `
                <tr>
                    <td>` +payment[i].name+ `</td>
                    <td id="payment_` + String(idx) + `" name="payment_` + String(idx) + `">IDR ` + getrupiah(Math.ceil(payment_price))+ `</td>
                    <td id="payment_date_` + String(idx) + `" name="payment_date_` + String(idx) + `">` +payment[i].due_date+ `</td>
                </tr>
               `;
               idx += 1;
           }
           document.getElementById('tour_payment_rules').innerHTML += pay_text;
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
        $('.loader-rodextrip').fadeIn();
        $('.next-loading-issued').addClass("running");
        $('.next-loading-issued').prop('disabled', true);
        tour_issued_booking(order_number);
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
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           var booking_num = msg.result.response.order_number;
           if (booking_num)
           {
               tour_get_booking(booking_num);
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('payment_acq').hidden = true;
               $("#issuedModal").modal('hide');
               $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour issued booking </span>' + errorThrown,
            })
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });
}

function show_repricing(){
    $("#myModalRepricing").modal();
}

function update_service_charge(data){
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
        console.log(tr_get_booking.result.response.passengers[i]);
        upsell.push({
            'sequence': tr_get_booking.result.response.passengers[i].sequence,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': JSON.stringify(tour_order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                tour_get_booking(tour_order_number);
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
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
    getToken();
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
           var cur_state = msg.result.response.state;
           if(cur_state == 'booked'){
                conv_status = 'Booked';
                document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
            }
            else if(cur_state == 'issued'){
                conv_status = 'Issued';
                document.getElementById('issued-breadcrumb').classList.add("br-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
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
                                        <td>`+book_obj.hold_date+`</td>
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
                                `+tour_package.departure_date_f+` - `+tour_package.return_date_f+`
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
                        <div class="col-lg-4" style="padding-bottom:10px;">
                            <button class="primary-btn hold-seat-booking-train" type="button" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.tour/`+book_obj.order_number+`/1')" style="width:100%;">
                                Print Itinerary Form
                            </button>
                        </div>
                        <div class="col-lg-4" style="padding-bottom:10px;">`;

               if(book_obj.state == 'issued'){
                    text += `<button class="primary-btn hold-seat-booking-train" type="button" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.tour/`+book_obj.order_number+`/4')" style="width:100%;">
                                Print Invoice
                             </button>`;
               }
               text += `</div>
                    </div>
               `;
            document.getElementById('tour_final_info').innerHTML = text;
            document.getElementById('product_title').innerHTML = tour_package.name;
            document.getElementById('product_type_title').innerHTML = tour_package.departure_date_f+' - '+tour_package.return_date_f;
            price_text = '';
            $test = tour_package.name+'\n'+tour_package.departure_date_f+' - '+tour_package.return_date_f+'\n\n';

            //detail
            text = '';
            tax = 0;
            fare = 0;
            total_price = 0;
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX'];

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
                    price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0};
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
                            'Fare': price['FARE'],
                            'Tax': price['TAX'] + price['ROC'],
                            'Repricing': price['CSC']
                        }
                    }else{
                        price_arr_repricing[msg.result.response.passengers[j].name] = {
                            'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'],
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
                            <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Fare</span>`;
                        price_text+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Tax</span>`;
                        price_text+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;

                        $test += msg.result.response.passengers[j].name + ' Fare ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.FARE))+'\n';
                        if(counter_service_charge == 0){
                            $test += msg.result.response.passengers[j].name + ' Tax ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+'\n';
                        price_text+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>`;
                        }else{
                            $test += msg.result.response.passengers[j].name + ' Tax ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC))+'\n';
                            price_text+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC))+`</span>`;
                        }
                        price_text+=`
                        </div>
                    </div>`;
                    if(counter_service_charge == 0)
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC);
                    else
                        total_price += parseInt(price.TAX + price.ROC + price.FARE);
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
             </div>
             <div style="text-align:right; padding-bottom:10px; margin-top:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>
             <div class="row">
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
               get_payment_rules(tour_package.id);
               get_payment_acq('Issued', book_obj.booker_seq_id, order_number, 'billing',signature,'tour');
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

function get_price_itinerary(request) {
    var grand_total = 0;
    var grand_commission = 0;
    $test = '';
    temp_copy = '';
    temp_copy2 = '';
    getToken();
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
            $('#loading-price-tour').hide();
            price_tour_info = msg.result.tour_info;
            $test += price_tour_info.name + '\n';
            $test += price_tour_info.departure_date + ' - ' + price_tour_info.return_date + '\n\n';
            price_data = msg.result.response.service_charges;
            price_txt1 = ``;
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
                            adt_price += price_data[i].total;
                            adt_amt = price_data[i].pax_count;
                        }
                        else if(price_data[i].pax_type == 'CHD')
                        {
                            chd_price += price_data[i].total;
                            chd_amt = price_data[i].pax_count;
                        }
                        else if(price_data[i].pax_type == 'INF')
                        {
                            inf_price += price_data[i].total;
                            inf_amt = price_data[i].pax_count;
                        }
                    }
                    else if(price_data[i].charge_type != 'RAC')
                    {
                        var pax_type_dict ={
                            'ADT': 'Adult',
                            'CHD': 'Child',
                            'INF': 'Infant'
                        }
                        var desc_type_dict ={
                            'air.tax': 'Airport Tax',
                            'tip.guide': 'Tipping Guide',
                            'tip.tl': 'Tipping Tour Leader',
                            'tip.driver': 'Tipping Driver',
                        }
                        pax_type_str = '';
                        if(price_data[i].pax_type in pax_type_dict)
                        {
                            pax_type_str = pax_type_dict[price_data[i].pax_type];
                        }

                        desc_str = ''
                        if(price_data[i].charge_code in desc_type_dict)
                        {
                            desc_str = desc_type_dict[price_data[i].charge_code];
                        }
                        if(pax_type_str)
                        {
                            price_txt2 += `<div class="row">
                                            <div class="col-xs-4">`+pax_type_str+` `+desc_str+`</div>
                                            <div class="col-xs-1">x</div>
                                            <div class="col-xs-1">`+price_data[i].pax_count+`</div>
                                            <div class="col-xs-2"></div>
                                            <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(price_data[i].total)+`</div>
                                           </div>`;
                            temp_copy2 += pax_type_str + ' ' + desc_str + ' Price IDR ' + getrupiah(price_data[i].total) + '\n';
                        }
                        else
                        {
                            price_txt2 += `<div class="row">
                                            <div class="col-xs-4">`+desc_str+`</div>
                                            <div class="col-xs-1">x</div>
                                            <div class="col-xs-1">`+price_data[i].pax_count+`</div>
                                            <div class="col-xs-2"></div>
                                            <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(price_data[i].total)+`</div>
                                           </div>`;
                            temp_copy2 += desc_str + ' Price IDR ' + getrupiah(price_data[i].total) + '\n';
                        }
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
                        var pax_type_dict ={
                            'ADT': 'Adult',
                            'CHD': 'Child',
                            'INF': 'Infant'
                        }
                        if(room_prices[k].charge_code.split('.').includes('sur'))
                        {
                            desc_str = pax_type_dict[room_prices[k].pax_type] + ' Extra Bed';
                        }
                        else if(room_prices[k].charge_code.split('.').includes('sing'))
                        {
                            desc_str = 'Single Supplement';
                        }
                        else if(room_prices[k].charge_code.split('.').includes('charge'))
                        {
                            desc_str = 'Additional Charge';
                        }
                        found_room_price = true;
                        price_txt2 += `<div class="row">
                                        <div class="col-xs-4">`+desc_str+`</div>
                                        <div class="col-xs-1">x</div>
                                        <div class="col-xs-1">`+room_prices[k].pax_count+`</div>
                                        <div class="col-xs-2"></div>
                                        <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(room_prices[k].total)+`</div>
                                       </div>`;
                        grand_total += room_prices[k].total;
                        temp_copy2 += desc_str + ' Price IDR ' + getrupiah(room_prices[k].total) + '\n';
                    }
                }
                if (!found_room_price)
                {
                    price_txt2 += `<div class="row">
                                    <div class="col-xs-4">(No Charge)</div>
                                    <div class="col-xs-1"></div>
                                    <div class="col-xs-1">N/A</div>
                                    <div class="col-xs-2"></div>
                                    <div class="col-xs-4" style="text-align: right;">N/A</div>
                                   </div>`;
                }
            }
            if(adt_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Adult Price</div>
                                <div class="col-xs-1">x</div>
                                <div class="col-xs-1">`+adt_amt+`</div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(adt_price)+`</div>
                               </div>`;
                grand_total += adt_price;
                temp_copy += 'Adult Price IDR ' + getrupiah(adt_price) + '\n';
            }
            if(chd_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Child Price</div>
                                <div class="col-xs-1">x</div>
                                <div class="col-xs-1">`+chd_amt+`</div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(chd_price)+`</div>
                               </div>`;
                grand_total += chd_price;
                temp_copy += 'Child Price IDR ' + getrupiah(chd_price) + '\n';
            }
            if(inf_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Infant Price</div>
                                <div class="col-xs-1">x</div>
                                <div class="col-xs-1">`+inf_amt+`</div>
                                <div class="col-xs-2"></div>
                                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(inf_price)+`</div>
                               </div>`;
                grand_total += inf_price;
                temp_copy += 'Infant Price IDR ' + getrupiah(inf_price) + '\n';
            }
            price_txt = price_txt1 + price_txt2;
            $test += temp_copy + temp_copy2;
            $test += '\nGrand Total : IDR '+ getrupiah(grand_total)+
           '\nPrices and availability may change at any time';
            price_txt += `<hr style="padding:0px;">
                           <div class="row">
                                <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(grand_total)+`</div>
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

            next_btn_txt = `<center>
                                <button type="button" class="primary-btn-ticket" value="Next" onclick="check_detail();" style="width:100%;">
                                    Next
                                    <i class="fas fa-angle-right"></i>
                                </button>
                            </center>`;
            document.getElementById('tour_detail_table').innerHTML = price_txt;
            document.getElementById('tour_detail_next_btn').innerHTML = next_btn_txt;
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

function get_price_itinerary_cache() {
    grand_total = 0;
    var grand_commission = 0;
    $test = '';
    temp_copy = '';
    temp_copy2 = '';
    getToken();
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
            console.log(room_amount);
            $('#loading-price-tour').hide();
            price_tour_info = msg.result.tour_info;
            $test += price_tour_info.name + '\n';
            $test += price_tour_info.departure_date + ' - ' + price_tour_info.return_date + '\n\n';
            price_data = msg.result.response.service_charges;
            price_txt1 = ``;
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
                            adt_price += price_data[i].total;
                            adt_amt = price_data[i].pax_count;
                        }
                        else if(price_data[i].pax_type == 'CHD')
                        {
                            chd_price += price_data[i].total;
                            chd_amt = price_data[i].pax_count;
                        }
                        else if(price_data[i].pax_type == 'INF')
                        {
                            inf_price += price_data[i].total;
                            inf_amt = price_data[i].pax_count;
                        }
                    }
                    else if(price_data[i].charge_type != 'RAC')
                    {
                        var pax_type_dict ={
                            'ADT': 'Adult',
                            'CHD': 'Child',
                            'INF': 'Infant'
                        }
                        var desc_type_dict ={
                            'air.tax': 'Airport Tax',
                            'tip.guide': 'Tipping Guide',
                            'tip.tl': 'Tipping Tour Leader',
                            'tip.driver': 'Tipping Driver',
                        }
                        pax_type_str = '';
                        if(price_data[i].pax_type in pax_type_dict)
                        {
                            pax_type_str = pax_type_dict[price_data[i].pax_type];
                        }

                        desc_str = ''
                        if(price_data[i].charge_code in desc_type_dict)
                        {
                            desc_str = desc_type_dict[price_data[i].charge_code];
                        }
                        if(pax_type_str)
                        {
                            price_txt2 += `<div class="row">
                                            <div class="col-xs-4">`+pax_type_str+` `+desc_str+`</div>
                                            <div class="col-xs-1">x</div>
                                            <div class="col-xs-1">`+price_data[i].pax_count+`</div>
                                            <div class="col-xs-1"></div>
                                            <div class="col-xs-5" style="text-align: right;">IDR `+getrupiah(price_data[i].total)+`</div>
                                           </div>`;
                            temp_copy2 += pax_type_str + ' ' + desc_str + ' Price IDR ' + getrupiah(price_data[i].total) + '\n';
                        }
                        else
                        {
                            price_txt2 += `<div class="row">
                                            <div class="col-xs-4">`+desc_str+`</div>
                                            <div class="col-xs-1">x</div>
                                            <div class="col-xs-1">`+price_data[i].pax_count+`</div>
                                            <div class="col-xs-1"></div>
                                            <div class="col-xs-5" style="text-align: right;">IDR `+getrupiah(price_data[i].total)+`</div>
                                           </div>`;
                            temp_copy2 += desc_str + ' Price IDR ' + getrupiah(price_data[i].total) + '\n';
                        }
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
                        var pax_type_dict ={
                            'ADT': 'Adult',
                            'CHD': 'Child',
                            'INF': 'Infant'
                        }
                        if(room_prices[k].charge_code.split('.').includes('sur'))
                        {
                            desc_str = pax_type_dict[room_prices[k].pax_type] + ' Extra Bed';
                        }
                        else if(room_prices[k].charge_code.split('.').includes('sing'))
                        {
                            desc_str = 'Single Supplement';
                        }
                        else if(room_prices[k].charge_code.split('.').includes('charge'))
                        {
                            desc_str = 'Additional Charge';
                        }
                        found_room_price = true;
                        price_txt2 += `<div class="row">
                                        <div class="col-xs-4">`+desc_str+`</div>
                                        <div class="col-xs-1">x</div>
                                        <div class="col-xs-1">`+room_prices[k].pax_count+`</div>
                                        <div class="col-xs-1"></div>
                                        <div class="col-xs-5" style="text-align: right;">IDR `+getrupiah(room_prices[k].total)+`</div>
                                       </div>`;
                        grand_total += room_prices[k].total;
                        temp_copy2 += desc_str + ' Price IDR ' + getrupiah(room_prices[k].total) + '\n';
                    }
                }
                if (!found_room_price)
                {
                    price_txt2 += `<div class="row">
                                    <div class="col-xs-4">(No Charge)</div>
                                    <div class="col-xs-1"></div>
                                    <div class="col-xs-1">N/A</div>
                                    <div class="col-xs-1"></div>
                                    <div class="col-xs-5" style="text-align: right;">N/A</div>
                                   </div>`;
                }
            }
            if(adt_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Adult Price</div>
                                <div class="col-xs-1">x</div>
                                <div class="col-xs-1">`+adt_amt+`</div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-5" style="text-align: right;">IDR `+getrupiah(adt_price)+`</div>
                               </div>`;
                grand_total += adt_price;
                temp_copy += 'Adult Price IDR ' + getrupiah(adt_price) + '\n';
            }
            if(chd_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Child Price</div>
                                <div class="col-xs-1">x</div>
                                <div class="col-xs-1">`+chd_amt+`</div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-5" style="text-align: right;">IDR `+getrupiah(chd_price)+`</div>
                               </div>`;
                grand_total += chd_price;
                temp_copy += 'Child Price IDR ' + getrupiah(chd_price) + '\n';
            }
            if(inf_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Infant Price</div>
                                <div class="col-xs-1">x</div>
                                <div class="col-xs-1">`+inf_amt+`</div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-5" style="text-align: right;">IDR `+getrupiah(inf_price)+`</div>
                               </div>`;
                grand_total += inf_price;
                temp_copy += 'Infant Price IDR ' + getrupiah(inf_price) + '\n';
            }
            price_txt = price_txt1 + price_txt2;
            $test += temp_copy + temp_copy2;
            $test += '\nGrand Total : IDR '+ getrupiah(grand_total)+
           '\nPrices and availability may change at any time';
            price_txt += `<hr style="padding:0px;">
                           <div class="row">
                                <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(grand_total)+`</div>
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
            full_pay_opt = document.getElementById('full_payment_amt');
            if (full_pay_opt)
            {
                full_pay_opt.innerHTML = 'IDR ' + getrupiah(grand_total);
            }
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
