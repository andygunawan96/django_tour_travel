banner_list = {};
function update_banner(){
//    document.getElementById('update_banner_btn').disabled = true;
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
    formData.append('signature', signature)
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'add_banner',
       },
       data: formData,
       success: function(msg) {
            if(msg.result.error_code == 0){
                set_inactive_delete_banner();
                //document.getElementById('form_admin').submit();
            }else{
//                document.getElementById('update_banner_btn').disabled = false;
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update banner');
//            document.getElementById('update_banner_btn').disabled = false;
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

function set_inactive_delete_banner(){
    img = [];
    //big banner
    try{
        for(i=0; i<1000; i++){
            update = 0;
            if(document.getElementById('big_banner'+i+'_active').checked != banner_list['big_banner'][i].active){
                img.push({
                    'seq_id': document.getElementById('big_banner'+i+'_image').getAttribute('value'),
                    'action': 'active',
                    'type': 'big_banner'
                })
                update = 1
            }if(document.getElementById('big_banner'+i+'_delete').checked == true){
                img.push({
                    'seq_id': document.getElementById('big_banner'+i+'_image').getAttribute('value'),
                    'action': 'delete',
                    'type': 'big_banner'
                })
                update = 1
            }
            if(update == 1){
                img[img.length-1]['url'] = document.getElementById('big_banner'+i+'_image_url_page').value;
                img[img.length-1]['provider_type'] = document.getElementById('big_banner'+i+'_provider_type').value;
                img[img.length-1]['sequence'] = document.getElementById('big_banner'+i+'_sequence').value;
            }else{
                img.push({
                    'seq_id': document.getElementById('big_banner'+i+'_image').getAttribute('value'),
                    'action': '',
                    'type': 'big_banner',
                    'url': document.getElementById('big_banner'+i+'_image_url_page').value,
                    'provider_type': document.getElementById('big_banner'+i+'_provider_type').value,
                    'sequence': document.getElementById('big_banner'+i+'_sequence').value
                })
            }
        }
    }catch(err){

    }
    //small banner
    try{
        for(i=0; i<1000; i++){
            update = 0;
            if(document.getElementById('small_banner'+i+'_active').checked != banner_list['small_banner'][i].active){
                img.push({
                    'seq_id': document.getElementById('small_banner'+i+'_image').getAttribute('value'),
                    'action': 'active',
                    'type': 'small_banner'
                })
                update = 1;
            }if(document.getElementById('small_banner'+i+'_delete').checked == true){
                img.push({
                    'seq_id': document.getElementById('small_banner'+i+'_image').getAttribute('value'),
                    'action': 'delete',
                    'type': 'small_banner'
                })
                update = 1;
            }
            if(update == 1){
                img[img.length-1]['url'] = document.getElementById('small_banner'+i+'_image_url_page').value;
                img[img.length-1]['provider_type'] = document.getElementById('small_banner'+i+'_provider_type').value;
                img[img.length-1]['sequence'] = document.getElementById('small_banner'+i+'_sequence').value;
            }else{
                img.push({
                    'seq_id': document.getElementById('small_banner'+i+'_image').getAttribute('value'),
                    'action': '',
                    'type': 'small_banner',
                    'url': document.getElementById('small_banner'+i+'_image_url_page').value,
                    'provider_type': document.getElementById('small_banner'+i+'_provider_type').value,
                    'sequence': document.getElementById('small_banner'+i+'_sequence').value
                })
            }
        }
    }catch(err){

    }
    //promotion banner
    try{
        for(i=0; i<1000; i++){
            update = 0;
            if(document.getElementById('promotion'+i+'_active').checked != banner_list['promotion'][i].active){
                img.push({
                    'seq_id': document.getElementById('promotion'+i+'_image').getAttribute('value'),
                    'action': 'active',
                    'type': 'promotion_banner'
                })
                update = 1;
            }if(document.getElementById('promotion'+i+'_delete').checked == true){
                img.push({
                    'seq_id': document.getElementById('promotion'+i+'_image').getAttribute('value'),
                    'action': 'delete',
                    'type': 'promotion_banner'
                })
                update = 1;
            }
            if(update == 1){
                img[img.length-1]['url'] = document.getElementById('promotion'+i+'_image_url_page').value;
                img[img.length-1]['provider_type'] = document.getElementById('promotion'+i+'_provider_type').value;
                img[img.length-1]['sequence'] = document.getElementById('promotion'+i+'_sequence').value;
            }else{
                img.push({
                    'seq_id': document.getElementById('promotion'+i+'_image').getAttribute('value'),
                    'action': '',
                    'type': 'promotion_banner',
                    'url': document.getElementById('promotion'+i+'_image_url_page').value,
                    'provider_type': document.getElementById('promotion'+i+'_provider_type').value,
                    'sequence': document.getElementById('promotion'+i+'_sequence').value
                })
            }
        }
    }catch(err){

    }

    console.log(img);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'set_inactive_delete_banner',
       },
       data: {
            'img': JSON.stringify(img),
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                update_cache_version_func('image');
            }else{
//                document.getElementById('update_banner_btn').disabled = false;
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
//            document.getElementById('update_banner_btn').disabled = false;
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error inactive delete banner');
       }
    });
}

