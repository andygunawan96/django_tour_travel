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

function set_container_bill(){
    var radios = document.getElementsByName('bills_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            bill_type = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    if(bill_type == 'bpjs'){
        text = `
            <div class="col-lg-12 col-md-12 col-sm-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Type</span>
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select" id="default-select">
                        <select id="bpjs_type" name="bpjs_type" class="nice-select-default">
                            <option value="bpjs_kesehatan" selected>BPJS Kesehatan</option>
                            <option value="bpjs_denda">BPJS Denda</option>
                            <option value="bpjs_tenagakerja">BPJS Ketenagakerjaan</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6" style="padding:0px;" id="train_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Pay Until</span>
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select" id="default-select">
                        <select id="bpjs_month" name="bpjs_month" class="nice-select-default">`;
                        print_month = false
                        for(i in month_list){
                            if(moment().format('MMM') == month_list[i][1])
                                print_month = true;
                            if(print_month == true)
                                text+= `<option value='`+month_list[i][0]+`'>`+month_list[i][1]+` `+new Date().getFullYear()+`</option>`;
                        }
        text+=`
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-6 col-sm-6" style="padding:0px;">
                <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Virtual Account Keluarga / Perusahaan</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                </div>
            </div>
        `;
    }else if(bill_type == 'pln'){
        text = `
            <div class="col-lg-12 col-md-12 col-sm-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <span class="span-search-ticket">Type</span>
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select" id="default-select">
                        <select id="pln_type" name="pln_type" class="nice-select-default" onchange="set_pln_div();">
                            <option value="pre_paid" selected>Pre Paid / Token Listrik</option>
                            <option value="post_paid">Post Paid / Tagihan Listrik</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                <div id="pln_div" class="row" style="margin-left:0px;margin-right:0px;">
                </div>
            </div>
        `;
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
        $('select').niceSelect();
    }else if(bill_type == 'pln'){
        set_pln_div();
    }
}

function set_pln_div(){
    if(document.getElementById('pln_type').value == 'pre_paid')
        text = `<div class="col-lg-6 col-md-6 col-sm-6" style="padding:0px; text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Meter / ID Pelanggan</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6" style="padding:0px; text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket">Type</span>
                    <div class="input-container-search-ticket btn-group">
                        <div class="form-select" id="default-select">
                            <select id="pln_nominal" name="pln_nominal" class="nice-select-default">
                                <option value="20000" selected>`+getrupiah(20000)+`</option>
                                <option value="50000">`+getrupiah(50000)+`</option>
                                <option value="100000">`+getrupiah(100000)+`</option>
                            </select>
                        </div>
                    </div>
                </div>`;
    else if(document.getElementById('pln_type').value == 'post_paid')
        text = `<div class="col-lg-12 col-md-12 col-sm-12" style="padding:0px; text-align:left;margin-bottom:10px;">
                    <span class="span-search-ticket"><i class="fas fa-briefcase"></i> Nomor Meter / ID Pelanggan</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="bpjs_number" id="bpjs_number" placeholder="Nomor Virtual Account Keluarga / Perusahaan" autocomplete="off"/>
                    </div>
                </div>`;
    document.getElementById('pln_div').innerHTML = text;
    $('select').niceSelect();
}