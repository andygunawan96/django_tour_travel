function get_payment_partner(type){
    console.log(type);
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_payment_partner',
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
                    payment_partner = msg.result.response;
                    for(i in msg.result.response){
                        counter++;
                        text += `<option value=`+counter+` select>`+msg.result.response[i].title+`</option>`;
                    }
                }else if(type == 'footer'){
                    payment_partner = msg.result.response;
                    text = '';
                    var sortable = [];
                    for(i in payment_partner){
                        sortable.push([i, payment_partner[i]]);
                    }
                    sortable.sort(function(a, b) {
                        return a[1].sequence - b[1].sequence;
                    });

                    if(payment_partner.length != 0){
                        if(template == 1){
                            text+=`<hr/><h6 style="color:black">Payment Partner</h6>`;
                        }else if(template == 2){
                            text+=`<hr/><h6 class="widget-title" style="color:black">Payment Partner</h6>`;
                        }else if(template == 3){
                            text+=`<hr/><h6 style="color:black">Payment Partner</h6>`;
                        }else if(template == 4){
                            text+=`<hr/><h2 class="footer-heading mb-4" style="color:black;">Payment Partner</h2>`;
                        }else if(template == 5){
                            text+=`<hr/><h4 class="mb-4" style="color:black;">Payment Partner</h4>`;
                        }else if(template == 6){
                            text+=`<h4 style="color:black; margin-bottom:15px;">Payment Partner</h4>`;
                        }
                    }
                    for(j in sortable){
                        if(sortable[j][1].state == true){
                            text += `<img title="`+sortable[j][1].title+`" style="margin-bottom:10px; height:40px; width:auto; padding-right:15px;" src="`+sortable[j][1].image_partner+`" alt="`+sortable[j][1].title+`"/>`;
                        }
                    }
                    document.getElementById('payment_partner_footer_div').innerHTML = text;
                }
            }
            if(type == 'admin'){
                document.getElementById('partner_choose').innerHTML = text;
                if(template == 2){
                    $('#partner_choose').niceSelect("update");
                }else {
                    $('#partner_choose').niceSelect("update");
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get payment partner');
       }
    });
}

function change_payment_partner(){
    partner_number = parseInt(document.getElementById('partner_choose').value)-1;
    if(partner_number != -1){
        document.getElementById('partner_active').checked = payment_partner[partner_number].state;
        document.getElementById('payment_partner_sequence').value = parseInt(payment_partner[partner_number].sequence);
        document.getElementById('payment_partner_name').value = payment_partner[partner_number].title;
        document.getElementById("partner_img").src = payment_partner[partner_number].image_partner;
        document.getElementById('delete_partner').hidden = false;
    }else{
        document.getElementById('partner_active').checked = false;
        document.getElementById('payment_partner_sequence').value = 0;
        document.getElementById('payment_partner_name').value = '';
        document.getElementById("partner_img").src = '';
        document.getElementById("image_partner").value = '';
        document.getElementById('delete_partner').hidden = true;
    }

}

function update_payment_partner(){
//    var radios = document.getElementsByName('partner_choose');
//    var partner_number = 0;
//    for (var j = 0, length = radios.length; j < length; j++) {
//        if (radios[j].checked) {
//            // do whatever you want with the checked radio
//            partner_choose = radios[j].value;
//            partner_number = j-1;
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

    partner_number = parseInt(document.getElementById('partner_choose').value) - 1
    error_log = '';
    if(document.getElementById('payment_partner_name').value == ''){
        error_log += 'Please input title\n';
    }
    if(document.getElementById("image_partner").files.length == 0 && partner_number == -1){
        error_log += 'Please input image URL\n';
    }
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('state', document.getElementById('partner_active').checked);
        formData.append('sequence', parseInt(document.getElementById('payment_partner_sequence').value));
        formData.append('title', document.getElementById('payment_partner_name').value);
        formData.append('partner', document.getElementById('partner_choose').value);
        formData.append('partner_number', parseInt(partner_number));
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'set_payment_partner',
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
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error save payment partner');
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


function delete_payment_partner(){
    partner_number = parseInt(document.getElementById('partner_choose').value) - 1
    error_log = '';
    if(document.getElementById('payment_partner_name').value == ''){
        error_log += 'Please input title\n';
    }
    if(document.getElementById("image_partner").files.length == 0 && partner_number == -1){
        error_log += 'Please input image URL\n';
    }
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('state', document.getElementById('partner_active').checked);
        formData.append('sequence', parseInt(document.getElementById('payment_partner_sequence').value));
        formData.append('title', document.getElementById('payment_partner_name').value);
        formData.append('partner', document.getElementById('partner_choose').value);
        formData.append('partner_number', parseInt(partner_number));
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'delete_payment_partner',
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
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error delete payment partner');
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