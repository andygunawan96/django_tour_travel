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

nominal_number_list = [
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
]

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

function set_container_bill(){
    $bpjs_type_name = '';
    $pln_type_name = '';
    $evoucher_type_name = '';

    var radios = document.getElementsByName('bills_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            bill_type = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    if(template == 1){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="padding:0px; text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="bpjs_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $bpjs_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12" style="padding:0px;" id="train_date_search">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                    <div class="input-container-search-ticket btn-group">
                        <div class="form-select" id="default-select">
                            <select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                            print_month = false
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
                <div class="col-lg-9 col-md-9 col-sm-12" style="padding:0px;">
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
        else if(bill_type == 'pln'){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;">
                <div class="input-container-search-ticket">`;
                    for(i in ppob_data.product_data[bill_type]){
                        text+=`
                        <label class="radio-button-custom" style="margin-bottom:0px;">
                            <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                        if(i == 0){
                            text+=`<input type="radio" checked="checked" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            $pln_type_name = ppob_data.product_data[bill_type][i].name;
                        }else{
                            text+=`<input type="radio" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                        }
                        text+=`
                            <span class="checkmark-radio"></span>
                        </label>`;
                    }
                    text+=`
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
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $evoucher_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="padding:0px; text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 2){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="bpjs_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $bpjs_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12" id="train_date_search">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                        <div class="form-select" id="default-select">
                            <select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                            print_month = false
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
                <div class="col-lg-9 col-md-9 col-sm-12">
                    <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                    </div>
                    <div style="text-align:left;">
                        <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $pln_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
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
                <div class="col-lg-12" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $evoucher_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 3){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="bpjs_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $bpjs_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-12" id="train_date_search">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                    <div class="form-group">
                        <div class="default-select">
                            <select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                            print_month = false
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
                <div class="col-lg-12" style="margin-top:15px;">
                    <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                    </div>
                    <div style="text-align:left;">
                        <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $pln_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
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
                <div class="col-lg-12" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $evoucher_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 4){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="bpjs_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $bpjs_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12" id="train_date_search">
                    <span class="span-search-ticket">Pay Until</span>
                    <div class="input-container-search-ticket">
                        <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                        <div class="form-select" id="default-select">
                            <select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                            print_month = false
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
                <div class="col-lg-9 col-md-9 col-sm-12">
                    <span class="span-search-ticket">Nomor Virtual Account Keluarga / Perusahaan</span>
                    <div class="input-container-search-ticket">
                        <i class="fas fa-briefcase" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                        <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                    </div>
                    <div style="text-align:left;">
                        <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $pln_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
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
                <div class="col-lg-12" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $evoucher_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>
            `;
        }
    }

    else if(template == 5){
        if(bill_type == 'bpjs'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="bpjs_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $bpjs_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_bpjs_name('`+ppob_data.product_data[bill_type][i].name+`');" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12" id="train_date_search">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                    <div class="input-container-search-ticket btn-group">
                        <div class="form-select" id="default-select">
                            <select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                            print_month = false
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
                <div class="col-lg-9 col-md-9 col-sm-12">
                    <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control virtual_number" name="bpjs_number" id="bpjs_number" onkeyup="check_bpjs_number();" onpaste="setTimeout(check_bpjs_number.bind(null,this),100);" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                    </div>
                    <div style="text-align:left;">
                        <h6 style="color:`+color+`;" id="input_alert" style="display:none;"></h6>
                    </div>
                </div>
            `;
        }
        else if(bill_type == 'pln'){
            text = `
                <div class="col-lg-12 mb-3" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $pln_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="pln_type" onchange="get_pln_name('`+ppob_data.product_data[bill_type][i].name+`'); set_pln_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
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
                <div class="col-lg-12" style="text-align:left;">
                    <div class="input-container-search-ticket">`;
                        for(i in ppob_data.product_data[bill_type]){
                            text+=`
                            <label class="radio-button-custom" style="margin-bottom:0px;">
                                <span style="font-size:13px; color:`+text_color+`;">`+ppob_data.product_data[bill_type][i].name+`</span>`;
                            if(i == 0){
                                text+=`<input type="radio" checked="checked" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                                $evoucher_type_name = ppob_data.product_data[bill_type][i].name;
                            }else{
                                text+=`<input type="radio" name="e-voucher_type" onchange="get_evoucher_name('`+ppob_data.product_data[bill_type][i].name+`'); set_evoucher_div();" value="`+ppob_data.product_data[bill_type][i].code+`">`;
                            }
                            text+=`
                                <span class="checkmark-radio"></span>
                            </label>`;
                        }
                        text+=`
                    </div>
                </div>
                <div class="col-lg-12 mt-3" style="text-align:left;">
                    <div id="e-voucher_div" class="row" style="margin-left:0px;margin-right:0px;">
                    </div>
                </div>`;
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
        $('#bpjs_month').niceSelect();
    }else if(bill_type == 'pln'){
        set_pln_div();
    }else if(bill_type == 'e-voucher'){
        set_evoucher_div();
    }
}


