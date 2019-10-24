passenger_data = [];
passenger_data_pick = [];
booker_pick_passenger = {};
passenger_number = 0;
agent_offside = 0;
load_more = true;
function signin(){
    if($('#username').val() != '' && $('#password').val() != ''){
        $('.button-login').addClass("running");
        $('.button-login').prop('disabled', true);

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
            console.log(msg);
            if(msg == true){
                let timerInterval
                Swal.fire({
                  type: 'success',
                  title: 'Login Success!',
                  html: 'Please Wait ...',
                  timer: 2000,
                  onBeforeOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                      Swal.getContent().querySelector('strong')
                        .textContent = Swal.getTimerLeft()
                    }, 100)
                  },
                  onClose: () => {
                    clearInterval(timerInterval)
                  }
                }).then((result) => {
                  if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.timer
                  ) {
                    gotoForm();
                  }
                })
            }else{
                $('.button-login').prop('disabled', false);
                $('.button-login').removeClass("running");

                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Please input correct username or password',
                })
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               alert(errorThrown);
           }
        });
    }else{
        $('.button-login').prop('disabled', false);
        $('.button-login').removeClass("running");
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Please input username or password',
        })
    }
}

function get_path_url_server(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'static_path_url_server',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
       },
       success: function(msg) {
        console.log(msg);
        static_path_url_server = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function triggered_balance(val){
    var timeInterval = setInterval(function() {
        if(time!=0){
            time--;
        }else{
            get_balance(val);
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

function set_passenger_number(val){
    passenger_number = val;
}

function get_customer_list(passenger, number, product){
    getToken();
    if(passenger == 'booker'){
        $('.loading-booker-train').show();

        var minAge = '';
        var maxAge = '';
        try{
            minAge = document.getElementById('booker_min_age').value;
            maxAge = document.getElementById('booker_max_age').value;
        }
        catch(err){

        }

        if(document.getElementById('train_booker_search').value.length >= 2){
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
                    'minAge': minAge,
                    'maxAge': maxAge,
                    'signature': signature
               },
               success: function(msg) {
                console.log(msg);
                if(msg.result.error_code==0){
                    var response = '';
                    var like_name_booker = document.getElementById('train_booker_search').value;
                    if(msg.result.response.length != 0){
                        response+=`
                        <div class="alert alert-success" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search"></i> We found `+msg.result.response.length+` user(s) with name like " `+like_name_booker+` "</h6></div>
                        <div style="overflow:auto;height:300px;margin-top:10px;">
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
                                    <i class="fas fa-user"></i> `+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name+``;
                                        if(msg.result.response[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.result.response[i].birth_date+`</span>`;
                                        if(msg.result.response[i].phones.length != 0)
                                            response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.result.response[i].phones[msg.result.response[i].phones.length-1].calling_code + ' - ' + msg.result.response[i].phones[msg.result.response[i].phones.length-1].calling_number+`</span>`;
                                        if(msg.result.response[i].nationality_name != '')
                                            response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.result.response[i].nationality_name+`</span>`;
                                        if(msg.result.response[i].identities.hasOwnProperty('passport') == true)
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.result.response[i].identities.passport.identity_number+`</span>`;
                                        else if(msg.result.response[i].identities.hasOwnProperty('ktp') == true)
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.result.response[i].identities.ktp.identity_number+`</span>`;
                                        else if(msg.result.response[i].identities.hasOwnProperty('sim') == true)
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.result.response[i].identities.sim.identity_number+`</span>`;
                                    response+=`
                                </td>`;
    //                            <td>`+msg.response.result[i].booker_type+`</td>
    //                            <td>Rp. `+getrupiah(msg.response.result[i].agent_id.credit_limit+ msg.response.result[i].agent_id.balance)+`</td>
                                response+=`<td><button type="button" class="primary-btn-custom" onclick="pick_passenger('Booker',`+msg.result.response[i].sequence+`,'`+product+`');">Choose</button></td>
                            </tr>`;
                        }
                        response+=`</table></div>`;
                        document.getElementById('search_result').innerHTML = response;
                        passenger_data = msg.result.response;
                        $('.loading-booker-train').hide();
                    }else{
                        response = '';
                        response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search-minus"></i> Oops! User not found!</h6></div></center>`;
                        document.getElementById('search_result').innerHTML = response;
                        $('.loading-booker-train').hide();
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    logout();
                    $('.loading-booker-train').hide();
                }else{
                    alert(msg.result.error_msg);
                    $('.loading-booker-train').hide();
                }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(errorThrown);
                   $('.loading-booker-train').hide();
               }
            });
        }else{
            $('.loading-booker-train').hide();
            response = '';
            response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-times-circle"></i> Please input more than 1 letter!</h6></div></center>`;
            document.getElementById('search_result').innerHTML = response;
        }

    }else{
        $(".loading-pax-train").show();

        var minAge = '';
        var maxAge = '';
        try{
            minAge = document.getElementById('train_'+passenger+number+'_min_age').value;
            maxAge = document.getElementById('train_'+passenger+number+'_max_age').value;
        }
        catch(err){

        }
        if(document.getElementById('train_'+passenger+number+'_search').value.length >= 2){
            $.ajax({
               type: "POST",
               url: "/webservice/agent",
               headers:{
                    'action': 'get_customer_list',
               },
        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
               data: {
                    'name': document.getElementById('train_'+passenger+number+'_search').value,
                    'product': product,
                    'passenger_type': passenger,
                    'minAge': minAge,
                    'maxAge': maxAge,
                    'signature': signature
               },
               success: function(msg) {
                console.log(msg);
                if(msg.result.error_code==0){
                    var response = '';
                    var like_name_paxs = document.getElementById('train_'+passenger+number+'_search').value;
                    if(msg.result.response.length != 0){
                        response+=`
                        <div class="alert alert-success" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search"></i> We found `+msg.result.response.length+` user(s) with name like " `+like_name_paxs+` "</h6></div>
                        <div style="overflow:auto;height:300px;margin-top:10px;">
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
                                    <i class="fas fa-user"></i> `+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name+``;
                                        if(msg.result.response[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.result.response[i].birth_date+`</span>`;
                                        if(msg.result.response[i].phones.length != 0)
                                            response+=`<br/> <span><i class="fas fa-mobile-alt"></i> `+msg.result.response[i].phones[msg.result.response[i].phones.length-1].calling_code + ' - ' + msg.result.response[i].phones[msg.result.response[i].phones.length-1].calling_number+`</span>`;
                                        if(msg.result.response[i].nationality_name != '')
                                            response+=`<br/> <span><i class="fas fa-globe-asia"></i> `+msg.result.response[i].nationality_name+`</span>`;
                                        if(msg.result.response[i].identities.hasOwnProperty('passport') == true)
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.result.response[i].identities.passport.identity_number+`</span>`;
                                        else if(msg.result.response[i].identities.hasOwnProperty('ktp') == true)
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.result.response[i].identities.ktp.identity_number+`</span>`;
                                        else if(msg.result.response[i].identities.hasOwnProperty('sim') == true)
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.result.response[i].identities.sim.identity_number+`</span>`;
                                    response+=`
                                </td>`;
    //                            <td>`+msg.response.result[i].booker_type+`</td>
    //                            <td>Rp. `+getrupiah(msg.response.result[i].agent_id.credit_limit+ msg.response.result[i].agent_id.balance)+`</td>
                                response+=`<td><button type="button" class="primary-btn-custom" style="line-height:25px;" onclick="pick_passenger('`+passenger+`',`+msg.result.response[i].sequence+`,'`+product+`');">Choose</button></td>
                            </tr>`;
                        }
                        response+=`</table></div>`;
                        document.getElementById('search_result_'+passenger+number).innerHTML = response;
                        passenger_data = msg.result.response;
                        $('.loading-pax-train').hide();
                    }else{
                        response = '';
                        response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search-minus"></i> Oops! User nof found!</h6></div></center>`;
                        document.getElementById('search_result_'+passenger+number).innerHTML = response;
                        $('.loading-pax-train').hide();
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    logout();
                    $('.loading-pax-train').hide();
                }else{
                    alert(msg.result.error_msg);
                    $('.loading-pax-train').hide();
                }

               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(errorThrown);
                   $('.loading-pax-train').hide();
               }
            });
        }else{
            $('.loading-pax-train').hide();
            response = '';
            response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-times-circle"></i> Please input more than 1 letter!</h6></div></center>`;
            document.getElementById('search_result_'+passenger+number).innerHTML = response;
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
        for(i in document.getElementById('booker_title').options){
            if(document.getElementById('booker_title').options[i].selected != true)
               document.getElementById('booker_title').options[i].disabled = true;
        }
        if(template != 4){
            $('#booker_title').niceSelect('update');
        }
        document.getElementById('booker_first_name').value = passenger_data[sequence].first_name;
        document.getElementById('booker_first_name').readOnly = true;
        document.getElementById('booker_last_name').value = passenger_data[sequence].last_name;
        document.getElementById('booker_last_name').readOnly = true;
        if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
            document.getElementById('select2-booker_nationality_id-container').innerHTML = passenger_data[sequence].nationality_name;
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
        }else if(product == 'airline' || product == 'visa' || product == 'activity'){
            if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                document.getElementById('booker_id_number').value = passenger_data[sequence].identities.passport.identity_number;
                document.getElementById('booker_id_number').readOnly = true;
                document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                document.getElementById('booker_country_of_issued').readOnly = true;
                document.getElementById('booker_exp_date').value = passenger_data[sequence].identities.passport.identity_expdate;
                document.getElementById('booker_exp_date').readOnly = true;

            }
        }
        auto_complete('booker_nationality');
        document.getElementById('booker_id').value = passenger_data[sequence].seq_id;
        //untuk booker check
        booker_pick_passenger = passenger_data[sequence];
        booker_pick_passenger.sequence = 0;
        $('#myModal').modal('hide');
    }else if(type == 'adult'){
        check = 0;
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].seq_id == passenger_data[sequence].seq_id)
                check = 1;
        }
        if(check == 0){
            for(i in passenger_data_pick){
                if(passenger_data_pick[i].sequence == 'adult'+passenger_number){
                    passenger_data_pick.splice(i,1);
                    break;
                }
            }
            document.getElementById('adult_title'+passenger_number).value = passenger_data[sequence].title;
            for(i in document.getElementById('adult_title'+passenger_number).options){
                if(document.getElementById('adult_title'+passenger_number).options[i].selected != true)
                    document.getElementById('adult_title'+passenger_number).options[i].disabled = true;
            }
            if(template != 4){
                $('#adult_title'+passenger_number).niceSelect('update');
            }

            console.log(document.getElementById('adult_title'+passenger_number).options);
            document.getElementById('adult_first_name'+passenger_number).value = passenger_data[sequence].first_name;
            document.getElementById('adult_first_name'+passenger_number).readOnly = true;
            document.getElementById('adult_last_name'+passenger_number).value = passenger_data[sequence].last_name;
            document.getElementById('adult_last_name'+passenger_number).readOnly = true;
            document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                document.getElementById('select2-adult_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            }
            document.getElementById('adult_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
            check_years_old(passenger_number,'adult');
            if(parseInt(document.getElementById('adult_years_old'+passenger_number).value) >= 17){
                if(product=='train'){//ganti
    //                document.getElementById('adult_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
    //                document.getElementById('adult_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
                }
            }
            if(product=='airline' || product == 'activity' || product == 'visa'){
                if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                    document.getElementById('adult_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
                    document.getElementById('adult_passport_number'+passenger_number).readOnly = true;
                    if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
                        document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        auto_complete('adult_country_of_issued'+passenger_number);
                        document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                    }
                    if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
                        document.getElementById('adult_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                    }
                }
                //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
            }
            try{
                document.getElementById('adult_phone_code'+passenger_number).value = passenger_data[sequence].phones[passenger_data[sequence].phones.length - 1].calling_code;
                document.getElementById('adult_phone'+passenger_number).value = passenger_data[sequence].phones[passenger_data[sequence].phones.length - 1].calling_number;
                document.getElementById('adult_email'+passenger_number).value = passenger_data[sequence].email;
            }catch(err){}
            passenger_data_pick.push(passenger_data[sequence]);
            passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult'+passenger_number;
            document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].seq_id;
            auto_complete('adult_nationality'+passenger_number);
            if(template != 4){
    //            if (document.getElementById("default-select")) {
    //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
    //                $('#adult_nationality1_id').niceSelect('update');
    //            };
                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
                $('#adult_country_of_issued'+passenger_number).niceSelect('update');
            }

            $('#myModal_adult'+passenger_number).modal('hide');
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: "You can't choose same person in 1 booking",
          })
        }
    }else if(type == 'child'){
        check = 0;
            for(i in passenger_data_pick){
                if(passenger_data_pick[i].seq_id == passenger_data[sequence].seq_id)
                    check = 1;
            }
        if(check == 0){
            for(i in passenger_data_pick){
                if(passenger_data_pick[i].sequence == 'child'+passenger_number){
                    passenger_data_pick.splice(i,1);
                    break;
                }
            }
            document.getElementById('child_title'+passenger_number).value = passenger_data[sequence].title;
            for(i in document.getElementById('child_title'+passenger_number).options){
                if(document.getElementById('child_title'+passenger_number).options[i].selected != true)
                    document.getElementById('child_title'+passenger_number).options[i].disabled = true;
            }
            if(template != 4){
                $('#child_title'+passenger_number).niceSelect('update');
            }
            document.getElementById('child_first_name'+passenger_number).value = passenger_data[sequence].first_name;
            document.getElementById('child_first_name'+passenger_number).readOnly = true;
            document.getElementById('child_last_name'+passenger_number).value = passenger_data[sequence].last_name;
            document.getElementById('child_last_name'+passenger_number).readOnly = true;
            document.getElementById('child_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                document.getElementById('select2-child_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                document.getElementById('child_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            }
            document.getElementById('child_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
            check_years_old(passenger_number,'child');
    //        if(parseInt(document.getElementById('adult_years_old'+passenger_number).value) >= 17){
    //            console.log(template);
    //            console.log(product);
    //            if(product=='train'){//ganti
    ////                document.getElementById('adult_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
    ////                document.getElementById('adult_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
    //            }
    //        }
            if(product=='airline' || product == 'activity' || product == 'visa'){
                if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                    document.getElementById('child_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
                    document.getElementById('child_passport_number'+passenger_number).readOnly = true;
                    if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
                        document.getElementById('select2-child_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        document.getElementById('child_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        auto_complete('child_country_of_issued'+passenger_number);
                        document.getElementById('child_country_of_issued'+passenger_number).readOnly = true;
                    }
                    if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
                        document.getElementById('child_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                    }
                }
                //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
            }
            passenger_data_pick.push(passenger_data[sequence]);
            passenger_data_pick[passenger_data_pick.length-1].sequence = 'child'+passenger_number;
            document.getElementById('child_id'+passenger_number).value = passenger_data[sequence].seq_id;
            auto_complete('child_nationality'+passenger_number);
            if(template != 4){
    //            if (document.getElementById("default-select")) {
    //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
    //                $('#adult_nationality1_id').niceSelect('update');
    //            };
                $('#child_nationality'+passenger_number+'_id').niceSelect('update');
                $('#child_country_of_issued'+passenger_number).niceSelect('update');
            }
            $('#myModal_child'+passenger_number).modal('hide');
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: "You can't choose same person in 1 booking",
          })
        }
    }else if(type == 'infant'){
        check = 0;
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].seq_id == passenger_data[sequence].seq_id)
                check = 1;
        }
        if(check == 0){
            for(i in passenger_data_pick){
                if(passenger_data_pick[i].sequence == 'infant'+passenger_number){
                    passenger_data_pick.splice(i,1);
                    break;
                }
            }
            document.getElementById('infant_title'+passenger_number).value = passenger_data[sequence].title;
            for(i in document.getElementById('infant_title'+passenger_number).options){
                if(document.getElementById('infant_title'+passenger_number).options[i].selected != true)
                    document.getElementById('infant_title'+passenger_number).options[i].disabled = true;
            }
            if(template != 4){
                $('#infant_title'+passenger_number).niceSelect('update');
            }
            document.getElementById('infant_first_name'+passenger_number).value = passenger_data[sequence].first_name;
            document.getElementById('infant_first_name'+passenger_number).readOnly = true;
            document.getElementById('infant_last_name'+passenger_number).value = passenger_data[sequence].last_name;
            document.getElementById('infant_last_name'+passenger_number).readOnly = true;
            document.getElementById('infant_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                document.getElementById('select2-infant_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                document.getElementById('infant_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            }
            document.getElementById('infant_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
            check_years_old(passenger_number,'infant');
    //        if(parseInt(document.getElementById('infant_years_old'+passenger_number).value) >= 17){
    //            console.log(template);
    //            console.log(product);
    //            if(product=='train'){//ganti
    ////                document.getElementById('adult_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
    ////                document.getElementById('adult_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
    //            }
    //        }
            if(product=='airline' || product == 'activity' || product == 'visa'){
                if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                    document.getElementById('infant_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
                    document.getElementById('infant_passport_number'+passenger_number).readOnly = true;
                    if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
                        document.getElementById('select2-infant_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        document.getElementById('infant_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        auto_complete('infant_country_of_issued'+passenger_number);
                        document.getElementById('infant_country_of_issued'+passenger_number).readOnly = true;
                    }
                    if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
                        document.getElementById('infant_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                    }
                }
                //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
            }
            passenger_data_pick.push(passenger_data[sequence]);
            passenger_data_pick[passenger_data_pick.length-1].sequence = 'infant'+passenger_number;
            document.getElementById('infant_id'+passenger_number).value = passenger_data[sequence].seq_id;
            auto_complete('infant_nationality'+passenger_number);
            if(template != 4){
    //            if (document.getElementById("default-select")) {
    //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
    //                $('#adult_nationality1_id').niceSelect('update');
    //            };
                $('#infant_nationality'+passenger_number+'_id').niceSelect('update');
                $('#infant_country_of_issued'+passenger_number).niceSelect('update');
            }
            $('#myModal_infant'+passenger_number).modal('hide');
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: "You can't choose same person in 1 booking",
          })
        }
    }else if(type == 'senior'){
        check = 0;
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].seq_id == passenger_data[sequence].seq_id)
                check = 1;
        }
        if(check == 0){
            for(i in passenger_data_pick){
                if(passenger_data_pick[i].sequence == 'senior'+passenger_number){
                    passenger_data_pick.splice(i,1);
                    break;
                }
            }
            document.getElementById('senior_title'+passenger_number).value = passenger_data[sequence].title;
            for(i in document.getElementById('senior_title'+passenger_number).options){
               if(document.getElementById('senior_title'+passenger_number).options[i].selected != true)
                    document.getElementById('senior_title'+passenger_number).options[i].disabled = true;
            }
            if(template != 4){
                $('#senior_title'+passenger_number).niceSelect('update');
            }
            document.getElementById('senior_first_name'+passenger_number).value = passenger_data[sequence].first_name;
            document.getElementById('senior_first_name'+passenger_number).readOnly = true;
            document.getElementById('senior_last_name'+passenger_number).value = passenger_data[sequence].last_name;
            document.getElementById('senior_last_name'+passenger_number).readOnly = true;
            document.getElementById('senior_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                document.getElementById('select2-senior_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                document.getElementById('senior_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            }
            document.getElementById('senior_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
            check_years_old(passenger_number,'senior');
    //        if(parseInt(document.getElementById('infant_years_old'+passenger_number).value) >= 17){
    //            console.log(template);
    //            console.log(product);
    //            if(product=='train'){//ganti
    ////                document.getElementById('adult_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
    ////                document.getElementById('adult_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
    //            }
    //        }
            if(product=='airline' || product == 'activity'){
                if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                    document.getElementById('senior_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
                    document.getElementById('senior_passport_number'+passenger_number).readOnly = true;
                    if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
                        document.getElementById('select2-senior_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        document.getElementById('senior_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        auto_complete('senior_country_of_issued'+passenger_number);
                        document.getElementById('senior_country_of_issued'+passenger_number).readOnly = true;
                    }
                    if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
                        document.getElementById('senior_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                    }
                }
                //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
            }
            passenger_data_pick.push(passenger_data[sequence]);
            passenger_data_pick[passenger_data_pick.length-1].sequence = 'senior'+passenger_number;
            document.getElementById('senior_id'+passenger_number).value = passenger_data[sequence].seq_id;
            auto_complete('senior_nationality'+passenger_number);
            if(template != 4){
    //            if (document.getElementById("default-select")) {
    //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
    //                $('#adult_nationality1_id').niceSelect('update');
    //            };
                $('#senior_nationality'+passenger_number+'_id').niceSelect('update');
                $('#senior_country_of_issued'+passenger_number).niceSelect('update');
            }
            $('#myModal_senior'+passenger_number).modal('hide');
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: "You can't choose same person in 1 booking",
          })
        }
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
        try{
            if(JSON.stringify(booker_pick_passenger) != '{}'){
                passenger_data_pick.push(booker_pick_passenger);
                passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult1';
            }
        }catch(err){

        }

        document.getElementById('adult_title1').value = document.getElementById('booker_title').value;
        document.getElementById('adult_title1').readOnly = true;
        for(i in document.getElementById('adult_title1').options){
            if(document.getElementById('adult_title1').options[i].selected != true)
                document.getElementById('adult_title1').options[i].disabled = true;
        }
        if(template != 4){
            $('#adult_title1').niceSelect('update');
        }
        document.getElementById('adult_first_name1').value = document.getElementById('booker_first_name').value;
        document.getElementById('adult_first_name1').readOnly = true;
        document.getElementById('adult_last_name1').value = document.getElementById('booker_last_name').value;
        document.getElementById('adult_last_name1').readOnly = true;
        document.getElementById('adult_nationality1').value = document.getElementById('booker_nationality').value;
        document.getElementById('select2-adult_nationality1_id-container').innerHTML = document.getElementById('booker_nationality').value;
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
                if(template != 4){
                    $('#adult_id_type1').niceSelect('update');
                }
                document.getElementById('adult_id_number1').value = document.getElementById('booker_id_number').value;
            }
        }else if(type == 'airline'){
            if(document.getElementById('booker_id_number').value != 'undefined' && document.getElementById('booker_id_number').value != '')
                document.getElementById('adult_passport_number1').value = document.getElementById('booker_id_number').value;
            if(document.getElementById('booker_exp_date').value != 'undefined' && document.getElementById('booker_exp_date').value != '')
                document.getElementById('adult_passport_expired_date1').value = document.getElementById('booker_exp_date').value;
            if(document.getElementById('booker_country_of_issued').value != 'undefined' && document.getElementById('booker_country_of_issued').value != ''){
                document.getElementById('select2-adult_country_of_issued1_id-container').innerHTML = document.getElementById('booker_country_of_issued').value;
                document.getElementById('adult_country_of_issued1').value = document.getElementById('booker_country_of_issued').value;
            }
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
        for(i in document.getElementById('adult_title1').options){
            document.getElementById('adult_title1').options[i].disabled = false;
        }
        if(template != 4){
            $('#adult_title1').niceSelect('update');
        }
        document.getElementById('adult_first_name1').value = '';
        document.getElementById('adult_first_name1').readOnly = false;
        document.getElementById('adult_last_name1').value = '';
        document.getElementById('adult_last_name1').readOnly = false;
        document.getElementById('adult_nationality1').value = 'Indonesia';
        document.getElementById('select2-adult_nationality1_id-container').value = 'Indonesia';
        document.getElementById('adult_birth_date1').value = '';
        document.getElementById('adult_passport_number1').value = '';
        document.getElementById('adult_passport_number1').readOnly = false;
        document.getElementById('adult_passport_expired_date1').value = '';
        document.getElementById('adult_passport_expired_date1').readOnly = false;
        document.getElementById('adult_country_of_issued1').value = '';
        document.getElementById('select2-adult_country_of_issued1_id-container').value = '';
        document.getElementById('adult_email1').value = '';
        document.getElementById('adult_email1').readOnly = false;
        document.getElementById('adult_phone_code1').value = '62';
        document.getElementById('select2-adult_phone_code1_id-container').value = '62';
        document.getElementById('select2-adult_phone_code1_id-container').readOnly = false;
        document.getElementById('adult_phone1').value = '';
        document.getElementById('adult_phone1').readOnly = false;
        document.getElementById('adult_id1').value = '';
    }
}

