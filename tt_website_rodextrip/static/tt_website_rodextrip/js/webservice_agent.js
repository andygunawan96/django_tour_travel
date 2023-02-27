passenger_data = [];
passenger_data_pick = [];
booker_pick_passenger = {};
passenger_number = 0;
agent_offside = 0;
load_more = true;
login_again = true
for_jbox_image = 0;

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
            try{
                if(google_analytics != ''){
                    if(msg.result.response.co_agent_frontend_security.includes('b2c_limitation') == true)
                        gtag('event', 'b2c', {'agent_type':'b2c'});
                    else
                        gtag('event', 'b2b', {'agent_type':'b2b'});
                }
            }catch(err){
                console.log(err); //error google analytics
            }
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
            if(msg.result.error_code == 0){
                if(msg.result.response.co_agent_frontend_security.includes('login') == true){
                    try{
                        if(google_analytics != ''){
                            if(msg.result.response.co_agent_frontend_security.includes('b2c_limitation') == true)
                                gtag('event', 'b2c', {'agent_type':'b2c'});
                            else
                                gtag('event', 'b2b', {'agent_type':'b2b'});
                        }
                    }catch(err){
                        console.log(err); // error google analytics
                    }
                    try{
                        document.getElementById('nav-menu-container_no_login').style.display = 'none';
                        document.getElementById('nav-menu-container_login').style.display = 'block';
                        document.getElementById('user_login').innerHTML = $('#username').val();
                        document.getElementById('user_login2').innerHTML = $('#username').val();
                        user_login = msg.result.response;
                        signature = msg.result.response.signature;
                        triggered_balance(false);
                        //get_vendor_balance(false); //firefox error
                    }catch(err){
                        console.log(err); // error menu nav / browser / responsive
                    }
                    if(window.location.href.includes('booking')){
                        location.reload();
                    }else if(window.location.href.split('/')[3] == ''){
                        window.location.href = '/';
                    }else if(window.location.href.split('/').length == 4){
                        window.location.reload();
                    }else if(window.location.href.split('/')[3] == 'airline'){
                        airline_redirect_signin(last_session);
                    }else if(window.location.href.split('/')[3] == 'train'){
                        train_redirect_signin(last_session);
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

function check_session(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'check_session',
       },
       data: {
            'signature':signature,
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code != 0){
                //signature expired untuk passenger
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Expired, Please contact your agent!' ,
                }).then((result) => {
                  window.location.href = '/';
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error reset password');
       },timeout: 60000
    });
}

function generate_url_create_passenger(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'update_session',
       },
       data: {
            'signature':signature,
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                //generate link
                url_create_passenger = window.location.href.split('/');
                for(i in url_create_passenger)
                    if(url_create_passenger.length <= 3)
                        break;
                    else
                        url_create_passenger.pop();
                copy_create_passenger(url_create_passenger.join('/') + '/create_passenger/' + signature);
            }else{
                //signature expired waktu mau generate
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Signature expired, please login again!' ,
                }).then((result) => {
                  logout();
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error reset password');
       },timeout: 60000
    });
}

function copy_create_passenger(url){
    try{
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })

        Toast.fire({
          type: 'success',
          title: 'Generated Successfully'
        })
    }catch(err){
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })

        Toast.fire({
          type: 'danger',
          title: 'Generated Error'
        })
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
            for(x=0;x<pj;x++){
                if((pj-x)%3==0 && x!=0){
                    priceshow+=",";
                }
                priceshow+=temp.charAt(x);
            }
            if(temp.split('.').length == 2){
                for(x=pj;x<pj+3;x++){
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
    if(error_log == ''){
        $('#b2c_signup_btn').addClass("running");
        $('#b2c_signup_btn').attr("disabled", true);
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
                if(msg.result.error_code == 0){
                    document.getElementById('b2c_first_name').value = '';
                    document.getElementById('b2c_last_name').value = '';
                    document.getElementById('b2c_email').value = '';
                    document.getElementById('b2c_phone').value = '';
                    document.getElementById('b2c_title').value = '';
                    $('#b2c_nationality_id').val("ID").trigger('change');
                    $('#b2c_phone_code_id').val("62").trigger('change');
                    $('#b2c_title').niceSelect('update');
                    Swal.fire({
                      type: 'success',
                      title: 'Create User!',
                      text: 'Please check your email',
                    });
                    $('#myModalb2c').modal('hide');
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">'+msg.result.error_msg+' </span>',
                    })
                }
                $('#b2c_signup_btn').removeClass("running");
                $('#b2c_signup_btn').attr("disabled", false);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error url server');
           },timeout: 60000
        });
    }else{
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
               }if(document.getElementById('passenger_identity_country_of_issued'+i+'_id').value == '' || document.getElementById('passenger_identity_country_of_issued'+i+'_id').value == 'Country Of Issued'){
                   error_log+= 'Please fill '+identity_type+' country of issued!</br>\n';
                   document.getElementById('passenger_identity_country_of_issued'+i+'_id').style['border-color'] = 'red';
               }else{
                   document.getElementById('passenger_identity_country_of_issued'+i+'_id').style['border-color'] = '#EFEFEF';
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
       ff_numbers = [];
       for(i = 1; i<= passenger_ff_data ; i++){
            try{
                if(document.getElementById('passenger_ff'+i).value == ''){
                    error_log+= 'Please choose frequent flyer '+i+'!</br>\n';
                    document.getElementById('passenger_ff'+i).style['border-color'] = 'red';
                }else{
                    is_same_ff = false;
                    for(j in ff_numbers){
                        if(ff_numbers[j] == document.getElementById('passenger_ff'+i+'_id').value){
                            is_same_ff = true;
                        }
                    }
                    if(!is_same_ff){
                        ff_numbers.push(document.getElementById('passenger_ff'+i+'_id').value);
                        document.getElementById('passenger_ff'+i).style['border-color'] = '#EFEFEF';
                    }else{
                        error_log+= 'Same frequent flyer '+i+', please change!</br>\n';
                        document.getElementById('passenger_edit_ff'+i+'_id').style['border-color'] = 'red';
                    }


                }
                if(document.getElementById('passenger_ff_number'+i).value == ''){
                    error_log+= 'Please fill frequent flyer number '+i+'!</br>\n';
                    document.getElementById('passenger_ff_number'+i).style['border-color'] = 'red';
                }else
                    document.getElementById('passenger_ff_number'+i).style['border-color'] = '#EFEFEF';

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
           ff_numbers = [];
           for(i = 1; i<= passenger_data_phone ; i++){
                try{
                    phone.push({
                        'calling_code': document.getElementById('passenger_phone_code'+i).value,
                        'calling_number': document.getElementById('passenger_phone_number'+i).value
                    })
                }catch(err){

                }
           }

           for(i = 1; i<= passenger_ff_data ; i++){
                try{
                    ff_numbers.push({
                        'ff_code': document.getElementById('passenger_ff'+i+'_id').value,
                        'ff_number': document.getElementById('passenger_ff_number'+i).value
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
                        'identity_country_of_issued_name': document.getElementById('passenger_identity_country_of_issued'+i+'_id').value
                    };
                }
           }
           passenger.phone = phone;
           passenger.identity = identity;
           passenger.ff_numbers = ff_numbers;
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
                                        $('#passenger_identity_country_of_issued'+i+'_id').val('').trigger('change');
//                                        document.getElementById('passenger_identity_country_of_issued'+i+'_id').value = '';
//                                        document.getElementById('select2-passenger_identity_country_of_issued'+i+'_id-container').innerHTML = 'Country of Issued';
                                        document.getElementById('files_attachment'+i).value = '';
                                        document.getElementById('selectedFiles_attachment'+i).innerHTML = '';
                                    }
                                    document.getElementById('files_attachment').value = '';
                                    document.getElementById('selectedFiles_attachment').innerHTML = '';
                                    document.getElementById('passenger_phone_table').innerHTML = '';
                                    passenger_data_phone = 0;
                                    document.getElementById('passenger_frequent_flyer_table').innerHTML = '';
                                    passenger_ff_data = 0;
                                    document.getElementById('create_new_passenger_btn').disabled = false;
                                }catch(err){
                                    console.log(err);
                                }
                                Swal.fire({
                                   type: 'Success',
                                   title: 'Success created, customer ' + msg.result.response.seq_id,
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
    var radios = '';
    if(type == 'booker'){
        radios = document.getElementsByName('radio_booker');
    }else if(type == 'passenger'){
        radios = document.getElementsByName('radio_passenger'+val);
    }else if(type == 'pax_cache'){
        radios = document.getElementsByName('radio_passenger_cache');
    }else if(type == 'contact'){
        radios = document.getElementsByName('radio_contact');
    }else if(type == 'passenger_gb'){
        radios = document.getElementsByName('radio_passenger'+val);
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
            document.getElementById('button_tr_passenger_db').style.display = "block";
        }

        if(value == 'create'){
            document.getElementById('passenger_input').hidden = false;
        }else{
            document.getElementById('passenger_input').hidden = true;
        }

        if(value == 'search'){
            document.getElementById('passenger_search').hidden = false;
        }else{
            document.getElementById('passenger_search').hidden = true;
            document.getElementById('search_result_passenger').innerHTML = '';
        }
    }
    else if(value == 'search' && type == 'booker'){
        document.getElementById('train_booker_search_div').hidden = false;
        document.getElementById('booker_input').hidden = true;
        document.getElementById('button_tr_booker').style.display = "block";
    }else if(value == 'create' && type == 'booker'){
        document.getElementById('train_booker_search_div').hidden = true;
        document.getElementById('booker_input').hidden = false;
    }else if(value == 'chosen' && type == 'booker'){
        document.getElementById('train_booker_search_div').hidden = true;
        document.getElementById('booker_input').hidden = true;
    }else if(value == 'search' && type == 'passenger'){
        document.getElementById('passenger_search'+val).hidden = false;
        document.getElementById('passenger_input'+val).hidden = true;
        document.getElementById('button_tr_'+val).style.display = "block";
    }else if(value == 'create' && type == 'passenger'){
        document.getElementById('passenger_search'+val).hidden = true;
        document.getElementById('passenger_input'+val).hidden = false;
    }else if(value == 'search' && type == 'contact'){
        document.getElementById('train_contact_search_div').hidden = false;
        document.getElementById('contact_input').hidden = true;
        document.getElementById('button_tr_contact').style.display = "block";
    }else if(value == 'create' && type == 'contact'){
        document.getElementById('train_contact_search_div').hidden = true;
        document.getElementById('contact_input').hidden = false;
    }else if(value == 'search' && type == 'passenger_gb'){
        document.getElementById('passenger_search'+val).hidden = false;
        document.getElementById('passenger_input'+val).hidden = true;
        document.getElementById('button_tr_adult'+val).style.display = "block";
    }else if(value == 'create' && type == 'passenger_gb'){
        document.getElementById('passenger_search'+val).hidden = true;
        document.getElementById('passenger_input'+val).hidden = false;
    }
    try{
        radio_cache_value = document.querySelector('input[name="radio_passenger_cache"]:checked').value;
        if(radio_cache_value == 'chosen'){
            document.getElementById('button_move_footer').style.display="block";
        }else{
            document.getElementById('button_move_footer').style.display="none";
        }
    }catch(err){console.log(err);}
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
        if(time_limit>0){
            time_limit--;
            document.getElementById('session_time').innerHTML = ``+ parseInt(time_limit/60) % 24 +`m:`+ (time_limit%60) +`s`;
            document.getElementById('elapse_time').innerHTML = ``+ parseInt((1200 - time_limit)/60) % 24 +`m:`+ ((1200 - time_limit)%60) +`s`;
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

function show_filter_data(){
    filter_data_div = document.getElementById('filter_search_div_cache');
    result_data_div = document.getElementById('result_paxs_div');
    if (filter_data_div.style.display === "none") {
        filter_data_div.style.display = "block";
        result_data_div.style.display = "none";
        document.getElementById("filter_search_cache").innerHTML = 'Close <i class="fas fa-times"></i>';
    }
    else{
        filter_data_div.style.display = "none";
        result_data_div.style.display = "block";
        document.getElementById("filter_search_cache").innerHTML = 'Filter <i class="fas fa-filter"></i>';
    }
    //result_paxs_div
    //document.getElementById('filter_search_cache').style.display = 'none';
}

function default_filter_data(){
    document.getElementById('filter_search_div_cache').style.display = "none";
    document.getElementById('result_paxs_div').style.display = "flex";
    document.getElementById('button_tr_getbooking_fv').innerHTML = '';
}

function filter_search_passenger(passenger_type='passenger', number='', product='', is_show_filter=false){
    try{
        var response = '';
        var passenger = passenger_type;
        var like_name_paxs = document.getElementById('train_'+passenger+number+'_search').value;
        var input_type = '';
        var passenger_search_type = document.getElementById('train_'+passenger_type+number+'_search_type').value;
        if(['cust_name', 'cor_name'].includes(passenger_search_type) == true)
            input_type = 'name';
        else if(passenger_search_type == 'mobile')
            input_type = 'mobile';
        else if(passenger_search_type == 'email')
            input_type = 'email';
        else if(passenger_search_type == 'identity_type')
            input_type = 'identity number';

        var mobile = '';
        var email = '';
        var identity_type = '';
        var identity_number = '';
        var birth_date = '';
        if(is_show_filter == true)
            try{
                mobile = document.getElementById('mobile_search_cache').value;
                email = document.getElementById('email_search_cache').value;
                identity_type = document.getElementById('identity_type_search_cache').value;
                identity_number = document.getElementById('identity_number_search_cache').value;
                birth_date = document.getElementById('birth_date_search_cache').value;
            }catch(err){
                try{
                    mobile = document.getElementById('mobile_search_teropong').value;
                    email = document.getElementById('email_search_teropong').value;
                    identity_type = document.getElementById('identity_type_search_teropong').value;
                    identity_number = document.getElementById('identity_number_search_teropong').value;
                    birth_date = document.getElementById('birth_date_search_teropong').value;
                }catch(err){}
            }
        var msg = {
            "result": {
                "error_code": 0,
                "response": passenger_data
            }
        }

        if(is_show_filter == true){
            document.getElementById('filter_search_div_cache').style.display = "none";
        }
        filter_top_right(passenger_type, number, product);

        response+=`
            <div class="row">
                <div class="col-lg-12">`;
                if(msg.result.response.length != 0){
                    response+=`<div id="header_search_cache"><div class="alert alert-success" role="alert" style="margin-top:10px; padding:15px;"><h6><i class="fas fa-search"></i> We found `+msg.result.response.length+` customer(s) with `+input_type+` like " `+like_name_paxs+` "</h6></div></div>`;
                }else{
                    response+=`<div id="header_search_cache"><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search-minus"></i> Oops! User not found!</h6></div></div>`;
                }
        response+=`
                </div>
            </div>`;

            response += `<div class="row" id="filter_search_div_cache" style="padding:15px; background:white; display:none;">`;
            response +=`
                <div class="col-lg-12 mb-3">
                    <label>Identity Type</label>
                    <div class="input-container-search-ticket">
                        <div class="form-select-2">
                            <select id="identity_type_search_cache" class="nice-select-default">
                                <option value=""></option>
                                <option value="ktp">KTP</option>
                                <option value="sim">SIM</option>
                                <option value="passport">Passport</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mb-3">
                    <label>Identity Number</label>
                    <div class="input-container-search-ticket">
                        <input type="text" style="margin-bottom:0px;" class="form-control" id="identity_number_search_cache" value="`+identity_number+`">
                    </div>
                </div>
                <div class="col-lg-12" id="filter_parent_date">

                </div>
                <div class="col-lg-12 mb-3">
                    <label>Birth Date</label>
                    <div class="input-container-search-ticket">
                        <input type="text" style="margin-bottom:0px;" class="form-control" id="birth_date_search_cache" value="`+birth_date+`" autocomplete="off">
                        <button type="button" class="primary-delete-date" onclick="delete_expired_date_data('birth_date_search_cache', '')"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                    </div>
                </div>
                <div class="col-lg-12 mb-3">
                    <label>Mobile</label>
                    <div class="input-container-search-ticket">
                        <input type="text" style="margin-bottom:0px;" class="form-control" id="mobile_search_cache" value="`+mobile+`">
                    </div>
                </div>

                <div class="col-lg-12 mb-3">
                    <label>Email</label>
                    <div class="input-container-search-ticket">
                        <input type="text" style="margin-bottom:0px;" class="form-control" id="email_search_cache" value="`+email+`">
                    </div>
                </div>

                <div class="col-lg-12" style="text-align:center;">
                    <button type="button" class="primary-btn mb-3" style="width:100%;" onclick="filter_search_passenger('`+passenger_type+`', '`+number+`', '`+product+`',true);">Filter</button>
                </div>
            </div>`;
        var selection = null;
        try{
            selection = document.getElementById(passenger+'_id_type'+passenger_number).options;
        }catch(err){
            console.log(err); //error kalau tidak ada identities di backend
        }
        var found_selection = [];
        if(selection != null){
            for(i in selection){
                if(selection[i].value != '' && typeof(selection[i].value) == "string"){
                    found_selection.push(selection[i].value);
                }
            }
        }

        //hasil search paxs
        var add = false;
        var is_same_mobile = false;
        var is_same_email = false;
        var is_same_identity_type = false;
        var is_same_identity_number = false;
        var is_same_birth_date = false;
        var counter_passenger_print = 0;

        response += `
        <div class="row" id="result_paxs_div">
            <div class="col-lg-12">`;
                for(i in msg.result.response){
                    add = false;
                    is_same_mobile = false;
                    is_same_email = false;
                    is_same_identity_type = false;
                    is_same_identity_number = false;
                    is_same_birth_date = false;
                    if(mobile == '' && email == '' && identity_type == '' && identity_number == '' && birth_date == ''){
                        add = true
                    }
                    if(add == false){
                        if(mobile != ''){
                            for(j in msg.result.response[i].phones){
                                if(msg.result.response[i].phones[j].calling_number.match(mobile)){
                                    is_same_mobile = true;
                                    break;
                                }
                            }
                        }else{
                            is_same_mobile = true;
                        }
                        if(email != '' && msg.result.response[i].email.match(email)){
                            is_same_email = true
                        }else if(email == ''){
                            is_same_email = true
                        }
                        if(identity_type != ''){
                            if(identity_type == 'ktp'){
                                if(msg.result.response[i].identities.hasOwnProperty('ktp')){
                                    if(identity_number != ''){
                                        if(msg.result.response[i].identities.ktp.identity_number.match(identity_number))
                                            is_same_identity_number = true;
                                    }else{
                                        is_same_identity_number = true;
                                    }
                                    is_same_identity_type = true;
                                }
                            }else if(identity_type == 'sim'){
                                if(msg.result.response[i].identities.hasOwnProperty('sim')){
                                    if(identity_number != ''){
                                        if(msg.result.response[i].identities.sim.identity_number.match(identity_number))
                                            is_same_identity_number = true;
                                    }else{
                                        is_same_identity_number = true;
                                    }
                                    is_same_identity_type = true;
                                }
                            }else if(identity_type == 'passport'){
                                if(msg.result.response[i].identities.hasOwnProperty('passport')){
                                    if(identity_number != ''){
                                        if(msg.result.response[i].identities.passport.identity_number.match(identity_number))
                                            is_same_identity_number = true;
                                    }else{
                                        is_same_identity_number = true;
                                    }
                                    is_same_identity_type = true;
                                }
                            }else if(identity_type == 'other'){
                                if(msg.result.response[i].identities.hasOwnProperty('other')){
                                    if(identity_number != ''){
                                        if(msg.result.response[i].identities.other.identity_number.match(identity_number))
                                            is_same_identity_number = true;
                                    }else{
                                        is_same_identity_number = true;
                                    }
                                    is_same_identity_type = true;
                                }
                            }
                        }else{
                            is_same_identity_type = true;
                            is_same_identity_number = true;
                        }
                        if(birth_date != ''){
                            if(birth_date == msg.result.response[i].birth_date)
                                is_same_birth_date = true;
                            else
                                is_same_birth_date = false;
                        }else{
                            is_same_birth_date = true
                        }

                        if(is_same_mobile == true && is_same_email == true && is_same_identity_type == true && is_same_identity_number == true && is_same_birth_date == true)
                            add = true;
                    }
                    if(add){
                        response+=`<div class="row">`;
        //                    var number_i = parseInt(i)+1;
                        number_i = parseInt(counter_passenger_print)+1;
                        response+=`<div class="col-lg-12" style="margin-bottom:30px; border:1px solid #cdcdcd; background:white; padding:15px">`;
                        response+=`
                            <h4 class="single_border_custom_bottom" style="margin-bottom:5px; width:50px; word-break:break-word;">#`+number_i+`.</h4>
                            <div class="row">
                                <div class="col-lg-3">
                                    <div class="row">
                                        <div class="col-lg-12" style="margin-bottom:10px;">`;
                                            if(msg.result.response[i].face_image.length > 0){
                                                response+=`<img src="`+msg.result.response[i].face_image[0]+`" alt="User" class="picture_passenger_agent">`;
                                            }
                                            else if(msg.result.response[i].title == "MR"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_mr.png" alt="User MR" class="picture_passenger_agent">`;
                                            }
                                            else if(msg.result.response[i].title == "MRS"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_mrs.png" alt="User MRS" class="picture_passenger_agent">`;
                                            }
                                            else if(msg.result.response[i].title == "MS"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_ms.png" alt="User MS" class="picture_passenger_agent">`;
                                            }
                                            else if(msg.result.response[i].title == "MSTR"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_mistr.png" alt="User MSTR" class="picture_passenger_agent">`;
                                            }
                                            else if(msg.result.response[i].title == "MISS"){
                                                response+=`<img src="/static/tt_website_rodextrip/img/user_miss.png" alt="User MISS" class="picture_passenger_agent">`;
                                            }
                                        response+=`
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-9 mb-1" style="padding-bottom:5px;">
                                    <h4 style="word-break:break-word;">`+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name+`</h4>`;
                                    if(msg.result.response[i].customer_parents.length != 0){
                                        response += `<label id="pop_corporate_detail`+i+`" style="margin-top:10px; border:1px solid #cdcdcd; background:`+color+`; color:`+text_color+`; padding:5px 10px;"><i class="fas fa-user-tie"></i> Corporate Booker <i class="fas fa-chevron-down"></i></label><br/>`;
                                    }

                                    if(msg.result.response[i].original_agent != '')
                                        response+=`<i class="fas fa-user-secret"></i> <b>Customer of Agent: </b><i style="word-break:break-word;">`+msg.result.response[i].original_agent+`</i>`;
                                    else
                                        response+=`<i class="fas fa-user-secret"></i> <b>Customer of Agent: </b><i style="word-break:break-word;">not filled in</i>`;

                                    if(msg.result.response[i].birth_date != '')
                                        response+=`<br/><i class="fas fa-birthday-cake"></i> <b>Birth Date: </b><i style="word-break:break-word;">`+msg.result.response[i].birth_date+`</i>`;
                                    else
                                        response+=`<br/><i class="fas fa-birthday-cake"></i> <b>Birth Date: </b><i style="word-break:break-word;">not filled in</i>`;

                                    if(msg.result.response[i].nationality_name != '')
                                        response+=` <br/><i class="fas fa-globe-asia"></i> <b>Nationality: </b><i style="word-break:break-word;">`+msg.result.response[i].nationality_name+`</i>`;
                                    else
                                        response+=` <br/><i class="fas fa-globe-asia"></i> <b>Nationality: </b><i style="word-break:break-word;"> not filled in</i>`;

                                    if(msg.result.response[i].email != '' && msg.result.response[i].email != false){
                                        response+=`<br/><i class="fas fa-envelope"></i> <b>Email: </b><i style="word-break:break-word;">`+msg.result.response[i].email+`</i>`;
                                    }else{
                                        response+=`<br/><i class="fas fa-envelope"></i> <b>Email: </b><i style="word-break:break-word;">not filled in</i>`;
                                    }

                                    //BEHAVIORS
                                    if(msg.result.response[i].hasOwnProperty('behaviors') && Object.keys(msg.result.response[i].behaviors).length > 0){
                                        print_behavior = false;
                                        response_behavior=`<br/><i class="fas fa-clipboard"></i>
                                        <label id="pop_behavior_detail`+i+`" style="color:`+color+`;margin-bottom:unset; cursor:pointer;"> See Behaviors History <i class="fas fa-chevron-down"></i></label>`;
                                        for(j in msg.result.response[i].behaviors){
                                            if(j.toLowerCase() == product || product == 'cache'){
                                                print_behavior = true;
                                            }
                                        }
                                        if(print_behavior)
                                            response+= response_behavior;
                                    }

                                    //FREQUENT FLYERS
                                    if(msg.result.response[i].hasOwnProperty('frequent_flyers') && msg.result.response[i].frequent_flyers.length > 0){
                                        if(product == 'airline' || product == 'cache' && document.URL.split('/')[document.URL.split('/').length-2] == 'passenger' && document.URL.split('/')[document.URL.split('/').length-3] == 'airline'){
                                            for(x in ff_request){
                                                if(ff_request[x].hasOwnProperty('error_code') == false){ // ff request error tidak di tampilkan
                                                    response += `
                                                        <div class="row">
                                                            <div class="col-lg-12">
                                                                <i class="fas fa-id-card"></i> <b>`+ff_request[x].program_name+` `+ff_request[x].sequence+`:</b><br/>
                                                            </div>
                                                            <div class="col-lg-12">
                                                                <select class="nice-select-default mb-2" id="frequent_flyer`+i+`_`+x+`" style="width: 100%; display: none;">
                                                                    <option value="">Frequent Flyer Program</option>`;
                                                                is_first_ff = true
                                                                for(y in ff_request[x].ff_availability){
                                                                    has_ff_number = false;
                                                                    for(j in msg.result.response[i].frequent_flyers){
                                                                        if(ff_request[x].ff_availability[y].ff_code == msg.result.response[i].frequent_flyers[j].ff_code){
                                                                            if(is_first_ff){
                                                                                response += `<option selected value="`+msg.result.response[i].frequent_flyers[j].ff_code+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`">`+ff_request[x].ff_availability[y].name+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`</option>`;
                                                                                is_first_ff = false;
                                                                            }else
                                                                                response += `<option value="`+msg.result.response[i].frequent_flyers[j].ff_code+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`">`+ff_request[x].ff_availability[y].name+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`</option>`;
                                                                            has_ff_number = true;
                                                                        }
                                                                    }
                                                                    if(!has_ff_number)
                                                                        response += `<option value="`+ff_request[x].ff_availability[y].ff_code+` - ">`+ff_request[x].ff_availability[y].name+` - Input new data</option>`;
                                                                }

                                                    response +=`
                                                                </select>
                                                            </div>
                                                        </div>`;
                                                }
                                            }
                                        }else if(product == 'cache'){
                                            response += `
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <i class="fas fa-id-card"></i> <b>Frequent Flyer Data:</b><br/>
                                                    </div>`;
                                            for(j in msg.result.response[i].frequent_flyers){
                                                for(x in frequent_flyer_data){
                                                    if(frequent_flyer_data[x].code == msg.result.response[i].frequent_flyers[j].ff_code){
                                                        response += `
                                                    <div class="col-lg-12">
                                                        <i style="word-break:break-word;">`+frequent_flyer_data[x].name+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`</i>
                                                    </div>`;
                                                        break;
                                                    }
                                                }
                                            }

                                            response +=`
                                                </div>`;
                                        }

                                    }

                                    if(msg.result.response[i].phones.length != 0){
                                        if(template == 1 || template == 5 || template == 6){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-mobile-alt"></i> <b>Mobile:</b>
                                                </div>
                                                <div class="col-lg-12">`;
                                        }
                                        else if(template == 2){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Mobile:</b>
                                                </div>
                                                <div class="col-lg-12">`;
                                        }
                                        else if(template == 3){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Mobile:</b>
                                                        <div class="default-select">`;
                                        }
                                        else if(template == 4){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Mobile:</b>
                                                </div>
                                                <div class="col-lg-12">
                                                    <div class="form-select">`;
                                        }
                                        response+=`<select class="phone_chosen_cls_search nice-select-default mb-1" id="phone_chosen`+i+`" style="width:100%;">`;
                                        for(j in msg.result.response[i].phones){
                                            response += `<option>`+msg.result.response[i].phones[j].calling_code+` - `+msg.result.response[i].phones[j].calling_number+`</option>`;
                                        }
                                        response+=`</select>`;

                                        if(template == 1 || template == 5 || template == 6){
                                            response+=`</div></div>`;
                                        }else if(template == 2){
                                            response+=`</div></div>`;
                                        }else if(template == 3){
                                            response+=`</div></div></div>`;
                                        }else if(template == 4){
                                            response+=`</div></div></div>`;
                                        }
                                    }
                                    else{
                                        response+=`<br/><i class="fas fa-mobile-alt"></i> <b>Mobile:</b> <i>not filled in</i>`;
                                    }
                                    response+=`
                                </div>

                                <div class="col-lg-12" style="border-top:1px solid #cdcdcd; padding-top:15px;">`;
                                    //default passport, kalau ada selection passport, ktp, sim print
                                    if(msg.result.response[i].identities.hasOwnProperty('passport') == true && found_selection == 0 || msg.result.response[i].identities.hasOwnProperty('passport') == true && found_selection.includes('passport') || msg.result.response[i].identities.hasOwnProperty('ktp') == true && found_selection.includes('ktp') || msg.result.response[i].identities.hasOwnProperty('sim') == true && found_selection.includes('sim') || product == 'cache' && Object.keys(msg.result.response[i].identities).length > 0){
                                        if(template == 1 || template == 5 || template == 6){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-id-card"></i> <b>Identity:</b>
                                                </div>
                                                <div class="col-lg-12 mb-1">`;
                                        }
                                        else if(template == 2){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-id-card" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Identity:</b>
                                                </div>
                                                <div class="col-lg-12">`;
                                        }
                                        else if(template == 3){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-id-card" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Identity:</b>
                                                        <div class="default-select">`;
                                        }
                                        else if(template == 4){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-id-card" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Identity:</b>
                                                </div>
                                                <div class="col-lg-12">
                                                    <div class="form-select">`;
                                        }

                                        if(product == 'cache'){
                                            response+=`<select class="phone_chosen_cls_search nice-select-default mb-2" id="identity_chosen`+i+`" onchange="generate_image_identity(`+i+`, 'identity_chosen', 'div_identity_chosen', 'label_title_identity', 'pax')" style="width:100%;">`;
                                            response += `<option value="all_identity">All Identity</option>`;
                                            //print semua yg ada cache
                                            for(j in msg.result.response[i].identities){
                                                if(j=='passport' || found_selection == 0 || found_selection.includes(j))
                                                    response += `<option value="`+j+` - `+msg.result.response[i].identities[j].identity_number+`">`+j.charAt(0).toUpperCase()+j.slice(1)+` - `+msg.result.response[i].identities[j].identity_number+`</option>`;
                                            }
                                        }
                                        else{
                                            //print sesuai yg ada pada pilihan
                                            if(found_selection.length > 0 || msg.result.response[i].identities.hasOwnProperty('passport')){
                                                response+=`<select class="phone_chosen_cls_search nice-select-default mb-2" id="identity_chosen`+i+`" onchange="generate_image_identity(`+i+`, 'identity_chosen', 'div_identity_chosen', 'label_title_identity', 'pax')" style="width:100%;">`;
                                                if(found_selection.length > 0){
                                                    for(x in found_selection){
                                                        identity_is_found = false;
                                                        for(j in msg.result.response[i].identities){
                                                            if(found_selection[x] == j){
                                                                response += `<option value="`+j+` - `+msg.result.response[i].identities[j].identity_number+`" selected>`+j.charAt(0).toUpperCase()+j.slice(1)+` - `+msg.result.response[i].identities[j].identity_number+`</option>`;
                                                                identity_is_found = true;
                                                            }
                                                        }
                                                        if(!identity_is_found){
                                                            response += `<option value="`+found_selection[x]+` - ">`+found_selection[x].charAt(0).toUpperCase()+found_selection[x].slice(1)+` - Input new data</option>`;
                                                        }
                                                    }
                                                }else if(msg.result.response[i].identities.hasOwnProperty('passport')){
                                                    response += `<option selected value="passport - `+msg.result.response[i].identities['passport'].identity_number+`">Passport - `+msg.result.response[i].identities['passport'].identity_number+`</option>`;
                                                }
                                            }
                                        }

            //                                                if(msg.result.response[i].identities.hasOwnProperty('passport') == true && found_selection == 0 || msg.result.response[i].identities.hasOwnProperty('passport') == true && found_selection.includes('passport'))
            //                                                    response += `<option value="passport - `+msg.result.response[i].identities.passport.identity_number+`">Passport - `+msg.result.response[i].identities.passport.identity_number+`</option>`;
            //                                                if(msg.result.response[i].identities.hasOwnProperty('ktp') == true && found_selection == 0 || msg.result.response[i].identities.hasOwnProperty('ktp') == true && found_selection.includes('ktp'))
            //                                                    response += `<option value="ktp - `+msg.result.response[i].identities.ktp.identity_number+`">KTP - `+msg.result.response[i].identities.ktp.identity_number+`</option>`;
            //                                                if(msg.result.response[i].identities.hasOwnProperty('sim') == true && found_selection == 0 || msg.result.response[i].identities.hasOwnProperty('sim') == true && found_selection.includes('sim'))
            //                                                    response += `<option value="sim - `+msg.result.response[i].identities.sim.identity_number+`">SIM - `+msg.result.response[i].identities.sim.identity_number+`</option>`;

                                        response+=`</select>`;

                                        if(template == 1 || template == 5 || template == 6){
                                            response+=`</div></div>`;
                                        }else if(template == 2){
                                            response+=`</div></div>`;
                                        }else if(template == 3){
                                            response+=`</div></div></div>`;
                                        }else if(template == 4){
                                            response+=`</div></div></div>`;
                                        }

                                        //identity cenius waktu search di passenger database done
                                        if(product == 'cache'){
                                            response+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;" id="label_title_identity`+i+`">All Identity Image</label><br/>`;
                                            response+=`
                                            <div class="col-lg-12" id="div_identity_chosen`+i+`" style="background:#f7f7f7; padding-top:15px; border:1px solid #cdcdcd; max-height:200px; overflow-x:auto; margin-bottom:15px;">`;
                                            check_identity_img = 0;
                                            for(j in msg.result.response[i].identities){
                                                if(msg.result.response[i].identities[j].identity_images.length != 0){
                                                    for(k in msg.result.response[i].identities[j].identity_images){
                                                        response += `
                                                        <div class="row">
                                                            <div class="col-lg-3 col-md-4 col-sm-4">
                                                                <a class="demo-img" href="`+msg.result.response[i].identities[j].identity_images[k][0]+`" data-jbox-image="2showidentity`+i+`allidentity`+for_jbox_image+`" title="`+j+` - `+msg.result.response[i].identities[j].identity_number+` (`+msg.result.response[i].identities[j].identity_images[k][2]+`)">
                                                                    <img src="`+msg.result.response[i].identities[j].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                                </a>
                                                            </div>
                                                            <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                                                <h6 class="mb-2">`+msg.result.response[i].identities[j].identity_images[k][2]+`</h6>
                                                                <b>Upload date:</b><br/>
                                                                <i>
                                                                    `+moment(msg.result.response[i].identities[j].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                                </i>
                                                            </div>
                                                            <div class="col-lg-12">
                                                                <br/>
                                                            </div>
                                                        </div>`;
                                                    }
                                                    check_identity_img = 1;
                                                }
                                            }

                                            if(check_identity_img == 0){
                                                response+=`
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <h6 class="pb-3">No Image!</h6>
                                                    </div>
                                                </div>`;
                                            }

                                            response+=`</div>`;
                                        }
                                        //identity cenius search passenger di halaman passenger done
                                        else{
                                            for(x in found_selection){
                                                identity_is_found = false;
                                                for(j in msg.result.response[i].identities){
                                                    if(j=='passport' || found_selection == 0 || found_selection.includes(j)){
                                                        response+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;" id="label_title_identity`+i+`">`+j.charAt(0).toUpperCase()+j.slice(1)+` - `+msg.result.response[i].identities[j].identity_number+` Image</label><br/>`;
                                                        identity_is_found = true;
                                                    }
                                                    break;
                                                }
                                                if(identity_is_found)
                                                    break;
                                            }
                                            response+=`<div class="col-lg-12" id="div_identity_chosen`+i+`" style="background:#f7f7f7; padding-top:15px; border:1px solid #cdcdcd; max-height:200px; overflow-x:auto; margin-bottom:15px;">`;

                                            check_identity_img = 0;
                                            for(j in msg.result.response[i].identities){
                                                if(j=='passport' || found_selection == 0 || found_selection.includes(j)){
                                                    if(msg.result.response[i].identities[j].identity_images.length != 0){
                                                        for(k in msg.result.response[i].identities[j].identity_images){
                                                            response += `
                                                            <div class="row">
                                                                <div class="col-lg-3 col-md-4 col-sm-4">
                                                                    <a class="demo-img" href="`+msg.result.response[i].identities[j].identity_images[k][0]+`" data-jbox-image="3showidentity`+i+`allidentity`+for_jbox_image+`" title="`+j+` - `+msg.result.response[i].identities[j].identity_number+` (`+msg.result.response[i].identities[j].identity_images[k][2]+`)">
                                                                        <img src="`+msg.result.response[i].identities[j].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                                    </a>
                                                                </div>
                                                                <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                                                    <h6 class="mb-2">`+msg.result.response[i].identities[j].identity_images[k][2]+`</h6>
                                                                    <b>Upload date:</b><br/>
                                                                    <i>
                                                                        `+moment(msg.result.response[i].identities[j].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                                    </i>
                                                                </div>
                                                                <div class="col-lg-12">
                                                                    <br/>
                                                                </div>
                                                            </div>`;
                                                        }
                                                        check_identity_img = 1;
                                                    }
                                                }
                                                break;
                                            }

                                            if(check_identity_img == 0){
                                                response+=`
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <div style="padding-bottom:15px;">
                                                            <h6>No Image!</h6>
                                                        </div>
                                                    </div>
                                                </div>`;
                                            }

                                            response+=`</div>`;

                                        }


                                    }
                                    else{
                                        response+=`<i class="fas fa-id-card"></i> <b>Identity:</b><br/>`;
                                        response+=`
                                        <div class="row mb-3">
                                            <div class="col-lg-12">
                                                <h6 class="mb-3">Identity not filled in</h6>
                                            </div>
                                        </div>`;
                                    }
                                response+=`
                                </div>
                            </div>`;
        //                            <td>`+msg.response.result[i].booker_type+`</td>
        //                            <td>Rp. `+getrupiah(msg.response.result[i].agent_id.credit_limit+ msg.response.result[i].agent_id.balance)+`</td>
                            response+=`
                            <div class="row">
                                <div class="col-lg-12" style="border-top:1px solid #cdcdcd; padding-top:15px;">
                                    <button type="button" class="primary-btn-custom" style="margin-bottom:0px; float:right;" onclick="pick_passenger('`+passenger+`',`+msg.result.response[i].sequence+`,'`+product+`');">Choose</button>
                                </div>
                            </div>`;
                        response+=`
                            </div>
                        </div>`;
                        counter_passenger_print++;
                    }
                }
        response+=`
            </div>
        </div>`;
        if(['passenger', 'adult', 'Adult', 'senior', 'Senior', 'child', 'Child', 'infant', 'Infant', ''].includes(passenger_type) || passenger_type.match('Adult') || passenger_type.match('Child'))
            document.getElementById('search_result_'+passenger+number).innerHTML = response;
        else if(product == 'get_booking_vendor'){
            document.getElementById('search_result_booker_vendor').innerHTML = response;
            document.getElementById('search_result_booker_vendor').hidden = false;
            document.getElementById('search_btn_click').disabled=false;

            //new cs
            //document.getElementById('retrieve_booking_from_vendor').hidden = false;
            //document.getElementById('hide_btn_click').hidden = false;
            //document.getElementById('retrieve_booking_from_vendor').hidden = false;
            document.getElementById('button_tl_getbooking_fv').innerHTML = `
            <button type="button" class="primary-btn-white" style="width:fit-content; float:left; display:block;" id="btn_back_get_booking_fv" onclick="next_prev_side_div('btn_back', 'btn_booker', 'div_booker', 'div_search', 'get_booking_fv'); default_filter_data();">
                <i class="fas fa-arrow-left"></i> Back
            </button>`;
            document.getElementById('div_booker_get_booking_fv').style.display = 'block';
            document.getElementById('overlay_box_gbv').style.pointerEvents = "unset";
            document.getElementById('close_gbv').style.pointerEvents = "unset";
            document.getElementById('div_search_get_booking_fv').style.display = 'none';
            document.getElementById('btn_booker_get_booking_fv').style.display = 'block';
            //new cs
        }else if(passenger == 'passenger'){
            document.getElementById('search_result_passenger'+number).innerHTML = response;
        }else if(passenger == 'contact')
            document.getElementById('search_result_contact').innerHTML = response;
        else
            document.getElementById('search_result').innerHTML = response;
        new jBox('Image', {
          imageCounter: true,
          imageCounterSeparator: ' of '
        });

        for(i in msg.result.response){
            add = false;
            is_same_mobile = false;
            is_same_email = false;
            is_same_identity_type = false;
            is_same_identity_number = false;
            if(mobile == '' && email == '' && identity_type == '' && identity_number == ''){
                add = true
            }
            if(add == false){
                if(mobile != ''){
                    for(j in msg.result.response[i].phones){
                        if(msg.result.response[i].phones[j].calling_number.match(mobile.filter)){
                            is_same_mobile = true;
                            break;
                        }
                    }
                }else{
                    is_same_mobile = true;
                }
                if(email != '' && msg.result.response[i].email.match(email.filter)){
                    is_same_email = true
                }else if(email == ''){
                    is_same_email = true
                }
                if(identity_type != ''){
                    if(identity_type == 'ktp'){
                        if(msg.result.response[i].identities.hasOwnProperty('ktp')){
                            if(identity_number != ''){
                                if(msg.result.response[i].identities.ktp.identity_number.match(identity_number.filter))
                                    is_same_identity_number = true;
                            }else{
                                is_same_identity_number = true;
                            }
                            is_same_identity_type = true;
                        }
                    }else if(identity_type == 'sim'){
                        if(msg.result.response[i].identities.hasOwnProperty('sim')){
                            if(identity_number != ''){
                                if(msg.result.response[i].identities.sim.identity_number.match(identity_number.filter))
                                    is_same_identity_number = true;
                            }else{
                                is_same_identity_number = true;
                            }
                            is_same_identity_type = true;
                        }
                    }else if(identity_type == 'passport'){
                        if(msg.result.response[i].identities.hasOwnProperty('passport')){
                            if(identity_number != ''){
                                if(msg.result.response[i].identities.passport.identity_number.match(identity_number.filter))
                                    is_same_identity_number = true;
                            }else{
                                is_same_identity_number = true;
                            }
                            is_same_identity_type = true;
                        }
                    }else if(identity_type == 'other'){
                        if(msg.result.response[i].identities.hasOwnProperty('other')){
                            if(identity_number != ''){
                                if(msg.result.response[i].identities.other.identity_number.match(identity_number.filter))
                                    is_same_identity_number = true;
                            }else{
                                is_same_identity_number = true;
                            }
                            is_same_identity_type = true;
                        }
                    }
                }else{
                    is_same_identity_type = true;
                    is_same_identity_number = true;
                }
                if(is_same_mobile == true && is_same_email == true && is_same_identity_type == true && is_same_identity_number == true)
                    add = true;
            }
            if(add){
                if(msg.result.response[i].customer_parents.length != 0){
                    response_corporate = '';
                    for(j in msg.result.response[i].customer_parents){
                        response_corporate+= "• <span style='color:"+color+";'>Corporate Booker</span><br/>" + msg.result.response[i].customer_parents[j].type + ' - ' + msg.result.response[i].customer_parents[j].name + ' <br/> ' + msg.result.response[i].customer_parents[j].currency + ' ' + getrupiah(msg.result.response[i].customer_parents[j].actual_balance) + '<br/>';
                    }

                    new jBox('Tooltip', {
                         attach: '#pop_corporate_detail'+i,
                         theme: 'TooltipBorder',
                         width: 280,
                         position: {
                           x: 'center',
                           y: 'bottom'
                         },
                         closeOnMouseleave: true,
                         animation: 'zoomIn',
                         content: response_corporate
                    });
                }

                if(msg.result.response[i].hasOwnProperty('behaviors') && Object.keys(msg.result.response[i].behaviors).length > 0){
                    print_pop_behavior = false;
                    response_pop_behavior = '';
                    for(j in msg.result.response[i].behaviors){
                        if(j.toLowerCase() == product || product == 'cache'){
                            print_pop_behavior = true;
                            response_pop_behavior+=`<b><i class="fas fa-angle-right"></i> `+j+`</b><br/>`;
                            response_pop_behavior+=`<span>`+msg.result.response[i].behaviors[j]+`</span><br/>`;
                        }
                    }
                    if(print_pop_behavior){
                        new jBox('Tooltip', {
                            attach: '#pop_behavior_detail'+i,
                            target: '#pop_behavior_detail'+i,
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
                            content: response_pop_behavior,
                            onOpen: function () {
                              this.source.addClass('active').html('Close <i class="fas fa-chevron-up"></i>');
                            },
                            onClose: function () {
                              this.source.removeClass('active').html('See Behaviors History <i class="fas fa-chevron-down"></i>');
                            }
                        });

                    }
                }
                if(msg.result.response[i].hasOwnProperty('frequent_flyers') && msg.result.response[i].frequent_flyers.length > 0){
                    if(product == 'airline' || product == 'cache' && document.URL.split('/')[document.URL.split('/').length-2] == 'passenger' && document.URL.split('/')[document.URL.split('/').length-3] == 'airline'){
                        for(x in ff_request){
                            $('#frequent_flyer'+i+'_'+x).niceSelect();
                        }
                    }
                }
            }
        }

        if(['passenger', 'adult', 'Adult', 'senior', 'Senior', 'child', 'Child', 'infant', 'Infant', ''].includes(passenger_type) || passenger_type.match('Adult') || passenger_type.match('Child')){
            if(counter_passenger_print != 0){
                document.getElementById('header_search_cache').innerHTML = `<div class="alert alert-success" role="alert" style="margin-top:10px; padding:15px;"><h6 id="header_search_cache"><i class="fas fa-search"></i> We found `+counter_passenger_print+` user(s) with name like " `+like_name_paxs+` "</h6></div>`;
            }else{
                document.getElementById('header_search_cache').innerHTML = `<div class="alert alert-danger" role="alert" style="margin-top:10px; padding:15px;"><h6 id="header_search_cache"><i class="fas fa-search"></i>Oops! User not found!</h6></div>`;
            }
            document.getElementById('identity_type_search_cache').value = identity_number;
            if(identity_type != '')
                document.getElementById('identity_type_search_cache').value = identity_type;
            $('.loading-pax-train').hide();
            $('.phone_chosen_cls_search').niceSelect();
            $('.phone_chosen_cls').niceSelect();
        }else{
            $('.loading-booker-train').hide();
            $('.phone_chosen_cls_search').niceSelect();

            if(product == 'group_booking'){
                if(passenger == 'contact'){
                    $('#loading_contact').hide();
                }else if(passenger == 'booker'){
                    $('#loading_booker').hide();
                }
            }

            $('.phone_chosen_cls').niceSelect();

            for(i in msg.result.response){
                if(msg.result.response[i].customer_parents.length != 0){
                    response_corporate = '';
                    for(j in msg.result.response[i].customer_parents){
                        response_corporate+= "• <span style='color:"+color+";'>Corporate Booker</span><br/>" + msg.result.response[i].customer_parents[j].type + ' - ' + msg.result.response[i].customer_parents[j].name + ' <br/> ' + msg.result.response[i].customer_parents[j].currency + ' ' + getrupiah(msg.result.response[i].customer_parents[j].actual_balance) + '<br/>';
                    }

                    new jBox('Tooltip', {
                         attach: '#pop_corporate_detail_paxs'+i,
                         theme: 'TooltipBorder',
                         width: 280,
                         position: {
                           x: 'center',
                           y: 'bottom'
                         },
                         closeOnMouseleave: true,
                         animation: 'zoomIn',
                         content: response_corporate
                    });
                }

                if(msg.result.response[i].hasOwnProperty('behaviors') && Object.keys(msg.result.response[i].behaviors).length > 0){
                    print_pop_behavior = false;
                    response_pop_behavior = '';
                    for(j in msg.result.response[i].behaviors){
                        if(j.toLowerCase() == product || product == 'cache'){
                            print_pop_behavior = true;
                            response_pop_behavior+=`<b><i class="fas fa-angle-right"></i> `+j+`</b><br/>`;
                            response_pop_behavior+=`<span>`+msg.result.response[i].behaviors[j]+`</span><br/>`;
                        }
                    }
                    if(print_pop_behavior){
                        new jBox('Tooltip', {
                            attach: '#pop_booker_behavior_detail'+i,
                            target: '#pop_booker_behavior_detail'+i,
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
                            content: response_pop_behavior,
                            onOpen: function () {
                              this.source.addClass('active').html('Close <i class="fas fa-chevron-up"></i>');
                            },
                            onClose: function () {
                              this.source.removeClass('active').html('See Behaviors History <i class="fas fa-chevron-down"></i>');
                            }
                        });
                    }
                }

                if(msg.result.response[i].hasOwnProperty('frequent_flyers') && msg.result.response[i].frequent_flyers.length > 0){
                    if(product == 'airline' || product == 'cache' && document.URL.split('/')[document.URL.split('/').length-2] == 'passenger' && document.URL.split('/')[document.URL.split('/').length-3] == 'airline'){
                        for(x in ff_request){
                            $('#frequent_flyer'+i+'_'+x).niceSelect();
                        }
                    }
                }
            }
        }
    }catch(err){console.log(err);}

    try{
        $('input[id="birth_date_search_cache"]').daterangepicker({
            parentEl: '#filter_parent_date',
            singleDatePicker: true,
            autoUpdateInput: true,
            maxDate: moment(),
            showDropdowns: true,
            opens: 'center',
            locale: {
                format: 'DD MMM YYYY',
            }
        });
        $('input[id="birth_date_search_cache"]').val(birth_date);
        $('input[id="birth_date_search_teropong"]').daterangepicker({
            parentEl: '#filter_parent_date',
            singleDatePicker: true,
            autoUpdateInput: true,
            maxDate: moment(),
            showDropdowns: true,
            opens: 'center',
            locale: {
                format: 'DD MMM YYYY',
            }
        });
        $('input[id="birth_date_search_teropong"]').val(birth_date);
    }catch(err){

    }
}

function get_customer_list(passenger, number, product){
    check = 0;
    for_jbox_image++;
    getToken();

    if(product != "get_booking_vendor"){
        clear_search_pax(passenger,number);
    }
    if(passenger == 'booker' || passenger == 'contact'){
        $('.loading-booker-train').show();

        if(product == 'group_booking'){
            if(passenger == 'contact'){
                $('#loading_contact').show();
            }else if(passenger == 'booker'){
                $('#loading_booker').show();
            }
        }

        var minAge = '';
        var maxAge = '';
        if(passenger == 'booker')
        {
            name = document.getElementById('train_booker_search').value;
            search_type = 'cust_name';
            if(document.getElementById('train_booker_search_type'))
            {
                search_type = document.getElementById('train_booker_search_type').value;
            }
        }
        else
        {
            name = document.getElementById('train_contact_search').value;
            search_type = 'cust_name';
            if(document.getElementById('train_contact_search_type'))
            {
                search_type = document.getElementById('train_contact_search_type').value;
            }
        }

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
                    'search_type': search_type,
                    'name': name,
                    'product': product,
                    'passenger_type': passenger,
                    'minAge': minAge,
                    'maxAge': maxAge,
                    'signature': signature
               },
               success: function(msg) {
                if(msg.result.error_code==0){
                    var response = '';
                    var like_name_booker = name;
                    if(msg.result.response.length != 0){
                        passenger_data = msg.result.response;
                        filter_search_passenger(passenger, '', product, false);

                        if(product == 'cache'){
                            document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                            document.getElementById('close_pdb').style.pointerEvents = "unset";
                        }else{
                            search_modal_pe_unset();
                        }
                    }else{
                        response = '';
                        response+=`<div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search-minus"></i> Oops! User not found!</h6></div>`;
                        if(product == 'get_booking_vendor'){
                            //new cs
                            document.getElementById('button_tl_getbooking_fv').innerHTML = `
                            <button type="button" class="primary-btn-white" style="width:fit-content; float:left; display:block;" id="btn_back_get_booking_fv" onclick="next_prev_side_div('btn_back', 'btn_booker', 'div_booker', 'div_search', 'get_booking_fv'); default_filter_data();">
                                <i class="fas fa-arrow-left"></i> Back
                            </button>`;
                            document.getElementById('div_booker_get_booking_fv').style.display = 'block';
                            document.getElementById('div_search_get_booking_fv').style.display = 'none';
                            document.getElementById('btn_booker_get_booking_fv').style.display = 'block';
                            document.getElementById('overlay_box_gbv').style.pointerEvents = "unset";
                            document.getElementById('close_gbv').style.pointerEvents = "unset";
                            //new cs

                            document.getElementById('search_result_booker_vendor').innerHTML = response;
                            document.getElementById('search_result_booker_vendor').hidden = false;
                            document.getElementById('search_btn_click').disabled=false;
                        }else if(passenger == 'passenger'){
                            document.getElementById('search_result_passenger').innerHTML = response;
                        }
                        else{
                            document.getElementById('search_result').innerHTML = response;
                        }
                        $('.loading-booker-train').hide();
                        if(product == 'cache'){
                            document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                            document.getElementById('close_pdb').style.pointerEvents = "unset";
                        }else{
                            search_modal_pe_unset();
                        }

                        if(product == 'group_booking'){
                            if(passenger == 'contact'){
                                $('#loading_contact').hide();
                            }else if(passenger == 'booker'){
                                $('#loading_booker').hide();
                            }
                        }
                        $('.phone_chosen_cls').niceSelect();
                        for(i in msg.result.response){
                            if(msg.result.response[i].customer_parents.length != 0){
                                response_corporate = '';
                                for(j in msg.result.response[i].customer_parents){
                                    response_corporate+= "• <span style='color:"+color+";'>Corporate Booker</span><br/>" + msg.result.response[i].customer_parents[j].type + ' - ' + msg.result.response[i].customer_parents[j].name + ' <br/> ' + msg.result.response[i].customer_parents[j].currency + ' ' + getrupiah(msg.result.response[i].customer_parents[j].actual_balance) + '<br/>';
                                }

                                new jBox('Tooltip', {
                                     attach: '#pop_corporate_detail_paxs'+i,
                                     theme: 'TooltipBorder',
                                     width: 280,
                                     position: {
                                       x: 'center',
                                       y: 'bottom'
                                     },
                                     closeOnMouseleave: true,
                                     animation: 'zoomIn',
                                     content: response_corporate
                                });
                            }
                        }
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                    $('.loading-booker-train').hide();
                    if(product == 'group_booking'){
                        if(passenger == 'contact'){
                            $('#loading_contact').hide();
                        }else if(passenger == 'booker'){
                            $('#loading_booker').hide();
                        }
                    }
                    if(product == 'cache'){
                        document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                        document.getElementById('close_pdb').style.pointerEvents = "unset";
                    }else{
                        search_modal_pe_unset();
                    }
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error customer list </span>' + msg.result.error_msg,
                    })

                    $('.loading-booker-train').hide();
                    if(product == 'group_booking'){
                        if(passenger == 'contact'){
                            $('#loading_contact').hide();
                        }else if(passenger == 'booker'){
                            $('#loading_booker').hide();
                        }
                    }

                    if(product == 'cache'){
                        document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                        document.getElementById('close_pdb').style.pointerEvents = "unset";
                    }else{
                        search_modal_pe_unset();
                    }
                }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error customer list');
                    $('.loading-booker-train').hide();
                    if(product == 'group_booking'){
                        if(passenger == 'contact'){
                            $('#loading_contact').hide();
                        }else if(passenger == 'booker'){
                            $('#loading_booker').hide();
                        }
                    }
               },timeout: 60000
            });
        }
        else{
            $('.loading-booker-train').hide();
            if(product == 'group_booking'){
                if(passenger == 'contact'){
                    $('#loading_contact').hide();
                }else if(passenger == 'booker'){
                    $('#loading_booker').hide();
                }
            }
            response = '';
            response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-times-circle"></i> Please input more than 1 letter!</h6></div></center>`;
            try{
                if(product != 'get_booking_from_vendor'){
                    document.getElementById('search_result').innerHTML = response;
                }
            }catch(err){
                console.log(err); // kalau tidak ada element search_result
                try{
                    document.getElementById('search_result_passenger').innerHTML = response;
                    document.getElementById('search_btn_click').disabled=false;
                }catch(err){
                    console.log(err); // error kalau tidak ada element search_result_passenger / search_btn_click bisa diabaikan
                }
            }
        }
    }
    else{
        $(".loading-pax-train").show();
        var name = '';

        if(passenger == 'passenger'){
            name = document.getElementById('train_passenger'+number+'_search').value;
            search_type = 'cust_name';
            if(document.getElementById('train_passenger'+number+'_search_type'))
            {
                search_type = document.getElementById('train_passenger'+number+'_search_type').value;
            }
        }
        else{
            name = document.getElementById('train_'+passenger+number+'_search').value;
            search_type = 'cust_name';
            if(document.getElementById('train_'+passenger+number+'_search_type'))
            {
                search_type = document.getElementById('train_'+passenger+number+'_search_type').value;
            }
        }
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
                    'search_type': search_type,
                    'name': name,
                    'product': product,
                    'passenger_type': passenger,
                    'minAge': minAge,
                    'maxAge': maxAge,
                    'signature': signature,
                    'departure_date': typeof(departure_date) !== 'undefined' ? departure_date : ''
               },
               success: function(msg) {
                if(check == 1)
                    passenger = '';
                if(msg.result.error_code==0){
                    passenger_data = msg.result.response;
                    filter_search_passenger(passenger, number, product, false);
                    if(product == 'cache'){
                        document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                        document.getElementById('close_pdb').style.pointerEvents = "unset";
                    }else{
                        search_modal_pe_unset();
                    }

                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                    $('.loading-pax-train').hide();
                    if(product == 'cache'){
                        document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                        document.getElementById('close_pdb').style.pointerEvents = "unset";
                    }else{
                        search_modal_pe_unset();
                    }
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error customer list </span>' + msg.result.error_msg,
                    })
                   $('.loading-pax-train').hide();
                   if(product == 'cache'){
                       document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                       document.getElementById('close_pdb').style.pointerEvents = "unset";
                   }else{
                       search_modal_pe_unset();
                   }

                }

               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error customer list');
                    $('.loading-pax-train').hide();
                    if(product == 'cache'){
                        document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                        document.getElementById('close_pdb').style.pointerEvents = "unset";
                    }else{
                        search_modal_pe_unset();
                    }
               },timeout: 60000
            });
        }
        else{
            $('.loading-pax-train').hide();
            response = '';
            response+=`<center><div class="alert alert-danger" role="alert" style="margin-top:10px;"><h6><i class="fas fa-times-circle"></i> Please input more than 1 letter!</h6></div></center>`;
            document.getElementById('search_result_'+passenger+number).innerHTML = response;

            if(product == 'cache'){
                document.getElementById('overlay_box_pdb').style.pointerEvents = "unset";
                document.getElementById('close_pdb').style.pointerEvents = "unset";
            }else{
                search_modal_pe_unset();
            }
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
    }catch(err){
        console.log(err); // error kalau tidak ada button buat copy passenger jadi skip
    }
}

