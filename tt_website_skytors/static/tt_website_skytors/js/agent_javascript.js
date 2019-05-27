data_counter = 0;
data_search = [];
function table_reservation(data){
    text= '';
    var node = document.createElement("tr");
    for(i in data){
        data_search.push(data[i]);
        text+=`
        <form action="" method="POST" id="gotobooking`+data_counter+`" />
        <tr>
            <td name="order_number">`+data[i].name+`</td>`;
        try{
            if(data[i].transport_type == 'airline')
                text+=`<td><img data-toggle="tooltip" title="" class="airline-logo" src="http://static.skytors.id/`+airline_carriers[data[i].provider]+`.png"><span> </span></td>`;
        }catch(err){

        }
        text+= `<td>`+data[i].state+`</td>`;
        text+= `<td>`+data[i].pnr+`</td>`;
        text+= `<td>`+data[i].agent_id+`</td>`;
        text+= `<td>`+data[i].book_date+`</td>`;
        text+= `<td>`+data[i].contact_id+`</td>`;
        text+= `<td>`+data[i].hold_date+`</td>`;
        text+= `<td>`+data[i].issued_date+`</td>`;
        text+= `<td>`+data[i].issued_uid+`</td>`;
        if(data[i].state != 'fail_booking')
            text+= `<td><input type='button' value='search' onclick="goto_detail_reservation(`+data_counter+`)" /></td>`;
        text+= `</tr>`;
        node.innerHTML = text;
        document.getElementById("table_reservation").appendChild(node);
        node = document.createElement("tr");
//                   document.getElementById('airlines_ticket').innerHTML += text;
        text = '';
        data_counter++;
    }
}

function table_top_up_history(data){
    text= '';
    var node = document.createElement("tr");
    for(i in data){
        data_search.push(data[i]);
        text+=`
        <form action="" method="POST" id="gotobooking`+data_counter+`" />
        <tr>
            <td name="order_number">`+data[i].name+`</td>`;
        text+= `<td>`+data[i].payment_methods+`</td>`;
        text+= `<td>`+data[i].due_date+`</td>`;
        text+= `<td>`+data[i].state+`</td>`;
        text+= `<td>`+data[i].total+`</td>`;
        if(data[i].state != 'cancel')
            text+= `<td><input type='button' value='search' onclick="goto_detail_reservation(`+data_counter+`)" /></td>`;
        text+= `</tr>`;
        node.innerHTML = text;
        document.getElementById("table_top_up_history").appendChild(node);
        node = document.createElement("tr");
//                   document.getElementById('airlines_ticket').innerHTML += text;
        text = '';
        data_counter++;
    }
}

function total_price_top_up(){
    var sel = document.getElementById("amount");
    var text= sel.options[sel.selectedIndex].text;
    var amount = text.split('.');
    var price = '';
    for(i in amount){
        if(i != 0)
            price +=amount[i];
    }
    document.getElementById('total_amount').value = (parseInt(price) * parseInt(document.getElementById('qty').value)) + parseInt(document.getElementById('unique_amount').value);
}

function payment_top_up(){
    text = '';
    console.log(document.getElementById('payment_selection').value);
    for(i in response.acquirers){
        if(i == document.getElementById('payment_selection').value){
            for(j in response.acquirers[i]){
                if(j == 0){
                    text += `
                    <label>
                        <input type="radio" name="acquirer" value="`+response.acquirers[i][j].id+`" checked="checked" onclick="set_radio_payment('`+i+`');">
                        <span title="Cash"><img class="img img-responsive" src="data:image/jpeg;base64, `+response.acquirers[i][j].image+`" style="max-width: 60px; display: inline-block"></span>
                        <span>`+response.acquirers[i][j].name+`</span><br/>
                    </label>`;
                }else{
                    text += `
                    <label>
                        <input type="radio" name="acquirer" value="`+response.acquirers[i][j].id+`" onclick="set_radio_payment('`+i+`');">
                        <span title="Cash"><img class="img img-responsive" src="data:image/jpeg;base64, `+response.acquirers[i][j].image+`" style="max-width: 60px; display: inline-block"></span>
                        <span>`+response.acquirers[i][j].name+`</span>
                    </label>`;
                }
            }
            document.getElementById('payment').innerHTML = text;

            if(i == 'tt_transfer'){
                set_radio_payment('tt_transfer');
                document.getElementById('total_amount').innerHTML = `<span>Total IDR `+getrupiah(response.acquirers[i][0].amount+unique_amount)+`</span>`;
            }else if('sgo_va'){
                set_radio_payment('sgo_va');
                document.getElementById('total_amount').innerHTML = `<span>Total IDR `+getrupiah(response.acquirers[i][0].amount)+`</span>`;
            }else{
                document.getElementById('total_amount').innerHTML = `<span>Total IDR `+getrupiah(response.acquirers[i][0].amount)+`</span>`;
            }


            break;
        }
    }
}

function set_radio_payment(type){
    var radios = document.getElementsByName('acquirer');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            id = j;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    console.log(id);
    console.log(type);
    for(i in response.acquirers){
        if(i == document.getElementById('payment_selection').value){
            for(j in response.acquirers[i]){
                if(j == id){
                    console.log(j);
                    console.log(response.acquirers[i][j]);
                    if(type == 'tt_transfer'){
                        document.getElementById('desc').innerHTML = `
                        <label>Bank `+response.acquirers[i][j].name+`</label>
                        <br/>
                        <label>No Rekening `+response.acquirers[i][j].number+`</label>`;
                        console.log('inhere');
                    }
                    else if(type == 'sgo_va')
                        document.getElementById('desc').innerHTML = `
                        <label>`+response.acquirers[i][j].name+`</label>
                        <br/>
                        <label>No Virtual Account `+response.acquirers[i][j].number+`</label>`;
                }
            }
        }
    }
}

function getrupiah(price){
    var pj = price.toString().length;
    var temp = price.toString();
    var priceshow="";
    for(x=0;x<pj;x++){
        if((pj-x)%3==0 && x!=0){
        priceshow+=",";
        }
        priceshow+=temp.charAt(x);
    }
    return priceshow;

}

//    if(document.getElementById('payment_selection').value == 'cash'){
//        text = '';
//        for(i in response.acquirers.cash){
//            text += `
//            <label>
//                <input type="radio" name="acquirer" value="`+response.acquirers.cash[i].id+`" checked="checked">
//                <span title="Cash"><img class="img img-responsive" src="data:image/jpeg;base64, `+response.acquirers.cash[i].image+`" style="max-width: 60px; display: inline-block"></span>
//                <span>Cash</span>
//            </label>`;
//        }
//        document.getElementById('payment').innerHTML = text;
//        document.getElementById('total_amount').innerHTML = `<span>`+response.acquirer.cash[0].amount+`</span>`;
//
//    }else if(document.getElementById('payment_selection').value == 'transfer'){
//        console.log(response);
//        text = '';
//        for(i in response.acquirers.tt_transfer){
//            text += `
//            <label>
//                <input type="radio" name="acquirer" value="`+response.acquirers.tt_transfer[i].id+`" checked="checked">
//                <span title="Transfer"><img class="img img-responsive" src="data:image/jpeg;base64, `+response.acquirers.tt_transfer[i].image+`" style="max-width: 60px; display: inline-block"></span>
//                <span>response.acquirers.tt_transfer[i].name</span>
//                <span>response.acquirers.tt_transfer[i].number</span>
//            </label>`;
//        }
//        document.getElementById('payment').innerHTML = text;
//        document.getElementById('total_amount').innerHTML = `<span>`+response.acquirer.tt_transfer[0].amount+`</span>`;
//    }
