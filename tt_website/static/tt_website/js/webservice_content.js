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
                if(page == 'home'){
                    if(msg.result.response.length == 0){
                        document.getElementById(type).style.display = 'none';
                    }
                    if(type == 'big_banner'){
                        banner_list['big_banner'] = msg.result.response;
                        text+=`<div class="owl-carousel-banner owl-theme">`;
                        for(i in msg.result.response){
                            if(msg.result.response[i].active == true){
                                text+=`
                                <div class="item">
                                    <center>
                                        <img class="owl-lazy" style="cursor:pointer" data-src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('big_banner','`+msg.result.response[i].seq_id+`')" />
                                    </center>
                                </div>`;
                            }
                        }
                        text+=`</div>`;
                    }
                    else if(type == 'small_banner'){
                        banner_list['small_banner'] = msg.result.response;
                        text+=`
                        <div class="owl-carousel-suggest owl-theme">`;
                        for(i in msg.result.response){
                            if(msg.result.response[i].active == true){
                                text+=`
                                <div class="item">
                                    <img class="owl-lazy" style="cursor:pointer;" data-src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                </div>`;
                            }
                        }
                        text+=`</div>`;
                    }
                    else if(type == 'promotion'){
                        banner_list['promotion'] = msg.result.response;
                        text+=`
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div style="background:#f7f7f7; padding:5px; cursor:pointer;" onclick="checkCookie('promotion', 'update', 'home', '');">
                                            <center>
                                                <span data-dismiss="modal" style="font-weight:bold; color:`+color+`;">Close X</span>
                                            </center>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">`;
                                        text+=`<div class="owl-carousel-promotion owl-theme">`;
                                        for(i in msg.result.response){
                                            if(msg.result.response[i].active == true){
                                                text+=`
                                                <div class="item">
                                                    <center>
                                                        <img class="owl-lazy" data-src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="max-width:500px; max-height:500px; cursor:pointer;" onclick="banner_click('promotion','`+msg.result.response[i].seq_id+`')"/>
                                                    </center>
                                                </div>`;
                                            }
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
                        </div>`;
                    }
                }

                else if(page == 'admin'){
                    //<img src="`+msg.result.response[i].url+`" id="`+msg.result.response[i].seq_id+`" alt="" style="height:220px;width:auto"/>
                    text += `<div class="row">`;
                    for(i in msg.result.response){
                        text += `
                        <div class="col-lg-12" style="border-top:1px solid #cdcdcd; padding:15px;">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h6>Banner #`+(parseInt(i)+1)+`</h6>
                                </div>
                                <div class="col-lg-12" style="display:flex">
                                    <label class="check_box_custom mt-2" style="padding-right:10px;">
                                        <span style="font-size:13px;">Active</span>
                                        <input type="checkbox" value="" id="`+type+i+`_active" name="`+type+i+`_active"`;
                                        if(msg.result.response[i].active == true)
                                            text+=` checked`;
                                        text+=`>
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                    <label class="check_box_custom mt-2">
                                        <span style="font-size:13px;">Delete</span>
                                        <input type="checkbox" value="" id="`+type+i+`_delete" name="`+type+i+`_delete">
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-lg-5">
                                    <img class="mb-3" src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="width:100%; height:auto;"/>
                                </div>
                                <div class="col-lg-7">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <h6 style="margin-bottom:10px;">URL</h6>
                                            <div class="form-select">
                                                <input type="text" class="form-control" id="`+type+i+`_image_url_page" name="`+type+i+`_image_url_page" placeholder="Url"`;
                                                if(msg.result.response[i].url_page != false && msg.result.response[i].url_page != undefined)
                                                    text+=` value="`+msg.result.response[i].url_page+`"/>`;
                                                 else
                                                    text+=` value=""/>`;
                                            text+=`
                                            </div>
                                        </div>
                                        <div class="col-lg-12 mt-2">
                                            <h6 style="margin-bottom:10px;">Sequence</h6>
                                            <div class="form-select">
                                                <input type="text" class="form-control" id="`+type+i+`_sequence" name="`+type+i+`sequence" placeholder="Sequence"`;
                                                if(msg.result.response[i].sequence != false && msg.result.response[i].sequence != undefined)
                                                    text+=` value="`+msg.result.response[i].sequence+`"/>`;
                                                else
                                                    text+=` value=""/>`;
                                            text+=`
                                            </div>
                                        </div>
                                        <div class="col-lg-12 mt-2 mb-3">
                                            <h6 style="margin-bottom:10px;">Provider Type</h6>`;

                                            if(template == 3){
                                                text+=`<div class="default-select">`;
                                            }else{
                                                text+=`<div class="form-select">`;
                                            }

                                            text+=`
                                                <select id="`+type+i+`_provider_type" style="width:100%" name="`+type+i+`_provider_type" class="nice-select-default">
                                                    <option value="external">External</option>`;
                                                for(j in provider_types_sequence){
                                                    if(provider_types_sequence[j].code != "offline" &&
                                                       provider_types_sequence[j].code != "bank" &&
                                                       provider_types_sequence[j].code != "issued_offline" &&
                                                       provider_types_sequence[j].code != "payment" &&
                                                       provider_types_sequence[j] != "issued_offline"){
                                                       if(msg.result.response[i].provider_type != provider_types_sequence[j].code){
                                                        text+=`
                                                            <option value="`+provider_types_sequence[j].code+`">`+provider_types_sequence[j].name+`</option>`;
                                                       }else{
                                                        text+=`
                                                            <option value="`+provider_types_sequence[j].code+`" selected>`+provider_types_sequence[j].name+`</option>`;
                                                       }

                                                    }
                                                }
                                                    text+=`
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                    text += `</div>`;
                    banner_list[type] = msg.result.response;
                }

                else{
                    if(msg.result.response.length == 0)
                        document.getElementById(type).style.display = 'none';

                    if(type == 'big_banner'){
                        banner_list['big_banner'] = msg.result.response;
                        text+=`<div class="owl-carousel-banner owl-theme">`;
                        for(i in msg.result.response){
                            if(msg.result.response[i].provider_type != false){
                                if(msg.result.response[i].provider_type == page && msg.result.response[i].active == true){
                                    text+=`
                                    <div class="item">
                                        <center>
                                            <img class="owl-lazy" style="cursor:pointer" data-src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('big_banner','`+msg.result.response[i].seq_id+`')" />
                                        </center>
                                    </div>`;
                                }
                            }
                        }
                        text+=`</div>`;
                    }
                    if(type == 'small_banner'){
                        banner_list['small_banner'] = msg.result.response;
                        text+=`
                        <div class="owl-carousel-suggest owl-theme">`;
                        for(i in msg.result.response){
                            if(msg.result.response[i].provider_type != false){
                                if(msg.result.response[i].provider_type == page && msg.result.response[i].active == true){
                                    text+=`
                                    <div class="item">
                                        <img class="owl-lazy" style="cursor:pointer;" data-src="`+msg.result.response[i].url+`" alt="Banner" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" onclick="banner_click('small_banner','`+msg.result.response[i].seq_id+`')"/>
                                    </div>`;
                                }
                            }
                        }
                        text+=`</div>`;
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
                        if(type == 'big_banner'){
                            $('.owl-carousel-banner').owlCarousel({
                                loop:false,
                                nav: true,
                                rewind: false,
                                margin: 20,
                                responsiveClass:true,
                                dots: true,
                                lazyLoad:true,
                                lazyLoadEager:true,
                                merge: true,
                                smartSpeed:500,
                                center: true,
                                autoHeight: true,
                                autoWidth: false,
                                autoplay: false,
                                autoplayTimeout:10000,
                                autoplayHoverPause:false,
                                items:1,
                                navText: ['<i class="fas fa-chevron-left owl-wh"/>', '<i class="fas fa-chevron-right owl-wh"/>'],
                            });

                            var dots = $('.owl-carousel-banner').find('.owl-dots').css('position', 'absolute').css('bottom', '5px');
                            dots.css('left', 'calc(50% - ' + dots.width()/2+'px)');


                            //var dots_outer = $('.owl-carousel-banner').find('.owl-stage-outer').attr('style', 'min-height: 0px !important');
                            if(template == 6){
                                $('.big_banner_home').attr('style', 'height: 100% !important');
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
                                lazyLoadEager:true,
                                autoHeight: false,
                                autoWidth: false,
                                smartSpeed:1000,
                                autoplay: false,
                                autoplayTimeout:10000,
                                autoplayHoverPause:false,
                                navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                                responsive:{
                                    0:{
                                        items:1,
                                    },
                                    576:{
                                        items:2,
                                    },
                                    992:{
                                        items:4,
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
                                lazyLoadEager:true,
                                smartSpeed:500,
                                autoHeight: false,
                                autoplay: true,
                                autoplayTimeout:3000,
                                autoplayHoverPause:false,
                                navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                            });

                            if(terms_value == 0){
                                checkCookie('promotion', 'load', 'home', '');
                            }
                            $('#myModalPromotion').on('hidden.bs.modal', function (e) {
                                checkCookie('promotion', 'update', 'home', '');
                            })
                        }
                    }

                    else{
                        if(type == 'big_banner'){
                            $('.owl-carousel-banner').owlCarousel({
                                loop:false,
                                nav: true,
                                rewind: false,
                                margin: 20,
                                responsiveClass:true,
                                dots: false,
                                lazyLoad:true,
                                lazyLoadEager:true,
                                merge: true,
                                smartSpeed:500,
                                center: true,
                                autoHeight: false,
                                autoWidth: false,
                                autoplay: true,
                                autoplayTimeout:10000,
                                autoplayHoverPause:false,
                                items:1,
                                navText: ['<i class="fas fa-chevron-left owl-wh"/>', '<i class="fas fa-chevron-right owl-wh"/>'],
                            });
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
                                lazyLoadEager:true,
                                smartSpeed:1000,
                                autoplay: false,
                                autoplayTimeout:10000,
                                autoplayHoverPause:false,
                                navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                                responsive:{
                                    0:{
                                        items:1,
                                    },
                                    576:{
                                        items:2,
                                    },
                                    992:{
                                        items:4,
                                    }
                                }
                            });
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

function handleFileSelect_bigbanner(e) {
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
                if(Object.keys(msg.result.response).length > 0){
                    msg.result.response.body = msg.result.response.body.replace(/&lt;/g, '<');
                    msg.result.response.body = msg.result.response.body.replace(/&gt;/g, '>');
                    msg.result.response.body = msg.result.response.body.replace(/&nbsp;/g,' ');
                    document.getElementById('container').innerHTML = msg.result.response.body;
                    document.getElementById('title').innerHTML = `<h1 style="text-align:center;">`+msg.result.response.title+`</h1>`;
                    document.getElementById('header_page').innerHTML = `<img src="`+msg.result.response.image_carousel+`" style="max-height:350px;max-width:100%;" alt="`+msg.result.response.title+`" title="" />`;
                    document.getElementById('share_page').innerHTML = `
                    <b>Share: </b>
                    <a target="_blank" href="https://twitter.com/intent/tweet?url=`+msg.result.response.title+` `+window.location.href+`&text=" class="share-btn twitter">Twitter</a>
                    <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=`+window.location.href+`" class="share-btn facebook">Facebook</a>
                    <a target="_blank" href="https://wa.me/?text=`+msg.result.response.title+` `+ window.location.href +`" class="share-btn whatsapp">Whatsapp</a>
                    <a target="_blank" href="https://telegram.me/share/url?text=`+msg.result.response.title+` &url=`+window.location.href+`" class="share-btn telegram">Telegram</a>
                    <a target="_blank" href="line://msg/text/`+msg.result.response.title+`  `+window.location.href+`" class="share-btn line">Line</a>
                    <a target="_blank" href="mailto:?subject=`+msg.result.response.title+` &body=`+window.location.href+`" class="share-btn email">Email</a>`;
                }else{
                    document.getElementById('container').innerHTML = `<center><img src="/static/tt_website/images/question.jpeg" style="max-height:250px;" /></center>`;
                    document.getElementById('title').innerHTML = `<h1 style="text-align:center;color:`+color+`">Page Not Found</h1>`;
                }
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

//function test_ledger(val){
//    for(i=0;i<val;i++){
//        $.ajax({
//           type: "POST",
//           url: "/webservice/content",
//           headers:{
//                'action': 'test_ledger',
//           },
//           data: {
//                'signature': signature,
//                'value': parseInt(100000+parseInt(i)+ new Date().toString().split(' ')[4].split(':')[2]*1000)
//           },
//           success: function(msg) {
//            console.log(msg);
//           },
//           error: function(XMLHttpRequest, textStatus, errorThrown) {
//
//           },timeout: 60000
//        });
//    }
//}

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
    check_available_dynamic = 0;
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_dynamic_page',
       },
       data: {},
       success: function(msg) {
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
                        text += `<option value=`+counter+` select>`+msg.result.response[i].sequence+`. `+msg.result.response[i].title+`</option>`;
                    }
                }
                else if(type == 'home'){
                    //buat owlcaoursel
                    text = `<div class="owl-carousel-login owl-theme" style="z-index:0;">`;
                    for(i in msg.result.response){
                        if(msg.result.response[i].active == true){
                            check_dynamic = true;
                            text+=`
                            <div class="item" style="margin-top:0px; cursor:unset; margin-bottom:10px; border:1px solid #cdcdcd;">
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
                                                <div class="col-lg-12" style="height:190px;">
                                                    <h6 style="cursor:pointer; font-size:16px; width:fit-content; padding-top:10px; padding-right:5px; font-weight:bold; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" onclick="window.location.href='/page/`+msg.result.response[i].url+`'">`+msg.result.response[i].title+`</h6>
                                                    <div style="padding-top:10px; height:105px;display: block; text-overflow: ellipsis; word-wrap: break-word; overflow: hidden; line-height: 1.8em; font-size:13px;">
                                                        `+msg.result.response[i].body+`
                                                    </div>
                                                    <div style="position:absolute; right:15px; bottom:0px;">
                                                        <button class="primary-btn" style="line-height:34px; padding-left:15px; padding-right:15px;" onclick="window.location.href='/page/`+msg.result.response[i].url+`'">Read More <i class="fas fa-chevron-right"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                            //buat owlcaoursel
                        }
                    }
                    //buat owlcaoursel
                    text+=`</div>`;

                    document.getElementById('owl-login2').innerHTML = text;

                    $('.owl-carousel-login').owlCarousel({
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
                        lazyLoadEager:true,
                        smartSpeed:500,
                        autoplay: false,
                        autoplayTimeout:10000,
                        autoplayHoverPause:false,
                        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
                        responsive:{
                            0:{
                                items:1,
                            },
                            768:{
                                items:2,
                            },
                            992:{
                                items:4,
                            }
                        }
                    });
                }

                else if(type == 'login'){
                    text = '<div class="row">';
                    for(i in msg.result.response){
                        if(msg.result.response[i].active == true){
                            check_dynamic = true;
                            text+=`
                            <div class="col-lg-12">
                                <div class="information_box">
                                    <div class="single-destination relative" style="margin-bottom:unset;">
                                        <div class="row">
                                            <div class="col-lg-3 col-md-4">
                                                <div class="thumb relative" alt="`+msg.result.response[i].title+`" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:170px; background: white url('`+msg.result.response[i].image_carousel+`'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="window.location.href='/page/`+msg.result.response[i].url+`'">

                                                </div>
                                            </div>
                                            <div class="col-lg-9 col-md-8">
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
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                    text+=`</div>`;

                    if(type == 'login'){
                        document.getElementById('owl-login').innerHTML = text;
//                        document.getElementById('owl-login2').innerHTML = text;

                        if(check_dynamic){
                            check_available_dynamic = 1;
                        }
                        get_social('login');
                    }
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
        document.getElementById('page_active').checked = dynamic_page[page_number].active;
        document.getElementById('title_dynamic_page').value = dynamic_page[page_number].title;
        if(dynamic_page[page_number].hasOwnProperty('sequence'))
            document.getElementById('sequence_dynamic_page').value = dynamic_page[page_number].sequence;
        document.getElementById('delete_page').hidden = false;
        document.getElementById('page_url').value = dynamic_page[page_number].url;
        if(dynamic_page[page_number].image_paragraph != '/media/'+window.location.hostname+'/image_dynamic/'){
            document.getElementById("dynamic_img").src = dynamic_page[page_number].image_carousel;
        }else{
            document.getElementById("dynamic_img").src = '/static/tt_website/images/no pic/no-image-available.jpg';
        }
        console.log(dynamic_page[page_number]);
        CKEDITOR.instances.editor.setData(dynamic_page[page_number].body);
    }else{
        document.getElementById('page_active').checked = false;
        document.getElementById('title_dynamic_page').value = '';
        document.getElementById('delete_page').hidden = true;
        document.getElementById('page_url').value = '';
        document.getElementById("dynamic_img").src = '/static/tt_website/images/no pic/no-image-available.jpg';
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
    heading = document.getElementById('payment_information_heading').value;
    document.getElementById('editor_payment_information_test').innerHTML = `
    <br/>
    <div class="row" style="padding:0px 15px;">
        <div class="col-lg-12" style="cursor:pointer; background:#FFFFFF; border:1px solid #cdcdcd; padding:15px; display:block;" id="up_payment_information" onclick="div_dropdown('payment_information');">
            <div class="row">
                <div class="col-lg-12" style="display: flex;align-items: center;">
                    <h5 class="single_border_custom_left" style="padding-left:10px;"><img style="width:auto; height:50px;" alt="Logo" src=""><b style="padding-left:10px;">`+heading+`</b>
                        <b style="padding-left:10px;padding-right:10px; color:#F15A22">
                            <i class="fas fa-chevron-up"></i>
                        </b>
                    </h5>
                </div>
            </div>
        </div>
        <div class="col-lg-12 mb-3" style="cursor:pointer; background:#FFFFFF; border:1px solid #cdcdcd; padding:15px; display:none;" id="down_payment_information" onclick="div_dropdown('payment_information');">
            <div class="row">
                <div class="col-lg-12" style="display: flex;align-items: center;">
                    <h5 class="single_border_custom_left" style="padding-left:10px;"><img style="width:auto; height:50px;" alt="Logo" src=""><b style="padding-left:10px;">`+heading+`</b>
                        <b style="padding-left:10px;padding-right:10px; color:#F15A22">
                            <i class="fas fa-chevron-down"></i>
                        </b>
                    </h5>
                </div>
            </div>
        </div><div class="col-lg-12 mb-3" style="background:white; border:1px solid #cdcdcd; padding:15px; display:block;" id="div_payment_information">
        <div class="row">
            <div class="col-lg-12 mb-1">
                <h4 class="mb-2">Your Virtual Account</h4>
                <b style="color:#F15A22; font-size:20px; padding-right:5px;">[%automatic from data%]</b>
                <span onclick="copy_value('[%automatic from data%]');" style="cursor:pointer; font-weight:500;color:#F15A22; font-size:14px;">
                    COPY <i class="fas fa-copy"></i>
                </span>

                <hr>
                <strong>Fee Top Up (exclude bank charges): </strong><br>
                <span>[%automatic from data%]</span>
            </div>
                <div style="margin:0px 15px; width:100%;">
                    <div class="col-lg-12" style="background:#f7f7f7; border:1px solid #cdcdcd; padding:15px;">
                        <strong>Description: </strong><br>
                        [%automatic from data%]
                    </div>
                </div>
                <div style="margin:0px 15px; width:100%;">
                    <div class="col-lg-12" style="background:#f7f7f7; border:1px solid #cdcdcd; padding:15px;">
                        <strong>Guide: </strong><br>
                        ` + CKEDITOR.instances['body_payment_information'].getData() + `

                    </div>
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
    page_url = document.getElementById('page_url').value;
    error_log = '';
    if(document.getElementById('title_dynamic_page').value == ''){
        error_log += 'Please input title\n';
    }
    if(document.getElementById('sequence_dynamic_page').value == ''){
        error_log += 'Please input sequence\n';
    }
    if(document.getElementById("image_carousel").files.length == 0 && page_number == -1){
        error_log += 'Please input image URL\n';
    }
    if(CKEDITOR.instances.editor.getData() == ''){
        error_log += 'Please HTML\n';
    }
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('active', document.getElementById('page_active').checked);
        formData.append('title', document.getElementById('title_dynamic_page').value);
        formData.append('sequence', document.getElementById('sequence_dynamic_page').value);
        formData.append('page_number', parseInt(page_number));
        formData.append('body', JSON.stringify(CKEDITOR.instances.editor.getData()));
        formData.append('url', page_url);
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
    page_number = parseInt(document.getElementById('page_choose').value) - 1;
    page_url = document.getElementById('page_url').value;
    error_log = '';
    if(error_log == ''){
        var formData = new FormData($('#form_admin').get(0));
        formData.append('page_number', parseInt(page_number));
        formData.append('url', page_url);
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
            document.getElementById("preview_template").innerHTML = `<h6 class="mb-3">Template 1</h6><img src="/static/tt_website/img/preview/HomeTemplate1.png" alt="Preview Template 1" style="max-width:600px; height:auto; border:1px solid #cdcdcd;"/>`;
        }else if(value_template == 2){
            document.getElementById("preview_template").innerHTML = `<h6 class="mb-3">Template 2</h6><img src="/static/tt_website/img/preview/HomeTemplate2.png" alt="Preview Template 2" style="max-width:600px; height:auto; border:1px solid #cdcdcd;"/>`;
        }else if(value_template == 3){
            document.getElementById("preview_template").innerHTML = `<h6 class="mb-3">Template 3</h6><img src="/static/tt_website/img/preview/HomeTemplate3.png" alt="Preview Template 3" style="max-width:600px; height:auto; border:1px solid #cdcdcd;"/>`;
        }else if(value_template == 4){
            document.getElementById("preview_template").innerHTML = `<h6 class="mb-3">Template 4</h6><img src="/static/tt_website/img/preview/HomeTemplate4.png" alt="Preview Template 4" style="max-width:600px; height:auto; border:1px solid #cdcdcd;"/>`;
        }else if(value_template == 5){
            document.getElementById("preview_template").innerHTML = `<h6 class="mb-3">Template 5</h6><img src="/static/tt_website/img/preview/HomeTemplate5.png" alt="Preview Template 5" style="max-width:600px; height:auto; border:1px solid #cdcdcd;"/>`;
        }else if(value_template == 6){
            document.getElementById("preview_template").innerHTML = `<h6 class="mb-3">Template 6</h6><img src="/static/tt_website/img/preview/HomeTemplate6.png" alt="Preview Template 6" style="max-width:600px; height:auto; border:1px solid #cdcdcd;"/>`;
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

    //nama website
    document.getElementById("preview_lamp").innerHTML = ""+document.getElementById("website_name").value;
    document.getElementById("preview_lamp").style = "font-size:50px; text-shadow: 0 0 5px #"+login_color+", 0 0 15px #"+login_color+", 0 0 20px #"+login_color+", 0 0 40px #"+login_color+", 0 0 60px transparent, 0 0 10px "+login_color+", 0 0 98px transparent;";
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
    document.getElementById("preview_button_btnlg").style = "background-color: #"+btn_color+ "!important; color:#"+txt_color+" !important; border:1px solid #"+txt_color+" !important; margin-bottom:5px; margin-top:5px; height: 43px;";
    document.getElementById("preview_button_search").style = "background-color: #"+btn_color+ "!important; color:#"+txt_color+" !important;";

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

    //title
    document.getElementById("preview_text_extxt_title").style = "border-left:5px solid #"+btn_color+ "!important; padding-left:10px;";
    document.getElementById("preview_text_exdiv_titlebox").style = "background: #"+btn_color+ "!important; border:1px solid #cdcdcd; padding:15px;";
    document.getElementById("preview_text_extxt_titlebox").style = "color: #"+txt_color+ "!important;";

    //change font + text color
    value_font = String(document.getElementById("font").value);
    text_font = String($('#font option:selected').text());

    if(value_font != ""){
        var junction_font_prev = new FontFace(text_font, 'url(/static/tt_website/custom_font/'+value_font+')');
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

            document.getElementById("preview_text_search").style = "font-family: "+text_font+ ", Arial !important; color:#"+txt_color+";";
            document.getElementById("preview_input_search").style = "font-family: "+text_font+ ", Arial !important;";
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

        document.getElementById("preview_text_search").style = "font-family: "+text_font+ " !important; color:#"+txt_color+";";
        document.getElementById("preview_input_search").style = "font-family: "+text_font+ " !important;";
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
    var preview_btn = document.getElementById(prev+'_btn');

    if (preview.style.display === "none") {
        preview.style.display = "block";
        preview_btn.innerHTML = 'Hide Preview <i class="fas fa-eye-slash"></i>';
    }
    else {
        preview.style.display = "none";
        preview_btn.innerHTML = 'Preview Your Changes <i class="fas fa-eye"></i>';
    }
}

function preview_show_hide_example(prev){
    var preview = document.getElementById(prev);
    var preview_btn = document.getElementById(prev+'_btn');

    if (preview.style.display === "none") {
        preview.style.display = "block";
        preview_btn.innerHTML = 'Hide <i class="fas fa-eye-slash"></i>';
    }
    else {
        preview.style.display = "none";
        preview_btn.innerHTML = 'Info <i class="fas fa-info-circle"></i>';
    }
}

function get_notif_train(page=""){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_notification_train',
       },
       data: {},
       success: function(msg) {
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
               is_user_exist = false;
               for(i in req_obj.approvals)
               {
                    if (user_login.co_customer_seq_id == req_obj.approvals[i].approved_cust_seq_id)
                    {
                        is_user_exist = true;
                    }
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
                    if (req_obj.state == 'cancel' || req_obj.state == 'approved' || req_obj.state == 'rejected' || user_login.co_hierarchy_sequence >= req_obj.current_approval_sequence || is_user_exist == true)
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

function get_url_image_file(url, id, element){
    if(element == 'img'){
        document.getElementById(id).src = url;
    }else if(element == 'background_image'){
        document.getElementById(id).style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url('"+url+"')";
    }
}

function get_agent_currency_rate(){
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'get_agent_currency_rate',
       },
       data: {
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                currency_rate_data = msg;
                if(document.URL.split('/')[document.URL.split('/').length-1] == 'page_admin'){
                    if(currency_rate_data.result.is_show){
                        document.getElementById('is_show_estimate_price').checked = true;
                        document.getElementById('other_currency').style.display = 'block';
                    }else{
                        document.getElementById('is_show_estimate_price').checked = false;
                        document.getElementById('other_currency').style.display = 'none';
                    }
                    text = '';
                    if(msg.result.response.currency_list.length > 0)
                        text = `<table>
                                    <tr>
                                        <td style="width:10%">No</td>
                                        <td style="width:30%">Currency</td>
                                        <td style="width:30%">Is Show</td>
                                    </tr>`;
                    counter_table = 1;
                    for(i in msg.result.response.currency_list){
                        text += `
                                    <tr>
                                        <td>`+counter_table+`</td>
                                        <td>`+msg.result.response.currency_list[i]+`</td>
                                        <td>
                                            <div class="input-container-search-ticket">
                                                <label class="check_box_custom">
                                                    <input type="checkbox" id="is_show_currency_`+counter_table+`" name="is_show_currency_`+counter_table+`" value="`+msg.result.response.currency_list[i]+`" `;
                        if(msg.result.is_show_provider.includes(msg.result.response.currency_list[i]))
                            text += `checked`;
                        text +=`/>
                                                    <span class="check_box_span_custom"></span>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>`;
                        counter_table++;
                    }
                    if(text)
                        text += '</table>'
                    document.getElementById('other_currency').innerHTML = text;
                }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error get currency </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function show_currency(){
    if(document.getElementById('is_show_estimate_price').checked)
        document.getElementById('other_currency').style.display = 'block';
    else
        document.getElementById('other_currency').style.display = 'none';
}

function update_estimate_price(){
    request_data = [];
    counter_table = 1;
    for(i in currency_rate_data.result.response.currency_list){
        if(document.getElementById('is_show_currency_'+counter_table).checked)
            request_data.push(document.getElementById('is_show_currency_'+counter_table).value);
        counter_table++;
    }
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'update_estimate_price',
       },
       data: {
           'signature': signature,
           'is_show_estimate_price': document.getElementById('is_show_estimate_price').checked,
           'is_show_breakdown_price': document.getElementById('is_show_breakdown_price').checked,
           'provider': JSON.stringify(request_data)
       },
       success: function(msg) {
           if(msg.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Updated!',
                  html: 'Currency',
                })
                get_agent_currency_rate();
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error save currency </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}