printout_state = 0;
function get_printout(order_number,mode,provider_type,type='',reschedule_number='',timeout=60){
    //type ticket, ticket_price, invoice, itinerary, voucher, visa_handling,
    if(printout_state == 0){
        printout_state = 1;
        bill_name_to = '';
        bill_address = '';
        additional_information = '';
        kwitansi_name = '';
        try{
            bill_name_to = document.getElementById('bill_name').value;
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
        try{
            bill_address = document.getElementById('bill_address').value;
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
        try{
            additional_information = document.getElementById('additional_information').value;
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
        try{
            kwitansi_name = document.getElementById('kwitansi_name').value;
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }

        if(mode == 'ticket'){
            $('#button-choose-print').prop('disabled', true);
            $('#button-choose-print').addClass("running");
        }else if(mode == 'itinerary' || mode == 'ticket_price'){
            $('#button-print-print').prop('disabled', true);
            $('#button-print-print').addClass("running");
        }else if(mode == 'ticket_original'){
            $('#button-print-ori').prop('disabled', true);
            $('#button-print-ori').addClass("running");
        }else if(mode == 'invoice' && type == 'reschedule'){
            $('#button-print-reschedule-invoice').prop('disabled', true);
            $('#button-issued-reschedule-invoice').addClass("running");
        }else if(type == 'reschedule'){
            $('#button-issued-reschedule').prop('disabled', true);
            $('#button-issued-reschedule').addClass("running");
        }else if(mode == 'invoice'){
            $('#button-issued-print').prop('disabled', true);
            $('#button-issued-print').addClass("running");
        }else if(mode == 'passport_cust' || mode == 'visa_cust'){
            $('#button-print-handling').prop('disabled', true);
            $('#button-print-handling').addClass("running");
        }

        $.ajax({
           type: "POST",
           url: "/webservice/printout",
           headers:{
                'action': 'get_printout',
           },
           data: {
                'order_number': order_number,
                'mode': mode,
                'provider_type': provider_type,
                'bill_name_to': bill_name_to,
                'bill_address': bill_address,
                'additional_information': additional_information,
                'signature': signature,
                'timeout': timeout,
                'kwitansi_name': kwitansi_name,
                'type': type,
                'reschedule_number': reschedule_number
           },
           success: function(msg) {
                if(msg.result.error_code == 0){
                    for(i in msg.result.response)
                        if(msg.result.response[i].hasOwnProperty('url'))
                            openInNewTab(msg.result.response[i].url);
                        else{
                            Swal.fire({
                              type: 'error',
                              title: 'Oops!',
                              html: msg.result.response[i].error_msg,
                            });
                            break;
                        }
    //                window.open(msg.result.response.url,'_blank');
    //                window.open('https://static.rodextrip.com/ebe/6b5/74e/ig%20no%20socmed.jpg','_blank');
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                    })
                }
                printout_state = 0;
                if(mode == 'ticket'){
                    $('#button-choose-print').prop('disabled', false);
                    $('#button-choose-print').removeClass("running");
                }else if(type == 'reschedule' && mode == 'invoice'){
                    $('#button-issued-reschedule-invoice').prop('disabled', false);
                    $('#button-issued-reschedule-invoice').removeClass("running");
                }else if(type == 'reschedule'){
                    $('#button-issued-reschedule').prop('disabled', false);
                    $('#button-issued-reschedule').removeClass("running");
                }else if(mode == 'itinerary' || mode == 'ticket_price'){
                    $('#button-print-print').prop('disabled', false);
                    $('#button-print-print').removeClass("running");
                }else if(mode == 'ticket_original'){
                    $('#button-print-ori').prop('disabled', false);
                    $('#button-print-ori').removeClass("running");
                }else if(mode == 'passport_cust' || mode == 'visa_cust'){
                    $('#button-print-handling').prop('disabled', false);
                    $('#button-print-handling').removeClass("running");
                }else if(mode == 'invoice'){
                    $('#button-issued-print').prop('disabled', false);
                    $('#button-issued-print').removeClass("running");
                }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error printout');
                printout_state = 0;
                if(mode == 'ticket'){
                    $('#button-choose-print').prop('disabled', false);
                    $('#button-choose-print').removeClass("running");
                }else if(type == 'reschedule' && mode == 'invoice'){
                    $('#button-issued-reschedule-invoice').prop('disabled', false);
                    $('#button-issued-reschedule-invoice').removeClass("running");
                }else if(type == 'reschedule'){
                    $('#button-issued-reschedule').prop('disabled', false);
                    $('#button-issued-reschedule').removeClass("running");
                }else if(mode == 'itinerary' || mode == 'ticket_price'){
                    $('#button-print-print').prop('disabled', false);
                    $('#button-print-print').removeClass("running");
                }else if(mode == 'ticket_original'){
                    $('#button-print-ori').prop('disabled', false);
                    $('#button-print-ori').removeClass("running");
                }else if(mode == 'passport_cust' || mode == 'visa_cust'){
                    $('#button-print-handling').prop('disabled', false);
                    $('#button-print-handling').removeClass("running");
                }else if(mode == 'invoice'){
                    $('#button-issued-print').prop('disabled', false);
                    $('#button-issued-print').removeClass("running");
                }
           },timeout: timeout * 1000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">Please wait to print next print out </span>',
        })
    }
}

data_vendor = {
    "phc": {
        'PHCDTKATG': 'phc_antigen_information',
        'PHCDTKPCR': 'phc_pcr_information',
        'PHCDTEPCR': 'phc_pcr_express_information',
        'PHCDTOPCR': 'phc_pcr_priority_information',
        'PHCHCKATG': 'phc_antigen_homecare_information',
        'PHCHCKPCR': 'phc_pcr_homecare_information',
        'PHCDTKSRBD': 'phc_srbd_drive_thru_information'
    },
    "national_hospital": {
        'NHDTKPCRR': 'nathos_pcr_rs_nathos_information',
        'NHDTKPCRP': 'nathos_pcr_poc_information',
        'NHDTKPCRB': 'nathos_pcr_bali_information',
        'NHDTMPCR': 'nathos_pcr_mutasi_information',
        'NHDTSPCRR': 'nathos_pcr_saliva_rs_nathos_information',
        'NHDTSPCRP': 'nathos_pcr_saliva_poc_information',
        'NHDTSPCRB': 'nathos_pcr_saliva_bali_information',
        'NHDTKATGR': 'nathos_antigen_rs_nathos_information',
        'NHDTKATGP': 'nathos_antigen_poc_information',
        'NHDTKKARBD': 'nathos_tes_antibodi_rbd_information',
        'NHDTNATG': 'nathos_antigen_nassal_information',
        'NHDTKMCU1': 'nathos_checkup1_information',
        'NHDTKMCU2': 'nathos_checkup2_information',
        'NHDTKMCU3': 'nathos_checkup3_information',
        'NHDTKMCU4M': 'nathos_checkup4M_information',
        'NHDTKMCU4F': 'nathos_checkup4F_information',
        'NHDTKMCU5M': 'nathos_checkup5M_information',
        'NHDTKMCU5F': 'nathos_checkup5F_information',
        'NHDTKPSC': 'nathos_paket_screening_cvd19_information',
        'NHDTKPSCWPCR': 'nathos_paket_screening_cvd19_with_pcr_information',
        'NHDTKPSCUL': 'nathos_paket_screening_cvd19_urban_lifestyle_information'
    },
    "swabexpress": {
        'SEKATG': 'swabexpress_antigen_information',
        'SEKPCR': 'swabexpress_pcr_information',
        'SEPPCR': 'swabexpress_pcr_priority_information'
    },
    "labpintar": {
        'LPKATG': 'labpintar_antigen_information',
        'LPKPCR': 'labpintar_pcr_information',
        'LPEPCR': 'labpintar_pcr_express_information',
        'LPPPCR': 'labpintar_pcr_priority_information'

    },
    "periksain": {
        'PCR': 'periksain_pcr_information',
        'ATG': 'periksain_antigen_information'
    },
    "mitrakeluarga":{
        'MKDTKATG': 'mitrakeluarga_drivethru_antigen_information',
        'MKHCKATG': 'mitrakeluarga_homecare_antigen_information',
        'MKDTKPCR': 'mitrakeluarga_drivethru_pcr_information',
        'MKHCKPCR': 'mitrakeluarga_homecare_pcr_information',
        'MKDTPSRBD': 'mitrakeluarga_drivethru_srbd_information',
        'MKHCPSRBD': 'mitrakeluarga_homecare_srbd_information'
    },"sentramedika":{
        'SMHCKATG': 'sentramedika_antigen_information',
        'SMHCKPCR': 'sentramedika_pcr_information',
        'SMHCPMCU': 'sentramedika_mcu_information',
    }
}

function get_list_report_footer(){
    $.ajax({
       type: "POST",
       url: "/webservice/printout",
       headers:{
            'action': 'get_list_report_footer',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                text = '';
                printout = msg.result.response;
                //KALAU PAGE ADMIN / DI SETTING FOOTER
                if(document.URL.split('/')[document.URL.split('/').length-1] == 'page_admin' || document.URL.split('/')[document.URL.split('/').length-1] == 'setting_footer_printout'){
                    for(i in printout){
                        text += `<option value='`+printout[i].code+`'>`+printout[i].name+`</option>`;
                    }
                    document.getElementById('printout_choose').innerHTML = text;
                    $('#printout_choose').select2();
//                    $('#printout_choose').niceSelect('update');
                    change_printout();
                }else{
                    //MEDICAL
                    var check_header = true;
                    for(i in printout){
                        if(vendor == 'periksain'){
                            if(test_type.includes('PCR') && printout[i].code == "periksain_pcr_information"){
                                show_header_medical(printout[i].html);
                                check_header = false;
                                break;
                            }else if(test_type.includes('ATG') && printout[i].code == "periksain_antigen_information"){
                                show_header_medical(printout[i].html);
                                check_header = false;
                                break;
                            }
                        }else{
                            if(data_vendor[vendor][test_type] == printout[i].code){
                                show_header_medical(printout[i].html);
                                check_header = false;
                            }
                        }
                    }
                    if(check_header){
                        document.getElementById("information_checkbox").checked = true;
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
       },timeout: 60000
    });
}

function show_header_medical(val){
    document.getElementById('informasi_penting').innerHTML += val;
    if(val != false || val != ''){
        document.getElementById('informasi_penting').style.display = 'block';
        document.getElementById('information_div_checkbox').style.display = 'block';
    }else{
        document.getElementById("information_checkbox").checked = true;
    }
}

function change_printout(){
    for(i in printout){
        if(printout[i].code == document.getElementById('printout_choose').value){
            CKEDITOR.instances['body_printout'].setData(printout[i].html)
//            document.getElementById('body_printout').innerHTML = printout[i].html;
            break;
        }
    }
}

function update_list_report_footer(){
    document.getElementsByClassName("update_banner_btn")[0].disabled = true;
    document.getElementsByClassName("update_banner_btn")[1].disabled = true;
    document.getElementsByClassName("update_banner_btn")[2].disabled = true;
    document.getElementsByClassName("update_banner_btn")[3].disabled = true;
    document.getElementsByClassName("update_banner_btn")[4].disabled = true;
    document.getElementsByClassName("update_banner_btn")[5].disabled = true;
    document.getElementsByClassName("update_banner_btn")[6].disabled = true;
    document.getElementsByClassName("update_banner_btn")[7].disabled = true;
    document.getElementsByClassName("update_banner_btn")[8].disabled = true;
    document.getElementsByClassName("update_banner_btn")[9].disabled = true;

    $.ajax({
       type: "POST",
       url: "/webservice/printout",
       headers:{
            'action': 'update_list_report_footer_api',
       },
       data: {
            'signature': signature,
            'html': CKEDITOR.instances['body_printout'].getData(),
            'code': document.getElementById('printout_choose').value,
            'name': document.getElementById('printout_choose').options[document.getElementById('printout_choose').selectedIndex].text
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                Swal.fire({
                 type: 'success',
                 title: 'Report footer!',
                 html: 'Success update ' + document.getElementById('printout_choose').options[document.getElementById('printout_choose').selectedIndex].text,
                })
                printout = msg.result.response;
                change_printout();

                document.getElementsByClassName("update_banner_btn")[0].disabled = false;
                document.getElementsByClassName("update_banner_btn")[1].disabled = false;
                document.getElementsByClassName("update_banner_btn")[2].disabled = false;
                document.getElementsByClassName("update_banner_btn")[3].disabled = false;
                document.getElementsByClassName("update_banner_btn")[4].disabled = false;
                document.getElementsByClassName("update_banner_btn")[5].disabled = false;
                document.getElementsByClassName("update_banner_btn")[6].disabled = false;
                document.getElementsByClassName("update_banner_btn")[7].disabled = false;
                document.getElementsByClassName("update_banner_btn")[8].disabled = false;
                document.getElementsByClassName("update_banner_btn")[9].disabled = false;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
            document.getElementsByClassName("update_banner_btn")[0].disabled = false;
            document.getElementsByClassName("update_banner_btn")[1].disabled = false;
            document.getElementsByClassName("update_banner_btn")[2].disabled = false;
            document.getElementsByClassName("update_banner_btn")[3].disabled = false;
            document.getElementsByClassName("update_banner_btn")[4].disabled = false;
            document.getElementsByClassName("update_banner_btn")[5].disabled = false;
            document.getElementsByClassName("update_banner_btn")[6].disabled = false;
            document.getElementsByClassName("update_banner_btn")[7].disabled = false;
            document.getElementsByClassName("update_banner_btn")[8].disabled = false;
            document.getElementsByClassName("update_banner_btn")[9].disabled = false;
       },timeout: 60000
    });
}

function update_printout_color(){
    document.getElementsByClassName("update_banner_btn")[0].disabled = true;
    document.getElementsByClassName("update_banner_btn")[1].disabled = true;
    document.getElementsByClassName("update_banner_btn")[2].disabled = true;
    document.getElementsByClassName("update_banner_btn")[3].disabled = true;
    document.getElementsByClassName("update_banner_btn")[4].disabled = true;
    document.getElementsByClassName("update_banner_btn")[5].disabled = true;
    document.getElementsByClassName("update_banner_btn")[6].disabled = true;
    document.getElementsByClassName("update_banner_btn")[7].disabled = true;
    document.getElementsByClassName("update_banner_btn")[8].disabled = true;
    document.getElementsByClassName("update_banner_btn")[9].disabled = true;

    $.ajax({
       type: "POST",
       url: "/webservice/printout",
       headers:{
            'action': 'set_color_printout_api',
       },
       data: {
            'signature': signature,
            'color': '#' + document.getElementById('printout_color_background').value
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Updated!',
                  html: 'printout color',
                })
                document.getElementsByClassName("update_banner_btn")[0].disabled = false;
                document.getElementsByClassName("update_banner_btn")[1].disabled = false;
                document.getElementsByClassName("update_banner_btn")[2].disabled = false;
                document.getElementsByClassName("update_banner_btn")[3].disabled = false;
                document.getElementsByClassName("update_banner_btn")[4].disabled = false;
                document.getElementsByClassName("update_banner_btn")[5].disabled = false;
                document.getElementsByClassName("update_banner_btn")[6].disabled = false;
                document.getElementsByClassName("update_banner_btn")[7].disabled = false;
                document.getElementsByClassName("update_banner_btn")[8].disabled = false;
                document.getElementsByClassName("update_banner_btn")[9].disabled = false;
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
                })
                document.getElementsByClassName("update_banner_btn")[0].disabled = false;
                document.getElementsByClassName("update_banner_btn")[1].disabled = false;
                document.getElementsByClassName("update_banner_btn")[2].disabled = false;
                document.getElementsByClassName("update_banner_btn")[3].disabled = false;
                document.getElementsByClassName("update_banner_btn")[4].disabled = false;
                document.getElementsByClassName("update_banner_btn")[5].disabled = false;
                document.getElementsByClassName("update_banner_btn")[6].disabled = false;
                document.getElementsByClassName("update_banner_btn")[7].disabled = false;
                document.getElementsByClassName("update_banner_btn")[8].disabled = false;
                document.getElementsByClassName("update_banner_btn")[9].disabled = false;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update');
            document.getElementsByClassName("update_banner_btn")[0].disabled = false;
            document.getElementsByClassName("update_banner_btn")[1].disabled = false;
            document.getElementsByClassName("update_banner_btn")[2].disabled = false;
            document.getElementsByClassName("update_banner_btn")[3].disabled = false;
            document.getElementsByClassName("update_banner_btn")[4].disabled = false;
            document.getElementsByClassName("update_banner_btn")[5].disabled = false;
            document.getElementsByClassName("update_banner_btn")[6].disabled = false;
            document.getElementsByClassName("update_banner_btn")[7].disabled = false;
            document.getElementsByClassName("update_banner_btn")[8].disabled = false;
            document.getElementsByClassName("update_banner_btn")[9].disabled = false;
       },timeout: 60000
    });
}

