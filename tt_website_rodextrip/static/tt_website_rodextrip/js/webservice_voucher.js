function get_voucher(){
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

function check_voucher(type){
    provider_type_id = ''; //airline
    provider_id = ''; //amadeus
    voucher_reference = ''; //lalala.testing
    if(type == 'visa'){

    }else if(type == 'airline'){

    }else if(type == 'visa'){

    }else if(type == 'passport'){

    }else if(type == 'hotel'){

    }else if(type == 'activity'){

    }else if(type == 'train'){

    }else if(type == 'groupbooking'){

    }else if(type == ''){

    }
    $.ajax({
       type: "POST",
       url: "/webservice/voucher",
       headers:{
            'action': 'check_voucher',
       },
       data: {
            'signature': signature,
            'provider_type_id': provider_type_id,
            'provider_id': provider_id,
            'voucher_reference': voucher_reference
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
