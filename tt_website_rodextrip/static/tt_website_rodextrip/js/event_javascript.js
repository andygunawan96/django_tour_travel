var hotel_room_detail_pick = null;
var option_pick = [];
var category_tooltip = '';
var max_category = 3;

function search_hotel(val){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        find = '';
        if(val == 'nationality'){
            find = document.getElementById('hotel_id_nationality').value.toLowerCase();
            document.getElementById("hotel_country_nationality").innerHTML = '';
        }else if(val == 'destination'){
            find = document.getElementById('hotel_id_destination').value.toLowerCase();
            document.getElementById("hotel_destination_name").innerHTML = '';
        }
        if(val == 'destination'){
            find = find.split(' ');
            for(i in find){
                if(find[i] == 'hotel' || find[i] == 'hotels')
                    find[i] = '';
            }
            text = '';
            if(document.getElementById('hotel_id_destination').value.length >1 ){
                hotel_config.forEach((obj)=> {
                    check = 0;
                    for(i in find){
                        if(obj.name.toString().toLowerCase().search(find[i]) == -1){
                            check = 1;
                        }
                    }
                    if(check == 0){
                        node = document.createElement("div");
                        node.innerHTML = `<option value="`+obj.name+`">`+obj.type+`</option>`;
                        document.getElementById("hotel_destination_name").appendChild(node);
                    }
                });
            }
         }else if(val == 'nationality'){
            if(find.length>0){
                airline_country.forEach((obj)=> {
                    if(obj.code.toString().toLowerCase().search(find) == -1 || obj.name.toString().toLowerCase().search(find) == -1){
                        node = document.createElement("div");
                        node.innerHTML = `<option value="`+obj.code+` - `+obj.name+`">`+obj.code+`</option>`;
                        document.getElementById("hotel_country_nationality").appendChild(node);
                    }
                });
            }
         }
    }, 1000);
}

function getrupiah(price){
    try{
        if(isNaN(price) == false && price.length != 0){
            var temp = parseInt(price);
            var positif = false;
            if(temp > -1)
                positif = true;

            temp = temp.toString();
            temp = temp.split('-')[temp.split('-').length-1];
            var pj = temp.split('.')[0].toString().length;
            var priceshow="";
            for(x=0;x<pj;x++){
                if((pj-x)%3==0 && x!=0){
                    priceshow+=",";
                }
                priceshow+=temp.charAt(x);
            }
            if(temp.split('.').length == 2){
                for(x=pj;x<temp.length;x++){
                    priceshow+=temp.charAt(x);
                }
            }
            if(positif == false)
                priceshow = '-' + priceshow;
            return priceshow;
        }else{
            return '';
        }
    }catch(err){
        return price;
    }
}
//Done
function online_check(){
    if(document.getElementById("include_online").value == 'false')
        document.getElementById("include_online").value = 'true';
    else
        document.getElementById("include_online").value = 'false';
}
//Done
function event_search_validation(){
    text= '';
    if(document.getElementById("event_name_id").value == '')
        text+= 'Please fill destination\n';
    //check no error
    if(text == ''){
        document.getElementById('event_searchForm').submit();
    }else{
        alert(text);
    }
}

function triggered(){
    try{
        if($state == 0){
            document.getElementById('search').hidden = true;
            $state = 1;
        }else{
            document.getElementById('search').hidden = false;
            $state = 0;
        }
    }catch(err){
        document.getElementById('search').hidden = false;
        $state = 0;
    }
}

function filtering(type, update){
    update = 0;
    $('#badge-copy-notif').html("0");
    var data = JSON.parse(JSON.stringify(hotel_data));
    checking_slider = update;
    if(type == 'filter'){
        check_rating = 0;
        for(i in rating_list){
            if(rating_list[i].status == true){
                check_rating = 1;
            }
        }
        var check = 0;
        var temp_data = [];
        var searched_name = $('#hotel_filter_name').val();

        if(check_rating == 1){
            data.hotel_ids.forEach((obj)=> {
                check = 0;
                rating_list.forEach((obj1)=> {
                    if(obj.rating == parseInt(obj1.value) && obj1.status==true){
                        check = 1;
                    }
                });
                if(check != 0){
                    temp_data.push(obj);
                } else {
                    // Tambahkan hotel ygy unrated jika *1 nya tercentang
                    // console.log(obj.rating);
                    if(rating_list[0].status == true && obj.rating == false){
                        temp_data.push(obj);
                    }
                }
            });
            data.hotel_ids = temp_data;
            hotel_filter = data;
            temp_data = [];
            high_price_slider = 0;
            low_price_slider = 99999999;
        }

        if (searched_name){
            data.hotel_ids.forEach((obj)=> {
                var test = 1;
                searched_name.toLowerCase().split(" ").forEach((search_str)=> {
                    if (obj.name.toLowerCase().includes( search_str ) == false){
                        test = 0;
                    }
                });
                if(test == 1){
                    temp_data.push(obj);
                }
            });
            data.hotel_ids = temp_data;
            hotel_filter = data;
            temp_data = [];
            high_price_slider = 0;
            low_price_slider = 99999999;
        }

        if (selected_fac.length > 0 ){
            data.hotel_ids.forEach((obj)=> {
                var selected = 0;
                selected_fac.forEach((obj1)=> {
                    for( var i = 0; i < obj.facilities.length; i++){
                        if (top_facility[obj1].facility_name.toLowerCase().includes(obj.facilities[i].facility_name.toLowerCase()) ){
                            selected += 1;
                            continue;
                        }
                        if (top_facility[obj1].internal_name.toLowerCase().includes(obj.facilities[i].facility_name.toLowerCase()) ){
                        //if (obj.facilities[i].facility_id === top_facility[obj1].internal_code){
                            selected += 1;
                            continue;
                        }
                    }
                });

                if (selected == selected_fac.length){
                    temp_data.push(obj);
                }
            });
            data.hotel_ids = temp_data;
            hotel_filter = data;
            temp_data = [];
            high_price_slider = 0;
            low_price_slider = 99999999;
        }

        if(checking_slider == 1){
            if (check_rating != 1 || !searched_name){
                checking_price = 1;
                temp_response = data;
                sort(data, 1);
            }
            else{
                checking_price = 1;
                temp_response = data;
                sort(data, 0);
            }
        }
        // Perubahan high price jika di trigger dari input user
        else{
            var minPr = 0;
            var maxPr = 0;
            if($check_type_ps == 1){
                minPr = parseFloat(document.getElementById('price-from').value);
                maxPr = parseFloat(document.getElementById('price-to').value);
            }else if($check_type_ps == 2){
                minPr = parseFloat(document.getElementById('price-from2').value);
                maxPr = parseFloat(document.getElementById('price-to2').value);
            }

            $minPrice = parseFloat(minPr);
            $maxPrice = parseFloat(maxPr);
            data.hotel_ids.forEach((obj)=> {
                for (i in obj.prices) {
                    if ($minPrice <= obj.prices[i].price && obj.prices[i].price <= $maxPrice){
                        temp_data.push(obj);
                        break;
                    }
                }
            });
            data.hotel_ids = temp_data;
            hotel_filter = data;
            temp_data = [];
            checking_price = 0;
            temp_response = data;
            sort(data, 1);
        }
    }
}

