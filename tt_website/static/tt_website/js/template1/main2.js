$lengthimg = $("#length-img").val();

$(document).ready(function() {
    "use strict";
    var window_width = $(window).width(),
        window_height = window.innerHeight,
        header_height = $(".default-header").height(),
        header_height_static = $(".site-header.static").outerHeight(),
        fitscreen = window_height - header_height;

    $(".fullscreen").css("height", window_height)
    $(".fitscreen").css("height", fitscreen);

    var current=0;
    var check_counter_idx = 0;
    var check_video_play = 0;
    var check_video_slider = 0;
    // ------- Datepicker  js --------//



//      $( function() {
//        $( ".date-picker" ).datepicker({
//            dateFormat: 'dd M yy',
//            minDate: new Date(),
//            numberOfMonths: 2,
//        });
//      });
//
//      $( function() {
//        $( ".date-picker-birth" ).datepicker({
//            dateFormat: 'dd M yy',
//            numberOfMonths: 2,
//        });
//      });
//
//      $( function() {
//        $( ".date-picker-passport" ).datepicker({
//            dateFormat: 'dd M yy',
//            numberOfMonths: 2,
//        });
//      });

    //------- Niceselect  js --------//  

    if (document.getElementById("default-select")) {
        $('select').niceSelect();
    };
    if (document.getElementById("default-select2")) {
        $('select').niceSelect();
    };
    if (document.getElementById("service-select")) {
        $('select').niceSelect();
    };

    //------- Lightbox  js --------//  

    $('.img-gal').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    $('.play-btn').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });

    //------- Superfish nav menu  js --------//  

    $('.nav-menu').superfish({
        animation: {
            opacity: 'show'
        },
        speed: 400
    });



    //------- Owl Carusel  js --------//

    $('.owl-carousel').owlCarousel({
        loop:false,
        nav: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        lazyLoadEager:true,
        smartSpeed:500,
        autoplay: false,
        autoplayTimeout:5000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-caret-left owl-wh"/>', '<i class="fa fa-caret-right owl-wh"/>'],
        responsive:{
            0:{
                items:5,
                nav:true
            },
            480:{
                items:5,
                nav:true
            },
            768:{
                items:5,
                nav:true
            },
            961:{
                items:5,
                nav:true
            }
        }
    });

//    $('.owl-carousel-suggest').owlCarousel({
//        loop:false,
//        nav: true,
//        navRewind:true,
//        rewind: true,
//        margin: 20,
//        items:4,
//        responsiveClass:true,
//        dots: true,
//        merge: false,
//        lazyLoad:true,
//        smartSpeed:500,
//        autoplay: false,
//        autoplayTimeout:10000,
//        autoplayHoverPause:false,
//        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
//        responsive:{
//            0:{
//                items:2,
//                nav:true
//            },
//            480:{
//                items:2,
//                nav:true
//            },
//            768:{
//                items:3,
//                nav:true
//            },
//            961:{
//                items:4,
//                nav:true,
//            }
//        }
//    });

    $('.owl-carousel-room-img').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        lazyLoadEager:true,
        merge: false,
        smartSpeed:500,
        autoplay: false,
        autoplayTimeout:8000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:true
            },
            1000:{
                items:1,
                nav:true,
            }
        }
    });

    $('.owl-carousel-hotel').owlCarousel({
        loop:false,
        nav: true,
        navRewind:true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: true,
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
                items:3,
                nav:true
            },
            480:{
                items:4,
                nav:true
            },
            768:{
                items:4,
                nav:true
            },
            961:{
                items:4,
                nav:true,
            }
        }
    });

    $('.owl-carousel-hotel-modal').owlCarousel({
        loop:false,
        nav: false,
        navRewind:true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: true,
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
                items:2,
            },
            480:{
                items:3,
            },
            768:{
                items:5,
            },
            961:{
                items:5,
            }
        }
    });

    $('.owl-carousel-hotel-img').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        lazyLoadEager:true,
        merge: false,
        smartSpeed:500,
        autoplay: false,
        autoplayTimeout:8000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:true
            },
            1000:{
                items:1,
                nav:true,
            }
        }
    });

    $('.owl-carousel-hotel-img-modal').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        lazyLoadEager:true,
        merge: false,
        smartSpeed:500,
        autoplay: false,
        autoplayTimeout:8000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:true
            },
            1000:{
                items:1,
                nav:true,
            }
        }
    });

