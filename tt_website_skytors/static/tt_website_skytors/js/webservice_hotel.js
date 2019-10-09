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
    var priority = [];

    getToken();
    hotelAutoCompleteVar = setTimeout(function() {
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
            hotel_choices = msg;
            suggest(hotel_choices);
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
                           $('#loading-search-hotel').hide();
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
          $("#loading-search-hotel").hide();
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
          })
       },timeout: 120000
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

function hotel_detail_request(id){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
    document.getElementById("detail_room_pick").innerHTML = '';
    document.getElementById('hotel_detail_table').innerHTML = '';
    document.getElementById("select_copy_all").innerHTML = '';
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
            'checkin_date': document.getElementById('hotel_checkin_checkout').value.split(' - ')[0],
            'checkout_date': document.getElementById('hotel_checkin_checkout').value.split(' - ')[1],
            'signature': '',
       },
       success: function(msg) {
        $('#loading-detail-hotel').hide();
        console.log(msg);
        //show package

        var result = msg.result.response;
        text='';
        text2='';
        var node = document.createElement("div");
        var node2 = document.createElement("div");
        if(typeof result.prices === "undefined"){
            alert("There's no room in this hotel!");
            $('#loading-detail-hotel').hide();
            $('#detail_room_pick').html('<div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert"><span style="font-weight:bold;"> Sorry, We can find any room for this criteria. Please try another day or another hotel</span></div>');
            // window.location.href = "http://localhost:8000";
        }else if(result.prices.length == 0){
            alert("There's no room in this hotel!");
            $('#loading-detail-hotel').hide();
            $('#detail_room_pick').html('<div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert"><span style="font-weight:bold;"> Sorry, We can find any room for this criteria. Please try another day or another hotel</span></div>');
        }else{
            text2+=`
            <div class="row">
                <div class="col-lg-6">
                    <span style="font-size:14px; font-weight:bold;">Room - `+result.prices.length+` results</h6>
                </div>
                <div class="col-lg-6">
                    <label class="check_box_custom" style="float:right;">
                        <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                        <input type="checkbox" id="check_all_copy" onchange="check_all_result_room();"/>
                        <span class="check_box_span_custom"></span>
                    </label>
                </div>
            </div>`;

            node2.innerHTML = text2;
            document.getElementById("select_copy_all").appendChild(node2);
            node2 = document.createElement("div");

            for(i in result.prices){
                text = '<div class="row" style="margin-bottom:15px;">';
                text+=`
                <div class="col-lg-12" style="margin-bottom:25px;">
                    <div style="top:0px; right:10px; position:absolute;">
                        <label class="check_box_custom">
                            <span class="span-search-ticket"></span>
                            <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyRoom();"/>
                            <span class="check_box_span_custom"></span>
                        </label>
                        <span class="id_copy_result" hidden>`+i+`</span>
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
                    text+= '<h4 class="name_room" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title=' + result.prices[i].rooms[j].category + '>' + result.prices[i].rooms[j].category + '</h4><span>' + result.prices[i].rooms[j].description + '</span><br/><span class="qty_room">Qty: '+ result.prices[i].rooms[j].qty +'</span><br/>';
                    text+= '<span class="meal_room">Meal Type: ' + result.prices[i].meal_type+'</span><br/><br/>';

                    text+=`</div>`;
                }

                text+=`<div class="col-lg-3 col-md-3" style="text-align:right;">`;
                if(result.prices[i].currency != 'IDR')
                    text+= '<span class="price_room" style="font-weight: bold; font-size:16px;"> '+ result.prices[i].currency + ' ' + parseInt(result.prices[i].price_total) +'</span><br/>';
                else
                    text+= '<span class="price_room" style="font-weight: bold; font-size:16px;"> '+ result.prices[i].currency + ' ' + getrupiah(parseInt(result.prices[i].price_total))+'</span><br/>';

                text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick('+i+');" id="button'+i+'">Choose</button>';
                text+='</div></div>';
                node.className = 'detail-hotel-box';
                node.innerHTML = text;
                document.getElementById("detail_room_pick").appendChild(node);
                node = document.createElement("div");
            }
            $('#loading-detail-hotel').hide();
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
            text += '<ul style="list-style-type: circle; margin: 0 15px;">';
            if(result.policies.length != 0){
                for(i in result.policies){
                    if (result.policies[i].received_amount != 0){
                        text += '<li>Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>'
                    } else {
                        text += '<li>No Cancellation after: ' + result.policies[i].date;
                    }
                }
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

function checkboxCopyRoom(){
    var count_copy = $(".copy_result:checked").length;
    document.getElementById("badge-copy-notif").innerHTML = count_copy;
    document.getElementById("badge-copy-notif2").innerHTML = count_copy;
}

function check_all_result_room(){
   var selectAllCheckbox=document.getElementById("check_all_copy");
   if(selectAllCheckbox.checked==true){
        var checkboxes = document.getElementsByClassName("copy_result");
        for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = true;
        $('#choose-hotel-copy').hide();
    }
   }else {
    var checkboxes = document.getElementsByClassName("copy_result");
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = false;
        $('#choose-hotel-copy').show();
    }
   }
   checkboxCopyRoom();
}

function get_checked_copy_result_room(){
    document.getElementById("show-list-copy-hotel").innerHTML = '';
    text='';
    $text='';
    var room_number = 0;
    var name_hotel = $(".name_hotel").html();
    var rating_hotel = $(".rating_hotel").html();
    var address_hotel = $('.address_hotel').html();
    $text += ''+name_hotel+'\n';
    $text += 'Rating: '+rating_hotel+'\n';
    $text += 'Address: '+address_hotel+'\n \n';

    node = document.createElement("div");
    text+=`
    <div class="col-lg-12" id="information_hotel">
        <h6>`+name_hotel+`</h6>
        <span>Rating: `+rating_hotel+`</span><br/>
        <span>Address: `+address_hotel+`</span><br/><br/>
        <h6>Room List:</h6><hr/>
    </div>
    <div class="col-lg-12" style="min-height=200px; max-height:500px; overflow-y: scroll;">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_room = $(this).parent().parent().parent().parent();
        var name_room = parent_room.find('.name_room').html();
        var desc_room = parent_room.find('.desc_room').html();
        var qty_room = parent_room.find('.qty_room').html();
        var meal_room = parent_room.find('.meal_room').html();
        var price_room = parent_room.find('.price_room').html();
        var id_room = parent_room.find('.id_copy_result').html();
        room_number = room_number + 1;
        $text += room_number+'. '+name_room+ ' ' + desc_room+'\n';
        $text += qty_room+'\n';
        $text += ''+meal_room+'\n';
        $text += 'Price: '+price_room+'\n \n';
        text+=`
            <div class="row" id="div_list`+id_room+`">
                <div class="col-lg-8">
                    <h6>`+name_room+` </h6>
                    <span>Qty: `+qty_room+`</span><br/>
                    <span>`+meal_room+`</span><br/>
                    <span style="font-weight:500;">Price: `+price_room+`</span>
                </div>
                <div class="col-lg-4" style="text-align:right;">
                    <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result_room(`+id_room+`);">Delete <i class="fas fa-times-circle" style="color:red; font-size:18px;"></i></span>
                </div>
                <div class="col-lg-12"><hr/></div>
            </div>`;
        });
    text+=`</div>
    <div class="col-lg-12" style="margin-bottom:15px; margin-top:15px;" id="share_result">
        <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
        share_data_room();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>`;
            if(room_number < 11){
                text+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
        } else {
            text+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>`;
            if(room_number < 11){
                text+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
        }
        if(room_number > 10){
            text+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Room</span>`;
        }
    text+=`
    </div>
    <div class="col-lg-12" id="copy_result">
        <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data_room();" value="Copy">
    </div>`;
    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-hotel").appendChild(node);

    if(room_number > 10){
        document.getElementById("mobile_line").style.display = "none";
        document.getElementById("mobile_telegram").style.cursor = "not-allowed";
        document.getElementById("pc_line").style.display = "not-allowe";
        document.getElementById("pc_telegram").style.cursor = "not-allowed";
    }

    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-hotel-copy').show();
        $("#information_hotel").remove();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-hotel-copy').hide();
    }
}

function delete_checked_copy_result_room(id){
    $("#div_list"+id).remove();
    $("#copy_result"+id).prop("checked", false);

    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-hotel-copy').show();
        $("#information_hotel").remove();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-hotel-copy').hide();
        get_checked_copy_result_room();
        share_data_room();
    }
    checkboxCopyRoom();
}

function copy_data_room(){
    get_checked_copy_result_room();
    document.getElementById('data_copy').innerHTML = $text;
    document.getElementById('data_copy').hidden = false;
    var el = document.getElementById('data_copy');
    el.select();
    document.execCommand('copy');
    document.getElementById('data_copy').hidden = true;

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    })

    Toast.fire({
      type: 'success',
      title: 'Copied Successfully'
    })
}

function share_data_room(){
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}