function sorting_button(value){
    if(value == 'price'){
        if(sorting_value == '' || sorting_value == 'Lowest Price'){
            sorting_value = 'Highest Price';
            document.getElementById("img-sort-down-price").style.display = "none";
            document.getElementById("img-sort-up-price").style.display = "block";
        }else{
            sorting_value = 'Lowest Price';
            document.getElementById("img-sort-down-price").style.display = "block";
            document.getElementById("img-sort-up-price").style.display = "none";
        }
    }else if(value == 'name'){
        if(sorting_value == '' || sorting_value == 'Name Descending'){
            sorting_value = 'Name Ascending';
            document.getElementById("img-sort-down-name").style.display = "none";
            document.getElementById("img-sort-up-name").style.display = "block";
        }else{
            sorting_value = 'Name Descending';
            document.getElementById("img-sort-down-name").style.display = "block";
            document.getElementById("img-sort-up-name").style.display = "none";
        }
    }else if(value == 'rating'){
        if(sorting_value == '' || sorting_value == 'Rating Down'){
            sorting_value = 'Rating Up';
            document.getElementById("img-sort-down-rating").style.display = "none";
            document.getElementById("img-sort-up-rating").style.display = "block";
        }else{
            sorting_value = 'Rating Down';
            document.getElementById("img-sort-down-rating").style.display = "block";
            document.getElementById("img-sort-up-rating").style.display = "none";
        }
    }else{
        sorting_value = value;
    }
    filtering('filter', 0);
}
//Done
function sort(response, check_filter){
        //no filter
        $pagination_type = "hotel";
        sorting = sorting_value;

        document.getElementById("hotel_result").innerHTML = '';
        text = '';
        var node = document.createElement("div");
        event_objs_length = parseInt(response.length);
        text+=`
        <div style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px;">
            <span style="font-weight:bold; font-size:14px;"> Event - `+event_objs_length+` results</span>
        </div>`;
        node.innerHTML = text;
        document.getElementById("hotel_result").appendChild(node);
        node = document.createElement("div");

        document.getElementById("event_ticket_objs").innerHTML = '';
        text='';
        if(response.length != 0){
            for(i in response){
                text = '<div class="sorting-box-b" onclick="goto_detail(`event`,'+i+')"><form id="event'+i+'" action="/event/detail" method="POST"><div class="row"><div class="col-lg-12">';
                if(response[i].images.length != 0){
                    text+=`<div class="img-event-search" style="cursor:pointer; background-image: url(`+response[i].images[0].url+`);" onclick="goto_detail('event',`+i+`)"></div>`;
                }
                else{
                    text+=`<div class="img-event-search" style="cursor:pointer; background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');"></div>`;
                }
                text+=`
                <div style="margin-top:10px;">
                    <h5 class="name_hotel hover_name" title="`+response[i].name+`" style="cursor:pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right:5px; font-size:18px; font-weight:bold;" onclick="goto_detail('event',`+i+`)">`+response[i].name+`</h5>
                </div>`;
                detail = JSON.stringify(response[i]);
                detail = detail.replace(/'/g, "");
                text+=`<input type="hidden" id="event_code`+i+`" name="event_code" value='`+detail+`'/>`;
                text+=`
                <div style="padding-top:5px;">
                    <i class="fas fa-calendar-alt" style="color:`+color+`;"></i> <span class="location_hotel" style="font-size:13px;">
                    `+response[i].start_date;
                if (response[i].end_date != false && response[i].start_date != response[i].end_date)
                    text+=` - `+response[i].end_date;
                text+=`</span>
                </div>`;
                //Unremark jika butuh time
                //text+=`<div style="padding-top:5px;"><i class="fas fa-clock" style="color:`+color+`;"></i> <span class="location_hotel" style="font-size:13px;">`+response[i].start_time+` - `+response[i].end_time` + </span></div>`;

                text+=`<div style="padding-top:5px;"><i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> <span class="location_hotel" style="font-size:13px;">`;
                    if(response[i].locations.length != 0){
                        for(g in response[i].locations){
                            text+= response[i].locations[g].city_name + ', ' + response[i].locations[g].country_name + '; ';
                        }
                    }
                text+=`</span></div>
                <div style="padding-top:5px; padding-bottom:15px; min-height:120px; word-break:break-word;">
                    Category <i class="fas fa-tags" style="color:`+color+`;"></i><br/>`;
                    if(response[i].category.length != 0){
                        var count_category = 0;
                        category_tooltip = '';
                        for(g in response[i].category){
                            if(count_category < max_category){
                                text+=`<span class="tags_btn" id="tags_more`+i+``+g+`">`+ response[i].category[g] +` </span>`;
                            }else{
                                text += `<span class="tags_btn" id="tags_more`+i+``+g+`" style="display:none;">`+ response[i].category[g] +` </span>`;
                            }
                            count_category = count_category + 1;
                        }

                        if(response[i].category.length > max_category){
                            var category_more = response[i].category.length - max_category;
                            var total_category = response[i].category.length;
                            text+=`<br/><span class="tags_btn_rsv" id="category_list_more`+i+`" style="margin-top:5px; max-width:80px;" onclick="display_tags_event(`+i+`, `+total_category+`);"> `+ category_more +` More</span>`;
                        }
                    }
                text+=`
                </div>
                <div>
                    <button type="button" class="primary-btn-custom" style="float:right; width:100%;" onclick="goto_detail('event',`+i+`)">See Details</button>
                </div></div>
                </form>
                </div>`;
                //tambah button ke detailevent_result_data
                node.className = 'col-lg-4 col-md-6 col-sm-6 col-xs-12';
                node.innerHTML = text;
                document.getElementById("event_ticket_objs").appendChild(node);
                node = document.createElement("div");
            }
            $('#loading-search-event').hide();

            var items = $(".sorting-box-b");
            var numItems = items.length;
            var perPage = 20;
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
            $('#hotel_error').hide();
        }
        else{
            $('#loading-search-event').hide();
            document.getElementById("event_error").innerHTML = '';
            text = '';
            text += `
                <div style="padding:5px; margin:10px;">
                    <div style="text-align:center">
                        <img src="/static/tt_website_rodextrip/images/nofound/no-hotel.png" style="width:60px; height:60px;" alt="" title="" />
                        <br/><br/>
                        <span style="font-size:14px; font-weight:600;">Oops! Event not found. Please try another day or another hotel</span>
                    </div>
                </div>
            `;
            var node = document.createElement("div");
            node.innerHTML = text;
            document.getElementById("hotel_error").appendChild(node);
            node = document.createElement("div");
            $('#pagination-container').hide();
            $('#pagination-container2').hide();
            $('#hotel_error').show();
        }

        /*for(i in response.landmark_ids){
            text = '<form id="hotel'+i+'" action="/hotel/detail" method="POST">';
            text += `{%csrf_token%}`;
            //msg.result.response.city_ids[i].sequence
            if(response.landmark_ids[i].images.length != 0)
                text+=`<img data-toggle="tooltip" class="airline-logo" style="width:50px;height:50px;" src="`+response.landmark_ids[i].images[0].url+`"><span> </span>`;
            else
                text+=`<img data-toggle="tooltip" class="airline-logo" style="width:50px;height:50px;" src="/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg"><span> </span>`;
            text+=`<br/><label>`+response.landmark_ids[i].name+`</label>`;
            text+=`<br/><label>`+response.landmark_ids[i].rating+` KASIH GAMBAR BINTANG</label>`;
            text+=`<input type="hidden" id="hotel_detail" name="hotel_detail" value='`+JSON.stringify(response.landmark_ids[i])+`'/>`;
            text+=`<label>`;
            if(response.landmark_ids[i].location.city != false)
                text+= response.landmark_ids[i].location.city;
            if(response.landmark_ids[i].location.address != false)
                text+= ' '+ response.landmark_ids[i].location.address;
            if(response.landmark_ids[i].location.district != false)
                text+= ' '+ response.landmark_ids[i].location.district;
            if(response.landmark_ids[i].location.state != false)
                text+= ' '+ response.landmark_ids[i].location.state;
            if(response.landmark_ids[i].location.kelurahan != false)
                text+= ' '+ response.landmark_ids[i].location.kelurahan;
            if(response.landmark_ids[i].location.zipcode != false)
                text+= ' '+ response.landmark_ids[i].location.zipcode;
            text+=`</label>
            <button type="button" onclick="goto_detail('landmark',`+response.landmark_ids[i].sequence+`,`+response.landmark_ids[i].counter+`)"/>
            </form>`;
            //tambah button ke detail
            node.innerHTML = text;
            document.getElementById("hotel_ticket").appendChild(node);
            node = document.createElement("div");
        }*/
    }

function filter_name(name_num){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        change_filter('hotel_name'+ String(name_num),'');
    }, 500);
}

