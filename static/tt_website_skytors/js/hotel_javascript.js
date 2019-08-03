var myVar;
var hotel_room_detail_pick = null;
var hotel_room = [];
var hotel_filter = [];
var sorting_value = '';
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
        console.log(val);
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
            console.log('asdad');
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
        priceshow+=",";
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
            <select class="form-select" id="hotel_child_age`+i+`" name="hotel_child_age`+i+`">
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

function hotel_search(){
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

function filtering(type){
    var data = JSON.parse(JSON.stringify(hotel_data));
    console.log(hotel_data);
    if(type == 'filter'){
        check_rating = 0;
        for(i in rating_list)
            if(rating_list[i].status == true)
                check_rating = 1;

        var check = 0;
        var temp_data = [];
        if(check_rating == 1){
            //pick airline
            data.hotel_ids.forEach((obj)=> {
                check = 0;
                rating_list.forEach((obj1)=> {
                    if(obj.rating == parseInt(obj1.value) && obj1.status==true){
                        check = 1;
                    }
                });
                if(check != 0){
                    temp_data.push(obj);
                }
            });
            data.hotel_ids = temp_data;
            hotel_filter = data;
            console.log(hotel_filter);
            temp_data = [];
        }
    }
    sort(data);
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
    filtering('filter');
}

function sort(response){
        //no filter
        console.log(response);
        console.log(hotel_data);
        sorting = sorting_value;

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
        <div style="background-color:#f15a22; margin-bottom:15px; padding:10px;">
            <h6 style="color:white;"> Suggestions by City - `+city_ids_length+` results</h6>
        </div>`;
        node.innerHTML = text;
        document.getElementById("hotel_result_city").appendChild(node);
        node = document.createElement("div");

        document.getElementById("hotel_city").innerHTML = '';
        text='';
        var node = document.createElement("div");
        for(i in response.city_ids){
            text = '<form id="hotel_city'+i+'" action="/hotel/detail" method="POST">';
                if(response.city_ids[i].image != false)
                    text+=`<div class="img-hotel-search-c" style="background-image: url('`+response.city_ids[i].image+`');border:1px solid #f15a22;"></div>`;
                else
                    text+=`<div class="img-hotel-search-c" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');border:1px solid #f15a22;"></div>`;

                text+=`
                <div class="text-block-custom">
                    <span style="font-size:12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;"><i class="fas fa-map-marker-alt" style="color:#FFC44D;"></i> `+response.city_ids[i].name+` `+response.city_ids[i].country_name+`</span><br/>
                    <span style="font-size:12px;">`+response.city_ids[i].hotel_qty+` Found</span>
                </div>
            </form>`;
            node.className = 'col-lg-3 col-md-3 col-sm-4 col-xs-4';
            node.innerHTML = text;
            document.getElementById("hotel_city").appendChild(node);
            node = document.createElement("div");
        }

        document.getElementById("hotel_result_landmark").innerHTML = '';
        text = '';
        var node = document.createElement("div");
        var landmark_ids_length = parseInt(response.landmark_ids.length);
        text+=`
        <div style="background-color:#f15a22; margin-bottom:15px; padding:10px;">
            <h6 style="color:white;"> Suggestions by Landmark - `+landmark_ids_length+` results</h6>
        </div>`;
        node.innerHTML = text;
        document.getElementById("hotel_result_landmark").appendChild(node);
        node = document.createElement("div");

        document.getElementById("hotel_landmark").innerHTML = '';
        text='';
        var node = document.createElement("div");
        for(i in response.landmark_ids){
            text = '<form id="hotel_landmark'+i+'" action="/hotel/detail" method="POST">';
                if(response.landmark_ids[i].images.length != 0)
                    text+=`<div class="img-hotel-search-c" style="background-image: url('`+response.landmark_ids[i].images[0].url+`');border:1px solid #f15a22;"></div>`;
                else
                    text+=`<div class="img-hotel-search-c" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');border:1px solid #f15a22;"></div>`;

                text+=`
                <div class="text-block-custom">
                    <span style="font-size:13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;">`+response.landmark_ids[i].name+`</span><br/>
                    <span style="font-size:12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width:100px;"><i class="fas fa-map-marker-alt" style="color:#FFC44D;"></i> `+response.landmark_ids[i].city+`</span><br/>
                    <span style="font-size:12px;">`+response.landmark_ids[i].near_by_hotel+` Found</span>
                </div>
            </form>`;
            node.className = 'col-lg-3 col-md-3 col-sm-4 col-xs-4';
            node.innerHTML = text;
            document.getElementById("hotel_landmark").appendChild(node);
            node = document.createElement("div");
        }


        document.getElementById("hotel_result").innerHTML = '';
        text = '';
        var node = document.createElement("div");
        var hotel_ids_length = parseInt(response.hotel_ids.length);
        text+=`
        <div style="background-color:#f15a22; margin-bottom:15px; padding:10px;">
            <h6 style="color:white;"> Suggestions by Hotel - `+hotel_ids_length+` results</h6>
        </div>`;
        node.innerHTML = text;
        document.getElementById("hotel_result").appendChild(node);
        node = document.createElement("div");


        /*
        for(i in response.country_ids){
            text = '<form id="hotel'+i+'" action="/hotel/detail" method="POST">';
            text += `{%csrf_token%}`;
            //msg.result.response.city_ids[i].sequence
            if(response.country_ids[i].images.length != 0)
                text+=`<img data-toggle="tooltip" class="airline-logo" style="width:50px;heigh:50px;" src="`+response.country_ids[i].images[0].url+`"><span> </span>`;
            else
                text+=`<img data-toggle="tooltip" class="airline-logo" style="width:50px;heigh:50px;" src="/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg"><span> </span>`;
            text+=`<br/><label>`+response.country_ids[i].name+`</label>`;
            text+=`<br/><label>`+response.country_ids[i].rating+` KASIH GAMBAR BINTANG</label>`;
            text+=`<input type="hidden" id="hotel_detail" name="hotel_detail" value='`+JSON.stringify(response.country_ids[i])+`'/>`;
            text+=`<label>`;
            if(response.country_ids[i].location.city != false)
                text+= response.country_ids[i].location.city;
            if(response.country_ids[i].location.address != false)
                text+= ' '+ response.country_ids[i].location.address;
            if(response.country_ids[i].location.district != false)
                text+= ' '+ response.country_ids[i].location.district;
            if(response.country_ids[i].location.state != false)
                text+= ' '+ response.country_ids[i].location.state;
            if(response.country_ids[i].location.kelurahan != false)
                text+= ' '+ response.country_ids[i].location.kelurahan;
            if(response.country_ids[i].location.zipcode != false)
                text+= ' '+ response.country_ids[i].location.zipcode;
            text+=`</label>
            <button type="button" onclick="goto_detail('country',`+response.country_ids[i].sequence+`,`+response.country_ids[i].counter+`)"/>
            </form>`;
            //tambah button ke detail
            node.innerHTML = text;
            document.getElementById("hotel_ticket").appendChild(node);
            node = document.createElement("div");
        }*/

        document.getElementById("hotel_ticket").innerHTML = '';
        text='';
        for(i in response.hotel_ids){
            text = '<form id="hotel'+i+'" action="/hotel/detail" method="POST">';
            //msg.result.response.city_ids[i].sequence
            text+=`
            <div class="row">
                <div class="col-lg-12" style="margin-bottom:25px;">
                    <div style="top:0px; right:10px; position:absolute;">
                        <label class="check_box_custom">
                            <span class="span-search-ticket"></span>
                            <input type="checkbox" id="copy_hotel"/>
                            <span class="check_box_span_custom"></span>
                        </label>
                    </div>
                </div>`;
                if(response.hotel_ids[i].images.length != 0){
                    text+=`
                    <div class="col-lg-3 col-md-3">
                        <div class="img-hotel-search" style="background-image: url(`+response.hotel_ids[i].images[0].url+`);"></div>
                    </div>`;
                }
                else{
                    text+=`
                    <div class="col-lg-3 col-md-3">
                        <div class="img-hotel-search" style="background-image: url('/static/tt_website_skytors/images/no pic/no_image_hotel.jpeg');"></div>
                    </div>`;
                }
                text+=`
                <div class="col-lg-5 col-md-5">
                    <div style="margin-bottom:10px;">
                        <h4 title="`+response.hotel_ids[i].name+`" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">`+response.hotel_ids[i].name+`</h4>
                    </div>
                    <div style="margin-bottom:10px;">
                    <span>
                        <span style="border: 2px solid #f15a22; border-radius:7px; padding-left:10px; padding-right:10px; margin-right:5px; font-weight: bold;"> Hotel </span>`;
                    if(response.hotel_ids[i].rating != false){
                        for (co=0; co < parseInt(response.hotel_ids[i].rating); co++){
                            text+=`<i class="fas fa-star" style="color:#FFC44D;"></i>`;
                        }
                    }
                text+=`</span></div>`;
                detail = JSON.stringify(response.hotel_ids[i]);
                detail = detail.replace(/'/g, "");
                text+=`<input type="hidden" id="hotel_detail" name="hotel_detail" value='`+detail+`'/>`;
                text+=`
                <div>
                    <span style="font-size:13px;"> <i class="fas fa-map-marker-alt" style="color:#f15a22;"></i>`;
                if(response.hotel_ids[i].location.city != false)
                    text+= response.hotel_ids[i].location.city;
    //            if(response.hotel_ids[i].location.address != false)
    //                text+= ' '+ response.hotel_ids[i].location.address;
                if(response.hotel_ids[i].location.district != false)
                    text+= ' '+ response.hotel_ids[i].location.district;
                if(response.hotel_ids[i].location.state != false)
                    text+= ' '+ response.hotel_ids[i].location.state;
    //            if(response.hotel_ids[i].location.kelurahan != false)
    //                text+= ' '+ response.hotel_ids[i].location.kelurahan;
    //            if(response.hotel_ids[i].location.zipcode != false)
    //                text+= ' '+ response.hotel_ids[i].location.zipcode;
                text+=` - <a href="#" style="color:blue; text-decoration: underline;">Show Map</a></span>
                    </div>
                    <div style="margin-bottom:10px;">
                        <span>
                            <img src="/static/tt_website_skytors/img/hotels/circle.png" style="width:15px; height:15px;"/>
                            <img src="/static/tt_website_skytors/img/hotels/circle.png" style="width:15px; height:15px;"/>
                            <img src="/static/tt_website_skytors/img/hotels/circle.png" style="width:15px; height:15px;"/>
                            <img src="/static/tt_website_skytors/img/hotels/circle.png" style="width:15px; height:15px;"/>
                            <img src="/static/tt_website_skytors/img/hotels/circle-none.png" style="width:15px; height:15px;"/>
                        </span>
                        <span style="padding-top:2px;"> (19412 Reviews) </span>
                    </div>

                    <div style="margin-bottom:10px;">
                        <h6 style="margin-bottom:5px;">Facility</h6>
                        <span>`;
                        try{
                            for(j in top_facility){
                                var facility_check = 0;
                                for(k in response.hotel_ids[i].facilities){
                                    if(top_facility[j].facility_id == response.hotel_ids[i].facilities[k].facility_id){
                                        facility_check = 1;
                                        break;
                                    }
                                }

                                if(facility_check == 1){
                                    text+=`<img src="`+top_facility[j].image_url+`" style="width:20px; height:20px; margin-right:5px;"/>`;
                                }
                                else{
                                    text+=`<img src="`+top_facility[j].image_url2+`" style="width:20px; height:20px; margin-right:5px;"/>`;
                                }
                            }
                        }catch(err){}
                        text+=`
                        </span>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <div class="row">
                        <div class="col-lg-12" style="margin-bottom:5px;">
                            <span style="border: 2px solid #f15a22; font-weight: bold; padding-left:10px; padding-right:10px; margin-right:5px;"> Best Price <i class="fas fa-award" style="color:#f15a22;"></i></span>
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                            <span style="font-size:14px; color:#f15a22; font-weight: bold; text-align:left;">Vendor A</span>
                        </div>
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                            <span style="font-size:14px; color:#f15a22; font-weight: bold; text-align:right;">2.200.000 IDR</span>
                        </div>

                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                            <span style="font-size:13px; text-align:left;">Vendor B</span>
                        </div>
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                            <span style="font-size:13px; text-align:right;">2.250.000 IDR</span>
                        </div>

                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                            <span style="font-size:12px; text-align:left;">Vendor C</span>
                        </div>
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                            <span style="font-size:12px; text-align:right;">2.350.000 IDR</span>
                        </div>
                    </div>
                    <div style="bottom:0px; right:10px; position:absolute;">
                        <button type="button" class="primary-btn-custom" onclick="goto_detail('hotel',`+i+`)">Select</button>
                        <br/>
                        <span style="color:#f15a22; font-size:13px; margin-top:10px;"> For 1 Night(s) </span>
                    </div>
                </div>
            </div>
            </form>`;
            //tambah button ke detail
            node.className = 'sorting-box-b';
            node.innerHTML = text;
            document.getElementById("hotel_ticket").appendChild(node);
            node = document.createElement("div");
            $('#loading-search-hotel').hide();
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


function change_filter(type, value){
    var check = 0;
    if(type == 'rating'){
//        transit_list
        rating_list[value].status = !rating_list[value].status;
    }
    filtering('filter');
}

function hotel_filter_render(){
    text = '';
    text+= `<h4>Filter</h4>
    <hr/>
    <h6 style="padding-bottom:10px;">Hotel Name</h6>
    <input type="text" class="form-control-custom" placeholder="Hotel Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Hotel Name '" autocomplete="off"/>
    <hr/>
    <h6 style="padding-bottom:10px;">Price Range</h6>
    <div class="wrapper">
        <div class="range-slider">
            <input type="text" class="js-range-slider" value="" />
        </div>
        <div class="row">
            <div class="col-lg-6">
                <input type="text" class="js-input-from form-control-custom" value="0" />
            </div>
            <div class="col-lg-6">
                <input type="text" class="js-input-to form-control-custom" value="0" />
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
        <div class="col-lg-12 col-xs-12" style="text-align:center; display:none;" id="show_commission_hotel">
            <div class="alert alert-success">
                <span style="font-size:13px;">Your Commission: IDR `+ getrupiah(parseInt(hotel_room.rooms[i].commission)) +`</span><br>
            </div>
        </div>`;

        text += `</div>`;
    }
    text += `<div class="col-lg-12">`;
    text += '<button class="primary-btn-custom" style="width:100%; margin-bottom:10px; margin-top:10px;" type="button" onclick="goto_passenger();">Next</button></div>';
    text += `<div class="col-lg-12">
        <input class="primary-btn-ticket" id="show_commission_button_hotel" style="width:100%;" type="button" onclick="show_commission_hotel();" value="Show Commission"/>
    </div>`;
    document.getElementById('button'+key).innerHTML = 'Unchoose';

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
    document.getElementById('goto_passenger').submit();
}

function check_passenger(adult, child){
    //booker
    error_log = '';
    if(document.getElementById('booker_title').value!= '' &&
       document.getElementById('booker_first_name').value!= '' &&
       document.getElementById('booker_last_name').value!='' &&
       document.getElementById('booker_nationality').value!='' &&
       document.getElementById('booker_email').value!='' &&
       document.getElementById('booker_phone_code').value!='' &&
       document.getElementById('booker_phone').value!= ''){

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
       if(error_log=='')
           document.getElementById('hotel_review').submit();
       else
           alert(error_log);
     }else{
        alert('Please Fill all the blank !');
     }
}

//<span style="border: 2px solid #f15a22; border-radius:7px; background-color:#f15a22; color:white; padding-left:5px; padding-right:5px; margin-right:5px;"> 8.4 / 10 </span>
//<span> Very Good (43121 Reviews) </span>

//<span style="border-left: 1px solid #f15a22; padding-left:5px; padding-right:5px; margin-right:5px;">
//    <img src="/static/tt_website_skytors/img/icon/circle.png" style="width:15px; height:15px;"/>
//    <img src="/static/tt_website_skytors/img/icon/circle.png" style="width:15px; height:15px;"/>
//    <img src="/static/tt_website_skytors/img/icon/circle.png" style="width:15px; height:15px;"/>
//    <img src="/static/tt_website_skytors/img/icon/circle.png" style="width:15px; height:15px;"/>
//    <img src="/static/tt_website_skytors/img/icon/circle-none.png" style="width:15px; height:15px;"/>
//    (194121)
//</span>