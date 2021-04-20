printout_state = 0;
function get_printout(order_number,type,provider_type){
    //type ticket, ticket_price, invoice, itinerary, voucher, visa_handling,
    if(printout_state == 0){
        printout_state = 1;
        bill_name_to = '';
        bill_address = '';
        additional_information = '';
        try{
            bill_name_to = document.getElementById('bill_name').value;
        }catch(err){}
        try{
            bill_address = document.getElementById('bill_address').value;
        }catch(err){}
        try{
            additional_information = document.getElementById('additional_information').value;
        }catch(err){}

        if(type == 'ticket'){
            $('#button-choose-print').prop('disabled', true);
            $('#button-choose-print').addClass("running");
        }else if(type == 'itinerary' || type == 'ticket_price'){
            $('#button-print-print').prop('disabled', true);
            $('#button-print-print').addClass("running");
        }else if(type == 'ticket_original'){
            $('#button-print-ori').prop('disabled', true);
            $('#button-print-ori').addClass("running");
        }else if(type == 'invoice'){
            $('#button-issued-print').prop('disabled', true);
            $('#button-issued-print').addClass("running");
        }else if(type == 'passport_cust' || type == 'visa_cust'){
            $('#button-print-handling').prop('disabled', true);
            $('#button-print-handling').addClass("running");
        }

        $.ajax({
           type: "POST",
           url: "/webservice/printout",
           headers:{
                'action': 'get_printout',
           },
           data: {
                'order_number': order_number,
                'mode': type,
                'provider_type': provider_type,
                'bill_name_to': bill_name_to,
                'bill_address': bill_address,
                'additional_information': additional_information,
                'signature': signature
           },
           success: function(msg) {
                console.log(msg);
                if(msg.result.error_code == 0){
                    for(i in msg.result.response)
                        window.open(msg.result.response[i].url,'_blank');
    //                window.open(msg.result.response.url,'_blank');
    //                window.open('https://static.rodextrip.com/ebe/6b5/74e/ig%20no%20socmed.jpg','_blank');
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                    })
                }
                printout_state = 0;
                if(type == 'ticket'){
                    $('#button-choose-print').prop('disabled', false);
                    $('#button-choose-print').removeClass("running");
                }else if(type == 'itinerary' || type == 'ticket_price'){
                    $('#button-print-print').prop('disabled', false);
                    $('#button-print-print').removeClass("running");
                }else if(type == 'ticket_original'){
                    $('#button-print-ori').prop('disabled', false);
                    $('#button-print-ori').removeClass("running");
                }else if(type == 'passport_cust' || type == 'visa_cust'){
                    $('#button-print-handling').prop('disabled', false);
                    $('#button-print-handling').removeClass("running");
                }else if(type == 'invoice'){
                    $('#button-issued-print').prop('disabled', false);
                    $('#button-issued-print').removeClass("running");
                }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error printout');

                if(type == 'ticket'){
                    $('#button-choose-print').prop('disabled', false);
                    $('#button-choose-print').removeClass("running");
                }else if(type == 'itinerary' || type == 'ticket_price'){
                    $('#button-print-print').prop('disabled', false);
                    $('#button-print-print').removeClass("running");
                }else if(type == 'ticket_original'){
                    $('#button-print-ori').prop('disabled', false);
                    $('#button-print-ori').removeClass("running");
                }else if(type == 'passport_cust' || type == 'visa_cust'){
                    $('#button-print-handling').prop('disabled', false);
                    $('#button-print-handling').removeClass("running");
                }else if(type == 'invoice'){
                    $('#button-issued-print').prop('disabled', false);
                    $('#button-issued-print').removeClass("running");
                }
           },timeout: 60000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">Please wait to print next print out </span>',
        })
    }
}

function get_list_report_footer(){
    $.ajax({
       type: "POST",
       url: "/webservice/printout",
       headers:{
            'action': 'get_list_report_footer',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                text = '';
                printout = msg.result.response;
                for(i in printout){
                    text += `<option value='`+printout[i].code+`'>`+printout[i].name+`</option>`;
                }
                document.getElementById('printout_choose').innerHTML = text;
                $('#printout_choose').niceSelect('update');
                change_printout();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
       },timeout: 60000
    });
}

function change_printout(){
    for(i in printout){
        if(printout[i].code == document.getElementById('printout_choose').value){
            CKEDITOR.instances['body_printout'].setData(printout[i].html)
//            document.getElementById('body_printout').innerHTML = printout[i].html;
            break;
        }
    }
}

function update_list_report_footer(){
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

    $.ajax({
       type: "POST",
       url: "/webservice/printout",
       headers:{
            'action': 'update_list_report_footer_api',
       },
       data: {
            'signature': signature,
            'html': CKEDITOR.instances['body_printout'].getData(),
            'code': document.getElementById('printout_choose').value,
            'name': document.getElementById('printout_choose').options[document.getElementById('printout_choose').selectedIndex].text
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                Swal.fire({
                 type: 'success',
                 title: 'Report footer!',
                 html: 'Success update ' + document.getElementById('printout_choose').options[document.getElementById('printout_choose').selectedIndex].text,
                })
                printout = msg.result.response;
                change_printout();

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
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
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
       },timeout: 60000
    });
}

function update_printout_color(){
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

    $.ajax({
       type: "POST",
       url: "/webservice/printout",
       headers:{
            'action': 'set_color_printout_api',
       },
       data: {
            'signature': signature,
            'color': '#' + document.getElementById('printout_color_background').value
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Updated!',
                  html: 'printout color',
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
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
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
       },timeout: 60000
    });
}