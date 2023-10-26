function update_privacy_policy(){
    document.getElementsByClassName("update_banner_btn")[0].disabled = true;
    document.getElementsByClassName("update_banner_btn")[1].disabled = true;
    document.getElementsByClassName("update_banner_btn")[2].disabled = true;
    document.getElementsByClassName("update_banner_btn")[3].disabled = true;
    document.getElementsByClassName("update_banner_btn")[4].disabled = true;
    document.getElementsByClassName("update_banner_btn")[5].disabled = true;
    document.getElementsByClassName("update_banner_btn")[6].disabled = true;
    document.getElementsByClassName("update_banner_btn")[7].disabled = true;
    document.getElementsByClassName("update_banner_btn")[8].disabled = true;
    document.getElementsByClassName("update_banner_btn")[9].disabled = true;

    active_policy = '';
    if ($('#privacy_policy_active').is(':checked')) {
        active_policy = 'active';
    }else{
        active_policy = 'inactive';
    }

    var formData = new FormData($('#form_admin').get(0));
    formData.append('title', document.getElementById('privacy_policy_title').value);
    formData.append('body', JSON.stringify(CKEDITOR.instances.privacy_policy_body.getData()));
    formData.append('active', active_policy);
    formData.append('version', document.getElementById('privacy_policy_version').value);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'set_privacy_policy',
       },
       data: formData,
       success: function(msg) {
            if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Update!',
                })
                location.reload();
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
                })
                document.getElementsByClassName("update_banner_btn")[0].disabled = false;
                document.getElementsByClassName("update_banner_btn")[1].disabled = false;
                document.getElementsByClassName("update_banner_btn")[2].disabled = false;
                document.getElementsByClassName("update_banner_btn")[3].disabled = false;
                document.getElementsByClassName("update_banner_btn")[4].disabled = false;
                document.getElementsByClassName("update_banner_btn")[5].disabled = false;
                document.getElementsByClassName("update_banner_btn")[6].disabled = false;
                document.getElementsByClassName("update_banner_btn")[7].disabled = false;
                document.getElementsByClassName("update_banner_btn")[8].disabled = false;
                document.getElementsByClassName("update_banner_btn")[9].disabled = false;
            }
       },
       contentType:false,
       processData:false,
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error save Privacy Policy');
            document.getElementsByClassName("update_banner_btn")[0].disabled = false;
            document.getElementsByClassName("update_banner_btn")[1].disabled = false;
            document.getElementsByClassName("update_banner_btn")[2].disabled = false;
            document.getElementsByClassName("update_banner_btn")[3].disabled = false;
            document.getElementsByClassName("update_banner_btn")[4].disabled = false;
            document.getElementsByClassName("update_banner_btn")[5].disabled = false;
            document.getElementsByClassName("update_banner_btn")[6].disabled = false;
            document.getElementsByClassName("update_banner_btn")[7].disabled = false;
            document.getElementsByClassName("update_banner_btn")[8].disabled = false;
            document.getElementsByClassName("update_banner_btn")[9].disabled = false;
       }
    });
}

function get_privacy_policy(type){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_privacy_policy',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0){
                if(msg.result.response.length != 0){
                    if(type == 'admin'){
                        document.getElementById('privacy_policy_title').value = msg.result.response[0].title;
                        CKEDITOR.instances.privacy_policy_body.setData(msg.result.response[0].body);
                        if(msg.result.response[0].active == 'active'){
                            document.getElementById('privacy_policy_active').checked = true;
                        }
                        document.getElementById('privacy_policy_version').value = msg.result.response[0].version;
                    }else if(type == 'page'){
                        document.getElementById('privacy_title').innerHTML = msg.result.response[0].title;
                        document.getElementById('privacy_body').innerHTML = msg.result.response[0].body;
                    }else if(type == 'footer'){
                        document.getElementById('about_ul').innerHTML += `<li style="margin-top:10px;"><a href="/policy">`+msg.result.response[0].title+`</a></li>`;
                    }else if(type == 'registration'){
                        if(msg.result.response[0].active == 'active'){
                            document.getElementById('div_policy_active').value = 'active';
                            document.getElementById('div_policy').innerHTML = `
                            <label class="check_box_custom" style="margin-bottom:0px;">
                                <span class="span-search-ticket" style="color:black; padding-right:5px;">I agree with the</span>
                                <input type="checkbox" value="" name="agree_policy_check" id="agree_policy_check" required="1" style="margin-right: 5px;"/>
                                <span class="check_box_span_custom" id="agree_policy_span"></span>
                            </label>
                            <span class="fw600">
                                <span class="text_link_cst" id="agree_policy" data-toggle="modal" data-target="#myModalPolicy">`+msg.result.response[0].title+`</span>
                            </span>`;
                        }
                        document.getElementById('privacy_title').innerHTML = msg.result.response[0].title;
                        document.getElementById('privacy_body').innerHTML = msg.result.response[0].body;
                    }else if(type == 'b2c_signup'){
                        if(msg.result.response[0].active == 'active'){
                            document.getElementById('b2c_policy_active').value = 'active';
                            document.getElementById('b2c_policy').innerHTML = `
                            <label class="check_box_custom" style="margin-bottom:0px;">
                                <span class="span-search-ticket" style="color:black; padding-right:5px;">I agree with the</span>
                                <input type="checkbox" value="" name="b2c_policy_check" id="b2c_policy_check" required="1" style="margin-right: 5px;"/>
                                <span class="check_box_span_custom" id="b2c_policy_span"></span>
                            </label>
                            <span class="fw600">
                                <a href="/policy" target="_blank"><span class="text_link_cst" id="b2c_agree_policy">`+msg.result.response[0].title+`</span></a>
                            </span>`;
                        }
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error get privacy policy')
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get privacy policy');
       }
    });
}

