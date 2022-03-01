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
    for(i in banner_list){
        for(j in banner_list[i]){
            if(seq_id == banner_list[i][j].seq_id){
                if(banner_list[i][j].provider_type == 'hotel'){
                    $('#myModalWizardHotel').modal('show');
                    document.getElementById('hotel_searchForm_wizard').action = banner_list[i][j].url_page;
                }else if(banner_list[i][j].provider_type == 'tour' || banner_list[i][j].provider_type == 'activity' || banner_list[i][j].provider_type == false){ //false provider type external di backend tidak ada
                    if(banner_list[i][j].url_page)
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
                cek_available_provider = 0;
                if(page == 'home'){
                    if(msg.result.response.length == 0)
                        document.getElementById(type).style.display = 'none';
                    if(type == 'big_banner'){
                        banner_list['big_banner'] = msg.result.response;
                        if(template != 6){
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
                        }
                        else{
                            var cek_active = 0;
                            for(i in msg.result.response){
                                if(msg.result.response[i].active == true){
                                    cek_active = 1;
                                }
                            }

                            text+=`
                                <div class="csslider infinity" id="slider1">`;
                                if(cek_active == 1){
                                    for(i in msg.result.response){
                                        temp_slider = parseInt(i)+1;
                                        if(temp_slider == 1){
                                            text+=`<input type="radio" name="slides" checked="checked" id="slides_`+temp_slider+`" />`;
                                        }else{
                                            text+=`<input type="radio" name="slides" id="slides_`+temp_slider+`" />`;
                                        }
                                    }
                                }else{
                                    text+=`<input type="radio" name="slides" checked="checked" id="slides_1" />`;
                                }
                                text+=`<ul>`;
                                if(cek_active == 1){
                                    for(i in msg.result.response){
                                        temp_slider = parseInt(i)+1;
                                        text+=`
                                        <li>
                                            <div class="banner-top`+temp_slider+`" id="banner-top`+temp_slider+`">
                                                <div class="overlay"></div>
                                            </div>
                                        </li>`;
                                    }
                                }else{
                                    text+=`
                                    <li>
                                        <div class="banner-top1" id="banner-top1">
                                            <div class="overlay"></div>
                                        </div>
                                    </li>`;
                                }
                                text+=`</ul>
                                <div class="arrows">`;
                                if(cek_active == 1){
                                    for(i in msg.result.response){
                                        temp_slider = parseInt(i)+1;
                                        text+=`
                                            <label for="slides_`+temp_slider+`"></label>
                                        `;
                                    }
                                }
                                text+=`</div>`;
                            }
                        text+=`</div>`;
                    }
                    else if(type == 'small_banner'){
                        var cek_active = 0;
                        for(i in msg.result.response){
                            if(msg.result.response[i].active == true){
                                cek_active = 1;
                            }
                        }

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
                        }else if(template == 6){
                            if(cek_active == 1){
                                text+=`
                                <section class="about">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-lg-12">`;
                                                text+=`
                                                <div class="fetured-info py-lg-3 py-3 mb-3">
                                                    <h3 class="text-center">
                                                        HOT DEALS
                                                    </h3>
                                                </div>
                                                <div class="owl-carousel-suggest owl-theme">`;
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
                                                text+=`</div>`;
                                            text+=`
                                        </div>
                                    </div>
                                </section>`;
                            }
                        }
                    }
                    else if(type == 'promotion'){
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
                }

                else if(page == 'admin'){
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
                                            <option value="external">External</option>`;
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

                else{
                    var cek_active = 0;
                    for(i in msg.result.response){
                        if(msg.result.response[i].provider_type == page){
                            cek_available_provider = 1;
                            if(msg.result.response[i].active == true){
                                cek_active = 1;
                            }
                        }
                    }

                    if(msg.result.response.length == 0)
                        document.getElementById(type).style.display = 'none';

                    if(type == 'big_banner'){
                        banner_list['big_banner'] = msg.result.response;
                        if(template != 6){
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
                        }
                        else{
                            text+=`
                                <div class="csslider infinity" id="slider1">`;
                                if(cek_active == 1){
                                    for(i in msg.result.response){
                                        temp_slider = parseInt(i)+1;
                                        if(temp_slider == 1){
                                            text+=`<input type="radio" name="slides" checked="checked" id="slides_`+temp_slider+`" />`;
                                        }else{
                                            text+=`<input type="radio" name="slides" id="slides_`+temp_slider+`" />`;
                                        }
                                    }
                                }else{
                                    text+=`<input type="radio" name="slides" checked="checked" id="slides_1" />`;
                                }
                                text+=`<ul>`;
                                if(cek_active == 1){
                                    for(i in msg.result.response){
                                        temp_slider = parseInt(i)+1;
                                        text+=`
                                        <li>
                                            <div class="banner-top`+temp_slider+`" id="banner-top`+temp_slider+`">
                                                <div class="overlay"></div>
                                            </div>
                                        </li>`;
                                    }
                                }else{
                                    text+=`
                                    <li>
                                        <div class="banner-top1" id="banner-top1">
                                            <div class="overlay"></div>
                                        </div>
                                    </li>`;
                                }
                                text+=`</ul>
                                <div class="arrows">`;
                                if(cek_active == 1){
                                    for(i in msg.result.response){
                                        temp_slider = parseInt(i)+1;
                                        text+=`
                                            <label for="slides_`+temp_slider+`"></label>
                                        `;
                                    }
                                }
                                text+=`</div>`;
                            }
                        text+=`</div>`;
                    }
                    if(type == 'small_banner'){
                        //banner_list['small_banner'] = msg.result.response;
                        if(cek_active == 1){
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
                                                    if(msg.result.response[i].provider_type == page){
                                                        text+=`
                                                        <div class="item">
                                                            <div class="single-destination relative">
                                                                <div class="thumb relative">
                                                                    <img style="cursor:pointer;" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                                                </div>
                                                            </div>
                                                        </div>`;
                                                    }
                                                }
                                                text+=`</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>`;
                            }
                            else if(template == 2){
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
                            }
                            else if(template == 3){
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
                            }
                            else if(template == 4){
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
                            }
                            else if(template == 5){
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
                            else if(template == 6){
                                text+=`
                                <section class="about py-lg-5 py-md-5 py-3" style="background:#f7f7f7;">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <div class="fetured-info py-lg-3 py-3 mb-3">
                                                    <h3 class="text-center">
                                                        HOT DEALS
                                                    </h3>
                                                </div>
                                                <div class="owl-carousel-suggest owl-theme">`;
                                                //<div style="background:red; position:absolute; right:0px; padding:5px; z-index:10;">
                                                //    <h5 style="color:`+text_color+`;">SOLD OUT BRO</h5>
                                                //</div>
                                                var cek_active = 0;
                                                for(i in msg.result.response){
                                                    if(msg.result.response[i].active == true){
                                                        cek_active = 1;
                                                    }
                                                }
                                                if(cek_active == 1){
                                                    console.log(msg.result.response);
                                                    for(i in msg.result.response){
                                                        if(msg.result.response[i].provider_type == page){
                                                            text+=`
                                                            <div class="item">
                                                                <div class="single-destination relative">
                                                                    <div class="thumb relative">
                                                                        <img style="cursor:pointer;" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                                                    </div>
                                                                </div>
                                                            </div>`;
                                                        }
                                                    }
                                                }
                                                text+=`</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>`;
                                }
                        }
                    }
                }
                document.getElementById(type).innerHTML = text;

                if(page == 'admin'){
                    for(i in msg.result.response){
                        $("#"+type+i+`_provider_type`).niceSelect();
                    }
                }

                if(msg.result.response.length > 0){
                    if(page == 'home'){
                        checkCookie();

                        if(type == 'big_banner'){
                            if(template != 6){
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
                            else{
                                var cek_active = 0;
                                for(i in msg.result.response){
                                    if(msg.result.response[i].active == true){
                                        cek_active = 1;
                                    }
                                }
                                if(cek_active == 1){
                                    for(i in msg.result.response){
                                        temp_slider = parseInt(i)+1;
                                        document.getElementById("banner-top"+temp_slider).style = "background: url('"+msg.result.response[i].url+"'); background-repeat: no-repeat; background-size: 100% 100%;";
                                    }
                                }else{
                                    document.getElementById("banner-top1").style = "background: url('"+background+"'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }
                            }
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

                    else{
                        if(cek_available_provider == 1){
                            if(type == 'big_banner'){
                                if(template != 6){
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

                                else{
                                    var cek_active = 0;
                                    for(i in msg.result.response){
                                        if(msg.result.response[i].active == true){
                                            cek_active = 1;
                                        }
                                    }

                                    if(cek_active == 1){
                                        for(i in msg.result.response){
                                            temp_slider = parseInt(i)+1;
                                            document.getElementById("banner-top"+temp_slider).style = "background: url('"+msg.result.response[i].url+"'); background-repeat: no-repeat; background-size: 100% 100%;";
                                        }
                                    }else{
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_airlines.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }
                                }
                            }
                            if(type == 'small_banner'){
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
                        }
                        else{
                            if(template == 6){
                                if(type == "big_banner"){
                                    if(page == "airline"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_airlines.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "hotel"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_hotel.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "train"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_train.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "ppob"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_ppob.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "activity"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_activity.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "tour"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_tour.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "visa"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_visa.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "passport"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_passport.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "event"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_event.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "bus"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_mitra_bus.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "mitra_keluarga"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_mitra_keluarga.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "periksain"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_periksain.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "phc"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_phc.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "labpintar"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_lab_pintar.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "medical"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_national_hospital.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "swabexpress"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_swab_express.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "sentramedika"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_sentra_medika.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }else if(page == "insurance"){
                                        document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_insurance.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                    }
                                }
                            }
                        }
                    }
                }
                else{
                    if(page == 'home'){
                        if(template == 6){
                            if(type == "big_banner"){
                                document.getElementById("banner-top1").style = "background: url('"+background+"'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                document.getElementById("big_banner").style.display = "block";
                            }
                        }
                    }else{
                        if(template == 6){
                            if(type == "big_banner"){
                                if(page == "airline"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_airlines.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "hotel"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_hotel.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "train"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_train.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "ppob"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_ppob.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "activity"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_activity.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "tour"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_tour.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "visa"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_visa.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "passport"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_passport.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "event"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_event.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "bus"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_bus.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "mitrakeluarga"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_mitra_keluarga.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "periksain"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_periksain.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "phc"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_phc.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "labpintar"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_lab_pintar.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "medical"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_national_hospital.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "swabexpress"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_swab_express.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "sentramedika"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_sentra_medika.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }else if(page == "insurance"){
                                    document.getElementById("banner-top1").style = "background: url('/static/tt_website_rodextrip/images/bg_insurance.jpg'); background-position: center center !important; background-size: cover !important; background-repeat: no-repeat !important;";
                                }
                                document.getElementById("big_banner").style.display = "block";
                            }
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get dynamic page');
       }
    });
}

function send_notif_message(){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'send_notif_message',
       },
       data: {
            'title': document.getElementById('notif_title').value,
            'message': document.getElementById('notif_message').value,
            'url': document.getElementById('notif_url').value
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Nofication!',
                  html: 'Send',
               })
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error send notif');
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error payment');
       }
    });
}

function get_dynamic_page(type){
    console.log(type);
    check_available_dynamic = 0;
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_dynamic_page',
       },
       data: {},
       success: function(msg) {
            console.log(msg);
            check_dynamic = false;
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
                    //buat owlcaoursel
                    text = `<div class="owl-carousel-login owl-theme" style="z-index:0;">`;
                    for(i in msg.result.response){
                        console.log(msg.result.response[i]);
                        if(msg.result.response[i].state == true){
                            check_dynamic = true;
                            text += `<div class="item">`;
                            text+=`
                            <div class="single-recent-blog-post item" style="margin-top:0px; cursor:unset; margin-bottom:10px; border:1px solid #cdcdcd;">
                                <div class="single-destination relative" style="margin-bottom:unset;">
                                    <div class="thumb relative" alt="`+msg.result.response[i].title+`" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:170px; background: white url('`+msg.result.response[i].image_carousel+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="window.location.href='/page/`+msg.result.response[i].url+`'">`;
                                    if(template != 6){
                                        text+=`<div class="overlay overlay-bg"></div>`;
                                    }
                                    text+=`
                                    </div>
                                    <div class="card card-effect-promotion" style="border:unset;">
                                        <div class="card-body" style="padding:5px 10px 10px 10px; border:unset;">
                                            <div class="row details">
                                                <div class="col-lg-12" style="height:160px;">
                                                    <h6 style="cursor:pointer; font-size:16px; width:fit-content; padding-top:10px; border-bottom:4px solid `+color+`; padding-right:5px; font-weight:bold; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" onclick="window.location.href='/page/`+msg.result.response[i].url+`'">`+msg.result.response[i].title+`</h6>
                                                    <div style="padding-top:10px; height:65px;display: block; text-overflow: ellipsis; word-wrap: break-word; overflow: hidden; max-height: 4.6em; line-height: 1.8em;">
                                                        `+msg.result.response[i].body+`
                                                    </div>
                                                    <div style="position:absolute; right:15px; bottom:0px;">
                                                        <button class="primary-btn" style="line-height:24px; padding-left:15px; padding-right:15px;" onclick="window.location.href='/page/`+msg.result.response[i].url+`'">Read More <i class="fas fa-chevron-right"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            //buat owlcaoursel
                            text+=`</div>`;
                        }
                    }
                    //buat owlcaoursel
                    text+=`</div>`;

                    if(type == 'login'){
                        document.getElementById('owl-login').innerHTML = text;
//                        document.getElementById('owl-login2').innerHTML = text;

                        if(check_dynamic){
                            if(template == 1){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="title text-center pb-4">
                                    <h1>INFORMATION</h1>
                                </div>`;
                            }else if(template == 2){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="section-heading text-center wow fadeInUp" data-wow-delay="100ms" style="margin-bottom:20px;">
                                    <h1>INFORMATION</h1>
                                </div>`;
                            }else if(template == 3){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="pb-20 header-text">
                                    <h1>INFORMATION</h1>
                                </div>`;
                            }else if(template == 4){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="text-center border-primary mb-5">
                                    <h1 class="font-weight-light text-primary" style="color:black !important">INFORMATION</h1>
                                </div>`;
                            }else if(template == 5){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="menu-content">
                                    <div class="title text-center">
                                        <h1>INFORMATION</h1>
                                    </div>
                                    <br/>
                                </div>`;
                            }else if(template == 6){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="menu-content">
                                    <div class="fetured-info py-lg-3 py-3">
                                        <h3>INFORMATION</h3>
                                    </div>
                                    <br/>
                                </div>`;
                            }
                            check_available_dynamic = 1;
                        }
                        get_social('login');
                    }else if(type == 'home'){
                        if(check_dynamic){
                            if(template == 1){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="title text-center">
                                    <h1>INFORMATION</h1>
                                </div>`;
                            }else if(template == 2){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="section-heading text-center wow fadeInUp" data-wow-delay="100ms" style="margin-bottom:20px;">
                                    <h1>INFORMATION</h1>
                                </div>`;
                            }else if(template == 3){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="pb-20 header-text">
                                    <h1>INFORMATION</h1>
                                </div>`;
                            }else if(template == 4){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="text-center border-primary mb-5 mt-5">
                                    <h1 class="font-weight-light text-primary" style="color:black !important">INFORMATION</h1>
                                </div>`;
                            }else if(template == 5){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="menu-content">
                                    <div class="title text-center">
                                        <h1>INFORMATION</h1>
                                    </div>
                                    <br/>
                                </div>`;
                            }else if(template == 6){
                                document.getElementById('dynamic_page').innerHTML = `
                                <div class="menu-content">
                                    <div class="fetured-info py-lg-3 py-3">
                                        <h3>INFORMATION</h3>
                                    </div>
                                    <br/>
                                </div>`;
                            }
                        }
                        document.getElementById('owl-login2').innerHTML = text;
                    }

                    $('.owl-carousel-login').owlCarousel({
                        loop:true,
                        nav: true,
                        navRewind:true,
                        rewind: true,
                        margin: 20,
                        items:3,
                        responsiveClass:true,
                        dots: false,
                        merge: false,
                        lazyLoad:true,
                        smartSpeed:500,
                        autoplay: true,
                        autoplayTimeout:5000,
                        autoplayHoverPause:false,
                        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                        responsive:{
                            0:{
                                items:1,
                                nav:true
                            },
                            480:{
                                items:1,
                                nav:true
                            },
                            768:{
                                items:2,
                                nav:true
                            },
                            961:{
                                items:3,
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get banner');
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
        if(value_template == 1){
            document.getElementById("preview_template").innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate1.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }else if(value_template == 2){
            document.getElementById("preview_template").innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate2.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }else if(value_template == 3){
            document.getElementById("preview_template").innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate3.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }else if(value_template == 4){
            document.getElementById("preview_template").innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate4.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
        }else if(value_template == 5){
            document.getElementById("preview_template").innerHTML = `<img src="/static/tt_website_rodextrip/img/preview/HomeTemplate5.png" alt="Preview Template" style="height:auto; width:100%;"/>`;
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
    if(prev == "preview_login_background"){
        var preview = document.getElementById(prev+'_temp');
    }else if(prev == "preview_tab_background"){
        if(template == 3 || template == 4){
            var preview = document.getElementById(prev+'_temp');
        }else{
            var preview = document.getElementById(prev);
        }
    }
    else{
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

function get_notif_train(page=""){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_notification_train',
       },
       data: data,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                if(page == 'admin'){
                    if(msg.result.response.train_page){
                        document.getElementById('notification_train1').checked = true
                    }
                    if(msg.result.response.train_search){
                        document.getElementById('notification_train2').checked = true
                    }
                    if(msg.result.response.train_passenger){
                        document.getElementById('notification_train3').checked = true
                    }
                    if(msg.result.response.train_review){
                        document.getElementById('notification_train4').checked = true
                    }
                    if(msg.result.response.train_booking){
                        document.getElementById('notification_train5').checked = true
                    }
                    CKEDITOR.instances['notification_train'].setData(msg.result.response.html)
                }else{
                    page = document.URL.split('/')[document.URL.split('/').length-1];
                    if(page == 'train' && msg.result.response.train_page ||
                       page == 'search' && msg.result.response.train_search ||
                       page == 'passenger' && msg.result.response.train_passenger ||
                       page == 'review' && msg.result.response.train_review ||
                       document.URL.includes('booking') && msg.result.response.train_booking){
                        document.getElementById('product_notification_body').innerHTML = msg.result.response.html;
                        $('#myModalNotificationProduct').modal('show');
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
       },timeout: 60000
    });
}

function get_notif_airline(page=""){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_notification_airline',
       },
       data: data,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                if(page == 'admin'){
                    if(msg.result.response.airline_page){
                        document.getElementById('notification_airline1').checked = true
                    }
                    if(msg.result.response.airline_search){
                        document.getElementById('notification_airline2').checked = true
                    }
                    if(msg.result.response.airline_passenger){
                        document.getElementById('notification_airline3').checked = true
                    }
                    if(msg.result.response.airline_review){
                        document.getElementById('notification_airline4').checked = true
                    }
                    if(msg.result.response.airline_booking){
                        document.getElementById('notification_airline5').checked = true
                    }
                    CKEDITOR.instances['notification_airline'].setData(msg.result.response.html)
                }else{
                    page = document.URL.split('/')[document.URL.split('/').length-1];
                    if(page == 'airline' && msg.result.response.airline_page ||
                       page == 'search' && msg.result.response.airline_search ||
                       page == 'passenger' && msg.result.response.airline_passenger ||
                       page == 'review' && msg.result.response.airline_review ||
                       document.URL.includes('booking') && msg.result.response.airline_booking){
                        document.getElementById('product_notification_body').innerHTML = msg.result.response.html;
                        $('#myModalNotificationProduct').modal('show');
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
       },timeout: 60000
    });
}

function update_notification_train(){
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

    var data = {
        'signature': signature,
        'html': CKEDITOR.instances['notification_train'].getData(),
        'train_page': document.getElementById('notification_train1').checked,
        'train_search': document.getElementById('notification_train2').checked,
        'train_passenger': document.getElementById('notification_train3').checked,
        'train_review': document.getElementById('notification_train4').checked,
        'train_booking': document.getElementById('notification_train5').checked,
    }

    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'update_notification_train',
       },
       data: data,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Updated!',
                  html: 'Notification Train',
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

function update_notification_airline(){
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

    var data = {
        'signature': signature,
        'html': CKEDITOR.instances['notification_airline'].getData(),
        'airline_page': document.getElementById('notification_airline1').checked,
        'airline_search': document.getElementById('notification_airline2').checked,
        'airline_passenger': document.getElementById('notification_airline3').checked,
        'airline_review': document.getElementById('notification_airline4').checked,
        'airline_booking': document.getElementById('notification_airline5').checked,
    }

    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'update_notification_airline',
       },
       data: data,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Updated!',
                  html: 'Notification Airline',
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

function reservation_request_action_prompt(req_number, val){
    //tambah swal
    if(val == 0)
    {
        var temp_title = 'Are you sure you want to Reject this reservation issued request?';
    }
    else if(val == 1)
    {
        var temp_title = 'Are you sure you want to Approve this reservation issued request?';
    }
    else
    {
        var temp_title = 'Are you sure you want to Cancel this reservation issued request?';
    }
    Swal.fire({
      title: temp_title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.issued_booking_btn').prop('disabled', true);
        please_wait_transaction();
        if(val == 0)
        {
            reject_reservation_issued_request(req_number);
        }
        else if(val == 1)
        {
            approve_reservation_issued_request(req_number);
        }
        else
        {
            cancel_reservation_issued_request(req_number);
        }
      }
    })
}

function get_reservation_issued_request_list()
{
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_issued_request_list',
       },
       data: {
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           $('#loading-search-reservation').hide();
           $('#main_request_tables').show();
           if(msg.result.error_code == 0){
                text = `
                    <tr>
                        <th>No.</th>
                        <th>Request Number</th>
                        <th>Provider Type</th>
                        <th>Booker</th>
                        <th>Created Date</th>
                        <th>State</th>
                        <th>Action</th>
                    </tr>
                `;
                text2 = `
                    <tr>
                        <th>No.</th>
                        <th>Request Number</th>
                        <th>Provider Type</th>
                        <th>Booker</th>
                        <th>Created Date</th>
                        <th>State</th>
                        <th>Action</th>
                    </tr>
                `;
                num1 = 1;
                num2 = 1;
                for(i in msg.result.response){
                    req_obj = msg.result.response[i];
                    if(req_obj.direct_approval == true)
                    {
                        text += `
                            <tr>
                                <td>`+num1+`</td>
                                <td>`+req_obj.request_number+`</td>
                                <td>`+req_obj.provider_type+`</td>
                                <td>`+req_obj.booker.name+` (`+req_obj.booker_job_position+`)</td>
                                <td>`+req_obj.created_date+`</td>
                                <td>`+req_obj.state_description+`</td>
                                <td><button type='button' class="primary-btn-custom" onclick="goto_detail_reservation_request('`+req_obj.request_number+`')"><i class="fas fa-search"></button></td>
                            </tr>
                        `;
                        num1 += 1;
                    }
                    else
                    {
                        text2 += `
                            <tr>
                                <td>`+num2+`</td>
                                <td>`+req_obj.request_number+`</td>
                                <td>`+req_obj.provider_type+`</td>
                                <td>`+req_obj.booker.name+` (`+req_obj.booker_job_position+`)</td>
                                <td>`+req_obj.created_date+`</td>
                                <td>`+req_obj.state_description+`</td>
                                <td><button type='button' class="primary-btn-custom" onclick="goto_detail_reservation_request('`+req_obj.request_number+`')"><i class="fas fa-search"></button></td>
                            </tr>
                        `;
                        num2 += 1;
                    }
                }
                document.getElementById('table_reservation_request_direct').innerHTML = text;
                document.getElementById('table_reservation_request').innerHTML = text2;
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error get issued request list </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_reservation_issued_request(request_number)
{
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_reservation_issued_request',
       },
       data: {
           'request_number': request_number,
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           document.getElementById('show_title_request').hidden = false;
           document.getElementById('show_loading_booking_request').style.display = 'none';
           document.getElementById('show_loading_booking_request').hidden = true;
           if(msg.result.error_code == 0){
                $(".issued_booking_btn").show();
                req_obj = msg.result.response;
                text = `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="reservation_request_details" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto;">
                            <div style="padding:10px;">
                                <h4>`+ req_obj.request_number +`</h4>
                                <hr/>
                                <table style="width:100%;">
                                    <tr>
                                        <th style="width:40%;">Booker</th>
                                        <th style="width:30%;">Date</th>
                                        <th style="width:30%;">State</th>
                                    </tr>
                                    <tr>
                                        <td style="width:40%;">`+req_obj.booker.name+` (`+req_obj.booker_job_position+`)</td>
                                        <td style="width:30%;">`+req_obj.created_date+`</td>
                                        <td style="width:30%;">`+req_obj.state_description+`</td>
                                    </tr>
                                </table>
                                <br/>
                                <table style="width:100%;">
                                    <tr>
                                        <th style="width:40%;">Reservation</th>
                                        <th style="width:30%;">Provider Type</th>
                                        <th style="width:30%;">Total Price</th>
                                    </tr>
                                    <tr>
                                        <td style="width:40%;">`+req_obj.reservation_data.order_number+` (<a href="/`+req_obj.provider_type_code+`/booking/`+btoa(req_obj.reservation_data.order_number)+`">Details</a>)</td>
                                        <td style="width:30%;">`+req_obj.provider_type+`</td>
                                        <td style="width:30%;"> IDR `+getrupiah(req_obj.reservation_data.total_price)+`</td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <div id="reservation_request_approvals" style="background-color: white; border: 1px solid #cdcdcd; overflow-x: auto; margin-top: 15px;">
                            <div style="padding:10px;">
                                <h4>Approvals</h4>
                                <hr/>
                                <table style="width:100%;" id="list-of-bookers" class="list-of-passenger-class">
                                    <tr>
                                        <th style="width:5%;" class="list-of-passenger-left">No</th>
                                        <th style="width:25%;">User</th>
                                        <th style="width:25%;">Customer</th>
                                        <th style="width:15%;">Position</th>
                                        <th style="width:15%;">Date</th>
                                        <th style="width:15%;">Action</th>
                                    </tr>
                                `;
               temp_pax_seq = 1
               for(i in req_obj.approvals)
               {
                    text += `
                        <tr>
                            <td>`+temp_pax_seq+`</td>
                            <td>`+req_obj.approvals[i].approved_by+`</td>
                            <td>`+req_obj.approvals[i].approved_by_customer+`</td>
                            <td>`+req_obj.approvals[i].approved_job_position+`</td>
                            <td>`+req_obj.approvals[i].approved_date+`</td>
                            <td>`+req_obj.approvals[i].action+`</td>
                        </tr>
                    `;
                    temp_pax_seq += 1;
               }
               text += `</table>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                document.getElementById('reservation_request_details').innerHTML = text;

                if (user_login.co_customer_seq_id == req_obj.booker.seq_id)
                {
                    if (req_obj.state == 'cancel' || req_obj.state == 'approved' || req_obj.state == 'rejected')
                    {
                        btn_text = `
                        <button class="primary-btn issued_booking_btn" id="disabled_request_btn" type="button" style="width:100%;" onclick="" disabled>
                            Request `+req_obj.state_description+`
                        </button>
                        `;
                    }
                    else
                    {
                        btn_text = `
                        <button class="primary-btn issued_booking_btn" id="cancel_request_btn" type="button" style="width:100%;" onclick="reservation_request_action_prompt('`+req_obj.request_number+`', 2)">
                            Cancel Request
                        </button>
                        `;
                    }
                }
                else
                {
                    if (req_obj.state == 'cancel' || req_obj.state == 'approved' || req_obj.state == 'rejected' || user_login.co_hierarchy_sequence >= req_obj.current_approval_sequence)
                    {
                        btn_text = `
                        <button class="primary-btn issued_booking_btn" id="disabled_request_btn" type="button" style="width:100%;" onclick="" disabled>
                            Request `+req_obj.state_description+`
                        </button>
                        `;
                    }
                    else
                    {
                        btn_text = `
                        <button class="primary-btn-white issued_booking_btn" id="reject_request_btn" type="button" style="width:100%;" onclick="reservation_request_action_prompt('`+req_obj.request_number+`', 0)">
                            Reject Request
                        </button>
                        <button class="primary-btn issued_booking_btn mt-3" id="approve_request_btn" type="button" style="width:100%;" onclick="reservation_request_action_prompt('`+req_obj.request_number+`', 1)">
                            Approve Request
                        </button>
                        `;
                    }
                }
                document.getElementById('reservation_request_buttons').innerHTML = btn_text;
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error get reservation issued request </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function approve_reservation_issued_request(request_number)
{
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'approve_reservation_issued_request',
       },
       data: {
           'request_number': request_number,
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                Swal.fire({
                   type: 'success',
                   title: 'Success',
                   text: 'Approved!',
                }).then((result) => {
                    window.location.href = '/reservation_request/' + btoa(request_number);
                })
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error approve reservation issued request </span>' + msg.result.error_msg,
               }).then((result) => {
                   $('.issued_booking_btn').prop('disabled', false);
                   hide_modal_waiting_transaction();
               })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error approve reservation issued request');
            $('.issued_booking_btn').prop('disabled', false);
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function reject_reservation_issued_request(request_number)
{
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'reject_reservation_issued_request',
       },
       data: {
           'request_number': request_number,
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                Swal.fire({
                   type: 'success',
                   title: 'Success',
                   text: 'Rejected!',
                }).then((result) => {
                    window.location.href = '/reservation_request/' + btoa(request_number);
                })
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error reject reservation issued request </span>' + msg.result.error_msg,
               }).then((result) => {
                   $('.issued_booking_btn').prop('disabled', false);
                   hide_modal_waiting_transaction();
               })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error reject reservation issued request');
            $('.issued_booking_btn').prop('disabled', false);
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function cancel_reservation_issued_request(request_number)
{
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'cancel_reservation_issued_request',
       },
       data: {
           'request_number': request_number,
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                Swal.fire({
                   type: 'success',
                   title: 'Success',
                   text: 'Cancelled!',
                }).then((result) => {
                    window.location.href = '/reservation_request/' + btoa(request_number);
                })
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error cancel reservation issued request </span>' + msg.result.error_msg,
               }).then((result) => {
                   $('.issued_booking_btn').prop('disabled', false);
                   hide_modal_waiting_transaction();
               })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error cancel reservation issued request');
            $('.issued_booking_btn').prop('disabled', false);
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}
