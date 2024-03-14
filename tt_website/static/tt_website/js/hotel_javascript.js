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

hotel_pagination_number = 1;

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
            for(idrupiah=0;idrupiah<pj;idrupiah++){
                if((pj-idrupiah)%3==0 && idrupiah!=0){
                    priceshow+=",";
                }
                priceshow+=temp.charAt(idrupiah);
            }
            if(temp.split('.').length == 2){
                for(idrupiah=pj;idrupiah<pj+3;x++){
                    priceshow+=temp.charAt(idrupiah);
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
        var hotel_request_data = {
            "destination": document.getElementById('hotel_id_destination').value.replace(/;/g,'~'),
            "guest_nationality": document.getElementById('hotel_id_nationality_id').value,
            "business_trip": document.getElementById('business_trip').value == 'true' ? 'T' : 'F',
            "checkin_date": document.getElementById('hotel_checkin_checkout').value.split(' - ')[0],
            "checkout_date": document.getElementById('hotel_checkin_checkout').value.split(' - ')[1],
            "room": document.getElementById('hotel_room').value,
            "adult": document.getElementById('hotel_adult').value,
            "child": document.getElementById('hotel_child').value
        }

        if(document.getElementById('hotel_child').value != '0'){
            child_age = [];
            for(i=1;i<=parseInt(document.getElementById('hotel_child').value);i++){
                child_age.push(document.getElementById('hotel_child_age'+i).value);
            }
            hotel_request_data['child_age'] = child_age;
        }
        if(document.getElementById('checkbox_corpor_mode_hotel')){
            if(document.getElementById('checkbox_corpor_mode_hotel').checked){
                hotel_request_data['checkbox_corpor_mode_hotel'] = true;
                if(document.getElementById('hotel_corpor_select')){
                    if(!document.getElementById('hotel_corpor_select').value){
                        document.getElementById('hotel_corpor_select').value = '';
                    }
                    hotel_request_data['hotel_corpor_select'] = document.getElementById('hotel_corpor_select').value.split(' - ')[0];
                }if(document.getElementById('hotel_corbooker_select')){
                    hotel_request_data['hotel_corbooker_select'] = document.getElementById('hotel_corbooker_select').value;
                }
            }
        }
        var concat_url = '';
        for(key in hotel_request_data){
            if(concat_url)
                concat_url += '&';
            concat_url += key + '=' + encodeURIComponent(hotel_request_data[key]);
        }
        window.location.href = '/hotel/search?' + concat_url;

//        document.getElementById('hotel_searchForm').submit();
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

function filtering(type){
    update = 0;
    $('#badge-copy-notif').html("0");
    $('#badge-copy-notif2').html("0");
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
                if (Object.keys(obj.prices).length > 0){
                    for (i in obj.prices) {
                        if ($minPrice <= obj.prices[i].price && obj.prices[i].price <= $maxPrice){
                            temp_data.push(obj);
                            break;
                        }
                    }
                } else {
                    temp_data.push(obj);
                }
            });
            data.hotel_ids = temp_data;
            hotel_filter = data;
            temp_data = [];
            checking_price = 0;
            temp_response = data;
            sort(data, 1);
        }
    }else{
        sort(hotel_data,1)
    }
}