function change_filter(type, value){
    var check = 0;
    if(type == 'rating'){
        rating_list[value].status = !rating_list[value].status;
        document.getElementById("rating_filter"+value).checked = rating_list[value].status;
        document.getElementById("rating_filter2"+value).checked = rating_list[value].status;
    } else if(type == 'facility'){
        if (selected_fac.includes(value)){
            for( var i = 0; i < selected_fac.length; i++){
               if (selected_fac[i] === value) {
                 selected_fac.splice(i, 1);
                 document.getElementById("fac_filter"+value).checked = false;
                 document.getElementById("fac_filter2"+value).checked = false;
                 break;
               }
            }
        } else {
            selected_fac.push(value);
            document.getElementById("fac_filter"+value).checked = true;
            document.getElementById("fac_filter2"+value).checked = true;
        }

    } else if(type == 'hotel_name1'){
        document.getElementById('hotel_filter_name2').value = document.getElementById('hotel_filter_name').value;
    } else if(type == 'hotel_name2'){
        document.getElementById('hotel_filter_name').value = document.getElementById('hotel_filter_name2').value;
    };
    filtering('filter', 1);
}

function hotel_filter_render(){

    var node = document.createElement("div");
    text = '';
    text+= `
    <span style="font-size:14px; font-weight:600;">Session Time <span class="count_time" id="session_time"> </span></span>
    <hr/>
    <span style="font-size:14px; font-weight:600;">Elapsed Time <span class="count_time" id="elapse_time"> </span></span>`;

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("session_timer").appendChild(node);
    node = document.createElement("div");

    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
    <hr/>`;
    if(template == 1){
        text+=`<div class="banner-right">`;
    }else if(template == 2){
        text+=`
        <div class="hotel-search-form-area" style="bottom:0px !important; padding-left:0px; padding-right:0px;">
            <div class="hotel-search-form" style="background-color:unset; padding:unset; box-shadow:unset; color:`+text_color+`;">`;
    }else if(template == 3){
        text+=`<div class="header-right" style="background:unset; border:unset;">`;
    }
    text+=`
        <div class="form-wrap" style="padding:0px; text-align:left;">
            <h6 class="filter_general" onclick="show_hide_general('hotelName');">Hotel Name <i class="fas fa-chevron-down" id="hotelName_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="hotelName_generalUp" style="float:right; display:block;"></i></h6>
            <div id="hotelName_generalShow" style="display:inline-block; width:100%;">
                <input type="text" style="margin-bottom:unset;" class="form-control" id="hotel_filter_name" placeholder="Hotel Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Hotel Name '" autocomplete="off" onkeyup="filter_name(1);"/>
            </div>
            <hr/>
            <h6 class="filter_general" onclick="show_hide_general('hotelPrice');">Price Range <i class="fas fa-chevron-down" id="hotelPrice_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="hotelPrice_generalUp" style="float:right; display:block;"></i></h6>
            <div id="hotelPrice_generalShow" style="display:inline-block;">
                <div class="range-slider">
                    <input type="text" class="js-range-slider"/>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <input type="text" style="margin-bottom:unset;" class="js-input-from form-control" id="price-from" value="`+low_price_slider+`" onblur="checking_price_slider(1,1);"/>
                    </div>
                    <div class="col-lg-6">
                        <input type="text" style="margin-bottom:unset;" class="js-input-to form-control" id="price-to" value="`+high_price_slider+`" onblur="checking_price_slider(1,2);"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr/>
    <h6 class="filter_general" onclick="show_hide_general('hotelRating');">Star Rating <i class="fas fa-chevron-down" id="hotelRating_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="hotelRating_generalUp" style="float:right; display:block;"></i></h6>
    <div id="hotelRating_generalShow" style="display:inline-block;">`;
    for(i in rating_list){
        if(i == 0)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` star) </span>
                <input type="checkbox" id="rating_filter`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else if(i == 1)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` stars) </span>
                <input type="checkbox" id="rating_filter`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else if(i == 2)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` stars) </span>
                <input type="checkbox" id="rating_filter`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else if(i ==3)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` stars) </span>
                <input type="checkbox" id="rating_filter`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` stars) </span>
                <input type="checkbox" id="rating_filter`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    text+=`</div>`;
    if(template == 2){
        text+=`</div>`;
    }
    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);

    node = document.createElement("div");

    text = `<span style="font-weight: bold; margin-right:10px;">Sort by: </span>`;
    for(i in sorting_list2){
        text+=`
        <button class="primary-btn-sorting" id="sorting_list2`+i+`" name="sorting_list2" onclick="sorting_button('`+sorting_list2[i].value.toLowerCase()+`')" value="`+sorting_list2[i].value+`">
            <span id="img-sort-down-`+sorting_list2[i].value.toLowerCase()+`" style="display:block;"> `+sorting_list2[i].value+` <i class="fas fa-caret-down"></i></span>
            <span id="img-sort-up-`+sorting_list2[i].value.toLowerCase()+`" style="display:none;"> `+sorting_list2[i].value+` <i class="fas fa-caret-up"></i></span>
        </button>`;
    }
    text += `<button class="myticket_static" data-toggle="modal" data-target="#myModalCopyHotel" onclick="get_checked_copy_result();">
                <span style="color:`+text_color+`; font-size:14px;"><span id="badge-copy-notif">0</span> Copy Selected <i class="fas fa-copy"></i></span>
            </button>`
    var node = document.createElement("div");
    node.className = 'sorting-box';
    node.innerHTML = text;
    document.getElementById("sorting-hotel").appendChild(node);

    var node2 = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
            <hr/>
            <h6 style="padding-bottom:10px;">Hotel Name</h6>`;
            if(template == 1){
                text+=`<div class="banner-right">`;
            }else if(template == 2){
                text+=`
                <div class="hotel-search-form-area" style="bottom:0px !important; padding-left:0px; padding-right:0px;">
                    <div class="hotel-search-form" style="background-color:unset; padding:unset; box-shadow:unset; color:`+text_color+`;">`;
            }
            text+=`
                <div class="form-wrap" style="padding:0px; text-align:left;">
                    <input type="text" style="margin-bottom:unset;" class="form-control" id="hotel_filter_name2" placeholder="Hotel Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Hotel Name '" autocomplete="off" onkeyup="filter_name(2);"/>
                </div>
            </div>`;
            if(template == 2){
                text+=`</div>`;
            }
            text+=`
            <hr/>
            <h6 style="padding-bottom:10px;">Price Range</h6>
            <div class="banner-right">
                <div class="form-wrap" style="padding:0px; text-align:left;">
                    <div class="wrapper">
                        <div class="range-slider">
                            <input type="text" class="js-range-slider2"/>
                        </div>
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <input type="text" style="margin-bottom:unset;" class="js-input-from2 form-control" id="price-from2" value="`+low_price_slider+`" onblur="checking_price_slider(2,1);"/>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <input type="text" style="margin-bottom:unset;" class="js-input-to2 form-control" id="price-to2" value="`+high_price_slider+`" onblur="checking_price_slider(2,2);"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <h6 style="padding-bottom:10px;">Star Rating</h6>`;

    for(i in rating_list){
        if(i == 0)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` star) </span>
                <input type="checkbox" id="rating_filter2`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else if(i == 1)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` stars) </span>
                <input type="checkbox" id="rating_filter2`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else if(i == 2)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` stars) </span>
                <input type="checkbox" id="rating_filter2`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else if(i ==3)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` stars) </span>
                <input type="checkbox" id="rating_filter2`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;"><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i><i class="fas fa-star" style="color:#FFC44D;"></i> (`+rating_list[i].value+` stars) </span>
                <input type="checkbox" id="rating_filter2`+i+`" onclick="change_filter('rating',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }

    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);

    text = '';
    for(i in sorting_list){

            text+=`
            <label class="radio-button-custom">
                <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                <input type="radio" id="radio_sorting`+i+`" name="radio_sorting" onclick="sorting_button('`+sorting_list[i].value+`');" value="`+sorting_list[i].value+`">
                <span class="checkmark-radio"></span>
            </label></br>`;

    }
    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("sorting-hotel2").appendChild(node2);
}
function render_object(val, new_int){
    if(new_int == "0"){
        option_pick.splice(option_pick.indexOf(val), 1);
    }else{
        if(option_pick.indexOf(val) === -1){
            option_pick.push(val);
        }
    }

    var text='';
    var grand_total_option = 0;
    var total_commission = 0;
    console.log(option_pick);
    for (i in option_pick){
        var option_name_pick = document.getElementById('option_name_'+option_pick[i]).innerHTML;
        var option_price_pick = document.getElementById('option_price_'+option_pick[i]).value;
        var option_currency_pick = document.getElementById('option_currency_'+option_pick[i]).value;
        var option_qty_pick = document.getElementById('option_qty_'+option_pick[i]).value;
        var option_commission_pick = document.getElementById('option_commission_'+option_pick[i]).value;
        var option_price = option_price_pick*parseInt(option_qty_pick); //total price option
        var option_commission_total = option_commission_pick*parseInt(option_qty_pick); //total commission

        grand_total_option = grand_total_option + option_price;
        total_commission = total_commission + option_commission_total;

        text+=`
        <div class="row">
            <div class="col-lg-4" style="text-align:left;">
                <span style="font-weight:500;">`+option_name_pick+` <br/> ( `+option_qty_pick+` Qty )</span>
            </div>
            <div class="col-lg-4" style="text-align:center;">`;
                text+='<span style="font-weight:500;"> @ ' + option_currency_pick + ' ' + getrupiah(option_price_pick) + '</span>';
            text+=`
            </div>
            <div class="col-lg-4" style="text-align:right;">`;
            text+='<span style="font-weight:500;">' + option_currency_pick + ' ' + getrupiah(option_price) + '</span>';
        text+=`
            </div>
        </div>`;
    }
    text+=`
    <div class="row">
        <div class="col-lg-12">
            <hr/>
            <div class="row">
                <div class="col-lg-6" style="text-align:left;">
                    <span style="font-weight:bold; font-size:15px;">Grand Total</span>
                </div>

                <div class="col-lg-6" style="text-align:right;">`;
                text+='<span style="font-weight:bold; font-size:15px;">' + option_currency_pick + ' ' + getrupiah(grand_total_option) + '</span>'
                text+=`
                </div>
            </div>
        </div>
    </div>`;

    hotel_room_pick_button(total_commission)

    if (option_pick === undefined || option_pick.length == 0){
        document.getElementById("event_detail_table").innerHTML = '';
        document.getElementById('event_detail_button').innerHTML = ''
        $('#not_room_select').show();
    }else{
        document.getElementById("event_detail_table").innerHTML = text;
        $('#not_room_select').hide();
    }

}

