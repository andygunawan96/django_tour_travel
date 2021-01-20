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
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error printout');
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
    $.ajax({
       type: "POST",
       url: "/webservice/printout",
       headers:{
            'action': 'update_list_report_footer_api',
       },
       data: {
            'signature': signature,
            'html': CKEDITOR.instances['body_printout'].getData(),
            'code': document.getElementById('printout_choose').value
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                Swal.fire({
                 type: 'success',
                 title: 'Report footer!',
                 html: 'Success update ' + $("#printout_choose").text(),
                })
                printout = msg.result.response;
                change_printout();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
       },timeout: 60000
    });
}

function update_printout_color(){
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
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
       },timeout: 60000
    });
}