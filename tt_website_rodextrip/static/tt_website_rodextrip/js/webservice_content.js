function update_banner(){
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
            }
       },
       contentType:false,
       processData:false,
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error update banner </span>' + errorThrown,
                })
            }
       }
    });
}

function set_inactive_delete_banner(){
    img = [];
    //big banner
    try{
        for(i=0; i<1000; i++){
            if(document.getElementById('big_banner'+i+'_active').checked == false)
                img.push({
                    'seq_id': document.getElementById('big_banner'+i+'_image').getAttribute('value'),
                    'action': 'active',
                    'type': 'big_banner'
                })
            if(document.getElementById('big_banner'+i+'_delete').checked == true)
                img.push({
                    'seq_id': document.getElementById('big_banner'+i+'_image').getAttribute('value'),
                    'action': 'delete',
                    'type': 'big_banner'
                })
        }
    }catch(err){

    }
    //small banner
    try{
        for(i=0; i<1000; i++){
            if(document.getElementById('small_banner'+i+'_active').checked == false)
                img.push({
                    'seq_id': document.getElementById('small_banner'+i+'_image').getAttribute('value'),
                    'action': 'active',
                    'type': 'small_banner'
                })
            if(document.getElementById('small_banner'+i+'_delete').checked == true)
                img.push({
                    'seq_id': document.getElementById('small_banner'+i+'_image').getAttribute('value'),
                    'action': 'delete',
                    'type': 'small_banner'
                })
        }
    }catch(err){

    }
    //promotion banner
    try{
        for(i=0; i<1000; i++){
            if(document.getElementById('promotion'+i+'_active').checked == false)
                img.push({
                    'seq_id': document.getElementById('promotion'+i+'_image').getAttribute('value'),
                    'action': 'active',
                    'type': 'promotion_banner'
                })
            if(document.getElementById('promotion'+i+'_delete').checked == true)
                img.push({
                    'seq_id': document.getElementById('promotion'+i+'_image').getAttribute('value'),
                    'action': 'delete',
                    'type': 'promotion_banner'
                })
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
                document.getElementById('form_admin').submit();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error inactive delete banner </span>' + errorThrown,
                })
            }
       }
    });
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
                        text+=`<div class="owl-carousel-banner owl-theme">`;
                        for(i in msg.result.response){
                            text+=`
                            <div class="item">
                                <center>
                                    <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="height:360px;"/>
                                </center>
                            </div>`;
                        }
                        text+=`</div>`;
                    }else if(type == 'small_banner'){
                        if(template == 1){
                            text+=`
                            <section class="popular-destination-area section-gap" style="z-index:0; position:relative;">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="menu-content">
                                                <div class="title text-center">
                                                    <h2>HOT DEALS</h2>
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
                                                            <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image"/>
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
                            <section class="roberto-service-area" style="background:white;">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <div class="section-heading text-center wow fadeInUp" data-wow-delay="100ms" style="margin-bottom:20px;">
                                                <h2>HOT DEALS</h2>
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
                                                            <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image"/>
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
                                                            <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image"/>
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
                            <div class="site-section bg-light">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="row justify-content-center mb-5">
                                                <div class="col-md-7 text-center border-primary">
                                                    <h2 class="font-weight-light text-primary" style="color:black !important">HOT DEAL</h2>
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
                                                            <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image"/>
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
                                                    <h2>HOT DEALS</h2>
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
                                                            <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image"/>
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
                        text+=`
                        <div class="modal fade" id="myModalPromotion" role="dialog">
                            <div class="modal-dialog">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-12">
                                            <center>
                                                <h2 class="modal-title animated pulse infinite" style="color:#ffffff;"> PROMOTIONS! </h2>
                                            </center>
                                        </div>
                                        <div class="col-lg-12">
                                            <center>
                                                <span data-dismiss="modal" style="color:#ffffff;font-weight:bold;">Click everywhere to close! X</span>
                                            </center>
                                        </div>
                                        <div class="col-lg-12">`;
                                            text+=`<div class="owl-carousel-promotion owl-theme">`;
                                            for(i in msg.result.response){
                                                text+=`
                                                <div class="item">
                                                    <center>
                                                        <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="max-width:500px; max-height:500px;"/>
                                                    </center>
                                                </div>`;
                                            }
                                            text+=`</div>`;
                                        text+=`
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                }else if(page == 'admin'){
                    //<img src="`+msg.result.response[i].url+`" id="`+msg.result.response[i].seq_id+`" style="height:220px;width:auto"/>
                    text+=`<div class="row">`;
                    for(i in msg.result.response){
                        text += `
                        <div class="col-lg-6" style="margin-bottom:25px;">
                            <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="height:220px;width:auto;" />
                            <div class="row">
                                <div class="col-lg-6">
                                    <label class="check_box_custom">
                                        <span style="font-size:13px;color:`+text_color+`;">Active</span>
                                        <input type="checkbox" value="" id="`+type+i+`_active" name="`+type+i+`_active"`;
                                        if(msg.result.response[i].active == true)
                                            text+=` checked`;
                                        text+=`>
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                                <div class="col-lg-6">
                                    <label class="check_box_custom">
                                        <span style="font-size:13px;color:`+text_color+`;">Delete</span>
                                        <input type="checkbox" value="" id="`+type+i+`_delete" name="`+type+i+`_delete">
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                    text+=`</div>`;
                }
                document.getElementById(type).innerHTML = text;
                if(page == 'home'){
                    if(msg.result.response.length > 0){
                        if(type == 'big_banner'){
                            $('.owl-carousel-banner').owlCarousel({
                                loop:false,
                                nav: true,
                                rewind: true,
                                margin: 20,
                                responsiveClass:true,
                                dots: true,
                                lazyLoad:true,
                                merge: true,
                                smartSpeed:500,
                                center: true,
                                autoHeight: false,
                                autoWidth: false,
                                autoplay: false,
                                autoplayTimeout:8000,
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

                            if(template != 2){
                                $("#myModalPromotion").modal('show');
                            }else{
                                $("#myModalPromotion").modal();
                            }
                        }
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error banner </span>' + errorThrown,
                })
            }
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
            var html = "<img src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
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
            var html = "<img src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
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
            var html = "<img src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
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
                document.getElementById('container').innerHTML = msg.result.response.body;
                document.getElementById('header_page').innerHTML = `<h3 style="text-align:center;color:`+color+`">`+msg.result.response.title+`</h3><img src="`+msg.result.response.image_carousel+`" style="height:30vh;" alt="" title="" />`;

            }else{
                document.getElementById('container').innerHTML = 'Page not found';
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error update banner </span>' + errorThrown,
                })
            }
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
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error update banner </span>' + errorThrown,
                })
            }
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
                else if(type == 'login'){
                    console.log('lala');
                    text = `
                    <div class="owl-carousel-login owl-theme">`;
                    for(i in msg.result.response){
                        if(msg.result.response[i].state == true){
                            text+=`
                            <div class="item" style="text-align:center;" onclick="window.location.href='/page/`+msg.result.response[i].title.split(' ').join('')+`'">
                                <center>
                                    <img class="img-fluid" style="height:360px; width:auto;" src="`+msg.result.response[i].image_carousel+`" alt="">
                                </center>
                                <span style="background-color:`+color+`; padding:5px 15px 15px 15px; width:100%; font-size:16px; color:`+text_color+`">`+msg.result.response[i].title+`</span>
                            </div>`;
                        }
                    }
                    text+=`
                    </div>`;

                    document.getElementById('owl-login').innerHTML = text;
                    document.getElementById('owl-login2').innerHTML = text;
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
                        autoplay: true,
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
                if(template == 2){
                    $('#page_choose').niceSelect();
                }else {
                    $('#page_choose').niceSelect("update");
                }
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error update banner </span>' + errorThrown,
                })
            }
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
    document.getElementById('editor_test').innerHTML = CKEDITOR.instances.editor.getData()
}

function update_dynamic_page(){
    var radios = document.getElementsByName('page');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            page_choose = radios[j].value;
            page_number = j-1;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
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
        formData.append('page', document.getElementById('page_choose').value);
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
                if(XMLHttpRequest.status == 500){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error update dynamic page </span>' + errorThrown,
                    })
                }
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