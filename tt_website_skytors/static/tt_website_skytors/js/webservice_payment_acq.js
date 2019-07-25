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
console.log(payment_acq);

function get_payment_acq(val){
    text = `
        <div class="col-lg-12">
            <div class="input-container-search-ticket btn-group">
                <div class="form-select">
                    <select id="payment_method" onchange="set_payment(`+val+`);">`;

    print = '';
    for(i in payment_acq.result.response){

        if(i == 'transfer')
            print = 'Transfer';
        else if(i == 'va')
            print = 'Virtual Account';
        else if(i == 'cash')
            print = 'Cash';
        else if(i == 'installment')
            print = 'Installment';

        text+=`<option value="`+i+`">`+print+`</option>`;
    }
    text+=` </select>
            </div>
        </div>`;
    text+=`<div id="payment_description"></div>`
    text+=`
        </div>`;
    document.getElementById('payment_acq').innerHTML += text;
    set_payment(val);
    $('select').niceSelect();
    document.getElementById('payment_acq').hidden = false;
}

function set_payment(val){
    payment_method = document.getElementById('payment_method').value;
    text= '';
    for(i in payment_acq.result.response[payment_method]){
//        <span style="font-size:14px;">`+payment_acq.result.response.acquirers[payment_method][i].name+`</span>
        text+=`
                <label class="radio-button-custom">
                    <span style="font-size:14px;">`+payment_acq.result.response[payment_method][i].name+`</span>
                    <img width="40px" height="40px" src="`+payment_acq.result.response[payment_method][i].image+`"/>
                    <input type="radio" name="radio_payment_type" value="`+i+`" onclick="set_price(`+val+`);">
                    <span class="checkmark-radio"></span>
                </label>`;
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
    //name - acc number
    if(payment_acq.result.response[payment_method][selected].account_name != '' && payment_acq.result.response[payment_method][selected].account_name != '-')
        text += `<span style="font-size:14px;">`+payment_acq.result.response[payment_method][selected].account_name+`</span>`;
    if(text != '' && payment_method != 'cash')
        text += ` - `;
    if(payment_method == 'va')
        text += `<span style="font-size:14px;">Virtual Account Number: </span>`;
    if(payment_acq.result.response[payment_method][selected].account_number != '' && payment_acq.result.response[payment_method][selected].account_number != '-')
        text += `<span style="font-size:14px;">`+payment_acq.result.response[payment_method][selected].account_number+`</span>`;
    if(text != '')
        text += '<br/>';
    text+= `<div class='row'>`;
    //price
    text += `
            <div class='col-sm-6'>
                Price:
            </div>
            <div class='col-sm-2'>
                `+payment_acq.result.response[payment_method][selected].currency+`
            </div>
            <div class='col-sm-4' style='text-align:right;'>
                `+getrupiah(payment_acq.result.response[payment_method][selected].price_component.amount)+`
            </div>`;
    //fee
    text += `
            <div class='col-sm-6'>
                Fee:
            </div>
            <div class='col-sm-2'>
                `+payment_acq.result.response[payment_method][selected].currency+`
            </div>
            <div class='col-sm-4' style='text-align:right;'>
                `+getrupiah(payment_acq.result.response[payment_method][selected].price_component.fee)+`
            </div>`;
    //grand total
    text += `
            <div class='col-sm-6'>
                Grand Total:
            </div>
            <div class='col-sm-2'>
                `+payment_acq.result.response[payment_method][selected].currency+`
            </div>
            <div class='col-sm-4' style='text-align:right;'>
                `+getrupiah(payment_acq.result.response[payment_method][selected].price_component.amount + payment_acq.result.response[payment_method][selected].price_component.fee)+`
            </div>`;
    text+= `</div>`;
    text += '<input class="primary-btn hold-seat-booking-train" type="button" value="'+val+'" onclick="check_hold_booking();" style="width:100%;"/>';
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