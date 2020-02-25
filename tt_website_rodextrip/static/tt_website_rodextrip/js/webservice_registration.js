counter_passenger = 0;
counter_regis_doc = 0;
function submit_agent_registration(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/registration",
       headers:{
            'action': 'agent_registration',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
//                if(username == '')
//                    get_payment_acq('Issued','', '', 'top_up', signature, 'registration','', '')
//                else
//                    get_payment_acq('Issued','', '', 'billing', signature, 'registration','', '')
//                document.getElementById('payment_acq').hidden = false;
                text = '';
                text += `<br/>
                    <label>Registration Number: `+msg.result.response.registration_number+`</label><br/>
                    <label>`+msg.result.response.name+`</label><br/>
                    <label>Fee: `;
                if(msg.result.response.currency != false)
                    text+=msg.result.response.currency+' ';
                else
                    text+='IDR ';
                text+=getrupiah(msg.result.response.registration_fee)+`</label><br/>`;
                $("#result_data_id").html(text);
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error submit agent registration </span>' + msg.result.error_msg,
                })
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error submit agent registration </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function agent_register_get_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/registration",
       headers:{
            'action': 'get_config',
       },
       data: {

       },
       success: function(msg) {
            console.log(msg);
            agent_register_get_requirement_list_doc();
            text=  '';
            //company
            agent_regis_config = msg;
            //agent type
            text = '<option value="" disabled selected>Agent Type</option>';
            for(i in msg.result.response.agent_type){
//                if(msg.result.response.agent_type[i].is_allow_regis == true)
                text+=`<option value="`+msg.result.response.agent_type[i].name+`">`+msg.result.response.agent_type[i].name+`</option>`;
            }
            document.getElementById('agent_type_id').innerHTML = text;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error agent registration config </span>' + errorThrown,
            })
       },timeout: 180000
    });
}

function onchange_agent_type(){
    text = '';
    msg = agent_regis_config;
    for(i in msg.result.response.company_type){
        if(document.getElementById('agent_type').value == "Agent Citra" && i == 0){
            text+= `<label class="radio-button-custom">
                    <span style="font-size:14px;">`+msg.result.response.company_type[i][1]+`</span>
                    <input disabled type="radio" name="radio_company_type" value="`+msg.result.response.company_type[i][0]+`" onclick="set_company_type();">
                    <span class="checkmark-radio"></span>
                </label>`;
        }else{
            text+= `<label class="radio-button-custom">
                    <span style="font-size:14px;">`+msg.result.response.company_type[i][1]+`</span>
                    <input type="radio" name="radio_company_type" value="`+msg.result.response.company_type[i][0]+`" onclick="set_company_type();">
                    <span class="checkmark-radio"></span>
                </label>`;
        }
    }

        document.getElementById('company_type').innerHTML = text;
}

