counter_passenger = 0;
counter_line = 0;
agent_offside = 0;
function get_data_issued_offline(){
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
           issued_offline_data = msg;
           text = '<option value=""></option>';
           for(i in issued_offline_data.transaction_type){
               text+= `<option value='`+issued_offline_data.transaction_type[i][0]+`'>`+issued_offline_data.transaction_type[i][1]+`</option>`;
           }
           document.getElementById('transaction_type').innerHTML = text;
           $('#transaction_type').niceSelect('update');

           text = '<option value=""></option>';
           for(i in issued_offline_data.sector_type){
               text+= `<option value='`+issued_offline_data.sector_type[i][0]+`'>`+issued_offline_data.sector_type[i][1]+`</option>`;
           }
           document.getElementById('sector').innerHTML = text;
           $('#sector').niceSelect('update');

//           text = '<option value=""></option>';
//           for(i in issued_offline_data.carrier_id){
//               text+= `<option value='`+issued_offline_data.carrier_id[i].id+`'>`+issued_offline_data.carrier_id[i].name+`</option>`;
//           }
//           document.getElementById('carrier_id').innerHTML = text;
//           $('#carrier_id').niceSelect('update');

           text = '<option value=""></option>';
           for(i in issued_offline_data.social_media_id){
               text+= `<option value='`+issued_offline_data.social_media_id[i].id+`'>`+issued_offline_data.social_media_id[i].name+`</option>`;
           }
           document.getElementById('social_media').innerHTML = text;
           $('#social_media').niceSelect('update');
           var carrier = document.getElementById("carrier_name");
           for(i in msg.carrier_id){
                var node = document.createElement("option");
                node.text = msg.carrier_id[i].name;
                node.value = msg.carrier_id[i].code;
                try{
                }catch(err){
                }
                carrier.add(node);
           }

           console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_data2(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'get_data2',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
           issued_offline_data = msg;
           text = '<option value=""></option>';
           for(i in issued_offline_data.transaction_type){
               text+= `<option value='`+issued_offline_data.transaction_type[i].code+`'>`+issued_offline_data.transaction_type[i].name+`</option>`;
           }
           console.log(text);
           document.getElementById('transaction_type').innerHTML = text;
           $('#transaction_type').niceSelect('update');

           text = '<option value=""></option>';
           for(i in issued_offline_data.sector_type){
               text+= `<option value='`+issued_offline_data.sector_type[i][0]+`'>`+issued_offline_data.sector_type[i][1]+`</option>`;
           }
           document.getElementById('sector').innerHTML = text;
           $('#sector').niceSelect('update');

//           text = '<option value=""></option>';
//           for(i in issued_offline_data.carrier_id){
//               text+= `<option value='`+issued_offline_data.carrier_id[i].id+`'>`+issued_offline_data.carrier_id[i].name+`</option>`;
//           }
//           document.getElementById('carrier_id').innerHTML = text;
//           $('#carrier_id').niceSelect('update');

           text = '<option value=""></option>';
           for(i in issued_offline_data.social_media_id){
               text+= `<option value='`+issued_offline_data.social_media_id[i].name+`'>`+issued_offline_data.social_media_id[i].name+`</option>`;
           }
           document.getElementById('social_media').innerHTML = text;
           $('#social_media').niceSelect('update');
           var carrier = document.getElementById("carrier_name");
           var node = document.createElement("option");
           node.text = '';
           node.value = '';
           carrier.add(node);
           for(i in msg.carrier_id){
                var node = document.createElement("option");
                node.text = msg.carrier_id[i].name;
                node.value = msg.carrier_id[i].id;
                try{
                }catch(err){
                }
                carrier.add(node);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function create_issued_offline(){
    getToken();
    error_log = '';
    request = {};
    if(counter_passenger == 0)
        error_log += 'Please fill passengers\n';
    else{
        request['passenger'] = []
        for(i=0; i < counter_passenger; i++){
            //kasi if kosong
            request['passenger_first_name'+i] = document.getElementById('adult_first_name' + (i + 1)).value;
            request['passenger_last_name'+i] = document.getElementById('adult_last_name' + (i + 1)).value;
            request['passenger_title'+i] = document.getElementById('adult_title' + (i + 1)).value;
            request['passenger_email'+i] = "asndasdn@gmail.com";
            request['passenger_calling_code'+i] = "+62";
            request['passenger_mobile'+i] = '81237123812';
            request['passenger_nationality_code'+i] = document.getElementById('adult_nationality' + (i + 1)).value;
            request['passenger_id'+i] = document.getElementById('adult_id' + (i + 1)).value;
        }
    }
    if(counter_line == 0 && document.getElementById('transaction_type').value == 'airline' || counter_line == 0 && document.getElementById('transaction_type').value == 'train')
        error_log += 'Please fill line\n';
    else{
        for(i=0; i < counter_line; i++){
            if(document.getElementById('origin'+i).value == '')
                error_log += 'Please fill origin for line '+ (i+1) + '\n';
            if(document.getElementById('destination'+i).value == '')
                error_log += 'Please fill destination for line '+ (i+1) + '\n';
            if(document.getElementById('departure'+i).value == '')
                error_log += 'Please fill departure for line '+ (i+1) + '\n';
            if(document.getElementById('arrival'+i).value == '')
                error_log += 'Please fill arrival for line '+ (i+1) + '\n';
            if(document.getElementById('carrier_code'+i).value == '')
                error_log += 'Please fill carrier code for line '+ (i+1) + '\n';
            if(document.getElementById('carrier_number'+i).value == '')
                error_log += 'Please fill carrier number for line '+ (i+1) + '\n';
            if(document.getElementById('sub_class'+i).value == '')
                error_log += 'Please fill sub class for line '+ (i+1) + '\n';
            if(document.getElementById('class'+i).value == '')
                error_log += 'Please fill class for line '+ (i+1) + '\n';
            if(error_log == ''){
                key = [
                    "line_origin"+i,
                    "line_destination"+i,
                    "line_departure"+i,
                    "line_arrival"+i,
                    "line_carrier_code"+i,
                    "line_carrier_number"+i,
                    "line_sub_class"+i,
                    "line_class_of_service"+i
                ]
                request["line_origin"+i] = document.getElementById('origin'+i).value;
                request["line_destination"+i] = document.getElementById('destination'+i).value;
                request["line_departure"+i] =  document.getElementById('departure'+i).value;
                request["line_arrival"+i] = document.getElementById('arrival'+i).value;
                request["line_carrier_code"+i] = document.getElementById('carrier_code'+i).value;
                request["line_carrier_number"+i] = document.getElementById('carrier_number'+i).value;
                request["line_sub_class"+i] = document.getElementById('sub_class'+i).value;
                request["line_class_of_service"+i] = document.getElementById('class'+i).value;
            }
        }
    }
//    if(document.getElementById('contact_id').value == ''){}
    if(document.getElementById('transaction_type').value == '')
        error_log += 'Please fill transaction type\n';
    if(document.getElementById('sector').value == '')
        error_log += 'Please fill sector\n';
    if(document.getElementById('total_sale_price').value == '')
        error_log += 'Please fill total sale price\n';
    if(document.getElementById('carrier_name').value == '')
        error_log += 'Please fill carrier\n';
    if(document.getElementById('pnr').value == '')
        error_log += 'Please fill pnr\n';
    if(document.getElementById('social_media').value == '')
        error_log += 'Please fill social media\n';
    if(document.getElementById('timelimit').value == '')
        error_log += 'Please fill time limit\n';
    if(error_log == ''){
        request["counter_line"] = counter_line;
        request["counter_passenger"] = counter_passenger;

        request["booker_title"] = document.getElementById('booker_title').value;
        request["booker_first_name"] = document.getElementById('booker_first_name').value;
        request["booker_last_name"] = document.getElementById('booker_last_name').value;
        request["booker_email"] = document.getElementById('booker_email').value;
        request["booker_calling_code"] = document.getElementById('booker_phone_code').value;
        request["booker_mobile"] = document.getElementById('booker_phone').value;
        request["booker_nationality_code"] = document.getElementById('booker_nationality').value;
        request["booker_id"] = document.getElementById('booker_id').value;

        request["type"] = document.getElementById('transaction_type').value;
        request["sector_type"] = document.getElementById('sector').value;
        request["total_sale_price"] = document.getElementById('total_sale_price').value;
        request["desc"] = document.getElementById('description').value;
        request["provider"] = document.getElementById('carrier_name').value;
        request["pnr"] = document.getElementById('pnr').value;
        request["social_media"] = document.getElementById('social_media').value;
        request["expired_date"] = document.getElementById('timelimit').value;

        console.log(request);
        $.ajax({
           type: "POST",
           url: "/webservice/issued_offline",
           headers:{
                'action': 'create_issued_offline',
           },
           data: request,
           success: function(msg) {
                console.log(msg);

           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               alert(errorThrown);
           }
        });
    }else{
        alert(error_log);
    }
}

function get_history_issued_offline(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'get_history_issued_offline',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'offset': agent_offside
       },
       success: function(msg) {
            if(msg.result.response.issued_offline.length == 80){
                agent_offside++;
                table_issued_offline_history(msg.result.response.issued_offline);
                load_more = true;
            }else{
                table_issued_offline_history(msg.result.response.issued_offline);
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}