var tour_data = [];
offset = 0;

function tour_login(){
    //document.getElementById('activity_category').value.split(' - ')[1]
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {

       },
       success: function(msg) {
           tour_search();
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
           'offset': offset
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
                        <div class="col-lg-4">
                        </div>
                        <div class="col-lg-4">
                            <div style="padding:5px; margin:10px;">
                                <div style="text-align:center">
                                    <img src="/static/tt_website_skytors/img/icon/no-flight.png" style="width:80px; height:80px;" alt="" title="" />
                                    <br/><br/>
                                    <h6>NO TOUR AVAILABLE</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                        </div>
                    `;
               }
               for(i in tour_data){
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
                       dat_content1 = `Date: `+tour_data[i].departure_date+` - `+tour_data[i].return_date;
                       dat_content2 = `Sold Out`
                   }
                   else
                   {
                       dat_content1 = `Date: `+tour_data[i].departure_date+` - `+tour_data[i].return_date;
                       dat_content2 = `Availability: `+tour_data[i].seat+`/`+tour_data[i].quota;
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
                                                <span style="font-size:12px;">`+dat_content1+`</span><br/>
                                                <span style="font-size:12px;">`+dat_content2+`</span><br/><br/>
                                            </div>
                                            <div class="col-lg-12" style="text-align:right;">
                                                <span style="font-size:12px;font-weight:bold;">IDR `+getrupiah(tour_data[i].adult_sale_price)+`  </span>
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
           'id': package_id
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
                    country_text += `<div style="position: absolute; bottom: 30px; right: 30px;">
                                        <a class="btn btn-tour btn-chgsearch" style="border-radius:6px; border: 1px solid #ddd;" href="#">
                                            <i class="fa fa-print" aria-hidden="true"></i>
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

                    for (it_idx in tour_data[i].itinerary_ids)
                    {
                        itinerary_text += `<h4> Day `+tour_data[i].itinerary_ids[it_idx].day+` - `+tour_data[i].itinerary_ids[it_idx].name+`</h4><hr/>`;
                        itinerary_text += `<div class="row">`;
                        for(it_item in tour_data[i].itinerary_ids[it_idx].items)
                        {
                            itinerary_text += `<div class="col-lg-3" style="padding-bottom: 15px;"><div style="border: 1px solid #cdcdcd;"><div style="object-fit: cover;">`;
                            if (tour_data[i].itinerary_ids[it_idx].items[it_item].image)
                            {
                                itinerary_text += `<img src="`+tour_data[i].itinerary_ids[it_idx].items[it_item].image+`" style="width:100%; height: 200px;"/>`;
                            }
                            else
                            {
                                itinerary_text += `<img src="`+static_path_url_server+`/public/tour_packages/not_found.png" style="width:100%; height: 200px;"/>`;
                            }
                            itinerary_text += `</div>`;

                            itinerary_text += `<div style="padding:10px;"><span style="font-size: 15px; font-weight: bold;">`+tour_data[i].itinerary_ids[it_idx].items[it_item].name+`</span><br/>`;
                            if (tour_data[i].itinerary_ids[it_idx].items[it_item].description)
                            {
                                itinerary_text += `<span style="font-size: 14px;">`+tour_data[i].itinerary_ids[it_idx].items[it_item].description+`</span><br/>`;
                            }
                            if (tour_data[i].itinerary_ids[it_idx].items[it_item].timeslot)
                            {
                                itinerary_text += `<span style="font-size: 14px;">`+tour_data[i].itinerary_ids[it_idx].items[it_item].timeslot+`</span>`;
                            }

                            itinerary_text += `</div></div></div>`;
                        }
                        itinerary_text += `</div>`;
                        itinerary_text += `<br/><br/>`;
                    }

                    remarks_text += tour_data[i].requirements;
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
       },timeout: 60000
    });
}

function update_passengers_tour(){
    for (var i=0; i < total_pax_js; i++)
    {
        var temp_room_seq = document.getElementById("room_select_pax"+String(i+1)).value;
        pax_list_js[i].room_id = document.getElementById("room_id_"+String(temp_room_seq)).value;
        pax_list_js[i].room_seq = parseInt(temp_room_seq);
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'update_passengers',
       },
       data: {
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
       },timeout: 60000
    });
}