//    $('.owl-carousel-banner').owlCarousel({
//        loop:true,
//        nav: true,
//        rewind: false,
//        margin: 20,
//        responsiveClass:true,
//        dots: true,
//        lazyLoad:true,
//        merge: true,
//        smartSpeed:500,
//        center: true,
//        autoHeight: false,
//        autoWidth: false,
//        autoplay: true,
//        autoplayTimeout:10000,
//        autoplayHoverPause:false,
//        navText: ['<i class="fas fa-chevron-left owl-wh"/>', '<i class="fas fa-chevron-right owl-wh"/>'],
//        responsive:{
//            0:{
//                items:1,
//                nav:true,
//                center: false,
//                autoWidth: false,
//            },
//            600:{
//                items:1,
//                nav:true,
//                center: false,
//                autoWidth: false,
//            },
//            1000:{
//                items:1,
//                nav:true,
//            }
//        }
//    });

    $('.active-hot-deal-carusel').owlCarousel({
        items:1,
        loop:true,
        autoplay:false,
        autoplayHoverPause: true,
        lazyLoad:true,
        lazyLoadEager:true,
        smartSpeed:500,
        margin: 20,
        navText: ['<i class="fa fa-chevron-left"/>', '<i class="fa fa-chevron-right"/>'],
        dots: true
    });

    $('.active-hotel').owlCarousel({
        items:5,
        loop:true,
        autoplay:false,
        autoplayHoverPause: true,
        lazyLoad:true,
        lazyLoadEager:true,
        margin: 20,
        smartSpeed:500,
        navText: ['<i class="fa fa-chevron-left"/>', '<i class="fa fa-chevron-right"/>'],
        dots: true
    });

    $('.active-testimonial').owlCarousel({
        items: 2,
        loop: true,
        margin: 30,
        autoplayHoverPause: true,
        lazyLoad:true,
        lazyLoadEager:true,
        smartSpeed:500,
        dots: true,
        autoplay: true,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 1,
            },
            992: {
                items: 2,
            }
        }
    });

    $('.active-recent-blog-carusel').owlCarousel({
        items: 3,
        loop: true,
        nav: true,
        margin: 30,
        dots: false,
        merge:true,
//            autoWidth:true,
        autoplayHoverPause: true,
        lazyLoad:true,
        lazyLoadEager:true,
        smartSpeed:500,
        autoplay: true,
        navText: ['<i class="fa fa-chevron-left"/>', '<i class="fa fa-chevron-right"/>'],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 1,
            },
            768: {
                items: 2,
            },
            961: {
                items: 3,
            }
        }
    });

    $('.owl-carousel-hotel-modal').find('.owl-item').eq(current).addClass('owl-bg-border');

    $('.owl-carousel-hotel-modal').on("click", ".owl-item", function(e) {
       e.preventDefault();
       check_counter_idx =0;
       $('.owl-item').each(function() {
          $(this).removeClass("owl-bg-border");
       });
       var number = $(this).index();
       $('.owl-carousel-hotel-img').data("owl.carousel").to(number, 500, true);
       $('.owl-carousel-hotel-img-modal').data("owl.carousel").to(number, 500, true);
       $(this).addClass("owl-bg-border");
       document.getElementById("total_image_hotel").innerHTML = number+1 + " of " + $lengthimg;
       document.getElementById("total_image_hotel-modal").innerHTML = number+1 + " of " + $lengthimg;
     });

    $('.owl-carousel-hotel-img-modal').on('changed.owl.carousel',function(property){
       current = property.item.index;
       var total = property.item.count;
       var check_index = total - current;

       if(current == total-1){
            $('.owl-carousel-hotel-modal').data("owl.carousel").to(total-5, 500, true);
       }
       else{
           if(check_index > 4){
                $('.owl-carousel-hotel-modal').data("owl.carousel").to(current, 500, true);
           }
       }

       $('.owl-carousel-hotel-modal').find('.owl-item').each(function() {
          $(this).removeClass("owl-bg-border");
       });
       $('.owl-carousel-hotel-modal').find('.owl-item').eq(current).addClass('owl-bg-border');
       $('.owl-carousel-hotel-img').trigger('to.owl.carousel', current);
       document.getElementById("total_image_hotel").innerHTML = current+1 + " of " + $lengthimg;
       document.getElementById("total_image_hotel-modal").innerHTML = current+1 + " of " + $lengthimg;
    });

    $('.owl-carousel-hotel-img').on('changed.owl.carousel',function(property){
       current = property.item.index;
       var total = property.item.count;
       var check_index = total - current;

       if(current == total-1){
            $('.owl-carousel-hotel-modal').data("owl.carousel").to(total-5, 500, true);
       }
       else{
           if(check_index > 4){
                $('.owl-carousel-hotel-modal').data("owl.carousel").to(current, 500, true);
           }
       }

       $('.owl-carousel-hotel-modal').find('.owl-item').each(function() {
          $(this).removeClass("owl-bg-border");
       });
       $('.owl-carousel-hotel-modal').find('.owl-item').eq(current).addClass('owl-bg-border');
       $('.owl-carousel-hotel-img-modal').trigger('to.owl.carousel', current);
       document.getElementById("total_image_hotel").innerHTML = current+1 + " of " + $lengthimg;
       document.getElementById("total_image_hotel-modal").innerHTML = current+1 + " of " + $lengthimg;
    });

    //    $('.owl-carousel-hotel').find('.owl-item').eq(current).addClass('owl-bg-border');
    //
    //    $('.owl-carousel-hotel').on("click", ".owl-item", function(e) {
    //       e.preventDefault();
    //       check_counter_idx =0;
    //       $('.owl-item').each(function() {
    //          $(this).removeClass("owl-bg-border");
    //       });
    //       var number = $(this).index();
    //       $('.owl-carousel-hotel-img').data("owl.carousel").to(number, 500, true);
    //       $(this).addClass("owl-bg-border");
    //     });

    $('.zoom-img').wrap('<span style="display:inline-block"></span>').css('display', 'block').parent().zoom({ on:'click' });
    //------- Mobile Nav  js --------//

    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({
            id: 'mobile-nav'
        });
        $mobile_nav.find('> ul').attr({
            'class': '',
            'id': ''
        });
        $('body .main-menu .container').append($mobile_nav);
        $('body .main-menu .container').prepend('<button type="button" id="mobile-nav-toggle"><i class="lnr lnr-menu lnr_color"></i></button>');
        $('body .main-menu .container').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.balance_mobile').replaceWith('<li style="margin-bottom:0px;"><a style="padding-bottom:0px;"><span id="balance_mob"></span></a></li>');
        $('#mobile-nav').find('.credit_mobile').replaceWith('<li style="margin-bottom:0px;"><a style="padding-bottom:0px;"><span id="credit_mob"></span></a></li>');
        $('#mobile-nav').find('.customer_parent_balance_mobile').replaceWith('<li style="margin-bottom:0px;"><a style="padding-bottom:0px;"><span id="customer_parent_balance_mob"></span></a></li>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="lnr lnr-chevron-down"></i>');
        try{
            if(document.getElementById("balance_mob") && document.getElementById("balance"))
                document.getElementById("balance_mob").innerHTML = document.getElementById("balance").innerHTML;
            if(document.getElementById("credit_mob") && document.getElementById("credit_limit"))
                document.getElementById("credit_mob").innerHTML = document.getElementById("credit_limit").innerHTML;
            if(document.getElementById("customer_parent_balance_mob") && document.getElementById("customer_parent_balance"))
                document.getElementById("customer_parent_balance_mob").innerHTML = document.getElementById("customer_parent_balance").innerHTML;
        }catch(err){
            console.log(err) //ada element yg tidak ada
        }

        $(document).on('click', '.menu-has-children i', function(e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("lnr-chevron-up lnr-chevron-down");
        });

        $(document).on('click', '.menu-has-children a', function(e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).parent().find('i').first().toggleClass("lnr-chevron-up lnr-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function(e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
            $('#mobile-body-overly').toggle();
        });

        $(document).on('click', function(e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });

        $(window).resize(function() {
            if ($(window).width() > 991) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
                    $('#mobile-body-overly').fadeOut();
                }

            }
            else{

            }
        });

    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    //------- Smooth Scroll  js --------//

    $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            if (target.length) {
                var top_space = 0;

                if ($('#header').length) {
                    top_space = $('#header').outerHeight();

                    if (!$('#header').hasClass('header-fixed')) {
                        top_space = top_space;
                    }
                }

                $('html, body').animate({
                    scrollTop: target.offset().top - top_space
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu').length) {
                    $('.nav-menu .menu-active').removeClass('menu-active');
                    $(this).closest('li').addClass('menu-active');
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('lnr-times lnr-bars');
                    $('#mobile-body-overly').fadeOut();
                }
                return false;
            }
        }
    });

    $(document).ready(function() {

        $('html, body').hide();

        if (window.location.hash) {

            setTimeout(function() {

                $('html, body').scrollTop(0).show();

                $('html, body').animate({

                    scrollTop: $(window.location.hash).offset().top - 108

                }, 1000)

            }, 0);

        } else {

            $('html, body').show();

        }

    });


    jQuery(document).ready(function($) {
        // Get current path and find target link
        var path = window.location.pathname.split("/").pop();

        // Account for home page with empty path
        if (path == '') {
            path = 'index.html';
        }

        var target = $('nav a[href="' + path + '"]');
        // Add active class to target link
        target.addClass('menu-active');
    });

    $(document).ready(function() {
        if ($('.menu-has-children ul>li a').hasClass('menu-active')) {
            $('.menu-active').closest("ul").parentsUntil("a").addClass('parent-active');
        }
    });




    //------- Header Scroll Class  js --------//  

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
        } else {
            $('#header').removeClass('header-scrolled');
        }
    });


    //------- Mailchimp js --------//  

    $(document).ready(function() {
        $('#mc_embed_signup').find('form').ajaxChimp();
    });

});

function go_to_owl_carousel(counter){
    $('.owl-carousel-hotel-img').trigger('to.owl.carousel', counter-1);
    $('.owl-carousel-hotel-img-modal').trigger('to.owl.carousel', counter-1);

    var temp_counter = counter - 1;
    var check_index = $lengthimg - counter;

    if(temp_counter == $lengthimg-1){
        $('.owl-carousel-hotel-modal').data("owl.carousel").to($lengthimg-5, 500, true);
    }
    else{
        if(check_index > 4){
             $('.owl-carousel-hotel-modal').data("owl.carousel").to(temp_counter, 500, true);
        }
    }

    document.getElementById("total_image_hotel").innerHTML = counter + " of " + $lengthimg;
}


//$('#ex1').zoom();
//$('#ex2').zoom({ on:'grab' });
//$('#ex3').zoom({ on:'click' });
//$('#ex4').zoom({ on:'toggle' });