function sorting_button(value, id){
//    if(value == 'price'){
//        if(sorting_value == '' || sorting_value == 'Lowest Price'){
//            sorting_value = 'Highest Price';
//            document.getElementById("img-sort-down-price").style.display = "none";
//            document.getElementById("img-sort-up-price").style.display = "block";
//        }else{
//            sorting_value = 'Lowest Price';
//            document.getElementById("img-sort-down-price").style.display = "block";
//            document.getElementById("img-sort-up-price").style.display = "none";
//        }
//    }else if(value == 'name'){
//        if(sorting_value == '' || sorting_value == 'Name Descending'){
//            sorting_value = 'Name Ascending';
//            document.getElementById("img-sort-down-name").style.display = "none";
//            document.getElementById("img-sort-up-name").style.display = "block";
//        }else{
//            sorting_value = 'Name Descending';
//            document.getElementById("img-sort-down-name").style.display = "block";
//            document.getElementById("img-sort-up-name").style.display = "none";
//        }
//    }else if(value == 'rating'){
//        if(sorting_value == '' || sorting_value == 'Rating Down'){
//            sorting_value = 'Rating Up';
//            document.getElementById("img-sort-down-rating").style.display = "none";
//            document.getElementById("img-sort-up-rating").style.display = "block";
//        }else{
//            sorting_value = 'Rating Down';
//            document.getElementById("img-sort-down-rating").style.display = "block";
//            document.getElementById("img-sort-up-rating").style.display = "none";
//        }
//    }else{
//        sorting_value = value;
//    }

    sorting_value = value;
    $('#sort_by_span').text(value);
    document.getElementById('radio_sorting'+id).checked = true;
    document.getElementById('radio_sorting2'+id).checked = true;

    hotel_pagination_number = 1;
    filtering('filter');
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
    }else{
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

                var arr = [];
                for (var key in response.hotel_ids[i].prices) {
                    if (response.hotel_ids[i].prices.hasOwnProperty(key)) {
                        arr.push( response.hotel_ids[i].prices[key].price );
                    }
                }
                for(var l = 0; l < arr.length-1; l++)
                    for(var k = l+1; k <= arr.length-1; k++) {
                        if(arr[j] > arr[k]){
                            var temp = arr[l];
                            arr[l] = arr[k];
                            arr[k] = temp;
                        }
                    }
                price_i = arr[0];

                var arr = [];
                for (var key in response.hotel_ids[j].prices) {
                    if (response.hotel_ids[j].prices.hasOwnProperty(key)) {
                        arr.push( response.hotel_ids[j].prices[key].price );
                    }
                }
                for(var l = 0; l < arr.length-1; l++)
                    for(var k = l+1; k <= arr.length-1; k++) {
                        if(arr[l] > arr[k]){
                            var temp = arr[l];
                            arr[l] = arr[k];
                            arr[k] = temp;
                        }
                    }
                price_j = arr[0];

                if(price_i > price_j){
                    var temp = response.hotel_ids[i];
                    response.hotel_ids[i] = response.hotel_ids[j];
                    response.hotel_ids[j] = temp;
                }
            }else if(sorting == 'Highest Price'){
                var price_i = 0;
                var price_j = 0;
                var arr = [];
                for (var key in response.hotel_ids[i].prices) {
                    if (response.hotel_ids[i].prices.hasOwnProperty(key)) {
                        arr.push( response.hotel_ids[i].prices[key].price );
                    }
                }
                for(var l = 0; l < arr.length-1; l++)
                    for(var k = l+1; k <= arr.length-1; k++) {
                        if(arr[l] < arr[k]){
                            var temp = arr[l];
                            arr[l] = arr[k];
                            arr[k] = temp;
                        }
                    }
                price_i = arr[0];

                var arr = [];
                for (var key in response.hotel_ids[j].prices) {
                    if (response.hotel_ids[j].prices.hasOwnProperty(key)) {
                        arr.push( response.hotel_ids[j].prices[key].price );
                    }
                }
                for(var l = 0; l < arr.length-1; l++)
                    for(var k = l+1; k <= arr.length-1; k++) {
                        if(arr[l] < arr[k]){
                            var temp = arr[l];
                            arr[l] = arr[k];
                            arr[k] = temp;
                        }
                    }
                price_j = arr[0];

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
//    document.getElementById("hotel_result_city").innerHTML = '';
//    text = '';
//    var node = document.createElement("div");
//    var city_ids_length = parseInt(response.city_ids.length);
//    text+=`
//    <div onclick="show_hide_city_hotel();" style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px; cursor:pointer;">
//        <h6 id="city_hotel_down"> Suggestions by City - `+city_ids_length+` results <i class="fas fa-chevron-down" style="color:`+color+`; float:right;"></i></h6>
//        <h6 id="city_hotel_up" style="display:none;"> Suggestions by City - `+city_ids_length+` results <i class="fas fa-chevron-up" style="color:`+color+`; float:right;"></i></h6>
//    </div>`;
//    node.innerHTML = text;
//    document.getElementById("hotel_result_city").appendChild(node);
//    node = document.createElement("div");
//
//    document.getElementById("hotel_city").innerHTML = '';
//    text='';
//    if(response.city_ids.length != 0){
//        var node = document.createElement("div");
//        for(i in response.city_ids){
//            text = '<form id="hotel_city'+i+'" action="/hotel/detail" method="POST" class="c-pointer">';
//                if(response.city_ids[i].image != false)
//                    text+=`<div class="img-hotel-search-c" style="background-image: url('`+response.city_ids[i].image+`');border:1px solid #cdcdcd;"></div>`;
//                else
//                    text+=`<div class="img-hotel-search-c" style="background-image: url('/static/tt_website/images/no_found/no-image-hotel2.jpg');border:1px solid #cdcdcd;"></div>`;
//                text+=`
//                <div class="text-block-custom">
//                    <span style="font-size:13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;"><i class="fas fa-map-marker-alt" style="color:#FFC44D;"></i> `+response.city_ids[i].name+` `+response.city_ids[i].country_name+`</span><br/>
//                    <span style="font-size:13px;">`+response.city_ids[i].hotel_qty+` Found</span>
//                </div>
//            </form>`;
//            node.className = 'col-lg-3 col-md-3 col-sm-4 col-xs-6';
//            node.innerHTML = text;
//            document.getElementById("hotel_city").appendChild(node);
//            node = document.createElement("div");
//        }
//    }
//    else{
//        text = '';
//        text += `
//        <div style="padding:5px; margin:10px;">
//            <div style="text-align:center">
//                <img src="/static/tt_website/images/no_found/no-city.png" style="width:60px; height:60px;" alt="Not Found City" title="" />
//                <br/><br/>
//                <span style="font-size:14px; font-weight:600;">Oops! City not found.</span>
//            </div>
//        </div>`;
//        var node = document.createElement("div");
//        node.innerHTML = text;
//        document.getElementById("hotel_city").appendChild(node);
//        node = document.createElement("div");
//    }
//    document.getElementById("hotel_result_landmark").innerHTML = '';
//    text = '';
//    var node = document.createElement("div");
//    var landmark_ids_length = parseInt(response.landmark_ids.length);
//    text+=`
//    <div onclick="show_hide_landmark_hotel();" style="border:1px solid #cdcdcd; background-color:white; margin-bottom:15px; padding:10px; cursor:pointer;">
//        <h6 id="landmark_hotel_down"> Suggestions by Landmark - `+landmark_ids_length+` results <i class="fas fa-chevron-down" style="color:`+color+`; float:right;"></i></h6>
//        <h6 id="landmark_hotel_up" style="display:none;"> Suggestions by Landmark - `+landmark_ids_length+` results <i class="fas fa-chevron-up" style="color:`+color+`; float:right;"></i></h6>
//    </div>`;
//    node.innerHTML = text;
//    document.getElementById("hotel_result_landmark").appendChild(node);
//    node = document.createElement("div");
//
//    document.getElementById("hotel_landmark").innerHTML = '';
//    text='';
//    if(response.landmark_ids.length != 0){
//        var node = document.createElement("div");
//        for(i in response.landmark_ids){
//            text = '<form id="hotel_landmark'+i+'" action="/hotel/detail" method="POST" class="c-pointer">';
//                if(response.landmark_ids[i].images.length != 0)
//                    text+=`<div class="img-hotel-search-c" style="background-image: url('`+response.landmark_ids[i].images[0].url+`');border:1px solid #cdcdcd;"></div>`;
//                else
//                    text+=`<div class="img-hotel-search-c" style="background-image: url('/static/tt_website/images/no_found/no-image-hotel2.jpg');border:1px solid #cdcdcd;"></div>`;
//
//                text+=`
//                <div class="text-block-custom">
//                    <span style="font-size:13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;">`+response.landmark_ids[i].name+`</span><br/>
//                    <span style="font-size:13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;"><i class="fas fa-map-marker-alt" style="color:#FFC44D;"></i> `+response.landmark_ids[i].city+`</span><br/>
//                    <span style="font-size:13px;">`+response.landmark_ids[i].near_by_hotel+` Found</span>
//                </div>
//            </form>`;
//            node.className = 'col-lg-3 col-md-3 col-sm-4 col-xs-6';
//            node.innerHTML = text;
//            document.getElementById("hotel_landmark").appendChild(node);
//            node = document.createElement("div");
//        }
//    }
//    else{
//        text = '';
//        text += `
//            <div style="padding:5px; margin:10px;">
//                <div style="text-align:center">
//                    <img src="/static/tt_website/images/no_found/no-landmark.png" style="width:60px; height:60px;" alt="Not Found Landmark" title="" />
//                    <br/><br/>
//                    <span style="font-size:14px; font-weight:600;">Oops! Landmark not found.</span>
//                </div>
//            </div>
//        `;
//        var node = document.createElement("div");
//        node.innerHTML = text;
//        document.getElementById("hotel_landmark").appendChild(node);
//        node = document.createElement("div");
//    }

    document.getElementById("hotel_result").innerHTML = '';
    text = '';


    document.getElementById("hotel_result").innerHTML = '';
    text = '';
    var node = document.createElement("div");
    hotel_ids_length = parseInt(response.hotel_ids.length);
    text+=`
    <div class="search-box-result" style="padding:10px; margin-bottom:10px; margin-top:5px;">
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

    var min_hotel = parseInt((hotel_pagination_number*20)-20);
    var max_hotel = parseInt((hotel_pagination_number*20)-1);

    document.getElementById("hotel_ticket").innerHTML = '';
    text='';
    if(response.hotel_ids.length != 0){
        for(i in response.hotel_ids){
            var node = document.createElement("div");
            node.id = "hotel"+i+"_div";
            text = '';
            if(i >= min_hotel && i <= max_hotel){
                text = render_hotel_search(response.hotel_ids[i], i)
            }
            //tambah button ke detail
            node.className = 'sorting-box-b search-box-result';
            node.innerHTML = text;
            if(document.getElementById(node.id) == null)
                document.getElementById("hotel_ticket").appendChild(node);
            else
                document.getElementById(node.id).innerHTML = node.innerHTML;

            render_show_more_price_hotel_search(response.hotel_ids[i], i)
        }

        if(is_hotel_search_done)
            $('#loading-search-hotel').hide();

        /* PAGINATION */

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
                    <img src="/static/tt_website/images/no_found/no-hotel.png" style="width:60px; height:60px;" alt="Not Found Hotel" title="" />
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
            text+=`<img data-toggle="tooltip" class="airline-logo" alt="" style="width:50px;height:50px;" src="`+response.landmark_ids[i].images[0].url+`"><span> </span>`;
        else
            text+=`<img data-toggle="tooltip" class="airline-logo" alt="" style="width:50px;height:50px;" src="/static/tt_website/images/no_found/no-image-hotel2.jpg"><span> </span>`;
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

function render_show_more_price_hotel_search(hotel_data_print,i){
    var arr = [];
    var content_price_pop = ``;
    if(Object.keys(hotel_data_print.prices).length > 0){
        for (var key in hotel_data_print.prices) {
            if (hotel_data_print.prices.hasOwnProperty(key)) {
                arr.push( [ key, hotel_data_print.prices[key] ] );
            }
        }
        for(var j = 0; j < arr.length-1; j++){
            for(var k = j+1; k <= arr.length-1; k++) {
                if(arr[j][1].price > arr[k][1].price){
                    var temp = arr[j];
                    arr[j] = arr[k];
                    arr[k] = temp;
                }
            }
            content_price_pop = ``;
            price = 0;
            price_without_discount = 0;
            currency = '';
            for(j in arr){
                for(k in arr[j][1].prices.rooms){
                    for(l in arr[j][1].prices.rooms[k].nightly_prices){
                        for(m in arr[j][1].prices.rooms[k].nightly_prices[l].service_charges){
                            if(!currency)
                                currency = arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].currency;
                            if(arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].charge_type != 'RAC'){
                                if(arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].charge_type != 'DISC'){
                                    price_without_discount += arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].total;
                                }
                                price += arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].total;
                            }
                        }
                    }
                }
                arr[j][1].price = price;
                arr[j][1].price_without_discount = price_without_discount;
                price_without_discount = 0;
                price = 0;
            }

            for(j in arr){
                if(j == 0){
                    content_price_pop += `<i class="fas fa-thumbs-up" style="padding-left: 5px; color:`+color+`;"></i>`;
                    if(arr[j][1].price != arr[j][1].price_without_discount)
                        text += `<span class="basic_fare_field cross_price" style="font-size:14px; color:#929292;" hidden>`+currency+` ` + getrupiah(arr[j][1]['price_without_discount']) + `</span>`;
                    text += `<span class="price_hotel" hidden>`+currency+` ` + getrupiah(arr[j][1]['price']) + `</span>`;
                }
                if(arr[j][1].price != arr[j][1].price_without_discount)
                    content_price_pop += `<span class="basic_fare_field cross_price" style="font-size:14px; color:#929292;">`+currency+` ` + getrupiah(arr[j][1]['price_without_discount']) + `</span>`;
                content_price_pop +=`
                    <span style="font-size:16px; font-weight: 700;">`+currency+` ` + getrupiah(arr[j][1]['price']) + `</span>
                    <span style="font-size:16px; font-weight: 700; color:`+color+`;">` + arr[j][0] +`</span><br/>`;
            }
        }
        new jBox('Tooltip', {
            attach: '#view_all'+i,
            target: '#view_all'+i,
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
            content: content_price_pop
        });
    } else {
        content_price_pop = ``;
    }
}

function render_hotel_search(hotel_data_print, i){
    text = '';
    text += '<form id="hotel'+i+'" action="/hotel/detail" method="POST">';
    //msg.result.response.city_ids[i].sequence
    text+=`
    <input type="hidden" id="hotel_id`+i+`" value="`+hotel_data_print.id+`"/>
    <div class="row">`;
        if(hotel_data_print.images.length != 0){
            text+=`
            <div class="col-lg-3">
                <div class="img-hotel-search" style="cursor:pointer; background: url('`+hotel_data_print.images[0].url+`'), url('/static/tt_website/images/no_found/no-image-hotel2.jpg'); background-size:cover;" onclick="goto_detail('hotel',`+i+`)"></div>
            </div>`;
        }
        else{
            text+=`
            <div class="col-lg-3">
                <div class="img-hotel-search" style="cursor:pointer; background: url('/static/tt_website/images/no_found/no-image-hotel2.jpg'); background-size:cover;"></div>
            </div>`;
        }
        text+=`
        <div class="col-lg-9 name_hotel_search">
            <div class="row">
                <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                    <h5 class="name_hotel hover_name" title="`+hotel_data_print.name+`" style="cursor:pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right:5px; font-size:18px; font-weight:bold;" onclick="goto_detail('hotel',`+i+`)">`+hotel_data_print.name+`</h5>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 checkbox_search_hotel" style="text-align:right;">
                    <label class="check_box_custom">
                        <span class="span-search-ticket"></span>
                        <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBox(`+i+`, `+hotel_ids_length+`);"/>
                        <span class="check_box_span_custom"></span>
                    </label>
                    <span class="id_copy_result" hidden>`+i+`</span>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-7 col-md-7" style="padding-top:5px;">
                    <div class="row">
                        <div class="col-lg-12">`;
                            if(hotel_data_print.rating != false){
                                for (co=0; co < parseInt(hotel_data_print.rating); co++){
                                    text+=`<i class="fas fa-star" style="color:#FFC44D; font-size:16px;"></i>`;
                                }
                                text+=`<span class="rating_hotel" hidden>*`+hotel_data_print.rating+`</span>`;
                            }
                            else{
                                text+=`<span class="rating_hotel" hidden>Unrated</span>`;
                            }

                            detail = JSON.stringify(hotel_data_print);
                            detail = detail.replace(/'/g, "");
                            text+=`<input type="hidden" id="hotel_detail`+i+`" name="hotel_detail" value='`+detail+`'/>`;
                            text+=`
                            <div style="padding-bottom:5px;">`;
                                address = '';
                                address_detail = '';
                                if(hotel_data_print.location.address){
                                    if(address != '')
                                        address += ', '
                                    address+= hotel_data_print.location.address;
                                }

                                if(hotel_data_print.location.city != '' && hotel_data_print.location.city != false && hotel_data_print.location.city){
                                    if(address_detail != '')
                                        address_detail += ', '
                                    address_detail+= hotel_data_print.location.city;
                                }if(hotel_data_print.location.state != '' && hotel_data_print.location.state != false && hotel_data_print.location.state){
                                    if(address_detail != '')
                                        address_detail += ', '
                                    address_detail+= hotel_data_print.location.state;
                                }if(hotel_data_print.location.district != '' && hotel_data_print.location.district != false && hotel_data_print.location.district){
                                    if(address_detail != '')
                                        address_detail += ', '
                                    address_detail+= hotel_data_print.location.district;
                                }if(hotel_data_print.location.kelurahan != '' && hotel_data_print.location.kelurahan != false && hotel_data_print.location.kelurahan){
                                    if(address_detail != '')
                                        address_detail += ', '
                                    address_detail+= hotel_data_print.location.kelurahan;
                                }if(hotel_data_print.location.zipcode != '' && hotel_data_print.location.zipcode != false && hotel_data_print.location.zipcode){
                                    if(address_detail != '')
                                        address_detail += ', '
                                    address_detail+= hotel_data_print.location.zipcode;
                                }
                                text += `
                                <span class="location_hotel" style="font-size:13px; display:none;">`+address + address_detail+`</span>`;
                                if(address != ''){
                                    text+=`
                                    <div title="`+address+`" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100%;">
                                        <span style="padding-right:5px; font-size:13px;">
                                            <i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> `+address+`
                                        </span>
                                    </div>
                                    <span>`+address_detail+`</span>`;
                                }else{
                                    text+=`<span><i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> `+address_detail+`</span>`;
                                }
                                text+=`
                            </div>
                        </div>
                        <div class="col-lg-12">`;
                            if(typeof(top_facility) !== 'undefined' && top_facility.length != 0 ){
                                text+=`<div style="padding-bottom:5px; height:90px;">
                                <span>Facilities</span><br/>`;
                                text+=`
                                <div class="row">`;
                                try{
        //                                        var ava_fac = '';
                                    for(j in top_facility){
                                        var facility_check = 0;
                                        for(k in hotel_data_print.facilities){
                                            if(top_facility[j].facility_name.toLowerCase() == hotel_data_print.facilities[k].facility_name.toLowerCase() ){
                                                facility_check = 1;
        //                                                    ava_fac += hotel_data_print.facilities[k].facility_id + ','
                                                break;
                                            } else if (top_facility[j].internal_name.toLowerCase().includes(hotel_data_print.facilities[k].facility_name.toLowerCase()) ){
                                                facility_check = 1;
        //                                                    ava_fac += hotel_data_print.facilities[k].facility_id + ','
                                                break;
                                            }
                                        }
                                        text+=`<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">`;
                                        if(facility_check == 1){
                                            text+=`<span class="facility_hotel"><i class="fas fa-check" style="font-size:13px;"></i> `+top_facility[j].facility_name+`</span>`;
                                        }
                                        else{
                                            text+=`<span style="margin-right:5px; color:gray; font-size:11px; word-break: break-all;"><i class="fas fa-times" style="font-size:13px;"></i> No `+top_facility[j].facility_name+`</span>`;
                                        }
                                        text+=`</div>`;
                                    }
                                }

                                catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                                text+=`</div>
                                </div>`;
                            }else{
                                text+=`<div style="padding-bottom:5px; height:40px;"></div>`;
                            }

                            var idx_img = 1;
                            if(hotel_data_print.images.length != 0){
                                text+=`<div style="padding-top:10px; height:60px;" id='pagination_image`+i+`'>`;
                                for(idx_img; idx_img < hotel_data_print.images.length; idx_img++){
                                    if(idx_img < 5){
                                        text+=`<img class="img_hotel_smallbot" alt="Hotel" src="`+hotel_data_print.images[idx_img].url+`" onerror="this.src='/static/tt_website/images/no_found/no-image-hotel2.jpg';" width="55" height="55" onclick="go_to_owl_carousel_bottom(`+idx_img+`, `+i+`);">`;
                                    }
                                    else{
                                        break;
                                    }
                                }
                                text+=`</div>`;
                            }else{
                                text+=`<div style="padding-top:10px; height:75px;"></div>`;
                            }
                            text+=`
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 col-md-5" style="padding-top:20px;">
                    <div class="search_hotel_button" style="text-align:right; position:absolute; bottom:0px; right:15px;">`;
                        var currency = '';
                        if(Object.keys(hotel_data_print.prices).length > 0){
                            var arr = [];
                            for (var key in hotel_data_print.prices) {
                                if (hotel_data_print.prices.hasOwnProperty(key)) {
                                    arr.push( [ key, hotel_data_print.prices[key] ] );
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
                                content_price_pop = ``;
                                price = 0;
                                price_without_discount = 0;
                                for(j in arr){
                                    for(k in arr[j][1].prices.rooms){
                                        for(l in arr[j][1].prices.rooms[k].nightly_prices){
                                            for(m in arr[j][1].prices.rooms[k].nightly_prices[l].service_charges){
                                                if(!currency)
                                                    currency = arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].currency;
                                                if(arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].charge_type != 'RAC'){
                                                    if(arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].charge_type != 'DISC'){
                                                        price_without_discount += arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].total;
                                                    }
                                                    price += arr[j][1].prices.rooms[k].nightly_prices[l].service_charges[m].total;
                                                }
                                            }
                                        }
                                    }
                                    arr[j][1].price = price;
                                    arr[j][1].price_without_discount = price_without_discount;
                                    price_without_discount = 0;
                                    price = 0;
                                }

                                    //check disni tampilkan harga discount
                                for(j in arr){
                                    if(j == 0){
                                        content_price_pop += `<i class="fas fa-thumbs-up" style="padding-left: 5px; color:`+color+`;"></i>`;
                                        if(arr[j][1].price != arr[j][1].price_without_discount)
                                            text += `<span class="basic_fare_field cross_price" style="font-size:14px; color:#929292;" hidden>`+currency+` ` + getrupiah(arr[j][1]['price_without_discount']) + `</span>`;
                                        text += `<span class="price_hotel" hidden>`+currency+` ` + getrupiah(arr[j][1]['price']) + `</span>`;
                                    }
                                    // else if(j > 2){
                                    //     text += `<i class="fas fa-thumbs-down" style="color:`+color+`;"></i>`;
                                    // }
                                    if(arr[j][1].price != arr[j][1].price_without_discount)
                                        content_price_pop += `<span class="basic_fare_field cross_price" style="font-size:14px; color:#929292;">`+currency+` ` + getrupiah(arr[j][1]['price_without_discount']) + `</span>`;
                                    content_price_pop +=`
                                        <span style="font-size:16px; font-weight: 700;">`+currency+` ` + getrupiah(arr[j][1]['price']) + `</span>
                                        <span style="font-size:16px; font-weight: 700; color:`+color+`;">` + arr[j][0] +`</span><br/>`;
                                }
                        }
                        else {
                            var arr = [];
                            content_price_pop = ``;
    //                            for(j in hotel_data_print.external_code){
    //                                text += `
    //                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
    //                                <span style="font-size:13px; font-weight: 500; text-align:left;">` + j +`</span>
    //                            </div>
    //                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
    //                                <span style="font-size:13px; font-weight: 700; text-align:right;">-</span>
    //                            </div>`;
    //                            }
                            text+=`<span class="price_hotel" hidden>Waiting price</span>`;
                        }
                        var total_room = document.getElementById("hotel_room").value;
                        var total_night = document.getElementById("total_night_search").textContent;

                        text += `
                        <div class="search_hotel_button" style="text-align:right;">`;
                            if(arr.length != 0){
                                if(arr[0][1].price != arr[0][1].price_without_discount)
                                    text += `
                                    <span class="basic_fare_field cross_price" style="font-size:14px; color:#929292;">`+currency+` ` + getrupiah(arr[0][1]['price_without_discount']) + `</span>
                                    <span style="font-size:16px; font-weight: 700; color:white;">` + arr[0][0] +`</span><br/>`;

                                text+=`
                                <span style="font-size:15px; font-weight: 700; padding-right:5px; color:`+color+`;">`+arr[0][1]['currency']+` ` + getrupiah(arr[0][1]['price']) + `</span>
                                <span style="font-size:15px; font-weight: 700;">` + arr[0][0] +`</span><br/>`;

                                if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && arr[0][1]['price']){
                                    if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                        for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                            try{
                                                if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                                    price_convert = parseFloat((arr[0][1]['price'])/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                                    if(price_convert%1 == 0)
                                                        price_convert = parseInt(price_convert);
                                                    text+=`<span style="font-size:13px; font-weight:bold; color:`+color+`;" id="total_price_`+k+`">Estimated `+k+` `+price_convert+`</span><br/>`;
                                                }
                                            }catch(err){
                                                console.log(err);
                                            }
                                        }
                                    }
                                }
                            }
                            if(arr.length > 1){
                                text+=`<span style="color:`+color+`; font-size:13px; font-weight:700; text-align:left; cursor:pointer;" id="view_all`+i+`"> More Price<i class="fas fa-caret-down"></i></span><br/>`;
                            }
                            text+=`
                            <span class="carrier_code_template" style="color:black; margin-bottom:5px;">for `+total_room+` room, `+total_night+` night</span><br/>`;
                            try{
                                if(arr.length != 0)
                                    text+=`<button type="button" class="primary-btn-custom" onclick="goto_detail('hotel',`+i+`)" style="font-size:13px;">Click here for Best Price!</button>`;
                                else
                                    text+=`<button type="button" class="primary-btn-custom" style="background-color:#cdcdcd;" onclick="goto_detail('hotel',`+i+`)">No Available Price</button>`;
                            }catch(err){
                                text+=`<button type="button" class="primary-btn-custom" style="background-color:#cdcdcd;" onclick="goto_detail('hotel',`+i+`)">No Available Price</button>`;
                            }
                            text+=`
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </form>`;
    return text;
}


