$(document).ready(function(){

    $('.owl-carousel-login').owlCarousel({
        loop:true,
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
                nav:true
            },
            480:{
                items:1,
                nav:true
            },
            768:{
                items:1,
                nav:false
            },
            961:{
                items:1,
                nav:true,
            }
        }
    });

});