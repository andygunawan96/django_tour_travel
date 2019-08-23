passenger_data = [];
passenger_data_pick = [];
passenger_number = 0;
agent_offside = 0;
load_more = true;
function signin(){
    if($('#username').val() != '' && $('#password').val() != ''){
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/agent",
           headers:{
                'action': 'signin',
           },
    //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
           data: {
            'username':$('#username').val(),
            'password':$('#password').val()
           },
           success: function(msg) {
            if(msg == 0){
                gotoForm();
            }else{
                alert('Wrong Username or Password !');
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               alert(errorThrown);
           }
        });
    }else{
        alert('Oops', 'Please fill all the blank!');
    }
}

function triggered_balance(){
    var timeInterval = setInterval(function() {
        if(time!=0){
            time--;
        }else{
            get_balance();
            time=300;
        }
    }, 1000);

}

function session_time_limit(){
    var timeLimitInterval = setInterval(function() {
        if(time_limit!=0){
            time_limit--;
            document.getElementById('session_time').innerHTML = ` <i class="fas fa-stopwatch"></i> `+ parseInt(time_limit/60) % 24 +`m:`+ (time_limit%60) +`s`;
            document.getElementById('elapse_time').innerHTML = ` <i class="fas fa-clock"></i> `+ parseInt((600 - time_limit)/60) % 24 +`m:`+ ((600 - time_limit)%60) +`s`;
        }else{
            window.location.href = url_home;
            clearInterval(timeLimitInterval);
        }
    }, 1000);
}

function check_string_length(value){
    return value.length;
}

