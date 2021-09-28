passenger_data = [];
passenger_data_pick = [];
booker_pick_passenger = {};
passenger_number = 0;
agent_offside = 0;
load_more = true;
login_again = true

//function goodbye(e) {
//	console.log(e);
//    if(!e) e = window.event;
//    //e.cancelBubble is supported by IE - this will kill the bubbling process.
//    e.cancelBubble = true;
//    e.returnValue = 'You sure you want to leave?'; //This is displayed on the dialog
//
//    //e.stopPropagation works in Firefox.
//    if (e.stopPropagation) {
//        e.stopPropagation();
//        e.preventDefault();
//    }
//    if(page_open == 1){
//        $.ajax({
//           type: "POST",
//           url: "/webservice/agent",
//           headers:{
//                'action': 'delete_session',
//           },
//           data: {
//                "data": e.returnValue
//           },
//           success: function(msg) {
//
//           },
//           error: function(XMLHttpRequest, textStatus, errorThrown) {
//
//           }
//        });
//    }
//}
//window.onclose=goodbye;

//$(window).on('beforeunload', function(e) {
//    e = e || window.event;
//    var localStorageTime = localStorage.getItem('storagetime')
//    if(localStorageTime!=null && localStorageTime!=undefined){
//        var currentTime = new Date().getTime(),
//        timeDifference = currentTime - localStorageTime;
//
//        if(timeDifference<25){//Browser Closed
//            localStorage.removeItem('storagetime');
//            if(page_open == 1){
//                $.ajax({
//                   type: "POST",
//                   url: "/webservice/agent",
//                   headers:{
//                        'action': 'delete_session',
//                   },
//                   data: {},
//                   success: function(msg) {
//
//                   },
//                   error: function(XMLHttpRequest, textStatus, errorThrown) {
//
//                   }
//                });
//            }
//        }else{//Browser Tab Closed
//            if(page_open == 1){
//                $.ajax({
//                   type: "POST",
//                   url: "/webservice/agent",
//                   headers:{
//                        'action': 'delete_session',
//                   },
//                   data: {},
//                   success: function(msg) {
//
//                   },
//                   error: function(XMLHttpRequest, textStatus, errorThrown) {
//
//                   }
//                });
//            }
//            localStorage.setItem('storagetime',new Date().getTime());
//        }
//
//    }else{
//        localStorage.setItem('storagetime',new Date().getTime());
//    }
//
//});

function signin(){
    username = '';
    password = '';
    keep_me_signin = false;
    check = 0;
    if( $(window).width() > 767){
        if($('#username2').val() != '' && $('#password2').val() != ''){
            username = $('#username2').val();
            password = $('#password2').val();
            keep_me_signin = $('#keep_me_signin2').is(':checked');
            check = 1;
            $('.button-login').addClass("running");
            $('.button-login').prop('disabled', true);
        }else{
            $('.button-login').prop('disabled', false);
            $('.button-login').removeClass("running");
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: 'Please input username and password',
            })
        }
    }
    else{
        if($('#username').val() != '' && $('#password').val() != ''){
            username = $('#username').val();
            password = $('#password').val();
            keep_me_signin = $('#keep_me_signin').is(':checked');
            check = 1;
            $('.button-login').addClass("running");
            $('.button-login').prop('disabled', true);
        }else{
            $('.button-login').prop('disabled', false);
            $('.button-login').removeClass("running");
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: 'Please input username and password',
            })
        }
    }
    if(check == 1){
        $.ajax({
           type: "POST",
           url: "/webservice/agent",
           headers:{
                'action': 'signin',
           },
           data: {
            'username':username,
            'password':password,
            'keep_me_signin': keep_me_signin
           },
           success: function(msg) {
            console.log(msg);
            try{
                if(google_analytics != ''){
                    if(msg.result.response.co_agent_frontend_security.includes('b2c_limitation') == true)
                        gtag('event', 'b2c', {'agent_type':'b2c'});
                    else
                        gtag('event', 'b2b', {'agent_type':'b2b'});
                }
            }catch(err){}
            if(msg.result.error_code == 0 && msg.result.response.co_agent_frontend_security.includes('login') == true){
                gotoForm();
                let timerInterval
                Swal.fire({
                  type: 'success',
                  title: 'Login Success!',
                  html: 'Please Wait ...',
                  timer: 50000,
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

                  }
                })
            }else if(msg.result.error_code == 0 && msg.result.response.co_agent_frontend_security.includes('login') == false){
                $('.button-login').prop('disabled', false);
                $('.button-login').removeClass("running");

                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "It looks like you don't have permission to login!",
                })
            }else{
                $('.button-login').prop('disabled', false);
                $('.button-login').removeClass("running");

                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "Username and Password do not match!",
                })
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error signin');
           },timeout: 60000
        });
    }
}

function signin_booking(){
    username = '';
    password = '';
    keep_me_signin = false;
    check = 0;
    if($('#username').val() != '' && $('#password').val() != ''){
        username = $('#username').val();
        password = $('#password').val();
        keep_me_signin = $('#keep_me_signin').is(':checked');
        check = 1;
        $('.button-login').addClass("running");
        $('.button-login').prop('disabled', true);
    }else{
        $('.button-login').prop('disabled', false);
        $('.button-login').removeClass("running");
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          text: 'Please input username and password',
        })
    }
    if(check == 1){
        $.ajax({
           type: "POST",
           url: "/webservice/agent",
           headers:{
                'action': 'signin',
           },
           data: {
            'username':username,
            'password':password,
            'keep_me_signin': keep_me_signin
           },
           success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0 && msg.result.response.co_agent_frontend_security.includes('login') == true && window.location.href.split('/').length == 6){
                let timerInterval
                Swal.fire({
                  type: 'success',
                  title: 'Login Success!',
                  html: 'Please Wait ...',
                  timer: 50000,
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

                  }
                })
                window.location.reload();
            }else if(msg.result.error_code == 0 && msg.result.response.co_agent_frontend_security.includes('confirm_order_medical') == true){
                let timerInterval
                Swal.fire({
                  type: 'success',
                  title: 'Login Success!',
                  html: 'Please Wait ...',
                  timer: 50000,
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

                  }
                })
                window.location.reload();
            }else if(msg.result.error_code == 0){
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
                $('.button-login').prop('disabled', false);
                $('.button-login').removeClass("running");

                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "Permission Denied!",
                })
            }else{
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
                $('.button-login').prop('disabled', false);
                $('.button-login').removeClass("running");

                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "Username and Password do not match!",
                })
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error signin');
           },timeout: 60000
        });
    }
}

function signin_btc(){
    username = '';
    password = '';
    keep_me_signin = false;
    check = 0;
    $('.loading-button').prop('disabled', true);
    $('.loading-button').addClass("running");

    if( $(window).width() > 991){
        if($('#username').val() != '' && $('#password').val() != ''){
            username = $('#username').val();
            password = $('#password').val();
            keep_me_signin = $('#keep_me_signin').is(':checked');
            check = 1;
        }else{
            error_log = '';
            if($('#username').val() == '')
                error_log += 'Please Fill Username';
            if($('#password').val() == '')
                if(error_log == '')
                    error_log += 'Please Fill Password';
                else
                    error_log += ' and Fill Password\n';
            if(error_log != '')
                alert_message_swal(error_log);

            $('.loading-button').prop('disabled', false);
            $('.loading-button').removeClass("running");
        }
    }else{
        if($('#username2').val() != '' && $('#password2').val() != ''){
            username = $('#username2').val();
            password = $('#password2').val();
            keep_me_signin = $('#keep_me_signin2').is(':checked');
            check = 1;
        }else{
            error_log = '';
            if($('#username2').val() == '')
                error_log += 'Please Fill Username';
            if($('#password2').val() == '')
                if(error_log == '')
                    error_log += 'Please Fill Password';
                else
                    error_log += ' and Fill Password\n';
            if(error_log != '')
                alert_message_swal(error_log);

            $('.loading-button').prop('disabled', false);
            $('.loading-button').removeClass("running");
        }
    }
    if(check == 1){
        $.ajax({
           type: "POST",
           url: "/webservice/agent",
           headers:{
                'action': 'signin_btc',
           },
           data: {
            'username':username,
            'password':password,
            'keep_me_signin': keep_me_signin,
            'g-recaptcha-response': document.getElementById('g-recaptcha-response').value
           },
           success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                if(msg.result.response.co_agent_frontend_security.includes('login') == true){
                    try{
                        if(google_analytics != ''){
                            if(msg.result.response.co_agent_frontend_security.includes('b2c_limitation') == true)
                                gtag('event', 'b2c', {'agent_type':'b2c'});
                            else
                                gtag('event', 'b2b', {'agent_type':'b2b'});
                        }
                    }catch(err){}
                    try{
                        document.getElementById('nav-menu-container_no_login').style.display = 'none';
                        document.getElementById('nav-menu-container_login').style.display = 'block';
                        document.getElementById('user_login').innerHTML = $('#username').val();
                        document.getElementById('user_login2').innerHTML = $('#username').val();
                        user_login = msg.result.response;
                        signature = msg.result.response.signature;
                        triggered_balance(false);
                        //get_vendor_balance(false); //firefox error
                    }catch(err){}
                    if(window.location.href.split('/')[3] == ''){
                        window.location.href = '/';
                    }else if(window.location.href.split('/').length == 4){
                        window.location.reload();
                    }else if(window.location.href.split('/')[3] == 'airline'){
                        airline_redirect_signup(last_session);
                    }else if(window.location.href.split('/')[3] == 'train'){
                        train_redirect_signup(last_session);
                    }else if(window.location.href.split('/')[3] == 'activity'){
                        activity_redirect_signup(last_session);
                    }else if(window.location.href.split('/')[3] == 'tour'){
                        tour_redirect_signup(last_session);
                    }else if(window.location.href.split('/')[3] == 'hotel'){
                        hotel_redirect_signup(last_session);
                    }else{
                        window.location.href = '/';
                    }
                    let timerInterval;
                    Swal.fire({
                      type: 'success',
                      title: 'Login Success!',
                      html: 'Please Wait ...',
                      timer: 1000,
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

                      }
                    })
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: "It looks like you don't have permission to login!",
                   })
                   $('.loading-button').prop('disabled', false);
                   $('.loading-button').removeClass("running");
                }
            }else{
                $('.loading-button').prop('disabled', false);
                $('.loading-button').removeClass("running");

                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "Username and Password do not match!",
                })
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('.loading-button').prop('disabled', false);
            $('.loading-button').removeClass("running");
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error signin </span>' + errorThrown,
            })
           },timeout: 60000
        });
    }
}

function reset_password_btc(){
    if( $(window).width() > 991){
        if($('#username').val() != ''){
            $.ajax({
               type: "POST",
               url: "/webservice/account",
               headers:{
                    'action': 'reset_password',
               },
               data: {
                    'email': $('#username').val(),
               },
               success: function(msg) {
                    console.log(msg);
                    if(msg.result.error_code == 0){
                        signature = msg.result.response.signature;
                        Swal.fire({
                          type: 'success',
                          title: 'Yeah!',
                          html: '<span>Reset Password Success, If Your Already Have an Account Please Check Your Email</span>'
                        })
                    }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error reset password </span>' + errorThrown,
                    })
               },timeout: 60000
            });
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error please input email! </span>',
            })
        }
    }
    else{
        if($('#username2').val() != ''){
            $.ajax({
               type: "POST",
               url: "/webservice/account",
               headers:{
                    'action': 'reset_password',
               },
               data: {
                    'email': $('#username2').val(),
               },
               success: function(msg) {
                    console.log(msg);
                    if(msg.result.error_code == 0){
                        signature = msg.result.response.signature;
                        Swal.fire({
                          type: 'success',
                          title: 'Yeah!',
                          html: '<span>Reset Password Success, If Your Already Have an Account Please Check Your Email</span>'
                        })
                    }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error reset password </span>' + errorThrown,
                    })
               },timeout: 60000
            });
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error please input email! </span>',
            })
        }
    }
}

function reset_password(){
    username = '';
    if( $(window).width() > 767){
        username = $('#username2').val();
    }else{
        username = $('#username').val();
    }
    console.log(username)
    if(username != ''){
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'reset_password',
           },
           data: {
                'email':username,
           },
           success: function(msg) {
                console.log(msg);
                if(msg.result.error_code == 0){
                    signature = msg.result.response.signature;

                    Swal.fire({
                      type: 'success',
                      title: 'Yeah!',
                      html: '<span>Reset Password Success, If Your Already Have an Account Please Check Your Email</span>'
                    })
                }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error reset password');
           },timeout: 60000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">Error please input email! </span>',
        })
    }
}

function get_path_url_server(){ //DEPRECATED
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'static_path_url_server',
       },
       data: {
       },
       success: function(msg) {
        console.log(msg);
        static_path_url_server = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error url server');
       },timeout: 60000
    });
}

function signup_b2c(){
    error_log = '';
    auto_complete('b2c_nationality');
    auto_complete('b2c_phone_code');
    if(document.getElementById('b2c_title').value == '')
        error_log += 'Please fill title<br/>';
    if(document.getElementById('b2c_first_name').value == '')
        error_log += 'Please fill first name<br/>';
    if(document.getElementById('b2c_nationality').value == '')
        error_log += 'Please fill nationality<br/>';
    if(check_phone_number(document.getElementById('b2c_phone').value) == false)
        error_log+= 'Phone number only contain number 8 - 12 digits!<br/>';
    if(check_email(document.getElementById('b2c_email').value)==false)
        error_log += 'Please fill email<br/>';
    if(error_log == '')
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'signup_user',
           },
           data: {
                'signature': signature,
                "phone": document.getElementById('b2c_phone_code').value + document.getElementById('b2c_phone').value,
                "email": document.getElementById('b2c_email').value,
                "title": document.getElementById('b2c_title').value,
                "first_name": document.getElementById('b2c_first_name').value,
                "last_name": document.getElementById('b2c_last_name').value,
                "nationality_code": document.getElementById('b2c_nationality').value,
           },
           success: function(msg) {
                console.log(msg);
                if(msg.result.error_code == 0){
                    document.getElementById('b2c_first_name').value = '';
                    document.getElementById('b2c_last_name').value = '';
                    document.getElementById('b2c_email').value = '';
                    document.getElementById('b2c_phone').value = '';
                    Swal.fire({
                      type: 'success',
                      title: 'Create User!',
                      text: 'Please check your email',
                    });
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">'+msg.result.error_msg+' </span>',
                    })
                }

           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error url server');
           },timeout: 60000
        });
    else{
        console.log(error_log);
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_log,
        });
    }
}

function send_url_booking(provider_type, url, order_number, type='book'){
    create_url = '';
    data = document.URL;
    for(i=0;i<data.split('/').length-1;i++){
      create_url += data.split('/')[i] + '/';
    }
    create_url += 'booking/'+ url;
    console.log('use to be used '+ create_url)
//    $.ajax({
//       type: "POST",
//       url: "/webservice/account",
//       headers:{
//            'action': 'send_url_booking',
//       },
//       data: {
//            'signature': signature,
//            'provider_type': provider_type,
//            'url_booking': create_url,
//            'order_number': order_number,
//            'type': type
//       },
//       success: function(msg) {
//        console.log(msg);
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//            if(XMLHttpRequest.status == 500){
//                Swal.fire({
//                  type: 'error',
//                  title: 'Oops!',
//                  html: '<span style="color: red;">Error url server </span>' + errorThrown,
//                })
//            }
//       },timeout: 60000
//    });
}

