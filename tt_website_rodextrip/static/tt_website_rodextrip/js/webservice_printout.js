function get_printout(order_number,type,provider_type,bill_to_name){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/printout",
       headers:{
            'action': 'get_printout',
       },
       data: {
            'order_number': order_number,
            'mode': type,
            'provider_type': provider_type
            'bill_to_name': bill_to_name,
       },
       success: function(msg) {
            console.log(msg);

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error payment acq </span>' + errorThrown,
            })
       },timeout: 60000
    });
}