function render_object_from_value(val){
    var text='';
    var grand_total_option = 0;
    var total_commission = 0;

    for (i in val){
        grand_total_option = grand_total_option + (val[i].qty * val[i].price);
        total_commission = total_commission + (val[i].qty * val[i].comm);

        text+=`
        <div class="row">
            <div class="col-lg-4" style="text-align:left;">
                <span style="font-weight:500;">`+val[i].name+` <br/> ( `+val[i].qty+` Qty )</span>
            </div>
            <div class="col-lg-4" style="text-align:center;">`;
                text+='<span style="font-weight:500;"> @ ' + val[i].currency + ' ' + getrupiah(val[i].price) + '</span>';
            text+=`
            </div>
            <div class="col-lg-4" style="text-align:right;">`;
            text+='<span style="font-weight:500;">' + val[i].currency + ' ' + getrupiah(val[i].price) + '</span>';
        text+=`
            </div>
        </div>`;
    }

    text+=`
    <div class="row">
        <div class="col-lg-12">
            <hr/>
            <div class="row">
                <div class="col-lg-6" style="text-align:left;">
                    <span style="font-weight:bold; font-size:15px;">Grand Total</span>
                </div>

                <div class="col-lg-6" style="text-align:right;">`;
                text+='<span style="font-weight:bold; font-size:15px;">' + val[i].currency + ' ' + getrupiah(grand_total_option) + '</span>'
                text+=`
                </div>
            </div>
        </div>
    </div>`;

    document.getElementById("event_detail_table").innerHTML = text;
}

