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
high_price_slider = 0;
low_price_slider = 99999999;
step_slider = 0;

function get_hotel_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_data',
       },
       data: {},
       success: function(msg) {
        console.log(msg);
        hotel_config = msg
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel config </span>' + errorThrown,
            })
       },timeout: 180000
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
           data: {
                'name':term
           },
           success: function(msg) {
            hotel_choices = msg;
            suggest(hotel_choices);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error hotel auto complete </span>' + errorThrown,
                })
           },timeout: 60000
        });
    }, 150);
}

function hotel_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
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
                $('#loading-search-hotel').hide();
               }catch(err){}
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel signin </span>' + errorThrown,
            })
          try{
            $('#loading-search-hotel').hide();
          }catch(err){}
       },timeout: 120000
    });
}

//signin jadi 1 sama search
function hotel_search(){
    getToken();
    //document.getElementById('hotel_ticket').innerHTML = ``;
    child_age = '';
    for(i=0; i<parseInt($('#hotel_child').val());i++){
       child_age+=parseInt($('#hotel_child_age'+(i+1).toString()).val());
       if(i != parseInt($('#hotel_child').val())-1)
           child_age+=',';
    }
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
//                                        if(vendor.length != 0){
//                                            for(j in msg.result.response.hotel_ids[i].prices){
//                                                if(vendor.indexOf(j) == -1){
//                                                    vendor.push(j);
//                                                }else{
//                                                    check = 1;
//                                                }
//                                            }
//                                        }
//                                        if(check == 0){
//                                            for(j in msg.result.response.hotel_ids[i].prices){
//                                                if(vendor.indexOf(j) == -1){
//                                                    vendor.push(j);
//                                                }
//                                            }
//                                        }
                       for(j in msg.result.response.hotel_ids[i].prices){
                           if(high_price_slider < msg.result.response.hotel_ids[i].prices[j].price){
                               high_price_slider = msg.result.response.hotel_ids[i].prices[j].price;
                           }
                           if(low_price_slider > msg.result.response.hotel_ids[i].prices[j].price){
                               low_price_slider = msg.result.response.hotel_ids[i].prices[j].price;
                           }
                       }
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
                    document.getElementById("price-from").value = low_price_slider;
                    document.getElementById("price-to").value = high_price_slider;
                    document.getElementById("price-from2").value = low_price_slider;
                    document.getElementById("price-to2").value = high_price_slider;

                    $(".js-range-slider").data("ionRangeSlider").update({
                         from: low_price_slider,
                         to: high_price_slider,
                         min: low_price_slider,
                         max: high_price_slider,
                         step: step_slider
                    });
                    $(".js-range-slider2").data("ionRangeSlider").update({
                         from: low_price_slider,
                         to: high_price_slider,
                         min: low_price_slider,
                         max: high_price_slider,
                         step: step_slider
                    });
                    filtering('filter', 0);
                }else{
                    //kalau error belum
                }
           }catch(err){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error hotel search </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel search </span>' + errorThrown,
            })
       },timeout: 180000
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
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        hotel_search();
        top_facility = msg.result.response;
        if (top_facility){
            facility_filter_html = `<hr><h6 class="filter_general" onclick="show_hide_general('hotelFacilities');">Facilities <i class="fas fa-chevron-down" id="hotelFacilities_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="hotelFacilities_generalUp" style="float:right; display:block;"></i></h6>
            <div id="hotelFacilities_generalShow" style="display:inline-block;">`;
            for(i in top_facility){
                facility_filter_html += `
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:black;">`+top_facility[i].facility_name+`</span>
                    <input type="checkbox" id="fac_filter`+i+`" onclick="change_filter('facility',`+i+`);">
                    <span class="check_box_span_custom"></span>
                </label><br/>`;
            }
            facility_filter_html+=`</div>`;
            var node = document.createElement("div");
            node.innerHTML = facility_filter_html;
            document.getElementById("filter").appendChild(node);

            facility_filter_html = `<hr><h6 style="padding-bottom:10px;">Facilities</h6>`;
            for(i in top_facility){
                facility_filter_html += `
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:black;">`+top_facility[i].facility_name+`</span>
                    <input type="checkbox" id="fac_filter2`+i+`" onclick="change_filter('facility',`+i+`);">
                    <span class="check_box_span_custom"></span>
                </label><br/>`;
            }
            var node = document.createElement("div");
            node.innerHTML = facility_filter_html;
            document.getElementById("filter2").appendChild(node);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel top facility </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function hotel_facility_request(hotel_facilities){
    getToken();
    $.ajax({
        type: "POST",
        url: "/webservice/hotel",
        headers:{
            'action': 'get_facility_img',
        },
        data: {
            'signature': signature
        },
        success: function(msg) {
            //console.log('start');
            facility_image = msg.result.response;
            facility_image_html = '';
            //console.log(hotel_facilities);
            //console.log(facility_image);
            hotel_facilities = $.parseJSON(hotel_facilities);
            //console.log(hotel_facilities);

            for (rec in hotel_facilities){
                var new_html = '';
                for(i in facility_image){
                    if (facility_image[i].facility_name == hotel_facilities[rec].facility_name){
                        //console.log(facility_image[i].facility_name+ ' Similar Name');
                        new_html = `
                        <div class="col-md-3 col-xs-4" style="width:25%; padding-bottom:15px;">
                            <i class="fas fa-circle" style="font-size:9px;"></i>
                            <span style="font-weight:500;"> `+ hotel_facilities[rec].facility_name +`</span>
                        </div>`;
                        //console.log(facility_image[i].facility_image);
                        break;
                    }
                    if (facility_image[i].internal_code == hotel_facilities[rec].facility_id){
                        //console.log(facility_image[i].facility_name+ ' Similar Code');
                        new_html = `
                        <div class="col-md-3 col-sm-4 col-xs-6" style="width:25%; padding-bottom:15px;">
                            <i class="fas fa-circle" style="font-size:9px;"></i>
                            <span style="font-weight:500;"> `+ hotel_facilities[rec].facility_name +`</span>
                        </div>`;
                        //console.log(facility_image[i].facility_image);
                        break;
                    }
                }
                if (new_html === '' || facility_image[i].facility_image == false){
                    new_html = `
                    <div class="col-md-3 col-sm-4 col-xs-6" style="width:25%; padding-bottom:15px;">
                        <i class="fas fa-circle" style="font-size:9px;"></i>
                        <span style="font-weight:500;"> `+ hotel_facilities[rec].facility_name +`</span>
                    </div>`;
                }
                facility_image_html += new_html;
            }
            document.getElementById("js_image_facility").innerHTML = facility_image_html;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel facility request </span>' + errorThrown,
            })
        },timeout: 60000
    });
}

