counter = 0;
type_amount_repricing = []; // --> list of string
pax_type_repricing = []; // --> list of list ex : [['ADT','Adult'],['CHD','Child']]
price_arr_repricing = {}; // --> dict of dict ex : {'Adult':{'fare':50,'tax':20}} -- di tambah total
//total wajib tinggal copy aja
/*
for(i in price_arr){
    total = 0
    for(j in price_arr[i]){
        total += price_arr[i][j];
    }
    price_arr[i]['total'] = total;
}
*/

/*
FORMAT DASAR
    TYPE AMOUNT --> list of string
    pax type --> list of list --> ['ADT','Adult']
    price --> list of Dict --> price:{'adult':{'fare':1000,'tax':1000,'total':1000}}
    price berisi list of pax --> pax berisi list of price yang di pakai sesuai yang dipakai
*/
function add_table_of_equation(){
    if(counter != 0){
        temp = counter-1;
        if(document.getElementById("selection_fare"+temp).value == 'total' && type_amount.length != 0){
            alert("Type amount has been reset please check!");
            text = '';
            for(i in type_amount_repricing){
                text += `<option value="`+type_amount[i]+`">`+type_amount_repricing[i]+`</option>`;
            }
            document.getElementById("selection_fare"+temp).innerHTML = text;
        }
    }
    text= '';
    var node = document.createElement("div");
    text += `
    <div class="col-lg-3" style="padding:0px;">
        <span style="font-size:11px;">Type</span><br/>
        <div class="form-select">
            <div class="input-container-search-ticket">
                <select id="selection_type`+counter+`" style="width:100%;">
                    <option value="upsell">Upsell</option>
                    <option value="discount">Discount</option>
                </select>
            </div>
        </div>
    </div>`;
    text += `
    <div class="col-lg-3" style="padding:0px;">
        <span style="font-size:11px;">Type Amount</span><br/>
        <div class="input-container-search-ticket">
            <div class="form-select">
                <select id="selection_fare`+counter+`" style="width:100%;">`
                for(i in type_amount_repricing){
                    text += `<option value="`+type_amount_repricing[i]+`">`+type_amount_repricing[i]+`</option>`;
                }
                text+=`
                    <option value="total">Total</option>
                </select>
            </div>
        </div>
    </div>`;
    text += `
    <div class="col-lg-3" style="padding:0px;">
        <span style="font-size:11px;">Pax Amount</span><br/>
        <div class="input-container-search-ticket">
            <div class="form-select">
                <select id="selection_pax`+counter+`" style="width:100%;">`;
                for(i in pax_type_repricing){
                    text += `<option value="`+pax_type_repricing[i][0]+`">`+pax_type_repricing[i][1]+`</option>`;
                }
                text+=`
                </select>
            </div>
        </div>
    </div>`;
    text += `
        <div class="col-lg-3" style="padding:0px;">
            <span style="font-size:11px;">Equation</span><br/>
            <div class="banner-right">
                <div class="form-wrap" style="padding:0px;">
                    <div class="input-container-search-ticket">
                        <input class="form-control" id="calculation`+counter+`" type="text" style="width:100%;"/>
                    </div>
                </div>
            </div>
        </div>`;
    node.className = 'row';
    node.innerHTML = text;
    node.setAttribute('id', 'div'+counter);
    document.getElementById("table_of_equation").appendChild(node);
    $('select').niceSelect();
    counter++;
}

function delete_table_of_equation(){
    if(counter != 0){
        counter--;
        if(counter != 0){
            temp = counter-1;
            document.getElementById("selection_fare"+temp).innerHTML = `<option value="fare">Fare</option><option value="tax">Tax</option><option value="fare">Total</option>`;
        }
        var element = document.getElementById('div'+counter);
        element.parentNode.removeChild(element);
    }
}

