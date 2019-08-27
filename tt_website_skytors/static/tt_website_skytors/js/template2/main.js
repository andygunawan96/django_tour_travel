$(document).ready(function() {
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
});