function get_medical_information(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_medical_information',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            if(msg.error_code == 0){
                medical_data_frontend = msg.response;
                change_medical_information();
            }else{

            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
       },timeout: 60000
    });
}

function update_medical_information(){
    document.getElementsByClassName("update_banner_btn")[0].disabled = true;
    document.getElementsByClassName("update_banner_btn")[1].disabled = true;
    document.getElementsByClassName("update_banner_btn")[2].disabled = true;
    document.getElementsByClassName("update_banner_btn")[3].disabled = true;
    document.getElementsByClassName("update_banner_btn")[4].disabled = true;
    document.getElementsByClassName("update_banner_btn")[5].disabled = true;
    document.getElementsByClassName("update_banner_btn")[6].disabled = true;
    document.getElementsByClassName("update_banner_btn")[7].disabled = true;
    document.getElementsByClassName("update_banner_btn")[8].disabled = true;
    document.getElementsByClassName("update_banner_btn")[9].disabled = true;

    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'update_medical_information',
       },
       data: {
            'signature': signature,
            'name': document.getElementById('medical_information').value,
            'html': CKEDITOR.instances['body_medical_information'].getData(),
       },
       success: function(msg) {
            if(msg.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Updated!',
                  html: document.getElementById('medical_information').value + ' update!',
                })
                document.getElementsByClassName("update_banner_btn")[0].disabled = false;
                document.getElementsByClassName("update_banner_btn")[1].disabled = false;
                document.getElementsByClassName("update_banner_btn")[2].disabled = false;
                document.getElementsByClassName("update_banner_btn")[3].disabled = false;
                document.getElementsByClassName("update_banner_btn")[4].disabled = false;
                document.getElementsByClassName("update_banner_btn")[5].disabled = false;
                document.getElementsByClassName("update_banner_btn")[6].disabled = false;
                document.getElementsByClassName("update_banner_btn")[7].disabled = false;
                document.getElementsByClassName("update_banner_btn")[8].disabled = false;
                document.getElementsByClassName("update_banner_btn")[9].disabled = false;
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.error_msg,
                })
                document.getElementsByClassName("update_banner_btn")[0].disabled = false;
                document.getElementsByClassName("update_banner_btn")[1].disabled = false;
                document.getElementsByClassName("update_banner_btn")[2].disabled = false;
                document.getElementsByClassName("update_banner_btn")[3].disabled = false;
                document.getElementsByClassName("update_banner_btn")[4].disabled = false;
                document.getElementsByClassName("update_banner_btn")[5].disabled = false;
                document.getElementsByClassName("update_banner_btn")[6].disabled = false;
                document.getElementsByClassName("update_banner_btn")[7].disabled = false;
                document.getElementsByClassName("update_banner_btn")[8].disabled = false;
                document.getElementsByClassName("update_banner_btn")[9].disabled = false;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update');
            document.getElementsByClassName("update_banner_btn")[0].disabled = false;
            document.getElementsByClassName("update_banner_btn")[1].disabled = false;
            document.getElementsByClassName("update_banner_btn")[2].disabled = false;
            document.getElementsByClassName("update_banner_btn")[3].disabled = false;
            document.getElementsByClassName("update_banner_btn")[4].disabled = false;
            document.getElementsByClassName("update_banner_btn")[5].disabled = false;
            document.getElementsByClassName("update_banner_btn")[6].disabled = false;
            document.getElementsByClassName("update_banner_btn")[7].disabled = false;
            document.getElementsByClassName("update_banner_btn")[8].disabled = false;
            document.getElementsByClassName("update_banner_btn")[9].disabled = false;
       },timeout: 60000
    });
}

function change_medical_information(){
    for(i in medical_data_frontend){
        if(medical_data_frontend[i].code == document.getElementById('medical_information').value){
            CKEDITOR.instances['body_medical_information'].setData(medical_data_frontend[i].html)
            break;
        }
    }
}