function create_new_passenger(){
    document.getElementById('create_new_passenger_btn').disabled = true;
    var passenger = {};
    var error_log = '';
    try{
       if(check_name(document.getElementById('passenger_title').value,
            document.getElementById('passenger_first_name').value,
            document.getElementById('passenger_last_name').value,
            100) == false){ // length masih hardcode
           error_log+= 'Total of passenger name maximum '+length_name+' characters!</br>\n';
           document.getElementById('passenger_first_name').style['border-color'] = 'red';
           document.getElementById('passenger_last_name').style['border-color'] = 'red';
       }else{
           document.getElementById('passenger_first_name').style['border-color'] = '#EFEFEF';
           document.getElementById('passenger_last_name').style['border-color'] = '#EFEFEF';
       }if(document.getElementById('passenger_first_name').value == '' || check_word(document.getElementById('passenger_first_name').value) == false){
           if(document.getElementById('passenger_first_name').value == '')
               error_log+= 'Please input first name of passenger!</br>\n';
           else if(check_word(document.getElementById('passenger_first_name').value) == false)
               error_log+= 'Please use alpha characters first name of passenger passenger '+i+'!\n';
           document.getElementById('passenger_first_name').style['border-color'] = 'red';
       }else{
           document.getElementById('passenger_first_name').style['border-color'] = '#EFEFEF';
       }if(check_word(document.getElementById('passenger_last_name').value) != true){
           if(check_word(document.getElementById('passenger_last_name').value) == false){
               error_log+= 'Please use alpha characters last name of passenger!</br>\n';
               document.getElementById('passenger_last_name').style['border-color'] = 'red';
           }
       }else{
           document.getElementById('passenger_last_name').style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('passenger_birth_date').value)==false){
           error_log+= 'Birth date wrong for passenger!</br>\n';
           document.getElementById('passenger_birth_date').style['border-color'] = 'red';
       }else{
           document.getElementById('passenger_birth_date').style['border-color'] = '#EFEFEF';
       }if(document.getElementById('passenger_nationality').value == ''){
           error_log+= 'Please fill nationality for passenger!</br>\n';
           document.getElementById('passenger_nationality').style['border-color'] = 'red';
       }else{
           document.getElementById('passenger_nationality').style['border-color'] = '#EFEFEF';
       }
       for(i = 1 ; i <= 4 ; i++){
            if(i == 1)
                identity_type = 'passport';
            else if(i == 2)
                identity_type = 'ktp';
            else if(i == 3)
                identity_type = 'sim';
            else if(i == 4)
                identity_type = 'other';


            if(i == 2 && document.getElementById('passenger_identity_number'+i).value != '' && check_ktp(document.getElementById('passenger_identity_number'+i).value) == false){
               error_log+= 'Please fill id number, ktp only contain 16 digits for passenger adult '+i+'!</br>\n';
               document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
            }else{
               document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
            }

            if(i == 3 && document.getElementById('passenger_identity_number'+i).value != '' && check_sim(document.getElementById('passenger_identity_number'+i).value) == false){
               error_log+= 'Please fill identity number, sim only contain 12 - 13 digits!</br>\n';
               document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
            }else{
               document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
            }

            if(i == 1 && document.getElementById('passenger_identity_number'+i).value != ''){
               if(check_passport(document.getElementById('passenger_identity_number'+i).value) == false){
                   error_log+= 'Please fill identity number, passport only contain more than 6 digits!</br>\n';
                   document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
               }
               if(document.getElementById('passenger_identity_expired_date'+i).value == ''){
                   error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
                   document.getElementById('passenger_identity_expired_date'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('passenger_identity_expired_date'+i).style['border-color'] = '#EFEFEF';
               }if(document.getElementById('passenger_identity_expired_date'+i).value == ''){
                   error_log+= 'Please fill '+identity_type+' country of issued!</br>\n';
                   document.getElementById('passenger_identity_country_of_issued'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('passenger_identity_country_of_issued'+i).style['border-color'] = '#EFEFEF';
               }
            }
            if(i == 4 && document.getElementById('passenger_identity_number'+i).value != '' && document.getElementById('passenger_identity_number'+i).value.length < 6){
               error_log+= 'Please fill '+identity_type+' number !</br>\n';
               document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
            }else{
               document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
            }


//            if(document.getElementById('passenger_identity_number'+i).value != ''){
//               if(document.getElementById('passenger_identity_number'+i).value == ''){
//                   error_log+= 'Please fill '+identity_type+' number !</br>\n';
//                   document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
//               }else{
//                   document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
//               }if(document.getElementById('passenger_identity_country_of_issued'+i).value == '' && i == 1){
//                   error_log+= 'Please fill '+identity_type+' country of issued !</br>\n';
//                   document.getElementById('passenger_identity_country_of_issued'+i).style['border-color'] = 'red';
//               }else{
//                   document.getElementById('passenger_identity_country_of_issued'+i).style['border-color'] = '#EFEFEF';
//               }
//               if(i == 1){
//                   if(document.getElementById('passenger_identity_expired_date'+i).value == '' && i == 1){
//                       error_log+= 'Please fill '+identity_type+' expired date !</br>\n';
//                       document.getElementById('passenger_identity_expired_date'+i).style['border-color'] = 'red';
//                   }else{
//                       document.getElementById('passenger_identity_expired_date'+i).style['border-color'] = '#EFEFEF';
//                   }
//               }
//            }

       }
       for(i = 1; i<= passenger_data_phone ; i++){
            try{
                if(document.getElementById('passenger_phone_code'+i).value == '' && check_phone_number(document.getElementById('passenger_phone_number'+i).value) == false){
                    error_log+= 'Phone number only contain number 8 - 12 digits for phone '+i+'!</br>\n';
                    document.getElementById('passenger_phone_number'+i).style['border-color'] = 'red';
                }else
                    document.getElementById('passenger_phone_number'+i).style['border-color'] = '#EFEFEF';
            }catch(err){

            }
       }
       if(error_log == ''){
           passenger.title = document.getElementById('passenger_title').value;
           passenger.first_name = document.getElementById('passenger_first_name').value;
           passenger.last_name = document.getElementById('passenger_last_name').value;
           passenger.birth_date = document.getElementById('passenger_birth_date').value;
           passenger.nationality_name = document.getElementById('passenger_nationality').value;
           passenger.email = document.getElementById('passenger_email').value;
           phone = [];
           identity = {};
           for(i = 1; i<= passenger_data_phone ; i++){
                try{
                    phone.push({
                        'calling_code': document.getElementById('passenger_phone_code'+i).value,
                        'calling_number': document.getElementById('passenger_phone_number'+i).value
                    })
                }catch(err){

                }
           }
           for(i = 1 ; i <= 4 ; i++){
                if(document.getElementById('passenger_identity_number'+i).value != ''){
                    if(i == 1)
                        identity_type = 'passport';
                    else if(i == 2)
                        identity_type = 'ktp';
                    else if(i == 3)
                        identity_type = 'sim';
                    else if(i == 4)
                        identity_type = 'other';
                    identity[identity_type] = {
                        'identity_type': identity_type,
                        'identity_number': document.getElementById('passenger_identity_number'+i).value,
                        'identity_expdate': document.getElementById('passenger_identity_expired_date'+i).value,
                        'identity_country_of_issued_name': document.getElementById('passenger_identity_country_of_issued'+i).value
                    };
                }
           }
           passenger.phone = phone;
           passenger.identity = identity;
           var formData = new FormData($('#form_identity_passenger').get(0));
           formData.append('signature', signature)
           getToken();
           $.ajax({
               type: "POST",
               url: "/webservice/content",
               headers:{
                    'action': 'update_image_passenger',
               },
               data: formData,
               success: function(msg) {
                    if(msg.result.error_code == 0){

                        img_list = [];
                        for(i in msg.result.response)
                            img_list.push([msg.result.response[i][0], 4, msg.result.response[i][2]])
                        $.ajax({
                           type: "POST",
                           url: "/webservice/agent",
                           headers:{
                                'action': 'create_customer',
                           },
                           data: {
                                'passenger': JSON.stringify(passenger),
                                'image_list': JSON.stringify(img_list),
                                'signature': signature
                           },
                           success: function(msg) {
                            console.log(msg);
                            if(msg.result.error_code==0){
                                try{
                                    document.getElementById('create_new_passenger_btn').disabled = false;
                                    document.getElementById('passenger_first_name').value = '';
                                    document.getElementById('passenger_last_name').value = '';
                                    document.getElementById('passenger_birth_date').value = '';
                                    document.getElementById('passenger_email').value = '';
                                    $('#passenger_identity').niceSelect('update');
                                    for(i=1;i<5;i++){
                                        document.getElementById('passenger_identity_number'+i).value = '';
                                        document.getElementById('passenger_identity_expired_date'+i).value = '';
                                        document.getElementById('passenger_identity_country_of_issued'+i).value = '';
                                        document.getElementById('passenger_identity_country_of_issued_id'+i).value = '';
                                        document.getElementById('files_attachment'+i).value = '';
                                        document.getElementById('selectedFiles_attachment'+i).innerHTML = '';
                                    }
                                    document.getElementById('selectedFiles_attachment').innerHTML = '';
                                    document.getElementById('select2-passenger_identity_country_of_issued_id-container').innerHTML= '';
                                    document.getElementById('create_new_passenger_btn').disabled = false;
                                }catch(err){
                                    console.log(err);
                                }
                                Swal.fire({
                                   type: 'Success',
                                   title: 'Created',
                                   text: '',
                               })
                            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                                auto_logout();
                            }else{
                                Swal.fire({
                                   type: 'error',
                                   title: 'Oops...',
                                   text: msg.result.error_msg,
                               })
                               document.getElementById('create_new_passenger_btn').disabled = false;
                            }
                           },
                           error: function(XMLHttpRequest, textStatus, errorThrown) {
                               error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
                               $('.loading-booker-train').hide();
                               document.getElementById('create_new_passenger_btn').disabled = false;
                           }
                        });
                    }
               },
               contentType:false,
               processData:false,
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
                   document.getElementById('create_new_passenger_btn').disabled = true;
               }
           });


       }else{
           Swal.fire({
               type: 'error',
               title: 'Oops...',
               html: error_log,
           })
           document.getElementById('create_new_passenger_btn').disabled = false;
       }

    }catch(err){
        console.log(err);
        document.getElementById('create_new_passenger_btn').disabled = false;
    }
}

function radio_button(type,val){
    //document.getElementById('passenger_update').hidden = true;
    var radios = ''
    if(type == 'booker')
        radios = document.getElementsByName('radio_booker');
    else if(type == 'passenger'){
        radios = document.getElementsByName('radio_passenger'+val);
    }else if(type == 'pax_cache'){
        radios = document.getElementsByName('radio_passenger_cache');
    }
    value = '';
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            value = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    if(type == 'pax_cache'){
        document.getElementById('passenger_update').hidden = true;

        if(value == 'chosen'){
            document.getElementById('passenger_chosen').hidden = false;
            get_passenger_cache(value);
        }else{
            document.getElementById('passenger_chosen').hidden = true;
        }

        if(value == 'create'){
            document.getElementById('passenger_input').hidden = false;
        }else{
            document.getElementById('passenger_input').hidden = true;
        }

        if(value == 'search'){
            document.getElementById('passenger_search').hidden = false;
            $(".phone_chosen_cls").niceSelect('destroy');
            $(".phone_chosen_cls").niceSelect();
        }else{
            document.getElementById('passenger_search').hidden = true;
        }


    }
    else if(value == 'search' && type == 'booker'){
        document.getElementById('train_booker_search_div').hidden = false;
        document.getElementById('booker_input').hidden = true;
    }else if(value == 'create' && type == 'booker'){
        document.getElementById('train_booker_search_div').hidden = true;
        document.getElementById('booker_input').hidden = false;
    }else if(value == 'chosen' && type == 'booker'){
        document.getElementById('train_booker_search_div').hidden = true;
        document.getElementById('booker_input').hidden = true;
    }else if(value == 'search' && type == 'passenger'){
        document.getElementById('passenger_search'+val).hidden = false;
        document.getElementById('passenger_input'+val).hidden = true;
    }else if(value == 'create' && type == 'passenger'){
        document.getElementById('passenger_search'+val).hidden = true;
        document.getElementById('passenger_input'+val).hidden = false;
    }
}

function triggered_balance(val){
    timeInterval = setInterval(function() {
        if(time!=0){
            time--;
        }else{
            if(login_again == true){
                get_vendor_balance(val);
                time--;
            }
        }
    }, 1000);

}

function session_time_limit(){
    var timeLimitInterval = setInterval(function() {
        if(time_limit!=0){
            time_limit--;
            document.getElementById('session_time').innerHTML = ` <i class="fas fa-stopwatch"></i> `+ parseInt(time_limit/60) % 24 +`m:`+ (time_limit%60) +`s`;
            document.getElementById('elapse_time').innerHTML = ` <i class="fas fa-clock"></i> `+ parseInt((1200 - time_limit)/60) % 24 +`m:`+ ((1200 - time_limit)%60) +`s`;
        }else{
            window.location.href = url_home;
            clearInterval(timeLimitInterval);
        }
    }, 1000);
}

function check_string_length(value){
    return value.length;
}

function set_passenger_number(val,pax_type='adult'){
    passenger_number = val;
    passenger_pick = 'adult';
}

function get_automatic_booker(cust_code){
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_automatic_booker',
       },
       data: {
            'cust_code': cust_code,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            if(msg.result.response.length > 0){
                passenger_data = msg.result.response;
                pick_passenger('Booker',0,'');
            }
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error customer list');
            $('.loading-booker-train').hide();
       },timeout: 60000
    });
}