function filter_name(name_num){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        hotel_pagination_number = 1;
        change_filter('hotel_name'+ String(name_num),'');
    }, 500);
}

function change_filter(type, value){
    var check = 0;
    hotel_pagination_number = 1;
    if(type == 'rating'){
        rating_list[value].status = !rating_list[value].status;
        document.getElementById("rating_filter"+value).checked = rating_list[value].status;
        document.getElementById("rating_filter2"+value).checked = rating_list[value].status;
    }else if(type == 'facility'){
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
    filtering('filter');
}

function hotel_filter_render(){
    document.getElementById("sorting-hotel").innerHTML = '';
    document.getElementById("sorting-hotel2").innerHTML = '';
    document.getElementById("filter").innerHTML = '';
    document.getElementById("filter2").innerHTML = '';

    var node = document.createElement("div");
//    text = '';
//    text_pick_footer = '';
//    text+= `
//    <span style="font-size:14px; font-weight:600;">Session Time <span class="count_time" id="session_time"> </span></span>
//    <hr/>
//    <span style="font-size:14px; font-weight:600;">Elapsed Time <span class="count_time" id="elapse_time"> </span></span>`;
//
//    node = document.createElement("div");
//    node.innerHTML = text;
//    document.getElementById("session_timer").appendChild(node);
//    node = document.createElement("div");

    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
    <hr/>`;
    text+=`
    <div class="form-wrap" style="padding:0px; text-align:left;">
        <h6 class="filter_general" onclick="show_hide_general('hotelName');">Hotel Name <i class="fas fa-chevron-down" id="hotelName_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="hotelName_generalUp" style="float:right; display:block;"></i></h6>
        <div id="hotelName_generalShow" style="display:inline-block; width:100%;">
            <input type="text" style="margin-bottom:0px !important;" class="form-control" id="hotel_filter_name" placeholder="Hotel Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Hotel Name '" autocomplete="off" onkeyup="filter_name(1);"/>
        </div>
        <hr/>
        <h6 class="filter_general" onclick="show_hide_general('hotelPrice');">Price Range <i class="fas fa-chevron-down" id="hotelPrice_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="hotelPrice_generalUp" style="float:right; display:block;"></i></h6>
        <div id="hotelPrice_generalShow" style="display:inline-block;">
            <div class="range-slider">
                <input type="text" class="js-range-slider"/>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <input type="text" style="margin-bottom:0px !important;" class="js-input-from form-control" id="price-from" value="`+low_price_slider+`" onblur="checking_price_slider(1,1);"/>
                </div>
                <div class="col-lg-6">
                    <input type="text" style="margin-bottom:0px !important;" class="js-input-to form-control" id="price-to" value="`+high_price_slider+`" onblur="checking_price_slider(1,2);"/>
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
    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);

    node = document.createElement("div");

//    text = `<span style="font-weight: bold; margin-right:10px;">Sort by: </span>`;
//    for(i in sorting_list2){
//        text+=`
//        <button class="primary-btn-sorting" id="sorting_list2`+i+`" name="sorting_list2" onclick="sorting_button('`+sorting_list2[i].value.toLowerCase()+`')" value="`+sorting_list2[i].value+`">
//            <span id="img-sort-down-`+sorting_list2[i].value.toLowerCase()+`" style="display:block;"> `+sorting_list2[i].value+` <i class="fas fa-caret-down"></i></span>
//            <span id="img-sort-up-`+sorting_list2[i].value.toLowerCase()+`" style="display:none;"> `+sorting_list2[i].value+` <i class="fas fa-caret-up"></i></span>
//        </button>`;
//    }

    text =`
    <div style="margin-bottom:10px;">
        <h6 style="display: inline;">Sort by</h6>
    </div>
    <div class="drop_inline" style="width:100%;">
        <div class="dropdown-toggle remove-arrow-dt div-dropdown-txt primary-btn-white" data-toggle="dropdown" style="width:100%; line-height:unset; padding:10px">
            <span type="button" style=" cursor:pointer; margin-bottom:0px !important; text-align:left;">
                <span id="sort_by_span">---Sort by---</span>
            </span>
            <ul class="dropdown-menu" role="menu" style="padding:15px;">`;
            for(i in sorting_list){
                text+=`
                <label class="radio-button-custom">
                    <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                    <input type="radio" id="radio_sorting`+i+`" name="radio_sorting" onclick="sorting_button('`+sorting_list[i].value+`', '`+i+`');" value="`+sorting_list[i].value+`">
                    <span class="checkmark-radio"></span>
                </label></br>`;
            }
            text+=`
            </ul>
        </div>
    </div>`;

    var node = document.createElement("div");
    node.className = 'sorting-box';
    node.innerHTML = text;
    document.getElementById("sorting-hotel").appendChild(node);

    var node2 = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
            <hr/>
            <h6 style="padding-bottom:10px;">Hotel Name</h6>`;
            text+=`
            <div class="form-wrap" style="padding:0px; text-align:left;">
                <input type="text" style="margin-bottom:0px !important;" class="form-control" id="hotel_filter_name2" placeholder="Hotel Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Hotel Name '" autocomplete="off" onkeyup="filter_name(2);"/>
            </div>`;
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
                                <input type="text" style="margin-bottom:0px !important;" class="js-input-from2 form-control" id="price-from2" value="`+low_price_slider+`" onblur="checking_price_slider(2,1);"/>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <input type="text" style="margin-bottom:0px !important;" class="js-input-to2 form-control" id="price-to2" value="`+high_price_slider+`" onblur="checking_price_slider(2,2);"/>
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
            <input type="radio" id="radio_sorting2`+i+`" name="radio_sorting2" onclick="sorting_button('`+sorting_list[i].value+`', '`+i+`);" value="`+sorting_list[i].value+`">
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

function hotel_room_pick(key, key2){
    document.getElementById('hotel_detail_table').innerHTML = '';
    $text2 = "";
    $text_share2 = "";
    //$('#button_chart_hotel').show();
    //$("#badge-hotel-notif").addClass("infinite");
    $("#myModalTicketHotel").modal('show');

    if(hotel_room_detail_pick != null){
        document.getElementById('button'+hotel_room_detail_pick).innerHTML = 'Choose';
        document.getElementById('button'+hotel_room_detail_pick).classList.remove("primary-btn-custom-un");
        document.getElementById('button'+hotel_room_detail_pick).classList.add("primary-btn-custom");
    }
    document.getElementById('button'+key).innerHTML = 'Unchoose';
    hotel_room_detail_pick = key;
    hotel_room = hotel_price[key];
    text='';
    text_pick_footer = '';
    text_btn_share = '';
    text_estimated = '';
    var get_name_hotel = document.getElementById("get_name_hotel").value;
    var get_rating_hotel = document.getElementById("rating_hotel").textContent;
    var get_address_hotel = document.getElementById("address_hotel").textContent;
    var get_date_hotel = document.getElementById("date_hotel").textContent;
    $text2 = ''+ get_name_hotel +' *'+ get_rating_hotel +'\n';
    $text2 += 'Address: '+ get_address_hotel +'\n';
    $text2 += get_date_hotel +'\n\n';
    total_price_hotel = 0;
    room_name = document.getElementById("name_room_htl"+key).value;

    text += `<h5 class="mb-2">`+room_name+`</h5>`;
    text += '<h6><i class="fas fa-exclamation-circle"></i> Cancellation: </h6><div id="cancellation_policy_choose" class="mb-3">';
    text += `
        <div class="row" id="loading-detail-hotel-room">
            <div class="col-lg-12">
                <ul style="padding-inline-start: 15px;">
                    <li style="color:`+color+`; cursor:pointer; list-style-type:unset; font-weight:400;"><span style="font-size:14px; font-weight:500;">PLEASE WAIT ... </span></li>
                </ul>
            </div>
        </div>`;
    document.getElementById('not_room_select').style.display = 'none';
//    text += '<span style="font-size:14px; font-weight:500;">PLEASE WAIT ... </span>';
    text += '</div>';

    text += `<div>
        <center><h6 style="color:`+color+`; display:none; cursor:pointer;" id="price_detail_hotel_down" onclick="show_hide_div_hotel('price_detail_hotel');">See Detail <i class="fas fa-chevron-down" style="font-size:14px;"></i></h6></center>
    </div>`;
    text += `<div id="price_detail_hotel_div" style="display:block">`;
    discount_hotel = 0;
    for(i in hotel_room.rooms){
        //text += '<span> '+ hotel_room.rooms[i].category + '<span><br/>';
        //text += '<span>Qty: '+ hotel_room.rooms[i].qty + '<span><br/>';
        text += `
        <div style="border:1px solid #cdcdcd; padding:15px; border-radius:5px; margin-bottom:15px;">
            <div style="display:flex;">
                <div style="display:inline-block; padding-right:5px;">
                    <i class="fas fa-bed" style="font-size:14px"></i>
                </div>
                <div style="display:inline-block;" title='`+hotel_room.rooms[i].description+`'>
                    <div style="display:grid;">
                        <h5>Room #`+(parseInt(i)+1)+`</h5>
                    </div>
                    <div style="display:grid;">
                        <span style="font-size:16px;">`+hotel_room.rooms[i].description+`</span>
                    </div>
                </div>
            </div>
            <hr/>`;

            if(hotel_room.meal_type != false){
                text += '<i class="fas fa-utensils"></i> <b>Meal Type: ' + hotel_room.meal_type +'</b/><br/>';
            }
            //text += '<span style="font-weight:500; padding-top:10px;">Cancellation Policy: </span>';

            //$text2 += 'Room Category: '+ hotel_room.rooms[i].category +'\n';
            $text2 += 'Room #' + (parseInt(i)+1) + ' ' + hotel_room.rooms[i].description +'\n';
            //$text2 += hotel_room.rooms[i].qty +' room(s) \n';
            $text2 += 'Meal Type: '+ hotel_room.meal_type +'\n \n';
            response = hotel_get_cancellation_policy(hotel_room.price_code, key, '0');

            text += `<div class="row">`;
            for(j in hotel_room.rooms[i].nightly_prices){
                date = new Date(hotel_room.rooms[i].nightly_prices[j].date).toString().split(' ');
                text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(hotel_room.rooms[i].nightly_prices[j].price)+'<span/></div>';
                for(k in hotel_room.rooms[i].nightly_prices[j].service_charges){
                    if(hotel_room.rooms[i].nightly_prices[j].service_charges[k].charge_type == 'DISC'){
                        discount_hotel += hotel_room.rooms[i].nightly_prices[j].service_charges[k].total;
                    }
                }
    //            $text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_room.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(hotel_room.rooms[i].nightly_prices[j].price) + '\n';
            }
            var total_room = document.getElementById("hotel_room").value;
            var total_night = document.getElementById("total_night_search").textContent;

            text += `
                <div class="col-lg-6">
                    <span style="font-weight:bold;">Total</span>
                </div>
                <div class="col-lg-6" style="text-align:right;">
                    <span style="font-weight:bold;">`+hotel_room.currency+` `+ getrupiah(hotel_room.rooms[i].price_total) +`</span><br/>
                    <span style="font-weight:500;">(for 1 room, `+total_night+` night)</span>
                </div>
            </div>
        </div>`;
        total_price_hotel += hotel_room.rooms[i].price_total;
//        $text2 += '\nTotal: IDR '+getrupiah(hotel_room.rooms[i].price_total) + ' ';
//        $text2 += '(for 1 room, ' +total_night+ ' night) \n';
    }
    text += `</div>`;

    text += `<div>
        <center><h6 style="color:`+color+`; display:block; cursor:pointer; margin-top:15px" id="price_detail_hotel_up" onclick="show_hide_div_hotel('price_detail_hotel');">Close Detail <i class="fas fa-chevron-up" style="font-size:14px;"></i></h6></center>
    </div>`;

    $text2 += 'Grand Total: '+hotel_room.currency+' '+getrupiah(total_price_hotel + discount_hotel)+'(for '+total_room+' room, ' +total_night+ 'night) \n\n';
//    text += `<hr/>`;

    document.getElementById('hotel_detail_table').innerHTML = text;

    if(discount_hotel != 0){
        text_pick_footer += `
        <div class="row">
            <div class="col-lg-6">
                <span style="font-weight:bold;font-size:15px;color:#e04022;">Discount</span>
            </div>
            <div class="col-lg-6" style="text-align:right;">
                <span style="font-weight:bold;font-size:15px;color:#e04022;">`+hotel_room.currency+` `+ getrupiah(discount_hotel) +`</span>
            </div>
        </div>`;
    }

    text_pick_footer += `
    <div class="row">
        <div class="col-lg-5" style="margin:auto;">
            <b style="font-size:16px; padding-right:10px;">Grand Total </b><br/>
            <span id="grand_total_id" style="font-size:16px;font-weight:bold; padding-right:10px;`;
            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                text_pick_footer+=`cursor:pointer;`;
            }
            text_pick_footer += `" id="total_price">`+hotel_room.currency+` `+ getrupiah(total_price_hotel+discount_hotel);
            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                 text_pick_footer+=`<i class="fas fa-caret-down"></i>`;
            }
            text_pick_footer+=`</span>`;
            if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price_hotel+discount_hotel){
                if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                    text_pick_footer+=`<span class="span_link" id="estimated_popup" style="color:`+color+` !important;">Estimated <i class="fas fa-coins"></i></span>`;
                    for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                        try{
                            if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == hotel_room.currency){
                                price_convert = ((total_price_hotel+discount_hotel)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                if(price_convert%1 == 0)
                                    price_convert = parseInt(price_convert);
                                text_estimated+=`<span style="font-size:14px; font-weight: bold; font-style: italic; color:`+color+`;">• `+k+` `+getrupiah(price_convert)+`</span><br/>`;
                            }
                        }catch(err){
                            console.log(err);
                        }
                    }
                }
            }
            text_pick_footer += `
            <br/>for `+total_room+` room, `+total_night+` night
        </div>
        <div class="col-lg-7" style="margin:auto;">`;
            if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                text_pick_footer += print_commission(hotel_room.rooms[i].commission*-1,'show_commission', hotel_room.currency)
            }
        text_pick_footer += `
        </div>
    </div>`;

    document.getElementById('button'+key).innerHTML = 'Chosen';
    document.getElementById('button'+key).classList.remove("primary-btn-custom");
    document.getElementById('button'+key).classList.add("primary-btn-custom-un");

    text_btn_share +=`
    <div class="row">
        <div class="col-lg-12">
            <div style="padding:7px 0px 15px 0px;">
            <button class="copy-btn-popup" type="button" onclick="copy_data2();">
                <i class="fas fa-copy"></i> Copy
            </button>`;

            share_data2();
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                text_btn_share+=`
                    <a class="share-btn-popup whatsapp" href="https://wa.me/?text=`+ $text_share2 +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/> Whatsapp</a>
                    <a class="share-btn-popup line" href="line://msg/text/`+ $text_share2 +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/> Line</a>
                    <a class="share-btn-popup telegram" href="https://telegram.me/share/url?text=`+ $text_share2 +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/> Telegram</a>
                    <a class="share-btn-popup email" href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share2 +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/> Email</a>`;
            } else {
                text_btn_share+=`
                    <a class="share-btn-popup whatsapp" href="https://web.whatsapp.com/send?text=`+ $text_share2 +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/> Whatsapp</a>
                    <a class="share-btn-popup line" href="https://social-plugins.line.me/lineit/share?text=`+ $text_share2 +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/> Line</a>
                    <a class="share-btn-popup telegram" href="https://telegram.me/share/url?text=`+ $text_share2 +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/> Telegram</a>
                    <a class="share-btn-popup email" href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share2 +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/> Email</a>`;
            }
            text_btn_share+=`
        </div>
    </div>`;

    text_pick_footer+=`
    <div class="row">
        <div class="col-lg-4">
            <button class="primary-btn-white" style="width:100%; margin-bottom:15px;" type="button" id="btn_share_popup">
                <i class="fas fa-share-alt"></i> Share / Copy
            </button>
        </div>
        <div class="col-lg-8">`;
            if(agent_security.includes('book_reservation') == true){
                text_pick_footer += `
                <button class="hold-seat-booking-train primary-btn ld-ext-right" style="width:100%; margin-bottom:10px;" type="button" onclick="goto_passenger();">
                    Next
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }
            text_pick_footer+=`
        </div>
    </div>`;

    document.getElementById('hotel_detail_button').innerHTML = text_pick_footer;

