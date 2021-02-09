var div_overlay_checked=0;

$(document).ready(function(){
    var sort_price=0;
    var sort_duration=0;
    var sort_departure=0;
    var sort_arrival=0;
    $temp_target = '';
    $temp_type = '';
    $page_number = 1;
    $pagination_type = "default";
    var checking = function() {
      var status = document.getElementById('status');

      if ( navigator.onLine && status.classList.contains('off') ) {
        status.innerHTML = 'You are online';
        status.classList.remove('off');
        status.classList.add('on');
        status.style.display = "block";
        setTimeout(function(){ document.getElementById("status").innerHTML=""; status.classList.remove('off'); status.style.display = "none"; }, 3000);
      }
      if ( ! navigator.onLine && status.classList.contains('on') ) {
        status.innerHTML = 'You are offline';
        status.classList.remove('on');
        status.classList.add('off'); // can't use .replace() because of Chrome
        status.style.display = "block";
      }
    };

    window.addEventListener('online', checking);
    window.addEventListener('offline', checking);

//    var slowLoad = window.setTimeout( function() {
//        alert( "the page is taking its sweet time loading" );
//    }, 10000 );
//
//    window.addEventListener( 'load', function() {
//        window.clearTimeout( slowLoad );
//    }, false );

    //$("html, body").animate({scrollTop: 0}, 1000);
    $("#myModalPopUp").modal('show');

    setTimeout(function(){
        $('.loader-rodextrip').fadeOut();
    }, 1000);

    $("#voucher_discount").bind("keypress", function(e) {
        if (e.keyCode == 13) {
            return false;
        }
    });

    $(window).click(function(e) {
        if ($(".ld-over-full-inverse").hasClass("running")) {
            $(".ld-over-full-inverse").removeClass("running");
        }
        $(".bx-livechat-head").removeAttr("style");
    });

    $(".img-min-ticket").hide();
    $(".img-min-filter").hide();


//    if (user_login.co_user_login == 'agent_b2c'){
//        try{
//            document.getElementsByClassName("tab_custom_login")[0].style.backgroundColor = login_color_base;
//            document.getElementsByClassName("tab_custom_login")[0].style.borderBottom = "unset";
//            if(template == 1 || template == 3 || template == 5){
//                document.getElementsByClassName("lnr_color")[0].style.color = text_color;
//            }
//            if(template == 4){
//                document.getElementsByClassName("site-navbar")[0].style.borderBottom = "unset";
//            }
//        }catch(err){
//            console.log('err');
//        }
//    }


//    $('#A').click(function (e) { //Default mouse Position
//        alert(e.pageX + ' , ' + e.pageY);
//    });

    $(window).scroll(function() {
        if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
            $('#myBtnBTP').fadeIn(200);    // Fade in the arrow
        } else {
            $('#myBtnBTP').fadeOut(200);   // Else fade out the arrow
        }

//        if ($(this).scrollTop() >= $('#change_search_box').height()) {        // If page is scrolled more than 50px
//            $('#change_search_box').hide();    // Fade in the arrow
//        }
    });

    $(window).resize(function() {
        if ($(window).width() >= 992) {
            $('#filter-search-flight').show();
            $('#sorting-search-flight').show();
            $('#copy_selected_mb').show();
            $('#copy_selected_pc').hide();
            $('#filter-search-train').show();
            $('#sorting-search-train').show();
            $('#mybuttonfiltersort').hide();
            $('#copy_selected_pc').hide();
            $("#myModalFilter").modal('hide');
            $("#myModalSort").modal('hide');
//            document.getElementById("filter-search-train").style.display = "block";
//            document.getElementById("sorting-search-train2").style.display = "block";
//            document.getElementById("mybuttonfiltersort").style.display = "none";
        }
        else {
            $('#filter-search-flight').hide();
            $('#sorting-search-flight').hide();
            $('#filter-search-train').hide();
            $('#sorting-search-train').hide();
            $('#mybuttonfiltersort').show();
            $('#copy_selected_mb').hide();
            $('#copy_selected_pc').show();
//            document.getElementById("").style.display = "none";
//            document.getElementById("sorting-search-train2").style.display = "none";
//            document.getElementById("mybuttonfiltersort").style.display = "block";
        }

        if ($(window).width() >= 576) {
            $('.step_itinerary_tour').show();
            $('.row_itinerary_tour').hide();
        }else{
            $('.step_itinerary_tour').hide();
            $('.row_itinerary_tour').show();
        }

        if ($(window).width() >= 768) {
            if($temp_target != '' && $temp_target != ''){
                scroll_menu_horizontal($temp_type, $temp_target);
            }
        }else{
            if($temp_target != '' && $temp_target != ''){
                scroll_menu_horizontal($temp_type, $temp_target);
            }
        }
    });
//    $('.button-search').click(function() {      // When arrow is clicked
//        $('.button-search').addClass("running");
//    });

    $('.loading-button').click(function() {
        $('.loading-button').prop('disabled', true);
        $('.loading-button').addClass("running");
    });

    $('#return-to-top').click(function() {      // When arrow is clicked
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 500);
    });

    $('#div-search-overlay').click(function() {      // When arrow is clicked
        div_overlay_checked += 1;
        document.getElementById("overlay-search-box").style.display = "block";
        document.getElementById("div-search-overlay").style.zIndex = "3";
        if(div_overlay_checked == 1){
            $('html, body').animate({
                scrollTop: $("#div-search-overlay").offset().top - 110
            }, 500);
        }
    });

    $('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

    $('ul.create_tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.create_tabs li').removeClass('current');
		$('.create_tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

    $('ul.edit_tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.edit_tabs li').removeClass('current');
		$('.edit_tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

    $('ul.btn_tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.btn_tabs li').removeClass('current');
		$('.btn_tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

    $('ul.popular1_tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.popular1_tabs li').removeClass('current');
		$('.popular1_tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

    $('ul.popular2_tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.popular2_tabs li').removeClass('current');
		$('.popular2_tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

//    $('#myModalTicketFlight').click(function() {
//
//    });


    $('#sort_by_price').click(function() {
        if (sort_price == 0){
            sort_price = 1;
            sort_duration = 0;
            document.getElementById("img-sort-down-price").style.display = "none";
            document.getElementById("img-sort-up-price").style.display = "block";
        }
        else if (sort_price == 1){
            sort_price = 0;
            document.getElementById("img-sort-down-price").style.display = "block";
            document.getElementById("img-sort-up-price").style.display = "none";
        }
    });

    $('#sort_by_duration').click(function() {
        if (sort_duration == 0){
            sort_duration = 1;
            document.getElementById("img-sort-down-duration").style.display = "none";
            document.getElementById("img-sort-up-duration").style.display = "block";
        }
        else if (sort_duration == 1){
            sort_duration = 0;
            document.getElementById("img-sort-down-duration").style.display = "block";
            document.getElementById("img-sort-up-duration").style.display = "none";
        }
    });

    $('#sort_by_departure').click(function() {
        if (sort_departure == 0){
            sort_departure = 1;
            document.getElementById("img-sort-down-departure").style.display = "none";
            document.getElementById("img-sort-up-departure").style.display = "block";
        }
        else if (sort_departure == 1){
            sort_departure = 0;
            document.getElementById("img-sort-down-departure").style.display = "block";
            document.getElementById("img-sort-up-departure").style.display = "none";
        }
    });

    $('#sort_by_arrival').click(function() {
        if (sort_arrival == 0){
            sort_arrival = 1;
            document.getElementById("img-sort-down-arrival").style.display = "none";
            document.getElementById("img-sort-up-arrival").style.display = "block";
        }
        else if (sort_arrival == 1){
            sort_arrival = 0;
            document.getElementById("img-sort-down-arrival").style.display = "block";
            document.getElementById("img-sort-up-arrival").style.display = "none";
        }
    });

    var quantity_adult_train = parseInt($('#train_adult').val());
    var quantity_infant_train = parseInt($('#train_infant').val());
    $('#show_total_pax_train').text(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant");

    $('.right-plus-adult-train').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#train_adult').val());

        // If is not undefined
        if(quantity < 4){
            $('#train_adult').val(quantity + 1);
            quantity_adult_train = quantity + 1;

            $('#show_total_pax_train').text(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant ");
        }

        if (quantity_adult_train == 4){
            document.getElementById("left-minus-adult-train").disabled = false;
            document.getElementById("right-plus-adult-train").disabled = true;
        }
        else{
            document.getElementById("left-minus-adult-train").disabled = false;
        }
        // Increment

        if (quantity_adult_train > quantity_infant_train){
            document.getElementById("right-plus-infant-train").disabled = false;
        }
    });
    $('.left-minus-adult-train').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#train_adult').val());

        // If is not undefined
        // Increment
        if(quantity > 1){
            $('#train_adult').val(quantity - 1);
            quantity_adult_train = quantity - 1;

            if(quantity_adult_train < quantity_infant_train){
               quantity_infant_train = quantity_adult_train;
               $('#train_infant').val(quantity - 1);
            }

            $('#show_total_pax_train').text(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant ");
        }

        if (quantity_adult_train == 1){
            document.getElementById("left-minus-adult-train").disabled = true;
            document.getElementById("right-plus-adult-train").disabled = false;
        }
        else{
            document.getElementById("right-plus-adult-train").disabled = false;
        }

        if (quantity_adult_train == quantity_infant_train){
            document.getElementById("right-plus-infant-train").disabled = true;
        }
    });
    $('.right-plus-infant-train').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#train_infant').val());

        // If is not undefined
        if (quantity < quantity_adult_train){
            $('#train_infant').val(quantity + 1);
            $("#show_infant_train").text(quantity + 1);
            quantity_infant_train = quantity + 1;

            $('#show_total_pax_train').text(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant ");
        }
        // Increment

//        alert(quantity_infant_train);
//        alert(quantity_adult_train);
        if (quantity_infant_train < quantity_adult_train){
            document.getElementById("left-minus-infant-train").disabled = false;
            document.getElementById("right-plus-infant-train").disabled = false;
        }
        else if(quantity_infant_train == quantity_adult_train){
            document.getElementById("left-minus-infant-train").disabled = false;
            document.getElementById("right-plus-infant-train").disabled = true;
        }
        else{
            document.getElementById("right-plus-infant-train").disabled = true;
            document.getElementById("left-plus-infant-train").disabled = false;
        }
    });
    $('.left-minus-infant-train').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#train_infant').val());

        // If is not undefined
        // Increment
        if(quantity > 0){
            $('#train_infant').val(quantity - 1);
            quantity_infant_train = quantity - 1;

            $('#show_total_pax_train').val(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant ");
        }

        if (quantity_infant_train == 0){
            document.getElementById("left-minus-infant-train").disabled = true;
            document.getElementById("right-plus-infant-train").disabled = false;
        }
        else{
            document.getElementById("right-plus-infant-train").disabled = false;
        }

    });

    var quantity_adult_flight = parseInt($('#adult_flight').val());
    var quantity_child_flight = parseInt($('#child_flight').val());
    var quantity_infant_flight = parseInt($('#infant_flight').val());
    $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");

    $('.right-plus-adult-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_flight').val());

        // If is not undefined
        if(quantity < 9){
            $('#adult_flight').val(quantity + 1);
            quantity_adult_flight = quantity + 1;

            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " +quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
        }

        if (quantity_adult_flight+quantity_child_flight == 9){
            document.getElementById("left-minus-adult-flight").disabled = false;
            document.getElementById("right-plus-adult-flight").disabled = true;
            document.getElementById("right-plus-child-flight").disabled = true;
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
            }
        }
        else{
            document.getElementById("left-minus-adult-flight").disabled = false;
            document.getElementById("right-plus-child-flight").disabled = false;
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
            }
        }
        // Increment

        if (quantity_adult_flight > quantity_infant_flight){
            document.getElementById("right-plus-infant-flight").disabled = false;
        }
        if (quantity_adult_flight == quantity_infant_flight){
            document.getElementById("right-plus-infant-flight").disabled = true;
        }

    });
    $('.left-minus-adult-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_flight').val());

        // If is not undefined
        // Increment
        if(quantity > 1){
            $('#adult_flight').val(quantity - 1);
            quantity_adult_flight = quantity - 1;

            if(quantity_adult_flight < quantity_infant_flight){
               quantity_infant_flight = quantity_adult_flight;
               $('#infant_flight').val(quantity - 1);
            }

            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
        }

        if (quantity_adult_flight+quantity_child_flight == 9){
            document.getElementById("left-minus-adult-flight").disabled = false;
            document.getElementById("right-plus-adult-flight").disabled = true;
            document.getElementById("right-plus-child-flight").disabled = true;
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
            }
        }
        else{
            document.getElementById("right-plus-child-flight").disabled = false;
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
            }

            if (quantity_adult_flight == 1){
                document.getElementById("left-minus-adult-flight").disabled = true;
                document.getElementById("right-plus-adult-flight").disabled = false;
            }
            else{
                document.getElementById("right-plus-adult-flight").disabled = false;
            }
        }

        if (quantity_adult_flight == quantity_infant_flight){
            document.getElementById("right-plus-infant-flight").disabled = true;
        }

    });
    $('.right-plus-child-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#child_flight').val());

        // If is not undefined
        if(quantity < 8){
            $('#child_flight').val(quantity + 1);
            quantity_child_flight = quantity + 1;

            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " +quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
        }

        if (quantity_adult_flight+quantity_child_flight == 9){
            document.getElementById("right-plus-adult-flight").disabled = true;
            document.getElementById("right-plus-child-flight").disabled = true;
            document.getElementById("left-minus-child-flight").disabled = false;
            if (quantity_adult_flight == 1){
                document.getElementById("left-minus-adult-flight").disabled = true;
            }
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
            }
        }
        else{
            document.getElementById("right-plus-child-flight").disabled = false;
            document.getElementById("left-minus-child-flight").disabled = false;

            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
            }
        }
    });
    $('.left-minus-child-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#child_flight').val());

        // If is not undefined
        // Increment
        if(quantity > 0){
            $('#child_flight').val(quantity - 1);
            quantity_child_flight = quantity - 1;

            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
        }

        if (quantity_adult_flight+quantity_child_flight != 9){
            document.getElementById("right-plus-adult-flight").disabled = false;
            document.getElementById("right-plus-child-flight").disabled = false;
            if (quantity_adult_flight == 1){
                document.getElementById("left-minus-adult-flight").disabled = true;
            }
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
            }
        }
    });
    $('.right-plus-infant-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#infant_flight').val());

        // If is not undefined
        if (quantity < quantity_adult_flight){
            $('#infant_flight').val(quantity + 1);
            quantity_infant_flight = quantity + 1;

            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
        }
        // Increment

