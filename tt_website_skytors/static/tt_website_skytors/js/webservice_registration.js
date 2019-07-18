function submit_agent_registration(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/registration",
       headers:{
            'action': 'agent_registration',
       },
       data: {

       },
       success: function(msg) {
            $("#result_data_id").html(msg.result.response);
            console.log(msg.result);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
            text=  '';
            //company
            for(i in msg.result.response.company_type){
                text+= `<label class="radio-button-custom">
                            <span style="font-size:14px;">`+msg.result.response.company_type[i][1]+`</span>
                            <input type="radio" name="radio_company_type" value="`+msg.result.response.company_type[i][0]+`" onclick="set_company_type();">
                            <span class="checkmark-radio"></span>
                        </label>`;
            }
            document.getElementById('company_type').innerHTML = text;
            //agent type
            text = '<option value="">Agent Type</option>';
            for(i in msg.result.response.agent_type){
//                if(msg.result.response.agent_type[i].is_allow_regis == true)
                text+=`<option value="`+msg.result.response.agent_type[i].name+`">`+msg.result.response.agent_type[i].name+`</option>`;
            }
            document.getElementById('agent_type_id').innerHTML = text;
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function auto_complete(type){
    if(type == 'agent_type'){
        document.getElementById('agent_type').value = document.getElementById('select2-agent_type_id-container').innerHTML;
    }else if(type == 'country'){
        var text = `<option value="" selected="">Cities</option>`;
        var country = {};
        for(i in country_list){
           if(country_list[i].id == parseInt(document.getElementById('country_id').value)){
               country = country_list[i];
               break;
           }
        }
        for(i in country.city){
            text +=`<option value="`+country.city[i].id+`">`+country.city[i].name+`</option>`
        }
        document.getElementById('city_id').innerHTML = text;
        document.getElementById('country').value = document.getElementById('select2-country_id-container').innerHTML;
    }else if(type == 'city'){
        document.getElementById('city').value = document.getElementById('select2-city_id-container').innerHTML;
        console.log(document.getElementById('select2-city_id-container').innerHTML);
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
    console.log(company);
    if(company == 'individual'){
        document.getElementById('company_details').hidden = true;
        document.getElementById('company_details').innerHTML = '';
    }else{
        document.getElementById('company_details').hidden = false;
        text = `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="control-label" for="person_name">Business License<span class="required-txt">* </span></span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control o_website_form_input" id="business_license" name="business_license" required="1"/>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="control-label" for="comp_name">NPWP<span class="required-txt">* </span></span>
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
    if(company == 'individual'){

    }else if(company == 'company'){
        if(document.getElementById('business_license').value == ''){
            error_log+= 'Please fill business license!\n';
            document.getElementById('business_license').style['border-color'] = 'red';
        }else{
            document.getElementById('business_license').style['border-color'] = '#EFEFEF';
        }if(document.getElementById('npwp').value == ''){
            error_log+= 'Please fill NPWP!\n';
            document.getElementById('npwp').style['border-color'] = 'red';
        }else{
            document.getElementById('npwp').style['border-color'] = '#EFEFEF';
        }
    }
    if(document.getElementById('agent_type').value == ''){
        error_log+= 'Please fill agent type!\n';
        document.getElementById('agent_type').style['border-color'] = 'red';
    }else{
        document.getElementById('agent_type').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('person_name').value == ''){
        error_log+= 'Please fill name!\n';
        document.getElementById('person_name').style['border-color'] = 'red';
    }else{
        document.getElementById('person_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('comp_name').value == ''){
        error_log+= 'Please fill company name!\n';
        document.getElementById('comp_name').style['border-color'] = 'red';
    }else{
        document.getElementById('comp_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('birth_date').value == ''){
        error_log+= 'Please fill birth date!\n';
        document.getElementById('birth_date').style['border-color'] = 'red';
    }else{
        document.getElementById('birth_date').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('email').value == ''){
        error_log+= 'Please fill email!\n';
        document.getElementById('email').style['border-color'] = 'red';
    }else{
        document.getElementById('email').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('mobile').value == ''){
        error_log+= 'Please fill mobile!\n';
        document.getElementById('mobile').style['border-color'] = 'red';
    }else{
        document.getElementById('mobile').style['border-color'] = '#EFEFEF';
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
    }if(document.getElementById('city').value == ''){
        error_log+= 'Please fill city!\n';
        document.getElementById('city').style['border-color'] = 'red';
    }else{
        document.getElementById('city').style['border-color'] = '#EFEFEF';
    }if( document.getElementById("resume").files.length == 0 ){
        error_log+= 'Please fill ktp!\n';
        document.getElementById('resume').style['border-color'] = 'red';
    }else{
        document.getElementById('resume').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('tacagree').checked == false){
        error_log+= 'Please fill check term n condition!\n';
        document.getElementById('tacagree').style['border-color'] = 'red';
    }else{
        document.getElementById('tacagree').style['border-color'] = '#EFEFEF';
    }
    if(error_log == ''){
        document.getElementById('agent_registration').submit();
    }else{
        alert(error_log);
    }
}