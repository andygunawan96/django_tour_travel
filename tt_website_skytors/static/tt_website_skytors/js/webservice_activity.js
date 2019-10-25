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
high_price_slider = 0;
step_slider = 0;

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
           activity_signature = msg.result.response.signature;
           signature = msg.result.response.signature;
           if(data == ''){
               activity_search()
           }else if(data != ''){
               activity_get_booking(data);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          $('#loading-search-activity').hide();
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity login </span>' + errorThrown,
            })
       },timeout: 60000
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
          'offset': offset,
          'signature': activity_signature
       },
       success: function(msg) {
        console.log(msg);
           var text = '';
           var counter = 0;
           document.getElementById('activity_ticket').innerHTML = "";
           data=[];
           if(msg.result.error_code == 0){
               activity_data = msg.result.response;
               $('#loading-search-activity').hide();
               if (activity_data.length == 0)
               {
                    text += `
                    <div class="col-lg-12">
                        <div style="text-align:center">
                            <img src="/static/tt_website_skytors/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="" title="" />
                            <br/>
                        </div>
                        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
                    </div>`;
               }
               for(i in activity_data){
                   if(high_price_slider < activity_data[i].activity_price){
                        high_price_slider = activity_data[i].activity_price;
                    }

                   if (activity_data[i].images.length > 0)
                   {
                       img_src = activity_data[i].images[0].url+activity_data[i].images[0].path;
                   }
                   else
                   {
                       img_src = static_path_url_server+`/public/tour_packages/not_found.png`;
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
                                    <div class="thumb relative" style="margin: auto; width:100%; height:200px; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
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
                                                    <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(activity_data[i].activity_price)+`  </span>
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

               if(high_price_slider <= 1000000){
                step_slider = 50000;
               }
               else if(high_price_slider > 1000000 && high_price_slider <= 10000000 ){
                step_slider = 100000;
               }
               else{
                step_slider = 200000;
               }
               document.getElementById("price-to").value = high_price_slider;
               $maxPrice = high_price_slider;
               $(".js-range-slider").data("ionRangeSlider").update({
                    from: 0,
                    to: high_price_slider,
                    min: 0,
                    max: high_price_slider,
                    step: step_slider
               });
               $(".js-range-slider").data("ionRangeSlider").reset();

               offset++;
               document.getElementById('activity_ticket').innerHTML += text;
               if(msg.result.response.length!=0)
                   get_new = true;
           }else{
              $('#loading-search-activity').hide();
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error activity search </span>' + msg.result.error_msg,
                })
              text += `
              <div class="col-lg-12">
                  <div style="text-align:center">
                      <img src="/static/tt_website_skytors/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="" title="" />
                      <br/>
                  </div>
                  <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
              </div>`;
              document.getElementById('activity_ticket').innerHTML += text;
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          $('#loading-search-activity').hide();
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity search </span>' + errorThrown,
            })

          text += `
          <div class="col-lg-12">
              <div style="text-align:center">
                  <img src="/static/tt_website_skytors/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="" title="" />
                  <br/>
              </div>
              <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
          </div>`;
          document.getElementById('activity_ticket').innerHTML += text;
       },timeout: 120000
    });
}

function activity_get_detail(uuid){
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
          'signature': activity_signature
       },
       success: function(msg) {
           try{
               console.log(msg);
               if(msg.result.error_code == 0){
                   activity_type = msg.result.response;
                   var counti = 0;
                   var temp = ``;
                   for(i in activity_type){
                       if (counti == 0){
                           temp += `
                           <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                               <input type="radio" class="activity" name="product_type" autocomplete="off" checked="checked"/><span>`+activity_type[i].name+`</span>
                           </label>
                       `;
                       }
                       else {
                           temp += `
                           <label class="btn btn-activity" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
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
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error activity detail </span>' + msg.result.error_msg,
                        })
                      var temp = ``;
                      temp += `
                      <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                          <span>No product type available</span>
                      </label>`;
                      $('#ticket_type').html(temp);
                   }catch(err){
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error customer list </span>' + msg.error_msg,
                        })
                      var temp = ``;
                      temp += `
                      <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                          <span>No product type available</span>
                      </label>`;
                      $('#ticket_type').html(temp);
                   }
               }
           }catch(err){
               try{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error customer list </span>' + msg.error_msg,
                    })
                  var temp = ``;
                  temp += `
                  <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                      <span>No product type available</span>
                  </label>`;
                  $('#ticket_type').html(temp);
               }catch(err){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error activity detail </span>' + msg.result.error_msg,
                    })
                  var temp = ``;
                  temp += `
                  <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
                      <span>No product type available</span>
                  </label>`;
                  $('#ticket_type').html(temp);
               }
           }


       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity detail </span>' + errorThrown,
            })
          var temp = ``;
          temp += `
          <label class="btn btn-activity active" style="z-index:1 !important; margin: 0px 5px 5px 0px;" title="`+activity_type[i].name+`" onclick="activity_get_price(`+parseInt(i)+`, false);">
              <span>No product type available</span>
          </label>`;
          $('#ticket_type').html(temp);
       },timeout: 60000
    });
}

