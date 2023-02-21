month_list = [
    ['01', 'Jan'],
    ['02', 'Feb'],
    ['03', 'Mar'],
    ['04', 'Apr'],
    ['05', 'May'],
    ['06', 'Jun'],
    ['07', 'Jul'],
    ['08', 'Aug'],
    ['09', 'Sep'],
    ['10', 'Oct'],
    ['11', 'Nov'],
    ['12', 'Dec'],
]

nominal_number_list = {
    'mkm': [
        ['0811', 'TSEL'],
        ['0812', 'TSEL'],
        ['0813', 'TSEL'],
        ['0821', 'TSEL'],
        ['0822', 'TSEL'],
        ['0852', 'TSEL'],
        ['0853', 'TSEL'],
        ['0823', 'TSEL'],
        ['0851', 'TSEL'],
        ['0814', 'ISAT'],
        ['0815', 'ISAT'],
        ['0816', 'ISAT'],
        ['0855', 'ISAT'],
        ['0856', 'ISAT'],
        ['0857', 'ISAT'],
        ['0858', 'ISAT'],
        ['0817', 'XL'],
        ['0818', 'XL'],
        ['0819', 'XL'],
        ['0859', 'XL'],
        ['0877', 'XL'],
        ['0878', 'XL'],
        ['0895', 'TR'],
        ['0896', 'TR'],
        ['0897', 'TR'],
        ['0898', 'TR'],
        ['0899', 'TR'],
        ['0881', 'SM'],
        ['0882', 'SM'],
        ['0883', 'SM'],
        ['0884', 'SM'],
        ['0885', 'SM'],
        ['0886', 'SM'],
        ['0887', 'SM'],
        ['0888', 'SM'],
        ['0889', 'SM'],
    ],
    'ppob_espay': [
        ['0811', 'TS'],
        ['0812', 'TS'],
        ['0813', 'TS'],
        ['0821', 'TS'],
        ['0822', 'TS'],
        ['0852', 'TS'],
        ['0853', 'TS'],
        ['0823', 'TS'],
        ['0851', 'TS'],
        ['0832', 'AX'],
        ['0833', 'AX'],
        ['0838', 'AX'],
        ['0814', 'IR'],
        ['0815', 'IR'],
        ['0816', 'IR'],
        ['0855', 'IR'],
        ['0856', 'IR'],
        ['0857', 'IR'],
        ['0858', 'IR'],
        ['0817', 'XR'],
        ['0818', 'XR'],
        ['0819', 'XR'],
        ['0859', 'XR'],
        ['0877', 'XR'],
        ['0878', 'XR'],
        ['0895', 'TR', 'TI'],
        ['0896', 'TR', 'TI'],
        ['0897', 'TR', 'TI'],
        ['0898', 'TR', 'TI'],
        ['0899', 'TR', 'TI'],
        ['0881', 'FR'],
        ['0882', 'FR'],
        ['0883', 'FR'],
        ['0884', 'FR'],
        ['0885', 'FR'],
        ['0886', 'FR'],
        ['0887', 'FR'],
        ['0888', 'FR'],
        ['0889', 'FR'],
        ['9991', 'BT'],
        ['9992', 'BT'],
        ['9993', 'BT'],
        ['9994', 'BT'],
        ['9995', 'BT'],
        ['9996', 'BT'],
        ['9997', 'BT'],
        ['9998', 'BT'],
        ['9999', 'BT'],
    ]
}

checking_number = 0;

function getrupiah(price){
    try{
        if(isNaN(price) == false && price.length != 0){
            var temp = parseFloat(price);
            var positif = false;
            if(temp > -1)
                positif = true;

            temp = temp.toString();
            temp = temp.split('-')[temp.split('-').length-1];
            var pj = temp.split('.')[0].toString().length;
            var priceshow="";
            for(x=0;x<pj;x++){
                if((pj-x)%3==0 && x!=0){
                    priceshow+=",";
                }
                priceshow+=temp.charAt(x);
            }
            if(temp.split('.').length == 2){
                for(x=pj;x<pj+3;x++){
                    priceshow+=temp.charAt(x);
                }
            }
            if(positif == false)
                priceshow = '-' + priceshow;

            return priceshow;
        }else{
            return '';
        }
    }catch(err){
        return price;
    }
}

function get_carrier_setup(car_provider){
    text='';
    counter = 0;
    if (car_provider == 'rodextrip_ppob')
    {
        ppob_prod_data = ppob_data.search_config_data;
    }
    else
    {
        ppob_prod_data = ppob_data.product_data;
    }
    for(i in ppob_prod_data){
        if (check_provider_has_carrier(car_provider, ppob_prod_data[i]) == true)
        {
            text+=`
            <label class="radio-img" style="vertical-align:top;">`;
            if(counter == 0){
                text+=`<input type="radio" checked="checked" name="bills_type" value="`+i+`">`;
            }else{
                text+=`<input type="radio" name="bills_type" value="`+i+`">`;
            }
            img_path = "/static/tt_website_rodextrip/images/icon/"+i.toString().toLowerCase().replace('-','').replace(' ','_')+".png";
            text+=`<img src="`+img_path+`" alt="`+i.toString().toUpperCase()+`" style="width:70px; height:70px; padding:0px;"><br/>
            <div style="text-align:center; margin-top:5px; max-width:90px; height: 50px; word-break: break-word;"><span style="font-size:13px; color:`+text_color+`;">`+i.toString().toUpperCase()+`</span></div>
            </label>`;
            counter++;
        }
    }
    document.getElementById('radio_bill_search2').innerHTML = text;
    set_container_bill();
}

function check_provider_has_carrier(car_provider, prod_data)
{
    final_res = false;
    for (j in prod_data)
    {
        cur_carrier = prod_data[j].code;
        cur_carrier = cur_carrier.split('~')[0];
        if (carrier_provider_ppob.hasOwnProperty(cur_carrier) && carrier_provider_ppob[cur_carrier].includes(car_provider))
        {
            final_res = true;
            break;
        }
    }
    return final_res;
}