function get_promotions(){
    $.ajax({
       type: "POST",
       url: "/webservice/registration",
       headers:{
            'action': 'get_promotions',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
//            if(msg.result.error_code == 0)
//                requirement_document = msg.result.response;
            try{
                promotion = msg.result.response;
                text = '<option value="" disabled selected>Promotions</option>';
                for(i in msg.result.response){
                    text+=`<option value="`+msg.result.response[i].id+`">`+msg.result.response[i].name+` - `+msg.result.response[i].description+`</option>`;
                }
                document.getElementById('promotion').innerHTML = text;
                if(template == 1 || template == 3 || template == 4 || template == 5){
                    $('#promotion').niceSelect();
                }else if(template == 2){
                    $('#promotion').niceSelect("update");
                }
            }catch(err){
                text = '<option value="" disabled selected>Promotions</option>';
                document.getElementById('promotion').innerHTML = text;
                if(template == 1 || template == 3 || template == 4 || template == 5){
                    $('#promotion').niceSelect();
                }else if(template == 2){
                    $('#promotion').niceSelect("update");
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            text = '<option value="" disabled selected>Promotions</option>';
            document.getElementById('promotion').innerHTML = text;
            if(template == 1 || template == 3 || template == 4 || template == 5){
                $('#promotion').niceSelect();
            }else if(template == 2){
                $('#promotion').niceSelect("update");
            }
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error agent registration requirement list </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function change_promotion(){
    console.log(document.getElementById('promotion').value);
    text = '';
    for(i in promotion){
        if(document.getElementById('promotion').value == promotion[i].id){
            for(j in promotion[i].commission){
                text += promotion[i].commission[j].recruited + ' fee ' + promotion[i].commission[j].currency + ' ' + getrupiah(promotion[i].commission[j].registration_fee) +  '<br/>';
                if(promotion[i].commission[j].discount_amount != 0){
                    text += 'Discount ' + promotion[i].commission[j].currency + ' ' + getrupiah(promotion[i].commission[j].discount_amount) + '<br/>';
                }
                text += promotion[i].commission[j].recruited + ' fee ' + promotion[i].commission[j].currency + ' ' + getrupiah(promotion[i].commission[j].registration_fee) +  '<br/>';
                for(k in promotion[i].commission[j].lines){
                    text += 'Commission ' + promotion[i].commission[j].currency + ' ' + getrupiah(promotion[i].commission[j].lines[k].amount) + '<br/><br/>';
                }
            }
        }
    }
    document.getElementById('promotion_desc').innerHTML = text;
}

function agent_register_get_requirement_list_doc(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/registration",
       headers:{
            'action': 'get_requirement_list_doc',
       },
       data: {

       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0)
                requirement_document = msg.result.response;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error agent registration requirement list </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function auto_complete_registration(type){
    if(type == 'agent_type'){
        document.getElementById('agent_type').value = document.getElementById('select2-'+type+'_id-container').innerHTML;
    }else if(type == 'country'){
        var text = `<option value="" selected="">Cities</option>`;
        var country = {};
        for(i in country_list){
           if(country_list[i].id == parseInt(document.getElementById('country_id').value)){
               country = country_list[i];
               break;
           }
        }
//        for(i in country.city){
//            text +=`<option value="`+country.city[i].id+`">`+country.city[i].name+`</option>`
//        }
//        document.getElementById('city_id').innerHTML = text;
        document.getElementById('country').value = document.getElementById('select2-country_id-container').innerHTML;
    }else if(type == 'city'){
        document.getElementById('city').value = document.getElementById('select2-'+type+'_id-container').innerHTML;
    }
}

function set_company_type(){
    company = '';
    var radios = document.getElementsByName('radio_company_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            company = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    if(company == 'individual'){
        document.getElementById('company_details').hidden = true;
        document.getElementById('company_details').innerHTML = '';
    }else{
        document.getElementById('company_details').hidden = false;
        text = `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="control-label" for="person_name">Business License</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control o_website_form_input" id="business_license" name="business_license" required="1"/>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="control-label" for="comp_name">NPWP</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control o_website_form_input" id="npwp" name="npwp" required="1"/>
                    </div>
                </div>`;

        document.getElementById('company_details').innerHTML = text;
    }

}


function check_registration(){
    error_log = '';
    company = '';
    var radios = document.getElementsByName('radio_company_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            company = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    if(company == ''){
        error_log+= 'Please fill company!\n';
    }
//    if(company == 'individual'){
//
//    }else if(company == 'company'){
//        if(document.getElementById('business_license').value == ''){
//            error_log+= 'Please fill business license!\n';
//            document.getElementById('business_license').style['border-color'] = 'red';
//        }else{
//            document.getElementById('business_license').style['border-color'] = '#EFEFEF';
//        }if(document.getElementById('npwp').value == ''){
//            error_log+= 'Please fill NPWP!\n';
//            document.getElementById('npwp').style['border-color'] = 'red';
//        }else{
//            document.getElementById('npwp').style['border-color'] = '#EFEFEF';
//        }
//    }
    if(document.getElementById('agent_type').value == ''){
        error_log+= 'Please fill agent type!\n';
        document.getElementById('agent_type').style['border-color'] = 'red';
    }else{
        document.getElementById('agent_type').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('comp_name').value == ''){
        error_log+= 'Please fill company name!\n';
        document.getElementById('comp_name').style['border-color'] = 'red';
    }else{
        document.getElementById('comp_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('street').value == ''){
        error_log+= 'Please fill street!\n';
        document.getElementById('street').style['border-color'] = 'red';
    }else{
        document.getElementById('street').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('country').value == ''){
        error_log+= 'Please fill country!\n';
        document.getElementById('country').style['border-color'] = 'red';
    }else{
        document.getElementById('country').style['border-color'] = '#EFEFEF';
//    }if(document.getElementById('city').value == ''){
//        error_log+= 'Please fill city!\n';
//        document.getElementById('city').style['border-color'] = 'red';
//    }else{
//        document.getElementById('city').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('tacagree').checked == false){
        error_log+= 'Please fill check term n condition!\n';
        document.getElementById('tacagree').style['border-color'] = 'red';
    }else{
        document.getElementById('tacagree').style['border-color'] = '#EFEFEF';
    }
    //check pic
    for(i=1;i<=counter_passenger;i++){
        if(document.getElementById('first_name'+i).value == ''){
            error_log+= 'Please fill first name for pic '+i+'!\n';
            document.getElementById('first_name'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('first_name'+i).style['border-color'] = '#EFEFEF';
        }if(document.getElementById('last_name'+i).value == ''){
            error_log+= 'Please fill last name for pic '+i+'!\n';
            document.getElementById('last_name'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('last_name'+i).style['border-color'] = '#EFEFEF';
        }
        //birth
        //email
        if(document.getElementById('mobile'+i).value == ''){
            error_log+= 'Please fill mobile for pic '+i+'!\n';
            document.getElementById('mobile'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('mobile'+i).style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('job_position'+i).value == ''){
            error_log+= 'Please fill job position for pic '+i+'!\n';
            document.getElementById('job_position'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('job_position'+i).style['border-color'] = '#EFEFEF';
        }
    }
    //check doc regis
    for(i=1;i<=counter_regis_doc;i++){
        if(document.getElementById('agent_type').value == 'Agent Citra'){
            if( document.getElementById("resume"+i).files.length == 0 ){
                if(i == 1)
                    error_log+= 'Please fill ktp!\n';
                else if(i == 2)
                    error_log+= 'Please fill npwp!\n';
                else if(i == 3)
                    error_log+= 'Please fill siup!\n';
                document.getElementById('resume'+i).style['border-color'] = 'red';
            }else if(i == 1 && document.getElementById("resume"+i).files.length == 0){
                error_log+= 'Please fill ktp!\n';
                document.getElementById('resume'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('resume'+i).style['border-color'] = '#EFEFEF';
            }
        }
    }


    if(error_log == ''){
        document.getElementById('agent_registration').submit();
    }else{
         Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: #ff9900;">Error </span>' + error_log,
        })
    }
}

//pax

function add_table_of_passenger(){
    text= '';
    var node = document.createElement("tr");
    text += `
        <td>`+(parseInt(counter_passenger)+1)+`</td>
        <td>
            <span id='name_pax`+counter_passenger+`' name='name_pax`+counter_passenger+`'></span>
        </td>
        <td>
            <span id='mobile_pax`+counter_passenger+`' name='mobile_pax`+counter_passenger+`'></span>
        </td>
        <td>
            <span id='job_position_pax`+counter_passenger+`' name='job_position_pax`+counter_passenger+`'></span>
        </td>
        `;
    text += `
        <td>
            <div style="text-align:center;">
                <button type="button" class="primary-btn" style="margin-bottom:5px; line-height:34px;" data-toggle="modal" data-target="#myModalPassenger`+counter_passenger+`"><i class="fas fa-edit"></i></button>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="myModalPassenger`+counter_passenger+`" role="dialog" data-keyboard="false">
                <div class="modal-dialog">

                  <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:`+text_color+`">Person In Charge `+(counter_passenger+1)+`</h4>
                            <button type="button" class="close" data-dismiss="modal" onclick="update_contact('pic',`+parseInt(counter_passenger+1)+`);">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <span class="control-label" for="person_name">First Name<span class="required-txt">* </span></span>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control o_website_form_input" id="first_name`+parseInt(counter_passenger+1)+`" name="first_name`+parseInt(counter_passenger+1)+`" required="1" placeholder="Ex: John"/>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <span class="control-label" for="comp_name">Last Name<span class="required-txt">* </span></span>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control o_website_form_input" id="last_name`+parseInt(counter_passenger+1)+`" name="last_name`+parseInt(counter_passenger+1)+`" required="1" placeholder="Ex: Smith"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <span class="control-label" for="birth_date">Birth Date<span class="required-txt">* </span></span>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type='text' class="form-control o_website_form_input date-picker-birth" id="birth_date`+parseInt(counter_passenger+1)+`" name="birth_date`+parseInt(counter_passenger+1)+`" required="1" autocomplete="off"/>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <span class="control-label" for="email">Email<span class="required-txt">* </span></span>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="email" class="form-control o_website_form_input" id="email`+parseInt(counter_passenger+1)+`" name="email`+parseInt(counter_passenger+1)+`" required="1"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <span class="control-label" for="mobile">Mobile<span class="required-txt">* </span></span>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control o_website_form_input" id="mobile`+parseInt(counter_passenger+1)+`" name="mobile`+parseInt(counter_passenger+1)+`" required="1"/>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <span class="control-label" for="phone">Phone</span>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control o_website_form_input" id="phone`+parseInt(counter_passenger+1)+`" name="phone`+parseInt(counter_passenger+1)+`"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <span class="control-label" for="job_position">Job Position<span class="required-txt">* </span></span>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control o_website_form_input" id="job_position`+parseInt(counter_passenger+1)+`" name="job_position`+parseInt(counter_passenger+1)+`" placeholder="e.g Sales Manager" required="1"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-default" data-dismiss="modal" onclick="update_contact('pic',`+parseInt(counter_passenger+1)+`);">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </td>`;

    node.innerHTML = text;
    node.setAttribute('id', 'table_passenger'+counter_passenger);
    document.getElementById("table_of_passenger").appendChild(node);
    $('input[type="text"].date-picker-birth').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: moment(),
          maxDate: moment(),
          showDropdowns: true,
          opens: 'center',
          locale: {
              format: 'DD MMM YYYY',
          }
      });

    $('input[type="text"].date-picker-passport').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: moment(),
          minDate: moment(),
          showDropdowns: true,
          opens: 'center',
          locale: {
              format: 'DD MMM YYYY',
          }
      });

//    document.getElementById("radio_passenger_search"+(counter_passenger+1)).onclick = "radio_button('passenger',counter_passenger);"
    counter_passenger++;
    $('select').niceSelect();
    $('#myModalPassenger'+parseInt(parseInt(counter_passenger)-1)).modal('show');
}

function delete_table_of_passenger(){
    if(counter_passenger != 0){
        counter_passenger--;
        var element = document.getElementById('table_passenger'+counter_passenger);
        element.parentNode.removeChild(element);
    }
}

function update_contact(type,val){
    if(type == 'pic'){
        if(document.getElementById('first_name'+val).value != '' && document.getElementById('last_name'+val).value != ''){
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML = document.getElementById('first_name'+val).value + ' ' + document.getElementById('last_name'+val).value;
            document.getElementById('mobile_pax'+parseInt(val-1)).innerHTML = document.getElementById('mobile'+val).value;
            document.getElementById('job_position_pax'+parseInt(val-1)).innerHTML = document.getElementById('job_position'+val).value;
        }
    }
}

function set_document_requirement(){
    text='';
    text +=`<h4>List of Document Registration<label style="color:red;"> *</label></h4><hr/>
    <div style="margin-top:15px;">
        <table id="table_of_doc" name="table_of_doc" style="width:100%;" class="list-of-table">
            <tr>
                <th style="width:5%;">No.</th>
                <th style="width:40%;">Type</th>
                <th style="width:35%;">Image</th>
            </tr>
        </table>
    </div>`;
    document.getElementById('list_of_doc').innerHTML = text;
    counter_regis_doc = 0;
//    for(i = counter_regis_doc; i>0; i--){
//        delete_table_of_doc();
//    }
    for(i in requirement_document){
        if(document.getElementById('agent_type').value == requirement_document[i].name){
            for(j in requirement_document[i].docs){
                if(requirement_document[i].docs[j].document_type == 'registration')
                    add_table_of_doc(requirement_document[i].docs[j].display_name);
            }
        }
    }

}

function add_table_of_doc(val){
    text= '';
    var node = document.createElement("tr");
    text += `
        <td>`+(parseInt(counter_regis_doc)+1)+`</td>
        <td>`;
            if(template == 1){
                text+=`
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select">
                    <select name="type_regis_doc`+(parseInt(counter_regis_doc)+1)+`">`;
            }
            else if(template == 2){
                text+=`
                <div class="form-select">
                    <select name="type_regis_doc`+(parseInt(counter_regis_doc)+1)+`">`;
            }
                if(val == 'KTP')
                text+=`<option value="ktp">KTP</option>`;
                else
                text+=`<option disabled value="ktp">KTP</option>`;
                if(val == 'NPWP')
                text+=`<option value="npwp">NPWP</option>`;
                else
                text+=`<option disabled value="npwp">NPWP</option>`;
                if(val == 'SIUP')
                text+=`<option value="siup">SIUP</option>`;
                else
                text+=`<option disabled value="siup">SIUP</option>`;
                text+=`</select>`;
            if(template == 1){
                text+=`
                    </div>
                </div>`;
            }else if(template == 2){
                text+=`</div>`;
            }
            text+=`
        </td>
        <td>`;
            if(template == 1){
                text+=`
                <div class="input-container-search-ticket">
                    <input type="file" class="form-control o_website_form_input" id="resume`+(parseInt(counter_regis_doc)+1)+`" name="Resume`+(parseInt(counter_regis_doc)+1)+`"/>
                </div>`;
            }else if(template == 2){
                text+=`<input type="file" class="o_website_form_input" id="resume`+(parseInt(counter_regis_doc)+1)+`" name="Resume`+(parseInt(counter_regis_doc)+1)+`"/>`;
            }
        text+=`
        </td>`;

    node.innerHTML = text;
    node.setAttribute('id', 'table_of_doc'+counter_regis_doc);
    document.getElementById("table_of_doc").appendChild(node);
    $('select').niceSelect();
    counter_regis_doc++;
}

function delete_table_of_doc(){
    if(counter_regis_doc != 0){
        counter_regis_doc--;
        var element = document.getElementById('table_of_doc'+counter_regis_doc);
        element.parentNode.removeChild(element);
    }
}