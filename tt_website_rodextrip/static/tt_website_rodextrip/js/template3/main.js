$lengthimg = $("#length-img").val();
$(document).ready(function(){
	"use strict";

    var current=0;
    var check_counter_idx = 0;
    var check_video_play = 0;
    var check_video_slider = 0;

	    //------- Owl Carusel  js --------//

    $('.owl-carousel').owlCarousel({
        loop:true,
        nav: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        smartSpeed:500,
        autoplay: true,
        autoplayTimeout:5000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-caret-left owl-wh"/>', '<i class="fa fa-caret-right owl-wh"/>'],
        responsive:{
            0:{
                items:2,
                nav:true
            },
            480:{
                items:2,
                nav:false
            },
            768:{
                items:3,
                nav:false
            },
            961:{
                items:3,
                nav:true,
                loop:true
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
        nav: true,
        navRewind:true,
        rewind: true,
        margin: 20,
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
                items:3,
                nav:true
            },
            768:{
                items:5,
                nav:true
            },
            961:{
                items:5,
                nav:true,
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
//        loop:false,
//        nav: true,
//        rewind: true,
//        margin: 20,
//        responsiveClass:true,
//        dots: true,
//        lazyLoad:true,
//        merge: false,
//        smartSpeed:500,
//        center: true,
//        autoWidth: true,
//        autoplay: false,
//        autoplayTimeout:8000,
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


    $('.owl-carousel-activity-img').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        video: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        merge: false,
        smartSpeed:1000,
        autoHeight: true,
        autoplay: false,
        autoplayTimeout:6000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:false
            },
            1000:{
                items:1,
                nav:true,
            }
        }
    });

    $('.owl-carousel-activity').owlCarousel({
        loop:false,
        nav: true,
        navRewind:true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: true,
        merge: false,
        lazyLoad:true,
        smartSpeed:1000,
        autoplay: false,
        autoplayTimeout:6000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
        responsive:{
            0:{
                items:4,
                nav:true
            },
            600:{
                items:5,
                nav:true
            },
            1000:{
                items:8,
                nav:true,
            }
        }
    });

    $('.owl-carousel-activity-vid').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        merge: false,
        smartSpeed:500,
        autoplay: false,
        autoplayTimeout:6000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:false
            },
            1000:{
                items:1,
                nav:true,
            }
        }
    });

    $('.active-hot-deal-carusel').owlCarousel({
        items:1,
        loop:true,
        autoplay:false,
        autoplayHoverPause: true,
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

    $('.owl-carousel-activity-img').on('changed.owl.carousel',function(property){
       current = property.item.index;
       var total = property.item.count;
       var check_index = total - current;
       var video = $("#video_activity").get(0);

       if(current != 0){
         if(video != undefined)
             $('#video_activity').get(0).pause();
             $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
         check_video_slider = 1;
       }else{
         check_video_slider = 0;
       }

       if(current == total-1){
            $('.owl-carousel-activity').data("owl.carousel").to(total-5, 500, true);
       }
       else{
           if(check_index > 4){
                $('.owl-carousel-activity').data("owl.carousel").to(current, 500, true);
           }
       }

       $('.owl-carousel-activity').find('.owl-item').each(function() {
          $(this).removeClass("owl-bg-border");
       });
       $('.owl-carousel-activity').find('.owl-item').eq(current).addClass('owl-bg-border');
        //       document.getElementById("total_image_hotel").innerHTML = current+1 + " of " + $lengthimg;
        //       document.getElementById("total_image_hotel-modal").innerHTML = current+1 + " of " + $lengthimg;
    });

    $('.owl-carousel-activity').find('.owl-item').eq(current).addClass('owl-bg-border');
    $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
    $('.owl-carousel-activity').on("click", ".owl-item", function(e) {
       e.preventDefault();
       check_counter_idx =0;
       $('.owl-item').each(function() {
          $(this).removeClass("owl-bg-border");
       });
       var number = $(this).index();
       var video = $("#video_activity").get(0);
       if(number == 0){
        if(check_video_play == 0){
            if(video != undefined){
                video.play();
                $('#icon_video_activity').html("<i class='fas fa-pause-circle' style='font-size:26px;'></i>");
                check_video_play = 1;
            }
        }
        else{
            if(video != undefined){
                video.pause();
                $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
                check_video_play = 0;
            }
        }
       }else{
        if(video != undefined){
            video.pause();
            $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
            check_video_play = 0;
        }
       }
       $('.owl-carousel-activity-img').data("owl.carousel").to(number, 500, true);
       $(this).addClass("owl-bg-border");
     });

     $("#video_activity").click(function() {
        var video = $("#video_activity").get(0);
        if ( video.paused ) {
            if(check_video_slider != 1){
                video.play();
                $('#icon_video_activity').html("<i class='fas fa-pause-circle' style='font-size:26px;'></i>");
            }
        } else {
            video.pause();
            $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
        }
        return false;
    });

    $('#video_activity').bind('play', function (e) {
        $('#video_activity').get(0).play();
        $('#icon_video_activity').html("<i class='fas fa-pause-circle' style='font-size:26px;'></i>");
    });
    $('#video_activity').bind('pause', function (e) {
        $('#video_activity').get(0).pause();
        $('#icon_video_activity').html("<i class='fas fa-play-circle' style='font-size:26px;'></i>");
    });

    $('.zoom-img').wrap('<span style="display:inline-block"></span>').css('display', 'block').parent().zoom({ on:'click' });

	var window_width 	 = $(window).width(),
	window_height 		 = window.innerHeight,
	header_height 		 = $(".default-header").height(),
	header_height_static = $(".site-header.static").outerHeight(),
	fitscreen 			 = window_height - header_height;


	//$(".fullscreen").css("height", window_height-200)
	$(".fitscreen").css("height", fitscreen);

     if(document.getElementById("default-select")){
          $('select').niceSelect();
    };

    $('.img-pop-up').magnificPopup({
        type: 'image',
        gallery:{
        enabled:true
        }
    });

    $('.single-gallery').magnificPopup({
        type: 'image',
        gallery:{
        enabled:true
        }
    });


    //  Counter Js 
     if(document.getElementById("facts-area")){
          $('.counter').counterUp({
          delay: 10,
          time: 1000
       });
     };




  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });


