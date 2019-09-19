activity_data = [];
activity_type = [];
activity_type_pick = '';
activity_date = [];
activity_date_pick = '';
activity_timeslot = '';
additional_price = 0;
event_pick = 0;
pricing_days = 1;
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
    //document.getElementById('activity_category').value.split(' - ')[1]
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
           if(data == ''){
               activity_search()
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
    //document.getElementById('activity_category').value.split(' - ')[1]
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'search',
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
               activity_data = msg.result.response;
               $('#loading-search-activity').hide();
               if (activity_data.length == 0)
               {
                    text += `
                        <div class="col-lg-4">
                        </div>
                        <div class="col-lg-4">
                            <div style="padding:5px; margin:10px;">
                                <div style="text-align:center">
                                    <img src="/static/tt_website_skytors/img/icon/no-flight.jpeg" style="width:80px; height:80px;" alt="" title="" />
                                    <br/><br/>
                                    <h6>NO ACTIVITY AVAILABLE</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                        </div>
                    `;
               }
               for(i in activity_data){
                   if (activity_data[i].images.length > 0)
                   {
                       img_src = activity_data[i].images[0].url+activity_data[i].images[0].path;
                   }
                   else
                   {
                       img_src = `http://static.skytors.id/tour_packages/not_found.png`;
                   }

                   text+=`
                   <div class="col-lg-4 col-md-6">
                       <form action='/activity/detail' method=POST id='myForm`+activity_data[i].sequence+`'>
                            <div id='csrf`+activity_data[i].sequence+`'></div>
                            <input type='hidden' value='`+JSON.stringify(activity_data[i]).replace(/[']/g, /["]/g)+`'/>
                            <input id='uuid' name='uuid' type=hidden value='`+activity_data[i].uuid+`'/>
                            <input id='sequence' name='sequence' type=hidden value='`+activity_data[i].sequence+`'/>
                            <div class="single-recent-blog-post item" style="cursor:pointer;" onclick="go_to_detail('`+activity_data[i].sequence+`')">
                                <div class="single-destination relative">
                                    <div class="thumb relative" style="margin: auto; width:100%; height:200px; background-image: url('http://static.skytors.id/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                        <div class="overlay overlay-bg"></div>
                                        <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: cover;">
                                    </div>
                                    <div class="card card-effect-promotion">
                                        <div class="card-body">
                                            <div class="row details">
                                                <div class="col-lg-12" style="text-align:left;">
                                                    <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+activity_data[i].name+`">`+activity_data[i].name+`</h6>`;
                                                    for(j in activity_data[i].locations) {
                                                        text+=`
                                                            <span class="span-activity-desc" style="font-size:13px;"> <i style="color:red !important;" class="fas fa-map-marker-alt"></i> `+activity_data[i].locations[j].city_name+`, `+activity_data[i].locations[j].country_name+` </span>
                                                            <br/>`;
                                                    }
                                                text+=`
                                                <span class="span-activity-desc" style="font-size:13px;"> `+activity_data[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+activity_data[i].reviewCount+`)</span>
                                                <br/><br/>
                                                </div>
                                                <div class="col-lg-12" style="text-align:right;">
                                                    <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(activity_data[i].converted_price)+`  </span>
                                                    <a href="#" class="btn btn-primary" onclick="go_to_detail('`+activity_data[i].sequence+`')">BUY</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       </form>
                   </div>
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

function activity_get_detail(uuid, provider){
    getToken();
    //document.getElementById('activity_category').value.split(' - ')[1]
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_details',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
          'uuid': uuid,
          'provider_id': provider
       },
       success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                   activity_type = msg.result.response;
                   var counti = 0;
                   var temp = ``;
                   for(i in activity_type){
                       if (counti == 0){
                           temp += `
                           <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px; max-width:300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                               <input type="radio" class="activity" name="product_type" autocomplete="off" checked="checked"/><span>`+activity_type[i].name+`</span>
                           </label>
                       `;
                       }
                       else {
                           temp += `
                           <label class="btn btn-activity" style="z-index:1 !important; margin: 0px 5px 5px 0px; max-width:300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                               <input type="radio" class="activity" name="product_type" autocomplete="off"/><span>`+activity_type[i].name+`</span>
                           </label>
                       `;
                       }
                       counti++;
                   }
                   $('#ticket_type').html(temp);
                   activity_get_price(0, true);
               }else{
                   try{
                       alert(msg.result.error_msg);
                   }catch(err){
                       alert(msg.error_msg);
                   }
               }
           }catch(err){
               try{
                   console.log('here')
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

function activity_get_price(val, bool){
    if(parseInt(activity_type_pick) != val || bool == true){
        activity_type_pick = val;
        document.getElementById('product_type_title').innerHTML = activity_type[activity_type_pick].name;

        text = '';
        if(activity_type[activity_type_pick].voucher_validity != ''){
           text+=`<h3 style="padding:0 20px;">Validity</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].voucher_validity+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherUse != ''){
           text+=`<h3 style="padding:0 20px;">Voucher Use</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].voucherUse+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherRedemptionAddress != ''){
           text+=`<h3 style="padding:0 20px;">Voucher Address</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].voucherRedemptionAddress+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherRequiresPrinting != ''){
           text+=`<h3 style="padding:0 20px;">Voucher Print</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].voucherRequiresPrinting+`</p>`;
        }
        if(activity_type[activity_type_pick].cancellationPolicies != ''){
           text+=`<h3 style="padding:0 20px;">Cancellation Policies</h3>
                <p style="padding:0 20px;">`+activity_type[activity_type_pick].cancellationPolicies+`</p>`;
        }

        document.getElementById('vouchers').innerHTML = text;
        document.getElementById('date').innerHTML = `
            <div class="col-sm-6 form-group departure_date" style="padding:15px;">
                <label id="departure_date_activity_label" for="activity_date"><span class="required-txt">* </span>Visit Date</label>
                <input id="activity_date" name="activity_date" onchange="activity_get_price_date(`+activity_type_pick+`, `+pricing_days+`);" class="form-control calendar-logo" type="text" placeholder="Please Select a Date" autocomplete="off" readonly/>
                <div id="activity_date_desc"></div>
            </div>
       `;

       $('#activity_date').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: moment(),
          minDate: moment(),
          showDropdowns: true,
          opens: 'center',
          locale: {
              format: 'DD MMM YYYY',
          }
       });

    }else{

    }
}

function activity_get_price_date(activity_type_pick, pricing_days){
    document.getElementById('activity_detail_table').innerHTML = '';
    document.getElementById('activity_detail_next_btn').innerHTML = '';
    document.getElementById('pax').innerHTML = '';
    document.getElementById('event').innerHTML = '';
    document.getElementById('timeslot').innerHTML = '';
    document.getElementById('perbooking').innerHTML = '';
    $('#loading-detail-activity').show();
    document.getElementById('activity_date_desc').innerHTML = `
                           <small id="departure_date_activity_desc" class="hidden" style="color: black;">Checking Availability...</small>
                           `;
    startingDate = document.getElementById('activity_date').value;
    document.getElementById("activity_date").disabled = true;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_pricing',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
          'product_type_uuid': activity_type[activity_type_pick].uuid,
          'provider': activity_type[activity_type_pick].provider_code,
          'pricing_days': pricing_days,
          'startingDate': startingDate
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
               console.log(startingDate);
               console.log(msg);
               activity_date = msg.result.response;
               is_avail = 0;
               act_date_data = JSON.stringify(activity_date).replace(/'/g, '');
               document.getElementById('activity_date_div').innerHTML = `<input type='hidden' id='activity_date_data' name='activity_date_data' value='`+act_date_data+`'/>`;
               document.getElementById("activity_date").disabled = false;
               for(i in activity_date[event_pick]){
                   console.log(moment(document.getElementById('activity_date').value).format('YYYY-MM-DD'));
                   if(activity_date[event_pick][i].date == moment(document.getElementById('activity_date').value).format('YYYY-MM-DD')){
                       if(activity_date[event_pick][i].available){
                           is_avail = 1;
                           document.getElementById('activity_date_desc').innerHTML = `
                           <small id="departure_date_activity_desc" class="hidden" style="color: green;">Ticket is available on this date!</small>
                           `;
                           activity_date_pick = i;
                           break;
                       }
                   }
               }
               $('#loading-detail-activity').hide();
               if (is_avail == 0)
               {
                   document.getElementById('activity_date_desc').innerHTML = `
                           <small id="departure_date_activity_desc" class="hidden" style="color: red;">Ticket is unavailable on this date.</small>
                           `;
               }
               else
               {
                   text = '';
                   detail_for_session = JSON.stringify(activity_type).replace(/'/g, '');
                   for(i in activity_type[activity_type_pick].skus)
                   {
                        low_sku_id = activity_type[activity_type_pick].skus[i].sku_id.toLowerCase();
                        text+= `<div class="col-xs-3" style="padding:0px 5px;">
                                    <input type="hidden" id="sku_id" name="sku_id" value="`+activity_type[activity_type_pick].skus[i].sku_id+`"/>
                                    <label>`+activity_type[activity_type_pick].skus[i].title+`</label><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Age Range: `+activity_type[activity_type_pick].skus[i].minAge+` - `+activity_type[activity_type_pick].skus[i].maxAge+` years old" style="padding-left:5px;"></i>
                                    <select class='form-control adult-icon activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='activity_table_detail()'>`;
                                    for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                    text+=`
                                        <option>`+j+`</option>`;
                                    text+=`</select>
                                </div>`;
                   }

                   document.getElementById('pax').innerHTML = text;
                   document.getElementById('details_div').innerHTML = `<input type='hidden' id='details_data' name='details_data' value='`+detail_for_session+`'/>`;
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
                                text+=`<input type="text" class="form-control calendar-logo" id=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' name=perbooking`+i+` />`;
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
                                text+=`<input class="form-control calendar-logo" type="text" id=perbooking`+i+`0 onchange='input_type11_change_perbooking(`+i+`,0)' name=perbooking`+i+`0 />`;
                                text+=`<input type="text" id=perbooking`+i+`1 onchange='input_type11_change_perbooking(`+i+`,1)' name=perbooking`+i+`1 />`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 12){
                                //string country
                                text+=`<input class="form-control" type='text' id=perbooking`+i+` name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' style='display:block'/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 13){
                                //deprecated
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 14){
                                //flight number
                                text+=`<input class="form-control" type='text' id=perbooking`+i+` name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' style='display:block'/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 50){
                                //string validation
                                text+=`<input class="form-control" type='text' id=perbooking`+i+` name=perbooking`+i+` onchange='input_type_change_perbooking(`+i+`)' style='display:block' />`;
                            }
                            text+=`<label>`+activity_type[activity_type_pick].options.perBooking[i].description+`</label><br/>`;
                        }
                    }
                   document.getElementById('perbooking').innerHTML = text;
                   for(i in activity_type[activity_type_pick].options.perBooking){
                        if(activity_type[activity_type_pick].options.perBooking[i].inputType==11)
                            $('#perbooking'+i+'0').daterangepicker({
                                  singleDatePicker: true,
                                  autoUpdateInput: true,
                                  showDropdowns: true,
                                  opens: 'center',
                                  locale: {
                                      format: 'YYYY-MM-DD',
                                  }
                             });
                        else if(activity_type[activity_type_pick].options.perBooking[i].inputType==6)
                            $('#perbooking'+i).daterangepicker({
                                  singleDatePicker: true,
                                  autoUpdateInput: true,
                                  showDropdowns: true,
                                  opens: 'center',
                                  locale: {
                                      format: 'YYYY-MM-DD',
                                  }
                             });

                    }
                    text = '';

                   if(activity_type[activity_type_pick].timeslots.length>0){
                       text += `<div class="col-xs-12" style="padding:5px 0px 0px 15px;">Timeslot</div>
                                <div class="col-xs-12" style="padding:5px 0px 0px 15px;"><select class="form-control" style="width:50%;" name="timeslot_1" id="timeslot_1" onchange="timeslot_change();">`;
                       text += `<option value=''>Please Pick a Timeslot!</option>`;
                       for(j in activity_type[activity_type_pick].timeslots)
                       {
                            text += `<option value="`+activity_type[activity_type_pick].timeslots[j].uuid+`">`+activity_type[activity_type_pick].timeslots[j].startTime+` - `+activity_type[activity_type_pick].timeslots[j].endTime+`</option>`;
                       }

                       text += `</select></div>`;
                   }

                   document.getElementById('timeslot').innerHTML = text;

                   for(i in msg.result.response[0]){
                       if(msg.result.response[0][i].available==true){

                           activity_date_pick = i;
                           event_pick = 0;
                           if(activity_type[activity_type_pick].provider_code == 'globaltix'){
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
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
           $('#loading-detail-activity').hide();
       }
   });
}

function activity_pre_create_booking(){
    Swal.fire({
      title: 'Are you sure you want to issued this order?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.next-loading-issued').addClass("running");
        $('.next-loading-issued').prop('disabled', true);
        activity_create_booking();
      }
    })
}