function get_customer_list(passenger, number, product){
    check = 0;
    getToken();
    if(passenger == 'booker'){
        $('.loading-booker-train').show();

        var minAge = '';
        var maxAge = '';

        name = document.getElementById('train_booker_search').value;

        try{
            minAge = document.getElementById('booker_min_age').value;
            maxAge = document.getElementById('booker_max_age').value;
        }
        catch(err){

        }
        if(name.length >= 2){
            $.ajax({
               type: "POST",
               url: "/webservice/agent",
               headers:{
                    'action': 'get_customer_list',
               },
               data: {
                    'name': name,
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
                    var like_name_booker = name;
                    if(msg.result.response.length != 0){
                        response+=`
                        <div class="alert alert-success" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search"></i> We found `+msg.result.response.length+` user(s) with name like " `+like_name_booker+` "</h6></div>
                        <div style="overflow-y:auto;height:45vh;margin-top:10px;">
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
                                    <div class="row">
                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">`;
                                            if(msg.result.response[i].title == "MR"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_mr.png" alt="User MR" style="width:100%;">`;
                                            }
                                            else if(msg.result.response[i].title == "MRS"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_mrs.png" alt="User MRS" style="width:100%;">`;
                                            }
                                            else if(msg.result.response[i].title == "MS"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_ms.png" alt="User MS" style="width:100%;">`;
                                            }
                                    response+=`
                                        </div>
                                        <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                        <span style="font-weight:600; font-size:14px;">`+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name+` </span>`;
                                        if(msg.result.response[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.result.response[i].birth_date+`</span>`;
                                        if(msg.result.response[i].phones.length != 0){
                                            if(template == 1 || template == 5){
                                                response+=`<br/> <div class="row" style="margin-left:0"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto; padding-right:5px;"></i>`;
                                            }else if(template == 2){
                                                response+=`<br/> <div class="row"><div class="col-lg-12"><div class="input-container-search-ticket"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto; padding-right:5px;"></i>`;
                                            }else if(template == 3){
                                                response+=`<br/> <div class="row"><div class="col-lg-12"><div class="input-container-search-ticket"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto; padding-right:5px;"></i><div class="default-select">`;
                                            }else if(template == 4){
                                                response+=`<br/> <div class="row" style="margin-left:0"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto; padding-right:5px;"></i>`;
                                            }
                                            response+=`<select class="phone_chosen_cls" id="phone_chosen`+i+`" style="width:100%;">`;
                                            for(j in msg.result.response[i].phones){
                                                response += `<option>`+msg.result.response[i].phones[j].calling_code+` - `+msg.result.response[i].phones[j].calling_number+`</option>`;
                                            }
                                            if(template == 1 || template == 5){
                                                response+=`</select></div>`;
                                            }else if(template == 2){
                                                response+=`</select></div></div></div>`;
                                            }else if(template == 3){
                                                response+=`</select></div></div></div></div>`;
                                            }else if(template == 4){
                                                response+=`</select></div>`;
                                            }
                                        }else{
                                            response+=`<br/>`;
                                        }
                                        if(msg.result.response[i].nationality_name != '')
                                            response+=`<span><i class="fas fa-globe-asia"></i> `+msg.result.response[i].nationality_name+`</span>`;
                                        if(msg.result.response[i].email != '')
                                            response+=`<br/><span><i class="fas fa-envelope"></i> `+msg.result.response[i].email+`</span>`;
                                        if(msg.result.response[i].identities.hasOwnProperty('passport') == true)
                                            response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.result.response[i].identities.passport.identity_number+`</span>`;
                                        if(msg.result.response[i].identities.hasOwnProperty('ktp') == true)
                                            response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.result.response[i].identities.ktp.identity_number+`</span>`;
                                        if(msg.result.response[i].identities.hasOwnProperty('sim') == true)
                                            response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.result.response[i].identities.sim.identity_number+`</span>`;
                                        if(msg.result.response[i].customer_parents.length != 0){
                                            response += `<div class="tooltip-inner" style="text-align:left;" data-tooltip="`;
                                            for(j in msg.result.response[i].customer_parents){
                                                response+= "• " +  msg.result.response[i].customer_parents[j].type + ' ' +  msg.result.response[i].customer_parents[j].name + ' ' + msg.result.response[i].customer_parents[j].currency + ' ' + getrupiah(msg.result.response[i].customer_parents[j].actual_balance) + '\n';
                                            }
                                            response += `"><i class="fas fa-money-bill-wave-alt"></i> Corporate Booker</span></div>`;
                                        }
                                    response+=`
                                    </div>
                                </td>`;
    //                            <td>`+msg.response.result[i].booker_type+`</td>
    //                            <td>Rp. `+getrupiah(msg.response.result[i].agent_id.credit_limit+ msg.response.result[i].agent_id.balance)+`</td>
                                response+=`<td><button type="button" class="primary-btn-custom" onclick="pick_passenger('Booker',`+msg.result.response[i].sequence+`,'`+product+`');">Choose</button></td>
                            </tr>`;
                        }
                        response+=`</table></div>`;
                        if(product == 'get_booking_vendor'){
                            document.getElementById('search_result_booker_vendor').innerHTML = response;
                            document.getElementById('search_result_booker_vendor').hidden = false;
                            document.getElementById('search_btn_click').disabled=false;
                            document.getElementById('hide_btn_click').hidden = false;
                        }else if(passenger == 'passenger')
                            document.getElementById('search_result_passenger').innerHTML = response;
                        else
                            document.getElementById('search_result').innerHTML = response;
                        passenger_data = msg.result.response;
                        $('.loading-booker-train').hide();
                        $('.phone_chosen_cls').niceSelect();
                    }else{
                        response = '';
                        response+=`<div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search-minus"></i> Oops! User not found!</h6></div>`;
                        if(product == 'get_booking_vendor'){
                            document.getElementById('search_result_booker_vendor').innerHTML = response;
                            document.getElementById('search_result_booker_vendor').hidden = false;
                            document.getElementById('search_btn_click').disabled=false;
                        }else if(passenger == 'passenger')
                            document.getElementById('search_result_passenger').innerHTML = response;
                        else
                            document.getElementById('search_result').innerHTML = response;
                        $('.loading-booker-train').hide();
                        $('.phone_chosen_cls').niceSelect();
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                    $('.loading-booker-train').hide();
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error customer list </span>' + msg.result.error_msg,
                    })

                    $('.loading-booker-train').hide();
                }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error customer list');
                    $('.loading-booker-train').hide();
               },timeout: 60000
            });
        }else{
            $('.loading-booker-train').hide();
            response = '';
            response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-times-circle"></i> Please input more than 1 letter!</h6></div></center>`;
            try{
                document.getElementById('search_result').innerHTML = response;
            }catch(err){
                try{
                    document.getElementById('search_result_passenger').innerHTML = response;
                    document.getElementById('search_btn_click').disabled=false;
                }catch(err){}
            }
        }

    }else{
        $(".loading-pax-train").show();
        var name = '';
        if(passenger == 'passenger')
            name = document.getElementById('train_passenger_search').value;
        else
            name = document.getElementById('train_'+passenger+number+'_search').value;
        var minAge = '';
        var maxAge = '';
        try{
            minAge = document.getElementById('train_'+passenger+number+'_min_age').value;
            maxAge = document.getElementById('train_'+passenger+number+'_max_age').value;
        }
        catch(err){

        }
        if(name.length >= 2){
            if(passenger == ''){
                passenger = 'adult';
                check = 1;
            }
            $.ajax({
               type: "POST",
               url: "/webservice/agent",
               headers:{
                    'action': 'get_customer_list',
               },
               data: {
                    'name': name,
                    'product': product,
                    'passenger_type': passenger,
                    'minAge': minAge,
                    'maxAge': maxAge,
                    'signature': signature
               },
               success: function(msg) {
                if(check == 1)
                    passenger = '';
                console.log(msg);
                if(msg.result.error_code==0){
                    var response = '';
                    var like_name_paxs = document.getElementById('train_'+passenger+number+'_search').value;
                    if(msg.result.response.length != 0){
                        response+=`
                        <div class="alert alert-success" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search"></i> We found `+msg.result.response.length+` user(s) with name like " `+like_name_paxs+` "</h6></div>
                        <div style="overflow-y:auto;height:45vh;margin-top:10px;">
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
                                    <div class="row">
                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">`;
                                            if(msg.result.response[i].face_image.length > 0)
                                                response+=`<img src="`+msg.result.response[i].face_image[0]+`" alt="User" style="width:100%;">`;
                                            else if(msg.result.response[i].title == "MR"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_mr.png" alt="User MR" style="width:100%;">`;
                                            }
                                            else if(msg.result.response[i].title == "MRS"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_mrs.png" alt="User MRS" style="width:100%;">`;
                                            }
                                            else if(msg.result.response[i].title == "MS"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_ms.png" alt="User MS" style="width:100%;">`;
                                            }
                                            else if(msg.result.response[i].title == "MSTR"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_mistr.png" alt="User MSTR" style="width:100%;">`;
                                            }
                                            else if(msg.result.response[i].title == "MISS"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_miss.png" alt="User MISS" style="width:100%;">`;
                                            }
                                    response+=`
                                        </div>
                                        <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                        <span style="font-weight:600; font-size:14px;"> `+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name+``;
                                        if(msg.result.response[i].birth_date != '')
                                            response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.result.response[i].birth_date+`</span>`;
                                        if(msg.result.response[i].phones.length != 0){
                                            if(template == 1 || template == 5){
                                                response+=`<br/> <div class="row" style="margin-left:0"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto; padding-right:5px;"></i>`;
                                            }else if(template == 2){
                                                response+=`<br/> <div class="row"><div class="col-lg-12"><div class="input-container-search-ticket"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto; padding-right:5px;"></i>`;
                                            }else if(template == 3){
                                                response+=`<br/> <div class="row"><div class="col-lg-12"><div class="input-container-search-ticket"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto; padding-right:5px;"></i><div class="default-select">`;
                                            }else if(template == 4){
                                                response+=`<br/> <div class="row" style="margin-left:0"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto; padding-right:5px;"></i>`;
                                            }
                                            response+=`<select class="phone_chosen_cls" id="phone_chosen`+i+`" style="width:100%;">`;
                                            for(j in msg.result.response[i].phones){
                                                response += `<option>`+msg.result.response[i].phones[j].calling_code+` - `+msg.result.response[i].phones[j].calling_number+`</option>`;
                                            }
                                            if(template == 1 || template == 5){
                                                response+=`</select></div>`;
                                            }else if(template == 2){
                                                response+=`</select></div></div></div>`;
                                            }else if(template == 3){
                                                response+=`</select></div></div></div></div>`;
                                            }else if(template == 4){
                                                response+=`</select></div>`;
                                            }
                                        }else{
                                            response+=`<br/>`;
                                        }
                                        check_br = false
                                        if(msg.result.response[i].email != '' && msg.result.response[i].email != false){
                                            response+=`<span><i class="fas fa-envelope"></i> `+msg.result.response[i].email+`</span>`;
                                            check_br = true;
                                        }if(msg.result.response[i].nationality_name != ''){
                                            if(check_br == true)
                                                response += `<br/>`;
                                            response+=` <span><i class="fas fa-globe-asia"></i> `+msg.result.response[i].nationality_name+`</span>`;
                                            check_br = true;
                                        }
                                        if(msg.result.response[i].identities.hasOwnProperty('passport') == true){
                                            if(check_br == true)
                                                response += `<br/>`;
                                            response+=` <span><i class="fas fa-passport"></i> Passport - `+msg.result.response[i].identities.passport.identity_number+`</span>`;
                                            check_br = true;
                                        }
                                        if(msg.result.response[i].identities.hasOwnProperty('ktp') == true){
                                            if(check_br == true)
                                                response += `<br/>`;
                                            response+=` <span><i class="fas fa-id-card"></i> KTP - `+msg.result.response[i].identities.ktp.identity_number+`</span>`;
                                        }
                                        if(msg.result.response[i].identities.hasOwnProperty('sim') == true){
                                            if(check_br == true)
                                                response += `<br/>`;
                                            response+=` <span><i class="fas fa-id-badge"></i> SIM - `+msg.result.response[i].identities.sim.identity_number+`</span>`;
                                        }
                                        if(msg.result.response[i].customer_parents.length != 0){
                                            response += `<div class="tooltip-inner" style="text-align:left;" data-tooltip="`;
                                            for(j in msg.result.response[i].customer_parents){
                                                response+= "• " + msg.result.response[i].customer_parents[j].type + ' ' + msg.result.response[i].customer_parents[j].name + ' ' + msg.result.response[i].customer_parents[j].currency + ' ' + getrupiah(msg.result.response[i].customer_parents[j].actual_balance) + '\n';
                                            }
                                            response += `"><i class="fas fa-money-bill-wave-alt"></i> Corporate Booker</span></div>`;
                                        }
                                    response+=`
                                    </div>
                                </td>`;
    //                            <td>`+msg.response.result[i].booker_type+`</td>
    //                            <td>Rp. `+getrupiah(msg.response.result[i].agent_id.credit_limit+ msg.response.result[i].agent_id.balance)+`</td>
                                response+=`<td><button type="button" class="primary-btn-custom" onclick="pick_passenger('`+passenger+`',`+msg.result.response[i].sequence+`,'`+product+`');">Choose</button></td>
                            </tr>`;
                        }
                        response+=`</table></div>`;
                        document.getElementById('search_result_'+passenger+number).innerHTML = response;
                        passenger_data = msg.result.response;
                        $('.loading-pax-train').hide();
                        $('.phone_chosen_cls').niceSelect();
                    }else{
                        response = '';
                        response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search-minus"></i> Oops! User nof found!</h6></div></center>`;
                        document.getElementById('search_result_'+passenger+number).innerHTML = response;
                        $('.loading-pax-train').hide();
                        $('.phone_chosen_cls').niceSelect();
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                    $('.loading-pax-train').hide();
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error customer list </span>' + msg.result.error_msg,
                    })
                   $('.loading-pax-train').hide();
                }

               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error customer list');
                    $('.loading-pax-train').hide();
               },timeout: 60000
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
    document.getElementById('myForm2').submit();
}

function change_booker_value(type){
    try{
        if(document.getElementsByName('myRadios')[0].checked == true){
            copy_booker_to_passenger('copy',type)
        }
    }catch(err){}
}

function id_type_change(type, sequence){
    if(document.getElementById(type+'_id_type'+sequence).value == 'passport'){
        document.getElementById('adult_passport_number_required'+sequence).style.color = 'red';
        document.getElementById('adult_country_of_issued_required'+sequence+'_id').style.color = 'red';
    }else{
        document.getElementById('adult_passport_number_required'+sequence).style.color = 'white';
        document.getElementById('adult_country_of_issued_required'+sequence+'_id').style.color = 'white';
    }
}

function pick_passenger(type, sequence, product){
    if(product == 'cache'){
        add_passenger_cache(sequence)
//        document.getElementById('button_choose_'+sequence).innerHTML = 'Chosen';
        document.getElementById('search_result_passenger').innerHTML = '';
        document.getElementById('train_passenger_search').value = '';
    }else if(product == 'get_booking_vendor'){
        hide_result_booker_vendor();
        document.getElementById('hide_btn_click').hidden = true;
        document.getElementById('booker_vendor').value = passenger_data[sequence].title + ' ' + passenger_data[sequence].first_name + ' ' + passenger_data[sequence].last_name;
        document.getElementById('booker_vendor_id').value = passenger_data[sequence].seq_id;
        document.getElementById('booker_div').hidden = false;
        document.getElementById('clear_booker_booking_from_vendor_id').hidden = false;
        document.getElementById('clear_booker_booking_div').hidden = false;
        document.getElementById('search_booker_booking_from_vendor').hidden = true;
        document.getElementById('hide_btn_click').hidden = false;
        if(passenger_data[sequence].customer_parents.length != 0){
            for(i in passenger_data[sequence].customer_parents){
                document.getElementById('customer_parent_booking_from_vendor').innerHTML += `<option value="`+passenger_data[sequence].customer_parents[i].seq_id+`">`+passenger_data[sequence].customer_parents[i].name+`</option>`;
                $('#customer_parent_booking_from_vendor').niceSelect('update');
            }
            document.getElementById('cus_parent_div').hidden = false;
        }else{
            document.getElementById('customer_parent_booking_from_vendor').innerHTML = '';
            document.getElementById('cus_parent_div').hidden = true;
            $('#customer_parent_booking_from_vendor').niceSelect('update');
        }
//        get_customer_parent();
    }else if(type == '' || product == 'issued_offline'){
        if(type == 'Booker'){
            document.getElementById('contact_person').value = passenger_data[sequence].title + ' ' + passenger_data[sequence].first_name + ' ' + passenger_data[sequence].last_name;
            document.getElementById('contact_id').value = passenger_data[sequence].seq_id;
            $('#myModal').modal('hide');
        }else if(product == 'medical'){
            passenger_number++;
//            document.getElementById('name_pax'+passenger_number).innerHTML = passenger_data[sequence].title + ' ' + passenger_data[sequence].first_name + ' ' + passenger_data[sequence].last_name;
//            document.getElementById('id_passenger'+passenger_number).value = passenger_data[sequence].id;
//            document.getElementById('birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
            //masukkin data
//            for(i in passenger_data_pick){
//                if(passenger_data_pick[i].sequence == 'adult'+passenger_number){
//                    passenger_data_pick.splice(i,1);
//                    break;
//                }
//            }
            check = 0;
            for(i in passenger_data_pick){
                if(passenger_data_pick[i].seq_id == passenger_data[sequence].seq_id){
                    check = 1;
                }
            }
            if(check == 0){
                passenger_data_pick.push(passenger_data[sequence]);
                for(i in document.getElementById('adult_title'+passenger_number).options){
                    document.getElementById('adult_title'+passenger_number).options[i].disabled = false;
                }
                if(passenger_data[sequence].title == 'MR')
                    document.getElementById('adult_title'+passenger_number).value = passenger_data[sequence].title;
                else
                    document.getElementById('adult_title'+passenger_number).value = "MS";
                for(i in document.getElementById('adult_title'+passenger_number).options){
                    if(document.getElementById('adult_title'+passenger_number).options[i].selected != true)
                        document.getElementById('adult_title'+passenger_number).options[i].disabled = true;
                }
                $('#adult_title'+passenger_number).niceSelect('update');
                onchange_title(passenger_number);
                document.getElementById('adult_first_name'+passenger_number).value = passenger_data[sequence].first_name;
                document.getElementById('adult_first_name'+passenger_number).readOnly = true;
                document.getElementById('adult_last_name'+passenger_number).value = passenger_data[sequence].last_name;
                document.getElementById('adult_last_name'+passenger_number).readOnly = true;

    //            capitalizeInput('adult_first_name'+passenger_number);
    //            passenger_data[sequence].first_name = document.getElementById('adult_first_name'+passenger_number).value;
    //            capitalizeInput('adult_last_name'+passenger_number);
    //            passenger_data[sequence].last_name = document.getElementById('adult_last_name'+passenger_number).value;

                document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                    document.getElementById('select2-adult_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                    document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                }
                document.getElementById('adult_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
                if(passenger_data[sequence].identities.hasOwnProperty('ktp') == true){
                    document.getElementById('adult_identity_type'+passenger_number).value = 'ktp';
                    $('#adult_identity_type'+passenger_number).niceSelect('update');
                    document.getElementById('adult_identity_number'+passenger_number).value = passenger_data[sequence].identities.ktp.identity_number;
                    document.getElementById('adult_identity_number'+passenger_number).readOnly = true;
                    if(passenger_data[sequence].identities.ktp.identity_country_of_issued_name != '' && passenger_data[sequence].identities.ktp.identity_country_of_issued_name != undefined){
                        document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.ktp.identity_country_of_issued_name;
                        document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.ktp.identity_country_of_issued_name;
                        auto_complete('adult_country_of_issued'+passenger_number);
                        document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                    }
                }
                    //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;

                try{
                    document.getElementById('adult_email'+passenger_number).value = passenger_data[sequence].email;
                }catch(err){}
                try{
                    var phone = document.getElementById('phone_chosen'+sequence).value;
                    document.getElementById('adult_phone_code'+passenger_number).value = phone.split(' - ')[0];
                    document.getElementById('select2-adult_phone_code'+passenger_number+'_id-container').value = phone.split(' - ')[0];
                    document.getElementById('adult_phone'+passenger_number).value = phone.split(' - ')[1];
                }catch(err){
                    console.log(err);
                }
                document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].seq_id;
    //            document.getElementById('pax_type'+sequence).innerHTML = passenger_data[sequence].pax_type;
//                document.getElementById('radio_passenger_input'+passenger_number).checked = true;
                $("#myModalPassengerSearch"+(passenger_number-1)).modal('hide');

                radio_button('passenger',passenger_number);
                document.getElementById('search_result_'+passenger_number).innerHTML = '';
                update_contact('passenger',passenger_number);
                passenger_number--;
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: "You can't choose same person in 1 booking",
                })
            }
            //$('#myModalPassenger'+parseInt(passenger_number-1)).modal('hide');
        }else{
            passenger_number++;
//            document.getElementById('name_pax'+passenger_number).innerHTML = passenger_data[sequence].title + ' ' + passenger_data[sequence].first_name + ' ' + passenger_data[sequence].last_name;
//            document.getElementById('id_passenger'+passenger_number).value = passenger_data[sequence].id;
//            document.getElementById('birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
            //masukkin data
//            for(i in passenger_data_pick){
//                if(passenger_data_pick[i].sequence == 'adult'+passenger_number){
//                    passenger_data_pick.splice(i,1);
//                    break;
//                }
//            }
            for(i in document.getElementById('adult_title'+passenger_number).options){
                document.getElementById('adult_title'+passenger_number).options[i].disabled = false;
            }
            document.getElementById('adult_title'+passenger_number).value = passenger_data[sequence].title;
            for(i in document.getElementById('adult_title'+passenger_number).options){
                if(document.getElementById('adult_title'+passenger_number).options[i].selected != true)
                    document.getElementById('adult_title'+passenger_number).options[i].disabled = true;
            }
            $('#adult_title'+passenger_number).niceSelect('update');

            document.getElementById('adult_first_name'+passenger_number).value = passenger_data[sequence].first_name;
            document.getElementById('adult_first_name'+passenger_number).readOnly = true;
            document.getElementById('adult_last_name'+passenger_number).value = passenger_data[sequence].last_name;
            document.getElementById('adult_last_name'+passenger_number).readOnly = true;

//            capitalizeInput('adult_first_name'+passenger_number);
//            passenger_data[sequence].first_name = document.getElementById('adult_first_name'+passenger_number).value;
//            capitalizeInput('adult_last_name'+passenger_number);
//            passenger_data[sequence].last_name = document.getElementById('adult_last_name'+passenger_number).value;

            document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                document.getElementById('select2-adult_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            }
            document.getElementById('adult_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
            if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                document.getElementById('adult_identity_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
                document.getElementById('adult_identity_number'+passenger_number).readOnly = true;
                if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
                    document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                    document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                    auto_complete('adult_country_of_issued'+passenger_number);
                    document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                }
                if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
                    document.getElementById('adult_identity_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                }
            }
                //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;

            try{
                document.getElementById('adult_email'+passenger_number).value = passenger_data[sequence].email;
            }catch(err){}
            try{
                document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].seq_id;
            }catch(err){}
            try{
                var phone = document.getElementById('phone_chosen'+sequence).value;
                document.getElementById(passenger_pick+'_phone_code'+passenger_pick_number).value = phone.split(' - ')[0];
                document.getElementById(passenger_pick+'_phone'+passenger_pick_number).value = phone.split(' - ')[1];
            }catch(err){

            }

//            document.getElementById('pax_type'+sequence).innerHTML = passenger_data[sequence].pax_type;
            document.getElementById('search_result_'+passenger_number).innerHTML = '';
            update_contact('passenger',passenger_number);
            $('#myModalPassenger'+parseInt(passenger_number-1)).modal('hide');
        }
    }
    try{
        if(type == 'Booker'){
            //change booker
            check = 0;
            if(check == 0){
                document.getElementById('train_booker_search').value = '';
                try{
                    if(document.getElementsByName('myRadios')[0].checked == true){
                        clear_passenger('Adult',1);
                        document.getElementsByName('myRadios')[1].checked = true;
                    }
                }catch(err){}

                for(i in passenger_data_pick){
                    if(passenger_data_pick[i].sequence == 'booker'){
                        passenger_data_pick.splice(i,1);
                        break;
                    }
                }
                document.getElementById('booker_title').value = passenger_data[sequence].title;
                for(i in document.getElementById('booker_title').options){
                    document.getElementById('booker_title').options[i].disabled = false;
                }
                for(i in document.getElementById('booker_title').options){
                    if(document.getElementById('booker_title').options[i].selected != true)
                       document.getElementById('booker_title').options[i].disabled = true;
                }
                $('#booker_title').niceSelect('update');
                document.getElementById('booker_first_name').value = passenger_data[sequence].first_name;
                document.getElementById('booker_first_name').readOnly = true;
                document.getElementById('booker_last_name').value = passenger_data[sequence].last_name;
                document.getElementById('booker_last_name').readOnly = true;

    //            capitalizeInput('booker_first_name');
    //            passenger_data[sequence].first_name = document.getElementById('booker_first_name').value;
    //            capitalizeInput('booker_last_name');
    //            passenger_data[sequence].last_name = document.getElementById('booker_last_name').value;

                if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                    document.getElementById('select2-booker_nationality_id-container').innerHTML = passenger_data[sequence].nationality_name;
                    document.getElementById('booker_nationality').value = passenger_data[sequence].nationality_name;
                    document.getElementById('booker_nationality_id').disabled = true;
                }
                document.getElementById('booker_email').value = passenger_data[sequence].email;
                try{
                    var phone = document.getElementById('phone_chosen'+sequence).value;
                    if(phone != false){
                        document.getElementById('booker_phone_code').value = phone.split(' - ')[0];
                        document.getElementById('select2-booker_phone_code_id-container').innerHTML = phone.split(' - ')[0];
                        document.getElementById('booker_phone').value = phone.split(' - ')[1];
                    }
                }catch(err){

                }
                document.getElementById('booker_birth_date').value = passenger_data[sequence].birth_date;
                document.getElementById('booker_birth_date').readOnly = true;
                if(product == 'issued_offline'){
                    for(i in passenger_data[sequence].identities){
                        document.getElementById('booker_id_type').value = i;
                        document.getElementById('booker_id_type').readOnly = true;
                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities[i].identity_number;
                        document.getElementById('booker_id_number').readOnly = true;
                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities[i].identity_country_of_issued_name;
                        document.getElementById('booker_country_of_issued').readOnly = true;
                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities[i].identity_expdate;
                        document.getElementById('booker_exp_date').readOnly = true;
                        break;
                    }
                }else if(product == 'train'){
                    for(i in passenger_data[sequence].identities){
                        document.getElementById('booker_id_type').value = i;
                        document.getElementById('booker_id_type').readOnly = true;
                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities[i].identity_number;
                        document.getElementById('booker_id_number').readOnly = true;
                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities[i].identity_country_of_issued_name;
                        document.getElementById('booker_country_of_issued').readOnly = true;
                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities[i].identity_expdate;
                        document.getElementById('booker_exp_date').readOnly = true;
                        break;
                    }

                }else if(product == 'airline' || product == 'visa' || product == 'activity' || product == 'tour'){
                    if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities.passport.identity_number;
                        document.getElementById('booker_id_number').readOnly = true;
                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        document.getElementById('booker_country_of_issued').readOnly = true;
                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities.passport.identity_expdate;
                        document.getElementById('booker_exp_date').readOnly = true;

                    }
                }
                $("#corporate_booker").attr('data-tooltip', '');
                document.getElementById('corporate_booker').style.display = 'none';
                if(passenger_data[sequence].customer_parents.length != 0){
                    corporate_booker_temp = ''
                    for(j in passenger_data[sequence].customer_parents){
                        corporate_booker_temp += passenger_data[sequence].customer_parents[j].name + ' ' + passenger_data[sequence].customer_parents[j].currency + ' ' + getrupiah(passenger_data[sequence].customer_parents[j].actual_balance) + '\n';
                    }
                    $("#corporate_booker").attr('data-tooltip', corporate_booker_temp);
                    document.getElementById('corporate_booker').style.display = 'block';
                }
                auto_complete('booker_nationality');
                document.getElementById('booker_id').value = passenger_data[sequence].seq_id;
                //untuk booker check
                passenger_data_pick.push(passenger_data[sequence]);
                passenger_data_pick[passenger_data_pick.length-1].sequence = 'booker';
                $('#myModal').modal('hide');
                document.getElementById('search_result').innerHTML = '';
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: "You can't choose same person in 1 booking",
                })
            }
        }else if(type == 'adult'){
            if(document.getElementById('adult_id'+passenger_number).value == ''){
                check = 0;
                for(i in passenger_data_pick){
                    if(passenger_data_pick[i].seq_id == passenger_data[sequence].seq_id && passenger_data_pick[i].sequence != 'booker')
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
                        document.getElementById('adult_title'+passenger_number).options[i].disabled = false;
                    }
                    for(i in document.getElementById('adult_title'+passenger_number).options){
                        if(document.getElementById('adult_title'+passenger_number).options[i].selected != true)
                            document.getElementById('adult_title'+passenger_number).options[i].disabled = true;
                    }
                    $('#adult_title'+passenger_number).niceSelect('update');

                    document.getElementById('adult_first_name'+passenger_number).value = passenger_data[sequence].first_name;
                    document.getElementById('adult_first_name'+passenger_number).readOnly = true;
                    document.getElementById('adult_last_name'+passenger_number).value = passenger_data[sequence].last_name;
                    document.getElementById('adult_last_name'+passenger_number).readOnly = true;
                    document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;

    //                capitalizeInput('adult_first_name'+passenger_number);
    //                passenger_data[sequence].first_name = document.getElementById('adult_first_name'+passenger_number).value;
    //                capitalizeInput('adult_last_name'+passenger_number);
    //                passenger_data[sequence].last_name = document.getElementById('adult_last_name'+passenger_number).value;

                    if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                        document.getElementById('select2-adult_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                        document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                    }
                    document.getElementById('adult_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
                    if(product=='airline' || product == 'activity' || product == 'visa' || product == 'tour'){
                        if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                            //if 6 bulan
                            var date1 = moment(passenger_data[sequence].identities.passport.identity_expdate);
                            var date2 = moment();
                            var expired = date2.diff(date1, 'days');
                            if(expired < -180){
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
                        }
                        //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
                    }else if(product == 'train'){
                        if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                            document.getElementById('adult_id_type'+passenger_number).value = 'passport';
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
                        }else if(passenger_data[sequence].identities.hasOwnProperty('sim') == true){
                            document.getElementById('adult_id_type'+passenger_number).value = 'sim';
                            document.getElementById('adult_passport_number'+passenger_number).value = passenger_data[sequence].identities.sim.identity_number;
                            document.getElementById('adult_passport_number'+passenger_number).readOnly = true;
                            if(passenger_data[sequence].identities.sim.identity_country_of_issued_name != '' && passenger_data[sequence].identities.sim.identity_country_of_issued_name != undefined){
                                document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.sim.identity_country_of_issued_name;
                                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.sim.identity_country_of_issued_name;
                                auto_complete('adult_country_of_issued'+passenger_number);
                                document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                            }
                            if(passenger_data[sequence].identities.sim.identity_expdate != '' && passenger_data[sequence].identities.sim.identity_expdate != undefined){
                                document.getElementById('adult_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.sim.identity_expdate;
                            }
                        }else if(passenger_data[sequence].identities.hasOwnProperty('ktp') == true){
                            document.getElementById('adult_id_type'+passenger_number).value = 'ktp';
                            document.getElementById('adult_passport_number'+passenger_number).value = passenger_data[sequence].identities.ktp.identity_number;
                            document.getElementById('adult_passport_number'+passenger_number).readOnly = true;
                            if(passenger_data[sequence].identities.ktp.identity_country_of_issued_name != '' && passenger_data[sequence].identities.ktp.identity_country_of_issued_name != undefined){
                                document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.ktp.identity_country_of_issued_name;
                                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.ktp.identity_country_of_issued_name;
                                auto_complete('adult_country_of_issued'+passenger_number);
                                document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                            }
                            if(passenger_data[sequence].identities.ktp.identity_expdate != '' && passenger_data[sequence].identities.ktp.identity_expdate != undefined){
                                document.getElementById('adult_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.ktp.identity_expdate;
                            }
                        }else if(passenger_data[sequence].identities.hasOwnProperty('other') == true){
                            document.getElementById('adult_id_type'+passenger_number).value = 'other';
                            document.getElementById('adult_passport_number'+passenger_number).value = passenger_data[sequence].identities.other.identity_number;
                            document.getElementById('adult_passport_number'+passenger_number).readOnly = true;
                            if(passenger_data[sequence].identities.other.identity_country_of_issued_name != '' && passenger_data[sequence].identities.other.identity_country_of_issued_name != undefined){
                                document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.other.identity_country_of_issued_name;
                                document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.other.identity_country_of_issued_name;
                                auto_complete('adult_country_of_issued'+passenger_number);
                                document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                            }
                            if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
                                document.getElementById('adult_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                            }
                        }
                        $('#adult_id_type'+passenger_number).niceSelect('update');
                    }
                    try{
                        document.getElementById('adult_email'+passenger_number).value = passenger_data[sequence].email;
                    }catch(err){}
                    try{
                        var phone = document.getElementById('phone_chosen'+sequence).value;
                        document.getElementById(passenger_pick+'_phone_code'+passenger_number).value = phone.split(' - ')[0];
                        document.getElementById(passenger_pick+'_phone'+passenger_number).value = phone.split(' - ')[1];
                        document.getElementById('select2-adult_phone_code'+passenger_number+'_id-container').innerHTML = phone.split(' - ')[0];
                    }catch(err){
                        console.log(err);
                    }
                    passenger_data_pick.push(passenger_data[sequence]);
                    passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult'+passenger_number;
                    document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].seq_id;
                    auto_complete('adult_nationality'+passenger_number);
        //            if (document.getElementById("default-select")) {
        //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
        //                $('#adult_nationality1_id').niceSelect('update');
        //            };
                    $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
                    $('#adult_country_of_issued'+passenger_number).niceSelect('update');

                    $('#myModal_adult'+passenger_number).modal('hide');
                    document.getElementById('train_adult'+passenger_number+'_search').value = '';
                    document.getElementById('search_result_adult'+passenger_number).innerHTML = '';
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      text: "You can't choose same person in 1 booking",
                  })
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "Please clear before pick passenger",
              })
            }
        }else if(type == 'child'){
            if(document.getElementById('child_id'+passenger_number).value == ''){
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
                        document.getElementById('child_title'+passenger_number).options[i].disabled = false;
                    }
                    for(i in document.getElementById('child_title'+passenger_number).options){
                        if(document.getElementById('child_title'+passenger_number).options[i].selected != true)
                            document.getElementById('child_title'+passenger_number).options[i].disabled = true;
                    }
                    $('#child_title'+passenger_number).niceSelect('update');
                    document.getElementById('child_first_name'+passenger_number).value = passenger_data[sequence].first_name;
                    document.getElementById('child_first_name'+passenger_number).readOnly = true;
                    document.getElementById('child_last_name'+passenger_number).value = passenger_data[sequence].last_name;
                    document.getElementById('child_last_name'+passenger_number).readOnly = true;

    //                capitalizeInput('child_first_name'+passenger_number);
    //                passenger_data[sequence].first_name = document.getElementById('child_first_name'+passenger_number).value;
    //                capitalizeInput('child_last_name'+passenger_number);
    //                passenger_data[sequence].last_name = document.getElementById('child_last_name'+passenger_number).value;

                    document.getElementById('child_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                    if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                        document.getElementById('select2-child_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                        document.getElementById('child_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                    }
                    document.getElementById('child_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
                    if(product=='airline' || product == 'activity' || product == 'visa' || product == 'tour'){
                        if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                            var date1 = moment(passenger_data[sequence].identities.passport.identity_expdate);
                            var date2 = moment();
                            var expired = date2.diff(date1, 'days');
                            if(expired < -180){
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
                        }
                        //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
                    }
                    passenger_data_pick.push(passenger_data[sequence]);
                    passenger_data_pick[passenger_data_pick.length-1].sequence = 'child'+passenger_number;
                    document.getElementById('child_id'+passenger_number).value = passenger_data[sequence].seq_id;
                    auto_complete('child_nationality'+passenger_number);
        //            if (document.getElementById("default-select")) {
        //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
        //                $('#adult_nationality1_id').niceSelect('update');
        //            };
                    $('#child_nationality'+passenger_number+'_id').niceSelect('update');
                    $('#child_country_of_issued'+passenger_number).niceSelect('update');
                    $('#myModal_child'+passenger_number).modal('hide');
                    document.getElementById('train_child'+passenger_number+'_search').value = '';
                    document.getElementById('search_result_child'+passenger_number).innerHTML = '';
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      text: "You can't choose same person in 1 booking",
                  })
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "Please clear before pick passenger",
              })
            }
        }else if(type == 'infant'){
            if(document.getElementById('infant_id'+passenger_number).value == ''){
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
                        document.getElementById('infant_title'+passenger_number).options[i].disabled = false;
                    }
                    for(i in document.getElementById('infant_title'+passenger_number).options){
                        if(document.getElementById('infant_title'+passenger_number).options[i].selected != true)
                            document.getElementById('infant_title'+passenger_number).options[i].disabled = true;
                    }
                    $('#infant_title'+passenger_number).niceSelect('update');
                    document.getElementById('infant_first_name'+passenger_number).value = passenger_data[sequence].first_name;
                    document.getElementById('infant_first_name'+passenger_number).readOnly = true;
                    document.getElementById('infant_last_name'+passenger_number).value = passenger_data[sequence].last_name;
                    document.getElementById('infant_last_name'+passenger_number).readOnly = true;

    //                capitalizeInput('infant_first_name'+passenger_number);
    //                passenger_data[sequence].first_name = document.getElementById('infant_first_name'+passenger_number).value;
    //                capitalizeInput('infant_last_name'+passenger_number);
    //                passenger_data[sequence].last_name = document.getElementById('infant_last_name'+passenger_number).value;

                    document.getElementById('infant_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                    if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                        document.getElementById('select2-infant_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
                        document.getElementById('infant_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                    }
                    document.getElementById('infant_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
                    if(product=='airline' || product == 'activity' || product == 'visa' || product == 'tour'){
                        if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                            var date1 = moment(passenger_data[sequence].identities.passport.identity_expdate);
                            var date2 = moment();
                            var expired = date2.diff(date1, 'days');
                            if(expired < -180){
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
                        }
                        //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
                    }
                    passenger_data_pick.push(passenger_data[sequence]);
                    passenger_data_pick[passenger_data_pick.length-1].sequence = 'infant'+passenger_number;
                    document.getElementById('infant_id'+passenger_number).value = passenger_data[sequence].seq_id;
                    auto_complete('infant_nationality'+passenger_number);
            //            if (document.getElementById("default-select")) {
            //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
            //                $('#adult_nationality1_id').niceSelect('update');
            //            };
                    $('#infant_nationality'+passenger_number+'_id').niceSelect('update');
                    $('#infant_country_of_issued'+passenger_number).niceSelect('update');
                    $('#myModal_infant'+passenger_number).modal('hide');
                    document.getElementById('train_infant'+passenger_number+'_search').value = '';
                    document.getElementById('search_result_infant'+passenger_number).innerHTML = '';
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      text: "You can't choose same person in 1 booking",
                  })
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "Please clear before pick passenger",
              })
            }
        }else if(type == 'senior'){
            if(document.getElementById('senior_id'+passenger_number).value == ''){
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
                        document.getElementById('senior_title'+passenger_number).options[i].disabled = false;
                    }
                    $('#senior_title'+passenger_number).niceSelect('update');
                    document.getElementById('senior_first_name'+passenger_number).value = passenger_data[sequence].first_name;
                    document.getElementById('senior_first_name'+passenger_number).readOnly = true;
                    document.getElementById('senior_last_name'+passenger_number).value = passenger_data[sequence].last_name;
                    document.getElementById('senior_last_name'+passenger_number).readOnly = true;

    //                capitalizeInput('senior_first_name'+passenger_number);
    //                passenger_data[sequence].first_name = document.getElementById('senior_first_name'+passenger_number).value;
    //                capitalizeInput('senior_last_name'+passenger_number);
    //                passenger_data[sequence].last_name = document.getElementById('senior_last_name'+passenger_number).value;

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
        //            if (document.getElementById("default-select")) {
        //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
        //                $('#adult_nationality1_id').niceSelect('update');
        //            };
                    $('#senior_nationality'+passenger_number+'_id').niceSelect('update');
                    $('#senior_country_of_issued'+passenger_number).niceSelect('update');
                    $('#myModal_senior'+passenger_number).modal('hide');
                    document.getElementById('train_senior'+passenger_number+'_search').value = '';
                    document.getElementById('search_result_senior'+passenger_number).innerHTML = '';
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      text: "You can't choose same person in 1 booking",
                    })
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: "Please clear before pick passenger",
              })
            }
        }
    }catch(err){}
}

