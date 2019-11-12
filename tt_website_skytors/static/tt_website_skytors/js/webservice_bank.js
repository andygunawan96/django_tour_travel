function bank_get_balance(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bank",
       headers:{
            'action': 'get_balance',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        if(msg == 0){

        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: 'TESTING BCA',
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error bca </span>' + errorThrown,
            })
       },timeout: 60000
    });
}