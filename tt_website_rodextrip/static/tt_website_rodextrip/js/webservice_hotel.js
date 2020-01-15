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
            if(document.getElementById('hotel_id_destination').value.split(' - ').length < 2){
                hotel_choices = msg;
                suggest(hotel_choices);
            }
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
        //TODO: Check Error Code 4003
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
                    text+= '<span style="font-weight:500; padding-top:10px;">Cancellation: </span><ul><li id="js_cancellation_button'+i+'" style="color:'+color+'; font-weight:400;"><span class="carrier_code_template" onclick="hotel_cancellation_button('+i+','+ result.prices[i].price_code +');"><i class="fas fa-question-circle"></i> Show Cancellation Policy</span></li></ul>';
                    text+=`</div>`;
                }

                text+=`<div class="col-lg-3 col-md-3" style="text-align:right;">`;
                var total_room = document.getElementById("hotel_room").value;
                var total_night = document.getElementById("total_night_search").textContent;

                if(result.prices[i].currency != 'IDR')
                    text+= '<span class="price_room" style="font-weight: bold; font-size:14px;"> '+ result.prices[i].currency + ' ' + parseInt(result.prices[i].price_total) +'</span><br/><span class="copy_total_rn carrier_code_template" >(for '+total_room+' room, '+total_night+' night)</span><br/>';
                else
                    text+= '<span class="price_room" style="font-weight: bold; font-size:14px;"> '+ result.prices[i].currency + ' ' + getrupiah(parseInt(result.prices[i].price_total))+'</span><br/><span class="copy_total_rn carrier_code_template">(for '+total_room+' room, '+total_night+' night)</span><br/>';

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
                            text += '<li style="list-style: unset;">Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>';
                            //$text2 += 'Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '\n';
                        } else {
                            text += '<li style="list-style: unset;">No Cancellation after: ' + result.policies[i].date;
                            //$text2 += 'No Cancellation after: ' + result.policies[i].date + '\n';
                        }
                    }
                } else {
                    text += '<li style="list-style: unset;">No Cancellation Policy Provided</li>';
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
                            text += '<li style="color:'+color+'; list-style: unset;">Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>'
                            $text2 += 'Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '\n'
                        } else {
                            text += '<li style="color:'+color+'; list-style: unset;">No Cancellation after: ' + result.policies[i].date;
                            //$text2 += 'No Cancellation after: ' + result.policies[i].date+ '\n';
                        }
                    }
                } else {
                    text += '<li style="color:'+color+'; list-style: unset;">No Cancellation Policy Provided</li>';
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
                            text += '<li style="color:'+color+'; list-style: unset;">Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>'
                        } else {
                            text += '<li style="color:'+color+'; list-style: unset;">No Cancellation after: ' + result.policies[i].date;
                        }
                    }
                } else {
                    text += '<li style="color:'+color+'; list-style: unset;">No Cancellation Policy Provided</li>';
                };
                text += '</ul>';
                document.getElementById('js_cancellation_button'+provider).parentNode.innerHTML = text;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           if (view_type == '1'){
                var text = '<h4>Cancellation Policy</h4>';
                text += '<ul style="list-style-type: circle; margin: 0 15px;"><li style="list-style: unset;">No Cancellation Policy Provided</li></ul>';
                document.getElementById('cancellation_policy').innerHTML = text;
           } else {
                var text = '<ul style="list-style-type: circle; margin: 0 15px;">';
                text += '<li style="list-style: unset;">No Cancellation Policy Provided</li></ul>';
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
      title: 'Are you sure you want to Force Issued this booking?',
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
//        hotel_issued_booking();
        document.getElementById("passengers").value = JSON.stringify({'booker':booker});
        document.getElementById("signature").value = signature;
        document.getElementById("provider").value = 'hotel';
        document.getElementById("type").value = 'hotel_review';
        document.getElementById("voucher_code").value = voucher_code;
        document.getElementById("discount").value = JSON.stringify(discount_voucher);
        document.getElementById("session_time_input").value = time_limit;
        document.getElementById('hotel_issued').submit();
      }
    })
}

