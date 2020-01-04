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
low_price_slider = 99999999;
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
       data: {
          'sort': 'price_asc',
          'limit': 20,
          'offset': offset
       },
       success: function(msg) {

           if(msg.result.error_code == 0){
               signature = msg.result.response.signature;
               if(data == ''){
                   activity_search()
               }else if(data != ''){
                   activity_get_booking(data);
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $('#loading-search-activity').hide();
               }catch(err){}
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

function get_activity_config(type, val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_data',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            activity_country = [];
            sub_category = {};

            var country_selection = document.getElementById('activity_countries');
            var type_selection = document.getElementById('activity_type');
            var category_selection = document.getElementById('activity_category');

            for(i in msg.activity_countries){
                var city = [];
                for(j in msg.activity_countries[i].city.response)
                {
                    city.push({
                        'name': msg.activity_countries[i].city.response[j].name,
                        'id': msg.activity_countries[i].city.response[j].id
                    });
                }
                activity_country.push({
                    'city': city,
                    'name': msg.activity_countries[i].name,
                    'id': msg.activity_countries[i].id
                });
            }

            for (key in msg.activity_sub_categories)
            {
                if (msg.activity_sub_categories.hasOwnProperty(key)) {
                    var sub_category_list = [];
                    var name = '';
                    for (i in msg.activity_sub_categories[key])
                    {
                        name = msg.activity_sub_categories[key][i].name;
                        if(name.search('amp;') !== -1){
                            name = name.replace(/&amp;/g, '&');
                        }
                        sub_category_list.push({
                            'name': name,
                            'id': msg.activity_sub_categories[key][i].id
                        });
                    }
                    sub_category[key.replace(/&amp;/g, '&')] = sub_category_list;
                }
            }

            country_txt = '';
            type_txt = '';
            category_txt = '';
            if(type == 'search')
            {
                if (parsed_country == 0)
                {
                    country_txt += `<option value="" selected="">All Countries</option>`;
                }
                else
                {
                    country_txt += `<option value="">All Countries</option>`;
                }
                for(i in activity_country)
                {
                    if (activity_country[i].id == parsed_country)
                    {
                        country_txt += `<option value="`+activity_country[i].id+`" selected>`+activity_country[i].name+`</option>`;
                        document.getElementById('search_country_name').innerHTML = activity_country[i].name;
                    }
                    else
                    {
                        country_txt += `<option value="`+activity_country[i].id+`">`+activity_country[i].name+`</option>`;
                    }
                }

                if (parsed_type == 0)
                {
                    type_txt += `<option value="0" selected="">All Types</option>`;
                }
                else
                {
                    type_txt += `<option value="0">All Types</option>`;
                }
                for(i in msg.activity_types)
                {
                    if (msg.activity_types[i].id == parsed_type)
                    {
                        type_txt += `<option value="`+msg.activity_types[i].id+`" selected>`+msg.activity_types[i].name+`</option>`;
                        document.getElementById('search_type_name').innerHTML = msg.activity_types[i].name;
                    }
                    else
                    {
                        type_txt += `<option value="`+msg.activity_types[i].id+`">`+msg.activity_types[i].name+`</option>`;
                    }
                }

                if (parsed_category == 0)
                {
                    category_txt += `<option value="0" selected="">All Categories</option>`;
                }
                else
                {
                    category_txt += `<option value="0">All Categories</option>`;
                }
                for(i in msg.activity_categories)
                {
                    if (msg.activity_categories[i].id == parsed_category)
                    {
                        category_txt += `<option value="`+msg.activity_categories[i].id+` - `+msg.activity_categories[i].name+`" selected>`+msg.activity_categories[i].name+`</option>`;
                        document.getElementById('search_category_name').innerHTML = msg.activity_categories[i].name;
                    }
                    else
                    {
                        category_txt += `<option value="`+msg.activity_categories[i].id+` - `+msg.activity_categories[i].name+`">`+msg.activity_categories[i].name+`</option>`;
                    }
                }
            }
            else
            {
                country_txt += `<option value="" selected="">All Countries</option>`;
                for(i in activity_country)
                {
                    country_txt += `<option value="`+activity_country[i].id+`">`+activity_country[i].name+`</option>`;
                }

                type_txt += `<option value="0" selected="">All Types</option>`;
                for(i in msg.activity_types)
                {
                    type_txt += `<option value="`+msg.activity_types[i].id+`">`+msg.activity_types[i].name+`</option>`;
                }

                category_txt += `<option value="0" selected="">All Categories</option>`;
                for(i in msg.activity_categories)
                {
                    category_txt += `<option value="`+msg.activity_categories[i].id+` - `+msg.activity_categories[i].name+`">`+msg.activity_categories[i].name+`</option>`;
                }
            }
            if(country_txt != ''){
                document.getElementById('activity_countries').innerHTML = country_txt;
                $('#activity_countries').niceSelect('update');
            }
            if(type_txt != ''){
                type_selection.innerHTML = type_txt;
                $('#activity_type').niceSelect('update');
            }
            if(category_txt != ''){
                category_selection.innerHTML = category_txt;
                $('#activity_category').niceSelect('update');
            }

            country_selection.setAttribute("onchange", "auto_complete_activity('activity_countries');");
            category_selection.setAttribute("onchange", "auto_complete_activity('activity_category');");
            if(type == 'search')
            {
                if (parsed_country)
                {
                    auto_complete_activity('activity_countries', parsed_city);
                    get_city_search_name(parsed_city);
                }
                if (parsed_category)
                {
                    auto_complete_activity('activity_category', parsed_sub_category);
                    get_sub_cat_name(parsed_sub_category);
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity config </span>' + errorThrown,
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
       data: {
          'sort': 'price_asc',
          'limit': 20,
          'offset': offset,
          'signature': signature
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
                            <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="" title="" />
                            <br/>
                        </div>
                        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
                    </div>`;
               }
               for(i in activity_data){
                   if(high_price_slider < activity_data[i].activity_price){
                        high_price_slider = activity_data[i].activity_price;
                    }

                   if(low_price_slider > activity_data[i].activity_price){
                        low_price_slider = activity_data[i].activity_price;
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
                            <input id='sequence' name='sequence' type=hidden value='`+activity_data[i].sequence+`'/>`;

                            if(template == 1){
                                text+=`
                                <div class="single-recent-blog-post item activity_box" title="`+activity_data[i].name+`" style="cursor:pointer;" onclick="go_to_detail('`+activity_data[i].sequence+`')">
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
                                                    <span class="span-activity-desc" style="font-size:13px;"> `+activity_data[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+activity_data[i].reviewCount+` reviews)</span>
                                                    <br/><br/>
                                                    </div>
                                                    <div class="col-lg-12" style="text-align:right;">
                                                        <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(activity_data[i].activity_price)+`  </span>
                                                        <button type="button" class="primary-btn" onclick="go_to_detail('`+activity_data[i].sequence+`')">BUY</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            }else{
                                text+=`
                                <div class="single-post-area mb-30 activity_box" title="`+activity_data[i].name+`" style="cursor:pointer;" onclick="go_to_detail('`+activity_data[i].sequence+`')">
                                    <div class="single-destination relative">
                                        <div class="thumb relative" style="margin: auto; width:100%; height:200px; background-image: url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: 100%; 100%;">
                                            <div class="overlay overlay-bg"></div>
                                            <img class="img-fluid" src="`+img_src+`" alt="" style="margin: auto; width:100%; height:100%; overflow: auto; object-fit: cover;">
                                        </div>
                                        <div class="card card-effect-promotion">
                                            <div class="card-body" style="padding:15px;">
                                                <div class="row details">
                                                    <div class="col-lg-12" style="text-align:left;">
                                                        <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+activity_data[i].name+`">`+activity_data[i].name+`</h6>`;
                                                        for(j in activity_data[i].locations) {
                                                            text+=`
                                                                <span class="span-activity-desc" style="font-size:13px;"> <i style="color:red !important;" class="fas fa-map-marker-alt"></i> `+activity_data[i].locations[j].city_name+`, `+activity_data[i].locations[j].country_name+` </span>
                                                                <br/>`;
                                                        }
                                                    text+=`
                                                    <span class="span-activity-desc" style="font-size:13px;"> `+activity_data[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+activity_data[i].reviewCount+` reviews)</span>
                                                    <br/><br/>
                                                    </div>
                                                    <div class="col-lg-12" style="text-align:right;">
                                                        <span style="font-size:13px;font-weight:bold;">IDR `+getrupiah(activity_data[i].activity_price)+`</span><br/>
                                                        <button href="#" class="primary-btn" onclick="go_to_detail('`+activity_data[i].sequence+`')">BUY</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            }
                            text+=`
                       </form>
                   </div>`;
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
               $minPrice = low_price_slider;
               $maxPrice = high_price_slider;
               $(".js-range-slider").data("ionRangeSlider").update({
                    from: low_price_slider,
                    to: high_price_slider,
                    min: low_price_slider,
                    max: high_price_slider,
                    step: step_slider
               });
               $(".js-range-slider").data("ionRangeSlider").reset();

               $(".js-range-slider2").data("ionRangeSlider").update({
                    from: low_price_slider,
                    to: high_price_slider,
                    min: low_price_slider,
                    max: high_price_slider,
                    step: step_slider
               });
               $(".js-range-slider2").data("ionRangeSlider").reset();

               offset++;
               document.getElementById('activity_ticket').innerHTML += text;

               var items = $(".activity_box");
               var numItems = items.length;
               var perPage = 21;
               items.slice(perPage).hide();
               $('#pagination-container').pagination({
                   items: numItems,
                   itemsOnPage: perPage,
                   prevText: "<i class='fas fa-angle-left'/>",
                   nextText: "<i class='fas fa-angle-right'/>",
                   onPageClick: function (pageNumber) {
                       var showFrom = perPage * (pageNumber - 1);
                       var showTo = showFrom + perPage;
                       items.hide().slice(showFrom, showTo).show();
                       $('#pagination-container2').pagination('drawPage', pageNumber);
                   }
               });

               $('#pagination-container2').pagination({
                   items: numItems,
                   itemsOnPage: perPage,
                   prevText: "<i class='fas fa-angle-left'/>",
                   nextText: "<i class='fas fa-angle-right'/>",
                   onPageClick: function (pageNumber) {
                       var showFrom = perPage * (pageNumber - 1);
                       var showTo = showFrom + perPage;
                        items.hide().slice(showFrom, showTo).show();
                       $('#pagination-container').pagination('drawPage', pageNumber);
                   }
               });
               $('#pagination-container').show();
               $('#pagination-container2').show();
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
                      <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="" title="" />
                      <br/>
                  </div>
                  <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
              </div>`;
              document.getElementById('activity_ticket').innerHTML += text;
              $('#pagination-container').hide();
              $('#pagination-container2').hide();
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
                  <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" style="width:70px; height:70px;" alt="" title="" />
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
       data: {
          'uuid': uuid,
          'signature': signature
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
        if(document.getElementById('product_title').innerHTML != activity_type[activity_type_pick].name)
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
           text+=`<h4 style="padding:0 15px;">Voucher Type</h4>`;
           if(activity_type[activity_type_pick].voucherRequiresPrinting)
           {
                text+=`<p style="padding:0 15px;">Physical voucher is required. Please print the voucher before your visit!</p>`;
           }
           else
           {
                text+=`<p style="padding:0 15px;">You can use either physical or electronic voucher.</p>`;
           }
        }
        if(activity_type[activity_type_pick].cancellationPolicies != ''){
           text+=`<h4 style="padding:0 15px;">Cancellation Policies</h4>
                <p style="padding:0 15px;">`+activity_type[activity_type_pick].cancellationPolicies+`</p>`;
        }

        document.getElementById('vouchers').innerHTML = text;
        document.getElementById('date').innerHTML = `
            <div class="col-lg-6 form-group departure_date">
                <label id="departure_date_activity_label" for="activity_date"><span style="color:red;">* </span><i class="fas fa-calendar-alt"></i> Visit Date</label>
                <input id="activity_date" name="activity_date" onchange="activity_get_price_date(`+activity_type_pick+`, `+pricing_days+`);" class="form-control" style="margin-bottom:unset; background:white;" type="text" placeholder="Please Select a Date" autocomplete="off" readonly/>
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
    document.getElementById('product_visit_date').innerHTML = '';
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
       data: {
          'product_type_uuid': activity_type[activity_type_pick].uuid,
          'provider': activity_type[activity_type_pick].provider_code,
          'pricing_days': pricing_days,
          'startingDate': startingDate,
          'signature': signature
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
                            <label>`+activity_type[activity_type_pick].skus[i].title+`</label>`;
                            if(template == 1){
                                text+=`
                                <div class="input-container-search-ticket">
                                    <div class="form-select" style="margin-bottom:5px;">
                                        <select class='activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='activity_table_detail()'>`;
                                        for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                        text+=`
                                            <option>`+j+`</option>`;
                                        text+=`</select>
                                    </div>
                                </div>`;
                            }else{
                                text+=`
                                <div class="form-select" style="margin-bottom:5px;">
                                    <select class='activity_pax' id='`+low_sku_id+`_passenger' name='`+low_sku_id+`_passenger' onchange='activity_table_detail()'>`;
                                    for(j=parseInt(activity_type[activity_type_pick].skus[i].minPax); j<=parseInt(activity_type[activity_type_pick].skus[i].maxPax); j++)
                                    text+=`
                                        <option>`+j+`</option>`;
                                    text+=`</select>
                                </div>`;
                            }
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
                                text+=`<input type="file" class="form-control" accept="application/JSON, application/pdf" onchange='input_type_change_perbooking(`+i+`)' required="" name="perbooking`+i+`" id="perbooking`+i+`" style="margin-bottom: unset;"/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 8){
                                //image
                                text+=`<input type="file" class="form-control" accept="image/*" required="" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' id="perbooking`+i+`" style="margin-bottom: unset;"/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 9){
                                //address no validation maybe from bemyguest
                                text+=`<input class="form-control" type='text' id="perbooking`+i+`" name="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' style='display:block; margin-bottom: unset;'/>`;
                            }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 10){
                                //time validation
                                text+=`<input type="time" class="form-control" style="margin-bottom: unset;" id="perbooking`+i+`" onchange='input_type_change_perbooking(`+i+`)' name="perbooking`+i+`" />`;
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

function update_sell_activity(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'sell_activity',
       },
       data: {
           'signature': signature
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
           $("#waitingTransaction").modal('hide');
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
           $("#waitingTransaction").modal('hide');
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
           'signature': signature
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
           $("#waitingTransaction").modal('hide');
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
           $("#waitingTransaction").modal('hide');
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
           'signature': signature
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
           $("#waitingTransaction").modal('hide');
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
           $("#waitingTransaction").modal('hide');
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
           'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            if (!act_booker_id)
            {
                act_booker_id = '';
            }
            get_payment_acq('Issued', act_booker_id, '', 'billing', signature, 'activity_review');
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error update options activity </span>' + msg.result.error_msg,
            })
            $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $("#waitingTransaction").modal('hide');
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
           $("#waitingTransaction").modal('hide');
       },timeout: 60000
    });
}

function activity_commit_booking(val){
    data = {
        'value': val,
        'signature': signature
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['voucher_code'] =  voucher_code;
    }catch(err){
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            document.getElementById('activity_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
            document.getElementById('activity_booking').submit();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error activity commit booking </span>' + msg.result.error_msg,
            })

           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $("#waitingTransaction").modal('hide');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity commit booking </span>' + errorThrown,
            })
           $('.hold-seat-booking-train').prop('disabled', false);
           $('.hold-seat-booking-train').removeClass("running");
           $("#waitingTransaction").modal('hide');
       },timeout: 60000
    });
}