function share_data2(){
//    const el = document.createElement('textarea');
//    el.value = $text2;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share2 = window.encodeURIComponent('Hello');
}
function hotel_room_pick_button(total_commission){
    document.getElementById('event_detail_button').innerHTML = '';
    text = '';
    text += `<div class="row" style="padding-top:10px;">`;
    text += `<div class="col-lg-12" style="padding-bottom:15px;">
        <span style="font-size:14px; font-weight:bold;">Share this on:</span><br/>`;
        share_data2();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text+=`
                <a href="https://wa.me/?text=`+ $text_share2 +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                <a href="line://msg/text/`+ $text_share2 +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                <a href="https://telegram.me/share/url?text=`+ $text_share2 +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share2 +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        } else {
            text+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share2 +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share2 +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                <a href="https://telegram.me/share/url?text=`+ $text_share2 +`&url=Share2" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share2 +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        }
    text +=`</div>`;
    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
        text+=`
        <div class="col-lg-12 col-xs-12" style="text-align:center; display:none;" id="show_commission_event">
            <div class="alert alert-success">
                <span id="commission_val" style="font-size:13px; font-weight:bold;">Your Commission: ` + getrupiah(parseInt(total_commission)) + `</span><br>
            </div>
        </div>`;
        text += `<div class="col-lg-12">
            <input class="primary-btn" id="show_commission_button_event" style="width:100%;" type="button" onclick="show_commission_event();" value="Show Commission"/>
        </div>`;
    text += `
    <div class="col-lg-12" style="padding-top:10px;">
        <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data2();" value="Copy">
    </div>`;
    if(agent_security.includes('book_reservation') == true){
    text += `<div class="col-lg-12">`;
    text += '<button class="primary-btn" style="width:100%; margin-bottom:10px; margin-top:10px;" type="button" onclick="goto_passenger();">Next</button></div>';
    text += `</div>`;
    }
    document.getElementById('event_detail_button').innerHTML = text;
}

