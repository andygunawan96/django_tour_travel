function get_faq(type){
    console.log(type);
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_faq',
       },
       data: {},
       success: function(msg) {
            console.log(msg);
            if(type == 'admin'){
            text = '';
                counter = 0;
                text = `<option value=`+counter+` select>Create New</option>`;
            }
            if(msg.result.error_code == 0){
                if(type == 'admin'){
                    faq = msg.result.response;
                    for(i in msg.result.response){
                        counter++;
                        text += `<option value=`+counter+` select>FAQ `+msg.result.response[i].sequence+` - `+msg.result.response[i].title+`</option>`;
                    }
                }else if(type == 'page'){
                    text = '';
                    faq = msg.result.response;
                    var sortable = [];

                    for(i in faq){
                        sortable.push([i, faq[i]]);
                    }
                    sortable.sort(function(a, b) {
                        return a[1].sequence - b[1].sequence;
                    });

                    for(j in sortable){
                        var check_faq = parseInt(j)+1;
                        sortable[j][1].body = sortable[j][1].body.replace(/&lt;/g, '<');
                        sortable[j][1].body = sortable[j][1].body.replace(/&gt;/g, '>');

                        if(sortable[j][1].state == true){
                            text+=`
                            <div class="col-lg-12 border p-3 mb-3" style="background:white;">
                                <span class="faq-que" onclick="faq_dropdown(`+check_faq+`);">
                                    <b>`+check_faq+`. `+sortable[j][1].title+`</b>
                                </span>
                                <i class="fas fa-chevron-down" onclick="faq_dropdown(`+check_faq+`)" id="down_`+check_faq+`" style="float: right; cursor: pointer; display: inline-block;"></i>
                                <i class="fas fa-chevron-up" onclick="faq_dropdown(`+check_faq+`)" id="up_`+check_faq+`" style="float: right; cursor: pointer; display: none;"></i>
                                <br>
                                <span id="ans_`+check_faq+`" style="display: none;">
                                    <hr>
                                    <b>Answer:</b><br>
                                    `+sortable[j][1].body+`
                                </span>
                            </div>`;
                        }
                    }

                    document.getElementById('faq_page_div').innerHTML = text;
                }
            }
            if(type == 'admin'){
                document.getElementById('faq_choose').innerHTML = text;
                if(template == 2){
                    $('#faq_choose').niceSelect("update");
                }else {
                    $('#faq_choose').niceSelect("update");
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error update banner </span>' + errorThrown,
                })
            }
       }
    });
}

function change_faq(){
    faq_number = parseInt(document.getElementById('faq_choose').value)-1;
    if(faq_number != -1){
        document.getElementById('faq_active').checked = faq[faq_number].state;
        document.getElementById('sequence_faq').value = parseInt(faq[faq_number].sequence);
        document.getElementById('title_faq').value = faq[faq_number].title;
        document.getElementById('delete_faq').hidden = false;
        CKEDITOR.instances.body_faq.setData(faq[faq_number].body);
    }else{
        document.getElementById('faq_active').checked = false;
        document.getElementById('sequence_faq').value = 1;
        document.getElementById('title_faq').value = '';
        document.getElementById('delete_faq').hidden = true;
        CKEDITOR.instances.body_faq.setData('');
    }

}

function update_faq(){
//    var radios = document.getElementsByName('faq_choose');
//    var faq_number = 0;
//    for (var j = 0, length = radios.length; j < length; j++) {
//        if (radios[j].checked) {
//            // do whatever you want with the checked radio
//            faq_choose = radios[j].value;
//            faq_number = j-1;
//            // only one radio can be logically checked, don't check the rest
//            break;
//        }
//    }
    faq_number = parseInt(document.getElementById('faq_choose').value) - 1
    error_log = '';
    if(document.getElementById('sequence_faq').value == ''){
        error_log += 'Please input FAQ number\n';
    }
    if(CKEDITOR.instances.body_faq.getData() == ''){
        error_log += 'Please input Answer\n';
    }
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('state', document.getElementById('faq_active').checked);
        formData.append('sequence', parseInt(document.getElementById('sequence_faq').value));
        formData.append('title', document.getElementById('title_faq').value);
        formData.append('body', JSON.stringify(CKEDITOR.instances.body_faq.getData()));
        formData.append('faq', document.getElementById('faq_choose').value);
        formData.append('faq_number', parseInt(faq_number));
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'set_faq',
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
                if(XMLHttpRequest.status == 500){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error update dynamic page </span>' + errorThrown,
                    })
                }
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


function delete_faq_btn(){
    faq_number = parseInt(document.getElementById('faq_choose').value) - 1;
    error_log = '';
    if(document.getElementById('sequence_faq').value == ''){
        error_log += 'Please input FAQ Number\n';
    }
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('state', document.getElementById('faq_active').checked);
        formData.append('sequence', parseInt(document.getElementById('sequence_faq').value));
        formData.append('title', document.getElementById('title_faq').value);
        formData.append('body', document.getElementById('body_faq').value);
        formData.append('faq', document.getElementById('faq_choose').value);
        formData.append('faq_number', parseInt(faq_number));
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'delete_faq',
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
                if(XMLHttpRequest.status == 500){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error update dynamic page </span>' + errorThrown,
                    })
                }
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

function faq_dropdown(id){
    var general_down = document.getElementById('down_'+id);
    var general_up = document.getElementById('up_'+id);
    var general_show = document.getElementById('ans_'+id);

    if (general_down.style.display === "none") {
        general_up.style.display = "none";
        general_down.style.display = "inline-block";
        general_show.style.display = "none";
    }
    else {
        general_up.style.display = "inline-block";
        general_down.style.display = "none";
        general_show.style.display = "block";
    }
}