//        alert(quantity_infant_train);
//        alert(quantity_adult_train);
        if (quantity_infant_flight < quantity_adult_flight){
            document.getElementById("left-minus-infant-flight").disabled = false;
            document.getElementById("right-plus-infant-flight").disabled = false;
        }
        else if(quantity_infant_flight == quantity_adult_flight){
            document.getElementById("left-minus-infant-flight").disabled = false;
            document.getElementById("right-plus-infant-flight").disabled = true;
        }
        else{
            document.getElementById("right-plus-infant-flight").disabled = true;
            document.getElementById("left-minus-infant-flight").disabled = false;
        }
    });
    $('.left-minus-infant-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#infant_flight').val());

        // If is not undefined
        // Increment
        if(quantity > 0){
            $('#infant_flight').val(quantity - 1);
            quantity_infant_flight = quantity - 1;

            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
        }

        if (quantity_infant_flight == 0){
            document.getElementById("left-minus-infant-flight").disabled = true;
            document.getElementById("right-plus-infant-flight").disabled = false;
        }
        else{
            document.getElementById("right-plus-infant-flight").disabled = false;
        }
    });

    var quantity_room_hotel = parseInt($('#hotel_room').val());
    var quantity_adult_hotel = parseInt($('#hotel_adult').val());
    var quantity_child_hotel = parseInt($('#hotel_child').val());
    $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
    $('#show_total_pax_hotel_wizard').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
    $('.right-plus-room-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_room').val());

        if(quantity < 9){
            $('#hotel_room').val(quantity + 1);
            $('#hotel_adult').val((quantity+1)*2);
            quantity_room_hotel = quantity + 1;
            quantity_adult_hotel = (quantity+1)*2;

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
        }

        if (quantity_room_hotel == 9){
            document.getElementById("right-plus-room-hotel").disabled = true;
            document.getElementById("left-minus-room-hotel").disabled = false;
        }
        else{
            document.getElementById("right-plus-room-hotel").disabled = false;
            document.getElementById("left-minus-room-hotel").disabled = false;
        }

        if (quantity_room_hotel == quantity_adult_hotel){
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }

        if (quantity_room_hotel > quantity_child_hotel){
            document.getElementById("right-plus-child-hotel").disabled = false;
        }

    });
    $('.left-minus-room-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_room').val());

        if(quantity > 1){
            $('#hotel_room').val(quantity - 1);
            quantity_room_hotel = quantity - 1;

            if(quantity_room_hotel < quantity_child_hotel){
               quantity_child_hotel = quantity_room_hotel;
               $('#hotel_child').val(quantity - 1);
            }

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
            guest_child_age();
        }

        if(quantity_room_hotel == 1){
            document.getElementById("left-minus-room-hotel").disabled = true;
            document.getElementById("right-plus-room-hotel").disabled = false;
        }
        else{
            document.getElementById("right-plus-room-hotel").disabled = false;
            document.getElementById("left-minus-room-hotel").disabled = false;
        }

        if (quantity_room_hotel < quantity_adult_hotel){
            document.getElementById("left-minus-adult-hotel").disabled = false;
        }

        if (quantity_room_hotel > quantity_child_hotel){
            document.getElementById("right-plus-child-hotel").disabled = false;
        }
        else{
            document.getElementById("right-plus-child-hotel").disabled = true;
        }

    });
    $('.right-plus-adult-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_adult').val());

        // If is not undefined
        if(quantity < 18){
            $('#hotel_adult').val(quantity + 1);
            quantity_adult_hotel = quantity + 1;

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
        }

        if(quantity_adult_hotel > quantity_room_hotel && quantity_adult_hotel < 18){
            document.getElementById("left-minus-adult-hotel").disabled = false;
            document.getElementById("right-plus-adult-hotel").disabled = false;
        }
        else if(quantity_adult_hotel == 18){
            document.getElementById("left-minus-adult-hotel").disabled = false;
            document.getElementById("right-plus-adult-hotel").disabled = true;
        }

    });
    $('.left-minus-adult-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_adult').val());

        // If is not undefined
        // Increment
        if(quantity > quantity_room_hotel){
            $('#hotel_adult').val(quantity - 1);
            quantity_adult_hotel = quantity - 1;

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
        }

        if(quantity_adult_hotel == quantity_room_hotel){
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }
        else{
            document.getElementById("right-plus-adult-hotel").disabled = false;
        }
    });
    $('.right-plus-child-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_child').val());

        // If is not undefined
        if (quantity < quantity_room_hotel*2){
            $('#hotel_child').val(quantity + 1);
            $("#show_child_hotel").text(quantity + 1);
            quantity_child_hotel = quantity + 1;

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
            guest_child_age();
        }

        if(quantity_child_hotel == quantity_room_hotel*2){
            document.getElementById("right-plus-child-hotel").disabled = true;
            document.getElementById("left-minus-child-hotel").disabled = false;
        }else if(quantity_child_hotel <= quantity_room_hotel*2 && quantity_child_hotel > 0){
            document.getElementById("right-plus-child-hotel").disabled = false;
            document.getElementById("left-minus-child-hotel").disabled = false;
        }
    });
    $('.left-minus-child-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_child').val());

        if(quantity > 0){
            $('#hotel_child').val(quantity - 1);
            quantity_child_hotel = quantity - 1;

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
            guest_child_age();
        }

        if (quantity_child_hotel == 0){
            document.getElementById("left-minus-child-hotel").disabled = true;
            document.getElementById("right-plus-child-hotel").disabled = false;
        }
        else{
            document.getElementById("right-plus-child-hotel").disabled = false;
        }
    });

    $('#photo-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-photo-hotel").offset().top - 50
        }, 500);
        active_sticky_hotel("photo");
    });

    $('#facility-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-facility-hotel").offset().top - 50
        }, 500);
        active_sticky_hotel("facility");
    });

    $('#location-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-location-hotel").offset().top - 50
        }, 500);
        active_sticky_hotel("location");
    });

    $('#select-room-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-select-room-hotel").offset().top - 50
        }, 500);
        active_sticky_hotel("select");
    });

    $('#description-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-description-hotel").offset().top - 50
        }, 500);
        active_sticky_hotel("description");
    });

    $('#review-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-review-hotel").offset().top - 50
        }, 500);
        active_sticky_hotel("review");
    });

    $('#information-event').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-information-event").offset().top - 50
        }, 500);
        active_sticky_event("information");
    });

    $('#select-room-event').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-select-event").offset().top - 50
        }, 500);
        active_sticky_event("select");
    });

    $('#select-room-event2').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-select-event").offset().top - 50
        }, 500);
        active_sticky_event("select");
    });

    $('#about-partnership').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-about-partnership").offset().top
        }, 500)
    });

    $('#register-partnership').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-register-partnership").offset().top
        }, 500)
    });

    $('#register-partnership-citra').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-register-partnership").offset().top
        }, 500)
    });

    $('#register-partnership-japro').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-register-partnership").offset().top
        }, 500)
    });

    $('#register-partnership-fipro').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-register-partnership").offset().top
        }, 500)
    });

    $('#radio_train_search').click(function(){
        selected_value = $("input[name='radio_train_type']:checked").val();
        if (selected_value == "oneway"){
            if(template == 1 || template == 2 || template == 3){
                document.getElementById("train_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>`;
                if(template == 1 || template == 2){
                    text+=`<div class="input-container-search-ticket">`;
                }else if(template == 3){
                    text+=`<div class="form-group">`;
                }
                text+=`
                    <input type="text" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>
                <input type="hidden" class="form-control date-picker airline_return" name="train_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("train_date_search").appendChild(node);
                node = document.createElement("div");
            }
            else if(template == 4){
                document.getElementById("train_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                text+=`
                <span class="span-search-ticket">Departure</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                    <input type="hidden" class="form-control date-picker airline_return" name="train_return" id="train_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">
                </div>`;

                node.innerHTML = text;
                document.getElementById("train_date_search").appendChild(node);
                node = document.createElement("div");
            }
            else if(template == 5){
                document.getElementById("train_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>
                <input type="hidden" class="form-control date-picker airline_return" name="train_return" id="train_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("train_date_search").appendChild(node);
                node = document.createElement("div");
            }
            $("#train_departure").val(moment().format('DD MMM YYYY'));
            $("#train_return").val($("#train_departure").val());

            $('input[name="train_departure"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              opens: 'center',
              startDate: moment(),
              minDate: moment(),
              maxDate: moment().subtract(-90, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });
        }
        else if(selected_value == "roundtrip"){
            if(template == 1 || template == 2 || template == 3){
                document.getElementById("train_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>`;
                if(template == 1 || template == 2){
                    text+=`<div class="input-container-search-ticket">`;
                }else if(template == 3){
                    text+=`<div class="form-group">`;
                }
                text+=`
                    <input type="text" class="form-control" name="train_departure_return" id="train_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>

                <input type="hidden" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="train_return" id="train_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("train_date_search").appendChild(node);
                node = document.createElement("div");
            }
            else if(template == 4){
                document.getElementById("train_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                text+=`
                <span class="span-search-ticket">Departure - Return</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="train_departure_return" id="train_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>

                <input type="hidden" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="train_return" id="train_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("train_date_search").appendChild(node);
                node = document.createElement("div");
            }
            else if(template == 5){
                document.getElementById("train_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="train_departure_return" id="train_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>
                <input type="hidden" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="train_return" id="train_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("train_date_search").appendChild(node);
                node = document.createElement("div");
            }

            $("#train_departure").val(moment().format('DD MMM YYYY'));
            $("#train_return").val(moment().subtract(-1, 'days').format('DD MMM YYYY'));

            $('input[name="train_departure_return"]').daterangepicker({
              singleDatePicker: false,
              autoUpdateInput: true,
              opens: 'center',
              autoApply: true,
              startDate: moment(),
              endDate: moment().subtract(-1, 'days'),
              minDate: moment(),
              maxDate: moment().subtract(-90, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });

            $('input[name="train_departure_return"]').on('apply.daterangepicker', function(ev, picker) {
              $(this).val(picker.startDate.format('DD MMM YYYY') + ' - ' + picker.endDate.format('DD MMM YYYY'));
                $("#train_departure").val(picker.startDate.format('DD MMM YYYY'));
                $("#train_return").val(picker.endDate.format('DD MMM YYYY'));
                setTimeout(function(){
                    $("#show_total_pax_train").click();
                }, 200);
        });
        }
    });

    $('#radio_airline_search').click(function(){
        selected_value = $("input[name='radio_airline_type']:checked").val();
        if (selected_value == "oneway"){
            if(template == 1 || template == 2 || template == 3){
                document.getElementById("airline_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                if(template == 1 || template == 3){
                    text+=`<span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>`;
                }else if(template == 2){
                    text+=`<span style="color:`+text_color+`;"><i class="fas fa-calendar-alt"></i> Departure</span>`;
                }
                if(template == 1 || template == 2){
                    text+=`<div class="input-container-search-ticket">`;
                }else if(template == 3){
                    text+=`<div class="form-group">`;
                }
                text+=`
                    <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>
                <input type="hidden" class="form-control date-picker airline_return" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("airline_date_search").appendChild(node);
                node = document.createElement("div");
            }
            else if(template == 4){
                document.getElementById("airline_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                text+=`
                <span class="span-search-ticket">Departure</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>
                <input type="hidden" class="form-control date-picker airline_return" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("airline_date_search").appendChild(node);
                node = document.createElement("div");
            }
            else if(template == 5){
                document.getElementById("airline_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>
                <input type="hidden" class="form-control date-picker airline_return" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("airline_date_search").appendChild(node);
                node = document.createElement("div");
            }

            document.getElementById('is_combo_price').disabled = true;
            document.getElementById('is_combo_price').checked = false;
            document.getElementById('checkbox_combo_price').style.display = "none";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('mc_airline_default').innerHTML = "";
            airline_counter_config = 0;
            counter_airline_search = 0;

            $("#airline_departure").val(moment().format('DD MMM YYYY'));
            $("#airline_return").val($("#airline_departure").val());

            $('input[name="airline_departure"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              opens: 'center',
              startDate: moment(),
              minDate: moment(),
              maxDate: moment().subtract(-365, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });

            $('input[name="airline_departure"]').on('apply.daterangepicker', function(ev, picker) {
                setTimeout(function(){
                    $("#show_total_pax_flight").click();
                }, 200);
            });
        }
        else if(selected_value == "roundtrip"){
            if(template == 1 || template == 2 || template == 3){
                document.getElementById("airline_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                document.getElementById('is_combo_price').disabled = false;
                document.getElementById('is_combo_price').checked = true;
                document.getElementById('checkbox_combo_price').style.display = "block";
                document.getElementById('ori_airline').style.display = "block";
                document.getElementById('mc_airline_default').innerHTML = "";
                airline_counter_config = 0;
                counter_airline_search = 0;
                if(template == 1 || template == 3){
                    text+=`<span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>`;
                }else if(template == 2){
                    text+=`<span style="color:`+text_color+`;"><i class="fas fa-calendar-alt"></i> Departure - Return</span>`;
                }

                if(template == 1 || template == 2){
                    text+=`<div class="input-container-search-ticket">`;
                }else if(template == 3){
                    text+=`<div class="form-group">`;
                }
                text+=`
                    <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>

                <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("airline_date_search").appendChild(node);
                node = document.createElement("div");
            }
            else if(template == 4){
                document.getElementById("airline_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                document.getElementById('is_combo_price').disabled = false;
                document.getElementById('is_combo_price').checked = true;
                document.getElementById('checkbox_combo_price').style.display = "block";
                document.getElementById('ori_airline').style.display = "block";
                document.getElementById('mc_airline_default').innerHTML = "";
                airline_counter_config = 0;
                counter_airline_search = 0;
                text+=`
                <span class="span-search-ticket">Departure - Return</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>

                <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("airline_date_search").appendChild(node);
                node = document.createElement("div");
            }
            else if(template == 5){
                document.getElementById("airline_date_search").innerHTML = '';
                text='';
                var node = document.createElement("div");
                document.getElementById('is_combo_price').disabled = false;
                document.getElementById('is_combo_price').checked = true;
                document.getElementById('checkbox_combo_price').style.display = "block";
                document.getElementById('ori_airline').style.display = "block";
                document.getElementById('mc_airline_default').innerHTML = "";
                airline_counter_config = 0;
                counter_airline_search = 0;
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>
                <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

                node.innerHTML = text;
                document.getElementById("airline_date_search").appendChild(node);
                node = document.createElement("div");
            }

            $("#airline_departure").val(moment().format('DD MMM YYYY'));
            $("#airline_return").val(moment().subtract(-1, 'days').format('DD MMM YYYY'));

            $('input[name="airline_departure_return"]').daterangepicker({
              singleDatePicker: false,
              autoUpdateInput: true,
              opens: 'center',
              autoApply: true,
              startDate: moment(),
              endDate: moment().subtract(-1, 'days'),
              minDate: moment(),
              maxDate: moment().subtract(-365, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });

            $('input[name="airline_departure_return"]').on('apply.daterangepicker', function(ev, picker) {
              $(this).val(picker.startDate.format('DD MMM YYYY') + ' - ' + picker.endDate.format('DD MMM YYYY'));
                $("#airline_departure").val(picker.startDate.format('DD MMM YYYY'));
                $("#airline_return").val(picker.endDate.format('DD MMM YYYY'));

                setTimeout(function(){
                    $("#show_total_pax_flight").click();
                }, 200);
            });
        }
        else if (selected_value == "multicity"){
            airline_counter_config = 0;
            counter_airline_search = 0;
            text_mc='';

            if(template == 1){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12" style="padding:0px;">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left;">
                            <button type="button" id="add_mc_btn" class="primary-btn-ad" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn-ad" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }
            else if(template == 2){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left; padding-bottom:20px;">
                            <button type="button" id="add_mc_btn" class="primary-btn" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }

            else if(template == 3){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left; padding-top:20px;">
                            <button type="button" id="add_mc_btn" class="primary-btn" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }

            else if(template == 4){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left; padding-top:20px;">
                            <button type="button" id="add_mc_btn" class="primary-btn" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }

            else if(template == 5){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left; padding-top:15px;">
                            <button type="button" id="add_mc_btn" class="primary-btn rounded" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn rounded" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }

            document.getElementById('mc_airline_default').innerHTML = text_mc;
            document.getElementById('ori_airline').style.display = "none";
            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('is_combo_price').checked = true;
//            document.getElementById('is_combo_price').checked = false;
            document.getElementById('checkbox_combo_price').style.display = "block";

            add_multi_city('home');
            add_multi_city('home');
            $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");

        }
    });

    $('#radio_airline_change_search').click(function(){
        selected_value = $("input[name='radio_airline_type']:checked").val();
        if (selected_value == "oneway"){
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");
            if (template == 1){
            text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }
            else if (template == 2){
            text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" style="background:white;" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }
            else if (template == 3){
            text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="form-group">
                    <input type="text" style="background:white;" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }
            else if (template == 4){
            text+=`
                <span class="span-search-ticket">Departure</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" style="background:white;" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }
            else if (template == 5){
            text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" style="background:white;" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }

            node.innerHTML = text;
            document.getElementById("airline_date_search").appendChild(node);
            node = document.createElement("div");
            document.getElementById('is_combo_price').disabled = true;
            document.getElementById('checkbox_combo_price').style.display = "none";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('mc_airline_default').innerHTML = "";
            airline_counter_config = 0;
            counter_airline_search = 0;

            document.getElementById("airline_departure").value = document.getElementById("airline_departure_temp").value;
            document.getElementById("airline_return").value = document.getElementById("airline_departure").value;
            $('input[name="airline_departure"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              opens: 'center',
              startDate: $("#airline_departure").val(),
              minDate: moment(),
              maxDate: moment().subtract(-365, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });

            $('input[name="airline_departure"]').on('apply.daterangepicker', function(ev, picker) {
                setTimeout(function(){
                    $("#show_total_pax_flight").click();
                }, 200);
            });
        }
        else if(selected_value == "roundtrip"){
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");

            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('is_combo_price').checked = true;
            document.getElementById('checkbox_combo_price').style.display = "block";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('mc_airline_default').innerHTML = "";

            airline_counter_config = 0;
            counter_airline_search = 0;

            if(template == 1){
            text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" value="{{airline_request.departure}} - {{airline_request.return}}" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }
            else if(template == 2){
            text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="input-container-search-ticket">
                    <input type="text" style="background:white;" class="form-control" name="airline_departure_return" id="airline_departure_return" value="{{airline_request.departure}} - {{airline_request.return}}" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }
            else if(template == 3){
            text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="form-group">
                    <input type="text" style="background:white;" class="form-control" name="airline_departure_return" id="airline_departure_return" value="{{airline_request.departure}} - {{airline_request.return}}" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }
            else if(template == 4){
            text+=`
                <span class="span-search-ticket">Departure - Return</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" style="background:white;" class="form-control" name="airline_departure_return" id="airline_departure_return" value="{{airline_request.departure}} - {{airline_request.return}}" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }
            else if(template == 5){
            text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="input-container-search-ticket">
                    <input type="text" style="background:white;" class="form-control" name="airline_departure_return" id="airline_departure_return" value="{{airline_request.departure}} - {{airline_request.return}}" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly>
                </div>
                <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;
            }

            node.innerHTML = text;
            document.getElementById("airline_date_search").appendChild(node);
            node = document.createElement("div");

            if(document.getElementById("airline_return_temp").value == ""){

                document.getElementById("airline_departure").value = document.getElementById("airline_departure_temp").value;

                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                var date_tomorrow = new Date(document.getElementById("airline_departure").value);
                date_tomorrow.setDate(date_tomorrow.getDate() + 1);
                date_tomorrow = date_tomorrow.getDate()+" "+monthNames[date_tomorrow.getMonth()]+" "+date_tomorrow.getFullYear();

                document.getElementById("airline_return").value = date_tomorrow;

//                alert(document.getElementById("airline_return").value);
                document.getElementById("airline_departure_return").value = document.getElementById("airline_departure").value + '-' + document.getElementById("airline_return").value;

                $('input[name="airline_departure_return"]').daterangepicker({
                  singleDatePicker: false,
                  autoUpdateInput: true,
                  opens: 'center',
                  autoApply: true,
                  startDate: $('#airline_departure').val(),
                  endDate: date_tomorrow,
                  minDate: moment(),
                  maxDate: moment().subtract(-365, 'days'),
                  showDropdowns: true,
                  locale: {
                      format: 'DD MMM YYYY',
                  }
                });

                $('input[name="airline_departure_return"]').on('apply.daterangepicker', function(ev, picker) {
                  $(this).val(picker.startDate.format('DD MMM YYYY') + ' - ' + picker.endDate.format('DD MMM YYYY'));
                    $("#airline_departure").val(picker.startDate.format('DD MMM YYYY'));
                    $("#airline_return").val(picker.endDate.format('DD MMM YYYY'));
                    $("#airline_departure_return").val(picker.startDate.format('DD MMM YYYY') +' - '+picker.endDate.format('DD MMM YYYY'));

                    setTimeout(function(){
                        $("#show_total_pax_flight").click();
                    }, 200);
                });

            }
            else{
                document.getElementById("airline_departure").value = document.getElementById("airline_departure_temp").value;
                document.getElementById("airline_return").value = document.getElementById("airline_return_temp").value;
                document.getElementById("airline_departure_return").value = document.getElementById("airline_departure").value + '-' + document.getElementById("airline_return").value;

                $('input[name="airline_departure_return"]').daterangepicker({
                  singleDatePicker: false,
                  autoUpdateInput: true,
                  opens: 'center',
                  autoApply: true,
                  startDate: $('#airline_departure').val(),
                  endDate: $('#airline_return').val(),
                  minDate: moment(),
                  maxDate: moment().subtract(-365, 'days'),
                  showDropdowns: true,
                  locale: {
                      format: 'DD MMM YYYY',
                  }
                });

                $('input[name="airline_departure_return"]').on('apply.daterangepicker', function(ev, picker) {
                  $(this).val(picker.startDate.format('DD MMM YYYY') + ' - ' + picker.endDate.format('DD MMM YYYY'));
                    $("#airline_departure").val(picker.startDate.format('DD MMM YYYY'));
                    $("#airline_return").val(picker.endDate.format('DD MMM YYYY'));
                    $("#airline_departure_return").val(picker.startDate.format('DD MMM YYYY') +' - '+picker.endDate.format('DD MMM YYYY'));

                    setTimeout(function(){
                        $("#show_total_pax_flight").click();
                    }, 200);

                });
            }


        }
        else if (selected_value == "multicity"){
            airline_counter_config = 0;
            counter_airline_search = 0;
            text_mc='';
//            text_mc += `
//            <div class="row">
//                <div class="col-lg-12" style="padding:0px;">
//                    <div id="mc_airline_paxs">
//
//                    </div>
//                    <div class="banner-right" style="text-align:left;">
//                        <ul class="nav nav-tabs" id="mc_airline_add_tabs" role="tablist" style="display:inline-block; margin-right:5px;">
//
//                        </ul>
//                        <button type="button" id="add_mc_btn" class="primary-btn-ad" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
//                        <button type="button" id="del_mc_btn" class="primary-btn-ad" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
//                    </div>
//                    <div class="banner-right">
//                        <div class="tab-content" id="mc_airline_add" style="padding-top:15px; background:none !important;">
//                        </div>
//                    </div>
//                </div>
//            </div>`;
            if (template == 1){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12" style="padding:0px;">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left;">
                            <button type="button" id="add_mc_btn" class="primary-btn-ad" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn-ad" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }
            else if(template == 2){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left;">
                            <button type="button" id="add_mc_btn" class="primary-btn-ad" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn-ad" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }
            else if(template == 3){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left; padding-top:15px;">
                            <button type="button" id="add_mc_btn" class="primary-btn" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }
            else if(template == 4){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left; padding-top:15px;">
                            <button type="button" id="add_mc_btn" class="primary-btn" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }
            else if(template == 5){
                text_mc += `
                <div class="row">
                    <div class="col-lg-12">
                        <div id="mc_airline_paxs"></div>
                        <div id="mc_airline_add" style="background:none !important;"></div>
                        <div style="text-align:left; padding-top:15px;">
                            <button type="button" id="add_mc_btn" class="primary-btn" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add</button>
                            <button type="button" id="del_mc_btn" class="primary-btn" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>`;
            }

            document.getElementById('mc_airline_default').innerHTML = text_mc;
            document.getElementById('ori_airline').style.display = "none";
            document.getElementById('is_combo_price').checked = true;
            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('checkbox_combo_price').style.display = "block";
            airline_request_counter = airline_request.counter;
            if(airline_request_counter == 0)
                airline_request_counter = 2
            for(var airline_counter=0;airline_counter<parseInt(airline_request_counter);airline_counter++){
                add_multi_city('search');
            }
            $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
            //func_check_provider()
        }
    });

});


//function showReturnDateAirline() {
//
//    var airline_dept = new Date($("#airline_departure").val());
//    airline_dept.setDate(airline_dept.getDate() + 1);
//
//    if ($('#directionflight').prop('checked')){
//        $('#airline_return').prop('disabled', false);
//        $('input[name="airline_return"]').daterangepicker({
//              singleDatePicker: true,
//              autoUpdateInput: true,
//              startDate: airline_dept,
//              opens: 'left',
//              showDropdowns: true,
//              minDate: $('#airline_departure').val(),
//              maxDate: moment().subtract(-365, 'days'),
//              locale: {
//                  format: 'DD MMM YYYY',
//              }
//        });
//    }
//    else{
//        $('#airline_return').prop('disabled', true);
//        var airline_ret = new Date($("#airline_return").val(''));
//        airline_ret.setDate(airline_ret.getDate());
//    }
//
//}

$('.dropdown-menu').on('click', function(event) {
	event.stopPropagation();
});

$('body').on('click', function(event) {
	var target = $(event.target);
	if (target.parents('.bootstrap-select').length) {
		event.stopPropagation();
		$('.bootstrap-select.open').removeClass('open');
	}
});

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function loadingTrain(){
    $('#loading-search-train').hide();
}

function loadingPaxHide(){
    $('#loading-booker-train').hide();
    $('#loading-pax-train').hide();
}

function loadingReviewHide(){
    $('#loading-review-train').hide();
}

function showCart() {
  var x = document.getElementById("show-cart");

  if ($("#show-cart").hasClass("minus")) {
    $("#show-cart").removeClass("minus");
    $(".img-min-ticket").hide();
    $(".img-plus-ticket").show();
  } else {
    $("#show-cart").addClass("minus");
    $(".img-plus-ticket").hide();
    $(".img-min-ticket").show();
  }
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


//function showFilter() {
//  var x = document.getElementById("filter-search-train");
//
//  if (x.style.display === "none") {
//    x.style.display = "block";
//    document.getElementById("sorting-search-train").style.display = "block";
//  } else {
//    x.style.display = "none";
//    document.getElementById("sorting-search-train").style.display = "none";
//  }
//}

function next_disabled(){
    $('.btn-next').prop('disabled', true);
    $('.btn-next').addClass("running");
}

function show_loading(){
    $('.next-loading').addClass("running");
    $('.next-loading').prop('disabled', true);
    $('.payment_method').prop('disabled', true).niceSelect('update');
    $(".payment_acq *").prop('disabled',true);
}

function show_loading_booking(){
    $('.next-loading-booking').addClass("running");
    $('.next-loading-booking').prop('disabled', true);
    $('.next-loading-issued').prop('disabled', true);
    $('.payment_method').prop('disabled', true).niceSelect('update');
    $(".payment_acq *").prop('disabled',true);
}

function show_loading_issued(){
    $('.next-loading-booking').prop('disabled', true);
    $('.next-loading-issued').addClass("running");
    $('.next-loading-issued').prop('disabled', true);
    $('.payment_method').prop('disabled', true).niceSelect('update');
    $(".payment_acq *").prop('disabled',true);
}


function show_paxs(pax_type, key){
    var paxs = document.getElementById(pax_type+'_paxs'+key);
    var paxs_down = document.getElementById(pax_type+'_down_paxs'+key);
    var paxs_up = document.getElementById(pax_type+'_up_paxs'+key);
    for (var i=1; i <= parseInt(adult); i++){
        paxs = document.getElementById('adult_paxs'+i);
        paxs_up = document.getElementById('adult_up_paxs'+i);
        paxs_down = document.getElementById('adult_down_paxs'+i);
    }

    for (var i=1; i <= parseInt(infant); i++){
        paxs = document.getElementById('infant_paxs'+i);
        paxs_up = document.getElementById('infant_up_paxs'+i);
        paxs_down = document.getElementById('infant_down_paxs'+i);
    }

    paxs = document.getElementById(pax_type+'_paxs'+key);
    paxs_down = document.getElementById(pax_type+'_down_paxs'+key);
    paxs_up = document.getElementById(pax_type+'_up_paxs'+key);

    if (paxs.style.display === "none") {
        paxs.style.display = "block";
        paxs_down.style.display = "block";
        paxs_up.style.display = "none";
    }
    else {
        paxs.style.display = "none";
        paxs_down.style.display = "none";
        paxs_up.style.display = "block";
    }
}

function show_question_event(opt, key1, key2){
    var option = document.getElementById(opt+'_opt'+key1+key2);
    var option_down = document.getElementById(opt+'_down_opt'+key1+key2);
    var option_up = document.getElementById(opt+'_up_opt'+key1+key2);

    if (option.style.display === "none") {
        option.style.display = "block";
        option_down.style.display = "block";
        option_up.style.display = "none";
    }
    else {
        option.style.display = "none";
        option_down.style.display = "none";
        option_up.style.display = "block";
    }
}

function show_question_event_review(opt, key1){
    var option = document.getElementById(opt+'_opt'+key1);
    var option_down = document.getElementById(opt+'_down_opt'+key1);
    var option_up = document.getElementById(opt+'_up_opt'+key1);

    if (option.style.display === "none") {
        option.style.display = "block";
        option_down.style.display = "inline-block";
        option_up.style.display = "none";
    }
    else {
        option.style.display = "none";
        option_down.style.display = "none";
        option_up.style.display = "inline-block";
    }

}

function show_paxs_airline(pax_type, key){
    var paxs = document.getElementById(pax_type+'_paxs'+key);
    var paxs_down = document.getElementById(pax_type+'_down_paxs'+key);
    var paxs_up = document.getElementById(pax_type+'_up_paxs'+key);

    for (var i=1; i <= parseInt(adult); i++){
        paxs = document.getElementById('adult_paxs'+i);
        paxs_up = document.getElementById('adult_up_paxs'+i);
        paxs_down = document.getElementById('adult_down_paxs'+i);
    }

    for (var i=1; i <= parseInt(child); i++){
        paxs = document.getElementById('child_paxs'+i);
        paxs_up = document.getElementById('child_up_paxs'+i);
        paxs_down = document.getElementById('child_down_paxs'+i);
    }

    for (var i=1; i <= parseInt(infant); i++){
        paxs = document.getElementById('infant_paxs'+i);
        paxs_up = document.getElementById('infant_up_paxs'+i);
        paxs_down = document.getElementById('infant_down_paxs'+i);
    }

    paxs = document.getElementById(pax_type+'_paxs'+key);
    paxs_down = document.getElementById(pax_type+'_down_paxs'+key);
    paxs_up = document.getElementById(pax_type+'_up_paxs'+key);

    if (paxs.style.display === "none") {
        paxs.style.display = "block";
        paxs_down.style.display = "block";
        paxs_up.style.display = "none";
    }
    else {
        paxs.style.display = "none";
        paxs_down.style.display = "none";
        paxs_up.style.display = "block";
    }
}

function show_attachment_details(key){
    var journey = document.getElementById('journey'+key);
    var flight = document.getElementById('detail_attachment'+key);
    var flight_down = document.getElementById('attach_details_down'+key);
    var flight_up = document.getElementById('attach_details_up'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight.style.display = "block";
        journey.style.marginBottom = "15px";
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight.style.display = "none";
        journey.style.marginBottom = "15px";
    }
}

function show_flight_details(key){
    var journey = document.getElementById('journey'+key);
    var flight = document.getElementById('detail_departjourney'+key);
    var flight_down = document.getElementById('flight_details_down'+key);
    var flight_up = document.getElementById('flight_details_up'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight.style.display = "block";
        journey.style.marginBottom = "15px";
        journey.style.border= "1px solid "+color;
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight.style.display = "none";
        journey.style.marginBottom = "15px";
        journey.style.border= "1px solid #cdcdcd";
    }
}

function show_flight_details2(key){
    var journey = document.getElementById('journey2'+key);
    var flight = document.getElementById('detail_departjourney_pick'+key);
    var flight_down = document.getElementById('flight_details_down2'+key);
    var flight_up = document.getElementById('flight_details_up2'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight.style.display = "block";
        journey.style.marginBottom = "15px";
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight.style.display = "none";
        journey.style.marginBottom = "15px";
    }
}

function agent_register_citra(){
    $('#agent_type').val(2);
    $('#agent_type').niceSelect('update');
}

function agent_register_japro(){
    $('#agent_type').val(3);
    $('#agent_type').niceSelect('update');
}

function agent_register_fipro(){
    $('#agent_type').val(11);
    $('#agent_type').niceSelect('update');
}

function show_qna(type, val){
    var qna_down = document.getElementById(type+'-qna-down-'+val);
    var qna_up = document.getElementById(type+'-qna-up-'+val);
    var qna_show = document.getElementById(type+'-qna-show-'+val);

    if (qna_show.style.display === "none") {
        qna_up.style.display = "none";
        qna_down.style.display = "block";
        qna_show.style.display = "block";
    }
    else {
        qna_up.style.display = "block";
        qna_down.style.display = "none";
        qna_show.style.display = "none";
    }
}

function delete_expired_date(type, id){
    document.getElementById(type+'_passport_expired_date'+id).value = "";
}

function delete_country_of_issued(type, id){
    document.getElementById('select2-'+type+'_country_of_issued'+id+'_id-container').innerHTML = "Country Of Issued";
    document.getElementById(type+'_country_of_issued'+id+'_id').value = "";
    document.getElementById(type+'_country_of_issued'+id).value = "";

}

function show_hide_change_search(){
    var change_search_box = document.getElementById("change_search_box");

    if (change_search_box.style.display === "none") {
        change_search_box.style.display = "block";
        document.getElementById("overlay-search-box").style.display = "block";
        $('html, body').animate({
            scrollTop: $("#change_search_box").offset().top - 70
        }, 500);
        document.getElementById("change_search_text").innerHTML = "Hide Search";
    }
    else {
        change_search_box.style.display = "none";
        document.getElementById("overlay-search-box").style.display = "none";
        document.getElementById("change_search_text").innerHTML = "Change Search";
    }
}

function show_hide_city_hotel(){
    var hotel_city = document.getElementById("hotel_city");
    var city_hotel_down = document.getElementById("city_hotel_down");
    var city_hotel_up = document.getElementById("city_hotel_up");

    if (city_hotel_down.style.display === "none") {
        city_hotel_up.style.display = "none";
        hotel_city.style.display = "none";
        city_hotel_down.style.display = "block";
    }
    else {
        city_hotel_up.style.display = "block";
        hotel_city.style.display = "";
        city_hotel_down.style.display = "none";
    }
}

function show_hide_advanced(type){
    var advanced_search = document.getElementById(type+"_advanced_search");
    var advanced_down = document.getElementById(type+"_advanced_down");
    var advanced_up = document.getElementById(type+"_advanced_up");

    if (advanced_down.style.display === "none") {
        advanced_up.style.display = "none";
        advanced_search.style.display = "none";
        advanced_down.style.display = "block";
    }
    else {
        advanced_up.style.display = "block";
        advanced_search.style.display = "";
        advanced_down.style.display = "none";
    }
}

function show_hide_landmark_hotel(){
    var hotel_landmark = document.getElementById("hotel_landmark");
    var landmark_hotel_down = document.getElementById("landmark_hotel_down");
    var landmark_hotel_up = document.getElementById("landmark_hotel_up");

    if (landmark_hotel_down.style.display === "none") {
        landmark_hotel_up.style.display = "none";
        hotel_landmark.style.display = "none";
        landmark_hotel_down.style.display = "block";
    }
    else {
        landmark_hotel_up.style.display = "block";
        hotel_landmark.style.display = "";
        landmark_hotel_down.style.display = "none";
    }
}

function show_hide_tac(id){
    var span_tac_up = document.getElementById("span-tac-up"+id);
    var span_tac_down = document.getElementById("span-tac-down"+id);
    var div_tac = document.getElementById("div-tac"+id);

    if (span_tac_up.style.display === "none") {
        span_tac_down.style.display = "none";
        div_tac.style.display = "none";
        span_tac_up.style.display = "block";
    }
    else {
        span_tac_down.style.display = "block";
        div_tac.style.display = "block";
        span_tac_up.style.display = "none";
    }
}

var count_alert=0;
var count_alert_items=[];
try{
    var AlertBox = function(id, option) {
      this.show = function(msg) {
        if (msg === ''  || typeof msg === 'undefined' || msg === null) {
          throw '"msg parameter is empty"';
        }
        else {
          var alertArea = document.querySelector(id);
          var alertBox = document.createElement('DIV');
          var alertContent = document.createElement('DIV');
          var alertClose = document.createElement('A');
          var alertClass = this;

          count_alert_items.push(count_alert);
          count_alert = count_alert+1;
          console.log(count_alert_items.length)
          if(count_alert_items.length == 3){

            $(".alert-id-"+count_alert_items[0]).hide(alertBox);
            count_alert_items.shift();

          }
          if(count_alert > 3){
            count_alert = 0;
          }

          alertContent.classList.add('alert-content');
          alertContent.innerText = msg;
          alertClose.classList.add('alert-close');
          alertClose.setAttribute('href', '#');
          alertBox.classList.add('alert-box');
          alertBox.classList.add('alert-id-'+count_alert);
          alertBox.appendChild(alertContent);
          if (!option.hideCloseButton || typeof option.hideCloseButton === 'undefined') {
            alertBox.appendChild(alertClose);
          }
          alertArea.appendChild(alertBox);
          alertClose.addEventListener('click', function(event) {
            event.preventDefault();
            alertClass.hide(alertBox);
          });
          if (!option.persistent) {
            var alertTimeout = setTimeout(function() {
              alertClass.hide(alertBox);
              clearTimeout(alertTimeout);
            }, option.closeTime);
          }
        }
      };

      this.hide = function(alertBox) {
        alertBox.classList.add('hide');
        var disperseTimeout = setTimeout(function() {
          alertBox.parentNode.removeChild(alertBox);
          clearTimeout(disperseTimeout);
        }, 500);
      };
    };

    var AlertBox2 = function(id, option) {
      this.show = function(msg) {
        if (msg === ''  || typeof msg === 'undefined' || msg === null) {
          throw '"msg parameter is empty"';
        }
        else {
          var alertArea = document.querySelector(id);
          var alertBox = document.createElement('DIV');
          var alertContent = document.createElement('DIV');
          var alertClose = document.createElement('A');
          var alertClass = this;

          count_alert_items.push(count_alert);
          count_alert = count_alert+1;
          if(count_alert > 3){
            count_alert_items.shift();
            $(".alert-id-"+count_alert_items[0]).hide(alertBox);
          }

          alertContent.classList.add('alert-content');
          alertContent.innerText = msg;
          alertClose.classList.add('alert-close');
          alertClose.setAttribute('href', '#');
          alertBox.classList.add('alert-box-success');
          alertBox.classList.add('alert-id-'+count_alert);
          alertBox.appendChild(alertContent);
          if (!option.hideCloseButton || typeof option.hideCloseButton === 'undefined') {
            alertBox.appendChild(alertClose);
          }
          alertArea.appendChild(alertBox);
          alertClose.addEventListener('click', function(event) {
            event.preventDefault();
            alertClass.hide(alertBox);
          });
          if (!option.persistent) {
            var alertTimeout = setTimeout(function() {
              alertClass.hide(alertBox);
              clearTimeout(alertTimeout);
            }, option.closeTime);
          }
        }
      };

      this.hide = function(alertBox) {
        alertBox.classList.add('hide');
        var disperseTimeout = setTimeout(function() {
          alertBox.parentNode.removeChild(alertBox);
          clearTimeout(disperseTimeout);
        }, 500);
      };
    };

    var alertShowMessage = document.querySelector('#login-form-home');
    var alertbox = new AlertBox('#alert-area', {
      closeTime: 5000,
      persistent: false,
      hideCloseButton: false
    });
    var alertbox2 = new AlertBox2('#alert-area', {
      closeTime: 5000,
      persistent: false,
      hideCloseButton: false
    });
}catch(err){
    console.log('err');
}

function capitalizeInput(id){
    $.fn.capitalize = function () {
        $.each(this, function () {
            var split = this.value.split(' ');
            var temp_split = [];
            for (var i = 0, len = split.length; i < len; i++) {
                if(split[i] != ''){
                    split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1).toLowerCase();
                    temp_split.push(split[i]);
                }
            }
            this.value = temp_split.join(' ');
        });
        return this;
    };


    $('#'+id).on('change', function () {
        $(this).capitalize();
    }).capitalize();

}

function active_sticky_hotel(type){
    if(type == "photo"){
        $(".content-hotel").removeClass("sticky-hotel-active");
        $("#photo-hotel").addClass("sticky-hotel-active");
    }
    else if(type == "facility"){
        $(".content-hotel").removeClass("sticky-hotel-active");
        $("#facility-hotel").addClass("sticky-hotel-active");
    }
    else if(type == "location"){
        $(".content-hotel").removeClass("sticky-hotel-active");
        $("#location-hotel").addClass("sticky-hotel-active");
    }
    else if(type == "select"){
        $(".content-hotel").removeClass("sticky-hotel-active");
        $("#select-room-hotel").addClass("sticky-hotel-active");
    }
    else if(type == "description"){
        $(".content-hotel").removeClass("sticky-hotel-active");
        $("#description-hotel").addClass("sticky-hotel-active");
    }
    //else if(type == "review"){
    //    $(".content-hotel").removeClass("sticky-hotel-active");
    //    $("#review-hotel").addClass("sticky-hotel-active");
    //}
}

function active_sticky_event(type){
    if(type == "information"){
        $(".content-event").removeClass("sticky-event-active");
        $("#information-event").addClass("sticky-event-active");
    }
    else if(type == "select"){
        $(".content-event").removeClass("sticky-event-active");
        $("#select-room-event").addClass("sticky-event-active");
    }
}

function active_sticky_activity(type){
    if(type == "product"){
        $(".content-activity").removeClass("sticky-activity-active");
        $("#product-activity").addClass("sticky-activity-active");
    }
    else if(type == "description"){
        $(".content-activity").removeClass("sticky-activity-active");
        $("#description-activity").addClass("sticky-activity-active");
    }
}

function active_sticky_tour(type){
    if(type == "product"){
        $(".content-tour").removeClass("sticky-tour-active");
        $("#product-tour").addClass("sticky-tour-active");
    }
    else if(type == "description"){
        $(".content-tour").removeClass("sticky-tour-active");
        $("#description-tour").addClass("sticky-tour-active");
    }
}

function breadcrumb_create(breadcrumbs_type, current_step, back_step){
    if(breadcrumbs_type == "airline"){
        var breadcrumbs = ["Home", "Search", "Passenger", "Booking", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/airline';", "location.href='/airline/passenger';", "", ""];
    }
    else if(breadcrumbs_type == "airline_new"){
        var breadcrumbs = ["Home", "Search", "Passenger", "SSR", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "", "", "", "", ""];
    }
    else if(breadcrumbs_type == "activity"){
        var breadcrumbs = ["Home", "Search", "Detail", "Passenger", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/activity';", "location.href='/activity/detail';", "location.href='/activity/passenger';", ""];
    }
    else if(breadcrumbs_type == "hotel"){
        var breadcrumbs = ["Home", "Search", "Rooms", "Guest", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/hotel';", "location.href='/hotel/detail';", "location.href='/hotel/passenger';", "", ""];
    }
    else if(breadcrumbs_type == "tour"){
        var breadcrumbs = ["Home", "Search", "Detail", "Passenger", "Booking", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/tour';", "location.href='/tour/detail';", "location.href='/tour/passenger';", "", ""];
    }
    else if(breadcrumbs_type == "visa"){
        var breadcrumbs = ["Home", "Search", "Passenger", "Booking", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/visa';", "location.href='/visa/passenger';", "", ""];
    }
    else if(breadcrumbs_type == "passport"){
        var breadcrumbs = ["Home", "Search", "Passenger", "Booking", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/visa';", "location.href='/visa/passenger';", "", ""];
    }
    else if(breadcrumbs_type == "train"){
        var breadcrumbs = ["Home", "Search", "Passenger", "Booking", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/train';", "location.href='/train/passenger';", "", ""];
    }
    else if(breadcrumbs_type == "ppob"){
        var breadcrumbs = ["Home", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "", ""];
    }
    else if(breadcrumbs_type == "event"){
        var breadcrumbs = ["Home", "Search", "Details", "Contact & OtherInfo", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/event/search';", "location.href='/event/detail';", "location.href='/event/passenger';", "", ""];
    }

    document.getElementById("breadcrumbs_create").innerHTML = '';
    text = '';
    for (var i = 0; i < breadcrumbs.length; i++) {
      var step = i + 1;
      //can back
      if(back_step == 0){
          //example if 1 < 3 done
          if(step < current_step){
            if(breadcrumbs_url[i] != ""){
                text+=`
                <div class="breadcrumbs-rdx br-done" id="`+breadcrumbs[i]+`-breadcrumb" onclick="`+breadcrumbs_url[i]+`">
                    <span class="breadcrumb-rdx-icon br-icon-done" id="`+breadcrumbs[i]+`-breadcrumb-icon"><i class="fas fa-check"></i></span>
                    <span style="padding-left:5px;">`+breadcrumbs[i]+`</span>
                    <span class="br-fa"><i class="fas fa-arrow-right"></i></span>
                </div>`;
            }
            else{
                text+=`
                <div class="breadcrumbs-rdx br-done" id="`+breadcrumbs[i]+`-breadcrumb">
                    <span class="breadcrumb-rdx-icon br-icon-done" id="`+breadcrumbs[i]+`-breadcrumb-icon"><i class="fas fa-check"></i></span>
                    <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                    <span class="br-fa"><i class="fas fa-arrow-right"></i></span>
                </div>`;
            }
          }
          //example if 3 == 3 active
          else if(step == current_step){
            if(step != breadcrumbs.length){
                text+=`
                <div class="breadcrumbs-rdx br-active" id="`+breadcrumbs[i]+`-breadcrumb">
                    <span class="breadcrumb-rdx-icon br-icon-active" id="`+breadcrumbs[i]+`-breadcrumb-icon">`+step+`</span>
                    <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                    <span class="br-fa"><i class="fas fa-arrow-right"></i></span>
                </div>`;
            }
            else{
                text+=`
                <div class="breadcrumbs-rdx br-active" id="`+breadcrumbs[i]+`-breadcrumb">
                    <span class="breadcrumb-rdx-icon br-icon-active" id="`+breadcrumbs[i]+`-breadcrumb-icon">`+step+`</span>
                    <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                </div>`;
            }
          }
          //example if 3 == 3 default gray
          else{
              if(step == breadcrumbs.length){
                text+=`
                <div class="breadcrumbs-rdx" id="`+breadcrumbs[i]+`-breadcrumb">
                    <span class="breadcrumb-rdx-icon" id="`+breadcrumbs[i]+`-breadcrumb-icon">`+step+`</span>
                    <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                </div>`;
              }
              else{
                text+=`
                <div class="breadcrumbs-rdx" id="`+breadcrumbs[i]+`-breadcrumb">
                    <span class="breadcrumb-rdx-icon" id="`+breadcrumbs[i]+`-breadcrumb-icon">`+step+`</span>
                    <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                    <span class="br-fa"><i class="fas fa-arrow-right"></i></span>
                </div>`;
              }
          }
      }
      //cant back
      else{
        //home
        if(step == 1){
            text+=`
            <div class="breadcrumbs-rdx br-done" id="`+breadcrumbs[i]+`-breadcrumb" onclick="`+breadcrumbs_url[i]+`">
                <span class="breadcrumb-rdx-icon br-icon-done"><i class="fas fa-check" id="`+breadcrumbs[i]+`-breadcrumb-icon"></i></span>
                <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                <span class="br-fa"><i class="fas fa-arrow-right"></i></span>
            </div>`;
        }
        //active
        else if(step == current_step && step != 1){
            if(step != breadcrumbs.length){
                text+=`
                <div class="breadcrumbs-rdx br-active" id="`+breadcrumbs[i]+`-breadcrumb">
                    <span class="breadcrumb-rdx-icon br-icon-active" id="`+breadcrumbs[i]+`-breadcrumb-icon">`+step+`</span>
                    <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                    <span class="br-fa"><i class="fas fa-arrow-right"></i></span>
                </div>`;
            }
            else{
                text+=`
                <div class="breadcrumbs-rdx br-book" id="issued-breadcrumb">
                    <span class="breadcrumb-rdx-icon br-icon-book" id="issued-breadcrumb-icon">`+step+`</span>
                    <span id="issued-breadcrumb-span" style="padding-left:5px;">`+breadcrumbs[i]+`</span>
                </div>`;
            }
        }
        else if(step < current_step && step > 1){
            text+=`
            <div class="breadcrumbs-rdx br-book" id="`+breadcrumbs[i]+`-breadcrumb">
                <span class="breadcrumb-rdx-icon br-icon-book" id="`+breadcrumbs[i]+`-breadcrumb-icon"><i class="fas fa-check"></i></span>
                <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                <span class="br-fa"><i class="fas fa-arrow-right"></i></span>
            </div>`;
        }
        else{
            if(step != breadcrumbs.length){
                text+=`
                <div class="breadcrumbs-rdx" id="`+breadcrumbs[i]+`-breadcrumb">
                    <span class="breadcrumb-rdx-icon" id="`+breadcrumbs[i]+`-breadcrumb-icon">`+step+`</span>
                    <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                    <span class="br-fa"><i class="fas fa-arrow-right"></i></span>
                </div>`;
            }
            else{
                text+=`
                <div class="breadcrumbs-rdx" id="`+breadcrumbs[i]+`-breadcrumb">
                    <span class="breadcrumb-rdx-icon" id="`+breadcrumbs[i]+`-breadcrumb-icon">`+step+`</span>
                    <span style="padding-left:5px;" id="`+breadcrumbs[i]+`-breadcrumb-span">`+breadcrumbs[i]+`</span>
                </div>`;
            }
        }
      }
    }
    var node = document.createElement("div");
    node.className = 'breadcrumbs_flex';
    node.innerHTML = text;
    document.getElementById("breadcrumbs_create").appendChild(node);
    node = document.createElement("div");
}

function off_overlay() {
    document.getElementById("overlay-search-box").style.display = "none";
    document.getElementById("div-search-overlay").style.zIndex = "1";
    div_overlay_checked = 0;
}

function show_hide_general(type){
    var general_down = document.getElementById(type+'_generalDown');
    var general_up = document.getElementById(type+'_generalUp');
    var general_show = document.getElementById(type+'_generalShow');

    if (general_down.style.display === "none") {
        general_up.style.display = "none";
        general_down.style.display = "block";
        general_show.style.display = "none";
    }
    else {
        general_up.style.display = "block";
        general_down.style.display = "none";
        general_show.style.display = "inline-block";
    }
}

function show_hide_itinerary_tour(index){
    var itinerary_down = document.getElementById('itinerary_day'+index+'_down');
    var itinerary_up = document.getElementById('itinerary_day'+index+'_up');
    var itinerary_div = document.getElementById('div_itinerary_day'+index);

    if (itinerary_down.style.display === "none") {
        itinerary_up.style.display = "none";
        itinerary_down.style.display = "inline-block";
        itinerary_div.style.display = "none";
    }
    else {
        itinerary_up.style.display = "inline-block";
        itinerary_down.style.display = "none";
        itinerary_div.style.display = "block";
    }
}

function showImageItinerary(index, idx){
    var show_image = document.getElementById('show_image_itinerary'+index+idx);
    var show_image2 = document.getElementById('show_image_itinerary2'+index+idx);
    var image_itinerary = document.getElementById('image_itinerary'+index+idx);
    var image_itinerary2 = document.getElementById('image_itinerary2'+index+idx);

    if (image_itinerary.style.display === "none") {
        show_image.innerHTML = "Hide image";
        show_image2.innerHTML = "Hide image";
        image_itinerary.style.display = "block";
        image_itinerary2.style.display = "block";
    }
    else {
        show_image.innerHTML = "Show image";
        show_image2.innerHTML = "Show image";
        image_itinerary.style.display = "none";
        image_itinerary2.style.display = "none";
    }
}

function focus_box(id_string){
    var focus = document.getElementById(id_string);
    focus.style.border = "1px solid "+ color;
    focus.style.zIndex = "5";
    document.getElementById("overlay-div-box").style.display = "block";
    document.getElementById("payment_acq").hidden = false;
    $('html, body').animate({
        scrollTop: $("#payment_acq").offset().top - 120
    }, 500);
}

function close_div(id_string){
    var focus = document.getElementById(id_string);
    focus.style.border ="1px solid #cdcdcd";
    try{
        change_top_up();
    }catch(err){}
    document.getElementById("overlay-div-box").style.display = "none";
    document.getElementById("payment_acq").hidden = true;
}

function please_wait_transaction(){
    text_waiting = '';
    text_waiting += `
    <div style="text-align:center;" id="waitFlightSearch" style="display:block;">
        <div class="center-div-t">
            <div>
                <img src="/static/tt_website_rodextrip/img/loading-screen-white.gif" style="height:30px; width:30px;"/>
            </div>
        </div>
        <div style="text-align:center">
            <span style="font-size:20px; font-weight:bold; color:`+text_color+`;">Please wait, while your transaction is being processed ...</span>
        </div>
    </div>`;
    document.getElementById("viewWaitingTransaction").innerHTML = text_waiting;
    $('#waitingTransaction').modal({
        backdrop: 'static'
    });
    $("#waitingTransaction").modal('show');
}

function pagination_numb(numb){
    $page_number = numb;

    if($pagination_type == "hotel"){
        change_image_hotel(numb);
    }

    $('html, body').animate({
        scrollTop: $("#pagination-container").offset().top - 110
    }, 500);
}

function scroll_menu_horizontal(type, target){
    var div_scroll = $('#div_scroll_menu');
    var menu_id = $('#nav_scroll_menu_'+target);
    $temp_target = target;
    $temp_type = type;

    if(template != 3){
        var div_scroll_width = div_scroll.width();
        var menu_id_width = menu_id.outerWidth(true);
        var menu_id_index = menu_id.index();
        var count = 0;
        var find_div = div_scroll.find('.'+type);
        //Just need to add up the width of all the elements before our target.
        for(var i = 0; i < menu_id_index; i++){
            count+= $(find_div[i]).outerWidth(true);
        }
        div_scroll.scrollLeft(Math.max(0, count - (div_scroll_width - menu_id_width)/2));
    }else{
        var width_window = window.innerWidth;
        if(width_window >= 768){
            var div_scroll_height = div_scroll.height();
            var menu_id_height = menu_id.outerHeight(true);
            var menu_id_index = menu_id.index();
            var count = 0;
            var find_div = div_scroll.find('.'+type);

            for(var i = 0; i < menu_id_index; i++){
                count+= $(find_div[i]).outerHeight(true);
            }
            div_scroll.scrollTop(Math.max(0, count - (div_scroll_height - menu_id_height)/2));
        }else{
            var div_scroll_width = div_scroll.width();
            var menu_id_width = menu_id.outerWidth(true);
            var menu_id_index = menu_id.index();
            var count = 0;
            var find_div = div_scroll.find('.'+type);
            //Just need to add up the width of all the elements before our target.
            for(var i = 0; i < menu_id_index; i++){
                count+= $(find_div[i]).outerWidth(true);
            }
            div_scroll.scrollLeft(Math.max(0, count - (div_scroll_width - menu_id_width)/2));
        }
    }
}

function div_dropdown(type){
    var general_down = document.getElementById('down_'+type);
    var general_up = document.getElementById('up_'+type);
    var general_show = document.getElementById('div_'+type);

    if (general_down.style.display === "none") {
        general_up.style.display = "none";
        general_down.style.display = "inline-block";
        general_show.style.display = "none";
    }
    else {
        general_up.style.display = "inline-block";
        general_down.style.display = "none";
        general_show.style.display = "block";
    }
}

function next_focus_element(product, from){
    if(product == 'airline'){
        if(from == 'passenger'){
            setTimeout(function(){
                $("#show_provider_airline").click();
            }, 200);
        }else if(from == 'airline'){
            setTimeout(function(){
                $("#show_provider_airline").click();
                $('.nice-select').addClass("open");
            }, 200);
        }else if(from == 'passenger1'){
            setTimeout(function(){
                $("#show_provider_airline1").click();
            }, 200);
        }
    }else if(product == 'hotel'){
        if(from == 'passenger'){
            setTimeout(function(){
                $("#show_total_pax_hotel").click();
            }, 200);
            setTimeout(function(){
                $('#hotel_id_nationality_id').select2('open');
            }, 200);
        }
        if(from == 'passenger_wizard'){
            setTimeout(function(){
                $("#show_total_pax_hotel_wizard").click();
            }, 200);
            setTimeout(function(){
                $('#hotel_id_nationality_wizard_id').select2('open');
            }, 200);
        }
    }else if(product == 'train'){
        if(from == 'passenger'){
            setTimeout(function(){
                $("#show_total_pax_train").click();
            }, 200);
        }
    }
}