function show_commission_event(){
    var sc = document.getElementById("show_commission_event");
    var scs = document.getElementById("show_commission_button_event");
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}

function show_commission_hotel_price_change(type){
    if(type == 'old'){
        var sc = document.getElementById("show_commission_hotel_old");
        var scs = document.getElementById("show_commission_button_hotel_old");
    }else{
        var sc = document.getElementById("show_commission_hotel_new");
        var scs = document.getElementById("show_commission_button_hotel_new");
    }
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}
//Done
function goto_passenger(){
    //document.getElementById('hotel_detail_send').value = JSON.stringify(hotel_room);
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('goto_passenger').submit();
}

function check_passenger(adult, child){
    //booker
    length_name = 25;
    error_log = '';
    try{
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence != 'booker'){
                passenger_check = {
                    'type': passenger_data_pick[i].sequence.substr(0, passenger_data_pick[i].sequence.length-1),
                    'number': passenger_data_pick[i].sequence.substr(passenger_data_pick[i].sequence.length-1, passenger_data_pick[i].sequence.length)
                }
                if(document.getElementById(passenger_check.type+passenger_check.number).value == passenger_data_pick[i].seq_id){
                    if(document.getElementById(passenger_check.type+'_title'+passenger_check.number).value != passenger_data_pick[i].title ||
                       document.getElementById(passenger_check.type+'_first_name'+passenger_check.number).value != passenger_data_pick[i].first_name ||
                       document.getElementById(passenger_check.type+'_last_name'+passenger_check.number).value != passenger_data_pick[i].last_name)
                        error_log += "Search "+passenger_check.type+" "+passenger_check.number+" doesn't match!</br>\nPlease don't use inspect element!</br>\n";
                }
           }else if(passenger_data_pick[i].sequence == 'booker'){
                if(document.getElementById('booker_title').value != passenger_data_pick[i].title ||
                    document.getElementById('booker_first_name').value != passenger_data_pick[i].first_name ||
                    document.getElementById('booker_last_name').value != passenger_data_pick[i].last_name)
                    error_log += "Search booker doesn't match!</br>\nPlease don't use inspect element!</br>\n";
           }
        }
    }catch(err){

    }
    if(document.getElementById('booker_title').value!= '' &&
       document.getElementById('booker_first_name').value!= '' &&
       document.getElementById('booker_last_name').value!='' &&
       document.getElementById('booker_nationality_id').value!='' &&
       document.getElementById('booker_email').value!='' &&
       document.getElementById('booker_phone_code').value!='' &&
       document.getElementById('booker_phone').value!= '')
       {
        if(check_name(document.getElementById('booker_title').value,
                    document.getElementById('booker_first_name').value,
                    document.getElementById('booker_last_name').value,
                    length_name) == false){
            error_log+= 'Total of Booker name maximum 25 characters!</br>\n';
            document.getElementById('booker_first_name').style['border-color'] = 'red';
            document.getElementById('booker_last_name').style['border-color'] = 'red';
        }else{
            document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
            document.getElementById('booker_last_name').style['border-color'] = '#EFEFEF';
        }if(document.getElementById('booker_first_name').value == '' || check_word(document.getElementById('booker_first_name').value) == false){
            if(document.getElementById('booker_first_name').value == '')
                error_log+= 'Please fill booker first name!</br>\n';
            else if(check_word(document.getElementById('booker_first_name').value) == false)
                error_log+= 'Please use alpha characters for booker first name!</br>\n';
            document.getElementById('booker_first_name').style['border-color'] = 'red';
        }else{
            document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        }if(check_phone_number(document.getElementById('booker_phone').value)==false){
            if(check_phone_number(document.getElementById('booker_phone').value) == false)
                error_log+= 'Phone number Booker only contain number 8 - 12 digits!</br>\n';
            document.getElementById('booker_phone').style['border-color'] = 'red';
        }else{
            document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
        }if(check_email(document.getElementById('booker_email').value)==false){
            error_log+= 'Invalid Booker email!</br>\n';
            document.getElementById('booker_email').style['border-color'] = 'red';
        }else{
            document.getElementById('booker_email').style['border-color'] = '#EFEFEF';
        }

        var radios = document.getElementsByName('myRadios');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                booker_copy = radios[j].value;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        // Fixme
        //if(booker_copy == 'yes')
        //    if(document.getElementById('booker_title').value != document.getElementById('adult_title1').value ||
        //       document.getElementById('booker_first_name').value != document.getElementById('adult_first_name1').value ||
        //       document.getElementById('booker_last_name').value != document.getElementById('adult_last_name1').value)
        //            error_log += 'Copy booker to passenger true, value title, first name, and last name has to be same!</br>\n';
       if(error_log==''){
           for(i=1;i<=adult;i++){
                document.getElementById('adult_birth_date'+i).disabled = false;
           }
           for(i=1;i<=child;i++){
                document.getElementById('child_birth_date'+i).disabled = false;
           }
           // Fixme
           //document.getElementById('time_limit_input').value = time_limit;
           document.getElementById('event_review').submit();
       }
       else{
           Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: error_log,
            })
            $('.btn-next').prop('disabled', false);
            $('.btn-next').removeClass("running");
       }
     }else{
        console.log(document.getElementById('booker_title').value);
        console.log(document.getElementById('booker_first_name').value);
        console.log(document.getElementById('booker_last_name').value);
        console.log(document.getElementById('booker_nationality').value);
        console.log(document.getElementById('booker_email').value);
        console.log(document.getElementById('booker_phone_code').value);
        console.log(document.getElementById('booker_phone').value);
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Please Fill all the blank !',
        })
        $('.btn-next').prop('disabled', false);
        $('.btn-next').removeClass("running");
     }
}