function hotel_detail_request(id){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
    // Remove Copy dan Next button waktu ganti tanggal START
    document.getElementById("hotel_detail_button").innerHTML = '';
    // Remove Copy dan Next button waktu ganti tanggal END
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
            //alert("There's no room in this hotel!");
            $('#loading-detail-hotel').hide();
            $('#detail_room_pick').html('<div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert"><span style="font-weight:bold;"> Sorry, We can`t find any room for this criteria. Please try another day or another hotel</span></div>');
            // window.location.href = "http://localhost:8000";
        }else if(result.prices.length == 0){
            //alert("There's no room in this hotel!");
            $('#loading-detail-hotel').hide();
            $('#detail_room_pick').html('<div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert"><span style="font-weight:bold;"> Sorry, We can`t find any room for this criteria. Please try another day or another hotel</span></div>');
        }else{
            text2+=`
            <div class="row">
                <div class="col-lg-6">
                    <span style="font-size:14px; font-weight:bold;">Room - `+result.prices.length+` results</h6>
                </div>
                <div class="col-lg-6">
                    <label class="check_box_custom" style="float:right; margin-bottom:unset;">
                        <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                        <input type="checkbox" id="check_all_copy" onchange="check_all_result_room();"/>
                        <span class="check_box_span_custom"></span>
                    </label>
                </div>
            </div>`;
            node2.className = 'sorting-box';
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
                            <div class="img-hotel-detail" style="background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');"></div>
                        </div>`;
                    }
                    text+=`<div class="col-lg-6 col-md-6">`;
                    //<span>' + result.prices[i].rooms[j].category + '</span><br/>
                    text+= '<h5 class="name_room" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title=' + result.prices[i].rooms[j].description + '>' + result.prices[i].rooms[j].description + '</h5><span class="qty_room">'+ result.prices[i].rooms[j].qty +' Room(s)</span><br/>';
                    text+= '<span class="meal_room">Meal Type: ' + result.prices[i].meal_type+'</span><br/>';
                    text+= '<span style="font-weight:500; padding-top:10px;">Cancellation: </span><ul><li id="js_cancellation_button'+i+'" style="color:#f15a22; font-weight:400;"><span style="color:#f15a22; font-weight:500; cursor:pointer;" onclick="hotel_cancellation_button('+i+','+ result.prices[i].price_code +');"><i class="fas fa-question-circle"></i> Show Cancellation Policy</span></li></ul>';
                    text+=`</div>`;
                }

                text+=`<div class="col-lg-3 col-md-3" style="text-align:right;">`;
                var total_room = document.getElementById("hotel_room").value;
                var total_night = document.getElementById("total_night_search").textContent;

                if(result.prices[i].currency != 'IDR')
                    text+= '<span class="price_room" style="font-weight: bold; font-size:14px;"> '+ result.prices[i].currency + ' ' + parseInt(result.prices[i].price_total) +'</span><br/><span class="copy_total_rn" style="font-size:13px; font-weight:500; color:#f15a22;">(for '+total_room+' room, '+total_night+' night)</span><br/>';
                else
                    text+= '<span class="price_room" style="font-weight: bold; font-size:14px;"> '+ result.prices[i].currency + ' ' + getrupiah(parseInt(result.prices[i].price_total))+'</span><br/><span class="copy_total_rn" style="font-size:13px; font-weight:500; color:#f15a22;">(for '+total_room+' room, '+total_night+' night)</span><br/>';

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
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel detail request </span>' + errorThrown,
            })
       },timeout: 60000
    });
    },500);
}

function hotel_get_cancellation_policy(price_code, provider, view_type){
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
            if (view_type == '0'){
                // each Room Picking
                text = '<ul style="list-style-type: disc; margin: 0 15px;">';
                //$text2 += 'Cancellation Policy: \n';
                if(result.policies.length != 0){
                    for(i in result.policies){
                        if (result.policies[i].received_amount != 0){
                            text += '<li>Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>';
                            //$text2 += 'Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '\n';
                        } else {
                            text += '<li>No Cancellation after: ' + result.policies[i].date;
                            //$text2 += 'No Cancellation after: ' + result.policies[i].date + '\n';
                        }
                    }
                } else {
                    text += '<li>No Cancellation Policy Provided</li>';
                    //$text2 += 'No Cancellation Policy Provided \n';
                }
                text += '</ul>';
                document.getElementById('cancellation_policy_choose').innerHTML = text;
                hotel_room_pick_button();
            } else if (view_type == '1'){
                // Passenger Page
                var text = '<h4>Cancellation Policy</h4>';
                text += '<b id="js_hotel_name">' + result.hotel_name + '</b><hr/>';
                text += '<ul style="list-style-type: disc; margin: 0 15px;">';
                //$text2 += '\n Cancellation Policy: \n';
                if(result.policies.length != 0){
                    for(i in result.policies){
                        if (result.policies[i].received_amount != 0){
                            text += '<li style="color:#f15a22;">Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>'
                            $text2 += 'Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '\n'
                        } else {
                            text += '<li style="color:#f15a22;">No Cancellation after: ' + result.policies[i].date;
                            //$text2 += 'No Cancellation after: ' + result.policies[i].date+ '\n';
                        }
                    }
                } else {
                    text += '<li style="color:#f15a22;">No Cancellation Policy Provided</li>';
                    //$text2 += 'No Cancellation Policy Provided \n';
                };
                text += '</ul>';
                //console.log(text);
                document.getElementById('cancellation_policy').innerHTML = text;
            } else {
                text = '<ul style="list-style-type: disc; margin: 0 15px;">';
                if(result.policies.length != 0){
                    for(i in result.policies){
                        if (result.policies[i].received_amount != 0){
                            text += '<li style="color:#f15a22;">Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>'
                        } else {
                            text += '<li style="color:#f15a22;">No Cancellation after: ' + result.policies[i].date;
                        }
                    }
                } else {
                    text += '<li style="color:#f15a22;">No Cancellation Policy Provided</li>';
                };
                text += '</ul>';
                document.getElementById('js_cancellation_button'+provider).parentNode.innerHTML = text;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           if (view_type == '1'){
                var text = '<h4>Cancellation Policy</h4>';
                text += '<ul style="list-style-type: circle; margin: 0 15px;"><li>No Cancellation Policy Provided</li></ul>';
                document.getElementById('cancellation_policy').innerHTML = text;
           } else {
                var text = '<ul style="list-style-type: circle; margin: 0 15px;">';
                text += '<li>No Cancellation Policy Provided</li></ul>';
                document.getElementById('js_cancellation_button'+provider).parentNode.innerHTML = text;
           }
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel cancellation policy </span>' + errorThrown,
            })
       },timeout: 60000
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
       data: {
          "price_code": price_code,
          "provider": provider
       },
       success: function(msg) {
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel provision </span>' + errorThrown,
            })
       },timeout: 60000
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
        $('.loader-rodextrip').fadeIn();
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
       data: {
            'seq_id': payment_acq2[payment_method][selected].seq_id,
            'member': payment_acq2[payment_method][selected].method,
            'voucher_code': voucher_code,
            'signature': signature
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel issued booking </span>' + errorThrown,
            })
       },timeout: 180000
    });
}

function hotel_get_booking(data){
    price_arr_repricing = {};
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
            console.log('Result');
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel get booking </span>' + errorThrown,
            })
       },timeout: 180000
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
    var datecico = $('#hotel_checkin_checkout').val();
    $text += ''+name_hotel+ ' *' +rating_hotel+ '\n';
    $text += 'Address: '+address_hotel+'\n';
    $text += 'Date: '+datecico+'\n \n';

    node = document.createElement("div");
    text+=`
    <div class="col-lg-12" id="information_hotel">
        <h6>`+name_hotel+` `+rating_hotel+ `</h6>
        <span>Address: `+address_hotel+`</span><br/>
        <span>Date: `+datecico+`</span><br/><br/>
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
        var total_room_night = parent_room.find('.copy_total_rn').html();
        var id_room = parent_room.find('.id_copy_result').html();
        room_number = room_number + 1;
        $text += room_number+'. '+name_room+ ' ' + desc_room+'\n';
        $text += qty_room+'\n';
        $text += ''+meal_room+'\n';
        $text += 'Price: '+price_room+' ';
        $text += total_room_night+'\n \n';
        text+=`
            <div class="row" id="div_list`+id_room+`">
                <div class="col-lg-8">
                    <h6>`+name_room+` </h6>
                    <span>`+qty_room+` Room</span><br/>
                    <span>`+meal_room+`</span><br/>
                    <span style="font-weight:500;">Price: `+price_room+`</span>
                    <span style="font-weight:500;">`+total_room_night+`</span>
                </div>
                <div class="col-lg-4" style="text-align:right;">
                    <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result_room(`+id_room+`);">Delete <i class="fas fa-times-circle" style="color:red; font-size:18px;"></i></span>
                </div>
                <div class="col-lg-12"><hr/></div>
            </div>`;
        });
    $text += '\n===Price may change at any time===';
    text+=`</div>
    <div class="col-lg-12" style="margin-bottom:15px; margin-top:15px;" id="share_result">
        <span style="font-size:14px; font-weight:bold;">Share this on:</span><br/>`;
        share_data_room();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(room_number < 11){
                text+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        } else {
            text+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(room_number < 11){
                text+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
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
