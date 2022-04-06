function get_about_us(type){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_about_us',
       },
       data: {},
       success: function(msg) {
            if(type == 'admin'){
            text = '';
                counter = 0;
                text = `<option value=`+counter+` select>Create New</option>`;
            }
            if(msg.result.error_code == 0){
                if(type == 'admin'){
                    about_us = msg.result.response;
                    for(i in msg.result.response){
                        counter++;
                        text += `<option value=`+counter+` select>Paragraph `+msg.result.response[i].sequence+`</option>`;
                    }
                }else if(type == 'page'){
                    text = '';
                    about_us = msg.result.response;
                    var sortable = [];

                    for(i in about_us){
                        sortable.push([i, about_us[i]]);
                    }
                    sortable.sort(function(a, b) {
                        return a[1].sequence - b[1].sequence;
                    });

                    for(j in sortable){
                        var check_paragraph = parseInt(j)+1;
                        sortable[j][1].body = sortable[j][1].body.replace(/&lt;/g, '<');
                        sortable[j][1].body = sortable[j][1].body.replace(/&gt;/g, '>');

                        if(sortable[j][1].state == true){
                            text+=`<div class="col-lg-12 mb-5"><div class="row">`;
                            if(check_paragraph % 2 == 0){
                                if(sortable[j][1].image_paragraph != '/media/image_about_us/'){
                                    text += `
                                    <div class="col-lg-8 col-md-8">
                                        <div style="min-height:150px;">
                                            <h3>`+sortable[j][1].title+`</h3>
                                            <div>
                                                `+sortable[j][1].body+`
                                            </div>
                                        </div>
                                    </div>`;
                                    text += `<div class="col-lg-4 col-md-4"><img title="`+sortable[j][1].title+`" alt="`+sortable[j][1].title+`" style="max-width:100%; width:auto; max-height:300px; height:auto;" src="`+sortable[j][1].image_paragraph+`"/></div>`;
                                }else{
                                    text += `
                                    <div class="col-lg-12">
                                        <div style="min-height:150px;">
                                            <h3>`+sortable[j][1].title+`</h3>
                                            <div>
                                                `+sortable[j][1].body+`
                                            </div>
                                        </div>
                                    </div>`;
                                }
                            }else{
                                if(sortable[j][1].image_paragraph != '/media/image_about_us/'){
                                    text += `<div class="col-lg-4 col-md-4"><img title="`+sortable[j][1].title+`" alt="`+sortable[j][1].title+`" style="width:100%; width:auto; max-height:300px; height:auto;" src="`+sortable[j][1].image_paragraph+`"/></div>`;
                                    text += `
                                    <div class="col-lg-8 col-md-8">
                                        <div style="min-height:150px;">
                                            <h3>`+sortable[j][1].title+`</h3>
                                            <div>
                                                `+sortable[j][1].body+`
                                            </div>
                                        </div>
                                    </div>`;
                                }else{
                                    text += `
                                    <div class="col-lg-12">
                                        <div style="min-height:150px;">
                                            <h3>`+sortable[j][1].title+`</h3>
                                            <div>
                                                `+sortable[j][1].body+`
                                            </div>
                                        </div>
                                    </div>`;
                                }
                            }
                            text+=`</div></div>`;
                        }
                    }

                    document.getElementById('about_page_div').innerHTML = text;
                }
            }
            if(type == 'admin'){
                document.getElementById('paragraph_choose').innerHTML = text;
                if(template == 2){
                    $('#paragraph_choose').niceSelect("update");
                }else {
                    $('#paragraph_choose').niceSelect("update");
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get about us');
       }
    });
}

function change_about_us(){
    paragraph_number = parseInt(document.getElementById('paragraph_choose').value)-1;
    if(paragraph_number != -1){
        document.getElementById('paragraph_active').checked = about_us[paragraph_number].state;
        document.getElementById('sequence_paragraph').value = parseInt(about_us[paragraph_number].sequence);
        document.getElementById('title_paragraph').value = about_us[paragraph_number].title;
        document.getElementById("paragraph_img").src = about_us[paragraph_number].image_paragraph;
        if(about_us[paragraph_number].image_paragraph != '/media/image_about_us/'){
            document.getElementById('paragraph_img_label').style.display = "block";
            document.getElementById('paragraph_img').style.display = "block";
        }else{
            document.getElementById('paragraph_img_label').style.display = "none";
            document.getElementById('paragraph_img').style.display = "none";
        }
        document.getElementById('delete_paragraph').hidden = false;
        CKEDITOR.instances.body_paragraph.setData(about_us[paragraph_number].body);
    }else{
        document.getElementById('paragraph_active').checked = false;
        document.getElementById('sequence_paragraph').value = 1;
        document.getElementById('title_paragraph').value = '';
        document.getElementById("paragraph_img").src = '';
        document.getElementById("image_paragraph").value = '';
        document.getElementById('delete_paragraph').hidden = true;
        CKEDITOR.instances.body_paragraph.setData('');
    }

}

function update_about_us(){
//    var radios = document.getElementsByName('paragraph_choose');
//    var paragraph_number = 0;
//    for (var j = 0, length = radios.length; j < length; j++) {
//        if (radios[j].checked) {
//            // do whatever you want with the checked radio
//            paragraph_choose = radios[j].value;
//            paragraph_number = j-1;
//            // only one radio can be logically checked, don't check the rest
//            break;
//        }
//    }
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

    paragraph_number = parseInt(document.getElementById('paragraph_choose').value) - 1
    error_log = '';
    if(document.getElementById('sequence_paragraph').value == ''){
        error_log += 'Please input paragraph number\n';
    }
    if(CKEDITOR.instances.body_paragraph.getData() == ''){
        error_log += 'Please input body\n';
    }
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('state', document.getElementById('paragraph_active').checked);
        formData.append('delete_img', document.getElementById('paragraph_img_delete').checked);
        formData.append('sequence', parseInt(document.getElementById('sequence_paragraph').value));
        formData.append('title', document.getElementById('title_paragraph').value);
        formData.append('body', JSON.stringify(CKEDITOR.instances.body_paragraph.getData()));
        formData.append('paragraph', document.getElementById('paragraph_choose').value);
        formData.append('paragraph_number', parseInt(paragraph_number));
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'set_about_us',
           },
           data: formData,
           success: function(msg) {
                if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Update!',
                      html: msg.result.error_msg,
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
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error save about us');
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
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_log,
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
}


function delete_about_us(){
    paragraph_number = parseInt(document.getElementById('paragraph_choose').value) - 1
    error_log = '';
    if(document.getElementById('sequence_paragraph').value == ''){
        error_log += 'Please input paragraph number\n';
    }
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('state', document.getElementById('paragraph_active').checked);
        formData.append('delete_img', document.getElementById('paragraph_img_delete').checked);
        formData.append('sequence', parseInt(document.getElementById('sequence_paragraph').value));
        formData.append('title', document.getElementById('title_paragraph').value);
        formData.append('body', document.getElementById('body_paragraph').value);
        formData.append('paragraph', document.getElementById('paragraph_choose').value);
        formData.append('paragraph_number', parseInt(paragraph_number));
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'delete_about_us',
           },
           data: formData,
           success: function(msg) {
                if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Update!',
                      html: msg.result.error_msg,
                    })
                    location.reload();
                }else
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                    })
           },
           contentType:false,
           processData:false,
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error delete about us');
           }
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_log,
        })
    }
}