function hotel_review_price_total(prices){
    prices = prices.replace(/&#39;/g, '"');
    prices = prices.replace(/&quot;/g, '"');
    prices = prices.replace(/False/g, 'false');
    prices = prices.replace(/True/g, 'true');
    prices = prices.replace(/None/g, '[]');

    prices = JSON.parse(prices);
    console.log('Delete Me Review:');
    console.log(prices);
    var element_printed = '<h4>Price Detail</h4><hr/>';

    element_printed += 'Commission : IDR ' + getrupiah(1000) + '<br/>';
    element_printed += 'Total Price: IDR ' + getrupiah(25000);
    document.getElementById('price_total').innerHTML = element_printed;
}

function update_contact_cp(val){
    temp = 1;
    while(temp != adult+1){
        console.log(document.getElementById('adult_cp'+temp.toString()).checked);
        if(document.getElementById('adult_cp'+temp.toString()).checked == true && val != temp){
            document.getElementById('adult_cp_hidden1_'+temp.toString()).hidden = true;
            document.getElementById('adult_cp_hidden2_'+temp.toString()).hidden = true;
            document.getElementById('adult_cp'+temp.toString()).checked = false;
            alert('Contact Person has been changed!');
        }
        temp++;
    }
    if(document.getElementById('adult_cp'+val.toString()).checked == true){
        document.getElementById('adult_cp_hidden1_'+val.toString()).hidden = false;
        document.getElementById('adult_cp_hidden2_'+val.toString()).hidden = false;
    }else{
        document.getElementById('adult_cp_hidden1_'+val.toString()).hidden = true;
        document.getElementById('adult_cp_hidden2_'+val.toString()).hidden = true;
    }
}

function checkboxCopy(){
    var count_copy = $(".copy_result:checked").length;
    document.getElementById("badge-copy-notif").innerHTML = count_copy;
    document.getElementById("badge-copy-notif2").innerHTML = count_copy;
}

function checkboxCopyBox(id, co_hotel){
    if(document.getElementById('copy_result'+id).checked) {
        var copycount = $(".copy_result:checked").length;
        if(copycount == co_hotel){
            document.getElementById("check_all_copy").checked = true;
        }

    } else {
        document.getElementById("check_all_copy").checked = false;
    }
    checkboxCopy();
}

function check_all_result(){
   var selectAllCheckbox = document.getElementById("check_all_copy");
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
   checkboxCopy();
}

function render_extra_question(json_event_answer){
    console.log(json_event_answer);
    var text='';
    text+=`<div class="row">`;
    for (i in json_event_answer){
        text+=`<div class="col-lg-12">`;
        var idx_event_ans = parseInt(json_event_answer[i].idx) + 1;
        if(i == 0){
            text+=`<h6>`+json_event_answer[i].option_grade+` - `+idx_event_ans+`
            <span id="question_down_opt`+i+`" style="padding-left:5px; font-size:12px; color:`+color+`; cursor:pointer; display:none;" onclick="show_question_event_review('question', `+i+`)";> Hide Your Answer</span>
            <span id="question_up_opt`+i+`" style="padding-left:5px; font-size:12px; color:`+color+`; cursor:pointer; display:inline-block;" onclick="show_question_event_review('question', `+i+`)";> Show Your Answer</span>
            </h6><hr/>`;
        }else{
            text+=`<hr/><h6>`+json_event_answer[i].option_grade+` - `+idx_event_ans+`
            <span id="question_down_opt`+i+`" style="padding-left:5px; font-size:12px; color:`+color+`; cursor:pointer; display:none;" onclick="show_question_event_review('question', `+i+`)";> Hide Your Answer</span>
            <span id="question_up_opt`+i+`" style="padding-left:5px; font-size:12px; color:`+color+`; cursor:pointer; display:inline-block;" onclick="show_question_event_review('question', `+i+`)";> Show Your Answer</span>
            </h6><hr/>`;
        }
        text+=`
        <div class="row" id="question_opt`+i+`" style="display:none;">`;
            for (j in json_event_answer[i].answer){
                var ans_index = (parseInt(j))+1;
                text+=`<div class="col-lg-12" style="margin-bottom:15px;">
                    <div style="padding:15px; border: 1px solid #cdcdcd; background: #f7f7f7;">
                        <h6>Question #`+ans_index+` - <i>`+ json_event_answer[i].answer[j].que +`</i></h6>
                        <span>Answer:</span>
                        <span style="font-weight:500;">`+ json_event_answer[i].answer[j].ans +`</span>
                    </div>
                </div>`;
            }
        text+=`</div>`;
        text+=`</div>`;
    }
    text+=`</div>`;
    document.getElementById("extra_question_target").innerHTML = text;
}
//get_checked_copy_result
//delete_checked_copy_result
//copy_data, copy_data2, share_data, share_data2

$check_load = 0;
$check_ps = 0;
$check_type_ps = 0;
function price_slider_true(filter, type){
   if(filter == 1){
       var from_price = parseFloat(document.getElementById('price-from').value);
       var to_price = parseFloat(document.getElementById('price-to').value);
       document.getElementById('price-from2').value = parseFloat(document.getElementById('price-from').value)
       document.getElementById('price-to2').value = parseFloat(document.getElementById('price-to').value)
       $check_type_ps = 1;
   }
   else if(filter == 2){
       var from_price = parseFloat(document.getElementById('price-from2').value);
       var to_price = parseFloat(document.getElementById('price-to2').value);
       document.getElementById('price-from').value = parseFloat(document.getElementById('price-from2').value)
       document.getElementById('price-to').value = parseFloat(document.getElementById('price-to2').value)
       $check_type_ps = 2;
   }
   $minPrice = parseFloat(from_price);
   $maxPrice = parseFloat(to_price);
   checking_price = 0;
   if($check_ps == 0 && filter == 2){
       if($check_load != 0){
           filtering('filter', 0);
       }
       else{
           $check_load = 1;
       }
       $check_ps = 1;
   }else{
       if($check_load != 0){
           filtering('filter', 0);
       }
   }
}

function price_update(filter, type){
   if(filter == 1){
       var from_price = parseFloat(document.getElementById('price-from').value);
       var to_price = parseFloat(document.getElementById('price-to').value);
       document.getElementById('price-from2').value = parseInt(document.getElementById('price-from').value)
       document.getElementById('price-to2').value = parseInt(document.getElementById('price-to').value)
       $check_type_ps = 1;
   }
   else if(filter == 2){
       var from_price = parseInt(document.getElementById('price-from2').value);
       var to_price = parseInt(document.getElementById('price-to2').value);
       document.getElementById('price-from').value = parseInt(document.getElementById('price-from2').value)
       document.getElementById('price-to').value = parseInt(document.getElementById('price-to2').value)
       $check_type_ps = 2;
   }

   $(".js-range-slider").data("ionRangeSlider").update({
        from: from_price,
        to: to_price,
        min: low_price_slider,
        max: high_price_slider,
        step: step_slider
   });

   $(".js-range-slider2").data("ionRangeSlider").update({
        from: from_price,
        to: to_price,
        min: low_price_slider,
        max: high_price_slider,
        step: step_slider
   });
}

function checking_price_slider(filter, type){
   if(filter == 1){
       var from_price = parseInt(document.getElementById('price-from').value);
       var to_price = parseInt(document.getElementById('price-to').value);
       document.getElementById('price-from2').value = parseInt(document.getElementById('price-from').value)
       document.getElementById('price-to2').value = parseInt(document.getElementById('price-to').value)
   }
   else if(filter == 2){
       var from_price = parseInt(document.getElementById('price-from2').value);
       var to_price = parseInt(document.getElementById('price-to2').value);
       document.getElementById('price-from').value = parseInt(document.getElementById('price-from2').value)
       document.getElementById('price-to').value = parseInt(document.getElementById('price-to2').value)
   }

   if(type == 1){
       if(from_price < low_price_slider){
          document.getElementById('price-from').value = low_price_slider;
          document.getElementById('price-from2').value = low_price_slider;
          from_price = low_price_slider;
       }
       if(from_price > high_price_slider || from_price > to_price){
          document.getElementById('price-from').value = document.getElementById('price-to').value;
          document.getElementById('price-from2').value = document.getElementById('price-to').value;
          from_price = document.getElementById('price-to').value;
       }
   }
   else if(type == 2){
       if(to_price > high_price_slider){
          document.getElementById('price-to').value = high_price_slider;
          document.getElementById('price-to2').value = high_price_slider;
          to_price = high_price_slider;
       }
       if(to_price < low_price_slider || to_price < from_price){
          document.getElementById('price-to').value = document.getElementById('price-from').value;
          document.getElementById('price-to2').value = document.getElementById('price-from').value;
          to_price = document.getElementById('price-from').value;
       }
   }

   $minPrice = parseFloat(from_price);
   $maxPrice = parseFloat(to_price);
   checking_price = 0;
   if($check_load != 0){
       filtering('filter', 0);
   }
}

function go_to_owl_carousel_bottom(counter, co_i){
    text_img = '';
    var idx_img_bot = 1;
    console.log(temp_response.hotel_ids[co_i]);
    text_img +=`
    <div class="owl-carousel-hotel-img-modal owl-theme" style="text-align:center;">`;
    if(temp_response.hotel_ids[co_i].images.length != 0){
        for(idx_img_bot; idx_img_bot < temp_response.hotel_ids[co_i].images.length; idx_img_bot++){
            if(idx_img_bot < 5){
                text_img +=`
                <div class="item" style="cursor:zoom-in; float:none; display:inline-block;">
                    <img class="img-fluid zoom-img" src="`+temp_response.hotel_ids[co_i].images[idx_img_bot].url+`" style="margin: auto; max-height:500px;">
                </div>`;
            }
            else{
                break;
            }
        }
    }
    else{
        text_img+=`<img src="/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg" width="60" height="60" style="margin-right:10px; border-radius:4px; border:1px solid #cdcdcd;">`;
    }
    text_img += `</div>`;
    document.getElementById("viewImageHotelBottom").innerHTML = text_img;

    $('.owl-carousel-hotel-img-modal').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        merge: false,
        smartSpeed:500,
        autoplay: false,
        autoplayTimeout:8000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:true
            },
            1000:{
                items:1,
                nav:true,
            }
        }
    });

    $('.owl-carousel-hotel-img-modal').trigger('to.owl.carousel', counter-1);
    $("#openImage").modal('show');
}

