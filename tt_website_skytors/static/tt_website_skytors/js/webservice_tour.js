var tour_data = [];
offset = 0;

function tour_login(data){
    //document.getElementById('themespark_category').value.split(' - ')[1]
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
           console.log(msg);
           console.log(data);
           if(data == ''){
                tour_get_countries();
           }
           else {
                tour_get_countries();
                tour_search();
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function tour_get_countries(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_countries',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {

       },
       success: function(msg) {
           console.log(msg);
           temp = document.getElementById('tour_hidden_destination').value;
           if (temp == "" || temp == "0"){
               var text = '<option value="0" selected="">All Destinations</option>';
           }
           else {
               var text = '<option value="0">All Destinations</option>';
           }

           var counter = 0;
           if(msg.result.error_code == 0){
               tour_countries = msg.result.response.response.countries;
               for(i in tour_countries){
                   if (temp == tour_countries[i].id)
                   {
                       text+=`
                       <option value="`+tour_countries[i].id+`" selected="">`+tour_countries[i].name+`</option>
                       `;
                   }
                   else
                   {
                       text+=`
                       <option value="`+tour_countries[i].id+`">`+tour_countries[i].name+`</option>
                       `;
                   }

               }
               console.log(text);
               if (text != '') {
                    document.getElementById('tour_destination').innerHTML = text;
                    $('#tour_destination').niceSelect('update');
               }
               else {
                    alert('Failed to get Tour Destinations.');
               }

           }else{
                alert('Failed to get Tour Destinations.');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
               tour_data = msg.result.response.response.result;
               if (tour_data.length == 0)
               {
                    text += `
                        <div class="col-lg-4">
                        </div>
                        <div class="col-lg-4">
                            <div style="padding:5px; margin:10px;">
                                <div style="text-align:center">
                                    <img src="/static/tt_website_skytors/img/icon/no-flight.jpeg" style="width:80px; height:80px;" alt="" title="" />
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
                       img_src = `http://static.skytors.id/tour_packages/not_found.png`;
                   }

                   if (tour_data[i].state_tour == 'sold')
                   {
                       dat_content1 = `Date: `+tour_data[i].departure_date+` - `+tour_data[i].arrival_date;
                       dat_content2 = `Sold Out`
                   }
                   else
                   {
                       dat_content1 = `Date: `+tour_data[i].departure_date+` - `+tour_data[i].arrival_date;
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
                                <div class="thumb relative">
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
                                                <span style="font-size:12px;font-weight:bold;">IDR `+tour_data[i].adult_sale_price_with_comma+`  </span>
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
               alert(msg.result.error_msg);
            //error
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
               tour_data = msg.result.response.response.result;
               com_agent = msg.result.response.response.commission_agent_type;
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
                    country_text += tour_data[i].departure_date_f + ` - ` + tour_data[i].arrival_date_f;
                    country_text += `</span>`;
                    if (tour_data[i].duration)
                    {
                        country_text += `<br/><span><i class="fa fa-clock-o" aria-hidden="true"></i> ` + tour_data[i].duration + ` Days</span>`;
                    }
                    country_text += `<br/><span><i class="fa fa-tag" aria-hidden="true"></i> Adult @ ` + tour_data[i].adult_sale_price_with_comma + `</span>`;
                    if (tour_data[i].child_sale_price > 0)
                    {
                        country_text += `<span> | Child @ ` + tour_data[i].child_sale_price_with_comma + `</span>`;
                    }
                    if (tour_data[i].infant_sale_price > 0)
                    {
                        country_text += `<span> | Infant @ ` + tour_data[i].infant_sale_price_with_comma + `</span>`;
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
                                    <img class="img-fluid zoom-img" src="http://static.skytors.id/tour_packages/not_found.png" alt="">
                                </div>
                            </div>
                        </div>`;
                    }
                    image_text += `</div>`;


                    itinerary_text += tour_data[i].itinerary;
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
                                flight_details_text += `<img src="http://static.skytors.id/` + tour_data[i].flight_segment_ids[k].carrier_code + `.png" title="`+tour_data[i].flight_segment_ids[k].carrier_id+`" width="50" height="50"/>`;
                            }

//                            flight_details_text += `</td><td class="hidden-sm hidden-md hidden-lg hidden-xl">`;
//                            if (tour_data[i].flight_segment_ids[k].carrier_code)
//                            {
//                                flight_details_text += `<img src="http://static.skytors.id/` + tour_data[i].flight_segment_ids[k].carrier_code + `.png" width="40" height="40"/>`+tour_data[i].flight_segment_ids[k].carrier_code;
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

                            flight_details_text += `<td colspan="2">`+tour_data[i].flight_segment_ids[k].destination_id+`<br/>`+tour_data[i].flight_segment_ids[k].arrival_date_fmt;
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
                        room_list_text += `
                        <tr>
                            <td style="width:30%;">`+tour_data[i].accommodations[n].hotel+`</td>
                            <td style="width:20%;">`+tour_data[i].accommodations[n].name+` `+tour_data[i].accommodations[n].bed_type+`<br/>Max `+tour_data[i].accommodations[n].pax_limit+` persons</td>
                            <td style="width:40%;">`+tour_data[i].accommodations[n].description+`</td>`;
//                            index                                                                                                                                                                 0                                                          1                                                 2                                                              3                                                   4                                                       5                                                           6                                                       7                                               8                                           9                                               10                                                      11                                                          12                                                      13                                                          14                                                      15
                        room_list_text += `
                            <td style="width:10%;"><button type="button" class="primary-btn-ticket btn-add-rooms" value="`+tour_data[i].accommodations[n].id+`" data-room="`+ String(tour_data[i].accommodations[n].additional_charge) + `~` + tour_data[i].accommodations[n].address + `~` + String(tour_data[i].accommodations[n].adult_limit) + `~` + String(tour_data[i].accommodations[n].adult_surcharge) + `~` + tour_data[i].accommodations[n].bed_type + `~` + String(tour_data[i].accommodations[n].child_surcharge) + `~` + String(tour_data[i].accommodations[n].currency_id) + `~` + tour_data[i].accommodations[n].description + `~` + tour_data[i].accommodations[n].hotel + `~` + tour_data[i].accommodations[n].name + `~` + String(tour_data[i].accommodations[n].pax_limit) + `~` + String(tour_data[i].accommodations[n].pax_minimum) + `~` + String(tour_data[i].accommodations[n].star) + `~` + String(tour_data[i].accommodations[n].single_supplement) + `~` + String(tour_data[i].accommodations[n].id) + `~` + String(tour_data[i].accommodations[n].extra_bed_limit) +`">Add</button></td>
                        </tr>
                        `;
                    }

                     document.getElementById('adult_sale_price_hidden').value = tour_data[i].adult_sale_price;
                     document.getElementById('adult_commission_hidden').value = tour_data[i].adult_commission;
                     document.getElementById('child_sale_price_hidden').value = tour_data[i].child_sale_price;
                     document.getElementById('child_commission_hidden').value = tour_data[i].child_commission;
                     document.getElementById('infant_sale_price_hidden').value = tour_data[i].infant_sale_price;
                     document.getElementById('infant_commission_hidden').value = tour_data[i].infant_commission;
               }

               document.getElementById('tour_carousel').innerHTML += image_text;
               document.getElementById('country_list_tour').innerHTML += country_text;
               document.getElementById('itinerary').innerHTML += itinerary_text;
               document.getElementById('remarks').innerHTML += remarks_text;
               document.getElementById('tour_hotel_room_list').innerHTML += room_list_text;
               document.getElementById('commission_agent_type').value = com_agent;

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
               $('.btn-add-rooms').each(function(){
                           $(this).click(function(){
                                index = document.getElementById('room_amount').value;
                                total_additional_amount = document.getElementById('additional_charge_amount').value;
                                total_additional_price = parseInt(document.getElementById('additional_charge_total').getAttribute("data-price"));
                                var id = $(this).val();
                                var data_hidden = $(this).attr("data-room");
                                var data_list = data_hidden.split('~');
                                $('#tour_room_input').append(render_room_tour_field(id, parseInt(index) + 1, data_list, data_hidden));
                                index++;
                                document.getElementById("room_amount").value = index;
                                document.getElementById("total-price-container").classList.remove("hide");
                                $('select').niceSelect();

                                var additional_charge = parseInt(data_list[0]);
                                if (additional_charge > 0)
                                { total_additional_amount++; }
                                total_additional_price += additional_charge;
                                document.getElementById("additional_charge_amount").value = total_additional_amount;
                                document.getElementById("additional_charge_total").setAttribute("data-price", total_additional_price);
                                document.getElementById("additional_charge_total").value = getrupiah(total_additional_price);
                                get_price_itinerary(package_id);
                           });
                        });
           }else{
               alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function tour_update_passenger(val, pay_method, pax_list_res)
{
    getToken();
    console.log(pax_list_res);
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
           var booker_data = msg.result.response.response.booker_data;
           var book_line = msg.result.response.response.book_line;
           var results = msg.result.response.response.pax_list;
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
               alert("Booking process failed, please try again!");
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
           var booking_num = msg.result.response.response.booking_num;
           if (booking_num)
           {
               document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
               document.getElementById('tour_booking').submit();
           }
           else
           {
               alert("Booking process failed, please try again!");
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
           payment = msg.result.response.response.payment_rules;
           pay_text = '';
           var idx = 1;
           var tot_price = parseInt(document.getElementById("grand_total_hidden").value);
           for (i in payment)
           {
               pay_text += `
                <tr>
                    <td>` +payment[i].name+ `</td>
                    <td id="payment_` + String(idx) + `" name="payment_` + String(idx) + `">` + (parseInt(payment[i].payment_percentage) / 100) * tot_price+ `</td>
                    <td id="payment_date_` + String(idx) + `" name="payment_date_` + String(idx) + `">` +payment[i].due_date+ `</td>
                </tr>
               `;
               idx += 1;
           }
           document.getElementById('tour_payment_rules').innerHTML += pay_text;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
           var booking_num = msg.result.response.response.order_number;
           if (booking_num)
           {
               document.getElementById('tour_booking').innerHTML+= '<input type="hidden" name="order_number" value='+booking_num+'>';
               document.getElementById('tour_booking').submit();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
           var book_obj = msg.result.response.response.result;
           var tour_package = msg.result.response.response.tour_package;
           var passengers = msg.result.response.response.passengers;
           var rooms = msg.result.response.response.rooms;
           var price_itinerary = msg.result.response.response.price_itinerary;
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
           document.getElementById('tour_data_dates').innerHTML += ' ' + tour_package.departure_date_f + ' - ' + tour_package.arrival_date_f;
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

           console.log(price_itinerary);

           get_payment_rules(tour_package.id);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_price_itinerary(package_id) {
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
            tour_data = msg.result.response.response.result;
            tour_data = tour_data[0]
            document.getElementById("single_supplement_amount").value = 0;
            document.getElementById("single_supplement_price").value = 0;
            document.getElementById("airport_tax_amount").value = 0;
            document.getElementById("airport_tax_total").value = 0;
            document.getElementById("tipping_guide_amount").value = 0;
            document.getElementById("tipping_guide_total").value = 0;
            document.getElementById("tipping_tour_leader_amount").value = 0;
            document.getElementById("tipping_tour_leader_total").value = 0;
            document.getElementById("tipping_driver_amount").value = 0;
            document.getElementById("tipping_driver_total").value = 0;

            var airport_tax = tour_data.airport_tax;
            var tipping_guide = tour_data.tipping_guide;
            var tipping_tour_leader = tour_data.tipping_tour_leader;
            var tipping_driver = tour_data.tipping_driver;
            var guiding_days = tour_data.guiding_days;
            var driving_times = tour_data.driving_times;
            var duration = tour_data.duration;

            var single_supplement_amount = 0;
            var single_supplement_price = 0;
            var grand_total_pax = 0;
            var grand_total_pax_no_infant = 0;
            var adult_total_pax = 0;
            var child_total_pax = 0;
            var infant_total_pax = 0;

            document.getElementById("adult_amount").value = 0;
            document.getElementById("adult_price").value = 0;
            document.getElementById("adult_commission").value = 0;
            var adult_sale_price = tour_data.adult_sale_price;
            var adult_commission = tour_data.adult_commission;
            var adult_amount = 0;

            document.getElementById("adult_surcharge_amount").value = 0;
            document.getElementById("adult_surcharge_price").value = 0;
            var adult_surcharge_total = 0;
            var adult_surcharge_amount = 0;

            document.getElementById("child_amount").value = 0;
            document.getElementById("child_price").value = 0;
            document.getElementById("child_commission").value = 0;
            var child_sale_price = tour_data.child_sale_price;
            var child_commission = tour_data.child_commission;
            var child_amount = 0;

            document.getElementById("child_surcharge_amount").value = 0;
            document.getElementById("child_surcharge_price").value = 0;
            var child_surcharge_total = 0;
            var child_surcharge_amount = 0;

            document.getElementById("infant_amount").value = 0;
            document.getElementById("infant_price").value = 0;
            document.getElementById("infant_commission").value = 0;
            var infant_sale_price = tour_data.infant_sale_price;
            var infant_commission = tour_data.infant_commission;
            var infant_amount = 0;

            var room_amount = document.getElementById("room_amount");

            if (room_amount.value <= 0)
            {
                $('#btnDeleteRooms').addClass("hide");
                $('#total-price-container').addClass("hide");
            }
            else {
                $('#btnDeleteRooms').removeClass("hide");
                $('#total-price-container').removeClass("hide");
            }

            for (var i=0; i<room_amount.value; i++)
            {
                var temp = 'data_per_room_hidden_'+String(i+1);
                var data_per_room_hidden = document.getElementById(temp).value;
                var data_per_room_list = data_per_room_hidden.split("~");
                var pax_minimum = parseInt(data_per_room_list[11]);
                var extra_bed_limit = parseInt(data_per_room_list[15]);
                var single_supplement = parseInt(data_per_room_list[13]);
                var adult_surcharge_price = parseInt(data_per_room_list[3]);
                var child_surcharge_price = parseInt(data_per_room_list[5]);

                temp = 'adult_tour_room_'+String(i+1);
                var adult_amount_per_room = parseInt(document.getElementById(temp).value);
                temp = 'child_tour_room_'+String(i+1);
                var child_amount_per_room = parseInt(document.getElementById(temp).value);
                temp = 'infant_tour_room_'+String(i+1);
                var infant_amount_per_room = parseInt(document.getElementById(temp).value);

                var total_amount = adult_amount_per_room + child_amount_per_room + infant_amount_per_room;
                var total_amount_no_infant = adult_amount_per_room + child_amount_per_room;

                grand_total_pax += total_amount;
                grand_total_pax_no_infant += total_amount_no_infant;
                adult_total_pax += adult_amount_per_room;
                child_total_pax += child_amount_per_room;
                infant_total_pax += infant_amount_per_room;

                if (total_amount_no_infant < pax_minimum) {
                    var single_sup = pax_minimum - total_amount_no_infant;
                    single_supplement_amount += single_sup;
                    single_supplement_price += single_sup * single_supplement;
                    adult_amount += total_amount_no_infant
                    infant_amount += infant_amount_per_room
                }
                else {
                    if (adult_amount_per_room >= pax_minimum) {
                        adult_amount += adult_amount_per_room;
                        if (adult_amount_per_room - pax_minimum <= extra_bed_limit) {
                            adult_surcharge_amount += adult_amount_per_room - pax_minimum;
                            adult_surcharge_total += (adult_amount_per_room - pax_minimum) * adult_surcharge_price;
                            extra_bed_limit -= adult_amount_per_room - pax_minimum;
                            if (child_amount_per_room <= extra_bed_limit) {
                                child_amount += child_amount_per_room;
                                child_surcharge_amount += child_amount_per_room;
                                child_surcharge_total += child_amount_per_room * child_surcharge_price;
                            }
                            else {
                                child_amount += child_amount_per_room;
                                child_surcharge_amount += child_amount_per_room - extra_bed_limit;
                                child_surcharge_total += (child_amount_per_room - extra_bed_limit) * child_surcharge_price;
                            }
                        } else {
                            adult_surcharge_amount += adult_amount_per_room - pax_minimum - extra_bed_limit;
                            adult_surcharge_total += (adult_amount_per_room - pax_minimum - extra_bed_limit) * adult_surcharge_price;
                            child_amount += child_amount_per_room;
                        }
        //                child_amount += child_amount_per_room;
        //                child_surcharge_amount += child_amount_per_room;
        //                child_surcharge_total += child_amount_per_room * child_surcharge_price;
                        infant_amount += infant_amount_per_room;
                    }
                    else {
                        adult_amount += pax_minimum;
                        if (child_amount_per_room > 0) {
                            if (Math.max(child_amount_per_room - (pax_minimum - adult_amount_per_room), 0) != 0) {
                                if ((child_amount_per_room - (pax_minimum - adult_amount_per_room)) > extra_bed_limit) {
                                    child_amount += child_amount_per_room - (pax_minimum - adult_amount_per_room);
                                    child_surcharge_amount += child_amount_per_room - (pax_minimum - adult_amount_per_room) - extra_bed_limit;
                                    child_surcharge_total += (child_amount_per_room - (pax_minimum - adult_amount_per_room) - extra_bed_limit) * child_surcharge_price;
                                } else {
                                    child_amount += child_amount_per_room - (pax_minimum - adult_amount_per_room);
                                    child_surcharge_amount += child_amount_per_room - (pax_minimum - adult_amount_per_room);
                                    child_surcharge_total += (child_amount_per_room - (pax_minimum - adult_amount_per_room)) * child_surcharge_price;
                                }
                            }
                        }
                        if (infant_amount_per_room > 0) {
                            if (adult_amount_per_room + child_amount_per_room < pax_minimum) {
                                infant_amount += Math.max(infant_amount_per_room - (pax_minimum - adult_amount_per_room - child_amount_per_room), 0);
                            }
                            else {
                                infant_amount += infant_amount_per_room;
                            }
                        }
                    }
                }
            }

            document.getElementById('adult_total_pax').value = adult_total_pax;
            document.getElementById('child_total_pax').value = child_total_pax;

            var discount_total = 0;
            var tour_type = tour_data.tour_type;
            if (tour_type == 'sic')
            {
                var discount = JSON.parse(document.getElementById("discount").value);
                for (var i=0; i < discount.length; i++) {
                    var min_pax = discount[i]['min_pax'];
                    var max_pax = discount[i]['max_pax'];
                    var discount_per_pax = discount[i]['discount_per_pax'];
                    if ((grand_total_pax_no_infant >= min_pax) && (grand_total_pax_no_infant <= max_pax)) {
                        adult_sale_price = parseInt(tour_data.adult_sale_price) - discount_per_pax;
                        child_sale_price = parseInt(tour_data.child_sale_price) - discount_per_pax;
                        adult_commission *= 0.5;
                        child_commission *= 0.5;
                        infant_commission *= 0.5;
                        discount_total = discount[i]['discount_total'];
                        break;
                    }
                }
            }

            document.getElementById("single_supplement_amount").value = single_supplement_amount;
            document.getElementById("single_supplement_price").setAttribute("data-price", single_supplement_price);
            document.getElementById("single_supplement_price").value = getrupiah(single_supplement_price);

            document.getElementById("adult_amount").value = adult_amount;
            document.getElementById("adult_price").setAttribute("data-price", adult_amount * adult_sale_price);
            document.getElementById("adult_price").value = getrupiah(adult_amount * adult_sale_price);
            document.getElementById("adult_commission").setAttribute("data-price", adult_amount * adult_commission);
            document.getElementById("adult_commission").value = getrupiah(adult_amount * adult_commission);
            document.getElementById("adult_surcharge_amount").value = adult_surcharge_amount;
            document.getElementById("adult_surcharge_price").setAttribute("data-price", adult_surcharge_total);
            document.getElementById("adult_surcharge_price").value = getrupiah(adult_surcharge_total);

            document.getElementById("child_amount").value = child_amount;
            document.getElementById("child_price").setAttribute("data-price", child_amount * child_sale_price);
            document.getElementById("child_price").value = getrupiah(child_amount * child_sale_price);
            document.getElementById("child_commission").setAttribute("data-price", child_amount * child_commission);
            document.getElementById("child_commission").value = getrupiah(child_amount * child_commission);
            document.getElementById("child_surcharge_amount").value = child_surcharge_amount;
            document.getElementById("child_surcharge_price").setAttribute("data-price", child_surcharge_total);
            document.getElementById("child_surcharge_price").value = getrupiah(child_surcharge_total);

            document.getElementById("infant_amount").value = infant_amount;
            document.getElementById("infant_price").setAttribute("data-price", infant_amount * infant_sale_price);
            document.getElementById("infant_price").value = getrupiah(infant_amount * infant_sale_price);
            document.getElementById("infant_commission").setAttribute("data-price", infant_amount * infant_commission);
            document.getElementById("infant_commission").value = getrupiah(infant_amount * infant_commission);

            var airport_tax = grand_total_pax * airport_tax;
            document.getElementById("airport_tax_amount").value = grand_total_pax;
            document.getElementById("airport_tax_total").setAttribute("data-price", airport_tax);
            document.getElementById("airport_tax_total").value = getrupiah(airport_tax);

            var am_tipping_guide = adult_total_pax;
            var am_tipping_tour_leader = adult_total_pax;
            var am_tipping_driver = adult_total_pax;

            if(tour_data.tipping_guide_child){
                am_tipping_guide += child_total_pax;
            }
            if(tour_data.tipping_guide_infant){
                am_tipping_guide += infant_total_pax;
            }
            if(tour_data.tipping_tour_leader_child){
                am_tipping_tour_leader += child_total_pax;
            }
            if(tour_data.tipping_tour_leader_infant){
                am_tipping_tour_leader += infant_total_pax;
            }
            if(tour_data.tipping_driver_child){
                am_tipping_driver += child_total_pax;
            }
            if(tour_data.tipping_driver_infant){
                am_tipping_driver += infant_total_pax;
            }

            var tipping_guide_total = am_tipping_guide * tipping_guide * guiding_days;
            var tipping_tour_leader_total = am_tipping_tour_leader * tipping_tour_leader * duration;
            var tipping_driver_total = am_tipping_driver * tipping_driver * driving_times;

            document.getElementById("tipping_guide_amount").value = am_tipping_guide;
            document.getElementById("tipping_guide_total").setAttribute("data-price", tipping_guide_total);
            document.getElementById("tipping_guide_total").value = getrupiah(tipping_guide_total);

            document.getElementById("tipping_tour_leader_amount").value = am_tipping_tour_leader;
            document.getElementById("tipping_tour_leader_total").setAttribute("data-price", tipping_tour_leader_total);
            document.getElementById("tipping_tour_leader_total").value = getrupiah(tipping_tour_leader_total);

            document.getElementById("tipping_driver_amount").value = am_tipping_driver;
            document.getElementById("tipping_driver_total").setAttribute("data-price", tipping_driver_total);
            document.getElementById("tipping_driver_total").value = getrupiah(tipping_driver_total);
            get_total_price(discount_total);
            for (var i=0; i<room_amount.value; i++)
            {
                $('#adult_tour_room_'+String(i+1)).niceSelect('update');
                $('#child_tour_room_'+String(i+1)).niceSelect('update');
                $('#infant_tour_room_'+String(i+1)).niceSelect('update');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}