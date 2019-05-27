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

        var node = document.createElement("div");
        if(msg.result.prices.length != 0){
            for(i in msg.result.prices){
                text = '<label>Meal Type' + msg.result.prices[i].meal_type+'</label><br/>';
                if(msg.result.prices[i].currency != 'IDR')
                    text+= '<label>Price '+ msg.result.prices[i].currency + ' ' + msg.result.prices[i].price_total +'</label><br/>';
                else
                    text+= '<label>Price '+ msg.result.prices[i].currency + ' ' + getrupiah(msg.result.prices[i].price_total+'</label><br/>');
                for(j in msg.result.prices[i].rooms){
                    text+= '<label>' + msg.result.prices[i].rooms[j].description + '(' + msg.result.prices[i].rooms[j].category + ')\n Qty: '+ msg.result.prices[i].rooms[j].qty +'</label><br/>';
                    if(msg.result.prices[i].rooms[j].images.length != 0){
                        text+=`<img data-toggle="tooltip" class="airline-logo" style="width:50px;height:50px;" src="`+msg.result.prices[i].rooms[j].images[0].url+`"><span> </span>`;
                    }else{
                        text+=`<img data-toggle="tooltip" class="airline-logo" style="width:50px;height:50px;" src="/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg"><span> </span>`;
                    }
                    for(k in msg.result.prices[i].rooms[j].nightly_prices){
                        date = new Date(msg.result.prices[i].rooms[j].nightly_prices[k].date).toString().split(' ');
                        text+= date[2] +' '+ date[1] + ' ' + date[3];
                        if(msg.result.prices[i].rooms[j].nightly_prices[k].currency=='IDR')
                            text+= '<label>Price: '+ msg.result.prices[i].rooms[j].nightly_prices[k].currency + '\n' + getrupiah(msg.result.prices[i].rooms[j].nightly_prices[k].price) + '</label><br/>';
                        else
                            text+= '<label>Price: '+ msg.result.prices[i].rooms[j].nightly_prices[k].currency + '\n' + msg.result.prices[i].rooms[j].nightly_prices[k].price + '</label>';
                    }
                }
                text+='<button type="button" onclick="hotel_room_pick('+msg.result.prices[i].sequence+');" id="button'+msg.result.prices[i].sequence+'">Choose</button>';
                node.innerHTML = text;
                document.getElementById("detail_room_pick").appendChild(node);
                node = document.createElement("div");
            }
            hotel_price = msg.result.prices;
        }else{
            alert("There's no room in this hotel!");
            window.location.href = "http://localhost:8000";
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