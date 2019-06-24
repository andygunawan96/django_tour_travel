

function visa_autocomplete(type){
    if(type == 'consulate'){
        document.getElementById('visa_consulate_id_hidden').value = document.getElementById('select2-visa_consulate_id-container').innerHTML;
    }else if(type == 'destination'){
        document.getElementById('visa_destination_id_hidden').value = document.getElementById('select2-visa_destination_id-container').innerHTML;
        document.getElementById('visa_consulate_id_hidden').value = document.getElementById('select2-visa_destination_id-container').innerHTML;
        get_consulate();
    }
}

function get_consulate(type){
    consulate_box = document.getElementById('visa_consulate_id');
    if(consulate_box.options.length > 1)
        for(i = consulate_box.options.length - 1 ; i >= 0 ; i--){
            consulate_box.remove(i);
        }
    for(i in visa_config){
        if(document.getElementById('visa_destination_id_hidden').value == visa_config[i].country){
            for(j in visa_config[i].consulate){
                var node = document.createElement("option");
                node.text = visa_config[i].consulate[j];
                node.value = visa_config[i].consulate[j];
                if(j == 0 && type == 'home'){
                    node.setAttribute('selected', 'selected');
                    document.getElementById('visa_consulate_id_hidden').value = visa_config[i].consulate[j];
                }else if(type == 'search'){
                    if(visa_request['consulate'] == visa_config[i].consulate[j]){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_consulate_id_hidden').value = visa_config[i].consulate[j];
                    }
                }
                consulate_box.add(node);
            }

        }
    }
    if(type == 'search')
        visa_signin('');
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

function set_price_visa(val){
    price = 0;
    qty = document.getElementById('qty_pax_'+val).value;
    price += parseInt(qty) * visa[val].sale_price.total_price;
    document.getElementById('fare'+val).innerHTML = 'IDR '+ getrupiah(price.toString());
}

function set_total_price_visa(){
    price = 0;
    for(i in visa){
        qty = document.getElementById('qty_pax_'+i).value;
        price += parseInt(qty) * visa[i].sale_price.total_price;
    }
    //tinggal set html
}

function set_commission_price_visa(){
    price = 0;
    for(i in visa){
        qty = document.getElementById('qty_pax_'+i).value;
        price += parseInt(qty) * visa[i].sale_price.commission;
    }
    //tinggal set html
}

function update_table(){
    text = `<h4>Price detail</h4>
            <table width="100%">`;
    price = 0;
    commission = 0;
    for(i in visa){
        pax_count = parseInt(document.getElementById('qty_pax_'+i).value);
        if(isNaN(pax_count))
            pax_count = 0;
        text+=`
                <tr>
                    <td>`+pax_count+`x `+visa[i].pax_type[1]+`</td>
                    <td style="text-align:right;">IDR `+getrupiah(visa[i].sale_price.total_price)+`</td>
                </tr>`;
        try{

            price += pax_count * visa[i].sale_price.total_price;
            commission += pax_count * visa[i].sale_price.commission;
        }catch(err){

        }
    }

    text+=`
                <tr>
                    <td>Grand Total</td>
                    <td style="text-align:right;">IDR `+getrupiah(price)+`</td>
                </tr>
            </table>
            <div class="row" id="show_commission" style="display: none;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px;">Your Commission: IDR `+getrupiah(commission)+`</span><br>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12" style="padding-bottom:5px;">
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Hide Commission"><br>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
                    <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
                    <button class="primary-btn-ticket next-search-train ld-ext-right" style="width:100%;" onclick="show_loading();" type="submit" value="Next">
                        Next
                        <i class="fas fa-angle-right"></i>
                        <div class="ld ld-ring ld-cycle"></div>
                    </button>
                </div>
            </div>
            `;
    document.getElementById('detail').innerHTML = text;
}

function show_commission(){
    if(document.getElementById('show_commission').style.display == 'none')
        document.getElementById('show_commission').style.display = 'block';
    else
        document.getElementById('show_commission').style.display = 'none';
}

function copy_data(){
    $text = '';
    for(i in visa){
        $text += 'Visa '+ country +'('+getrupiah(visa[i].sale_price.total_price)+')\n';
        $text += visa[i].pax_type[1]+ ' ' + visa[i].visa_type[1] + ' ' + visa[i].entry_type[1] + ' ' + visa[i].type.process_type[1] + ' ' + visa[i].type.duration + ' day(s)' + '\n\n';
        $text += 'Consulate Address :\n';
        $text += visa[i].consulate.address + ', ' + visa[i].consulate.city + '\n\n';
        $text += 'Visa Requirement:\n';
        for(j in visa[i].requirements){
            $text += visa[i].requirements[j].name;
            if(visa[i].requirements[j].description)
                $text += ': ' + visa[i].requirements[j].description;
            $text += '\n';
        }
        $text += '\n';
    }
    console.log($text);
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}