function force_issued_hotel(){
    Swal.fire({
      title: 'Are you sure you want to Force Issued this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        please_wait_transaction();
        $('.next-loading-booking').addClass("running");
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').prop('disabled', true);
        $('.issued_booking_btn').prop('disabled', true);
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
            if(msg.result.error_code == 0){
                document.getElementById('order_number').value = msg.result.response.os_res_no;
                document.getElementById('issued').action = '/hotel/booking';
                document.getElementById('issued').submit();
//                var form = document.getElementById('hotel_booking');
//                var input = document.createElement('input');//prepare a new input DOM element
//                input.setAttribute('name', 'result');//set the param name
//                input.setAttribute('value', JSON.stringify(msg) );//set the value
//                input.setAttribute('type', 'hidden')//set the type
//                form.appendChild(input);
//                form.submit();
            }else{
                //swal
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error issued hotel </span>' + errorThrown,
                })
            }
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
            console.log(msg);
            try{
                if(msg.result.error_code == 0){
                    hotel_get_detail = msg;
                    $text = '';
                    $text += 'Order Number: '+ msg.result.response.booking_name + '\n';
                    $text += msg.result.response.status + '\n';
                    text = `
                        <h6 class="carrier_code_template">Order Number : </h6><h6>`+msg.result.response.booking_name+`</h6><br/>
                        <table style="width:100%;">
                            <tr>
                                <th class="carrier_code_template">Booking Code</th>
                                <th class="carrier_code_template">Status</th>
                            </tr>`;
                            for(i in msg.result.response.hotel_rooms){
                                text+=`
                                    <tr>
                                        <td>`+msg.result.response.hotel_rooms[i].prov_issued_code+`</td>
                                        <td>`+msg.result.response.status.charAt(0).toUpperCase()+msg.result.response.status.slice(1).toLowerCase()+`</td>
                                    </tr>
                                `;
                            }
                        text+=`
                        </table>
                   `;
                   text+=`<div class="row">
                            <div class="col-sm-6">`;
                                if(msg.result.response.hotel_name != false)
                                    text+=`<span class="carrier_code_template">Hotel Name: </span><br/>`;
                                if(msg.result.response.hotel_address != false)
                                    text+=`<span class="carrier_code_template">Hotel Address: </span><br/>`;
                                if(msg.result.response.hotel_phone != false)
                                    text+=`<span class="carrier_code_template">Hotel Phone: </span><br/>`;
                    text+=`</div>
                            <div class="col-sm-6" style='text-align:right'>`;
                                if(msg.result.response.hotel_name != false)
                                    text+=`<span>`+msg.result.response.hotel_name+`</span><br/>`;
                                if(msg.result.response.hotel_address != false)
                                    text+=`<span>`+msg.result.response.hotel_address+`</span><br/>`;
                                if(msg.result.response.hotel_phone != false)
                                    text+=`<span>`+msg.result.response.hotel_phone+`</span><br/>`;
                    text+=`</div>
                          </div>`;

                   text+=`<div class="row">
                            <div class="col-sm-6">
                                <span class="carrier_code_template">Check In: </span><span>`+msg.result.response.from_date+`</span><br/>
                            </div>
                            <div class="col-sm-6" style='text-align:right'>
                                <span class="carrier_code_template">Check Out: </span><span>`+msg.result.response.to_date+`</span><br/>
                            </div>
                          </div>`;
                   document.getElementById('hotel_booking').innerHTML = text;
                   text = `
                        <h4>List of Room(s)</h4>
                        <hr/>
                        <table style="width:100%;" id="list-of-passenger">
                            <tr>
                                <th class="">No</th>
                                <th class="">Date</th>
                                <th class="">Name</th>
                                <th class="">Room(s)</th>
                                <th class="">Person</th>
                                <th class="">Rate</th>
                                <th class="">Meal Type</th>
                            </tr>`;
                        for(i in msg.result.response.hotel_rooms){
                        text+=`
                            <tr>
                                <td>`+parseInt(i+1)+`</td>
                                <td>`+msg.result.response.hotel_rooms[i].date+`</td>
                                <td>`+msg.result.response.hotel_rooms[i].room_name;
                                 if(msg.result.response.hotel_rooms[i].room_type != '')
                                    text+=`(`+msg.result.response.hotel_rooms[i].room_type+`)`;
                         text+=`</td>
                                <td>1</td>
                                <td>`+msg.result.response.hotel_rooms[i].person+` Adult</td>
                                <td>`+msg.result.response.hotel_rooms[i].currency+` `+getrupiah(msg.result.response.hotel_rooms[i].room_rate)+`</td>
                                <td>`;
                                if(msg.result.response.hotel_rooms[i].meal_type != false)
                                    text+=msg.result.response.hotel_rooms[i].meal_type;
                                else
                                    text+= '-';
                                text+=`</td>
                            </tr>`;
                        }
                        text+=`</table>`;
                   document.getElementById('hotel_list_room').innerHTML = text;
                   text=`
                        <h5>List of Guest(s)</h5>
                        <hr/>
                        <table style="width:100%;" id="list-of-passenger">
                            <tr>
                                <th class="">No</th>
                                <th class="">Name</th>
                                <th class="">Pax Type</th>
                                <th class="">Birth Date</th>
                            </tr>`;
                            for(i in msg.result.response.passengers){
                                text+=`<tr>
                                    <td>`+parseInt(i+1)+`</td>
                                    <td><span>`+msg.result.response.passengers[i].title+` `+msg.result.response.passengers[i].first_name+` `+msg.result.response.passengers[i].last_name+`</span></td>
                                    <td><span>`+msg.result.response.passengers[i].pax_type+`</span></td>
                                    <td><span>`+msg.result.response.passengers[i].birth_date+`</span></td>
                                </tr>`;
                            }
                   text+=`</table>`;
                   document.getElementById('hotel_passenger').innerHTML = text;
                    if(msg.result.response.status == 'issued'){
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;

                    text=`<div class="col-sm-4">
                                <!--<a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:`+text_color+`;">
                                    <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick="get_printout('`+msg.result.response.booking_name+`', 'ticket','hotel');"/>
                                    <div class="ld ld-ring ld-cycle"></div>
                                </a>-->
                           </div>`;
                    text+=`
                        <div class="col-sm-4">
                        </div>
                        <div class="col-sm-4">
                            <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        // modal invoice
                    text+=`
                            <div class="modal fade" id="printInvoice" role="dialog" data-keyboard="false">
                                <div class="modal-dialog">

                                  <!-- Modal content-->
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 class="modal-title" style="color:`+text_color+`">Invoice</h4>
                                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="row">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <span class="control-label" for="Name">Name</span>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    <span class="control-label" for="Additional Information">Additional Information</span>
                                                    <div class="input-container-search-ticket">
                                                        <textarea style="width:100%;" rows="4" id="additional_information" name="additional_information" placeholder="Additional Information"></textarea>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    <span class="control-label" for="Address">Address</span>
                                                    <div class="input-container-search-ticket">
                                                        <textarea style="width:100%;" rows="4" id="bill_address" name="bill_address" placeholder="Address"></textarea>
                                                        <!--<input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_address" placeholder="Address" required="1"/>-->
                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div style="text-align:right;">
                                                <span>Don't want to edit? just submit</span>
                                                <br/>
                                                <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.booking_name+`', 'invoice','hotel');"/>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                    document.getElementById('hotel_btn_printout').innerHTML = text;
                   //detail
                    text = '';
                    tax = 0;
                    fare = 0;
                    total_price = 0;
                    total_price_provider = [];
                    price_provider = 0;
                    commission = 0;
                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
                    text_detail=`
                    <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                        <h5> Price Detail</h5>
                    <hr/>`;

                    //repricing
                    type_amount_repricing = ['Repricing'];
                    //repricing
                    counter_service_charge = 0;
                    $text += '\nPrice:\n';
                    for(i in msg.result.response.hotel_rooms){
                        try{
                            text_detail+=`
                                <div style="text-align:left">
                                    <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.hotel_rooms[i].prov_issued_code+` </span>
                                </div>`;
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0};
                            price['FARE'] = msg.result.response.hotel_rooms[i].room_rate;
                            price['currency'] = msg.result.response.hotel_rooms[i].currency;
                            price['CSC'] = 0;
                            total_price_provider = msg.result.response.hotel_rooms[i].room_rate;
                            for(j in msg.result.response.passengers){
                                pax_type_repricing.push([msg.result.response.passengers[j].title+' '+msg.result.response.passengers[j].first_name+' '+msg.result.response.passengers[j].last_name, msg.result.response.passengers[j].title+' '+msg.result.response.passengers[j].first_name+' '+msg.result.response.passengers[j].last_name]);
                                price_arr_repricing[msg.result.response.passengers[j].title+' '+msg.result.response.passengers[j].first_name+' '+msg.result.response.passengers[j].last_name] = {
                                    'Fare': (price['FARE']/msg.result.response.passengers.length) + price['SSR'] + price['DISC'],
                                    'Tax': price['TAX'] + price['ROC'],
                                    'Repricing': price['CSC']
                                }
                            }

                            text_repricing = `
                                <div class="col-lg-12">
                                    <div style="padding:5px;" class="row">
                                        <div class="col-lg-3"></div>
                                        <div class="col-lg-3">Price</div>
                                        <div class="col-lg-3">Repricing</div>
                                        <div class="col-lg-3">Total</div>
                                    </div>
                                </div>`;
                                for(j in price_arr_repricing){
                                   text_repricing += `
                                   <div class="col-lg-12">
                                        <div style="padding:5px;" class="row" id="adult">
                                            <div class="col-lg-3" id="`+i+`_`+j+`">`+j+`</div>
                                            <div class="col-lg-3" id="`+j+`_price">`+getrupiah(price_arr_repricing[j].Fare + price_arr_repricing[j].Tax)+`</div>`;
                                            if(price_arr_repricing[j].Repricing == 0)
                                            text_repricing+=`<div class="col-lg-3" id="`+j+`_repricing">-</div>`;
                                            else
                                            text_repricing+=`<div class="col-lg-3" id="`+j+`_repricing">`+getrupiah(price_arr_repricing[j].Repricing)+`</div>`;
                                            text_repricing+=`<div class="col-lg-3" id="`+j+`_total">`+getrupiah(price_arr_repricing[j].Fare + price_arr_repricing[j].Tax + price_arr_repricing[j].Repricing)+`</div>
                                        </div>
                                    </div>`;
                                }
                                text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                                document.getElementById('repricing_div').innerHTML = text_repricing;
                                //repricing

                                text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+msg.result.response.hotel_rooms[i].date+`</span>`;
                                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(total_price_provider)+`</span>
                                    </div>
                                </div>`;
                                $text += msg.result.response.hotel_rooms[i].date + ' ';
                                $text += price.currency+` `+getrupiah(total_price_provider)+'\n';
                                if(counter_service_charge == 0){
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.SSR + price.DISC);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.SSR + price.DISC);
                                }else{
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.DISC);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.DISC);
                                }
                                commission += parseInt(price.RAC);

                            total_price_provider.push({
                                'pnr': msg.result.response.hotel_rooms[i].prov_issued_code,
                                'price': price_provider
                            })
                            price_provider = 0;
                            counter_service_charge++;
                        }catch(err){}
                    }
                    try{
                        $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
                        text_detail+=`
                        <div>
                            <hr/>
                        </div>
                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                            </div>
                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px; font-weight: bold;">`;
                                try{
                                    text_detail+= price.currency+` `+getrupiah(total_price);
                                }catch(err){

                                }
                                text_detail+= `</span>
                            </div>
                        </div>`;
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                        text_detail+=`<div class="row">
                        <div class="col-lg-12" style="padding-bottom:10px;">
                            <hr/>
                            <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                            share_data();
                            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                            if (isMobile) {
                                text_detail+=`
                                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                            } else {
                                text_detail+=`
                                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                            }

                        text_detail+=`
                            </div>
                        </div>`;
                        text_detail+=`
                        <div class="row" id="show_commission" style="display:none;">
                            <div class="col-lg-12 col-xs-12" style="text-align:center;">
                                <div class="alert alert-success">
                                    <span style="font-size:13px; font-weight:bold;">Your Commission: `+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span><br>
                                </div>
                            </div>
                        </div>`;
                        text_detail+=`<center>

                        <div style="padding-bottom:10px;">
                            <center>
                                <input type="button" class="primary-btn-ticket" style="width:100%;" onclick="copy_data();" value="Copy"/>
                            </center>
                        </div>
                        <div style="margin-bottom:5px;">
                            <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                        </div>
                    </div>`;
                }catch(err){console.log(err)}
                document.getElementById('hotel_detail').innerHTML = text_detail;
                add_repricing();
                console.log($text);

    //               document.getElementById('hotel_detail').innerHTML = text;
                }else{
                    //swal
                }
            }catch(err){console.log(err)}
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

function update_service_charge(){
    document.getElementById('hotel_booking').innerHTML = '';
    upsell = []
    hotel_get_detail = msg;
    for(i in hotel_get_detail.result.response.hotel_rooms){
        currency = hotel_get_detail.result.response.hotel_rooms[i].currency;
    }
    for(i in hotel_get_detail.result.response.passengers){
        list_price = []
        for(j in list){
            if(hotel_get_detail.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                list_price.push({
                    'amount': list[j],
                    'currency_code': currency
                });
            }

        }
        upsell.push({
            'sequence': i,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': JSON.stringify(order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                price_arr_repricing = {};
                pax_type_repricing = [];
                airline_get_booking(order_number);
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error airline service charge </span>' + errorThrown,
            })
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}