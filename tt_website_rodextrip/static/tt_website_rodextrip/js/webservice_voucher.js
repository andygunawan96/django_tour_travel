function get_voucher(type){
    $.ajax({
       type: "POST",
       url: "/webservice/voucher",
       headers:{
            'action': 'get_voucher',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error voucher signin </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function set_voucher(type){
    $.ajax({
       type: "POST",
       url: "/webservice/voucher",
       headers:{
            'action': 'set_voucher',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error voucher signin </span>' + errorThrown,
            })
       },timeout: 60000
    });
}
