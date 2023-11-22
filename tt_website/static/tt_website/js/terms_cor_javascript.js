function update_term_and_condition_cor(){
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


    var formData = new FormData($('#form_admin').get(0));
    formData.append('body', JSON.stringify(CKEDITOR.instances.term_and_condition_body_cor.getData()));
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'set_term_and_condition_cor',
       },
       data: formData,
       success: function(msg) {
            if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Update!',
                })
                location.reload();
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
       contentType:false,
       processData:false,
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error save Term and Condition');
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
    });

}

function get_term_and_condition_cor(type){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_term_and_condition_cor',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0){
                if(msg.result.response.length != 0){
                    if(type == 'admin'){
                        CKEDITOR.instances.term_and_condition_body_cor.setData(msg.result.response[0].body);
                    }else if(type == 'registration'){
                        document.getElementById('terms_body_cor').innerHTML = msg.result.response[0].body;
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Error get privacy policy');
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get privacy policy');
       }
    });
}

function cor_update_image(data, id){
    document.getElementById(id+'_div').hidden = false;
    document.getElementById(id+'_img').src = data;
}



function cor_db_overlay_bar_confirmation(){
    Swal.fire({
      title: 'Close?',
      html: '<h4 style="color:red;">All data that you have filled in will be deleted.<h4/>',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            on_off_overlay_bar('box-cor-db', 'overlay_box_cor_db');
//            clear_create_search_passenger_db();
        }
    })
}

