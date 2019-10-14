var myVar;
var hotel_room_detail_pick = null;
var hotel_room = [];
var hotel_filter = [];
var sorting_value = '';
var hotelAutoCompleteVar;
var hotel_choices = [];
var checking_price = 0;
var checking_slider = 0;
var rating_list = [
    {
        value:'1',
        status: false
    },{
        value:'2',
        status: false
    },{
        value:'3',
        status: false
    },{
        value:'4',
        status: false
    },{
        value:'5',
        status: false
    }
]

var sorting_list = [
    {
        value:'Lowest Price',
        status: false
    },{
        value:'Highest Price',
        status: false
    },{
        value:'Name Ascending',
        status: false
    },{
        value:'Name Descending',
        status: false
    },{
        value:'Rating Up',
        status: false
    },{
        value:'Rating Down',
        status: false
    }
]

var sorting_list2 = [
    {
        value:'Price',
        status: false
    },{
        value:'Name',
        status: false
    },{
        value:'Rating',
        status: false
    }
]

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
    var pj = price.toString().length;
    var temp = price.toString();
    var priceshow="";
    for(x=0;x<pj;x++){
        if((pj-x)%3==0 && x!=0){
        priceshow+=".";
        }
        priceshow+=temp.charAt(x);
    }
    return priceshow;

}

function guest_child_age(){
    text= '';
    var gca = parseInt(document.getElementById("hotel_child").value);

    if(parseInt(document.getElementById("hotel_child").value) > 0){
        text+= `
            <div class="col-lg-12">
                <span style="color:black; font-size:13px;">Child Age</span>
            </div>`;
        for(i = 1; i <= gca; i++){
        text+= `
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="margin-top:10px;">
            <select class="form-select nice-select-default" id="hotel_child_age`+i+`" name="hotel_child_age`+i+`">
                <option value="" disabled>Child Age</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
            </select>
        </div>`;
        }
    }
    document.getElementById("guest_child_age").innerHTML = text;
}

function business_trip_check(){
    if(document.getElementById("business_trip").value == 'false')
        document.getElementById("business_trip").value = 'true';
    else
        document.getElementById("business_trip").value = 'false';
}