function copy_booker_to_passenger(val,type){
    if(val == 'copy'){
        if(type == 'issued_offline'){
            if(document.getElementById('booker_title').value != '' &&
               document.getElementById('booker_first_name').value != '' &&
               document.getElementById('booker_last_name').value != '' &&
               document.getElementById('booker_nationality').value != '' &&
               document.getElementById('booker_email').value != '' &&
               document.getElementById('booker_phone').value != ''){
                try{
                    if(counter_passenger == 0){
                        add_table_of_passenger('');
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
                    $('#adult_title1').niceSelect('update');
                    document.getElementById('adult_first_name1').value = document.getElementById('booker_first_name').value;
                    document.getElementById('adult_first_name1').readOnly = true;
                    document.getElementById('adult_last_name1').value = document.getElementById('booker_last_name').value;
                    document.getElementById('adult_last_name1').readOnly = true;
                    document.getElementById('name_pax0').innerHTML = document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
                    document.getElementById('birth_date0').innerHTML = document.getElementById('booker_birth_date').value;
                    document.getElementById('adult_nationality1').value = document.getElementById('booker_nationality').value;
                    document.getElementById('select2-adult_nationality1_id-container').innerHTML = document.getElementById('booker_nationality').value;
                    document.getElementById('adult_birth_date1').value = document.getElementById('booker_birth_date').value;
                    document.getElementById('adult_email1').value = document.getElementById('booker_email').value;
                    document.getElementById('adult_phone1').value = document.getElementById('booker_phone').value;
                    document.getElementById('adult_phone_code1').value = document.getElementById('booker_phone_code').value;

                    if(document.getElementById('booker_id_number').value != 'undefined' && document.getElementById('booker_id_number').value != '')
                        document.getElementById('adult_identity_number1').value = document.getElementById('booker_id_number').value;
                    if(document.getElementById('booker_id_type').value != 'undefined' && document.getElementById('booker_id_type').value != '')
                        document.getElementById('adult_identity_type1').value = document.getElementById('booker_id_type').value;
                    if(document.getElementById('booker_exp_date').value != 'undefined' && document.getElementById('booker_exp_date').value != '')
                        document.getElementById('adult_identity_expired_date1').value = document.getElementById('booker_exp_date').value;
                    if(document.getElementById('booker_country_of_issued').value != 'undefined' && document.getElementById('booker_country_of_issued').value != ''){
                        document.getElementById('select2-adult_country_of_issued1_id-container').innerHTML = document.getElementById('booker_country_of_issued').value;
                        document.getElementById('adult_country_of_issued1').value = document.getElementById('booker_country_of_issued').value;
                    }
                    document.getElementById('adult_nationality1_id').disabled = true;
                    document.getElementById('adult_email1').readOnly = true;
                    document.getElementById('adult_phone1').readOnly = true;
                    //document.getElementById('adult_phone_code1_id').disabled = true;
                    if(document.getElementById('adult_birth_date1').value != '')
                        document.getElementById('adult_birth_date1').disabled = true;
                    document.getElementById('adult_id1').value = document.getElementById('booker_id').value;
                    $('#adult_identity_type1').niceSelect('update');
                }catch(err){
                    console.log(err);
                    document.getElementsByName('myRadios')[1].checked = true;
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      text: "Please add passenger first!",
                    })
                }
            }else{
                msg = '';
                if(document.getElementById('booker_title').value == '')
                    msg += 'Please fill Booker title<br/>';
                if(document.getElementById('booker_first_name').value == '')
                    msg += 'Please fill Booker first name<br/>';
                if(document.getElementById('booker_last_name').value == '' )
                    msg += 'Please fill Booker last name<br/>';
                if(document.getElementById('booker_nationality').value == '')
                    msg += 'Please fill Booker nationality<br/>';
                if(document.getElementById('booker_email').value == '')
                    msg += 'Please fill Booker email<br/>';
                if(document.getElementById('booker_phone').value == '')
                    msg += 'Please fill Booker booker phone<br/>';
                document.getElementsByName('myRadios')[1].checked = true;
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg,
                })
            }
        }else if(type == 'medical'){
            if(document.getElementById('booker_title').value != '' &&
               document.getElementById('booker_first_name').value != '' &&
               document.getElementById('booker_nationality').value != '' &&
               document.getElementById('booker_email').value != '' &&
               document.getElementById('booker_phone').value != ''){
               try{
                   document.getElementById("button_search0").style.display = "none";
                   document.getElementById("button_clear0").style.display = "none";
               }catch(err){}
                try{
                    if(counter_passenger == 0){
                        add_table_of_passenger('');
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
                    $('#adult_title1').niceSelect('update');
                    document.getElementById('adult_first_name1').value = document.getElementById('booker_first_name').value;
                    document.getElementById('adult_first_name1').readOnly = true;
                    document.getElementById('adult_last_name1').value = document.getElementById('booker_last_name').value;
                    document.getElementById('adult_last_name1').readOnly = true;
                    document.getElementById('name_pax0').innerHTML = "<b>Name: </b>"+document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
                    document.getElementById('birth_date0').innerHTML = "<b>Birth Date: </b>"+document.getElementById('booker_birth_date').value;
                    document.getElementById('adult_nationality1').value = document.getElementById('booker_nationality').value;
                    document.getElementById('select2-adult_nationality1_id-container').innerHTML = document.getElementById('booker_nationality').value;
                    document.getElementById('adult_birth_date1').value = document.getElementById('booker_birth_date').value;
                    document.getElementById('adult_email1').value = document.getElementById('booker_email').value;
                    document.getElementById('adult_phone1').value = document.getElementById('booker_phone').value;
                    document.getElementById('adult_phone_code1').value = document.getElementById('booker_phone_code').value;

                    if(document.getElementById('booker_id_type').value == 'ktp' && vendor == 'periksain' || vendor == 'phc' && test_type == 'PHCDTKATG' && document.getElementById('booker_id_type').value == 'ktp' || vendor == 'phc' && test_type == 'PHCHCKATG' && document.getElementById('booker_id_type').value == 'ktp'){
                        if(document.getElementById('booker_id_number').value != 'undefined' && document.getElementById('booker_id_number').value != '')
                            document.getElementById('adult_identity_number1').value = document.getElementById('booker_id_number').value;
                        if(document.getElementById('booker_id_type').value != 'undefined' && document.getElementById('booker_id_type').value != '')
                            document.getElementById('adult_identity_type1').value = document.getElementById('booker_id_type').value;
                        if(document.getElementById('booker_country_of_issued').value != 'undefined' && document.getElementById('booker_country_of_issued').value != ''){
                            document.getElementById('select2-adult_country_of_issued1_id-container').innerHTML = document.getElementById('booker_country_of_issued').value;
                            document.getElementById('adult_country_of_issued1').value = document.getElementById('booker_country_of_issued').value;
                        }
                    }
                    document.getElementById('adult_nationality1_id').disabled = true;
                    document.getElementById('adult_email1').readOnly = true;
                    document.getElementById('adult_phone1').readOnly = true;
                    //document.getElementById('adult_phone_code1_id').disabled = true;
                    if(document.getElementById('adult_birth_date1').value != '')
                        document.getElementById('adult_birth_date1').disabled = true;
                    document.getElementById('adult_id1').value = document.getElementById('booker_id').value;
                    document.getElementById('button_clear0').hidden = true;

                    $('#adult_identity_type1').niceSelect('update');
                }catch(err){
                    console.log(err);
                    document.getElementsByName('myRadios')[1].checked = true;
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      text: "Please add passenger first!",
                    })
                }
            }else{
                msg = '';
                if(document.getElementById('booker_title').value == '')
                    msg += 'Please fill Booker title<br/>';
                if(document.getElementById('booker_first_name').value == '')
                    msg += 'Please fill Booker first name<br/>';
                if(document.getElementById('booker_last_name').value == '' )
                    msg += 'Please fill Booker last name<br/>';
                if(document.getElementById('booker_nationality').value == '')
                    msg += 'Please fill Booker nationality<br/>';
                if(document.getElementById('booker_email').value == '')
                    msg += 'Please fill Booker email<br/>';
                if(document.getElementById('booker_phone').value == '')
                    msg += 'Please fill Booker booker phone<br/>';
                document.getElementsByName('myRadios')[1].checked = true;
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg,
                })
            }
        }else if(document.getElementById('adult_id1').value == '' || document.getElementById('adult_id1').value == document.getElementById('booker_id').value){
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
                document.getElementById('adult_title1').options[i].disabled = false;
            }
            for(i in document.getElementById('adult_title1').options){
                if(document.getElementById('adult_title1').options[i].selected != true)
                    document.getElementById('adult_title1').options[i].disabled = true;
            }
            $('#adult_title1').niceSelect('update');
            document.getElementById('adult_first_name1').value = document.getElementById('booker_first_name').value;
            document.getElementById('adult_first_name1').readOnly = true;
            document.getElementById('adult_last_name1').value = document.getElementById('booker_last_name').value;
            document.getElementById('adult_last_name1').readOnly = true;
            document.getElementById('adult_nationality1').value = document.getElementById('booker_nationality').value;
            document.getElementById('select2-adult_nationality1_id-container').innerHTML = document.getElementById('booker_nationality').value;
            //testing
            if(document.getElementById('booker_birth_date').value != '')
                document.getElementById('adult_birth_date1').value = document.getElementById('booker_birth_date').value;
            document.getElementById('adult_email1').value = document.getElementById('booker_email').value;
            document.getElementById('adult_phone1').value = document.getElementById('booker_phone').value;
            document.getElementById('adult_phone_code1').value = document.getElementById('booker_phone_code').value;
            if(document.getElementById('adult_birth_date1').value != '' && check_date(document.getElementById('adult_birth_date1').value) == true){
                try{
                    check_years_old(1,'adult');
                    document.getElementById('adult_birth_date1').readOnly = true;
                }catch(err){}
            }
            if(type == 'train'){
                document.getElementById('adult_phone_code1').value = document.getElementById('booker_phone_code').value;
                document.getElementById('adult_phone1').value = document.getElementById('booker_phone').value;
                if(document.getElementById('booker_id_type').value != ''){
                    document.getElementById('adult_id_type1').value = document.getElementById('booker_id_type').value;
                    $('#adult_id_type1').niceSelect('update');
                    if(document.getElementById('booker_id_number').value != 'undefined' && document.getElementById('booker_id_number').value != '')
                        document.getElementById('adult_passport_number1').value = document.getElementById('booker_id_number').value;
                    if(document.getElementById('booker_exp_date').value != 'undefined' && document.getElementById('booker_exp_date').value != '')
                        document.getElementById('adult_passport_expired_date1').value = document.getElementById('booker_exp_date').value;
                    if(document.getElementById('booker_country_of_issued').value != 'undefined' && document.getElementById('booker_country_of_issued').value != ''){
                        document.getElementById('select2-adult_country_of_issued1_id-container').innerHTML = document.getElementById('booker_country_of_issued').value;
                        document.getElementById('adult_country_of_issued1').value = document.getElementById('booker_country_of_issued').value;
                    }
                }
            }else if(type == 'airline' || type == 'activity' || type == 'tour' || type == 'visa'){
                //check 6 bulan
                var date1 = moment(document.getElementById('booker_exp_date').value);
                var date2 = moment();
                var expired = date2.diff(date1, 'days');
                if(expired < -180){
                    if(document.getElementById('booker_id_number').value != 'undefined' && document.getElementById('booker_id_number').value != '')
                        document.getElementById('adult_passport_number1').value = document.getElementById('booker_id_number').value;
                    if(document.getElementById('booker_exp_date').value != 'undefined' && document.getElementById('booker_exp_date').value != '')
                        document.getElementById('adult_passport_expired_date1').value = document.getElementById('booker_exp_date').value;
                    if(document.getElementById('booker_country_of_issued').value != 'undefined' && document.getElementById('booker_country_of_issued').value != ''){
                        document.getElementById('select2-adult_country_of_issued1_id-container').innerHTML = document.getElementById('booker_country_of_issued').value;
                        document.getElementById('adult_country_of_issued1').value = document.getElementById('booker_country_of_issued').value;
                    }
                }
            }
            document.getElementById('adult_nationality1_id').disabled = true;
            document.getElementById('adult_email1').readOnly = true;
            document.getElementById('adult_phone1').readOnly = true;
            document.getElementById('adult_phone_code1_id').disabled = true;
            if(document.getElementById('adult_birth_date1').value != '' && document.getElementById('booker_birth_date').value != '')
                document.getElementById('adult_birth_date1').disabled = true;
            document.getElementById('adult_id1').value = document.getElementById('booker_id').value;
        }else{
            document.getElementsByName('myRadios')[1].checked = true;
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: "Please clear before copy booker",
            })
        }
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
        $('#adult_title1').niceSelect('update');
        document.getElementById('adult_first_name1').value = '';
        document.getElementById('adult_first_name1').readOnly = false;
        document.getElementById('adult_last_name1').value = '';
        document.getElementById('adult_last_name1').readOnly = false;
        document.getElementById('adult_nationality1').value = 'Indonesia';
        document.getElementById('select2-adult_nationality1_id-container').value = 'Indonesia';
        //testing

        try{
            initial_date = moment().subtract(17, 'years').format('DD MMM YYYY');
            document.getElementById('adult_birth_date1').value = initial_date;
            document.getElementById('adult_passport_number1').value = '';
            document.getElementById('adult_passport_number1').readOnly = false;
            document.getElementById('adult_passport_expired_date1').value = '';
            document.getElementById('adult_passport_expired_date1').readOnly = false;
            document.getElementById('adult_country_of_issued1').value = '';
            document.getElementById('select2-adult_country_of_issued1_id-container').value = '';
        }catch(err){}
        try{
            document.getElementById('adult_identity_type1').value = '';
            $('#adult_identity_type1').niceSelect('update');
            document.getElementById('adult_identity_number1').value = '';
            document.getElementById('adult_identity_number1').readOnly = false;
            document.getElementById('adult_identity_expired_date1').value = '';
            document.getElementById('adult_identity_expired_date1').readOnly = false;
            document.getElementById('select2-adult_country_of_issued1_id-container').value = '';
        }catch(err){}
        document.getElementById('adult_email1').value = '';
        document.getElementById('adult_email1').readOnly = false;
        document.getElementById('adult_nationality1_id').disabled = false;
        document.getElementById('adult_phone_code1_id').disabled = false;
        document.getElementById('adult_phone1').readOnly = false;
        document.getElementById('adult_birth_date1').disabled = false;
        try{
            document.getElementById('adult_phone_code1').value = '62';
            document.getElementById('select2-adult_phone_code1_id-container').value = '62';
            document.getElementById('select2-adult_phone_code1_id-container').readOnly = false;
            document.getElementById('adult_phone1').value = '';
            document.getElementById('adult_phone1').readOnly = false;
        }catch(err){

        }
        try{
            document.getElementById('name_pax0').innerHTML = '';
            document.getElementById('id_passenger0').value = '';
            document.getElementById('birth_date0').innerHTML = '';
            document.getElementById('sample_method0').innerHTML = '';
        }catch(err){}
        document.getElementById('adult_id1').value = '';

        if(type == "medical"){
            document.getElementById('button_clear0').hidden = false;
            document.getElementById('adult_identity_type1').value = 'ktp';
            $('#adult_identity_type1').niceSelect('update');
            try{
            document.getElementById("button_search0").style.display = "unset";
            document.getElementById("button_clear0").style.display = "unset";
            document.getElementById("name_pax0").textContent = "--Fill Passenger--";
            }catch(err){}
        }
    }
}

