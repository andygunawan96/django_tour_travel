passenger_data = [];
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

function get_balance(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_balance',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        if(msg.result.error_code == 0){
            document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
            console.log('success');
        }else{
            console.log('error');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function check_string_length(value){
    return value.length;
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
//            search_text = '';
//            if(passenger == 'Adult')
//                search_text = $('#train_adult'+number.toString()+'_search').val()
//            else if(passenger == 'Child')
//                search_text = $('#train_child'+number.toString()+'_search').val()
//            else if(passenger == 'Senior')
//                search_text = $('#train_senior'+number.toString()+'_search').val()
//            else if(passenger == 'Infant')
//                search_text = $('#train_infant'+number.toString()+'_search').val()
            $.ajax({
               type: "POST",
               url: "/webservice/agent",
               headers:{
                    'action': 'get_agent_passenger',
               },
        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
               data: {
                    "search_value": passenger_search[0],
                    "pax_type": passenger_search[1]
               },
               success: function(msg) {
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
    console.log(type);
    console.log(sequence);
    console.log(product);
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
        document.getElementById('booker_first_name').value = passenger_data[sequence].first_name;
        document.getElementById('booker_last_name').value = passenger_data[sequence].last_name;
        document.getElementById('booker_nationality').value = passenger_data[sequence].nationality_id.code;
        document.getElementById('booker_email').value = passenger_data[sequence].email;
        document.getElementById('booker_phone_code').value = passenger_data[sequence].nationality_id.phone_code;
        document.getElementById('booker_phone').value = passenger_data[sequence].mobile;
        document.getElementById('booker_id').value = passenger_data[sequence].id;
        $('#myModal').modal('hide');
    }else if(type == 'Adult'){

        document.getElementById('adult_title'+passenger_number).value = passenger_data[sequence].title;
        document.getElementById('adult_first_name'+passenger_number).value = passenger_data[sequence].first_name;
        document.getElementById('adult_last_name'+passenger_number).value = passenger_data[sequence].last_name;
        document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_id.code;
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
                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
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
            passport_date = new Date(passenger_data[sequence].passport_expdate).toString().split(' ');
            console.log(passport_date);
            passport_date = passport_date[2] + ' '+ passport_date[1] + ' ' + passport_date[3];
            document.getElementById('adult_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
            document.getElementById('adult_passport_expired_date'+passenger_number).value = passport_date;
            document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
        }else{
            document.getElementById('adult_phone_code'+passenger_number).value = passenger_data[sequence].nationality_id.phone_code;
            document.getElementById('adult_phone'+passenger_number).value = passenger_data[sequence].mobile;
        }
        document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].id;
        $('#myModal_adult'+passenger_number).modal('hide');
    }else if(type == 'Child'){
        document.getElementById('child_title'+passenger_number).value = passenger_data[sequence].title;
        document.getElementById('child_first_name'+passenger_number).value = passenger_data[sequence].first_name;
        document.getElementById('child_last_name'+passenger_number).value = passenger_data[sequence].last_name;
        document.getElementById('child_nationality'+passenger_number).value = passenger_data[sequence].nationality_id.code;
        document.getElementById('child_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
        check_years_old(passenger_number,'child');
        if(product=='train'){
            document.getElementById('child_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
            document.getElementById('child_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
        }
        if(product=='airline'){
            passport_date = new Date(passenger_data[sequence].passport_expdate).toString().split(' ');
            console.log(passport_date);
            passport_date = passport_date[2] + ' '+ passport_date[1] + ' ' + passport_date[3];
            document.getElementById('child_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
            document.getElementById('child_passport_expired_date'+passenger_number).value = passport_date;
            document.getElementById('child_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
        }else{
            document.getElementById('child_phone_code'+passenger_number).value = passenger_data[sequence].nationality_id.phone_code;
            document.getElementById('child_phone'+passenger_number).value = passenger_data[sequence].mobile;
        }

        document.getElementById('child_id'+passenger_number).value = passenger_data[sequence].id;
        $('#myModal_child'+passenger_number).modal('hide');
    }else if(type == 'Infant'){
        document.getElementById('infant_title'+passenger_number).value = passenger_data[sequence].title;
        document.getElementById('infant_first_name'+passenger_number).value = passenger_data[sequence].first_name;
        document.getElementById('infant_last_name'+passenger_number).value = passenger_data[sequence].last_name;
        document.getElementById('infant_nationality'+passenger_number).value = passenger_data[sequence].nationality_id.code;
        document.getElementById('infant_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
        check_years_old(passenger_number,'infant');
        if(product=='train'){
            document.getElementById('infant_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
            document.getElementById('infant_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
        }
        if(product=='airline'){
            passport_date = new Date(passenger_data[sequence].passport_expdate).toString().split(' ');
            console.log(passport_date);
            passport_date = passport_date[2] + ' '+ passport_date[1] + ' ' + passport_date[3];
            document.getElementById('infant_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
            document.getElementById('infant_passport_expired_date'+passenger_number).value = passport_date;
            document.getElementById('infant_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
        }else{
            document.getElementById('infant_phone_code'+passenger_number).value = passenger_data[sequence].nationality_id.phone_code;
            document.getElementById('infant_phone'+passenger_number).value = passenger_data[sequence].mobile;
        }
        document.getElementById('infant_id'+passenger_number).value = passenger_data[sequence].id;
        $('#myModal_infant'+passenger_number).modal('hide');
    }else if(type == 'Senior'){
        document.getElementById('senior_title'+passenger_number).value = passenger_data[sequence].title;
        document.getElementById('senior_first_name'+passenger_number).value = passenger_data[sequence].first_name;
        document.getElementById('senior_last_name'+passenger_number).value = passenger_data[sequence].last_name;
        document.getElementById('senior_nationality'+passenger_number).value = passenger_data[sequence].nationality_id.code;
        document.getElementById('senior_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
        check_years_old(passenger_number,'senior');
        if(product=='train'){
            document.getElementById('senior_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
            document.getElementById('senior_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
        }
        if(product=='airline'){
            passport_date = new Date(passenger_data[sequence].passport_expdate).toString().split(' ');
            console.log(passport_date);
            passport_date = passport_date[2] + ' '+ passport_date[1] + ' ' + passport_date[3];
            document.getElementById('senior_passport_number'+passenger_number).value = passenger_data[sequence].passport_number;
            document.getElementById('senior_passport_expired_date'+passenger_number).value = passport_date;
            document.getElementById('senior_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
        }else{
            document.getElementById('senior_phone_code'+passenger_number).value = passenger_data[sequence].nationality_id.phone_code;
            document.getElementById('senior_phone'+passenger_number).value = passenger_data[sequence].mobile;
        }
        document.getElementById('senior_id'+passenger_number).value = passenger_data[sequence].id;
        $('#myModal_senior'+passenger_number).modal('hide');
    }
}

function copy_booker_to_passenger(val){
    if(val == 'copy'){
        document.getElementById('adult_title1').value = document.getElementById('booker_title').value;
        document.getElementById('adult_first_name1').value = document.getElementById('booker_first_name').value;
        document.getElementById('adult_last_name1').value = document.getElementById('booker_last_name').value;
        document.getElementById('adult_nationality1').value = document.getElementById('booker_nationality').value;
        if(type == 'train'){
            document.getElementById('adult_phone_code1').value = document.getElementById('booker_phone_code').value;
            document.getElementById('adult_phone1').value = document.getElementById('booker_phone').value;
        }
        document.getElementById('adult_id1').value = document.getElementById('booker_id').value;
    }else{
        document.getElementById('adult_title1').value = 'MR';
        document.getElementById('adult_first_name1').value = '';
        document.getElementById('adult_last_name1').value = '';
        document.getElementById('adult_nationality1').value = '';
        document.getElementById('adult_phone_code1').value = '62';
        document.getElementById('adult_phone1').value = '';
        document.getElementById('adult_id1').value = '';
    }
}

function clear_passenger(type, sequence){
    if(type == 'Booker'){
        document.getElementById('booker_title').value = 'MR';
        document.getElementById('booker_first_name').value = '';
        document.getElementById('booker_last_name').value = '';
        document.getElementById('booker_nationality').value = '';
        document.getElementById('booker_email').value = '';
        document.getElementById('booker_phone_code').value = '62';
        document.getElementById('booker_phone').value = '';
        document.getElementById('booker_id').value = '';
    }else if(type == 'Adult'){
        document.getElementById('adult_title'+sequence).value = 'MR';
        document.getElementById('adult_first_name'+sequence).value = '';
        document.getElementById('adult_last_name'+sequence).value = '';
        document.getElementById('adult_nationality'+sequence).value = '';
        document.getElementById('adult_birth_date'+passenger_number).value = '';
        document.getElementById('adult_id_type'+passenger_number).value = 'ktp';
        document.getElementById('adult_id_number'+passenger_number).value = '';
        document.getElementById('adult_phone_code'+sequence).value = '62';
        document.getElementById('adult_phone'+sequence).value = '';
        document.getElementById('adult_id'+sequence).value = '';
    }else if(type == 'Infant'){
        document.getElementById('infant_title'+sequence).value = 'MSTR';
        document.getElementById('infant_first_name'+sequence).value = '';
        document.getElementById('infant_last_name'+sequence).value = '';
        document.getElementById('infant_nationality'+sequence).value = '';
        document.getElementById('infant_birth_date'+passenger_number).value = '';
        document.getElementById('infant_id'+sequence).value = '';
    }else if(type == 'Senior'){
        document.getElementById('senior_title'+sequence).value = 'MR';
        document.getElementById('senior_first_name'+sequence).value = '';
        document.getElementById('senior_last_name'+sequence).value = '';
        document.getElementById('senior_nationality'+sequence).value = '';
        document.getElementById('senior_birth_date'+passenger_number).value = '';
        document.getElementById('senior_id_type'+passenger_number).value = 'ktp';
        document.getElementById('senior_id_number'+passenger_number).value = '';
        document.getElementById('senior_phone_code'+sequence).value = '62';
        document.getElementById('senior_phone'+sequence).value = '';
        document.getElementById('senior_id'+sequence).value = '';
    }else if(type == 'Child'){
        document.getElementById('child_title'+sequence).value = 'MSTR';
        document.getElementById('child_first_name'+sequence).value = '';
        document.getElementById('child_last_name'+sequence).value = '';
        document.getElementById('child_nationality'+sequence).value = '';
        document.getElementById('senior_birth_date'+passenger_number).value = '';
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
    var a = moment(value,'YYYY-MM-DD');
    return a._d;
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
    console.log(type);
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
                        <th style="width:8%;">Contact</th>
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
                console.log('dari home');
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

function get_top_up_amount(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_top_up_amount',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       msg.response = JSON.parse(msg.response)
        console.log(msg);
        if(msg.error_code == 0){
            text = '';
            for(i in msg.response.result)
                text += `<option value="`+msg.response.result[i].id+`" data-amount="`+msg.response.result[i].amount+`">`+msg.response.result[i].name+`</option>`;
            document.getElementById('amount').innerHTML = text;
            total_price_top_up();
        }else{

        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function check_top_up(){
    error_text = '';
    if(document.getElementById('tac_checkbox').checked == false){
        error_text += 'Please check Term and Conditions\n';
    }
    if(parseInt(document.getElementById('qty').value) <= 0){
        error_text += 'Please Input Qty\n';
    }
    if(error_text == ''){
        document.getElementById('top_up_form').submit();
    }else{
        alert(error_text);
    }
}

function create_top_up(amount, qty, unique_amount){
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
           "qty": qty,
           "unique_amount": unique_amount
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            response = msg.result.response;
            document.getElementById('top_up_name').innerHTML = `<span>`+response.top_up_name+`</span>`;
            document.getElementById('total_amount').innerHTML = `<span>`+response.acquirers.cash[0].amount+`</span>`;
            text = '';
//            payment_selection
            counter = 0;
            for(i in response.acquirers){
                if(i == 'cash'){
                    text += `<option id="payment`+counter+`" value="`+i+`">Cash</option>`;
                }else if(i == 'tt_transfer'){
                    text += `<option id="payment`+counter+`" value="`+i+`">Transfer Manual</option>`;
                }else if(i == 'sgo_va'){
                    text += `<option id="payment`+counter+`" value="`+i+`">Virtual Account</option>`;
                }
            }
            document.getElementById('payment_selection').innerHTML = text;
            payment_top_up();
            $('#payment_selection').niceSelect('update');
        }else{

        }
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
    console.log(id);
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
        }else{

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