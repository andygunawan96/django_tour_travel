tour_data = [];
offset = 0;

function tour_login(){
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

               }

           }else{

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
                       dat_content1 = `Sold Out`
                       dat_content2 = ``
                   }
                   else
                   {
                       dat_content1 = tour_data[i].departure_date+` - `+tour_data[i].arrival_date;
                       dat_content2 = `Availability: `+tour_data[i].seat+`/`+tour_data[i].quota;
                   }

                   text+=`
                   <form action='/tour/detail' method=POST id='myForm`+tour_data[i].sequence+`'>
                       <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" style="padding: 0px; text-align: center;">
                            <div id='csrf`+tour_data[i].sequence+`'></div>
                            <input type='hidden' value='`+JSON.stringify(tour_data[i]).replace(/[']/g, /["]/g)+`'/>
                            <input id='uuid' name='uuid' type=hidden value='`+tour_data[i].id+`'/>
                            <input id='sequence' name='sequence' type=hidden value='`+tour_data[i].sequence+`'/>
                            <button class="panel_themespark" type="button" data-content-1="`+dat_content1+`" data-content-2="`+dat_content2+`" onclick="go_to_detail('`+tour_data[i].sequence+`')">
                                <div class="themespark-image-thumbnail">
                                    <img style="width: 100%; height: 100%;" src="`+img_src+`">
                                </div>
                                <div class="row themespark-description-thumbnail" style="display:block;">
                                    <span class="span-themespark-desc" style="font-weight:bold;">`+tour_data[i].name+`</span><br/>`;
                                text+=`
                                </div>
                            </button>
                       </div>
                   </form>
                   `;
               }
               offset++;
               document.getElementById('tour_ticket').innerHTML += text;
               if(msg.result.response.length!=0)
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
           data=[]
           if(msg.result.error_code == 0){
               tour_data = msg.result.response.response.result;
               com_agent = msg.result.response.response.commission_agent_type;
               for (i in tour_data)
               {
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

                    image_text += `<div class="owl-carousel-tour-img owl-theme" style="width:100%; height:100%;">`;
                    for (j in tour_data[i].images_obj)
                    {
                        image_text+=`<div class="item" style="cursor:zoom-in;">
                                        <img class="img-fluid zoom-img" src="`+tour_data[i].images_obj[j].url+`" style="width:100%; height:100%;" alt="">
                                    </div>`;
                    }
                    if (image_text == '')
                    {
                        image_text += `<div class="item" style="cursor:zoom-in;">
                                        <img class="img-fluid zoom-img" src="http://static.skytors.id/tour_packages/not_found.png" style="width:100%; height:100%;" alt="">
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

                                var additional_charge = parseInt(data_list[0]);
                                if (additional_charge > 0)
                                { total_additional_amount++; }
                                total_additional_price += additional_charge;
                                document.getElementById("additional_charge_amount").value = total_additional_amount;
                                document.getElementById("additional_charge_total").setAttribute("data-price", total_additional_price);
                                document.getElementById("additional_charge_total").value = getrupiah(total_additional_price);
                                get_price_itinerary();
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