//    $( function() {
//        $( "#datepicker" ).datepicker();
//        $( "#datepicker2" ).datepicker();
//     });
  

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body .main-menu .container .mobile-menu .mobile-nav').append($mobile_nav);
    $('body .main-menu .container .mobile-menu .mobile-nav').prepend('<button type="button" id="mobile-nav-toggle"><i class="lnr lnr-menu"></i></button>');
    $('body .main-menu .container .mobile-menu .mobile-nav').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.balance_mobile').replaceWith('<li><a style="color:white;"><span id="balance_mob"></span></a></li>');
    $('#mobile-nav').find('.credit_mobile').replaceWith('<li><a style="color:white;"><span id="credit_mob"></span></a></li>');
    $('#mobile-nav').find('.username_mobile').replaceWith('<li style="padding-right:5px;"><div class="input-container-search-ticket"><input type="text" class="form-control" style="height:36px; border-radius:unset; font-size:13px; padding:10px; margin:5px;" id="username2" placeholder="Username"/></div></li>');
    $('#mobile-nav').find('.password_mobile').replaceWith('<li style="padding-right:5px;"><div class="input-container-search-ticket"><input type="password" class="form-control" style="height:36px; border-radius:unset; font-size:13px; padding:10px; margin:5px;" id="password2" placeholder="Password"/></div></li>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="lnr lnr-chevron-down"></i>');
    try{
        document.getElementById("balance_mob").innerHTML = document.getElementById("balance").innerHTML;
        document.getElementById("credit_mob").innerHTML = document.getElementById("credit_limit").innerHTML;
    }catch(err){}

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("lnr-chevron-up lnr-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if( ! $('#header').hasClass('header-fixed') ) {
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

        scrollTop: $(window.location.hash).offset().top-62

        }, 1000)

        }, 0);

        }

        else {

        $('html, body').show();

        }

    });
  

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  })


    $('.active-model-carusel').owlCarousel({
        items:1,
        loop:true,
        margin:30,
        dots: true
    });

    $('.active-exibition-carusel').owlCarousel({
        items:3,
        margin:30,
        autoplay:true,
        loop:true,
        dots: true,       
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
            900: {
                items: 3,
            }

        }
    });


       


    //  Start Google map 

            // When the window has finished loading create our google map below

            if(document.getElementById("map")){
            
            google.maps.event.addDomListener(window, 'load', init);
        
            function init() {
                // Basic options for a simple Google Map
                // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
                var mapOptions = {
                    // How zoomed in you want the map to start at (always required)
                    zoom: 11,

                    // The latitude and longitude to center the map (always required)
                    center: new google.maps.LatLng(40.6700, -73.9400), // New York

                    // How you would like to style the map. 
                    // This is where you would paste any style found on Snazzy Maps.
                    styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
                };

                // Get the HTML DOM element that will contain your map 
                // We are using a div with id="map" seen below in the <body>
                var mapElement = document.getElementById('map');

                // Create the Google Map using our element and options defined above
                var map = new google.maps.Map(mapElement, mapOptions);

                // Let's also add a marker while we're at it
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(40.6700, -73.9400),
                    map: map,
                    title: 'Snazzy!'
                });
            }
    }


        $(document).ready(function() {
            $('#mc_embed_signup').find('form').ajaxChimp();
        });      








 });
