var hotel_data = '';
var hotel_data_filter = '';
var hotel_price = '';
var price_pick = '';
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
}

function get_hotel_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_data',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        console.log(msg);
        hotel_config = msg
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_auto_complete(term,suggest){
    clearTimeout(hotelAutoCompleteVar);
    term = term.toLowerCase();
    console.log(term);
    check = 0;
    var limit = 10;
    var current_rec = 0;
    var priority = [];

    getToken();
    hotelAutoCompleteVar = setTimeout(function() {
        console.log(term);
        $.ajax({
           type: "POST",
           url: "/webservice/hotel",
           headers:{
                'action': 'get_auto_complete',
           },
    //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
           data: {
                'name':term
           },
           success: function(msg) {
            console.log(msg);
            console.log(JSON.stringify(msg));
            hotel_choices = msg;
            try{
                var choices = hotel_choices;
                console.log(choices);
                for (i=0;i<choices.city_ids.length;i++){
                    if (current_rec < limit){
                        if(choices.city_ids[i].name.toLowerCase().search(term) !== -1){
                            priority.push(choices.city_ids[i].name + ' - ' + 'City' );
                            current_rec += 1;
                        }
                    } else {
                        break;
                    }
                }
                console.log('city:' + current_rec);
                for (i=0;i<choices.country_ids.length;i++){
                    if (current_rec < limit){
                        if(choices.country_ids[i].name.toLowerCase().search(term) !== -1){
                            priority.push(choices.country_ids[i].name + ' - ' + 'Country');
                            current_rec += 1;
                        }
                    } else {
                        break;
                    }
                }
                console.log('country:' + current_rec);
                for (i=0;i<choices.hotel_ids.length;i++){
                    if (current_rec < limit){
                        if(choices.hotel_ids[i].name.toLowerCase().search(term) !== -1){
                            priority.push(choices.hotel_ids[i].name + ' - ' + 'Hotel');
                            current_rec += 1;
                        }
                    } else {
                        break;
                    }
                }
                console.log('Hotel:' + current_rec);
                for (i=0;i<choices.landmark_ids.length;i++){
                    if (current_rec < limit){
                        if(choices.landmark_ids[i].name.toLowerCase().search(term) !== -1){
                            priority.push(choices.landmark_ids[i].name + ' - ' + 'Landmark');
                            current_rec += 1;
                        }
                    } else {
                        break;
                    }
                }
            }catch(err){

            }
            console.log(priority.slice(0,100));
            suggest(priority.slice(0,100));
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               alert(errorThrown);
           }
        });
    }, 150);
}

