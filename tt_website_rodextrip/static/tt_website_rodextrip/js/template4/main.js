 AOS.init({
 	duration: 800,
 	easing: 'slide',
 	once: true
 });

$lengthimg = $("#length-img").val();

jQuery(document).ready(function($) {

	"use strict";

    try{
        document.getElementById("balance").innerHTML = document.getElementById("balance_mob").innerHTML;
        document.getElementById("credit_limit").innerHTML = document.getElementById("credit_mob").innerHTML;
    }catch(err){}

    if (document.getElementById("default-select")) {
        $('select').niceSelect();
    };
    if (document.getElementById("default-select2")) {
        $('select').niceSelect();
    };
    if (document.getElementById("service-select")) {
        $('select').niceSelect();
    };

    var current=0;
    var check_counter_idx = 0;
    var check_video_play = 0;
    var check_video_slider = 0;

    if( $(window).width() > 992){
        $('#username_pc').show();
        $('#password_pc').show();
        $('#username_mb').hide();
        $('#password_mb').hide();
        $('.forget_password_mobile').hide();
        try{
            document.getElementsByClassName("signup_pc_mb")[0].style.color = text_color;
        }catch(err){
            console.log('err');
        }
    }
    else {
        $('#username_pc').hide();
        $('#password_pc').hide();
        $('#username_mb').show();
        $('#password_mb').show();f
        $('.forget_password_mobile').show();
        try{
            document.getElementsByClassName("signup_pc_mb")[0].style.color = "#212529";
        }catch(err){
            console.log('err');
        }
    }

    $(window).resize(function() {
        if ($(window).width() >= 992) {
            $('#username_pc').show();
            $('#password_pc').show();
            $('#username_mb').hide();
            $('#password_mb').hide();
            $('.forget_password_mobile').hide();
            try{
                document.getElementsByClassName("signup_pc_mb")[0].style.color = text_color;
            }catch(err){
                console.log('err');
            }
        }
        else {
            $('#username_pc').hide();
            $('#password_pc').hide();
            $('#username_mb').show();
            $('#password_mb').show();
            $('.forget_password_mobile').show();
            try{
                document.getElementsByClassName("signup_pc_mb")[0].style.color = "#212529";
            }catch(err){
                console.log('err');
            }

        }
    });

	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
            $this.find('.balance_mobile').replaceWith('<li><a style="color:black;"><span id="balance_mob"></span></a></li>');
            $this.find('.credit_mobile').replaceWith('<li><a style="color:black;"><span id="credit_mob"></span></a></li>');
            try{
                document.getElementById("balance_mob").innerHTML = document.getElementById("balance").innerHTML;
            }catch(err){}
            try{
                document.getElementById("credit_mob").innerHTML = document.getElementById("credit_limit").innerHTML;
            }catch(err){}
		});

		$('.js-clone-nav2').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
            $this.find('.username_mobile').replaceWith('<li style="padding-right:5px; width:300px; margin-bottom:15px;"><div class="input-container-search-ticket"><i class="fa fa-user" style="font-size: 20px;padding-top: 12px; color:'+text_color+';"></i><input type="text" class="form-control" style="height:36px; border-radius:unset; font-size:13px; padding:10px; margin:5px;" id="username" placeholder="Username"/></div></li>');
            $this.find('.password_mobile').replaceWith('<li style="padding-right:5px; width:300px; margin-bottom:15px;"><div class="input-container-search-ticket"><i class="fa fa-lock" style="font-size: 20px;padding-top: 12px; color:'+text_color+';"></i><input type="password" class="form-control" style="height:36px; border-radius:unset; font-size:13px; padding:10px; margin:5px;" id="password" placeholder="Password"/></div><div style="position:absolute; text-align:right;"><label class="check_box_custom" style="margin:5px;"><span style="font-size:13px; color:'+text_color+';">Keep Me Signin</span><input type="checkbox" value="" id="keep_me_signin" name="keep_me_signin" checked="checked"><span class="check_box_span_custom"></span></label><span style="cursor:pointer; padding-left:7px; font-size:13px; color:'+text_color+';" onclick="reset_password_btc();"><i class="fa fa-lock" style="font-size: 13px;padding-top: 8px;"></i> Forget Password</span></div></li>');
		});
		//$this.find('.forget_password_mobile').replaceWith('<li style="padding-right:5px;"><a style="cursor:pointer; text-transform: unset; padding:0px 5px; color:'+text_color+';" onclick="reset_password_btc();"><i class="fa fa-lock" style="font-size: 20px;padding-top: 12px;"></i> Forgot Password</a></li>');

		setTimeout(function() {
			
			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);
        
        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

    $('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();  
      
    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {

				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	}; 
	siteMenuClone();


	var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();


	var siteSliderRange = function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	};
	// siteSliderRange();


	var siteMagnificPopup = function() {
		$('.image-popup').magnificPopup({
	    type: 'image',
	    closeOnContentClick: true,
	    closeBtnInside: false,
	    fixedContentPos: true,
	    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
	     gallery: {
	      enabled: true,
	      navigateByImgClick: true,
	      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
	    },
	    image: {
	      verticalFit: true
	    },
	    zoom: {
	      enabled: true,
	      duration: 300 // don't foget to change the duration also in CSS
	    }
	  });

	  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
	    disableOn: 700,
	    type: 'iframe',
	    mainClass: 'mfp-fade',
	    removalDelay: 160,
	    preloader: false,

	    fixedContentPos: false
	  });
	};
	siteMagnificPopup();


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


