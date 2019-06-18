function submit_agent_registration(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/registration",
       headers:{
            'action': 'agent_registration',
       },
       data: {

       },
       success: function(msg) {
            $("#result_data_id").html(msg.result.response);
            console.log(msg.result);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_social_media(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'get_data',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           result_data = msg;
           text = '<option value="0">Choose Social Media</option>';
           for(i in result_data.social_media_id){
               text+= `<option value='`+result_data.social_media_id[i].id+`'>`+result_data.social_media_id[i].name+`</option>`;
           }
           document.getElementById('socmed_id').innerHTML = text;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function set_city(){
    var text = `<option value="" selected="">Cities</option>`;
    var country = {};
    for(i in country_list){
       if(country_list[i].id == parseInt(document.getElementById('country_id').value)){
           country = country_list[i];
           break;
       }
    }
    for(i in country.city){
        console.log(country.city);
        text +=`<option value="`+country.city[i].id+`">`+country.city[i].name+`</option>`
    }
    document.getElementById('city_id').innerHTML = text;
    $('#city_id').niceSelect('update');
}