function get_customer_list(passenger, number, product){
    getToken();
    passenger_number = number;
    if(document.getElementById('train_booker_search').value.length >= 2){
        if(passenger == 'booker'){
            $.ajax({
               type: "POST",
               url: "/webservice/agent",
               headers:{
                    'action': 'get_customer_list',
               },
        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
               data: {
                    'name': document.getElementById('train_booker_search').value,
                    'product': product,
                    'passenger_type': passenger,
                    'signature': signature
               },
               success: function(msg) {
                console.log(msg);
                if(msg.result.error_code==0){
                    var response = '';
                    if(msg.result.response.length != 0){
                        response+=`
                        <table style="width:100%" id="list-of-passenger">
                            <tr>
                                <th style="width:10%;">No</th>
                                <th style="width:60%;">Name</th>
                                <th style="width:30%"></th>
                            </tr>`;

                        for(i in msg.result.response){
                            response+=`
                            <tr>
                                <td>`+(parseInt(i)+1)+`</td>
                                <td>
                                    <i class="fas fa-user"></i> `+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name;
                                    if(msg.result.response[i].email != '')
                                        response+=`<br/> <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="fas fa-envelope"></i> `+msg.result.response[i].email+`</span>`;
                                    if(msg.result.response[i].birth_date != '')
                                        response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.result.response[i].birth_date+`</span>`;
                                    if(msg.result.response[i].phones.length != 0)
                                        response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.result.response[i].phones[msg.result.response[i].phones.length - 1].calling_code+` - `+msg.result.response[i].phones[msg.result.response[i].phones.length - 1].calling_number+`</span>`;
                                    if(msg.result.response[i].nationality_code != '')
                                        response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.result.response[i].nationality_code+`</span>`;
                                    response+=`
                                </td>`;
    //                            <td>`+msg.response.result[i].booker_type+`</td>
    //                            <td>Rp. `+getrupiah(msg.response.result[i].agent_id.credit_limit+ msg.response.result[i].agent_id.balance)+`</td>
                                response+=`<td><button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('Booker',`+msg.result.response[i].sequence+`,'`+product+`');">Choose</button></td>
                            </tr>`;
                        }
                        response+=`</table>`;
                        document.getElementById('search_result').innerHTML = response;
                        passenger_data = msg.result.response;
                    }else{
                        response = '';
                        response+=`<center><h5>OOPS! USER NOT FOUND</h5></center>`;
                        document.getElementById('search_result').innerHTML = response;
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    logout();
                }else{
                    alert(msg.result.error_msg);
                }

                $('#loading-booker-train').hide();
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(errorThrown);
               }
            });
        }else{
            $(".loading-pax-train").show();
            $.ajax({
               type: "POST",
               url: "/webservice/agent",
               headers:{
                    'action': 'get_customer_list',
               },
        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
               data: {
                    'name': document.getElementById('train_adult'+number+'_search').value,
                    'product': product,
                    'passenger_type': passenger,
                    'signature': signature
               },
               success: function(msg) {
                console.log(msg);
                if(msg.result.error_code==0){
                    var response = '';
                    if(msg.result.response.length != 0){
                        response+=`
                        <table style="width:100%" id="list-of-passenger">
                            <tr>
                                <th style="width:10%;">No</th>
                                <th style="width:60%;">Name</th>
                                <th style="width:30%">Action</th>
                            </tr>`;

                        for(i in msg.result.response){
                            response+=`
                            <tr>
                                <td>`+(parseInt(i)+1)+`</td>
                                <td>
                                    <i class="fas fa-user"></i> `+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name;
                                    if(msg.result.response[i].email != '')
                                        response+=`<br/> <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="fas fa-envelope"></i> `+msg.result.response[i].email+`</span>`;
                                    if(msg.result.response[i].birth_date != '')
                                        response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.result.response[i].birth_date+`</span>`;
                                    if(msg.result.response[i].phones.length != 0)
                                        response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.result.response[i].phones[msg.result.response[i].phones.length - 1].calling_code+` - `+msg.result.response[i].phones[msg.result.response[i].phones.length - 1].calling_number+`</span>`;
                                    if(msg.result.response[i].nationality_code != '')
                                        response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.result.response[i].nationality_code+`</span>`;
                                    response+=`
                                </td>`;
    //                            <td>`+msg.response.result[i].booker_type+`</td>
    //                            <td>Rp. `+getrupiah(msg.response.result[i].agent_id.credit_limit+ msg.response.result[i].agent_id.balance)+`</td>
                                response+=`<td><button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('`+passenger+`',`+msg.result.response[i].sequence+`,'`+product+`');">Choose</button></td>
                            </tr>`;
                        }
                        response+=`</table>`;
                        document.getElementById('search_result_'+passenger+number).innerHTML = response;
                        passenger_data = msg.result.response;
                    }else{
                        response = '';
                        response+=`<center><h5>OOPS! USER NOT FOUND</h5></center>`;
                        document.getElementById('search_result_'+passenger+number).innerHTML = response;
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    logout();
                }else{
                    alert(msg.result.error_msg);
                }

                $(".loading-pax-train").hide();
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(errorThrown);
               }
            });
        }
    }else{
        alert("Please input more than 1 word!");
    }
}

function search_passenger(passenger, number, product){
    var check = 0;
    $('#loading-booker-train').show();
    passenger_number = parseInt(number);
    document.getElementById('search_result').innerHTML = ``;
    getToken();
    if(passenger == 'Booker'){
        if(check_string_length($('#train_booker_search').val())>=2){
            //get_agent_booker
            $.ajax({
               type: "POST",
               url: "/webservice/agent",
               headers:{
                    'action': 'get_agent_booker',
               },
        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
               data: {
                    "search_value": $('#train_booker_search').val(),
                    'signature': signature
               },
               success: function(msg) {
                console.log(msg);
                if(msg.error_code==0){
                    var response = '';

                    if(msg.response.result.length != 0){
                        response+=`
                        <table style="width:100%" id="list-of-passenger">
                            <tr>
                                <th style="width:5%;">No</th>
                                <th style="width:30%;">Name</th>
                                <th style="width:10%;">Type</th>
                                <th style="width:40%;">Balance</th>
                                <th style="width:20%"></th>
                            </tr>`;

                        for(i in msg.response.result){
                            response+=`
                            <tr>
                                <td>`+(parseInt(i)+1)+`</td>
                                <td>
                                    <i class="fas fa-user"></i> `+msg.response.result[i].title+` `+msg.response.result[i].first_name+` `+msg.response.result[i].last_name;
                                    if(msg.response.result[i].email != '')
                                        response+=`<br/> <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><i class="fas fa-envelope"></i> `+msg.response.result[i].email+`</span>`;
                                    if(msg.response.result[i].birth_date != '')
                                        response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.response.result[i].birth_date+`</span>`;
                                    if(msg.response.result[i].mobile != '')
                                        response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.response.result[i].mobile+`</span>`;
                                    if(msg.response.result[i].nationality_id.name != '')
                                        response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.response.result[i].nationality_id.name+`</span>`;
                                    response+=`
                                </td>
                                <td>`+msg.response.result[i].booker_type+`</td>
                                <td>Rp. `+getrupiah(msg.response.result[i].agent_id.credit_limit+ msg.response.result[i].agent_id.balance)+`</td>
                                <td><button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('Booker',`+msg.response.result[i].sequence+`,'`+product+`');">Choose</button></td>
                            </tr>`;
                        }
                        response+=`</table>`;
                        document.getElementById('search_result').innerHTML = response;
                        passenger_data = msg.response.result;
                    }
                    else{
                        response = '';
                        response+=`<center><h5>USER NOT FOUND</h5></center>`;
                        document.getElementById('search_result').innerHTML = response;
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    logout();
                }else{
                    alert(msg.result.error_msg);
                }

                $('#loading-booker-train').hide();
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(errorThrown);
               }
            });

        }else{
            alert('Please Input more than 2 word!');
            $('#loading-booker-train').hide();
        }
    }else{
        $('#loading-pax-train').show();
        $('#loading-paxi-train').show();
        if (product == 'activity'){
            $('#loading-paxs-train').show();
            $('#loading-paxc-train').show();
        }
        var passenger_search = '';
        if(passenger=='Adult')
            passenger_search = [$('#train_adult'+number.toString()+'_search').val(), 'ADT'];
        else if(passenger=='Infant')
            passenger_search = [$('#train_infant'+number.toString()+'_search').val(), 'INF'];
        else if(passenger=='Senior')
            passenger_search = [$('#train_senior'+number.toString()+'_search').val(), 'YCD'];
        else if(passenger=='Child')
            passenger_search = [$('#train_child'+number.toString()+'_search').val(), 'CHD'];
        else if(passenger=='') //untuk issued offline
            passenger_search = [$('#train'+number.toString()+'_search').val(), ''];

        if(check_string_length(passenger_search[0])>=2){
            //get_agent_passenger
            $.ajax({
               type: "POST",
               url: "/webservice/agent",
               headers:{
                    'action': 'get_customer_list',
               },
        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
               data: {
                    "name": $('#train_adult'+number+'_search').val(),
                    'signature': signature
               },
               success: function(msg) {
               console.log(msg);
                if(msg.error_code==0){
                    var response = '';
                    var count_user = 0;
                    if(msg.response.result.length != 0){
                        response+=`
                        <br/>
                        <table style="width:100%" id="list-of-passenger">
                            <tr>
                                <th style="width:10%;">No</th>
                                <th style="width:60%;">Name</th>
                                <th style="width:30%"></th>
                            </tr>`;

                        count_user = 0;
                        for(i in msg.response.result){
                            if(passenger_search[1] == "")
                            {
                                count_user = parseInt(i)+1;
                                response+=`
                                <tr>
                                    <td>`+(parseInt(i)+1)+`</td>
                                    <td>
                                        <i class="fas fa-user"></i> `+msg.response.result[i].title+` `+msg.response.result[i].first_name+` `+msg.response.result[i].last_name+``;
                                        if(msg.response.result[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.response.result[i].birth_date+`</span>`;
                                        if(msg.response.result[i].mobile != '')
                                            response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.response.result[i].mobile+`</span>`;
                                        if(msg.response.result[i].nationality_id.name != '')
                                            response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.response.result[i].nationality_id.name+`</span>`;
                                        if(msg.response.result[i].identity_type == 'pas')
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'ktp')
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'sim')
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.response.result[i].identity_number+`</span>`;
                                        response+=`
                                    </td>
                                    <td style="text-align:center;">
                                        <button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('',`+i+`,'`+product+`');">Choose</button>
                                    </td>
                                </tr>`;
                            }
                            else if(msg.response.result[i].pax_type == passenger_search[1] && passenger == 'Adult')
                            {
                                count_user = parseInt(i)+1;
                                response+=`
                                <tr>
                                    <td>`+(parseInt(i)+1)+`</td>
                                    <td>
                                        <i class="fas fa-user"></i> `+msg.response.result[i].title+` `+msg.response.result[i].first_name+` `+msg.response.result[i].last_name+``;
                                        if(msg.response.result[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.response.result[i].birth_date+`</span>`;
                                        if(msg.response.result[i].mobile != '')
                                            response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.response.result[i].mobile+`</span>`;
                                        if(msg.response.result[i].nationality_id.name != '')
                                            response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.response.result[i].nationality_id.name+`</span>`;
                                        if(msg.response.result[i].identity_type == 'pas')
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'ktp')
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'sim')
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.response.result[i].identity_number+`</span>`;
                                        response+=`
                                    </td>
                                    <td style="text-align:center;">
                                        <button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('Adult',`+i+`,'`+product+`');">Choose</button>
                                    </td>
                                </tr>`;
                            }
                            else if(msg.response.result[i].pax_type == passenger_search[1] && passenger == 'Child')
                            {
                                count_user = parseInt(i)+1;
                                response+=`
                                <tr>
                                    <td>`+(parseInt(i)+1)+`</td>
                                    <td>
                                        <i class="fas fa-user"></i> `+msg.response.result[i].title+` `+msg.response.result[i].first_name+` `+msg.response.result[i].last_name+``;
                                        if(msg.response.result[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.response.result[i].birth_date+`</span>`;
                                        if(msg.response.result[i].mobile != '')
                                            response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.response.result[i].mobile+`</span>`;
                                        if(msg.response.result[i].nationality_id.name != '')
                                            response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.response.result[i].nationality_id.name+`</span>`;
                                        if(msg.response.result[i].identity_type == 'pas')
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'ktp')
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'sim')
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.response.result[i].identity_number+`</span>`;
                                        response+=`
                                    </td>
                                    <td style="text-align:center;">
                                        <button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('Child',`+i+`,'`+product+`');">Choose</button>
                                    </td>
                                </tr>`;
                            }

                            else if(msg.response.result[i].pax_type == passenger_search[1] && passenger == 'Senior')
                            {
                                count_user = parseInt(i)+1;
                                response+=`
                                <tr>
                                    <td>`+(parseInt(i)+1)+`</td>
                                    <td>
                                        <i class="fas fa-user"></i> `+msg.response.result[i].title+` `+msg.response.result[i].first_name+` `+msg.response.result[i].last_name+``;
                                        if(msg.response.result[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.response.result[i].birth_date+`</span>`;
                                        if(msg.response.result[i].mobile != '')
                                            response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.response.result[i].mobile+`</span>`;
                                        if(msg.response.result[i].nationality_id.name != '')
                                            response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.response.result[i].nationality_id.name+`</span>`;
                                        if(msg.response.result[i].identity_type == 'pas')
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'ktp')
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'sim')
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.response.result[i].identity_number+`</span>`;
                                        response+=`
                                    </td>
                                    <td style="text-align:center;">
                                        <button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('Senior',`+i+`,'`+product+`');">Choose</button>
                                    </td>
                                </tr>`;
                            }

                            else if(msg.response.result[i].pax_type == passenger_search[1] && passenger == 'Infant')
                            {
                                count_user = parseInt(i)+1;
                                response+=`
                                <tr>
                                    <td>`+(parseInt(i)+1)+`</td>
                                    <td>
                                        <i class="fas fa-user"></i> `+msg.response.result[i].title+` `+msg.response.result[i].first_name+` `+msg.response.result[i].last_name+``;
                                        if(msg.response.result[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.response.result[i].birth_date+`</span>`;
                                        if(msg.response.result[i].mobile != '')
                                            response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.response.result[i].mobile+`</span>`;
                                        if(msg.response.result[i].nationality_id.name != '')
                                            response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.response.result[i].nationality_id.name+`</span>`;
                                        if(msg.response.result[i].identity_type == 'pas')
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'ktp')
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'sim')
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.response.result[i].identity_number+`</span>`;
                                        response+=`
                                    </td>
                                    <td style="text-align:center;">
                                        <button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('Infant',`+i+`,'`+product+`');">Choose</button>
                                    </td>
                                </tr>`;
                            }

                            else if(msg.response.result[i].pax_type == passenger_search[1] && passenger == 'Elder')
                            {
                                count_user = parseInt(i)+1;
                                response+=`
                                <tr>
                                    <td>`+(parseInt(i)+1)+`</td>
                                    <td>
                                        <i class="fas fa-user"></i> `+msg.response.result[i].title+` `+msg.response.result[i].first_name+` `+msg.response.result[i].last_name+``;
                                        if(msg.response.result[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.response.result[i].birth_date+`</span>`;
                                        if(msg.response.result[i].mobile != '')
                                            response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.response.result[i].mobile+`</span>`;
                                        if(msg.response.result[i].nationality_id.name != '')
                                            response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.response.result[i].nationality_id.name+`</span>`;
                                        if(msg.response.result[i].identity_type == 'pas')
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'ktp')
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.response.result[i].identity_number+`</span>`;
                                        else if(msg.response.result[i].identity_type == 'sim')
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.response.result[i].identity_number+`</span>`;
                                        response+=`
                                    </td>
                                    <td style="text-align:center;">
                                        <button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('Elder',`+i+`,'`+product+`');">Choose</button>
                                    </td>
                                </tr>`;
                            }
                        }
                        response+=`</table>`;

                        if(count_user == 0){
                            response='';
                            response+=`<br/><center><h5>USER NOT FOUND</h5></center>`;
                        }
                        if(passenger_search[1] == 'ADT')
                            document.getElementById('search_result_adult'+number).innerHTML = response;
                        else if(passenger_search[1] == 'INF')
                            document.getElementById('search_result_infant'+number).innerHTML = response;
                        else if(passenger_search[1] == 'YCD')
                            document.getElementById('search_result_senior'+number).innerHTML = response;
                        else if(passenger_search[1] == 'CHD')
                            document.getElementById('search_result_child'+number).innerHTML = response;
                        else if(passenger_search[1] == '')
                            document.getElementById('search_result'+number).innerHTML = response;
                        passenger_data = msg.response.result;
                    }
                    else{
                        response = '';
                        response+=`<br/><center><h5>USER NOT FOUND</h5></center>`;
                        if(passenger_search[1] == 'ADT')
                            document.getElementById('search_result_adult'+number).innerHTML = response;
                        else if(passenger_search[1] == 'INF')
                            document.getElementById('search_result_infant'+number).innerHTML = response;
                        else if(passenger_search[1] == 'YCD')
                            document.getElementById('search_result_senior'+number).innerHTML = response;
                        else if(passenger_search[1] == 'CHD')
                            document.getElementById('search_result_child'+number).innerHTML = response;
                        else if(passenger_search[1] == '')
                            document.getElementById('search_result'+number).innerHTML = response;
                    }


                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    logout();
                }else{
                    alert(msg.result.error_msg);
                }
                $('#loading-pax-train').hide();
                $('#loading-paxi-train').hide();
                if (product == 'activity'){
                    $('#loading-paxs-train').hide();
                    $('#loading-paxc-train').hide();
                }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(errorThrown);
               }
            });
        }else{
            alert('Please Input more than 2 word!');
            $('#loading-pax-train').hide();
            $('#loading-paxi-train').hide();
            if (product == 'activity'){
                $('#loading-paxs-train').hide();
                $('#loading-paxc-train').hide();
            }
        }
    }

}

function gotoForm(){
    document.getElementById('myForm').submit();
}

function pick_passenger(type, sequence, product){
    if(type == '' || product == 'issued_offline'){
        if(type == 'Booker'){
            document.getElementById('sub_agent').value = passenger_data[sequence].agent_id.name;
            document.getElementById('sub_agent_id').value = passenger_data[sequence].agent_id.id;
            document.getElementById('contact_person').value = passenger_data[sequence].title + ' ' + passenger_data[sequence].first_name + ' ' + passenger_data[sequence].last_name;
            document.getElementById('contact_id').value = passenger_data[sequence].id;
            $('#myModal').modal('hide');
        }else{
            document.getElementById('name_pax'+sequence).innerHTML = passenger_data[sequence].title + ' ' + passenger_data[sequence].first_name + ' ' + passenger_data[sequence].last_name;
            document.getElementById('id_passenger'+sequence).value = passenger_data[sequence].id;
            document.getElementById('pax_type'+sequence).innerHTML = passenger_data[sequence].pax_type;
            $('#myModalPassenger'+sequence).modal('hide');
        }
    }
    else if(type == 'Booker'){
        //change booker
        document.getElementById('booker_title').value = passenger_data[sequence].title;
        $('#booker_title').niceSelect('update');
        document.getElementById('booker_first_name').value = passenger_data[sequence].first_name;
        document.getElementById('booker_first_name').readOnly = true;
        document.getElementById('booker_last_name').value = passenger_data[sequence].last_name;
        document.getElementById('booker_last_name').readOnly = true;
        if(passenger_data[sequence].nationality_code != '' && passenger_data[sequence].nationality_name != ''){
            document.getElementById('select2-booker_nationality_id-container').innerHTML = passenger_data[sequence].nationality_code;
            document.getElementById('booker_nationality').value = passenger_data[sequence].nationality_name;
        }
        document.getElementById('booker_email').value = passenger_data[sequence].email;
        if(passenger_data[sequence].phones.length != 0){
            document.getElementById('booker_phone_code').value = passenger_data[sequence].phones[passenger_data[sequence].phones.length -1].calling_code;
            document.getElementById('booker_phone').value = passenger_data[sequence].phones[passenger_data[sequence].phones.length -1].calling_number;
        }
        document.getElementById('booker_birth_date').value = passenger_data[sequence].birth_date;
        document.getElementById('booker_birth_date').readOnly = true;
        if(product == 'train'){
            document.getElementById('booker_id_type').value = passenger_data[sequence].identity_type;
            document.getElementById('booker_id_type').readOnly = true;
            document.getElementById('booker_id_number').value = passenger_data[sequence].identity_number;
            document.getElementById('booker_id_number').readOnly = true;
        }else if(product == 'airline'){
            document.getElementById('booker_id_type').value = passenger_data[sequence].identity_type;
            document.getElementById('booker_id_type').readOnly = true;
            document.getElementById('booker_id_number').value = passenger_data[sequence].identity_number;
            document.getElementById('booker_id_number').readOnly = true;
            document.getElementById('booker_country_of_issued').value = passenger_data[sequence].country_of_issued_id;
            document.getElementById('booker_id_number').readOnly = true;
        }
        auto_complete('booker_nationality');
        document.getElementById('booker_id').value = passenger_data[sequence].seq_id;
        //untuk booker check
        booker_pick_passenger = passenger_data[sequence];
        booker_pick_passenger.sequence = 0;
        $('#myModal').modal('hide');
    }else if(type == 'adult'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'adult'+passenger_number){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('adult_title'+passenger_number).value = passenger_data[sequence].title;
        $('#adult_title'+passenger_number).niceSelect('update');
        document.getElementById('adult_first_name'+passenger_number).value = passenger_data[sequence].first_name;
        document.getElementById('adult_first_name'+passenger_number).readOnly = true;
        document.getElementById('adult_last_name'+passenger_number).value = passenger_data[sequence].last_name;
        document.getElementById('adult_last_name'+passenger_number).readOnly = true;
        document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_code;
        if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_code != ''){
            document.getElementById('select2-adult_nationality_id'+passenger_number+'-container').innerHTML = passenger_data[sequence].nationality_name;
            document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_code;
        }
        document.getElementById('adult_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
        check_years_old(passenger_number,'adult');

        if(document.getElementById('adult_years_old'+passenger_number).value >= 17){
            if(product=='train'){
                document.getElementById('adult_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
                document.getElementById('adult_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
            }
            if(product=='airline'){
                document.getElementById('adult_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
                document.getElementById('adult_passport_expired_date'+passenger_number).value = passenger_data[sequence].passport_expdate;
                //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_code;
            }

            if (document.getElementById("default-select")) {
                $('select').niceSelect('update');
            };
        }

        if(product=='train'){
            if(parseInt(document.getElementById('adult_years_old'+passenger_number).value)>=17){
                document.getElementById('adult_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
                document.getElementById('adult_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
            }
        }
        if(product=='airline'){

            if(passenger_data[sequence].passport_number != '' && passenger_data[sequence].passport_number != undefined)
                document.getElementById('adult_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
            if(passenger_data[sequence].passport_expdate != '' && passenger_data[sequence].passport_expdate != undefined){
                passport_date = new Date(passenger_data[sequence].passport_expdate).toString().split(' ');
                passport_date = passport_date[2] + ' '+ passport_date[1] + ' ' + passport_date[3];
                document.getElementById('adult_passport_expired_date'+passenger_number).value = passport_date;
            }
            if(passenger_data[sequence].country_of_issued_name != '' && passenger_data[sequence].country_of_issued_code != undefined){
//                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued;
                document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].country_of_issued_name;
                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_code;
//                auto_complete('adult_country_of_issued'+passenger_number);
            }
            //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
        }else{
            document.getElementById('adult_phone_code'+passenger_number).value = passenger_data[sequence].nationality_id.phone_code;
            document.getElementById('adult_phone'+passenger_number).value = passenger_data[sequence].mobile;
        }
        passenger_data_pick.push(passenger_data[sequence]);
        passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult'+passenger_number;
        document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].seq_id;
        auto_complete('adult_nationality'+passenger_number);
        $('#myModal_adult'+passenger_number).modal('hide');
    }else if(type == 'child'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'child'+passenger_number){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('child_title'+passenger_number).value = passenger_data[sequence].title;
        $('#child_title'+passenger_number).niceSelect('update');
        document.getElementById('child_first_name'+passenger_number).value = passenger_data[sequence].first_name;
        document.getElementById('child_first_name'+passenger_number).readOnly = true;
        document.getElementById('child_last_name'+passenger_number).value = passenger_data[sequence].last_name;
        document.getElementById('child_last_name'+passenger_number).readOnly = true;
        document.getElementById('child_nationality'+passenger_number).value = passenger_data[sequence].nationality_id.code;
        document.getElementById('child_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
        document.getElementById('child_birth_date'+passenger_number).readOnly = true;
        check_years_old(passenger_number,'child');
        if(product=='train'){
            document.getElementById('child_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
            document.getElementById('child_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
        }
        if(product=='airline'){
            passport_date = new Date(passenger_data[sequence].passport_expdate).toString().split(' ');
            passport_date = passport_date[2] + ' '+ passport_date[1] + ' ' + passport_date[3];
            document.getElementById('child_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
            document.getElementById('child_passport_expired_date'+passenger_number).value = passport_date;
            if(passenger_data[sequence].country_of_issued_name != '' && passenger_data[sequence].country_of_issued_code != undefined){
//                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued;
                document.getElementById('select2-child_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].country_of_issued_name;
                document.getElementById('child_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_code;
//                auto_complete('adult_country_of_issued'+passenger_number);
            }
//            document.getElementById('child_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
        }else{
            document.getElementById('child_phone_code'+passenger_number).value = passenger_data[sequence].nationality_id.phone_code;
            document.getElementById('child_phone'+passenger_number).value = passenger_data[sequence].mobile;
        }

        document.getElementById('child_id'+passenger_number).value = passenger_data[sequence].seq_id;
        passenger_data_pick.push(passenger_data[sequence]);
        passenger_data_pick[passenger_data_pick.length-1].sequence = 'child'+passenger_number;
        auto_complete('child_nationality'+passenger_number);
        $('#myModal_child'+passenger_number).modal('hide');
    }else if(type == 'infant'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'infant'+passenger_number){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('infant_title'+passenger_number).value = passenger_data[sequence].title;
        $('#infant_title'+passenger_number).niceSelect('update');
        document.getElementById('infant_first_name'+passenger_number).value = passenger_data[sequence].first_name;
        document.getElementById('infant_first_name'+passenger_number).readOnly = true;
        document.getElementById('infant_last_name'+passenger_number).value = passenger_data[sequence].last_name;
        document.getElementById('infant_last_name'+passenger_number).readOnly = true;
        document.getElementById('infant_nationality'+passenger_number).value = passenger_data[sequence].nationality_id.code;
        document.getElementById('infant_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
        document.getElementById('infant_birth_date'+passenger_number).readOnly = true;
        check_years_old(passenger_number,'infant');
        if(product=='train'){
            document.getElementById('infant_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
            document.getElementById('infant_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
        }
        if(product=='airline'){
            passport_date = new Date(passenger_data[sequence].passport_expdate).toString().split(' ');
            passport_date = passport_date[2] + ' '+ passport_date[1] + ' ' + passport_date[3];
            document.getElementById('infant_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
            document.getElementById('infant_passport_expired_date'+passenger_number).value = passport_date;
            if(passenger_data[sequence].country_of_issued_name != '' && passenger_data[sequence].country_of_issued_code != undefined){
//                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued;
                document.getElementById('select2-infant_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].country_of_issued_name;
                document.getElementById('infant_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_code;
//                auto_complete('adult_country_of_issued'+passenger_number);
            }
//            document.getElementById('infant_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
        }else{
            document.getElementById('infant_phone_code'+passenger_number).value = passenger_data[sequence].nationality_id.phone_code;
            document.getElementById('infant_phone'+passenger_number).value = passenger_data[sequence].mobile;
        }
        document.getElementById('infant_id'+passenger_number).value = passenger_data[sequence].seq_id;
        passenger_data_pick.push(passenger_data[sequence]);
        passenger_data_pick[passenger_data_pick.length-1].sequence = 'infant'+passenger_number;
        auto_complete('infant_nationality'+passenger_number);
        $('#myModal_infant'+passenger_number).modal('hide');
    }else if(type == 'Senior'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'senior'+passenger_number){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('senior_title'+passenger_number).value = passenger_data[sequence].title;
        $('#senior_title'+passenger_number).niceSelect('update');
        document.getElementById('senior_first_name'+passenger_number).value = passenger_data[sequence].first_name;
        document.getElementById('senior_first_name'+passenger_number).readOnly = true;
        document.getElementById('senior_last_name'+passenger_number).value = passenger_data[sequence].last_name;
        document.getElementById('senior_last_name'+passenger_number).readOnly = true;
        document.getElementById('senior_nationality'+passenger_number).value = passenger_data[sequence].nationality_id.code;
        document.getElementById('senior_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
        document.getElementById('senior_birth_date'+passenger_number).readOnly = true;
        check_years_old(passenger_number,'senior');
        if(product=='train'){
            document.getElementById('senior_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
            document.getElementById('senior_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
        }
        if(product=='airline'){
            passport_date = new Date(passenger_data[sequence].passport_expdate).toString().split(' ');
            passport_date = passport_date[2] + ' '+ passport_date[1] + ' ' + passport_date[3];
            document.getElementById('senior_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
            document.getElementById('senior_passport_expired_date'+passenger_number).value = passport_date;
            if(passenger_data[sequence].country_of_issued_name != '' && passenger_data[sequence].country_of_issued_code != undefined){
//                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued;
                document.getElementById('select2-senior_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].country_of_issued_name;
                document.getElementById('senior_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_code;
//                auto_complete('adult_country_of_issued'+passenger_number);
            }
            try{
//                document.getElementById('senior_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
            }catch(err){

            }
        }else{
            document.getElementById('senior_phone_code'+passenger_number).value = passenger_data[sequence].nationality_id.phone_code;
            document.getElementById('senior_phone'+passenger_number).value = passenger_data[sequence].mobile;
        }
        document.getElementById('senior_id'+passenger_number).value = passenger_data[sequence].seq_id;
        passenger_data_pick.push(passenger_data[sequence]);
        passenger_data_pick[passenger_data_pick.length-1].sequence = 'senior'+passenger_number;
        auto_complete('senior_nationality'+passenger_number);
        $('#myModal_senior'+passenger_number).modal('hide');
    }
}

function copy_booker_to_passenger(val,type){
    if(val == 'copy'){
        if(type == 'issued_offline'){
            try{
                document.getElementById('adult_title1').value;
            }catch(err){
                document.getElementsByName('myRadios')[1].checked = true;
                alert('Please add passenger first!');
            }
        }
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'adult1'){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        passenger_data_pick.push(booker_pick_passenger);
        passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult1';
        document.getElementById('adult_title1').value = document.getElementById('booker_title').value;
        $('#adult_title1').niceSelect('update');
        document.getElementById('adult_first_name1').value = document.getElementById('booker_first_name').value;
        document.getElementById('adult_first_name1').readOnly = true;
        document.getElementById('adult_last_name1').value = document.getElementById('booker_last_name').value;
        document.getElementById('adult_last_name1').readOnly = true;
        document.getElementById('adult_nationality1').value = document.getElementById('booker_nationality').value;
        document.getElementById('adult_birth_date1').value = document.getElementById('booker_birth_date').value;
        document.getElementById('adult_email1').value = document.getElementById('booker_email').value;
        document.getElementById('adult_phone1').value = document.getElementById('booker_phone').value;
        document.getElementById('adult_phone_code1').value = document.getElementById('booker_phone_code').value;
        if(document.getElementById('adult_birth_date1').value != '' && check_date(document.getElementById('adult_birth_date1').value) == true){
            check_years_old(1,'adult');
            document.getElementById('adult_birth_date1').readOnly = true;
        }
        if(type == 'train'){
            document.getElementById('adult_phone_code1').value = document.getElementById('booker_phone_code').value;
            document.getElementById('adult_phone1').value = document.getElementById('booker_phone').value;
            if(document.getElementById('adult_years_old1').value >= 17){
                document.getElementById('adult_id_type1').value = document.getElementById('booker_id_type').value;
                $('#adult_id_type1').niceSelect('update');
                document.getElementById('adult_id_number1').value = document.getElementById('booker_id_number').value;
            }
        }else if(type == 'airline'){
            if(document.getElementById('booker_id_type').value == 'pas'){
                document.getElementById('adult_id_type1').value = document.getElementById('booker_id_type').value;
                $('#adult_id_type1').niceSelect('update');
                document.getElementById('adult_id_number1').value = document.getElementById('booker_id_number').value;
            }
            console.log(document.getElementById('booker_country_of_issued').value);
            if(document.getElementById('booker_country_of_issued').value != 'undefined' && document.getElementById('booker_country_of_issued').value != '')
                document.getElementById('adult_country_of_issued1').value = document.getElementById('booker_country_of_issued').value;
        }
        document.getElementById('adult_id1').value = document.getElementById('booker_id').value;
    }else{
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'adult1'){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('adult_title1').value = 'MR';
        $('#adult_title1').niceSelect('update');
        document.getElementById('adult_first_name1').value = '';
        document.getElementById('adult_first_name1').readOnly = false;
        document.getElementById('adult_last_name1').value = '';
        document.getElementById('adult_last_name1').readOnly = false;
        document.getElementById('adult_nationality1').value = '';
        document.getElementById('adult_phone_code1').value = '62';
        document.getElementById('adult_phone1').value = '';
        document.getElementById('adult_phone1').readOnly = false;
        document.getElementById('adult_id1').value = '';
        document.getElementById('adult_email1').value = '';
        document.getElementById('adult_phone1').value = '62';
        document.getElementById('adult_phone_code1').value = '';
    }
}

function clear_passenger(type, sequence){
    if(type == 'Booker'){
        document.getElementById('booker_title').value = 'MR';
        document.getElementById('booker_first_name').value = '';
        document.getElementById('booker_first_name').readOnly = false;
        document.getElementById('booker_last_name').value = '';
        document.getElementById('booker_last_name').readOnly = false;
        document.getElementById('booker_nationality').value = 'ID';
        document.getElementById('booker_email').value = '';
        document.getElementById('booker_email').readOnly = false;
        document.getElementById('booker_phone_code').value = '62';
        document.getElementById('booker_phone').value = '';
        document.getElementById('booker_phone').readOnly = false;
        document.getElementById('booker_id').value = '';
        booker_pick_passenger= {};
    }else if(type == 'Adult'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'adult'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('adult_title'+sequence).value = 'MR';
        document.getElementById('adult_first_name'+sequence).value = '';
        document.getElementById('adult_first_name'+sequence).readOnly = false;
        document.getElementById('adult_last_name'+sequence).value = '';
        document.getElementById('adult_last_name'+sequence).readOnly = false;
        document.getElementById('adult_nationality'+sequence).value = 'ID';
        document.getElementById('adult_birth_date'+passenger_number).value = '';
        document.getElementById('adult_birth_date'+passenger_number).readOnly = false;
        document.getElementById('adult_id_type'+passenger_number).value = 'ktp';
        document.getElementById('adult_id_number'+passenger_number).value = '';
        document.getElementById('adult_phone_code'+sequence).value = '62';
        document.getElementById('adult_phone'+sequence).value = '';
        document.getElementById('adult_id'+sequence).value = '';
    }else if(type == 'Infant'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'infant'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('infant_title'+sequence).value = 'MSTR';
        document.getElementById('infant_first_name'+sequence).value = '';
        document.getElementById('infant_first_name'+sequence).readOnly = false;
        document.getElementById('infant_last_name'+sequence).value = '';
        document.getElementById('infant_last_name'+sequence).readOnly = false;
        document.getElementById('infant_nationality'+sequence).value = 'ID';
        document.getElementById('infant_birth_date'+passenger_number).value = '';
        document.getElementById('infant_birth_date'+passenger_number).readOnly = false;
        document.getElementById('infant_id'+sequence).value = '';
    }else if(type == 'Senior'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'senior'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('senior_title'+sequence).value = 'MR';
        document.getElementById('senior_first_name'+sequence).value = '';
        document.getElementById('senior_first_name'+sequence).readOnly = false;
        document.getElementById('senior_last_name'+sequence).value = '';
        document.getElementById('senior_last_name'+sequence).readOnly = false;
        document.getElementById('senior_nationality'+sequence).value = 'ID';
        document.getElementById('senior_birth_date'+passenger_number).value = '';
        document.getElementById('senior_birth_date'+passenger_number).readOnly = false;
        document.getElementById('senior_id_type'+passenger_number).value = 'ktp';
        document.getElementById('senior_id_number'+passenger_number).value = '';
        document.getElementById('senior_phone_code'+sequence).value = '62';
        document.getElementById('senior_phone'+sequence).value = '';
        document.getElementById('senior_id'+sequence).value = '';
    }else if(type == 'Child'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'child'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('child_title'+sequence).value = 'MSTR';
        document.getElementById('child_first_name'+sequence).value = '';
        document.getElementById('child_first_name'+sequence).readOnly = false;
        document.getElementById('child_last_name'+sequence).value = '';
        document.getElementById('child_last_name'+sequence).readOnly = false;
        document.getElementById('child_nationality'+sequence).value = 'ID';
        document.getElementById('senior_birth_date'+passenger_number).value = '';
        document.getElementById('senior_birth_date'+passenger_number).readOnly = false;
        document.getElementById('senior_id_type'+passenger_number).value = 'ktp';
        document.getElementById('senior_id_number'+passenger_number).value = '';
        document.getElementById('child_phone_code'+sequence).value = '62';
        document.getElementById('child_phone'+sequence).value = '';
        document.getElementById('child_id'+sequence).value = '';
    }
}

function check_email(value){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value)
}

function check_date(value){
    var a = moment(value,'DD MMM YYYY');
    return a._isValid;
}

function check_time(value){
    return value.match('/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/') != null
}

function check_date_time(value){
    var a = check_date(moment(value.split(' ')[0]).format('YYYY-MM-DD'));
    var b = check_time(value.split(' ')[1]);
    if(a==true && b==true)
        return true;
    else
        return false;
}

function check_ktp(value){
    var checknumber = "^[0-9]*$";//number
    if(value.match(checknumber)!=null){
        if(value.length==16){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function check_sim(value){
    var checknumber = "^[0-9]*$";//number
    if(value.match(checknumber)!=null){
        if(value.length==12 || value.length==13){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function check_passport(value){
    if(value.length>4){
        return true;
    }else{
        return false;
    }
}

function check_phone_number(value){
    var checknumber = "^[0-9]*$";//number
    if(value.match(checknumber)!=null){
        if(value.length>8 && value.length < 14){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function check_number(value){
    var checknumber = "^[0-9]*$";//number
    if(value.match(checknumber)!=null){
        return true;
    }else{
        return false;
    }
}

function check_word(value){
    var checkword = "^[A-z ]*$";
    if(value.match(checkword)!=null){
        return true;
    }else{

        return false;
    }
}

function check_name(title,first,last, length){
    var val = title+first+' '+last;
    if(val.length < length){
        return true;
    }else
        return false;
}

function check_regex(value,regex){
    var val = regex;//number
    if(value.match(val)!=null){
        return true;
    }else{
        return false;
    }
}

//backend

function get_agent_booking(type){
    load_more = false;
    getToken();
    if(type == 'reset'){
        agent_offset = 0;
        data_counter = 0;
        data_search = [];
        document.getElementById("table_reservation").innerHTML = `
                    <tr>
                        <th style="width:2%;">No.</th>
                        <th style="width:10%;">Name</th>
                        <th style="width:7%;">Provider</th>
                        <th style="width:8%;">State</th>
                        <th style="width:5%;">PNR</th>
                        <th style="width:8%;">Agent</th>
                        <th style="width:12%;">Book Date</th>
                        <th style="width:12%;">Hold Date</th>
                        <th style="width:12%;">Issued Date</th>
                        <th style="width:9%;">Issued By</th>
                        <th style="width:7%;">Action</th>
                    </tr>`;
    }
    var tb_value = '';
    var pnr_value = '';
    var type_search = '';

     try{
        type_search = document.getElementById('tb').value
    }catch(err){
    }
    try{
        tb_value = document.getElementById('search_tb').checked;
    }catch(err){
    }
    try{
        pnr_value = document.getElementById('search_pnr').checked;
    }catch(err){
    }
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_agent_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
        'offset': agent_offside,
        'name': type_search,
        'tb': tb_value,
        'pnr': pnr_value
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            try{
                if(msg.result.response.transport_booking.length == 80){
                    agent_offside++;
                    table_reservation(msg.result.response.transport_booking);
                    load_more = true;
                }else{
                    table_reservation(msg.result.response.transport_booking);
                }
            }catch(err){
                set_notification(msg.result.response.transport_booking);
            }
        }else{
            alert('Oops, something when wrong please contact HO !');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_top_up_history(){
    load_more = false;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_top_up_history',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
        'offset': agent_offside
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            if(msg.result.response.top_up.length == 80){
                agent_offside++;
                table_top_up_history(msg.result.response.top_up);
                load_more = true;
            }else{
                table_top_up_history(msg.result.response.top_up);
            }
        }else{
            alert('Oops, something when wrong please contact HO !');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

//function get_top_up_amount(){
//    getToken();
//    $.ajax({
//       type: "POST",
//       url: "/webservice/agent",
//       headers:{
//            'action': 'get_top_up_amount',
//       },
////       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
//       data: {},
//       success: function(msg) {
//       msg.response = JSON.parse(msg.response)
//        console.log(msg);
//        if(msg.error_code == 0){
//            text = '';
//            for(i in msg.response.result)
//                text += `<option value="`+msg.response.result[i].id+`" data-amount="`+msg.response.result[i].amount+`">`+msg.response.result[i].name+`</option>`;
//            document.getElementById('amount').innerHTML = text;
//            total_price_top_up();
//        }else{
//
//        }
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//           alert(errorThrown);
//       }
//    });
//}


function create_top_up(amount, unique_amount){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'create_top_up',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
           "amount_id": amount,
           "unique_amount": unique_amount
       },
       success: function(msg) {
        console.log(msg);
        response = {
            "top_up_name": "TU.12345",
            "non_member": {
                "transfer": [
                  {
                    "seq_id": "PQR.1055001",
                    "name": "BCA",
                    "account_name": "Jepro B BCA",
                    "account_number": "5151551",
                    "bank": {
                      "name": "BANK BCA",
                      "code": "014"
                    },
                    "type": "transfer",
                    "provider_id": "",
                    "currency": "IDR",
                    "price_component": {
                      "amount": 289289300,
                      "fee": 0,
                      "unique_amount": 571
                    },
                    "total_amount": 289289871,
                    "image": "",
                    "return_url": "/payment/transfer/feedback?acq_id=22"
                  }
                ],
                "cash": [
                  {
                    "seq_id": false,
                    "name": "Cash",
                    "account_name": "-",
                    "account_number": "",
                    "bank": {
                      "name": "",
                      "code": ""
                    },
                    "type": "cash",
                    "provider_id": "",
                    "currency": "IDR",
                    "price_component": {
                      "amount": 289289300,
                      "fee": 0,
                      "unique_amount": 0
                    },
                    "total_amount": 289289300,
                    "image": "",
                    "return_url": "/payment/cash/feedback?acq_id=11"
                  }
                ]
              },
              "member": {
                "credit_limit": []
              }
        };
        document.getElementById('top_up_name').innerHTML = `<span>`+response.top_up_name+`</span>`;
        document.getElementById('total_amount').innerHTML = `<span>`+response.non_member.transfer[0].total_amount+`</span>`;
        text = '';
//            payment_selection
        counter = 0;
        for(i in response.non_member){
            if(i == 'cash'){
                text += `<option id="payment`+counter+`" value="`+i+`">Cash</option>`;
            }else if(i == 'transfer'){
                text += `<option id="payment`+counter+`" value="`+i+`">Transfer Manual</option>`;
            }else if(i == 'sgo_va'){
                text += `<option id="payment`+counter+`" value="`+i+`">Virtual Account</option>`;
            }
        }
        document.getElementById('payment_selection').innerHTML = text;
        payment_top_up();
//        $('#payment_selection').niceSelect('update');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function top_up_payment(){
    var radios = document.getElementsByName('acquirer');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            id = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'top_up_payment',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
           'token': response.token,
           'acq_id': id

       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            alert(msg.result.response.message);
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            logout();
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

//PAYMENT SGO

function get_merchant_info(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_merchant_info',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {

       },
       success: function(msg) {
        console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function request_va(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'request_va',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {

       },
       success: function(msg) {
        console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function request_inv_va(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'request_inv_va',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {

       },
       success: function(msg) {
        console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_voucher(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_voucher',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {

       },
       success: function(msg) {
        console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function logout(){
    document.getElementById('form_logout').submit();
    //logout here
}