function create_request_cor(){
    data_request = {};
    error_log = '';
    var formData = new FormData($('#form_identity_cor').get(0));
    formData.append('signature', signature)
    // company
    if(document.getElementById('company_name').value == ''){
        error_log+= 'Please input Company Name!</br>\n';
        document.getElementById('company_name').style['border-color'] = 'red';
        $("#company_name").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_name'] = document.getElementById('company_name').value;
        document.getElementById('company_name').style['border-color'] = '';
    }
    if(document.getElementById('company_address').value == ''){
        error_log+= 'Please input Company Address!</br>\n';
        document.getElementById('company_address').style['border-color'] = 'red';
        $("#company_address").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_address'] = document.getElementById('company_address').value;
        document.getElementById('company_address').style['border-color'] = '';
    }
    if(document.getElementById('company_property').value == ''){
        error_log+= 'Please choose Company Property!</br>\n';
        document.getElementById('company_property').style['border-color'] = 'red';
        $("#company_property").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_property'] = document.getElementById('company_property').value;
        document.getElementById('company_property').style['border-color'] = '';
    }
    if(document.getElementById('company_occupied').value == ''){
        error_log+= 'Please input Company Occupied!</br>\n';
        document.getElementById('company_occupied').style['border-color'] = 'red';
        $("#company_occupied").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_occupied'] = document.getElementById('company_occupied').value;
        document.getElementById('company_occupied').style['border-color'] = '';
    }
    if(document.getElementById('company_phone_number').value == ''){
        error_log+= 'Please input Company Phone Number!</br>\n';
        document.getElementById('company_phone_number').style['border-color'] = 'red';
        $("#company_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_number(document.getElementById('company_phone_number').value) == false){
        error_log+= 'Invalid Company Phone Number!</br>\n';
        document.getElementById('company_phone_number').style['border-color'] = 'red';
        $("#company_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_phone'] = {
            "calling_number": document.getElementById('company_phone_number').value,
            "calling_code": document.getElementById('company_phone_code_id').value
        }
        document.getElementById('company_phone_number').style['border-color'] = '';
    }
    if(document.getElementById('company_email').value == ''){
        error_log+= 'Please input Company Email!</br>\n';
        document.getElementById('company_email').style['border-color'] = 'red';
        $("#company_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_email(document.getElementById('company_email').value) == false){
        error_log+= 'Invalid Company Email!</br>\n';
        document.getElementById('company_email').style['border-color'] = 'red';
        $("#company_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_email'] = document.getElementById('company_email').value;
        document.getElementById('company_email').style['border-color'] = '';
    }
    if(document.getElementById('company_established_date').value == ''){
        error_log+= 'Please input Company Established Date!</br>\n';
        document.getElementById('company_established_date').style['border-color'] = 'red';
        $("#company_established_date").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_established_date'] = document.getElementById('company_established_date').value;
        document.getElementById('company_established_date').style['border-color'] = '';
    }
    if(document.getElementById('company_worker').value == ''){
        error_log+= 'Please input how many worker in Company!</br>\n';
        document.getElementById('company_worker').style['border-color'] = 'red';
        $("#company_worker").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_worker'] = document.getElementById('company_worker').value;
        document.getElementById('company_worker').style['border-color'] = '';
    }
    if(document.getElementById('company_group').value == ''){
        error_log+= 'Please input Company Affiliate or Group!</br>\n';
        document.getElementById('company_group').style['border-color'] = 'red';
        $("#company_group").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_group'] = document.getElementById('company_group').value;
        document.getElementById('company_group').style['border-color'] = '';
    }
    if(document.getElementById('company_business_field').value == ''){
        error_log+= 'Please input Company Business Field!</br>\n';
        document.getElementById('company_business_field').style['border-color'] = 'red';
        $("#company_business_field").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_business_field'] = document.getElementById('company_business_field').value;
        document.getElementById('company_business_field').style['border-color'] = '';
    }
    if(document.getElementById('company_bank_data').value == ''){
        error_log+= 'Please input Company Bank Data!</br>\n';
        document.getElementById('company_bank_data').style['border-color'] = 'red';
        $("#company_bank_data").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_bank_data'] = document.getElementById('company_bank_data').value;
        document.getElementById('company_bank_data').style['border-color'] = '';
    }

    if(document.getElementById("company_structure").files.length == 0 ){
        error_log+= 'Please upload Company Structure!</br>\n';
        document.getElementById('company_structure').style['border-color'] = 'red';
    }else{
        document.getElementById('company_structure').style['border-color'] = '';
    }
    if(document.getElementById("company_npwp").files.length == 0 ){
        error_log+= 'Please upload Company NPWP!</br>\n';
        document.getElementById('company_npwp').style['border-color'] = 'red';
    }else{
        document.getElementById('company_npwp').style['border-color'] = '';
    }
    if(document.getElementById("company_siup_nib").files.length == 0 ){
        error_log+= 'Please upload Company SIUP/NIB!</br>\n';
        document.getElementById('company_siup_nib').style['border-color'] = 'red';
    }else{
        document.getElementById('company_siup_nib').style['border-color'] = '';
    }
    if(document.getElementById("company_akta_pendirian").files.length == 0 ){
        error_log+= 'Please upload Company Akta Pendirian!</br>\n';
        document.getElementById('company_akta_pendirian').style['border-color'] = 'red';
    }else{
        document.getElementById('company_akta_pendirian').style['border-color'] = '';
    }

    if(document.getElementById('company_how_to_know_us').value == ''){
        error_log+= 'Please input How do you know us!</br>\n';
        document.getElementById('company_how_to_know_us').style['border-color'] = 'red';
        $("#company_how_to_know_us").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['company_how_to_know_us'] = document.getElementById('company_how_to_know_us').value;
        document.getElementById('company_how_to_know_us').style['border-color'] = '';
    }

    // owner
    if(document.getElementById('owner_name').value == ''){
        error_log+= 'Please input Owner Name!</br>\n';
        document.getElementById('owner_name').style['border-color'] = 'red';
        $("#owner_name").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['owner_name'] = document.getElementById('owner_name').value;
        document.getElementById('owner_name').style['border-color'] = '';
    }
    if(document.getElementById('owner_position').value == ''){
        error_log+= 'Please input Owner Position!</br>\n';
        document.getElementById('owner_position').style['border-color'] = 'red';
        $("#owner_position").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['owner_position'] = document.getElementById('owner_position').value;
        document.getElementById('owner_position').style['border-color'] = '';
    }
    if(document.getElementById('owner_birth_date').value == ''){
        error_log+= 'Please input Owner Birth Date!</br>\n';
        document.getElementById('owner_birth_date').style['border-color'] = 'red';
        $("#owner_birth_date").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['owner_birth_date'] = document.getElementById('owner_birth_date').value;
        document.getElementById('owner_birth_date').style['border-color'] = '';
    }
    if(document.getElementById('owner_phone_number').value == ''){
        error_log+= 'Please input Owner Phone Number!</br>\n';
        document.getElementById('owner_phone_number').style['border-color'] = 'red';
        $("#owner_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_number(document.getElementById('owner_phone_number').value) == false){
        error_log+= 'Invalid Owner Phone Number!</br>\n';
        document.getElementById('owner_phone_number').style['border-color'] = 'red';
        $("#owner_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['owner_phone'] = {
            "calling_number": document.getElementById('owner_phone_number').value,
            "calling_code": document.getElementById('owner_phone_code_id').value
        }
        document.getElementById('owner_phone_number').style['border-color'] = '';
    }
    if(document.getElementById('owner_email').value == ''){
        error_log+= 'Please input Owner Email!</br>\n';
        document.getElementById('owner_email').style['border-color'] = 'red';
        $("#owner_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_email(document.getElementById('owner_email').value) == false){
        error_log+= 'Invalid Owner Email!</br>\n';
        document.getElementById('owner_email').style['border-color'] = 'red';
        $("#owner_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['owner_email'] = document.getElementById('owner_email').value;
        document.getElementById('owner_email').style['border-color'] = '';
    }

    if(document.getElementById("owner_ktp").files.length == 0 ){
        error_log+= 'Please upload Owner KTP!</br>\n';
        document.getElementById('owner_ktp').style['border-color'] = 'red';
    }else{
        document.getElementById('owner_ktp').style['border-color'] = '';
    }

    // director
    if(document.getElementById('director_name').value == ''){
        error_log+= 'Please input Director Name!</br>\n';
        document.getElementById('director_name').style['border-color'] = 'red';
        $("#director_name").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['director_name'] = document.getElementById('director_name').value;
        document.getElementById('director_name').style['border-color'] = '';
    }
    if(document.getElementById('director_position').value == ''){
        error_log+= 'Please input Director Position!</br>\n';
        document.getElementById('director_position').style['border-color'] = 'red';
        $("#director_position").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['director_position'] = document.getElementById('director_position').value;
        document.getElementById('director_position').style['border-color'] = '';
    }
    if(document.getElementById('director_birth_date').value == ''){
        error_log+= 'Please input Director Birth Date!</br>\n';
        document.getElementById('director_birth_date').style['border-color'] = 'red';
        $("#owner_birth_date").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['director_birth_date'] = document.getElementById('director_birth_date').value;
        document.getElementById('director_birth_date').style['border-color'] = '';
    }
    if(document.getElementById('director_phone_number').value == ''){
        error_log+= 'Please input Director Phone Number!</br>\n';
        document.getElementById('director_phone_number').style['border-color'] = 'red';
        $("#director_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_number(document.getElementById('director_phone_number').value) == false){
        error_log+= 'Invalid Director Phone Number!</br>\n';
        document.getElementById('director_phone_number').style['border-color'] = 'red';
        $("#director_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['director_phone'] = {
            "calling_number": document.getElementById('director_phone_number').value,
            "calling_code": document.getElementById('director_phone_code_id').value
        }
        document.getElementById('director_phone_number').style['border-color'] = '';
    }
    if(document.getElementById('director_email').value == ''){
        error_log+= 'Please input Director Email!</br>\n';
        document.getElementById('director_email').style['border-color'] = 'red';
        $("#director_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['director_email'] = document.getElementById('director_email').value;
        document.getElementById('director_email').style['border-color'] = '';
    }

    // accounting
    if(document.getElementById('accounting_name').value == ''){
        error_log+= 'Please input Accounting Name!</br>\n';
        document.getElementById('accounting_name').style['border-color'] = 'red';
        $("#accounting_name").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['accounting_name'] = document.getElementById('accounting_name').value;
        document.getElementById('accounting_name').style['border-color'] = '';
    }
    if(document.getElementById('accounting_position').value == ''){
        error_log+= 'Please input Accounting Position!</br>\n';
        document.getElementById('accounting_position').style['border-color'] = 'red';
        $("#accounting_position").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['accounting_position'] = document.getElementById('accounting_position').value;
        document.getElementById('accounting_position').style['border-color'] = '';
    }
    if(document.getElementById('accounting_birth_date').value == ''){
        error_log+= 'Please input Accounting Birth Date!</br>\n';
        document.getElementById('accounting_birth_date').style['border-color'] = 'red';
        $("#accounting_birth_date").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['accounting_birth_date'] = document.getElementById('accounting_birth_date').value;
        document.getElementById('accounting_birth_date').style['border-color'] = '';
    }
    if(document.getElementById('accounting_phone_number').value == ''){
        error_log+= 'Please input Accounting Phone Number!</br>\n';
        document.getElementById('accounting_phone_number').style['border-color'] = 'red';
        $("#accounting_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_number(document.getElementById('accounting_phone_number').value) == false){
        error_log+= 'Invalid Accounting Phone Number!</br>\n';
        document.getElementById('accounting_phone_number').style['border-color'] = 'red';
        $("#accounting_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['accounting_phone'] = {
            "calling_number": document.getElementById('accounting_phone_number').value,
            "calling_code": document.getElementById('accounting_phone_code_id').value
        }
        document.getElementById('accounting_phone_number').style['border-color'] = '';
    }
    if(document.getElementById('accounting_email').value == ''){
        error_log+= 'Please input Accounting Email!</br>\n';
        document.getElementById('accounting_email').style['border-color'] = 'red';
        $("#accounting_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_email(document.getElementById('accounting_email').value) == false){
        error_log+= 'Invalid Accounting Email!</br>\n';
        document.getElementById('accounting_email').style['border-color'] = 'red';
        $("#accounting_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['accounting_email'] = document.getElementById('accounting_email').value;
        document.getElementById('accounting_email').style['border-color'] = '';
    }

    if( document.getElementById("accounting_ktp").files.length == 0 ){
        error_log+= 'Please upload Accounting KTP!</br>\n';
        document.getElementById('accounting_ktp').style['border-color'] = 'red';
    }else{
        document.getElementById('accounting_ktp').style['border-color'] = '';
    }

    // pic
    if(document.getElementById('pic_title').value == ''){
        error_log+= 'Please choose PIC Title Property!</br>\n';
        document.getElementById('pic_title').style['border-color'] = 'red';
        $("#pic_title").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['pic_title'] = document.getElementById('pic_title').value;
        document.getElementById('pic_title').style['border-color'] = '';
    }
    if(document.getElementById('pic_first_name').value == ''){
        error_log+= 'Please input PIC First Name!</br>\n';
        document.getElementById('pic_first_name').style['border-color'] = 'red';
        $("#pic_first_name").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['pic_first_name'] = document.getElementById('pic_first_name').value;
        document.getElementById('pic_first_name').style['border-color'] = '';
    }
    if(document.getElementById('pic_last_name').value != ''){
        data_request['pic_last_name'] = document.getElementById('pic_last_name').value;
        document.getElementById('pic_last_name').style['border-color'] = '';
    }
    if(document.getElementById('pic_position').value == ''){
        error_log+= 'Please input PIC Position!</br>\n';
        document.getElementById('pic_position').style['border-color'] = 'red';
        $("#pic_position").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['pic_position'] = document.getElementById('pic_position').value;
        document.getElementById('pic_position').style['border-color'] = '';
    }
    if(document.getElementById('pic_birth_date').value == ''){
        error_log+= 'Please input PIC Birth Date!</br>\n';
        document.getElementById('pic_birth_date').style['border-color'] = 'red';
        $("#pic_birth_date").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['pic_birth_date'] = document.getElementById('pic_birth_date').value;
        document.getElementById('pic_birth_date').style['border-color'] = '';
    }
    if(document.getElementById('pic_phone_number').value == ''){
        error_log+= 'Please input PIC Phone Number!</br>\n';
        document.getElementById('pic_phone_number').style['border-color'] = 'red';
        $("#pic_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_number(document.getElementById('pic_phone_number').value) == false){
        error_log+= 'Invalid PIC Phone Number!</br>\n';
        document.getElementById('pic_phone_number').style['border-color'] = 'red';
        $("#pic_phone_number").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['pic_phone'] = {
            "calling_number": document.getElementById('pic_phone_number').value,
            "calling_code": document.getElementById('pic_phone_code_id').value
        }
        document.getElementById('pic_phone_number').style['border-color'] = '';
    }
    if(document.getElementById('pic_email').value == ''){
        error_log+= 'Please input PIC Email!</br>\n';
        document.getElementById('pic_email').style['border-color'] = 'red';
        $("#pic_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else if(check_email(document.getElementById('pic_email').value) == false){
        error_log+= 'Invalid PIC Email!</br>\n';
        document.getElementById('pic_email').style['border-color'] = 'red';
        $("#pic_email").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        data_request['pic_email'] = document.getElementById('pic_email').value;
        document.getElementById('pic_email').style['border-color'] = '';
    }

    if(document.getElementById("pic_ktp").files.length == 0 ){
        error_log+= 'Please upload PIC KTP!</br>\n';
        document.getElementById('pic_ktp').style['border-color'] = 'red';
    }else{
        document.getElementById('pic_ktp').style['border-color'] = '';
    }

    var radios = document.getElementsByName('myRadios_account');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            if(radios[j].value == 'no')
                data_request['account_web'] = false;
            else if(radios[j].value == 'yes')
                data_request['account_web'] = true;
            break;
        }
    }
    data_request['airline'] = [];
    for(i in airline_provider_list){
        if(document.getElementById('provider_box_cor_'+i) && document.getElementById('provider_box_cor_'+i).checked){
            data_request['airline'].push(i);
        }
    }

    if(document.getElementById('proposed_limit').value == ''){
        error_log+= 'Please input Proposed Limit!</br>\n';
        document.getElementById('proposed_limit').style['border-color'] = 'red';
    }else{
        data_request['proposed_limit'] = document.getElementById('proposed_limit').value;
        document.getElementById('proposed_limit').style['border-color'] = '';
    }


    data_request['pay_day'] = [];
    if(document.getElementById('pay_day_monday') && document.getElementById('pay_day_monday').checked){
        data_request['pay_day'].push('monday');
    }
    if(document.getElementById('pay_day_tuesday') && document.getElementById('pay_day_tuesday').checked){
        data_request['pay_day'].push('tuesday');
    }
    if(document.getElementById('pay_day_wednesday') && document.getElementById('pay_day_wednesday').checked){
        data_request['pay_day'].push('wednesday');
    }
    if(document.getElementById('pay_day_thursday') && document.getElementById('pay_day_thursday').checked){
        data_request['pay_day'].push('thursday');
    }
    if(document.getElementById('pay_day_friday') && document.getElementById('pay_day_friday').checked){
        data_request['pay_day'].push('friday');
    }
    if(document.getElementById('pay_day_saturday') && document.getElementById('pay_day_saturday').checked){
        data_request['pay_day'].push('saturday');
    }
    if(document.getElementById('pay_day_sunday') && document.getElementById('pay_day_sunday').checked){
        data_request['pay_day'].push('sunday');
    }

    if(data_request['pay_day'].length == 0){
        error_log+= 'Please choose Pay Day!</br>\n';
    }

    data_request['pay_time_top'] = [];
    if(document.getElementById('pay_time_top1') && document.getElementById('pay_time_top1').checked){
        data_request['pay_time_top'].push('TOP 1 (5 calendar days)');
    }
    if(document.getElementById('pay_time_top2') && document.getElementById('pay_time_top2').checked){
        data_request['pay_time_top'].push('TOP 2 (7 calendar days)');
    }

    if(data_request['pay_time_top'].length == 0){
        error_log+= 'Please choose Pay Time!</br>\n';
    }

    if(document.getElementById("statement_letter").files.length == 0 ){
        error_log+= 'Please upload Statement Letter!</br>\n';
        document.getElementById('statement_letter').style['border-color'] = 'red';
    }else{
        document.getElementById('statement_letter').style['border-color'] = '';
    }

    if(!document.getElementById('cor_tac').checked){
        error_log+= 'Please check Term and Conditions!</br>\n';
        document.getElementById('cor_tac').style['border-color'] = 'red';
    }else{
        data_request['cor_tac'] = document.getElementById('cor_tac').checked;
        document.getElementById('cor_tac').style['border-color'] = '';
    }
    var canvas = document.getElementById("sig-canvas");
    var dataUrl = canvas.toDataURL();
    if(dataUrl == 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACgCAYAAAC2eFFiAAAAAXNSR0IArs4c6QAABKtJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIPBfEAoeZvv+sAAAAASUVORK5CYII='){
        error_log+= 'Please input Signature!</br>\n';
        canvas.style['border-color'] = 'red';
    }else{
        canvas.style['border-color'] = '';
        data_request['img_signature'] = {
            "file_name": 'Signature.png',
            "file": dataUrl.split(',')[1]
        }
    }

    if(error_log == ''){
        formData.append('data', JSON.stringify(data_request));
        document.getElementById('create_request_cor_btn').disabled = true;
        $.ajax({
           type: "POST",
           url: "/webservice/agent",
           headers:{
                'action': 'create_request_cor',
           },
           data: formData,
           success: function(msg) {
                if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      html: 'Success',
                    })
                    // clear data
                    clear_request_cor();
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                    })
                }
                document.getElementById('create_request_cor_btn').disabled = false;
           },
           contentType:false,
           processData:false,
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update passenger');
           },

        });
    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: error_log,
        })
    }
}

function clear_request_cor(){
    document.getElementById('company_name').value = '';
    document.getElementById('company_address').value = '';
    document.getElementById('company_property').value = '';
    // nice select update
    $('#company_property').niceSelect('update');
    document.getElementById('company_occupied').value = '';
    document.getElementById('company_phone_number').value = '';
    document.getElementById('company_email').value = '';
    document.getElementById('company_established_date').value = '';
    document.getElementById('company_worker').value = '';
    document.getElementById('company_group').value = '';
    document.getElementById('company_business_field').value = '';
    document.getElementById('company_bank_data').value = '';
    document.getElementById('company_structure').value = '';
    document.getElementById('company_npwp').value = '';
    document.getElementById('company_siup_nib').value = '';
    document.getElementById('company_akta_pendirian').value = '';
    document.getElementById('company_how_to_know_us').value = '';

    document.getElementById('owner_name').value = '';
    document.getElementById('owner_position').value = '';
    document.getElementById('owner_birth_date').value = '';
    document.getElementById('owner_phone_number').value = '';
    document.getElementById('owner_email').value = '';
    document.getElementById('owner_ktp').value = '';

    document.getElementById('director_name').value = '';
    document.getElementById('director_position').value = '';
    document.getElementById('director_birth_date').value = '';
    document.getElementById('director_phone_number').value = '';
    document.getElementById('director_email').value = '';

    document.getElementById('accounting_name').value = '';
    document.getElementById('accounting_position').value = '';
    document.getElementById('accounting_birth_date').value = '';
    document.getElementById('accounting_phone_number').value = '';
    document.getElementById('accounting_email').value = '';
    document.getElementById('accounting_ktp').value = '';

    document.getElementById('pic_title').value = '';
    $('#pic_title').niceSelect('update');
    document.getElementById('pic_first_name').value = '';
    document.getElementById('pic_last_name').value = '';
    document.getElementById('pic_position').value = '';
    document.getElementById('pic_birth_date').value = '';
    document.getElementById('pic_phone_number').value = '';
    document.getElementById('pic_email').value = '';
    document.getElementById('proposed_limit').value = '';
    document.getElementById('pic_ktp').value = '';
    var radios = document.getElementsByName('myRadios_account')[0].checked = 'checked';

    // checkbox airline
    for(i in airline_provider_list){
        if(document.getElementById('provider_box_cor_'+i) && document.getElementById('provider_box_cor_'+i).checked){
            document.getElementById('provider_box_cor_'+i).checked = false;
        }
    }

    if(document.getElementById('pay_day_monday') && document.getElementById('pay_day_monday').checked){
        document.getElementById('pay_day_monday').checked = false;
    }
    if(document.getElementById('pay_day_tuesday') && document.getElementById('pay_day_tuesday').checked){
        document.getElementById('pay_day_tuesday').checked = false;
    }
    if(document.getElementById('pay_day_wednesday') && document.getElementById('pay_day_wednesday').checked){
        document.getElementById('pay_day_wednesday').checked = false;
    }
    if(document.getElementById('pay_day_thursday') && document.getElementById('pay_day_thursday').checked){
        document.getElementById('pay_day_thursday').checked = false;
    }
    if(document.getElementById('pay_day_friday') && document.getElementById('pay_day_friday').checked){
        document.getElementById('pay_day_friday').checked = false;
    }
    if(document.getElementById('pay_day_saturday') && document.getElementById('pay_day_saturday').checked){
        document.getElementById('pay_day_saturday').checked = false;
    }
    if(document.getElementById('pay_day_sunday') && document.getElementById('pay_day_sunday').checked){
        document.getElementById('pay_day_sunday').checked = false;
    }

    if(document.getElementById('pay_time_top1') && document.getElementById('pay_time_top1').checked){
        document.getElementById('pay_time_top1').checked = false;
    }
    if(document.getElementById('pay_time_top2') && document.getElementById('pay_time_top2').checked){
        document.getElementById('pay_time_top2').checked = false;
    }


    $('input[name="company_established_date"]').val("");
    $('input[name="owner_birth_date"]').val("");
    $('input[name="director_birth_date"]').val("");
    $('input[name="accounting_birth_date"]').val("");
    $('input[name="pic_birth_date"]').val("");


    document.getElementById('company_structure_div').hidden = true;
    document.getElementById('company_structure_img').src = "";
    document.getElementById('company_npwp_div').hidden = true;
    document.getElementById('company_npwp_img').src = "";
    document.getElementById('company_siup_nib_div').hidden = true;
    document.getElementById('company_siup_nib_img').src = "";
    document.getElementById('company_akta_pendirian_div').hidden = true;
    document.getElementById('company_akta_pendirian_img').src = "";
    document.getElementById('owner_ktp_div').hidden = true;
    document.getElementById('owner_ktp_img').src = "";
    document.getElementById('accounting_ktp_div').hidden = true;
    document.getElementById('accounting_ktp_img').src = "";
    document.getElementById('pic_ktp_div').hidden = true;
    document.getElementById('pic_ktp_img').src = "";
    document.getElementById('statement_letter_div').hidden = true;
    document.getElementById('statement_letter_img').src = "";
    document.getElementById('cor_tac').checked = true;

    try{
        var sigImage = document.getElementById("sig-image");
        var canvas = document.getElementById("sig-canvas");
        canvas.width = canvas.width;
        sigImage.setAttribute("src", "");
    }catch(err){
        console.log(err);
    }
}