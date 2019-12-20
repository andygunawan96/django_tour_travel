function get_printout(order_number,type,provider_type){
    //type ticket, ticket_price, invoice, itinerary, voucher, visa_handling,
    bill_name_to = '';
    try{
        bill_name_to = document.getElementById('bill_name').value;
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
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                window.open(msg.result.response.url,'_blank');
//                window.open('https://static.rodextrip.com/ebe/6b5/74e/ig%20no%20socmed.jpg','_blank');
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error printout </span>' + errorThrown,
            })
       },timeout: 60000
    });
}