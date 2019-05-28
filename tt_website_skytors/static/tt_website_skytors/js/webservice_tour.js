function tour_login(){
    //document.getElementById('themespark_category').value.split(' - ')[1]
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {

       },
       success: function(msg) {
           console.log(msg);
           temp = document.getElementById('tour_hidden_destination').value;
           if (temp == "" || temp == "0"){
               var text = '<option value="0" selected="">All Destinations</option>';
           }
           else {
               var text = '<option value="0">All Destinations</option>';
           }

           var counter = 0;
           if(msg.result.error_code == 0){
               tour_countries = msg.result.response.response.countries;
               for(i in tour_countries){
                   if (temp == tour_countries[i].id)
                   {
                       text+=`
                       <option value="`+tour_countries[i].id+`" selected="">`+tour_countries[i].name+`</option>
                       `;
                   }
                   else
                   {
                       text+=`
                       <option value="`+tour_countries[i].id+`">`+tour_countries[i].name+`</option>
                       `;
                   }
               }

               console.log(text);
               if (text != '') {
                    document.getElementById('tour_destination').innerHTML = text;
                    $('#tour_destination').niceSelect('update');
               }
               else {
                    alert('Failed to get Tour Destinations.');
               }

           }else{
                alert('Failed to get Tour Destinations.');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function tour_get_countries(){
    //document.getElementById('themespark_category').value.split(' - ')[1]
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'get_countries',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {

       },
       success: function(msg) {
           console.log(msg);
           temp = document.getElementById('tour_hidden_destination').value;
           if (temp == "" || temp == "0"){
               var text = '<option value="0" selected="">All Destinations</option>';
           }
           else {
               var text = '<option value="0">All Destinations</option>';
           }

           var counter = 0;
           if(msg.result.error_code == 0){
               tour_countries = msg.result.response.response.countries;
               for(i in tour_countries){
                   if (temp == tour_countries[i].id)
                   {
                       text+=`
                       <option value="`+tour_countries[i].id+`" selected="">`+tour_countries[i].name+`</option>
                       `;
                   }
                   else
                   {
                       text+=`
                       <option value="`+tour_countries[i].id+`">`+tour_countries[i].name+`</option>
                       `;
                   }

               }
               console.log(text);
               if (text != '') {
                    document.getElementById('tour_destination').innerHTML = text;
                    $('#tour_destination').niceSelect('update');
               }
               else {
                    alert('Failed to get Tour Destinations.');
               }

           }else{
                alert('Failed to get Tour Destinations.');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function tour_search(){
    get_new = false;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/tour",
       headers:{
            'action': 'search',
       },
       data: {

       },
       success: function(msg) {
        console.log(msg);
           var text = '';
           var counter = 0;
           data=[]
           if(msg.result.error_code == 0){
               for(i in msg.result.response.response.result){
                   text+=`
                   <form action='/tour/detail' method=POST id='myForm`+msg.result.response.response.result[i].sequence+`'>
                       <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" style="padding: 0px; text-align: center;">
                            <div id='csrf`+msg.result.response.response.result[i].sequence+`'></div>
                            <input id='uuid' name='uuid' type=hidden value='`+msg.result.response.response.result[i].uuid+`'/>
                            <input id='sequence' name='sequence' type=hidden value='`+msg.result.response.response.result[i].sequence+`'/>
                            <button class="panel_themespark" type="button" data-content-1="`+msg.result.response.response.result[i].name+`" onclick="go_to_detail('`+msg.result.response.response.result[i].sequence+`')">
                                <div class="themespark-image-thumbnail">
                                    <img style="width: 100%; height: 100%;" src="`+msg.result.response.response.result[i].images_obj[0].url+msg.result.response.response.result[i].images_obj[0].path+`">
                                </div>
                                <div class="row themespark-description-thumbnail" style="display:block;">
                                    <span class="span-themespark-desc" style="font-weight:bold;">`+msg.result.response.response.result[i].name+`</span><br/>`;
//                                    for(j in msg.result.response[i].locations) {
//                                        text+=`
//                                            <span class="span-themespark-desc"> <i style="color:red !important;" class="fas fa-map-marker-alt"></i> `+msg.result.response.response.result[i].locations[j].city_name+`, `+msg.result.response.response.result[i].locations[j].country_name+` </span>
//                                            <br/>`;
//                                    }
//                                    text+=`
//                                        <span class="span-themespark-desc"> `+msg.result.response.response.result[i].reviewAverageScore+` <i style="color:#FFC801 !important;" class="fas fa-star"></i> (`+msg.result.response.response.result[i].reviewCount+`)</span>
//                                        <span class="span-themespark-desc" data-oe-type="monetary" data-oe-expression="rec['converted_price']" style="font-weight:bold; float:right;">Rp&nbsp;<span class="oe_currency_value">`+getrupiah(msg.result.response.response.result[i].converted_price)+`</span></span>
                                text+=`
                                </div>
                            </button>
                       </div>
                   </form>
                   `;
               }
               document.getElementById('tour_ticket').innerHTML += text;
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