function clear_passenger(type, sequence){
    if(type == 'Booker'){
        document.getElementById('booker_title').value = 'MR';
        for(i in document.getElementById('booker_title').options){
            document.getElementById('booker_title').options[i].disabled = true;
        }
        if(template != 4){
            $('#booker_title').niceSelect('update');
        }
        document.getElementById('booker_first_name').value = '';
        document.getElementById('booker_first_name').readOnly = false;
        document.getElementById('booker_last_name').value = '';
        document.getElementById('booker_last_name').readOnly = false;
        document.getElementById('booker_nationality').value = 'Indonesia';
        document.getElementById('booker_email').value = '';
        document.getElementById('booker_email').readOnly = false;
        document.getElementById('booker_phone_code').value = '62';
        document.getElementById('booker_phone').value = '';
        document.getElementById('booker_phone').readOnly = false;
        document.getElementById('booker_id').value = '';
        document.getElementById('booker_birth_date').value = '';
        document.getElementById('booker_id_number').value = '';
        document.getElementById('booker_exp_date').value = '';
        document.getElementById('booker_country_of_issued').value = '';
        booker_pick_passenger= {};
    }else if(type == 'Adult'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'adult'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        try{
            document.getElementById('adult_title'+sequence).value = 'MR';
            for(i in document.getElementById('adult_title'+sequence).options){
                document.getElementById('adult_title'+sequence).options[i].disabled = true;
            }
            if(template != 4){
                $('#adult_title'+sequence).niceSelect('update');
            }
            document.getElementById('adult_email'+sequence).value = '';
            document.getElementById('adult_email'+sequence).readOnly = false;
            document.getElementById('adult_phone_code'+sequence).value = '62';
            document.getElementById('select2-adult_phone_code'+sequence+'_id-container').value = '62';
            document.getElementById('select2-adult_phone_code'+sequence+'_id-container').readOnly = false;
            document.getElementById('adult_phone'+sequence).value = '';
            document.getElementById('adult_phone'+sequence).readOnly = false;
            document.getElementById('adult_id'+sequence).value = '';
            document.getElementById('adult_first_name'+sequence).value = '';
            document.getElementById('adult_first_name'+sequence).readOnly = false;
            document.getElementById('adult_last_name'+sequence).value = '';
            document.getElementById('adult_last_name'+sequence).readOnly = false;
            document.getElementById('adult_nationality'+sequence).value = 'Indonesia';
            document.getElementById('select2-adult_nationality'+sequence+'_id-container').value = 'Indonesia';
            document.getElementById('adult_birth_date'+sequence).value = '';
            document.getElementById('adult_passport_number'+sequence).value = '';
            document.getElementById('adult_passport_number'+sequence).readOnly = false;
            document.getElementById('adult_passport_expired_date'+sequence).value = '';
            document.getElementById('adult_passport_expired_date'+sequence).readOnly = false;
            document.getElementById('adult_country_of_issued'+sequence).value = '';
            document.getElementById('select2-adult_country_of_issued'+sequence+'_id-container').value = '';

        }catch(err){}

    }else if(type == 'Infant'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'infant'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        try{
            document.getElementById('infant_title'+sequence).value = 'MSTR';
            for(i in document.getElementById('infant_title'+sequence).options){
                document.getElementById('infant_title'+sequence).options[i].disabled = true;
            }
            if(template != 4){
                $('#infant_title'+sequence).niceSelect('update');
            }
            document.getElementById('infant_id'+sequence).value = '';
            document.getElementById('infant_first_name'+sequence).value = '';
            document.getElementById('infant_first_name'+sequence).readOnly = false;
            document.getElementById('infant_last_name'+sequence).value = '';
            document.getElementById('infant_last_name'+sequence).readOnly = false;
            document.getElementById('infant_nationality'+sequence).value = 'Indonesia';
            document.getElementById('select2-infant_nationality'+sequence+'_id-container').value = 'Indonesia';
            document.getElementById('infant_birth_date'+sequence).value = '';
            document.getElementById('infant_passport_number'+sequence).value = '';
            document.getElementById('infant_passport_number'+sequence).readOnly = false;
            document.getElementById('infant_passport_expired_date'+sequence).value = '';
            document.getElementById('infant_passport_expired_date'+sequence).readOnly = false;
            document.getElementById('infant_country_of_issued'+sequence).value = '';
            document.getElementById('select2-infant_country_of_issued'+sequence+'_id-container').value = '';
        }catch(err){}
    }else if(type == 'Senior'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'senior'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('senior_title'+sequence).value = 'MR';
        for(i in document.getElementById('senior_title'+sequence).options){
            document.getElementById('senior_title'+sequence).options[i].disabled = true;
        }
        if(template != 4){
            $('#senior_title'+sequence).niceSelect('update');
        }
        document.getElementById('senior_id'+sequence).value = '';
        document.getElementById('senior_first_name'+sequence).value = '';
        document.getElementById('senior_first_name'+sequence).readOnly = false;
        document.getElementById('senior_last_name'+sequence).value = '';
        document.getElementById('senior_last_name'+sequence).readOnly = false;
        document.getElementById('senior_nationality'+sequence).value = 'Indonesia';
        document.getElementById('select2-senior_nationality'+sequence+'_id-container').value = 'Indonesia';
        document.getElementById('senior_birth_date'+sequence).value = '';
        document.getElementById('senior_passport_number'+sequence).value = '';
        document.getElementById('senior_passport_number'+sequence).readOnly = false;
        document.getElementById('senior_passport_expired_date'+sequence).value = '';
        document.getElementById('senior_passport_expired_date'+sequence).readOnly = false;
        document.getElementById('senior_country_of_issued'+sequence).value = '';
        document.getElementById('select2-senior_country_of_issued'+sequence+'_id-container').value = '';
    }else if(type == 'Child'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'child'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('child_title'+sequence).value = 'MSTR';
        document.getElementById('child_id'+sequence).value = '';
        document.getElementById('child_first_name'+sequence).value = '';
        document.getElementById('child_first_name'+sequence).readOnly = false;
        document.getElementById('child_last_name'+sequence).value = '';
        document.getElementById('child_last_name'+sequence).readOnly = false;
        document.getElementById('child_nationality'+sequence).value = 'Indonesia';
        document.getElementById('select2-child_nationality'+sequence+'_id-container').value = 'Indonesia';
        document.getElementById('child_birth_date'+sequence).value = '';
        document.getElementById('child_passport_number'+sequence).value = '';
        document.getElementById('child_passport_number'+sequence).readOnly = false;
        document.getElementById('child_passport_expired_date'+sequence).value = '';
        document.getElementById('child_passport_expired_date'+sequence).readOnly = false;
        document.getElementById('child_country_of_issued'+sequence).value = '';
        document.getElementById('select2-child_country_of_issued'+sequence+'_id-container').value = '';
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
    return value.match('^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$') != null
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