function tour_update_passenger(val, pay_method, pax_list_res)
{
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'update_passenger',
       },
       data: {
            'pax_list_js': JSON.stringify(pax_list_res)
       },
       success: function(msg) {
           console.log(msg);
           var pax_list = [];
           var booker_data = msg.result.response.booker_data;
           var book_line = msg.result.response.book_line;
           var results = msg.result.response.pax_list;
           for(i in results){
               pax_list.push(parseInt(results[i]));
           }
           var result_data = {
               'pax_ids': pax_list,
               'booker_id': booker_data,
               'book_line_ids': book_line,
               'pay_method': pay_method
           }
           if (result_data)
           {
               tour_commit_booking(val, result_data);
           }
           else
           {
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Booking process failed, please try again! </span>',
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour update passenger </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function tour_commit_booking(val, result_data)
{
    getToken();
    var booker_id = result_data.booker_id;
    var pax_ids = result_data.pax_ids;
    var pax_ids_str = '';
    var book_line_ids = result_data.book_line_ids;
    var book_line_ids_str = '';

    for (i in pax_ids)
    {
        pax_ids_str += String(pax_ids[i]) + '|';
    }

    for (i in book_line_ids)
    {
        book_line_ids_str += String(book_line_ids[i]) + '|';
    }

    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'commit_booking',
       },
       data: {
           'value': val,
           'booker_id': booker_id,
           'pax_ids': pax_ids_str,
           'payment_method': result_data.pay_method,
           'book_line_ids': book_line_ids_str
       },
       success: function(msg) {
           console.log(msg);
           var booking_num = msg.result.response.booking_num;
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
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour commit booking </span>' + errorThrown,
            })
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
       },
       success: function(msg) {
           console.log(msg);
           payment = msg.result.response.payment_rules;
           pay_text = '';
           var idx = 1;
           for (i in payment)
           {
               pay_text += `
                <tr>
                    <td>` +payment[i].name+ `</td>
                    <td id="payment_` + String(idx) + `" name="payment_` + String(idx) + `">` + (parseInt(payment[i].payment_percentage) / 100) * grand_total+ `</td>
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

function tour_issued_booking(order_number)
{
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'issued',
       },
       data: {
           'order_number': order_number,
       },
       success: function(msg) {
           console.log(msg);
           var booking_num = msg.result.response.order_number;
           if (booking_num)
           {
               document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
               document.getElementById('tour_booking').submit();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour issued booking </span>' + errorThrown,
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
       },
       success: function(msg) {
           console.log(msg);
           var book_obj = msg.result.response.result;
           var tour_package = msg.result.response.tour_package;
           var passengers = msg.result.response.passengers;
           var rooms = msg.result.response.rooms;
           var price_itinerary = msg.result.response.price_itinerary;
           var cur_state = '';
           updownsell_txt = '';
           pax_txt = '';
           room_txt = '';
           booker_txt = '';
           order_detail_txt = '';
           breadcrumb_txt = `
                    <ul class="progressbar">
                        <li class="active"><span>Home <i class="fas fa-home"></i></span></li>
                        <li class="active"><span>Search <i class="fas fa-search"></i></span></li>
                        <li class="active"><span>Passenger <i class="fas fa-users"></i></span></li>
                        <li class="active"><span>Book <i class="fas fa-book-open"></i></span></li>

           `;

           order_detail_txt += `
           <h4>Order Detail</h4>
           <hr/>
           <h4>`+ book_obj.name +`</h4>
           <span style="font-size: 15px; font-weight: bold;" aria-hidden="true">Status:
           `;
           if (book_obj.state == 'issued')
           {
                breadcrumb_txt += `<li class="active"><span>Issued <i class="fas fa-check-circle"></i></span></li>`;
                cur_state = 'Issued';
                order_detail_txt += `Issued`;
           }
           else
           {
                breadcrumb_txt += `<li class="current"><span>Issued <i class="fas fa-check-circle"></i></span></li>`;
                cur_state = 'Booked';
                order_detail_txt += `Booked`;
                document.getElementById('issued_btn_place').innerHTML += '<input class="primary-btn hold-seat-booking-train" type="button" value="Issued" data-toggle="modal" data-target="#issuedModal" style="width:100%;"/>';
                document.getElementById('upsell_downsell_opt').innerHTML += `
                    <div id="pricing">
                        <div class="col-lg-12" style="max-height:500px; overflow-y:auto; border:1px solid #cdcdcd; background-color:white;">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h4 style="padding-top:10px;">Pricing</h4>
                                    <hr/>
                                </div>
                                <div class="col-lg-12" style="text-align:right;">
                                    <button class="primary-btn-ticket" type="button" onclick="check_before_add_repricing();"><i class="fas fa-plus-circle"></i></button>
                                    <button class="primary-btn-ticket" type="button" onclick="delete_table_of_equation();"><i class="fas fa-trash-alt"></i></button>
                                    <br/>
                                </div>
                                <div class="col-lg-12">
                                    <div style="padding:10px;" id="table_of_equation">

                                    </div>
                                </div>
                                <div class="col-lg-12" style="margin-bottom:15px; margin-top:15px;">
                                    <hr/>
                                    <center>
                                        <input class="primary-btn-ticket" type="button" onclick="check_before_calculate();" value="Calculate">
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById('upsell_downsell_opt2').innerHTML += `
                    <div class="row">
                        <div class="col-lg-12" style="padding:10px; background-color:white; border:1px solid #cdcdcd;">
                            <h4>Result Pricing</h4>
                            <hr/>
                            <div class="row" id="repricing_div">

                            </div>
                        </div>
                    </div>
                `;
           }
           breadcrumb_txt += `
                    </ul>
           `;
           order_detail_txt += `</span>
           `;
           if (book_obj.state != 'issued')
           {
                order_detail_txt += `<span style="font-size: 15px; font-weight: bold; float:right;" aria-hidden="true">Hold Date: `+ book_obj.hold_date +`</span>`;
           }

           for (i in rooms)
           {
                room_txt += `
                    <tr>
                        <td>`+rooms[i].room_number+`</td>
                        <td>`+rooms[i].room_name+`</td>
                        <td>`+rooms[i].room_bed_type+`</td>
                        <td>`+rooms[i].room_hotel+`</td>
                        <td>`+rooms[i].room_notes+`</td>
                    </tr>
                `;
           }

           var idx = 1;
           for (i in passengers)
           {
                pax_txt += `
                    <div class="row">
                        <div class="col-lg-6" style="margin-bottom:10px;">
                            <h6>`+ idx +`. `+ passengers[i].title +`. `+ passengers[i].first_name +` `+ passengers[i].last_name +`</h6>
                            <span>`;

                if(passengers[i].pax_type == 'ADT')
                {
                    pax_txt += `Adult`;
                }
                else if(passengers[i].pax_type == 'CHD')
                {
                    pax_txt += `Child`;
                }
                else
                {
                    pax_txt += `Infant`;
                }

                pax_txt += `- Birth Date: `+ passengers[i].birth_date +`
                            </span>
                        </div>
                        <div class="col-lg-6">
                            <div id="div_select_pax`+ idx +`" style="padding: 2px 2px 4px 2px;">
                                Room `+ passengers[i].room_number +` ; `+ passengers[i].room_name +`/`+ passengers[i].room_bed_type +` ; `+ passengers[i].room_hotel +`
                            </div>
                        </div>
                    </div>
                    <hr/>
                `;
                idx += 1;
           }

           booker_txt += `
                     <tr>
                        <td>1</td>
                        <td>`+book_obj.contact_title+`. `+book_obj.contact_first_name+` `+book_obj.contact_last_name+`</td>
                        <td>`+book_obj.contact_email+`</td>
                        <td>`+book_obj.contact_phone+`</td>
                     </tr>
           `;

           document.getElementById('tour_book_breadcrumb').innerHTML += breadcrumb_txt;
           document.getElementById('state_title').innerHTML += 'Your Order Has Been ' + cur_state + '!';
           document.getElementById('tour_data_name').innerHTML += tour_package.name;
           document.getElementById('tour_data_dates').innerHTML += ' ' + tour_package.departure_date_f + ' - ' + tour_package.return_date_f;
           document.getElementById('tour_data_duration').innerHTML += ' ' + tour_package.duration + ' Days';
           document.getElementById('tour_data_flight_visa').innerHTML += tour_package.flight + ' Flight, ' + tour_package.visa + ' Visa';
           document.getElementById('tour_order_detail').innerHTML += order_detail_txt;
           document.getElementById('list-of-rooms').innerHTML += room_txt;
           document.getElementById('list-of-bookers').innerHTML += booker_txt;
           document.getElementById('pax_list_table').innerHTML += pax_txt;
           document.getElementById('full_payment_val').innerHTML += String(price_itinerary.total_itinerary_price);
           document.getElementById('grand_total_hidden').value = parseInt(price_itinerary.total_itinerary_price);

           document.getElementById("commission_total_content").innerHTML = getrupiah(price_itinerary.commission_total);
           document.getElementById("adult_price").value = getrupiah(price_itinerary.adult_price);
           document.getElementById("adult_amount").value = getrupiah(price_itinerary.adult_amount);
           document.getElementById("adult_surcharge_price").value = getrupiah(price_itinerary.adult_surcharge_price);
           document.getElementById("adult_surcharge_amount").value = getrupiah(price_itinerary.adult_surcharge_amount);
           document.getElementById("child_price").value = getrupiah(price_itinerary.child_price);
           document.getElementById("child_amount").value = getrupiah(price_itinerary.child_amount);
           document.getElementById("child_surcharge_price").value = getrupiah(price_itinerary.child_surcharge_price);
           document.getElementById("child_surcharge_amount").value = getrupiah(price_itinerary.child_surcharge_amount);
           document.getElementById("infant_price").value = getrupiah(price_itinerary.infant_price);
           document.getElementById("infant_amount").value = getrupiah(price_itinerary.infant_amount);
           document.getElementById("single_supplement_price").value = getrupiah(price_itinerary.single_supplement_price);
           document.getElementById("single_supplement_amount").value = getrupiah(price_itinerary.single_supplement_amount);
           document.getElementById("airport_tax_total").value = getrupiah(price_itinerary.airport_tax_total);
           document.getElementById("airport_tax_amount").value = getrupiah(price_itinerary.airport_tax_amount);
           document.getElementById("tipping_guide_total").value = getrupiah(price_itinerary.tipping_guide_total);
           document.getElementById("tipping_guide_amount").value = getrupiah(price_itinerary.tipping_guide_amount);
           document.getElementById("tipping_tour_leader_total").value = getrupiah(price_itinerary.tipping_tour_leader_total);
           document.getElementById("tipping_tour_leader_amount").value = getrupiah(price_itinerary.tipping_tour_leader_amount);
           document.getElementById("tipping_driver_total").value = getrupiah(price_itinerary.tipping_driver_total);
           document.getElementById("tipping_driver_amount").value = getrupiah(price_itinerary.tipping_driver_amount);
           document.getElementById("additional_charge_total").value = getrupiah(price_itinerary.additional_charge_total);
           document.getElementById("additional_charge_amount").value = getrupiah(price_itinerary.additional_charge_amount);
           document.getElementById("sub_total").value = getrupiah(price_itinerary.sub_total_itinerary_price);
           document.getElementById("discount_total").value = getrupiah(price_itinerary.discount_total_itinerary_price);
           document.getElementById("grand_total").value = getrupiah(price_itinerary.total_itinerary_price);


           get_payment_rules(tour_package.id);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error tour update passenger </span>' + errorThrown,
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
                                            <div class="col-xs-1">X</div>
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
                                            <div class="col-xs-1">X</div>
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
                                        <div class="col-xs-1">X</div>
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
                                <div class="col-xs-1">X</div>
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
                                <div class="col-xs-1">X</div>
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
                                <div class="col-xs-1">X</div>
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
                                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
                                    } else {
                                        price_txt+=`
                                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
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
                               <div class="col-lg-12">
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
                                            <div class="col-xs-1">X</div>
                                            <div class="col-xs-1">`+price_data[i].pax_count+`</div>
                                            <div class="col-xs-1"></div>
                                            <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(price_data[i].total)+`</div>
                                           </div>`;
                            temp_copy2 += pax_type_str + ' ' + desc_str + ' Price IDR ' + getrupiah(price_data[i].total) + '\n';
                        }
                        else
                        {
                            price_txt2 += `<div class="row">
                                            <div class="col-xs-4">`+desc_str+`</div>
                                            <div class="col-xs-1">X</div>
                                            <div class="col-xs-1">`+price_data[i].pax_count+`</div>
                                            <div class="col-xs-1"></div>
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
                                        <div class="col-xs-1">X</div>
                                        <div class="col-xs-1">`+room_prices[k].pax_count+`</div>
                                        <div class="col-xs-1"></div>
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
                                    <div class="col-xs-1"></div>
                                    <div class="col-xs-4" style="text-align: right;">N/A</div>
                                   </div>`;
                }
            }
            if(adt_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Adult Price</div>
                                <div class="col-xs-1">X</div>
                                <div class="col-xs-1">`+adt_amt+`</div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(adt_price)+`</div>
                               </div>`;
                grand_total += adt_price;
                temp_copy += 'Adult Price IDR ' + getrupiah(adt_price) + '\n';
            }
            if(chd_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Child Price</div>
                                <div class="col-xs-1">X</div>
                                <div class="col-xs-1">`+chd_amt+`</div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-4" style="text-align: right;">IDR `+getrupiah(chd_price)+`</div>
                               </div>`;
                grand_total += chd_price;
                temp_copy += 'Child Price IDR ' + getrupiah(chd_price) + '\n';
            }
            if(inf_amt > 0)
            {
                price_txt1 += `<div class="row">
                                <div class="col-xs-4">Infant Price</div>
                                <div class="col-xs-1">X</div>
                                <div class="col-xs-1">`+inf_amt+`</div>
                                <div class="col-xs-1"></div>
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
                                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
                                    } else {
                                        price_txt+=`
                                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
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
                               <div class="col-lg-12">
                                    <input type="button" id="show_commission_button" class="primary-btn-ticket" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
                               </div>
                           </div>`;

            document.getElementById('tour_detail_table').innerHTML = price_txt;
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
