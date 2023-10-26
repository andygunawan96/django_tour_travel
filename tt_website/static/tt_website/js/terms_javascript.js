function update_term_and_condition(){
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

    active_term = '';
    try{
        version_term = parseInt(document.getElementById('term_and_condition_version').value);
    }catch(err){
        version_term = 1;
    }

    if ($('#term_and_condition_active').is(':checked')) {
        active_term = 'active';
        version_term += 1;
    }else{
        active_term = 'inactive';
    }

    var formData = new FormData($('#form_admin').get(0));
    formData.append('title', document.getElementById('term_and_condition_title').value);
    formData.append('body', JSON.stringify(CKEDITOR.instances.term_and_condition_body.getData()));
    formData.append('active', active_term);
    formData.append('version', version_term);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'set_term_and_condition',
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error save Term and Condition');
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

function get_term_and_condition(type){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_term_and_condition',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0){
                if(msg.result.response.length != 0){
                    if(type == 'admin'){
                        document.getElementById('term_and_condition_title').value = msg.result.response[0].title;
                        CKEDITOR.instances.term_and_condition_body.setData(msg.result.response[0].body);
                        if(msg.result.response[0].active == 'active'){
                            document.getElementById('term_and_condition_active').checked = true;
                        }
                        document.getElementById('term_and_condition_version').value = msg.result.response[0].version;
                    }else if(type == 'page'){
                        document.getElementById('terms_title').innerHTML = msg.result.response[0].title;
                        document.getElementById('terms_body').innerHTML = msg.result.response[0].body;
                    }else if(type == 'home'){
                        document.getElementById('terms_title').innerHTML = msg.result.response[0].title;
                        document.getElementById('terms_body').innerHTML = msg.result.response[0].body;
                        document.getElementById('tac_text').innerHTML = "I Agree with the "+msg.result.response[0].title;
                        if(msg.result.response[0].active == 'active'){
                            checkCookie('tac', 'load', 'home', msg.result.response[0].version);
                            get_banner('promotion','home');
                        }
                    }else if(type == 'footer'){
                        document.getElementById('about_ul').innerHTML += `<li style="margin-top:10px;"><a href="/terms">`+msg.result.response[0].title+`</a></li>`;
                    }else if(type == 'registration'){
                        if(msg.result.response[0].active == 'active'){
                            document.getElementById('div_terms_active').value = 'active';
                            document.getElementById('div_terms').innerHTML = `
                            <label class="check_box_custom" style="margin-bottom:0px;">
                                <span class="span-search-ticket" style="color:black; padding-right:5px;">I agree with the</span>
                                <input type="checkbox" value="" name="agree_terms_check" id="agree_terms_check" required="1" style="margin-right: 5px;"/>
                                <span class="check_box_span_custom" id="agree_terms_span"></span>
                            </label>
                            <span class="fw600">
                                <span class="text_link_cst" id="agree_terms" data-toggle="modal" data-target="#myModalTerms">`+msg.result.response[0].title+`</span>
                            </span>`;
                        }
                        document.getElementById('terms_title').innerHTML = msg.result.response[0].title;
                        document.getElementById('terms_body').innerHTML = msg.result.response[0].body;
                    }else if(type == 'b2c_signup'){
                        if(msg.result.response[0].active == 'active'){
                            if(document.getElementById('b2c_terms_active') && document.getElementById('b2c_terms')){
                                document.getElementById('b2c_terms_active').value = 'active';
                                document.getElementById('b2c_terms').innerHTML = `
                                <label class="check_box_custom" style="margin-bottom:0px;">
                                    <span class="span-search-ticket" style="color:black; padding-right:5px;">I agree with the</span>
                                    <input type="checkbox" value="" name="b2c_terms_check" id="b2c_terms_check" required="1" style="margin-right: 5px;"/>
                                    <span class="check_box_span_custom" id="b2c_terms_span"></span>
                                </label>
                                <span class="fw600">
                                    <a href="/terms" target="_blank"><span class="text_link_cst" id="b2c_agree_terms">`+msg.result.response[0].title+`</span></a>
                                </span>`;
                            }
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

