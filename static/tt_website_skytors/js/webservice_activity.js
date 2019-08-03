activity_data = [];
activity_type = [];
activity_type_pick = '';
activity_date = [];
activity_date_pick = '';
activity_timeslot = '';
additional_price = 0;
event_pick = 0;
offset = 0;

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
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
}

function activity_login(data){
    offset = 0;
    getToken();
    //document.getElementById('themespark_category').value.split(' - ')[1]
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'login',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
          'sort': 'price_asc',
          'limit': 20,
          'offset': offset
       },
       success: function(msg) {
           console.log(msg);
           if(data == ''){
               var text = '';
               var counter = 0;
               if(msg.result.error_code == 0){
                   activity_data = msg.result.response;
                   for(i in activity_data){
                       text+=`
                       <form action='/activity/detail' method=POST id='myForm`+activity_data[i].sequence+`'>
                           <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" style="padding: 0px; text-align: center;">
                                <div id='csrf`+activity_data[i].sequence+`'></div>
                                <input id='uuid' name='uuid' type=hidden value='`+activity_data[i].uuid+`'/>
                                <input id='sequence' name='sequence' type=hidden value='`+activity_data[i].sequence+`'/>
                                <button class="panel_themespark" type="button" data-content-1="`+activity_data[i].name+`" onclick="go_to_detail('`+activity_data[i].sequence+`')">
                                    <div class="themespark-image-thumbnail">
                                        <img style="width: 100%; height: 100%;" src="`+activity_data[i].images[0].url+activity_data[i].images[0].path+`">
                                    </div>
                                    <div class="row themespark-description-thumbnail" style="display:block;">
                                        <span class="span-themespark-desc" style="font-weight:bold;">`+activity_data[i].name+`</span><br/>`;
                                        for(j in activity_data[i].locations) {
                                            text+=`
                                                <span class="span-themespark-desc"> <i style="color:red !important;" class="fas fa-map-marker-alt"></i> `+activity_data[i].locations[j].city_name+`, `+activity_data[i].locations[j].country_name+` </span>
                                                <br/>`;
                                        }
                                        text+=`
                                            <span class="span-themespark-desc"> `+activity_data[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+activity_data[i].reviewCount+`)</span>
                                            <span class="span-themespark-desc" data-oe-type="monetary" data-oe-expression="rec['converted_price']" style="font-weight:bold; float:right;">Rp&nbsp;<span class="oe_currency_value">`+getrupiah(activity_data[i].converted_price)+`</span></span>
                                    </div>
                                </button>
                           </div>
                       </form>
                       `;
                   }

                   offset++;
                   if (text != '') {
                        $('#activity_ticket').html(text);
                    }
                    else {
                        var temp = '<div class="col-md-2 col-md-offset-5 col-sm-4 col-sm-offset-4 col-xs-6 col-xs-offset-3" style="margin-top:30px;">';
                        temp += '<img src="{{ static_path }}images/nofound.png"/>';
                        temp += '</div>';
                        $('#activity_ticket').html(temp);
                    }

               }else{
                //error
               }
           }else if(data != ''){
               activity_get_booking(data);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function activity_search(){
    offset++;
    get_new = false;
    getToken();
    //document.getElementById('themespark_category').value.split(' - ')[1]
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'search2',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
          'sort': 'price_asc',
          'limit': 20,
          'offset': offset
       },
       success: function(msg) {
        console.log(msg);
           var text = '';
           var counter = 0;
           data=[]
           if(msg.result.error_code == 0){
               for(i in activity_data){
                  data.push(activity_data[i]);
               }
               activity_data = data;

               for(i in msg.result.response){
                   text+=`
                   <form action='/activity/detail' method=POST id='myForm`+msg.result.response[i].sequence+`'>
                       <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" style="padding: 0px; text-align: center;">
                            <div id='csrf`+msg.result.response[i].sequence+`'></div>
                            <input id='uuid' name='uuid' type=hidden value='`+msg.result.response[i].uuid+`'/>
                            <input id='sequence' name='sequence' type=hidden value='`+msg.result.response[i].sequence+`'/>
                            <button class="panel_themespark" type="button" data-content-1="`+msg.result.response[i].name+`" onclick="go_to_detail('`+msg.result.response[i].sequence+`')">
                                <div class="themespark-image-thumbnail">
                                    <img style="width: 100%; height: 100%;" src="`+msg.result.response[i].images[0].url+msg.result.response[i].images[0].path+`">
                                </div>
                                <div class="row themespark-description-thumbnail" style="display:block;">
                                    <span class="span-themespark-desc" style="font-weight:bold;">`+msg.result.response[i].name+`</span><br/>`;
                                    for(j in msg.result.response[i].locations) {
                                        text+=`
                                            <span class="span-themespark-desc"> <i style="color:red !important;" class="fas fa-map-marker-alt"></i> `+msg.result.response[i].locations[j].city_name+`, `+msg.result.response[i].locations[j].country_name+` </span>
                                            <br/>`;
                                    }
                                    text+=`
                                        <span class="span-themespark-desc"> `+msg.result.response[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+msg.result.response[i].reviewCount+`)</span>
                                        <span class="span-themespark-desc" data-oe-type="monetary" data-oe-expression="rec['converted_price']" style="font-weight:bold; float:right;">Rp&nbsp;<span class="oe_currency_value">`+getrupiah(msg.result.response[i].converted_price)+`</span></span>
                                </div>
                            </button>
                       </div>
                   </form>
                   `;
               }
               offset++;
               document.getElementById('activity_ticket').innerHTML += text;
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

function activity_get_detail(val){
    getToken();
    //document.getElementById('themespark_category').value.split(' - ')[1]
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_details2',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
          'uuid': val
       },
       success: function(msg) {
           try{
               if(msg.error_code == 0){
                   activity_type = msg.response.result;
                   console.log(msg);
                   var counti = 0;
                   var temp = ``;
                   for(i in activity_type){
                       if (counti == 0){
                           temp += `
                           <label class="btn btn-themespark active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" onclick="activity_get_price(`+parseInt(i)+`);">
                               <input type="radio" class="themespark" name="product_type" autocomplete="off" checked="checked"/><span>`+activity_type[i].name+`</span>
                           </label>
                       `;
                       }
                       else {
                           temp += `
                           <label class="btn btn-themespark" style="z-index:1 !important; margin: 0px 5px 5px 0px;" onclick="activity_get_price(`+parseInt(i)+`);">
                               <input type="radio" class="themespark" name="product_type" autocomplete="off"/><span>`+activity_type[i].name+`</span>
                           </label>
                       `;
                       }
                       counti++;
                   }
                   $('#ticket_type').html(temp);
                   activity_get_price(0);
               }else{
                   try{
                       alert(msg.result.error_msg);
                   }catch(err){
                       alert(msg.error_msg);
                   }
               }
           }catch(err){
               try{
                   alert(msg.error_msg);
               }catch(err){
                   alert(msg.result.error_msg);
               }
           }


       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function activity_get_price(val){
    console.log('inhere');
    document.getElementById('activity_detail_table').innerHTML = '';
    if(parseInt(activity_type_pick) != val){
        activity_type_pick = val;
        document.getElementById('product_type_title').innerHTML = activity_type[activity_type_pick].name;
        document.getElementById('product_type').innerHTML = activity_type[activity_type_pick].name;
        text = '';
        if(activity_type[activity_type_pick].maxPax != 0){
            text+= `<div class="col-xs-3" style="padding:0px 5px;">
                        <label>Adult</label><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Age range for adult is `+activity_type[activity_type_pick].minAdultAge+` - `+activity_type[activity_type_pick].maxAdultAge+` years old" style="padding-left:5px;"></i>
                        <select class='form-control adult-icon themespark_pax' id='adult_passenger' name='adult_passenger' onchange='activity_table_detail()'>`;
                        for(j=parseInt(activity_type[activity_type_pick].minPax); j<=parseInt(activity_type[activity_type_pick].maxPax); j++)
                        text+=`
                            <option>`+j+`</option>`;
                        text+=`</select>
                    </div>`;
        }
        if(activity_type[activity_type_pick].allowSeniors == true){
           text+= `<div class="col-xs-3" style="padding:0px 5px;">
                    <label>Senior</label><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Age range for senior is `+activity_type[activity_type_pick].minSeniorAge+` - `+activity_type[activity_type_pick].maxSeniorAge+` years old" style="padding-left:5px;"></i>
                    <select class='form-control senior-icon themespark_pax' id='senior_passenger' name='senior_passenger' onchange='activity_table_detail()'>`;
                    for(j=activity_type[activity_type_pick].minSeniors; j<=activity_type[activity_type_pick].maxSeniors; j++)
                    text+=`
                        <option>`+j+`</option>`;

                    text+=`</select>
                </div>`;
        }
        if(activity_type[activity_type_pick].allowChildren == true){
           text+= `<div class="col-xs-3" style="padding:0px 5px;">
                    <label>Child</label><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Age range for child is `+activity_type[activity_type_pick].minChildAge+` - `+activity_type[activity_type_pick].maxChildAge+` years old" style="padding-left:5px;"></i>
                    <select class='form-control child-icon themespark_pax' id='children_passenger' name='children_passenger' onchange='activity_table_detail()'>`;
                    for(j=activity_type[activity_type_pick].minChildren; j<=activity_type[activity_type_pick].maxChildren; j++)
                    text+=`
                        <option>`+j+`</option>`;

                    text+=`</select>
                </div>`;
        }
        if(activity_type[activity_type_pick].allowInfant == true){
           text+= `<div class="col-xs-3" style="padding:0px 5px;">
                        <label>Infant</label><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Age range for infant is `+activity_type[activity_type_pick].minInfantAge+` - `+activity_type[activity_type_pick].maxInfantAge+` years old" style="padding-left:5px;"></i>
                        <select class='form-control infant-icon themespark_pax' id='infant_passenger' name='infant_passenger' onchange='activity_table_detail()'>`;
                        for(j=activity_type[activity_type_pick].minInfant; j<=activity_type[activity_type_pick].maxInfant; j++)
                        text+=`
                            <option>`+j+`</option>`;

                        text+=`</select>
                   </div>`;
        }

        document.getElementById('pax').innerHTML = text;
        text = '';
        if(activity_type[activity_type_pick].voucher_validity != ''){
           text+=`<h3 style="padding:0 10px;">Validity</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].voucher_validity+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherUse != ''){
           text+=`<h3 style="padding:0 10px;">Voucher Use</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].voucherUse+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherRedemptionAddress != ''){
           text+=`<h3 style="padding:0 10px;">Voucher Address</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].voucherRedemptionAddress+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherRequiresPrinting != ''){
           text+=`<h3 style="padding:0 10px;">Voucher Print</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].voucherRequiresPrinting+`</p>`;
        }
        if(activity_type[activity_type_pick].cancellationPolicies != ''){
           text+=`<h3 style="padding:0 10px;">Cancellation Policies</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].cancellationPolicies+`</p>`;
        }

        document.getElementById('vouchers').innerHTML = text;
        text = '';
        if(response.provider == 'bemyguest'){
           if(activity_type[activity_type_pick].timeslots.length>0){
               text += `<div class="col-xs-12" style="padding:5px 0px 0px 15px;">Timeslot</div>
                        <div class="col-xs-12" style="padding:5px 0px 0px 15px;"><select class="form-control" style="width:50%;" name="timeslot" id="timeslot">`;
               var temp_timeslotco = 0;
               for(j in activity_type[activity_type_pick].timeslots)
               {
                    if (temp_timeslotco == 0)
                    {
                        timeslot_change(j);
                    }
                    text += `<option value="`+activity_type[activity_type_pick].timeslots[j].uuid+`" onclick='timeslot_change(`+j+`);'>`+activity_type[activity_type_pick].timeslots[j].startTime.split(':')[0]+`:`+activity_type[activity_type_pick].timeslots[j].startTime.split(':')[1]+` - `+activity_type[activity_type_pick].timeslots[j].endTime.split(':')[0]+`:`+activity_type[activity_type_pick].timeslots[j].endTime.split(':')[1]+`</option>`;
                    temp_timeslotco += 1;
               }

               text += `</select></div>`;
           }
        }
        document.getElementById('timeslot').innerHTML = text;
        text = '';
        for(i in activity_type[activity_type_pick].options.perBooking){
            if(activity_type[activity_type_pick].options.perBooking[i].name != 'Guest age' &&
               activity_type[activity_type_pick].options.perBooking[i].name != 'Full name' &&
               activity_type[activity_type_pick].options.perBooking[i].name != 'Gender' &&
               activity_type[activity_type_pick].options.perBooking[i].name != 'Nationality' &&
               activity_type[activity_type_pick].options.perBooking[i].name != 'Date of birth'){
                text+=`<label style='display:block;'>`+activity_type[activity_type_pick].options.perBooking[i].name+`</label>`;
                if(activity_type[activity_type_pick].options.perBooking[i].inputType == 1){
                    //selection buttton
                    text+=`<select class="form-control" id=perbooking`+i+` name=perbooking`+i+` onchange='input_type1_change_perbooking(`+i+`)'>`;
                    for(j in activity_type[activity_type_pick].options.perBooking[i].items){
                        text+=`<option value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`">`+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</option>`;
//                        text+=`<label style="width:20%">
//                               <input type="radio" id=perbooking`+i+` name=perbooking`+i+` value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`" onchange='input_type1_change_perbooking(`+i+`,`+j+`)' />`+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</label>`;
                    }
                    text+=`</select><br/>`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 2){
                    //checkbox
                    for(j in activity_type[activity_type_pick].options.perBooking[i].items){
                        text+=`<label style="width:20%"><input type="checkbox" id=perbooking`+i+j+` name=perbooking`+i+j+` onchange='input_type2_change_perbooking(`+i+`,`+j+`)' value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`"> `+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</label>`;
                    }
                    text+=`<br/>`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 3){
                    //number validation
                    text+=`<input class="form-control" type='text' id=perbooking`+i+` name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' style='display:block' />`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 4){
                    //string validation
                    text+=`<input class="form-control" type='text' id=perbooking`+i+` name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' style='display:block' />`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 5){
                    //boolean checkbox true false
                    text+=`<input type="checkbox" id=perbooking`+i+`  name=perbooking`+i+` onchange='input_type5_change_perbooking(`+i+`)' />`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 6){
                    //date
                    text+=`<input type="date" class="form-control" id=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' name=perbooking`+i+` />`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 7){
                    //file //pdf
                    text+=`<input type="file" accept="application/JSON, application/pdf" onchange='input_type_change_perbooking(`+i+`)' required="" name=perbooking`+i+` id=perbooking`+i+` />`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 8){
                    //image
                    text+=`<input type="file" accept="image/*" required="" name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' id=perbooking`+i+` />`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 9){
                    //address no validation maybe from bemyguest
                    text+=`<input class="form-control" type='text' id=perbooking`+i+` name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' style='display:block'/>`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 10){
                    //time validation
                    text+=`<input type="time" style="width:100%;height:20px;" id=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' name=perbooking`+i+` />`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 11){
                    //datetime validation
                    text+=`<input class="form-control" type="text" id=perbooking`+i+`0 onchange='input_type11_change_perbooking(`+i+`,0)' name=perbooking`+i+`0 />`;
                    text+=`<input type="time" id=perbooking`+i+`1 onchange='input_type11_change_perbooking(`+i+`,1)' name=perbooking`+i+`1 />`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 12){
                    //string country
                    text+=`<input class="form-control" type='text' id=perbooking`+i+` name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' style='display:block'/>`;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 13){
                    //deprecated
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 14){
                    //flight number
                    text+=`<input class="form-control" type='text' id=perbooking`+i+` name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' style='display:block'/>`;
                }
                text+=`<label>`+activity_type[activity_type_pick].options.perBooking[i].description+`</label><br/>`;
            }
        }
        document.getElementById('perbooking').innerHTML = text;
        for(i in activity_type[activity_type_pick].options.perBooking){
            if(activity_type[activity_type_pick].options.perBooking[i].inputType==11)
                datepicker('perbooking'+i+'0');
            else if(activity_type[activity_type_pick].options.perBooking[i].inputType==6)
                datepicker('perbooking'+i);

        }
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/activity",
           headers:{
                'action': 'get_pricing2',
           },
    //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
           data: {
              'product_type_uuid': activity_type[activity_type_pick].uuid,
              'provider': response.provider,
           },
           success: function(msg) {
               console.log(msg);
               if(msg.result.error_code == 0){
                   activity_date = msg.result.response;
                   for(i in msg.result.response[0]){
                       if(msg.result.response[0][i].available==true){

                           document.getElementById('date').innerHTML = `
                                <div class="col-sm-6 form-group departure_date" style="padding:5px;">
                                    <label id="departure_date_themespark_label" for="activity_date"><span class="required-txt">* </span>Visit Date</label>
                                    <input id="activity_date" name="activity_date" value="`+moment(msg.result.response[0][i].date).format('DD MMM YYYY')+`" onchange="change_date_activity();" class="form-control calendar-logo" type="text" placeholder="Choose your departure date" autocomplete="off"/>
                                    <div id="activity_date_desc"></div>
                                </div>
                           `;
                           $('#activity_date').datepicker({
                               dateFormat: 'dd M yy',
                               minDate: new Date(),
                           });
                           event_pick = 0;
                           activity_date_pick = i;
                           event_pick = 0;
                           if(response.provider == 'globaltix'){
                               if(msg.result.response.length > 1){
                                  document.getElementById('event').innerHTML = `
                                    <label>
                                        Event
                                    </label><br/>`;
                                  for(j in msg.result.response){
                                    if(j==0)
                                        document.getElementById('event').innerHTML += `<input type="radio" name="event" id="event" value="`+msg.result.response[j][0].id+`" checked onclick='change_event(j);' />`+msg.result.response[j][0].name;
                                    else
                                        document.getElementById('event').innerHTML += `<input type="radio" name="event" id="event" value="`+msg.result.response[j][0].id+`" onclick='change_event(j);' />`+msg.result.response[j][0].name;
                                  }
                               }
                           }
                       break;
                       }
                   }
                   activity_table_detail();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               alert(errorThrown);
           }
       });

    }else{

    }
}


function activity_create_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'create_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            document.getElementById('activity_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
            document.getElementById('activity_booking').submit();
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

function copy_data(){
    const el = document.createElement('textarea');
    el.value = $test;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function activity_get_booking(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
           'order_number': data
       },
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            text = `
                        <div class="row">
                            <div class="col-lg-12">
                                <div style="background-color:#f15a22;">
                                    <center>
                                        <span style="color:white; font-size:16px;"> Activity Order Details <img style="width:18px;" src="/static/tt_website_skytors/images/icon/ferris-wheel.png"/></span>
                                    </center>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div style="padding:10px; background-color:white; border:1px solid #f15a22;">
                                    <table style="margin-top:5px;width:100%;">
                                        <tr>
                                            <td><span style="font-weight: bold;">Order Number:</span></td>
                                            <td><span style="font-weight: bold;">PNR:</span></td>
                                        </tr>
                                        <tr>
                                            <td>`+msg.result.response.name+`</td>
                                            <td>`+msg.result.response.pnr+`</td>
                                        </tr>
                                    </table>
                                    <br/>
                                    <label><span style="font-weight: bold;">`+msg.result.response.activity.name+`</span></label><br/>
                                    <label>`+msg.result.response.activity.type+`</label><br/>
                                    <label>`+moment(msg.result.response.visit_date).format('DD MMM YYYY')+`</label><br/>
                                    <table style="margin-top:10px;width:100%;">
                                        <tr>
                                            <td><span style="font-weight: bold;">Booker Information</span></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Full Name</td>
                                            <td>: `+msg.result.response.contacts.title+` `+msg.result.response.contacts.first_name+` `+msg.result.response.contacts.last_name+`</td>
                                        </tr>
                                        <tr>
                                            <td>Email</td>
                                            <td>: `+msg.result.response.contacts.email+`</td>
                                        </tr>
                                        <tr>
                                            <td>Mobile Phone</td>
                                            <td>: `+msg.result.response.contacts.phone+`</td>
                                        </tr>
                                    </table>
                                </div>
                                <br/>
                            </div>
                            <div class="col-lg-12">
                                <div style="background-color:#f15a22;">
                                    <center>
                                        <span style="color:white; font-size:16px;"> List of Passenger <i class="fas fa-users"></i></span>
                                    </center>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div style="padding:10px; background-color:white; border:1px solid #f15a22;">
                                    <table style="width:100%;">
                                        <tr>
                                            <th>Name</th>
                                            <th>Birth Date</th>
                                        </tr>`;
                                        for(i in msg.result.response.passengers){
                                            text+=`<tr>
                                                <td>`+msg.result.response.passengers[i].title+` `+msg.result.response.passengers[i].first_name+` `+msg.result.response.passengers[i].last_name+`</td>
                                                <td>`+moment(msg.result.response.passengers[i].birth_date).format('DD MMM YYYY')+`</td>
                                            </tr>`;
                                        }
                                        text+=`
                                    </table>
                                </div>
                                <br/>
                            </div>
                        </div>
                        <input class="primary-btn" type="button" value="Voucher" onclick="activity_get_voucher()" />
            `;
            document.getElementById('activity_ticket').innerHTML = text;

            price_text = '';
            $test = msg.result.response.activity.name+'\n'+msg.result.response.activity.type+
           '\nVisit Date : '+msg.result.response.visit_date+'\n\n';
            try{
               if(msg.result.response.price_itinerary.adult_amount != 0){
                   price_text+= `<div class="row">
                                <div class="col-xs-3">Adult</div>
                                <div class="col-xs-1">X</div>
                                <div class="col-xs-1">`+msg.result.response.price_itinerary.adult_amount+`</div>
                                <div class="col-xs-6" style="padding-right: 5; text-align: right;">`;
                   price_text+= getrupiah(msg.result.response.price_itinerary.adult_price) +`</div>
                       </div>`;
                   $test += msg.result.response.price_itinerary.adult_amount+' Adult Price IDR '+getrupiah(msg.result.response.price_itinerary.adult_price)+'\n';
               }
           }catch(err){

           }
           try{
               if(msg.result.response.price_itinerary.senior_amount != 0){
                   price_text+= `<div class="row">
                                <div class="col-xs-3">Senior</div>
                                <div class="col-xs-1">X</div>
                                <div class="col-xs-1">`+msg.result.response.price_itinerary.senior_amount+`</div>
                                <div class="col-xs-6" style="padding-right: 5; text-align: right;">`;
                   price_text+= getrupiah(msg.result.response.price_itinerary.senior_price) +`</div>
                       </div>`;
                   $test += msg.result.response.price_itinerary.senior_amount+' Senior Price IDR '+getrupiah(msg.result.response.price_itinerary.senior_price)+'\n';
               }
           }catch(err){

           }
           try{
               if(msg.result.response.price_itinerary.child_amount != 0){
                   price_text+= `<div class="row">
                                <div class="col-xs-3">Child</div>
                                <div class="col-xs-1">X</div>
                                <div class="col-xs-1">`+msg.result.response.price_itinerary.child_amount+`</div>
                                <div class="col-xs-6" style="padding-right: 5; text-align: right;">`;
                   price_text+= getrupiah(msg.result.response.price_itinerary.child_price) +`</div>
                       </div>`;
                   $test += msg.result.response.price_itinerary.child_amount+' Child Price IDR '+getrupiah(msg.result.response.price_itinerary.child_price)+'\n';
               }
           }catch(err){

           }
           try{
               if(msg.result.response.price_itinerary.infant_amount != 0){
                   price_text+= `<div class="row">
                                <div class="col-xs-3">Infant</div>
                                <div class="col-xs-1">X</div>
                                <div class="col-xs-1">`+msg.result.response.price_itinerary.infant_amount+`</div>
                                <div class="col-xs-6" style="padding-right: 5; text-align: right;">0</div>
                           </div>`;
                   $test += msg.result.response.price_itinerary.infant_amount+' Infant Price IDR '+getrupiah(0)+'\n';
               }
           }catch(err){

           }

           if(msg.result.response.price_itinerary.additional_charge_total != 0)
           {
                price_text+= `
                    <div class="row">
                        <div class="col-xs-8">Additional Charge</div>
                        <div class="col-xs-3" style="padding-right: 0; text-align: right;" id='additional_price'>`+msg.result.response.price_itinerary.additional_charge_total+`</div>
                    </div>
                `;
                $test += 'Additional price IDR '+getrupiah(msg.result.response.price_itinerary.additional_charge_total)+'\n';
           }

           price_text+= `
             <hr style="padding:0px;">
             <div class="row">
                  <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                  <div class="col-xs-3" style="padding-right: 0; text-align: right;">`+getrupiah(msg.result.response.price_itinerary.total_itinerary_price)+`</div>
             </div>

             <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px;">Your Commission: IDR `+getrupiah(msg.result.response.price_itinerary.commission_total)+`</span><br>
                    </div>
                </div>
             </div>

             <div class="row" style="margin:20px 0px 0px 0px; text-align:center;">
               <div class="col-xs-12">
                    <input type="button" class="primary-btn-ticket" data-toggle="modal" data-target="#copiedModal" onclick="copy_data();" value="Copy" style="width:90%;"/>
               </div>
             </div>
             <div class="row" style="margin:10px 0px 10px 0px; text-align:center;">
               <div class="col-xs-12">
                    <input type="button" class="primary-btn-ticket" id="show_commission_button" value="Show Commission" style="width:90%;" onclick="show_commission();"/>
               </div>
             </div>
           <div style="text-align:center;">
                <div id="copiedModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4>Copy</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <span style="font-weight:bold">Copied!</span>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           `;
            $test+= '\nGrand Total : IDR '+ getrupiah(msg.result.response.price_itinerary.total_itinerary_price)+'\nPrices and availability may change at any time';
            document.getElementById('activity_detail_table').innerHTML = price_text;

            document.getElementById('product_title').innerHTML = msg.result.response.activity.name;
            document.getElementById('product_type_title').innerHTML = msg.result.response.activity.type;

        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function activity_get_voucher(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_voucher',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       console.log(msg)
        if(msg.result.error_code == 0){
            for(i in msg.result.response)
                document.getElementById('voucher').innerHTML = `<embed src="data:application/pdf;base64,`+msg.result.response[i]+`" width="800px" height="2100px" />`;
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

function datepicker(val){
    $('#'+val).datepicker({
      'format': 'dd M yyyy',
      'todayHighlight': true,
      'autoclose': true
    });
}