function get_bpjs_name(name){
    $bpjs_type_name = name;
}

function get_pln_name(name){
    $pln_type_name = name;
}

function set_pln_div(){
    if(template == 1){
        if($pln_type_name == 'PLN Prepaid'){
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
        else if($pln_type_name == 'PLN Postpaid' || $pln_type_name == 'PLN Non Tagihan'){
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
        if($pln_type_name == 'PLN Prepaid'){
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
        else if($pln_type_name == 'PLN Postpaid' || $pln_type_name == 'PLN Non Tagihan'){
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
        if($pln_type_name == 'PLN Prepaid'){
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
        else if($pln_type_name == 'PLN Postpaid' || $pln_type_name == 'PLN Non Tagihan'){
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
        if($pln_type_name == 'PLN Prepaid'){
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
        else if($pln_type_name == 'PLN Postpaid' || $pln_type_name == 'PLN Non Tagihan'){
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
        if($pln_type_name == 'PLN Prepaid'){
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
        else if($pln_type_name == 'PLN Postpaid' || $pln_type_name == 'PLN Non Tagihan'){
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

function get_evoucher_name(name){
    $evoucher_type_name = name;
}

function set_evoucher_div(){
    if(template == 1){
        if($evoucher_type_name == 'Prepaid Mobile'){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number();" onpaste="setTimeout(check_hp_number.bind(null,this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
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
    }
    else if (template == 2){
        if($evoucher_type_name == 'Prepaid Mobile'){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number();" onpaste="setTimeout(check_hp_number.bind(null,this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
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
    }
    else if (template == 3){
        if($evoucher_type_name == 'Prepaid Mobile'){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number();" onpaste="setTimeout(check_hp_number.bind(null,this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
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
    }
    else if(template == 4){
        if($evoucher_type_name == 'Prepaid Mobile'){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-mobile" style="padding:15px 15px 15px 18px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number();" onpaste="setTimeout(check_hp_number.bind(null,this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
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
    }
    else if(template == 5){
        if($evoucher_type_name == 'Prepaid Mobile'){
            text = `
            <div class="col-lg-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket"><i class="fas fa-mobile"></i> Nomor Handphone Pelanggan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control hp_number" onkeyup="check_hp_number();" onpaste="setTimeout(check_hp_number.bind(null,this),100);" name="bpjs_number" id="bpjs_number" placeholder="Nomor Handphone Pelanggan" autocomplete="off"/>
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
    }

    document.getElementById('e-voucher_div').innerHTML = text;
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
            }catch(err){}
            text+=`
            <div class="col-lg-7" style="text-align:left;">
                <span style="font-size:14px; font-weight:bold;"><b>Total</b></span><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            try{
                grand_total_price = total_price;
                grand_total_price += parseFloat(additional_price)
                grand_total_price += upsell_price;
            }catch(err){}
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
        if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
            text+=`<div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
        }
        text+=`
        <div class="row">
            <div class="col-lg-12" style="padding-bottom:10px;">
                <hr/>
                <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
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
        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
            text+=`
            <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(commission_price*-1)+`</span><br>
                    </div>
                </div>
            </div>`;
        text+=`
        <div style="padding-bottom:10px;">
            <center>
                <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
            </center>
        </div>`;
        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
            text+=`
            <div style="padding-bottom:10px;">
                <center>
                    <input type="button" class="primary-btn-white" style="width:100%;" onclick="show_commission('commission');" id="show_commission_button" value="Show Commission"/><br/>
                </center>
            </div>`;
        document.getElementById('airline_detail').innerHTML = text;
}
function get_bills_review(){

}

function share_data(){
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function copy_data(){
    //
    document.getElementById('data_copy').innerHTML = $text;
    document.getElementById('data_copy').hidden = false;
    var el = document.getElementById('data_copy');
    el.select();
    document.execCommand('copy');
    document.getElementById('data_copy').hidden = true;

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
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}

function check_pln_number(){
    var pln_numb = String($(".pln_number").val());
    if ( pln_numb.length >= 1 ){
        min_input = 0;
        max_input = 0;

        for(i in ppob_data.product_data[bill_type]){
            if(ppob_data.product_data[bill_type][i].name == $pln_type_name){
                min_input = ppob_data.product_data[bill_type][i].min_cust_number;
                max_input = ppob_data.product_data[bill_type][i].max_cust_number;
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
    if ( virtual_numb.length >= 1 ){
        min_input = 0;
        max_input = 0;

        for(i in ppob_data.product_data[bill_type]){
            if(ppob_data.product_data[bill_type][i].name == $bpjs_type_name){
                min_input = ppob_data.product_data[bill_type][i].min_cust_number;
                max_input = ppob_data.product_data[bill_type][i].max_cust_number;
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

function check_hp_number(){
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

        for(i in ppob_data.product_data[bill_type]){
            if(ppob_data.product_data[bill_type][i].name == $evoucher_type_name){
                min_input = ppob_data.product_data[bill_type][i].min_cust_number;
                max_input = ppob_data.product_data[bill_type][i].max_cust_number;
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
            code_includes = false;
            temp_number = temp_value;
            for(j in nominal_number_list){
                if (temp_value == nominal_number_list[j][0]){
                    code_voucher = nominal_number_list[j][1];
                    break;
                }
            }

            text_img+=`
            <div class="row">
                <div class="col-lg-12">`;
                if(code_voucher != ''){
                    text_img+=`<label class="radio-img">`;
                    if(code_voucher == "TSEL"){
                        text_img+=`
                        <input type="radio" checked="checked" name="voucher-type" value="pulsa" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/telkomsel.png" alt="Telkomsel" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "ISAT"){
                        text_img+=`<input type="radio" checked="checked" name="voucher-type" value="pulsa" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/indosat.png" alt="Indosat" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "XL"){
                        text_img+=`<input type="radio" checked="checked" name="voucher-type" value="pulsa" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/xl.png" alt="XL" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "TR"){
                        text_img+=`<input type="radio" checked="checked" name="voucher-type" value="pulsa" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/tri.png" alt="Tri" style="width:auto; height:60px; padding:0px;">`;
                    }else if(code_voucher == "SM"){
                        text_img+=`<input type="radio" checked="checked" name="voucher-type" value="pulsa" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/smartfren.png" alt="Smartfren" style="width:auto; height:60px; padding:0px;">`;
                    }
                    text_img+=`</label>`;

                    text_img+=`
                    <label class="radio-img">
                        <input type="radio" name="voucher-type" value="ovo" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/ovo.png" alt="OVO" style="width:auto; height:60px; padding:0px;">
                    </label>`;

                    text_img+=`
                    <label class="radio-img">
                        <input type="radio" name="voucher-type" value="gopay" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/gopay.png" alt="GO-PAY" style="width:auto; height:60px; padding:0px;">
                    </label>`;
                }
                else{
                    text_img+=`
                    <label class="radio-img">
                        <input type="radio" checked="checked" name="voucher-type" value="ovo" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/ovo.png" alt="OVO" style="width:auto; height:60px; padding:0px;">
                    </label>`;

                    text_img+=`
                    <label class="radio-img">
                        <input type="radio" name="voucher-type" value="gopay" onchange="set_evoucher_type();">
                        <img src="/static/tt_website_rodextrip/images/icon/gopay.png" alt="GO-PAY" style="width:auto; height:60px; padding:0px;">
                    </label>`;
                }
            text_img+=`</div>
            </div>`;
            document.getElementById('img_operator').innerHTML = text_img;
            set_evoucher_type(ppob_data.available_prepaid_mobile);

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

    if(v_type == 'pulsa'){
        for(i in ppob_data.available_prepaid_mobile){
            if(code_voucher != ''){
                code_includes = i.includes(code_voucher);
                if(code_includes == true){
                    if(template != 3){
                        text_nominal+=`<div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 mb-3">`;
                    }else{
                        text_nominal+=`<div class="col-xs-6 col-sm-6 col-md-6 col-lg-4 mb-3">`;
                    }

                    text_nominal+=`
                        <label class="radio-label" style="padding:unset; width:100%;">
                            <input type="radio" name="e-voucher_nominal" value="`+i+`">
                            <div class="div_label"><span style="color:`+text_color+`;">`+ppob_data.available_prepaid_mobile[i]+`</span></div>
                        </label>
                    </div>`;
                }
            }
        }
    }else if(v_type == 'ovo'){
        for(i in ppob_data.available_prepaid_mobile){
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
                        <div class="div_label"><span style="color:`+text_color+`;">`+ppob_data.available_prepaid_mobile[i]+`</span></div>
                    </label>
                </div>`;
            }
        }
    }else if(v_type == 'gopay'){
        for(i in ppob_data.available_prepaid_mobile){
            code_includes = i.includes("GP");
            if(code_includes == true){
                if(template != 3){
                    text_nominal+=`<div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 mb-3">`;
                }else{
                    text_nominal+=`<div class="col-xs-6 col-sm-6 col-md-6 col-lg-4 mb-3">`;
                }

                text_nominal+=`
                    <label class="radio-label" style="padding:unset; width:100%;">
                        <input type="radio" name="e-voucher_nominal" value="`+i+`">
                        <div class="div_label"><span style="color:`+text_color+`;">`+ppob_data.available_prepaid_mobile[i]+`</span></div>
                    </label>
                </div>`;
            }
        }
    }

    document.getElementById('e-voucher_nominal_div').innerHTML = text_nominal;

}