function hotel_search_validation(){
    text= '';
    if(document.getElementById("hotel_id_destination").value == '')
        text+= 'Please fill destination\n';
    if(document.getElementById("hotel_id_nationality").value == '')
        text+= 'Please fill nationality\n';
    today = new Date().toString().split(' ');
    if(moment(today[2]+' '+today[1]+' '+today[3], 'DD MMM YYYY') >= moment(document.getElementById("hotel_checkin").value, 'DD MMM YYYY'))
        text+= 'Checkin date must 1 day from today\n';
    if(document.getElementById("hotel_checkin").value == '')
        text+= 'Please fill checkin date\n';
    if(document.getElementById("hotel_checkout").value == '')
        text+= 'Please fill checkout date\n';
    //check no error
    if(text == ''){
        document.getElementById('hotel_searchForm').submit();
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
                    console.log(obj.rating);
                    if(rating_list[0].status == true && obj.rating == false){
                        temp_data.push(obj);
                    }
                }
            });
            data.hotel_ids = temp_data;
            hotel_filter = data;
            temp_data = [];
            high_price_slider = 0;
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
        }

        if(checking_slider == 1){
            if (check_rating != 1 || !searched_name){
                checking_price = 1;
                sort(data, 1);
            }
            else{
                checking_price = 1;
                sort(data, 0);
            }
        }
        // Perubahan high price jika di trigger dari input user
        else{
            $maxPrice = parseFloat(document.getElementById('price-to').value);
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

function sort(response, check_filter){
        //no filter
        sorting = sorting_value;
        if(check_filter == 1){
            for(i in response.hotel_ids){
                for(j in response.hotel_ids[i].prices){
                    if (high_price_slider < response.hotel_ids[i].prices[j]['price']){
                        high_price_slider = response.hotel_ids[i].prices[j]['price'];
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

            if (checking_price == 1){
                document.getElementById("price-to").value = high_price_slider;
                $(".js-range-slider").data("ionRangeSlider").update({
                     from: 0,
                     to: high_price_slider,
                     min: 0,
                     max: high_price_slider,
                     step: step_slider
                });
                checking_price = 0;
            }
        }
        else{
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
            if (checking_price == 1){
                $(".js-range-slider").data("ionRangeSlider").update({
                     from: 0,
                     to: high_price_slider,
                     min: 0,
                     max: high_price_slider,
                     step: step_slider
                });
                checking_price = 0;
            }
        }

        for(var i = 0; i < response.hotel_ids.length-1; i++) {
            for(var j = i+1; j < response.hotel_ids.length-1; j++) {
                if(sorting == 'Lowest Price'){
                    var price_i = 0;
                    var price_j = 0;
                    if(response.hotel_ids[i].prices.length > 0)
                        price_i = response.hotel_ids[j].prices[0].price_total;
                    else
                        price_i = 0;
                    if(response.hotel_ids[j].prices.length > 0)
                        price_j = response.hotel_ids[j].prices[0].price_total;
                    else
                        price_j = 0;
                    if(price_i > price_j){
                        var temp = response.hotel_ids[i];
                        response.hotel_ids[i] = response.hotel_ids[j];
                        response.hotel_ids[j] = temp;
                    }
                }else if(sorting == 'Highest Price'){
                    var price_i = 0;
                    var price_j = 0;
                    if(response.hotel_ids[i].prices.length > 0)
                        price_i = response.hotel_ids[j].prices[0].price_total;
                    else
                        price_i = 0;
                    if(response.hotel_ids[j].prices.length > 0)
                        price_j = response.hotel_ids[j].prices[0].price_total;
                    else
                        price_j = 0;
                    if(price_i < price_j){
                        var temp = response.hotel_ids[i];
                        response.hotel_ids[i] = response.hotel_ids[j];
                        response.hotel_ids[j] = temp;
                    }
                }else if(sorting == 'Name Ascending'){
                    if(response.hotel_ids[i].name > response.hotel_ids[j].name){
                        var temp = response.hotel_ids[i];
                        response.hotel_ids[i] = response.hotel_ids[j];
                        response.hotel_ids[j] = temp;
                    }
                }else if(sorting == 'Name Descending'){
                    if(response.hotel_ids[i].name < response.hotel_ids[j].name){
                        var temp = response.hotel_ids[i];
                        response.hotel_ids[i] = response.hotel_ids[j];
                        response.hotel_ids[j] = temp;
                    }
                }else if(sorting == 'Rating Up'){
                    if(response.hotel_ids[i].rating > response.hotel_ids[j].rating){
                        var temp = response.hotel_ids[i];
                        response.hotel_ids[i] = response.hotel_ids[j];
                        response.hotel_ids[j] = temp;
                    }
                }else if(sorting == 'Rating Down'){
                    if(response.hotel_ids[i].rating < response.hotel_ids[j].rating){
                        var temp = response.hotel_ids[i];
                        response.hotel_ids[i] = response.hotel_ids[j];
                        response.hotel_ids[j] = temp;
                    }
                }
            }
        }
        document.getElementById("hotel_result_city").innerHTML = '';
        text = '';
        var node = document.createElement("div");
        var city_ids_length = parseInt(response.city_ids.length);
        text+=`
        <div onclick="show_hide_city_hotel();" style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px; cursor:pointer;">
            <h6 id="city_hotel_down"> Suggestions by City - `+city_ids_length+` results <i class="fas fa-chevron-down" style="color:#f15a22; float:right;"></i></h6>
            <h6 id="city_hotel_up" style="display:none;"> Suggestions by City - `+city_ids_length+` results <i class="fas fa-chevron-up" style="color:#f15a22; float:right;"></i></h6>
        </div>`;
        node.innerHTML = text;
        document.getElementById("hotel_result_city").appendChild(node);
        node = document.createElement("div");

        document.getElementById("hotel_city").innerHTML = '';
        text='';
        var node = document.createElement("div");
        for(i in response.city_ids){
            text = '<form id="hotel_city'+i+'" action="/hotel/detail" method="POST" class="c-pointer">';
                if(response.city_ids[i].image != false)
                    text+=`<div class="img-hotel-search-c" style="background-image: url('`+response.city_ids[i].image+`');border:1px solid #cdcdcd;"></div>`;
                else
                    text+=`<div class="img-hotel-search-c" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');border:1px solid #cdcdcd;"></div>`;
                text+=`
                <div class="text-block-custom">
                    <span style="font-size:13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;"><i class="fas fa-map-marker-alt" style="color:#FFC44D;"></i> `+response.city_ids[i].name+` `+response.city_ids[i].country_name+`</span><br/>
                    <span style="font-size:13px;">`+response.city_ids[i].hotel_qty+` Found</span>
                </div>
            </form>`;
            node.className = 'col-lg-3 col-md-3 col-sm-4 col-xs-6';
            node.innerHTML = text;
            document.getElementById("hotel_city").appendChild(node);
            node = document.createElement("div");
        }
        document.getElementById("hotel_result_landmark").innerHTML = '';
        text = '';
        var node = document.createElement("div");
        var landmark_ids_length = parseInt(response.landmark_ids.length);
        text+=`
        <div onclick="show_hide_landmark_hotel();" style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px; cursor:pointer;">
            <h6 id="landmark_hotel_down"> Suggestions by Landmark - `+landmark_ids_length+` results <i class="fas fa-chevron-down" style="color:#f15a22; float:right;"></i></h6>
            <h6 id="landmark_hotel_up" style="display:none;"> Suggestions by Landmark - `+landmark_ids_length+` results <i class="fas fa-chevron-up" style="color:#f15a22; float:right;"></i></h6>
        </div>`;
        node.innerHTML = text;
        document.getElementById("hotel_result_landmark").appendChild(node);
        node = document.createElement("div");

        document.getElementById("hotel_landmark").innerHTML = '';
        text='';
        var node = document.createElement("div");
        for(i in response.landmark_ids){
            text = '<form id="hotel_landmark'+i+'" action="/hotel/detail" method="POST" class="c-pointer">';
                if(response.landmark_ids[i].images.length != 0)
                    text+=`<div class="img-hotel-search-c" style="background-image: url('`+response.landmark_ids[i].images[0].url+`');border:1px solid #cdcdcd;"></div>`;
                else
                    text+=`<div class="img-hotel-search-c" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');border:1px solid #cdcdcd;"></div>`;

                text+=`
                <div class="text-block-custom">
                    <span style="font-size:13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;">`+response.landmark_ids[i].name+`</span><br/>
                    <span style="font-size:13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;"><i class="fas fa-map-marker-alt" style="color:#FFC44D;"></i> `+response.landmark_ids[i].city+`</span><br/>
                    <span style="font-size:13px;">`+response.landmark_ids[i].near_by_hotel+` Found</span>
                </div>
            </form>`;
            node.className = 'col-lg-3 col-md-3 col-sm-4 col-xs-6';
            node.innerHTML = text;
            document.getElementById("hotel_landmark").appendChild(node);
            node = document.createElement("div");
        }

        document.getElementById("hotel_result").innerHTML = '';
        text = '';
        var node = document.createElement("div");
        var hotel_ids_length = parseInt(response.hotel_ids.length);
        text+=`
        <div style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px;">
            <span style="font-weight:bold; font-size:14px;"> Hotel - `+hotel_ids_length+` results</span>
            <label class="check_box_custom" style="float:right;">
                <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                <input type="checkbox" id="check_all_copy" onchange="check_all_result();"/>
                <span class="check_box_span_custom"></span>
            </label>
        </div>`;
        node.innerHTML = text;
        document.getElementById("hotel_result").appendChild(node);
        node = document.createElement("div");

        document.getElementById("hotel_ticket").innerHTML = '';
        text='';
        if(response.hotel_ids.length != 0){
            for(i in response.hotel_ids){
                text = '<form id="hotel'+i+'" action="/hotel/detail" method="POST">';
                //msg.result.response.city_ids[i].sequence
                text+=`
                <div class="row">
                    <div class="col-lg-12" style="margin-bottom:25px;">
                        <div style="top:0px; right:10px; position:absolute;">
                            <label class="check_box_custom">
                                <span class="span-search-ticket"></span>
                                <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopy();"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                            <span class="id_copy_result" hidden>`+i+`</span>
                        </div>
                    </div>`;
                    if(response.hotel_ids[i].images.length != 0){
                        text+=`
                        <div class="col-lg-3 col-md-3">
                            <div class="img-hotel-search" style="background-image: url(`+response.hotel_ids[i].images[0].url+`);" onclick="goto_detail('hotel',`+i+`)"></div>
                        </div>`;
                    }
                    else{
                        text+=`
                        <div class="col-lg-3">
                            <div class="img-hotel-search" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');"></div>
                        </div>`;
                    }
                    text+=`
                    <div class="col-lg-9" style="padding-left: 0;">
                        <div class="row">
                            <div class="col-lg-12">
                                <div style="margin-bottom:10px;">
                                    <a href="#"><h4 class="name_hotel" title="`+response.hotel_ids[i].name+`" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right:20px;" onclick="goto_detail('hotel',`+i+`)">`+response.hotel_ids[i].name+`</h4></a>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7">
                                <div style="margin-bottom:10px;">
                                <span>
                                    <span style="border: 2px solid #f15a22; border-radius:7px; padding-left:10px; padding-right:10px; margin-right:5px; font-weight: bold;"> Hotel </span>`;
                                if(response.hotel_ids[i].rating != false){
                                    for (co=0; co < parseInt(response.hotel_ids[i].rating); co++){
                                        text+=`<i class="fas fa-star" style="color:#FFC44D;"></i>`;
                                    }
                                    text+=`<span class="rating_hotel" hidden>*`+response.hotel_ids[i].rating+`</span>`;
                                }
                                else{
                                    text+=`<span class="rating_hotel" hidden>Unrated</span>`;
                                }
                            text+=`</span></div>`;
                            detail = JSON.stringify(response.hotel_ids[i]);
                            detail = detail.replace(/'/g, "");
                            text+=`<input type="hidden" id="hotel_detail" name="hotel_detail" value='`+detail+`'/>`;
                            text+=`
                            <div>
                                <i class="fas fa-map-marker-alt" style="color:#f15a22;"></i> <span class="location_hotel" style="font-size:13px;">`;
                            if(response.hotel_ids[i].location.city)
                                text+= response.hotel_ids[i].location.city;
                //            if(response.hotel_ids[i].location.address != false)
                //                text+= ' '+ response.hotel_ids[i].location.address;
                            if(response.hotel_ids[i].location.district)
                                text+= ' '+ response.hotel_ids[i].location.district;
                            if(response.hotel_ids[i].location.state)
                                text+= ' '+ response.hotel_ids[i].location.state;
                //            if(response.hotel_ids[i].location.kelurahan != false)
                //                text+= ' '+ response.hotel_ids[i].location.kelurahan;
                //            if(response.hotel_ids[i].location.zipcode != false)
                //                text+= ' '+ response.hotel_ids[i].location.zipcode;
                            text+=`</span> - <a href="#" style="color:blue; text-decoration: underline;">Show Map</a>
                                </div>
                            </div>
                            <div class="col-lg-5 col-md-5">
                                <div class="row">`;
                                    if(Object.keys(response.hotel_ids[i].prices).length > 0){
                                        var best_price = [];
                                        var check_price = 0;
                                        for(j in response.hotel_ids[i].prices){
                                            check_price += 1;
                                            if(check_price < 4){
                                                text += `<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                                <span style="font-size:13px; font-weight: 500; text-align:left;">` + j +`</span>
                                                </div>
                                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                                                    <span style="font-size:13px; font-weight: 700; text-align:right;">IDR ` + getrupiah(response.hotel_ids[i].prices[j]['price']) + `</span>
                                                </div>`;
                                            }
                                            if(response.hotel_ids[i].prices[j]['price'] != 0 && response.hotel_ids[i].prices[j]['price'] != false && response.hotel_ids[i].prices[j]['price'] != "-")
                                                best_price.push(response.hotel_ids[i].prices[j]['price']);
                                        }

                                        if (check_price > 3){
                                            text += `<div class="col-lg-12">
                                                <span style="font-size:13px; font-weight:700; text-align:left; cursor:pointer;" data-toggle="dropdown"> View all `+ check_price +` <i class="fas fa-caret-down"></i></span>
                                                <ul class="dropdown-menu" role="menu" style="top:-10px !important; border:1px solid black;">
                                                    <div class="row" style="padding:10px;">`;
                                                    for(j in response.hotel_ids[i].prices){
                                                        text += `<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                                        <span style="font-size:13px; font-weight: 500; text-align:left;">` + j +`</span>
                                                        </div>
                                                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                                                            <span style="font-size:13px; font-weight: 700; text-align:right;">IDR ` + getrupiah(response.hotel_ids[i].prices[j]['price']) + `</span>
                                                        </div>`;
                                                    }
                                                    text+=`</div>
                                                </ul>
                                            </div>`;
                                        }

                                        best_price.sort(function(a, b){return a - b});
                                        if(best_price[0] != undefined)
                                            text+=`<span class="price_hotel" hidden>IDR ` + getrupiah(best_price[0]) + `</span>`;
                                        else
                                            text+=`<span class="price_hotel" hidden>Waiting price from vendor</span>`;
                                    } else {
                                        for(j in response.hotel_ids[i].external_code){
                                            text += `<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                            <span style="font-size:13px; font-weight: 500; text-align:left;">` + j +`</span>
                                        </div>
                                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                                            <span style="font-size:13px; font-weight: 700; text-align:right;">-</span>
                                        </div>`;
                                        }
                                        text+=`<span class="price_hotel" hidden>Waiting price from vendor</span>`;
                                    }
                                   text += `
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7" style="text-align:left; padding-top:20px;">
                                Facilities:<br/>
                                <span>`;
                                try{
                                    for(j in top_facility){
                                        var facility_check = 0;
                                        for(k in response.hotel_ids[i].facilities){
                                            if(top_facility[j].internal_code == response.hotel_ids[i].facilities[k].facility_id){
                                                facility_check = 1;
                                                break;
                                            }
                                        }

                                    if(facility_check == 1){
                                        text+=`<img src="`+top_facility[j].image_url+`" style="width:20px; height:20px; margin-right:8px;" data-toggle="tooltip" data-placement="top" title="`+top_facility[j].facility_name+`"/>`;
                                    }
                                    else{
                                        text+=`<img src="`+top_facility[j].image_url2+`" style="width:20px; height:20px; margin-right:8px;" data-toggle="tooltip" data-placement="top" title="No `+top_facility[j].facility_name+`"/>`;
                                    }
                                }
                            }catch(err){}
                            text+=`</span>
                                </div>
                                <div class="col-lg-5  col-md-5" style="text-align:right; padding-top:15px;">
                                   <button type="button" class="primary-btn-custom" onclick="goto_detail('hotel',`+i+`)">Select</button>
                                   <br/>
                                   <span style="font-size:11px; margin-top:10px; font-weight:400;"> For 1 Night(s) </span>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
                </form>`;
                //tambah button ke detail
                node.className = 'sorting-box-b';
                node.innerHTML = text;
                document.getElementById("hotel_ticket").appendChild(node);
                node = document.createElement("div");
            }
            $('#loading-search-hotel').hide();

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
        }
        else{
            $('#pagination-container').hide();
            $('#pagination-container2').hide();
        }

        /*for(i in response.landmark_ids){
            text = '<form id="hotel'+i+'" action="/hotel/detail" method="POST">';
            text += `{%csrf_token%}`;
            //msg.result.response.city_ids[i].sequence
            if(response.landmark_ids[i].images.length != 0)
                text+=`<img data-toggle="tooltip" class="airline-logo" style="width:50px;height:50px;" src="`+response.landmark_ids[i].images[0].url+`"><span> </span>`;
            else
                text+=`<img data-toggle="tooltip" class="airline-logo" style="width:50px;height:50px;" src="/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg"><span> </span>`;
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

function filter_name(){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        change_filter('','');
    }, 500);
}

function change_filter(type, value){
    var check = 0;
    if(type == 'rating'){
        rating_list[value].status = !rating_list[value].status;
    }
    filtering('filter', 1);
}

function hotel_filter_render(){

    var node = document.createElement("div");
    text = '';
    text+= `
    <span style="font-size:14px; font-weight:600;">Session Time <span style="font-size:16px; font-weight:700; color:#f15a22;" id="session_time"> </span></span>
    <hr/>
    <span style="font-size:14px; font-weight:600;">Elapsed Time <span style="font-size:16px; font-weight:700; color:#f15a22;" id="elapse_time"> </span></span>`;

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("session_timer").appendChild(node);
    node = document.createElement("div");

    text = '';
    text+= `<h4>Filter</h4>
    <hr/>
    <h6 style="padding-bottom:10px;">Hotel Name</h6>
    <input type="text" class="form-control-custom" id="hotel_filter_name" placeholder="Hotel Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Hotel Name '" autocomplete="off" onkeyup="filter_name();"/>
    <hr/>
    <h6 style="padding-bottom:10px;">Price Range</h6>
    <div class="wrapper">
        <div class="range-slider">
            <input type="text" class="js-range-slider"/>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <input type="text" class="js-input-from form-control-custom" id="price-from" value="0" />
            </div>
            <div class="col-lg-6">
                <input type="text" class="js-input-to form-control-custom" id="price-to" value="`+high_price_slider+`" />
            </div>
        </div>
    </div>
    <hr/>
    <h6 style="padding-bottom:10px;">Rating</h6>`;
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
                <span style="color:white; font-size:14px;"><span id="badge-copy-notif">0</span> Copy Selected <i class="fas fa-copy"></i></span>
            </button>`
    var node = document.createElement("div");
    node.className = 'sorting-box';
    node.innerHTML = text;
    document.getElementById("sorting-hotel").appendChild(node);
    node = document.createElement("div");
}


//function hotel_room_pick(key){
//    document.getElementById('hotel_detail_table').innerHTML = '';
//    if(hotel_room_detail_pick != null){
//        document.getElementById('button'+hotel_room_detail_pick).innerHTML = 'Choose';
//    }
//    document.getElementById('button'+key).innerHTML = 'Unchoose';
//    hotel_room_detail_pick = key;
//    hotel_room = hotel_price[key];
//    for(i in hotel_room.rooms){
//        text += '<span style="font-weight:bold; font-size:12px;">Rooms: '+ hotel_room.rooms[i].description + ' ('+ hotel_room.rooms[i].category + ')</span></br>';
//        for(j in hotel_room.rooms[i].nightly_prices){
//            date = new Date(hotel_room.rooms[i].nightly_prices[j].date).toString().split(' ');
//            if(hotel_room.rooms[i].nightly_prices[j].currency != 'IDR')
//                text += '<div class="row"><div class="col-lg-6"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6"><span>' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + (hotel_room.rooms[i].nightly_prices[j].price + hotel_room.rooms[i].nightly_prices[j].commission)+'</span></div></div>';
//            else
//                text += '<div class="row"><div class="col-lg-6"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6"><span> ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(hotel_room.rooms[i].nightly_prices[j].price + hotel_room.rooms[i].nightly_prices[j].commission)+'</span></div></div>';
//        }
//    }
//
//    text = '<span>Meal Type: ' + hotel_room.meal_type+'</span><br/>';
//
//    text += '<br/><button class="primary-btn-custom" style="width:100%; margin-bottom:15px;" type="button" onclick="goto_passenger();">Next</button>';
//    document.getElementById('button'+key).innerHTML = 'Unchoose';
//
//    document.getElementById('hotel_detail_table').innerHTML = text;
//
//
//}

function hotel_room_pick(key){
    document.getElementById('hotel_detail_table').innerHTML = '';
    if(hotel_room_detail_pick != null){
        document.getElementById('button'+hotel_room_detail_pick).innerHTML = 'Choose';
        document.getElementById('button'+hotel_room_detail_pick).classList.remove("primary-btn-custom-un");
        document.getElementById('button'+hotel_room_detail_pick).classList.add("primary-btn-custom");
    }
    document.getElementById('button'+key).innerHTML = 'Unchoose';
    hotel_room_detail_pick = key;
    hotel_room = hotel_price[key];
    text='';
    for(i in hotel_room.rooms){
        text += '<h5>'+ hotel_room.rooms[i].category + '</h5>';
        text += '<span> '+ hotel_room.rooms[i].description + '<span><br/>';
        text += '<span>Meal Type: ' + hotel_room.meal_type+'</span/><br/><br/>';
        text += `<div class="row">`;
        for(j in hotel_room.rooms[i].nightly_prices){
            date = new Date(hotel_room.rooms[i].nightly_prices[j].date).toString().split(' ');
            if(hotel_room.rooms[i].nightly_prices[j].currency != 'IDR')
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_room.rooms[i].nightly_prices[j].price + hotel_room.rooms[i].nightly_prices[j].commission))+'<span/></div>';
            else
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(parseInt(hotel_room.rooms[i].nightly_prices[j].price + hotel_room.rooms[i].nightly_prices[j].commission))+'<span/></div>';
        }
        text += `<div class="col-lg-12"><hr/></div>`;
        text += `<div class="col-lg-6">
            <span style="font-weight:bold;">Total</span>
        </div>
        <div class="col-lg-6" style="text-align:right;">
            <span style="font-weight:bold;">IDR `+ getrupiah(parseInt(hotel_room.rooms[i].price_total)) +`</span>
        </div>
        <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission_hotel">
            <div class="alert alert-success">
                <span style="font-size:13px; font-weight:bold;">Your Commission: IDR `+ getrupiah(parseInt(hotel_room.rooms[i].commission)) +`</span><br>
            </div>
        </div>`;

        text += `</div>`;
    }
    text += `<div class="row">`;
    text += `<div class="col-lg-12">`;
    text += '<button class="primary-btn-custom" style="width:100%; margin-bottom:10px; margin-top:10px;" type="button" onclick="goto_passenger();">Next</button></div>';
    text += `<div class="col-lg-12">
        <input class="primary-btn-ticket" id="show_commission_button_hotel" style="width:100%;" type="button" onclick="show_commission_hotel();" value="Show Commission"/>
    </div>`;
    text += `</div>`;
    document.getElementById('button'+key).innerHTML = 'Chosen';
    document.getElementById('button'+key).classList.remove("primary-btn-custom");
    document.getElementById('button'+key).classList.add("primary-btn-custom-un");

    document.getElementById('hotel_detail_table').innerHTML = text;
    $('#not_room_select').hide();
}

function show_commission_hotel(){
    var sc = document.getElementById("show_commission_hotel");
    var scs = document.getElementById("show_commission_button_hotel");
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}

function goto_passenger(){
    document.getElementById('hotel_detail_send').value = JSON.stringify(hotel_room);
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('goto_passenger').submit();
}

function check_passenger(adult, child){
    //booker
    error_log = '';
    if(document.getElementById('booker_title').value!= '' &&
       document.getElementById('booker_first_name').value!= '' &&
       document.getElementById('booker_last_name').value!='' &&
       document.getElementById('booker_nationality_id').value!='' &&
       document.getElementById('booker_email').value!='' &&
       document.getElementById('booker_phone_code').value!='' &&
       document.getElementById('booker_phone').value!= '')
       {
        if(check_name(document.getElementById('booker_title').value, document.getElementById('booker_first_name').value, document.getElementById('booker_last_name').value, 25) == false)
            error_log+= 'Total of Booker name maximum 25 characters!\n';
        if(check_phone_number(document.getElementById('booker_phone').value)==false)
            error_log+= 'Phone number Booker only contain number 8 - 12 digits!\n';
        if(check_email(document.getElementById('booker_email').value)==false)
            error_log+= 'Invalid Booker email!\n';
       //adult
       for(i=1;i<=adult;i++){
           if(document.getElementById('adult_title'+i).value != '' && document.getElementById('adult_first_name'+i).value != '' && document.getElementById('adult_last_name'+i).value != '' && document.getElementById('adult_nationality'+i).value != ''){
               if(check_name(document.getElementById('adult_title'+i).value, document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value, 25) == false)
                   error_log+= 'Total of adult '+i+' name maximum 25 characters!\n';
               if(check_date(document.getElementById('adult_birth_date'+i).value)==false)
                   error_log+= 'Birth date wrong for passenger adult '+i+'!\n';
           }else{
               error_log+= 'Please fill all the blank for Adult passenger '+i+'!\n';
               alert(document.getElementById('adult_title'+i).value);
               alert(document.getElementById('adult_first_name'+i).value);
               alert(document.getElementById('adult_last_name'+i).value);
               alert(document.getElementById('adult_nationality'+i).value);
           }
       }
       //child
       for(i=1;i<=child;i++){
           if(document.getElementById('child_title'+i).value != '' && document.getElementById('child_first_name'+i).value != '' && document.getElementById('child_last_name'+i).value != '' && document.getElementById('child_nationality'+i).value != ''){
               if(check_name(document.getElementById('child_title'+i).value, document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value, 25) == false)
                   error_log+= 'Total of child '+i+' name maximum 25 characters!\n';
               if(check_date(document.getElementById('child_birth_date'+i).value)==false)
                   error_log+= 'Birth date wrong for passenger child '+i+'!\n';
           }else{
                error_log+= 'Please fill all the blank for Child passenger '+i+'!\n';
           }
       }
       if(error_log==''){
           document.getElementById('time_limit_input').value = time_limit;
           document.getElementById('hotel_review').submit();
       }
       else{
           alert(error_log);
       }
     }else{
        console.log(document.getElementById('booker_title').value);
        console.log(document.getElementById('booker_first_name').value);
        console.log(document.getElementById('booker_last_name').value);
        console.log(document.getElementById('booker_nationality').value);
        console.log(document.getElementById('booker_email').value);
        console.log(document.getElementById('booker_phone_code').value);
        console.log(document.getElementById('booker_phone').value);
        alert('Please Fill all the blank !');
     }
}

function hotel_detail(rooms){
    rooms = rooms.replace(/&#39;/g, '"');
    rooms = rooms.replace(/&quot;/g, '"');
    rooms = rooms.replace(/False/g, 'false');
    rooms = rooms.replace(/True/g, 'true');
    rooms = rooms.replace(/None/g, '[]');

    rooms = JSON.parse(rooms);

    console.log(rooms);
    text = '';
    text += `
    <div class="row" style="margin-bottom:5px; ">
        <div class="col-lg-12">
           <h4> Price Detail </h4>
           <hr/>
        </div>
    </div>`;
    for(i in rooms){
        text += '<h5>'+ rooms[i].category + '</h5>';
        text += '<span> '+ rooms[i].description + '<span><br/>';
        text += '<span>Meal Type: ' + rooms[i].meal_type + '</span/><br/><br/>';
        text += `<div class="row">`;
        for(j in rooms[i].nightly_prices){
            date = new Date(rooms[i].nightly_prices[j].date).toString().split(' ');
            if(rooms[i].nightly_prices[j].currency != 'IDR')
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + rooms[i].nightly_prices[j].currency + ' ' + parseInt((rooms[i].nightly_prices[j].price + rooms[i].nightly_prices[j].commission))+'<span/></div>';
            else
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + rooms[i].nightly_prices[j].currency + ' ' + getrupiah(parseInt(rooms[i].nightly_prices[j].price + rooms[i].nightly_prices[j].commission))+'<span/></div>';
        }
        text += `<div class="col-lg-12"><hr/></div>`;
        text += `<div class="col-lg-6">
            <span style="font-weight:bold;">Total</span>
        </div>
        <div class="col-lg-6" style="text-align:right;">
            <span style="font-weight:bold;">IDR `+ getrupiah(parseInt(rooms[i].price_total)) +`</span>
        </div>
        <div class="col-lg-12 col-xs-12" style="text-align:center; display:none;" id="show_commission_hotel">
            <div class="alert alert-success">
                <span style="font-size:13px;">Your Commission: IDR `+ getrupiah(parseInt(rooms[i].commission)) +`</span><br>
            </div>
        </div>`;

        text += `</div>`;
    }
    //console.log(text);
    document.getElementById('hotel_detail').innerHTML = text;
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

function check_all_result(){
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
   checkboxCopy();
}

function get_checked_copy_result(){
    document.getElementById("show-list-copy-hotel").innerHTML = '';

    var search_params = document.getElementById("show-list-copy-hotel").innerHTML = '';

    var value_idx = [];
    $("#hotel_search_params span").each(function(obj) {
        value_idx.push( $(this).text() );
    })

    text='';
    $text='Search: '+value_idx[0]+'\n'+value_idx[1].trim()+'\nDate: '+value_idx[2]+'\n'+value_idx[3]+'\n\n';
    var hotel_number = 0;
    node = document.createElement("div");
    text+=`<div class="col-lg-12" style="min-height=200px; max-height:500px; overflow-y: scroll;">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_hotel = $(this).parent().parent().parent().parent();
        var name_hotel = parent_hotel.find('.name_hotel').html();
        var rating_hotel = parent_hotel.find('.rating_hotel').html();
        var location_hotel = parent_hotel.find('.location_hotel').html();
        var price_hotel = parent_hotel.find('.price_hotel').html();
        var id_hotel = parent_hotel.find('.id_copy_result').html();
        hotel_number = hotel_number + 1;
        $text += ''+hotel_number+'. '+name_hotel+ ' ' +rating_hotel+'\n';
        $text += 'Location: '+location_hotel+'\n';
        $text += 'Best Price: '+price_hotel+'\n \n';
        text+=`
            <div class="row" id="div_list`+id_hotel+`">
                <div class="col-lg-8">
                    <h6>`+hotel_number+`. `+name_hotel+` `+rating_hotel+ `</h6>
                    <span>Location: `+location_hotel+`</span><br/>
                    <span style="font-weight:500;">Best Price: `+price_hotel+`</span>
                </div>
                <div class="col-lg-4" style="text-align:right;">
                    <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result(`+id_hotel+`);">Delete <i class="fas fa-times-circle" style="color:red; font-size:18px;"></i></span>
                </div>
                <div class="col-lg-12"><hr/></div>
            </div>`;
        });
    text+=`</div>
    <div class="col-lg-12" style="margin-bottom:15px; margin-top:15px;" id="share_result">
        <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
        share_data();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>`;
            if(hotel_number < 11){
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
            if(hotel_number < 11){
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
        if(hotel_number > 10){
            text+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Hotel</span>`;
        }
    text+=`
    </div>
    <div class="col-lg-12" id="copy_result">
        <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
    </div>`;
    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-hotel").appendChild(node);

    if(hotel_number > 10){
        document.getElementById("mobile_line").style.display = "none";
        document.getElementById("mobile_telegram").style.cursor = "not-allowed";
        document.getElementById("pc_line").style.display = "not-allowe";
        document.getElementById("pc_telegram").style.cursor = "not-allowed";
    }

    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-hotel-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-hotel-copy').hide();
    }
}

function delete_checked_copy_result(id){
    $("#div_list"+id).remove();
    $("#copy_result"+id).prop("checked", false);

    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-hotel-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-hotel-copy').hide();
        get_checked_copy_result();
        share_data();
    }
    checkboxCopy();
}

function copy_data(){
    get_checked_copy_result();
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

function share_data(){
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

$check_load = 0;
function price_slider_true(type){
    $minPrice = parseFloat(document.getElementById('price-from').value);
    $maxPrice = parseFloat(document.getElementById('price-to').value);
    checking_price = 0;
    if($check_load != 0)
        filtering('filter', 0);
    else
        $check_load = 1;
}

function price_update(){
   var from_price = parseInt(document.getElementById('price-from').value);
   var to_price = parseInt(document.getElementById('price-to').value);
//   if (Number.isNaN(from_price)){
//       document.getElementById('price-from').value = 0;
//   }
//   if (Number.isNaN(to_price)){
//       document.getElementById('price-to').value = 0;
//   }

   if(from_price > to_price){
       document.getElementById('price-from').value = to_price;
   }
   console.log(from_price);
   console.log(to_price);

   $(".js-range-slider").data("ionRangeSlider").update({
        from: $("#price-from").val(),
        to: $("#price-to").val(),
        min: 0,
        max: high_price_slider,
        step: step_slider
   });
}