function activity_create_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'create_booking',
       },
       data: {},
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            document.getElementById('activity_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
            document.getElementById('activity_booking').submit();
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
            if(msg.result.response.no_order_number){
                text = ``;
                voucher_text = ``;
            }
            else{
                if(msg.result.response.status == 'done')
                {
                    conv_status = 'Confirmed';
                }
                else if(msg.result.response.status == 'rejected')
                {
                    conv_status = 'Rejected';
                }
                else{
                    conv_status = 'Pending';
                }

                text = `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="activity_booking_detail" style="padding:15px; background-color:white; border:1px solid #cdcdcd;">
                                    <h4> Activity Order Details </h4>
                                    <hr/>
                                    <h4>`+msg.result.response.name+`</h4>
                                    <span style="font-size: 15px;" aria-hidden="true">Booking Code: `+msg.result.response.pnr+`</span>
                                    <span style="font-size: 15px; float:right;" aria-hidden="true">Status: `+conv_status+`</span>
                                    <br/>
                                </div>
                            </div>
                        </div>
                `;
                text += `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="activity_booking_info" style="padding:15px; margin-top: 15px; background-color:white; border:1px solid #cdcdcd;">
                                    <h4> Activity Information </h4>
                                    <hr/>
                                    <h4>`+msg.result.response.activity.name+`</h4>
                                    <span>`+msg.result.response.activity.type+`</span>
                                    <br/>
                                    <span><i class="fa fa-calendar" aria-hidden="true"></i>
                                        `+msg.result.response.visit_date+`
                                    </span>`;

                if (msg.result.response.timeslot)
                {
                    text += `<br/>
                    <span><i class="fa fa-clock-o" aria-hidden="true"></i>
                        `+msg.result.response.timeslot+`
                    </span>`;
                }

               text += `<br/>
                                </div>
                            </div>
                        </div>

                `;

               if(msg.result.response.booking_options.length > 0){
                    text += `
                        <div class="row" style="margin-top: 15px;">
                        <div class="col-lg-12">
                            <div id="activity_review_perbooking" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                                <div style="padding:15px;">
                                    <h4> Additional Information </h4>
                                    <hr/>
                                    <table style="width:100%;" id="list-of-perbooking" class="list-of-passenger-class">
                                        <tr>
                                            <th style="width:5%;" class="list-of-passenger-left">No</th>
                                            <th style="width:65%;">Information</th>
                                            <th style="width:30%;">Value</th>
                                        </tr>
                    `;
                    temp_seq = 1;
                    for(i in msg.result.response.booking_options){
                        text += `
                            <tr>
                                <td>`+temp_seq+`</td>
                                <td>`+msg.result.response.booking_options[i].name+`</td>
                                <td>`+msg.result.response.booking_options[i].value+`</td>
                            </tr>
                        `;
                        temp_seq += 1;
                    }
                    text += `
                        </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
               }

               if(msg.result.response.contacts.gender == 'female' && msg.result.response.contacts.marital_status == true)
               {
                    title = 'MRS';
               }
               else if(msg.result.response.contacts.gender == 'female' && msg.result.response.contacts.marital_status == false)
               {
                    title = 'MS';
               }
               else
               {
                    title = 'MR';
               }

               text += `
                    <div class="row" style="margin-top: 15px;">
                        <div class="col-lg-12">
                            <div id="activity_review_booker" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                                <div style="padding:15px;">
                                    <h4> Contact Information </h4>
                                    <hr/>
                                    <table style="width:100%;" id="list-of-bookers" class="list-of-passenger-class">
                                        <tr>
                                            <th style="width:5%;" class="list-of-passenger-left">No</th>
                                            <th style="width:45%;">Full Name</th>
                                            <th style="width:25%;">Email</th>
                                            <th style="width:25%;" class="list-of-passenger-right">Mobile Phone</th>
                                        </tr>
                                        <tr>
                                            <td>1</td>
                                            <td>`+title+`. `+msg.result.response.contacts.name+`</td>
                                            <td>`+msg.result.response.contacts.email+`</td>
                                            <td>`+msg.result.response.contacts.phone+`</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
               `;

               text += `
                   <div class="row" style="margin-top: 15px;">
                        <div class="col-lg-12">
                            <div id="activity_review_passenger" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                                <div style="padding:15px;">
                                    <h4> List of Passenger(s) </h4>
                                    <hr/>
                                    <table style="width:100%;" id="list-of-passengers" class="list-of-passenger-class">
                                        <tr>
                                            <th style="width:5%;" class="list-of-passenger-left">No</th>
                                            <th style="width:45%;">Full Name</th>
                                            <th style="width:10%;">Type</th>
                                            <th style="width:25%;">Birth Date</th>
                                            <th style="width:15%;" class="list-of-passenger-right">Ticket</th>
                                        </tr>
               `;

               temp_pax_seq = 1
               for(i in msg.result.response.passengers)
               {
                    text += `
                        <tr>
                            <td>`+temp_pax_seq+`</td>
                            <td>`+msg.result.response.passengers[i].name+`</td>
                            <td>`+msg.result.response.passengers[i].pax_type+`</td>
                            <td>`+msg.result.response.passengers[i].birth_date+`</td>
                            <td>`+msg.result.response.passengers[i].sku_name+`</td>
                        </tr>
                    `;
                    temp_pax_seq += 1;
               }

               text += `
                                     </table>
                                </div>
                            </div>
                        </div>
                    </div>
               `;

               voucher_text = `<button class="primary-btn hold-seat-booking-train" type="button" onclick="activity_get_voucher()" style="width:100%;">
                                Voucher
                            </button>`;
            }
            document.getElementById('activity_final_info').innerHTML = text;
            document.getElementById('voucher').innerHTML = voucher_text;

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

           if(msg.result.response.price_itinerary.additional_charge_total)
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
                    <input type="button" class="primary-btn-ticket" data-toggle="modal" data-target="#copiedModal" onclick="copy_data();" value="Copy" style="width:100%;"/>
               </div>
             </div>
             <div class="row" style="margin:10px 0px 10px 0px; text-align:center;">
               <div class="col-xs-12">
                    <input type="button" class="primary-btn-ticket" id="show_commission_button" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
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
    $('#'+val).daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          showDropdowns: true,
          opens: 'center',
          locale: {
              format: 'YYYY-MM-DD',
          }
     });
}