function id_type_change(type, sequence){
    if(document.getElementById(type+'_id_type'+sequence).value == 'ktp'){
        document.getElementById('adult_passport_number_required'+sequence).style.color = 'white';
        document.getElementById('adult_country_of_issued_required'+sequence+'_id').style.color = 'red';
    }else if(document.getElementById(type+'_id_type'+sequence).value == ''){
        document.getElementById('adult_passport_number_required'+sequence).style.color = 'white';
        document.getElementById('adult_country_of_issued_required'+sequence+'_id').style.color = 'white';
    }else{
        document.getElementById('adult_passport_number_required'+sequence).style.color = 'red';
        document.getElementById('adult_country_of_issued_required'+sequence+'_id').style.color = 'red';
    }
}

function pick_passenger(type, sequence, product){
    var selection = null;
    var need_identity = null;
    try{
        selection = document.getElementById(type+'_id_type'+passenger_number).options;
    }catch(err){
        console.log(err); //error kalau tidak ada identities di backend
    }
    try{
        need_identity = document.getElementById('adult_identity_div1').style.display;
    }catch(err){
        console.log(err); //error kalau tidak ada required identity di html (jadi tidak required)
    }
    var choose_identity = null;
    try{
        choose_identity = document.getElementById('identity_chosen'+sequence).value;
    }catch(err){
        console.log(err); //error kalau tidak ada identities di backend
    }
    if(choose_identity == null){
        pick_passenger_copy(type, sequence, product, '');
    }else{
        pick_passenger_copy(type, sequence, product, choose_identity.split(' - ')[0]);
    }
//    if(selection != null && Object.keys(passenger_data[sequence].identities).length > 1 && need_identity != 'none'){
//        var found_selection = [];
//        for(i in selection){
//            for(j in passenger_data[sequence].identities){
//                if(selection[i].value == j){
//                    found_selection.push(selection[i].value);
//                    break;
//                }
//            }
//        }
//        console.log(found_selection);
//        if(found_selection.length == 1){
//            pick_passenger_copy(type, sequence, product, found_selection[0]);
//        }else{
//            text = '<br/><select id="found_selection" class="nice-select-default">';
//            for(i in found_selection)
//                text += `<option value=`+found_selection[i]+`>`+found_selection[i]+`</option>`;
//            text += '</select>';
//            Swal.fire({
//              type: 'info',
//              title: 'Pick Identity to Copy ' + type + ' ' + passenger_number,
//              showCancelButton: true,
//              showConfirmButton: true,
//              showCloseButton: true,
//              confirmButtonText:'Copy',
//              cancelButtonText:'Cancel',
//
//              html: text
//            }).then((result) => {
//              if (result.value) {
//                pick_passenger_copy(type,sequence,product,document.getElementById('found_selection').value);
//              }
//            });
//        }
//    }else{
//        pick_passenger_copy(type, sequence, product, '');
//    }
}