function clear_passenger(type, sequence){
    if(type == 'Booker'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'booker'){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('booker_title').value = 'MR';
        for(i in document.getElementById('booker_title').options){
            document.getElementById('booker_title').options[i].disabled = false;
        }
        $('#booker_title').niceSelect('update');
        document.getElementById('booker_first_name').value = '';
        document.getElementById('booker_first_name').readOnly = false;
        document.getElementById('booker_last_name').value = '';
        document.getElementById('booker_last_name').readOnly = false;
        document.getElementById('booker_nationality').value = 'Indonesia';
        document.getElementById('booker_nationality_id').disabled = false;
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
        document.getElementsByName('myRadios')[1].checked = true;
        clear_passenger('Adult', 1);
    }
    else if(type == 'Adult'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'adult'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        try{
            document.getElementById('adult_title'+sequence).value = 'MR';
            for(i in document.getElementById('adult_title'+sequence).options){
                document.getElementById('adult_title'+sequence).options[i].disabled = false;
            }
            $('#adult_title'+sequence).niceSelect('update');
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
            document.getElementById('adult_nationality'+sequence+'_id').disabled = false;
            //testing
            initial_date = moment().subtract(18, 'years').format('DD MMM YYYY');
            document.getElementById('adult_birth_date'+sequence).value = initial_date;
            document.getElementById('adult_birth_date'+sequence).disabled = false;
            document.getElementById('adult_passport_number'+sequence).value = '';
            document.getElementById('adult_passport_number'+sequence).readOnly = false;
            document.getElementById('adult_passport_expired_date'+sequence).value = '';
            document.getElementById('adult_passport_expired_date'+sequence).readOnly = false;
            document.getElementById('adult_country_of_issued'+sequence).value = '';
            document.getElementById('select2-adult_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
            document.getElementById('adult_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
        }catch(err){}

    }
    else if(type == 'Infant'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'infant'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        try{
            document.getElementById('infant_title'+sequence).value = 'MSTR';
            for(i in document.getElementById('infant_title'+sequence).options){
                document.getElementById('infant_title'+sequence).options[i].disabled = false;
            }
            $('#infant_title'+sequence).niceSelect('update');
            document.getElementById('infant_id'+sequence).value = '';
            document.getElementById('infant_first_name'+sequence).value = '';
            document.getElementById('infant_first_name'+sequence).readOnly = false;
            document.getElementById('infant_last_name'+sequence).value = '';
            document.getElementById('infant_last_name'+sequence).readOnly = false;
            document.getElementById('infant_nationality'+sequence).value = 'Indonesia';
            document.getElementById('select2-infant_nationality'+sequence+'_id-container').value = 'Indonesia';
            //testing
            initial_date = moment().subtract(1, 'years').format('DD MMM YYYY');
            document.getElementById('infant_birth_date'+sequence).value = initial_date;
            document.getElementById('infant_passport_number'+sequence).value = '';
            document.getElementById('infant_passport_number'+sequence).readOnly = false;
            document.getElementById('infant_passport_expired_date'+sequence).value = '';
            document.getElementById('infant_passport_expired_date'+sequence).readOnly = false;
            document.getElementById('infant_country_of_issued'+sequence).value = '';
            document.getElementById('select2-infant_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
            document.getElementById('infant_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
        }catch(err){}
    }
    else if(type == 'Senior'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'senior'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('senior_title'+sequence).value = 'MR';
        for(i in document.getElementById('senior_title'+sequence).options){
            document.getElementById('senior_title'+sequence).options[i].disabled = false;
        }
        $('#senior_title'+sequence).niceSelect('update');
        document.getElementById('senior_id'+sequence).value = '';
        document.getElementById('senior_first_name'+sequence).value = '';
        document.getElementById('senior_first_name'+sequence).readOnly = false;
        document.getElementById('senior_last_name'+sequence).value = '';
        document.getElementById('senior_last_name'+sequence).readOnly = false;
        document.getElementById('senior_nationality'+sequence).value = 'Indonesia';
        document.getElementById('select2-senior_nationality'+sequence+'_id-container').value = 'Indonesia';
        //testing
        initial_date = moment().subtract(80, 'years').format('DD MMM YYYY');
        document.getElementById('senior_birth_date'+sequence).value = initial_date;
        document.getElementById('senior_passport_number'+sequence).value = '';
        document.getElementById('senior_passport_number'+sequence).readOnly = false;
        document.getElementById('senior_passport_expired_date'+sequence).value = '';
        document.getElementById('senior_passport_expired_date'+sequence).readOnly = false;
        document.getElementById('senior_country_of_issued'+sequence).value = '';
        document.getElementById('select2-senior_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
        document.getElementById('senior_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
    }
    else if(type == 'Child'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'child'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById('child_title'+sequence).value = 'MSTR';
        for(i in document.getElementById('child_title'+sequence).options){
            document.getElementById('child_title'+sequence).options[i].disabled = false;
        }
        document.getElementById('child_id'+sequence).value = '';
        document.getElementById('child_first_name'+sequence).value = '';
        document.getElementById('child_first_name'+sequence).readOnly = false;
        document.getElementById('child_last_name'+sequence).value = '';
        document.getElementById('child_last_name'+sequence).readOnly = false;
        document.getElementById('child_nationality'+sequence).value = 'Indonesia';
        document.getElementById('select2-child_nationality'+sequence+'_id-container').value = 'Indonesia';
        //testing
        initial_date = moment().subtract(5, 'years').format('DD MMM YYYY');
        document.getElementById('child_birth_date'+sequence).value = initial_date;
        document.getElementById('child_passport_number'+sequence).value = '';
        document.getElementById('child_passport_number'+sequence).readOnly = false;
        document.getElementById('child_passport_expired_date'+sequence).value = '';
        document.getElementById('child_passport_expired_date'+sequence).readOnly = false;
        document.getElementById('child_country_of_issued'+sequence).value = '';
        document.getElementById('select2-child_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
        document.getElementById('child_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
    }

    else if(type == 'Medical'){
        Swal.fire({
          title: 'Are you sure Clear for Customer #'+sequence,
          html: '<h4 style="color:red;">All data that you have filled in will be deleted.<h4/>',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                for(i in passenger_data_pick){
                    if(passenger_data_pick[i].sequence == 'adult'+sequence){
                        passenger_data_pick.splice(i,1);
                        break;
                    }
                }
                try{
                    //common
                    document.getElementById('adult_title'+sequence).value = '';
                    for(i in document.getElementById('adult_title'+sequence).options){
                        document.getElementById('adult_title'+sequence).options[i].disabled = false;
                    }
                    $('#adult_title'+sequence).niceSelect('update');
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

                    //initial_date = moment().subtract(18, 'years').format('DD MMM YYYY');
                    document.getElementById('adult_birth_date'+sequence).value = "";
                    //document.getElementById('adult_birth_date'+sequence).disabled = false;
                    document.getElementById('adult_identity_number'+sequence).value = '';
                    document.getElementById('adult_identity_number'+sequence).readOnly = false;
                    document.getElementById('adult_identity_expired_date'+sequence).value = '';
                    document.getElementById('adult_identity_expired_date'+sequence).readOnly = false;

                    document.getElementById('select2-adult_nationality'+sequence+'_id-container').innerHTML = "Indonesia";
                    document.getElementById('adult_nationality'+sequence).value = "Indonesia";

                    document.getElementById('adult_country_of_issued'+sequence).value = "Indonesia";
                    document.getElementById('adult_country_of_issued'+sequence+'_id').value = 'Indonesia';
                    document.getElementById('select2-adult_country_of_issued'+sequence+'_id-container').innerHTML = 'Indonesia';

                    document.getElementById('adult_address'+sequence).value = '';

                    if(vendor == 'phc'){
                        //personal data
                        document.getElementById('adult_profession'+sequence).value = 'SWASTA';
                        $('#adult_profession'+sequence).niceSelect('update');
                        try{
                            document.getElementById('adult_mother_name'+sequence).value = 'NA'; //VALUE IKUTI DEFAULT
                        }catch(err){}
                        try{
                            document.getElementById('adult_tempat_lahir'+sequence).value = '';
                            document.getElementById('adult_tempat_lahir'+sequence+'_id').value = '';
                            document.getElementById('select2-adult_tempat_lahir'+sequence+'_id-container').innerHTML = 'Select Tempat Lahir';
                        }catch(err){}

                        try{
                            var adult_kabupaten_string = 'adult_kabupaten_ktp'+sequence+'_id';
                            delete_type(adult_kabupaten_string, sequence);
                            var adult_domisili_string = 'adult_kabupaten'+sequence+'_id';
                            delete_type(adult_domisili_string, sequence);
                        }catch(err){}

                        document.getElementById('adult_work_place'+sequence).value = 'Surabaya';
                        document.getElementById('adult_work_place_div'+sequence).style.display = 'block';

                        document.getElementById('adult_address_ktp'+sequence).value = '';
                        document.getElementById('adult_rt_ktp'+sequence).value = '';
                        document.getElementById('adult_rw_ktp'+sequence).value = '';
                        document.getElementById("adult_copy_yes"+sequence).click();


                        //kabupaten, kecamatan, kelurahan belum pake delete2
                        //document.getElementById('adult_address'+sequence).value = '';
                        document.getElementById('adult_rt'+sequence).value = '';
                        document.getElementById('adult_rw'+sequence).value = '';


                        if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                            document.getElementById('adult_klinis_sedang_hamil'+sequence).value = '';
                            $('#adult_klinis_sedang_hamil'+sequence).niceSelect('update');

                            document.getElementById('adult_perusahaan'+sequence).value = 'PRIBADI';
                            $('#adult_perusahaan'+sequence).niceSelect('update');
                            document.getElementById('adult_nama_perusahaan'+sequence).value = 'Pribadi';

                            //Medical Data

                            document.getElementById('adult_kriteria_pasien'+sequence).value = 'LAIN-LAIN';
                            $('#adult_kriteria_pasien'+sequence).niceSelect('update');
                            document.getElementById('detail_kriteria'+sequence).hidden = true;
                            document.getElementById('adult_pemeriksaan_swab_ke'+sequence).value = '1'; //VALUE IKUTI DEFAULT

                            //sedang dirawat rs
                            document.getElementById('adult_sedang_dirawat_di_rs'+sequence).value = 'TIDAK TAHU';
                            $('#adult_sedang_dirawat_di_rs'+sequence).niceSelect('update');

                            document.getElementById('adult_nama_rs'+sequence).value = '';
                            document.getElementById('nama_rs_div'+sequence).hidden = true;
                            document.getElementById('adult_tanggal_masuk_rs'+sequence).value = '';
                            document.getElementById('tanggal_masuk_rs'+sequence).hidden = true;
                            document.getElementById('adult_nama_ruang_perawatan'+sequence).value = '';
                            document.getElementById('nama_ruang_perawatan'+sequence).hidden = true;

                            document.getElementById('adult_sedang_dirawat_di_icu'+sequence).value = '';
                            $('#adult_sedang_dirawat_di_icu'+sequence).niceSelect('update');
                            document.getElementById('adult_sedang_dirawat_di_icu_div'+sequence).hidden = true;

                            document.getElementById('adult_status_terakhir'+sequence).value = '';
                            $('#adult_status_terakhir'+sequence).niceSelect('update');
                            document.getElementById('adult_status_terakhir_div'+sequence).hidden = true;

                            document.getElementById('adult_menggunakan_intubasi'+sequence).value = '';
                            $('#adult_menggunakan_intubasi'+sequence).niceSelect('update');
                            document.getElementById('adult_menggunakan_intubasi_div'+sequence).hidden = true;

                            document.getElementById('adult_menggunakan_emco'+sequence).value = '';
                            $('#adult_menggunakan_emco'+sequence).niceSelect('update');
                            document.getElementById('adult_menggunakan_emco_div'+sequence).hidden = true;

                            document.getElementById('adult_klinis_ada_penumonia'+sequence).value = '';
                            $('#adult_klinis_ada_penumonia'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_penumonia_div'+sequence).hidden = true;

                            document.getElementById('adult_klinis_ada_ards'+sequence).value = '';
                            $('#adult_klinis_ada_ards'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_ards_div'+sequence).hidden = true;
                            document.getElementById('adult_klinis_ards_detil'+sequence).value = '';
                            document.getElementById('ards_detail_div'+sequence).hidden = true;

                            document.getElementById('adult_klinis_ada_penyakit_pernafasan'+sequence).value = '';
                            $('#adult_klinis_ada_penyakit_pernafasan'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_penyakit_pernafasan_div'+sequence).hidden = true;

                            //Gejala
                            document.getElementById('adult_gejala'+sequence).value = 'TIDAK TAHU';
                            $('#adult_gejala'+sequence).niceSelect('update');
                            document.getElementById('table_gejala_div'+sequence).hidden = true;

                            document.getElementById('adult_tanggal_pertama_kali_gejala'+sequence).value = '';
                            document.getElementById('adult_klinis_ada_demam'+sequence).value = 'TIDAK TAHU';
                            $('#adult_klinis_ada_demam'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_suhu_tubuh'+sequence).value = '';
                            document.getElementById('suhu_tubuh_div'+sequence).hidden = true;
                            document.getElementById('adult_klinis_ada_batuk'+sequence).value = '';
                            $('#adult_klinis_ada_batuk'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_pilek'+sequence).value = '';
                            $('#adult_klinis_ada_pilek'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_sakit_tenggorokan'+sequence).value = '';
                            $('#adult_klinis_ada_sakit_tenggorokan'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_sesak'+sequence).value = '';
                            $('#adult_klinis_ada_sesak'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_sakit_kepala'+sequence).value = '';
                            $('#adult_klinis_ada_sakit_kepala'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_badan_lemah'+sequence).value = '';
                            $('#adult_klinis_ada_badan_lemah'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_nyeri_otot'+sequence).value = '';
                            $('#adult_klinis_ada_nyeri_otot'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_mual'+sequence).value = '';
                            $('#adult_klinis_ada_mual'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_nyeri_abdomen'+sequence).value = '';
                            $('#adult_klinis_ada_nyeri_abdomen'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_diare'+sequence).value = '';
                            $('#adult_klinis_ada_diare'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_gangguan_penciuman'+sequence).value = '';
                            $('#adult_klinis_ada_gangguan_penciuman'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_gejala_lainnya'+sequence).value = '';

                            //Penyakit bawaan
                            document.getElementById('adult_penyakit_bawaan'+sequence).value = 'TIDAK TAHU';
                            $('#adult_penyakit_bawaan'+sequence).niceSelect('update');
                            document.getElementById('table_penyakit_bawaan_div'+sequence).hidden = true;

                            document.getElementById('adult_klinis_ada_diabetes'+sequence).value = '';
                            $('#adult_klinis_ada_diabetes'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_penyakit_jantung'+sequence).value = '';
                            $('#adult_klinis_ada_penyakit_jantung'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_hipertensi'+sequence).value = '';
                            $('#adult_klinis_ada_hipertensi'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_keganasan'+sequence).value = '';
                            $('#adult_klinis_ada_keganasan'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_gangguan_imunologi'+sequence).value = '';
                            $('#adult_klinis_ada_gangguan_imunologi'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_gangguan_ginjal'+sequence).value = '';
                            $('#adult_klinis_ada_gangguan_ginjal'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_gangguan_hati'+sequence).value = '';
                            $('#adult_klinis_ada_gangguan_hati'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_ada_gangguan_paru_obstruksi_kronis'+sequence).value = '';
                            $('#adult_klinis_ada_gangguan_paru_obstruksi_kronis'+sequence).niceSelect('update');
                            document.getElementById('adult_klinis_kondisi_penyerta_lainnya'+sequence).value = '';


                            //FAKTOR PAPARAN
                            document.getElementById('adult_perjalanan'+sequence).value = 'TIDAK TAHU';
                            $('#adult_perjalanan'+sequence).niceSelect('update');
                            document.getElementById('adult_perjalanan_div'+sequence).hidden = true;
                            document.getElementById('adult_berkunjung_div'+sequence).hidden = true;

                            try{
                                document.getElementById('adult_perjalanan_keluar_negeri'+sequence).value = '';
                                $('#adult_perjalanan_keluar_negeri'+sequence).niceSelect('update');
                                document.getElementById('perjalanan_keluar_negeri_div'+sequence).hidden = true;
                            }catch(err){}

                            try{
                                document.getElementById('adult_perjalanan_keluar_negeri'+sequence).value = '';
                                $('#adult_perjalanan_keluar_negeri'+sequence).niceSelect('update');
                                document.getElementById('adult_perjalanan_keluar_negeri'+sequence).hidden = true;
                            }catch(err){}

                            try{
                                document.getElementById('adult_perjalanan_ke_transmisi_lokal'+sequence).value = '';
                                $('#adult_perjalanan_ke_transmisi_lokal'+sequence).niceSelect('update');
                                document.getElementById('perjalanan_ke_transmisi_lokal_div'+sequence).hidden = true;
                            }catch(err){}

                            try{
                                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan'+sequence).value = '';
                                $('#adult_berkunjung_ke_fasilitas_kesehatan'+sequence).niceSelect('update');
                                document.getElementById('berkunjung_ke_fasilitas_kesehatan_div'+sequence).hidden = true;
                            }catch(err){}

                            try{
                                document.getElementById('adult_berkunjung_ke_pasar_hewan'+sequence).value = '';
                                $('#adult_berkunjung_ke_pasar_hewan'+sequence).niceSelect('update');
                                document.getElementById('berkunjung_ke_pasar_hewan_div'+sequence).hidden = true;
                            }catch(err){}

                            try{
                                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan'+sequence).value = '';
                                $('#adult_berkunjung_ke_pasien_dalam_pengawasan'+sequence).niceSelect('update');
                                document.getElementById('berkunjung_ke_pasien_dalam_pengawasan_div'+sequence).hidden = true;
                            }catch(err){}

                            try{
                                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi'+sequence).value = '';
                                $('#adult_berkunjung_ke_pasien_konfirmasi'+sequence).niceSelect('update');
                                document.getElementById('berkunjung_ke_pasien_konfirmasi_div'+sequence).hidden = true;
                            }catch(err){}

                            document.getElementById('adult_termasuk_cluster_ispa'+sequence).value = 'TIDAK TAHU'; // VALUE IKUTI DEFAULT
                            $('#adult_termasuk_cluster_ispa'+sequence).niceSelect('update');

                            document.getElementById('adult_merupakan_petugas_kesehatan'+sequence).value = 'TIDAK';
                            $('#adult_merupakan_petugas_kesehatan'+sequence).niceSelect('update');
                            document.getElementById('apd_div'+sequence).hidden = true;
                            document.getElementById('adult_apd_yang_digunakan'+sequence).value = '';
                            $('#adult_merupakan_petugas_kesehatan'+sequence).niceSelect('update');

                            document.getElementById('adult_prosedur_menimbulkan_aerosol'+sequence).value = 'TIDAK TAHU';
                            $('#adult_prosedur_menimbulkan_aerosol'+sequence).niceSelect('update');
                            document.getElementById('tindakan_aerosol_div'+sequence).hidden = true;
                            document.getElementById('adult_tindakan_menimbulkan_aerosol'+sequence).value = '';
                            document.getElementById('adult_faktor_lain'+sequence).value = '';

                        }
                    }
                    else{
                        try{
                            document.getElementById('adult_tempat_lahir'+sequence).value = '';
                            document.getElementById('adult_tempat_lahir'+sequence+'_id').value = '';
                            document.getElementById('select2-adult_tempat_lahir'+sequence+'_id-container').innerHTML = 'Select Tempat Lahir';
                        }catch(err){}
                        try{
                            document.getElementById('adult_provinsi'+sequence).value = '';
                            document.getElementById('adult_provinsi'+sequence+'_id').value = '';
                            document.getElementById('select2-adult_provinsi'+sequence+'_id-container').innerHTML = 'Select Provinsi';

                            var adult_kabupaten_string = 'adult_kabupaten'+sequence+'_id';
                            delete_type(adult_kabupaten_string, sequence);
                        }catch(err){}
                    }

                    clear_text_medical(parseInt(sequence)-1);

                }catch(err){console.log(err);}
            }
        })
    }
}

function check_pln_non_tagihan(value){
    var checknumber = "^[1-5][0-9]{12}$";
    if(value.match(checknumber)!=null){
        return true;
    }else{
        return false;
    }
}

function check_pln_prepaid(value){
    var checknumber = "^([1-5][0-9]|[0-9])[0-9]{10}$";
    if(value.match(checknumber)!=null){
        return true
    }else{
        return false;
    }
}

function check_pln_postpaid(value){
    var checknumber = "^[1-5][0-9]{11}$";
    if(value.match(checknumber)!=null){
        return true
    }else{
        return false;
    }
}

function check_evoucher(value){
    var checknumber = "^08[1-9]{2}[0-9]{5,9}$";
    if(value.match(checknumber)!=null){
        return true
    }else{
        return false;
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
        if(value.length==16 || value.length == 17){
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
        if(value.length>=12){
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
        if(value.length>6 && value.length < 14){
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

function alert_message_swal(msg){
    Swal.fire({
      type: 'error',
      title: 'Oops!',
      text: msg,
    }).then((result) => {
      if (result.value) {
        $('.loading-button').prop('disabled', false);
        $('.loading-button').removeClass("running");
      }
    });
}

function check_name_airline(first_name, last_name){
    if(check_word(last_name) == true){
        log = '';
        console.log();
        //last name alpha characters
        if(first_name.split(' ').length != 1 && last_name == '')
            log = 'fill last name of';
        else if(last_name.length == 1)
            log = 'fill last name more than 1 character of';
//        else if(last_name.split(' ').length > 1)
//            log = 'last name may only contain 1 word of';
        else if(first_name.split(' ').length > 1){
            check_first_name = false;
            for(counter in first_name.split(' ')){
                if(first_name.split(' ')[counter].length > 1){
                    check_first_name = true;
                }
            }
            if(check_first_name == false)
                log = "first name can't contain 1 character in 1 word of";
        }else{
            check_first_name = false;
            if(first_name.length == 1)
                log = "first name can't 1 character in word of";
        }
        return log;

    }else{
        return 'use alpha characters last name of';
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

//function get_agent_booking(type){
//    load_more = false;
//    getToken();
//    if(type == 'reset'){
//        agent_offset = 0;
//        data_counter = 0;
//        data_search = [];
//        document.getElementById("table_reservation").innerHTML = `
//                    <tr>
//                        <th style="width:2%;">No.</th>
//                        <th style="width:10%;">Name</th>
//                        <th style="width:7%;">Provider</th>
//                        <th style="width:8%;">State</th>
//                        <th style="width:5%;">PNR</th>
//                        <th style="width:8%;">Agent</th>
//                        <th style="width:12%;">Book Date</th>
//                        <th style="width:12%;">Hold Date</th>
//                        <th style="width:12%;">Issued Date</th>
//                        <th style="width:9%;">Issued By</th>
//                        <th style="width:7%;">Action</th>
//                    </tr>`;
//    }
//    var tb_value = '';
//    var pnr_value = '';
//    var type_search = '';
//
//     try{
//        type_search = document.getElementById('tb').value
//    }catch(err){
//    }
//    try{
//        tb_value = document.getElementById('search_tb').checked;
//    }catch(err){
//    }
//    try{
//        pnr_value = document.getElementById('search_pnr').checked;
//    }catch(err){
//    }
//    $.ajax({
//       type: "POST",
//       url: "/webservice/agent",
//       headers:{
//            'action': 'get_agent_booking',
//       },
//       data: {
//        'offset': agent_offside,
//        'name': type_search,
//        'tb': tb_value,
//        'pnr': pnr_value
//       },
//       success: function(msg) {
//        console.log(msg);
//        if(msg.result.error_code == 0){
//            try{
//                if(msg.result.response.transport_booking.length == 80){
//                    agent_offside++;
//                    table_reservation(msg.result.response.transport_booking);
//                    load_more = true;
//                }else{
//                    table_reservation(msg.result.response.transport_booking);
//                }
//            }catch(err){
//                set_notification(msg.result.response.transport_booking);
//            }
//        }else{
//            Swal.fire({
//              type: 'error',
//              title: 'Oops!',
//              text: "Oops, something when wrong please contact HO !",
//            })
//        }
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//            Swal.fire({
//              type: 'error',
//              title: 'Oops!',
//              html: '<span style="color: red;">Error agent booking </span>' + errorThrown,
//            })
//       },timeout: 60000
//    });
//}

function get_top_up_history(){
    load_more = false;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_top_up_history',
       },
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: "Oops, something when wrong please contact HO !",
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error top up history');
       },timeout: 60000
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


function create_top_up(amount, unique_amount){ //DEPRECATED
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'create_top_up',
       },
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error create top up');
       },timeout: 60000
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
       data: {
           'token': response.token,
           'acq_id': id

       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            alert(msg.result.response.message);
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            auto_logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error topup payment </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error top up payment');
       },timeout: 60000
    });
}

//PAYMENT SGO

function get_merchant_info(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/payment",
       headers:{
            'action': 'get_merchant_info',
       },
       data: {
            "signature": signature
       },
       success: function(msg) {
        console.log(msg);
        console.log(JSON.stringify(msg));
        merchant_espay = msg;
        render_payment();
//        text = '<h3>Payment</h3>';
//        for(i in msg.result.response){
//            if(msg.result.response[i].productCode != 'CREDITCARD')
//                text+= `<p><input type="radio" name="bank_code" value="`+msg.result.response[i].bankCode+`"> `+msg.result.response[i].productName+`</p>`
//        }
//        text += `<button class="btn btn-lg primary-btn" type="button" onclick="get_payment_espay()">Submit</button>`;
//        document.getElementById('form_espay').innerHTML = text;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error merchant info');
       },timeout: 60000
    });
}

function get_payment_espay(order_number_full){
    getToken();
    phone_number = '';
    if(payment_acq2[payment_method][selected].online_wallet){
        phone_number = document.getElementById('phone_number').value;
    }
    url_back = '';
    if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'payment'){
        url_back = window.location.href.split('/');
        url_back.pop();
        url_back = url_back.join('/');
        window.location.href = '/' + type_render + '/booking/' + order_number_id;
    }else
        url_back = window.location.href;
    $.ajax({
       type: "POST",
       url: "/webservice/payment",
       headers:{
            'action': 'set_payment_method',
       },
       data: {
            "signature": signature,
            "order_number": order_number_full,
            "bank_code": payment_acq2[payment_method][selected]['bank']['code'],
            "bank_name": payment_acq2[payment_method][selected].name,
            "online_wallet": payment_acq2[payment_method][selected].online_wallet,
            "phone_number": phone_number,
            'save_url': payment_acq2[payment_method][selected].save_url,
            'url_back': url_back
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                if(payment_acq2[payment_method][selected].name == 'OVO'){
                    if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'payment')
                        window.location.href = '/' + type_render + '/booking/' + order_number_id
                    else
                        window.location.reload();
                }else if(payment_acq2[payment_method][selected].save_url == true){
                    window.location.href = msg.result.response.url;
                }else
                    window.location.href = '/payment/espay/' + order_number_full;
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error payment </span>',
                });
                $('#payment_gtw').prop('disabled', false);
                $('#payment_gtw').removeClass("running");
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error merchant info');
       },timeout: 60000
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
       data: {

       },
       success: function(msg) {
        console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error request VA');
       },timeout: 60000
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
       data: {

       },
       success: function(msg) {
        console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error invoice VA');
       },timeout: 60000
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
       data: {

       },
       success: function(msg) {
        console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error voucher');
       },timeout: 60000
    });
}

function logout(){
    document.getElementById('form_logout').submit();
    //logout here
}

function change_language(val){
    document.getElementById('selection_language').value = val;
    document.getElementById('form_language').submit();
}

//plugin passenger

function add_passenger_cache(sequence){
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'add_passenger_cache',
       },
       data: {
            'passenger': JSON.stringify(passenger_data[sequence])
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code != 0){
            Swal.fire({
               type: 'error',
               title: 'Oops...',
               text: msg.result.error_msg,
           })
        }else{
            Swal.fire({
               type: 'success',
               title: 'Success',
               text: 'Passenger chosen',
           })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function del_passenger_cache(sequence){
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'del_passenger_cache',
       },
       data: {
            'index': sequence
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            document.getElementById('passenger_chosen').innerHTML = '';
            var response = '';
            var like_name_booker = document.getElementById('train_booker_search').value;
            if(msg.result.response.length != 0){
                response+=`
                <div class="alert alert-success" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search"></i> Selected Passenger</h6></div>
                <div style="overflow:auto;height:45vh;margin-top:10px;">
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
                        response+=`<td><button type="button" class="primary-btn-custom" onclick="del_passenger_cache(`+i+`);">Delete</button></td>
                    </tr>`;
                }
                response+=`</table></div>`;
                document.getElementById('booker_chosen').innerHTML = response;
                passenger_data = msg.result.response;
            }else{
                response = '';
                response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search-minus"></i> Oops! User not found!</h6></div></center>`;
                document.getElementById('booker_chosen').innerHTML = response;
            }
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function get_passenger_cache(type){
    type = "chosen";
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_passenger_cache',
       },
       data: {

       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            document.getElementById('passenger_chosen').innerHTML = '';
            passenger_data_cache = msg.result.response;
            if(type == 'chosen'){
                var response = '';
                var like_name_booker = document.getElementById('train_passenger_search').value;
                if(msg.result.response.length != 0){
                    response+=`
                    <div class="alert alert-success" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search"></i> Selected Passenger</h6></div>
                    <div style="overflow:auto;height:60vh;margin-top:10px;">
                    <table style="width:100%" id="list-of-passenger">
                        <tr>
                            <th style="width:10%;">No</th>`;
                            if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'passenger' || window.location.href.split('/')[window.location.href.split('/').length-1] == 'issued_offline'){
                                response+=`<th style="width:40%;">Name</th>
                                           <th style="width:20%"></th>
                                           <th style="width:15%"></th>
                                           <th style="width:15%"></th>`;
                            }else{
                                response+=` <th style="width:60%;">Name</th>
                                            <th style="width:30%"></th>`;
                            }
                            text+=`
                        </tr>`;

                    for(i in msg.result.response){
                        response+=`
                        <tr>
                            <td>`+(parseInt(i)+1)+`</td>
                            <td>
                                <div class="row">
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">`;
                                        if(msg.result.response[i].face_image.length > 0)
                                            response+=`<img src="`+msg.result.response[i].face_image[0]+`" alt="User" style="width:100%;">`;
                                        else if(msg.result.response[i].title == "MR"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_mr.png" alt="User MR" style="width:100%;">`;
                                        }
                                        else if(msg.result.response[i].title == "MRS"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_mrs.png" alt="User MRS" style="width:100%;">`;
                                        }
                                        else if(msg.result.response[i].title == "MS"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_ms.png" alt="User MS" style="width:100%;">`;
                                        }
                                        else if(msg.result.response[i].title == "MSTR"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_mistr.png" alt="User MSTR" style="width:100%;">`;
                                        }
                                        else if(msg.result.response[i].title == "MISS"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_miss.png" alt="User MISS" style="width:100%;">`;
                                        }
                                response+=`
                                    </div>
                                    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                                    <span style="font-weight:600; font-size:14px;"> `+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name+``;
                                    if(msg.result.response[i].birth_date != '')
                                        response+=`<br/> <span><i class="fas fa-birthday-cake"></i> `+msg.result.response[i].birth_date+`</span>`;
                                    if(msg.result.response[i].phones.length != 0){
                                        if(template == 1 || template == 5){
                                            response+=`<br/> <div class="row" style="margin-left:0"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> `;
                                        }else if(template == 2){
                                            response+=`<br/> <div class="row"><div class="col-lg-12"><div class="input-container-search-ticket"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> `;
                                        }else if(template == 3){
                                            response+=`<br/> <div class="row"><div class="col-lg-12"><div class="input-container-search-ticket"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i><div class="default-select">`;
                                        }else if(template == 4){
                                            response+=`<br/> <div class="row" style="margin-left:0"><i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i>`;
                                        }
                                        response+=`<select class="phone_chosen_cls" id="phone_chosen`+i+`" style="width:100%;">`;
                                        for(j in msg.result.response[i].phones){
                                            response += `<option>`+msg.result.response[i].phones[j].calling_code+` - `+msg.result.response[i].phones[j].calling_number+`</option>`;
                                        }
                                        if(template == 1 || template == 5){
                                            response+=`</select></div>`;
                                        }else if(template == 2){
                                            response+=`</select></div></div></div>`;
                                        }else if(template == 3){
                                            response+=`</select></div></div></div></div>`;
                                        }else if(template == 4){
                                            response+=`</select></div>`;
                                        }
                                    }else{
                                        response+=`<br/>`;
                                    }
                                    if(msg.result.response[i].nationality_name != '')
                                        response+=`<span><i class="fas fa-globe-asia"></i> `+msg.result.response[i].nationality_name+`</span>`;
                                    if(msg.result.response[i].identities.hasOwnProperty('passport') == true)
                                        response+=`<br/> <span><i class="fas fa-passport"></i> Passport - `+msg.result.response[i].identities.passport.identity_number+`</span>`;
                                    if(msg.result.response[i].identities.hasOwnProperty('ktp') == true)
                                        response+=`<br/> <span><i class="fas fa-id-card"></i> KTP - `+msg.result.response[i].identities.ktp.identity_number+`</span>`;
                                    if(msg.result.response[i].identities.hasOwnProperty('sim') == true)
                                        response+=`<br/> <span><i class="fas fa-id-badge"></i> SIM - `+msg.result.response[i].identities.sim.identity_number+`</span>`;
                                    if(msg.result.response[i].customer_parents.length != 0){
                                        response += `<div class="tooltip-inner" style="text-align:left;" style data-tooltip="`;
                                        for(j in msg.result.response[i].customer_parents){
                                            response+= "• " + msg.result.response[i].customer_parents[j].type + ' ' + msg.result.response[i].customer_parents[j].name + ' ' + msg.result.response[i].customer_parents[j].currency + ' ' + getrupiah(msg.result.response[i].customer_parents[j].actual_balance) + '\n';
                                        }
                                        response += `"><i class="fas fa-money-bill-wave-alt"></i> Corporate Booker</span></div>`;
                                    }
                                response+=`
                                </div>
                            </td>`;
                            if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'passenger'){
                                response+=`<td><select class="selection_type_ns" id="selection_type`+i+`" style="width:100%;" onchange="btn_move_passenger_cache_enable(`+i+`);">`;
                                if(msg.result.response[i].title == "MR" || msg.result.response[i].title == "MRS" || msg.result.response[i].title == "MS"){
                                    response+=`<optgroup label="Booker">`;
                                    response+=`<option value="booker">Booker</option>`;
                                }

                                try{
                                    if(adult > 0)
                                        response+=`<optgroup label="Adult">`;
                                    for(j=0;j<adult;j++){
                                        response+=`<option value="adult`+parseInt(j+1)+`">Adult `+parseInt(j+1)+`</option>`;
                                    }
                                }catch(err){

                                }
                                try{
                                    if(child > 0)
                                        response+=`<optgroup label="Child">`;
                                    for(j=0;j<child;j++){
                                        response+=`<option value="child`+parseInt(j+1)+`">Child `+parseInt(j+1)+`</option>`;
                                    }
                                }catch(err){

                                }
                                try{
                                    if(infant > 0)
                                        response+=`<optgroup label="Infant">`;
                                    for(j=0;j<infant;j++){
                                        response+=`<option value="infant`+parseInt(j+1)+`">Infant `+parseInt(j+1)+`</option>`;
                                    }
                                }catch(err){

                                }
                                try{
                                    if(senior > 0)
                                        response+=`<optgroup label="Senior">`;
                                    for(j=0;j<senior;j++){
                                        response+=`<option value="senior`+parseInt(j+1)+`">Senior `+parseInt(j+1)+`</option>`;
                                    }
                                }catch(err){

                                }
                                response+=`</select></td>`;
                                check = 0;
                                var passenger_sequence = '';
                                for(j in passenger_data_pick){
                                    if(passenger_data_pick[j].seq_id == msg.result.response[i].seq_id){
                                        check = 1;
                                        var passenger_pick = passenger_data_pick[j].sequence.replace(/[^a-zA-Z ]/g,"");
                                        var passenger_pick_number = passenger_data_pick[j].sequence.replace( /^\D+/g, '');
                                        passenger_sequence = passenger_pick.charAt(0).toUpperCase() + passenger_pick.slice(1).toLowerCase() + ' ' + passenger_pick_number;
                                    }
                                }
                                if(check == 0)
                                    response+=`<td><button type="button" class="primary-btn-custom" onclick="update_customer_cache_list(`+i+`)" id="move_btn_`+i+`">Move</button></td>`;
                                else
                                    response+=`<td><button type="button" class="primary-btn-custom" id="move_btn_`+i+`" disabled>`+passenger_sequence+`</button></td>`;
                            }else if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'issued_offline'){
                                response+=`<td><select class="selection_type_ns" id="selection_type`+i+`" style="width:100%;">`;
                                if(msg.result.response[i].title == "MR" || msg.result.response[i].title == "MRS" || msg.result.response[i].title == "MS"){
                                    response+=`<optgroup label="Booker">`;
                                    response+=`<option value="booker">Booker</option>`;
                                }

                                try{
                                    if(counter_passenger > 0)
                                        response+=`<optgroup label="Passenger">`;
                                    for(j=0;j<counter_passenger;j++){
                                        response+=`<option value="adult`+parseInt(j+1)+`">Passenger `+parseInt(j+1)+`</option>`;
                                    }
                                }catch(err){

                                }
                                response+=`</select></td>`;
                                check = 0;
                                var passenger_sequence = '';
                                console.log(msg.result.response[i].seq_id);
                                for(i in passenger_data_pick){
                                    console.log(passenger_data_pick);
                                    if(passenger_data_pick[i].seq_id == msg.result.response[i].seq_id){
                                        check = 1;
                                        var passenger_pick = passenger_data_pick[i].sequence.replace(/[^a-zA-Z ]/g,"");
                                        var passenger_pick_number = passenger_data_pick[i].sequence.replace( /^\D+/g, '');
                                        passenger_sequence = passenger_pick.charAt(0).toUpperCase() + passenger_pick.slice(1).toLowerCase() + ' ' + passenger_pick_number;
                                    }
                                }
                                console.log(check);
                                if(check == 0)
                                    response+=`<td><button type="button" class="primary-btn-custom" onclick="update_customer_cache_list(`+i+`)" id="move_btn_`+i+`">Move</button></td>`;
                                else
                                    response+=`<td><button type="button" class="primary-btn-custom" disabled id="move_btn_`+i+`">`+passenger_sequence+`</button></td>`;
                            }
                            response+=`<td>
                                            <button type="button" class="primary-btn-custom" onclick="del_passenger_cache(`+i+`);">Delete</button>`;
                            if(agent_security.includes('p_cache_2') == true)
                            response+=`
                                            <button type="button" class="primary-btn-custom" onclick="edit_passenger_cache(`+i+`);">Edit</button>`;
                            response+=`
                                       </td>`;

                            text+=`
                        </tr>`;
                    }
                    response+=`</table></div>`;
                    document.getElementById('passenger_chosen').innerHTML = response;
                    $('.phone_chosen_cls').niceSelect();
                    $('.selection_type_ns').niceSelect();
                }else{
                    response = '';
                    response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search-minus"></i> Oops! Please select database customer first!</h6></div></center>`;
                    document.getElementById('passenger_chosen').innerHTML = response;
                }
            }
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function edit_passenger_cache(val){
    passenger_data_edit_phone = 0;
    passenger_cache_pick = val;
    document.getElementById('passenger_edit_title').innerHTML = passenger_data_cache[val].title;
    if(agent_security.includes('p_cache_3') == true){
        document.getElementById('passenger_first_name_div').innerHTML = `<input type="text" onchange="capitalizeInput('passenger_edit_first_name');" class="form-control" name="passenger_edit_first_name" id="passenger_edit_first_name" placeholder="First Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'First Name '" value='`+passenger_data_cache[val].first_name+`'>`;
        document.getElementById('passenger_last_name_div').innerHTML = `<input type="text" onchange="capitalizeInput('passenger_edit_last_name');" class="form-control" name="passenger_edit_last_name" id="passenger_edit_last_name" placeholder="Last Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Last Name '" value='`+passenger_data_cache[val].last_name+`'>`;
    }else{
        document.getElementById('passenger_first_name_div').innerHTML = `<label id="passenger_edit_first_name">`+passenger_data_cache[val].first_name+`</label>`;
        document.getElementById('passenger_last_name_div').innerHTML = `<label id="passenger_edit_last_name">`+passenger_data_cache[val].last_name+`</label>`;
    }
    if(passenger_data_cache[val].birth_date != ''){
        $('input[name="passenger_edit_birth_date"]').val(passenger_data_cache[val].birth_date);
        document.getElementById('passenger_edit_birth_date').disabled = true;
    }else{
        $('input[name="passenger_edit_birth_date"]').val("");
        document.getElementById('passenger_edit_birth_date').disabled = false;
    }
    document.getElementById('passenger_edit_email').value = passenger_data_cache[val].email;
    if(passenger_data_cache[val].nationality_name != ''){
        document.getElementById('passenger_edit_nationality').value = passenger_data_cache[val].nationality_name;
        document.getElementById('passenger_edit_nationality_id').value = passenger_data_cache[val].nationality_name;
        document.getElementById('select2-passenger_edit_nationality_id-container').innerHTML = passenger_data_cache[val].nationality_name;
        $('#passenger_edit_nationality_id').niceSelect('update');
    }else{
        document.getElementById('passenger_edit_nationality').value = 'Indonesia';
        document.getElementById('passenger_edit_nationality_id').value = 'Indonesia';
        document.getElementById('select2-passenger_edit_nationality_id-container').innerHTML = 'Indonesia';
        $('#passenger_edit_nationality_id').niceSelect('update');
    }

    text = '';
    if(passenger_data_cache[val].phones.length != 0){
        for(i in passenger_data_cache[val].phones){
            console.log(`phone_cache`+parseInt(parseInt(i)+1)+`_id`);
            text+=`
                <div class='row' id="phone_cache`+parseInt(parseInt(i)+1)+`_id">
                    <div class="col-sm-5">
                        <label>Phone Id</label><br/>
                        <div class="form-select">
                            <select class="form-control js-example-basic-single" name="passenger_edit_phone_code`+parseInt(parseInt(i)+1)+`_id" style="width:100%;" id="passenger_edit_phone_code`+parseInt(parseInt(i)+1)+`_id" placeholder="Nationality" onchange="auto_complete('passenger_edit_phone_code`+parseInt(parseInt(i)+1)+`')" class="nice-select-default">`;
                                for(j in country_cache){
                                    text += `<option value="`+country_cache[j].phone_code+`"`;
                                    if(passenger_data_cache[val].phones[i].calling_code == country_cache[j].phone_code)
                                        text += `selected`;
                                    text += `>`+country_cache[j].phone_code+`</option>`;
                                }
                            text+=`</select>
                        </div>
                        <input type="hidden" name="passenger_edit_phone_code`+parseInt(parseInt(i)+1)+`" id="passenger_edit_phone_code`+parseInt(parseInt(i)+1)+`" value="`+passenger_data_cache[val].phones[i].calling_code+`" />
                    </div>`;
            if(passenger_data_cache[val].phones[i].calling_number != false || passenger_data_cache[val].phones[i].calling_number.length != undefined){
            text+=`
                    <div class="col-sm-6">
                        <label>Phone Number</label><br/>
                        <div class="form-select">
                            <div class="input-container-search-ticket">
                                <input type="text" class="form-control" name="passenger_edit_phone_number`+parseInt(parseInt(i)+1)+`" id="passenger_edit_phone_number`+parseInt(parseInt(i)+1)+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" value="`+passenger_data_cache[val].phones[i].calling_number+`">
                            </div>
                        </div>
                    </div>`;
            }else{
                text+=`
                    <div class="col-sm-6">
                        <label>Phone Number</label><br/>
                        <div class="form-select">
                            <div class="input-container-search-ticket">
                                <input type="text" class="form-control" name="passenger_edit_phone_number`+parseInt(parseInt(i)+1)+`" id="passenger_edit_phone_number`+parseInt(parseInt(i)+1)+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" value="">
                            </div>
                        </div>
                    </div>`;
            }

            text+=`
                    <div class="col-sm-1" style="margin-top:25px;">
                        <button type="button" class="primary-delete-date" onclick="delete_phone_passenger_cache(`+parseInt(parseInt(i)+1)+`)">
                            <i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i>
                        </button>
                    </div>
                </div>`;
            passenger_data_edit_phone = parseInt(parseInt(i) + 1)
        }
        document.getElementById('passenger_edit_phone_table').innerHTML = text;
        for(i in passenger_data_cache[val].phones){
            $('#passenger_edit_phone_code'+parseInt(parseInt(i)+1)+'_id').select2();
        }
    }
    document.getElementById('attachment').innerHTML = '';
    document.getElementById('attachment1').innerHTML = '';
    document.getElementById('attachment2').innerHTML = '';
    document.getElementById('attachment3').innerHTML = '';
    document.getElementById('attachment4').innerHTML = '';
    text = '';
    //avatar
    if(passenger_data_cache[val].face_image.length != 0)
    text+= `
            <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                <img src="`+passenger_data_cache[val].face_image[0]+`" alt="Passenger" value="`+passenger_data_cache[val].face_image[1]+`" id="avatar_image" style="height:220px;width:auto" />

                <div class="row" style="justify-content:space-around">
                    <div class="checkbox" style="display: block;">
                        <label class="check_box_custom">
                            <span style="font-size:13px;">Delete</span>
                            <input type="checkbox" value="" id="avatar_delete" name="avatar_delete">
                            <span class="check_box_span_custom"></span>
                        </label>
                    </div>
                </div>
        </div>`;
    document.getElementById('attachment').innerHTML = text;
    for(i in passenger_data_cache[val].identities){
        text = '';
        if(i == 'passport'){
            document.getElementById('passenger_edit_identity_number1').value = passenger_data_cache[val].identities[i].identity_number;
            document.getElementById('passenger_edit_identity_expired_date1').value = passenger_data_cache[val].identities[i].identity_expdate;
            document.getElementById('select2-passenger_edit_identity_country_of_issued1_id-container').innerHTML = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            document.getElementById('passenger_edit_identity_country_of_issued1').value = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            for(j in passenger_data_cache[val].identities[i].identity_images){
                text+= `
                    <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                        <img src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities[i].identity_images[j][1]+`" id="`+i+j+`_image" style="height:220px;width:auto" />

                        <div class="row" style="justify-content:space-around">
                            <div class="checkbox" style="display: block;">
                                <label class="check_box_custom">
                                    <span style="font-size:13px;">Delete</span>
                                    <input type="checkbox" value="" id="`+i+j+`_delete" name="`+i+j+`_delete">
                                    <span class="check_box_span_custom"></span>
                                </label>
                            </div>
                        </div>
                </div>`;
            }
            document.getElementById('attachment1').innerHTML = text;
        }else if(i == 'ktp'){
            document.getElementById('passenger_edit_identity_number2').value = passenger_data_cache[val].identities[i].identity_number;
            document.getElementById('passenger_edit_identity_expired_date2').value = passenger_data_cache[val].identities[i].identity_expdate;
            document.getElementById('select2-passenger_edit_identity_country_of_issued2_id-container').innerHTML = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            document.getElementById('passenger_edit_identity_country_of_issued2').value = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            for(j in passenger_data_cache[val].identities[i].identity_images)
                text+= `
                    <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                        <img src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities[i].identity_images[j][1]+`" id="`+i+j+`_image" style="height:220px;width:auto" />

                        <div class="row" style="justify-content:space-around">
                            <div class="checkbox" style="display: block;">
                                <label class="check_box_custom">
                                    <span style="font-size:13px;">Delete</span>
                                    <input type="checkbox" value="" id="`+i+j+`_delete" name="`+i+j+`_delete">
                                    <span class="check_box_span_custom"></span>
                                </label>
                            </div>
                        </div>
                </div>`;
            document.getElementById('attachment2').innerHTML = text;
        }else if(i == 'sim'){
            document.getElementById('passenger_edit_identity_number3').value = passenger_data_cache[val].identities[i].identity_number;
            document.getElementById('passenger_edit_identity_expired_date3').value = passenger_data_cache[val].identities[i].identity_expdate;
            document.getElementById('select2-passenger_edit_identity_country_of_issued3_id-container').innerHTML = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            document.getElementById('passenger_edit_identity_country_of_issued3').value = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            for(j in passenger_data_cache[val].identities.identity_images)
                text+= `
                    <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                        <img src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" value="`+passenger_data_cache[val].identities[i].identity_images[j][1]+`" id="`+i+j+`_image" style="height:220px;width:auto" />

                        <div class="row" style="justify-content:space-around">
                            <div class="checkbox" style="display: block;">
                                <label class="check_box_custom">
                                    <span style="font-size:13px;">Delete</span>
                                    <input type="checkbox" value="" id="`+i+j+`_delete" name="`+i+j+`_delete">
                                    <span class="check_box_span_custom"></span>
                                </label>
                            </div>
                        </div>
                </div>`;

            document.getElementById('attachment3').innerHTML = text;
        }else if(i == 'other'){
            document.getElementById('passenger_edit_identity_number4').value = passenger_data_cache[val].identities[i].identity_number;
            document.getElementById('passenger_edit_identity_expired_date4').value = passenger_data_cache[val].identities[i].identity_expdate;
            document.getElementById('select2-passenger_edit_identity_country_of_issued4_id-container').innerHTML = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            document.getElementById('passenger_edit_identity_country_of_issued4').value = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            for(j in passenger_data_cache[val].identities.identity_images)
                text+= `
                    <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                        <img src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities[i].identity_images[j][1]+`" id="`+i+j+`_image" style="height:220px;width:auto" />

                        <div class="row" style="justify-content:space-around">
                            <div class="checkbox" style="display: block;">
                                <label class="check_box_custom">
                                    <span style="font-size:13px;">Delete</span>
                                    <input type="checkbox" value="" id="`+i+j+`_delete" name="`+i+j+`_delete">
                                    <span class="check_box_span_custom"></span>
                                </label>
                            </div>
                        </div>
                </div>`;
            document.getElementById('attachment4').innerHTML = text;
        }
    }
    document.getElementById('passenger_chosen').hidden = true;
    document.getElementById('passenger_update').hidden = false;
}

function delete_phone_passenger_cache(val){
    try{
        document.getElementById(`phone`+val+`_id`).remove();
    }catch(err){
        try{
            document.getElementById(`phone_cache`+val+`_id`).remove();
        }catch(err){}
    }
}


function add_phone_passenger_edit_cache(){
    text = '';
    var node = document.createElement("div");
    node.setAttribute('id', "phone_cache`+passenger_data_edit_phone+`_id");
    passenger_data_edit_phone = parseInt(parseInt(passenger_data_edit_phone) + 1);
    text+=`
        <div class='row' id="phone_cache`+passenger_data_edit_phone+`_id">
            <div class="col-sm-5">
                <label>Phone Id</label><br/>
                <div class="form-select">
                    <select class="form-control js-example-basic-single" name="passenger_edit_phone_code`+passenger_data_edit_phone+`_id" style="width:100%;" id="passenger_edit_phone_code`+passenger_data_edit_phone+`_id" placeholder="Nationality" onchange="auto_complete('passenger_edit_phone_code`+passenger_data_edit_phone+`')" class="nice-select-default">`;
                        for(j in country_cache){
                            text += `<option value="`+country_cache[j].phone_code+`"`;
                            if('62' == country_cache[j].phone_code)
                                text += `selected`;
                            text += `>`+country_cache[j].phone_code+`</option>`;
                        }
                    text +=`</select>
                </div>
                <input type="hidden" name="passenger_edit_phone_code`+passenger_data_edit_phone+`" id="passenger_edit_phone_code`+passenger_data_edit_phone+`" />
            </div>
            <div class="col-sm-6">
                <label>Phone Number</label><br/>
                <div class="form-select">
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="passenger_edit_phone_number`+passenger_data_edit_phone+`" id="passenger_edit_phone_number`+passenger_data_edit_phone+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" value="">
                    </div>
                </div>
            </div>
            <div class="col-sm-1" style="margin-top:25px;">
                <button type="button" class="primary-delete-date" onclick="delete_phone_passenger_cache(`+passenger_data_edit_phone+`)">
                    <i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i>
                </button>
            </div>
        </div>`;
    node.innerHTML = text;
    document.getElementById('passenger_edit_phone_table').appendChild(node);
    document.getElementById('passenger_edit_phone_code'+passenger_data_edit_phone).value = '62';
    $('#passenger_edit_phone_code'+passenger_data_edit_phone+'_id').select2();
}

function add_phone_passenger_cache(){
    text = '';
    passenger_data_phone = passenger_data_phone + 1;
    text+=`
        <div class='row' id="phone`+passenger_data_phone+`_id">
            <div class="col-sm-5">
                <label>Phone Id</label><br/>
                <div class="form-select">
                    <select class="form-control js-example-basic-single" name="passenger_phone_code`+passenger_data_phone+`_id" style="width:100%;" id="passenger_phone_code`+passenger_data_phone+`_id" placeholder="Nationality" onchange="auto_complete('passenger_phone_code`+passenger_data_phone+`')" class="nice-select-default">`;
                        for(j in country_cache){
                            text += `<option value="`+country_cache[j].phone_code+`"`;
                            if('62' == country_cache[j].phone_code)
                                text += `selected`;
                            text += `>`+country_cache[j].phone_code+`</option>`;
                        }
                    text+=`</select>
                </div>
                <input type="hidden" name="passenger_phone_code`+passenger_data_phone+`" id="passenger_phone_code`+passenger_data_phone+`" />
            </div>
            <div class="col-sm-6">
                <label>Phone Number</label><br/>
                <div class="form-select">
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="passenger_phone_number`+passenger_data_phone+`" id="passenger_phone_number`+passenger_data_phone+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" value="">
                    </div>
                </div>
            </div>
            <div class="col-sm-1" style="margin-top:25px;">
                <button type="button" class="primary-delete-date" onclick="delete_phone_passenger_cache(`+passenger_data_phone+`)">
                    <i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i>
                </button>
            </div>
        </div>`;
    document.getElementById('passenger_phone_table').innerHTML += text;
    document.getElementById('passenger_phone_code'+passenger_data_phone).value = '62';
    $('#passenger_phone_code'+passenger_data_phone+'_id').select2();
}

function get_countries(){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_country',
       },
       data: {},
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            country_cache = msg.result.response;
        }else{

        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function update_customer_cache_list(val){
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'update_customer_list',
       },
       data: {
            'cust_code': passenger_data_cache[val].seq_id,
            'passenger_type': document.getElementById('selection_type'+val).value.replace(/[^a-zA-Z]+/g, ''),
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        data = document.getElementById('selection_type'+val).value.replace(/[0-9]/g, '');
        if(msg.result.error_code==0){
            passenger_data_cache = msg.result.response;
        }
        check = 0;
        years_old = moment(passenger_data_cache[val].birth_date, "DD MMM YYYY");
        years_old = parseInt(Math.abs(moment(new Date()) - years_old)/31536000000)
        if(document.URL.split('/')[document.URL.split('/').length-2] == 'airline' || document.URL.split('/')[document.URL.split('/').length-2] == 'visa' || document.URL.split('/')[document.URL.split('/').length-1] == 'issued_offline' || document.URL.split('/')[document.URL.split('/').length-2] == 'tour'){
            if(data == 'adult' && years_old < 12)
                check = 1;
            else if(data == 'infant' && years_old > 2)
                check = 1;
            else if(data == 'child' && years_old < 3 || data == 'child' && years_old > 11)
                check = 1
        }else if(document.URL.split('/')[document.URL.split('/').length-2] == 'train'){
            if(data == 'adult' && years_old < 2)
                check = 1;
            else if(data == 'infant' && years_old > 2)
                check = 1;
        }else if(document.URL.split('/')[document.URL.split('/').length-2] == 'hotel'){
            if(data == 'adult' && years_old < 5)
                check = 1;
            else if(data == 'child' && years_old < 5)
                check = 1
        }else if(document.URL.split('/')[document.URL.split('/').length-2] == 'activity'){
            if(data == 'booker')
                try{
                    if(years_old < parseInt(activity_pax_data['adult'][0].min_age) - 1 || years_old > parseInt(activity_pax_data['adult'][0].max_age) + 1)
                        check = 1
                }catch(err){check = 0;}
            else if(years_old < parseInt(activity_pax_data[data][0].min_age) - 1 || years_old > parseInt(activity_pax_data[data][0].max_age) + 1)
                check = 1;
        }
        if(check == 0)
            pick_passenger_cache(val);
        else
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: "<span>"+data+" years old doesn't match </span>",
            })
        $('.loading-booker-train').hide();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error customer list');
            $('.loading-booker-train').hide();
       },timeout: 60000
    });
}

function pick_passenger_cache(val){
    var passenger_pick = document.getElementById('selection_type'+val).value.replace(/[^a-zA-Z ]/g,"");
    var passenger_pick_number = document.getElementById('selection_type'+val).value.replace( /^\D+/g, '');
    check = 0;
    for(i in passenger_data_pick){
        if(passenger_data_pick[i].seq_id == document.getElementById(passenger_pick+'_id'+passenger_pick_number).value)
            check = 1;
    }
    if(check == 0){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == passenger_pick+passenger_pick_number){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        document.getElementById(passenger_pick+'_title'+passenger_pick_number).value = passenger_data_cache[val].title;
        for(i in document.getElementById(passenger_pick+'_title'+passenger_pick_number).options){
            if(document.getElementById(passenger_pick+'_title'+passenger_pick_number).options[i].selected != true)
               document.getElementById(passenger_pick+'_title'+passenger_pick_number).options[i].disabled = true;
        }
        $('#'+passenger_pick+'_title'+passenger_pick_number).niceSelect('update');
        document.getElementById(passenger_pick+'_first_name'+passenger_pick_number).value = passenger_data_cache[val].first_name;
        document.getElementById(passenger_pick+'_first_name'+passenger_pick_number).readOnly = true;
        document.getElementById(passenger_pick+'_last_name'+passenger_pick_number).value = passenger_data_cache[val].last_name;
        document.getElementById(passenger_pick+'_last_name'+passenger_pick_number).readOnly = true;
        if(passenger_data_cache[val].nationality_name != '' && passenger_data_cache[val].nationality_name != ''){
            document.getElementById('select2-'+passenger_pick+'_nationality'+passenger_pick_number+'_id-container').innerHTML = passenger_data_cache[val].nationality_name;
            document.getElementById(passenger_pick+'_nationality'+passenger_pick_number).value = passenger_data_cache[val].nationality_name;
        }
        try{
            document.getElementById(passenger_pick+'_email'+passenger_pick_number).value = passenger_data_cache[val].email;
        }catch(err){}
        try{
            var phone = document.getElementById('phone_chosen'+val).value;
            document.getElementById(passenger_pick+'_phone_code'+passenger_pick_number).value = phone.split(' - ')[0];
            document.getElementById(passenger_pick+'_phone'+passenger_pick_number).value = phone.split(' - ')[1];
        }catch(err){

        }
        document.getElementById(passenger_pick+'_birth_date'+passenger_pick_number).value = passenger_data_cache[val].birth_date;
        document.getElementById(passenger_pick+'_birth_date'+passenger_pick_number).readOnly = true;
        try{
            if(passenger_data_cache[val].identities.hasOwnProperty('passport') == true){
                //check 6 bulan
                var date1 = moment(passenger_data_cache[val].identities.passport.identity_expdate);
                var date2 = moment();
                var expired = date2.diff(date1, 'days');
                if(expired < -180){
                    document.getElementById(passenger_pick+'_passport_number'+passenger_pick_number).value = passenger_data_cache[val].identities.passport.identity_number;
                    document.getElementById(passenger_pick+'_passport_number'+passenger_pick_number).readOnly = true;
                    document.getElementById(passenger_pick+'_passport_expired_date'+passenger_pick_number).value = passenger_data_cache[val].identities.passport.identity_expdate;
                    document.getElementById(passenger_pick+'_passport_expired_date'+passenger_pick_number).readOnly = true;
                    document.getElementById(passenger_pick+'_country_of_issued'+passenger_pick_number).value = passenger_data_cache[val].identities.passport.identity_country_of_issued_name;
                    document.getElementById(passenger_pick+'_country_of_issued'+passenger_pick_number).readOnly = true;
                    document.getElementById('select2-'+passenger_pick+'_country_of_issued'+passenger_pick_number+'_id-container').innerHTML = passenger_data_cache[val].identities.passport.identity_country_of_issued_name;
                }
            }
        }catch(err){

        }

        auto_complete(passenger_pick+'_nationality'+passenger_pick_number);
        document.getElementById(passenger_pick+'_id'+passenger_pick_number).value = passenger_data_cache[val].seq_id;
        //untuk booker check
        if(passenger_pick == 'booker'){
            $("#corporate_booker").attr('data-tooltip', '');
            document.getElementById('corporate_booker').style.display = 'none';
            if(passenger_data_cache[val].customer_parents.length != 0){
                corporate_booker_temp = ''
                for(j in passenger_data_cache[val].customer_parents){
                    corporate_booker_temp += passenger_data_cache[val].customer_parents[j].type + ' ' + passenger_data_cache[val].customer_parents[j].name + ' ' + passenger_data_cache[val].customer_parents[j].currency + ' ' + getrupiah(passenger_data_cache[val].customer_parents[j].actual_balance) + '\n';
                }
                $("#corporate_booker").attr('data-tooltip', corporate_booker_temp);
                document.getElementById('corporate_booker').style.display = 'block';
            }
            passenger_data_pick.push(passenger_data_cache[val]);
            passenger_data_pick[passenger_data_pick.length-1].sequence = passenger_pick+passenger_pick_number;
            document.getElementById('move_btn_'+val).innerHTML = passenger_pick.charAt(0).toUpperCase() + passenger_pick.slice(1).toLowerCase() + ' ' + passenger_pick_number;
            document.getElementById('move_btn_'+val).disabled = true;
            if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'issued_offline'){
                update_contact('booker');
            }
        }else{ // pax
            passenger_data_pick.push(passenger_data_cache[val]);
            passenger_data_pick[passenger_data_pick.length-1].sequence = passenger_pick+passenger_pick_number;
            if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'issued_offline'){
                document.getElementById('move_btn_'+val).innerHTML = 'Pax ' + passenger_pick_number;
                document.getElementById('move_btn_'+val).disabled = true;
                update_contact('passenger',passenger_pick_number);
            }else{
                document.getElementById('move_btn_'+val).innerHTML = passenger_pick.charAt(0).toUpperCase() + passenger_pick.slice(1).toLowerCase() + ' ' + passenger_pick_number;
                document.getElementById('move_btn_'+val).disabled = true;
            }
        }
        $('#myModalPlugin').modal('hide');
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: "You can't choose same person in 1 booking",
      })
    }
}

function btn_move_passenger_cache_enable(val){
    var passenger_pick = document.getElementById('selection_type'+val).value.replace(/[^a-zA-Z ]/g,"");
    var passenger_pick_number = document.getElementById('selection_type'+val).value.replace( /^\D+/g, '');
    check = 0;
    for(i in passenger_data_pick){
        if(passenger_data_pick[i].seq_id == passenger_data_cache[val].seq_id)
            check = 1;
    }
    console.log(check);
    console.log('move_btn_'+val);
    if(check == 0){
        document.getElementById('move_btn_'+val).innerHTML = 'Move';
        document.getElementById('move_btn_'+val).disabled = false;
        document.getElementById('move_btn_'+val).setAttribute("onclick",`update_customer_cache_list(`+val+`);`);
    }
}

function modal_help_pax_hide(){
    $('#myModalHelp_passenger').modal('hide');
}

function delete_country_of_issued_passenger_cache(type,val){
    document.getElementById(type+'_identity_country_of_issued'+val).value = '';
    console.log(document.getElementById('select2-'+type+'_identity_country_of_issued'+val+'_id-container').innerHTML);
    document.getElementById('select2-'+type+'_identity_country_of_issued'+val+'_id-container').innerHTML = 'Country Of Issued';
}

function delete_identity_expired_date(type, id){
    document.getElementById(type+'_identity_expired_date'+id).value = "";
}

function close_upload_attachment(val,type){
    if(type == '')
        $('#myModal_attachment'+val).modal('hide');
    else if(type == 'edit')
        $('#myModal_attachment_edit'+val).modal('hide');
}

function handleFileSelect_attachment(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;border-radius:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment1(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment1.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment1.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment2(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment2.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment2.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment3(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment3.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment3.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment4(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment4.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment4.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment_edit(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment_edit.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;border-radius:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment_edit.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment_edit1(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment_edit1.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment_edit1.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment_edit2(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment2.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment_edit2.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment_edit3(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment3.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment_edit3.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function handleFileSelect_attachment_edit4(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment_edit4.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment_edit4.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function update_passenger_backend(){
    document.getElementById('update_passenger_customer').disabled = true;
    //check
    error_log = '';
    console.log(document.getElementById('passenger_edit_nationality').value);
    if(document.getElementById('passenger_edit_nationality').value == ''){
        error_log+= 'Please fill Nationality!</br>\n';
        document.getElementById('passenger_edit_nationality').style['border-color'] = 'red';
        document.getElementById('passenger_edit_nationality').style['border-color'] = 'red';
    }else{
        document.getElementById('passenger_edit_nationality').style['border-color'] = '#EFEFEF';
        document.getElementById('passenger_edit_nationality').style['border-color'] = '#EFEFEF';
    }
    var identity_type = '';
    for(i = 1 ; i <= 4 ; i++){
        if(i == 1)
            identity_type = 'passport';
        else if(i == 2)
            identity_type = 'ktp';
        else if(i == 3)
            identity_type = 'sim';
        else if(i == 4)
            identity_type = 'other';
        if(i == 2 && document.getElementById('passenger_identity_number'+i).value != '' && check_ktp(document.getElementById('passenger_identity_number'+i).value) == false){
           error_log+= 'Please fill id number, ktp only contain 16 digits for passenger adult '+i+'!</br>\n';
           document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
        }else{
           document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
        }

        if(i == 3 && document.getElementById('passenger_identity_number'+i).value != '' && check_sim(document.getElementById('passenger_identity_number'+i).value) == false){
           error_log+= 'Please fill identity number, sim only contain 12 - 13 digits!</br>\n';
           document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
        }else{
           document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
        }

        if(i == 1 && document.getElementById('passenger_identity_number'+i).value != ''){
           if(check_passport(document.getElementById('passenger_identity_number'+i).value) == false){
               error_log+= 'Please fill identity number, passport only contain more than 6 digits!</br>\n';
               document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
           }
           if(document.getElementById('passenger_identity_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
               document.getElementById('passenger_identity_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('passenger_identity_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('passenger_identity_expired_date'+i).value == ''){
               error_log+= 'Please fill '+identity_type+' country of issued!</br>\n';
               document.getElementById('passenger_identity_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('passenger_identity_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
        }
        if(i == 4 && document.getElementById('passenger_identity_number'+i).value != '' && document.getElementById('passenger_identity_number'+i).value.length < 6){
           error_log+= 'Please fill '+identity_type+' number !</br>\n';
           document.getElementById('passenger_identity_number'+i).style['border-color'] = 'red';
        }else{
           document.getElementById('passenger_identity_number'+i).style['border-color'] = '#EFEFEF';
        }
//        if(document.getElementById('passenger_edit_identity_number'+i).value != '' ||
//           document.getElementById('passenger_edit_identity_expired_date'+i).value != '' ||
//           document.getElementById('passenger_identity_country_of_issued'+i).value != ''){
//           if(document.getElementById('passenger_edit_identity_number'+i).value == ''){
//               error_log+= 'Please fill '+identity_type+' number !</br>\n';
//               document.getElementById('passenger_edit_identity_number'+i).style['border-color'] = 'red';
//           }else{
//               document.getElementById('passenger_edit_identity_number'+i).style['border-color'] = '#EFEFEF';
//           }if(document.getElementById('passenger_edit_identity_expired_date'+i).value == ''){
//               error_log+= 'Please fill '+identity_type+' expired date !</br>\n';
//               document.getElementById('passenger_edit_identity_expired_date'+i).style['border-color'] = 'red';
//           }else{
//               document.getElementById('passenger_edit_identity_expired_date'+i).style['border-color'] = '#EFEFEF';
//           }if(document.getElementById('passenger_edit_identity_country_of_issued'+i).value == ''){
//               error_log+= 'Please fill '+identity_type+' country of issued !</br>\n';
//               document.getElementById('passenger_edit_identity_country_of_issued'+i).style['border-color'] = 'red';
//           }else{
//               document.getElementById('passenger_edit_identity_country_of_issued'+i).style['border-color'] = '#EFEFEF';
//           }
//        }
    }
    try{
        for(i = 1; i<= passenger_data_edit_phone ; i++){
            try{
                if(document.getElementById('passenger_edit_phone_code'+i).value == '' && check_phone_number(document.getElementById('passenger_edit_phone_number'+i).value) == false){
                    error_log+= 'Phone number only contain number 8 - 12 digits for phone '+i+'!</br>\n';
                    document.getElementById('passenger_edit_phone_number'+i).style['border-color'] = 'red';
                }else
                    document.getElementById('passenger_edit_phone_number'+i).style['border-color'] = '#EFEFEF';
            }catch(err){

            }
        }
    }catch(err){
    }
    if(error_log == ''){
        var formData = new FormData($('#form_identity_passenger_edit').get(0));
        formData.append('signature', signature)
        console.log(formData);
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/content",
           headers:{
                'action': 'update_image_passenger',
           },
           data: formData,
           success: function(msg) {
                console.log(msg);
                if(msg.result.error_code == 0){
                    identity_type_dict = {
                        'passport': 'files_attachment_edit1',
                        'ktp': 'files_attachment_edit2',
                        'sim': 'files_attachment_edit3',
                        'other': 'files_attachment_edit4'
                    }
                    img_list = [];
                    for(i in msg.result.response)
                        img_list.push([msg.result.response[i][0], 4, msg.result.response[i][2]])
                    try{
                    if(document.getElementById('avatar_delete').checked == true)
                        img_list.push([passenger_data_cache[passenger_cache_pick].face_image[0][1], 2, 'files_attachment']);
                    }catch(err){}
                    for(i in passenger_data_cache[passenger_cache_pick].identities){
                        for(j in passenger_data_cache[passenger_cache_pick].identities[i].identity_images){
                            if(document.getElementById(i+j+'_delete').checked == true)
                                img_list.push([passenger_data_cache[passenger_cache_pick].identities[i].identity_images[j][1], 2, identity_type_dict[i]]);
                        }
                    }
                    phone = [];
                    identity = {};
                    try{
                        for(i = 1; i<= passenger_data_edit_phone ; i++){
                            try{
                                phone.push({
                                    'calling_code': document.getElementById('passenger_edit_phone_code'+i).value,
                                    'calling_number': document.getElementById('passenger_edit_phone_number'+i).value
                                })
                            }catch(err){

                            }
                        }
                    }catch(err){

                    }
                    for(i = 1 ; i <= 4 ; i++){
                        if(document.getElementById('passenger_edit_identity_number'+i).value != ''){
                            if(i == 1)
                                identity_type = 'passport';
                            else if(i == 2)
                                identity_type = 'ktp';
                            else if(i == 3)
                                identity_type = 'sim';
                            else if(i == 4)
                                identity_type = 'other';
                            identity[identity_type] = {
                                'identity_type': identity_type,
                                'identity_number': document.getElementById('passenger_edit_identity_number'+i).value,
                                'identity_expdate': document.getElementById('passenger_edit_identity_expired_date'+i).value,
                                'identity_country_of_issued_name': document.getElementById('passenger_edit_identity_country_of_issued'+i).value
                            };
                        }
                    }
                    update_passenger_dict = {
                        'first_name': document.getElementById('passenger_edit_first_name').value,
                        'last_name': document.getElementById('passenger_edit_last_name').value,
                        'nationality_name': document.getElementById('passenger_edit_nationality').value,
                        'email': document.getElementById('passenger_edit_email').value,
                        'phone': phone,
                        'identity': identity,
                        'image': img_list,
                        'seq_id': passenger_data_cache[passenger_cache_pick].seq_id,
                        'birth_date': passenger_data_cache[passenger_cache_pick].birth_date != '' ? passenger_data_cache[passenger_cache_pick].birth_date : document.getElementById('passenger_edit_birth_date').value
                    }
                    console.log(JSON.stringify(update_passenger_dict));
                    $.ajax({
                       type: "POST",
                       url: "/webservice/agent",
                       headers:{
                            'action': 'update_customer',
                       },
                       data: {
                            'data': JSON.stringify(update_passenger_dict),
                            'signature': signature
                       },
                       success: function(msg) {
                            console.log(msg);
                            if(msg.result.error_code == 0){
                                Swal.fire({
                                  type: 'success',
                                  title: 'Update!',
                                  html: '',
                                })
                                document.getElementById('passenger_chosen').hidden = false;
                                document.getElementById('passenger_update').hidden = true;
                                get_passenger_cache('chosen');
                                document.getElementById('update_passenger_customer').disabled = false;
                                //document.getElementById('form_admin').submit();
                            }else{
                                Swal.fire({
                                  type: 'error',
                                  title: 'Oops!',
                                  html: msg.result.error_msg,
                                })
                            }
                       },
                       error: function(XMLHttpRequest, textStatus, errorThrown) {
                            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update passenger');
                       }
                    });

                    //document.getElementById('form_admin').submit();
                }
           },
           contentType:false,
           processData:false,
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update passenger');
                document.getElementById('update_passenger_customer').disabled = false;
           }
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: #ff9900;">Error </span>' + error_log,
        })
        document.getElementById('update_passenger_customer').disabled = false;
    }
    document.getElementById('update_passenger_customer').disabled = false;
}

function update_cache_version_func(type){
    if(type == 'data')
        document.getElementById('update_cache_version').disabled = true;
    else if(type == 'image')
        if(document.getElementById('update_cache_image'))
            document.getElementById('update_cache_image').disabled = true;
    action = 'update_cache'
    action += '_'+type;

    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': action,
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                Swal.fire({
                     type: 'success',
                     title: 'Success!',
                     html: 'Success update cache'
               })
               document.getElementById('form_admin').submit();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error update cache </span>' + errorThrown,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update cache');
       },timeout: 300000
    });
}

function clear_search_pax(type,sequence){
    if(type == 'booker'){
        document.getElementById('search_result').innerHTML = '';
    }else if(type == 'passenger'){
        document.getElementById('search_result_passenger').innerHTML = '';
    }else if(type == 'adult'){
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }else if(type == 'child'){
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }else if(type == 'infant'){
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }else if(type == 'senior'){
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }
}

function auto_logout(msg){
    try{
        try{
            login_again = false;
        }catch(err){}
        error_logger = msg.result.error_msg;
        clearInterval(timeInterval);
    }catch(err){
        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
            error_logger = 'Please login again!';
            try{
                login_again = false;
            }catch(err){}
        }else{
            error_logger = 'Session has been expired!';
            try{
                login_again = false;
            }catch(err){}
        }
    }

    Swal.fire({
      title: error_logger,
      type: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        logout();
      }else{
        logout();
      }
    })
}

function error_ajax(XMLHttpRequest, textStatus, errorThrown, str){
    if(XMLHttpRequest.status == 500 || XMLHttpRequest.status == 0){
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">'+str+' </span>' + errorThrown,
        })
    }
}

function hide_modal_waiting_transaction(){
    setTimeout(function() {
       $("#waitingTransaction").modal('hide'); // bug modal kalau hasil ajax langsung kembali / tidak loading tidak bisa di hide jadi di beri jeda waktu untuk hide
   }, 150);
}

function render_login(product_type){
    html_id = '';
    if(product_type == 'train')
        html_id = 'train_booking';
    else if(product_type == 'visa')
        html_id = 'visa_booking';
    else if(product_type == 'hotel')
        html_id = 'hotel_booking';
    else if(product_type == 'issued_offline')
        html_id = 'offline_booking';
    else if(product_type == 'tour')
        html_id = 'tour_final_info';
    else if(product_type == 'activity')
        html_id = 'activity_final_info';
    else if(product_type == 'passport')
        html_id = 'passport_booking';
    else if(product_type == 'ppob')
        html_id = 'bills_booking';
    else if(product_type == 'airline')
        html_id = 'airline_booking';
    else if(product_type == 'medical')
        html_id = 'medical_booking';

    document.getElementById(html_id).innerHTML = `
        <div class="col-lg-12" style="background:white; padding:30px; 20px; border:1px solid #cdcdcd;">
            <div class="row">
                <div class="col-lg-12">
                    <h5 style="color:`+color+`;">Please Signin First!</h5>
                    <hr/>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <h5>Login</h5>
                    <br/>
                    <label>Username</label>
                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                        <input type="text" class="form-control" name="username" id="username" placeholder="Username " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Username '">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-3">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <br/>
                    <label>Password</label>
                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                        <input type="password" class="form-control" name="password" id="password" placeholder="Password " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Password '">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-3">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 mt-3">
                <button class="btn-next primary-btn next-passenger-train ld-ext-right" style="width:100%;" type="button" value="Login" onclick="$('.btn-next').addClass('running');$('.btn-next').prop('disabled', true);signin_booking();">
                    Login
                    <div class="ld ld-ring ld-cycle"></div>
                </button>
                </div>
            </div>
        </div>`;

        hide_modal_waiting_transaction();
}

function print_success_issued(){
    Swal.fire({
      title: 'Issued',
      html: 'Payment Success',
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
   }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
   })
}