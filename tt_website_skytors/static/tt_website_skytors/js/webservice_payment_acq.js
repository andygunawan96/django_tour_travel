payment_acq = {
  "jsonrpc": "2.0",
  "id": null,
  "result": {
    "error_code": 0,
    "error_msg": "",
    "response": {
      "transfer": [
        {
          "id": 14,
          "provider_id": false,
          "account_number": "123.123.456.456",
          "type": "transfer",
          "total_amount": 12044,
          "image": 'http://static.skytors.id/payment_acquirer/bca.png',
          "currency": "IDR",
          "bank": {
            "code": "014",
            "name": "BANK BCA"
          },
          "account_name": "Vincent HR",
          "name": "BCA #1",
          "return_url": "/payment/transfer/feedback?acq_id=14",
          "price_component": {
            "fee": 0,
            "unique_amount": 44,
            "amount": 12000
          }
        },
        {
          "id": 15,
          "provider_id": false,
          "account_number": "456.123.456.123",
          "type": "transfer",
          "total_amount": 12737,
          "image": 'http://static.skytors.id/payment_acquirer/bca.png',
          "currency": "IDR",
          "bank": {
            "code": "014",
            "name": "BANK BCA"
          },
          "account_name": "Vincentius Hadi",
          "name": "BCA #2",
          "return_url": "/payment/transfer/feedback?acq_id=15",
          "price_component": {
            "fee": 0,
            "unique_amount": 737,
            "amount": 12000
          }
        },
        {
          "id": 12,
          "provider_id": false,
          "account_number": "123.123.123.123",
          "type": "transfer",
          "total_amount": 12517,
          "image": 'http://static.skytors.id/payment_acquirer/mandiri.png',
          "currency": "IDR",
          "bank": {
            "code": "008",
            "name": "BANK MANDIRI"
          },
          "account_name": "Centus Hadi",
          "name": "Mandiri #1",
          "return_url": "/payment/transfer/feedback?acq_id=12",
          "price_component": {
            "fee": 0,
            "unique_amount": 517,
            "amount": 12000
          }
        }
      ],
      "va": [
        {
          "id": 16,
          "provider_id": 359,
          "account_number": "1239616869655",
          "type": "va",
          "total_amount": 17000,
          "image": false,
          "currency": "IDR",
          "bank": {
            "code": "014",
            "name": "BANK BCA"
          },
          "account_name": "-",
          "name": "Virtual Account BCA",
          "return_url": "/payment/va/feedback?acq_id=16",
          "price_component": {
            "fee": 5000,
            "unique_amount": 0,
            "amount": 12000
          }
        }
      ],
      "cash": [
        {
          "id": 13,
          "provider_id": false,
          "account_number": "",
          "type": "cash",
          "total_amount": 17000,
          "image": 'http://static.skytors.id/payment_acquirer/cash.png',
          "currency": "IDR",
          "bank": {
            "code": false,
            "name": false
          },
          "account_name": "Centus Hadi",
          "name": "Cash",
          "return_url": "/payment/cash/feedback?acq_id=13",
          "price_component": {
            "fee": 5000,
            "unique_amount": 0,
            "amount": 12000
          }
        }
      ],
      "installment": [
        {
          "id": 17,
          "provider_id": 359,
          "account_number": "",
          "type": "installment",
          "total_amount": 17000,
          "image": 'http://static.skytors.id/payment_acquirer/credit_cards.png',
          "currency": "IDR",
          "bank": {
            "code": false,
            "name": false
          },
          "account_name": "-",
          "name": "Credit Card (All)",
          "return_url": "/payment/installment/feedback?acq_id=17",
          "price_component": {
            "fee": 5000,
            "unique_amount": 0,
            "amount": 12000
          }
        },
        {
          "id": 18,
          "provider_id": 359,
          "account_number": "",
          "type": "installment",
          "total_amount": 17000,
          "image": 'http://static.skytors.id/payment_acquirer/credit_cards.png',
          "currency": "IDR",
          "bank": {
            "code": "022",
            "name": "BANK CIMB NIAGA"
          },
          "account_name": "-",
          "name": "Credit Card CIMB Promo #1",
          "return_url": "/payment/installment/feedback?acq_id=18",
          "price_component": {
            "fee": 5000,
            "unique_amount": 0,
            "amount": 12000
          }
        },
        {
          "id": 19,
          "provider_id": 359,
          "account_number": "",
          "type": "installment",
          "total_amount": 17000,
          "image": 'http://static.skytors.id/payment_acquirer/credit_cards.png',
          "currency": "IDR",
          "bank": {
            "code": "022",
            "name": "BANK CIMB NIAGA SYARIAH"
          },
          "account_name": "-",
          "name": "Credit Card CIMB Promo #2",
          "return_url": "/payment/installment/feedback?acq_id=19",
          "price_component": {
            "fee": 5000,
            "unique_amount": 0,
            "amount": 12000
          }
        }
      ]
    }
  }
}

payment_acq2 = {
  "jsonrpc": "2.0",
  "id": null,
  "result": {
    "error_code": 0,
    "error_msg": "",
    "response": {
      "cash": [
        {
          "id": 11,
          "name": "Cash",
          "account_name": "-",
          "account_number": "",
          "bank": {
            "name": "",
            "code": ""
          },
          "type": "cash",
          "provider_id": "",
          "currency": "IDR",
          "price_component": {
            "amount": 1000,
            "fee": 0,
            "unique_amount": 0
          },
          "total_amount": 1000,
          "image": "",
          "return_url": "/payment/cash/feedback?acq_id=11"
        }
      ],
      "credit_limit": [
        {
          "name": "Mahardika Perkasa",
          "actual_balance": 10000000,
          "credit_limit": 10000000
        },
        {
          "name": "Bangun Karya",
          "actual_balance": 5000000,
          "credit_limit": 5000000
        }
      ]
    },
    "sid": "session_id=4d39718e5c6d7b898c77bb1306b460a5c4ea4e5e; Expires=Sun, 03-Nov-2019 09:13:17 GMT; Max-Age=7776000; HttpOnly; Path=/",
    "cookies": {
      "session_id": "4d39718e5c6d7b898c77bb1306b460a5c4ea4e5e"
    }
  }
}

