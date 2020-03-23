var myVar;
var hotel_room_detail_pick = null;
var hotel_room = [];
var hotel_filter = [];
var sorting_value = '';
var hotelAutoCompleteVar;
var hotel_choices = [];
var checking_price = 0;
var checking_slider = 0;
var hotel_ids_length = 0;
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
var selected_fac = [];

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
    if(document.getElementById('hotel_id_destination').value.split(' - ').length < 2)
        text+= 'Please use autocomplete for Destination';
    if(document.getElementById("hotel_id_nationality").value == '')
        text+= 'Please fill nationality\n';
    today = new Date().toString().split(' ');
    if(moment(today[2]+' '+today[1]+' '+today[3], 'DD MMM YYYY') > moment(document.getElementById("hotel_checkin").value, 'DD MMM YYYY'))
        text+= 'Checkin date minimum today\n';
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
            console.log('Selected Length: ' + selected_fac.length);
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

function sort(response, check_filter){
        //no filter
        $pagination_type = "hotel";
        sorting = sorting_value;
        if(check_filter == 1){
            for(i in response.hotel_ids){
                for(j in response.hotel_ids[i].prices){
                    if(high_price_slider < response.hotel_ids[i].prices[j]['price']){
                        high_price_slider = response.hotel_ids[i].prices[j]['price'];
                    }
                    if(low_price_slider > response.hotel_ids[i].prices[j]['price']){
                        low_price_slider = response.hotel_ids[i].prices[j]['price'];
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
            document.getElementById("price-from").value = low_price_slider;
            document.getElementById("price-to").value = high_price_slider;
            document.getElementById("price-from2").value = low_price_slider;
            document.getElementById("price-to2").value = high_price_slider;
            if (checking_price == 1){
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
                checking_price = 0;
            }
        }

        for(var i = 0; i < response.hotel_ids.length-1; i++) {
            for(var j = i+1; j <= response.hotel_ids.length-1; j++) {
                if(sorting == 'Lowest Price'){
                    var price_i = 0;
                    var price_j = 0;
                    if(response.hotel_ids[i].prices.length > 0){
                        var arr = [];
                        for (var key in response.hotel_ids[i].prices) {
                            if (response.hotel_ids[i].prices.hasOwnProperty(key)) {
                                arr.push( response.hotel_ids[i].prices[key].price );
                            }
                        }
                        for(var l = 0; l < arr.length-1; l++)
                            for(var k = l+1; k <= arr.length-1; k++) {
                                if(arr[j].price > arr[k].price){
                                    var temp = arr[l];
                                    arr[l] = arr[k];
                                    arr[k] = temp;
                                }
                            }
                        price_i = arr[0];
                    }
                    else
                        price_i = 0;
                    if(response.hotel_ids[j].prices.length > 0){
                        var arr = [];
                        for (var key in response.hotel_ids[j].prices) {
                            if (response.hotel_ids[j].prices.hasOwnProperty(key)) {
                                arr.push( response.hotel_ids[j].prices[key].price );
                            }
                        }
                        for(var l = 0; l < arr.length-1; l++)
                            for(var k = l+1; k <= arr.length-1; k++) {
                                if(arr[l].price > arr[k].price){
                                    var temp = arr[l];
                                    arr[l] = arr[k];
                                    arr[k] = temp;
                                }
                            }
                        price_j = arr[0];
                    }
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
                    if(response.hotel_ids[i].prices.length > 0){
                        var arr = [];
                        for (var key in response.hotel_ids[i].prices) {
                            if (response.hotel_ids[i].prices.hasOwnProperty(key)) {
                                arr.push( response.hotel_ids[i].prices[key].price );
                            }
                        }
                        for(var l = 0; l < arr.length-1; l++)
                            for(var k = l+1; k <= arr.length-1; k++) {
                                if(arr[l].price < arr[k].price){
                                    var temp = arr[l];
                                    arr[l] = arr[k];
                                    arr[k] = temp;
                                }
                            }
                        price_i = arr[0];
                    }
                    else
                        price_i = 0;
                    if(response.hotel_ids[j].prices.length > 0){
                        var arr = [];
                        for (var key in response.hotel_ids[j].prices) {
                            if (response.hotel_ids[j].prices.hasOwnProperty(key)) {
                                arr.push( response.hotel_ids[j].prices[key].price );
                            }
                        }
                        for(var l = 0; l < arr.length-1; l++)
                            for(var k = l+1; k <= arr.length-1; k++) {
                                if(arr[l].price < arr[k].price){
                                    var temp = arr[l];
                                    arr[l] = arr[k];
                                    arr[k] = temp;
                                }
                            }
                        price_j = arr[0];
                    }
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
        if(response.city_ids.length != 0){
            var node = document.createElement("div");
            for(i in response.city_ids){
                text = '<form id="hotel_city'+i+'" action="/hotel/detail" method="POST" class="c-pointer">';
                    if(response.city_ids[i].image != false)
                        text+=`<div class="img-hotel-search-c" style="background-image: url('`+response.city_ids[i].image+`');border:1px solid #cdcdcd;"></div>`;
                    else
                        text+=`<div class="img-hotel-search-c" style="background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');border:1px solid #cdcdcd;"></div>`;
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
        }
        else{
            text = '';
            text += `
            <div style="padding:5px; margin:10px;">
                <div style="text-align:center">
                    <img src="/static/tt_website_rodextrip/images/nofound/no-city.png" style="width:60px; height:60px;" alt="" title="" />
                    <br/><br/>
                    <span style="font-size:14px; font-weight:600;">Oops! City not found.</span>
                </div>
            </div>`;
            var node = document.createElement("div");
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
        if(response.landmark_ids.length != 0){
            var node = document.createElement("div");
            for(i in response.landmark_ids){
                text = '<form id="hotel_landmark'+i+'" action="/hotel/detail" method="POST" class="c-pointer">';
                    if(response.landmark_ids[i].images.length != 0)
                        text+=`<div class="img-hotel-search-c" style="background-image: url('`+response.landmark_ids[i].images[0].url+`');border:1px solid #cdcdcd;"></div>`;
                    else
                        text+=`<div class="img-hotel-search-c" style="background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');border:1px solid #cdcdcd;"></div>`;

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
        }
        else{
            text = '';
            text += `
                <div style="padding:5px; margin:10px;">
                    <div style="text-align:center">
                        <img src="/static/tt_website_rodextrip/images/nofound/no-landmark.png" style="width:60px; height:60px;" alt="" title="" />
                        <br/><br/>
                        <span style="font-size:14px; font-weight:600;">Oops! Landmark not found.</span>
                    </div>
                </div>
            `;
            var node = document.createElement("div");
            node.innerHTML = text;
            document.getElementById("hotel_landmark").appendChild(node);
            node = document.createElement("div");
        }

        document.getElementById("hotel_result").innerHTML = '';
        text = '';
        var node = document.createElement("div");
        hotel_ids_length = parseInt(response.hotel_ids.length);
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
                <div class="row">`;
                    if(response.hotel_ids[i].images.length != 0){
                        text+=`
                        <div class="col-lg-3">
                            <div class="img-hotel-search" style="cursor:pointer; background-image: url(`+response.hotel_ids[i].images[0].url+`);" onclick="goto_detail('hotel',`+i+`)"></div>
                        </div>`;
                    }
                    else{
                        text+=`
                        <div class="col-lg-3">
                            <div class="img-hotel-search" style="cursor:pointer; background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');"></div>
                        </div>`;
                    }
                    text+=`
                    <div class="col-lg-9 name_hotel_search"">
                        <div class="row">
                            <div class="col-lg-7 col-md-7">
                                <div>
                                    <h5 class="name_hotel hover_name" title="`+response.hotel_ids[i].name+`" style="cursor:pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right:5px; font-size:18px; font-weight:bold;" onclick="goto_detail('hotel',`+i+`)">`+response.hotel_ids[i].name+`</h5>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-11 col-xs-11">`;
                                if(response.hotel_ids[i].rating != false){
                                    for (co=0; co < parseInt(response.hotel_ids[i].rating); co++){
                                        text+=`<i class="fas fa-star" style="color:#FFC44D; font-size:16px;"></i>`;
                                    }
                                    text+=`<span class="rating_hotel" hidden>*`+response.hotel_ids[i].rating+`</span>`;
                                }
                                else{
                                    text+=`<span class="rating_hotel" hidden>Unrated</span>`;
                                }
                            text+=`
                            </div>
                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 checkbox_search_hotel" style="text-align:right;">
                                <label class="check_box_custom">
                                    <span class="span-search-ticket"></span>
                                    <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBox(`+i+`, `+hotel_ids_length+`);"/>
                                    <span class="check_box_span_custom"></span>
                                </label>
                                <span class="id_copy_result" hidden>`+i+`</span>
                            </div>
                            <div class="col-lg-7 col-md-7" style="padding-top:5px;">`;
                            detail = JSON.stringify(response.hotel_ids[i]);
                            detail = detail.replace(/'/g, "");
                            text+=`<input type="hidden" id="hotel_detail`+i+`" name="hotel_detail" value='`+detail+`'/>`;
                            text+=`
                            <div style="padding-bottom:5px;">
                                <i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> <span class="location_hotel" style="font-size:13px;">`;
                            if(response.hotel_ids[i].location.address)
                                text+= response.hotel_ids[i].location.address + '<br/>';
                            if(response.hotel_ids[i].location.district)
                                text+= response.hotel_ids[i].location.district + ', ';
                            if(response.hotel_ids[i].location.city)
                                text+= response.hotel_ids[i].location.city;
                            if(response.hotel_ids[i].location.state)
                                text+= ', '+ response.hotel_ids[i].location.state;
                            // if(response.hotel_ids[i].location.kelurahan != false)
                            //   text+= ' '+ response.hotel_ids[i].location.kelurahan;
                            if(response.hotel_ids[i].location.zipcode != false)
                                text+= ' ('+ response.hotel_ids[i].location.zipcode + ')';
                            // if(response.hotel_ids[i].location.zipcode != false)
                            //    text+= '<br/>'+ response.hotel_ids[i].location.zipcode + ')
//                            text+=`</span> - <a href="#" style="color:blue; text-decoration: unset;">Show Map</a>
                            text+=`</span>
                                </div>

                                <div style="padding-bottom:5px;">
                                <span>Facilities</span><br/>
                                <div class="row">`;
                                    try{
                                        var ava_fac = '';
                                        for(j in top_facility){
                                            var facility_check = 0;
                                            for(k in response.hotel_ids[i].facilities){
                                                if(top_facility[j].facility_name.toLowerCase() == response.hotel_ids[i].facilities[k].facility_name.toLowerCase() ){
                                                    facility_check = 1;
                                                    ava_fac += response.hotel_ids[i].facilities[k].facility_id + ','
                                                    break;
                                                } else if (top_facility[j].internal_name.toLowerCase().includes(response.hotel_ids[i].facilities[k].facility_name.toLowerCase()) ){
                                                    facility_check = 1;
                                                    ava_fac += response.hotel_ids[i].facilities[k].facility_id + ','
                                                    break;
                                                }
                                            }
                                            text+=`<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">`;
                                            if(facility_check == 1){
                                                text+=`<span class="facility_hotel"><i class="fas fa-circle" style="font-size:9px;"></i> `+top_facility[j].facility_name+`</span>`;
                                            }
                                            else{
                                                text+=`<span style="margin-right:5px; color:gray; font-size:11px; word-break: break-all;"><i class="fas fa-circle" style="font-size:9px;"></i> No `+top_facility[j].facility_name+`</span>`;
                                            }
                                            text+=`</div>`;
                                        }
                                    }
                                catch(err){}
                                text+=`</div>
                                </div>

                                <div style="padding-top:10px;" id='pagination_image`+i+`'>`;
                                    if(i >= 0 && i<= 19){
                                        var idx_img = 1;
                                        if(response.hotel_ids[i].images.length != 0){
                                            for(idx_img; idx_img < response.hotel_ids[i].images.length; idx_img++){
                                                if(idx_img < 5){
                                                    text+=`<img class="img_hotel_smallbot" src="`+response.hotel_ids[i].images[idx_img].url+`" onerror="this.src='/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg';" width="50" height="50" onclick="go_to_owl_carousel_bottom(`+idx_img+`, `+i+`);">`;
                                                }
                                                else{
                                                    break;
                                                }
                                            }
                                        }
                                        else{
                                            text+=`<img src="/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg" width="60" height="60" style="margin-right:10px; border-radius:4px; border:1px solid #cdcdcd;">`;
                                        }
                                    }
                                    text+=`
                                </div>
                            </div>
                            <div class="col-lg-5 col-md-5" style="padding-top:5px;">
                                <div class="row" style="padding:0px;">`;
                                    if(Object.keys(response.hotel_ids[i].prices).length > 0){
                                        var arr = [];
                                        for (var key in response.hotel_ids[i].prices) {
                                            if (response.hotel_ids[i].prices.hasOwnProperty(key)) {
                                                arr.push( [ key, response.hotel_ids[i].prices[key] ] );
                                            }
                                        }
                                        for(var j = 0; j < arr.length-1; j++)
                                            for(var k = j+1; k <= arr.length-1; k++) {
                                                if(arr[j][1].price > arr[k][1].price){
                                                    var temp = arr[j];
                                                    arr[j] = arr[k];
                                                    arr[k] = temp;
                                                }
                                            }
                                        //IVAN
                                         for(j in arr){
                                            if(j < 2 || (j == 2 && arr.length == 3) ){
                                                text+=`
                                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">`;
                                                if(j == 0){
                                                    text += `<i class="fas fa-thumbs-up" style="color:`+color+`;"></i>`;
                                                    text += `<span class="price_hotel" hidden>IDR ` + getrupiah(arr[j][1]['price']) + `</span>`;
                                                }
                                                text +=`
                                                </div>
                                                <div class="col-lg-10 col-md-10 col-sm-11 col-xs-11 search_hotel_vendor" style="padding-left:5px; padding-right:5px;">
                                                    <span style="font-size:13px; font-weight: 700;">IDR ` + getrupiah(arr[j][1]['price']) + `</span>
                                                    <span style="font-size:13px; font-weight: 500; float:right;">` + arr[j][0] +`</span>
                                                </div>`;
                                            }
//                                            if(response.hotel_ids[i].prices[j]['price'] != 0 && response.hotel_ids[i].prices[j]['price'] != false && response.hotel_ids[i].prices[j]['price'] != "-")
//                                                best_price.push(response.hotel_ids[i].prices[j]['price']);
                                        }
                                        if(arr.length > 3){
                                            text+=`
                                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1"></div>`;
                                            text += `
                                            <div class="col-lg-10 col-md-10 col-sm-11 col-xs-11 search_hotel_vendor" style="padding-left:5px; padding-right:5px;">
                                                <span style="font-size:13px; font-weight:700; text-align:left; cursor:pointer;" data-toggle="dropdown"> View all <i class="fas fa-caret-down"></i></span>
                                                <ul class="dropdown-menu" role="menu" style="top:-10px !important; border:1px solid black;">
                                                    <div class="row" style="padding:0px;">`;
                                                    for(j in arr){
                                                        text+=`
                                                        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">`;
                                                        if(j == 0){
                                                            text += `<i class="fas fa-thumbs-up" style="padding-left: 5px; color:`+color+`;"></i>`;
                                                            text += `<span class="price_hotel" hidden>IDR ` + getrupiah(arr[j][1]['price']) + `</span>`;
                                                        }
                                                        // else if(j > 2){
                                                        //     text += `<i class="fas fa-thumbs-down" style="color:`+color+`;"></i>`;
                                                        // }
                                                        text +=`
                                                        </div>
                                                        <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                                            <span style="font-size:13px; font-weight: 700; float:left;">IDR ` + getrupiah(arr[j][1]['price']) + `</span>
                                                            <span style="font-size:13px; font-weight: 500; float:right;">` + arr[j][0] +`</span>
                                                        </div>`;
                                                    }
                                                    text+=`</div>
                                                </ul>
                                            </div>`;
                                        }
                                        //
//                                        var best_price = [];
//                                        var check_price = 0;
//                                        var more_price = 0;
//                                        for(j in response.hotel_ids[i].prices){
//                                            check_price += 1;
//                                            if(check_price < 4){
//                                                text+=`
//                                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">`;
//                                                if(check_price == 1){
//                                                    text += `<i class="fas fa-thumbs-up" style="color:`+color+`;"></i>`;
//                                                }
//                                                text +=`
//                                                </div>
//                                                <div class="col-lg-10 col-md-10 col-sm-11 col-xs-11 search_hotel_vendor" style="padding-left:5px; padding-right:5px;">
//                                                    <span style="font-size:13px; font-weight: 700;">IDR ` + getrupiah(response.hotel_ids[i].prices[j]['price']) + `</span>
//                                                    <span style="font-size:13px; font-weight: 500; float:right;">` + j +`</span>
//                                                </div>`;
//                                            }
//                                            if(response.hotel_ids[i].prices[j]['price'] != 0 && response.hotel_ids[i].prices[j]['price'] != false && response.hotel_ids[i].prices[j]['price'] != "-")
//                                                best_price.push(response.hotel_ids[i].prices[j]['price']);
//                                        }
//
//                                        if (check_price > 3){
//                                            text += `
//                                            <div class="col-lg-12">
//                                                <span style="font-size:13px; font-weight:700; text-align:left; cursor:pointer;" data-toggle="dropdown"> View all `+ check_price +` <i class="fas fa-caret-down"></i></span>
//                                                <ul class="dropdown-menu" role="menu" style="top:-10px !important; border:1px solid black;">
//                                                    <div class="row" style="padding:0px;">`;
//                                                    for(j in response.hotel_ids[i].prices){
//                                                        more_price += 1;
//                                                        text+=`
//                                                        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">`;
//                                                        if(more_price == 1){
//                                                            text += `<i class="fas fa-thumbs-up" style="color:`+color+`;"></i>`;
//                                                        }
//                                                        text +=`
//                                                        </div>
//                                                        <div class="col-lg-11 col-md-11 col-sm-11 col-xs-11">
//                                                            <span style="font-size:13px; font-weight: 700; float:left;">IDR ` + getrupiah(response.hotel_ids[i].prices[j]['price']) + `</span>
//                                                            <span style="font-size:13px; font-weight: 500; float:right;">` + j +`</span>
//                                                        </div>`;
//                                                    }
//                                                    text+=`</div>
//                                                </ul>
//                                            </div>`;
//                                        }
//
//                                        best_price.sort(function(a, b){return a - b});
//                                        if(best_price[0] != undefined)
//                                            text+=`<span class="price_hotel" hidden>IDR ` + getrupiah(best_price[0]) + `</span>`;
//                                        else
//                                            text+=`<span class="price_hotel" hidden>Waiting price</span>`;
                                    } else {
                                        for(j in response.hotel_ids[i].external_code){
                                            text += `<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                            <span style="font-size:13px; font-weight: 500; text-align:left;">` + j +`</span>
                                        </div>
                                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                                            <span style="font-size:13px; font-weight: 700; text-align:right;">-</span>
                                        </div>`;
                                        }
                                        text+=`<span class="price_hotel" hidden>Waiting price</span>`;
                                    }
                                    text += `

                                    </div>
                                    <div class="col-lg-12 search_hotel_button" style="text-align:right; position:absolute; bottom:0px; right:0px;">`;
                                        var total_room = document.getElementById("hotel_room").value;
                                        var total_night = document.getElementById("total_night_search").textContent;
                                        text+=`
                                        <span class="carrier_code_template">( for `+total_room+` room, `+total_night+` night )</span>`;
                                        try{
                                            if(arr.length != 0)
                                                text+=`<button type="button" class="primary-btn-custom" style="width:100%;" onclick="goto_detail('hotel',`+i+`)">Select</button>`;
                                            else
                                                text+=`<button type="button" class="primary-btn-custom" style="width:100%; background-color:#cdcdcd;" onclick="goto_detail('hotel',`+i+`)">No Available Price</button>`;
                                        }catch(err){
                                            text+=`<button type="button" class="primary-btn-custom" style="width:100%; background-color:#cdcdcd;" onclick="goto_detail('hotel',`+i+`)">No Available Price</button>`;
                                        }
                                        text+=`
                                    </div>
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
            $('#hotel_error').hide();
        }
        else{
            document.getElementById("hotel_error").innerHTML = '';
            text = '';
            text += `
                <div style="padding:5px; margin:10px;">
                    <div style="text-align:center">
                        <img src="/static/tt_website_rodextrip/images/nofound/no-hotel.png" style="width:60px; height:60px;" alt="" title="" />
                        <br/><br/>
                        <span style="font-size:14px; font-weight:600;">Oops! Hotel not found. Please try another day or another hotel</span>
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
function hotel_cancellation_button(key, price_id){
    // Icon Loading muter disini
    document.getElementById('js_cancellation_button'+key).innerHTML = '<span style="font-size:14px; font-weight:500;">PLEASE WAIT ... </span>';
    // Tembak Gateway
    // Olah Response
    response = hotel_get_cancellation_policy(price_id, key, '2');
    //console.log('A:' + response);

}

function hotel_room_pick(key){
    document.getElementById('hotel_detail_table').innerHTML = '';
    $text2 = "";
    $text_share2 = "";

    if(hotel_room_detail_pick != null){
        document.getElementById('button'+hotel_room_detail_pick).innerHTML = 'Choose';
        document.getElementById('button'+hotel_room_detail_pick).classList.remove("primary-btn-custom-un");
        document.getElementById('button'+hotel_room_detail_pick).classList.add("primary-btn-custom");
    }
    document.getElementById('button'+key).innerHTML = 'Unchoose';
    hotel_room_detail_pick = key;
    hotel_room = hotel_price[key];
    text='';
    var get_name_hotel = document.getElementById("get_name_hotel").value;
    var get_rating_hotel = document.getElementById("rating_hotel").textContent;
    var get_address_hotel = document.getElementById("address_hotel").textContent;
    var get_date_hotel = document.getElementById("date_hotel").textContent;
    $text2 = ''+ get_name_hotel +' *'+ get_rating_hotel +'\n';
    $text2 += 'Address: '+ get_address_hotel +'\n';
    $text2 += get_date_hotel +'\n\n';
    for(i in hotel_room.rooms){
        text += '<h5>'+ hotel_room.rooms[i].description + '</h5>';
        //text += '<span> '+ hotel_room.rooms[i].category + '<span><br/>';
        text += '<span>Qty: '+ hotel_room.rooms[i].qty + '<span><br/>';
        text += '<span>Meal Type: ' + hotel_room.meal_type +'</span/><br/><br/>';
        //text += '<span style="font-weight:500; padding-top:10px;">Cancellation Policy: </span>';
        text += '<div id="cancellation_policy_choose">';
        text += '<span style="font-size:14px; font-weight:500;">PLEASE WAIT ... </span>';
        text += '</div><br/>';

        //$text2 += 'Room Category: '+ hotel_room.rooms[i].category +'\n';
        $text2 += hotel_room.rooms[i].description +'\n';
        $text2 += hotel_room.rooms[i].qty +' room(s) \n';
        $text2 += 'Meal Type: '+ hotel_room.meal_type +'\n \n';

        response = hotel_get_cancellation_policy(hotel_room.price_code, key, '0');

        text += `<div class="row">`;
        for(j in hotel_room.rooms[i].nightly_prices){
            date = new Date(hotel_room.rooms[i].nightly_prices[j].date).toString().split(' ');
            if(hotel_room.rooms[i].nightly_prices[j].currency != 'IDR'){
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_room.rooms[i].nightly_prices[j].price))+'<span/></div>';
                $text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_room.rooms[i].nightly_prices[j].price)) + '\n';
            }else{
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(parseInt(hotel_room.rooms[i].nightly_prices[j].price))+'<span/></div>';
                $text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(parseInt(hotel_room.rooms[i].nightly_prices[j].price)) + '\n';
            }
        }
        var total_room = document.getElementById("hotel_room").value;
        var total_night = document.getElementById("total_night_search").textContent;

        text += `<div class="col-lg-12"><hr/></div>`;
        text += `<div class="col-lg-6">
            <span style="font-weight:bold;">Total</span>
        </div>
        <div class="col-lg-6" style="text-align:right;">
            <span style="font-weight:bold;">IDR `+ getrupiah(parseInt(hotel_room.rooms[i].price_total)) +`</span><br/>
            <span style="font-weight:500;">(for `+total_room+` room, `+total_night+` night)</span>
        </div>
        <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission_hotel">
            <div class="alert alert-success">
                <span style="font-size:13px; font-weight:bold;">Your Commission: IDR `+ getrupiah(parseInt(hotel_room.rooms[i].commission)) +`</span><br>
            </div>
        </div>`;
        text += `</div>`;

        $text2 += 'Total: IDR '+getrupiah(parseInt(hotel_room.rooms[i].price_total)) + ' ';
        $text2 += '(for '+ total_room +' room, ' +total_night+ 'night) \n\n';
    }

    document.getElementById('button'+key).innerHTML = 'Chosen';
    document.getElementById('button'+key).classList.remove("primary-btn-custom");
    document.getElementById('button'+key).classList.add("primary-btn-custom-un");

    document.getElementById('hotel_detail_table').innerHTML = text;
}
function hotel_room_pick_button(){
    document.getElementById('hotel_detail_button').innerHTML = '';
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
    text += `<div class="col-lg-12">
        <input class="primary-btn" id="show_commission_button_hotel" style="width:100%;" type="button" onclick="show_commission_hotel();" value="Show Commission"/>
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

    document.getElementById('hotel_detail_button').innerHTML = text;
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

function goto_passenger(){
    document.getElementById('hotel_detail_send').value = JSON.stringify(hotel_room);
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
               error_log+= 'Total of adult '+i+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
               document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
               document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_first_name'+i).value == '' || check_word(document.getElementById('adult_first_name'+i).value) == false){
               if(document.getElementById('adult_first_name'+i).value == '')
                   error_log+= 'Please input first name of adult passenger '+i+'!</br>\n';
               else if(check_word(document.getElementById('adult_first_name'+i).value) == false)
                   error_log+= 'Please use alpha characters first name of adult passenger '+i+'!</br>\n';
               document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
           }
           //check lastname
           if(check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value) != ''){
               error_log += 'Please '+check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value)+' adult passenger '+i+'!</br>\n';
               document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
           }
           if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_nationality'+i).value == ''){
               error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
           }
           if(document.getElementById('adult_cp'+i).checked == true){
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
       //child
       for(i=1;i<=child;i++){
           if(check_name(document.getElementById('child_title'+i).value,
               document.getElementById('child_first_name'+i).value,
               document.getElementById('child_last_name'+i).value,
               length_name) == false){
                   error_log+= 'Total of child '+i+' name maximum '+length_name+' characters!</br>\n';
                   document.getElementById('child_first_name'+i).style['border-color'] = 'red';
                   document.getElementById('child_last_name'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
                   document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
               }if(document.getElementById('child_first_name'+i).value == '' || check_word(document.getElementById('child_first_name'+i).value) == false){
                   if(document.getElementById('child_first_name'+i).value == '')
                       error_log+= 'Please input first name of child passenger '+i+'!</br>\n';
                   else if(check_word(document.getElementById('child_first_name'+i).value) == false){
                       error_log+= 'Please use alpha characters first name of child passenger '+i+'!</br>\n';
                       document.getElementById('child_first_name'+i).style['border-color'] = 'red';
                   }
               }else{
                   document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
               }
               //check lastname
               if(check_name_airline(document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value) != ''){
                   error_log+= 'Please '+check_name_airline(document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value)+' child passenger '+i+'!</br>\n';
                   document.getElementById('child_last_name'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
               }
               if(check_date(document.getElementById('child_birth_date'+i).value)==false){
                   error_log+= 'Birth date wrong for passenger child '+i+'!</br>\n';
                   document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
               }if(document.getElementById('child_nationality'+i).value == ''){
                   error_log+= 'Please fill nationality for passenger child '+i+'!</br>\n';
                   document.getElementById('child_nationality'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('child_nationality'+i).style['border-color'] = '#EFEFEF';
               }
       }
       if(error_log==''){
           for(i=1;i<=adult;i++){
                document.getElementById('adult_birth_date'+i).disabled = false;
           }
           for(i=1;i<=child;i++){
                document.getElementById('child_birth_date'+i).disabled = false;
           }
           document.getElementById('time_limit_input').value = time_limit;
           document.getElementById('hotel_review').submit();
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

function hotel_detail(){
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
        tax = 0;
        fare = 0;
        total_price = 0;
        total_price_provider = [];
        price_provider = 0;
        commission = 0;
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
        type_amount_repricing = ['Repricing'];
        for(i in adult){
            pax_type_repricing.push([adult[i].first_name +adult[i].last_name, adult[i].first_name +adult[i].last_name]);
            price_arr_repricing[adult[i].first_name +adult[i].last_name] = {
                'Fare': 0,
                'Tax': 0,
                'Repricing': 0
            }
        }
        for(i in child){
            pax_type_repricing.push([child[i].first_name +child[i].last_name, child[i].first_name +child[i].last_name]);
            price_arr_repricing[child[i].first_name +child[i].last_name] = {
                'Fare': 0,
                'Tax': 0,
                'Repricing': 0
            }
        }
        //repricing
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
                    <div class="col-lg-3" id="`+i+`_`+k+`">`+k+`</div>
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
    }

    //console.log(hotel_price);
    text = '';
    text += `
    <div class="row" style="margin-bottom:5px; ">
        <div class="col-lg-12">
           <h4> Price Detail </h4>
           <hr/>
        </div>
    </div>`;
    $text2 = '';
    for(i in hotel_price.rooms){
        text += '<h5>'+ hotel_price.rooms[i].description + '</h5>';
        text += '<span>Qty: '+ hotel_price.rooms[i].qty + '</span><br/>';
        //text += '<span> '+ hotel_price.rooms[i].category + '<span><br/>';
        text += '<span>Meal Type: ' + hotel_price.meal_type + '</span/><br/><br/>';

        //$text2 += 'Room Category: '+ hotel_price.rooms[i].category +'\n';
        $text2 += hotel_price.rooms[i].description +'\n';
        $text2 += hotel_price.rooms[i].qty +' room(s) \n';
        $text2 += 'Meal Type: '+ hotel_price.meal_type +'\n \n';

        text += `<div class="row">`;
        for(j in hotel_price.rooms[i].nightly_prices){
            date = new Date(hotel_price.rooms[i].nightly_prices[j].date).toString().split(' ');
            if(hotel_price.rooms[i].nightly_prices[j].currency != 'IDR'){
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_price.rooms[i].nightly_prices[j].price))+'<span/></div>';
                $text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_price.rooms[i].nightly_prices[j].price))+'\n';
            }else{
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(parseInt(hotel_price.rooms[i].nightly_prices[j].price))+'<span/></div>';
                $text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(parseInt(hotel_price.rooms[i].nightly_prices[j].price))+'\n';
            }
        }
        try{
            grand_total_price = parseInt(hotel_price.rooms[i].price_total);
        }catch(err){}
        text += `<div class="col-lg-12"><hr/></div>`;
        if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
            text+=`<div class="col-lg-12"><div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div></div>`;
        }
        try{
            if(upsell_price != 0){
                text+=`<div class="col-lg-7" style="text-align:left;">
                    <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
                </div>
                <div class="col-lg-5" style="text-align:right;">`;
                text+=`
                    <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(upsell_price)+`</span><br/>`;
                text+=`</div>`;
                grand_total_price += upsell_price;
            }
        }catch(err){console.log(err)}
        text += `<div class="col-lg-6">
            <span style="font-weight:bold;">Total</span>
        </div>
        <div class="col-lg-6" style="text-align:right;">
            <span style="font-weight:bold;">IDR `+ getrupiah(grand_total_price) +`</span>
        </div>
        <div class="col-lg-12 col-xs-12" style="text-align:center; display:none;" id="show_commission_hotel">
            <div class="alert alert-success">
                <span style="font-size:13px; font-weight:bold;">Your Commission: IDR `+ getrupiah(parseInt(hotel_price.rooms[i].commission)) +`</span><br>
            </div>
        </div>`;
        try{
            if(adult.length > 0){
                $text2 += '\nPassengers\n'
                for(k in adult){
                    $text2 += adult[k].title + ' ' + adult[k].first_name + ' ' + adult[k].last_name+'\n';
                }
                for(k in child){
                    $text2 += child[k].title + ' ' + child[k].first_name + ' ' + child[k].last_name+'\n';
                }
            }
            $text2 += '\n';
        }catch(err){}
        $text2 += 'Grand Total: IDR ' + getrupiah(parseInt(hotel_price.rooms[i].price_total)) + '\n';

        text += `<div class="col-lg-12" style="padding-bottom:15px;">
            <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
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
        text += `<div class="col-lg-12">
            <input class="primary-btn" id="show_commission_button_hotel" style="width:100%;" type="button" onclick="show_commission_hotel();" value="Show Commission"/>
        </div>`;
        text += `
        <div class="col-lg-12" style="padding-top:10px;">
            <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data2();" value="Copy">
        </div>`;


        text += `</div>`;
    }
    //console.log(text);
    try{
        document.getElementById('hotel_detail').innerHTML = text;
    }catch(err){}
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

function get_checked_copy_result(){
    document.getElementById("show-list-copy-hotel").innerHTML = '';

    var search_params = document.getElementById("show-list-copy-hotel").innerHTML = '';

    var value_idx = [];
    $("#hotel_search_params .copy_span").each(function(obj) {
        value_idx.push( $(this).text() );
    })

    text='';
    //$text='Search: '+value_idx[0]+'\n'+value_idx[1].trim()+'\nDate: '+value_idx[2]+'\n'+value_idx[3]+'\n\n';
    $text= value_idx[0]+'\n'+value_idx[1].trim()+'\n\n';
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
        $text += 'Price start from: '+price_hotel+'\n \n';
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
    $text += '\n===Price may change at any time===';
    text+=`</div>
    <div class="col-lg-12" style="margin-bottom:15px;" id="share_result">
        <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
        share_data();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(hotel_number < 11){
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
            if(hotel_number < 11){
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
    checkboxCopyBox(id, hotel_ids_length)
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
    try{
        get_checked_copy_result();
    }catch(err){}
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

function copy_data2(){
    var obj_hotel_name = document.getElementById('js_hotel_name');
    $text_print = '';
    console.log($text2);
    if (obj_hotel_name != null){
        obj_hotel_name = obj_hotel_name.innerHTML;
        $text_print = obj_hotel_name+'\n' + $text2+'\n===Price may change at any time===';
    }else{
        console.log('asdadas');
        $text_print = $text2+'\n===Price may change at any time===';
    }
    document.getElementById('data_copy2').innerHTML = $text_print;
    document.getElementById('data_copy2').hidden = false;
    var el = document.getElementById('data_copy2');
    el.select();
    document.execCommand('copy');
    document.getElementById('data_copy2').hidden = true;

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

function share_data2(){
    const el = document.createElement('textarea');
    el.value = $text2;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $text_share2 = window.encodeURIComponent($text2);
}


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