function pick_passenger_copy(type, sequence, product, identity=''){
    for_jbox_image++;
    if(product == 'cache'){
        add_passenger_cache(sequence)
//        document.getElementById('button_choose_'+sequence).innerHTML = 'Chosen';
        document.getElementById('search_result_passenger').innerHTML = '';
        document.getElementById('train_passenger_search').value = '';
        if(document.getElementById('train_passenger_search_type'))
        {
            document.getElementById('train_passenger_search_type').value = 'cust_name';
        }
    }
    else if(product == 'get_booking_vendor'){
        //hide_result_booker_vendor();
        //document.getElementById('hide_btn_click').hidden = true;
        next_prev_side_div('btn_back', 'btn_booker', 'div_booker', 'div_search', 'get_booking_fv');
        default_filter_data();

        document.getElementById('booker_vendor').value = passenger_data[sequence].title + ' ' + passenger_data[sequence].first_name + ' ' + passenger_data[sequence].last_name;
        document.getElementById('booker_vendor_id').value = passenger_data[sequence].seq_id;
        document.getElementById('booker_div').hidden = false;
        document.getElementById('clear_booker_booking_from_vendor_id').hidden = false;
        document.getElementById('clear_booker_booking_div').hidden = false;
        document.getElementById('search_booker_booking_from_vendor').hidden = true;
        //document.getElementById('hide_btn_click').hidden = false;

        document.getElementById('search_btn_click').hidden = true;
        document.getElementById('btn_booker_get_booking_fv').style.display = 'block';
        document.getElementById('retrieve_booking_from_vendor').hidden = false;

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
    }
    else if(type == '' || product == 'issued_offline' || product == 'group_booking'){

        if(product == 'issued_offline' || product == 'group_booking'){
            clear_btn_top('booker', '');
            clear_search_pax('booker','');
        }
        else if(product == 'issued_booking'){
            clear_btn_top('', passenger_number);
            clear_search_pax('', passenger_number);
        }

        if(['Booker', 'Contact', 'booker', 'contact'].includes(type)){
            try{
                document.getElementById('contact_person').value = passenger_data[sequence].title + ' ' + passenger_data[sequence].first_name + ' ' + passenger_data[sequence].last_name;
                document.getElementById('contact_id').value = passenger_data[sequence].seq_id;
            }catch(err){console.log(err);}
            if(['Booker','booker'].includes(type)){
                try{
                    document.getElementsByName('radio_booker')[1].checked = true;
                    radio_button('booker');
                }catch(err){console.log(err);}
            }else if(['Contact','contact'].includes(type)){
                try{
                    document.getElementsByName('radio_contact')[1].checked = true;
                    radio_button('contact');
                }catch(err){console.log(err);}
            }
            //$('#myModal').modal('hide');
        }
        else if(product == 'medical'){
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
                if(passenger_data[sequence].nationality_name != ''){
                    $('#adult_nationality'+passenger_number+'_id').val(passenger_data[sequence].nationality_name).trigger('change');
                    $('#adult_nationality'+passenger_number+'_id').select2({"disabled":true});
                }
                document.getElementById('adult_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
                if(passenger_data[sequence].identities.hasOwnProperty('ktp') == true){
                    document.getElementById('adult_identity_type'+passenger_number).value = 'ktp';
                    $('#adult_identity_type'+passenger_number).niceSelect('update');
                    document.getElementById('adult_identity_number'+passenger_number).value = passenger_data[sequence].identities.ktp.identity_number;
                    if(passenger_data[sequence].identities.ktp.identity_country_of_issued_name != '' && passenger_data[sequence].identities.ktp.identity_country_of_issued_name != undefined){
                        document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.ktp.identity_country_of_issued_name;
                        document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.ktp.identity_country_of_issued_name;
                        auto_complete('adult_country_of_issued'+passenger_number);
                        document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                    }
                }else if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                    document.getElementById('adult_identity_type'+passenger_number).value = 'passport';
                    $('#adult_identity_type'+passenger_number).niceSelect('update');
                    document.getElementById('adult_identity_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
                    if(passenger_data[sequence].identities.passport.identity_expdate)
                        document.getElementById('adult_identity_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                    if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
                        document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                        auto_complete('adult_country_of_issued'+passenger_number);
                        document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                    }
                }
                    //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
                if(document.getElementById('adult_email'+passenger_number))
                    document.getElementById('adult_email'+passenger_number).value = passenger_data[sequence].email;
                try{
                    var phone = document.getElementById('phone_chosen'+sequence).value;
                    document.getElementById('adult_phone_code'+passenger_number).value = phone.split(' - ')[0];
                    document.getElementById('select2-adult_phone_code'+passenger_number+'_id-container').value = phone.split(' - ')[0];
                    document.getElementById('adult_phone'+passenger_number).value = phone.split(' - ')[1] != undefined ? phone.split(' - ')[1] : ''; // kalau undefined tidak di copy
                }catch(err){
                    console.log(err);
                }
                document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].seq_id;
    //            document.getElementById('pax_type'+sequence).innerHTML = passenger_data[sequence].pax_type;
//                document.getElementById('radio_passenger_input'+passenger_number).checked = true;
                $("#myModal_"+passenger_number).modal('hide');
                clear_btn_top('', passenger_number);
                clear_search_pax('', passenger_number);

                radio_button('passenger',passenger_number);
                document.getElementById('search_result_'+passenger_number).innerHTML = '';
                update_contact('passenger',passenger_number);
                set_exp_identity(passenger_number)
            }
            else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: "You can't choose same person in 1 booking",
                })
            }
            passenger_number--;
            //$('#myModalPassenger'+parseInt(passenger_number-1)).modal('hide');
        }
        else{

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

            if(passenger_data[sequence].face_image.length > 0){
                text = '';
                text += `
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                            <img src="`+passenger_data[sequence].face_image[0]+`" alt="User" class="picture_passenger_agent">
                        </div>
                    </div>
                `;
                if(document.getElementById('adult_div_avatar'+passenger_number)){
                    document.getElementById('adult_div_avatar'+passenger_number).innerHTML = text
                    document.getElementById('adult_div_avatar'+passenger_number).hidden = false;
                }
            }else{
                if(document.getElementById('adult_div_avatar'+passenger_number))
                    document.getElementById('adult_div_avatar'+passenger_number).hidden = true;
            }

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
            try{
                document.getElementById('adult_behaviors'+passenger_number).value = JSON.stringify(passenger_data[sequence].behaviors);
                //belum semua product di tambahkan
            }catch(err){console.log(err);}
//            capitalizeInput('adult_first_name'+passenger_number);
//            passenger_data[sequence].first_name = document.getElementById('adult_first_name'+passenger_number).value;
//            capitalizeInput('adult_last_name'+passenger_number);
//            passenger_data[sequence].last_name = document.getElementById('adult_last_name'+passenger_number).value;

            document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            if(passenger_data[sequence].nationality_name != ''){
                $('#adult_nationality'+passenger_number+'_id').val(passenger_data[sequence].nationality_name).trigger('change');
                $('#adult_nationality'+passenger_number+'_id').select2({"disabled":true});
//                document.getElementById('select2-adult_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
//                document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
            }
            document.getElementById('adult_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
            if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
                if(document.getElementById('adult_identity_type'+passenger_number)){
                    document.getElementById('adult_identity_type'+passenger_number).value = 'passport';
                    $('#adult_identity_type'+passenger_number).niceSelect('update');
                }
                document.getElementById('adult_identity_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
                if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
                    document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                    document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                    auto_complete('adult_country_of_issued'+passenger_number);
                    document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
                    if(passenger_data[sequence].identities['passport'].identity_images.length > 0){
                        text = '';
                        //identity cenius? done
                        text += `
                            <div class="row">
                                <div class="col-lg-12">`;
                                    text+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;">Passport - `+passenger_data[sequence].identities['passport'].identity_number+`</label><br/>`;
                                    text+=`
                                    <div style="width:100%; margin-bottom:15px; display:inline-flex; overflow-x: auto; white-space: nowrap;">`;
                                    for(j in passenger_data[sequence].identities['passport'].identity_images){
                                        text += `
                                        <div style="width:220px; text-align:center; margin:0px 10px 10px 10px;">
                                            <a class="demo-img" href="`+passenger_data[sequence].identities['passport'].identity_images[j][0]+`" data-jbox-image="4showidentitycopypassport`+sequence+``+for_jbox_image+`" title="passport - `+passenger_data[sequence].identities['passport'].identity_number+` (`+passenger_data[sequence].identities['passport'].identity_images[j][2]+`)">
                                                <img src="`+passenger_data[sequence].identities['passport'].identity_images[j][0]+`" alt="Identity" class="picture_identity_customer">
                                            </a><br/>
                                            <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+passenger_data[sequence].identities['passport'].identity_images[j][2]+`</h6>
                                            <i>
                                                Upload date<br/>
                                                `+moment(passenger_data[sequence].identities['passport'].identity_images[j][3]).format('DD MMM YYYY - HH:mm')+`
                                            </i>
                                        </div>`;
                                    }
                                    text+=`</div>`;
                                text+=`
                                </div>
                            </div>
                        `;
                        if(document.getElementById('adult_attachment_identity'+passenger_number)){
                            text_attachment= '';
                            for(j in passenger_data[sequence].identities['passport'].identity_images){
                                text_attachment += `
                                    <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                                        <img src="`+passenger_data[sequence].identities['passport'].identity_images[j][0]+`" alt="Passenger" value="`+passenger_data[sequence].identities['passport'].identity_images[j][1]+`" style="height:220px;width:auto" />

                                        <div class="row" style="justify-content:space-around">
                                            <div class="checkbox" style="display: block;">
                                                <label class="check_box_custom">
                                                    <span style="font-size:13px;">Delete</span>
                                                    <input type="checkbox" value="" id="adult_identity`+passenger_number+`_`+j+`_delete" name="adult_identity`+passenger_number+`_delete">
                                                    <input type="hidden" value="`+passenger_data[sequence].identities['passport'].identity_images[j][1]+`" id="adult_identity`+passenger_number+`_`+j+`_image_seq_id" name="adult_identity`+passenger_number+`_`+j+`_image_seq_id">
                                                    <span class="check_box_span_custom"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>`;
                            }
                            document.getElementById('adult_attachment_identity'+passenger_number).innerHTML = text_attachment;
                        }

                        if(document.getElementById('adult_div_avatar_identity'+passenger_number)){
                            document.getElementById('adult_div_avatar_identity'+passenger_number).innerHTML = text
                            document.getElementById('adult_div_avatar_identity'+passenger_number).hidden = false;
                            new jBox('Image', {
                              imageCounter: true,
                              imageCounterSeparator: ' of '
                            });
                        }
                    }else{
                        if(document.getElementById('adult_div_avatar_identity'+passenger_number))
                            document.getElementById('adult_div_avatar_identity'+passenger_number).hidden = true;
                    }
                }
                if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
                    document.getElementById('adult_identity_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                }
            }
                //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
            if(document.getElementById('adult_email'+passenger_number))
                document.getElementById('adult_email'+passenger_number).value = passenger_data[sequence].email;
            if(document.getElementById('adult_id'+passenger_number))
                document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].seq_id;

            try{
                var phone = document.getElementById('phone_chosen'+sequence).value;
                document.getElementById(passenger_pick+'_phone_code'+passenger_pick_number).value = phone.split(' - ')[0];
                document.getElementById(passenger_pick+'_phone'+passenger_pick_number).value = phone.split(' - ')[1] != undefined ? phone.split(' - ')[1] : ''; // kalau undefined tidak di copy
            }catch(err){

            }

//            document.getElementById('pax_type'+sequence).innerHTML = passenger_data[sequence].pax_type;
            document.getElementById('search_result_'+type+passenger_number).innerHTML = '';
            update_contact('passenger',passenger_number);
            document.getElementsByName('radio_passenger'+passenger_number)[1].checked = true;
            radio_button('passenger',passenger_number);
//            $('#myModalPassenger'+parseInt(passenger_number-1)).modal('hide');
        }
    }
    else{
        // ISI PAX
        try{
            // IDENTITY
            if(['Booker','booker'].includes(type) == false){
                var need_identity = null;
                try{
                    need_identity = document.getElementById('adult_identity_div1').style.display;
                }catch(err){
                    console.log(err); // kalau required ada di html, kalau tidak default tidak required
                }
                // IDENTITY GLOBAL FOR adult, child, infant, senior
                try{
                    var radios = document.getElementById(type+'_id_type'+passenger_number).options;
                }catch(err){console.log(err)}
                try{
                    if(typeof radios === 'undefined')
                        var radios = document.getElementById(type+'_identity_type'+passenger_number).options;
                }catch(err){console.log(err)}
                var date1 = null;
                var date2 = null;
                var expired = null;
                var identity_check = true;
                var new_identity = true;
                if(need_identity != 'none'){
                    if(typeof radios !== 'undefined'){
                        for(i in passenger_data[sequence].identities){
                            if(passenger_data[sequence].identities[i].identity_expdate){
                                date1 = moment(passenger_data[sequence].identities[i].identity_expdate);
                                date2 = moment();
                                expired = date2.diff(date1, 'days');
                            }
                            for (var j = 0, length = radios.length; j < length; j++) {
                                if(expired == null || expired < -1){
                                    if (radios[j].value == i && identity == '' || radios[j].value == i && identity == i) {
                                        new_identity = false;
                                        identity_check = false;
                                        try{//kalau ada identity type
                                            document.getElementById(type+'_id_type'+passenger_number).value = i;
                                            $('#'+type+'_id_type'+passenger_number).niceSelect('update');
                                        }catch(err){console.log(err)}
                                        try{ //kalau ada identity number
                                            if(passenger_data[sequence].identities[i].identity_number != ''){
                                                document.getElementById(type+'_passport_number'+passenger_number).value = passenger_data[sequence].identities[i].identity_number;
                                            }
                                        }catch(err){console.log(err)}
                                        try{ //kalau ada expire date
                                            if(passenger_data[sequence].identities[i].identity_expdate != '' && passenger_data[sequence].identities[i].identity_expdate != undefined)
                                                document.getElementById(type+'_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities[i].identity_expdate;
                                        }catch(err){console.log(err)}
                                        try{ //kalau ada country of issued
                                            if(passenger_data[sequence].identities[i].identity_country_of_issued_name != ''){
                                                document.getElementById('select2-'+type+'_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities[i].identity_country_of_issued_name;
                                                document.getElementById(type+'_country_of_issued'+passenger_number).value = passenger_data[sequence].identities[i].identity_country_of_issued_name;
                                                auto_complete(type+'_country_of_issued'+passenger_number);
                                            }
                                        }catch(err){console.log(err)}
                                        if(passenger_data[sequence].identities[i].identity_images.length > 0){
                                            text = '';
                                            //identity cenius (waktu choose passenger langsung saat search + muncul di formny) done
                                            text += `
                                                <div class="row">
                                                    <div class="col-lg-12">`;
                                                        text+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;">`+i+` - `+passenger_data[sequence].identities[i].identity_number+`</label><br/>`;
                                                        text+=`
                                                        <div class="row" style="padding:15px;">
                                                            <div class="col-lg-12" style="background:#f7f7f7; padding-top:15px; border:1px solid #cdcdcd; max-height:200px; overflow-x:auto; margin-bottom:15px;">`;
                                                                for(k in passenger_data[sequence].identities[i].identity_images){
                                                                    text += `
                                                                    <div class="row">
                                                                        <div class="col-lg-3 col-md-4 col-sm-4">
                                                                            <a class="demo-img" href="`+passenger_data[sequence].identities[i].identity_images[k][0]+`" data-jbox-image="5showidentity`+sequence+``+i+``+for_jbox_image+`" title="`+i+` - `+passenger_data[sequence].identities[i].identity_number+` (`+passenger_data[sequence].identities[i].identity_images[k][2]+`)">
                                                                                <img src="`+passenger_data[sequence].identities[i].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                                            </a>
                                                                        </div>
                                                                        <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                                                            <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+passenger_data[sequence].identities[i].identity_images[k][2]+`</h6>
                                                                            <b>Upload date:</b><br/>
                                                                            <i>
                                                                                `+moment(passenger_data[sequence].identities[i].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                                            </i>
                                                                        </div>
                                                                        <div class="col-lg-12">
                                                                            <br/>
                                                                        </div>
                                                                    </div>`;
                                                                }
                                                            text+=`
                                                            </div>
                                                        </div>`;
                                                    text+=`
                                                    </div>
                                                </div>
                                            `;

                                            if(document.getElementById(type+'_attachment_identity'+passenger_number)){
                                                text_attachment= '';
                                                for(k in passenger_data[sequence].identities[i].identity_images){
                                                    text_attachment += `
                                                        <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                                                            <img src="`+passenger_data[sequence].identities[i].identity_images[k][0]+`" alt="Passenger" value="`+passenger_data[sequence].identities[i].identity_images[k][1]+`" style="height:220px;width:auto" />

                                                            <div class="row" style="justify-content:space-around">
                                                                <div class="checkbox" style="display: block;">
                                                                    <label class="check_box_custom">
                                                                        <span style="font-size:13px;">Delete</span>
                                                                        <input type="checkbox" value="" id="`+type+`_identity`+passenger_number+`_`+k+`_delete" name="`+type+`_identity`+passenger_number+`_delete">
                                                                        <input type="hidden" value="`+passenger_data[sequence].identities[i].identity_images[k][1]+`" id="`+type+`_identity`+passenger_number+`_`+k+`_image_seq_id" name="`+type+`_identity`+passenger_number+`_`+k+`_image_seq_id">
                                                                        <span class="check_box_span_custom"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>`;
                                                }
                                                document.getElementById(type+'_attachment_identity'+passenger_number).innerHTML = text_attachment;
                                            }

                                            if(document.getElementById(type+'_div_avatar_identity'+passenger_number)){
                                                document.getElementById(type+'_div_avatar_identity'+passenger_number).innerHTML = text
                                                document.getElementById(type+'_div_avatar_identity'+passenger_number).hidden = false;
                                                new jBox('Image', {
                                                  imageCounter: true,
                                                  imageCounterSeparator: ' of '
                                                });
                                            }
                                        }else{
                                            if(document.getElementById(type+'_div_avatar_identity'+passenger_number))
                                                document.getElementById(type+'_div_avatar_identity'+passenger_number).hidden = true;
                                        }
                                        //notif passport krng dari 6 bulan
                                        if(expired != null){
                                            if(expired > -180){
                                                Swal.fire({
                                                  type: 'warning',
                                                  title: 'Oops!',
                                                  html: '<span style="color: #ff9900;">'+identity+' expired date less then 6 months </span>' ,
                                                })
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            date1 = null;
                            date2 = null;
                            expired = null;
                        }
                        try{
                            change_identity_type(type+`_id_type`+passenger_number, false);
                        }catch(err){
                            console.log(err); //tidak ada identity type
                        }
                        if(new_identity){
                            identity_check = false;
                            try{//kalau ada identity type
                                document.getElementById(type+'_id_type'+passenger_number).value = identity;
                                $('#'+type+'_id_type'+passenger_number).niceSelect('update');
                            }catch(err){console.log(err)}
                        }

                    }else{
                        //passport
                        try{// kalau ada input identity
                            var date1 = moment(passenger_data[sequence].identities.passport.identity_expdate);
                            var date2 = moment();
                            var expired = date2.diff(date1, 'days');
                            if(expired < -180){
                                identity_check = false;
                                if(document.getElementById(type+'_identity_type'+passenger_number)){
                                    document.getElementById(type+'_identity_type'+passenger_number).value = 'passport';
                                    $('#'+type+'_identity_type'+passenger_number).niceSelect('update');
                                }
                                document.getElementById(type+'_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
                                if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
                                    document.getElementById('select2-'+type+'_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                                    document.getElementById(type+'_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
                                    auto_complete(type+'_country_of_issued'+passenger_number);
                                }
                                if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
                                    document.getElementById(type+'_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
                                }
                                if(passenger_data[sequence].identities['passport'].identity_images.length > 0){
                                    text = '';
                                    //identity cenius only passport (waktu choose passenger langsung saat search + muncul di formny) done
                                    text += `
                                        <div class="row">
                                            <div class="col-lg-12">`;
                                                text+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;">Passport - `+passenger_data[sequence].identities['passport'].identity_number+`</label><br/>`;
                                                text+=`
                                                <div style="width:100%; margin-bottom:15px; display:inline-flex; overflow-x: auto; white-space: nowrap;">`;
                                                for(k in passenger_data[sequence].identities['passport'].identity_images){
                                                    text += `
                                                    <div style="width:220px; text-align:center; margin:0px 10px 10px 10px;">
                                                        <a class="demo-img" href="`+passenger_data[sequence].identities['passport'].identity_images[k][0]+`" data-jbox-image="6showidentitypassport`+sequence+`passport`+for_jbox_image+`" title="passport - `+passenger_data[sequence].identities['passport'].identity_number+` (`+passenger_data[sequence].identities['passport'].identity_images[k][2]+`)">
                                                            <img src="`+passenger_data[sequence].identities['passport'].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                        </a><br/>
                                                        <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+passenger_data[sequence].identities['passport'].identity_images[k][2]+`</h6>
                                                        <i>
                                                            Upload date<br/>
                                                            `+moment(passenger_data[sequence].identities['passport'].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                        </i>
                                                    </div>`;
                                                }
                                                text+=`</div>`;
                                            text+=`
                                            </div>
                                        </div>
                                    `;
                                    console.log(text);
                                    if(document.getElementById(type+'_attachment_identity'+passenger_number)){
                                        text_attachment= '';
                                        for(k in passenger_data[sequence].identities['passport'].identity_images){
                                            text_attachment += `
                                                <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                                                    <img src="`+passenger_data[sequence].identities['passport'].identity_images[k][0]+`" alt="Passenger" value="`+passenger_data[sequence].identities['passport'].identity_images[k][1]+`" style="height:220px;width:auto" />

                                                    <div class="row" style="justify-content:space-around">
                                                        <div class="checkbox" style="display: block;">
                                                            <label class="check_box_custom">
                                                                <span style="font-size:13px;">Delete</span>
                                                                <input type="checkbox" value="" id="`+type+`_identity`+passenger_number+`_delete" name="`+type+`_identity`+passenger_number+`_delete">
                                                                <span class="check_box_span_custom"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>`;
                                        }
                                        document.getElementById(type+'_attachment_identity'+passenger_number).innerHTML = text_attachment;
                                    }
                                    if(document.getElementById(type+'_div_avatar_identity'+passenger_number)){
                                        document.getElementById(type+'_div_avatar_identity'+passenger_number).innerHTML = text
                                        document.getElementById(type+'_div_avatar_identity'+passenger_number).hidden = false;
                                        new jBox('Image', {
                                          imageCounter: true,
                                          imageCounterSeparator: ' of '
                                        });
                                    }
                                }else{
                                    if(document.getElementById(type+'_div_avatar_identity'+passenger_number))
                                        document.getElementById(type+'_div_avatar_identity'+passenger_number).hidden = true;
                                }
                            }
                        }catch(err){
                            console.log(err); //tidak ada selection buat identity di product type
                        }
                    }
                    if(identity_check){
                        //notif error
                        try{
                            document.getElementById(type+'_identity_msg_error'+passenger_number).innerHTML = 'Identity already expired';
                        }catch(err){
                            console.log(err);
                        }
                    }else{
                        try{
                            document.getElementById(type+'_identity_msg_error'+passenger_number).innerHTML = '';
                        }catch(err){
                            console.log(err);
                        }
                        //identity copy
                        if(document.getElementById(type+'_id_type'+passenger_number))
                            change_identity_type(type+`_id_type`+passenger_number, false);
                        else if(document.getElementById(type+'_identity_type'+passenger_number))
                            change_identity_type(type+`_identity_type`+passenger_number, false);
                    }
                }
            }

            // UNTUK INSURANCE KARENA ADA FAMILY, BENEFICIARY
            if(type.includes('Adult') || type.includes('Child') || type.includes('adult') || type.includes('child')){
                //for insurance additional_data teropong
                if(document.getElementById(type+'_id'+passenger_number).value == ''){
                    check = 0;
                    for(i in passenger_data_pick){
                        if(passenger_data_pick[i].seq_id == passenger_data[sequence].seq_id && passenger_data_pick[i].sequence != 'booker')
                            check = 1;
                    }
                    if(check == 0){
                        for(i in passenger_data_pick){
                            if(passenger_data_pick[i].sequence == 'relation'+passenger_number){
                                passenger_data_pick.splice(i,1);
                                break;
                            }
                        }
                        if(passenger_data[sequence].face_image.length > 0){
                            text = '';
                            text += `
                                <div class="row">
                                    <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                                        <img src="`+passenger_data[sequence].face_image[0]+`" alt="User" class="picture_passenger_agent">
                                    </div>
                                </div>
                            `;
                            if(document.getElementById(type+'_div_avatar'+passenger_number)){
                                document.getElementById(type+'_div_avatar'+passenger_number).innerHTML = text
                                document.getElementById(type+'_div_avatar'+passenger_number).hidden = false;
                            }
                        }else{
                            if(document.getElementById(type+'_div_avatar'+passenger_number))
                                document.getElementById(type+'_div_avatar'+passenger_number).hidden = true;
                        }
                        document.getElementById(type+'_title'+passenger_number).value = passenger_data[sequence].title;
                        for(i in document.getElementById(type+'_title'+passenger_number).options){
                            document.getElementById(type+'_title'+passenger_number).options[i].disabled = false;
                        }
                        for(i in document.getElementById(type+'_title'+passenger_number).options){
                            if(document.getElementById(type+'_title'+passenger_number).options[i].selected != true)
                                document.getElementById(type+'_title'+passenger_number).options[i].disabled = true;
                        }
                        $('#'+type+'_title'+passenger_number).niceSelect('update');

                        document.getElementById(type+'_first_name'+passenger_number).value = passenger_data[sequence].first_name;
                        document.getElementById(type+'_first_name'+passenger_number).readOnly = true;
                        document.getElementById(type+'_last_name'+passenger_number).value = passenger_data[sequence].last_name;
                        document.getElementById(type+'_last_name'+passenger_number).readOnly = true;
                        try{
                            document.getElementById(type+'_behaviors'+passenger_number).value = JSON.stringify(passenger_data[sequence].behaviors);
                            //belum semua product di tambahkan
                        }catch(err){console.log(err);}
    //                    document.getElementById(type+'_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;

        //                capitalizeInput('adult_first_name'+passenger_number);
        //                passenger_data[sequence].first_name = document.getElementById('adult_first_name'+passenger_number).value;
        //                capitalizeInput('adult_last_name'+passenger_number);
        //                passenger_data[sequence].last_name = document.getElementById('adult_last_name'+passenger_number).value;

                        if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                            $('#'+type+'_nationality'+passenger_number+'_id').val(passenger_data[sequence].nationality_name).trigger('change');
                            $('#'+type+'_nationality'+passenger_number+'_id').select2({"disabled":true});
    //                        document.getElementById('select2-'+type+'_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
    //                        document.getElementById(type+'_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        }
                        document.getElementById(type+'_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
                        if(product == 'airline'){
                            //add frequent flyer
                            try{
                                if(typeof ff_request !== 'undefined'){
                                    index_ff = 1;
                                    for(x in ff_request){
                                        try{
                                            if(document.getElementById('frequent_flyer'+sequence+'_'+x).value != ''){
                                                $("#"+type+"_ff_request"+passenger_number+"_"+index_ff+"_id").select2().val(document.getElementById("frequent_flyer"+sequence+"_"+x).value.split(' - ')[0]).trigger('change');
                                                document.getElementById('adult_ff_number'+passenger_number+'_'+index_ff).value = document.getElementById('frequent_flyer'+sequence+'_'+x).value.split(' - ')[1];
                                            }
                                        }catch(err){console.log(err)}
                                        index_ff++;
                                    }
                                }
                            }catch(err){console.log(err);}
                        }
                        if(document.getElementById(type+'_email'+passenger_number))
                            document.getElementById(type+'_email'+passenger_number).value = passenger_data[sequence].email;
                        try{
                            var phone = document.getElementById('phone_chosen'+sequence).value;
                            document.getElementById(passenger_pick+'_phone_code'+passenger_number).value = phone.split(' - ')[0];
                            document.getElementById(passenger_pick+'_phone'+passenger_number).value = phone.split(' - ')[1] != undefined ? phone.split(' - ')[1] : ''; // jika undefined tidak di copy
                            document.getElementById('select2-'+type+'_phone_code'+passenger_number+'_id-container').innerHTML = phone.split(' - ')[0];
                        }catch(err){
                            console.log(err);
                        }
                        passenger_data_pick.push(passenger_data[sequence]);
                        if(type.includes('Adult') || type.includes('adult'))
                            passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult'+passenger_number;
                        else
                            passenger_data_pick[passenger_data_pick.length-1].sequence = 'child'+passenger_number;
                        document.getElementById(type+'_id'+passenger_number).value = passenger_data[sequence].seq_id;
                        auto_complete(type+'_nationality'+passenger_number);

                        try{
                            var phone = document.getElementById('phone_chosen'+sequence).value;
                            document.getElementById(type+'_phone_code'+passenger_number).value = phone.split(' - ')[0];
                            document.getElementById(type+'_phone'+passenger_number).value = phone.split(' - ')[1] != undefined ? phone.split(' - ')[1] : ''; // kalau undefined tidak di copy
                        }catch(err){
                            console.log(err);
                        }

            //            if (document.getElementById("default-select")) {
            //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
            //                $('#adult_nationality1_id').niceSelect('update');
            //            };
                        $('#'+type+'_nationality'+passenger_number+'_id').niceSelect('update');
                        $('#'+type+'_country_of_issued'+passenger_number).niceSelect('update');
                        $('#myModal_'+type+passenger_number).modal('hide');
                        document.getElementById('train_'+type+passenger_number+'_search').value = '';
                        document.getElementById('search_result_'+type+passenger_number).innerHTML = '';
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

            // ALL PRODUCT
            else if(['Adult','adult'].includes(type)){
                if(document.getElementById('adult_id'+passenger_number).value == ''){
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
                        if(passenger_data[sequence].face_image.length > 0){
                            text = '';
                            text += `
                                <div class="row">
                                    <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                                        <img src="`+passenger_data[sequence].face_image[0]+`" alt="User" class="picture_passenger_agent">
                                    </div>
                                </div>
                            `;
                            if(document.getElementById('adult_div_avatar'+passenger_number)){
                                document.getElementById('adult_div_avatar'+passenger_number).innerHTML = text
                                document.getElementById('adult_div_avatar'+passenger_number).hidden = false;
                            }
                        }else{
                            if(document.getElementById('adult_div_avatar'+passenger_number))
                                document.getElementById('adult_div_avatar'+passenger_number).hidden = true;
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
                        try{
                            document.getElementById('adult_behaviors'+passenger_number).value = JSON.stringify(passenger_data[sequence].behaviors);
                            //belum semua product di tambahkan
                        }catch(err){console.log(err);}

        //                capitalizeInput('adult_first_name'+passenger_number);
        //                passenger_data[sequence].first_name = document.getElementById('adult_first_name'+passenger_number).value;
        //                capitalizeInput('adult_last_name'+passenger_number);
        //                passenger_data[sequence].last_name = document.getElementById('adult_last_name'+passenger_number).value;

    //                    document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                            $('#adult_nationality'+passenger_number+'_id').val(passenger_data[sequence].nationality_name).trigger('change');
                            $('#adult_nationality'+passenger_number+'_id').select2({"disabled":true});
    //                        document.getElementById('select2-adult_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
    //                        document.getElementById('adult_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        }
                        document.getElementById('adult_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
    //                    if(product=='airline' || product == 'activity' || product == 'visa' || product == 'tour'){
    //                        if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
    //                            var date1 = moment(passenger_data[sequence].identities.passport.identity_expdate);
    //                            var date2 = moment();
    //                            var expired = date2.diff(date1, 'days');
    //                            if(expired < -180){
    //                                document.getElementById('adult_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
    //                                document.getElementById('adult_passport_number'+passenger_number).readOnly = true;
    //                                if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
    //                                    document.getElementById('select2-adult_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                                    document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                                    auto_complete('adult_country_of_issued'+passenger_number);
    //                                    document.getElementById('adult_country_of_issued'+passenger_number).readOnly = true;
    //                                    try{ //yg ada id_type di update
    //                                        document.getElementById('adult_id_type'+passenger_number).value = 'passport';
    //                                        $('#adult_id_type'+passenger_number).niceSelect('update');
    //                                    }catch(err){}
    //                                }
    //                                if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
    //                                    document.getElementById('adult_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
    //                                }
    //                            }
    //                        }
    //                        //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
    //                    }
                        passenger_data_pick.push(passenger_data[sequence]);
                        passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult'+passenger_number;
                        document.getElementById('adult_id'+passenger_number).value = passenger_data[sequence].seq_id;
                        if(document.getElementById('adult_passport_passport_number'+passenger_number)){
                            if(passenger_data[sequence].hasOwnProperty('identities') && passenger_data[sequence]['identities'].hasOwnProperty('passport')){
                                document.getElementById('adult_passport_passport_number'+passenger_number).value = passenger_data[sequence]['identities']['passport'].identity_number;
                                document.getElementById('adult_passport_passport_expired_date'+passenger_number).value = passenger_data[sequence]['identities']['passport'].identity_expdate;
                                $('#adult_passport_passport_country_of_issued'+passenger_number+'_id').val(passenger_data[sequence]['identities']['passport'].identity_country_of_issued_name).trigger('change');
                            }
                        }
                        auto_complete('adult_nationality'+passenger_number);
            //            if (document.getElementById("default-select")) {
            //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
            //                $('#adult_nationality1_id').niceSelect('update');
            //            };
                        if(product == 'airline'){
                            //add frequent flyer
                            try{
                                if(typeof ff_request !== 'undefined'){
                                    index_ff = 1;
                                    for(x in ff_request){
                                        try{
                                            if(document.getElementById('frequent_flyer'+sequence+'_'+x).value != ''){
                                                $("#adult_ff_request"+passenger_number+"_"+index_ff+"_id").select2().val(document.getElementById("frequent_flyer"+sequence+"_"+x).value.split(' - ')[0]).trigger('change');
                                                document.getElementById('adult_ff_number'+passenger_number+'_'+index_ff).value = document.getElementById('frequent_flyer'+sequence+'_'+x).value.split(' - ')[1];
                                            }
                                        }catch(err){console.log(err)}
                                        index_ff++;
                                    }
                                }
                            }catch(err){console.log(err);}
                        }

                        if(document.getElementById('adult_email'+passenger_number))
                            document.getElementById('adult_email'+passenger_number).value = passenger_data[sequence].email;

                        try{
                            var phone = document.getElementById('phone_chosen'+sequence).value;
                            document.getElementById('adult_phone_code'+passenger_number).value = phone.split(' - ')[0];
                            document.getElementById('adult_phone'+passenger_number).value = phone.split(' - ')[1] != undefined ? phone.split(' - ')[1] : ''; // kalau undefined tidak di copy
                        }catch(err){
                            console.log(err);
                        }

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
            }
            else if(['Child','child'].includes(type)){
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
                        if(passenger_data[sequence].face_image.length > 0){
                            text = '';
                            text += `
                                <div class="row">
                                    <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                                        <img src="`+passenger_data[sequence].face_image[0]+`" alt="User" class="picture_passenger_agent">
                                    </div>
                                </div>
                            `;
                            if(document.getElementById('child_div_avatar'+passenger_number)){
                                document.getElementById('child_div_avatar'+passenger_number).innerHTML = text
                                document.getElementById('child_div_avatar'+passenger_number).hidden = false;
                            }
                        }else{
                            if(document.getElementById('child_div_avatar'+passenger_number))
                                document.getElementById('child_div_avatar'+passenger_number).hidden = true;
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
                        try{
                            document.getElementById('child_behaviors'+passenger_number).value = JSON.stringify(passenger_data[sequence].behaviors);
                            //belum semua product di tambahkan
                        }catch(err){console.log(err);}

        //                capitalizeInput('child_first_name'+passenger_number);
        //                passenger_data[sequence].first_name = document.getElementById('child_first_name'+passenger_number).value;
        //                capitalizeInput('child_last_name'+passenger_number);
        //                passenger_data[sequence].last_name = document.getElementById('child_last_name'+passenger_number).value;

    //                    document.getElementById('child_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                            $('#child_nationality'+passenger_number+'_id').val(passenger_data[sequence].nationality_name).trigger('change');
                            $('#child_nationality'+passenger_number+'_id').select2({"disabled":true});
    //                        document.getElementById('select2-child_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
    //                        document.getElementById('child_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        }
                        document.getElementById('child_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
    //                    if(product=='airline' || product == 'activity' || product == 'visa' || product == 'tour'){
    //                        if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
    //                            var date1 = moment(passenger_data[sequence].identities.passport.identity_expdate);
    //                            var date2 = moment();
    //                            var expired = date2.diff(date1, 'days');
    //                            if(expired < -180){
    //                                document.getElementById('child_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
    //                                document.getElementById('child_passport_number'+passenger_number).readOnly = true;
    //                                if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
    //                                    document.getElementById('select2-child_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                                    document.getElementById('child_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                                    auto_complete('child_country_of_issued'+passenger_number);
    //                                    document.getElementById('child_country_of_issued'+passenger_number).readOnly = true;
    //                                    try{ //yg ada id_type di update
    //                                        document.getElementById('child_id_type'+passenger_number).value = 'passport';
    //                                        $('#child_id_type'+passenger_number).niceSelect('update');
    //                                    }catch(err){}
    //                                }
    //                                if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
    //                                    document.getElementById('child_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
    //                                }
    //                            }
    //                        }
    //                        //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
    //                    }
                        passenger_data_pick.push(passenger_data[sequence]);
                        passenger_data_pick[passenger_data_pick.length-1].sequence = 'child'+passenger_number;
                        document.getElementById('child_id'+passenger_number).value = passenger_data[sequence].seq_id;
                        auto_complete('child_nationality'+passenger_number);
            //            if (document.getElementById("default-select")) {
            //                $('#adult_nationality'+passenger_number+'_id').niceSelect('update');
            //                $('#adult_nationality1_id').niceSelect('update');
            //            };
                        if(product == 'airline'){
                            //add frequent flyer
                            try{
                                if(typeof ff_request !== 'undefined'){
                                    index_ff = 1;
                                    for(x in ff_request){
                                        try{
                                            if(document.getElementById('frequent_flyer'+sequence+'_'+x).value != ''){
                                                $("#child_ff_request"+passenger_number+"_"+index_ff+"_id").select2().val(document.getElementById("frequent_flyer"+sequence+"_"+x).value.split(' - ')[0]).trigger('change');
                                                document.getElementById('child_ff_number'+passenger_number+'_'+index_ff).value = document.getElementById('frequent_flyer'+sequence+'_'+x).value.split(' - ')[1];
                                            }
                                        }catch(err){console.log(err)}
                                        index_ff++;
                                    }
                                }
                            }catch(err){console.log(err);}
                        }
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
            }
            else if(['Infant','infant'].includes(type)){
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
                        if(passenger_data[sequence].face_image.length > 0){
                            text = '';
                            text += `
                                <div class="row">
                                    <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                                        <img src="`+passenger_data[sequence].face_image[0]+`" alt="User" class="picture_passenger_agent">
                                    </div>
                                </div>
                            `;
                            if(document.getElementById('infant_div_avatar'+passenger_number)){
                                document.getElementById('infant_div_avatar'+passenger_number).innerHTML = text
                                document.getElementById('infant_div_avatar'+passenger_number).hidden = false;
                            }
                        }else{
                            if(document.getElementById('infant_div_avatar'+passenger_number))
                                document.getElementById('infant_div_avatar'+passenger_number).hidden = true;
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
                        try{
                            document.getElementById('infant_behaviors'+passenger_number).value = JSON.stringify(passenger_data[sequence].behaviors);
                            //belum semua product di tambahkan
                        }catch(err){console.log(err);}
        //                capitalizeInput('infant_first_name'+passenger_number);
        //                passenger_data[sequence].first_name = document.getElementById('infant_first_name'+passenger_number).value;
        //                capitalizeInput('infant_last_name'+passenger_number);
        //                passenger_data[sequence].last_name = document.getElementById('infant_last_name'+passenger_number).value;

    //                    document.getElementById('infant_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                            $('#infant_nationality'+passenger_number+'_id').val(passenger_data[sequence].nationality_name).trigger('change');
                            $('#infant_nationality'+passenger_number+'_id').select2({"disabled":true});
    //                        document.getElementById('select2-infant_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
    //                        document.getElementById('infant_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        }
                        document.getElementById('infant_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
    //                    if(product=='airline' || product == 'activity' || product == 'visa' || product == 'tour'){
    //                        if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
    //                            var date1 = moment(passenger_data[sequence].identities.passport.identity_expdate);
    //                            var date2 = moment();
    //                            var expired = date2.diff(date1, 'days');
    //                            if(expired < -180){
    //                                document.getElementById('infant_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
    //                                document.getElementById('infant_passport_number'+passenger_number).readOnly = true;
    //                                if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
    //                                    document.getElementById('select2-infant_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                                    document.getElementById('infant_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                                    auto_complete('infant_country_of_issued'+passenger_number);
    //                                    document.getElementById('infant_country_of_issued'+passenger_number).readOnly = true;
    //                                }
    //                                if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
    //                                    document.getElementById('infant_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
    //                                }
    //                            }
    //                        }
    //                        //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
    //                    }
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
            }
            else if(['Senior','senior'].includes(type)){
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
                        if(passenger_data[sequence].face_image.length > 0){
                            text = '';
                            text += `
                                <div class="row">
                                    <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                                        <img src="`+passenger_data[sequence].face_image[0]+`" alt="User" class="picture_passenger_agent">
                                    </div>
                                </div>
                            `;
                            if(document.getElementById('senior_div_avatar'+passenger_number)){
                                document.getElementById('senior_div_avatar'+passenger_number).innerHTML = text
                                document.getElementById('senior_div_avatar'+passenger_number).hidden = false;
                            }
                        }else{
                            if(document.getElementById('senior_div_avatar'+passenger_number))
                                document.getElementById('senior_div_avatar'+passenger_number).hidden = true;
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
                        try{
                            document.getElementById('senior_behaviors'+passenger_number).value = JSON.stringify(passenger_data[sequence].behaviors);
                            //belum semua product di tambahkan
                        }catch(err){console.log(err);}
        //                capitalizeInput('senior_first_name'+passenger_number);
        //                passenger_data[sequence].first_name = document.getElementById('senior_first_name'+passenger_number).value;
        //                capitalizeInput('senior_last_name'+passenger_number);
        //                passenger_data[sequence].last_name = document.getElementById('senior_last_name'+passenger_number).value;

    //                    document.getElementById('senior_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        if(passenger_data[sequence].nationality_name != '' && passenger_data[sequence].nationality_name != ''){
                            $('#senior_nationality'+passenger_number+'_id').val(passenger_data[sequence].nationality_name).trigger('change');
                            $('#senior_nationality'+passenger_number+'_id').select2({"disabled":true});
    //                        document.getElementById('select2-senior_nationality'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].nationality_name;
    //                        document.getElementById('senior_nationality'+passenger_number).value = passenger_data[sequence].nationality_name;
                        }
                        document.getElementById('senior_birth_date'+passenger_number).value = passenger_data[sequence].birth_date;
                        check_years_old(passenger_number,'senior');
                //        if(parseInt(document.getElementById('infant_years_old'+passenger_number).value) >= 17){
                //            if(product=='train'){//ganti
                ////                document.getElementById('adult_id_type'+passenger_number).value = passenger_data[sequence].identity_type;
                ////                document.getElementById('adult_id_number'+passenger_number).value = passenger_data[sequence].identity_number;
                //            }
                //        }
    //                    if(product=='airline' || product == 'activity'){
    //                        if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
    //                            document.getElementById('senior_passport_number'+passenger_number).value = passenger_data[sequence].identities.passport.identity_number;
    //                            document.getElementById('senior_passport_number'+passenger_number).readOnly = true;
    //                            if(passenger_data[sequence].identities.passport.identity_country_of_issued_name != '' && passenger_data[sequence].identities.passport.identity_country_of_issued_name != undefined){
    //                                document.getElementById('select2-senior_country_of_issued'+passenger_number+'_id-container').innerHTML = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                                document.getElementById('senior_country_of_issued'+passenger_number).value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                                auto_complete('senior_country_of_issued'+passenger_number);
    //                                document.getElementById('senior_country_of_issued'+passenger_number).readOnly = true;
    //                            }
    //                            if(passenger_data[sequence].identities.passport.identity_expdate != '' && passenger_data[sequence].identities.passport.identity_expdate != undefined){
    //                                document.getElementById('senior_passport_expired_date'+passenger_number).value = passenger_data[sequence].identities.passport.identity_expdate;
    //                            }
    //                        }
    //                        //document.getElementById('adult_country_of_issued'+passenger_number).value = passenger_data[sequence].country_of_issued_id.code;
    //                    }
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
        }catch(err){
            console.log(err);
        }
    }

    if(product != 'get_booking_vendor'){
        // BOOKER
        if(['Booker','booker'].includes(type)){
            //change booker
            check = 0;
            if(check == 0){
                if(document.getElementById('train_booker_search'))
                    document.getElementById('train_booker_search').value = '';
                if(document.getElementById('train_booker_search_type'))
                {
                    document.getElementById('train_booker_search_type').value = 'cust_name';
                }
                try{
                    if(document.getElementsByName('myRadios')[0].checked == true){
                        clear_passenger('Adult',1);
                        document.getElementsByName('myRadios')[1].checked = true;
                    }
                }catch(err){
                    console.log(err); //error kalau tidak ada radio copy booker
                }

                for(i in passenger_data_pick){
                    if(passenger_data_pick[i].sequence == 'booker'){
                        passenger_data_pick.splice(i,1);
                        break;
                    }
                }
                data_booker = passenger_data[sequence];

                if(data_booker.hasOwnProperty('frequent_flyers') && data_booker.frequent_flyers.length > 0){
                    if(product == 'airline' || product == 'cache' && document.URL.split('/')[document.URL.split('/').length-2] == 'passenger' && document.URL.split('/')[document.URL.split('/').length-3] == 'airline'){
                        try{
                            if(typeof ff_request !== 'undefined'){
                                data_booker['frequent_flyer_list'] = [];
                                for(x in ff_request){
                                    if(ff_request[x].hasOwnProperty('error_code') == false){
                                        try{
                                            data_booker['frequent_flyer_list'].push({
                                                "ff_code": document.getElementById('frequent_flyer'+sequence+'_'+x).value.split(' - ')[0],
                                                "ff_number": document.getElementById('frequent_flyer'+sequence+'_'+x).value.split(' - ')[1]
                                            })
                                        }catch(err){console.log(err);}
                                    }else{
                                        // default kalau ff error agar sesuai dengan code di tampilan
                                        data_booker['frequent_flyer_list'].push({
                                            "ff_code": '',
                                            "ff_number": ''
                                        })
                                    }
                                }
                            }
                        }catch(err){
                            console.log(err);
                        }
                    }
                }
                if(passenger_data[sequence].face_image.length > 0){
                    text = '';
                    text += `
                        <div class="row">
                            <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                                <img src="`+passenger_data[sequence].face_image[0]+`" alt="User" class="picture_passenger_agent">
                            </div>
                        </div>
                    `;
                    if(document.getElementById('booker_div_avatar')){
                        document.getElementById('booker_div_avatar').innerHTML = text
                        document.getElementById('booker_div_avatar').hidden = false;
                    }
                }else{
                    if(document.getElementById('booker_div_avatar'))
                        document.getElementById('booker_div_avatar').hidden = true;
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
                try{
                    //belum smua product di tambahkan
                    document.getElementById('booker_behaviors').value = JSON.stringify(passenger_data[sequence].behaviors);
                }catch(err){}

    //            capitalizeInput('booker_first_name');
    //            passenger_data[sequence].first_name = document.getElementById('booker_first_name').value;
    //            capitalizeInput('booker_last_name');
    //            passenger_data[sequence].last_name = document.getElementById('booker_last_name').value;

                if(passenger_data[sequence].nationality_name != ''){
                    $('#booker_nationality_id').val(passenger_data[sequence].nationality_name).trigger('change');
                    $('#booker_nationality_id').select2({"disabled":true});
                }
                document.getElementById('booker_email').value = passenger_data[sequence].email;
                try{
                    var phone = document.getElementById('phone_chosen'+sequence).value;
                    if(phone != false){
                        document.getElementById('booker_phone_code').value = phone.split(' - ')[0];
                        document.getElementById('select2-booker_phone_code_id-container').innerHTML = phone.split(' - ')[0];
                        document.getElementById('booker_phone').value = phone.split(' - ')[1] != undefined ? phone.split(' - ')[1] : ''; // kalau undefined tidak di copy
                    }
                }catch(err){
                    try{ //ambil paling pertama untuk cor por
                        document.getElementById('booker_phone_code').value = passenger_data[sequence].phones[0].calling_code;
                        document.getElementById('select2-booker_phone_code_id-container').innerHTML = passenger_data[sequence].phones[0].calling_code;
                        document.getElementById('booker_phone').value = passenger_data[sequence].phones[0].calling_number;
                    }catch(err){
                        console.log(err); //tidak ada phone number yg di pilih / belum ada data
                    }
                }
                document.getElementById('booker_birth_date').value = passenger_data[sequence].birth_date;
                document.getElementById('booker_birth_date').readOnly = true;

                temp_data = '';
                var index = 0;
                for(i in passenger_data[sequence].identities){
                    if(index != 0)
                        temp_data += '~';
                    temp_data += i + ',' + passenger_data[sequence].identities[i].identity_number + ',' + passenger_data[sequence].identities[i].identity_country_of_issued_name + ',' + passenger_data[sequence].identities[i].identity_expdate;
                    index++;
                }
                document.getElementById('booker_id_number').value = temp_data;
    //                if(product == 'issued_offline'){
    //                    for(i in passenger_data[sequence].identities){
    //                        document.getElementById('booker_id_type').value = i;
    //                        document.getElementById('booker_id_type').readOnly = true;
    //                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities[i].identity_number;
    //                        document.getElementById('booker_id_number').readOnly = true;
    //                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities[i].identity_country_of_issued_name;
    //                        document.getElementById('booker_country_of_issued').readOnly = true;
    //                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities[i].identity_expdate;
    //                        document.getElementById('booker_exp_date').readOnly = true;
    //                        break;
    //                    }
    //                }else if(product == 'train'){
    //                    for(i in passenger_data[sequence].identities){
    //                        document.getElementById('booker_id_type').value = i;
    //                        document.getElementById('booker_id_type').readOnly = true;
    //                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities[i].identity_number;
    //                        document.getElementById('booker_id_number').readOnly = true;
    //                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities[i].identity_country_of_issued_name;
    //                        document.getElementById('booker_country_of_issued').readOnly = true;
    //                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities[i].identity_expdate;
    //                        document.getElementById('booker_exp_date').readOnly = true;
    //                        break;
    //                    }
    //
    //                }else if(product == 'airline' || product == 'visa' || product == 'activity' || product == 'tour'){
    //                    if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
    //
    //                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities.passport.identity_number;
    //                        document.getElementById('booker_id_number').readOnly = true;
    //                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                        document.getElementById('booker_country_of_issued').readOnly = true;
    //                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities.passport.identity_expdate;
    //                        document.getElementById('booker_exp_date').readOnly = true;
    //                        try{
    //                            document.getElementById('booker_id_type').value = 'passport';
    //                            document.getElementById('booker_id_type').readOnly = true;
    //                        }catch(err){}
    //                    }
    //                }
                //$("#corporate_booker").attr('data-tooltip', '');
                document.getElementById('corporate_booker').style.display = 'none';
                if(passenger_data[sequence].customer_parents.length != 0){
                    corporate_booker_temp = ''
                    for(j in passenger_data[sequence].customer_parents){
                        corporate_booker_temp += passenger_data[sequence].customer_parents[j].name + ' ' + passenger_data[sequence].customer_parents[j].currency + ' ' + getrupiah(passenger_data[sequence].customer_parents[j].actual_balance) + '\n';
                    }
                    //$("#corporate_booker").attr('data-tooltip', corporate_booker_temp);
                    document.getElementById('corporate_booker').style.display = 'block';

                    new jBox('Tooltip', {
                        attach: '#corporate_booker',
                        theme: 'TooltipBorder',
                        width: 280,
                        position: {
                          x: 'center',
                          y: 'bottom'
                        },
                        closeOnMouseleave: true,
                        animation: 'zoomIn',
                        content: corporate_booker_temp
                    });
                }
                auto_complete('booker_nationality');
                document.getElementById('booker_id').value = passenger_data[sequence].seq_id;
                //untuk booker check
                passenger_data_pick.push(passenger_data[sequence]);
                passenger_data_pick[passenger_data_pick.length-1].sequence = 'booker';
                if(['issued_offline', 'group_booking'].includes(product) ==  false)
                    $('#myModal').modal('hide');
                document.getElementById('search_result').innerHTML = '';
            }
            else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: "You can't choose same person in 1 booking",
                })
            }
        }
        // CONTACT
        else if(['Contact','contact'].includes(type)){
            //change booker
            clear_btn_top('contact', '');
            clear_search_pax('contact','');

            check = 0;
            if(check == 0){
                document.getElementById('train_contact_search').value = '';
                for(i in passenger_data_pick){
                    if(passenger_data_pick[i].sequence == 'contact'){
                        passenger_data_pick.splice(i,1);
                        break;
                    }
                }
                document.getElementById('contact_title').value = passenger_data[sequence].title;
                for(j in document.getElementById('contact_title').options){
                    document.getElementById('contact_title').options[j].disabled = false;
                }
                for(j in document.getElementById('contact_title').options){
                    if(document.getElementById('contact_title').options[j].selected != true)
                       document.getElementById('contact_title').options[j].disabled = true;
                }
                $('#contact_title').niceSelect('update');
                document.getElementById('contact_first_name').value = passenger_data[sequence].first_name;
                document.getElementById('contact_first_name').readOnly = true;
                document.getElementById('contact_last_name').value = passenger_data[sequence].last_name;
                document.getElementById('contact_last_name').readOnly = true;

    //            capitalizeInput('booker_first_name');
    //            passenger_data[sequence].first_name = document.getElementById('booker_first_name').value;
    //            capitalizeInput('booker_last_name');
    //            passenger_data[sequence].last_name = document.getElementById('booker_last_name').value;

                if(passenger_data[sequence].nationality_name != ''){
                    $('#contact_nationality_id').val(passenger_data[sequence].nationality_name).trigger('change');
                    $('#contact_nationality_id').select2({"disabled":true});
    //                    document.getElementById('select2-contact_nationality_id-container').innerHTML = passenger_data[sequence].nationality_name;
    //                    document.getElementById('contact_nationality').value = passenger_data[sequence].nationality_name;
    //                    document.getElementById('contact_nationality_id').disabled = true;
                }
                document.getElementById('contact_email').value = passenger_data[sequence].email;
                try{
                    var phone = document.getElementById('phone_chosen'+sequence).value;
                    if(phone != false){
                        document.getElementById('contact_phone_code').value = phone.split(' - ')[0];
                        document.getElementById('select2-contact_phone_code_id-container').innerHTML = phone.split(' - ')[0];
                        document.getElementById('contact_phone').value = phone.split(' - ')[1] != undefined ? phone.split(' - ')[1] : ''; // kalau undefined tidak di copy
                    }
                }catch(err){
                    try{ //ambil paling pertama untuk cor por
                        document.getElementById('contact_phone_code').value = passenger_data[sequence].phones[0].calling_code;
                        document.getElementById('select2-contact_phone_code_id-container').innerHTML = passenger_data[sequence].phones[0].calling_code;
                        document.getElementById('contact_phone').value = passenger_data[sequence].phones[0].calling_number;
                    }catch(err){
                        console.log(err); //tidak ada phone number yg di pilih / belum ada data
                    }
                }
                document.getElementById('contact_birth_date').value = passenger_data[sequence].birth_date;
                document.getElementById('contact_birth_date').readOnly = true;

                temp_data = '';
                var index = 0;
                for(i in passenger_data[sequence].identities){
                    if(index != 0)
                        temp_data += '~';
                    temp_data += i + ',' + passenger_data[sequence].identities[i].identity_number + ',' + passenger_data[sequence].identities[i].identity_country_of_issued_name + ',' + passenger_data[sequence].identities[i].identity_expdate;
                    index++;
                }
                document.getElementById('contact_id_number').value = temp_data;
    //                if(product == 'issued_offline'){
    //                    for(i in passenger_data[sequence].identities){
    //                        document.getElementById('booker_id_type').value = i;
    //                        document.getElementById('booker_id_type').readOnly = true;
    //                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities[i].identity_number;
    //                        document.getElementById('booker_id_number').readOnly = true;
    //                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities[i].identity_country_of_issued_name;
    //                        document.getElementById('booker_country_of_issued').readOnly = true;
    //                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities[i].identity_expdate;
    //                        document.getElementById('booker_exp_date').readOnly = true;
    //                        break;
    //                    }
    //                }else if(product == 'train'){
    //                    for(i in passenger_data[sequence].identities){
    //                        document.getElementById('booker_id_type').value = i;
    //                        document.getElementById('booker_id_type').readOnly = true;
    //                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities[i].identity_number;
    //                        document.getElementById('booker_id_number').readOnly = true;
    //                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities[i].identity_country_of_issued_name;
    //                        document.getElementById('booker_country_of_issued').readOnly = true;
    //                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities[i].identity_expdate;
    //                        document.getElementById('booker_exp_date').readOnly = true;
    //                        break;
    //                    }
    //
    //                }else if(product == 'airline' || product == 'visa' || product == 'activity' || product == 'tour'){
    //                    if(passenger_data[sequence].identities.hasOwnProperty('passport') == true){
    //
    //                        document.getElementById('booker_id_number').value = passenger_data[sequence].identities.passport.identity_number;
    //                        document.getElementById('booker_id_number').readOnly = true;
    //                        document.getElementById('booker_country_of_issued').value = passenger_data[sequence].identities.passport.identity_country_of_issued_name;
    //                        document.getElementById('booker_country_of_issued').readOnly = true;
    //                        document.getElementById('booker_exp_date').value = passenger_data[sequence].identities.passport.identity_expdate;
    //                        document.getElementById('booker_exp_date').readOnly = true;
    //                        try{
    //                            document.getElementById('booker_id_type').value = 'passport';
    //                            document.getElementById('booker_id_type').readOnly = true;
    //                        }catch(err){}
    //                    }
    //                }
                //$("#corporate_booker").attr('data-tooltip', '');
                document.getElementById('corporate_booker').style.display = 'none';
                if(passenger_data[sequence].customer_parents.length != 0){
                    corporate_booker_temp = ''
                    for(j in passenger_data[sequence].customer_parents){
                        corporate_booker_temp += passenger_data[sequence].customer_parents[j].name + ' ' + passenger_data[sequence].customer_parents[j].currency + ' ' + getrupiah(passenger_data[sequence].customer_parents[j].actual_balance) + '\n';
                    }
                    //$("#corporate_booker").attr('data-tooltip', corporate_booker_temp);
                    document.getElementById('corporate_booker').style.display = 'block';

                    new jBox('Tooltip', {
                        attach: '#corporate_booker',
                        theme: 'TooltipBorder',
                        width: 280,
                        position: {
                          x: 'center',
                          y: 'bottom'
                        },
                        closeOnMouseleave: true,
                        animation: 'zoomIn',
                        content: corporate_booker_temp
                    });
                }
                auto_complete('contact_nationality');
                document.getElementById('contact_id').value = passenger_data[sequence].seq_id;
                //untuk booker check
                passenger_data_pick.push(passenger_data[sequence]);
                passenger_data_pick[passenger_data_pick.length-1].sequence = 'contact';
    //            $('#myModal').modal('hide');
                document.getElementById('search_result').innerHTML = '';
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: "You can't choose same person in 1 booking",
                })
            }
        }
    }
    try{
        if(type != 'booker'){
            clear_btn_top(type, passenger_number);
            clear_search_pax(type, passenger_number);
            close_modal_check(type, passenger_number);
        }else{
            clear_btn_top(type, '');
            clear_search_pax(type, '');
            close_modal_check(type, '');
        }
    }catch(err){console.log('lalala');console.log(err);}
}

function copy_booker_to_passenger(val, type){
    if(val == 'copy'){
        var data = document.getElementById('booker_id_number').value.split('~');
        var selection = null;
        var need_identity = null;
        try{
            selection = document.getElementById('adult_id_type1').options;
        }catch(err){
            console.log(err); // kalau tidak ada identity type pada passenger 1
        }
        try{
            if(selection == null)
                selection = document.getElementById('adult_identity_type1').options;
        }catch(err){
            console.log(err); // kalau tidak ada identity type pada passenger 1
        }
        try{
            need_identity = document.getElementById('adult_identity_div1').style.display;
        }catch(err){
            console.log(err); //kalau tidak ada penanda required identity di html
        }
        if(selection != null && data.length > 1){
            var found_selection = [];
            for(i in selection){
                for(j in data){
                    if(selection[i].value == data[j].split(',')[0]){
                        found_selection.push(selection[i].value);
                        break;
                    }
                }
            }
            if(found_selection.length == 1 || need_identity == 'none'){
                copy_booker(val,type, found_selection[0])
            }else{
                text = '<br/><select id="found_selection" class="nice-select-default">';
                for(i in found_selection)
                    text += `<option value=`+found_selection[i]+`>`+found_selection[i]+`</option>`;
                text += '</select>';
                Swal.fire({
                  type: 'info',
                  title: 'Pick Identity to Copy adult 1',
                  showCancelButton: true,
                  showConfirmButton: true,
                  showCloseButton: true,
                  html: text
                }).then((result) => {
                  if (result.value) {
                    copy_booker(val,type,document.getElementById('found_selection').value);
                  }else{
                    document.getElementsByName('myRadios')[1].checked = true;
                  }
                });
            }
        }else{
            copy_booker(val,type, '');
        }
    }else{
        copy_booker(val,type, '');
    }
}

function copy_booker(val,type,identity){
    for_jbox_image++;
    if(val == 'copy'){
        //sini
        data_identity = [];
        if(document.getElementById('booker_id_number').value)
            data_identity = document.getElementById('booker_id_number').value.split('~');
        var date1 = '';
        var date2 = '';
        var expired = null;
        var need_identity = null;
        var identity_check = true;

        if(typeof data_booker !== 'undefined' && data_booker.hasOwnProperty('face_image') && data_booker.face_image.length > 0){
            text = '';
            text += `
                <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                        <img src="`+data_booker.face_image[0]+`" alt="User" class="picture_passenger_agent">
                    </div>
                </div>
            `;
            if(document.getElementById('adult_div_avatar1')){
                document.getElementById('adult_div_avatar1').innerHTML = text
                document.getElementById('adult_div_avatar1').hidden = false;
            }
        }else{
            if(document.getElementById('adult_div_avatar1'))
                document.getElementById('adult_div_avatar1').hidden = true;
        }
        var is_auto_add_identity = true;
        var passenger_number_copy_booker = 1;
        if(type == 'issued_offline'){
            if(document.getElementById('booker_title').value != '' &&
               document.getElementById('booker_first_name').value != '' &&
               document.getElementById('booker_nationality').value != '' &&
               document.getElementById('booker_email').value != '' &&
               document.getElementById('booker_phone').value != ''){
                try{
                    add_pax = true;
                    for(i=1;i<=counter_passenger;i++){
                        if(document.getElementById('adult_first_name'+i)){
                            add_pax = false;
                            break;
                        }
                    }
                    if(add_pax)
                        add_table_of_passenger('');
                    for(i in passenger_data_pick){
                        if(passenger_data_pick[i].sequence == 'adult'+i){
                            passenger_data_pick.splice(i,1);
                            break;
                        }
                    }
                    try{
                        if(JSON.stringify(booker_pick_passenger) != '{}'){
                            passenger_data_pick.push(booker_pick_passenger);
                            passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult'+i;
                        }
                    }catch(err){

                    }

                    for(i=1;i<=counter_passenger;i++){
                        if(document.getElementById('adult_first_name'+i)){
                            document.getElementById('adult_title'+i).value = document.getElementById('booker_title').value;
                            document.getElementById('adult_title'+i).readOnly = true;
                            for(j in document.getElementById('adult_title'+i).options){
                                if(document.getElementById('adult_title'+i).options[j].selected != true)
                                    document.getElementById('adult_title'+i).options[j].disabled = true;
                            }
                            $('#adult_title'+i).niceSelect('update');
                            document.getElementById('adult_first_name'+i).value = document.getElementById('booker_first_name').value;
                            document.getElementById('adult_first_name'+i).readOnly = true;
                            document.getElementById('adult_last_name'+i).value = document.getElementById('booker_last_name').value;
                            document.getElementById('adult_last_name'+i).readOnly = true;
                            document.getElementById('name_pax'+parseInt(parseInt(i)-1)).innerHTML = document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
                            document.getElementById('birth_date'+parseInt(parseInt(i)-1)).innerHTML = "<b>Birth Date: </b><i>"+document.getElementById('booker_birth_date').value+"</i>";
                            $('#adult_nationality'+i+'_id').val(document.getElementById('booker_nationality').value).trigger('change');
                            $('#adult_nationality'+i+'_id').select2({"disabled":true});
//                            document.getElementById('adult_nationality'+i).value = document.getElementById('booker_nationality').value;
//                            document.getElementById('select2-adult_nationality'+i+'_id-container').innerHTML = document.getElementById('booker_nationality').value;
                            document.getElementById('adult_birth_date'+i).value = document.getElementById('booker_birth_date').value;
                            document.getElementById('adult_email'+i).value = document.getElementById('booker_email').value;
                            document.getElementById('adult_phone'+i).value = document.getElementById('booker_phone').value;
                            document.getElementById('adult_phone_code'+i).value = document.getElementById('booker_phone_code').value;

        //                    if(document.getElementById('booker_id_number').value != 'undefined' && document.getElementById('booker_id_number').value != '')
        //                        document.getElementById('adult_identity_number1').value = document.getElementById('booker_id_number').value;
        //                    if(document.getElementById('booker_id_type').value != 'undefined' && document.getElementById('booker_id_type').value != '')
        //                        document.getElementById('adult_identity_type1').value = document.getElementById('booker_id_type').value;
        //                    if(document.getElementById('booker_exp_date').value != 'undefined' && document.getElementById('booker_exp_date').value != '')
        //                        document.getElementById('adult_identity_expired_date1').value = document.getElementById('booker_exp_date').value;
        //                    if(document.getElementById('booker_country_of_issued').value != 'undefined' && document.getElementById('booker_country_of_issued').value != ''){
        //                        document.getElementById('select2-adult_country_of_issued1_id-container').innerHTML = document.getElementById('booker_country_of_issued').value;
        //                        document.getElementById('adult_country_of_issued1').value = document.getElementById('booker_country_of_issued').value;
        //                    }
                            document.getElementById('adult_nationality'+i+'_id').disabled = true;
                            document.getElementById('adult_email'+i).readOnly = true;
                            document.getElementById('adult_phone'+i).readOnly = true;
                            //document.getElementById('adult_phone_code1_id').disabled = true;
                            if(document.getElementById('adult_birth_date'+i).value != '')
                                document.getElementById('adult_birth_date'+i).disabled = true;
                            document.getElementById('adult_id'+i).value = document.getElementById('booker_id').value;
                            $('#adult_identity_type'+i).niceSelect('update');
                            passenger_number_copy_booker = i;
                            break;
                        }
                    }
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
        }
        else if(type == 'medical'){
            if(document.getElementById('booker_title').value != '' &&
               document.getElementById('booker_first_name').value != '' &&
               document.getElementById('booker_nationality').value != '' &&
               document.getElementById('booker_email').value != '' &&
               document.getElementById('booker_phone').value != ''){
               try{
                   document.getElementById("button_search0").style.display = "none";
                   document.getElementById("button_clear0").style.display = "none";
               }catch(err){
                console.log(err); // error kalau tidak ada button search / clear di pop up
               }
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
                    if(document.getElementById('booker_title').value != 'MRS')
                        document.getElementById('adult_title1').value = document.getElementById('booker_title').value;
                    else
                        document.getElementById('adult_title1').value = 'MS';
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
                    document.getElementById('birth_date0').innerHTML = "<b>Birth Date: </b><i>"+document.getElementById('booker_birth_date').value+'</i>';

                    document.getElementById('select2-adult_nationality1_id-container').innerHTML = document.getElementById('booker_nationality').value;
                    document.getElementById('adult_birth_date1').value = document.getElementById('booker_birth_date').value;
                    document.getElementById('adult_email1').value = document.getElementById('booker_email').value;
                    document.getElementById('adult_phone1').value = document.getElementById('booker_phone').value;
                    document.getElementById('adult_phone_code1').value = document.getElementById('booker_phone_code').value;

//                    if(document.getElementById('booker_id_type').value == 'ktp' && vendor == 'periksain' || vendor == 'phc' && test_type == 'PHCDTKATG' && document.getElementById('booker_id_type').value == 'ktp' || vendor == 'phc' && test_type == 'PHCHCKATG' && document.getElementById('booker_id_type').value == 'ktp'){
//                        if(document.getElementById('booker_id_number').value != 'undefined' && document.getElementById('booker_id_number').value != '')
//                            document.getElementById('adult_identity_number1').value = document.getElementById('booker_id_number').value;
//                        if(document.getElementById('booker_id_type').value != 'undefined' && document.getElementById('booker_id_type').value != '')
//                            document.getElementById('adult_identity_type1').value = document.getElementById('booker_id_type').value;
//                        if(document.getElementById('booker_country_of_issued').value != 'undefined' && document.getElementById('booker_country_of_issued').value != ''){
//                            document.getElementById('select2-adult_country_of_issued1_id-container').innerHTML = document.getElementById('booker_country_of_issued').value;
//                            document.getElementById('adult_country_of_issued1').value = document.getElementById('booker_country_of_issued').value;
//                        }
//                    }
//                    document.getElementById('adult_nationality1').value = document.getElementById('booker_nationality').value;
//                    document.getElementById('adult_nationality1_id').disabled = true;

                    $('#adult_nationality1_id').val(document.getElementById('booker_nationality').value).trigger('change');
                    $('#adult_nationality1_id').select2({"disabled":true});
                    document.getElementById('adult_email1').readOnly = true;
                    document.getElementById('adult_phone1').readOnly = true;
                    //document.getElementById('adult_phone_code1_id').disabled = true;
                    if(document.getElementById('adult_birth_date1').value != '')
                        document.getElementById('adult_birth_date1').disabled = true;
                    document.getElementById('adult_id1').value = document.getElementById('booker_id').value;
                    document.getElementById('button_clear0').hidden = true;
                    set_exp_identity(1);
                    onchange_title(1);
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
        }
        else if(document.getElementById('adult_id1').value == '' || document.getElementById('adult_id1').value == document.getElementById('booker_id').value){
            for(i in passenger_data_pick){
                if(passenger_data_pick[i].sequence == 'adult1'){
                    passenger_data_pick.splice(i,1);
                    break;
                }
            }
            try{
                for(i in passenger_data_pick){
                    if(passenger_data_pick[i].sequence == 'booker'){
                        passenger_data_pick.push(passenger_data_pick[i]);
                        passenger_data_pick[passenger_data_pick.length-1].sequence = 'adult1';
                        break;
                    }
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
            try{
                document.getElementById('adult_behaviors1').value = document.getElementById('booker_behaviors').value;
                //belum semua product di tambahkan
            }catch(err){console.log(err);}
//            document.getElementById('adult_nationality1').value = document.getElementById('booker_nationality').value;
//            document.getElementById('select2-adult_nationality1_id-container').innerHTML = document.getElementById('booker_nationality').value;
            $('#adult_nationality1_id').val(document.getElementById('booker_nationality').value).trigger('change');
            $('#adult_nationality1_id').select2({"disabled":true});
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
                }catch(err){
                    console.log(err); // error tidak ada fungsi check_years_old / tidak ada field birth_date
                }
            }
            if(document.getElementById('adult_passport_passport_number1')){
                if(data_booker.hasOwnProperty('identities') && data_booker['identities'].hasOwnProperty('passport')){
                    document.getElementById('adult_passport_passport_number1').value = data_booker['identities']['passport'].identity_number;
                    document.getElementById('adult_passport_passport_expired_date1').value = data_booker['identities']['passport'].identity_expdate;
                    $('#adult_passport_passport_country_of_issued1_id').val(data_booker['identities']['passport'].identity_country_of_issued_name).trigger('change');
                }
            }

            document.getElementById('adult_nationality1_id').disabled = true;
            document.getElementById('adult_email1').readOnly = true;
            document.getElementById('adult_phone1').readOnly = true;
            document.getElementById('adult_phone_code1_id').disabled = true;
            if(document.getElementById('adult_birth_date1').value != '' && document.getElementById('booker_birth_date').value != '')
                document.getElementById('adult_birth_date1').disabled = true;
            document.getElementById('adult_id1').value = document.getElementById('booker_id').value;
        }
        else{
            is_auto_add_identity = false;
            document.getElementsByName('myRadios')[1].checked = true;
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: "Please clear before copy booker",
            })
        }

        try{
            need_identity = document.getElementById('adult_identity_div1').style.display;
        }catch(err){
            console.log(err); //kalau tidak ada penanda identity required di html
        }

        // DI PINDAH KE BAWAH KARENA ISSUED OFFLINE BALUM INNER HTML JADI IDENTITY TIDAK MASUK
        if(need_identity != 'none' && is_auto_add_identity){
            for(i in data_identity){
                data = data_identity[i].split(',');
                if(data[3] != ''){
                    //PASSPORT SIM
                    date1 = data[3];
                    date2 = moment();
                    expired = date2.diff(date1, 'days');
                }else{
                    // KTP
                }
//                var radios = []; //kalau ada tidak masuk if(typeof radios !== 'undefined') karena radios di define
                try{
                    radios = document.getElementById('adult_id_type'+passenger_number_copy_booker).options;
                }catch(err){console.log(err)}
                try{
                    if(typeof(radios) === 'undefined' || radios.length == 0)
                        radios = document.getElementById('adult_identity_type'+passenger_number_copy_booker).options;
                }catch(err){console.log(err)}

                if(typeof radios !== 'undefined'){
                    for (var j = 0, length = radios.length; j < length; j++) {
                        if(expired == null || expired < -1){
                            if (radios[j].value == data[0] && identity == '' || radios[j].value == data[0] && identity == data[0]) {
                                if(data[0] != ''){
                                    if(typeof data_booker !== 'undefined' && data_booker.identities.hasOwnProperty(identity) && data_booker.identities[identity].identity_images.length > 0){
                                        text = '';
                                        //identity cenius (milih identity copy booker + muncul di formny) done
                                        text += `
                                        <div class="row">
                                            <div class="col-lg-12">`;
                                                text+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;">`+identity+` - `+data_booker.identities[identity].identity_number+`</label><br/>`;
                                                text+=`
                                                <div class="row" style="padding:15px;">
                                                    <div class="col-lg-12" style="background:#f7f7f7; padding-top:15px; border:1px solid #cdcdcd; max-height:200px; overflow-x:auto; margin-bottom:15px;">`;
                                                    for(k in data_booker.identities[identity].identity_images){
                                                        text += `
                                                        <div class="row">
                                                            <div class="col-lg-3 col-md-4 col-sm-4">
                                                                <a class="demo-img" href="`+data_booker.identities[identity].identity_images[k][0]+`" data-jbox-image="7showidentitycopy1`+for_jbox_image+`" title="`+identity+` - `+data_booker.identities[identity].identity_number+` (`+data_booker.identities[identity].identity_images[k][2]+`)">
                                                                    <img src="`+data_booker.identities[identity].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                                </a><br/>
                                                            </div>
                                                            <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                                                <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+data_booker.identities[identity].identity_images[k][2]+`</h6>
                                                                <b>Upload date:</b><br/>
                                                                <i>
                                                                    `+moment(data_booker.identities[identity].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                                </i>
                                                            </div>
                                                            <div class="col-lg-12">
                                                                <br/>
                                                            </div>
                                                        </div>`;
                                                    }
                                                    text+=`
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;

                                        if(document.getElementById('adult_attachment_identity'+passenger_number_copy_booker)){
                                            text_attachment= '';
                                            for(k in data_booker.identities[identity].identity_images){
                                                text_attachment += `
                                                    <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                                                        <img src="`+data_booker.identities[identity].identity_images[k][0]+`" alt="Passenger" value="`+data_booker.identities[identity].identity_images[k][1]+`" style="height:220px;width:auto" />

                                                        <div class="row" style="justify-content:space-around">
                                                            <div class="checkbox" style="display: block;">
                                                                <label class="check_box_custom">
                                                                    <span style="font-size:13px;">Delete</span>
                                                                    <input type="checkbox" value="" id="adult_identity1_`+k+`_delete" name="adult_identity1_`+k+`_delete">
                                                                    <input type="hidden" value="`+data_booker.identities[identity].identity_images[k][1]+`" id="adult_identity1_`+k+`_image_seq_id" name="adult_identity1_`+k+`_image_seq_id">
                                                                    <span class="check_box_span_custom"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>`;
                                            }
                                            document.getElementById('adult_attachment_identity'+passenger_number_copy_booker).innerHTML = text_attachment;
                                        }

                                        if(document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker)){
                                            document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker).innerHTML = text
                                            document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker).hidden = false;
                                            new jBox('Image', {
                                              imageCounter: true,
                                              imageCounterSeparator: ' of '
                                            });
                                        }
                                    }else{
                                        if(document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker))
                                            document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker).hidden = true;
                                    }
                                    identity_check = false;
                                    if(document.getElementById('adult_id_type'+passenger_number_copy_booker)){
                                        document.getElementById('adult_id_type'+passenger_number_copy_booker).value = data[0];
                                        $('#adult_id_type'+passenger_number_copy_booker).niceSelect('update');

                                    }else if(document.getElementById('adult_identity_type'+passenger_number_copy_booker)){
                                        document.getElementById('adult_identity_type'+passenger_number_copy_booker).value = data[0];
                                        $('#adult_identity_type'+passenger_number_copy_booker).niceSelect('update');
                                    }
                                    if(data[1] != ''){
                                        if(document.getElementById('adult_passport_number'+passenger_number_copy_booker))
                                            document.getElementById('adult_passport_number'+passenger_number_copy_booker).value = data[1];
                                        else if(document.getElementById('adult_identity_number'+passenger_number_copy_booker))
                                            document.getElementById('adult_identity_number'+passenger_number_copy_booker).value = data[1];
                                    }if(data[4] != '')
                                        if(document.getElementById('adult_passport_expired_date'+passenger_number_copy_booker))
                                            document.getElementById('adult_passport_expired_date'+passenger_number_copy_booker).value = data[3];
                                        if(document.getElementById('adult_identity_expired_date'+passenger_number_copy_booker))
                                            document.getElementById('adult_identity_expired_date'+passenger_number_copy_booker).value = data[3];
                                    if(data[2] != ''){
                                        if(document.getElementById('adult_country_of_issued'+passenger_number_copy_booker)){
//                                            document.getElementById('select2-adult_country_of_issued1_id-container').innerHTML = data[2];
//                                            document.getElementById('adult_country_of_issued1').value = data[2];
                                            $('#adult_country_of_issued'+passenger_number_copy_booker+'_id').val(data[2]).trigger('change');
                                        }
                                    }


                                    //notif passport krng dari 6 bulan
                                    if(expired != null){
                                        if(expired > -180){
                                            identity_type = data[0];
                                            Swal.fire({
                                              type: 'warning',
                                              title: 'Oops!',
                                              html: '<span style="color: #ff9900;">'+identity_type+' expired date less then 6 months </span>' ,
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else if( typeof expired !== 'undefined' && expired < -180){
                    try{ //KALAU ADA IDENTITY
                        //PASSPORT
                        if(data[0] == 'passport'){
                            if(data[1] != ''){
                                identity_check = false;
                                if(document.getElementById('adult_passport_number'+passenger_number_copy_booker))
                                    document.getElementById('adult_passport_number'+passenger_number_copy_booker).value = data[1];
                                else if(document.getElementById('adult_identity_number'+passenger_number_copy_booker))
                                    document.getElementById('adult_identity_number'+passenger_number_copy_booker).value = data[1]
                            }
                            if(data[4] != '')
                                document.getElementById('adult_passport_expired_date'+passenger_number_copy_booker).value = data[3];
                            if(data[2] != ''){
                                document.getElementById('select2-adult_country_of_issued'+passenger_number_copy_booker+'_id-container').innerHTML = data[2];
                                document.getElementById('adult_country_of_issued'+passenger_number_copy_booker).value = data[2];
                            }
                            if(typeof data_booker !== undefined && data_booker.identities.hasOwnProperty(data[0]) && data_booker.identities[data[0]].identity_images.length > 0){
                                text = '';
                                //identity cenius (kalo copy booker ke paxs dgn cuma ada passport + muncul di formny) done
                                text += `
                                <div class="row">
                                    <div class="col-lg-12">`;
                                        text+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;">`+data[0]+` - `+data_booker.identities[data[0]].identity_number+`</label><br/>`;
                                        text+=`
                                        <div style="width:100%; margin-bottom:15px; display:inline-flex; overflow-x: auto; white-space: nowrap;">`;
                                        for(k in data_booker.identities[data[0]].identity_images){
                                            text += `
                                            <div style="width:220px; text-align:center; margin:0px 10px 10px 10px;">
                                                <a class="demo-img" href="`+data_booker.identities[data[0]].identity_images[k][0]+`" data-jbox-image="8showidentitydata1`+for_jbox_image+`" title="`+data[0]+` - `+data_booker.identities[data[0]].identity_number+` (`+data_booker.identities[data[0]].identity_images[k][2]+`)">
                                                    <img src="`+data_booker.identities[data[0]].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                </a><br/>
                                                <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+data_booker.identities[data[0]].identity_images[k][2]+`</h6>
                                                <i>
                                                    Upload date<br/>
                                                    `+moment(data_booker.identities[data[0]].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                </i>
                                            </div>`;
                                        }
                                        text+=`</div>`;
                                    text+=`
                                    </div>
                                </div>`;

                                if(document.getElementById('adult_attachment_identity'+passenger_number_copy_booker)){
                                    text_attachment= '';
                                    for(k in data_booker.identities[data[0]].identity_images){
                                        text_attachment += `
                                            <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                                                <img src="`+data_booker.identities[data[0]].identity_images[k][0]+`" alt="Passenger" value="`+data_booker.identities[data[0]].identity_images[k][1]+`" style="height:220px;width:auto" />

                                                <div class="row" style="justify-content:space-around">
                                                    <div class="checkbox" style="display: block;">
                                                        <label class="check_box_custom">
                                                            <span style="font-size:13px;">Delete</span>
                                                            <input type="checkbox" value="" id="adult_identity1_`+k+`_delete" name="adult_identity1_`+k+`_delete">
                                                            <input type="hidden" value="`+data_booker.identities[data[0]].identity_images[k][1]+`" id="adult_identity1_`+k+`_image_seq_id" name="adult_identity1_`+k+`_image_seq_id">
                                                            <span class="check_box_span_custom"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>`;
                                    }
                                    document.getElementById('adult_attachment_identity'+passenger_number_copy_booker).innerHTML = text_attachment;
                                }

                                if(document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker)){
                                    document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker).innerHTML = text;
                                    document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker).hidden = false;
                                    new jBox('Image', {
                                      imageCounter: true,
                                      imageCounterSeparator: ' of '
                                    });
                                }
                            }else{
                                if(document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker))
                                    document.getElementById('adult_div_avatar_identity'+passenger_number_copy_booker).hidden = true;
                            }
                        }

                    }catch(err){
                        console.log(err); //error kalau tidak ada field identity std
                    }
                }

                date1 = '';
                date2 = '';
                expired = null;
            }
            if(identity_check && data_identity.length > 1){
                //notif error
                try{
                    document.getElementById('adult_identity_msg_error1').innerHTML = 'Identity already expired';
                }catch(err){
                    console.log(err);
                }
                if(document.getElementById('adult_id_type1'))
                    document.getElementById('adult_id_type1').value = identity;
                else if(document.getElementById('adult_identity_type1'))
                    document.getElementById('adult_identity_type1').value = identity;
            }else{
                try{
                    document.getElementById('adult_identity_msg_error1').innerHTML = '';
                }catch(err){
                    console.log(err);
                }
                //identity copy
                if(document.getElementById('adult_id_type1')){
                    change_identity_type(`adult_id_type1`, false);
                    $('#adult_id_type1').niceSelect('update');
                }else if(document.getElementById('adult_identity_type1')){
                    change_identity_type(`adult_identity_type1`, false);
                    $('#adult_identity_type1').niceSelect('update');
                }
            }
        }

        if(typeof ff_request !== 'undefined' && typeof data_booker !== 'undefined' && data_booker.hasOwnProperty('frequent_flyer_list')){
            var index_ff = 1;
            for(i in data_booker['frequent_flyer_list']){
                try{
                    if(data_booker['frequent_flyer_list'][i].ff_code != ''){
                        $("#adult_ff_request1_"+index_ff+"_id").val(data_booker['frequent_flyer_list'][i].ff_code).trigger('change');
                        document.getElementById('adult_ff_number1_'+index_ff).value = data_booker['frequent_flyer_list'][i].ff_number;
                    }
                }catch(err){console.log(err);}
                index_ff++;
            }
        }
    }else{
        //kosongi avatar
        if(type == 'issued_offline' || type == 'groupbooking'){
            for(i=1;i<=counter_passenger;i++){
                if(document.getElementById('adult_first_name'+i)){
                    break;
                }
            }
            try{
                document.getElementById('name_pax'+parseInt(parseInt(i)-1)).innerHTML = '';
                document.getElementById('id_passenger'+parseInt(parseInt(i)-1)).value = '';
                document.getElementById('birth_date'+parseInt(parseInt(i)-1)).innerHTML = '';
            }catch(err){
                console.log(err); // error tidak ada table dengan id name_pax, id_passenger, birth_date, sample_method (medical)
            }
            try{
                document.getElementById('sample_method'+parseInt(parseInt(i)-1)).innerHTML = '';
            }catch(err){console.log(err);}

            if(document.getElementById('adult_div_avatar'+i)){
                document.getElementById('adult_div_avatar'+i).innerHTML = '';
                document.getElementById('adult_div_avatar'+i).hidden = true;
            }
            //kosongi identity
            if(document.getElementById('adult_attachment_identity'+i)){
                document.getElementById('adult_attachment_identity'+i).innerHTML = '';
            }
            if(document.getElementById('adult_div_avatar_identity'+i)){
                document.getElementById('adult_div_avatar_identity'+i).innerHTML = ''
                document.getElementById('adult_div_avatar_identity'+i).hidden = true;
            }


            for(x in passenger_data_pick){
                if(passenger_data_pick[x].sequence == 'adult'+i){
                    passenger_data_pick.splice(x,1);
                    break;
                }
            }
            document.getElementById('adult_title'+i).value = 'MR';
            for(j in document.getElementById('adult_title'+i).options){
                document.getElementById('adult_title'+i).options[j].disabled = false;
            }
            $('#adult_title'+i).niceSelect('update');
            document.getElementById('adult_first_name'+i).value = '';
            document.getElementById('adult_first_name'+i).readOnly = false;
            document.getElementById('adult_last_name'+i).value = '';
            document.getElementById('adult_last_name'+i).readOnly = false;
            try{
                document.getElementById('adult_behaviors'+i).value = '';
                //belum semua product di tambahkan
            }catch(err){console.log(err);}
            $('#adult_nationality'+i+'_id').val('Indonesia').trigger('change');
            $('#adult_nationality'+i+'_id').select2({'disabled': false});
            //testing

            try{
    //            initial_date = moment().subtract(17, 'years').format('DD MMM YYYY');
                document.getElementById('adult_birth_date'+i).value = '';
            }catch(err){console.log(err)}
            try{
                document.getElementById('adult_passport_number'+i).value = '';
                document.getElementById('adult_passport_number'+i).readOnly = false;
            }catch(err){console.log(err)}
            try{
                document.getElementById('adult_id_type'+i).value = '';
                $('#adult_id_type'+i).niceSelect('update');
            }catch(err){console.log(err)}
            try{
                document.getElementById('adult_passport_expired_date'+i).value = '';
                document.getElementById('adult_passport_expired_date'+i).readOnly = false;
            }catch(err){console.log(err)}
            try{
                $('#adult_country_of_issued'+i+'_id').val('').trigger('change');
            }catch(err){console.log(err)}
            try{
                document.getElementById('adult_identity_type'+i).value = '';
                $('#adult_identity_type'+i).niceSelect('update');
                document.getElementById('adult_identity_number'+i).value = '';
                document.getElementById('adult_identity_number'+i).readOnly = false;
                document.getElementById('adult_identity_expired_date'+i).value = '';
                document.getElementById('adult_identity_expired_date'+i).readOnly = false;
                document.getElementById('select2-adult_country_of_issued'+i+'_id-container').value = '';
            }catch(err){console.log(err)}
            document.getElementById('adult_email'+i).value = '';
            document.getElementById('adult_email'+i).readOnly = false;
            document.getElementById('adult_nationality'+i+'_id').disabled = false;
            document.getElementById('adult_phone_code'+i+'_id').disabled = false;
            document.getElementById('adult_phone'+i).readOnly = false;
            document.getElementById('adult_birth_date'+i).disabled = false;
            try{
                document.getElementById('adult_phone_code'+i).value = '62';
                document.getElementById('select2-adult_phone_code'+i+'_id-container').value = '62';
                document.getElementById('select2-adult_phone_code'+i+'_id-container').readOnly = false;
                document.getElementById('adult_phone'+i).value = '';
                document.getElementById('adult_phone'+i).readOnly = false;
            }catch(err){

            }
            document.getElementById('adult_id'+i).value = '';
            if(typeof ff_request !== 'undefined' && typeof data_booker !== 'undefined' && data_booker.hasOwnProperty('frequent_flyer_list')){
                var index_ff = 1;
                for(i in ff_request){
                    $("#adult_ff_request"+i+"_"+index_ff+"_id").val("").trigger('change');
                    document.getElementById('adult_ff_number'+i+'_'+index_ff).value = "";
                    index_ff++;
                }
            }

            if(document.getElementById('adult_passport_passport_number'+i)){
                document.getElementById('adult_passport_passport_number'+i).value = '';
                document.getElementById('adult_passport_passport_expired_date'+i).value = '';
                $('#adult_passport_passport_country_of_issued'+i+'_id').val('').trigger('change');
            }
        }else{
            if(document.getElementById('adult_div_avatar1')){
                document.getElementById('adult_div_avatar1').innerHTML = '';
                document.getElementById('adult_div_avatar1').hidden = true;
            }
            //kosongi identity
            if(document.getElementById('adult_attachment_identity1')){
                document.getElementById('adult_attachment_identity1').innerHTML = '';
            }
            if(document.getElementById('adult_div_avatar_identity1')){
                document.getElementById('adult_div_avatar_identity1').innerHTML = ''
                document.getElementById('adult_div_avatar_identity1').hidden = true;
            }


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
            try{
                document.getElementById('adult_behaviors1').value = '';
                //belum semua product di tambahkan
            }catch(err){console.log(err);}
            $('#adult_nationality1_id').val('Indonesia').trigger('change');
            $('#adult_nationality1_id').select2({'disabled': false});
            //testing

            try{
    //            initial_date = moment().subtract(17, 'years').format('DD MMM YYYY');
                document.getElementById('adult_birth_date1').value = '';
            }catch(err){console.log(err)}
            try{
                document.getElementById('adult_passport_number1').value = '';
                document.getElementById('adult_passport_number1').readOnly = false;
            }catch(err){console.log(err)}
            try{
                document.getElementById('adult_id_type1').value = '';
                $('#adult_id_type1').niceSelect('update');
            }catch(err){console.log(err)}
            try{
                document.getElementById('adult_passport_expired_date1').value = '';
                document.getElementById('adult_passport_expired_date1').readOnly = false;
            }catch(err){console.log(err)}
            try{
                $('#adult_country_of_issued1_id').val('').trigger('change');
            }catch(err){console.log(err)}
            try{
                document.getElementById('adult_identity_type1').value = '';
                $('#adult_identity_type1').niceSelect('update');
                document.getElementById('adult_identity_number1').value = '';
                document.getElementById('adult_identity_number1').readOnly = false;
                document.getElementById('adult_identity_expired_date1').value = '';
                document.getElementById('adult_identity_expired_date1').readOnly = false;
                document.getElementById('select2-adult_country_of_issued1_id-container').value = '';
            }catch(err){console.log(err)}
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
            }catch(err){
                console.log(err); // error tidak ada table dengan id name_pax, id_passenger, birth_date, sample_method (medical)
            }
            document.getElementById('adult_id1').value = '';

            if(typeof ff_request !== 'undefined' && typeof data_booker !== 'undefined' && data_booker.hasOwnProperty('frequent_flyer_list')){
                var index_ff = 1;
                for(i in ff_request){
                    $("#adult_ff_request1_"+index_ff+"_id").val("").trigger('change');
                    document.getElementById('adult_ff_number1_'+index_ff).value = "";
                    index_ff++;
                }
            }

            if(document.getElementById('adult_passport_passport_number1')){
                document.getElementById('adult_passport_passport_number1').value = '';
                document.getElementById('adult_passport_passport_expired_date1').value = '';
                $('#adult_passport_passport_country_of_issued1_id').val('').trigger('change');
            }
        }
        if(type == "medical"){
            document.getElementById('button_clear0').hidden = false;
            document.getElementById('adult_identity_type1').value = 'ktp';
            $('#adult_identity_type1').niceSelect('update');
            try{
                document.getElementById("button_search0").style.display = "unset";
                document.getElementById("button_clear0").style.display = "unset";
                document.getElementById("name_pax0").textContent = "--Fill Passenger--";
            }catch(err){
                console.log(err); //error kalau id tidak ketemu (medical)
            }
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
        document.getElementById('booker_title').value = '';
        for(i in document.getElementById('booker_title').options){
            document.getElementById('booker_title').options[i].disabled = false;
        }
        $('#booker_title').niceSelect('update');
        //kosongi avatar
        if(document.getElementById('booker_attachment')){
            document.getElementById('booker_attachment').innerHTML = '';
        }
        if(document.getElementById('booker_div_avatar')){
            document.getElementById('booker_div_avatar').innerHTML = '';
            document.getElementById('booker_div_avatar').hidden = true;
        }
        document.getElementById('corporate_booker').style.display = 'none';
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
            document.getElementById('adult_title'+sequence).value = '';
            for(i in document.getElementById('adult_title'+sequence).options){
                document.getElementById('adult_title'+sequence).options[i].disabled = false;
            }
            $('#adult_title'+sequence).niceSelect('update');
            document.getElementById('adult_email'+sequence).value = '';
            document.getElementById('adult_email'+sequence).readOnly = false;
            try{
                document.getElementById('adult_behaviors'+sequence).value = '';
                //belum semua product di tambahkan
            }catch(err){console.log(err);}
            //kosongi avatar
            if(document.getElementById('adult_attachment'+sequence)){
                document.getElementById('adult_attachment'+sequence).innerHTML = '';
            }
            if(document.getElementById('adult_div_avatar'+sequence)){
                document.getElementById('adult_div_avatar'+sequence).innerHTML = '';
                document.getElementById('adult_div_avatar'+sequence).hidden = true;
            }
            //kosongi identity
            if(document.getElementById('adult_attachment_identity'+sequence)){
                document.getElementById('adult_attachment_identity'+sequence).innerHTML = '';
            }
            if(document.getElementById('adult_div_avatar_identity'+sequence)){
                document.getElementById('adult_div_avatar_identity'+sequence).innerHTML = ''
                document.getElementById('adult_div_avatar_identity'+sequence).hidden = true;
            }
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
//            initial_date = moment().subtract(18, 'years').format('DD MMM YYYY');
            document.getElementById('adult_birth_date'+sequence).value = '';
            document.getElementById('adult_birth_date'+sequence).disabled = false;
            try{
                document.getElementById('adult_id_type'+sequence).value = '';
                $('#adult_id_type'+sequence).niceSelect('update');
            }catch(err){
                console.log(err);
            }
            document.getElementById('adult_passport_number'+sequence).value = '';
            document.getElementById('adult_passport_number'+sequence).readOnly = false;
            document.getElementById('adult_passport_expired_date'+sequence).value = '';
            document.getElementById('adult_passport_expired_date'+sequence).readOnly = false;
            document.getElementById('adult_country_of_issued'+sequence).value = '';
            document.getElementById('select2-adult_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
            document.getElementById('adult_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
            try{
                if(typeof ff_request !== 'undefined'){
                    for(j=1;j<=ff_request.length;j++){
                        try{
                            $('#adult_ff_request'+sequence+'_'+j+'_id').val('').trigger('change');
                            document.getElementById('adult_ff_number'+sequence+'_'+j).value = '';
                        }catch(err){console.log(err)}
                    }
                }
            }catch(err){console.log(err);}
        }catch(err){
            console.log(err); //error ada field yg tidak ketemu
        }

    }
    else if(type == 'Infant'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'infant'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        try{
            //kosongi avatar
            if(document.getElementById('infant_attachment'+sequence)){
                document.getElementById('infant_attachment'+sequence).innerHTML = '';
            }
            if(document.getElementById('infant_div_avatar'+sequence)){
                document.getElementById('infant_div_avatar'+sequence).innerHTML = '';
                document.getElementById('infant_div_avatar'+sequence).hidden = true;
            }
            //kosongi identity
            if(document.getElementById('infant_attachment_identity'+sequence)){
                document.getElementById('infant_attachment_identity'+sequence).innerHTML = '';
            }
            if(document.getElementById('infant_div_avatar_identity'+sequence)){
                document.getElementById('infant_div_avatar_identity'+sequence).innerHTML = ''
                document.getElementById('infant_div_avatar_identity'+sequence).hidden = true;
            }
            document.getElementById('infant_title'+sequence).value = '';
            for(i in document.getElementById('infant_title'+sequence).options){
                document.getElementById('infant_title'+sequence).options[i].disabled = false;
            }
            $('#infant_title'+sequence).niceSelect('update');
            document.getElementById('infant_id'+sequence).value = '';
            document.getElementById('infant_first_name'+sequence).value = '';
            document.getElementById('infant_first_name'+sequence).readOnly = false;
            document.getElementById('infant_last_name'+sequence).value = '';
            document.getElementById('infant_last_name'+sequence).readOnly = false;
            try{
                document.getElementById('infant_behaviors'+sequence).value = '';
                //belum semua product di tambahkan
            }catch(err){console.log(err);}
            document.getElementById('infant_nationality'+sequence).value = 'Indonesia';
            document.getElementById('select2-infant_nationality'+sequence+'_id-container').value = 'Indonesia';
            //testing
//            initial_date = moment().subtract(1, 'years').format('DD MMM YYYY');
            document.getElementById('infant_birth_date'+sequence).value = '';
            document.getElementById('infant_passport_number'+sequence).value = '';
            document.getElementById('infant_passport_number'+sequence).readOnly = false;
            document.getElementById('infant_passport_expired_date'+sequence).value = '';
            document.getElementById('infant_passport_expired_date'+sequence).readOnly = false;
            document.getElementById('infant_country_of_issued'+sequence).value = '';
            document.getElementById('select2-infant_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
            document.getElementById('infant_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
            try{
                if(typeof ff_request !== 'undefined'){
                    for(j=1;j<=ff_request.length;j++){
                        try{
                            $('#infant_ff_request'+sequence+'_'+j+'_id').val('').trigger('change');
                            document.getElementById('infant_ff_number'+sequence+'_'+j).value = '';
                        }catch(err){console.log(err)}
                    }
                }
            }catch(err){console.log(err);}
        }catch(err){
            console.log(err); //error ada field yg tidak ketemu
        }
    }
    else if(type == 'Senior'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'senior'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        //kosongi avatar
        if(document.getElementById('senior_attachment'+sequence)){
            document.getElementById('senior_attachment'+sequence).innerHTML = '';
        }
        if(document.getElementById('senior_div_avatar'+sequence)){
            document.getElementById('senior_div_avatar'+sequence).innerHTML = '';
            document.getElementById('senior_div_avatar'+sequence).hidden = true;
        }
        //kosongi identity
        if(document.getElementById('senior_attachment_identity'+sequence)){
            document.getElementById('senior_attachment_identity'+sequence).innerHTML = '';
        }
        if(document.getElementById('senior_div_avatar_identity'+sequence)){
            document.getElementById('senior_div_avatar_identity'+sequence).innerHTML = ''
            document.getElementById('senior_div_avatar_identity'+sequence).hidden = true;
        }
        document.getElementById('senior_title'+sequence).value = '';
        for(i in document.getElementById('senior_title'+sequence).options){
            document.getElementById('senior_title'+sequence).options[i].disabled = false;
        }
        $('#senior_title'+sequence).niceSelect('update');
        document.getElementById('senior_id'+sequence).value = '';
        document.getElementById('senior_first_name'+sequence).value = '';
        document.getElementById('senior_first_name'+sequence).readOnly = false;
        document.getElementById('senior_last_name'+sequence).value = '';
        document.getElementById('senior_last_name'+sequence).readOnly = false;
        try{
            document.getElementById('senior_behaviors'+sequence).value = '';
            //belum semua product di tambahkan
        }catch(err){console.log(err);}
        document.getElementById('senior_nationality'+sequence).value = 'Indonesia';
        document.getElementById('select2-senior_nationality'+sequence+'_id-container').value = 'Indonesia';
        //testing
//        initial_date = moment().subtract(80, 'years').format('DD MMM YYYY');
        document.getElementById('senior_birth_date'+sequence).value = '';
        document.getElementById('senior_passport_number'+sequence).value = '';
        document.getElementById('senior_passport_number'+sequence).readOnly = false;
        document.getElementById('senior_passport_expired_date'+sequence).value = '';
        document.getElementById('senior_passport_expired_date'+sequence).readOnly = false;
        document.getElementById('senior_country_of_issued'+sequence).value = '';
        document.getElementById('select2-senior_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
        document.getElementById('senior_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
        try{
            if(typeof ff_request !== 'undefined'){
                for(j=1;j<=ff_request.length;j++){
                    try{
                        $('#senior_ff_request'+sequence+'_'+j+'_id').val('').trigger('change');
                        document.getElementById('senior_ff_number'+sequence+'_'+j).value = '';
                    }catch(err){console.log(err)}
                }
            }
        }catch(err){console.log(err);}
    }
    else if(type == 'Child'){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == 'child'+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        //kosongi avatar
        if(document.getElementById('child_attachment'+sequence)){
            document.getElementById('child_attachment'+sequence).innerHTML = '';
        }
        if(document.getElementById('child_div_avatar'+sequence)){
            document.getElementById('child_div_avatar'+sequence).innerHTML = '';
            document.getElementById('child_div_avatar'+sequence).hidden = true;
        }
        //kosongi identity
        if(document.getElementById('child_attachment_identity'+sequence)){
            document.getElementById('child_attachment_identity'+sequence).innerHTML = '';
        }
        if(document.getElementById('child_div_avatar_identity'+sequence)){
            document.getElementById('child_div_avatar_identity'+sequence).innerHTML = ''
            document.getElementById('child_div_avatar_identity'+sequence).hidden = true;
        }
        document.getElementById('child_title'+sequence).value = '';
        for(i in document.getElementById('child_title'+sequence).options){
            document.getElementById('child_title'+sequence).options[i].disabled = false;
        }
        document.getElementById('child_id'+sequence).value = '';
        document.getElementById('child_first_name'+sequence).value = '';
        document.getElementById('child_first_name'+sequence).readOnly = false;
        document.getElementById('child_last_name'+sequence).value = '';
        document.getElementById('child_last_name'+sequence).readOnly = false;
        try{
            document.getElementById('child_behaviors'+sequence).value = '';
            //belum semua product di tambahkan
        }catch(err){console.log(err);}
        document.getElementById('child_nationality'+sequence).value = 'Indonesia';
        document.getElementById('select2-child_nationality'+sequence+'_id-container').value = 'Indonesia';
        //testing
//        initial_date = moment().subtract(5, 'years').format('DD MMM YYYY');
        document.getElementById('child_birth_date'+sequence).value = '';
        document.getElementById('child_passport_number'+sequence).value = '';
        document.getElementById('child_passport_number'+sequence).readOnly = false;
        document.getElementById('child_passport_expired_date'+sequence).value = '';
        document.getElementById('child_passport_expired_date'+sequence).readOnly = false;
        document.getElementById('child_country_of_issued'+sequence).value = '';
        document.getElementById('select2-child_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
        document.getElementById('child_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
        try{
            if(typeof ff_request !== 'undefined'){
                for(j=1;j<=ff_request.length;j++){
                    try{
                        $('#child_ff_request'+sequence+'_'+j+'_id').val('').trigger('change');
                        document.getElementById('child_ff_number'+sequence+'_'+j).value = '';
                    }catch(err){console.log(err)}
                }
            }
        }catch(err){console.log(err);}
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
                    //kosongi avatar
                    if(document.getElementById('adult_attachment'+sequence)){
                        document.getElementById('adult_attachment'+sequence).innerHTML = '';
                    }
                    if(document.getElementById('adult_div_avatar'+sequence)){
                        document.getElementById('adult_div_avatar'+sequence).innerHTML = '';
                        document.getElementById('adult_div_avatar'+sequence).hidden = true;
                    }
                    //kosongi identity
                    if(document.getElementById('adult_attachment_identity'+sequence)){
                        document.getElementById('adult_attachment_identity'+sequence).innerHTML = '';
                    }
                    if(document.getElementById('adult_div_avatar_identity'+sequence)){
                        document.getElementById('adult_div_avatar_identity'+sequence).innerHTML = ''
                        document.getElementById('adult_div_avatar_identity'+sequence).hidden = true;
                    }
                    //common
                    document.getElementById('adult_title'+sequence).value = '';
                    for(i in document.getElementById('adult_title'+sequence).options){
                        document.getElementById('adult_title'+sequence).options[i].disabled = false;
                    }
                    $('#adult_title'+sequence).niceSelect('update');
                    document.getElementById('adult_email'+sequence).value = '';
                    document.getElementById('adult_email'+sequence).readOnly = false;
                    document.getElementById('adult_phone_code'+sequence).value = '62';
                    try{
                        document.getElementById('adult_behaviors'+sequence).value = '';
                        //belum semua product di tambahkan
                    }catch(err){console.log(err);}
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
                        }catch(err){
                            console.log(err); //phc default value id for mother tidak ada
                        }
                        try{
                            document.getElementById('adult_tempat_lahir'+sequence).value = '';
                            document.getElementById('adult_tempat_lahir'+sequence+'_id').value = '';
                            document.getElementById('select2-adult_tempat_lahir'+sequence+'_id-container').innerHTML = 'Select Tempat Lahir';
                        }catch(err){
                            console.log(err); //phc tidak ada tempat lahir
                        }

                        try{
                            var adult_kabupaten_string = 'adult_kabupaten_ktp'+sequence+'_id';
                            delete_type(adult_kabupaten_string, sequence);
                            var adult_domisili_string = 'adult_kabupaten'+sequence+'_id';
                            delete_type(adult_domisili_string, sequence);
                        }catch(err){
                            console.log(err); // error kabupaten tidak ketemu
                        }

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
                            }catch(err){
                                console.log(err); //error tidak ada element untuk perjalanan keluar negeri
                            }

                            try{
                                document.getElementById('adult_perjalanan_ke_transmisi_lokal'+sequence).value = '';
                                $('#adult_perjalanan_ke_transmisi_lokal'+sequence).niceSelect('update');
                                document.getElementById('perjalanan_ke_transmisi_lokal_div'+sequence).hidden = true;
                            }catch(err){
                                console.log(err); //error tidak ada element untuk perjalanan transmisi lokal
                            }

                            try{
                                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan'+sequence).value = '';
                                $('#adult_berkunjung_ke_fasilitas_kesehatan'+sequence).niceSelect('update');
                                document.getElementById('berkunjung_ke_fasilitas_kesehatan_div'+sequence).hidden = true;
                            }catch(err){
                                console.log(err); //error tidak ada element untuk berkunjung ke fasilitas kesehatan
                            }

                            try{
                                document.getElementById('adult_berkunjung_ke_pasar_hewan'+sequence).value = '';
                                $('#adult_berkunjung_ke_pasar_hewan'+sequence).niceSelect('update');
                                document.getElementById('berkunjung_ke_pasar_hewan_div'+sequence).hidden = true;
                            }catch(err){
                                console.log(err); //error tidak ada element untuk berkunjung ke pasar hewan
                            }

                            try{
                                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan'+sequence).value = '';
                                $('#adult_berkunjung_ke_pasien_dalam_pengawasan'+sequence).niceSelect('update');
                                document.getElementById('berkunjung_ke_pasien_dalam_pengawasan_div'+sequence).hidden = true;
                            }catch(err){
                                console.log(err); //error tidak ada element untuk berkunjung ke pasien dalam pengawasan
                            }

                            try{
                                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi'+sequence).value = '';
                                $('#adult_berkunjung_ke_pasien_konfirmasi'+sequence).niceSelect('update');
                                document.getElementById('berkunjung_ke_pasien_konfirmasi_div'+sequence).hidden = true;
                            }catch(err){
                                console.log(err); //error tidak ada element untuk berkunjung ke pasien covid19
                            }

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
                        }catch(err){
                            console.log(err); //error tidak ada element untuk tempat lahir
                        }
                        try{
                            document.getElementById('adult_provinsi'+sequence).value = '';
                            document.getElementById('adult_provinsi'+sequence+'_id').value = '';
                            document.getElementById('select2-adult_provinsi'+sequence+'_id-container').innerHTML = 'Select Provinsi';

                            var adult_kabupaten_string = 'adult_kabupaten'+sequence+'_id';
                            delete_type(adult_kabupaten_string, sequence);
                        }catch(err){
                            console.log(err); //error tidak ada element untuk provinsi / kabupaten
                        }
                    }
                    set_exp_identity(sequence);
                    clear_text_medical(parseInt(sequence)-1);

                }catch(err){console.log(err);}
            }
        })
    }
    else{
        //BUAT PAX TYPE YG TIDAK ADA
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == type+sequence){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        try{
            document.getElementById(type+'_title'+sequence).value = '';
            for(i in document.getElementById(type+'_title'+sequence).options){
                document.getElementById(type+'_title'+sequence).options[i].disabled = false;
            }
            $('#'+type+'_title'+sequence).niceSelect('update');
            try{
                document.getElementById(type+'_behaviors'+sequence).value = '';
                //belum semua product di tambahkan
            }catch(err){console.log(err);}
            //kosongi avatar
            if(document.getElementById(type+'_attachment'+sequence)){
                document.getElementById(type+'_attachment'+sequence).innerHTML = '';
            }
            if(document.getElementById(type+'_div_avatar'+sequence)){
                document.getElementById(type+'_div_avatar'+sequence).innerHTML = '';
                document.getElementById(type+'_div_avatar'+sequence).hidden = true;
            }
            //kosongi identity
            if(document.getElementById(type+'_attachment_identity'+sequence)){
                document.getElementById(type+'_attachment_identity'+sequence).innerHTML = '';
            }
            if(document.getElementById(type+'_div_avatar_identity'+sequence)){
                document.getElementById(type+'_div_avatar_identity'+sequence).innerHTML = ''
                document.getElementById(type+'_div_avatar_identity'+sequence).hidden = true;
            }
            document.getElementById(type+'_id'+sequence).value = '';
            document.getElementById(type+'_first_name'+sequence).value = '';
            document.getElementById(type+'_first_name'+sequence).readOnly = false;
            document.getElementById(type+'_last_name'+sequence).value = '';
            document.getElementById(type+'_last_name'+sequence).readOnly = false;
            document.getElementById(type+'_nationality'+sequence).value = 'Indonesia';
            document.getElementById('select2-'+type+'_nationality'+sequence+'_id-container').value = 'Indonesia';
            document.getElementById(type+'_nationality'+sequence+'_id').disabled = false;
            //testing
            document.getElementById(type+'_birth_date'+sequence).value = '';
            document.getElementById(type+'_birth_date'+sequence).disabled = false;
            try{
                document.getElementById(type+'_id_type'+sequence).value = '';
                $('#'+type+'_id_type'+sequence).niceSelect('update');
            }catch(err){
                console.log(err);
            }
            try{
                document.getElementById(type+'_passport_number'+sequence).value = '';
                document.getElementById(type+'_passport_number'+sequence).readOnly = false;
            }catch(err){
                document.getElementById(type+'_number'+sequence).value = '';
                document.getElementById(type+'_number'+sequence).readOnly = false;
            }

            try{
                document.getElementById(type+'_passport_expired_date'+sequence).value = '';
                document.getElementById(type+'_passport_expired_date'+sequence).readOnly = false;
            }catch(err){
                document.getElementById(type+'_expired_date'+sequence).value = '';
                document.getElementById(type+'_expired_date'+sequence).readOnly = false;
            }

            try{
                document.getElementById(type+'_passport_country_of_issued'+sequence).value = '';
                document.getElementById('select2-'+type+'_passport_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
                document.getElementById(type+'_passport_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
            }catch(err){
                document.getElementById(type+'_country_of_issued'+sequence).value = '';
                document.getElementById('select2-'+type+'_country_of_issued'+sequence+'_id-container').innerHTML = 'Country Of Issued';
                document.getElementById(type+'_country_of_issued'+sequence+'_id').value = 'Country Of Issued';
            }
            try{
                if(typeof ff_request !== 'undefined'){
                    for(j=1;j<=ff_request.length;j++){
                        try{
                            $('#'+type+'_ff_request'+sequence+'_'+j+'_id').val('').trigger('change');
                            document.getElementById(type+'_ff_number'+sequence+'_'+j).value = '';
                        }catch(err){console.log(err)}
                    }
                }
            }catch(err){console.log(err);}

        }catch(err){
            console.log(err); //error ada field yg tidak ketemu
        }
    }
    if(type != 'Booker'){
        try{
            document.getElementById(type.toLowerCase()+'_identity_msg_error'+sequence).innerHTML = '';
        }catch(err){
            console.log(err);
        }
    }
}

function check_pln_non_tagihan(value){
    var checknumber = "^[1-5][0-9]{11,12}$";
    if(value.match(checknumber)!=null){
        return true;
    }else{
        return false;
    }
}

function check_pln_prepaid(value){
    var checknumber = "^([1-5][0-9]|[0-9])[0-9]{10}$";
    if(value.match(checknumber)!=null){
        return true;
    }else{
        return false;
    }
}

function check_pln_postpaid(value){
    var checknumber = "^[1-5][0-9]{11}$";
    if(value.match(checknumber)!=null){
        return true;
    }else{
        return false;
    }
}

function check_evoucher(value, value2){
    if(value2 == 'game_voucher' || value2 == 'postpaid_mobile_lwa' || value2 == 'postpaid_mobile_gri' || value2 == 'postpaid_mobile_swj')
    {
        return true;
    }
    else
    {
        var checknumber = "^08[1-9]{2}[0-9]{5,9}$";
        var checknumber_bolt = "^999[1-9]{1}[0-9]{5,9}$";
        if(value.match(checknumber)!=null || value.match(checknumber_bolt)!=null){
            return true;
        }else{
            return false;
        }
    }
}

function check_cable_tv(value){
    return true;
}

function check_internet(value){
    return true;
}

function check_telephone(value){
    return true;
}

function check_insurance(value){
    return true;
}

function check_pdam(value){
    return true;
}

function check_pbb(value){
    return true;
}

function check_gas(value){
    return true;
}

function check_credit_installment(value){
    return true;
}

function check_credit_card(value){
    return true;
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
        if(value.length==16){ //hanya boleh 16 digit
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
    var checkword = /^[a-zA-Z ]+$/;
    if(value.match(checkword)){
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
    if(check_word(last_name) == true || last_name == ''){ //kalau lastname kosong biar tetap masuk pengecheckan
        log = '';
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
    if(val.length <= length){
        return true;
    }else
        return false;
}

function check_name_adult_infant(data, length){
    if(data.length <= length){
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
//        window.location.href = '/' + type_render + '/booking/' + order_number_id;
//        window.location.href = '/payment/espay/' + order_number_full; //redirect ke dari payment dengan nomor va //lupa kenapa dulu bikin kyk gini cuman kalau kyk gini ke redirect 2x & jika espay belum response redirect prtama akan muncul payment error fix
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
            if(msg.result.error_code == 0){
                if(payment_acq2[payment_method][selected].name == 'OVO'){
                    if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'payment')
                        window.location.href = '/' + type_render.replace('_review','').replace('_book_then_issued','') + '/booking/' + order_number_id; //fix karena di pakai untuk path next get booking
                    else
                        window.location.reload();
                }else if(payment_acq2[payment_method][selected].save_url == true){
                    // agent
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        Swal.fire({
                          title: "Success, continue to payment?",
                          type: 'success',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: 'blue',
                          confirmButtonText: 'Payment',
                          cancelButtonText: 'Copy Link'
                        }).then((result) => {
                            if (result.value) {
                                window.location.href = msg.result.response.url;

                            }else{
                                const el = document.createElement('textarea');
                                el.value = msg.result.response.url;
                                document.body.appendChild(el);
                                el.select();
                                document.execCommand('copy');
                                document.body.removeChild(el);
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
                                close_div('payment_acq');
                                if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'payment')
                                    window.location.href = '/' + provider_type + '/booking/' + btoa(order_number_id);
                            }
                        })
                    }else{
                        // b2c
                        Swal.fire({
                          title: "Success, continue to payment?",
                          type: 'success',
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: 'blue',
                          confirmButtonText: 'Payment',
                        }).then((result) => {
                            window.location.href = msg.result.response.url;
                        })
                    }
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
        document.getElementById('button_tr_passenger_db').innerHTML = '';
        if(msg.result.error_code != 0){
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            })

            Toast.fire({
              type: 'error',
              title: msg.result.error_msg
            })
        }else{
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            })

            Toast.fire({
              type: 'success',
              title: 'Passenger chosen'
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
        if(msg.result.error_code != 0){
             Swal.fire({
               type: 'error',
               title: 'Oops!',
               text: "Error!",
             })
        }
        radio_button('pax_cache');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function get_passenger_cache(type,update_cache=false){
    for_jbox_image++;
    type = "chosen";
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'get_passenger_cache',
       },
       data: {
            'update_cache': update_cache,
            'passenger_sequence': typeof passenger_cache_pick !== 'undefined'  ? passenger_cache_pick : 0
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            document.getElementById('passenger_chosen').innerHTML = '';
            document.getElementById('button_tr_passenger_db').innerHTML = '';
            passenger_data_cache = msg.result.response;
            if(type == 'chosen'){
                var response = '';
                var like_name_booker = document.getElementById('train_passenger_search').value;
                if(msg.result.response.length != 0){
                    response+=`
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="alert alert-success" role="alert" style="margin-top:10px;"><h6><i class="fas fa-search"></i> Selected Passenger</h6></div>
                        </div>
                    </div>

                    <div class="row">`;
                    var selection = null;
                    try{
                        selection = document.getElementById('adult_id_type1').options;
                    }catch(err){
                        console.log(err); //error kalau tidak ada identities di backend
                    }
                    if(selection == null){
                        try{ //buat yg tidak ada adult jaga - jaga
                            selection = document.getElementById('child_id_type1').options;
                        }catch(err){
                            console.log(err); //error kalau tidak ada identities di backend
                        }
                    }
                    var found_selection = [];
                    if(selection != null){
                        for(i in selection){
                            if(selection[i].value != '' && typeof(selection[i].value) == "string"){
                                found_selection.push(selection[i].value);
                            }
                        }
                    }

                    //hasil chosen
                    for(i in msg.result.response){
                        var number_i = parseInt(i)+1;

                        response+=`<div class="col-lg-12" style="margin-bottom:30px; border-top:2px solid #cdcdcd; border-bottom:2px solid #cdcdcd; background:white; padding:15px">`;

                        response+=`
                        <div class="row">
                            <div class="col-xs-4">
                                <h4 class="single_border_custom_bottom" style="margin-bottom:5px; width:50px; word-break:break-word;">#`+number_i+`.</h4>
                            </div>
                            <div class="col-xs-8 mb-2" style="text-align:right;">`;
                                if(agent_security.includes('p_cache_2') == true)
                                {
                                    //response+=`<button type="button" class="primary-btn-white" style="width:110px; height:43px;" onclick="edit_passenger_cache(`+i+`);">Edit <i class="fas fa-pen"></i></button>`;
                                    response+=`<label style="border-bottom:2px solid `+color+`; cursor:pointer; margin-right:15px;" onclick="edit_passenger_cache(`+i+`);">Edit <i class="fas fa-pen" style="font-size:18px; color:`+color+`;"></i></label>`;
                                }
                                response+=`<label style="cursor:pointer;" onclick="del_passenger_cache(`+i+`);"><i class="fas fa-times" style="font-size:22px; color:#ff3030;"></i></label>`;
                            response+=`
                            </div>`;
                            if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'passenger' || window.location.href.split('/')[window.location.href.split('/').length-2] == 'passenger'){
                                response+=`
                                <div class="col-lg-12" style="background:#f7f7f7; padding-top:15px; padding-bottom:5px; margin-bottom:5px;">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <h6><i class="fas fa-user" style="color:`+color+`;"></i> Move to Booker / Passenger</h6>
                                        </div>
                                        <div class="col-xs-12 mt-2 mb-3">`;

                                        response+=`
                                            <select class="selection_type_ns nice-select-default" id="selection_type`+i+`" style="width:100%;" onchange="btn_move_passenger_cache_enable(`+i+`);">
                                            <option value="">Select</option>`;
                                        if(msg.result.response[i].title == "MR" || msg.result.response[i].title == "MRS" || msg.result.response[i].title == "MS"){
                                            response+=`<optgroup label="Booker">`;
                                            response+=`<option value="booker">Booker Only</option>`;
                                            response+=`<option value="booker_with_adult">Booker With Adult 1</option>`;
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
                                        response+=`</select></div>`;
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
            //                                if(check == 0)
            //                                    response+=`<div class="col-xs-4 mt-2"><button type="button" class="primary-btn-custom" onclick="update_customer_cache_list(`+i+`)" id="move_btn_`+i+`">Move</button></div>`;
            //                                else
            //                                    response+=`<div class="col-xs-4 mt-2"><button type="button" class="primary-btn-custom" id="move_btn_`+i+`" disabled>`+passenger_sequence+`</button></div>`;
                                    response+=`
                                    </div>
                                </div>`;
                            }
                            else if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'issued_offline'){
                            response+=`
                                <div class="col-lg-12" style="background:#f7f7f7; padding-top:15px; padding-bottom:5px; margin-bottom:5px;">
                                    <div class="row">

                                    <div class="col-lg-12 mt-2">
                                        <h6>Move to Booker / Passenger</h6>
                                    </div>
                                    <div class="col-lg-12 mt-2"><select class="selection_type_ns" id="selection_type`+i+`" style="width:100%;">`;
                                    if(msg.result.response[i].title == "MR" || msg.result.response[i].title == "MRS" || msg.result.response[i].title == "MS"){
                                        response+=`<optgroup label="Booker">`;
                                        response+=`<option value="booker">Booker Only</option>`;
                                        response+=`<option value="booker_with_adult">Booker With Adult 1</option>`;
                                    }

                                    try{
                                        if(counter_passenger > 0)
                                            response+=`<optgroup label="Passenger">`;
                                        for(j=0;j<counter_passenger;j++){
                                            response+=`<option value="adult`+parseInt(j+1)+`">Passenger `+parseInt(j+1)+`</option>`;
                                        }
                                    }catch(err){

                                    }
                                    response+=`</select></div>`;
                                    check = 0;
                                    var passenger_sequence = '';
                                    for(i in passenger_data_pick){
                                        if(passenger_data_pick[i].seq_id == msg.result.response[i].seq_id){
                                            check = 1;
                                            var passenger_pick = passenger_data_pick[i].sequence.replace(/[^a-zA-Z ]/g,"");
                                            var passenger_pick_number = passenger_data_pick[i].sequence.replace( /^\D+/g, '');
                                            passenger_sequence = passenger_pick.charAt(0).toUpperCase() + passenger_pick.slice(1).toLowerCase() + ' ' + passenger_pick_number;
                                        }
                                    }
    //                                if(check == 0)
    //                                    response+=`<div class="col-lg-12 mt-2"><button type="button" class="primary-btn-custom" onclick="update_customer_cache_list(`+i+`)" id="move_btn_`+i+`">Move</button></div>`;
    //                                else
    //                                    response+=`<div class="col-lg-12 mt-2"><button type="button" class="primary-btn-custom" disabled id="move_btn_`+i+`">`+passenger_sequence+`</button></div>`;
                                    response+=`
                                    </div>
                                </div>`;

                            }
                            response+=`
                            <div class="col-lg-3">
                                <div class="row">
                                    <div class="col-lg-12">`;
                                        if(msg.result.response[i].face_image.length > 0)
                                            response+=`<img src="`+msg.result.response[i].face_image[0]+`" alt="User" class="picture_passenger_agent">`;
                                        else if(msg.result.response[i].title == "MR"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_mr.png" alt="User MR" class="picture_passenger_agent">`;
                                        }
                                        else if(msg.result.response[i].title == "MRS"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_mrs.png" alt="User MRS" class="picture_passenger_agent">`;
                                        }
                                        else if(msg.result.response[i].title == "MS"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_ms.png" alt="User MS" class="picture_passenger_agent">`;
                                        }
                                        else if(msg.result.response[i].title == "MSTR"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_mistr.png" alt="User MSTR" class="picture_passenger_agent">`;
                                        }
                                        else if(msg.result.response[i].title == "MISS"){
                                            response+=`<img src="/static/tt_website_rodextrip/img/user_miss.png" alt="User MISS" class="picture_passenger_agent">`;
                                        }
                                    response+=`
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9" style="padding-bottom:10px;">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <h4 style="word-break:break-word;">`+msg.result.response[i].title+` `+msg.result.response[i].first_name+` `+msg.result.response[i].last_name+`</h4>`;
                                        if(msg.result.response[i].customer_parents.length != 0){
                                            response += `<label id="pop_corporate_detail`+i+`" style="margin-top:10px; border:1px solid #cdcdcd; background:black; color:white; padding:5px 10px;"><i class="fas fa-money-bill-wave-alt"></i> Corporate Booker <i class="fas fa-chevron-down"></i></label><br/>`;
                                        }

                                        if(msg.result.response[i].original_agent != '')
                                            response+=`<i class="fas fa-user-secret"></i> <b>Customer Of Agent: </b><i style="word-break:break-word;">`+msg.result.response[i].original_agent+`</i>`;
                                        else
                                            response+=`<i class="fas fa-user-secret"></i> <b>Customer of Agent: </b><i style="word-break:break-word;">not filled in</i>`;

                                        if(msg.result.response[i].birth_date != '')
                                            response+=`<br/><i class="fas fa-birthday-cake"></i> <b>Birth Date: </b><i style="word-break:break-word;">`+msg.result.response[i].birth_date+`</i>`;
                                        else
                                            response+=`<br/><i class="fas fa-birthday-cake"></i> <b>Birth Date: </b><i style="word-break:break-word;">not filled in</i>`;

                                        if(msg.result.response[i].nationality_name != '')
                                            response+=`<br/><i class="fas fa-globe-asia"></i> <b>Nationality: </b><i style="word-break:break-word;">`+msg.result.response[i].nationality_name+`</i>`;
                                        else
                                            response+=`<br/><i class="fas fa-globe-asia"></i> <b>Nationality: </b><i style="word-break:break-word;">not filled in</i>`;

                                        if(msg.result.response[i].email != '' && msg.result.response[i].email != false){
                                            response+=`<br/><i class="fas fa-envelope"></i> <b>Email: </b><i style="word-break:break-word;">`+msg.result.response[i].email+`</i>`;
                                        }else{
                                            response+=`<br/><i class="fas fa-envelope"></i> <b>Email: </b><i style="word-break:break-word;">not filled in</i>`;
                                        }

                                        if(msg.result.response[i].hasOwnProperty('behaviors') && Object.keys(msg.result.response[i].behaviors).length > 0){
                                            print_behavior = false;
                                            response_behavior=`<br/><i class="fas fa-clipboard"></i>
                                            <label id="pop_chosen_behavior_detail`+i+`" style="color:`+color+`;margin-bottom:unset;"> See Behaviors History <i class="fas fa-chevron-down"></i></label>`;
                                            for(j in msg.result.response[i].behaviors){
                                                print_behavior = true;
                                            }
                                            if(print_behavior)
                                                response += response_behavior;
                                        }

                                        //FREQUENT FLYERS
                                        if(msg.result.response[i].hasOwnProperty('frequent_flyers') && msg.result.response[i].frequent_flyers.length > 0){
                                            if(document.URL.split('/')[document.URL.split('/').length-2] == 'passenger' && document.URL.split('/')[document.URL.split('/').length-3] == 'airline'){
                                                for(x in ff_request){
                                                    if(ff_request[x].hasOwnProperty('error_code') == false){ // ff request error tidak di tampilkan
                                                        response += `
                                                            <div class="row">
                                                                <div class="col-lg-12">
                                                                    <i class="fas fa-id-card"></i> <b>`+ff_request[x].program_name+` `+ff_request[x].sequence+`:</b><br/>
                                                                </div>
                                                                <div class="col-lg-12">
                                                                    <select class="nice-select-default mb-2" id="frequent_flyer`+i+`_`+x+`" style="width: 100%; display: none;">
                                                                        <option value="">Frequent Flyer Program</option>`;
                                                                    is_first_ff = true
                                                                    for(y in ff_request[x].ff_availability){
                                                                        has_ff_number = false;
                                                                        for(j in msg.result.response[i].frequent_flyers){
                                                                            if(ff_request[x].ff_availability[y].ff_code == msg.result.response[i].frequent_flyers[j].ff_code){
                                                                                if(is_first_ff){
                                                                                    response += `<option selected value="`+msg.result.response[i].frequent_flyers[j].ff_code+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`">`+ff_request[x].ff_availability[y].name+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`</option>`;
                                                                                    is_first_ff = false;
                                                                                }else
                                                                                    response += `<option value="`+msg.result.response[i].frequent_flyers[j].ff_code+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`">`+ff_request[x].ff_availability[y].name+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`</option>`;
                                                                                has_ff_number = true;
                                                                            }
                                                                        }
                                                                        if(!has_ff_number)
                                                                            response += `<option value="`+ff_request[x].ff_availability[y].ff_code+` - ">`+ff_request[x].ff_availability[y].name+` - Input new data</option>`;
                                                                    }

                                                        response +=`
                                                                    </select>
                                                                </div>
                                                            </div>`;
                                                    }
                                                }
                                            }else{
                                                response += `
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <i class="fas fa-id-card"></i> <b>Frequent Flyer Data:</b><br>
                                                        </div>`;
                                                for(j in msg.result.response[i].frequent_flyers){
                                                    for(x in frequent_flyer_data){
                                                        if(frequent_flyer_data[x].code == msg.result.response[i].frequent_flyers[j].ff_code){
                                                            response += `
                                                        <div class="col-lg-12">
                                                            <i style="word-break:break-word;">`+frequent_flyer_data[x].name+` - `+msg.result.response[i].frequent_flyers[j].ff_number+`</i>
                                                        </div>`;
                                                            break;
                                                        }
                                                    }
                                                }

                                                response +=`
                                                    </div>`;
                                            }
                                        }

                                        if(msg.result.response[i].phones.length != 0){
                                            if(template == 1 || template == 5 || template == 6){
                                                response+=`
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <i class="fas fa-mobile-alt"></i> <b>Mobile:</b>
                                                    </div>
                                                    <div class="col-lg-12">`;
                                            }
                                            else if(template == 2){
                                                response+=`
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Mobile:</b>
                                                    </div>
                                                    <div class="col-lg-12">`;
                                            }
                                            else if(template == 3){
                                                response+=`
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Mobile:</b>
                                                            <div class="default-select">`;
                                            }
                                            else if(template == 4){
                                                response+=`
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <i class="fas fa-mobile-alt" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Mobile:</b>
                                                    </div>
                                                    <div class="col-lg-12">
                                                        <div class="form-select">`;
                                            }

                                            response+=`<select class="phone_chosen_cls nice-select-default" id="phone_chosen`+i+`" style="width:100%;">`;
                                            for(j in msg.result.response[i].phones){
                                                response += `<option>`+msg.result.response[i].phones[j].calling_code+` - `+msg.result.response[i].phones[j].calling_number+`</option>`;
                                            }
                                            response+=`</select>`;

                                            if(template == 1 || template == 5 || template == 6){
                                                response+=`</div></div>`;
                                            }else if(template == 2){
                                                response+=`</div></div>`;
                                            }else if(template == 3){
                                                response+=`</div></div></div>`;
                                            }else if(template == 4){
                                                response+=`</div></div></div>`;
                                            }
                                        }
                                        else{
                                            response+=`<br/><i class="fas fa-mobile-alt"></i> <b>Mobile:</b> <i>not filled in</i>`;
                                        }

                                        response+=`
                                    </div>
                                </div>`;


                                response+=`
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12" style="border-top:1px solid #cdcdcd; padding-top:15px;">`;
                                    //default passport, kalau ada selection passport, ktp, sim print
                                    if(msg.result.response[i].identities.hasOwnProperty('passport') == true && found_selection == 0 || msg.result.response[i].identities.hasOwnProperty('passport') == true && found_selection.includes('passport') || msg.result.response[i].identities.hasOwnProperty('ktp') == true && found_selection.includes('ktp') || msg.result.response[i].identities.hasOwnProperty('sim') == true && found_selection.includes('sim')){
                                        if(template == 1 || template == 5 || template == 6){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-id-card"></i> <b>Identity:</b>
                                                </div>
                                                <div class="col-lg-12">`;
                                        }else if(template == 2){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-id-card" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Identity:</b>
                                                </div>
                                                <div class="col-lg-12">`;
                                        }else if(template == 3){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-id-card" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Identity:</b>
                                                        <div class="default-select">`;
                                        }else if(template == 4){
                                            response+=`
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <i class="fas fa-id-card" style="margin-top:auto;margin-bottom:auto;padding-right:5px;"></i> <b>Identity:</b>
                                                </div>
                                                <div class="col-lg-12">
                                                    <div class="form-select">`;
                                        }

                                        if(msg.result.response[i].identities.length != 0){
                                            response+=`
                                            <select class="phone_chosen_cls nice-select-default mb-2" id="identity_chosen`+i+`" onchange="generate_image_identity(`+i+`, 'identity_chosen', 'div_identity_chosen', 'label_title_identity_chosen', 'chosen')" style="width:100%;">
                                                <option value="all_identity">All Identity</option>`;

                                            for(j in msg.result.response[i].identities){
                                                response+=`
                                                <option value="`+j+` - `+msg.result.response[i].identities[j].identity_number+`" style="text-transform: capitalize;">`+j+` - `+msg.result.response[i].identities[j].identity_number+`</option>`;
                                            }
                                            response+=`</select>`;
                                        }

                                        if(template == 1 || template == 5 || template == 6){
                                            response+=`</div></div>`;
                                        }else if(template == 2){
                                            response+=`</div></div>`;
                                        }else if(template == 3){
                                            response+=`</div></div></div>`;
                                        }else if(template == 4){
                                            response+=`</div></div></div>`;
                                        }

                                        //identity cenius chosen passenger done
                                        if(msg.result.response[i].identities.length != 0){
                                            response+=`
                                            <label style="text-transform: capitalize; text-align:center; font-size:14px;" id="label_title_identity_chosen`+i+`">All Identity Image</label><br/>
                                            <div class="col-lg-12" id="div_identity_chosen`+i+`" style="background:#f7f7f7; padding-top:15px; border:1px solid #cdcdcd; max-height:200px; overflow-x:auto; margin-bottom:15px;">`;
                                            check_identity_img = 0;
                                            for(j in msg.result.response[i].identities){
                                                if(msg.result.response[i].identities[j].identity_images.length != 0){
                                                    for(k in msg.result.response[i].identities[j].identity_images){
                                                        response += `
                                                        <div class="row">
                                                            <div class="col-lg-3 col-md-4 col-sm-4">
                                                                <a class="demo-img" href="`+msg.result.response[i].identities[j].identity_images[k][0]+`" data-jbox-image="9showchosenidentity`+i+``+for_jbox_image+`" title="`+j+` - `+msg.result.response[i].identities[j].identity_number+` (`+msg.result.response[i].identities[j].identity_images[k][2]+`)">
                                                                    <img src="`+msg.result.response[i].identities[j].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                                </a>
                                                            </div>
                                                            <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                                                <h6 class="mb-2">`+msg.result.response[i].identities[j].identity_images[k][2]+`</h6>
                                                                <b>Upload date:</b><br/>
                                                                <i>
                                                                    `+moment(msg.result.response[i].identities[j].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                                </i>
                                                            </div>
                                                            <div class="col-lg-12">
                                                                <br/>
                                                            </div>
                                                        </div>`;
                                                    }
                                                    check_identity_img = 1;
                                                }
                                            }
                                            if(check_identity_img == 0){
                                                response+=`
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        <h6 class="pb-3">No Image!</h6>
                                                    </div>
                                                </div>`;
                                            }
                                            response+=`</div>`;
                                        }
                                    }
                                    else{
                                        response+=`<i class="fas fa-id-card"></i> <b>Identity:</b><br/>`;
                                        response+=`
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <div style="width:100%; text-align:center; padding:10px 5px 10px 5px; border:1px solid #e3e3e3; background:#fcfcfc;">
                                                    <h6>Identity not filled in</h6>
                                                </div>
                                            </div>
                                        </div>`;
                                    }
                                    response+=`
                                </div>
                            </div>`;
                            if(msg.result.response[i].customer_parents.length != 0){
                                response+=`
                                    <div class="row">
                                        <div class="col-lg-12" style="border-top:1px solid #cdcdcd; padding-top:15px;">
                                            <div class="row">`;
                                            cor_resp = '';
                                            for(j in msg.result.response[i].customer_parents){
                                                cor_resp += `<option value="`+msg.result.response[i].customer_parents[j].seq_id+`">`+msg.result.response[i].customer_parents[j].type + ` ` + msg.result.response[i].customer_parents[j].name+`</option>`
                                            }
                                            response += `
                                            <div class="col-lg-12">
                                                <div class="row">
                                                    <div class="col-lg-12 mt-1">
                                                        <h6>Corporate Mode</h6>
                                                    </div>
                                                    <div class="col-lg-12 mt-2 mb-1">
                                                        <select id="corpor_mode_select`+i+`" class="corpor_select_cls nice-select-default" style="width:100%;">
                                                            `+cor_resp+`
                                                        </select>
                                                    </div>
                                                    <div class="col-lg-12">`;
                                                        if(msg.result.response[i].customer_parents.length != 0){
                                                            if(user_login.hasOwnProperty('co_customer_parent_type_name') == false && user_login.co_agent_frontend_security.includes('corp_limitation') == false){
                                                                response+=`<button type="button" class="mt-1 primary-btn-custom corpor-mode-btn" onclick="activate_corporate_mode(`+i+`);">Change Mode</button>`;
                                                            }else{
                                                                response+=`<button type="button" class="mt-1 primary-btn-custom corpor-mode-btn" onclick="deactivate_corporate_mode();">Exit Mode</button>`;
                                                            }
                                                        }
                                                    response += `
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            }
                            response+=`
                        </div>`;
                    }
                    if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'passenger' || window.location.href.split('/')[window.location.href.split('/').length-2] == 'passenger' || window.location.href.split('/')[window.location.href.split('/').length-1] == 'issued_offline'){
                        document.getElementById('button_move_footer').innerHTML=`
                        <div class="row pt-3 pb-1">
                            <div class="col-lg-12">
                                <h6>Move to Booker / Passenger</h6>
                            </div>
                            <div class="col-xs-6">
                                <button type="button" style="width:100%;" class="primary-btn-white" id="move_btn" onclick="reset_pax_cache();">Reset</button>
                            </div>
                            <div class="col-xs-6">
                                <button type="button" style="width:100%;" class="primary-btn" id="move_btn" onclick="move_pax_cache();">Move all</button>
                            </div>
                        </div>`;
                    }

                    response+=`</div>`;
                    document.getElementById('passenger_chosen').innerHTML = response;

                    new jBox('Image', {
                      imageCounter: true,
                      imageCounterSeparator: ' of '
                    });

                    for(i in msg.result.response){
                        if(msg.result.response[i].customer_parents.length != 0){
                            response_corporate = '';
                            for(j in msg.result.response[i].customer_parents){
                                response_corporate+= "• <span style='color:"+color+";'>Corporate Booker</span><br/>" + msg.result.response[i].customer_parents[j].type + ' - ' + msg.result.response[i].customer_parents[j].name + ' <br/> ' + msg.result.response[i].customer_parents[j].currency + ' ' + getrupiah(msg.result.response[i].customer_parents[j].actual_balance) + '<br/>';
                            }

                            new jBox('Tooltip', {
                                 attach: '#pop_corporate_detail'+i,
                                 theme: 'TooltipBorder',
                                 width: 280,
                                 position: {
                                   x: 'center',
                                   y: 'bottom'
                                 },
                                 closeOnMouseleave: true,
                                 animation: 'zoomIn',
                                 content: response_corporate
                            });
                        }

                        if(msg.result.response[i].hasOwnProperty('behaviors') && Object.keys(msg.result.response[i].behaviors).length > 0){
                            print_pop_behavior = false;
                            response_pop_behavior = '';
                            for(j in msg.result.response[i].behaviors){
                                print_pop_behavior = true;
                                response_pop_behavior+=`<b><i class="fas fa-angle-right"></i> `+j+`</b><br/>`;
                                response_pop_behavior+=`<span>`+msg.result.response[i].behaviors[j]+`</span><br/>`;
                            }
                            if(print_pop_behavior){
                                new jBox('Tooltip', {
                                    attach: '#pop_chosen_behavior_detail'+i,
                                    target: '#pop_chosen_behavior_detail'+i,
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
                                    content: response_pop_behavior,
                                    onOpen: function () {
                                      this.source.addClass('active').html('Close <i class="fas fa-chevron-up"></i>');
                                    },
                                    onClose: function () {
                                      this.source.removeClass('active').html('See Behaviors History <i class="fas fa-chevron-down"></i>');
                                    }
                                });

                            }
                        }

                        if(msg.result.response[i].hasOwnProperty('frequent_flyers') && msg.result.response[i].frequent_flyers.length > 0){
                            if(document.URL.split('/')[document.URL.split('/').length-2] == 'passenger' && document.URL.split('/')[document.URL.split('/').length-3] == 'airline'){
                                for(x in ff_request){
                                    $('#frequent_flyer'+i+'_'+x).niceSelect();
                                }
                            }
                        }
                    }
                    $('.phone_chosen_cls').niceSelect();
                    $('.corpor_select_cls').niceSelect();
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

function move_pax_cache(){
    cache_error_log = '';
    for(i in passenger_data_cache){
        cache_check = 0;
        if(document.getElementById('selection_type'+i).value){
            if(document.getElementById('identity_chosen'+i)){
                //jika ada identity
                if(document.getElementById('identity_chosen'+i).value == "all_identity"){
                    cache_error_log+= 'Please choose identity type for user '+(parseInt(i)+1)+'!</br>\n';
                    $("#identity_chosen"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
                }else{
                    $("#identity_chosen"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid #cdcdcd');
                    });
                    cache_check = 1;
                }
            }else{
                // copy no identity
                cache_check = 1;
            }
        }else{
            $("#identity_chosen"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #cdcdcd');
            });
        }
        if(cache_check == 1){
            update_customer_cache_list(i);
        }
    }

    if(cache_error_log != ''){
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">'+ cache_error_log +' </span>',
        });
    }else{
        document.getElementById('show_error_log').innerHTML = '';
        on_off_overlay_bar('box-passenger-db', 'overlay_box_passenger_db'); clear_search_pax('passenger','');
    }
}

function reset_pax_cache(){
    for(i in passenger_data_cache){
        document.getElementById('selection_type'+i).value = '';
        for(j in document.getElementById('selection_type'+i).options){
            document.getElementById('selection_type'+i).options[j].disabled = false;
        }
        $('#selection_type'+i).niceSelect('update');
    }
}

function edit_passenger_cache(val){
    for_jbox_image++;
    //clear data
    document.getElementById('div_avatar_passport').innerHTML = '';
    document.getElementById('attachment1').innerHTML = '';
    document.getElementById('selectedFiles_attachment_edit1').innerHTML = '';
    document.getElementById('files_attachment_edit1').value = ''
    if(!/safari/i.test(navigator.userAgent)){
      document.getElementById('files_attachment_edit1').type = ''
      document.getElementById('files_attachment_edit1').type = 'file'
    }
    document.getElementById('passenger_edit_identity_number1').value = '';
    $("passenger_edit_identity_expired_date1").val("");
    $('#passenger_edit_identity_country_of_issued1_id').val('').trigger('change');

    document.getElementById('div_avatar_ktp').innerHTML = '';
    document.getElementById('attachment2').innerHTML = '';
    document.getElementById('selectedFiles_attachment_edit2').innerHTML = '';
    document.getElementById('files_attachment_edit2').value = ''
    if(!/safari/i.test(navigator.userAgent)){
      document.getElementById('files_attachment_edit2').type = ''
      document.getElementById('files_attachment_edit2').type = 'file'
    }
    document.getElementById('passenger_edit_identity_number2').value = '';
    $("passenger_edit_identity_expired_date2").val("");
    $('#passenger_edit_identity_country_of_issued2_id').val('').trigger('change');

    document.getElementById('div_avatar_sim').innerHTML = '';
    document.getElementById('attachment3').innerHTML = '';
    document.getElementById('selectedFiles_attachment_edit3').innerHTML = '';
    document.getElementById('files_attachment_edit3').value = ''
    if(!/safari/i.test(navigator.userAgent)){
      document.getElementById('files_attachment_edit3').type = ''
      document.getElementById('files_attachment_edit3').type = 'file'
    }
    document.getElementById('passenger_edit_identity_number3').value = '';
    $("passenger_edit_identity_expired_date3").val("");
    $('#passenger_edit_identity_country_of_issued3_id').val('').trigger('change');

    document.getElementById('div_avatar_other').innerHTML = '';
    document.getElementById('attachment4').innerHTML = '';
    document.getElementById('selectedFiles_attachment_edit4').innerHTML = '';
    document.getElementById('files_attachment_edit4').value = ''
    if(!/safari/i.test(navigator.userAgent)){
      document.getElementById('files_attachment_edit4').type = ''
      document.getElementById('files_attachment_edit4').type = 'file'
    }
    document.getElementById('passenger_edit_identity_number4').value = '';
    $("passenger_edit_identity_expired_date4").val("");
    $('#passenger_edit_identity_country_of_issued4_id').val('').trigger('change');

    document.getElementById('passenger_edit_phone_table').innerHTML = '';

    passenger_data_edit_phone = 0;
    passenger_data_edit_ff = 0;
    passenger_cache_pick = val;
    //avatar
    if(passenger_data_cache[val].face_image.length > 0){
        text = '';
        text += `
            <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                    <img src="`+passenger_data_cache[val].face_image[0]+`" alt="User" class="picture_passenger_agent">
                </div>
            </div>
        `;
        document.getElementById('div_avatar').innerHTML = text
        document.getElementById('div_avatar').hidden = false;
    }else{
        document.getElementById('div_avatar').hidden = true;
    }
    document.getElementById('passenger_edit_title').value = passenger_data_cache[val].title;
    if(agent_security.includes('p_cache_3') == false){
        document.getElementById('passenger_edit_title').readOnly = true;
        for(i in document.getElementById('passenger_edit_title').options){
            if(document.getElementById('passenger_edit_title').options[i].selected != true)
                document.getElementById('passenger_edit_title').options[i].disabled = true;
        }
    }
    $('#passenger_edit_title').niceSelect('update');
    if(agent_security.includes('p_cache_3') == true){
        document.getElementById('passenger_first_name_div').innerHTML = `<input type="text" style="margin-bottom:0px;" onchange="capitalizeInput('passenger_edit_first_name');" class="form-control" name="passenger_edit_first_name" id="passenger_edit_first_name" placeholder="First Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'First Name '" value='`+passenger_data_cache[val].first_name+`'>`;
        document.getElementById('passenger_last_name_div').innerHTML = `<input type="text" style="margin-bottom:0px;" onchange="capitalizeInput('passenger_edit_last_name');" class="form-control" name="passenger_edit_last_name" id="passenger_edit_last_name" placeholder="Last Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Last Name '" value='`+passenger_data_cache[val].last_name+`'>`;
    }else{
        document.getElementById('passenger_first_name_div').innerHTML = `<span id="passenger_edit_first_name">`+passenger_data_cache[val].first_name+`</label>`;
        document.getElementById('passenger_last_name_div').innerHTML = `<span id="passenger_edit_last_name">`+passenger_data_cache[val].last_name+`</label>`;
    }
    if(passenger_data_cache[val].birth_date != ''){
        $('input[name="passenger_edit_birth_date"]').val(passenger_data_cache[val].birth_date);
        if(agent_security.includes('p_cache_3') == true)
            document.getElementById('passenger_edit_birth_date').disabled = false;
        else
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
            text+=`
                <div class='row' id="phone_cache`+parseInt(parseInt(i)+1)+`_id">
                    <div class="col-lg-12">
                        <h6 style="color:`+color+`;">#`+(parseInt(i)+1)+` Phone</h6>
                    </div>
                    <div class="col-xs-4">
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
                    <div class="col-xs-6">
                        <label>Phone Number</label><br/>
                        <div class="form-select">
                            <div class="input-container-search-ticket">
                                <input type="text" class="form-control" name="passenger_edit_phone_number`+parseInt(parseInt(i)+1)+`" id="passenger_edit_phone_number`+parseInt(parseInt(i)+1)+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" value="`+passenger_data_cache[val].phones[i].calling_number+`">
                            </div>
                        </div>
                    </div>`;
            }else{
                text+=`
                    <div class="col-xs-6">
                        <label>Phone Number</label><br/>
                        <div class="form-select">
                            <div class="input-container-search-ticket">
                                <input type="text" class="form-control" name="passenger_edit_phone_number`+parseInt(parseInt(i)+1)+`" id="passenger_edit_phone_number`+parseInt(parseInt(i)+1)+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" value="">
                            </div>
                        </div>
                    </div>`;
            }

            text+=`
                    <div class="col-xs-2" style="margin-top:25px; padding:0px;">
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

    text = '';
    if(passenger_data_cache[val].hasOwnProperty('frequent_flyers') && passenger_data_cache[val].frequent_flyers.length != 0){
        for(i in passenger_data_cache[val].frequent_flyers){
            text+=`
                <div class='row' id="ff`+parseInt(parseInt(i)+1)+`_id">
                    <div class="col-lg-12">
                        <h6 style="color:`+color+`;">#`+(parseInt(i)+1)+` Frequent Flyer</h6>
                    </div>

                    <div class="col-sm-5 col-xs-12">
                        <label>Frequent Flyer</label><br/>
                        <div class="form-select">
                            <select class="form-control js-example-basic-single" name="passenger_edit_ff`+parseInt(parseInt(i)+1)+`_id" style="width:100%;" id="passenger_edit_ff`+parseInt(parseInt(i)+1)+`_id">`;
                                for(j in frequent_flyer_data){
                                    text += `<option value="`+frequent_flyer_data[j].code+`"`;
                                    if(passenger_data_cache[val].frequent_flyers[i].ff_code == frequent_flyer_data[j].code)
                                        text += `selected`;
                                    text+=`>`+frequent_flyer_data[j].name+`</option>`;
                                }
                            text+=`</select>
                        </div>
                    </div>
                    <div class="col-sm-5 col-xs-8">
                        <label>Frequent Flyer Number</label><br/>
                        <div class="form-select">
                            <div class="input-container-search-ticket">
                                <input type="text" class="form-control" name="passenger_edit_ff_number`+parseInt(parseInt(i)+1)+`" id="passenger_edit_ff_number`+parseInt(parseInt(i)+1)+`" placeholder="Frequent Flyer Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Frequent Flyer Number '" value="`+passenger_data_cache[val].frequent_flyers[i].ff_number+`">
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-2 col-xs-4" style="margin-top:25px; padding:0px">
                        <button type="button" class="primary-delete-date" onclick="delete_frequent_flyer_cache(`+parseInt(parseInt(i)+1)+`)">
                            <i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i>
                        </button>
                    </div>
                </div>`;

            passenger_data_edit_ff = parseInt(parseInt(i) + 1)
        }
        document.getElementById('passenger_edit_ff_table').innerHTML = text;
        for(i in passenger_data_cache[val].frequent_flyers){
            $('#passenger_edit_ff'+parseInt(parseInt(i)+1)+'_id').select2();
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
    var draw_image_identity_text = '';
    for(i in passenger_data_cache[val].identities){
        if(i == 'passport'){
            text = '';
            draw_image_identity_text = '';
            document.getElementById('passenger_edit_identity_number1').value = passenger_data_cache[val].identities[i].identity_number;
            document.getElementById('passenger_edit_identity_expired_date1').value = passenger_data_cache[val].identities[i].identity_expdate;
            document.getElementById('select2-passenger_edit_identity_country_of_issued1_id-container').innerHTML = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            document.getElementById('passenger_edit_identity_country_of_issued1').value = passenger_data_cache[val].identities[i].identity_country_of_issued_name;

            //identity cenius edit passport attachment dan shownya done
            if(passenger_data_cache[val].identities[i].identity_images.length != 0){
                draw_image_identity_text+=`
                <h6 style="text-transform: capitalize; margin-bottom:10px;">`+i+` - `+passenger_data_cache[val].identities[i].identity_number+`</h6>
                <div class="row">
                <div class="col-lg-12" id="div_identity_chosen`+i+`" style="background:#f7f7f7; padding-top:15px; border:1px solid #cdcdcd; max-height:200px; overflow-x:auto; margin-bottom:15px;">`;
                for(j in passenger_data_cache[val].identities[i].identity_images){
                    text+= `
                    <div class="col-lg-12">
                        <div style="border:1px solid #cdcdcd; margin-bottom:15px;">
                            <div class="row">
                                <div class="col-lg-12 mb-2" style="text-align:center;">
                                    <img class="mb-2" src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities[i].identity_images[j][1]+`" id="`+i+j+`_image" style="height:220px;width:auto" />
                                    <h6 class="mb-2">`+passenger_data_cache[val].identities[i].identity_images[j][2]+`</h6>
                                </div>
                            </div>
                        </div>
                    </div>`;

                    draw_image_identity_text += `
                    <div class="row">
                        <div class="col-lg-3 col-md-4 col-sm-4">
                            <a class="demo-img" href="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" data-jbox-image="10showidentityeditpassport`+for_jbox_image+`" title="`+i+` - `+passenger_data_cache[val].identities[i].identity_number+` (`+passenger_data_cache[val].identities[i].identity_images[j][2]+`)">
                                <img src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="`+i+`" class="picture_identity_customer">
                            </a>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:5px;">
                            <h6 class="mb-2">`+passenger_data_cache[val].identities[i].identity_images[j][2]+`</h6>
                            <b>Upload date:</b><br/>
                            <i>
                                `+moment(passenger_data_cache[val].identities[i].identity_images[j][3]).format('DD MMM YYYY - HH:mm')+`
                            </i>
                            <div class="row">
                                <div class="col-lg-12" style="padding-top:5px;">
                                    <label class="check_box_custom mt-">
                                        <span style="font-size:13px;">Delete</span>
                                        <input type="checkbox" value="" id="`+i+j+`_delete" name="`+i+j+`_delete">
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <br/>
                        </div>
                    </div>`;
                }
                draw_image_identity_text+=`</div></div>`;
            }

            if(draw_image_identity_text != ''){
                document.getElementById('div_avatar_passport').innerHTML = draw_image_identity_text;
                document.getElementById('div_avatar_passport').hidden = false;
                new jBox('Image', {
                  imageCounter: true,
                  imageCounterSeparator: ' of '
                });
            }else{
                document.getElementById('div_avatar_passport').hidden = true;
            }

            document.getElementById('attachment1').innerHTML = text;
        }else if(i == 'ktp'){
            text = '';
            draw_image_identity_text = '';
            document.getElementById('passenger_edit_identity_number2').value = passenger_data_cache[val].identities[i].identity_number;
            document.getElementById('passenger_edit_identity_expired_date2').value = passenger_data_cache[val].identities[i].identity_expdate;
            document.getElementById('select2-passenger_edit_identity_country_of_issued2_id-container').innerHTML = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            document.getElementById('passenger_edit_identity_country_of_issued2').value = passenger_data_cache[val].identities[i].identity_country_of_issued_name;

            //identity cenius edit ktp attachment dan shownya done
            if(passenger_data_cache[val].identities[i].identity_images.length != 0){
                draw_image_identity_text+=`
                <h6 style="text-transform: capitalize;">`+i+` - `+passenger_data_cache[val].identities[i].identity_number+`</h6>
                <div style="width:100%; margin-bottom:15px; display:inline-flex; overflow-x: auto; white-space: nowrap;">`;
                for(j in passenger_data_cache[val].identities[i].identity_images){
                    text+= `
                    <div class="col-lg-6">
                        <div style="border:1px solid #cdcdcd; margin-bottom:15px;">
                            <div class="row">
                                <div class="col-lg-12 mb-2" style="text-align:center;">
                                    <img class="mb-2" src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities[i].identity_images[j][1]+`" id="`+i+j+`_image" style="height:220px;width:auto" />
                                    <h6 class="mb-2">`+passenger_data_cache[val].identities[i].identity_images[j][2]+`</h6>
                                </div>
                                <div class="col-lg-12" style="float:right; margin-left:15px;">
                                    <label class="check_box_custom">
                                        <span style="font-size:13px;">Delete</span>
                                        <input type="checkbox" value="" id="`+i+j+`_delete" name="`+i+j+`_delete">
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>`;

                    draw_image_identity_text += `
                    <div style="width:220px; text-align:center; margin:0px 10px 10px 10px;">
                        <a class="demo-img" href="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" data-jbox-image="11showidentityeditpassport`+for_jbox_image+`" title="`+i+` - `+passenger_data_cache[val].identities[i].identity_number+` (`+passenger_data_cache[val].identities[i].identity_images[j][2]+`)">
                            <img src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="`+i+`" class="picture_identity_customer">
                        </a><br/>
                        <h6 class="mb-2" style="white-space: normal; width:220px; word-break: break-word; padding:0px 15px;">`+passenger_data_cache[val].identities[i].identity_images[j][2]+`</h6>
                        <i>
                            Upload date<br/>
                            `+moment(passenger_data_cache[val].identities[i].identity_images[j][3]).format('DD MMM YYYY - HH:mm')+`
                        </i>
                    </div>`;
                }
                draw_image_identity_text+=`</div>`;
            }

            if(draw_image_identity_text != ''){
                document.getElementById('div_avatar_ktp').innerHTML = draw_image_identity_text;
                document.getElementById('div_avatar_ktp').hidden = false;
                new jBox('Image', {
                  imageCounter: true,
                  imageCounterSeparator: ' of '
                });
            }else{
                document.getElementById('div_avatar_ktp').hidden = true;
            }
            document.getElementById('attachment2').innerHTML = text;
        }else if(i == 'sim'){
            text = '';
            draw_image_identity_text = '';
            document.getElementById('passenger_edit_identity_number3').value = passenger_data_cache[val].identities[i].identity_number;
            document.getElementById('passenger_edit_identity_expired_date3').value = passenger_data_cache[val].identities[i].identity_expdate;
            document.getElementById('select2-passenger_edit_identity_country_of_issued3_id-container').innerHTML = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            document.getElementById('passenger_edit_identity_country_of_issued3').value = passenger_data_cache[val].identities[i].identity_country_of_issued_name;

            //identity cenius edit sim attachment dan shownya done
            if(passenger_data_cache[val].identities[i].identity_images.length != 0){
                draw_image_identity_text+=`
                <h6 style="text-transform: capitalize;">`+i+` - `+passenger_data_cache[val].identities[i].identity_number+`</h6>
                <div style="width:100%; margin-bottom:15px; display:inline-flex; overflow-x: auto; white-space: nowrap;">`;
                for(j in passenger_data_cache[val].identities[i].identity_images){
                    text+= `
                    <div class="col-lg-6">
                        <div style="border:1px solid #cdcdcd; margin-bottom:15px;">
                            <div class="row">
                                <div class="col-lg-12 mb-2" style="text-align:center;">
                                    <img class="mb-2" src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities[i].identity_images[j][1]+`" id="`+i+j+`_image" style="height:220px;width:auto" />
                                    <h6 class="mb-2">`+passenger_data_cache[val].identities[i].identity_images[j][2]+`</h6>
                                </div>
                                <div class="col-lg-12" style="float:right; margin-left:15px;">
                                    <label class="check_box_custom">
                                        <span style="font-size:13px;">Delete</span>
                                        <input type="checkbox" value="" id="`+i+j+`_delete" name="`+i+j+`_delete">
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>`;

                    draw_image_identity_text += `
                    <div style="width:220px; text-align:center; margin:0px 10px 10px 10px;">
                        <a class="demo-img" href="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" data-jbox-image="12showidentityeditpassport`+for_jbox_image+`" title="`+i+` - `+passenger_data_cache[val].identities[i].identity_number+` (`+passenger_data_cache[val].identities[i].identity_images[j][2]+`)">
                            <img src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="`+i+`" class="picture_identity_customer">
                        </a><br/>
                        <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+passenger_data_cache[val].identities[i].identity_images[j][2]+`</h6>
                        <i>
                            Upload date<br/>
                            `+moment(passenger_data_cache[val].identities[i].identity_images[j][3]).format('DD MMM YYYY - HH:mm')+`
                        </i>
                    </div>`;
                }
                draw_image_identity_text+=`</div>`;
            }

            if(draw_image_identity_text != ''){
                document.getElementById('div_avatar_sim').innerHTML = draw_image_identity_text;
                document.getElementById('div_avatar_sim').hidden = false;
                new jBox('Image', {
                  imageCounter: true,
                  imageCounterSeparator: ' of '
                });
            }else{
                document.getElementById('div_avatar_sim').hidden = true;
            }
            document.getElementById('attachment3').innerHTML = text;
        }else if(i == 'other'){
            text = '';
            draw_image_identity_text = '';
            document.getElementById('passenger_edit_identity_number4').value = passenger_data_cache[val].identities[i].identity_number;
            document.getElementById('passenger_edit_identity_expired_date4').value = passenger_data_cache[val].identities[i].identity_expdate;
            document.getElementById('select2-passenger_edit_identity_country_of_issued4_id-container').innerHTML = passenger_data_cache[val].identities[i].identity_country_of_issued_name;
            document.getElementById('passenger_edit_identity_country_of_issued4').value = passenger_data_cache[val].identities[i].identity_country_of_issued_name;

            //identity cenius edit ot attachment dan shownya done
            if(passenger_data_cache[val].identities[i].identity_images.length != 0){
                draw_image_identity_text+=`
                <h6 style="text-transform: capitalize;">`+i+` - `+passenger_data_cache[val].identities[i].identity_number+`</h6>
                <div style="width:100%; margin-bottom:15px; display:inline-flex; overflow-x: auto; white-space: nowrap;">`;
                for(j in passenger_data_cache[val].identities[i].identity_images){
                    text+= `
                    <div class="col-lg-6">
                        <div style="border:1px solid #cdcdcd; margin-bottom:15px;">
                            <div class="row">
                                <div class="col-lg-12 mb-2" style="text-align:center;">
                                    <img class="mb-2" src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities[i].identity_images[j][1]+`" id="`+i+j+`_image" style="height:220px;width:auto" />
                                    <h6 class="mb-2">`+passenger_data_cache[val].identities[i].identity_images[j][2]+`</h6>
                                </div>
                                <div class="col-lg-12" style="float:right; margin-left:15px;">
                                    <label class="check_box_custom">
                                        <span style="font-size:13px;">Delete</span>
                                        <input type="checkbox" value="" id="`+i+j+`_delete" name="`+i+j+`_delete">
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>`;

                    draw_image_identity_text += `
                    <div style="width:220px; text-align:center; margin:0px 10px 10px 10px;">
                        <a class="demo-img" href="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" data-jbox-image="13showidentityeditpassport`+for_jbox_image+`" title="`+i+` - `+passenger_data_cache[val].identities[i].identity_number+` (`+passenger_data_cache[val].identities[i].identity_images[j][2]+`)">
                            <img src="`+passenger_data_cache[val].identities[i].identity_images[j][0]+`" alt="`+i+`" class="picture_identity_customer">
                        </a><br/>
                        <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+passenger_data_cache[val].identities[i].identity_images[j][2]+`</h6>
                        <i>
                            Upload date<br/>
                            `+moment(passenger_data_cache[val].identities[i].identity_images[j][3]).format('DD MMM YYYY - HH:mm')+`
                        </i>
                    </div>`;
                }
                draw_image_identity_text+=`</div>`;
            }

            if(draw_image_identity_text != ''){
                document.getElementById('div_avatar_other').innerHTML = draw_image_identity_text;
                document.getElementById('div_avatar_other').hidden = false;
                new jBox('Image', {
                  imageCounter: true,
                  imageCounterSeparator: ' of '
                });
            }else{
                document.getElementById('div_avatar_other').hidden = true;
            }
            document.getElementById('attachment4').innerHTML = text;
        }
    }
    document.getElementById('passenger_chosen').hidden = true;
    document.getElementById('passenger_update').hidden = false;
}

function activate_corporate_mode(val){
    $('.corpor-mode-btn').prop('disabled', true);
    $('.corpor-mode-btn').addClass("running");
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'activate_corporate_mode',
       },
       data: {
        'customer_seq_id': passenger_data_cache[val].seq_id,
        'customer_parent_seq_id': document.getElementById('corpor_mode_select'+val).value,
        'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                let timerInterval
                Swal.fire({
                  type: 'success',
                  title: 'Corporate Mode Activated!',
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
                window.location.href='/';
           }
           else{
             $('.corpor-mode-btn').prop('disabled', false);
             $('.corpor-mode-btn').removeClass("running");
             Swal.fire({
               type: 'error',
               title: 'Oops!',
               text: "Cannot activate corporate mode!",
             })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error activating corporate mode');
       },timeout: 60000
    });
}

function deactivate_corporate_mode(){
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'deactivate_corporate_mode',
       },
       data: {
        'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                window.location.href='/';
           }
           else{
             Swal.fire({
               type: 'error',
               title: 'Oops!',
               text: "Cannot deactivate corporate mode!",
             })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error deactivating corporate mode');
       },timeout: 60000
    });
}

function delete_phone_passenger_cache(val){
    try{
        document.getElementById(`phone`+val+`_id`).remove();
    }catch(err){
        console.log(err); //error tidak ada element phone passenger
        try{
            document.getElementById(`phone_cache`+val+`_id`).remove();
        }catch(err){
            console.log(err); //error tidak ada element phone cache
        }
    }
}

function add_phone_passenger_edit_cache(){
    text = '';
    var node = document.createElement("div");
    node.setAttribute('id', "phone_cache`+passenger_data_edit_phone+`_id");
    passenger_data_edit_phone = parseInt(parseInt(passenger_data_edit_phone) + 1);
    text+=`
        <div class='row' id="phone_cache`+passenger_data_edit_phone+`_id">
            <div class="col-lg-12">
                <h6 style="color:`+color+`;">#`+passenger_data_edit_phone+` Phone</h6>
            </div>
            <div class="col-xs-4">
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
            <div class="col-xs-6">
                <label>Phone Number</label><br/>
                <div class="form-select">
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="passenger_edit_phone_number`+passenger_data_edit_phone+`" id="passenger_edit_phone_number`+passenger_data_edit_phone+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" value="">
                    </div>
                </div>
            </div>
            <div class="col-xs-2" style="margin-top:25px; padding:0px;">
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
    var node = document.createElement("div");
    text+=`
        <div class='row' id="phone`+passenger_data_phone+`_id">
            <div class="col-lg-12">
                <h6 style="color:`+color+`;">#`+passenger_data_phone+` Phone</h6>
            </div>
            <div class="col-xs-4">
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
            <div class="col-xs-6">
                <label>Phone Number</label><br/>
                <div class="form-select">
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="passenger_phone_number`+passenger_data_phone+`" id="passenger_phone_number`+passenger_data_phone+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" value="">
                    </div>
                </div>
            </div>
            <div class="col-xs-2" style="margin-top:25px; padding:0px;">
                <button type="button" class="primary-delete-date" onclick="delete_phone_passenger_cache(`+passenger_data_phone+`)">
                    <i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i>
                </button>
            </div>
            <div class="col-lg-12">
                <br/>
            </div>
        </div>`;
    node.innerHTML = text;
    document.getElementById('passenger_phone_table').appendChild(node);
    document.getElementById('passenger_phone_code'+passenger_data_phone).value = '62';
    $('#passenger_phone_code'+passenger_data_phone+'_id').select2();
}

function add_frequent_flyer_edit_cache(){
    text = '';
    var node = document.createElement("div");
    node.setAttribute('id', "ff`+passenger_data_edit_ff+`_id");
    passenger_data_edit_ff = parseInt(parseInt(passenger_data_edit_ff) + 1);
    text+=`
        <div class='row' id="ff`+passenger_data_edit_ff+`_id">
            <div class="col-lg-12">
                <h6 style="color:`+color+`;">#`+passenger_data_edit_ff+` Frequent Flyer</h6>
            </div>
            <div class="col-sm-5 col-xs-12">
                <label>Frequent Flyer</label><br/>
                <div class="form-select">
                    <select class="form-control js-example-basic-single" name="passenger_edit_ff`+passenger_data_edit_ff+`_id" style="width:100%;" id="passenger_edit_ff`+passenger_data_edit_ff+`_id" placeholder="Nationality">
                        <option val="">Frequent Flyer</option>`;
                        for(j in frequent_flyer_data){
                            text += `<option value="`+frequent_flyer_data[j].code+`">`+frequent_flyer_data[j].name+`</option>`;
                        }
                    text+=`</select>
                </div>
            </div>
            <div class="col-sm-5 col-xs-8">
                <label>Frequent Flyer Number</label><br/>
                <div class="form-select">
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="passenger_edit_ff_number`+passenger_data_edit_ff+`" id="passenger_edit_ff_number`+passenger_data_edit_ff+`" placeholder="Frequent Flyer Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Frequent Flyer Number '" value="">
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-xs-4" style="margin-top:25px; padding:0px">
                <button type="button" class="primary-delete-date" onclick="delete_frequent_flyer_cache(`+passenger_data_edit_ff+`)">
                    <i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i>
                </button>
            </div>
            <div class="col-lg-12">
                <br/>
            </div>
        </div>`;
    node.innerHTML = text;
    document.getElementById('passenger_edit_ff_table').appendChild(node);
    $('#passenger_edit_ff'+passenger_data_edit_ff+'_id').select2();
}

function add_frequent_flyer_cache(){
    text = '';
    passenger_ff_data = passenger_ff_data + 1;
    var node = document.createElement("div");
    text+=`
        <div class='row' id="ff`+passenger_ff_data+`_id">
            <div class="col-lg-12">
                <h6 style="color:`+color+`;">#`+passenger_ff_data+` Frequent Flyer</h6>
            </div>
            <div class="col-sm-5 col-xs-12">
                <label>Frequent Flyer</label><br/>
                <div class="form-select">
                    <select class="form-control js-example-basic-single" name="passenger_ff`+passenger_ff_data+`_id" style="width:100%;" id="passenger_ff`+passenger_ff_data+`_id" placeholder="Nationality" onchange="auto_complete('passenger_ff`+passenger_ff_data+`')" class="nice-select-default">
                        <option val="">Frequent Flyer</option>`;
                        for(j in frequent_flyer_data){
                            text += `<option value="`+frequent_flyer_data[j].code+`">`+frequent_flyer_data[j].name+`</option>`;
                        }
                    text+=`</select>
                </div>
                <input type="hidden" name="passenger_ff`+passenger_ff_data+`" id="passenger_ff`+passenger_ff_data+`" />
            </div>
            <div class="col-sm-5 col-xs-8">
                <label>Frequent Flyer Number</label><br/>
                <div class="form-select">
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="passenger_ff_number`+passenger_ff_data+`" id="passenger_ff_number`+passenger_ff_data+`" placeholder="Frequent Flyer Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Frequent Flyer Number '" value="">
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-xs-4" style="margin-top:25px; padding:0px">
                <button type="button" class="primary-delete-date" onclick="delete_frequent_flyer_cache(`+passenger_ff_data+`)">
                    <i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i>
                </button>
            </div>
            <div class="col-lg-12">
                <br>
            </div>
        </div>`;
    node.innerHTML = text;
    document.getElementById('passenger_frequent_flyer_table').appendChild(node);
    $('#passenger_ff'+passenger_ff_data+'_id').select2();
}

function delete_frequent_flyer_cache(val){
    try{
        document.getElementById(`ff`+val+`_id`).remove();
    }catch(err){
        console.log(err); //error tidak ada element ff passenger
        try{
            document.getElementById(`ff_cache`+val+`_id`).remove();
        }catch(err){
            console.log(err); //error tidak ada element ff cache
        }
    }
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
        data = document.getElementById('selection_type'+val).value.replace(/[0-9]/g, '');
        if(msg.result.error_code==0){
            passenger_data_cache = msg.result.response;
        }
        check = 0;
        years_old = moment(passenger_data_cache[val].birth_date, "DD MMM YYYY");
        years_old = parseInt(Math.abs(moment(new Date()) - years_old)/31536000000)
        if(document.URL.split('/')[document.URL.split('/').length-3] == 'airline' || document.URL.split('/')[document.URL.split('/').length-2] == 'visa' || document.URL.split('/')[document.URL.split('/').length-1] == 'issued_offline' || document.URL.split('/')[document.URL.split('/').length-2] == 'tour'){
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
        if(check == 0){
            pick_passenger_cache(val);
        }
        else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: "<span>"+data+" years old doesn't match </span>",
            })
        }
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
    var identity_choose = null;
    try{ //pakai try catch karena if tetap lolos jika id tidak ada
        identity_choose = document.getElementById('identity_chosen'+val).value;
    }catch(err){console.log(err);}
    if("booker_with_adult".includes(passenger_pick+passenger_pick_number) == false){
        //pax
        var index = 0;
        var temp_data = '';
        for(i in passenger_data_cache[val].identities){
            if(index != 0)
                temp_data += '~';
            temp_data += i + ',' + passenger_data_cache[val].identities[i].identity_number + ',' + passenger_data_cache[val].identities[i].identity_country_of_issued_name + ',' + passenger_data_cache[val].identities[i].identity_expdate;
            index++;
        }
        var data = temp_data.split('~');
        var selection = null;
        var need_identity = null;
        if(identity_choose == null)
            pick_passenger_cache_copy(val, '');
        else
            pick_passenger_cache_copy(val, identity_choose.split(' - ')[0]);
    }else{
        //booker
        pick_passenger_cache_copy(val, '');
    }

}

function pick_passenger_cache_copy(val, identity){
    for_jbox_image++;
    var passenger_pick = document.getElementById('selection_type'+val).value.replace(/[^a-zA-Z ]/g,"");
    var passenger_pick_number = document.getElementById('selection_type'+val).value.replace( /^\D+/g, '');
    var copy_booker = false;

    if(passenger_pick == 'bookerwithadult'){
        passenger_pick = 'booker';
        copy_booker = true;
    }
    check = 0;
    for(i in passenger_data_pick){
        if(passenger_data_pick[i].seq_id == passenger_data_cache[val].seq_id && passenger_data_pick[i].sequence != 'booker')
            check = 1;
    }
    if(check == 0){
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence == passenger_pick+passenger_pick_number){
                passenger_data_pick.splice(i,1);
                break;
            }
        }
        title_found = false;
        for(i in document.getElementById(passenger_pick+'_title'+passenger_pick_number).options){
            if(document.getElementById(passenger_pick+'_title'+passenger_pick_number).options[i].value == passenger_data_cache[val].title){
                document.getElementById(passenger_pick+'_title'+passenger_pick_number).value = passenger_data_cache[val].title;
                title_found = true
                break;
            }
        }
        if(title_found == false && passenger_data_cache[val].title == 'MR') //men
            document.getElementById(passenger_pick+'_title'+passenger_pick_number).value = 'MSTR';
        else if(title_found == false) //woman
            document.getElementById(passenger_pick+'_title'+passenger_pick_number).value = 'MISS';
        for(i in document.getElementById(passenger_pick+'_title'+passenger_pick_number).options){
            if(document.getElementById(passenger_pick+'_title'+passenger_pick_number).options[i].selected != true)
               document.getElementById(passenger_pick+'_title'+passenger_pick_number).options[i].disabled = true;
        }
        $('#'+passenger_pick+'_title'+passenger_pick_number).niceSelect('update');
        document.getElementById(passenger_pick+'_first_name'+passenger_pick_number).value = passenger_data_cache[val].first_name;
        document.getElementById(passenger_pick+'_first_name'+passenger_pick_number).readOnly = true;
        document.getElementById(passenger_pick+'_last_name'+passenger_pick_number).value = passenger_data_cache[val].last_name;
        document.getElementById(passenger_pick+'_last_name'+passenger_pick_number).readOnly = true;
        try{
            document.getElementById(passenger_pick+'_behaviors'+passenger_pick_number).value = JSON.stringify(passenger_data_cache[val].behaviors);
        }catch(err){console.log(err);}
        if(passenger_data_cache[val].nationality_name != '' && passenger_data_cache[val].nationality_name != ''){
            $('#'+passenger_pick+'_nationality'+passenger_pick_number+'_id').val(passenger_data_cache[val].nationality_name).trigger('change');
            $('#'+passenger_pick+'_nationality'+passenger_pick_number+'_id').select2({"disabled":true});
        }
        if(document.getElementById(passenger_pick+'_email'+passenger_pick_number))
            document.getElementById(passenger_pick+'_email'+passenger_pick_number).value = passenger_data_cache[val].email;
        try{
            var phone = document.getElementById('phone_chosen'+val).value;
            document.getElementById(passenger_pick+'_phone_code'+passenger_pick_number).value = phone.split(' - ')[0];
            document.getElementById(passenger_pick+'_phone'+passenger_pick_number).value = phone.split(' - ')[1] != undefined ? phone.split(' - ')[1] : ''; // jika undefined tidak di copy
        }catch(err){
            console.log(err); // error tidak ada id phone_chosen
        }
        document.getElementById(passenger_pick+'_birth_date'+passenger_pick_number).value = passenger_data_cache[val].birth_date;
        document.getElementById(passenger_pick+'_birth_date'+passenger_pick_number).readOnly = true;
        if(passenger_pick == 'booker'){
            //avatar
            if(passenger_data_cache[val].face_image.length > 0){
                text = '';
                text += `
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                            <img src="`+passenger_data_cache[val].face_image[0]+`" alt="User" class="picture_passenger_agent">
                        </div>
                    </div>
                `;
                if(document.getElementById('booker_div_avatar')){
                    document.getElementById('booker_div_avatar').innerHTML = text
                    document.getElementById('booker_div_avatar').hidden = false;
                }
            }else{
                if(document.getElementById('booker_div_avatar'))
                    document.getElementById('booker_div_avatar').hidden = true;
            }
            var temp_data = '';
            var index = 0;
            for(i in passenger_data_cache[val].identities){
                if(index != 0)
                    temp_data += '~';
                temp_data += i + ',' + passenger_data_cache[val].identities[i].identity_number + ',' + passenger_data_cache[val].identities[i].identity_country_of_issued_name + ',' + passenger_data_cache[val].identities[i].identity_expdate;
                index++;
            }
            document.getElementById(passenger_pick+'_id_number').value = temp_data;
        }else{
            //avatar
            if(passenger_data_cache[val].face_image.length > 0){
                text = '';
                text += `
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:center;">
                            <img src="`+passenger_data_cache[val].face_image[0]+`" alt="User" class="picture_passenger_agent">
                        </div>
                    </div>
                `;
                if(document.getElementById(passenger_pick+'_div_avatar'+passenger_pick_number)){
                    document.getElementById(passenger_pick+'_div_avatar'+passenger_pick_number).innerHTML = text
                    document.getElementById(passenger_pick+'_div_avatar'+passenger_pick_number).hidden = false;
                }
            }else{
                if(document.getElementById(passenger_pick+'_div_avatar'+passenger_pick_number))
                    document.getElementById(passenger_pick+'_div_avatar'+passenger_pick_number).hidden = true;
            }
            var index = 0;
            var temp_data = '';
            for(i in passenger_data_cache[val].identities){
                if(index != 0)
                    temp_data += '~';
                temp_data += i + ',' + passenger_data_cache[val].identities[i].identity_number + ',' + passenger_data_cache[val].identities[i].identity_country_of_issued_name + ',' + passenger_data_cache[val].identities[i].identity_expdate;
                index++;
            }
            data_identity = temp_data.split('~');
            var date1 = '';
            var date2 = '';
            var expired = null;
            var need_identity = null;
            var identity_check = true;
            try{
                need_identity = document.getElementById(passenger_pick+'_identity_div'+passenger_pick_number).style.display;
            }catch(err){
                console.log(err); //kalau tidak ada penanda identity required di html
            }
            if(need_identity != 'none'){
                for(i in data_identity){
                    data = data_identity[i].split(',');
                    if(data[3] != ''){
                        //PASSPORT SIM
                        date1 = data[3];
                        date2 = moment();
                        expired = date2.diff(date1, 'days');
                    }else{
                        // KTP
                    }
                    try{
                        radios = document.getElementById(passenger_pick+'_id_type'+passenger_pick_number).options;
                    }catch(err){
                        console.log(err);
                    }
                    try{
                        if(radios.length == 0)
                            radios = document.getElementById(passenger_pick+'_identity_type'+passenger_pick_number).options;
                    }catch(err){
                        console.log(err);
                    }

                    if(typeof radios !== 'undefined'){
                        for (var j = 0, length = radios.length; j < length; j++) {
                            if(expired == null || expired < -1){
                                if (radios[j].value == data[0] && identity == '' || radios[j].value == data[0] && identity == data[0]) {
                                    if(data[0] != ''){
                                        identity_check = false;
                                        if(document.getElementById(passenger_pick+'_id_type'+passenger_pick_number))
                                            document.getElementById(passenger_pick+'_id_type'+passenger_pick_number).value = data[0];
                                        else if(document.getElementById(passenger_pick+'_identity_type'+passenger_pick_number))
                                            document.getElementById(passenger_pick+'_identity_type'+passenger_pick_number).value = data[0];
                                        if(data[1] != ''){
                                            if(document.getElementById(passenger_pick+'_passport_number'+passenger_pick_number))
                                                document.getElementById(passenger_pick+'_passport_number'+passenger_pick_number).value = data[1];
                                            else if(document.getElementById(passenger_pick+'_identity_number'+passenger_pick_number))
                                                document.getElementById(passenger_pick+'_identity_number'+passenger_pick_number).value = data[1];
                                        }if(data[4] != '')
                                            if(document.getElementById(passenger_pick+'_passport_expired_date'+passenger_pick_number))
                                                document.getElementById(passenger_pick+'_passport_expired_date'+passenger_pick_number).value = data[3];
                                        if(data[2] != ''){
                                            if(document.getElementById(passenger_pick+'_country_of_issued'+passenger_pick_number)){
                                                document.getElementById('select2-'+passenger_pick+'_country_of_issued'+passenger_pick_number+'_id-container').innerHTML = data[2];
                                                document.getElementById(passenger_pick+'_country_of_issued'+passenger_pick_number).value = data[2];
                                            }
                                        }
                                        $('#'+passenger_pick+'_id_type'+passenger_pick_number).niceSelect('update');
                                        if(passenger_data_cache[val].identities[data[0]].identity_images.length > 0){
                                            text = '';
                                            //identity cenius (copy to booker/paxs dari passenger database only passport) done
                                            text += `
                                                <div class="row">
                                                    <div class="col-lg-12">`;
                                                        text+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;">`+data[0]+` - `+passenger_data_cache[val].identities[data[0]].identity_number+`</label><br/>`;
                                                        text+=`
                                                        <div class="row" style="padding:15px;">
                                                            <div class="col-lg-12" style="background:#f7f7f7; padding-top:15px; border:1px solid #cdcdcd; max-height:200px; overflow-x:auto; margin-bottom:15px;">`;
                                                                for(k in passenger_data_cache[val].identities[data[0]].identity_images){
                                                                    text += `
                                                                    <div class="row">
                                                                        <div class="col-lg-3 col-md-4 col-sm-4">
                                                                            <a class="demo-img" href="`+passenger_data_cache[val].identities[data[0]].identity_images[k][0]+`" data-jbox-image="14showidentity`+val+``+data[0]+``+for_jbox_image+`" title="`+data[0]+` - `+passenger_data_cache[val].identities[data[0]].identity_number+` (`+passenger_data_cache[val].identities[data[0]].identity_images[k][2]+`)">
                                                                                <img src="`+passenger_data_cache[val].identities[data[0]].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                                            </a>
                                                                        </div>
                                                                        <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                                                            <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+passenger_data_cache[val].identities[data[0]].identity_images[k][2]+`</h6>
                                                                            <b>Upload date:</b><br/>
                                                                            <i>
                                                                                `+moment(passenger_data_cache[val].identities[data[0]].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                                            </i>
                                                                        </div>
                                                                        <div class="col-lg-12">
                                                                            <br/>
                                                                        </div>
                                                                    </div>`;
                                                                }
                                                        text+=`</div>
                                                        </div>`;
                                                    text+=`
                                                    </div>
                                                </div>
                                            `;
                                            if(document.getElementById(passenger_pick+'_attachment_identity'+passenger_number)){
                                                text_attachment= '';
                                                for(k in passenger_data_cache[val].identities[data[0]].identity_images){
                                                    text_attachment += `
                                                        <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                                                            <img src="`+passenger_data_cache[val].identities[data[0]].identity_images[k][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities[data[0]].identity_images[k][1]+`" style="height:220px;width:auto" />

                                                            <div class="row" style="justify-content:space-around">
                                                                <div class="checkbox" style="display: block;">
                                                                    <label class="check_box_custom">
                                                                        <span style="font-size:13px;">Delete</span>
                                                                        <input type="checkbox" value="" id="`+passenger_pick+`_identity`+passenger_pick_number+`_`+k+`_delete" name="`+passenger_pick+`_identity`+passenger_pick_number+`_delete">
                                                                        <input type="hidden" value="`+passenger_data_cache[val].identities[data[0]].identity_images[k][1]+`" id="`+passenger_pick+`_identity`+passenger_pick_number+`_`+k+`_image_seq_id" name="`+passenger_pick+`_identity`+passenger_pick_number+`_`+k+`_image_seq_id">
                                                                        <span class="check_box_span_custom"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>`;
                                                }
                                                document.getElementById(passenger_pick+'_attachment_identity'+passenger_pick_number).innerHTML = text_attachment;
                                            }

                                            if(document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number)){
                                                document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number).innerHTML = text
                                                document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number).hidden = false;
                                                new jBox('Image', {
                                                  imageCounter: true,
                                                  imageCounterSeparator: ' of '
                                                });
                                            }
                                        }else{
                                            if(document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number))
                                                document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number).hidden = true;
                                        }
                                        //notif passport krng dari 6 bulan
                                        if(expired != null){
                                            if(expired > -180){
                                                identity_type = data[0];
                                                Swal.fire({
                                                  type: 'warning',
                                                  title: 'Oops!',
                                                  html: '<span style="color: #ff9900;">'+identity_type+' expired date less then 6 months </span>' ,
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }else if( typeof expired !== 'undefined' && expired < -1){
                        if(data[0] == 'passport'){
                            try{ //KALAU ADA IDENTITY
                                //PASSPORT
                                //FIX IVAN waktu move to adult dari database passenger langsung move ke adult tanpa withbooker apa karena radiosnya ga baca id ap gimana?
                                if(data[0] == 'passport'){
                                    if(data[1] != ''){
                                        identity_check = false;
                                        if(document.getElementById(passenger_pick+'_passport_number'+passenger_pick_number))
                                            document.getElementById(passenger_pick+'_passport_number'+passenger_pick_number).value = data[1];
                                        else if(document.getElementById(passenger_pick+'_identity_number'+passenger_pick_number))
                                            document.getElementById(passenger_pick+'_identity_number'+passenger_pick_number).value = data[1]
                                    }if(data[4] != '')
                                        document.getElementById(passenger_pick+'_passport_expired_date'+passenger_pick_number).value = data[3];
                                    if(data[2] != ''){
                                        document.getElementById('select2-'+passenger_pick+'_country_of_issued'+passenger_pick_number+'_id-container').innerHTML = data[2];
                                        document.getElementById(passenger_pick+'_country_of_issued'+passenger_pick_number).value = data[2];
                                    }
                                    if(passenger_data_cache[val].identities['passport'].identity_images.length > 0){
                                        text = '';
                                        //identity cenius (copy to booker/paxs dari passanger database) done
                                        text += `
                                            <div class="row">
                                                <div class="col-lg-12">`;
                                                    text+=`<label style="text-transform: capitalize; text-align:center; font-size:14px;">Passport - `+passenger_data_cache[val].identities['passport'].identity_number+`</label><br/>`;
                                                    text+=`
                                                    <div class="row" style="padding:15px;">
                                                        <div class="col-lg-12" style="background:#f7f7f7; padding-top:15px; border:1px solid #cdcdcd; max-height:200px; overflow-x:auto; margin-bottom:15px;">`;
                                                        for(k in passenger_data_cache[val].identities['passport'].identity_images){
                                                            text += `
                                                            <div class="row">
                                                                <div class="col-lg-3 col-md-4 col-sm-4">
                                                                    <a class="demo-img" href="`+passenger_data_cache[val].identities['passport'].identity_images[k][0]+`" data-jbox-image="15showidentity`+val+`passport`+for_jbox_image+`" title="passport - `+passenger_data_cache[val].identities['passport'].identity_number+` (`+passenger_data_cache[val].identities['passport'].identity_images[k][2]+`)">
                                                                        <img src="`+passenger_data_cache[val].identities['passport'].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                                                    </a><br/>
                                                                </div>
                                                                <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                                                    <h6 class="mb-2" style="white-space: normal; word-break: break-word;">`+passenger_data_cache[val].identities['passport'].identity_images[k][2]+`</h6>
                                                                    <b>Upload date:</b><br/>
                                                                    <i>
                                                                        `+moment(passenger_data_cache[val].identities['passport'].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                                                    </i>
                                                                </div>
                                                                <div class="col-lg-12">
                                                                    <br/>
                                                                </div>
                                                            </div>`;
                                                        }
                                                        text+=`
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                        if(document.getElementById(type+'_attachment_identity'+passenger_pick_number)){
                                            text_attachment= '';
                                            for(k in passenger_data_cache[val].identities['passport'].identity_images){
                                                text_attachment += `
                                                    <div style="height:220px;margin-bottom:25px;margin-right:10px;">
                                                        <img src="`+passenger_data_cache[val].identities['passport'].identity_images[k][0]+`" alt="Passenger" value="`+passenger_data_cache[val].identities['passport'].identity_images[k][1]+`" style="height:220px;width:auto" />

                                                        <div class="row" style="justify-content:space-around">
                                                            <div class="checkbox" style="display: block;">
                                                                <label class="check_box_custom">
                                                                    <span style="font-size:13px;">Delete</span>
                                                                    <input type="checkbox" value="" id="`+passenger_pick+`_identity`+passenger_pick_number+`_`+k+`_delete" name="`+passenger_pick+`_identity`+passenger_pick_number+`_delete">
                                                                    <input type="hidden" value="`+passenger_data_cache[val].identities['passport'].identity_images[k][1]+`" id="`+passenger_pick+`_identity`+passenger_pick_number+`_`+k+`_image_seq_id" name="`+passenger_pick+`_identity`+passenger_pick_number+`_`+k+`_image_seq_id">
                                                                    <span class="check_box_span_custom"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>`;
                                            }
                                            document.getElementById(passenger_pick+'_attachment_identity'+passenger_pick_number).innerHTML = text_attachment;
                                        }

                                        if(document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number)){
                                            document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number).innerHTML = text
                                            document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number).hidden = false;
                                            new jBox('Image', {
                                              imageCounter: true,
                                              imageCounterSeparator: ' of '
                                            });
                                        }
                                    }else{
                                        if(document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number))
                                            document.getElementById(passenger_pick+'_div_avatar_identity'+passenger_pick_number).hidden = true;
                                    }
                                }
                            }catch(err){
                                console.log(err); //error kalau tidak ada field identity std
                            }
                            //notif passport krng dari 6 bulan
                            if(expired != null || expired < -180){
                                identity_type = data[0];
                                Swal.fire({
                                  type: 'warning',
                                  title: 'Oops!',
                                  html: '<span style="color: #ff9900;">'+identity_type+' expired date less then 6 months </span>' ,
                                })
                            }
                        }
                    }

                    date1 = '';
                    date2 = '';
                    expired = null;

                }
                if(identity_check){
                    //notif error
                    try{
                        document.getElementById(passenger_pick+'_identity_msg_error'+passenger_pick_number).innerHTML = 'Identity already expired';
                    }catch(err){
                        console.log(err);
                    }
                }else{
                    try{
                        document.getElementById(passenger_pick+'_identity_msg_error'+passenger_pick_number).innerHTML = '';
                    }catch(err){
                        console.log(err);
                    }
                    //identity copy
                    if(document.getElementById(passenger_pick+'_id_type'+passenger_pick_number))
                        change_identity_type(passenger_pick+`_id_type`+passenger_pick_number, false);
                    else if(document.getElementById(passenger_pick+'_identity_type'+passenger_pick_number))
                        change_identity_type(passenger_pick+`_identity_type`+passenger_pick_number, false);
                }
            }

            //add frequent flyer
            try{
                if(typeof ff_request !== 'undefined'){
                    index_ff = 1;
                    for(x in ff_request){
                        try{
                            var ff_data = document.getElementById('frequent_flyer'+val + '_' + x).value;
                            $("#"+passenger_pick+"_ff_request"+passenger_pick_number+"_"+index_ff+"_id").select2().val(ff_data.split(' - ')[0]).trigger('change');
                            document.getElementById(passenger_pick+'_ff_number'+passenger_pick_number+'_'+index_ff).value = ff_data.split(' - ')[1];
                        }catch(err){
                            console.log(err); // error tidak ada id phone_chosen
                        }
                        index_ff++;
                    }
                }
            }catch(err){console.log(err);}
        }
//        try{
//            if(passenger_data_cache[val].identities.hasOwnProperty('passport') == true){
//                //check 6 bulan
//                var date1 = moment(passenger_data_cache[val].identities.passport.identity_expdate);
//                var date2 = moment();
//                var expired = date2.diff(date1, 'days');
//                if(expired < -180){
//                    document.getElementById(passenger_pick+'_passport_number'+passenger_pick_number).value = passenger_data_cache[val].identities.passport.identity_number;
//                    document.getElementById(passenger_pick+'_passport_number'+passenger_pick_number).readOnly = true;
//                    document.getElementById(passenger_pick+'_passport_expired_date'+passenger_pick_number).value = passenger_data_cache[val].identities.passport.identity_expdate;
//                    document.getElementById(passenger_pick+'_passport_expired_date'+passenger_pick_number).readOnly = true;
//                    document.getElementById(passenger_pick+'_country_of_issued'+passenger_pick_number).value = passenger_data_cache[val].identities.passport.identity_country_of_issued_name;
//                    document.getElementById(passenger_pick+'_country_of_issued'+passenger_pick_number).readOnly = true;
//                    document.getElementById('select2-'+passenger_pick+'_country_of_issued'+passenger_pick_number+'_id-container').innerHTML = passenger_data_cache[val].identities.passport.identity_country_of_issued_name;
//                }
//            }
//        }catch(err){
//
//        }

        auto_complete(passenger_pick+'_nationality'+passenger_pick_number);
        document.getElementById(passenger_pick+'_id'+passenger_pick_number).value = passenger_data_cache[val].seq_id;
        //untuk booker check
        if(passenger_pick == 'booker'){
            //$("#corporate_booker").attr('data-tooltip', '');
            document.getElementById('corporate_booker').style.display = 'none';
            if(passenger_data_cache[val].customer_parents.length != 0){
                corporate_booker_temp = ''
                for(j in passenger_data_cache[val].customer_parents){
                    corporate_booker_temp += passenger_data_cache[val].customer_parents[j].type + ' ' + passenger_data_cache[val].customer_parents[j].name + ' ' + passenger_data_cache[val].customer_parents[j].currency + ' ' + getrupiah(passenger_data_cache[val].customer_parents[j].actual_balance) + '\n';
                }
                //$("#corporate_booker").attr('data-tooltip', corporate_booker_temp);
                document.getElementById('corporate_booker').style.display = 'block';

                new jBox('Tooltip', {
                    attach: '#corporate_booker',
                    theme: 'TooltipBorder',
                    width: 280,
                    position: {
                      x: 'center',
                      y: 'bottom'
                    },
                    closeOnMouseleave: true,
                    animation: 'zoomIn',
                    content: corporate_booker_temp
                });
            }
            passenger_data_pick.push(passenger_data_cache[val]);
            passenger_data_pick[passenger_data_pick.length-1].sequence = passenger_pick+passenger_pick_number;

            if(copy_booker){
                var provider_type_copy = '';
                if(document.URL.split('/')[document.URL.split('/').length-2] == 'passenger')
                    provider_type_copy = document.URL.split('/')[document.URL.split('/').length-3]
                else if(document.URL.split('/')[document.URL.split('/').length-1] == 'passenger')
                    provider_type_copy = document.URL.split('/')[document.URL.split('/').length-2]
                else if(document.URL.split('/')[document.URL.split('/').length-1] == 'issued_offline')
                    provider_type_copy = 'issued_offline'

                data_booker = passenger_data_cache[val];
                document.getElementsByName('myRadios')[0].checked = 'checked';
                copy_booker_to_passenger('copy',provider_type_copy);
            }

            //document.getElementById('move_btn_'+val).innerHTML = passenger_pick.charAt(0).toUpperCase() + passenger_pick.slice(1).toLowerCase() + ' ' + passenger_pick_number;
            //document.getElementById('move_btn_'+val).disabled = true;
            if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'issued_offline'){
                update_contact('booker');
            }
        }else{ // pax
            passenger_data_pick.push(passenger_data_cache[val]);
            passenger_data_pick[passenger_data_pick.length-1].sequence = passenger_pick+passenger_pick_number;
            if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'issued_offline'){
                //document.getElementById('move_btn_'+val).innerHTML = 'Pax ' + passenger_pick_number;
                //document.getElementById('move_btn_'+val).disabled = true;
                update_contact('passenger',passenger_pick_number);
            }else{
                //document.getElementById('move_btn_'+val).innerHTML = passenger_pick.charAt(0).toUpperCase() + passenger_pick.slice(1).toLowerCase() + ' ' + passenger_pick_number;
                //document.getElementById('move_btn_'+val).disabled = true;
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
    var selection_list_choose = [];
    for(i in passenger_data_cache){
        if(document.getElementById('selection_type'+i).value != '')
            selection_list_choose.push(document.getElementById('selection_type'+i).value)
    }
    if(selection_list_choose.includes('booker'))
        selection_list_choose.push('booker_with_adult');
    else if(selection_list_choose.includes('booker_with_adult')){
        selection_list_choose.push('booker');
        selection_list_choose.push('adult1');
    }
    for(i in passenger_data_cache){
        for(j in document.getElementById('selection_type'+i).options){
            if(document.getElementById('selection_type'+i).options[j].selected != true){
                if(selection_list_choose.includes(document.getElementById('selection_type'+i).options[j].value))
                    document.getElementById('selection_type'+i).options[j].disabled = true;
                else
                    document.getElementById('selection_type'+i).options[j].disabled = false;
            }
        }
        $('#selection_type'+i).niceSelect('update');
    }
//    if(check == 0){
//        document.getElementById('move_btn_'+val).innerHTML = 'Move';
//        document.getElementById('move_btn_'+val).disabled = false;
//        document.getElementById('move_btn_'+val).setAttribute("onclick",`update_customer_cache_list(`+val+`);`);
//    }
}

function modal_help_pax_hide(){
    $('#myModalHelp_passenger').modal('hide');
}

function delete_country_of_issued_passenger_cache(type,val){
//    document.getElementById(type+'_identity_country_of_issued'+val).value = '';
//    document.getElementById('select2-'+type+'_identity_country_of_issued'+val+'_id-container').innerHTML = 'Country Of Issued';
    $('#'+type+'_identity_country_of_issued'+val+'_id').val('').trigger('change');
}

function delete_identity_expired_date(type, id){
    document.getElementById(type+'_identity_expired_date'+id).value = "";
}

function close_upload_attachment(val,type){
    if(type == ''){
        try{
        //from web browser
            if(document.getElementById('upload_idcard_type').value == '#myModal_attachment2'){
                btn_webcam = document.getElementById('button_webcam2')
            }else{
                btn_webcam = document.getElementById('button_webcam1')
            }
            if(btn_webcam.value == 'Close Webcam'){
                open_webcam();
            }
        }catch(err){/* from mobile*/}
        $('#myModal_attachment'+val).modal('hide');
    }else if(type == 'edit')
        $('#myModal_attachment_edit'+val).modal('hide');
}

function handleFileSelect_attachment(e) {
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

function handleFileSelect_attachment_idcard(e) {
    if(!e.target.files || !window.FileReader) return;

    selDiv_attachment_idcard.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv_attachment_idcard.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function fill_paxdata_from_idcard(idcard_type){
    if (idcard_type == 'passport')
    {
        id_idx = 1;
    }
    else
    {
        id_idx = 2;
    }
    $('#fill_data_idcard'+id_idx.toString()).addClass("running");
    $('#fill_data_idcard'+id_idx.toString()).prop('disabled', true);
    var formData = new FormData($('#form_identity_passenger').get(0));
    formData.append('idcard_type', idcard_type)
    $.ajax({
       type: "POST",
       url: "/webservice/agent",
       headers:{
            'action': 'read_idcard_img_to_text',
       },
       data: formData,
       contentType: false,
       processData: false,
       success: function(msg) {
            $('#fill_data_idcard'+id_idx.toString()).prop('disabled', false);
            $('#fill_data_idcard'+id_idx.toString()).removeClass("running");
            console.log(msg);
            if(msg.error_code == 0){
                res_obj = msg.response;
                $('#myModal_attachment'+id_idx.toString()).modal('hide');
                if (res_obj.hasOwnProperty('title'))
                {
                    $("#passenger_title").val(res_obj.title).trigger('change');
                    $('#passenger_title').niceSelect('update');
                }
                if (res_obj.hasOwnProperty('first_name'))
                {
                    $("#passenger_first_name").val(res_obj.first_name.toUpperCase());
                }
                if (res_obj.hasOwnProperty('last_name'))
                {
                    $("#passenger_last_name").val(res_obj.last_name.toUpperCase());
                }
                if (res_obj.hasOwnProperty('birth_date'))
                {
                    $("#passenger_birth_date").val(res_obj.birth_date);
                }
                if (res_obj.hasOwnProperty('identity_number'))
                {
                    $("#passenger_identity_number"+id_idx.toString()).val(res_obj.identity_number);
                }
                if (res_obj.hasOwnProperty('identity_expired_date') && res_obj.identity_expired_date != 'SEUMUR HIDUP')
                {
                    $("#passenger_identity_expired_date"+id_idx.toString()).val(res_obj.identity_expired_date);
                }
                if (res_obj.hasOwnProperty('nationality'))
                {
                    $("#passenger_nationality_id").val(res_obj.nationality).trigger('change');
                    $("#passenger_nationality_id").niceSelect('update');
                    $("#passenger_identity_country_of_issued"+id_idx.toString()+"_id").val(res_obj.nationality).trigger('change');
                    $("#passenger_identity_country_of_issued"+id_idx.toString()+"_id").niceSelect('update');
                }
                else
                {
                    $("#passenger_identity_country_of_issued"+id_idx.toString()+"_id").val('Indonesia').trigger('change');
                    $("#passenger_identity_country_of_issued"+id_idx.toString()+"_id").niceSelect('update');
                }
            }
            else
            {
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.error_msg,
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error filling passenger data from ID Card.');
            $('#fill_data_idcard'+id_idx.toString()).prop('disabled', false);
            $('#fill_data_idcard'+id_idx.toString()).removeClass("running");
       },timeout: 120000
    });
}

function change_upload_idcard_type(sel_idcard){
    document.getElementById('upload_idcard_btn').dataset.target = sel_idcard.value;
}

function update_passenger_backend(){
    document.getElementById('update_passenger_customer').disabled = true;
    //check
    error_log = '';
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
    ff_numbers = [];
    try{
        for(i = 1; i<= passenger_data_edit_ff ; i++){
            try{
                is_same_ff = false
                if(document.getElementById('passenger_edit_ff'+i+'_id').value == '' || document.getElementById('passenger_edit_ff'+i+'_id').value == 'Frequent Flyer'){
                    error_log+= 'Please choose frequent flyer '+i+'!</br>\n';
                    document.getElementById('passenger_edit_ff'+i+'_id').style['border-color'] = 'red';
                }else{
                    for(j in ff_numbers){
                        if(ff_numbers[j] == document.getElementById('passenger_edit_ff'+i+'_id').value){
                            is_same_ff = true;
                        }
                    }
                    if(!is_same_ff){
                        ff_numbers.push(document.getElementById('passenger_edit_ff'+i+'_id').value);
                        document.getElementById('passenger_edit_ff'+i+'_id').style['border-color'] = '#EFEFEF';
                    }else{
                        error_log+= 'Same frequent flyer '+i+', please change!</br>\n';
                        document.getElementById('passenger_edit_ff'+i+'_id').style['border-color'] = 'red';
                    }
                }if(document.getElementById('passenger_edit_ff_number'+i).value == ''){
                    error_log+= 'Please fill frequent flyer number '+i+'!</br>\n';
                    document.getElementById('passenger_edit_ff_number'+i).style['border-color'] = 'red';
                }else
                    document.getElementById('passenger_edit_ff_number'+i).style['border-color'] = '#EFEFEF';
            }catch(err){
                console.log(err);
            }
        }
    }catch(err){

    }
    if(error_log == ''){
        var formData = new FormData($('#form_identity_passenger_edit').get(0));
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
                    identity_type_dict = {
                        'passport': 'files_attachment_edit1',
                        'ktp': 'files_attachment_edit2',
                        'sim': 'files_attachment_edit3',
                        'other': 'files_attachment_edit4'
                    }
                    img_list = [];
                    for(i in msg.result.response){
                        //ambil description edit cenius
                        img_list.push([msg.result.response[i][0], 4, msg.result.response[i][2]])
                    }
                    try{
                        if(document.getElementById('avatar_delete').checked == true)
                            img_list.push([passenger_data_cache[passenger_cache_pick].face_image[0][1], 2, 'files_attachment']);
                    }catch(err){
                        console.log(err); //error kalau tidak ada file upload
                    }
                    for(i in passenger_data_cache[passenger_cache_pick].identities){
                        for(j in passenger_data_cache[passenger_cache_pick].identities[i].identity_images){
                            if(document.getElementById(i+j+'_delete').checked == true)
                                img_list.push([passenger_data_cache[passenger_cache_pick].identities[i].identity_images[j][1], 2, identity_type_dict[i]]);
                        }
                    }
                    phone = [];
                    identity = {};
                    ff_numbers = [];
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

                    try{
                        for(i = 1; i<= passenger_data_edit_ff ; i++){
                            try{
                                ff_numbers.push({
                                    'ff_code': document.getElementById('passenger_edit_ff'+i+'_id').value,
                                    'ff_number': document.getElementById('passenger_edit_ff_number'+i).value
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
                    first_name = ''
                    last_name = '';
                    birth_date = '';
                    title = '';
                    if(agent_security.includes('p_cache_3')){
                        //punya permission save sesuai yg di edit
                        birth_date = document.getElementById('passenger_edit_birth_date').value;
                        first_name = document.getElementById('passenger_edit_first_name').value;
                        last_name = document.getElementById('passenger_edit_last_name').value;
                        title = document.getElementById('passenger_edit_title').value;
                    }else{
                        // tanpa permission save sesuai yg ada di backend
                        first_name = passenger_data_cache[passenger_cache_pick].first_name;
                        last_name = passenger_data_cache[passenger_cache_pick].last_name;
                        title = passenger_data_cache[passenger_cache_pick].title;
                        if(passenger_data_cache[passenger_cache_pick].birth_date == '')
                            birth_date = document.getElementById('passenger_edit_birth_date').value;
                        else
                            birth_date = passenger_data_cache[passenger_cache_pick].birth_date
                    }
                    update_passenger_dict = {
                        'first_name': first_name,
                        'last_name': last_name,
                        'nationality_name': document.getElementById('passenger_edit_nationality').value,
                        'email': document.getElementById('passenger_edit_email').value,
                        'phone': phone,
                        'identity': identity,
                        'image': img_list,
                        'seq_id': passenger_data_cache[passenger_cache_pick].seq_id,
                        'birth_date': birth_date,
                        'title': title,
                        'ff_numbers': ff_numbers
                    }
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
                            if(msg.result.error_code == 0){
                                Swal.fire({
                                  type: 'success',
                                  title: 'Update!',
                                  html: '',
                                })
                                try{
                                    //setelah save hapus data di modal
                                    document.getElementById('div_avatar_passport').innerHTML = '';
                                    document.getElementById('div_avatar_ktp').innerHTML = '';
                                    document.getElementById('div_avatar_sim').innerHTML = '';
                                    document.getElementById('div_avatar_other').innerHTML = '';
                                    document.getElementById('selectedFiles_attachment_edit').innerHTML = '';
                                    document.getElementById('attachment').innerHTML = '';
                                    document.getElementById('div_avatar').innerHTML = '';
                                    document.getElementById('files_attachment_edit').value = '';

                                    for(i=1;i<5;i++){
                                        document.getElementById('attachment'+i).innerHTML = '';
                                        $('#passenger_identity_country_of_issued'+i+'_id').val('');
                                        document.getElementById('files_attachment_edit'+i).value = '';
                                        document.getElementById('passenger_edit_identity_number'+i).value = '';
                                    }
                                    document.getElementById('passenger_edit_phone_table').innerHTML = '';
                                }catch(err){
                                    console.log(err);
                                }
                                document.getElementById('passenger_chosen').hidden = false;
                                document.getElementById('passenger_update').hidden = true;
                                get_passenger_cache('chosen',true);
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
    }else if(type == 'contact'){
        document.getElementById('search_result_contact').innerHTML = '';
    }else if(type == 'adult'){
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }else if(type == 'child'){
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }else if(type == 'infant'){
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }else if(type == 'senior'){
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }else{
        document.getElementById('search_result_'+type+sequence).innerHTML = '';
    }
}

function auto_logout(msg){
    try{
        login_again = false;
        error_logger = msg.result.error_msg;
        clearInterval(timeInterval);
    }catch(err){
        console.log(err);
        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
            error_logger = 'Please login again!';
            login_again = false;
        }else{
            error_logger = 'Session has been expired!';
            login_again = false;
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
    else if(product_type == 'swab_express')
        html_id = 'swab_express_booking';

    else if(product_type == 'lab_pintar')
        html_id = 'lab_pintar_booking';
    else if(product_type == 'bus')
        html_id = 'bus_booking';
    else if(product_type == 'mitra_keluarga')
        html_id = 'mitra_keluarga_booking';

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

function print_fail_issued(){
    Swal.fire({
      title: 'Issued',
      html: 'Payment Fail',
      type: 'error',
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

function print_fail_forceissued(){
    Swal.fire({
      title: 'Issued',
      html: 'Session already expired, Please book a new reservation',
      type: 'error',
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

function change_identity_type(id, automatic_change_number=true){
    try{
        if(document.getElementById(id).value == 'ktp'){
            if(automatic_change_number)
                document.getElementById(id.replace('id_type','passport_number')).value = '';
            document.getElementById(id.replace('id_type','identity_expired_date_required')).style.color = 'white';
            document.getElementById(id.replace('id_type','identity_number_required')).style.color = 'red';
            document.getElementById(id.replace('id_type','country_of_issued_required')).style.color = 'red';
        }else if(document.getElementById(id).value == 'passport' || document.getElementById(id).value == 'sim'){
            if(automatic_change_number)
                document.getElementById(id.replace('id_type','passport_number')).value = '';
            document.getElementById(id.replace('id_type','identity_expired_date_required')).style.color = 'red';
            document.getElementById(id.replace('id_type','identity_number_required')).style.color = 'red';
            document.getElementById(id.replace('id_type','country_of_issued_required')).style.color = 'red';
        }else if(is_identity_required == 'true'){
            //KALAU ADA BINTANG TETAP ADA TIDAK ADA YG BERUBAH
            if(automatic_change_number)
                document.getElementById(id.replace('id_type','passport_number')).value = '';
            document.getElementById(id.replace('id_type','identity_expired_date_required')).style.color = 'red';
            document.getElementById(id.replace('id_type','identity_number_required')).style.color = 'red';
            document.getElementById(id.replace('id_type','country_of_issued_required')).style.color = 'red';
        }else{
            if(automatic_change_number)
                document.getElementById(id.replace('id_type','passport_number')).value = '';
            document.getElementById(id.replace('id_type','identity_expired_date_required')).style.color = 'white';
            document.getElementById(id.replace('id_type','identity_number_required')).style.color = 'white';
            document.getElementById(id.replace('id_type','country_of_issued_required')).style.color = 'white';
        }
        if(document.getElementById(id).value == 'passport'){
            document.getElementById(id.replace('id_type','birth_date') + '_required').innerHTML = '*';
        }else if(!birth_date_required){
            document.getElementById(id.replace('id_type','birth_date') + '_required').innerHTML = '';
        }
    }catch(err){
        console.log(err); // di html tidak ada id id_type
    }
}

function openInNewTab(href) {
    if(window.safari == undefined){
        Object.assign(document.createElement('a'), {
            target: '_blank',
            href: href,
        }).click();
    }else{
        Swal.fire({
            type: 'warning',
            title: 'Oops!',
            html: 'Please use chrome / firefox to use this function',
        })
    }
}

function run_signup_admin(){
    document.getElementById('signup_text_temp').innerHTML = document.getElementById('signup_btb_text').value;
    document.getElementById('signup_btn_temp').innerHTML = `<i class="fas fa-user-plus"></i> ` + document.getElementById('signup_btb_btn').value;
    $('#example_modal').modal('show');
}

function generate_image_identity(counter, id, div_id, label_id, cek_search){
    text_identity = '';
    for_jbox_image++;
    get_value = $("#"+id+counter).val();

    cek_identity_img = 0;
    if(get_value == 'all_identity'){
        document.getElementById(''+label_id+counter).innerHTML = 'All Identity Image';
        if(cek_search == 'chosen'){
            for(j in passenger_data_cache[counter].identities){
                if(passenger_data_cache[counter].identities[j].identity_images.length != 0){
                    for(k in passenger_data_cache[counter].identities[j].identity_images){
                        text_identity += `
                        <div class="row">
                            <div class="col-lg-3 col-md-4 col-sm-4">
                                <a class="demo-img" href="`+passenger_data_cache[counter].identities[j].identity_images[k][0]+`" data-jbox-image="showidentity`+counter+`allidentity`+for_jbox_image+`" title="`+j+` - `+passenger_data_cache[counter].identities[j].identity_number+` (`+passenger_data_cache[counter].identities[j].identity_images[k][2]+`)">
                                    <img src="`+passenger_data_cache[counter].identities[j].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                </a>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                <h6 class="mb-2">`+passenger_data_cache[counter].identities[j].identity_images[k][2]+`</h6>
                                <b>Upload date:</b><br/>
                                <i>
                                    `+moment(passenger_data_cache[counter].identities[j].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                </i>
                            </div>
                            <div class="col-lg-12">
                                <br/>
                            </div>
                        </div>`;
                    }
                    cek_identity_img = 1;
                }
            }
        }
        else{
            for(j in passenger_data[counter].identities){
                if(passenger_data[counter].identities[j].identity_images.length != 0){
                    for(k in passenger_data[counter].identities[j].identity_images){
                        text_identity += `
                        <div class="row">
                            <div class="col-lg-3 col-md-4 col-sm-4">
                                <a class="demo-img" href="`+passenger_data[counter].identities[j].identity_images[k][0]+`" data-jbox-image="showidentity`+counter+`allidentity`+for_jbox_image+`" title="`+j+` - `+passenger_data[counter].identities[j].identity_number+` (`+passenger_data[counter].identities[j].identity_images[k][2]+`)">
                                    <img src="`+passenger_data[counter].identities[j].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                </a>
                            </div>
                            <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                <h6 class="mb-2">`+passenger_data[counter].identities[j].identity_images[k][2]+`</h6>
                                <b>Upload date:</b><br/>
                                <i>
                                    `+moment(passenger_data[counter].identities[j].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                </i>
                            </div>
                            <div class="col-lg-12">
                                <br/>
                            </div>
                        </div>`;
                    }
                    cek_identity_img = 1;
                }
            }
        }
    }
    else{
        if(cek_search == 'chosen'){
            for(j in passenger_data_cache[counter].identities){
                get_dt_identity = ""+j+ " - " +passenger_data_cache[counter].identities[j].identity_number;
                if(get_value == get_dt_identity){
                    document.getElementById(''+label_id+counter).innerHTML = get_dt_identity+" Image";
                    if(passenger_data_cache[counter].identities[j].identity_images.length != 0){
                        for(k in passenger_data_cache[counter].identities[j].identity_images){
                            text_identity += `
                            <div class="row">
                                <div class="col-lg-3 col-md-4 col-sm-4">
                                    <a class="demo-img" href="`+passenger_data_cache[counter].identities[j].identity_images[k][0]+`" data-jbox-image="showidentity`+counter+``+for_jbox_image+`" title="`+j+` - `+passenger_data_cache[counter].identities[j].identity_number+` (`+passenger_data_cache[counter].identities[j].identity_images[k][2]+`)">
                                        <img src="`+passenger_data_cache[counter].identities[j].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                    </a>
                                </div>
                                <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                    <h6 class="mb-2">`+passenger_data_cache[counter].identities[j].identity_images[k][2]+`</h6>
                                    <b>Upload date:</b><br/>
                                    <i>
                                        `+moment(passenger_data_cache[counter].identities[j].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                    </i>
                                </div>
                                <div class="col-lg-12">
                                    <br/>
                                </div>
                            </div>`;
                        }
                        cek_identity_img = 1;
                    }
                }
            }
        }
        else{
            if(get_value.split(' - ')[1] == ''){
                //INPUT DATA BARU
                document.getElementById(''+label_id+counter).innerHTML = get_value.split(' - ')[0]+" Image";
            }else{
                //DATA YG SUDAH ADA
                for(j in passenger_data[counter].identities){
                    get_dt_identity = ""+j+ " - " +passenger_data[counter].identities[j].identity_number;
                    if(get_value == get_dt_identity){
                        document.getElementById(''+label_id+counter).innerHTML = get_dt_identity+" Image";
                        if(passenger_data[counter].identities[j].identity_images.length != 0){
                            for(k in passenger_data[counter].identities[j].identity_images){
                                text_identity += `
                                <div class="row">
                                    <div class="col-lg-3 col-md-4 col-sm-4">
                                        <a class="demo-img" href="`+passenger_data[counter].identities[j].identity_images[k][0]+`" data-jbox-image="showidentity`+counter+``+for_jbox_image+`" title="`+j+` - `+passenger_data[counter].identities[j].identity_number+` (`+passenger_data[counter].identities[j].identity_images[k][2]+`)">
                                            <img src="`+passenger_data[counter].identities[j].identity_images[k][0]+`" alt="Identity" class="picture_identity_customer">
                                        </a>
                                    </div>
                                    <div class="col-lg-9 col-md-8 col-sm-8" style="padding-top:15px;">
                                        <h6 class="mb-2">`+passenger_data[counter].identities[j].identity_images[k][2]+`</h6>
                                        <b>Upload date:</b><br/>
                                        <i>
                                            `+moment(passenger_data[counter].identities[j].identity_images[k][3]).format('DD MMM YYYY - HH:mm')+`
                                        </i>
                                    </div>
                                    <div class="col-lg-12">
                                        <br/>
                                    </div>
                                </div>`;
                            }
                            cek_identity_img = 1;
                        }
                    }
                }
            }
        }
    }

    if(cek_identity_img == 0){
        text_identity+=`
        <div class="row">
            <div class="col-lg-12" style="padding-bottom:15px;">
                <h6>No Image!</h6>
            </div>
        </div>`;
    }

    document.getElementById(''+div_id+counter).innerHTML = text_identity;

    new jBox('Image', {
      imageCounter: true,
      imageCounterSeparator: ' of '
    });
}

function search_type_on_change(cek_date, id_parent, id_selection,id_text_input){
    if(document.getElementById(id_selection).value == 'birth_date'){
        if(moment(document.getElementById(id_text_input).value)._d == 'Invalid date')
            $('input[id="'+id_text_input+'"]').val(document.getElementById(id_text_input).value);
        else
            $('input[id="'+id_text_input+'"]').val("");

        if(cek_date == 'pax_cache'){
            $('input[id="'+id_text_input+'"]').daterangepicker({
                parentEl: '#passenger_search',
                singleDatePicker: true,
                autoUpdateInput: true,
                maxDate: moment(),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });
        }
        else if(cek_date == 'pax'){
            $('input[id="'+id_text_input+'"]').daterangepicker({
                parentEl: '#date_'+cek_date+id_parent,
                singleDatePicker: true,
                autoUpdateInput: true,
                maxDate: moment(),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });
        }
        else if(cek_date == 'senior' || cek_date == 'adult' || cek_date == 'child' || cek_date == 'infant'){
            $('input[id="'+id_text_input+'"]').daterangepicker({
                parentEl: '#date_'+cek_date+id_parent,
                singleDatePicker: true,
                autoUpdateInput: true,
                maxDate: moment(),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });
        }
        else if(cek_date == 'booker'){
            $('input[id="'+id_text_input+'"]').daterangepicker({
                parentEl: '#date_booker',
                singleDatePicker: true,
                autoUpdateInput: true,
                maxDate: moment(),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });
        }
        else if(cek_date == 'contact'){
            $('input[id="'+id_text_input+'"]').daterangepicker({
                parentEl: '#search_result_'+cek_date,
                singleDatePicker: true,
                autoUpdateInput: true,
                maxDate: moment(),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });
        }
        else if(cek_date == 'vendor'){
            $('input[id="'+id_text_input+'"]').daterangepicker({
                parentEl: '#date_'+cek_date+id_parent,
                singleDatePicker: true,
                autoUpdateInput: true,
                maxDate: moment(),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });
        }
        else if(cek_date == 'insurance'){
            $('input[id="'+id_text_input+'"]').daterangepicker({
                parentEl: '#date_'+cek_date+id_parent,
                singleDatePicker: true,
                autoUpdateInput: true,
                maxDate: moment(),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });
        }
        else{
            $('input[id="'+id_text_input+'"]').daterangepicker({
                singleDatePicker: true,
                autoUpdateInput: true,
                maxDate: moment(),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });
        }
    }else{
        try{
            $('input[id="'+id_text_input+'"]').val("");
            $('input[id="'+id_text_input+'"]').data('daterangepicker').remove();
        }catch(err){}
    }
}

//untuk bikin filter di kanan atas
function filter_top_right(pax_btn, num, prd){
//    alert("product: "+prd);
//    alert("pax type: "+pax_btn);
//    alert("nomor: "+num);
    response_filter =`
    <button type="button" class="primary-btn mb-3" style="float:right; display:block;" id="filter_search_cache" onclick="show_filter_data();">
        Filter <i class="fas fa-filter"></i>
    </button>`;
    if(prd == 'get_booking_vendor'){
        document.getElementById('button_tr_getbooking_fv').innerHTML = response_filter;
    }else if(prd == 'cache'){
        document.getElementById('button_tr_passenger_db').innerHTML = response_filter;

        value_radio_pax = document.querySelector('input[name="radio_passenger_cache"]:checked').value;;
        if(value_radio_pax == 'search')
            document.getElementById('button_tr_passenger_db').style.display = 'block';
        else
            document.getElementById('button_tr_passenger_db').style.display = 'none';
    }else{
        if(pax_btn == ''){
            document.getElementById('button_tr_'+num).innerHTML = response_filter;
        }
        else{
            if(num == ''){
                document.getElementById('button_tr_'+pax_btn).innerHTML = response_filter;
            }else{
                document.getElementById('button_tr_'+pax_btn+num).innerHTML = response_filter;
            }
        }

        if(prd == 'issued_offline' || prd == 'group_booking'){
            if(pax_btn == 'booker'){
                value_radio_pax = document.querySelector('input[name="radio_booker"]:checked').value;
            }else if(pax_btn == 'contact'){
                value_radio_pax = document.querySelector('input[name="radio_contact"]:checked').value;
            }else if(pax_btn == 'adult'){
                value_radio_pax = document.querySelector('input[name="radio_passenger' + parseInt(num) + '"]:checked').value;;
            }

            if(value_radio_pax == 'search'){
                document.getElementById('button_tr_'+pax_btn+num).style.display = 'block';
            }
            else{
                document.getElementById('button_tr_'+pax_btn+num).style.display = 'none';
            }
        }else if(prd == 'issued_booking'){
            value_radio_pax = document.querySelector('input[name="radio_passenger' + parseInt(num) + '"]:checked').value;;
            if(value_radio_pax == 'search')
                document.getElementById('button_tr_'+parseInt(num)).style.display = 'block';
            else
                document.getElementById('button_tr_'+parseInt(num)).style.display = 'none';
        }
    }
}