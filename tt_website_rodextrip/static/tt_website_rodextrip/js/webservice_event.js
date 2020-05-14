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
               document.getElementById('event_ticket_objs').innerHTML = '';
               if(msg.result.error_code == 0){
                   $.ajax({
                       type: "POST",
                       url: "/webservice/event",
                       headers:{
                            'action': 'search',
                       },
                       data: {
                        'event_name': $('#event_name').val(),
                        'is_online': '1',
                       },
                       success: function(msg) {
                           console.log('Result');
                           console.log(msg);
                           try{
                                if(msg.result.error_code==0){
                                    sort(msg.result.response,1);
                                }else{
                                    //kalau error belum
                                    console.log('Error #1');
                                }
                           }catch(err){
                                console.log('Error #2');
                                alert(msg.result.error_msg);
                           }
                       },
                       error: function(XMLHttpRequest, textStatus, errorThrown) {
                           console.log(textStatus);
                           alert(errorThrown);
                       }
                   });
               }else{
                    console.log('Error Code != 0');
                    console.log(msg.result.error_code);
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

function event_options(id){
    //clearTimeout(myVar);
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
       data: {
            'external_code':id,
       },
       success: function(msg) {
        console.log(msg);
        //show package

        text='';
        var node = document.createElement("div");
        if(msg.result.response.length != 0){
            for(i in msg.result.response){
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
                console.log(msg.result);
                if(msg.result.response[i].images.length != 0)
                    text+=`<div class="col-lg-3 col-md-3"><div class="img-hotel-detail" style="background-image: url(`+msg.result.response[i].images[0].url+`);"></div></div>`;
                else
                    text+=`<div class="col-lg-3 col-md-3"><div class="img-hotel-detail" style="background-image: #;"></div></div>`;

                    text+=`<div class="col-lg-3 col-md-3" style="text-align:right;">`;
                    text+= '<span style="font-weight: bold; font-size:16px;"> '+ msg.result.response[i].grade + '</span><br/>';
                    if(msg.result.response[i].currency != 'IDR')
                        text+= '<span style="font-weight: bold; font-size:16px;"> '+ msg.result.response[i].currency + ' ' + parseInt(msg.result.response[i].price) +'</span><br/>';
                    else
                        text+= '<span style="font-weight: bold; font-size:16px;"> '+ msg.result.response[i].currency + ' ' + getrupiah(parseInt(msg.result.response[i].price))+'</span><br/>';

                    text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick(`'+msg.result.response[i].option_id+'`);" id="button'+msg.result.response[i].option_id+'">Choose</button>';
                    text+='</div></div>';
                    node.className = 'detail-hotel-box';
                    node.innerHTML = text;
                    document.getElementById("detail_room_pick").appendChild(node);
                    node = document.createElement("div");
                    $('#loading-detail-event').hide();
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

function event_get_extra_question(option_code, provider){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'extra_question',
       },
       data: {
          "event_code": option_code,
          "price_code": option_code,
          "provider": provider
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            text='';
            var node = document.createElement("div");
            for(i in msg.result.response){
                text += '<h3>Question #' + i+1 + '</h3>';
                text += '<i>' + msg.result.response[i].question + '</i>';
                text += '<input id="que_' + i +'" name="que_' + i +'" type="text" value="' + msg.result.response[i].question + '" hidden/>';
                text += '<input id="question_event_' + i +'" name="question_event_' + i +'" type="text" placeholder="' + msg.result.response[i].type + '"';
                if (msg.result.response[i].required)
                    text += 'required';
                text += '/>';
            }
            node.innerHTML = text;
            document.getElementById("extra_data_master").appendChild(node);
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function event_issued_alert(val){
    if(val == 1)
        text = "Are you sure you want to Force Issued this booking?";
    else
        text = "Are you sure you want to Hold Booking this booking?";
    Swal.fire({
      title: text,
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
            $('.loader-rodextrip').fadeIn();
            document.getElementById("passengers").value = JSON.stringify({'booker':booker});
            document.getElementById("signature").value = signature;
            document.getElementById("provider").value = 'hotel';
            document.getElementById("type").value = 'hotel_review';
            document.getElementById("voucher_code").value = voucher_code;
            document.getElementById("discount").value = JSON.stringify(discount_voucher);
            document.getElementById("session_time_input").value = time_limit;
            if(val == 1)
                document.getElementById('event_issued').submit();
            else
                event_create_booking();
    }
    })
}

function event_create_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'create_booking',
       },
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