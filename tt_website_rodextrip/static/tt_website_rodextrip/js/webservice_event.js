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

function get_event_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
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

function event_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               signature = msg.result.response.signature;
               if(data == ''){
                    get_top_facility();

               }else if(data != ''){
                    hotel_get_booking(data);
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $('#loading-search-event').hide();
               }catch(err){}
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error Event signin </span>' + errorThrown,
                })
              try{
                $('#loading-search-event').hide();
              }catch(err){}
            }
       },timeout: 120000
    });
}
//signin jadi 1 sama search
function event_search(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'signin',
       },
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
                   get_top_facility();
                   $.ajax({
                       type: "POST",
                       url: "/webservice/event",
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

function event_detail(id){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
    document.getElementById("detail_room_pick").innerHTML = '';
    document.getElementById('hotel_detail_table').innerHTML = '';
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'detail',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'external_code':id,
            'checkin_date': document.getElementById('checkin_date').value,
            'checkout_date': document.getElementById('checkout_date').value
       },
       success: function(msg) {
        console.log(msg);
        //show package

        text='';
        var node = document.createElement("div");
        if(msg.result.prices.length != 0){
            for(i in msg.result.prices){
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

                for(j in msg.result.prices[i].rooms){
                    if(msg.result.prices[i].rooms[j].images.length != 0){
                        text+=`
                        <div class="col-lg-3 col-md-3">
                            <div class="img-hotel-detail" style="background-image: url(`+msg.result.prices[i].rooms[j].images[0].url+`);"></div>
                        </div>`;
                    }else{
                        text+=`
                        <div class="col-lg-3 col-md-3">
                            <div class="img-hotel-detail" style="background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');"></div>
                        </div>`;
                    }
                    text+=`<div class="col-lg-6 col-md-6">`;
                    text+= '<h4 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title=' + msg.result.prices[i].rooms[j].category + '>' + msg.result.prices[i].rooms[j].category + '</h4><span>' + msg.result.prices[i].rooms[j].description + '</span><br/><span>Qty: '+ msg.result.prices[i].rooms[j].qty +'</span><br/>';
                    text+= '<span>Meal Type: ' + msg.result.prices[i].meal_type+'</span><br/><br/>';

                    text+=`</div>`;
                }

                text+=`<div class="col-lg-3 col-md-3" style="text-align:right;">`;
                if(msg.result.prices[i].currency != 'IDR')
                    text+= '<span style="font-weight: bold; font-size:16px;"> '+ msg.result.prices[i].currency + ' ' + parseInt(msg.result.prices[i].price_total) +'</span><br/>';
                else
                    text+= '<span style="font-weight: bold; font-size:16px;"> '+ msg.result.prices[i].currency + ' ' + getrupiah(parseInt(msg.result.prices[i].price_total))+'</span><br/>';

                text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick('+msg.result.prices[i].sequence+');" id="button'+msg.result.prices[i].sequence+'">Choose</button>';
                text+='</div></div>';
                node.className = 'detail-hotel-box';
                node.innerHTML = text;
                document.getElementById("detail_room_pick").appendChild(node);
                node = document.createElement("div");
                $('#loading-detail-hotel').hide();
            }
            hotel_price = msg.result.prices;

            //            for(i in msg.result.prices){
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
//                            <div class="img-hotel-detail" style="background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');"></div>
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

function event_booking(price_code, provider){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'provision',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
          "price_code": price_code,
          "provider": provider
       },
       success: function(msg) {
//        if(msg.result.error_code == 0){
//            document.getElementById('train_booking').submit();
////            gotoForm();
//        }else{
//            alert(msg.result.error_msg);
//        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function event_issued_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'create_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
        'special_request': document.getElementById('special_request').value,
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
//            document.getElementById('train_booking').submit();
//            gotoForm();
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function gotoForm(){
    document.getElementById('hotel_searchForm').submit();
}