function banner_click(type, seq_id){
    console.log(seq_id);
    for(i in banner_list){
        for(j in banner_list[i]){
            if(seq_id == banner_list[i][j].seq_id){
                if(banner_list[i][j].provider_type == 'hotel'){
                    $('#myModalWizardHotel').modal('show');
                    document.getElementById('hotel_searchForm_wizard').action = banner_list[i][j].url_page;
                }else if(banner_list[i][j].provider_type == 'tour' || banner_list[i][j].provider_type == 'activity'){
                    window.location = banner_list[i][j].url_page;
                }
            }

        }
    }
}

function get_banner(type,page){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_banner',
       },
       data: {
            'type': type,
            'signature': signature
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                document.getElementById(type).innerHTML = '';
                text = '';
                if(page == 'home'){
                    if(msg.result.response.length == 0)
                        document.getElementById(type).style.display = 'none';
                    if(type == 'big_banner'){
                        banner_list['big_banner'] = msg.result.response;
                        text+=`<div class="owl-carousel-banner owl-theme">`;
                        for(i in msg.result.response){
                            text+=`
                            <div class="item">
                                <center>
                                    <img style="cursor:pointer" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('big_banner','`+msg.result.response[i].seq_id+`')" />
                                </center>
                            </div>`;
                        }
                        text+=`</div>`;
                    }else if(type == 'small_banner'){
                        banner_list['small_banner'] = msg.result.response;
                        if(template == 1){
                            text+=`
                            <section class="popular-destination-area section-gap" style="z-index:0; position:relative;">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="menu-content">
                                                <div class="title text-center">
                                                    <h1>HOT DEALS</h1>
                                                </div>
                                                <br/>
                                            </div>
                                            <div class="owl-carousel-suggest owl-theme">`;
                                            //<div style="background:red; position:absolute; right:0px; padding:5px; z-index:10;">
                                            //    <h5 style="color:`+text_color+`;">SOLD OUT BRO</h5>
                                            //</div>
                                            for(i in msg.result.response){
                                                text+=`
                                                <div class="item">
                                                    <div class="single-destination relative">
                                                        <div class="thumb relative">
                                                            <img style="cursor:pointer;" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                                        </div>
                                                    </div>
                                                </div>`;
                                            }
                                            text+=`</div>
                                        </div>
                                    </div>
                                </div>
                            </section>`;
                        }else if(template == 2){
                            text+=`
                            <section class="roberto-service-area" style="z-index:0; background:white;">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <div class="section-heading text-center wow fadeInUp" data-wow-delay="100ms" style="margin-bottom:20px;">
                                                <h1>HOT DEALS</h1>
                                            </div>
                                            <div class="owl-carousel-suggest owl-theme">`;
                                            //<div style="background:red; position:absolute; right:0px; padding:5px; z-index:10;">
                                            //    <h5 style="color:`+text_color+`;">SOLD OUT BRO</h5>
                                            //</div>
                                            for(i in msg.result.response){
                                                text+=`
                                                <div class="item">
                                                    <div class="single-destination relative">
                                                        <div class="thumb relative">
                                                            <img style="cursor:pointer;" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                                        </div>
                                                    </div>
                                                </div>`;
                                            }
                                            text+=`</div>
                                        </div>
                                    </div>
                                </div>
                            </section>`;
                        }else if(template == 3){
                            text+=`
                            <section class="feature-area section-gap" id="service">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="row d-flex justify-content-center">
                                                <div class="col-md-8 pb-20 header-text">
                                                    <h1>HOT DEALS</h1>
                                                </div>
                                            </div>
                                            <div class="owl-carousel-suggest owl-theme">`;
                                            //<div style="background:red; position:absolute; right:0px; padding:5px; z-index:10;">
                                            //    <h5 style="color:`+text_color+`;">SOLD OUT BRO</h5>
                                            //</div>
                                            for(i in msg.result.response){
                                                text+=`
                                                <div class="item">
                                                    <div class="single-destination relative">
                                                        <div class="thumb relative">
                                                            <img style="cursor:pointer;" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                                        </div>
                                                    </div>
                                                </div>`;
                                            }
                                            text+=`</div>
                                        </div>
                                    </div>
                                </div>
                            </section>`;
                        }else if(template == 4){
                            text+=`
                            <div class="site-section" style="background: #f7f7f7;">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="row justify-content-center mb-5">
                                                <div class="col-md-7 text-center border-primary">
                                                    <h1 class="font-weight-light text-primary" style="color:black !important">HOT DEALS</h1>
                                                </div>
                                            </div>
                                            <div class="owl-carousel-suggest owl-theme">`;
                                            //<div style="background:red; position:absolute; right:0px; padding:5px; z-index:10;">
                                            //    <h5 style="color:`+text_color+`;">SOLD OUT BRO</h5>
                                            //</div>
                                            for(i in msg.result.response){
                                                text+=`
                                                <div class="item">
                                                    <div class="single-destination relative">
                                                        <div class="thumb relative">
                                                            <img style="cursor:pointer;" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                                        </div>
                                                    </div>
                                                </div>`;
                                            }
                                            text+=`</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        }else if(template == 5){
                            text+=`
                            <section class="popular-destination-area section-gap" style="z-index:0; position:relative;">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="menu-content">
                                                <div class="title text-center">
                                                    <h1>HOT DEALS</h1>
                                                </div>
                                                <br/>
                                            </div>
                                            <div class="owl-carousel-suggest owl-theme">`;
                                            //<div style="background:red; position:absolute; right:0px; padding:5px; z-index:10;">
                                            //    <h5 style="color:`+text_color+`;">SOLD OUT BRO</h5>
                                            //</div>
                                            for(i in msg.result.response){
                                                text+=`
                                                <div class="item">
                                                    <div class="single-destination relative">
                                                        <div class="thumb relative">
                                                            <img style="cursor:pointer;" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                                        </div>
                                                    </div>
                                                </div>`;
                                            }
                                            text+=`</div>
                                        </div>
                                    </div>
                                </div>
                            </section>`;
                        }
                    }else if(type == 'promotion'){
                        banner_list['promotion'] = msg.result.response;
//                    <div class="col-lg-12">
//                                            <center>
//                                                <h2 class="modal-title animated pulse infinite" style="color:#ffffff;"> PROMOTIONS! </h2>
//                                            </center>
//                                        </div>
                        text+=`
                        <div class="modal fade" id="myModalPromotion" role="dialog">
                            <div class="modal-dialog" style="width:500px;">
                                <div class="modal-content" style="width:500px;">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <div style="background:#f7f7f7; padding:5px; cursor:pointer;" onclick="checkCookie();">
                                                        <center>
                                                            <span data-dismiss="modal" style="font-weight:bold; color:`+color+`;">Close X</span>
                                                        </center>
                                                    </div>
                                                </div>
                                                <div class="col-lg-12">`;
                                                    text+=`<div class="owl-carousel-promotion owl-theme">`;
                                                    for(i in msg.result.response){
                                                        text+=`
                                                        <div class="item">
                                                            <center>
                                                                <img src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="max-width:500px; max-height:500px; cursor:pointer;" onclick="banner_click('promotion','`+msg.result.response[i].seq_id+`')"/>
                                                            </center>
                                                        </div>`;
                                                    }
                                                    text+=`</div>`;
                                                text+=`
                                                <div class="col-lg-12" style="background:#f7f7f7;">
                                                    <div style="text-align:right; padding:10px 0px 30px 0px;">
                                                        <label class="check_box_custom" style="float:right;">
                                                            <span>Don't Show Again Today</span>
                                                            <input type="checkbox" id="dont_show_again" name="dont_show_again" value="true"/>
                                                            <span class="check_box_span_custom"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                }else if(page == 'admin'){
                    //<img src="`+msg.result.response[i].url+`" id="`+msg.result.response[i].seq_id+`" alt="" style="height:220px;width:auto"/>
                    text += `<div class="row">`;
                    for(i in msg.result.response){
                        text += `
                        <div class="col-lg-6" style="border: 1px solid `+text_color+`;justify-content:center">
                            <div class="row" style="flex:1;justify-content:center;align-items:center; padding:20px 0px;">
                            <img src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="max-width:50vh;"/>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <h6 style="color:`+text_color+`;margin-bottom:10px;">URL</h6>
                                    <div class="form-select">
                                        <input type="text" class="form-control" id="`+type+i+`_image_url_page" name="`+type+i+`_image_url_page" placeholder="Url"`;
                                        if(msg.result.response[i].url_page != false && msg.result.response[i].url_page != undefined)
                                            text+=` value="`+msg.result.response[i].url_page+`"/>`;
                                        else
                                            text+=` value=""/>`;
                                text+=`
                                    </div>
                                </div>
                                <div class="col-lg-6 mt-2">
                                    <h6 style="color:`+text_color+`;margin-bottom:10px;">Sequence</h6>
                                    <div class="form-select">
                                        <input type="text" class="form-control" id="`+type+i+`_sequence" name="`+type+i+`sequence" placeholder="Sequence"`;
                                        if(msg.result.response[i].sequence != false && msg.result.response[i].sequence != undefined)
                                            text+=` value="`+msg.result.response[i].sequence+`"/>`;
                                        else
                                            text+=` value=""/>`;
                                text+=`
                                    </div>
                                    <label class="check_box_custom mt-2">
                                        <span style="font-size:13px;color:`+text_color+`;">Active</span>
                                        <input type="checkbox" value="" id="`+type+i+`_active" name="`+type+i+`_active"`;
                                        if(msg.result.response[i].active == true)
                                            text+=` checked`;
                                        text+=`>
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                                <div class="col-lg-6 mt-2">
                                    <h6 style="color:`+text_color+`;margin-bottom:10px;">Provider Type</h6>
                                    <div class="form-select">
                                        <select id="`+type+i+`_provider_type" style="width:100%" name="`+type+i+`_provider_type" class="nice-select-default">
                                            <option value=""></option>`;
                                        for(j in provider_list_template){
                                            if(provider_list_template[j] != "offline" &&
                                               provider_list_template[j] != "bank" &&
                                               provider_list_template[j] != "issued_offline" &&
                                               provider_list_template[j] != "payment" &&
                                               provider_list_template[j] != "issued_offline"){
                                               if(msg.result.response[i].provider_type != provider_list_template[j]){
                                                text+=`
                                                    <option value="`+provider_list_template[j]+`">`+provider_list_template[j]+`</option>`;
                                               }else{
                                                text+=`
                                                    <option value="`+provider_list_template[j]+`" selected>`+provider_list_template[j]+`</option>`;
                                               }

                                            }
                                        }
                                            text+=`
                                        </select>
                                    </div>
                                    <label class="check_box_custom mt-2">
                                        <span style="font-size:13px;color:`+text_color+`;">Delete</span>
                                        <input type="checkbox" value="" id="`+type+i+`_delete" name="`+type+i+`_delete">
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                    text += `</div>`;
                    banner_list[type] = msg.result.response;
                }
                document.getElementById(type).innerHTML = text;
                if(page == 'admin'){
                    for(i in msg.result.response){
                        $("#"+type+i+`_provider_type`).niceSelect();
                    }
                }
                if(page == 'home'){
                    if(msg.result.response.length > 0){
                        checkCookie();

                        if(type == 'big_banner'){
                            $('.owl-carousel-banner').owlCarousel({
                                loop:true,
                                nav: true,
                                rewind: false,
                                margin: 20,
                                responsiveClass:true,
                                dots: true,
                                lazyLoad:true,
                                merge: true,
                                smartSpeed:500,
                                center: true,
                                autoHeight: false,
                                autoWidth: false,
                                autoplay: true,
                                autoplayTimeout:10000,
                                autoplayHoverPause:false,
                                navText: ['<i class="fas fa-chevron-left owl-wh"/>', '<i class="fas fa-chevron-right owl-wh"/>'],
                                responsive:{
                                    0:{
                                        items:1,
                                        nav:true,
                                        center: false,
                                        autoWidth: false,
                                    },
                                    600:{
                                        items:1,
                                        nav:true,
                                        center: false,
                                        autoWidth: false,
                                    },
                                    1000:{
                                        items:1,
                                        nav:true,
                                    }
                                }
                            });
                        }
                        else if(type == 'small_banner'){
                            $('.owl-carousel-suggest').owlCarousel({
                                loop:false,
                                nav: true,
                                navRewind:true,
                                rewind: true,
                                margin: 20,
                                items:4,
                                responsiveClass:true,
                                dots: false,
                                merge: false,
                                lazyLoad:true,
                                smartSpeed:500,
                                autoplay: false,
                                autoplayTimeout:10000,
                                autoplayHoverPause:false,
                                navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                                responsive:{
                                    0:{
                                        items:2,
                                        nav:true
                                    },
                                    480:{
                                        items:2,
                                        nav:true
                                    },
                                    768:{
                                        items:3,
                                        nav:true
                                    },
                                    961:{
                                        items:4,
                                        nav:true,
                                    }
                                }
                            });
                        }
                        else if(type == 'promotion'){
                            $('.owl-carousel-promotion').owlCarousel({
                                loop:true,
                                nav: false,
                                navRewind:false,
                                rewind: false,
                                margin: 20,
                                items:1,
                                responsiveClass:true,
                                dots: false,
                                merge: false,
                                lazyLoad:true,
                                smartSpeed:500,
                                autoHeight: false,
                                autoplay: true,
                                autoplayTimeout:3000,
                                autoplayHoverPause:false,
                                navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                                responsive:{
                                    0:{
                                        items:1,
                                        nav:false
                                    },
                                    480:{
                                        items:1,
                                        nav:false
                                    },
                                    768:{
                                        items:1,
                                        nav:false
                                    },
                                    961:{
                                        items:1,
                                        nav:false,
                                    }
                                }
                            });

                            if(check_modal == "false"){
                                if(template != 2){
                                    $("#myModalPromotion").modal('show');
                                }else{
                                    $("#myModalPromotion").modal();
                                }
                            }

                            $('#myModalPromotion').on('hidden.bs.modal', function (e) {
                                checkCookie();
                            })
                        }
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error banner');
       }
    });
}

//function testing(){
//    console.log(document.getElementById('selectedFiles_bigbanner'));
//    console.log(document.getElementById('files_bigbanner'));
//    console.log($('#form_admin').get(0));
//    console.log($('files_bigbanner[type=file]').val());
//    var formData = new FormData($('#form_admin').get(0));
//    console.log(formData);
//}

function handleFileSelect_bigbanner(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_bigbanner.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = `<div class="col-lg-12">`;
            html += "<img src=\"" + e.target.result + "\"></div><div class='col-lg-12'><span style='color:"+color+" !important;'>" + f.name + "</span></div>";
            html += `<div class="col-lg-12"><hr/></div>`;
            selDiv_bigbanner.innerHTML += html;
        }
        reader.readAsDataURL(f);
    });
}

function handleFileSelect_smallbanner(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_smallbanner.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = `<div class="col-lg-12">`;
            html += "<img src=\"" + e.target.result + "\"></div><div class='col-lg-12'><span style='color:"+color+" !important;'>" + f.name + "</span></div>";
            html += `<div class="col-lg-12"><hr/></div>`;
            selDiv_smallbanner.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });


}

function handleFileSelect_promotionbanner(e) {
    console.log(e);
    if(!e.target.files || !window.FileReader) return;

    selDiv_promotionbanner.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = `<div class="col-lg-12">`;
            html += "<img src=\"" + e.target.result + "\"></div><div class='col-lg-12'><span style='color:"+color+" !important;'>" + f.name + "</span></div>";
            html += `<div class="col-lg-12"><hr/></div>`;
            selDiv_promotionbanner.innerHTML += html;
        }
        reader.readAsDataURL(f);

    });
}

function get_page(data){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_dynamic_page_detail',
       },
       data: {
            'data': data
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                msg.result.response.body = msg.result.response.body.replace(/&lt;/g, '<');
                msg.result.response.body = msg.result.response.body.replace(/&gt;/g, '>');
                msg.result.response.body = msg.result.response.body.replace(/&nbsp;/g,' ');
                document.getElementById('container').innerHTML = msg.result.response.body;
                document.getElementById('title').innerHTML = `<h1 style="text-align:center;color:`+color+`">`+msg.result.response.title+`</h1>`;
                document.getElementById('header_page').innerHTML = `<img src="`+msg.result.response.image_carousel+`" style="max-height:350px;max-width:100%;" alt="`+msg.result.response.title+`" title="" />`;
            }else{
                document.getElementById('container').innerHTML = 'Page not found';
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update banner');
       }
    });
}

function test_ledger(val){
    for(i=0;i<val;i++){
        $.ajax({
           type: "POST",
           url: "/webservice/content",
           headers:{
                'action': 'test_ledger',
           },
           data: {
                'signature': signature,
                'value': parseInt(100000+parseInt(i)+ new Date().toString().split(' ')[4].split(':')[2]*1000)
           },
           success: function(msg) {
            console.log(msg);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {

           },timeout: 60000
        });
    }
}

function testing_espay_close(){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'testing_espay_close',
       },
       data: {},
       success: function(msg) {
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update banner');
       }
    });
}

function get_dynamic_page(type){
    console.log(type);
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_dynamic_page',
       },
       data: {},
       success: function(msg) {
            console.log(msg);
            if(type == 'admin'){
            text = '';
                counter = 0;
                text = `<option value=`+counter+` select>Create New</option>`;
            }
            if(msg.result.error_code == 0){
                if(type == 'admin'){
                    dynamic_page = msg.result.response;
                    for(i in msg.result.response){
                        counter++;
                        text += `<option value=`+counter+` select>`+msg.result.response[i].title+`</option>`;
                    }
                }
                else if(type == 'login' || type == 'home'){
                    text = `
                    <div class="owl-carousel-login owl-theme">`;
                    for(i in msg.result.response){
                        if(msg.result.response[i].state == true){
                            text+=`
                            <div class="item" style="cursor:pointer; float:none; height:400px; display: flex; justify-content: center; align-items: center;" onclick="window.location.href='/page/`+msg.result.response[i].url+`'">
                                <center>
                                    <h3 style="width:fit-content; margin-bottom:15px; border-bottom:4px solid `+color+`;">`+msg.result.response[i].title+`</h3>
                                    <img class="img-fluid" alt="`+msg.result.response[i].title+`" style="max-height:360px; width:auto;" src="`+msg.result.response[i].image_carousel+`">
                                </center>
                            </div>`;
                        }
                    }
                    text+=`
                    </div>`;
                    if(type == 'login'){
                        document.getElementById('owl-login').innerHTML = text;
                        document.getElementById('owl-login2').innerHTML = text;
                    }else if(type == 'home'){
                        if(text != '')
                            document.getElementById('dynamic_page').innerHTML = `<h2>OTHER INFORMATION</h2>`;
                        document.getElementById('owl-login2').innerHTML = text;
                    }
                    $('.owl-carousel-login').owlCarousel({
                        loop:false,
                        nav: false,
                        navRewind:false,
                        rewind: false,
                        margin: 20,
                        items:1,
                        responsiveClass:true,
                        dots: true,
                        merge: false,
                        lazyLoad:true,
                        smartSpeed:500,
                        autoplay: false,
                        autoplayTimeout:10000,
                        autoplayHoverPause:false,
                        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                        responsive:{
                            0:{
                                items:1,
                                nav:false
                            },
                            480:{
                                items:1,
                                nav:false
                            },
                            768:{
                                items:1,
                                nav:true
                            },
                            961:{
                                items:1,
                                nav:true,
                            }
                        }
                    });
                }
            }
            if(type == 'admin'){
                document.getElementById('page_choose').innerHTML = text;
                $('#page_choose').niceSelect("update");
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update banner');
       }
    });
}

function change_dynamic_page(){
    page_number = parseInt(document.getElementById('page_choose').value)-1;
    if(page_number != -1){
        document.getElementById('page_active').checked = dynamic_page[page_number].state;
        document.getElementById('title_dynamic_page').value = dynamic_page[page_number].title;
        document.getElementById('delete_page').hidden = false;
        CKEDITOR.instances.editor.setData(dynamic_page[page_number].body);
    }else{
        document.getElementById('page_active').checked = false;
        document.getElementById('title_dynamic_page').value = '';
        document.getElementById('delete_page').hidden = true;
        CKEDITOR.instances.editor.setData('');
    }

}

function run_dynamic_page(){
    document.getElementById('editor_test').innerHTML = CKEDITOR.instances['editor'].getData()
}

function run_top_up_page(){
    document.getElementById('editor_top_up_test').innerHTML = CKEDITOR.instances['top_up_term'].getData()
}

function run_payment_information_page(){
    document.getElementById('editor_payment_information_test').innerHTML = `
        <h4 style="margin-bottom:10px;color:`+text_color+`;">Result</h4>
        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            <div class="panel panel-default">
                <div class="instruction-heading" role="tab" id="headingOne">
                    <h4 class="panel-title">
                        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseFour">
                            `+document.getElementById('payment_information_heading').value+`
                        </a>
                    </h4>
                </div>
                <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne" style="">
                    <div class="panel-body">
    ` + CKEDITOR.instances['body_payment_information'].getData() + `
                    </div>
                </div>
            </div>
        </div>`;

}

function update_dynamic_page(){
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

//    var radios = document.getElementsByName('page');
//    for (var j = 0, length = radios.length; j < length; j++) {
//        if (radios[j].checked) {
//            // do whatever you want with the checked radio
//            page_choose = radios[j].value;
//            page_number = j-1;
//            // only one radio can be logically checked, don't check the rest
//            break;
//        }
//    }
    page_number = parseInt(document.getElementById('page_choose').value) - 1
    error_log = '';
    if(document.getElementById('title_dynamic_page').value == ''){
        error_log += 'Please input title\n';
    }
    if(document.getElementById("image_carousel").files.length == 0 && page_number == -1){
        error_log += 'Please input image URL\n';
    }
    if(CKEDITOR.instances.editor.getData() == ''){
        error_log += 'Please HTML\n';
    }
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('state', document.getElementById('page_active').checked);
        formData.append('title', document.getElementById('title_dynamic_page').value);
        formData.append('page_number', parseInt(page_number));
        formData.append('body', JSON.stringify(CKEDITOR.instances.editor.getData()));
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/content",
           headers:{
                'action': 'set_dynamic_page',
           },
           data: formData,
           success: function(msg) {
                if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Update!',
                      html: msg.result.error_msg,
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
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update dynamic page');
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
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_log,
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
}

function delete_dynamic_page(){
//    var radios = document.getElementsByName('page');
//    for (var j = 0, length = radios.length; j < length; j++) {
//        if (radios[j].checked) {
//            // do whatever you want with the checked radio
//            page_choose = radios[j].value;
//            page_number = j-1;
//            // only one radio can be logically checked, don't check the rest
//            break;
//        }
//    }
    page_number = parseInt(document.getElementById('page_choose').value) - 1
    error_log = '';
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('page_number', parseInt(page_number));
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/content",
           headers:{
                'action': 'delete_dynamic_page',
           },
           data: formData,
           success: function(msg) {
                if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Update!',
                      html: msg.result.error_msg,
                    })
                    location.reload();
                }else
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                    })
           },
           contentType:false,
           processData:false,
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update dynamic page');
           }
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_log,
        })
    }
}

function render_preview_template(){
    document.getElementById("preview_template_loading").style.display = "block";
    value_template = parseInt(document.getElementById("template").value);
    setTimeout(function(){
        var template_view_var = "";
        if (template == 3) {
            template_view_var = "preview_template_temp3";
        }else if(template == 4){
            template_view_var = "preview_template_temp4";
        }else{
            template_view_var = "preview_template";
        }
        if(value_template == 1){
            document.getElementById(""+template_view_var).innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate1.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }else if(value_template == 2){
            document.getElementById(""+template_view_var).innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate2.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }else if(value_template == 3){
            document.getElementById(""+template_view_var).innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate3.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }else if(value_template == 4){
            document.getElementById(""+template_view_var).innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate4.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }else if(value_template == 5){
            document.getElementById(""+template_view_var).innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate5.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }
        document.getElementById("preview_template_loading").style.display = "none";
    }, 1000);
}

function render_preview_login_tab(){
    login_color = String(document.getElementById("tab_login_background").value);
    login_txt_color = String(document.getElementById("text_pick_login").value);
    login_opacity = document.getElementById("tab_login_background_checkbox").checked;

    //tab + product
    if(login_color != ""){
        if(login_opacity == true){
            document.getElementById("preview_login_background").style = "background-color: #"+login_color+"B3 !important; padding:15px; min-width:991px;";
        }else{
            document.getElementById("preview_login_background").style = "background-color: #"+login_color+ "!important; padding:15px; min-width:991px;";
        }
    }else{
        document.getElementById("preview_login_background").style = "background-color: unset !important; padding:15px; min-width:991px;";
    }
    document.getElementById("preview_text_iconuser").style.color = "#"+login_txt_color;
    document.getElementById("preview_text_iconpass").style.color = "#"+login_txt_color;
    document.getElementById("preview_text_keepme").style.color = "#"+login_txt_color;
    document.getElementById("preview_text_forget").style.color = "#"+login_txt_color;
    document.getElementById("preview_text_forgetic").style.color = "#"+login_txt_color;
    document.getElementById("preview_text_sign").style.color = "#"+login_txt_color;
}

function render_preview_color_tab(){
    tab_color = String(document.getElementById("bg_tab_pick").value);
    btn_color = String(document.getElementById("color_pick").value);
    txt_color = String(document.getElementById("text_pick").value);
    tab_opacity = document.getElementById("bg_tab_pick_checkbox").checked;

    //tab + product
    if(tab_color != ""){
        //kalo opacity di centang
        if(tab_opacity == true){
            if(template != 3){
                if(template != 2){
                    if(template != 5){
                        document.getElementById("preview_tab").style = "background-color: #"+tab_color+"B3 !important;";
                    }else{
                        document.getElementById("preview_tab").style = "border-bottom: 5px solid #"+txt_color+" !important";
                    }
                }else {
                    document.getElementById("preview_tab").style = "background-color: #"+tab_color+"B3 !important; border-bottom: 5px solid #"+btn_color+" !important";
                }
                document.getElementById("preview_tab_body").style = "background-color: #"+tab_color+ "B3 !important;";
            }else{
                document.getElementById("preview_tab_background").style = "padding:25px 15px 15px 20px; background-color: #"+tab_color+"B3 !important; border: 1px solid #"+txt_color+" !important";
                document.getElementById("preview_tab_body").style = "background-color: #"+tab_color+ "B3 !important; padding-left:0px; border: 1px solid #"+txt_color+" !important";
            }
        }
        //kalo opacity ga di centang
        else{
            if(template != 3){
                if(template != 2){
                    if(template != 5){
                        document.getElementById("preview_tab").style = "background-color: #"+tab_color+ "!important;";
                    }else{
                        document.getElementById("preview_tab").style = "border-bottom: 5px solid #"+txt_color+" !important";
                    }
                }else{
                    document.getElementById("preview_tab").style = "background-color: #"+tab_color+ "!important; border-bottom: 5px solid #"+btn_color+" !important";
                }
                document.getElementById("preview_tab_body").style = "background-color: #"+tab_color+ "!important;";
            }else{
                document.getElementById("preview_tab_background").style = "padding:25px 15px 15px 20px; background-color: #"+tab_color+" !important; border: 1px solid #"+txt_color+" !important";
                document.getElementById("preview_tab_body").style = "background-color: #"+tab_color+ "!important; padding-left:0px; border: 1px solid #"+txt_color+" !important";
            }
        }
    }
    //kalo fillnya kosong
    else{
        if(template != 3){
            if(template != 2){
                if(template != 5){
                    document.getElementById("preview_tab").style = "background-color: unset !important;";
                }else{
                    document.getElementById("preview_tab").style = "border-bottom: 5px solid #"+txt_color+" !important";
                }
            }else{
                document.getElementById("preview_tab").style = "background-color: unset !important; border-bottom: 5px solid #"+btn_color+" !important";
            }
            document.getElementById("preview_tab_body").style = "background-color: unset !important;";
        }else{
            document.getElementById("preview_tab_background").style = "background-color: #"+tab_color+"B3 !important; border: 1px solid #"+txt_color+" !important";
            document.getElementById("preview_tab_body").style = "background-color: unset !important; padding-left:0px; border: 1px solid #"+txt_color+" !important";
        }
    }

    if(template != 3){
        document.getElementById("preview_text_product").style.color = "#"+txt_color;
        if(template != 5){
            document.getElementById("preview_button_ictab").style.backgroundColor = "#"+btn_color;
        }
    }else{
        document.getElementById("preview_text_product").style = "color: #"+btn_color+" !important;";
    }

    //button
    document.getElementById("preview_button_btn").style = "background-color: #"+btn_color+ "!important; color:#"+txt_color+" !important;";
    document.getElementById("preview_button_btnlg").style = "background-color: #"+btn_color+ "!important; color:#"+txt_color+" !important; margin-bottom:5px; margin-top:5px;";

    //button white
    document.getElementById("preview_button_btnwhite").style.border = "1px solid #"+btn_color;

    //icon1st
    document.getElementById("preview_button_icon").style = "color: #"+btn_color+" !important";

    //checkbox
    document.getElementById("preview_button_checkbox").style = "background-color: #"+btn_color+ "!important;";
    document.getElementById("preview_text_checkbox").style = "color: #"+txt_color+ "!important;";
    document.getElementById("preview_button_checkboxlg").style = "background-color: #"+btn_color+ "!important;";

    //radio
    document.getElementById("preview_button_radio").style = "background-color: #"+btn_color+ "!important;";
    document.getElementById("preview_text_radio").style = "color: #"+txt_color+ "!important;";

    //change font + text color
    value_font = String(document.getElementById("font").value);
    text_font = String($('#font option:selected').text());

    if(value_font != ""){
        var junction_font_prev = new FontFace(text_font, 'url(/static/tt_website_rodextrip/custom_font/'+value_font+')');
        junction_font_prev.load().then(function(loaded_face_prev) {
            document.fonts.add(loaded_face_prev);
            document.getElementById("preview_text_extxth1").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_text_extxth2").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_text_extxth3").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_text_extxth4").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_text_extxth5").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_text_extxth6").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_text_extxtlabel").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_text_extxtspan").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_text_extxtp").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
        }).catch(function(error) {
            console.log(err);
        });
    }else{
        if(template == 4){
            text_font = '"Nanum Gothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
        }else{
            text_font = '"Poppins", sans-serif';
        }
        document.getElementById("preview_text_extxth1").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_text_extxth2").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_text_extxth3").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_text_extxth4").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_text_extxth5").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_text_extxth6").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_text_extxtlabel").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_text_extxtspan").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_text_extxtp").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
    }

}

function hover_inmouse(trg){
    btn_color = String(document.getElementById("color_pick").value);
    txt_color = String(document.getElementById("text_pick").value);
    if(trg == 'btnwhite')
        document.getElementById("preview_button_btnwhite").style = "background-color: #"+btn_color+ "!important; color:#"+txt_color+" !important; border:1px solid #"+btn_color;
    else if(trg == 'icon')
        document.getElementById("preview_button_icon").style = "color:#"+btn_color+"B3;";
    else if(trg == 'iconwhite')
        document.getElementById("preview_button_iconwhite").style = "color:#"+btn_color;
}

function hover_outmouse(trg){
    btn_color = String(document.getElementById("color_pick").value);
    txt_color = String(document.getElementById("text_pick").value);

    if(trg == 'btnwhite')
        document.getElementById("preview_button_btnwhite").style = "background-color: white !important; color:black important;border:1px solid #"+btn_color;
    else if(trg == 'icon')
        document.getElementById("preview_button_icon").style = "color:#"+btn_color;
    else if(trg == 'iconwhite')
        document.getElementById("preview_button_iconwhite").style = "color:"+text_color;
}

function preview_show_hide(prev){
    if(template == 3){
        var preview = document.getElementById(prev+'_temp3');
    }else if (template == 4){
        var preview = document.getElementById(prev+'_temp4');
    }else{
        var preview = document.getElementById(prev);
    }
    var preview_title = document.getElementById(prev+'_title');
    var preview_btn = document.getElementById(prev+'_btn');

    if (preview.style.display === "none") {
        preview.style.display = "block";
        preview_title.style.display = "block";
        preview_btn.innerHTML = 'Hide Preview <i class="fas fa-eye-slash"></i>';
    }
    else {
        preview.style.display = "none";
        preview_title.style.display = "none";
        preview_btn.innerHTML = 'Preview Your Changes <i class="fas fa-eye"></i>';
    }
}