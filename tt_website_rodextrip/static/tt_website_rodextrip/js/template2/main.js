$lengthimg = $("#length-img").val();
$(document).ready(function() {
    //------- Owl Carusel  js --------//
    var current=0;
    var check_counter_idx = 0;
    var check_video_play = 0;
    var check_video_slider = 0;

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


    //click
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
});
