var option_pick = [];
var selected_categ = [];

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
            var temp = parseFloat(price);
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
                for(x=pj;x<pj+3;x++){
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
    //Remark supay bisa search all
    //if(document.getElementById("event_name_id").value == '')
    //    text+= 'Please fill Event Name\n';
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
    $('#badge-copy-notif').html("0");
    $('#badge-copy-notif2').html("0");
    var data = JSON.parse(JSON.stringify(data_event));

    var check = 0;
    var temp_data = [];

    if (selected_categ.length > 0 ){
        event_search_result.forEach((obj)=> {
            // LOGIC AND
            //var selected = 0;
            //selected_categ.forEach((obj1)=> {
            //    for( var i = 0; i < obj.category.length; i++){
            //        if (data_event.category[obj1].category_name.toLowerCase() == obj.category[i].toLowerCase() ){
            //            selected += 1;
            //            continue;
            //        }
            //    }
            //});

            //if (selected == selected_categ.length){
            //    temp_data.push(obj);
            //}

            // LOGIC OR
            selected_categ.forEach((obj1)=> {
                for( var i = 0; i < obj.category.length; i++){
                    if (data_event.category[obj1].category_name.toLowerCase() == obj.category[i].toLowerCase() ){
                        temp_data.push(obj);
                    }
                }
            });
        });
    } else {
        temp_data = event_search_result;
    }
    sort(temp_data, 1);
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

    var node = document.createElement("div");
    document.getElementById("event_ticket_objs").innerHTML = '';
    text='';
    if(response.length != 0){
        count_available_event = 0;
        for(i in response){
            available_prop = 0;
            content_category_pop = '';
            content_location_pop = '';
            text = '';

            if (response[i].end_date) {
                obj_end_date = Date.parse(response[i].end_date);
                if (obj_end_date > Date.now()){
                    if (response[i].option.length > 0){
                        available_prop = 1;
                    }
                }
            }
            for (opt in response[i].option){
                if (response[i].option[opt].amount > 0){
                    available_prop = 1;
                }
            }

            if (available_prop == 1){
                count_available_event += 1;
                if(template == 1){
                    text+=`
                    <div class="single-recent-blog-post item mb-3" style="margin-top:0px; cursor:unset; margin-bottom:10px; border:1px solid #cdcdcd;">
                        <div class="single-destination relative" style="margin-bottom:unset;">
                            <form id="event`+i+`" action="/event/detail" method="POST">`;
                            if(response[i].images.length != 0){
                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+response[i].images[0].url+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="goto_detail('event',`+i+`)">`;
                            }
                            else{
                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('/static/tt_website_rodextrip/images/no pic/no-event.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="goto_detail('event',`+i+`)">`;
                            }
                            text+=`
                                <div class="overlay overlay-bg"></div>
                            </div>
                            <div class="card card-effect-promotion" style="border:unset;">
                            <div class="card-body" style="padding:5px 10px 10px 10px; border:unset;">
                                <div class="row details">
                                    <div class="col-lg-12" style="height:135px;">`;
                                        text+=`
                                        <h6 class="name_hotel hover_name" title="`+response[i].name+`" style="cursor:pointer; padding-right:5px; font-weight:bold; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" onclick="goto_detail('event',`+i+`)">`+response[i].name+`</h6>`;
                                        detail = JSON.stringify(response[i]);
                                        detail = detail.replace(/'/g, "");
                                        text+=`<input type="hidden" id="event_code`+i+`" name="event_code" value='`+detail+`'/>`;

                                        text+=`
                                        <i class="fas fa-calendar-alt" style="padding-top:7px; color:`+color+`;"></i>
                                        <span class="location_hotel" style="font-size:13px;">
                                            `+response[i].start_date;
                                            if (response[i].end_date != false && response[i].start_date != response[i].end_date)
                                                text+=` - `+response[i].end_date;
                                        text+=`</span>
                                        <br/>`;

                                        //unremark klo btuh time
                                        //text+=`<i class="fas fa-clock" style="color:`+color+`;"></i> <span class="location_hotel" style="font-size:13px;">`+response[i].start_time+` - `+response[i].end_time` + </span>`;

                                        if(response[i].locations.length != 0){
                                            text+=`
                                            <div style="padding-top:2px;">
                                                <i class="fas fa-map-marker-alt" style="color:`+color+`;"></i>
                                                <span class="location_hotel" style="font-size:13px;">`;
                                            content_location_pop += `<i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> `;
                                            for(g in response[i].locations){
                                                if(g == 0){
                                                    if (response[i].locations[g].city_name != false){
                                                        text+= response[i].locations[g].city_name;
                                                    }
                                                    if (response[i].locations[g].city_name != false && response[i].locations[g].country_name != false){
                                                        text+= ', ';
                                                    }
                                                    if (response[i].locations[g].country_name != false){
                                                        text+= response[i].locations[g].country_name;
                                                    }
                                                }else{
                                                    if (response[i].locations[g].city_name != false){
                                                        content_location_pop+= response[i].locations[g].city_name;
                                                    }
                                                    if (response[i].locations[g].city_name != false && response[i].locations[g].country_name != false){
                                                        content_location_pop+= ', ';
                                                    }
                                                    if (response[i].locations[g].country_name != false){
                                                        content_location_pop+= response[i].locations[g].country_name;
                                                    }
                                                    content_location_pop += `<br/>`;
                                                }
                                            }
                                            text+=`</span>`;
                                            text+=`</span></div>`;
                                        }
                                        text+=`
                                        <div style="padding-top:2px;">`;
                                            if (response[i].locations.length > 1){
                                                var loc_length = response[i].locations.length - 1;
                                                text+=`<span class="tags_btn" id="loc_tags`+i+`"><i class="fas fa-map-marker-alt"></i> +`+loc_length+` More</span>`;
                                            }

                                            if(response[i].category.length != 0){
                                                text+=`<span class="tags_btn" id="pop_tags`+i+`"><i class="fas fa-tags"></i> `+response[i].category.length+` Category</span>`;
                                                content_category_pop += `<span style="font-weight:600; font-size:14px;"> Category</span><hr/>`;
                                                for(g in response[i].category){
                                                    content_category_pop +=`<div class="tags_btn mb-2" onclick="window.location='/event/category/`+response[i].category[g]+`';"><i class="fas fa-tags"></i> `+ response[i].category[g] +`</div>`;
                                                }
                                            }
                                        text+=`
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style="border-top:1px solid #cdcdcd; padding: 5px 10px;">
                                    <a class="a-vendor" href="/event/vendor" style="text-decoration:unset;">
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">`;
                                                if(response[i].vendor_obj.vendor_logo){
                                                    text+=`<img src="`+response[i].vendor_obj.vendor_logo+`" alt="Logo Vendor" class="image-rounded-profile" style="margin-right:5px; height:30px; width:30px;"/>`;
                                                }
                                                else{
                                                    text+=`<img src="/static/tt_website_rodextrip/images/noprofile.png" alt="Photo Profile" class="image-rounded-profile" style="margin-right:5px; height:30px; width:30px;"/>`;
                                                }
                                                text+=`
                                                </div>
                                                <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10" style="padding:0px 10px; font-size:12px; float:none;margin:auto;">
                                                    `+response[i].vendor_obj.vendor_name+`
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>`;
               }
               else{
                    if(template == 5){
                        text+=`<div class="single-post-area activity_box" style="margin-bottom:15px; cursor:pointer; border:1px solid #cdcdcd; transform:unset; -webkit-transform:unset;">`;
                    }else{
                        text+=`<div class="single-post-area activity_box" style="margin-bottom:15px; cursor:pointer; border:unset; transform:unset; -webkit-transform:unset;">`;
                    }

                    text+=`
                    <div class="single-destination avail-sd relative" style="margin-bottom:unset;">
                        <form id="event`+i+`" action="/event/detail" method="POST">`;
                        if(response[i].images.length != 0){
                            text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+response[i].images[0].url+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="goto_detail('event',`+i+`)">`;
                        }
                        else{
                            text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('/static/tt_website_rodextrip/images/no pic/no-event.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="goto_detail('event',`+i+`)">`;
                        }

                        if(template != 5 && template != 6){
                            text+=`<div class="overlay overlay-bg"></div>`;
                        }
                        text+=`
                        </div>
                        <div class="card card-effect-promotion" style="border:unset;">
                        <div class="card-body" style="padding:5px 10px 10px 10px; border:unset;">
                            <div class="row details">
                                <div class="col-lg-12" style="text-align:left; height:135px;">
                                    <h6 class="name_hotel hover_name" title="`+response[i].name+`" style="cursor:pointer; padding-right:5px; font-weight:bold; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" onclick="goto_detail('event',`+i+`)">`+response[i].name+`</h6>`;
                                    detail = JSON.stringify(response[i]);
                                    detail = detail.replace(/'/g, "");
                                    text+=`<input type="hidden" id="event_code`+i+`" name="event_code" value='`+detail+`'/>`;

                                    text+=`
                                    <i class="fas fa-calendar-alt" style="padding-top:7px; color:`+color+`;"></i>
                                    <span class="location_hotel" style="font-size:13px;">
                                        `+response[i].start_date;
                                        if (response[i].end_date != false && response[i].start_date != response[i].end_date)
                                            text+=` - `+response[i].end_date;
                                    text+=`</span>
                                    <br/>`;

                                    //unremark klo btuh time
                                    //text+=`<i class="fas fa-clock" style="color:`+color+`;"></i> <span class="location_hotel" style="font-size:13px;">`+response[i].start_time+` - `+response[i].end_time` + </span>`;

                                    if(response[i].locations.length != 0){
                                        text+=`
                                        <div style="padding-top:2px;">
                                            <i class="fas fa-map-marker-alt" style="color:`+color+`;"></i>
                                            <span class="location_hotel" style="font-size:13px;">`;
                                        content_location_pop += `<i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> `;
                                        for(g in response[i].locations){
                                            if(g == 0){
                                                if (response[i].locations[g].city_name != false){
                                                    text+= response[i].locations[g].city_name;
                                                }
                                                if (response[i].locations[g].city_name != false && response[i].locations[g].country_name != false){
                                                    text+= ', ';
                                                }
                                                if (response[i].locations[g].country_name != false){
                                                    text+= response[i].locations[g].country_name;
                                                }
                                            }else{
                                                if (response[i].locations[g].city_name != false){
                                                    content_location_pop+= response[i].locations[g].city_name;
                                                }
                                                if (response[i].locations[g].city_name != false && response[i].locations[g].country_name != false){
                                                    content_location_pop+= ', ';
                                                }
                                                if (response[i].locations[g].country_name != false){
                                                    content_location_pop+= response[i].locations[g].country_name;
                                                }
                                                content_location_pop += `<br/>`;
                                            }
                                        }
                                        text+=`</span>`;
                                        text+=`</span></div>`;
                                    }
                                    text+=`
                                    <div style="padding-top:2px;">`;
                                        if (response[i].locations.length > 1){
                                            var loc_length = response[i].locations.length - 1;
                                            text+=`<span class="tags_btn" id="loc_tags`+i+`"><i class="fas fa-map-marker-alt"></i> +`+loc_length+` More</span>`;
                                        }
                                        if(response[i].category.length != 0){
                                            text+=`<span class="tags_btn" id="pop_tags`+i+`"><i class="fas fa-tags"></i> `+response[i].category.length+` Category</span>`;
                                            content_category_pop += `<span style="font-weight:600; font-size:14px;"> Category</span><hr/>`;
                                            for(g in response[i].category){
                                                content_category_pop+=`<div class="tags_btn mb-2" onclick="window.location='/event/category/`+response[i].category[g]+`';"><i class="fas fa-tags"></i> `+ response[i].category[g] +`</div>`;
                                            }
                                        }
                                    text+=`
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="border-top:1px solid #cdcdcd; padding: 5px 10px;">
                                <a class="a-vendor" href="/event/vendor" style="text-decoration:unset;">
                                    <div class="row">
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">`;
                                            if(response[i].vendor_obj.vendor_logo){
                                                text+=`<img src="`+response[i].vendor_obj.vendor_logo+`" alt="Logo Vendor" class="image-rounded-profile" style="margin-right:5px; height:30px; width:30px;"/>`;
                                            }
                                            else{
                                                text+=`<img src="/static/tt_website_rodextrip/images/noprofile.png" alt="Photo Profile" class="image-rounded-profile" style="margin-right:5px; height:30px; width:30px;"/>`;
                                            }
                                            text+=`
                                                </div>
                                                <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10" style="padding:0px 10px; font-size:12px; float:none;margin:auto;">
                                                    `+response[i].vendor_obj.vendor_name+`
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>`;
               }
            }

            else{
                if(page_from_name != 'search'){
                    count_available_event += 1;
                    if(template == 1){
                        text+=`
                        <div class="single-recent-blog-post item mb-3" style="margin-top:0px; cursor:unset; margin-bottom:10px; border:1px solid #cdcdcd;">
                            <div style="background: `+color+`; position:absolute; padding: 8px 15px 8px 15px; float:right; z-index:1; opacity: 0.8; top: 15px;">
                                <h6 style="color:`+text_color+`;">EVENT ENDED</h6>
                            </div>
                            <div class="single-destination relative" style="margin-bottom:unset;">
                                <form id="event`+i+`" action="/event/detail" method="POST">`;
                                if(response[i].images.length != 0){
                                    text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+response[i].images[0].url+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="goto_detail('event',`+i+`)">`;
                                }
                                else{
                                    text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('/static/tt_website_rodextrip/images/no pic/no-event.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="goto_detail('event',`+i+`)">`;
                                }
                                text+=`
                                    <div class="overlay overlay-bg"></div>
                                </div>
                                <div class="card card-effect-promotion" style="border:unset;">
                                <div class="card-body" style="padding:5px 10px 10px 10px; border:unset;">
                                    <div class="row details">
                                        <div class="col-lg-12" style="text-align:left; height:135px;">
                                            <h6 class="name_hotel hover_name" title="`+response[i].name+`" style="cursor:pointer; padding-right:5px; font-weight:bold; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" onclick="goto_detail('event',`+i+`)">`+response[i].name+`</h6>`;
                                            detail = JSON.stringify(response[i]);
                                            detail = detail.replace(/'/g, "");
                                            text+=`<input type="hidden" id="event_code`+i+`" name="event_code" value='`+detail+`'/>`;

                                            text+=`
                                            <i class="fas fa-calendar-alt" style="padding-top:7px; color:`+color+`;"></i>
                                            <span class="location_hotel" style="font-size:13px;">
                                                `+response[i].start_date;
                                                if (response[i].end_date != false && response[i].start_date != response[i].end_date)
                                                    text+=` - `+response[i].end_date;
                                            text+=`</span>
                                            <br/>`;

                                            //unremark klo btuh time
                                            //text+=`<i class="fas fa-clock" style="color:`+color+`;"></i> <span class="location_hotel" style="font-size:13px;">`+response[i].start_time+` - `+response[i].end_time` + </span>`;

                                            if(response[i].locations.length != 0){
                                                text+=`
                                                <div style="padding-top:2px;">
                                                    <i class="fas fa-map-marker-alt" style="color:`+color+`;"></i>
                                                    <span class="location_hotel" style="font-size:13px;">`;
                                                content_location_pop += `<i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> `;
                                                for(g in response[i].locations){
                                                    if(g == 0){
                                                        if (response[i].locations[g].city_name != false){
                                                            text+= response[i].locations[g].city_name;
                                                        }
                                                        if (response[i].locations[g].city_name != false && response[i].locations[g].country_name != false){
                                                            text+= ', ';
                                                        }
                                                        if (response[i].locations[g].country_name != false){
                                                            text+= response[i].locations[g].country_name;
                                                        }
                                                    }else{
                                                        if (response[i].locations[g].city_name != false){
                                                            content_location_pop+= response[i].locations[g].city_name;
                                                        }
                                                        if (response[i].locations[g].city_name != false && response[i].locations[g].country_name != false){
                                                            content_location_pop+= ', ';
                                                        }
                                                        if (response[i].locations[g].country_name != false){
                                                            content_location_pop+= response[i].locations[g].country_name;
                                                        }
                                                        content_location_pop += `<br/>`;
                                                    }
                                                }
                                                text+=`</span>`;
                                                text+=`</span></div>`;
                                            }
                                            text+=`
                                            <div style="padding-top:2px;">`;
                                                if (response[i].locations.length > 1){
                                                    var loc_length = response[i].locations.length - 1;
                                                    text+=`<span class="tags_btn" id="loc_tags`+i+`"><i class="fas fa-map-marker-alt"></i> +`+loc_length+` More</span>`;
                                                }

                                                if(response[i].category.length != 0){
                                                    text+=`<span class="tags_btn" id="pop_tags`+i+`"><i class="fas fa-tags"></i> `+response[i].category.length+` Category</span>`;
                                                    content_category_pop += `<span style="font-weight:600; font-size:14px;"> Category</span><hr/>`;
                                                    for(g in response[i].category){
                                                        content_category_pop+=`<div class="tags_btn mb-2" onclick="window.location='/event/category/`+response[i].category[g]+`';"><i class="fas fa-tags"></i> `+ response[i].category[g] +`</div>`;
                                                    }
                                                }
                                            text+=`
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="border-top:1px solid #cdcdcd; padding: 5px 10px;">
                                        <a class="a-vendor" href="/event/vendor" style="text-decoration:unset;">
                                            <div class="row">
                                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">`;
                                                    if(response[i].vendor_obj.vendor_logo){
                                                        text+=`<img src="`+response[i].vendor_obj.vendor_logo+`" alt="Logo Vendor" class="image-rounded-profile" style="margin-right:5px; height:30px; width:30px;"/>`;
                                                    }
                                                    else{
                                                        text+=`<img src="/static/tt_website_rodextrip/images/noprofile.png" alt="Photo Profile" class="image-rounded-profile" style="margin-right:5px; height:30px; width:30px;"/>`;
                                                    }
                                                    text+=`
                                                    </div>
                                                    <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10" style="padding:0px 10px; font-size:12px; float:none;margin:auto;">
                                                        `+response[i].vendor_obj.vendor_name+`
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>`;
                   }
                   else{
                        if(template == 5){
                            text+=`<div class="single-post-area activity_box" style="margin-bottom:15px; cursor:pointer; border:1px solid #cdcdcd; transform:unset; -webkit-transform:unset;">`;
                        }else{
                            text+=`<div class="single-post-area activity_box" style="margin-bottom:15px; cursor:pointer; border:unset; transform:unset; -webkit-transform:unset;">`;
                        }

                        text+=`
                        <div style="background: `+color+`; position:absolute; padding: 8px 15px 8px 15px; float:right; z-index:1; opacity: 0.9; top: 15px;">
                            <h6 style="color:`+text_color+`;">EVENT ENDED</h6>
                        </div>

                        <div class="single-destination avail-sd relative" style="margin-bottom:unset;">
                            <form id="event`+i+`" action="/event/detail" method="POST">`;

                            if(response[i].images.length != 0){
                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+response[i].images[0].url+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="goto_detail('event',`+i+`)">`;
                            }
                            else{
                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('/static/tt_website_rodextrip/images/no pic/no-event.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="goto_detail('event',`+i+`)">`;
                            }

                            if(template != 5 && template != 6){
                                text+=`<div class="overlay overlay-bg"></div>`;
                            }

                            text+=`
                            </div>
                            <div class="card card-effect-promotion" style="border:unset;">
                            <div class="card-body" style="padding:5px 10px 10px 10px; border:unset;">
                                <div class="row details">
                                    <div class="col-lg-12" style="text-align:left; height:135px;">
                                        <h6 class="name_hotel hover_name" title="`+response[i].name+`" style="cursor:pointer; padding-right:5px; font-weight:bold; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" onclick="goto_detail('event',`+i+`)">`+response[i].name+`</h6>`;
                                        detail = JSON.stringify(response[i]);
                                        detail = detail.replace(/'/g, "");
                                        text+=`<input type="hidden" id="event_code`+i+`" name="event_code" value='`+detail+`'/>`;

                                        text+=`
                                        <i class="fas fa-calendar-alt" style="padding-top:7px; color:`+color+`;"></i>
                                        <span class="location_hotel" style="font-size:13px;">
                                            `+response[i].start_date;
                                            if (response[i].end_date != false && response[i].start_date != response[i].end_date)
                                                text+=` - `+response[i].end_date;
                                        text+=`</span>
                                        <br/>`;

                                        //unremark klo btuh time
                                        //text+=`<i class="fas fa-clock" style="color:`+color+`;"></i> <span class="location_hotel" style="font-size:13px;">`+response[i].start_time+` - `+response[i].end_time` + </span>`;

                                        if(response[i].locations.length != 0){
                                            text+=`
                                            <div style="padding-top:2px;">
                                                <i class="fas fa-map-marker-alt" style="color:`+color+`;"></i>
                                                <span class="location_hotel" style="font-size:13px;">`;
                                            content_location_pop += `<i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> `;
                                            for(g in response[i].locations){
                                                if(g == 0){
                                                    if (response[i].locations[g].city_name != false){
                                                        text+= response[i].locations[g].city_name;
                                                    }
                                                    if (response[i].locations[g].city_name != false && response[i].locations[g].country_name != false){
                                                        text+= ', ';
                                                    }
                                                    if (response[i].locations[g].country_name != false){
                                                        text+= response[i].locations[g].country_name;
                                                    }
                                                }else{
                                                    if (response[i].locations[g].city_name != false){
                                                        content_location_pop+= response[i].locations[g].city_name;
                                                    }
                                                    if (response[i].locations[g].city_name != false && response[i].locations[g].country_name != false){
                                                        content_location_pop+= ', ';
                                                    }
                                                    if (response[i].locations[g].country_name != false){
                                                        content_location_pop+= response[i].locations[g].country_name;
                                                    }
                                                    content_location_pop += `<br/>`;
                                                }
                                            }
                                            text+=`</span>`;
                                            text+=`</span></div>`;
                                        }

                                        text+=`
                                        <div style="padding-top:2px;">`;
                                            if (response[i].locations.length > 1){
                                                var loc_length = response[i].locations.length - 1;
                                                text+=`<span class="tags_btn" id="loc_tags`+i+`"><i class="fas fa-map-marker-alt"></i> +`+loc_length+` More</span>`;
                                            }

                                            if(response[i].category.length != 0){
                                                text+=`<span class="tags_btn" id="pop_tags`+i+`"><i class="fas fa-tags"></i> `+response[i].category.length+` Category</span>`;
                                                content_category_pop += `<span style="font-weight:600; font-size:14px;"> Category</span><hr/>`;
                                                for(g in response[i].category){
                                                    content_category_pop+=`<div class="tags_btn mb-2" onclick="window.location='/event/category/`+response[i].category[g]+`';"><i class="fas fa-tags"></i> `+ response[i].category[g] +`</div>`;
                                                }
                                            }
                                        text+=`
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style="border-top:1px solid #cdcdcd; padding: 5px 10px;">
                                    <a class="a-vendor" href="/event/vendor" style="text-decoration:unset;">
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">`;
                                                if(response[i].vendor_obj.vendor_logo){
                                                    text+=`<img src="`+response[i].vendor_obj.vendor_logo+`" alt="Logo Vendor" class="image-rounded-profile" style="margin-right:5px; height:30px; width:30px;"/>`;
                                                }
                                                else{
                                                    text+=`<img src="/static/tt_website_rodextrip/images/noprofile.png" alt="Photo Profile" class="image-rounded-profile" style="margin-right:5px; height:30px; width:30px;"/>`;
                                                }
                                                    text+=`
                                                    </div>
                                                    <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10" style="padding:0px 10px; font-size:12px; float:none;margin:auto;">
                                                        `+response[i].vendor_obj.vendor_name+`
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>`;
                   }
                }
            }
            //tambah button ke detailevent_result_data
            if(text != ''){
                node.className = 'col-lg-4 col-md-6 col-sm-6 col-xs-12';
                node.innerHTML = text;
                document.getElementById("event_ticket_objs").appendChild(node);
                node = document.createElement("div");

                new jBox('Tooltip', {
                    attach: '#pop_tags'+i,
                    target: '#pop_tags'+i,
                    theme: 'TooltipBorder',
                    trigger: 'click',
                    width: 200,
                    height: ($(window).height() - 160),
                    adjustTracker: true,
                    closeOnClick: 'body',
                    closeOnEsc: true,
                    animation: 'move',
                    position: {
                      x: 'right',
                      y: 'center'
                    },
                    outside: 'x',
                    content: content_category_pop
                });

                new jBox('Tooltip', {
                    attach: '#loc_tags'+i,
                    target: '#loc_tags'+i,
                    theme: 'TooltipBorder',
                    trigger: 'click',
                    adjustTracker: true,
                    closeOnClick: 'body',
                    closeButton: 'box',
                    animation: 'move',
                    position: {
                      x: 'left',
                      y: 'top'
                    },
                    outside: 'y',
                    pointer: 'left:20',
                    offset: {
                      x: 25
                    },
                    content: content_location_pop
                });
            }
        }
        $('#loading-search-event').hide();

        var items = $(".sorting-box-b");
        var numItems = items.length;
        var perPage = 12;
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
        $('#event_error').hide();
    }
    else{
        $('#loading-search-event').hide();
        document.getElementById("event_error").innerHTML = '';
        text = '';
        text += `
            <div style="padding:5px; margin:10px;">
                <div style="text-align:center">
                    <img src="/static/tt_website_rodextrip/images/nofound/no-event.png" style="width:60px; height:60px;" alt="Not Found Event" title="" />
                    <br/><br/>
                    <span style="font-size:14px; font-weight:600;">Oops! Event not found. Please try another event</span>
                </div>
            </div>
        `;
        var node = document.createElement("div");
        node.innerHTML = text;
        document.getElementById("event_error").appendChild(node);
        node = document.createElement("div");
        $('#pagination-container').hide();
        $('#pagination-container2').hide();
        $('#event_error').show();
    }

    if(count_available_event == 0){
        document.getElementById("event_error").innerHTML = `
        <div style="padding:5px; margin:10px;">
            <div style="text-align:center">
                <img src="/static/tt_website_rodextrip/images/nofound/no-event.png" style="width:60px; height:60px;" alt="Hotel Not Found" title="" />
                <br/><br/>
                <span style="font-size:14px; font-weight:600;">Oops! Event not found. Please try another event</span>
            </div>
        </div>`;
        $('#event_error').show();
        $('#pagination-container').hide();
        $('#pagination-container2').hide();
    }else{
        document.getElementById("event_error").innerHTML = '';
        $('#event_error').hide();
        $('#pagination-container').show();
        $('#pagination-container2').show();
    }
    document.getElementById("hotel_result").innerHTML = '';
    text = '';
    text+=`
    <div style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px;">
        <span style="font-weight:bold; font-size:14px;"> Event - `+count_available_event+` results</span>
    </div>`;
    document.getElementById("hotel_result").innerHTML = text;
}

function filter_name(name_num){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        change_filter('hotel_name'+ String(name_num),'');
    }, 500);
}

function change_filter(type, value){
    var check = 0;
    if(type == 'category'){
        if (selected_categ.includes(value)){
            for( var i = 0; i < selected_categ.length; i++){
               if (selected_categ[i] === value) {
                 selected_categ.splice(i, 1);
                 document.getElementById("checkbox_event_"+value).checked = false;
                 break;
               }
            }
        } else {
            selected_categ.push(value);
            document.getElementById("checkbox_event_"+value).checked = true;
        }
    };
    filtering('filter', 1);
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
                text+='<span id="option_detail_grand_total" style="font-weight:bold; font-size:15px;">' + option_currency_pick + ' ' + getrupiah(grand_total_option) + '</span>'
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
    grand_total_option = 0;
    var total_commission = 0;
    $text = '';
    var copy_event_name = document.getElementById("product_title").innerHTML;
    $text += copy_event_name + '\n\n';
    for (i in val){
        grand_total_option = grand_total_option + (val[i].qty * val[i].price);
        total_commission = total_commission + (val[i].qty * val[i].comm);

        $text += val[i].name + '\n';
        $text += val[i].qty + ' x ' + val[i].currency + ' ' + getrupiah(val[i].price) + '\n';
        $text += 'Sub Total: ' + val[i].currency + ' ' + getrupiah(val[i].price * val[i].qty) + '\n\n';

        text+=`
        <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:left;">
                <span style="font-weight:500;">`+val[i].name+` <br/> ( `+val[i].qty+` Qty )</span>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:center;">`;
                text+='<span style="font-weight:500;"> @ ' + val[i].currency + ' ' + getrupiah(val[i].price) + '</span>';
            text+=`
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:right;">`;
            text+='<span style="font-weight:500;">' + val[i].currency + ' ' + getrupiah(val[i].price * val[i].qty) + '</span>';
        text+=`
            </div>
        </div>`;
    }
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
        tax = 0;
        fare = 0;
        total_price = 0;
        total_price_provider = [];
        price_provider = 0;
        commission = 0;

        $text += 'Contact Person:\n';
        $text += contact[0].title + ' ' + contact[0].first_name + ' ' + contact[0].last_name + '\n';
        $text += contact[0].email + '\n';
        $text += contact[0].calling_code + ' - ' +contact[0].mobile + '\n\n';
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
        type_amount_repricing = ['Repricing'];
        for(i in adult){
            if(price_arr_repricing.hasOwnProperty(adult[i].pax_type) == false){
                price_arr_repricing[adult[i].pax_type] = {}
                pax_type_repricing.push([adult[i].pax_type, adult[i].pax_type]);
            }

            price_arr_repricing[adult[i].pax_type][adult[i].first_name +adult[i].last_name] = {
                'Fare': 0,
                'Tax': 0,
                'Repricing': 0
            }

        }
        //repricing
        text_repricing = `
        <div class="col-lg-12">
            <div style="padding:5px;" class="row">
                <div class="col-lg-6"></div>
                <div class="col-lg-6">Repricing</div>
            </div>
        </div>`;
        for(k in price_arr_repricing){
            for(l in price_arr_repricing[k]){
                text_repricing += `
                <div class="col-lg-12">
                    <div style="padding:5px;" class="row" id="adult">
                        <div class="col-lg-6" id="`+l+`_`+k+`">`+l+`</div>
                        <div hidden id="`+l+`_price">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                        if(price_arr_repricing[k][l].Repricing == 0)
                            text_repricing+=`<div class="col-lg-6" id="`+l+`_repricing">-</div>`;
                        else
                            text_repricing+=`<div class="col-lg-6" id="`+l+`_repricing">`+getrupiah(price_arr_repricing[k][l].Repricing)+`</div>`;
                        text_repricing+=`<div hidden id="`+l+`_total">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                    </div>
                </div>`;
            }
        }
        text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
        document.getElementById('repricing_div').innerHTML = text_repricing;
        //repricing
    }
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
        text+=`<div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
    }
    try{
        if(upsell_price != 0){
            text+=`
            <div class="row">
                <div class="col-lg-7" style="text-align:left;">
                    <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
                </div>
                <div class="col-lg-5" style="text-align:right;">`;
                if(val[i].currency == 'IDR')
                text+=`
                    <span style="font-size:13px; font-weight:500;">`+val[i].currency+` `+getrupiah(upsell_price)+`</span><br/>`;
                else
                text+=`
                    <span style="font-size:13px; font-weight:500;">`+val[i].currency+` `+upsell_price+`</span><br/>`;
                text+=`
                </div>
            </div>`;
        }
        grand_total_option += upsell_price;
        //$text += 'Grand Total: '+val[i].currency+' '+ getrupiah(grand_total_option);
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }

    $text += 'Grand Total: '+val[i].currency+' '+ getrupiah(grand_total_option);
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
    </div>

    <div class="row">
        <div class="col-lg-12" style="padding-bottom:10px;">
            <hr/>
            <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
            share_data();
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                text+=`
                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
            } else {
                text+=`
                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
            }
    text+=`
        </div>
    </div>`;

    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
        text+= print_commission(total_commission*-1,'show_commission_event',val[i].currency)

        text+=`
        <div style="margin-bottom:5px;">
            <input class="primary-btn-white" id="show_commission_button_event" style="width:100%;" type="button" onclick="show_commission_event();" value="Hide YPM"/>
        </div>`;

    text+=`<center>

    <div style="padding-bottom:10px;">
        <center>
            <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
        </center>
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
                <a href="https://wa.me/?text=`+ $text_share2 +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                <a href="line://msg/text/`+ $text_share2 +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                <a href="https://telegram.me/share/url?text=`+ $text_share2 +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                <a href="mailto:?subject=This is the event price detail&amp;body=`+ $text_share2 +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
        } else {
            text+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share2 +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share2 +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                <a href="https://telegram.me/share/url?text=`+ $text_share2 +`&url=Share2" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                <a href="mailto:?subject=This is the event price detail&amp;body=`+ $text_share2 +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
        }
    text +=`</div>`;
    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
        text+=`<div class="col-lg-12">`
        text+= print_commission(total_commission,'show_commission_event','IDR', 'commission_val')
        text+=`</div>`
        text+=`
        <div class="col-lg-12">
            <input class="primary-btn-white" id="show_commission_button_event" style="width:100%;" type="button" onclick="show_commission_event();" value="Hide YPM"/>
        </div>`;
    text += `
    <div class="col-lg-12" style="padding-top:10px;">
        <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data2();" value="Copy">
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
        scs.value = "Hide YPM";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show YPM";
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
        scs.value = "Hide YPM";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show YPM";
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
    }if(document.getElementById('booker_title').value == ''){
        error_log+= 'Please choose booker title!</br>\n';
        $("#booker_title").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        $("#booker_title").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
        });
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
    if(booker_copy == 'yes')
        if(document.getElementById('booker_title').value != document.getElementById('adult_title1').value ||
           document.getElementById('booker_first_name').value != document.getElementById('adult_first_name1').value ||
           document.getElementById('booker_last_name').value != document.getElementById('adult_last_name1').value)
                error_log += 'Copy booker to passenger true, value title, first name, and last name has to be same!</br>\n';
   //adult
   for(i=1;i<=adult;i++){

       if(check_name(document.getElementById('adult_title'+i).value,
            document.getElementById('adult_first_name'+i).value,
            document.getElementById('adult_last_name'+i).value,
            length_name) == false){
           error_log+= 'Total of person '+i+' name maximum '+length_name+' characters!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_title'+i).value == ''){
            error_log+= 'Please choose title of adult passenger '+i+'!</br>\n';
           $("#adult_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid red');
            });
       }else{
           $("#adult_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
       }if(document.getElementById('adult_first_name'+i).value == '' || check_word(document.getElementById('adult_first_name'+i).value) == false){
           if(document.getElementById('adult_first_name'+i).value == '')
               error_log+= 'Please input first name of contact person !</br>\n';
           else if(check_word(document.getElementById('adult_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of contact person !</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
       }
       //check lastname
       if(check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value) != ''){
           error_log += 'Please '+check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value)+' contact person !</br>\n';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for contact person !</br>\n';
           document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for contact person '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_cp'+i).checked == true){
            if(check_email(document.getElementById('adult_email'+i).value)==false){
                error_log+= 'Invalid Contact person email!</br>\n';
                document.getElementById('adult_email'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('adult_email'+i).style['border-color'] = '#EFEFEF';
            }
            if(check_phone_number(document.getElementById('adult_phone'+i).value)==false){
                error_log+= 'Phone number Contact person only contain number 8 - 12 digits!</br>\n';
                document.getElementById('adult_phone'+i).style['border-color'] = 'red';
            }else
                document.getElementById('adult_phone'+i).style['border-color'] = '#EFEFEF';
       }
   }

   check_extra_question_answer(event_option_code);

   if(error_log==''){
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
       }
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


}

function hotel_review_price_total(prices){
    prices = prices.replace(/&#39;/g, '"');
    prices = prices.replace(/&quot;/g, '"');
    prices = prices.replace(/False/g, 'false');
    prices = prices.replace(/True/g, 'true');
    prices = prices.replace(/None/g, '[]');

    prices = JSON.parse(prices);
    var element_printed = '<h4>Price Detail</h4><hr/>';

    element_printed += 'Commission : IDR ' + getrupiah(1000) + '<br/>';
    element_printed += 'Total Price: IDR ' + getrupiah(25000);
    document.getElementById('price_total').innerHTML = element_printed;
}

function update_contact_cp(val){
    temp = 1;
    while(temp != adult+1){
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

function render_extra_question(json_event_answer){
    var text='';
    text+=`<div class="row">`;
    for (i in json_event_answer){
        text+=`<div class="col-lg-12"><div style="padding:15px; border:1px solid #cdcdcd; margin-bottom:15px;">`;
        var idx_event_ans = parseInt(json_event_answer[i].idx) + 1;
        if(i == 0){
            text+=`<h6>`+json_event_answer[i].option_grade+` - `+idx_event_ans+`
            <span id="question_down_opt`+i+`" style="padding-left:5px; font-size:12px; color:`+color+`; cursor:pointer; display:none;" onclick="show_question_event_review('question', `+i+`)";> Hide Your Answer</span>
            <span id="question_up_opt`+i+`" style="padding-left:5px; font-size:12px; color:`+color+`; cursor:pointer; display:inline-block;" onclick="show_question_event_review('question', `+i+`)";> Show Your Answer</span>
            </h6>`;
        }else{
            text+=`<h6>`+json_event_answer[i].option_grade+` - `+idx_event_ans+`
            <span id="question_down_opt`+i+`" style="padding-left:5px; font-size:12px; color:`+color+`; cursor:pointer; display:none;" onclick="show_question_event_review('question', `+i+`)";> Hide Your Answer</span>
            <span id="question_up_opt`+i+`" style="padding-left:5px; font-size:12px; color:`+color+`; cursor:pointer; display:inline-block;" onclick="show_question_event_review('question', `+i+`)";> Show Your Answer</span>
            </h6>`;
        }
        text+=`
        <div class="row" id="question_opt`+i+`" style="display:none;">`;
            for (j in json_event_answer[i].answer){
                var ans_index = (parseInt(j))+1;
                text+=`<div class="col-lg-12" style="margin-top:15px;">
                    <div style="padding:15px; border: 1px solid #cdcdcd; background: #f7f7f7;">
                        <h6>Question #`+ans_index+` - <i>`+ json_event_answer[i].answer[j].que +`</i></h6>
                        <span>Answer:</span>
                        <span style="font-weight:500;">`+ json_event_answer[i].answer[j].ans +`</span>
                    </div>
                </div>`;
            }
        text+=`</div>`;
        text+=`</div></div>`;
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

function go_to_owl_carousel_bottom(counter, co_i){
    text_img = '';
    var idx_img_bot = 1;
    text_img +=`
    <div class="owl-carousel-hotel-img-modal owl-theme" style="text-align:center;">`;
    if(temp_response.hotel_ids[co_i].images.length != 0){
        for(idx_img_bot; idx_img_bot < temp_response.hotel_ids[co_i].images.length; idx_img_bot++){
            if(idx_img_bot < 5){
                //jgn delete
                //<div class="img-event-search zoom-img" style="background-size:contain; height:400px; background-repeat: no-repeat; cursor:pointer; background-image: url('`+temp_response.hotel_ids[co_i].images[idx_img_bot].url+`');"></div>

                text_img +=`
                <div class="item" style="cursor:zoom-in; float:none; display:inline-block;">
                    <img class="img-fluid zoom-img" src="`+temp_response.hotel_ids[co_i].images[idx_img_bot].url+`" alt="Event" style="margin: auto; max-height:500px;">
                </div>`;
            }
            else{
                break;
            }
        }
    }
    else{
        text_img+=`<img src="/static/tt_website_rodextrip/images/no pic/no-event.png" alt="Not Found Event" width="60" height="60" style="margin-right:10px; border-radius:4px; border:1px solid #cdcdcd;">`;
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
                    text_change_img+=`<img src="/static/tt_website_rodextrip/images/no pic/no-event.png" alt="Not Found Event" width="60" height="60" style="margin-right:10px; border-radius:4px; border:1px solid #cdcdcd;">`;
                }

                document.getElementById('pagination_image'+i).innerHTML = text_change_img;
            }
        }
    }
}

function reset_filter(){
    for(i in selected_categ){
        document.getElementById("checkbox_event_"+i).checked = false;
        document.getElementById("checkbox_event_"+i).checked = false;
        selected_categ.splice(i, 1);
    }
    filtering('filter');
}

//function display_tags_event(idx, total_category){
//    var display_more = document.getElementById('category_list_more'+idx);
//    display_more.style.display = "none";
//
//    for(i = 3; i < total_category; i++){
//        document.getElementById('tags_more'+idx+i).style.display = "inline-block";
//    }
//}

function check_extra_question_answer(option_code){
    var check_error_question = 0;
    for(j in option_code){
        var k = 0;
        while(k < parseInt(option_code[j].qty)){
            var co_ticket_idx = parseInt(k)+1;
            for(i in extra_question_result){
                var co_index = (parseInt(i))+1;
                if (extra_question_result[i].required){
                    if(extra_question_result[i].type == 'boolean'){
                        var que_radio = $('input[name=question_event_'+j+'_'+k+'_'+i+']:checked').val()
                        var temp_que = document.getElementById('boolean_question_event_'+j+'_'+k+'_'+i);
                        if(que_radio == undefined){
                            temp_que.style.border= "1px solid red";
                            temp_que.style.padding= "10px 10px 0px 10px";
                            check_error_question = 1;
                        }else{
                            temp_que.style.border= "unset";
                            temp_que.style.padding= "unset";
                        }
                    }else if(extra_question_result[i].type == 'selection'){
                        if(extra_question_result[i].answers.length > 3){
                            var que_selection = $('#question_event_'+j+'_'+k+'_'+i+' option:selected').val();
                            var temp_que = document.getElementById('select_question_event_'+j+'_'+k+'_'+i);
                            if(que_selection == ''){
                                temp_que.style.border= "1px solid red";
                                check_error_question = 1;
                            }else{
                                temp_que.style.border= "unset";
                            }
                        }else{
                            var que_radio = $('input[name=question_event_'+j+'_'+k+'_'+i+']:checked').val()
                            var temp_que = document.getElementById('boolean_question_event_'+j+'_'+k+'_'+i);
                            if(que_radio == undefined){
                                temp_que.style.border= "1px solid red";
                                temp_que.style.padding= "10px 10px 10px 10px";
                                check_error_question = 1;
                            }else{
                                temp_que.style.border= "unset";
                                temp_que.style.padding= "unset";
                            }
                        }
                    }else if(extra_question_result[i].type == 'checkbox'){
                        var que_checkbox = $('input:checkbox.question_event_checkbox'+j+'_'+k+'_'+i+':checked').length;
                        var temp_que = document.getElementById('checkbox_question_event_'+j+'_'+k+'_'+i);
                        if(que_checkbox == 0){
                            temp_que.style.border= "1px solid red";
                            temp_que.style.padding= "0px 10px 0px 10px";
                            check_error_question = 1;
                        }else{
                            temp_que.style.border= "unset";
                            temp_que.style.padding= "unset";
                        }
                    }else{
                        var temp_que = document.getElementById('question_event_'+j+'_'+k+'_'+i);
                        if(temp_que.value == ''){
                            temp_que.style.border= "1px solid red";
                            check_error_question = 1;
                        }else{
                            temp_que.style.border= "1px solid #cdcdcd";
                        }
                    }
                }

                if(extra_question_result[i].type == 'email'){
                    var temp_que = document.getElementById('question_event_'+j+'_'+k+'_'+i);
                    if(temp_que.value != ''){
                        if(check_email(temp_que.value) == false){
                            temp_que.style.border= "1px solid red";
                            check_error_question = 1;
                        }else{
                            temp_que.style.border= "1px solid #cdcdcd";
                        }
                    }else{
                        temp_que.style.border= "1px solid #cdcdcd";
                    }
                }
            }
            k += 1;
        }
    }

    if(check_error_question == 1)
        error_log += "Please Fill Your Answers Correctly in the Extra Question <br/>";
}

function regex_input_number(temp){
    var que_id = document.getElementById(temp);
    que_id.value = que_id.value.replace(/(?!^-)[^0-9.]/g, "").replace(/(\..*)\./g, '$1');
}

function from_page_event(from){
    page_from_name = from;
}