console.log(payment_acq);

function get_payment_acq(val,booker_seq_id,order_number,transaction_type,signature,type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/payment",
       headers:{
            'action': 'get_payment_acquirer',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'order_number': order_number,
            'booker_seq_id': booker_seq_id,
            'order_number': order_number,
            'transaction_type': transaction_type,
            'signature': signature,
            'type': type
       },
       success: function(msg) {
            console.log(msg);
            payment_acq2 = msg;
            text=`
    <h6 style="padding-bottom:10px;">1. Payment Via: </h6>
    <div class="input-container-search-ticket btn-group">

        <div class="form-select" id="default-select">
            <select class="payment_method" id="payment_method" onchange="set_payment('`+val+`');">`;
            for(i in payment_acq2.result.response){

                if(i == 'transfer')
                    print = 'Transfer';
                else if(i == 'va')
                    print = 'Virtual Account';
                else if(i == 'cash')
                    print = 'Cash';
                else if(i == 'installment')
                    print = 'Installment';
                else if(i == 'credit_limit')
                    print = 'Credit Limit';

                text+=`<option value="`+i+`">`+print+`</option>`;
            }
            text+=`</select>
                </div>
            </div>`;

            text+=`
            <div id="payment_description"></div>`
            text+=`
                </div>`;
            document.getElementById('payment_acq').innerHTML += text;
            set_payment(val);
            document.getElementById('payment_acq').hidden = false;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function set_payment(val){
    payment_method = document.getElementById('payment_method').value;
    text= '';
    for(i in payment_acq2.result.response[payment_method]){
//        <span style="font-size:14px;">`+payment_acq.result.response.acquirers[payment_method][i].name+`</span>
        text+=`

        <label class="radio-button-custom">
            <span style="font-size:14px; font-weight:500;">`+payment_acq2.result.response[payment_method][i].name+`<br>
            <img width="50px" height="auto" src="`+payment_acq2.result.response[payment_method][i].image+`"/></span>
            <input type="radio" name="radio_payment_type" value="`+i+`" onclick="set_price('`+val+`');">
            <span class="checkmark-radio"></span>
        </label><br/>`;
    }
    text += '<div id="set_price"></div>'
    document.getElementById('payment_description').innerHTML = text;
}

function set_price(val){
    var selected = '';
    var radios = document.getElementsByName('radio_payment_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            selected = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    text = '';
    text += ` <h6 style="padding-bottom:10px;">2. Payment Detail: </h6>`;
    text+= `<div class='row'>`;
    if(payment_method == 'cash'){
        //price
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Price:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq2.result.response[payment_method][selected].currency+` `+getrupiah(payment_acq2.result.response[payment_method][selected].price_component.amount)+`</span>
                </div>`;
        //fee
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Fee:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq.result.response[payment_method][selected].currency+` `+getrupiah(payment_acq.result.response[payment_method][selected].price_component.fee)+`</span>
                </div>`;
        //unique amount
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span>Unique Amount:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+payment_acq.result.response[payment_method][selected].currency+` `+getrupiah(payment_acq.result.response[payment_method][selected].price_component.unique_amount)+`</span>
                </div>`;

    //    grand total
        text += `
                <div class='col-sm-6' style='text-align:left;'>
                    <span style='font-weight:500;'>Grand Total:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span style='font-weight:500;'>`+payment_acq2.result.response[payment_method][selected].currency+` `+getrupiah(payment_acq2.result.response[payment_method][selected].price_component.amount + payment_acq2.result.response[payment_method][selected].price_component.fee)+`</span>
                </div>`;
        text+= `</div><br/>`;
        text += '<button type="button" class="primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="show_loading();check_hold_booking();" style="width:100%;">Issued <div class="ld ld-ring ld-cycle"></div></button>';
    }else if(payment_method == 'credit_limit'){
        usage = payment_acq2.result.response[payment_method][selected].credit_limit - payment_acq2.result.response[payment_method][selected].actual_balance;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Usage:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+getrupiah(usage)+`</span>
                </div>`;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Balance:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+getrupiah(payment_acq2.result.response[payment_method][selected].actual_balance)+`</span>
                </div>`;
        text+= `<div class='col-sm-6' style='text-align:left;'>
                    <span>Credit Limit:</span>
                </div>
                <div class='col-sm-6' style='text-align:right;'>
                    <span>`+getrupiah(payment_acq2.result.response[payment_method][selected].credit_limit)+`</span>
                </div>`;
        text+= `</div><br/>`;
        text += '<button type="button" class="primary-btn hold-seat-booking-train next-loading ld-ext-right" onclick="show_loading();check_hold_booking();" style="width:100%;">Issued <div class="ld ld-ring ld-cycle"></div></button>';
    }
    document.getElementById('set_price').innerHTML = text;
}

function testing_bca(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bca",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
        'username':$('#username').val(),
        'password':$('#password').val()
       },
       success: function(msg) {
        if(msg == 0){
            gotoForm();
        }else{
            alert('Wrong Username or Password !');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}