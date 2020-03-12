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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error update banner </span>' + errorThrown,
            })
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error inactive delete banner </span>' + errorThrown,
            })
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
                            <div class="item dark-img">
                                <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="max-height:360px;"/>
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
                                                        <img src="`+msg.result.response[i].url+`" value="`+msg.result.response[i].seq_id+`" id="`+type+i+`_image" style="max-height:360px; width:auto;"/>
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
                                loop:true,
                                nav: true,
                                rewind: true,
                                margin: 20,
                                responsiveClass:true,
                                dots: false,
                                lazyLoad:true,
                                merge: false,
                                smartSpeed:500,
                                center: true,
                                autoHeight: true,
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
                                        items:2,
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

                            $("#myModalPromotion").modal('show');
                        }
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error banner </span>' + errorThrown,
            })
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