function activity_issued_booking(order_number)
{
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'issued_booking',
       },
       data: {
           'order_number': order_number,
           'seq_id': payment_acq2[payment_method][selected].seq_id,
           'member': payment_acq2[payment_method][selected].method,
           'signature': signature,
           'voucher_code': voucher_code
       },
       success: function(msg) {
           console.log(msg);
           var booking_num = msg.result.response.order_number;
           if (booking_num)
           {
               activity_get_booking(booking_num);
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('payment_acq').hidden = true;
               document.getElementById("overlay-div-box").style.display = "none";
               $("#waitingTransaction").modal('hide');
           }
           else
           {
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error activity issued booking </span>' + msg.result.error_msg,
                })
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $("#waitingTransaction").modal('hide');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error activity issued booking </span>' + errorThrown,
            })
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
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

function update_service_charge(){
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
    price_arr_repricing = {};
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_booking',
       },
       data: {
           'order_number': data,
           'signature': signature
       },
       success: function(msg) {
       act_order_number = data;
       act_get_booking = msg;
       $('#loading-search-activity').hide();
        if(msg.result.error_code == 0){
            tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
            localTime  = moment.utc(tes).toDate();
            if(msg.result.response.no_order_number){
                text = ``;
                voucher_text = ``;
            }
            else{
                if(msg.result.response.status == 'issued'){
                    document.getElementById('voucher_discount').style.display = 'none';
                    conv_status = 'Issued';
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Issued`;
                }
                else if(msg.result.response.status == 'booked'){
                    document.getElementById('voucher_discount').style.display = '';
                    conv_status = 'Booked';
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Booked`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Booked`;
                }
                else if(msg.result.response.status == 'rejected'){
                    conv_status = 'Rejected';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Rejected`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Rejected`;
                }
                else if(msg.result.response.status == 'cancel'){
                    conv_status = 'Cancelled';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Cancelled`;
                }
                else if(msg.result.response.status == 'cancel2'){
                    conv_status = 'Expired';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Expired`;
                }
                else if(msg.result.response.status == 'fail_issued'){
                    conv_status = 'Failed (Issue)';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Issue)`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Issue)`;
                }
                else if(msg.result.response.status == 'fail_booked'){
                    conv_status = 'Failed (Book)';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Book)`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Book)`;
                }
                else if(msg.result.response.status == 'fail_refunded'){
                    conv_status = 'Failed (Refunded)';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-fail");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Refunded)`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Refunded)`;
                }
                else if(msg.result.response.status == 'refund'){
                    conv_status = 'Refunded';
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Refunded`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Refunded`;
                }
                else if(msg.result.response.status == 'reissue'){
                    conv_status = 'Reissued';
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `Reissued`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Reissued`;
                }
                else if(msg.result.response.status == 'paid' || msg.result.response.status == 'pending'){
                    conv_status = 'On Request (max 3 working days)';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-pending");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-pending");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-clock"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `On Request (max 3 working days)`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Requested`;
                }
                else{
                    console.log(msg.result.response.status);
                    conv_status = 'On Request (max 3 working days)';
                    document.getElementById('issued-breadcrumb').classList.remove("br-active");
                    document.getElementById('issued-breadcrumb').classList.add("br-pending");
                    document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-pending");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-clock"></i>`;
                    document.getElementById('issued-breadcrumb-span').innerHTML = `On Request (max 3 working days)`;
                    document.getElementById('display_state').innerHTML = `Your Order Has Been Requested`;
                }

                text = `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="activity_booking_detail" style="border:1px solid #cdcdcd; padding:10px; background-color:white">
                                    <h6>Order Number : `+msg.result.response.name+`</h6><br/>
                                     <table style="width:100%;">
                                        <tr>
                                            <th>PNR</th>
                                            <th>Hold Date</th>
                                            <th>Status</th>
                                        </tr>
                                        <tr>
                                            <td>`+msg.result.response.pnr+`</td>
                                            <td>`+moment(localTime).format('DD MMM YYYY HH:mm')+`</td>
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
                                <td>`+msg.result.response.booking_options[i].description+`</td>
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
                                    <h4> List of Guest(s) </h4>
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
               if(msg.result.response.status == 'issued'){
                    if (msg.result.response.voucher_url.length > 0)
                    {
                        text += `<button class="primary-btn hold-seat-booking-train next-loading-ticket ld-ext-right" type="button" onclick="window.open('`+msg.result.response.voucher_url[0]+`');" style="width:100%;">
                                    Print Voucher <div class="ld ld-ring ld-cycle"></div>
                                 </button>`;
                    }
                    else
                    {
                        text += `<button class="primary-btn hold-seat-booking-train next-loading-ticket ld-ext-right" type="button" onclick="activity_get_voucher('`+msg.result.response.name+`');" style="width:100%;">
                                    Print Voucher <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                    }
               }
               text += `</div>
                        <div class="col-lg-4" style="padding-bottom:10px;">`;
               if(msg.result.response.status == 'pending' || msg.result.response.status == 'paid')
               {
//                   text += `<button class="primary-btn hold-seat-booking-train" type="button" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.activity/`+msg.result.response.name+`/4')" style="width:100%;">
//                                Print Invoice
//                             </button>`;
                    text+=`
                    <a class="issued-booking-train ld-ext-right" style="color:white;">
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
                                        <h4 class="modal-title" style="color:white">Invoice</h4>
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                <span class="control-label" for="Name">Name</span>
                                                <div class="input-container-search-ticket">
                                                    <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
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
                                            <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','airline');"/>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
               }

               text += `</div>
                        <div class="col-lg-4" style="padding-bottom:10px;">`;

               if(msg.result.response.status == 'issued'){
//                    text += `<button class="primary-btn hold-seat-booking-train" type="button" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.activity/`+msg.result.response.name+`/4')" style="width:100%;">
//                                Print Invoice
//                             </button>`;
                    text+=`
                    <a class="issued-booking-train ld-ext-right" style="color:white;">
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
                                        <h4 class="modal-title" style="color:white">Invoice</h4>
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                <span class="control-label" for="Name">Name</span>
                                                <div class="input-container-search-ticket">
                                                    <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
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
                                            <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.name+`', 'invoice','activity');"/>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
               }
               text += `</div>
                    </div>
               `;
            }
            document.getElementById('activity_final_info').innerHTML = text;
            document.getElementById('product_title').innerHTML = msg.result.response.activity.name;
            if(msg.result.response.activity.name != msg.result.response.activity.type)
                document.getElementById('product_type_title').innerHTML = msg.result.response.activity.type;
            price_text = '';
            $test = 'Order Number: '+ msg.result.response.name + '\n';
            $test += 'Booking Code: '+ msg.result.response.pnr+'\n';
            $test += 'Status: '+ conv_status+'\n\n';

            $test += msg.result.response.activity.name+'\n';
            if(msg.result.response.activity.name != msg.result.response.activity.type)
                $test +=msg.result.response.activity.type+'\n';
            var visit_date_txt = msg.result.response.visit_date;
            $test += 'Visit Date : '+msg.result.response.visit_date+'\n';
            if(msg.result.response.timeslot != '')
            {
                $test += 'Time slot: '+ msg.result.response.timeslot+'\n';
                visit_date_txt += ' (' + msg.result.response.timeslot + ')';
            }

            document.getElementById('product_visit_date').innerHTML = visit_date_txt;
            //detail
            text = '';
            tax = 0;
            fare = 0;
            total_price = 0;
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'DISC'];

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
                    price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'DISC': 0};
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
                            'Fare': price['FARE'] + price['DISC'],
                            'Tax': price['TAX'] + price['ROC'],
                            'Repricing': price['CSC']
                        }
                    }else{
                        price_arr_repricing[msg.result.response.passengers[j].name] = {
                            'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'] + price['DISC'],
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
                            <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` </span>`;
                        price_text+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;

                        if(counter_service_charge == 0){
                        price_text+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.DISC))+`</span>`;
                        }else{
                            price_text+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.DISC))+`</span>`;
                        }
                        price_text+=`
                        </div>
                    </div>`;
                    if(counter_service_charge == 0){
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.DISC);
                        $test += msg.result.response.passengers[j].name + ' ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.DISC))+'\n';
                    }else{
                        $test += msg.result.response.passengers[j].name + ' ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.FARE + price.DISC))+'\n';
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.DISC);
                    }
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
           grand_total = total_price;
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
             <div style="text-align:right; padding-bottom:10px; margin-top:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>
             <div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        price_text+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    } else {
                        price_text+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
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

            if(msg.result.response.status == 'booked')
            {
                get_payment_acq('Issued', msg.result.response.booker_seq_id, activity_order_number, 'billing',signature,'activity');
                document.getElementById("final_issued_btn").style.display = "block";
            }
            else
            {
                $('#final_issued_btn').remove();
            }
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
    $('.next-loading-ticket').addClass("running");
    $('.next-loading-ticket').prop('disabled', true);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/activity",
       headers:{
            'action': 'get_voucher',
       },
       data: {
            'order_number': order_number,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        $('.next-loading-ticket').removeClass("running");
        $('.next-loading-ticket').prop('disabled', false);
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