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
               console.log(child_age);
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
            'check_in': document.getElementById('hotel_checkin').value,
            'check_out': document.getElementById('hotel_checkout').value
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
                            <div class="img-hotel-detail" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');"></div>
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
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
          "price_code": price_code,
          "provider": provider
       },
       success: function(msg) {
        hotel_provision(price_code, provider);
//        if(msg.result.error_code == 0){
//
////            document.getElementById('train_booking').submit();
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

function hotel_issued_booking(){
    console.log()
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
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