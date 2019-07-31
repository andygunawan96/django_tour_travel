/*
DOCUMENT
type_amount_repricing --> tidak usa diberi 'Total'
price_arr_repricing --> tidak usa diberi total
untuk total setelah mengisi type amount, pax type, dan price arr copy fungsi ini add_repricing();
currency bisa diset langsung tapi gatau space kolom nya cukup ngga
bisa liat contoh di airline

*/

counter = 0;
type_amount_repricing = []; // --> list of string ['Fare', 'Commission']
pax_type_repricing = []; // --> list of list ex : [['nama pax key','nama pax tampil'],['CHD','Child']]
price_arr_repricing = {}; // --> dict of dict ex : {'nama pax tampil':{'total_price':50,'commission':20}} -- di tambah total
currency = '';
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
        if(document.getElementById("selection_fare"+temp).value == 'total' && type_amount_repricing.length != 0){
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

function add_repricing(){
    for(j in price_arr_repricing){
       total = 0
       for(k in price_arr_repricing[j]){
           console.log(price_arr_repricing[j][k]);
           total += price_arr_repricing[j][k];
       }
       console.log(total);
       price_arr_repricing[j]['total'] = total;
    }
}

function calculate(type){
    price_duplication = JSON.parse(JSON.stringify(price_arr_repricing));
    console.log(price_duplication);
    for(i=0;i<counter;i++){
        var selection_calculation = document.getElementById('calculation'+i).value;
        var selection_pax = document.getElementById('selection_pax'+i).value;
        var selection_fare = document.getElementById('selection_fare'+i).value;
        console.log(selection_fare);
        console.log(selection_pax);
        console.log(selection_calculation);
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
                    if(type_amount_repricing.length != 0){
                        for(j in type_amount_repricing)
                            total += price_duplication[selection_pax][type_amount_repricing[j]];
                        price_duplication[selection_pax]['total'] = total;
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax][selection_fare];
                    }
                }else{
                    console.log(type_amount_repricing);
                    if(type_amount_repricing.length != 0){
                        total = 0;
                        for(j in type_amount_repricing){
                            total += price_duplication[selection_pax][type_amount_repricing[j]] + (price_duplication[selection_pax][type_amount_repricing[j]] * parseFloat(selection_calculation) / 100);
                            price_duplication[selection_pax][type_amount_repricing[j]] = price_duplication[selection_pax][type_amount_repricing[j]] + (price_duplication[selection_pax][type_amount_repricing[j]] * parseFloat(selection_calculation) / 100);
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
                        for(j in type_amount_repricing){
                            total += price_duplication[selection_pax][type_amount_repricing[j]];
                        }
                        price_duplication[selection_pax]['total'] = total
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax][selection_fare];
                    }
                }else{
                    if(type_amount_repricing.length != 0){
                        console.log(type_amount_repricing);
                        total = 0;
                        for(j in type_amount_repricing){
                            total += price_duplication[selection_pax][type_amount_repricing[j]] + parseFloat(selection_calculation);
                        }
                        price_duplication[selection_pax]['total'] = total;
                    }else{
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
                        total = 0;
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
                        total =0;
                        for(j in type_amount_repricing){
                            if(type_amount_repricing!='Total')
                                total += price_duplication[selection_pax][type_amount_repricing[j]] -  parseFloat(selection_calculation) / 100;
                        }
                        price_duplication[selection_pax]['total'] = total;
                    }else{
                        price_duplication[selection_pax]['total'] = price_duplication[selection_pax]['total'] - parseFloat(selection_calculation);
                    }
                }
            }
        }
    }
    console.log(type);
    if(type == 'visa'){
        console.log(price_duplication);
        for(i in price_duplication)
            for(j in price_duplication[i]){
                if(j != 'currency')
                    document.getElementById(i+'_'+j).innerHTML = price_duplication[i][j];
            }
    }else if(type == 'airline'){
        console.log(price_duplication);
        for(i in price_duplication)
            for(j in price_duplication[i]){
                document.getElementById(i+'_'+j).innerHTML = getrupiah(price_duplication[i][j]);
            }
    }
    console.log(price_duplication);
}