function set_container_bill(){
    $bpjs_type_name = '';
    $pln_type_name = '';
    $evoucher_type_name = '';
    $cable_tv_type_name = '';
    $internet_type_name = '';
    $telephone_type_name = '';
    $insurance_type_name = '';
    $pdam_type_name = '';
    $pbb_type_name = '';
    $gas_type_name = '';
    $credit_installment_type_name = '';
    $credit_card_type_name = '';

    var radios = document.getElementsByName('bills_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            bill_type = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    var radios_prov = document.getElementsByName('bills_provider');
    for (var k = 0, prov_length = radios_prov.length; k < prov_length; k++) {
        if (radios_prov[k].checked) {
            // do whatever you want with the checked radio
            bill_prov = radios_prov[k].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    if (bill_prov == 'rodextrip_ppob')
    {
        ppob_prod_data = ppob_data.search_config_data;
    }
    else
    {
        ppob_prod_data = ppob_data.product_data;
    }

    if(template == 1){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="bpjs-select">
                            <select id="bpjs_type" name="bpjs_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_bpjs_div('`+bill_prov+`');">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $bpjs_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="bpjs_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;">
                <span class="span-search-ticket">Product Type</span>
                <div class="input-container-search-ticket">
                    <div class="form-select" id="pln-select">
                        <select id="pln_type" name="pln_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pln_div();">`;
                        car_counter = 0;
                        for(i in ppob_prod_data[bill_type]){
                            if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                            {
                                text+=`
                                <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                `;
                                if(car_counter == 0){
                                    $pln_type_name = ppob_prod_data[bill_type][i].name;
                                }
                                car_counter++;
                            }
                        }
                        text+=`
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                <div id="pln_div" class="row" style="margin-left:0px;margin-right:0px;">
                </div>
            </div>`;
        }
        else if(bill_type == 'e-voucher'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="evoucher-select">
                            <select id="evoucher_type" name="evoucher_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_evoucher_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $evoucher_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'cable tv'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="cable_tv-select">
                            <select id="cable_tv_type" name="cable_tv_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_cable_tv_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $cable_tv_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="cable_tv_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'internet'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="internet-select">
                            <select id="internet_type" name="internet_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_internet_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $internet_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="internet_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'telephone'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="telephone-select">
                            <select id="telephone_type" name="telephone_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_telephone_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $telephone_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="telephone_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'insurance'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="insurance-select">
                            <select id="insurance_type" name="insurance_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_insurance_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $insurance_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="ppob_insurance_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pdam'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pdam-select">
                            <select id="pdam_type" name="pdam_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pdam_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pdam_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="pdam_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pbb'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pbb-select">
                            <select id="pbb_type" name="pbb_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pbb_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pbb_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="pbb_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'gas'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="gas-select">
                            <select id="gas_type" name="gas_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_gas_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $gas_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="gas_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit installment'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_installment-select">
                            <select id="credit_installment_type" name="credit_installment_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_installment_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_installment_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="credit_installment_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit card'){
            text = `
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_card-select">
                            <select id="credit_card_type" name="credit_card_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_card_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_card_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="credit_card_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 2){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="bpjs-select">
                            <select id="bpjs_type" name="bpjs_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_bpjs_div('`+bill_prov+`');">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $bpjs_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="bpjs_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pln-select">
                            <select id="pln_type" name="pln_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pln_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pln_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pln_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'e-voucher'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="evoucher-select">
                            <select id="evoucher_type" name="evoucher_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_evoucher_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $evoucher_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'cable tv'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="cable_tv-select">
                            <select id="cable_tv_type" name="cable_tv_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_cable_tv_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $cable_tv_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="cable_tv_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'internet'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="internet-select">
                            <select id="internet_type" name="internet_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_internet_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $internet_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="internet_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'telephone'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="telephone-select">
                            <select id="telephone_type" name="telephone_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_telephone_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $telephone_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="telephone_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'insurance'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="insurance-select">
                            <select id="insurance_type" name="insurance_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_insurance_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $insurance_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="ppob_insurance_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pdam'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pdam-select">
                            <select id="pdam_type" name="pdam_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pdam_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pdam_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pdam_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pbb'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pbb-select">
                            <select id="pbb_type" name="pbb_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pbb_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pbb_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pbb_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'gas'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="gas-select">
                            <select id="gas_type" name="gas_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_gas_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $gas_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="gas_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit installment'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_installment-select">
                            <select id="credit_installment_type" name="credit_installment_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_installment_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_installment_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="credit_installment_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit card'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_card-select">
                            <select id="credit_card_type" name="credit_card_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_card_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_card_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="credit_card_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 3){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="bpjs-select">
                            <select id="bpjs_type" name="bpjs_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_bpjs_div('`+bill_prov+`');">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $bpjs_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="bpjs_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pln-select">
                            <select id="pln_type" name="pln_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pln_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pln_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pln_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'e-voucher'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="evoucher-select">
                            <select id="evoucher_type" name="evoucher_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_evoucher_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $evoucher_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'cable tv'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="cable_tv-select">
                            <select id="cable_tv_type" name="cable_tv_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_cable_tv_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $cable_tv_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="cable_tv_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'internet'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="internet-select">
                            <select id="internet_type" name="internet_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_internet_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $internet_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="internet_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'telephone'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="telephone-select">
                            <select id="telephone_type" name="telephone_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_telephone_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $telephone_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="telephone_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'insurance'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="insurance-select">
                            <select id="insurance_type" name="insurance_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_insurance_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $insurance_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="ppob_insurance_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pdam'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pdam-select">
                            <select id="pdam_type" name="pdam_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pdam_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pdam_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pdam_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pbb'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pbb-select">
                            <select id="pbb_type" name="pbb_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pbb_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pbb_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pbb_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'gas'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="gas-select">
                            <select id="gas_type" name="gas_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_gas_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $gas_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="gas_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit installment'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_installment-select">
                            <select id="credit_installment_type" name="credit_installment_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_installment_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_installment_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="credit_installment_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit card'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_card-select">
                            <select id="credit_card_type" name="credit_card_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_card_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_card_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="credit_card_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 4){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="bpjs-select">
                            <select id="bpjs_type" name="bpjs_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_bpjs_div('`+bill_prov+`');">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $bpjs_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="bpjs_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pln-select">
                            <select id="pln_type" name="pln_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pln_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pln_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pln_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'e-voucher'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="evoucher-select">
                            <select id="evoucher_type" name="evoucher_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_evoucher_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $evoucher_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'cable tv'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="cable_tv-select">
                            <select id="cable_tv_type" name="cable_tv_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_cable_tv_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $cable_tv_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="cable_tv_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'internet'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="internet-select">
                            <select id="internet_type" name="internet_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_internet_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $internet_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="internet_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'telephone'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="telephone-select">
                            <select id="telephone_type" name="telephone_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_telephone_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $telephone_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="telephone_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'insurance'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="insurance-select">
                            <select id="insurance_type" name="insurance_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_insurance_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $insurance_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="ppob_insurance_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pdam'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pdam-select">
                            <select id="pdam_type" name="pdam_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pdam_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pdam_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pdam_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pbb'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pbb-select">
                            <select id="pbb_type" name="pbb_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pbb_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pbb_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pbb_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'gas'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="gas-select">
                            <select id="gas_type" name="gas_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_gas_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $gas_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="gas_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit installment'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_installment-select">
                            <select id="credit_installment_type" name="credit_installment_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_installment_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_installment_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="credit_installment_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit card'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_card-select">
                            <select id="credit_card_type" name="credit_card_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_card_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_card_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="credit_card_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 5){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="bpjs-select">
                            <select id="bpjs_type" name="bpjs_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_bpjs_div('`+bill_prov+`');">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $bpjs_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="bpjs_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pln-select">
                            <select id="pln_type" name="pln_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pln_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pln_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pln_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'e-voucher'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="evoucher-select">
                            <select id="evoucher_type" name="evoucher_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_evoucher_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $evoucher_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>`;
        }
        else if(bill_type == 'cable tv'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="cable_tv-select">
                            <select id="cable_tv_type" name="cable_tv_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_cable_tv_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $cable_tv_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="cable_tv_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'internet'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="internet-select">
                            <select id="internet_type" name="internet_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_internet_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $internet_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="internet_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'telephone'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="telephone-select">
                            <select id="telephone_type" name="telephone_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_telephone_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $telephone_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="telephone_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'insurance'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="insurance-select">
                            <select id="insurance_type" name="insurance_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_insurance_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $insurance_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="ppob_insurance_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pdam'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pdam-select">
                            <select id="pdam_type" name="pdam_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pdam_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pdam_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pdam_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pbb'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pbb-select">
                            <select id="pbb_type" name="pbb_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pbb_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pbb_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="pbb_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'gas'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="gas-select">
                            <select id="gas_type" name="gas_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_gas_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $gas_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="gas_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit installment'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_installment-select">
                            <select id="credit_installment_type" name="credit_installment_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_installment_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_installment_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="credit_installment_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit card'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_card-select">
                            <select id="credit_card_type" name="credit_card_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_card_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_card_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="padding:0px; text-align:left;">
                    <div id="credit_card_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 6){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="bpjs-select">
                            <select id="bpjs_type" name="bpjs_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_bpjs_div('`+bill_prov+`');">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $bpjs_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="bpjs_div" class="row">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
            <div class="col-lg-12" style="text-align:left;">
                <span class="span-search-ticket">Product Type</span>
                <div class="input-container-search-ticket">
                    <div class="form-select" id="pln-select">
                        <select id="pln_type" name="pln_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pln_div();">`;
                        car_counter = 0;
                        for(i in ppob_prod_data[bill_type]){
                            if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                            {
                                text+=`
                                <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                `;
                                if(car_counter == 0){
                                    $pln_type_name = ppob_prod_data[bill_type][i].name;
                                }
                                car_counter++;
                            }
                        }
                        text+=`
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-12 mt-3" style="text-align:left;">
                <div id="pln_div" class="row">
                </div>
            </div>`;
        }
        else if(bill_type == 'e-voucher'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="evoucher-select">
                            <select id="evoucher_type" name="evoucher_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_evoucher_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $evoucher_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="e-voucher_div" class="row">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'cable tv'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="cable_tv-select">
                            <select id="cable_tv_type" name="cable_tv_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_cable_tv_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $cable_tv_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="cable_tv_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'internet'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="internet-select">
                            <select id="internet_type" name="internet_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_internet_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $internet_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="internet_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'telephone'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="telephone-select">
                            <select id="telephone_type" name="telephone_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_telephone_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $telephone_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="telephone_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'insurance'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="insurance-select">
                            <select id="insurance_type" name="insurance_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_insurance_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $insurance_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="ppob_insurance_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pdam'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pdam-select">
                            <select id="pdam_type" name="pdam_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pdam_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pdam_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="pdam_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pbb'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="pbb-select">
                            <select id="pbb_type" name="pbb_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_pbb_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $pbb_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="pbb_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'gas'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="gas-select">
                            <select id="gas_type" name="gas_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_gas_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $gas_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="gas_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit installment'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_installment-select">
                            <select id="credit_installment_type" name="credit_installment_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_installment_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_installment_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="credit_installment_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'credit card'){
            text = `
                <div class="col-lg-12" style="text-align:left;">
                    <span class="span-search-ticket">Product Type</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select" id="credit_card-select">
                            <select id="credit_card_type" name="credit_card_type" class="form-control js-example-basic-single" style="width:100%;" onchange="set_credit_card_div();">`;
                            car_counter = 0;
                            for(i in ppob_prod_data[bill_type]){
                                if (carrier_provider_ppob.hasOwnProperty(ppob_prod_data[bill_type][i].code.split('~')[0]) && carrier_provider_ppob[ppob_prod_data[bill_type][i].code.split('~')[0]].includes(bill_prov))
                                {
                                    text+=`
                                    <option value="`+ppob_prod_data[bill_type][i].code+`">`+ppob_prod_data[bill_type][i].name+`</option>
                                    `;
                                    if(car_counter == 0){
                                        $credit_card_type_name = ppob_prod_data[bill_type][i].name;
                                    }
                                    car_counter++;
                                }
                            }
                            text+=`
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="credit_card_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

//    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
//        text+=`
//            <div class="col-lg-12 col-md-12 col-sm-12" style="padding:0px; text-align:left;margin-bottom:10px;">
//                <div class="checkbox" id="checkbox_auto_debet">
//                    <label class="check_box_custom" style="margin-bottom:0px;">
//                        <span style="font-size:13px; color:`+text_color+`;">Auto Debet</span>
//                        <input type="checkbox" value="" id="auto_debet" name="auto_debet">
//                        <span class="check_box_span_custom"></span>
//                    </label>
//                </div>
//            </div>
//
//        `;
    document.getElementById('bill_div').innerHTML = text;
    if(bill_type == 'bpjs'){
        $('#bpjs_type').select2();
        set_bpjs_div(bill_prov);
        $('#bpjs_month').niceSelect();
    }else if(bill_type == 'pln'){
        $('#pln_type').select2();
        set_pln_div();
    }else if(bill_type == 'e-voucher'){
        $('#evoucher_type').select2();
        set_evoucher_div();
    }else if(bill_type == 'cable tv'){
        $('#cable_tv_type').select2();
        set_cable_tv_div();
    }else if(bill_type == 'internet'){
        $('#internet_type').select2();
        set_internet_div();
    }else if(bill_type == 'telephone'){
        $('#telephone_type').select2();
        set_telephone_div();
    }else if(bill_type == 'insurance'){
        $('#insurance_type').select2();
        set_insurance_div();
    }else if(bill_type == 'pdam'){
        $('#pdam_type').select2();
        set_pdam_div();
    }else if(bill_type == 'pbb'){
        $('#pbb_type').select2();
        set_pbb_div();
    }else if(bill_type == 'gas'){
        $('#gas_type').select2();
        set_gas_div();
    }else if(bill_type == 'credit installment'){
        $('#credit_installment_type').select2();
        set_credit_installment_div();
    }else if(bill_type == 'credit card'){
        $('#credit_card_type').select2();
        set_credit_card_div();
    }

}

function get_bpjs_name(){
    var bpjs_selection = document.getElementById('bpjs_type')
    $bpjs_type_name = bpjs_selection.options[bpjs_selection.selectedIndex].text;
}

function get_pln_name(){
    var pln_selection = document.getElementById('pln_type')
    $pln_type_name = pln_selection.options[pln_selection.selectedIndex].text;
}

function get_evoucher_name(){
    var evoucher_selection = document.getElementById('evoucher_type')
    $evoucher_type_name = evoucher_selection.options[evoucher_selection.selectedIndex].text;
}

function get_cable_tv_name(){
    var cable_tv_selection = document.getElementById('cable_tv_type')
    $cable_tv_type_name = cable_tv_selection.options[cable_tv_selection.selectedIndex].text;
}

function get_internet_name(){
    var internet_selection = document.getElementById('internet_type')
    $internet_type_name = internet_selection.options[internet_selection.selectedIndex].text;
}

function get_telephone_name(){
    var telephone_selection = document.getElementById('telephone_type')
    $telephone_type_name = telephone_selection.options[telephone_selection.selectedIndex].text;
}

function get_insurance_name(){
    var insurance_selection = document.getElementById('insurance_type')
    $insurance_type_name = insurance_selection.options[insurance_selection.selectedIndex].text;
}

function get_pdam_name(){
    var pdam_selection = document.getElementById('pdam_type')
    $pdam_type_name = pdam_selection.options[pdam_selection.selectedIndex].text;
}

function get_pbb_name(){
    var pbb_selection = document.getElementById('pbb_type')
    $pbb_type_name = pbb_selection.options[pbb_selection.selectedIndex].text;
}

function get_gas_name(){
    var gas_selection = document.getElementById('gas_type')
    $gas_type_name = gas_selection.options[gas_selection.selectedIndex].text;
}

function get_credit_installment_name(){
    var credit_installment_selection = document.getElementById('credit_installment_type')
    $credit_installment_type_name = credit_installment_selection.options[credit_installment_selection.selectedIndex].text;
}

function get_credit_card_name(){
    var credit_card_selection = document.getElementById('credit_card_type')
    $credit_card_type_name = credit_card_selection.options[credit_card_selection.selectedIndex].text;
}

function set_pln_div(){
    var pln_selection = document.getElementById('pln_type')
    $pln_type_name = pln_selection.options[pln_selection.selectedIndex].text;
    if(template == 1){
        if($pln_type_name.includes('PLN Prepaid')){
            text = `<div class="col-lg-6 col-md-6 col-sm-6" style="padding:0px; text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                        </div>
                        <div style="text-align:left;">
                            <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="padding:0px; text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket">Nominal</span>
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select" id="default-select">
                                <select id="pln_nominal" name="pln_nominal" class="nice-select-default">`;
                                for(i in ppob_data.allowed_denominations)
                                    if(i == 0)
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`" selected>`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;
                                    else
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`">`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;

                                text+=`</select>
                            </div>
                        </div>
                    </div>`;
        }
        else if($pln_type_name.includes('PLN Postpaid') || $pln_type_name.includes('PLN Non Tagihan')){
            text = `
            <div class="col-lg-12 col-md-12 col-sm-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if (template == 2){
        if($pln_type_name.includes('PLN Prepaid')){
            text = `<div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                        </div>
                        <div style="text-align:left;">
                            <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket">Nominal</span>
                        <div class="form-select" id="default-select">
                            <select id="pln_nominal" name="pln_nominal" class="nice-select-default">`;
                            for(i in ppob_data.allowed_denominations)
                                if(i == 0)
                                    text+=`<option value="`+ppob_data.allowed_denominations[i]+`" selected>`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;
                                else
                                    text+=`<option value="`+ppob_data.allowed_denominations[i]+`">`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;

                            text+=`</select>
                        </div>
                    </div>`;
        }
        else if($pln_type_name.includes('PLN Postpaid') || $pln_type_name.includes('PLN Non Tagihan')){
            text = `
            <div class="col-lg-12 col-md-12 col-sm-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if (template == 3){
        if($pln_type_name.includes('PLN Prepaid')){
            text = `<div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                        </div>
                        <div style="text-align:left;">
                            <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket">Nominal</span>
                        <div class="form-group">
                            <div class="default-select">
                                <select id="pln_nominal" name="pln_nominal" class="nice-select-default">`;
                                for(i in ppob_data.allowed_denominations)
                                    if(i == 0)
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`" selected>`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;
                                    else
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`">`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;

                                text+=`</select>
                            </div>
                        </div>
                    </div>`;
        }
        else if($pln_type_name.includes('PLN Postpaid') || $pln_type_name.includes('PLN Non Tagihan')){
            text =`
            <div class="col-lg-12 col-md-12 col-sm-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if(template == 4){
        if($pln_type_name.includes('PLN Prepaid')){
            text = `<div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket">Nomor Meter / ID Pelanggan</span>
                        <div class="input-container-search-ticket">
                            <i class="fas fa-bolt" style="padding:15px 15px 15px 18px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                            <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                        </div>
                        <div style="text-align:left;">
                            <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket">Nominal</span>
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select" id="default-select">
                                <select id="pln_nominal" name="pln_nominal" class="nice-select-default">`;
                                for(i in ppob_data.allowed_denominations)
                                    if(i == 0)
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`" selected>`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;
                                    else
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`">`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;

                                text+=`</select>
                            </div>
                        </div>
                    </div>`;
        }
        else if($pln_type_name.includes('PLN Postpaid') || $pln_type_name.includes('PLN Non Tagihan')){
            text = `
            <div class="col-lg-12 col-md-12 col-sm-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Nomor Meter / ID Pelanggan</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-bolt" style="padding:15px 15px 15px 18px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if(template == 5){
        if($pln_type_name.includes('PLN Prepaid')){
            text = `<div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                        </div>
                        <div style="text-align:left;">
                            <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket">Nominal</span>
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select" id="default-select">
                                <select id="pln_nominal" name="pln_nominal" class="nice-select-default">`;
                                for(i in ppob_data.allowed_denominations)
                                    if(i == 0)
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`" selected>`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;
                                    else
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`">`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;

                                text+=`</select>
                            </div>
                        </div>
                    </div>`;
        }
        else if($pln_type_name.includes('PLN Postpaid') || $pln_type_name.includes('PLN Non Tagihan')){
            text = `
            <div class="col-lg-12 col-md-12 col-sm-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if(template == 6){
        if($pln_type_name.includes('PLN Prepaid')){
            text = `<div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                        </div>
                        <div style="text-align:left;">
                            <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;margin-bottom:10px;">
                        <span class="span-search-ticket">Nominal</span>
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select" id="default-select">
                                <select id="pln_nominal" name="pln_nominal" class="nice-select-default">`;
                                for(i in ppob_data.allowed_denominations)
                                    if(i == 0)
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`" selected>`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;
                                    else
                                        text+=`<option value="`+ppob_data.allowed_denominations[i]+`">`+getrupiah(ppob_data.allowed_denominations[i])+`</option>`;

                                text+=`</select>
                            </div>
                        </div>
                    </div>`;
        }
        else if($pln_type_name.includes('PLN Postpaid') || $pln_type_name.includes('PLN Non Tagihan')){
            text = `
            <div class="col-lg-12 col-md-12 col-sm-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-bolt"></i> Nomor Meter / ID Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control pln_number" name="bpjs_number" id="bpjs_number" onkeyup="check_pln_number();" onpaste="setTimeout(check_pln_number.bind(null,this),100);" placeholder="Nomor Meter / ID Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }

    document.getElementById('pln_div').innerHTML = text;
    $('#pln_nominal').niceSelect();
}

function set_bpjs_div(bill_prov){
    var bpjs_selection = document.getElementById('bpjs_type')
    $bpjs_type_name = bpjs_selection.options[bpjs_selection.selectedIndex].text;
    $bpjs_type_value = bpjs_selection.options[bpjs_selection.selectedIndex].value;
    if(template == 1){
        if($bpjs_type_name.includes('BPJS Kesehatan')){
            text = `
            <div class="col-lg-3 col-md-3 col-sm-12" style="padding:0px;" id="train_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select" id="default-select">`;
                        if(bill_prov == 'ppob_espay' || $bpjs_type_value.includes('~ppob_espay'))
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default" disabled>`;
                        }
                        else
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                        }
                        print_month = false;
                        max_count = 12;
                        for(i in month_list){
                            if(moment().format('MMM') == month_list[i][1]){
                                print_month = true;
                                month_counter = 1;
                            }if(print_month == true){
                                text+= `<option value='`+month_counter+`'>`+month_list[i][1]+` `+new Date().getFullYear()+`</option>`;
                                month_counter++;
                                max_count--;
                            }
                        }
                        for(i in month_list){
                            if(max_count != 0){
                                text+= `<option value='`+month_counter+`'>`+month_list[i][1]+` `+parseInt(new Date().getFullYear()+1)+`</option>`;
                                month_counter++;
                                max_count--;
                            }else{
                                break;
                            }
                        }
            text+=`
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12" style="text-align:left; padding:0px;">
                <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <span style="color:`+color+`; font-size:14px; font-weight:bold;" id="input_alert" style="display:none;"></span>
                </div>
            </div>
            `;
        }
    }
    else if (template == 2){
        if($bpjs_type_name.includes('BPJS Kesehatan')){
            text = `
            <div class="col-lg-3 col-md-3 col-sm-12" id="train_date_search" style="margin-bottom:15px;">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                    <div class="form-select" id="default-select">`;
                        if(bill_prov == 'ppob_espay' || $bpjs_type_value.includes('~ppob_espay'))
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default" disabled>`;
                        }
                        else
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                        }
                        print_month = false;
                        for(i in month_list){
                            if(moment().format('MMM') == month_list[i][1]){
                                print_month = true;
                                month_counter = 1;
                            }if(print_month == true){
                                text+= `<option value='`+month_counter+`'>`+month_list[i][1]+` `+new Date().getFullYear()+`</option>`;
                                month_counter++
                            }
                        }
            text+=`
                    </select>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12" style="text-align:left;">
                <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if (template == 3){
        if($bpjs_type_name.includes('BPJS Kesehatan')){
            text = `
            <div class="col-lg-12" id="train_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                <div class="form-group">
                    <div class="default-select">`;
                        if(bill_prov == 'ppob_espay' || $bpjs_type_value.includes('~ppob_espay'))
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default" disabled>`;
                        }
                        else
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                        }
                        print_month = false;
                        for(i in month_list){
                            if(moment().format('MMM') == month_list[i][1]){
                                print_month = true;
                                month_counter = 1;
                            }if(print_month == true){
                                text+= `<option value='`+month_counter+`'>`+month_list[i][1]+` `+new Date().getFullYear()+`</option>`;
                                month_counter++
                            }
                        }
            text+=`
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-12" style="margin-top:15px; text-align:left;">
                <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if(template == 4){
        if($bpjs_type_name.includes('BPJS Kesehatan')){
            text = `
            <div class="col-lg-3 col-md-3 col-sm-12" id="train_date_search">
                <span class="span-search-ticket">Pay Until</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <div class="form-select" id="default-select">`;
                        if(bill_prov == 'ppob_espay' || $bpjs_type_value.includes('~ppob_espay'))
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default" disabled>`;
                        }
                        else
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                        }
                        print_month = false;
                        for(i in month_list){
                            if(moment().format('MMM') == month_list[i][1]){
                                print_month = true;
                                month_counter = 1;
                            }if(print_month == true){
                                text+= `<option value='`+month_counter+`'>`+month_list[i][1]+` `+new Date().getFullYear()+`</option>`;
                                month_counter++
                            }
                        }
            text+=`
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12" style="text-align:left;">
                <span class="span-search-ticket">Nomor Virtual Account Keluarga / Perusahaan</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-briefcase" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if(template == 5){
        if($bpjs_type_name.includes('BPJS Kesehatan')){
            text = `
            <div class="col-lg-3 col-md-3 col-sm-12" id="train_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select" id="default-select">`;
                        if(bill_prov == 'ppob_espay' || $bpjs_type_value.includes('~ppob_espay'))
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default" disabled>`;
                        }
                        else
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                        }
                        print_month = false;
                        for(i in month_list){
                            if(moment().format('MMM') == month_list[i][1]){
                                print_month = true;
                                month_counter = 1;
                            }if(print_month == true){
                                text+= `<option value='`+month_counter+`'>`+month_list[i][1]+` `+new Date().getFullYear()+`</option>`;
                                month_counter++
                            }
                        }
            text+=`
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12" style="text-align:left;">
                <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                </div>
            </div>`;
        }
    }
    else if(template == 6){
        if($bpjs_type_name.includes('BPJS Kesehatan')){
            text = `
            <div class="col-lg-3 col-md-3 col-sm-12" id="train_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select" id="default-select">`;
                        if(bill_prov == 'ppob_espay' || $bpjs_type_value.includes('~ppob_espay'))
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default" disabled>`;
                        }
                        else
                        {
                            text += `<select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                        }
                        print_month = false;
                        max_count = 12;
                        for(i in month_list){
                            if(moment().format('MMM') == month_list[i][1]){
                                print_month = true;
                                month_counter = 1;
                            }if(print_month == true){
                                text+= `<option value='`+month_counter+`'>`+month_list[i][1]+` `+new Date().getFullYear()+`</option>`;
                                month_counter++;
                                max_count--;
                            }
                        }
                        for(i in month_list){
                            if(max_count != 0){
                                text+= `<option value='`+month_counter+`'>`+month_list[i][1]+` `+parseInt(new Date().getFullYear()+1)+`</option>`;
                                month_counter++;
                                max_count--;
                            }else{
                                break;
                            }
                        }
            text+=`
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-12" style="text-align:left;">
                <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <span style="color:`+color+`; font-size:14px; font-weight:bold;" id="input_alert" style="display:none;"></span>
                </div>
            </div>`;
        }
    }
    document.getElementById('bpjs_div').innerHTML = text;
    $('#bpjs_month').niceSelect();
}

function set_evoucher_div(){
    var evoucher_selection = document.getElementById('evoucher_type')
    $evoucher_type_name = evoucher_selection.options[evoucher_selection.selectedIndex].text;
    $evoucher_type_value = evoucher_selection.options[evoucher_selection.selectedIndex].value;
    if(template == 1){
        if($evoucher_type_name.includes('Prepaid Mobile')){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number('`+$evoucher_type_value+`');" onpaste="setTimeout(check_hp_number.bind('`+$evoucher_type_value+`',this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            <div class="col-lg-12 mb-3" id="img_operator" style="padding:0px;">

            </div>
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <div class="row" id="e-voucher_nominal_div">

                </div>
            </div>`;
        }
        else if($evoucher_type_name.includes('Game Voucher')){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-user"></i> User ID / UUID</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="User ID / UUID" autocomplete="off"/>
                </div>
            </div>
            `;

            text += `
                <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Select Voucher</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select">
                            <select id="game_voucher" name="game_voucher" class="form-control js-example-basic-single" style="width:100%;">
                                <option value="">-- Select Game Voucher --</option>
            `;

            if(ppob_data.voucher_data.game.hasOwnProperty(bill_prov))
            {
                for(i in ppob_data.voucher_data.game[bill_prov])
                {
                    text += `<option value="`+i+`">`+ppob_data.voucher_data.game[bill_prov][i]+`</option>`;
                }
            }
            text+=`
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }
        else {
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            `;
        }
    }
    else if (template == 2){
        if($evoucher_type_name.includes('Prepaid Mobile')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number('`+$evoucher_type_value+`');" onpaste="setTimeout(check_hp_number.bind('`+$evoucher_type_value+`',this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            <div class="col-lg-12 mb-3" id="img_operator">

            </div>
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <div class="row" id="e-voucher_nominal_div">

                </div>
            </div>`;
        }
        else if($evoucher_type_name.includes('Game Voucher')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-user"></i> User ID / UUID</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="User ID / UUID" autocomplete="off"/>
                </div>
            </div>
            `;

            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Select Voucher</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select">
                            <select id="game_voucher" name="game_voucher" class="form-control js-example-basic-single" style="width:100%;">
                                <option value="">-- Select Game Voucher --</option>
            `;

            if(ppob_data.voucher_data.game.hasOwnProperty(bill_prov))
            {
                for(i in ppob_data.voucher_data.game[bill_prov])
                {
                    text += `<option value="`+i+`">`+ppob_data.voucher_data.game[bill_prov][i]+`</option>`;
                }
            }
            text+=`
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }
        else {
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            `;
        }
    }
    else if (template == 3){
        if($evoucher_type_name.includes('Prepaid Mobile')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number('`+$evoucher_type_value+`');" onpaste="setTimeout(check_hp_number.bind('`+$evoucher_type_value+`',this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            <div class="col-lg-12 mb-3" id="img_operator">

            </div>
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <div class="row" id="e-voucher_nominal_div">

                </div>
            </div>`;
        }
        else if($evoucher_type_name.includes('Game Voucher')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-user"></i> User ID / UUID</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="User ID / UUID" autocomplete="off"/>
                </div>
            </div>
            `;

            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Select Voucher</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select">
                            <select id="game_voucher" name="game_voucher" class="form-control js-example-basic-single" style="width:100%;">
                                <option value="">-- Select Game Voucher --</option>
            `;

            if(ppob_data.voucher_data.game.hasOwnProperty(bill_prov))
            {
                for(i in ppob_data.voucher_data.game[bill_prov])
                {
                    text += `<option value="`+i+`">`+ppob_data.voucher_data.game[bill_prov][i]+`</option>`;
                }
            }
            text+=`
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }
        else {
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            `;
        }
    }
    else if(template == 4){
        if($evoucher_type_name.includes('Prepaid Mobile')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-mobile" style="padding:15px 15px 15px 18px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number('`+$evoucher_type_value+`');" onpaste="setTimeout(check_hp_number.bind('`+$evoucher_type_value+`',this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            <div class="col-lg-12 mb-3" id="img_operator">

            </div>
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <div class="row" id="e-voucher_nominal_div">

                </div>
            </div>`;
        }
        else if($evoucher_type_name.includes('Game Voucher')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-user"></i> User ID / UUID</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="User ID / UUID" autocomplete="off"/>
                </div>
            </div>
            `;

            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Select Voucher</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select">
                            <select id="game_voucher" name="game_voucher" class="form-control js-example-basic-single" style="width:100%;">
                                <option value="">-- Select Game Voucher --</option>
            `;

            if(ppob_data.voucher_data.game.hasOwnProperty(bill_prov))
            {
                for(i in ppob_data.voucher_data.game[bill_prov])
                {
                    text += `<option value="`+i+`">`+ppob_data.voucher_data.game[bill_prov][i]+`</option>`;
                }
            }
            text+=`
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }
        else {
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            `;
        }
    }
    else if(template == 5){
        if($evoucher_type_name.includes('Prepaid Mobile')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number('`+$evoucher_type_value+`');" onpaste="setTimeout(check_hp_number.bind('`+$evoucher_type_value+`',this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            <div class="col-lg-12 mb-3" id="img_operator">

            </div>
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <div class="row" id="e-voucher_nominal_div">

                </div>
            </div>`;
        }
        else if($evoucher_type_name.includes('Game Voucher')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-user"></i> User ID / UUID</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="User ID / UUID" autocomplete="off"/>
                </div>
            </div>
            `;

            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Select Voucher</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select">
                            <select id="game_voucher" name="game_voucher" class="form-control js-example-basic-single" style="width:100%;">
                                <option value="">-- Select Game Voucher --</option>
            `;

            if(ppob_data.voucher_data.game.hasOwnProperty(bill_prov))
            {
                for(i in ppob_data.voucher_data.game[bill_prov])
                {
                    text += `<option value="`+i+`">`+ppob_data.voucher_data.game[bill_prov][i]+`</option>`;
                }
            }
            text+=`
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }
        else {
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            `;
        }
    }
    else if(template == 6){
        if($evoucher_type_name.includes('Prepaid Mobile')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number('`+$evoucher_type_value+`');" onpaste="setTimeout(check_hp_number.bind('`+$evoucher_type_value+`',this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            <div class="col-lg-12 mb-3" id="img_operator">

            </div>
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <div class="row" id="e-voucher_nominal_div">

                </div>
            </div>`;
        }
        else if($evoucher_type_name.includes('Game Voucher')){
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-user"></i> User ID / UUID</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="User ID / UUID" autocomplete="off"/>
                </div>
            </div>
            `;

            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Select Voucher</span>
                    <div class="input-container-search-ticket">
                        <div class="form-select">
                            <select id="game_voucher" name="game_voucher" class="form-control js-example-basic-single" style="width:100%;">
                                <option value="">-- Select Game Voucher --</option>
            `;

            if(ppob_data.voucher_data.game.hasOwnProperty(bill_prov))
            {
                for(i in ppob_data.voucher_data.game[bill_prov])
                {
                    text += `<option value="`+i+`">`+ppob_data.voucher_data.game[bill_prov][i]+`</option>`;
                }
            }
            text+=`
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }
        else {
            text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
                </div>
                <div style="text-align:left;">
                    <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    <span style="color:`+text_color+`;">Contoh: 081234567890</span>
                </div>
            </div>
            `;
        }
    }

    document.getElementById('e-voucher_div').innerHTML = text;
    $('#game_voucher').select2();
}

function set_cable_tv_div(){
    var cable_tv_selection = document.getElementById('cable_tv_type')
    $cable_tv_type_name = cable_tv_selection.options[cable_tv_selection.selectedIndex].text;
    if(template == 1){
        text = `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-television"></i> Nomor Pelanggan TV Kabel</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan TV Kabel" autocomplete="off"/>
            </div>
        </div>
        `;
        if($cable_tv_type_name.includes('Indovision') || $cable_tv_type_name.includes('Indovision Top TV') || $cable_tv_type_name.includes('Indovision Oke Vision') || $cable_tv_type_name.includes('First Media'))
        {
            text += `
                <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="cable_tv_nominal" id="cable_tv_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if (template == 2){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-television"></i> Nomor Pelanggan TV Kabel</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan TV Kabel" autocomplete="off"/>
            </div>
        </div>
        `;
        if($cable_tv_type_name.includes('Indovision') || $cable_tv_type_name.includes('Indovision Top TV') || $cable_tv_type_name.includes('Indovision Oke Vision') || $cable_tv_type_name.includes('First Media'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="cable_tv_nominal" id="cable_tv_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if (template == 3){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-television"></i> Nomor Pelanggan TV Kabel</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan TV Kabel" autocomplete="off"/>
            </div>
        </div>
        `;
        if($cable_tv_type_name.includes('Indovision') || $cable_tv_type_name.includes('Indovision Top TV') || $cable_tv_type_name.includes('Indovision Oke Vision') || $cable_tv_type_name.includes('First Media'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="cable_tv_nominal" id="cable_tv_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if(template == 4){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-television"></i> Nomor Pelanggan TV Kabel</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan TV Kabel" autocomplete="off"/>
            </div>
        </div>
        `;
        if($cable_tv_type_name.includes('Indovision') || $cable_tv_type_name.includes('Indovision Top TV') || $cable_tv_type_name.includes('Indovision Oke Vision') || $cable_tv_type_name.includes('First Media'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="cable_tv_nominal" id="cable_tv_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if(template == 5){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-television"></i> Nomor Pelanggan TV Kabel</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan TV Kabel" autocomplete="off"/>
            </div>
        </div>
        `;
        if($cable_tv_type_name.includes('Indovision') || $cable_tv_type_name.includes('Indovision Top TV') || $cable_tv_type_name.includes('Indovision Oke Vision') || $cable_tv_type_name.includes('First Media'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="cable_tv_nominal" id="cable_tv_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if(template == 6){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-television"></i> Nomor Pelanggan TV Kabel</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan TV Kabel" autocomplete="off"/>
            </div>
        </div>
        `;
        if($cable_tv_type_name.includes('Indovision') || $cable_tv_type_name.includes('Indovision Top TV') || $cable_tv_type_name.includes('Indovision Oke Vision') || $cable_tv_type_name.includes('First Media'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="cable_tv_nominal" id="cable_tv_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }

    document.getElementById('cable_tv_div').innerHTML = text;
}

function set_internet_div(){
    var internet_selection = document.getElementById('internet_type')
    $internet_type_name = internet_selection.options[internet_selection.selectedIndex].text;
    if(template == 1){
        text = `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-wifi"></i> Nomor Pelanggan Internet</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan Internet" autocomplete="off"/>
            </div>
        </div>
        `;
        if($internet_type_name.includes('CBN') || $internet_type_name.includes('Indosatnet') || $internet_type_name.includes('Centrinnet'))
        {
            text += `
                <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="internet_nominal" id="internet_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if (template == 2){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-wifi"></i> Nomor Pelanggan Internet</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan Internet" autocomplete="off"/>
            </div>
        </div>
        `;
        if($internet_type_name.includes('CBN') || $internet_type_name.includes('Indosatnet') || $internet_type_name.includes('Centrinnet'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="internet_nominal" id="internet_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if (template == 3){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-wifi"></i> Nomor Pelanggan Internet</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan Internet" autocomplete="off"/>
            </div>
        </div>
        `;
        if($internet_type_name.includes('CBN') || $internet_type_name.includes('Indosatnet') || $internet_type_name.includes('Centrinnet'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="internet_nominal" id="internet_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if(template == 4){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-wifi"></i> Nomor Pelanggan Internet</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan Internet" autocomplete="off"/>
            </div>
        </div>
        `;
        if($internet_type_name.includes('CBN') || $internet_type_name.includes('Indosatnet') || $internet_type_name.includes('Centrinnet'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="internet_nominal" id="internet_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if(template == 5){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-wifi"></i> Nomor Pelanggan Internet</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan Internet" autocomplete="off"/>
            </div>
        </div>
        `;
        if($internet_type_name.includes('CBN') || $internet_type_name.includes('Indosatnet') || $internet_type_name.includes('Centrinnet'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="internet_nominal" id="internet_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }
    else if(template == 6){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-wifi"></i> Nomor Pelanggan Internet</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan Internet" autocomplete="off"/>
            </div>
        </div>
        `;
        if($internet_type_name.includes('CBN') || $internet_type_name.includes('Indosatnet') || $internet_type_name.includes('Centrinnet'))
        {
            text += `
                <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Payment Amount</span>
                    <div class="input-container-search-ticket">
                        <input type="number" class="form-control" name="internet_nominal" id="internet_nominal" placeholder="Nominal" autocomplete="off"/>
                    </div>
                </div>
            `;
        }
    }

    document.getElementById('internet_div').innerHTML = text;
}

function set_telephone_div(){
    var telephone_selection = document.getElementById('telephone_type')
    $telephone_type_name = telephone_selection.options[telephone_selection.selectedIndex].text;
    if(template == 1){
        text = `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-phone"></i> Nomor Telepon</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Telepon" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if (template == 2){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-phone"></i> Nomor Telepon</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Telepon" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if (template == 3){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-phone"></i> Nomor Telepon</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Telepon" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 4){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-phone"></i> Nomor Telepon</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Telepon" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 5){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-phone"></i> Nomor Telepon</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Telepon" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 6){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-phone"></i> Nomor Telepon</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Telepon" autocomplete="off"/>
            </div>
        </div>
        `;
    }

    document.getElementById('telephone_div').innerHTML = text;
}

function set_insurance_div(){
    var insurance_selection = document.getElementById('insurance_type')
    $insurance_type_name = insurance_selection.options[insurance_selection.selectedIndex].text;
    if(template == 1){
        text = `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-shield-alt"></i> Nomor Polis</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Polis" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="insurance_nominal" id="insurance_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if (template == 2){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-shield-alt"></i> Nomor Polis</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Polis" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="insurance_nominal" id="insurance_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if (template == 3){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-shield-alt"></i> Nomor Polis</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Polis" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="insurance_nominal" id="insurance_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 4){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-shield-alt"></i> Nomor Polis</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Polis" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="insurance_nominal" id="insurance_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 5){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-shield-alt"></i> Nomor Polis</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Polis" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="insurance_nominal" id="insurance_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 6){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-shield-alt"></i> Nomor Polis</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Polis" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="insurance_nominal" id="insurance_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }

    document.getElementById('ppob_insurance_div').innerHTML = text;
}

function set_pdam_div(){
    var pdam_selection = document.getElementById('pdam_type')
    $pdam_type_name = pdam_selection.options[pdam_selection.selectedIndex].text;
    if(template == 1){
        text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pdam_voucher" name="pdam_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pdam.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pdam[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pdam[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-water"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if (template == 2){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pdam_voucher" name="pdam_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pdam.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pdam[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pdam[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-water"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if (template == 3){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pdam_voucher" name="pdam_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pdam.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pdam[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pdam[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-water"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 4){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pdam_voucher" name="pdam_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pdam.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pdam[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pdam[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-water"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 5){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pdam_voucher" name="pdam_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pdam.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pdam[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pdam[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-water"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 6){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pdam_voucher" name="pdam_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pdam.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pdam[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pdam[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-water"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }

    document.getElementById('pdam_div').innerHTML = text;
    $('#pdam_voucher').select2();
}

function set_pbb_div(){
    var pbb_selection = document.getElementById('pbb_type')
    $pbb_type_name = pbb_selection.options[pbb_selection.selectedIndex].text;
    if(template == 1){
        text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pbb_voucher" name="pbb_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pbb.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pbb[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pbb[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-percent"></i> Nomor Objek Pajak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if (template == 2){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pbb_voucher" name="pbb_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pbb.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pbb[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pbb[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-percent"></i> Nomor Objek Pajak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if (template == 3){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pbb_voucher" name="pbb_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pbb.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pbb[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pbb[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-percent"></i> Nomor Objek Pajak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 4){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pbb_voucher" name="pbb_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pbb.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pbb[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pbb[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-percent"></i> Nomor Objek Pajak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 5){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pbb_voucher" name="pbb_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pbb.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pbb[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pbb[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-percent"></i> Nomor Objek Pajak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 6){
        text = `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Area</span>
                <div class="input-container-search-ticket">
                    <div class="form-select">
                        <select id="pbb_voucher" name="pbb_voucher" class="form-control js-example-basic-single" style="width:100%;">
                            <option value="">-- Select Area --</option>
        `;

        if(ppob_data.voucher_data.pbb.hasOwnProperty(bill_prov))
        {
            for(i in ppob_data.voucher_data.pbb[bill_prov])
            {
                text += `<option value="`+i+`">`+ppob_data.voucher_data.pbb[bill_prov][i]+`</option>`;
            }
        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
        `;
        text += `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-percent"></i> Nomor Objek Pajak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }

    document.getElementById('pbb_div').innerHTML = text;
    $('#pbb_voucher').select2();
}

function set_gas_div(){
    var gas_selection = document.getElementById('gas_type')
    $gas_type_name = gas_selection.options[gas_selection.selectedIndex].text;
    if(template == 1){
        text = `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-fire"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if (template == 2){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-fire"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if (template == 3){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-fire"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 4){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-fire"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 5){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-fire"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }
    else if(template == 6){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-fire"></i> Nomor Pelanggan</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Pelanggan" autocomplete="off"/>
            </div>
        </div>
        `;
    }

    document.getElementById('gas_div').innerHTML = text;
}

function set_credit_installment_div(){
    var credit_installment_selection = document.getElementById('credit_installment_type')
    $credit_installment_type_name = credit_installment_selection.options[credit_installment_selection.selectedIndex].text;
    if(template == 1){
        text = `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-coins"></i> Nomor Kontrak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kontrak" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_installment_nominal" id="credit_installment_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if (template == 2){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-coins"></i> Nomor Kontrak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kontrak" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_installment_nominal" id="credit_installment_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if (template == 3){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-coins"></i> Nomor Kontrak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kontrak" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_installment_nominal" id="credit_installment_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 4){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-coins"></i> Nomor Kontrak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kontrak" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_installment_nominal" id="credit_installment_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 5){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-coins"></i> Nomor Kontrak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kontrak" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_installment_nominal" id="credit_installment_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 6){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-coins"></i> Nomor Kontrak</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kontrak" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_installment_nominal" id="credit_installment_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }

    document.getElementById('credit_installment_div').innerHTML = text;
}

function set_credit_card_div(){
    var credit_card_selection = document.getElementById('credit_card_type')
    $credit_card_type_name = credit_card_selection.options[credit_card_selection.selectedIndex].text;
    if(template == 1){
        text = `
        <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-credit-card"></i> Nomor Kartu Kredit</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kartu Kredit" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_card_nominal" id="credit_card_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if (template == 2){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-credit-card"></i> Nomor Kartu Kredit</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kartu Kredit" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_card_nominal" id="credit_card_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if (template == 3){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-credit-card"></i> Nomor Kartu Kredit</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kartu Kredit" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_card_nominal" id="credit_card_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 4){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-credit-card"></i> Nomor Kartu Kredit</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kartu Kredit" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_card_nominal" id="credit_card_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 5){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-credit-card"></i> Nomor Kartu Kredit</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kartu Kredit" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_card_nominal" id="credit_card_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }
    else if(template == 6){
        text = `
        <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
            <span class="span-search-ticket"><i class="fas fa-credit-card"></i> Nomor Kartu Kredit</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Kartu Kredit" autocomplete="off"/>
            </div>
        </div>
        `;
        text += `
            <div class="col-lg-12" style="text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Payment Amount</span>
                <div class="input-container-search-ticket">
                    <input type="number" class="form-control" name="credit_card_nominal" id="credit_card_nominal" placeholder="Nominal" autocomplete="off"/>
                </div>
            </div>
        `;
    }

    document.getElementById('credit_card_div').innerHTML = text;
}

function bills_detail(){
    airline_price = [];
        for(i in price_itinerary.price_itinerary_provider){
            for(j in price_itinerary.price_itinerary_provider[i].journeys){
                for(k in price_itinerary.price_itinerary_provider[i].journeys[j].segments){
                    for(l in price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares){
                        if(price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary.length != 0)
                            airline_price.push({});
                        for(m in price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary){
                            price_type['fare'] = price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].total_fare / price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_count;
                            price_type['tax'] = price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].total_tax / price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_count;
                            price_type['rac'] = price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].total_commission / price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_count;
                            price_type['currency'] = price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[0].currency;
                            price_type['roc'] = 0;
                            airline_price[airline_price.length-1][price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
                            price_type = [];
                        }
                    }
                }
            }
        }
        price_counter = 0;
        total_price = 0;
        commission_price = 0;
        rules = 0;
        $text = '';
        text += `
        <div class="row" style="margin-bottom:5px; ">
            <div class="col-lg-12">
               <h4> Price Detail </h4>
               <hr/>
            </div>
        </div>`;
        text += `
        <div class="row">
            <div class="col-lg-12">`;
        flight_count = 0;
        for(i in price_itinerary.price_itinerary_provider){
            for(j in price_itinerary.price_itinerary_provider[i].journeys){
                if(i == 0 && j == 0 && Boolean(price_itinerary.is_combo_price) == true && price_itinerary.price_itinerary_provider.length > 1){
                    text += `<h6>Special Price</h6>`;
                    $text +='Special Price\n';
                }else if( i != 0 && j != 0){
                    text+=`<hr/>`;
                }
                flight_count++;
                if(flight_count != 1){
                    text+=`<hr/>`;
                }
                text += `<h6>Flight `+flight_count+`</h6>`;
                //logo
                carrier_code_list = Array.from(new Set(price_itinerary.price_itinerary_provider[i].journeys[j].carrier_code_list))
                for(k in carrier_code_list) //print gambar airline
                    try{
                        text+=`<img data-toggle="tooltip" alt="`+airline_carriers[0][carrier_code_list[k]]+`" title="`+airline_carriers[0][carrier_code_list[k]]+`" style="margin-top:10px; width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+carrier_code_list[k]+`.png"><span> </span>`;
                    }catch(err){
                        text+=`<img data-toggle="tooltip" alt="PPOB" title="" style="margin-top:10px; width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+carrier_code_list[k]+`.png"><span> </span>`;
                    }

                for(k in price_itinerary.price_itinerary_provider[i].journeys[j].segments){
                    try{
                        $text += airline_carriers[price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].carrier_code].name + ' ' + price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].carrier_code + price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].carrier_number + '\n';
                    }catch(err){
                        $text += price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].carrier_code + ' ' + price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].carrier_code + price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].carrier_number + '\n';
                    }
                    $text += price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].departure_date + ' → ' + price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].arrival_date + '\n';
                    $text += price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].origin_name + ' (' + price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].origin_city + ') - ';
                    $text += price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].destination_name + ' (' + price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].destination_city + ')\n\n';

                    text+=`
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%">
                                <tr>
                                    <td class="airport-code"><h5>`+price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].departure_date.split(' - ')[1]+`</h5></td>
                                    <td style="padding-left:15px;">
                                        <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="PPOB" style="width:20px; height:20px;"/>
                                    </td>
                                    <td style="height:30px;padding:0 15px;width:100%">
                                        <div style="display:inline-block;position:relative;width:100%">
                                            <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                            <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                            <div style="height:30px;min-width:40px;position:relative;width:0%"/>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <span style="font-size:13px;">`+price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].departure_date.split(' - ')[0]+`</span></br>
                            <span style="font-size:13px; font-weight:500;">`+price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].origin_city+` (`+price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].origin+`)</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%; margin-bottom:6px;">
                                <tr>
                                    <td><h5>`+price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].arrival_date.split(' - ')[1]+`</h5></td>
                                    <td></td>
                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                </tr>
                            </table>
                            <span style="font-size:13px;">`+price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].arrival_date.split(' - ')[0]+`</span><br/>
                            <span style="font-size:13px; font-weight:500;">`+price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].destination_city+` (`+price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].destination+`)</span>
                        </div>
                    </div>`;
                    for(l in price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].legs){

                    }
                    if(price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares.length > 0 ){
                        for(l in price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares){
                            if(price_itinerary.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary.length > 0){

                            //price
                            price = 0;
                            //adult
                            $text+= 'Price\n';
                            text+=`<br/>`;
                                try{//adult
                                    if(airline_request.adult != 0){
                                        try{
                                            if(airline_price[price_counter].ADT['roc'] != null)
                                                price = airline_price[i].ADT['roc'];
                                            if(airline_price[price_counter].ADT.tax != null)
                                                price += airline_price[price_counter].ADT.tax;
                                        }catch(err){

                                        }
                                        commission = 0;
                                        if(airline_price[price_counter].ADT['rac'] != null)
                                            commission = airline_price[price_counter].ADT['rac']
                                        commission_price += airline_request.adult * commission;
                                        total_price += airline_request.adult * (airline_price[price_counter].ADT['fare'] + price);
                                        text+=`
                                            <div class="row">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Adult Fare @`+airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+`</span><br/>
                                                </div>
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:13px; font-weight:500;">    Tax @`+airline_price[price_counter].ADT.currency+` `+getrupiah(price)+`</span>
                                                </div>
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                                    <span style="font-size:13px; font-weight:500;">`+airline_price[price_counter].ADT.currency+` `+getrupiah(Math.ceil((airline_price[price_counter].ADT.fare+price) * airline_request.adult))+`</span>
                                                </div>
                                            </div>`;
                                        $text += airline_request.adult + ' Adult Fare @'+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+'\n';
                                        $text += airline_request.adult + ' Adult Tax @'+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                        price = 0;
                                    }
                                }catch(err){

                                }

                                try{//child
                                    if(airline_request.child != 0){
                                        try{
                                            if(airline_price[price_counter].CHD['roc'] != null)
                                                price = airline_price[price_counter].CHD['roc'];
                                            if(airline_price[price_counter].CHD.tax != null)
                                                price += airline_price[price_counter].CHD.tax;
                                        }catch(err){

                                        }
                                        commission = 0;
                                        if(airline_price[price_counter].CHD['rac'] != null)
                                            commission = airline_price[price_counter].CHD['rac'];
                                        commission_price += airline_request.child * commission;
                                        total_price += airline_request.child * (airline_price[price_counter].CHD['fare'] + price);
                                        text+=`
                                            <div class="row">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:13px; font-weight:500;">`+airline_request.child+`x Child Fare @`+airline_price[price_counter].CHD.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare))+`</span><br/>
                                                </div>
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:13px; font-weight:500;">    Tax @`+airline_price[price_counter].CHD.currency+` `+price+`</span>
                                                </div>
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                                    <span style="font-size:13px; font-weight:500;">`+airline_price[price_counter].CHD.currency+` `+getrupiah(Math.ceil((airline_price[price_counter].CHD.fare+price) * airline_request.child))+`</span>
                                                </div>
                                            </div>`;
                                        $text += airline_request.child + ' Child Fare @'+ airline_price[price_counter].CHD.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare))+'\n';
                                        $text += airline_request.child + ' Child Tax @'+ airline_price[price_counter].CHD.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                        price = 0;
                                    }
                                }catch(err){

                                }

                                try{//infant
                                    if(airline_request.infant != 0){
                                        price = 0;
                                        try{
                                            if(airline_price[price_counter].INF['roc'] != null)
                                                price = airline_price[price_counter].INF['roc'];
                                            if(airline_price[price_counter].INF.tax != null)
                                                price += airline_price[price_counter].INF.tax;
                                        }catch(err){

                                        }
                                        commission = 0;
                                        try{
                                            if(airline_price[price_counter].INF['rac'] != null)
                                                commission = airline_price[price_counter].INF['rac'];
                                        }catch(err){

                                        }
                                        commission_price += airline_request.infant * commission;
                                        total_price += airline_request.infant * (airline_price[price_counter].INF['fare'] + price);
                                        text+=`
                                            <div class="row">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Infant Fare @`+airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare))+`</span><br/>
                                                </div>
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:13px; font-weight:500;">    Tax @`+airline_price[price_counter].INF.currency+` `+price+`</span>
                                                </div>
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                                    <span style="font-size:13px; font-weight:500;">`+airline_price[price_counter].INF.currency+` `+getrupiah(Math.ceil((airline_price[price_counter].INF.fare+price) * airline_request.infant))+`</span>
                                                </div>
                                            </div>`;
                                        $text += airline_request.infant + ' Infant Fare @'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare+price))+'\n';
                                        $text += airline_request.infant + ' Infant Tax @'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                        price = 0;
                                    }
                                }catch(err){

                                }
                                price_counter++;
                                $text += '\n';
                            }
                        }
                    }
                }
//                text+=`<div class="row"><div class="col-lg-12"><hr/></div></div>`;
            }
        }
        text+=`
            <hr/>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-7" style="text-align:left;">
                <span style="font-size:13px;font-weight:500;">Additional Price</span><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            if(airline_price[0].ADT.currency == 'IDR')
            text+=`
                <span style="font-size:13px; font-weight:500;" id="additional_price">`+getrupiah(additional_price)+`</span><br/>`;
            else
            text+=`
                <span style="font-size:13px; font-weight:500;" id="additional_price">`+additional_price+`</span><br/>`;
            text+=`
                <input type="hidden" name="additional_price" id="additional_price_hidden"/>
            </div>`;
            try{
                if(upsell_price != 0){
                    text+=`<div class="col-lg-7" style="text-align:left;">
                        <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
                    </div>
                    <div class="col-lg-5" style="text-align:right;">`;
                    if(airline_price[0].ADT.currency == 'IDR')
                    text+=`
                        <span style="font-size:13px; font-weight:500;">`+airline_price[0].ADT.currency+` `+getrupiah(upsell_price)+`</span><br/>`;
                    else
                    text+=`
                        <span style="font-size:13px; font-weight:500;">`+airline_price[0].ADT.currency+` `+upsell_price+`</span><br/>`;
                    text+=`</div>`;
                }
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            text+=`
            <div class="col-lg-7" style="text-align:left;">
                <span style="font-size:14px; font-weight:bold;"><b>Total</b></span><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            try{
                grand_total_price = total_price;
                grand_total_price += parseFloat(additional_price)
                grand_total_price += upsell_price;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            if(airline_price[0].ADT.currency == 'IDR')
            text+=`
                <span style="font-size:14px; font-weight:bold;" id="total_price"><b> `+airline_price[i].ADT.currency+` `+getrupiah(grand_total_price)+`</b></span><br/>`;
            else
            text+=`
                <span style="font-size:14px; font-weight:bold;" id="total_price"><b> `+airline_price[i].ADT.currency+` `+parseFloat(grand_total_price)+`</b></span><br/>`;
            text+=`
            </div>
        </div>`;
        if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
            tax = 0;
            fare = 0;
            total_price = 0;
            total_price_provider = [];
            price_provider = 0;
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
            type_amount_repricing = ['Repricing'];
            for(i in passengers){
                if(i != 'booker' && i != 'contact'){
                    for(j in passengers[i]){
                        pax_type_repricing.push([passengers[i][j].first_name +passengers[i][j].last_name, passengers[i][j].first_name +passengers[i][j].last_name]);
                        price_arr_repricing[passengers[i][j].first_name +passengers[i][j].last_name] = {
                            'Fare': 0,
                            'Tax': 0,
                            'Repricing': 0
                        }
                    }
                }
            }
            //repricing
            text_repricing = `
            <div class="col-lg-12">
                <div style="padding:5px;" class="row">
                    <div class="col-lg-6"></div>
                    <div class="col-lg-6">Repricing</div>
                </div>
            </div>`;
            for(k in price_arr_repricing){
               text_repricing += `
               <div class="col-lg-12">
                    <div style="padding:5px;" class="row" id="adult">
                        <div class="col-lg-6" id="`+j+`_`+k+`">`+k+`</div>
                        <div hidden id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                        if(price_arr_repricing[k].Repricing == 0)
                        text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">-</div>`;
                        else
                        text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                        text_repricing+=`<div hidden id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                    </div>
                </div>`;
            }
            text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
            document.getElementById('repricing_div').innerHTML = text_repricing;
            //repricing
        }
        if(document.URL.split('/')[document.URL.split('/').length-1] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
            text+=`<div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
        }
        text+=`
        <div class="row">
            <div class="col-lg-12" style="padding-bottom:10px;">
                <hr/>
                <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                try{
                    for(i in passengers.adult){
                        if(i == 0)
                            $text += 'Passengers:\n';
                        $text += passengers.adult[i].title + ' ' + passengers.adult[i].first_name + ' ' + passengers.adult[i].last_name + ' ';
                        for(j in passengers.adult[i].ssr_list){
                            $text += passengers.adult[i].ssr_list[j].name;
                            if(parseInt(parseInt(j)+1) != passengers.adult[i].ssr_list.length)
                                $text += ', ';
                        }
                        for(j in passengers.adult[i].seat_list){
                            $text += ', ' + passengers.adult[i].seat_list[j].seat_pick;
                        }
                        $text += ' (ADT / ' + passengers.adult[i].birth_date + ')\n';
                    }
                    for(i in passengers.child){
                        $text += passengers.child[i].title + ' ' + passengers.child[i].first_name + ' ' + passengers.child[i].last_name + ' (CHD / ' + passengers.child[i].birth_date + ')\n';
                    }
                    for(i in passengers.infant){
                        $text += passengers.infant[i].title + ' ' + passengers.infant[i].first_name + ' ' + passengers.infant[i].last_name + ' (INF / ' + passengers.infant[i].birth_date + ')\n';
                    }
                    $text += '\n';
                }catch(err){

                }
                $text += 'Grand Total: '+airline_price[0].ADT.currency+' '+ getrupiah(grand_total_price) + '\nPrices and availability may change at any time';

                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the bill price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the bill price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                }

            text+=`
            </div>
        </div>`;
        if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
            text+= print_commission(commission_price*-1,'show_commission')
        text+=`
        <div style="padding-bottom:10px;">
            <center>
                <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
            </center>
        </div>`;
        if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
            text+=`
            <div style="padding-bottom:10px;">
                <center>
                    <input type="button" class="primary-btn-white" style="width:100%;" onclick="show_commission('commission');" id="show_commission_button" value="Hide YPM"/><br/>
                </center>
            </div>`;
        document.getElementById('airline_detail').innerHTML = text;
}
function get_bills_review(){

}

function share_data(){
//    const el = document.createElement('textarea');
//    el.value = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function copy_data(){
    //
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    })

    Toast.fire({
      type: 'success',
      title: 'Copied Successfully'
    })
//    const el = document.createElement('textarea');
//    el.innerHTML = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
}

function show_commission(){
    var sc = document.getElementById("show_commission");
    var scs = document.getElementById("show_commission_button");
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide YPM";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show YPM";
    }
}

function check_pln_number(){
    var pln_numb = String($(".pln_number").val());
    var radios_prov = document.getElementsByName('bills_provider');
    for (var k = 0, prov_length = radios_prov.length; k < prov_length; k++) {
        if (radios_prov[k].checked) {
            // do whatever you want with the checked radio
            bill_prov = radios_prov[k].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    if (bill_prov == 'rodextrip_ppob')
    {
        ppob_prod_data = ppob_data.search_config_data;
    }
    else
    {
        ppob_prod_data = ppob_data.product_data;
    }
    if ( pln_numb.length >= 1 ){
        min_input = 0;
        max_input = 0;

        for(i in ppob_prod_data[bill_type]){
            if(ppob_prod_data[bill_type][i].name == $pln_type_name){
                min_input = ppob_prod_data[bill_type][i].min_cust_number;
                max_input = ppob_prod_data[bill_type][i].max_cust_number;
            }
        }

        if(min_input != max_input){
            if(pln_numb.length < min_input){
                document.getElementById("input_alert").textContent = "Nomor terlalu pendek, harap input minimal "+min_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else if (pln_numb.length > max_input){
                document.getElementById("input_alert").textContent = "Nomor terlalu panjang, harap input maksimal "+max_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else{
                document.getElementById("input_alert").textContent = "";
                document.getElementById("input_alert").style.display = "none";
            }
        }else{
            if(pln_numb.length < min_input || pln_numb.length > max_input){
                document.getElementById("input_alert").textContent = "Harap input "+min_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else{
                document.getElementById("input_alert").textContent = "";
                document.getElementById("input_alert").style.display = "none";
            }
        }
    }else if ( pln_numb.length == 0){
        document.getElementById("input_alert").textContent = "";
        document.getElementById("input_alert").style.display = "none";
    }
}

function check_bpjs_number(){
    var virtual_numb = String($(".virtual_number").val());
    var radios_prov = document.getElementsByName('bills_provider');
    for (var k = 0, prov_length = radios_prov.length; k < prov_length; k++) {
        if (radios_prov[k].checked) {
            // do whatever you want with the checked radio
            bill_prov = radios_prov[k].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    if (bill_prov == 'rodextrip_ppob')
    {
        ppob_prod_data = ppob_data.search_config_data;
    }
    else
    {
        ppob_prod_data = ppob_data.product_data;
    }
    if ( virtual_numb.length >= 1 ){
        min_input = 0;
        max_input = 0;

        for(i in ppob_prod_data[bill_type]){
            if(ppob_prod_data[bill_type][i].name == $bpjs_type_name){
                min_input = ppob_prod_data[bill_type][i].min_cust_number;
                max_input = ppob_prod_data[bill_type][i].max_cust_number;
            }
        }

        if(min_input != max_input){
            if(virtual_numb.length < min_input){
                document.getElementById("input_alert").textContent = "Nomor terlalu pendek, harap input minimal "+min_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else if (virtual_numb.length > max_input){
                document.getElementById("input_alert").textContent = "Nomor terlalu panjang, harap input maksimal "+max_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else{
                document.getElementById("input_alert").textContent = "";
                document.getElementById("input_alert").style.display = "none";
            }
        }else{
            if(virtual_numb.length < min_input || virtual_numb.length > max_input){
                document.getElementById("input_alert").textContent = "Harap input "+min_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else{
                document.getElementById("input_alert").textContent = "";
                document.getElementById("input_alert").style.display = "none";
            }
        }
    }else if ( virtual_numb.length == 0){
        document.getElementById("input_alert").textContent = "";
        document.getElementById("input_alert").style.display = "none";
    }
}

function check_hp_number(evoucher_val){
    var radios_prov = document.getElementsByName('bills_provider');
    for (var k = 0, prov_length = radios_prov.length; k < prov_length; k++) {
        if (radios_prov[k].checked) {
            // do whatever you want with the checked radio
            bill_prov = radios_prov[k].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    if (bill_prov == 'rodextrip_ppob')
    {
        ppob_prod_data = ppob_data.search_config_data;
    }
    else
    {
        ppob_prod_data = ppob_data.product_data;
    }
    var temp_value = "";
    var temp_number = ""; // nyimpen nomor 4 digit pertama
    var value_hp_number = String($(".hp_number").val());
    for (var co = 0; co < value_hp_number.length; co++) {
        if(co < 4){
            temp_value = temp_value + value_hp_number.charAt(co);
        }
    }

    if(checking_number == 1){
        if(temp_number != temp_value){
            checking_number = 0;
        }
    }

    if ( value_hp_number.length >= 4 ){
        min_input = 0;
        max_input = 0;

        for(i in ppob_prod_data[bill_type]){
            if(ppob_prod_data[bill_type][i].name == $evoucher_type_name){
                min_input = ppob_prod_data[bill_type][i].min_cust_number;
                max_input = ppob_prod_data[bill_type][i].max_cust_number;
            }
        }

        if(min_input != max_input){
            if(value_hp_number.length < min_input){
                document.getElementById("input_alert").textContent = "Nomor terlalu pendek, harap input minimal "+min_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else if (value_hp_number.length > max_input){
                document.getElementById("input_alert").textContent = "Nomor terlalu panjang, harap input maksimal "+max_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else{
                document.getElementById("input_alert").textContent = "";
                document.getElementById("input_alert").style.display = "none";
            }
        }else{
            if(value_hp_number.length < min_input || value_hp_number.length > max_input){
                document.getElementById("input_alert").textContent = "Harap input "+min_input+" angka.";
                document.getElementById("input_alert").style.display = "block";
            }else{
                document.getElementById("input_alert").textContent = "";
                document.getElementById("input_alert").style.display = "none";
            }
        }

        if(checking_number == 0){
            text_nominal = '';
            text_img = '';
            code_voucher = '';
            code_voucher2 = '';
            code_includes = false;
            temp_number = temp_value;

            sel_prov_ppob = '';
            split_code = evoucher_val.split('~');
            if(split_code.length > 1)
            {
                sel_prov_ppob = split_code[1];
            }
            else
            {
                var prov_radios = document.getElementsByName('bills_provider');
                for (var j_prov = 0, prov_length = prov_radios.length; j_prov < prov_length; j_prov++) {
                    if (prov_radios[j_prov].checked) {
                        // do whatever you want with the checked radio
                        sel_prov_ppob = prov_radios[j_prov].value;
                        // only one radio can be logically checked, don't check the rest
                        break;
                    }
                }
            }

            if(nominal_number_list.hasOwnProperty(sel_prov_ppob)){
                for(j in nominal_number_list[sel_prov_ppob]){
                    if (temp_value == nominal_number_list[sel_prov_ppob][j][0]){
                        code_voucher = nominal_number_list[sel_prov_ppob][j][1];
                        if (nominal_number_list[sel_prov_ppob][j].length > 2)
                        {
                            code_voucher2 = nominal_number_list[sel_prov_ppob][j][2];
                        }
                        break;
                    }
                }
            }

            text_img+=`
            <div class="row">
                <div class="col-lg-12">`;
                if(code_voucher != ''){
                    text_img+=`<label class="radio-img">
                    <input type="radio" checked="checked" name="voucher-type" value="pulsa" onchange="set_evoucher_type();">`;
                    if(code_voucher == "TSEL" || code_voucher == "TS"){
                        text_img+=`<img src="/static/tt_website_rodextrip/images/icon/telkomsel.png" alt="Telkomsel" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "ISAT" || code_voucher == "IR"){
                        text_img+=`<img src="/static/tt_website_rodextrip/images/icon/indosat.png" alt="Indosat" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "XL" || code_voucher == "XR"){
                        text_img+=`<img src="/static/tt_website_rodextrip/images/icon/xl.png" alt="XL" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "AX"){
                        text_img+=`<img src="/static/tt_website_rodextrip/images/icon/axis.png" alt="XL" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "TR"){
                        text_img+=`<img src="/static/tt_website_rodextrip/images/icon/tri.png" alt="Tri" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "SM" || code_voucher == "FR"){
                        text_img+=`<img src="/static/tt_website_rodextrip/images/icon/smartfren.png" alt="Smartfren" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "BT"){
                        text_img+=`<img src="/static/tt_website_rodextrip/images/icon/bolt.png" alt="Bolt" style="width:auto; height:60px; padding:0px;">`;
                    }
                    text_img+=`</label>`;

                    text_img+=`
                    <label class="radio-img">
                        <input type="radio" checked="checked" name="voucher-type" value="ovo" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/ovo.png" alt="OVO" style="width:auto; height:60px; padding:0px;">
                    </label>`;
                }else{
                    text_img+=`
                    <label class="radio-img">
                        <input type="radio" name="voucher-type" value="ovo" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/ovo.png" alt="OVO" style="width:auto; height:60px; padding:0px;">
                    </label>`;
                }

                text_img+=`
                <label class="radio-img">
                    <input type="radio" name="voucher-type" value="gopay" onchange="set_evoucher_type();">
                    <img src="/static/tt_website_rodextrip/images/icon/gopay.png" alt="GO-PAY" style="width:auto; height:60px; padding:0px;">
                </label>`;

                text_img+=`
                <label class="radio-img">
                    <input type="radio" name="voucher-type" value="shopee" onchange="set_evoucher_type();">
                    <img src="/static/tt_website_rodextrip/images/icon/shopee.png" alt="SHOPEE" style="width:auto; height:60px; padding:0px;">
                </label>`;

                text_img+=`
                <label class="radio-img">
                    <input type="radio" name="voucher-type" value="dana" onchange="set_evoucher_type();">
                    <img src="/static/tt_website_rodextrip/images/icon/dana.png" alt="DANA" style="width:auto; height:60px; padding:0px;">
                </label>`;

            text_img+=`</div>
            </div>`;
            document.getElementById('img_operator').innerHTML = text_img;
            set_evoucher_type();

            checking_number = 1;
        }
    }else if ( value_hp_number.length < 4){
        document.getElementById('e-voucher_nominal_div').innerHTML = "";
        document.getElementById('img_operator').innerHTML = "";
        document.getElementById("input_alert").textContent = "";
        document.getElementById("input_alert").style.display = "none";
        checking_number = 0;
    }
}

function set_evoucher_type(){
    text_nominal = '';
    code_includes = false;

    var radios_set = document.getElementsByName('voucher-type');
    for (var j = 0, length = radios_set.length; j < length; j++) {
        if (radios_set[j].checked) {
            // do whatever you want with the checked radio
            v_type = radios_set[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    text_nominal+=`<div class="col-lg-12 mb-3"><h6 style="color:`+text_color+`">Choose Voucher</h6></div>`;
    text_nominal_copy = text_nominal;

    if(ppob_data.voucher_data.prepaid_mobile.hasOwnProperty(sel_prov_ppob))
    {
        if(v_type == 'pulsa'){
            for(i in ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob]){
                if(code_voucher != ''){
                    if(code_voucher2 != '')
                    {
                        code_includes = i.includes(code_voucher) || i.includes(code_voucher2);
                    }
                    else
                    {
                        code_includes = i.includes(code_voucher);
                    }
                    if(code_includes == true){
                        if(template != 3){
                            text_nominal+=`<div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 mb-3">`;
                        }else{
                            text_nominal+=`<div class="col-xs-6 col-sm-6 col-md-6 col-lg-4 mb-3">`;
                        }

                        text_nominal+=`
                            <label class="radio-label" style="padding:unset; width:100%;">
                                <input type="radio" name="e-voucher_nominal" value="`+i+`">
                                <div class="div_label"><span style="color:`+text_color+`;">`+ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob][i]+`</span></div>
                            </label>
                        </div>`;
                    }
                }
            }
        }else if(v_type == 'ovo'){
            for(i in ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob]){
                code_includes = i.includes("OVO");
                if(code_includes == true){
                    if(template != 3){
                        text_nominal+=`<div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 mb-3">`;
                    }else{
                        text_nominal+=`<div class="col-xs-6 col-sm-6 col-md-6 col-lg-4 mb-3">`;
                    }

                    text_nominal+=`
                        <label class="radio-label" style="padding:unset; width:100%;">
                            <input type="radio" name="e-voucher_nominal" value="`+i+`">
                            <div class="div_label"><span style="color:`+text_color+`;">`+ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob][i]+`</span></div>
                        </label>
                    </div>`;
                }
            }
        }else if(v_type == 'gopay'){
            for(i in ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob]){
                code_includes = i.includes("GP") || i.includes("GJ");
                if(code_includes == true){
                    if(template != 3){
                        text_nominal+=`<div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 mb-3">`;
                    }else{
                        text_nominal+=`<div class="col-xs-6 col-sm-6 col-md-6 col-lg-4 mb-3">`;
                    }

                    text_nominal+=`
                        <label class="radio-label" style="padding:unset; width:100%;">
                            <input type="radio" name="e-voucher_nominal" value="`+i+`">
                            <div class="div_label"><span style="color:`+text_color+`;">`+ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob][i]+`</span></div>
                        </label>
                    </div>`;
                }
            }
        }else if(v_type == 'shopee'){
            for(i in ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob]){
                code_includes = i.includes("SP");
                if(code_includes == true){
                    if(template != 3){
                        text_nominal+=`<div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 mb-3">`;
                    }else{
                        text_nominal+=`<div class="col-xs-6 col-sm-6 col-md-6 col-lg-4 mb-3">`;
                    }

                    text_nominal+=`
                        <label class="radio-label" style="padding:unset; width:100%;">
                            <input type="radio" name="e-voucher_nominal" value="`+i+`">
                            <div class="div_label"><span style="color:`+text_color+`;">`+ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob][i]+`</span></div>
                        </label>
                    </div>`;
                }
            }
        }else if(v_type == 'dana'){
            for(i in ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob]){
                code_includes = i.includes("DNA");
                if(code_includes == true){
                    if(template != 3){
                        text_nominal+=`<div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 mb-3">`;
                    }else{
                        text_nominal+=`<div class="col-xs-6 col-sm-6 col-md-6 col-lg-4 mb-3">`;
                    }

                    text_nominal+=`
                        <label class="radio-label" style="padding:unset; width:100%;">
                            <input type="radio" name="e-voucher_nominal" value="`+i+`">
                            <div class="div_label"><span style="color:`+text_color+`;">`+ppob_data.voucher_data.prepaid_mobile[sel_prov_ppob][i]+`</span></div>
                        </label>
                    </div>`;
                }
            }
        }
    }
    if(text_nominal == text_nominal_copy)
    {
        text_nominal += `<div class="col-lg-12"><h6 style="color:`+text_color+`">No Voucher Available</h6></div>`;
    }
    document.getElementById('e-voucher_nominal_div').innerHTML = text_nominal;

}