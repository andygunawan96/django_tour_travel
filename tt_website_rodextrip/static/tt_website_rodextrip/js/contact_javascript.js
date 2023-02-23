counter_contact = 0;
function add_table_of_contact(data){
    text = '';
    counter_contact = counter_contact + 1;
    var node = document.createElement("div");
    text+=`
        <div class='row' id="contact`+counter_contact+`_id">
            <div class="col-lg-12" style="padding:15px; border-bottom:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-xs-6">
                        <h5>Contact #`+counter_contact+`</h5>
                    </div>
                    <div class="col-xs-6" style="text-align:right;">
                        <button type="button" class="primary-delete-date" onclick="delete_table_of_contact(`+counter_contact+`)">
                            Delete <i class="fa fa-times" style="color:#E92B2B;font-size:20px;"></i>
                        </button>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <div class="input-container-search-ticket" style="display:unset;">
                            <h6 style="margin-bottom:10px;">Select Contact</h6>`;
                            if(template == 1 || template == 2 || template == 6){
                                text+=`<div class="form-select">`;
                            }else if(template == 3){
                                text+=`<div class="default-select">`;
                            }else if(template == 4){
                                text+=`<div class="default-select">`;
                            }else if(template == 5){
                                text+=`<div class="default-select">`;
                            }
                            text+=`
                                <select id="contact_title`+counter_contact+`" name="contact_title`+counter_contact+`" class="nice-select-default">`;
                                var contact_us = ['Just Title','Phone', 'Whatsapp', 'Line', 'Email', 'Telegram', 'Other'];
                                for (i = 0; i < contact_us.length; i++) {
                                    text+=`<option value="`+contact_us[i]+`"`;
                                    if(contact_us[i] == data[0]){
                                        text+=`selected`;
                                    }
                                    text+=`>`+contact_us[i]+`</option>`;
                                }
                                text+=`</select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <h6 style="margin-bottom:10px;">Contact</h6>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="contact_url`+counter_contact+`" id="contact_url`+counter_contact+`" placeholder="Contact" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Contact '" value="`+data[1]+`">
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <h6 style="margin-bottom:10px;">Display Name</h6>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="contact_name`+counter_contact+`" id="contact_name`+counter_contact+`" placeholder="Display Contact Name" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Contact Name'" value="`+data[2]+`">
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    node.innerHTML = text;
    document.getElementById("contact_div").appendChild(node);
    $('#contact_title'+counter_contact).niceSelect();
}

function delete_table_of_contact(val){
    try{
        document.getElementById(`contact`+val+`_id`).remove();
    }catch(err){
        console.log(err);
        try{
            document.getElementById(`contact`+val+`_id`).remove();
        }catch(err){
            console.log(err);
        }
    }
}

function get_contact(type){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_contact_url',
       },
       data: {},
       success: function(msg) {
            if(type == 'setting'){
                document.getElementById("contact_div").innerHTML = '';
                counter_contact = 0;
                for(i in msg){
                    add_table_of_contact(msg[i]);
                }
            }else if(type == 'footer'){
                text = '';
                if (typeof $check_get_cs === 'undefined'){
                    if(msg.length != 0){
                        if(template == 1){
                            text+=`<hr/><h6 style="color:black">Contact us</h6>`;
                        }else if(template == 2){
                            text+=`<hr/><h6 class="widget-title" style="color:black">Contact us</h6>`;
                        }else if(template == 3){
                            text+=`<hr/><h6 class="widget-title" style="color:black">Contact us</h6>`;
                        }else if(template == 4){
                            text+=`<hr/><h2 class="footer-heading mb-4" style="color:black;">Contact Us</h2>`;
                        }else if(template == 5){
                            text+=`<hr/><h4 style="color:black;" class="mb-4">Contact Us</h4>`;
                        }else if(template == 6){
                            text+=`<h4 style="color:black; margin-bottom:15px;">Contact Us</h4>`;
                        }
                    }
                    title_check_contact = 0;
                    for(i in msg){
                        if(template == 6){
                            text += `<li>`;
                        }else{
                            text += `<div style="margin-bottom:10px;">`;
                        }

                        if(msg[i][0] == "Just Title"){
                            if(title_check_contact == 0){
                                text+=`<h5 style="border-bottom:1px solid #cdcdcd; color:black;">`;
                                title_check_contact = 1;
                            }else{
                                text+=`<h5 style="margin-top:15px; border-bottom:1px solid #cdcdcd; color:black;">`;
                            }

                            text+=`
                                <img style="height:30px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/office.png" alt="Office"/>
                                `+msg[i][1]+`
                            </h5>`;
                        }else if(msg[i][0] == "Phone"){
                            text += `
                            <a href="tel:`+msg[i][1]+`" style="font-weight:bold; margin-bottom:10px;" target="_blank">
                                <img style="height:30px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/phone.png" alt="Phone"/>`+msg[i][0]+`
                            </a>
                            <b style="padding-left:10px;">`+msg[i][2]+`</b>`;
                        }else if(msg[i][0] == "Whatsapp"){
                            text += `
                            <a href="https://wa.me/`+msg[i][1]+`" style="font-weight:bold;" target="_blank">
                                <img style="height:33px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/whatsappic.png" alt="Whatsapp"/>`+msg[i][0]+`
                            </a>
                            <b style="padding-left:10px;">`+msg[i][2]+`</b>`;
                        }else if(msg[i][0] == "Line"){
                            text+=`
                            <img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/>
                            <b style="padding-right:10px;">`+msg[i][2]+`</b>
                            <div class="line-it-button" data-lang="en" data-type="friend" data-lineid="`+msg[i][1]+`" style="display: none;">
                                `+msg[i][0]+`
                            </div>`;
                        }else if(msg[i][0] == "Telegram"){
                            text += `
                            <a href="https://t.me/`+msg[i][1]+`" style="font-weight:bold;" target="_blank">
                                <img style="height:30px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/>
                                `+msg[i][0]+`
                            </a>
                            <b style="padding-left:10px;">`+msg[i][2]+`</b>`;
                        }else if(msg[i][0] == "Email"){
                            text += `
                            <a href="mailto:`+msg[i][1]+`" style="font-weight:bold;" target="_blank">
                                <img style="height:30px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/>
                                `+msg[i][0]+`
                            </a>
                            <b style="padding-left:10px;">`+msg[i][2]+`</b>`;
                        }else if(msg[i][0] == "Other"){
                            text+=`<img style="height:30px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/other.png" alt="Other"/>`;
                        }

                        if(template == 6){
                            text += `</li><br/>`;
                        }else{
                            text += `</div>`;
                        }
                    }
                }
                document.getElementById('contact_footer_div').innerHTML = text;
            }else if(type == 'page'){
                text = '';
                if(msg.length != 0){
                    text+=`<div class="col-lg-12 mt-4 text-center"><h4 style="color:black;">Or you can contact us on</h4><br/></div>`;
                }
                for(i in msg){
                    text += `<div class="col-sm-6 col-md-6 col-lg-6 mb-3"><div style="height:80px; border: 1px solid #cdcdcd; padding:15px; border-radius:7px;">`;
                    if(msg[i][0] == "Phone"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/phone.png" alt="Phone"/><span style="position:absolute;">`;
                        text+=``+msg[i][0]+``;
                        if(msg[i][2] != ''){
                            text+=`<br/><b>`+msg[i][2]+`: </b>`;
                        }
                        text+=`<a href="`+msg[i][1]+`" target="_blank">`+msg[i][1]+`</a></span>`;
                    }else if(msg[i][0] == "Whatsapp"){
                        text+=`<img style="margin-bottom:10px; height:43px; width:auto; padding-right:5px;" src="/static/tt_website_rodextrip/img/whatsappic.png" alt="Whatsapp"/><span style="position:absolute;">`;
                        text+=``+msg[i][0]+``;
                        if(msg[i][2] != ''){
                            text+=`<br/><b>`+msg[i][2]+`: </b>`;
                        }
                        text+=`<a href="https://wa.me/`+msg[i][1]+`" target="_blank">`+msg[i][1]+`</a></span>`;
                    }else if(msg[i][0] == "Line"){
                        text+=`<img style="margin-bottom:10px; height:43px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/><span style="position:absolute;">`;
                        text+=``+msg[i][0]+``;
                        if(msg[i][2] != ''){
                            text+=`<br/><b>`+msg[i][2]+`: </b>`;
                        }
                        text+=`<div class="line-it-button" data-lang="en" data-type="friend" data-lineid="`+msg[i][1]+`" style="display: none;">`+msg[i][0]+`</div></span>`;
                    }else if(msg[i][0] == "Telegram"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/><span style="position:absolute;">`;
                        text+=``+msg[i][0]+``;
                        if(msg[i][2] != ''){
                            text+=`<br/><b>`+msg[i][2]+`: </b>`;
                        }
                        text+=`<a href="https://t.me/`+msg[i][1]+`" target="_blank">`+msg[i][1]+`</a></span>`;
                    }else if(msg[i][0] == "Email"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/><span style="position:absolute;">`;
                        text+=``+msg[i][0]+``;
                        if(msg[i][2] != ''){
                            text+=`<br/><b>`+msg[i][2]+`: </b>`;
                        }
                        text+=`<a href="mailto:`+msg[i][1]+`" target="_blank">`+msg[i][1]+`</a></span>`;
                    }else if(msg[i][0] == "Other"){
                        text+=`<img style="margin-bottom:10px; height:40px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/other.png" alt="Other"/><span style="position:absolute;">`;
                        text+=``+msg[i][0]+``;
                        if(msg[i][2] != ''){
                            text+=`<br/><b>`+msg[i][2]+`: </b>`;
                        }
                        text+=``+msg[i][1]+`</span>`;
                    }
                    text+=`</div></div><br/>`;
                }
                document.getElementById('contact_page_div').innerHTML = text;
            }else if(type == 'login'){
                text = '';
                if(msg.length != 0){
                    text+=`<hr/><h4 style="color:black;">Contact Us</h4>`;
                }
                for(i in msg){
                    if(msg[i][0] == "Phone"){
                        text+=`<a href="`+msg[i][1]+`" target="_blank"><img style="height:30px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/phone.png" alt="Phone"/><span style="position:absolute;">`;
                        text+=`</span></a>`;
                    }else if(msg[i][0] == "Whatsapp"){
                        text+=`<a href="https://wa.me/`+msg[i][1]+`" target="_blank"><img style="height:33px; width:auto; padding-right:5px;" src="/static/tt_website_rodextrip/img/whatsappic.png" alt="Whatsapp"/><span style="position:absolute;">`;
                        text+=`</span></a>`;
                    }else if(msg[i][0] == "Line"){
                        text+=`<div style="padding-top:5px; display:inline-block;"><div class="line-it-button" data-lang="en" data-type="friend" data-lineid="`+msg[i][1]+`" style="display: none;"><img style="height:41px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/><span style="position:absolute;">`;
                        text+=`</span></div></div>`;
                    }else if(msg[i][0] == "Telegram"){
                        text+=`<img style="height:30px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/><span style="position:absolute;">`;
                        text+=`<a href="https://t.me/`+msg[i][1]+`" target="_blank">`+msg[i][1]+`</a></span>`;
                    }else if(msg[i][0] == "Email"){
                        text+=`<img style="height:30px; width:auto; padding-right:10px;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/><span style="position:absolute;">`;
                        text+=`<a href="mailto:`+msg[i][1]+`" target="_blank">`+msg[i][1]+`</a></span>`;
                    }
                    else if(msg[i][0] == "Other"){
                        text+=`<img style="height:30px; width:auto; padding-left:10px; padding-right:10px;" src="/static/tt_website_rodextrip/img/other.png" alt="Other"/><span style="position:absolute; padding-top:10px;">`;
                        text+=``+msg[i][1]+`</span>`;
                    }
                }
                document.getElementById('contact_login_div').innerHTML += text;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get contact url');
       },timeout: 60000
    });
}

function save_contact(){
    data = [];
    for(i=1;i<=counter_contact;i++){
        try{
            data.push([document.getElementById('contact_title'+i).value,document.getElementById('contact_url'+i).value, document.getElementById('contact_name'+i).value]);
        }catch(err){
            console.log(err);
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'set_contact_url',
       },
       data: {
            'data': JSON.stringify(data)
       },
       success: function(msg) {
            get_contact('setting');
            get_contact('footer');
            Swal.fire({
              type: 'success',
              title: 'Update',
              text: 'Contact update!'
            })
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error save contact');
       },timeout: 60000
    });
}