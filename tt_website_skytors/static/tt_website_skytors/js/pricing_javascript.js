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
list = [];
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
    text= '';
    var node = document.createElement("div");
    text += `
    <div class="col-lg-4" style="padding:0px;">
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
    <div class="col-lg-4" style="padding:0px;">
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
        <div class="col-lg-4" style="padding:0px;">
            <span style="font-size:11px;">Price (number or percentage)</span><br/>
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
        var element = document.getElementById('div'+counter);
        element.parentNode.removeChild(element);
    }
}

function add_repricing(){
    for(j in price_arr_repricing){
       total = 0
       for(k in price_arr_repricing[j]){
           total += price_arr_repricing[j][k];
       }
       price_arr_repricing[j]['total'] = total;
    }
}

function calculate(type){
    price_duplication = JSON.parse(JSON.stringify(price_arr_repricing));
    list = [];
    for(i in price_duplication){
        price_duplication[i].Repricing = 0;
    }
    for(i=0;i<counter;i++){
        var selection_calculation = document.getElementById('calculation'+i).value;
        var selection_pax = document.getElementById('selection_pax'+i).value;
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
                list.push((price_duplication[selection_pax]['Fare'] + price_duplication[selection_pax]['Tax'] + price_duplication[selection_pax]['Repricing']) * parseFloat(selection_calculation) / 100);
                price_duplication[selection_pax]['Repricing'] = price_duplication[selection_pax]['Repricing'] + ((price_duplication[selection_pax]['Fare'] + price_duplication[selection_pax]['Tax'] + price_duplication[selection_pax]['Repricing']) * parseFloat(selection_calculation) / 100) ;
                total = 0;
                for(j in price_duplication[selection_pax]){
                    if(j != 'total')
                        total += price_duplication[selection_pax][j];
                }
                price_duplication[selection_pax]['total'] = total
            }else{
                price_duplication[selection_pax]['Repricing'] = price_duplication[selection_pax]['Repricing'] + parseFloat(selection_calculation);
                list.push(parseFloat(selection_calculation));
                total = 0;
                for(j in price_duplication[selection_pax]){
                    if(j != 'total')
                        total += price_duplication[selection_pax][j];
                }
                price_duplication[selection_pax]['total'] = total
            }
        }else if(document.getElementById('selection_type'+i).value == 'discount'){
            if(selection_calculation.match('%')){
                if(parseFloat(selection_calculation) > 100){
                    alert('Max discount 100%');
                }else{
                    list.push((price_duplication[selection_pax]['Fare'] + price_duplication[selection_pax]['Tax'] + price_duplication[selection_pax]['Repricing']) * parseFloat(selection_calculation) / 100);
                    price_duplication[selection_pax]['Repricing'] = price_duplication[selection_pax]['Repricing'] + ((price_duplication[selection_pax]['Fare'] + price_duplication[selection_pax]['Tax'] + price_duplication[selection_pax]['Repricing']) * parseFloat(selection_calculation) / 100 * -1);
                    total = 0;
                    for(j in price_duplication[selection_pax]){
                        if(j != 'total')
                            total += price_duplication[selection_pax][j];
                    }
                    price_duplication[selection_pax]['total'] = total
                }
            }else{
                list.push(parseFloat(selection_calculation) * -1);
                price_duplication[selection_pax]['Repricing'] = price_duplication[selection_pax]['Repricing'] + (parseFloat(selection_calculation) * -1);
                total = 0;
                for(j in price_duplication[selection_pax]){
                    if(j != 'total')
                        total += price_duplication[selection_pax][j];
                }
                price_duplication[selection_pax]['total'] = total
            }
        }
    }
    if(type == 'visa'){
        for(i in price_duplication)
            for(j in price_duplication[i]){
                if(j != 'currency')
                    document.getElementById(i+'_'+j).innerHTML = price_duplication[i][j];
            }
    }else if(type == 'airline'){
        for(i in price_duplication){
            document.getElementById(i+'_price').innerHTML = getrupiah(price_duplication[i].Fare + price_duplication[i].Tax);
            document.getElementById(i+'_repricing').innerHTML = getrupiah(price_duplication[i].Repricing);
            document.getElementById(i+'_total').innerHTML = getrupiah(price_duplication[i].total);
        }
        text = `<input class="primary-btn-ticket" type="button" onclick="update_service_charge();" value="Set Upsell Downsell">`;
        document.getElementById('repricing_button').innerHTML = `<input class="primary-btn-ticket" type="button" onclick="update_service_charge();" value="Set Upsell Downsell">`;
    }else if(type == 'train'){
        console.log(price_duplication);
        for(i in price_duplication){

            document.getElementById(i+'_price').innerHTML = getrupiah(price_duplication[i].Fare + price_duplication[i].Tax);
            document.getElementById(i+'_repricing').innerHTML = getrupiah(price_duplication[i].Repricing);
            document.getElementById(i+'_total').innerHTML = getrupiah(price_duplication[i].total);
        }
        text = `<input class="primary-btn-ticket" type="button" onclick="update_service_charge();" value="Set Upsell Downsell">`;
        document.getElementById('repricing_button').innerHTML = `<input class="primary-btn-ticket" type="button" onclick="update_service_charge();" value="Set Upsell Downsell">`;
    }else if(type == 'activity'){
        console.log(price_duplication);
        for(i in price_duplication){
            console.log(price_duplication[i]);
            document.getElementById(i+'_price').innerHTML = getrupiah(price_duplication[i].Fare + price_duplication[i].Tax);
            document.getElementById(i+'_repricing').innerHTML = getrupiah(price_duplication[i].Repricing);
            document.getElementById(i+'_total').innerHTML = getrupiah(price_duplication[i].total);
        }
        text = `<input class="primary-btn-ticket" type="button" onclick="update_service_charge();" value="Set Upsell Downsell">`;
        document.getElementById('repricing_button').innerHTML = `<input class="primary-btn-ticket" type="button" onclick="update_service_charge();" value="Set Upsell Downsell">`;
    }
}
