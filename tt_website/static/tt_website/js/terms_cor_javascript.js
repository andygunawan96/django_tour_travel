function update_term_and_condition_cor(){
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


    var formData = new FormData($('#form_admin').get(0));
    formData.append('body', JSON.stringify(CKEDITOR.instances.term_and_condition_body_cor.getData()));
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'set_term_and_condition_cor',
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

function get_term_and_condition_cor(type){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_term_and_condition_cor',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0){
                if(msg.result.response.length != 0){
                    if(type == 'admin'){
                        CKEDITOR.instances.term_and_condition_body_cor.setData(msg.result.response[0].body);
                    }else if(type == 'registration'){
                        document.getElementById('terms_body_cor').innerHTML = msg.result.response[0].body;
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get privacy policy');
       }
    });
}