function change_image_hotel(numb){
    var min_img = parseInt((numb*20)-20);
    var max_img = parseInt((numb*20)-1);

    if(temp_response.hotel_ids.length != 0){
        for(i in temp_response.hotel_ids){
            if(i >= min_img && i<= max_img){
                var text_change_img = '';
                var idx_img = 1;
                if(temp_response.hotel_ids[i].images.length != 0){
                    for(idx_img; idx_img < temp_response.hotel_ids[i].images.length; idx_img++){
                        if(idx_img < 5){
                            text_change_img+=`<img class="img_hotel_smallbot" src="`+temp_response.hotel_ids[i].images[idx_img].url+`" onerror="this.src='/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg';" width="50" height="50" onclick="go_to_owl_carousel_bottom(`+idx_img+`, `+i+`);">`;
                        }
                        else{
                            break;
                        }
                    }
                }
                else{
                    text_change_img+=`<img src="/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg" width="60" height="60" style="margin-right:10px; border-radius:4px; border:1px solid #cdcdcd;">`;
                }

                document.getElementById('pagination_image'+i).innerHTML = text_change_img;
            }
        }
    }
}

//function viewImageHotel(urlImage){
//    var modalImg = document.getElementById("viewImageHotel");
//    modalImg.src = urlImage;
//    $("#openImage").modal('show');
//}

function reset_filter(){
    document.getElementById('hotel_filter_name').value = '';
    document.getElementById('price-from').value = low_price_slider;
    document.getElementById('price-to').value = high_price_slider;
    filter_name(1);
    price_update(1, 1);
    price_slider_true(1, 1);

    for(i in rating_list){
        rating_list[i].status = false;
        document.getElementById("rating_filter"+i).checked = rating_list[i].status;
        document.getElementById("rating_filter2"+i).checked = rating_list[i].status;
    }
    filtering('filter');
}

function display_tags_event(idx, total_category){
    var display_more = document.getElementById('category_list_more'+idx);
    display_more.style.display = "none";

    for(i = 3; i < total_category; i++){
        document.getElementById('tags_more'+idx+i).style.display = "inline-block";
    }
}