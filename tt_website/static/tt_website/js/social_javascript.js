//add template
counter_social = 0;
function add_table_of_social(data){
    text = '';
    counter_social = counter_social + 1;
    var node = document.createElement("div");
    text+=`
        <div class='row' id="social`+counter_social+`_id">
            <div class="col-lg-12" style="padding:15px; border-bottom:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-xs-6">
                        <h5>Social Media #`+counter_social+`</h5>
                    </div>
                    <div class="col-xs-6" style="text-align:right;">
                        <button type="button" class="primary-delete-date" onclick="delete_table_of_social(`+counter_social+`)">
                            Delete <i class="fa fa-times" style="color:#E92B2B;font-size:20px;"></i>
                        </button>
                    </div>

                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <div class="input-container-search-ticket" style="display:unset;">
                            <h6 style="margin-bottom:10px;">Social Media</h6>`;
                            if(template == 1 || template == 2 || template == 6){
                                text+=`<div class="form-select">`;
                            }else if(template == 3){
                                text+=`<div class="default-select">`;
                            }else if(template == 4){
                                text+=`<div class="default-select">`;
                            }else if(template == 5){
                                text+=`<div class="default-select">`;
                            }
                            text+=`
                                <select id="social_title`+counter_social+`" name="social_title`+counter_social+`" class="nice-select-default">`;
                                var social_us = ['Instagram', 'Facebook', 'Twitter', 'Youtube', 'TikTok', 'Other'];
                                for (i = 0; i < social_us.length; i++) {
                                    text+=`<option value="`+social_us[i]+`"`;
                                    if(social_us[i] == data[0]){
                                        text+=`selected`;
                                    }
                                    text+=`>`+social_us[i]+`</option>`;
                                }
                                text+=`</select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <h6 style="margin-bottom:10px;">Name</h6>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="social_name`+counter_social+`" id="social_name`+counter_social+`" placeholder="Social Media Name" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Social Media Name'" value="`+data[1]+`">
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <h6 style="margin-bottom:10px;">URL</h6>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="social_url`+counter_social+`" id="social_url`+counter_social+`" placeholder="URL, example: https://www.instagram.com/ " onfocus="this.placeholder = ''" onblur="this.placeholder = 'URL, example: https://www.instagram.com/ '" value="`+data[2]+`">
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    node.innerHTML = text;
    document.getElementById("social_div").appendChild(node);
    $('#social_title'+counter_social).niceSelect();
}

function delete_table_of_social(val){
    try{
        document.getElementById(`social`+val+`_id`).remove();
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
        try{
            document.getElementById(`social`+val+`_id`).remove();
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
    }
}

function get_social(type){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_social_url',
       },
       data: {},
       success: function(msg) {
            if(type == 'setting'){
                document.getElementById("social_div").innerHTML = '';
                counter_social = 0;
                for(i in msg){
                    add_table_of_social(msg[i]);
                }
            }else if(type == 'footer'){
                text = '';
                if (typeof $check_get_cs === 'undefined'){
                    if(msg.length != 0){
                        if(template == 1){
                            text+=`<hr/><h6 style="color:black">Follow Us</h6>`;
                        }else if(template == 2){
                            text+=`<hr/><h6 class="widget-title" style="color:black">Follow Us</h6>`;
                        }else if(template == 3){
                            text+=`<hr/><h6 style="color:black;">Follow Us</h6>`;
                        }else if(template == 4){
                            text+=`<hr/><h2 class="footer-heading mb-4" style="color:black;">Follow Us</h2>`;
                        }else if(template == 5){
                            text+=`<hr/><h4 style="color:black;" class="mb-4">Follow Us</h4>`;
                        }else if(template == 6){
                            text+=`<h4 style="color:black;" class="mb-4">Follow Us</h4>`;
                        }else if(template == 7){
                            text+=`<hr/><h4 style="color:black;">Follow Us</h4>`;
                        }else if(template == 8){
                            text+=`<hr/><h4 style="color:black;">Follow Us</h4>`;
                        }
                    }
                    for(i in msg){

                        text += `<a href="`+msg[i][2]+`" title="`+msg[i][1]+`" target="_blank">`;

                        if(msg[i][0] == "Facebook"){
                            text+=`<img style="margin-bottom:10px; height:30px; width:auto; padding-right:10px;" src="/static/tt_website/img/facebook.png" alt="Facebook"/>`;
                        }else if(msg[i][0] == "Instagram"){
                            text+=`<img style="margin-bottom:10px; height:30px; width:auto; padding-right:10px;" src="/static/tt_website/img/instagram.png" alt="Instagram"/>`;
                        }else if(msg[i][0] == "Twitter"){
                            text+=`<img style="margin-bottom:10px; height:25px; width:auto; padding-right:10px;" src="/static/tt_website/img/twitter.png" alt="Twitter"/>`;
                        }else if(msg[i][0] == "Youtube"){
                            text+=`<img style="margin-bottom:10px; height:25px; width:auto; padding-right:10px;" src="/static/tt_website/img/youtube.png" alt="Youtube"/>`;
                        }else if(msg[i][0] == "TikTok"){
                            text+=`<img style="margin-bottom:10px; height:30px; width:auto; padding-right:10px;" src="/static/tt_website/img/tiktok.png" alt="TikTok"/>`;
                        }else if(msg[i][0] == "Other"){
                            text+=`<img style="margin-bottom:10px; height:30px; width:auto; padding-right:10px;" src="/static/tt_website/img/other.png" alt="Other"/>`;
                        }

                        //if(msg[i][0] == 'Twitter'){
                        //    $('head').append( '<meta name="twitter:card" content="'+msg[i][0]+'" />' );
                        //    $('head').append( '<meta name="twitter:site" content="'+msg[i][1]+'" />' );
                        //    $('head').append( '<meta name="twitter:creator" content="'+msg[i][2]+'" />' );
                        //}
                    }
                }
                document.getElementById('social_footer_div').innerHTML = text;

            }else if(type == 'page'){
                text = '';
                if(msg.length != 0){
                    text+=`<div class="col-lg-12 mt-4 text-center"><h4 style="color:black;">Follow us on</h4><br/></div>`;
                }
                for(i in msg){
                    text += `<div class="col-sm-6 col-md-6 col-lg-6 mb-3"><div style="height:80px; border: 1px solid #cdcdcd; padding:15px; border-radius:7px;">`;
                    if(msg[i][0] == "Facebook"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website/img/facebook.png" alt="Facebook"/>`;
                    }else if(msg[i][0] == "Instagram"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website/img/instagram.png" alt="Instagram"/>`;
                    }else if(msg[i][0] == "Twitter"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website/img/twitter.png" alt="Twitter"/>`;
                    }else if(msg[i][0] == "Youtube"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website/img/youtube.png" alt="Youtube"/>`;
                    }else if(msg[i][0] == "TikTok"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website/img/tiktok.png" alt="TikTok"/>`;
                    }else if(msg[i][0] == "Other"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website/img/other.png" alt="Other"/>`;
                    }
                    text+=`<span style="position:absolute;">`+msg[i][0]+``;
                    if(msg[i][1] != ''){
                        text+=`<br/><a href="`+msg[i][2]+`" target="_blank" style="font-weight:bold;">`+msg[i][1]+`</a></span>`;
                    }else{
                        text+=`<br/><a href="`+msg[i][2]+`" target="_blank" style="font-weight:bold;">`+msg[i][2]+`</a></span>`;
                    }
                    text+=`</div></div>`;

                    //if(msg[i][0] == 'Twitter'){
                    //    $('head').append( '<meta name="twitter:card" content="'+msg[i][0]+'" />' );
                    //    $('head').append( '<meta name="twitter:site" content="'+msg[i][1]+'" />' );
                    //    $('head').append( '<meta name="twitter:creator" content="'+msg[i][2]+'" />' );
                    //}
                }

                document.getElementById('social_page_div').innerHTML = text;

            }
            else if(type == 'login'){
                text = '';
                if(msg.length != 0){
                    if(check_available_dynamic == 0){
                        text+=`<br/><h5 style="color:`+text_color+`; font-weight:bold;">Follow us</h5>`;
                    }else{
                        text+=`<h6 style="margin-bottom:5px; font-weight:bold;">Follow us</h6>`;
                    }
                }
                for(i in msg){
                    text += `<a href="`+msg[i][1]+`" target="_blank">`;
                    if(msg[i][0] == "Facebook"){
                        text+=`<img style="margin-right:5px; height:30px; width:auto;" src="/static/tt_website/img/facebook.png" alt="Facebook"/>`;
                    }else if(msg[i][0] == "Instagram"){
                        text+=`<img style="margin-right:5px; height:30px; width:auto;" src="/static/tt_website/img/instagram.png" alt="Facebook"/>`;
                    }else if(msg[i][0] == "Twitter"){
                        text+=`<img style="margin-right:5px; height:25px; width:auto;" src="/static/tt_website/img/twitter.png" alt="Twitter"/>`;
                    }else if(msg[i][0] == "Youtube"){
                        text+=`<img style="margin-right:5px; height:25px; width:auto;" src="/static/tt_website/img/youtube.png" alt="Youtube"/>`;
                    }else if(msg[i][0] == "TikTok"){
                        text+=`<img style="margin-right:5px; height:30px; width:auto; padding-right:10px;" src="/static/tt_website/img/tiktok.png" alt="TikTok"/>`;
                    }else if(msg[i][0] == "Other"){
                        text+=`<img style="margin-right:5px; height:30px; width:auto;" src="/static/tt_website/img/other.png" alt="Other"/>`;
                    }
                    text+=`</a>`;
                    //if(msg[i][0] == 'Twitter'){
                    //    $('head').append( '<meta name="twitter:card" content="'+msg[i][0]+'" />' );
                    //    $('head').append( '<meta name="twitter:site" content="'+msg[i][1]+'" />' );
                    //    $('head').append( '<meta name="twitter:creator" content="'+msg[i][2]+'" />' );
                    //}
                }

                if(check_available_dynamic == 0){
                    document.getElementById("scroll_dn_btn").style.display = "none";
                    document.getElementById("go_more").style.display = "none";
                }else{
                    document.getElementById("scroll_up_btn").style.display = "block";
                }
                document.getElementById('social_login_div').innerHTML = text;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get social media');
       },timeout: 60000
    });
}

function save_social(){
    data = [];
    for(i=1;i<=counter_social;i++){
        try{
            data.push([document.getElementById('social_title'+i).value, document.getElementById('social_name'+i).value, document.getElementById('social_url'+i).value]);
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada karena bisa delete inline contoh hanya ada 1 3 4 7 10
        }
    }
    console.log(data);
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'set_social_url',
       },
       data: {
            'data': JSON.stringify(data)
       },
       success: function(msg) {
            get_social('setting');
            get_social('footer');
            Swal.fire({
              type: 'success',
              title: 'Update',
              text: 'Social media update!'
            })
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error save social media');
       },timeout: 60000
    });
}