//	var siteCarousel = function () {
//		if ( $('.nonloop-block-13').length > 0 ) {
//			$('.nonloop-block-13').owlCarousel({
//		    center: false,
//		    items: 1,
//		    loop: true,
//				stagePadding: 10,
//		    margin: 30,
//		    smartSpeed: 1000,
//		    autoplay:true,
//				autoplayTimeout:1000,
//				autoplayHoverPause:false,
//
//		    nav: true,
//				navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">'],
//		    responsive:{
//	        600:{
//	        	margin: 30,
//	        	nav: true,
//	          items: 2
//	        },
//	        1000:{
//	        	margin: 30,
//	        	nav: true,
//	          items: 3
//	        },
//	        1200:{
//	        	margin: 30,
//	        	nav: true,
//	          items: 4
//	        }
//		    }
//			});
//		}
//
//		$('.slide-one-item').owlCarousel({
//	    center: false,
//	    items: 1,
//	    loop: true,
//			stagePadding: 0,
//			smartSpeed: 1000,
//	    margin: 0,
//	    autoplay: true,
//	    pauseOnHover: false,
//	    nav: true,
//	    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">'],
//	  });
//	};
//	siteCarousel();

	var siteStellar = function() {
		$(window).stellar({
	    responsive: false,
	    parallaxBackgrounds: true,
	    parallaxElements: true,
	    horizontalScrolling: false,
	    hideDistantElements: false,
	    scrollProperty: 'scroll'
	  });
	};
	siteStellar();

	var siteCountDown = function() {

		$('#date-countdown').countdown('2020/10/10', function(event) {
		  var $this = $(this).html(event.strftime(''
		    + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
		    + '<span class="countdown-block"><span class="label">%d</span> days </span>'
		    + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
		    + '<span class="countdown-block"><span class="label">%M</span> min </span>'
		    + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});
				
	};
	siteCountDown();

	var siteDatePicker = function() {

		if ( $('.datepicker').length > 0 ) {
			$('.datepicker').datepicker();
		}

	};
	siteDatePicker();

	var siteRangeSlider = function() {

		$('input[type="range"]').rangeslider({
	    polyfill : false,
	    onInit : function() {
	        this.output = $( '<div class="range-output" />' ).insertAfter( this.$range ).html( this.$element.val() );
	    },
	    onSlide : function( position, value ) {
	        this.output.html( value );
	    }
		});

	};
	siteRangeSlider();
	

});