function activity_get_price(val, bool){
    if(parseInt(activity_type_pick) != val || bool == true){
        activity_type_pick = val;
        document.getElementById('product_type_title').innerHTML = activity_type[activity_type_pick].name;

        text = '';
        if(activity_type[activity_type_pick].voucher_validity != ''){
           text+=`<h4 style="padding:0 15px;">Validity</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].voucher_validity+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherUse != ''){
           text+=`<h4 style="padding:0 15px;">Voucher Use</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].voucherUse+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherRedemptionAddress != ''){
           text+=`<h4 style="padding:0 15px;">Voucher Address</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].voucherRedemptionAddress+`</p>`;
        }
        if(activity_type[activity_type_pick].voucherRequiresPrinting != ''){
           text+=`<h4 style="padding:0 15px;">Voucher Print</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].voucherRequiresPrinting+`</p>`;
        }
        if(activity_type[activity_type_pick].cancellationPolicies != ''){
           text+=`<h4 style="padding:0 15px;">Cancellation Policies</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].cancellationPolicies+`</p>`;
        }

        document.getElementById('vouchers').innerHTML = text;
        document.getElementById('date').innerHTML = `
            <div class="col-lg-6 form-group departure_date">
                <label id="departure_date_activity_label" for="activity_date"><span style="color:red;">* </span><i class="fas fa-calendar-alt"></i> Visit Date</label>
                <input id="activity_date" name="activity_date" onchange="activity_get_price_date(`+activity_type_pick+`, `+pricing_days+`);" class="form-control" style="margin-bottom:unset;" type="text" placeholder="Please Select a Date" autocomplete="off" readonly/>
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
    document.getElementById('activity_detail_next_btn2').innerHTML = '';
    document.getElementById('pax').innerHTML = '';
    document.getElementById('event').innerHTML = '';
    document.getElementById('timeslot').innerHTML = '';
    document.getElementById('perbooking').innerHTML = '';
    document.getElementById('instantConfirmation').innerHTML = '';
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
          'startingDate': startingDate,
          'signature': activity_signature
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
                        text+= `<div class="col-lg-3">
                            <input type="hidden" id="sku_id" name="sku_id" value="`+activity_type[activity_type_pick].skus[i].sku_id+`"/>
                            <label>`+activity_type[activity_type_pick].skus[i].title+`</label>
                            <div class="input-container-search-ticket">
                                <div class="form-select" style="margin-bottom:5px;">
                                    <select class='activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='activity_table_detail()'>`;
                                    for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                    text+=`
                                        <option>`+j+`</option>`;
                                    text+=`</select>
                                </div>
                            </div>`;
                        if(activity_type[activity_type_pick].skus[i].minAge != null)
                        {
                            text+= `<small id="activity_age_range`+i+`" class="hidden">(`+activity_type[activity_type_pick].skus[i].minAge+` - `+activity_type[activity_type_pick].skus[i].maxAge+` years old)</small>
                                    <input type="hidden" id="`+low_sku_id+`_min_age" name="`+low_sku_id+`_min_age" value="`+activity_type[activity_type_pick].skus[i].minAge+`"/>
                                    <input type="hidden" id="`+low_sku_id+`_max_age" name="`+low_sku_id+`_max_age" value="`+activity_type[activity_type_pick].skus[i].maxAge+`"/>`;
                        }
                        text+= `</div>`;
                   }
                   document.getElementById('pax').innerHTML = text;
                   $('select').niceSelect();
                   document.getElementById('details_div').innerHTML = `<input type='hidden' id='details_data' name='details_data' value='`+detail_for_session+`'/>`;
                   text = '';
                   for(i in activity_type[activity_type_pick].options.perBooking){
                        if(activity_type[activity_type_pick].options.perBooking[i].name != 'Guest age' &&
                           activity_type[activity_type_pick].options.perBooking[i].name != 'Full name' &&
                           activity_type[activity_type_pick].options.perBooking[i].name != 'Gender' &&
                           activity_type[activity_type_pick].options.perBooking[i].name != 'Nationality' &&
                           activity_type[activity_type_pick].options.perBooking[i].name != 'Date of birth'){
                            text+=`<div class="col-lg-12" style="margin-bottom:10px;">`
                            text+=`<span style='display:block;'>`+activity_type[activity_type_pick].options.perBooking[i].name+`</span>`;
                            if(activity_type[activity_type_pick].options.perBooking[i].inputType == 1){
                                //selection button
                                text+=`
                                <div class="form-select" style="margin-bottom: unset;">
                                <select id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type1_change_perbooking(`+i+`)'>`;
                                for(j in activity_type[activity_type_pick].options.perBooking[i].items){
                                    text+=`<option value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`">`+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</option>`;
            //                        text+=`<label style="width:20%">
            //                               <input type="radio" id="perbooking`+i+`" name="perbooking`+i+`" value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`" onchange='input_type1_change_perbooking(`+i+`,`+j+`)' />`+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</label>`;
                                }
                                text+=`</select></div>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 2){
                                //checkbox
                                for(j in activity_type[activity_type_pick].options.perBooking[i].items){
                                    text+=`
                                            <label class="check_box_custom">
                                                <span style="font-size:13px;">`+activity_type[activity_type_pick].options.perBooking[i].items[j].label+`</span>
                                                <input type="checkbox" id="perbooking`+i+j+`" name="perbooking`+i+j+`" onchange="input_type2_change_perbooking(`+i+`,`+j+`)" value="`+activity_type[activity_type_pick].options.perBooking[i].items[j].value+`">
                                                <span class="check_box_span_custom"></span>
                                            </label>
                                    `;
                                }
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 3){
                                //number validation
                                text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 4){
                                //string validation
                                text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;' />`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 5){
                                //boolean checkbox true false
                                text+=`<input type="checkbox" id="perbooking`+i+`"  name="perbooking`+i+`" onchange='input_type5_change_perbooking(`+i+`)' style='margin-bottom: unset;'/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 6){
                                //date
                                text+=`<input type="text" style="margin-bottom: unset;" class="form-control" id="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' name="perbooking`+i+`" />`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 7){
                                //file //pdf
                                text+=`<input type="file" accept="application/JSON, application/pdf" onchange='input_type_change_perbooking(`+i+`)' required="" name="perbooking`+i+`" id="perbooking`+i+`" style="margin-bottom: unset;"/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 8){
                                //image
                                text+=`<input type="file" accept="image/*" required="" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' id="perbooking`+i+`" style="margin-bottom: unset;"/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 9){
                                //address no validation maybe from bemyguest
                                text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 10){
                                //time validation
                                text+=`<input type="time" style="width:100%;height:20px;" id="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' name="perbooking`+i+`" />`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 11){
                                //datetime validation
                                text+=`<input class="form-control" type="text" id="perbooking`+i+`" onchange='input_type11_change_perbooking(`+i+`)' name="perbooking`+i+`" style="margin-bottom: unset;"/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 12){
                                //string country
                                text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 13){
                                //deprecated
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 14){
                                //flight number
                                text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 50){
                                //string validation
                                text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                            }
                            text+=`<span>`+activity_type[activity_type_pick].options.perBooking[i].description+`</span><br/></div>`;
                        }
                    }
                   document.getElementById('perbooking').innerHTML = text;
                   for(i in activity_type[activity_type_pick].options.perBooking){
                        if(activity_type[activity_type_pick].options.perBooking[i].inputType==11)
                            $('#perbooking'+i).daterangepicker({
                                  timePicker: true,
                                  singleDatePicker: true,
                                  autoUpdateInput: true,
                                  showDropdowns: true,
                                  opens: 'center',
                                  locale: {
                                      format: 'YYYY-MM-DD hh:mm',
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
                       text += `<div class="col-xs-12">Timeslot</div>
                                <div class="col-xs-12">
                                <div class="form-select">
                                <select style="width:100%;" name="timeslot_1" id="timeslot_1" onchange="timeslot_change();">`;
                       text += `<option value=''>Please Pick a Timeslot!</option></div>`;
                       for(j in activity_type[activity_type_pick].timeslots)
                       {
                            var newStartTime = activity_type[activity_type_pick].timeslots[j].startTime;
                            var newEndTime = activity_type[activity_type_pick].timeslots[j].endTime;
                            if(newStartTime.split(":").length > 2)
                            {
                                newStartTime = newStartTime.split(":")[0].toString() + ":" + newStartTime.split(":")[1].toString();
                            }
                            if(newEndTime.split(":").length > 2)
                            {
                                newEndTime = newEndTime.split(":")[0].toString() + ":" + newEndTime.split(":")[1].toString();
                            }
                            text += `<option value="`+activity_type[activity_type_pick].timeslots[j].uuid+`">`+newStartTime+` - `+newEndTime+`</option>`;
                       }
                       text += `</select></div>`;
                   }
                   document.getElementById('timeslot').innerHTML = text;
                   $('select').niceSelect();

                   if(activity_type[activity_type_pick].instantConfirmation){
                        ins_text = `<span style="font-weight:700;">Instant Confirmation</span>`;
                   }
                   else{
                        ins_text = `<span style="font-weight:700; color:red;">On Request (max 3 working days)</span>`;
                   }
                   document.getElementById('instantConfirmation').innerHTML = ins_text;

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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity price date </span>' + errorThrown,
            })
           $('#loading-detail-activity').hide();
       },timeout: 60000
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
        show_loading();
        update_sell_activity();
      }
    })
}

function update_sell_activity(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'sell_activity',
       },
       data: {
           'signature': activity_signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            update_contact_activity();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update sell activity </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update sell activity </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function update_contact_activity(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'update_contact',
       },
       data: {
           'signature': activity_signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            update_passengers_activity();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update contact activity </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update contact activity </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function update_passengers_activity(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'update_passengers',
       },
       data: {
           'signature': activity_signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            update_options_activity();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update passengers activity </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update passengers activity </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function update_options_activity(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'update_options',
       },
       data: {
           'signature': activity_signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            activity_commit_booking();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update options activity </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update options activity </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function activity_commit_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'commit_booking',
       },
       data: {
            'seq_id': payment_acq2[payment_method][selected].seq_id,
            'member': payment_acq2[payment_method][selected].method,
            'signature': activity_signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            document.getElementById('activity_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
            document.getElementById('activity_booking').submit();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error activity create booking </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity create booking </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function copy_data(){
    const el = document.createElement('textarea');
    el.value = $test;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

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

function show_repricing(){
    $("#myModalRepricing").modal();
}

function update_service_charge(data){
    upsell = []
    for(i in act_get_booking.result.response.passengers){
        for(j in act_get_booking.result.response.passengers[i].sale_service_charges){
            currency = act_get_booking.result.response.passengers[i].sale_service_charges[j].FARE.currency;
        }
        list_price = []
        for(j in list){
            if(act_get_booking.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                list_price.push({
                    'amount': list[j],
                    'currency_code': currency
                });
            }

        }
        console.log(act_get_booking.result.response.passengers[i]);
        upsell.push({
            'sequence': act_get_booking.result.response.passengers[i].sequence,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'update_service_charge',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
           'order_number': JSON.stringify(act_order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                activity_get_booking(act_order_number);
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error activity update service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity update service charge </span>' + errorThrown,
            })
       },timeout: 60000
    });
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
           'order_number': data,
           'signature': activity_signature
       },
       success: function(msg) {
       act_order_number = data;
       act_get_booking = msg;
       $('#loading-search-activity').hide();
        if(msg.result.error_code == 0){
            if(msg.result.response.no_order_number){
                text = ``;
                voucher_text = ``;
            }
            else{
                if(msg.result.response.status == 'done'){
                    conv_status = 'Confirmed';
                    console.log(msg.result.response);
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                }
                else if(msg.result.response.status == 'rejected'){
                    conv_status = 'Rejected';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Rejected`;
                }
                else if(msg.result.response.status == 'cancel'){
                    conv_status = 'Cancelled';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
                }
                else if(msg.result.response.status == 'cancel2'){
                    conv_status = 'Expired';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                }
                else{
                    conv_status = 'Pending';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-pending");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-pending");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-clock"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Pending`;
                }

                text = `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="activity_booking_detail" style="border:1px solid #cdcdcd; padding:10px; background-color:white">
                                    <h6>Order Number : `+msg.result.response.name+`</h6><br/>
                                     <table style="width:100%;">
                                        <tr>
                                            <th>PNR</th>
                                            <th>Status</th>
                                        </tr>
                                        <tr>
                                            <td>`+msg.result.response.pnr+`</td>
                                            <td>`+conv_status+`</td>
                                        </tr>
                                     </table>
                                </div>
                            </div>
                        </div>
                `;
                text += `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="activity_booking_info" style="padding:10px; margin-top: 15px; background-color:white; border:1px solid #cdcdcd;">
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
                                <div style="padding:10px;">
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

               if(msg.result.response.contacts.gender == 'female' && msg.result.response.contacts.marital_status == 'married')
               {
                    title = 'MRS';
               }
               else if(msg.result.response.contacts.gender == 'female' && msg.result.response.contacts.marital_status != 'married')
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
                                <div style="padding:10px;">
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
                                <div style="padding:10px;">
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
                            <td>`+msg.result.response.passengers[i].title+`. `+msg.result.response.passengers[i].name+`</td>
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
                    <div class="row" style="margin-top: 20px;">
                        <div class="col-lg-4" id="voucher" style="padding-bottom:10px;">`;
               if(msg.result.response.status == 'done'){
                    if (msg.result.response.voucher_url)
                    {
                        text += `<button class="primary-btn hold-seat-booking-train" type="button" onclick="window.open('`+msg.result.response.voucher_url+`');" style="width:100%;">
                                    Print Ticket
                                 </button>`;
                    }
                    else
                    {
                        text += `<button class="primary-btn hold-seat-booking-train" type="button" onclick="activity_get_voucher('`+msg.result.response.name+`');" style="width:100%;">
                                    Print Ticket
                                </button>`;
                    }
               }
               text += `</div>
                        <div class="col-lg-4" style="padding-bottom:10px;">
                            <button class="primary-btn hold-seat-booking-train" type="button" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.activity/`+msg.result.response.name+`/1')" style="width:100%;">
                                Print Itinerary Form
                            </button>
                        </div>
                        <div class="col-lg-4" style="padding-bottom:10px;">
                            <button class="primary-btn hold-seat-booking-train" type="button" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.activity/`+msg.result.response.name+`/4')" style="width:100%;">
                                Print Invoice
                            </button>
                        </div>
                    </div>
               `;
            }
            document.getElementById('activity_final_info').innerHTML = text;
            document.getElementById('product_title').innerHTML = msg.result.response.activity.name;
            document.getElementById('product_type_title').innerHTML = msg.result.response.activity.type;

            price_text = '';
            $test = msg.result.response.activity.name+'\n'+msg.result.response.activity.type+
           '\nVisit Date : '+msg.result.response.visit_date+'\n\n';

            //detail
            text = '';
            tax = 0;
            fare = 0;
            total_price = 0;
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX'];

            //repricing
            type_amount_repricing = ['Repricing'];
            //repricing
            counter_service_charge = 0;
            $test += '\nPrice:\n';
            for(i in msg.result.response.passengers[0].sale_service_charges){
                price_text+=`
                    <div style="text-align:left">
                        <span style="font-weight:500; font-size:14px;">PNR: `+i+` </span>
                    </div>`;
                for(j in msg.result.response.passengers){
                    price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0};
                    for(k in msg.result.response.passengers[j].sale_service_charges[i]){
                        price[k] += msg.result.response.passengers[j].sale_service_charges[i][k].amount;
                        price['currency'] = msg.result.response.passengers[j].sale_service_charges[i][k].currency;
                    }
                    try{
                        price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;

                    }catch(err){

                    }
                    //repricing
                    check = 0;
                    for(k in pax_type_repricing){
                        if(pax_type_repricing[k][0] == msg.result.response.passengers[j].name)
                            check = 1;
                    }
                    if(check == 0){
                        pax_type_repricing.push([msg.result.response.passengers[j].name, msg.result.response.passengers[j].name]);
                        price_arr_repricing[msg.result.response.passengers[j].name] = {
                            'Fare': price['FARE'],
                            'Tax': price['TAX'] + price['ROC'],
                            'Repricing': price['CSC']
                        }
                    }else{
                        price_arr_repricing[msg.result.response.passengers[j].name] = {
                            'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'],
                            'Tax': price_arr_repricing[msg.result.response.passengers[j].name]['Tax'] + price['TAX'] + price['ROC'],
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
                    for(k in price_arr_repricing){
                       text_repricing += `
                       <div class="col-lg-12">
                            <div style="padding:5px;" class="row" id="adult">
                                <div class="col-lg-3" id="`+k+`_`+i+`">`+k+`</div>
                                <div class="col-lg-3" id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                                if(price_arr_repricing[k].Repricing == 0)
                                text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">-</div>`;
                                else
                                text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                                text_repricing+=`<div class="col-lg-3" id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                            </div>
                        </div>`;
                    }
                    text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                    document.getElementById('repricing_div').innerHTML = text_repricing;
                    //repricing

                    price_text+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Fare</span>`;
                        price_text+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Tax</span>`;
                        price_text+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;

                        $test += msg.result.response.passengers[j].name + ' Fare ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.FARE))+'\n';
                        if(counter_service_charge == 0){
                            $test += msg.result.response.passengers[j].name + ' Tax ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+'\n';
                        price_text+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>`;
                        }else{
                            $test += msg.result.response.passengers[j].name + ' Tax ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC))+'\n';
                            price_text+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC))+`</span>`;
                        }
                        price_text+=`
                        </div>
                    </div>`;
                    if(counter_service_charge == 0)
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC);
                    else
                        total_price += parseInt(price.TAX + price.ROC + price.FARE);
                    commission += parseInt(price.RAC);
                }
                counter_service_charge++;
            }

//           if(msg.result.response.price_itinerary.additional_charge_total)
//           {
//                price_text+= `
//                    <div class="row">
//                        <div class="col-xs-8">Additional Charge</div>
//                        <div class="col-xs-3" style="padding-right: 0; text-align: right;" id='additional_price'>`+msg.result.response.price_itinerary.additional_charge_total+`</div>
//                    </div>
//                `;
//                $test += 'Additional price IDR '+getrupiah(msg.result.response.price_itinerary.additional_charge_total)+'\n';
//           }

           price_text+= `
             <hr style="padding:0px;">
             <div class="row">
                  <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                       <span style="font-weight:bold">Grand Total</span>
                  </div>
                  <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                       <span style="font-weight:bold">IDR `+getrupiah(Math.ceil(total_price))+`</span>
                  </div>
             </div>
             <div style="text-align:right; padding-bottom:10px; margin-top:10px;"><img src="/static/tt_website_skytors/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>
             <div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        price_text+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
                    } else {
                        price_text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
                    }

                price_text+=`
                </div>
             </div>
             <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(parseInt(commission)*-1)+`</span><br>
                    </div>
                </div>
             </div>

             <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-xs-12">
                    <input type="button" class="primary-btn-ticket" onclick="copy_data();" value="Copy" style="width:100%;"/>
               </div>
             </div>
             <div class="row" style="margin-top:10px; text-align:center;">
               <div class="col-xs-12">
                    <input type="button" class="primary-btn-ticket" id="show_commission_button" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
               </div>
             </div>
           `;
            $test+= '\nGrand Total : IDR '+ getrupiah(Math.ceil(total_price))+'\nPrices and availability may change at any time';
            document.getElementById('activity_detail_table').innerHTML = price_text;
            add_repricing();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error activity booking </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity booking </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function activity_get_voucher(order_number){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_voucher',
       },
       data: {
            'order_number': order_number,
            'signature': activity_signature
       },
       success: function(msg) {
       console.log(msg)
        if(msg.result.error_code == 0){
            window.open(msg.result.response[0].name,'_blank');
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error activity voucher </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity voucher </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function activity_search_autocomplete(term,suggest){
    clearTimeout(activityAutoCompleteVar);
    term = term.toLowerCase();
    console.log(term);
    check = 0;
    var priority = [];

    getToken();
    activityAutoCompleteVar = setTimeout(function() {
        $.ajax({
           type: "POST",
           url: "/webservice/activity",
           headers:{
                'action': 'get_auto_complete',
           },
    //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
           data: {
                'name':term,
           },
           success: function(msg) {
            activity_choices = msg;
            suggest(activity_choices);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               alert(errorThrown);
           }
        });
    }, 150);
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