//signin jadi 1 sama search
function hotel_search(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
           if(data == ''){
               document.getElementById('hotel_ticket').innerHTML = ``;
               child_age = '';
               for(i=0; i<parseInt($('#hotel_child').val());i++){
                   child_age+=parseInt($('#hotel_child_age'+(i+1).toString()).val());
                   if(i != parseInt($('#hotel_child').val())-1)
                       child_age+=',';
               }
               if(msg.result.error_code == 0){
                   $.ajax({
                       type: "POST",
                       url: "/webservice/hotel",
                       headers:{
                            'action': 'search',
                       },
                       data: {
                        'destination': $('#hotel_id_destination').val(),
                        'nationality': $('#hotel_id_nationality').val(),
                        'checkin': $('#hotel_checkin').val(),
                        'checkout': $('#hotel_checkout').val(),
                        'room': $('#hotel_room').val(),
                        'adult': $('#hotel_adult').val(),
                        'child': $('#hotel_child').val(),
                        'child_age': child_age
                       },
                       success: function(msg) {
                           console.log(msg);
                           try{
                                if(msg.result.error_code==0){
                                    hotel_data = msg.result.response;
                                    vendor = [];
                                    for(i in msg.result.response.hotel_ids){
                                        check = 0;
                                        if(vendor.length != 0)
                                            for(j in msg.result.response.hotel_ids[i].external_code){
                                                if(vendor.indexOf(j) == -1){
                                                    vendor.push(j);
                                                }else{
                                                    check = 1;
                                                }
                                            }
                                        if(check == 0){
                                            for(j in msg.result.response.hotel_ids[i].external_code){
                                                if(vendor.indexOf(j) == -1){
                                                    vendor.push(j);
                                                }
                                            }
                                        }
                                    }
                                    filtering('sort');
                                }else{
                                    //kalau error belum
                                }
                           }catch(err){
                                alert(msg.result.error_msg);
                           }
                       },
                       error: function(XMLHttpRequest, textStatus, errorThrown) {
                           alert(errorThrown);
                       }
                   });
               }else{

               }
           }else if(data != ''){
               //goto reservation
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_top_facility(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_top_facility',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        console.log(msg);
        top_facility = msg.result.response;
        if (top_facility){
            facility_filter_html = `<hr><h6 style="padding-bottom:10px;">Facilities:</h6>`;
            for(i in top_facility){
                facility_filter_html += `
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:black;"><img src="`+top_facility[i].image_url+`" style="width:20px; height:20px;"/> `+top_facility[i].facility_name+`</span>
                    <input type="checkbox" id="fac_filter`+i+`" onclick="change_filter('rating',`+i+`);">
                    <span class="check_box_span_custom"></span>
                </label><br/>`;
            }
            var node = document.createElement("div");
            node.innerHTML = facility_filter_html;
            document.getElementById("filter").appendChild(node);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function hotel_detail(id){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
    document.getElementById("detail_room_pick").innerHTML = '';
    document.getElementById('hotel_detail_table').innerHTML = '';
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'detail',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'external_code':id,
            'checkin_date': document.getElementById('checkin_date').value,
            'checkout_date': document.getElementById('checkout_date').value,
            'signature': '',
       },
       success: function(msg) {
        console.log(msg);
        //show package

        var result = msg.result.response;
        text='';
        var node = document.createElement("div");
        if(result.prices.length != 0){
            for(i in result.prices){
                text = '<div class="row" style="margin-bottom:15px;">';
                text += `
                <div class="col-lg-12" style="margin-bottom:25px;">
                    <div style="top:0px; right:10px; position:absolute;">
                        <label class="check_box_custom">
                            <span class="span-search-ticket"></span>
                            <input type="checkbox" id="copy_hotel"/>
                            <span class="check_box_span_custom"></span>
                        </label>
                    </div>
                </div>`;

                for(j in result.prices[i].rooms){
                    if(result.prices[i].rooms[j].images.length != 0){
                        text+=`
                        <div class="col-lg-3 col-md-3">
                            <div class="img-hotel-detail" style="background-image: url(`+result.prices[i].rooms[j].images[0].url+`);"></div>
                        </div>`;
                    }else{
                        text+=`
                        <div class="col-lg-3 col-md-3">
                            <div class="img-hotel-detail" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');"></div>
                        </div>`;
                    }
                    text+=`<div class="col-lg-6 col-md-6">`;
                    text+= '<h4 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title=' + result.prices[i].rooms[j].category + '>' + result.prices[i].rooms[j].category + '</h4><span>' + result.prices[i].rooms[j].description + '</span><br/><span>Qty: '+ result.prices[i].rooms[j].qty +'</span><br/>';
                    text+= '<span>Meal Type: ' + result.prices[i].meal_type+'</span><br/><br/>';

                    text+=`</div>`;
                }

                text+=`<div class="col-lg-3 col-md-3" style="text-align:right;">`;
                if(result.prices[i].currency != 'IDR')
                    text+= '<span style="font-weight: bold; font-size:16px;"> '+ result.prices[i].currency + ' ' + parseInt(result.prices[i].price_total) +'</span><br/>';
                else
                    text+= '<span style="font-weight: bold; font-size:16px;"> '+ result.prices[i].currency + ' ' + getrupiah(parseInt(result.prices[i].price_total))+'</span><br/>';

                text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick('+i+');" id="button'+i+'">Choose</button>';
                text+='</div></div>';
                node.className = 'detail-hotel-box';
                node.innerHTML = text;
                document.getElementById("detail_room_pick").appendChild(node);
                node = document.createElement("div");
                $('#loading-detail-hotel').hide();
            }
            hotel_price = result.prices;

            //            for(i in result.prices){
//                text+=`
//                <div class="row" style="margin-bottom:15px;">
//                    <div class="col-lg-12" style="margin-bottom:25px;">
//                        <div style="top:0px; right:10px; position:absolute;">
//                            <label class="check_box_custom">
//                                <span class="span-search-ticket"></span>
//                                <input type="checkbox" id="copy_hotel"/>
//                                <span class="check_box_span_custom"></span>
//                            </label>
//                        </div>
//                    </div>`;
//
//                for(j in msg.result.prices[i].rooms){
//                    if(msg.result.prices[i].rooms[j].images.length != 0){
//                        text+=`
//                        <div class="col-lg-3 col-md-3">
//                            <div class="img-hotel-detail" style="background-image: url(`+msg.result.prices[i].rooms[j].images[0].url+`);"></div>
//                        </div>`;
//                    }else{
//                        text+=`
//                        <div class="col-lg-3 col-md-3">
//                            <div class="img-hotel-detail" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');"></div>
//                        </div>`;
//                    }
//
//                    text+='<div class="col-lg-5 col-md-5"> <div style="margin-bottom:10px;"> <h4 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' +msg.result.prices[i].rooms[j].description+ '</h4></div>';
//                    text+='<span>' + msg.result.prices[i].rooms[j].category + '<br/> Total: '+ msg.result.prices[i].rooms[j].qty + ' room(s)</span><br/>';
//                }
//
//                text += '<span>Meal Type: ' + msg.result.prices[i].meal_type+'</span><br/>';
//                text+=`</div>`;
//
//                text+=`
//                <div class="col-lg-4 col-md-4" style="text-align:right;">`;
//                if(msg.result.prices[i].currency != 'IDR')
//                    text+= '<span style="font-weight: bold; font-size:16px;">'+ msg.result.prices[i].currency + ' ' + msg.result.prices[i].price_total +'</span>';
//                else
//                    text+= '<span style="font-weight: bold; font-size:16px;">'+ msg.result.prices[i].currency + ' ' + getrupiah(msg.result.prices[i].price_total) + '</span>';
//
//                text+='<br/><button class="primary-btn-custom" type="button" onclick="hotel_room_pick('+msg.result.prices[i].sequence+');" id="button'+msg.result.prices[i].sequence+'">Choose</button>';
//                text+=`</div></div>`;
//
//            }
//            hotel_price = msg.result.prices;

        }else{
            alert("There's no room in this hotel!");
            $('#loading-detail-hotel').hide();
//            window.location.href = "http://localhost:8000";
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
    },500);
}

function hotel_get_cancellation_policy(price_code, provider){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_cancellation_policy',
       },
       data: {
          "price_code": price_code,
          "provider": provider
       },
       success: function(msg) {
            // hotel_provision(price_code, provider);
            console.log(msg);
            var result = msg.result.response;
            var text = '<h4>Cancellation Policy</h4>';
            text += '<b>' + result.hotel_name + '</b><hr/>';
            //text += '<ul style="list-style-type: circle;">';
            text += '<ul>';
            if(result.policies){
                if(result.policies.length != 0){
                    for(i in result.policies){
                        text += '<li>Cancel Days Before Check in: ' + result.policies[i].max_cancel_days;
                        text += ' will be Refunded: ' + result.policies[i].charge_rate + '</li>'
                    }
                } else {
                    text += '<li>No Cancellation Policy Provided</li>';
                };
            } else {
                text += '<li>No Cancellation Policy Provided</li>';
            };
            text += '</ul>';
            //console.log(text);
            document.getElementById('cancellation_policy').innerHTML = text;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           text += '<ul>';
           text += '<li>No Cancellation Policy Provided</li></ul>';
           document.getElementById('cancellation_policy').innerHTML = text;
       }
    });
}

function hotel_provision(price_code, provider){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'provision',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
          "price_code": price_code,
          "provider": provider
       },
       success: function(msg) {
            console.log(msg);

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           //alert(errorThrown);
       }
    });
}

function gotoForm(){
    document.getElementById('hotel_searchForm').submit();
}

function hotel_issued_alert(){
    Swal.fire({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').addClass("running");
        $('.next-loading-issued').prop('disabled', true);
        hotel_issued_booking();
      }
    })
}

function hotel_issued_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'issued',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'special_request': document.getElementById('special_request').value,
       },
       success: function(msg) {
            console.log('Result');
            console.log(msg);
            var form = document.getElementById('hotel_booking');
            var input = document.createElement('input');//prepare a new input DOM element
            input.setAttribute('name', 'result');//set the param name
            input.setAttribute('value', JSON.stringify(msg) );//set the value
            input.setAttribute('type', 'hidden')//set the type
            form.appendChild(input);
            form.submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}