function calculate(type){
    price_duplication = JSON.parse(JSON.stringify(price_arr_repricing));
    console.log(price_duplication);
    for(i=0;i<counter;i++){
        var selection_calculation = document.getElementById('calculation'+i).value;
        var selection_pax = document.getElementById('selection_pax'+i).value;
        var selection_fare = document.getElementById('selection_fare'+i).value;

        console.log(selection_calculation);
        console.log(selection_pax);
        console.log(selection_fare);
        if(selection_calculation == '' || selection_calculation == null)
            selection_calculation = '0';
        if(selection_calculation.match('-')){
            var temp = '';
            for(i in selection_calculation.split('-')){
                temp += selection_calculation[i];
            }
            selection_calculation = temp;
        }
        if(document.getElementById('selection_type'+i).value == 'upsell'){
            if(selection_calculation.match('%')){
                if(selection_fare != 'total'){
                    price_duplication[selection_pax][selection_fare] = price_duplication[selection_pax][selection_fare] + ( price_duplication[selection_pax][selection_fare] * parseFloat(selection_calculation) / 100 );
                    total = 0;
                    if(type_amount.length != 0){
                        for(j in type_amount)
                            total += price_duplication[selection_pax][type_amount[j]];
                        price_duplication[selection_pax]['total'] = total;
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax][selection_fare];
                    }
                }else{
                    if(type_amount.length != 0){
                        for(j in type_amount){
                            total += price_duplication[selection_pax][type_amount[j]] + (price_duplication[selection_pax][type_amount[j]] * parseFloat(selection_calculation) / 100);
                            price_duplication[selection_pax][type_amount[j]] = price_duplication[selection_pax][type_amount[j]] + (price_duplication[selection_pax][type_amount[j]] * parseFloat(selection_calculation) / 100);
                        }
                        price_duplication[selection_pax]['total'] = total
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax]['total'] + (price_duplication[selection_pax]['total'] * parseFloat(selection_calculation) / 100);
                    }
                }
            }else{
                if(selection_fare != 'total'){
                    price_duplication[selection_pax][selection_fare] = price_duplication[selection_pax][selection_fare] + parseFloat(selection_calculation);
                    total = 0;
                    if(type_amount_repricing.length != 0){
                        for(j in type_amount_repricing)
                            total += price_duplication[selection_pax][type_amount_repricing[j]];
                        price_duplication[selection_pax]['total'] = total
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax][selection_fare];
                    }
                }else{
                    if(type_amount_repricing.length != 0){
                        for(j in type_amount_repricing){
                            total += price_duplication[selection_pax][type_amount_repricing[j]] + parseFloat(selection_calculation);
                        }
                        price_duplication[selection_pax]['total'] = total;
                    }else{
                        console.log(selection_pax);
                        console.log(price_duplication);
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax]['total'] + parseFloat(selection_calculation);
                    }
                }
            }
        }else if(document.getElementById('selection_type'+i).value == 'discount'){
            if(selection_calculation.match('%')){
                if(parseFloat(selection_calculation) > 100){
                    alert('Max discount 100%');
                }else if(selection_fare != 'total'){
                    price_duplication[selection_pax][selection_fare] = price_duplication[selection_pax][selection_fare] - ( price_duplication[selection_pax][selection_fare] * parseFloat(selection_calculation) / 100 );
                    total = 0;
                    if(type_amount_repricing.length != 0){
                        for(j in type_amount_repricing)
                            total += price_duplication[selection_pax][type_amount_repricing[j]];
                        price_duplication[selection_pax]['total'] = total;
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax][selection_fare];
                    }
                }else{
                    if(type_amount_repricing.length != 0){
                        for(j in type_amount_repricing){
                            price_duplication[selection_pax][type_amount_repricing[j]] = price_duplication[selection_pax][type_amount_repricing[j]] - (price_duplication[selection_pax][type_amount_repricing[j]] * parseFloat(selection_calculation) / 100);
                            total += price_duplication[selection_pax][type_amount_repricing[j]] + (price_duplication[selection_pax][type_amount_repricing[j]] * parseFloat(selection_calculation) / 100);
                        }
                        price_duplication[selection_pax]['total'] = total;
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax]['total'] - (price_duplication[selection_pax]['total'] * parseFloat(selection_calculation) / 100);
                    }
                }
            }else{
                if(selection_fare != 'total'){
                    price_duplication[selection_pax][selection_fare] = price_duplication[selection_pax][selection_fare] - parseFloat(selection_calculation);
                    total = 0;
                    if(type_amount_repricing.length != 0){
                        for(j in type_amount_repricing)
                            total += price_duplication[selection_pax][type_amount_repricing[j]];
                        price_duplication[selection_pax]['total'] = total;
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax][selection_fare];
                    }
                }else{
                    if(type_amount_repricing.length != 0){
                        for(j in type_amount_repricing){
                            price_duplication[selection_pax][type_amount_repricing[j]] = price_duplication[selection_pax][type_amount_repricing[j]] - (price_duplication[selection_pax][type_amount_repricing[j]] * parseFloat(selection_calculation) / 100);
                            total += price_duplication[selection_pax][type_amount_repricing[j]] -  parseFloat(selection_calculation) / 100;
                        }
                        price_duplication[selection_pax]['total'] = total;
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax]['total'] - parseFloat(selection_calculation);
                    }
                }
            }
        }
        if(type == 'visa'){
            console.log(price_duplication);
            for(i in price_duplication)
                for(j in price_duplication[i]){
                    console.log(i);
                    console.log(j);
                    document.getElementById(i+'_'+j).innerHTML = price_duplication[i][j];
                }
        }
        console.log(price_duplication);

    }
}