//    document.getElementById('hotel_detail_button_loading').innerHTML = `
//    <div class="stripe_2row_small">
//        <div class="div_stripe">
//            <div class="loading_stripe"></div>
//        </div>
//    </div>`;

    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
        var price_breakdown = {};
        var currency_breakdown = '';
        for(j in hotel_room.rooms){
            for(k in hotel_room.rooms[j].nightly_prices){
                if(currency_breakdown == ''){
                    for(l in hotel_room.rooms[j].nightly_prices[k].service_charges){
                        currency_breakdown = hotel_room.rooms[j].nightly_prices[k].service_charges[l].currency;
                        break;
                    }
                }
                for(l in hotel_room.rooms[j].nightly_prices[k].service_charge_summary){
                    if(!price_breakdown.hasOwnProperty('FARE'))
                        price_breakdown['FARE'] = 0;
                    if(!price_breakdown.hasOwnProperty('TAX'))
                        price_breakdown['TAX'] = 0;
                    if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                        price_breakdown['BREAKDOWN'] = 0;
                    if(!price_breakdown.hasOwnProperty('UPSELL'))
                        price_breakdown['UPSELL'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION'))
                        price_breakdown['COMMISSION'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA HOTEL'))
                        price_breakdown['NTA HOTEL'] = 0;
                    if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                        price_breakdown['SERVICE FEE'] = 0;
                    if(!price_breakdown.hasOwnProperty('VAT'))
                        price_breakdown['VAT'] = 0;
                    if(!price_breakdown.hasOwnProperty('OTT'))
                        price_breakdown['OTT'] = 0;
                    if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                        price_breakdown['TOTAL PRICE'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                        price_breakdown['NTA AGENT'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] = 0;

                    price_breakdown['FARE'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_fare;
                    price_breakdown['TAX'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_tax;
                    price_breakdown['BREAKDOWN'] = 0;
                    price_breakdown['UPSELL'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_upsell;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        price_breakdown['COMMISSION'] += (hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_commission_vendor * -1);
                    price_breakdown['NTA HOTEL'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_nta_vendor;
                    price_breakdown['SERVICE FEE'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_fee_ho;
                    price_breakdown['VAT'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_vat_ho;
                    price_breakdown['OTT'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_price_ott;
                    price_breakdown['TOTAL PRICE'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_price;
                    price_breakdown['NTA AGENT'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_nta;
                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] += hotel_room.rooms[j].nightly_prices[k].service_charge_summary[l].total_commission_ho * -1;
                }
            }
        }
        var breakdown_text = '';
        for(j in price_breakdown){
            if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                if(breakdown_text)
                    breakdown_text += '<br/>';
                breakdown_text += '<b>'+j+'</b> ';
                breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
            }else if(j == 'BREAKDOWN'){
                if(breakdown_text)
                    breakdown_text += '<br/>';
                breakdown_text += '<b>'+j+'</b> ';
            }
        }
        setTimeout(function() {
            new jBox('Tooltip', {
                attach: '#total_price',
                target: '#total_price',
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
                content: breakdown_text
            });
        }, 3000);
    }

    new jBox('Tooltip', {
        attach: '#estimated_popup',
        target: '#estimated_popup',
        theme: 'TooltipBorder',
        trigger: 'click',
        adjustTracker: true,
        closeOnClick: 'body',
        closeButton: 'box',
        animation: 'move',
        maxHeight: 300,
        position: {
          x: 'left',
          y: 'top'
        },
        outside: 'y',
        pointer: 'left:20',
        offset: {
          x: 25
        },
        content: text_estimated
    });

    new jBox('Tooltip', {
        attach: '#btn_share_popup',
        target: '#btn_share_popup',
        theme: 'TooltipBorder',
        trigger: 'click',
        adjustTracker: true,
        closeOnClick: 'body',
        closeButton: 'box',
        animation: 'move',
        maxHeight: 300,
        position: {
          x: 'left',
          y: 'top'
        },
        outside: 'y',
        pointer: 'left:20',
        offset: {
          x: 25
        },
        content: text_btn_share
    });

}

function hotel_room_pick_button(){
    text = '';

//    text += `
//    <div class="row" style="padding-top:10px;">
//        <div class="col-lg-6 col-md-6 col-sm-6">`;
//        if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//            text += `<input class="primary-btn-white" id="show_commission_button" style="width:100%; margin-bottom:10px;" type="button" onclick="show_commission_hotel();" value="Hide YPM"/>`;
//        text+=`</div>`;
//
//        if(agent_security.includes('book_reservation') == true){
//            text += `
//            <div class="col-lg-6 col-md-6 col-sm-6">
//                <button class="hold-seat-booking-train primary-btn ld-ext-right" style="width:100%; margin-bottom:10px;" type="button" onclick="goto_passenger();">
//                    Next
//                    <div class="ld ld-ring ld-cycle"></div>
//                </button>
//            </div>`;
//        }
//        text += `</div>`;

    document.getElementById('hotel_detail_button').innerHTML += text;
    document.getElementById('hotel_detail_button_loading').innerHTML = '';
    $('.hold-seat-booking-train').prop('disabled', false);
    $('.hold-seat-booking-train').removeClass("running");

    document.getElementById("badge-hotel-notif").innerHTML = "1";
    document.getElementById("badge-hotel-notif2").innerHTML = "1";
    //document.getElementById("badge-train-notif2").innerHTML = "1";

    $('#not_room_select').hide();
}

function show_commission(val){
    var sc = '';
    var scs = '';
    if(val == 'show_commission_new'){
        sc = document.getElementById("show_commission_new");
        scs = document.getElementById("show_commission_new_button");
    }else if(val == 'show_commission'){
        var sc = document.getElementById("show_commission");
        var scs = document.getElementById("show_commission_button");
    }else{
        sc = document.getElementById("show_commission_old");
        scs = document.getElementById("show_commission_old_button");
    }
    if (sc.style.display === "none"){
        sc.style.display = "inline";
        scs.innerHTML = `<span style="float:right;">hide <i class="fas fa-eye-slash"></i></span>`;
    }
    else{
        sc.style.display = "none";
        scs.innerHTML = `<span style="float:right;">show <i class="fas fa-eye"></i></span>`;
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

function goto_passenger(){
    $('.hold-seat-booking-train').prop('disabled', true);
    $('.hold-seat-booking-train').addClass("running");

    document.getElementById('hotel_detail_send').value = JSON.stringify(hotel_room);
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('goto_passenger').submit();
}

function check_passenger(adult, child, room){
    //booker
    length_name = 200;
    error_log = '';
    pax_list = [];
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
        error_log+= 'Total of Booker name maximum 200 characters!</br>\n';
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
    }if(document.getElementById('booker_phone_code_id').value==''){
        error_log+= 'Please choose phone number code for booker!</br>\n';
        $("#booker_phone_code_id").each(function() {
          $(this).siblings(".select2-container").css('border', '1px solid red');
        });
        document.getElementById('booker_phone').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
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
        pax_required = false;
//           if(i <= hotel_price.rooms.length){
//                pax_required = true;
//           }
        if(i == 1)
            pax_required = true;
        if(!pax_required){
            if(document.getElementById('adult_first_name'+i).value || document.getElementById('adult_last_name'+i).value ||
               document.getElementById('adult_title'+i).value){
                pax_required = true;
            }
        }
        if(pax_required){
            if(pax_list.includes(document.getElementById('adult_first_name'+i).value+document.getElementById('adult_last_name'+i).value) == true && document.getElementById('adult_first_name'+i).value != '')
                error_log+= 'please use different name for adult passenger '+i+'!</br>\n';
            else
                pax_list.push(document.getElementById('adult_first_name'+i).value+document.getElementById('adult_last_name'+i).value)
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
            // 22 nov 2022 HOTEL UPDATE BIRTHDATE NOT REQUIRED IVAN
            if(check_date(document.getElementById('adult_birth_date'+i).value)==false && document.getElementById('adult_birth_date'+i).value != ''){
                error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
                document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('adult_nationality'+i+'_id').value == ''  && document.getElementById('adult_first_name'+i).value != ''){
                error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
                document.getElementById('adult_nationality'+i+'_id').style['border-color'] = 'red';
            }else{
                document.getElementById('adult_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
            }

            if(document.getElementById('adult_id_type'+i).value != ''){
                $("#adult_id_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
                if(document.getElementById('adult_identity_first_name'+i).value != '')
                {
                    if(check_name(document.getElementById('adult_title'+i).value,
                        document.getElementById('adult_identity_first_name'+i).value,
                        document.getElementById('adult_identity_last_name'+i).value,
                        length_name) == false){
                        error_log+= 'Total of adult '+i+' identity name maximum '+length_name+' characters!</br>\n';
                        document.getElementById('adult_identity_first_name'+i).style['border-color'] = 'red';
                        document.getElementById('adult_identity_last_name'+i).style['border-color'] = 'red';
                    }else if(check_word(document.getElementById('adult_identity_first_name'+i).value) == false){
                        error_log+= 'Please use alpha characters identity first name of adult passenger '+i+'!</br>\n';
                        document.getElementById('adult_identity_first_name'+i).style['border-color'] = 'red';
                    }else if(document.getElementById('adult_identity_last_name'+i).value != '' && check_word(document.getElementById('adult_identity_last_name'+i).value) == false){
                        error_log+= 'Please use alpha characters identity last name of adult passenger '+i+'!</br>\n';
                        document.getElementById('adult_identity_last_name'+i).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                        document.getElementById('adult_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                    }
                }
                // IVAN 17 okt 2022 open all passenger nationality, kalau inter harus passport
                if(document.getElementById('adult_id_type'+i).value == 'ktp'){
                    document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                    $("#adult_id_type"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '0px solid red');
                    });
                    document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#cdcdcd';
                    if(check_ktp(document.getElementById('adult_passport_number'+i).value) == false){
                        error_log+= 'Please fill id number, nik must be 16 digits for passenger adult '+i+'!</br>\n';
                        document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
                    }if(document.getElementById('adult_country_of_issued'+i+'_id').value == ''){
                        error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                        $("#adult_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                    }else{
                        $("#adult_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                }
                else if(document.getElementById('adult_id_type'+i).value == 'passport'){
                    $("#adult_id_type"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '0px solid red');
                    });
                    if(document.getElementById('adult_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_passport_number'+i).value) == false){
                        error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger adult '+i+'!</br>\n';
                        document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_passport_expired_date'+i).value == ''){
                        error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
                        document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                    }if(document.getElementById('adult_country_of_issued'+i+'_id').value == ''){
                        error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                        $("#adult_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                    }else{
                        $("#adult_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                }
            }else{
                document.getElementById('adult_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                document.getElementById('adult_identity_last_name'+i).style['border-color'] = '#EFEFEF';
                document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
                document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                $("#adult_country_of_issued"+i+"_id").each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                });
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
    }
    //child
    for(i=1;i<=child;i++){
        if(document.getElementById('child_first_name'+i).value != ''){
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
            }if(document.getElementById('child_title'+i).value == ''){
                error_log+= 'Please choose title of child passenger '+i+'!</br>\n';
                $("#child_title"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                });
            }else{
                $("#child_title"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
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
            }if(document.getElementById('child_nationality'+i+'_id').value == ''){
                error_log+= 'Please fill nationality for passenger child '+i+'!</br>\n';
                document.getElementById('child_nationality'+i+'_id').style['border-color'] = 'red';
            }else{
                document.getElementById('child_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
            }

            if(document.getElementById('child_id_type'+i).value != ''){
                $("#child_id_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
                if(document.getElementById('child_identity_first_name'+i).value != '')
                {
                    if(check_name(document.getElementById('child_title'+i).value,
                        document.getElementById('child_identity_first_name'+i).value,
                        document.getElementById('child_identity_last_name'+i).value,
                        length_name) == false){
                        error_log+= 'Total of child '+i+' identity name maximum '+length_name+' characters!</br>\n';
                        document.getElementById('child_identity_first_name'+i).style['border-color'] = 'red';
                        document.getElementById('child_identity_last_name'+i).style['border-color'] = 'red';
                    }else if(check_word(document.getElementById('child_identity_first_name'+i).value) == false){
                        error_log+= 'Please use alpha characters identity first name of child passenger '+i+'!</br>\n';
                        document.getElementById('child_identity_first_name'+i).style['border-color'] = 'red';
                    }else if(document.getElementById('child_identity_last_name'+i).value != '' && check_word(document.getElementById('child_identity_last_name'+i).value) == false){
                        error_log+= 'Please use alpha characters identity last name of child passenger '+i+'!</br>\n';
                        document.getElementById('child_identity_last_name'+i).style['border-color'] = 'red';
                    }else{
                        document.getElementById('child_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                        document.getElementById('child_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                    }
                }
                // IVAN 17 okt 2022 open all passenger nationality, kalau inter harus passport
                if(document.getElementById('child_id_type'+i).value == 'ktp'){
                    document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                    $("#child_id_type"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '0px solid red');
                    });
                    document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#cdcdcd';
                    if(check_ktp(document.getElementById('child_passport_number'+i).value) == false){
                        error_log+= 'Please fill id number, nik must be 16 digits for passenger child '+i+'!</br>\n';
                        document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
                    }else{
                        document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
                    }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
                        error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
                        $("#child_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                    }else{
                        $("#child_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                }
                else if(document.getElementById('child_id_type'+i).value == 'passport'){
                    $("#child_id_type"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '0px solid red');
                    });
                    if(document.getElementById('child_id_type'+i).value == 'passport' && check_passport(document.getElementById('child_passport_number'+i).value) == false){
                        error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger adult '+i+'!</br>\n';
                        document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
                    }else{
                        document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('child_passport_expired_date'+i).value == ''){
                        error_log+= 'Please fill passport expired date for passenger child '+i+'!</br>\n';
                        document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
                    }else{
                        document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                    }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
                        error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
                        $("#child_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                    }else{
                        $("#child_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                }
            }

       }
   }
   if(error_log==''){
       document.getElementById('booker_nationality_id').disabled = false;
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
            document.getElementById('adult_nationality'+i + '_id').disabled = false;
       }
       for(i=1;i<=child;i++){
            document.getElementById('child_birth_date'+i).disabled = false;
            document.getElementById('child_nationality'+i + '_id').disabled = false;
       }
       special_request_text = '';
       for(i=1;i<=hotel_request.room;i++){
            var radios = document.getElementsByName('radio_bed_type_'+i);
            for (var j = 0, length = radios.length; j < length; j++) {
                if (radios[j].checked) {
                    if(document.getElementById('special_request_'+i).value != '')
                        special_request_text += '\n';
                    if(j == 0)
                        special_request_text += 'Bed Type: TWIN BED';
                    else
                        special_request_text += 'Bed Type: DOUBLE / KING BED';
                }
            }
            if(document.getElementById('other_request_'+i).value != ''){
                if(document.getElementById('special_request_'+i).value != '')
                    special_request_text += '\n';
                special_request_text += document.getElementById('other_request_'+i).value;
            }
            document.getElementById('special_request_'+i).value += special_request_text;
            special_request_text = '';
       }

       document.getElementById('time_limit_input').value = time_limit;
       upload_image();
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

function hotel_detail(old_cancellation_policy){
    total_price_hotel = 0;
    commission = 0;

    var get_name_hotel = document.getElementById("get_name_hotel").value;
    var get_rating_hotel = document.getElementById("rating_hotel").textContent;
    var get_address_hotel = document.getElementById("address_hotel").textContent;
    var get_date_hotel = document.getElementById("date_hotel").textContent;
    $text2 = get_name_hotel +' *'+ get_rating_hotel +'\n';
    $text2 += 'Address: '+ get_address_hotel +'\n';
    $text2 += get_date_hotel +'\n\n';

    if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){
        tax = 0;
        fare = 0;
        total_price = 0;
        total_price_provider = [];
        price_provider = 0;
        commission = 0;
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
        type_amount_repricing = ['Repricing'];
        for(i in adult){
            if(price_arr_repricing.hasOwnProperty('Reservation') == false){
                price_arr_repricing['Reservation'] = {}
                pax_type_repricing.push(['Reservation', 'Reservation']);
            }
            price_arr_repricing['Reservation']['Reservation'] = {
                'Fare': 0,
                'Tax': 0,
                'Repricing': 0
            }
            break;
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

        price_discount = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
        for(i in hotel_price.rooms){
            for(j in hotel_price.rooms[i].nightly_prices){
                for(k in hotel_price.rooms[i].nightly_prices[j].service_charges){
                    price_discount[hotel_price.rooms[i].nightly_prices[j].service_charges[k].charge_type] += hotel_price.rooms[i].nightly_prices[j].service_charges[k].total;

                }

            }

        }
        total_price_provider.push({
            'provider': hotel_price.provider,
            'price': price_discount
        });
    }

    //console.log(old_cancellation_policy);
    old_cancellation_text = ``;
    for(i in old_cancellation_policy){
        //if (old_cancellation_policy[i].received_amount != 0){
            //old_cancellation_text += '<li style="list-style: unset;">Cancellation Before: ' + old_cancellation_policy[i].date + ' will be Refunded: ' + old_cancellation_policy[i].received_amount + '</li>';
            //$text2 += 'Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '\n';
        //} else {
            //old_cancellation_text += '<li style="list-style: unset;">No Cancellation after: ' + old_cancellation_policy[i].date + '</li>';
            //$text2 += 'No Cancellation after: ' + result.policies[i].date + '\n';
        //}
        old_cancellation_text += '<li style="list-style: unset;">' + old_cancellation_policy[i].cancellation_string + '</li>';
    }
    if (old_cancellation_text == ''){
        old_cancellation_text += '<li style="list-style: unset;">Not Refundable</li>';
        //old_cancellation_text += '<li style="list-style: unset;">No Cancellation Policy Provided</li>';
        //$text2 += 'No Cancellation Policy Provided \n';
    }

    new_cancellation_text = ``;
    // Vin 2021/03/08 Notes: new_cancellation_policy blum dipassing di sini
    //for(i in new_cancellation_policy){
        //new_cancellation_text += '<li style="list-style: unset;">' + new_cancellation_policy[i].cancellation_string + '</li>';
    //}
    if (new_cancellation_text == ''){
        new_cancellation_text = old_cancellation_text;
    }
    text = `
    <div class="row" style="margin-bottom:5px;">
        <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
           <h4 class="mb-3">Price Detail</h4>
        </div>
    </div>`;

    var idx = 0;
    var idx_img_room = 0;
    var room_dict = []; //description
    show_name_room = '';
    title_name_room = '';
    document.getElementById("div_name_room").innerHTML = '';

    for(i in hotel_price.rooms){
        room_dict.push(hotel_price.rooms[i].description);
        document.getElementById("div_name_room").innerHTML += `<input type="hidden" id="name_room_htl`+i+`" name="name_room_htl`+i+`"/>`;
    }

    room_dict.sort();

    var current_room = null;
    var cnt_room = 0;

    for (var ro = 0; ro < room_dict.length; ro++) {
        if (room_dict[ro] != current_room) {
            if (cnt_room > 0) {
                show_name_room += `<span style="color:`+color+`;">`+cnt_room+`x </span>`+ current_room+` + `;
                title_name_room += cnt_room+'x '+ current_room+' + ';
            }
            current_room = room_dict[ro];
            cnt_room = 1;
        } else {
            cnt_room++;
        }
    }
    if (cnt_room > 0) {
        show_name_room += `<span style="color:`+color+`;">`+cnt_room+`x </span>`+ current_room;
        title_name_room += cnt_room+'x '+ current_room;
    }

    text+=`<h5>`+show_name_room+`</h5>`;

    text += `<div class="mt-3">
        <center><h6 style="color:`+color+`; display:none; cursor:pointer;" id="price_detail_hotel_down" onclick="show_hide_div_hotel('price_detail_hotel');">See Detail <i class="fas fa-chevron-down" style="font-size:14px;"></i></h6></center>
    </div>`;
    text += `<div id="price_detail_hotel_div" style="display:block;">`;
    total_room_night = 0;
    for(i in hotel_price.rooms){
        total_room_night += hotel_price.rooms[i].nightly_prices.length;
    }
    discount_hotel = 0;
    for(i in hotel_price.rooms){
        var idx_room = parseInt(i)+1;
        text += `
        <div style="border:1px solid #cdcdcd; border-radius:5px; padding:15px; margin-bottom:15px;">
            <div style="display:flex;">
                <div style="display:inline-block; padding-right:5px;">
                    <i class="fas fa-bed" style="font-size:14px"></i>
                </div>
                <div style="display:inline-block;" title='`+hotel_price.rooms[i].description+`'>
                    <div style="display:grid;">
                        <h5>Room #`+idx_room+`</h5>
                    </div>
                    <div style="display:grid;">
                        <span style="font-size:16px;">`+hotel_price.rooms[i].description+`</span>
                    </div>
                </div>
            </div>
            <hr/>`;

            //text += '<span>Qty: '+ hotel_price.rooms[i].qty + '</span><br/>';
            //text += '<span> '+ hotel_price.rooms[i].category + '<span><br/>';
            text += '<i class="fas fa-utensils"></i> <b>Meal Type:</b><span> ' + hotel_price.meal_type + '</span/><br/>';

            //$text2 += 'Room Category: '+ hotel_price.rooms[i].category +'\n';
            $text2 += 'Room #' + (parseInt(i)+1) + ' ' + hotel_price.rooms[i].description +'\n';
            //$text2 += hotel_price.rooms[i].qty +' room(s) \n';
    //        $text2 += 'Meal Type: '+ hotel_price.meal_type +'\n \n';
            $text2 += 'Meal Type: '+ hotel_price.meal_type + '\n';
            if(hotel_price.rooms[i].hasOwnProperty('room_size')){
                text+= '<span class="meal_room"><b>Room Size:</b> <span>' + hotel_price.rooms[i].room_size.size+' '+hotel_price.rooms[i].room_size.unit+'</span></span><br/>';
                $text2 += 'Room Size: ' + hotel_price.rooms[i].room_size.size+' '+hotel_price.rooms[i].room_size.unit + '\n';
            }
            text += `<div class="row">`;
            for(j in hotel_price.rooms[i].nightly_prices){
                date = new Date(hotel_price.rooms[i].nightly_prices[j].date).toString().split(' ');
                if (typeof upsell_price !== 'undefined'){
                    last_day_price = hotel_price.rooms[i].nightly_prices[j].price + Math.ceil(upsell_price / total_room_night);
                    if(hotel_price.rooms[i].nightly_prices[j].currency != 'IDR'){
                        text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + parseInt((last_day_price))+'<span/></div>';
                        //$text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_price.rooms[i].nightly_prices[j].price))+'\n';
                    }else{
                        text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(last_day_price)+'<span/></div>';
                        //$text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(parseInt(hotel_price.rooms[i].nightly_prices[j].price))+'\n';
                    }
                }else{
                    if(hotel_price.rooms[i].nightly_prices[j].currency != 'IDR'){
                        text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_price.rooms[i].nightly_prices[j].price))+'<span/></div>';
                        //$text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_price.rooms[i].nightly_prices[j].price))+'\n';
                    }else{
                        text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(hotel_price.rooms[i].nightly_prices[j].price)+'<span/></div>';
                        //$text2 += 'Date: '+date[2] +' '+ date[1] + ' ' + date[3] + ' - ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(parseInt(hotel_price.rooms[i].nightly_prices[j].price))+'\n';
                    }
                }
                for(k in hotel_price.rooms[i].nightly_prices[j].service_charges){
                    if(hotel_price.rooms[i].nightly_prices[j].service_charges[k].charge_type == 'DISC'){
                        discount_hotel += hotel_price.rooms[i].nightly_prices[j].service_charges[k].total;
                    }
                }
            }
            try{
                grand_total_price = parseFloat(hotel_price.rooms[i].price_total);
                total_price_hotel += grand_total_price;
                commission += parseInt(hotel_price.rooms[i].commission) *-1;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }

            text += `<div class="col-lg-6">
                <span style="font-weight:bold;">Total</span>
            </div>`;
            if(typeof upsell_price !== 'undefined' && upsell_price != 0)
                text+=`
            <div class="col-lg-6" style="text-align:right;">
                <span style="font-weight:bold;">`+hotel_price.currency+` `+ getrupiah(hotel_price.rooms[i].price_total + upsell_price ) +`</span>
            </div>`;
            else
                text+=`
            <div class="col-lg-6" style="text-align:right;">
                <span style="font-weight:bold;">`+hotel_price.currency+` `+ getrupiah(hotel_price.rooms[i].price_total ) +`</span>
            </div>`;

            if(typeof upsell_price !== 'undefined' && upsell_price != 0)
                $text2 += 'Total: '+hotel_price.currency+' ' + getrupiah(hotel_price.rooms[i].price_total + upsell_price ) + '\n\n';
            else
                $text2 += 'Total: '+hotel_price.currency+' ' + getrupiah(hotel_price.rooms[i].price_total + discount_hotel) + '\n\n';
            text += `
            </div>
        </div>`;
    }

    if(typeof(special_request) !== 'undefined'){
        $text2 += 'Special Request:\n' + special_request;
        $text2 += '(This request is subject to AVAILIBILITY and may not be guaranteed)\n';
    }
    if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){

        $text2 += '\nContact Person:\n';
        $text2 += contact[0].title + ' ' + contact[0].first_name + ' ' + contact[0].last_name + '\n';
        $text2 += contact[0].email + '\n';
        $text2 += contact[0].calling_code + ' - ' +contact[0].mobile + '\n';

    }

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
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    text += `</div>`;

    text += `<div>
        <center><h6 style="color:`+color+`; display:block; cursor:pointer;" id="price_detail_hotel_up" onclick="show_hide_div_hotel('price_detail_hotel');">Close Detail <i class="fas fa-chevron-up" style="font-size:14px;"></i></h6></center>
    </div>`;

    text += `<div class="row">
        <div class="col-lg-12"><hr/></div>`;
        if (typeof upsell_price !== 'undefined'){
            if(upsell_price != 0){
                //di gabung ke room terakhir
//                text+=`<div class="col-lg-7" style="text-align:left;">
//                    <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
//                </div>
//                <div class="col-lg-5" style="text-align:right;">`;
//                text+=`
//                    <span style="font-size:13px; font-weight:500;">IDR `+getrupiah(upsell_price)+`</span><br/>`;
//                text+=`</div>`;
                total_price_hotel += upsell_price;
                commission += upsell_price;
            }
        }

    if(discount_hotel != 0){
        text += `
            <div class="col-lg-6">
                <span style="font-weight:bold;font-size:15px;color:#e04022;">Discount</span>
            </div>
            <div class="col-lg-6" style="text-align:right;">
                <span style="font-weight:bold;font-size:15px;color:#e04022;">`+hotel_price.currency+` `+ getrupiah(discount_hotel) +`</span>
            </div>`;
    }
    try{
        text += `<div class="col-lg-6">
                <span style="font-weight:bold;font-size:15px;">Grand Total</span>
            </div>
            <div class="col-lg-6" style="text-align:right;">
                <span style="font-weight:bold;font-size:15px;`;
            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+='cursor:pointer;';
            text+=`" id="total_price">`+hotel_price.currency+` `+ getrupiah(total_price_hotel + discount_hotel);
            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                text+=`<i class="fas fa-caret-down"></i>`;
            text+=`</span>
                </div>
            </div>`;
        $text2 += 'Grand Total: '+hotel_price.currency+' ' + getrupiah(total_price_hotel) + '\n';
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }

    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price_hotel){
        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                try{
                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == hotel_price.currency){
                        price_convert = (Math.ceil(total_price_hotel)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                        if(price_convert%1 == 0)
                            price_convert = parseInt(price_convert);
                        text+=`
                        <div class="row">
                            <div class="col-lg-12" style="text-align:right;">
                                <span style="font-weight:bold;font-size:15px;">Estimated `+k+` `+getrupiah(price_convert)+`</span>
                            </div>
                        </div>`;
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
    }

    if(document.URL.split('/')[document.URL.split('/').length-2] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
        text+=`<div class="row"><div class="col-lg-12"><div style="text-align:right;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div></div></div>`;
    }

    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
        text+=`<br/>`;
        text+= print_commission(commission,'show_commission', hotel_price.currency)
    }

    text += `
    <div class="row">
        <div class="col-lg-12" style="padding-bottom:15px;">
            <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
            share_data2();
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                text+=`
                    <a href="https://wa.me/?text=`+ $text_share2 +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                    <a href="line://msg/text/`+ $text_share2 +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share2 +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                    <a href="mailto:?subject=This is the hotel price detail&amp;body=`+ $text_share2 +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
            } else {
                text+=`
                    <a href="https://web.whatsapp.com/send?text=`+ $text_share2 +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share2 +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share2 +`&url=Share2" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                    <a href="mailto:?subject=This is the hotel price detail&amp;body=`+ $text_share2 +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
            }
            text +=`
            <div style="float:right">
                <button class="btn_standard_sm" type="button" onclick="copy_data2();">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
        </div>
    </div>
    <div class="row">`;
//    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//        text += `<div class="col-lg-12">
//            <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission_hotel();" value="Show YPM"/>
//        </div>`;
    text += `
    </div>`;


    text += `</div>`;
    //console.log(text);
    if(document.getElementById('old_cancellation_policy'))
        document.getElementById('old_cancellation_policy').innerHTML = old_cancellation_text;
    if(document.getElementById('new_cancellation_policy'))
        document.getElementById('new_cancellation_policy').innerHTML = new_cancellation_text;
    try{
        document.getElementById('hotel_detail').innerHTML = text;
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
        var price_breakdown = {};
        var currency_breakdown = '';
        for(j in hotel_price.rooms){
            for(k in hotel_price.rooms[j].nightly_prices){
                if(currency_breakdown == ''){
                    for(l in hotel_price.rooms[j].nightly_prices[k].service_charges){
                        currency_breakdown = hotel_price.rooms[j].nightly_prices[k].service_charges[l].currency;
                        break;
                    }
                }

                for(l in hotel_price.rooms[j].nightly_prices[k].service_charge_summary){
                    if(!price_breakdown.hasOwnProperty('FARE'))
                        price_breakdown['FARE'] = 0;
                    if(!price_breakdown.hasOwnProperty('TAX'))
                        price_breakdown['TAX'] = 0;
                    if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                        price_breakdown['BREAKDOWN'] = 0;
                    if(!price_breakdown.hasOwnProperty('UPSELL'))
                        price_breakdown['UPSELL'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION'))
                        price_breakdown['COMMISSION'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA HOTEL'))
                        price_breakdown['NTA HOTEL'] = 0;
                    if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                        price_breakdown['SERVICE FEE'] = 0;
                    if(!price_breakdown.hasOwnProperty('VAT'))
                        price_breakdown['VAT'] = 0;
                    if(!price_breakdown.hasOwnProperty('OTT'))
                        price_breakdown['OTT'] = 0;
                    if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                        price_breakdown['TOTAL PRICE'] = 0;
                    if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                        price_breakdown['NTA AGENT'] = 0;
                    if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] = 0;

                    price_breakdown['FARE'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_fare;
                    price_breakdown['TAX'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_tax;
                    price_breakdown['BREAKDOWN'] = 0;
                    price_breakdown['UPSELL'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_upsell;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        price_breakdown['COMMISSION'] += (hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_commission_vendor * -1);
                    price_breakdown['NTA HOTEL'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_nta_vendor;
                    price_breakdown['SERVICE FEE'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_fee_ho;
                    price_breakdown['VAT'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_vat_ho;
                    price_breakdown['OTT'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_price_ott;
                    price_breakdown['TOTAL PRICE'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_price;
                    price_breakdown['NTA AGENT'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_nta;
                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] += hotel_price.rooms[j].nightly_prices[k].service_charge_summary[l].total_commission_ho * -1;
                }
            }
        }
        if(typeof upsell_price !== 'undefined'){
            if(upsell_price != 0){
                if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                    price_breakdown['CHANNEL UPSELL'] = 0;
                price_breakdown['CHANNEL UPSELL'] += upsell_price;
            }
        }
        var breakdown_text = '';
        for(j in price_breakdown){
            if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                if(breakdown_text)
                    breakdown_text += '<br/>';
                breakdown_text += '<b>'+j+'</b> ';
                breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
            }else if(j == 'BREAKDOWN'){
                if(breakdown_text)
                    breakdown_text += '<br/>';
                breakdown_text += '<b>'+j+'</b> ';
            }
        }
        new jBox('Tooltip', {
            attach: '#total_price',
            target: '#total_price',
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
            content: breakdown_text
        });
    }
}

// DEPRECATED
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

function checkboxCopy(){
    var count_copy = $(".copy_result:checked").length;
//    if(count_copy == 0){
//        $('#button_copy_hotel').hide();
//    }
//    else{
//        $('#button_copy_hotel').show();
//    }

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
    text+=`<div class="col-lg-12">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_hotel = $(this).parent().parent().parent().parent();
        var name_hotel = parent_hotel.find('.name_hotel').html();
        var rating_hotel = parent_hotel.find('.rating_hotel').html();
        var location_hotel = parent_hotel.find('.location_hotel').html();
        var price_hotel = parent_hotel.find('.price_hotel').html();
        var id_hotel = parent_hotel.find('.id_copy_result').html();
        var room_night = parent_hotel.find('.carrier_code_template').html();
        hotel_number = hotel_number + 1;
        $text += ''+hotel_number+'. '+name_hotel+ ' ' +rating_hotel+'\n';
        if(location_hotel != ' (undefined)' && location_hotel != '')
            $text += 'Location: '+location_hotel+'\n';
        else
            $text += 'Location: -\n';
        $text += 'Price start from: '+price_hotel+'\n \n';

            if(hotel_number == 1){
                text+=`<div class="row pb-3" id="div_list`+id_hotel+`" style="padding-top:15px; border-bottom:1px solid #cdcdcd; border-top:1px solid #cdcdcd; margin-bottom:15px; background:white;"">`;
            }else{
                text+=`<div class="row pt-3 pb-3" id="div_list`+id_hotel+`" style="padding-top:15px; border-bottom:1px solid #cdcdcd; border-top:1px solid #cdcdcd; margin-bottom:15px; background:white;">`;
            }
            text+=`
                <div class="col-lg-9">
                    <h6 class="single_border_custom_left" style="padding-left:5px;"> OPTION-`+hotel_number+`</h6>
                </div>
                <div class="col-lg-3" style="text-align:right;">
                    <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result(`+id_hotel+`);">Delete <i class="fas fa-times-circle" style="color:red; font-size:18px;"></i></span>
                </div>
                <div class="col-lg-12">
                    <hr/>
                </div>
                <div class="col-lg-12 mb-3">
                    <h5>`+name_hotel+` <b style="color:`+color+`;">`+rating_hotel+`</b></h5>`;

                    if(location_hotel != ' (undefined)'){
                        text+=`
                        <b>Location:</b> <i>`+location_hotel+`</i><br/>`;
                    }
                    text+=`
                    <div class="col-lg-12" style="text-align:right;">
                        <h6>Best Price: <b style="color:`+color+`;">`+price_hotel+`<br/>`+room_night+`</b></h6>
                    </div>
                </div>`;

                text+=`</div>`;
        });
    $text += '\n===Price may change at any time===';
    text+=`</div>`;
    text_footer =`
    <div class="col-lg-12" id="share_result">
        <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
        share_data();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text_footer+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>`;
            if(hotel_number < 11){
                text_footer+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>`;
            }
            else{
                text_footer+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line-gray.png" alt="Line Disable"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram-gray.png" alt="Telegram Disable"/></a>`;
            }
            text_footer+=`
                <a href="mailto:?subject=This is the hotel price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
        } else {
            text_footer+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>`;
            if(hotel_number < 11){
                text_footer+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>`;
            }
            else{
                text_footer+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram-gray.png"/></a>`;
            }
            text_footer+=`
                <a href="mailto:?subject=This is the hotel price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
        }
        if(hotel_number > 10){
            text_footer+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Hotel</span>`;
        }
    text_footer+=`
        <div style="float:right;" id="copy_result">
            <button class="primary-btn-white" style="width:150px;" type="button" onclick="copy_data();">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    </div>`;

    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-hotel").appendChild(node);

    document.getElementById("footer_list_copy").innerHTML = text_footer;

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
    }catch(err){console.log(err)}
//    console.log('lalala');

    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    //di get booking hotel ga jalan
//    document.getElementById('data_copy').innerHTML = $text;
//    document.getElementById('data_copy').hidden = false;
//    var el = document.getElementById('data_copy');
//    el.select();
//    document.execCommand('copy');
//    document.getElementById('data_copy').hidden = true;

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
    $text_print = $text2+'\n===Price may change at any time===';
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
//    const el = document.createElement('textarea');
//    el.value = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function share_data2(){
//    const el = document.createElement('textarea');
//    el.value = $text2;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
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
   hotel_pagination_number = 1;
   if($check_ps == 0 && filter == 2){
       if($check_load != 0){
           filtering('filter');
       }
       else{
           $check_load = 1;
       }
       $check_ps = 1;
   }else{
       if($check_load != 0){
           filtering('filter');
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
       hotel_pagination_number = 1;
       filtering('filter');
   }
}

function go_to_owl_carousel_bottom(counter, co_i){
    text_img = '';
    var idx_img_bot = 1;
    text_img +=`
    <div class="owl-carousel-hotel-img-modal owl-theme" style="text-align:center;">`;
    if(temp_response.hotel_ids[co_i].images.length != 0){
        for(idx_img_bot; idx_img_bot < temp_response.hotel_ids[co_i].images.length; idx_img_bot++){
            if(idx_img_bot < 5){
                text_img +=`
                <div class="item" style="cursor:zoom-in; float:none; display:inline-block;">
                    <img class="img-fluid zoom-img owl-lazy" alt="Hotel" data-src="`+temp_response.hotel_ids[co_i].images[idx_img_bot].url+`" style="margin: auto; max-height:500px;">
                </div>`;
            }
            else{
                break;
            }
        }
    }
    else{
        text_img+=`<img src="/static/tt_website/images/no_found/no-image-hotel2.jpg" alt="Not Found Hotel" width="60" height="60" style="margin-right:10px; border-radius:4px; border:1px solid #cdcdcd;">`;
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
        lazyLoadEager:true,
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
    hotel_pagination_number = numb;
    if(temp_response.hotel_ids.length != 0){
        for(i in temp_response.hotel_ids){
           if(i >= min_img && i<= max_img){

                var node = document.createElement("div");
                node.id = 'hotel'+i+'_div';
                node.text = render_hotel_search(temp_response.hotel_ids[i], i)
                //tambah button ke detail
                node.className = 'sorting-box-b search-box-result';
                node.innerHTML = text;
                if(document.getElementById(node.id) == null)
                    document.getElementById("hotel_ticket").appendChild(node);
                else
                    document.getElementById(node.id).innerHTML = node.innerHTML;
                document.getElementById(node.id).style.display = 'block';
                render_show_more_price_hotel_search(temp_response.hotel_ids[i], i)
            }else{
                document.getElementById('hotel'+i+'_div').style.display = 'none';
            }
        }
    }
}

function change_image_hotel_detail(numb){
    var min_img = parseInt((numb*8)-8);
    var max_img = parseInt((numb*8)-1);
    hotel_pagination_number = numb;
    var counter_hotel = 0
    var is_start_add = false;
    if(hotel_price.length != 0){
        for(i in hotel_price){
           if(i >= min_img)
               is_start_add = true;
           if(hotel_price[i].show){
               if(is_start_add && hotel_price[i].show && counter_hotel < max_img){
                    var node = document.createElement("div");
                    node.id = 'hotel'+i+'_div';
                    node.text = render_hotel_search_detail(hotel_price[i], i)
                    //tambah button ke detail
                    node.className = 'sorting-box-b';
                    node.innerHTML = text;
                    if(document.getElementById(node.id) == null)
                        document.getElementById("hotel_ticket").appendChild(node);
                    else
                        document.getElementById(node.id).innerHTML = node.innerHTML;
                    document.getElementById(node.id).style.display = 'block';

                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        var price_breakdown = {};
                        var currency_breakdown = '';
                        for(i in hotel_price){
                            for(j in hotel_price[i].rooms){
                                for(k in hotel_price[i].rooms[j].nightly_prices){
                                    if(currency_breakdown == ''){
                                        for(l in hotel_price[i].rooms[j].nightly_prices[k].service_charges){
                                            currency_breakdown = hotel_price[i].rooms[j].nightly_prices[k].service_charges[l].currency;
                                        }
                                    }
                                    for(l in hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary){
                                        if(!price_breakdown.hasOwnProperty('FARE'))
                                            price_breakdown['FARE'] = 0;
                                        if(!price_breakdown.hasOwnProperty('TAX'))
                                            price_breakdown['TAX'] = 0;
                                        if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                                            price_breakdown['BREAKDOWN'] = 0;
                                        if(!price_breakdown.hasOwnProperty('UPSELL'))
                                            price_breakdown['UPSELL'] = 0;
                                        if(!price_breakdown.hasOwnProperty('COMMISSION'))
                                            price_breakdown['COMMISSION'] = 0;
                                        if(!price_breakdown.hasOwnProperty('NTA HOTEL'))
                                            price_breakdown['NTA HOTEL'] = 0;
                                        if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                                            price_breakdown['SERVICE FEE'] = 0;
                                        if(!price_breakdown.hasOwnProperty('VAT'))
                                            price_breakdown['VAT'] = 0;
                                        if(!price_breakdown.hasOwnProperty('OTT'))
                                            price_breakdown['OTT'] = 0;
                                        if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                                            price_breakdown['TOTAL PRICE'] = 0;
                                        if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                                            price_breakdown['NTA AGENT'] = 0;
                                        if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                                            price_breakdown['COMMISSION HO'] = 0;

                                        price_breakdown['FARE'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_fare;
                                        price_breakdown['TAX'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_tax;
                                        price_breakdown['BREAKDOWN'] = 0;
                                        price_breakdown['UPSELL'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_upsell;
                                        if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                                            price_breakdown['COMMISSION'] += (hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_commission_vendor * -1);
                                        price_breakdown['NTA HOTEL'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_nta_vendor;
                                        price_breakdown['SERVICE FEE'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_fee_ho;
                                        price_breakdown['VAT'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_vat_ho;
                                        price_breakdown['OTT'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_price_ott;
                                        price_breakdown['TOTAL PRICE'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_price;
                                        price_breakdown['NTA AGENT'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_nta;
                                        if(user_login.co_agent_frontend_security.includes('agent_ho'))
                                            price_breakdown['COMMISSION HO'] += hotel_price[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_commission_ho * -1;
                                    }
                                }
                            }
                            var breakdown_text = '';
                            for(j in price_breakdown){
                                if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                                    if(breakdown_text)
                                        breakdown_text += '<br/>';
                                    breakdown_text += '<b>'+j+'</b> ';
                                    breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
                                }else if(j == 'BREAKDOWN'){
                                    if(breakdown_text)
                                        breakdown_text += '<br/>';
                                    breakdown_text += '<b>'+j+'</b> ';
                                }
                            }
                            new jBox('Tooltip', {
                                attach: '#hotel_room_span_'+i,
                                target: '#hotel_room_span_'+i,
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
                                content: breakdown_text
                            });
                        }
                    }
                    counter_hotel++;
               }else{
                    document.getElementById('hotel'+i+'_div').style.display = 'none';
               }
           }
        }
    }
    $('.owl-carousel-room-img').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        lazyLoadEager:true,
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
    setTimeout(() => {
        price_slider_true(1, 1);
    }, 1000);

    for(i in rating_list){
        rating_list[i].status = false;
        document.getElementById("rating_filter"+i).checked = rating_list[i].status;
        document.getElementById("rating_filter2"+i).checked = rating_list[i].status;
    }
    filtering('filter');
}

function show_hide_div_hotel(key){
    var show_div = document.getElementById(key+'_div');
    var btn_down = document.getElementById(key+'_down');
    var btn_up = document.getElementById(key+'_up');

    if (btn_down.style.display === "none") {
        btn_up.style.display = "none";
        btn_down.style.display = "inline-block";
        show_div.style.display = "none";
    }
    else {
        btn_up.style.display = "inline-block";
        btn_down.style.display = "none";
        show_div.style.display = "block";
    }
}

filter_room_list = {
    "meal_type": [],
    "provider": [],
    "room_type": []
}

is_first_render_room_hotel = true;

function filter_room_hotel(type, value){
    if(type == ''){
        filter_room_list = {
            "meal_type": [],
            "provider": [],
            "room_type": []
        }
    }else if(type == 'meal'){
        //meal
        if(filter_room_list['meal_type'].includes(value)){
            for(i in filter_room_list['meal_type']){
                if(filter_room_list['meal_type'][i] == value){
                    filter_room_list['meal_type'].splice(i,1);
                    break;
                }
            }

        }else
            filter_room_list['meal_type'].push(value);
    }else if(type == 'room'){
        //room
        if(value == 'single'){
            if(filter_room_list['room_type'].includes('single')){
                for(i in filter_room_list['room_type']){
                    if(filter_room_list['room_type'][i] == 'single'){
                        filter_room_list['room_type'].splice(i,1);
                        break;
                    }
                }

            }else
                filter_room_list['room_type'].push('single');
        }else if(value == 'twin'){
            if(filter_room_list['room_type'].includes('twin'))
                for(i in filter_room_list['room_type']){
                    if(filter_room_list['room_type'][i] == 'twin'){
                        filter_room_list['room_type'].splice(i,1);
                        break;
                    }
                }
            else
                filter_room_list['room_type'].push('twin');
        }else if(value == 'double'){
            if(filter_room_list['room_type'].includes('double'))
                for(i in filter_room_list['room_type']){
                    if(filter_room_list['room_type'][i] == 'double'){
                        filter_room_list['room_type'].splice(i,1);
                        break;
                    }
                }
            else
                filter_room_list['room_type'].push('double');
        }else if(value == 'queen'){
            if(filter_room_list['room_type'].includes('queen'))
                for(i in filter_room_list['room_type']){
                    if(filter_room_list['room_type'][i] == 'queen'){
                        filter_room_list['room_type'].splice(i,1);
                        break;
                    }
                }
            else
                filter_room_list['room_type'].push('queen');
        }else if(value == 'king'){
            if(filter_room_list['room_type'].includes('king'))
                for(i in filter_room_list['room_type']){
                    if(filter_room_list['room_type'][i] == 'king'){
                        filter_room_list['room_type'].splice(i,1);
                        break;
                    }
                }
            else
                filter_room_list['room_type'].push('king');
        }
    }else{
        //provider
        if(filter_room_list['provider'].includes(value))
            for(i in filter_room_list['provider']){
                if(filter_room_list['provider'][i] == value){
                    filter_room_list['provider'].splice(i,1);
                    break;
                }
            }
        else
            filter_room_list['provider'].push(value)
    }
    if(filter_room_list['meal_type'].length == 0 && filter_room_list['provider'].length == 0 && filter_room_list['room_type'].length == 0){
        for(i in hotel_price){
            hotel_price[i].show = true;
        }

        //all
        //document.getElementById('checkbox_room_all').checked = true;
        //meal type
        document.getElementById('checkbox_room_only').checked = false;
        document.getElementById('checkbox_breakfast').checked = false;
        //room type
        document.getElementById('checkbox_single').checked = false;
        document.getElementById('checkbox_twin').checked = false;
        document.getElementById('checkbox_double').checked = false;
        document.getElementById('checkbox_queen').checked = false;
        document.getElementById('checkbox_king').checked = false;

        //all
        //document.getElementById('checkbox_room_all').checked = true;
        //meal type
        document.getElementById('checkbox_room_only2').checked = false;
        document.getElementById('checkbox_breakfast2').checked = false;
        //room type
        document.getElementById('checkbox_single2').checked = false;
        document.getElementById('checkbox_twin2').checked = false;
        document.getElementById('checkbox_double2').checked = false;
        document.getElementById('checkbox_queen2').checked = false;
        document.getElementById('checkbox_king2').checked = false;
        for(i in provider_list){
            if(document.getElementById('checkbox_provider'+i)){
                document.getElementById('checkbox_provider'+i).checked = false;
            }
            if(document.getElementById('checkbox_provider2'+i)){
                document.getElementById('checkbox_provider2'+i).checked = false;
            }
        }
    }else{
        //document.getElementById('checkbox_room_all').checked = false;
        //data awal show
        for(i in hotel_price){
            hotel_price[i].show = true;
        }
        //filter meal
        if(filter_room_list['meal_type'].length != 0){
            for(i in hotel_price){
                if(filter_room_list['meal_type'].includes(hotel_price[i].is_with_meal) == false)
                    hotel_price[i].show = false;
            }
        }

        if(filter_room_list['room_type'].length != 0){
            for(i in hotel_price){
                is_hide_room = true;
                for(j in hotel_price[i].rooms){
                    for(k in filter_room_list['room_type']){
                        if(hotel_price[i].rooms[j].description.toLowerCase().includes(filter_room_list['room_type'][k])){
                            is_hide_room = false;
                            break;
                        }
                    }
                    break;
                }
                if(is_hide_room)
                    hotel_price[i].show = false;
            }
        }

        //filter provider
        if(filter_room_list['provider'].length != 0){
            for(i in hotel_price){
                if(filter_room_list['provider'].includes(hotel_price[i].provider) == false)
                    hotel_price[i].show = false;
            }
        }

    }
    if(value != '' && type != '')
        hotel_pagination_number = 1;
    render_room_hotel(hotel_price);
}

function render_room_hotel(data_room_hotel_list){
    var node = document.createElement("div");
    var hotel_print = 0;
    document.getElementById('detail_room_pick').innerHTML = '';
    var min_hotel = parseInt((hotel_pagination_number*8)-8);
    var max_hotel = parseInt((hotel_pagination_number*8)-1);
    $pagination_type = "hotel_detail";
    var counter_hotel = 0;
    for(i in data_room_hotel_list){
        if(data_room_hotel_list[i].show){
            text = '';
            if(data_room_hotel_list[i].show && counter_hotel < 8){
                text += render_hotel_search_detail(data_room_hotel_list[i], i)
            }
            counter_hotel++;
            node.id = 'hotel'+i+'_div';
            node.className = 'div_box_default detail-hotel-box mb-3';
            node.innerHTML = text;
            document.getElementById("detail_room_pick").appendChild(node);

            if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                var price_breakdown = {};
                var currency_breakdown = '';
                for(i in data_room_hotel_list){
                    price_breakdown = {};
                    for(j in data_room_hotel_list[i].rooms){
                        for(k in data_room_hotel_list[i].rooms[j].nightly_prices){
                            if(currency_breakdown == ''){
                                for(l in data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charges){
                                    currency_breakdown = data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charges[l].currency;
                                    break;
                                }
                            }
                            for(l in data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary){
                                if(!price_breakdown.hasOwnProperty('FARE'))
                                    price_breakdown['FARE'] = 0;
                                if(!price_breakdown.hasOwnProperty('TAX'))
                                    price_breakdown['TAX'] = 0;
                                if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                                    price_breakdown['BREAKDOWN'] = 0;
                                if(!price_breakdown.hasOwnProperty('UPSELL'))
                                    price_breakdown['UPSELL'] = 0;
                                if(!price_breakdown.hasOwnProperty('COMMISSION'))
                                    price_breakdown['COMMISSION'] = 0;
                                if(!price_breakdown.hasOwnProperty('NTA HOTEL'))
                                    price_breakdown['NTA HOTEL'] = 0;
                                if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                                    price_breakdown['SERVICE FEE'] = 0;
                                if(!price_breakdown.hasOwnProperty('VAT'))
                                    price_breakdown['VAT'] = 0;
                                if(!price_breakdown.hasOwnProperty('OTT'))
                                    price_breakdown['OTT'] = 0;
                                if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                                    price_breakdown['TOTAL PRICE'] = 0;
                                if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                                    price_breakdown['NTA AGENT'] = 0;
                                if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                                    price_breakdown['COMMISSION HO'] = 0;

                                price_breakdown['FARE'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_fare;
                                price_breakdown['TAX'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_tax;
                                price_breakdown['BREAKDOWN'] = 0;
                                price_breakdown['UPSELL'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_upsell;
                                if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                                    price_breakdown['COMMISSION'] += (data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_commission_vendor * -1);
                                price_breakdown['NTA HOTEL'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_nta_vendor;
                                price_breakdown['SERVICE FEE'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_fee_ho;
                                price_breakdown['VAT'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_vat_ho;
                                price_breakdown['OTT'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_price_ott;
                                price_breakdown['TOTAL PRICE'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_price;
                                price_breakdown['NTA AGENT'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_nta;
                                if(user_login.co_agent_frontend_security.includes('agent_ho'))
                                    price_breakdown['COMMISSION HO'] += data_room_hotel_list[i].rooms[j].nightly_prices[k].service_charge_summary[l].total_commission_ho * -1;
                            }
                        }
                    }
                    var breakdown_text = '';
                    for(j in price_breakdown){
                        if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                            if(breakdown_text)
                                breakdown_text += '<br/>';
                            breakdown_text += '<b>'+j+'</b> ';
                            breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
                        }else if(j == 'BREAKDOWN'){
                            if(breakdown_text)
                                breakdown_text += '<br/>';
                            breakdown_text += '<b>'+j+'</b> ';
                        }
                    }
                    new jBox('Tooltip', {
                        attach: '#hotel_room_span_'+i,
                        target: '#hotel_room_span_'+i,
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
                        content: breakdown_text
                    });
                }
            }

            node = document.createElement("div");
            hotel_print++;
        }
    }

    if(hotel_print != 0){
        var items = $(".detail-hotel-box");
        var numItems = items.length;
        var perPage = 8;
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
        document.getElementById('detail_room_pick').innerHTML = `
        <div style="padding:5px; margin:10px;">
            <div style="text-align:center">
                <img src="/static/tt_website/images/no_found/no-hotel.png" style="width:60px; height:60px;" alt="Hotel Not Found" title="" />
                <br/><br/>
                <span style="font-size:14px; font-weight:600;">Oops! Room not found.</span>
            </div>
        </div>`;

        try{
            if(data_room_hotel_list.length == 0)
                document.getElementById("filterRoom_generalShow").innerHTML = 'Room not found';
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }

    }

    document.getElementById('total_room_hotel').innerHTML = `Room - `+hotel_print+` results`;
//    is_first_render_room_hotel = false;
    $('.zoom-img').wrap('<span style="display:inline-block"></span>').css('display', 'block').parent().zoom({ on:'click' });

    $('.owl-carousel-room-img').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        lazyLoadEager:true,
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
    $('#loading-detail-hotel').hide();
}

function render_hotel_search_detail(data_room_hotel_list, i){
    text = '';
    text += '<div class="row">';

    var idx = 0;
    var idx_img_room = 0;
    var room_dict = []; //description
    var img_dict = [];
    show_name_room = '';
    title_name_room = '';
    //document.getElementById("div_name_room").innerHTML = '';

    total = 0;
    total_without_discount = 0;
    for(j in data_room_hotel_list.rooms){
        for(k in data_room_hotel_list.rooms[j].nightly_prices){
            for(l in data_room_hotel_list.rooms[j].nightly_prices[k].service_charges){
                if(data_room_hotel_list.rooms[j].nightly_prices[k].service_charges[l].charge_type != 'RAC'){
                    if(data_room_hotel_list.rooms[j].nightly_prices[k].service_charges[l].charge_type != 'DISC'){
                        total_without_discount += data_room_hotel_list.rooms[j].nightly_prices[k].service_charges[l].total;
                    }
                    total += data_room_hotel_list.rooms[j].nightly_prices[k].service_charges[l].total;
                }
            }
        }
        if(data_room_hotel_list.rooms[j].images.length != 0){
            for(k in data_room_hotel_list.rooms[j].images){
                img_dict.push([data_room_hotel_list.rooms[j].description, data_room_hotel_list.rooms[j].images[k].url]);
            }
            idx_img_room = 1;
        }
        room_dict.push(data_room_hotel_list.rooms[j].description);
    }
    data_room_hotel_list.total = total;
    data_room_hotel_list.total_without_discount = total_without_discount;
    if(document.getElementById('name_room_htl'+i) == null)
        document.getElementById("div_name_room").innerHTML += `<input type="hidden" id="name_room_htl`+i+`" name="name_room_htl`+i+`"/>`;

    img_dict.sort(sortFunction);

    var current_img = null;
    var current_url = "";
    var cnt_img = 0;

    //untuk image
    text+=`<div class="col-lg-3 col-md-3">`;
    if(idx_img_room == 1){
        text+=`<div class="owl-carousel-room-img owl-theme" style="text-align:center;">`;
        for (var counter = 0; counter < img_dict.length; counter++) {
            if (img_dict[counter][0] != current_img) {
                if (cnt_img > 0) {
                    text+=`
                    <div class="item" style="cursor:zoom-in; float:none; display:inline-block;">
                        <img class="owl-lazy img-hotel-detail" data-src="`+current_url+`" style="border:1px solid #cdcdcd; width:100%; height:175px; object-fit:cover;" alt="Room Hotel" onerror="this.src='/static/tt_website/images/no_found/no-image-hotel2.jpg';" style="margin: auto; max-height:500px; width:unset;">
                    </div>`;
                }
                current_url = encodeURI(img_dict[counter][1]);
                current_img = img_dict[counter][0];
                cnt_img = 1;
            } else {
                cnt_img++;
            }
        }
        if (cnt_img > 0) {
            text+=`
            <div class="item" style="cursor:zoom-in; float:none; display:inline-block;">
            <img class="img-hotel-detail" src="`+current_url+`" style="border:1px solid #cdcdcd; width:100%; height:175px; object-fit:cover;" alt="Room Hotel" onerror="this.src='/static/tt_website/images/no_found/no-image-hotel2.jpg';" style="margin: auto; max-height:500px; width:unset;">
            </div>`;
        }
        text+=`</div>`;
    }else{
        text+=`<div class="img-hotel-detail" style="background-image: url('/static/tt_website/images/no_found/no-image-hotel2.jpg'); border:1px solid #cdcdcd; width:100%; height:175px; object-fit:cover;"></div>`;
    }
    text+=`</div>`;

    //untuk nama room
    room_dict.sort();
    var current_room = null;
    var cnt_room = 0;

    for (var ro = 0; ro < room_dict.length; ro++) {
        if (room_dict[ro] != current_room) {
            if (cnt_room > 0) {
                show_name_room += '<span style="color:'+color+';">'+cnt_room+'x </span>'+ current_room+' + ';
                title_name_room += cnt_room+'x '+ current_room+' + ';
            }
            current_room = room_dict[ro];
            cnt_room = 1;
        } else {
            cnt_room++;
        }
    }
    if (cnt_room > 0) {
        show_name_room += '<span style="color:'+color+';">'+cnt_room+'x </span>'+ current_room;
        title_name_room += cnt_room+'x '+ current_room;
    }

    text+=`<div class="col-lg-9 col-md-9">`;
    text+=`
    <div class="row">`;
    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
        provider_htl = '';
    else
        provider_htl = data_room_hotel_list.provider;

    document.getElementById("name_room_htl"+i).value = show_name_room;
    // copy detail room size, unit
    text+=`<span class="id_copy_room_total" hidden>`+data_room_hotel_list.rooms.length+`</span>`;

    for(j in data_room_hotel_list.rooms){
        if(idx == 0){
            text+=`
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">`;
            //<span>' + data_room_hotel_list.rooms[j].category + '</span><br/>
            text+= '<h5 class="name_room" style="margin-bottom:5px;" + title=' + title_name_room + '>' + show_name_room +'</h5>';
            text+=`
                <span class="span_link_cl" onclick="create_detail_room(`+i+`, result_room_detail);">See Detail</span>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="text-align:right;">
                <label class="check_box_custom">
                    <span class="span-search-ticket"></span>
                    <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyRoom();"/>
                    <span class="check_box_span_custom"></span>
                </label>
                <span class="id_copy_result" hidden>`+i+`</span>
            </div>`;

            text+=`
            <div class="col-lg-12" style="border-top:1px solid #cdcdcd; margin-top:10px; padding-top:10px;">
            <div class="row">
            <div class="col-lg-8 col-md-8">
                <i class="fas fa-bed"></i> <span class="qty_room"><b>Total Rooms:</b> `+ data_room_hotel_list.rooms.length + `</span><br/>`;
                if(data_room_hotel_list.meal_type != "" && data_room_hotel_list.meal_type != undefined){
                    text+= '<i class="fas fa-utensils"></i> <span class="meal_room"><b>Meal Type: </b> <span>' + data_room_hotel_list.meal_type+'</span></span><br/>';
                }
            text+= `
            <i class="fas fa-exclamation-circle"></i> <span style="font-weight:500; padding-top:10px;"><b>Cancellation: </b></span>
                <ul style="padding-inline-start: 15px;">
                    <li id="js_cancellation_button`+i+`" style="color:`+color+`; cursor:pointer; list-style-type:unset; font-weight:400;">
                        <span class="carrier_code_template" onclick="hotel_cancellation_button(`+i+`,`+ data_room_hotel_list.price_code +`);">
                        See Cancellation Policy</span>
                    </li>
                </ul>
            </div>
            <div class="col-lg-4 col-md-4" style="text-align:right;">`;
            if(idx == 0){
                var total_room = document.getElementById("hotel_room").value;
                var total_night = document.getElementById("total_night_search2").textContent;
                text += '<span style="font-weight: bold; font-size:14px;"> '+ provider_htl + '</span><br/>';
                if(data_room_hotel_list.currency != 'IDR'){
                    if(data_room_hotel_list.total != data_room_hotel_list.total_without_discount)
                        text+= '<span style="text-decoration: line-through;color:#cdcdcd;">' + data_room_hotel_list.currency + ' ' + data_room_hotel_list.total_without_discount +'</span><br/>';
                    text+= `<span id="hotel_room_span_`+i+`" class="price_room" style="font-weight: bold; font-size:15px; color:`+color+`;`;
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        text+= "cursor:pointer;";
                    }
                    text+= '">' + data_room_hotel_list.currency + ' ' + data_room_hotel_list.total;
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        text+= ` <i class="fas fa-caret-down"></i>`;
                    }
                    text+='</span><br/><span class="copy_total_rn carrier_code_template" style="font-size:12px; color:black;">for '+total_room+' room, '+total_night+' night</span><br/>';
                }else{
                    if(data_room_hotel_list.total != data_room_hotel_list.total_without_discount)
                        text+= '<span style="text-decoration: line-through;color:#cdcdcd;">' + data_room_hotel_list.currency + ' ' + getrupiah(data_room_hotel_list.total_without_discount) +'</span><br/>';
                    text+= `<span id="hotel_room_span_`+i+`" class="price_room" style="font-weight: bold; font-size:15px; color:`+color+`;`;
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        text+= "cursor:pointer;";
                    }
                    text+= '">' +  data_room_hotel_list.currency + ' ' + getrupiah(data_room_hotel_list.total);
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        text+= ` <i class="fas fa-caret-down"></i>`;
                    }
                    text+='</span><br/><span class="copy_total_rn carrier_code_template" style="font-size:12px; color:black;">for '+total_room+' room, '+total_night+' night</span><br/>';
                }

                if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && data_room_hotel_list){
                    if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                        for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                            try{
                                if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                    price_convert = (data_room_hotel_list.total/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                    if(price_convert%1 == 0)
                                        price_convert = parseInt(price_convert);
                                    text+=`
                                        <span class="price_room" style="font-weight: bold; font-size:14px;"> Estimated `+l+` `+getrupiah(price_convert)+` </span><br/>`;
                                }
                            }catch(err){
                                console.log(err);
                            }
                        }
                    }
                }

                if (data_room_hotel_list.availability == 'available'){
                    if(hotel_room_detail_pick != null  && hotel_room_detail_pick == i){
                        text+=`<button class="primary-btn-custom-un" style="margin-bottom:unset; margin-top:10px; width:150px;" type="button" onclick="hotel_room_pick(`+i+`,`+j+`);" id="button`+i+`">Chosen</button>`;
                    }else{
                        text+=`<button class="primary-btn-custom" style="margin-bottom:unset; margin-top:10px; width:150px;" type="button" onclick="hotel_room_pick(`+i+`,`+j+`);" id="button`+i+`">Choose</button>`;
                    }
                } else {
                    text+=`<button class="primary-btn-custom-un" style="margin-bottom:unset; margin-top:10px; width:150px;" type="button" style="color:green;" disabled="1"><i class="fa fa-phone-alt" style="margin-top:5px;"/> On Request</button>`;
                }
                idx = 1;
            }
            text+='</div></div>';
        }

        text+=`<span class="name_per_room`+i+``+j+`" style="display:none;"><b >Room #`+parseInt(parseInt(j)+1)+` </b> <span>`+data_room_hotel_list.rooms[j].description+`</span></span>`;
        if(data_room_hotel_list.rooms[j].hasOwnProperty('room_size') == true){
            if(data_room_hotel_list.rooms[j].room_size.size != '' && data_room_hotel_list.rooms[j].room_size.size != null){
                text+=`<span class="size_room`+i+``+j+`" style="display:none;"><b>Size: </b> <span>`+data_room_hotel_list.rooms[j].room_size.size+` </span></span>`;
            }
            if(data_room_hotel_list.rooms[j].room_size.unit != '' && data_room_hotel_list.rooms[j].room_size.unit != null){
                text+=`<span class="unit_room`+i+``+j+`" style="display:none;"><span>`+data_room_hotel_list.rooms[j].room_size.unit+`</span></span>`;
            }
        }
    }

    text+='</div></div>';
    return text;
}

function auto_update_special_request(id, value){
    if(document.getElementById(id).value.includes(value)){
        temp_special_request = document.getElementById(id).value.split('\n');
        for(i in temp_special_request)
            if(temp_special_request[i].includes(value)){
                temp_special_request.splice(i, 1);
                break;
            }
        document.getElementById(id).value = temp_special_request.join('\n');
    }else{
        var value_update = '';
        if(document.getElementById(id).value != '')
            value_update += '\n';
        value_update += value;
        document.getElementById(id).value += value_update;
    }
}

function update_special_request_show_text(id){
    if(id.includes('bed')){
        if(document.getElementById(id).checked)
            document.getElementById('bed_type_request_'+id.split('_')[id.split('_').length-1]).hidden = false;
        else{
            document.getElementById('bed_type_request_'+id.split('_')[id.split('_').length-1]).hidden = true;
        }
        var radios = document.getElementsByName('radio_bed_type_'+i);
        for (var j = 0, length = radios.length; j < length; j++) {
            if(j == 0){
                radios[j].checked = true;
            }else{
                radios[j].checked = false
            }
        }
    }else if(id.includes('other')){
        if(document.getElementById(id).checked){
            document.getElementById('other_request_'+id.split('_')[id.split('_').length-1]).hidden = false;
            document.getElementById('other_request_'+id.split('_')[id.split('_').length-1]).value = 'Other Request: ';
        }else{
            document.getElementById('other_request_'+id.split('_')[id.split('_').length-1]).hidden = true;
            document.getElementById('other_request_'+id.split('_')[id.split('_').length-1]).value = '';

        }

    }
}

function go_to_room_div(){
    $('html, body').animate({
        scrollTop: $("div.div-select-room-hotel").offset().top - 50
    }, 100);
    active_sticky_hotel("select");
}

function checkbox_room_hotel(id_fil, id_type){
    if(id_type == 1){
        if(document.getElementById(id_fil).checked){
            document.getElementById(''+id_fil+'2').checked = true;
        }else{
            document.getElementById(''+id_fil+'2').checked = false;
        }
    }else if(id_type == 2){
        if(document.getElementById(id_fil+ id_type).checked){
            document.getElementById(id_fil).checked = true;
        }else{
            document.getElementById(id_fil).checked = false;
        }
    }
}
