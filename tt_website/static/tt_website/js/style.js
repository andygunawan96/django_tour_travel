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

    //accordion
    const accordionBtns = document.querySelectorAll(".accordion");

    accordionBtns.forEach((accordion) => {
      accordion.onclick = function () {
        this.classList.toggle("is-open");

        let content = this.nextElementSibling;

        if (content.style.maxHeight) {
          //this is if the accordion is open
          content.style.display = "none";
//          content.style.minHeight = null;
          content.style.maxHeight = null;
        } else {
          //if the accordion is currently closed
          content.style.display = "block";
          content.style.maxHeight = "unset";
//          content.style.minHeight = content.scrollHeight + "px";
        }
      };
    });

    $('#myModalSignIn').on('shown.bs.modal', function () {
        $('#username').focus();
    })

    $('.dropdown-menu').click(function(e) {
        e.stopPropagation();
        if ($(e.target).is('[data-toggle=modal]')) {
            $($(e.target).data('target')).modal()
        }
    });

    //notifikasi
    $(".notification-slide-toggle").click(function(){
        $(".box-notification").animate({
            width: "toggle",
            opacity: "toggle"
        });
        document.body.style.overflowY = "hidden";
    });

    //getbooking
    $(".getbooking-slide-toggle").click(function(){
        $(".box-getbooking").animate({
            width: "toggle",
            opacity: "toggle"
        });
        document.body.style.overflowY = "hidden";
    });

    //getbooking from vendor
    $(".getbooking-fv-slide-toggle").click(function(){
        $(".box-getbooking-fv").animate({
            width: "toggle",
            opacity: "toggle"
        });
        document.body.style.overflowY = "hidden";
    });

    //getbooking from vendor
    $(".passenger-db-slide-toggle").click(function(){
        $(".box-passenger-db").animate({
            width: "toggle",
            opacity: "toggle"
        });
        document.body.style.overflowY = "hidden";
    });

//    //shortcut
//    var mainDiv = document.getElementById('main-button');
//    mainDiv.addEventListener('click', function(){
//      this.children.item(0).classList.toggle('fa-times');
//      this.classList.toggle('open');
//    });


//    $(".cor-db-slide-toggle").click(function(){
//        $(".box-cor-db").animate({
//            width: "toggle",
//            opacity: "toggle"
//        });
//        document.body.style.overflowY = "hidden";
//    });

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


//    if (user_login.co_user_login == default_user){
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

    $(window).scroll(function() {
        if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
            $('#myBtnBTP').fadeIn(200);    // Fade in the arrow
        } else {
            $('#myBtnBTP').fadeOut(200);   // Else fade out the arrow
        }

        if ($(window).width() >= 992) {
            if($(this).scrollTop() >= $('#sorting-search-flight').height() + 200) {
                 $('#sort_pc_vr').show();
            }else{
                 $('#sort_pc_vr').hide();
            }
            if($(this).scrollTop() >= $('#filter-search-flight').height() + 300) {
                 $('#filter_pc_vr').show();
            }else{
                 $('#filter_pc_vr').hide();
            }
            if($(this).scrollTop() >= $('#recommendation_div_scr').height() + 100) {
                 $('#recommendation_pc_vr').show();
            }else{
                 $('#recommendation_pc_vr').hide();
            }
        }else{
            $('#sort_pc_vr').hide();
            $('#filter_pc_vr').hide();
            $('#recommendation_pc_vr').hide();
        }

//        if($(this).scrollTop() >= $('#filter-search-flight').offset().top + $('#filter-search-flight').outerHeight() - $(this).innerHeight) {
//            alert('end reached');
//        }
//testing_lalalala2
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
            $('#sort_pc_vr').hide();
            $('#filter_pc_vr').hide();
            $('#recommendation_pc_vr').hide();
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

    $('#change_search_box').click(function() {      // When arrow is clicked
        div_overlay_checked += 1;

        document.getElementById("overlay-search-box").style.display = "block";
        document.getElementById("div-search-overlay").style.zIndex = "3";
        try{
            document.getElementById("change_search_box").style.zIndex = "98";
        }catch(err){

        }
        if(div_overlay_checked == 1){
            $('html, body').animate({
                scrollTop: $("#div-search-overlay").offset().top - 150
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

    $('ul.template_tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.template_tabs li').removeClass('current');
		$('.template_tab-content').removeClass('current');

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

	//settings page
    $('ul.main_menu_tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.main_menu_tabs li').removeClass('current');
		$('.main_menu_content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

    $('ul.sub_menu_tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.sub_menu_tabs li').removeClass('current');
		$('.sub_menu_content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})


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
    $('#show_total_pax_train').text(quantity_adult_train+quantity_infant_train+ ' Passengers');

    $('.right-plus-adult-train').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#train_adult').val());

        // If is not undefined
        if(quantity < 4 && total_max_pax == 0 || quantity < total_max_pax){
            $('#train_adult').val(quantity + 1);
            quantity_adult_train = quantity + 1;

            //$('#show_total_pax_train').text(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant ");
            $('#show_total_pax_train').text(quantity_adult_train+quantity_infant_train+ ' Passengers');
        }
        // DEFAULT OR USE LIMITATION
        if (quantity_adult_train == 4 && total_max_pax == 0 || quantity == total_max_pax && total_max_pax != 0){
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

            //$('#show_total_pax_train').text(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant ");
            $('#show_total_pax_train').text(quantity_adult_train+quantity_infant_train+ ' Passengers');
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

            //$('#show_total_pax_train').text(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant ");
            $('#show_total_pax_train').text(quantity_adult_train+quantity_infant_train+ ' Passengers');
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

            //$('#show_total_pax_train').val(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant ");
            $('#show_total_pax_train').text(quantity_adult_train+quantity_infant_train+ ' Passengers');
        }

        if (quantity_infant_train == 0){
            document.getElementById("left-minus-infant-train").disabled = true;
            document.getElementById("right-plus-infant-train").disabled = false;
        }
        else{
            document.getElementById("right-plus-infant-train").disabled = false;
        }

    });


    var quantity_adult_bus = parseInt($('#bus_adult').val());
    $('#show_total_pax_bus').text(quantity_adult_bus + " Passengers");

    $('.right-plus-adult-bus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#bus_adult').val());

        // If is not undefined
        if(quantity < 4){
            $('#bus_adult').val(quantity + 1);
            quantity_adult_bus = quantity + 1;

            $('#show_total_pax_bus').text(quantity_adult_bus + " Passengers");
        }

        if (quantity_adult_bus == 4){
            document.getElementById("left-minus-adult-bus").disabled = false;
            document.getElementById("right-plus-adult-bus").disabled = true;
        }
        else{
            document.getElementById("left-minus-adult-bus").disabled = false;
        }
    });
    $('.left-minus-adult-bus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#bus_adult').val());

        // If is not undefined
        // Increment
        if(quantity > 1){
            $('#bus_adult').val(quantity - 1);
            quantity_adult_bus = quantity - 1;

            $('#show_total_pax_bus').text(quantity_adult_bus + " Passengers");
        }

        if (quantity_adult_bus == 1){
            document.getElementById("left-minus-adult-bus").disabled = true;
            document.getElementById("right-plus-adult-bus").disabled = false;
        }
        else{
            document.getElementById("right-plus-adult-bus").disabled = false;
        }
    });

    var quantity_adult_insurance = parseInt($('#insurance_adult').val());
    $('#show_total_pax_insurance').text(quantity_adult_insurance + " Customer");

    $('.right-plus-adult-insurance').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#insurance_adult').val());

        // If is not undefined
        if(quantity < 4){
            $('#insurance_adult').val(quantity + 1);
            quantity_adult_insurance = quantity + 1;

            $('#show_total_pax_insurance').text(quantity_adult_insurance + " Customer");
        }

        if (quantity_adult_insurance == 4){
            document.getElementById("left-minus-adult-insurance").disabled = false;
            document.getElementById("right-plus-adult-insurance").disabled = true;
        }
        else{
            document.getElementById("left-minus-adult-insurance").disabled = false;
        }
    });
    $('.left-minus-adult-insurance').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#insurance_adult').val());

        // If is not undefined
        // Increment
        if(quantity > 1){
            $('#insurance_adult').val(quantity - 1);
            quantity_adult_insurance = quantity - 1;

            $('#show_total_pax_insurance').text(quantity_adult_insurance + " Customer");
        }

        if (quantity_adult_insurance == 1){
            document.getElementById("left-minus-adult-insurance").disabled = true;
            document.getElementById("right-plus-adult-insurance").disabled = false;
        }
        else{
            document.getElementById("right-plus-adult-insurance").disabled = false;
        }
    });

    //medical
    var quantity_passenger_medical = parseInt($('#passenger_medical').val());
    $('#show_total_pax_medical').text(quantity_passenger_medical + " Passengers");

    $('.right-plus-adult-medical').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_medical').val());

        // If is not undefined
        if(quantity < 9){
            $('#adult_medical').val(quantity + 1);
            quantity_adult_flight = quantity + 1;

            $('#show_total_pax_medical').text(quantity_passenger_medical + " Passengers");
        }

        // Increment

        if (quantity == 9){
            document.getElementById("right-plus-adult-medical").disabled = true;
        }

    });
    $('.left-minus-adult-medical').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_medical').val());

        // If is not undefined
        // Increment
        if(quantity > 1){
            $('#adult_medical').val(quantity - 1);
            quantity_adult_flight = quantity - 1;
            $('#show_total_pax_medical').text(quantity_passenger_medical + " Passengers");
        }
        if (quantity == 1){
            document.getElementById("left-minus-adult-medical").disabled = true;
        }
    });

    var quantity_adult_flight = parseInt($('#adult_flight').val());
    var quantity_child_flight = parseInt($('#child_flight').val());
    var quantity_infant_flight = parseInt($('#infant_flight').val());

//    $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");

    $('.right-plus-adult-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_flight').val());

        // If is not undefined
        if(quantity < 9){
            $('#adult_flight').val(quantity + 1);
            quantity_adult_flight = quantity + 1;
        }
        plus_min_passenger_airline_btn();
    });
    $('.left-minus-adult-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_flight').val());

        // If is not undefined
        // Increment
        var minimum_quantity = 1;
        if(airline_advance_pax_type == 'true')
            minimum_quantity = 0;
        if(quantity > minimum_quantity){
            $('#adult_flight').val(quantity - 1);
            $('#adult_flight1').val(quantity - 1);
            quantity_adult_flight = quantity - 1;
            if(quantity_adult_flight < quantity_infant_flight){
               quantity_infant_flight = quantity_adult_flight;
               $('#infant_flight').val(quantity - 1);
               $('#infant_flight1').val(quantity - 1);
            }
        }
        plus_min_passenger_airline_btn();
    });
    $('.right-plus-child-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#child_flight').val());

        // If is not undefined
        if(quantity < 8){
            $('#child_flight').val(quantity + 1);
            $('#child_flight1').val(quantity + 1);
            quantity_child_flight = quantity + 1;
        }
        plus_min_passenger_airline_btn();
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
            $('#child_flight1').val(quantity - 1);
            quantity_child_flight = quantity - 1;
        }
        plus_min_passenger_airline_btn();
    });
    $('.right-plus-infant-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#infant_flight').val());

        // If is not undefined
        if (quantity < quantity_adult_flight){
            $('#infant_flight').val(quantity + 1);
            $('#infant_flight1').val(quantity + 1);
            quantity_infant_flight = quantity + 1;
        }
        plus_min_passenger_airline_btn();
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
            $('#infant_flight1').val(quantity - 1);
            quantity_infant_flight = quantity - 1;
        }
        plus_min_passenger_airline_btn();
    });

    // airline advance pax type
    // student
    $('.right-plus-student-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#student_flight').val());

        // If is not undefined
        if(quantity < 8){
            $('#student_flight').val(quantity + 1);
            $('#student_flight1').val(quantity + 1);
            quantity_student_flight = quantity + 1;
        }
        plus_min_passenger_airline_btn();
    });
    $('.left-minus-student-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#student_flight').val());

        // If is not undefined
        // Increment
        if(quantity > 0){
            $('#student_flight').val(quantity - 1);
            $('#student_flight1').val(quantity - 1);
            quantity_student_flight = quantity - 1;
        }
        plus_min_passenger_airline_btn();
    });

    // labour
    $('.right-plus-labour-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#labour_flight').val());

        // If is not undefined
        if(quantity < 8){
            $('#labour_flight').val(quantity + 1);
            $('#labour_flight1').val(quantity + 1);
            quantity_labour_flight = quantity + 1;
        }
        plus_min_passenger_airline_btn();
    });
    $('.left-minus-labour-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#labour_flight').val());

        // If is not undefined
        // Increment
        if(quantity > 0){
            $('#labour_flight').val(quantity - 1);
            $('#labour_flight1').val(quantity - 1);
            quantity_labour_flight = quantity - 1;
        }
        plus_min_passenger_airline_btn();
    });

    // seaman
    $('.right-plus-seaman-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#seaman_flight').val());

        // If is not undefined
        if(quantity < 8){
            $('#seaman_flight').val(quantity + 1);
            $('#seaman_flight1').val(quantity + 1);
            quantity_seaman_flight = quantity + 1;
        }
        plus_min_passenger_airline_btn();
    });
    $('.left-minus-seaman-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#seaman_flight').val());

        // If is not undefined
        // Increment
        if(quantity > 0){
            $('#seaman_flight').val(quantity - 1);
            $('#seaman_flight1').val(quantity - 1);
            quantity_seaman_flight = quantity - 1;
        }
        plus_min_passenger_airline_btn();
    });

    //groupbooking
    var quantity_adult_flight_gb = parseInt($('#adult_flight_gb').val());
    var quantity_child_flight_gb = parseInt($('#child_flight_gb').val());
    var quantity_infant_flight_gb = parseInt($('#infant_flight_gb').val());

    $('#show_total_pax_flight_gb').text(quantity_adult_flight_gb + " Adult, " + quantity_child_flight_gb + " Child, " +quantity_infant_flight_gb + " Infant");
    $('.right-plus-adult-flight_gb').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_flight_gb').val());
        var quantity_child_flight_gb = parseInt($('#child_flight_gb').val());
        var quantity_infant_flight_gb = parseInt($('#infant_flight_gb').val());

        // If is not undefined
        if(quantity < 50){
            $('#adult_flight_gb').val(quantity + 1);
            quantity_adult_flight_gb = quantity + 1;

            $('#show_total_pax_flight_gb').text(quantity_adult_flight_gb + " Adult, " +quantity_child_flight_gb + " Child, " +quantity_infant_flight_gb + " Infant");
        }

        if (quantity_adult_flight_gb+quantity_child_flight_gb == 50){
            document.getElementById("left-minus-adult-flight_gb").disabled = false;
            document.getElementById("right-plus-adult-flight_gb").disabled = true;
            document.getElementById("right-plus-child-flight_gb").disabled = true;
            if (quantity_child_flight_gb > 0){
                document.getElementById("left-minus-child-flight_gb").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight_gb").disabled = true;
            }
        }
        else{
            document.getElementById("left-minus-adult-flight_gb").disabled = false;
            document.getElementById("right-plus-child-flight_gb").disabled = false;
            if (quantity_child_flight_gb > 0){
                document.getElementById("left-minus-child-flight_gb").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight_gb").disabled = true;
            }
        }
        // Increment

        if (quantity_adult_flight_gb > quantity_infant_flight_gb){
            document.getElementById("right-plus-infant-flight_gb").disabled = false;
        }
        if (quantity_adult_flight_gb == quantity_infant_flight_gb){
            document.getElementById("right-plus-infant-flight_gb").disabled = true;
        }
    });
    $('.left-minus-adult-flight_gb').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_flight_gb').val());
        var quantity_child_flight_gb = parseInt($('#child_flight_gb').val());
        var quantity_infant_flight_gb = parseInt($('#infant_flight_gb').val());

        // If is not undefined
        // Increment
        if(quantity > 9){
            $('#adult_flight_gb').val(quantity - 1);
            quantity_adult_flight_gb = quantity - 1;

            if(quantity_adult_flight_gb < quantity_infant_flight_gb){
               quantity_infant_flight_gb = quantity_adult_flight_gb;
               $('#infant_flight_gb').val(quantity - 1);
            }

            $('#show_total_pax_flight_gb').text(quantity_adult_flight_gb + " Adult, " + quantity_child_flight_gb + " Child, " +quantity_infant_flight_gb + " Infant");
        }

        if (quantity_adult_flight_gb+quantity_child_flight_gb == 50){
            document.getElementById("left-minus-adult-flight_gb").disabled = false;
            document.getElementById("right-plus-adult-flight_gb").disabled = true;
            document.getElementById("right-plus-child-flight_gb").disabled = true;
            if (quantity_child_flight_gb > 0){
                document.getElementById("left-minus-child-flight_gb").disabled = false;
            }
        }
        else{
            document.getElementById("right-plus-child-flight_gb").disabled = false;
            if (quantity_child_flight_gb > 0){
                document.getElementById("left-minus-child-flight_gb").disabled = false;
            }

            if (quantity_adult_flight_gb == 10){
                document.getElementById("left-minus-adult-flight_gb").disabled = true;
                document.getElementById("right-plus-adult-flight_gb").disabled = false;
            }
            else{
                document.getElementById("right-plus-adult-flight_gb").disabled = false;
            }
        }

        if (quantity_adult_flight_gb == quantity_infant_flight_gb){
            document.getElementById("right-plus-infant-flight_gb").disabled = true;
        }
    });
    $('.right-plus-child-flight_gb').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#child_flight_gb').val());
        var quantity_adult_flight_gb = parseInt($('#adult_flight_gb').val());
        var quantity_infant_flight_gb = parseInt($('#infant_flight_gb').val());

        // If is not undefined
        if(quantity < 49){
            $('#child_flight_gb').val(quantity + 1);
            quantity_child_flight_gb = quantity + 1;

            $('#show_total_pax_flight_gb').text(quantity_adult_flight_gb + " Adult, " +quantity_child_flight_gb + " Child, " +quantity_infant_flight_gb + " Infant");
        }

        if (quantity_adult_flight_gb+quantity_child_flight_gb == 50){
            document.getElementById("right-plus-adult-flight_gb").disabled = true;
            document.getElementById("right-plus-child-flight_gb").disabled = true;
            document.getElementById("left-minus-child-flight_gb").disabled = false;
            if (quantity_adult_flight_gb == 50){
                document.getElementById("left-minus-adult-flight_gb").disabled = true;
            }
            if (quantity_child_flight_gb > 0){
                document.getElementById("left-minus-child-flight_gb").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight_gb").disabled = true;
            }
        }
        else{
            document.getElementById("right-plus-child-flight_gb").disabled = false;
            document.getElementById("left-minus-child-flight_gb").disabled = false;

            if (quantity_child_flight_gb > 0){
                document.getElementById("left-minus-child-flight_gb").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight_gb").disabled = true;
            }
        }
    });
    $('.left-minus-child-flight_gb').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#child_flight_gb').val());
        var quantity_adult_flight_gb = parseInt($('#adult_flight_gb').val());
        var quantity_infant_flight_gb = parseInt($('#infant_flight_gb').val());

        // If is not undefined
        // Increment
        if(quantity > 0){
            $('#child_flight_gb').val(quantity - 1);
            quantity_child_flight_gb = quantity - 1;

            $('#show_total_pax_flight_gb').text(quantity_adult_flight_gb + " Adult, " + quantity_child_flight_gb + " Child, " +quantity_infant_flight_gb + " Infant");
        }

        if (quantity_adult_flight_gb+quantity_child_flight_gb != 9){
            document.getElementById("right-plus-adult-flight_gb").disabled = false;
            document.getElementById("right-plus-child-flight_gb").disabled = false;
            if (quantity_adult_flight_gb == 50){
                document.getElementById("left-minus-adult-flight_gb").disabled = true;
            }
            if (quantity_child_flight_gb > 0){
                document.getElementById("left-minus-child-flight_gb").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight_gb").disabled = true;
            }
        }
    });
    $('.right-plus-infant-flight_gb').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#infant_flight_gb').val());
        var quantity_adult_flight_gb = parseInt($('#adult_flight_gb').val());
        var quantity_child_flight_gb = parseInt($('#child_flight_gb').val());

        // If is not undefined
        if (quantity < quantity_adult_flight_gb){
            $('#infant_flight_gb').val(quantity + 1);
            quantity_infant_flight_gb = quantity + 1;

            $('#show_total_pax_flight_gb').text(quantity_adult_flight_gb + " Adult, " + quantity_child_flight_gb + " Child, " +quantity_infant_flight_gb + " Infant");
        }
        // Increment

//        alert(quantity_infant_train);
//        alert(quantity_adult_train);

        if (quantity_infant_flight_gb < quantity_adult_flight_gb){
            document.getElementById("left-minus-infant-flight_gb").disabled = false;
            document.getElementById("right-plus-infant-flight_gb").disabled = false;
        }
        else if(quantity_infant_flight_gb == quantity_adult_flight_gb){
            document.getElementById("left-minus-infant-flight_gb").disabled = false;
            document.getElementById("right-plus-infant-flight_gb").disabled = true;
        }
        else{
            document.getElementById("right-plus-infant-flight_gb").disabled = true;
            document.getElementById("left-minus-infant-flight_gb").disabled = false;
        }
    });
    $('.left-minus-infant-flight_gb').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#infant_flight_gb').val());
        var quantity_adult_flight_gb = parseInt($('#adult_flight_gb').val());
        var quantity_child_flight_gb = parseInt($('#child_flight_gb').val());

        // If is not undefined
        // Increment
        if(quantity > 0){
            $('#infant_flight_gb').val(quantity - 1);
            quantity_infant_flight_gb = quantity - 1;

            $('#show_total_pax_flight_gb').text(quantity_adult_flight_gb + " Adult, " + quantity_child_flight_gb + " Child, " +quantity_infant_flight_gb + " Infant");
        }

        if (quantity_infant_flight_gb == 0){
            document.getElementById("left-minus-infant-flight_gb").disabled = true;
            document.getElementById("right-plus-infant-flight_gb").disabled = false;
        }
        else{
            document.getElementById("right-plus-infant-flight_gb").disabled = false;
        }
    });
    $("#adult_flight_gb").change(function(){
        var quantity = parseInt($('#adult_flight_gb').val());
        var quantity_child = parseInt($('#child_flight_gb').val());
        var quantity_infant = parseInt($('#infant_flight_gb').val());
        var count_max_qty_adt = 50-quantity_child;

        if(quantity < 10 || isNaN(quantity)){
            quantity = 10;
            $('#adult_flight_gb').val(quantity);
            document.getElementById("left-minus-adult-flight_gb").disabled = true;
            if (quantity+quantity_child == 50){
                document.getElementById("right-plus-adult-flight_gb").disabled = true;
                document.getElementById("right-plus-child-flight_gb").disabled = true;
                document.getElementById("left-minus-child-flight_gb").disabled = false;
            }else{
                document.getElementById("right-plus-adult-flight_gb").disabled = false;
                document.getElementById("right-plus-child-flight_gb").disabled = false;

                if(quantity_child == 0){
                    document.getElementById("left-minus-child-flight_gb").disabled = true;
                }else{
                    document.getElementById("left-minus-child-flight_gb").disabled = false;
                }
            }

            if (quantity <= quantity_infant){
                $('#infant_flight_gb').val(quantity);
                quantity_infant = quantity;
                document.getElementById("right-plus-infant-flight_gb").disabled = true;
            }else{
                document.getElementById("right-plus-infant-flight_gb").disabled = false;
            }
            $('#show_total_pax_flight_gb').text(quantity+ " Adult, " +quantity_child + " Child, " +quantity_infant + " Infant");
        }
        else if(quantity > count_max_qty_adt){
            quantity = count_max_qty_adt;
            $('#adult_flight_gb').val(quantity);

            if (quantity+quantity_child >= 50){
                document.getElementById("right-plus-adult-flight_gb").disabled = true;
                document.getElementById("right-plus-child-flight_gb").disabled = true;

                if(quantity != 10){
                    document.getElementById("left-minus-adult-flight_gb").disabled = false;
                }else{
                    document.getElementById("left-minus-adult-flight_gb").disabled = true;
                }
                if (quantity_child == 0){
                    document.getElementById("left-minus-child-flight_gb").disabled = true;
                }else{
                    document.getElementById("left-minus-child-flight_gb").disabled = false;
                }
            }else{
                document.getElementById("right-plus-adult-flight_gb").disabled = false;
                document.getElementById("right-plus-child-flight_gb").disabled = false;
            }

            if (quantity <= quantity_infant){
                $('#infant_flight_gb').val(quantity);
                quantity_infant = quantity;
                document.getElementById("right-plus-infant-flight_gb").disabled = true;
            }else{
                document.getElementById("right-plus-infant-flight_gb").disabled = false;
            }
            $('#show_total_pax_flight_gb').text(quantity + " Adult, " +quantity_child + " Child, " +quantity_infant + " Infant");
        }
        else{
            $('#adult_flight_gb').val(quantity);
            if (quantity+quantity_child >= 50){
                document.getElementById("right-plus-adult-flight_gb").disabled = true;
                document.getElementById("right-plus-child-flight_gb").disabled = true;
            }else{
                document.getElementById("right-plus-adult-flight_gb").disabled = false;
                document.getElementById("right-plus-child-flight_gb").disabled = false;

                if(quantity <= 10){
                    document.getElementById("left-minus-adult-flight_gb").disabled = true;
                }else{
                    document.getElementById("left-minus-adult-flight_gb").disabled = false;
                }

                if (quantity_child == 0){
                    document.getElementById("left-minus-child-flight_gb").disabled = true;
                }else{
                    document.getElementById("left-minus-child-flight_gb").disabled = false;
                }
            }

            if (quantity <= quantity_infant){
                $('#infant_flight_gb').val(quantity);
                quantity_infant = quantity;
                document.getElementById("right-plus-infant-flight_gb").disabled = true;
            }else{
                document.getElementById("right-plus-infant-flight_gb").disabled = false;
            }
            $('#show_total_pax_flight_gb').text(quantity + " Adult, " +quantity_child + " Child, " +quantity_infant + " Infant");
        }
    });
    $("#child_flight_gb").change(function(){
        var quantity = parseInt($('#child_flight_gb').val());
        var quantity_adult = parseInt($('#adult_flight_gb').val());
        var quantity_infant = parseInt($('#infant_flight_gb').val());
        var count_max_qty_adt = 50-quantity_adult;

        if(quantity < 1){
            quantity = 0;
            $('#child_flight_gb').val(quantity);
            document.getElementById("left-minus-child-flight_gb").disabled = true;
            if (quantity+quantity_adult < 50){
                document.getElementById("right-plus-adult-flight_gb").disabled = false;
                document.getElementById("left-minus-adult-flight_gb").disabled = false;
                document.getElementById("right-plus-child-flight_gb").disabled = false;
            }

            if(quantity_adult != 10){
                document.getElementById("left-minus-adult-flight_gb").disabled = false;
            }else{
                document.getElementById("left-minus-adult-flight_gb").disabled = true;
            }

            $('#show_total_pax_flight_gb').text(quantity_adult+ " Adult, " +quantity + " Child, " +quantity_infant + " Infant");
        }
        else{
            if(quantity >= count_max_qty_adt){
                quantity = count_max_qty_adt;
                $('#child_flight_gb').val(quantity);

                document.getElementById("right-plus-adult-flight_gb").disabled = true;
                document.getElementById("right-plus-child-flight_gb").disabled = true;

                if(quantity_adult != 10){
                    document.getElementById("left-minus-adult-flight_gb").disabled = false;
                }else{
                    document.getElementById("left-minus-adult-flight_gb").disabled = true;
                }

                if(quantity != 0){
                    document.getElementById("left-minus-child-flight_gb").disabled = false;
                }else{
                    document.getElementById("left-minus-child-flight_gb").disabled = true;
                }

                $('#show_total_pax_flight_gb').text(quantity_adult + " Adult, " +quantity + " Child, " +quantity_infant + " Infant");
            }
            else{
                if(count_max_qty_adt == 0){
                    $('#child_flight_gb').val(count_max_qty_adt);
                    document.getElementById("right-plus-child-flight_gb").disabled = true;
                    document.getElementById("left-minus-child-flight_gb").disabled = true;
                }else{
                    $('#child_flight_gb').val(quantity);
                    document.getElementById("right-plus-adult-flight_gb").disabled = false;
                    document.getElementById("right-plus-child-flight_gb").disabled = false;

                    if(quantity_adult != 10){
                        document.getElementById("left-minus-adult-flight_gb").disabled = false;
                    }else{
                        document.getElementById("left-minus-adult-flight_gb").disabled = true;
                    }

                    if(quantity != 0){
                        document.getElementById("left-minus-child-flight_gb").disabled = false;
                    }else{
                        document.getElementById("left-minus-child-flight_gb").disabled = true;
                    }
                }

                $('#show_total_pax_flight_gb').text(quantity_adult + " Adult, " +quantity + " Child, " +quantity_infant + " Infant");
            }
        }
    });
    $("#infant_flight_gb").change(function(){
        var quantity = parseInt($('#infant_flight_gb').val());
        var quantity_adult = parseInt($('#adult_flight_gb').val());
        var quantity_child = parseInt($('#child_flight_gb').val());

        if(quantity < 1){
            quantity = 0;
            $('#infant_flight_gb').val(quantity);
            document.getElementById("left-minus-infant-flight_gb").disabled = true;
            document.getElementById("right-plus-infant-flight_gb").disabled = false;
            $('#show_total_pax_flight_gb').text(quantity_adult+ " Adult, " +quantity_child + " Child, " +quantity + " Infant");
        }else{
            if(quantity >= quantity_adult){
                $('#infant_flight_gb').val(quantity_adult);
                document.getElementById("right-plus-infant-flight_gb").disabled = true;
                document.getElementById("left-minus-infant-flight_gb").disabled = false;
            }else{
                $('#infant_flight_gb').val(quantity);
                document.getElementById("right-plus-infant-flight_gb").disabled = false;
                document.getElementById("left-minus-infant-flight_gb").disabled = false;
            }

            $('#show_total_pax_flight_gb').text(quantity_adult+ " Adult, " +quantity_child + " Child, " +quantity + " Infant");
        }
    });

    //medical
    var quantity_passenger_medical = parseInt($('#passenger_medical').val());
    $('#show_total_pax_medical').text(quantity_passenger_medical + " Passengers");
    $('.right-plus-adult-medical').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_medical').val());

        // If is not undefined
        if(quantity < 9){
            $('#adult_medical').val(quantity + 1);
            quantity_adult_flight = quantity + 1;

            $('#show_total_pax_medical').text(quantity_passenger_medical + " Passengers");
        }

        // Increment

        if (quantity == 9){
            document.getElementById("right-plus-adult-medical").disabled = true;
        }

    });
    $('.left-minus-adult-medical').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_medical').val());

        // If is not undefined
        // Increment
        if(quantity > 1){
            $('#adult_medical').val(quantity - 1);
            quantity_adult_flight = quantity - 1;
            $('#show_total_pax_medical').text(quantity_passenger_medical + " Passengers");
        }
        if (quantity == 1){
            document.getElementById("left-minus-adult-medical").disabled = true;
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
        // DEFAULT OR USE LIMITATION
        if(quantity < 9 && total_max_pax == 0 || quantity < total_max_pax){
            $('#hotel_room').val(quantity + 1);
            $('#hotel_adult').val(((quantity+1)*2) > 9 ? 9 : ((quantity+1)*2));
            quantity_room_hotel = quantity + 1;
            quantity_adult_hotel = ((quantity+1)*2) > 9 ? 9 : ((quantity+1)*2);

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
        }
        // DEFAULT OR USE LIMITATION
        if (quantity_room_hotel >= 9 && total_max_pax == 0 || quantity_room_hotel >= total_max_pax && total_max_pax != 0){
            document.getElementById("right-plus-room-hotel").disabled = true;
            document.getElementById("left-minus-room-hotel").disabled = false;
            document.getElementById("right-plus-adult-hotel").disabled = true;
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }else if(quantity_room_hotel <= 1){
            document.getElementById("right-plus-room-hotel").disabled = false;
            document.getElementById("left-minus-room-hotel").disabled = true;
            document.getElementById("right-plus-adult-hotel").disabled = false;
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }else{
            document.getElementById("right-plus-room-hotel").disabled = false;
            document.getElementById("left-minus-room-hotel").disabled = false;
            document.getElementById("left-minus-adult-hotel").disabled = false;
            if (quantity_adult_hotel >= 9){
                document.getElementById("right-plus-adult-hotel").disabled = true;
            }
        }
        if (quantity_room_hotel > quantity_child_hotel){
            document.getElementById("right-plus-child-hotel").disabled = false;
        }

        if (quantity_room_hotel*2 >= quantity_child_hotel){
            document.getElementById("right-plus-child-hotel").disabled = false;
        }else{
            document.getElementById("right-plus-child-hotel").disabled = true;
        }
    });
    $('.left-minus-room-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_room').val());

        if(quantity > 1){
            $('#hotel_room').val(quantity - 1);
            $('#hotel_adult').val(((quantity-1)*2) > 9 ? 9 : ((quantity-1)*2));
            quantity_room_hotel = quantity - 1;
            quantity_adult_hotel = ((quantity-1)*2) > 9 ? 9 : ((quantity-1)*2);

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
        if (quantity_room_hotel <= 4){
            document.getElementById("right-plus-adult-hotel").disabled = false;
        }

        if (quantity_room_hotel > quantity_child_hotel){
            document.getElementById("right-plus-child-hotel").disabled = false;
        }
        else{
            document.getElementById("right-plus-child-hotel").disabled = true;
        }

        if (quantity_room_hotel*2 >= quantity_child_hotel){
            document.getElementById("right-plus-child-hotel").disabled = false;
        }else{
            document.getElementById("right-plus-child-hotel").disabled = true;
        }

    });
    $('.right-plus-adult-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_adult').val());

        // If is not undefined
        if(quantity < 9){
            $('#hotel_adult').val(quantity + 1);
            quantity_adult_hotel = quantity + 1;

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
        }

        if(quantity_adult_hotel >= 9){
            document.getElementById("left-minus-adult-hotel").disabled = false;
            document.getElementById("right-plus-adult-hotel").disabled = true;
        }else{
            document.getElementById("left-minus-adult-hotel").disabled = false;
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

    $('#overview-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-overview-hotel").offset().top - 50
        }, 500);
        active_sticky_hotel("overview");
    });

    $('#select-room-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-select-room-hotel").offset().top - 50
        }, 500);
        active_sticky_hotel("select");
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

    //add template
    $('#radio_train_search').click(function(){
        selected_value = $("input[name='radio_train_type']:checked").val();

        if (selected_value == "oneway"){
            $('#span_radio_train_type').text('One Way');
            document.getElementById("train_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");

            if(template == 4){
                text+=`
                <span class="span-search-ticket">Departure</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }
            else{
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }

            text+=`<input type="hidden" class="form-control date-picker airline_return" name="train_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("train_date_search").appendChild(node);
            node = document.createElement("div");

            $("#train_departure").val(moment().format('DD MMM YYYY'));
            $("#train_return").val($("#train_departure").val());

            var picker_train_departure = new Lightpick({
                field: document.getElementById('train_departure'),
                singleDate: true,
                startDate: moment(),
                minDate: moment(),
                maxDate: moment().subtract(-2, 'months'),
                nextFocus: '#show_total_pax_train'
            });
        }
        else if(selected_value == "roundtrip"){
            $('#span_radio_train_type').text('Round Trip');
            document.getElementById("train_date_search").innerHTML = '';
            text ='';
            var node = document.createElement("div");

            text+=`
            <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" style="background:white;" name="train_departure_return" id="train_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
            </div>`;

            text+=`
            <input type="hidden" class="form-control" name="train_departure" id="train_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
            <input type="hidden" class="form-control" name="train_return" id="train_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("train_date_search").appendChild(node);
            node = document.createElement("div");

            $("#train_departure").val(moment().format('DD MMM YYYY'));
            $("#train_return").val(moment().subtract(-1, 'days').format('DD MMM YYYY'));

            picker_train_departure_return = new Lightpick({
                field: document.getElementById('train_departure_return'),
                singleDate: false,
                hoveringTooltip: false,
                startDate: moment(),
                endDate: moment().subtract(-1, 'days'),
                minDate: moment(),
                maxDate: moment().subtract(-2, 'months'),
                onSelect: function(start, end){
                    $("#train_departure").val(start.format('DD MMM YYYY'));
                    $("#train_return").val(end.format('DD MMM YYYY'));
                }
            });
        }
    });

    //add template
    $('#radio_airline_search').click(function(){
        selected_value = $("input[name='radio_airline_type']:checked").val();

        airline_counter_config = 0;
        counter_airline_search = 0;

        if (selected_value == "oneway"){
            $('#span_radio_airline_type').text('One Way');
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");
            document.getElementById('is_combo_price').disabled = true;
            document.getElementById('is_combo_price').checked = false;
            document.getElementById('checkbox_combo_price').style.display = "none";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('ori_airline_top').style.display = "inline-block";
            document.getElementById('mc_airline_default').innerHTML = "";
            document.getElementById('mc_airline_paxs').innerHTML = "";

            if(template == 4){
                text+=`
                <span class="span-search-ticket">Departure</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }
            else{
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }

            text+=`<input type="hidden" class="form-control date-picker airline_return" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("airline_date_search").appendChild(node);
            node = document.createElement("div");

            $("#airline_departure").val(moment().format('DD MMM YYYY'));
            $("#airline_return").val($("#airline_departure").val());

            var picker_airline_departure = new Lightpick({
                field: document.getElementById('airline_departure'),
                singleDate: true,
                startDate: moment(),
                minDate: moment(),
                maxDate: moment().subtract(-1, 'years'),
            });
        }
        else if(selected_value == "roundtrip"){
            $('#span_radio_airline_type').text('Round Trip');
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");
            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('is_combo_price').checked = true;
            document.getElementById('checkbox_combo_price').style.display = "inline-flex";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('ori_airline_top').style.display = "inline-block";
            document.getElementById('mc_airline_default').innerHTML = "";
            document.getElementById('mc_airline_paxs').innerHTML = "";

            if(template == 4){
                text+=`
                <span class="span-search-ticket">Departure - Return</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }
            else{
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }

            text+=`
            <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
            <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("airline_date_search").appendChild(node);
            node = document.createElement("div");

            $("#airline_departure").val(moment().format('DD MMM YYYY'));
            $("#airline_return").val(moment().subtract(-1, 'days').format('DD MMM YYYY'));

            var picker_airline_departure_return = new Lightpick({
                field: document.getElementById('airline_departure_return'),
                singleDate: false,
                hoveringTooltip: false,
                startDate: moment(),
                endDate: moment().subtract(-1, 'days'),
                minDate: moment(),
                maxDate: moment().subtract(-1, 'years'),
                onSelect: function(start, end){
                    $("#airline_departure").val(start.format('DD MMM YYYY'));
                    $("#airline_return").val(end.format('DD MMM YYYY'));
                }
            });
        }
        else if (selected_value == "multicity"){
            $('#span_radio_airline_type').text('Multi City');
            text_mc='';

            text_mc += `
            <div class="row">
                <div class="col-lg-12">
                    <div id="mc_airline_add" style="background:none !important; margin-bottom:15px;"></div>
                    <div style="text-align:left;">
                        <button type="button" id="add_mc_btn" class="primary-btn-ad" onclick="add_multi_city('home');"><i class="fas fa-plus"></i> Add Flight</button>
                        <button type="button" id="del_mc_btn" class="primary-btn-white-cancel" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete Flight</button>
                    </div>
                </div>
            </div>`;

            document.getElementById('mc_airline_default').innerHTML = text_mc;
            document.getElementById('ori_airline').style.display = "none";
            document.getElementById('ori_airline_top').style.display = "none";
            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('is_combo_price').checked = true;
            document.getElementById('checkbox_combo_price').style.display = "inline-flex";

            add_multi_city('home');
            //add_multi_city('home');
        }

        plus_min_passenger_airline_btn();
    });

    //add template
    $('#radio_bus_search').click(function(){
        selected_value = $("input[name='radio_bus_type']:checked").val();

        if (selected_value == "oneway"){
            document.getElementById("bus_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");

            if(template == 4){
                text+=`
                <span class="span-search-ticket">Departure</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="bus_departure" id="bus_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }
            else{
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bus_departure" id="bus_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }

            text+=`<input type="hidden" class="form-control date-picker airline_return" name="bus_return" id="bus_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("bus_date_search").appendChild(node);
            node = document.createElement("div");

            $("#bus_departure").val(moment().format('DD MMM YYYY'));
            $("#bus_return").val($("#bus_departure").val());

            var picker_bus_departure = new Lightpick({
                field: document.getElementById('bus_departure'),
                singleDate: true,
                startDate: moment(),
                minDate: moment(),
                maxDate: moment().subtract(-3, 'months'),
                nextFocus: '#show_total_pax_bus'
            });
        }
        else if(selected_value == "roundtrip"){
            document.getElementById("bus_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");

            if(template == 4){
                text+=`
                <span class="span-search-ticket">Departure - Return</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="bus_departure_return" id="bus_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }
            else{
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="bus_departure_return" id="bus_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }

            text+=`
            <input type="hidden" class="form-control" name="bus_departure" id="bus_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
            <input type="hidden" class="form-control" name="bus_return" id="bus_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("bus_date_search").appendChild(node);
            node = document.createElement("div");

            $("#bus_departure").val(moment().format('DD MMM YYYY'));
            $("#bus_return").val(moment().subtract(-1, 'days').format('DD MMM YYYY'));

            var picker_bus_departure_return = new Lightpick({
                field: document.getElementById('bus_departure_return'),
                singleDate: false,
                hoveringTooltip: false,
                startDate: moment(),
                endDate: moment().subtract(-1, 'days'),
                minDate: moment(),
                maxDate: moment().subtract(-3, 'months'),
                nextFocus: '#show_total_pax_bus',
                onSelect: function(start, end){
                    $("#bus_departure").val(start.format('DD MMM YYYY'));
                    $("#bus_return").val(end.format('DD MMM YYYY'));
                }
            });
        }
    });

    $('#radio_airline_change_search').click(function(){
        selected_value = $("input[name='radio_airline_type']:checked").val();
        if (selected_value == "oneway"){
            $('#span_radio_airline_type').text('One Way');
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");

            if(template == 4){
                text+=`
                <span class="span-search-ticket">Departure</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }
            else{
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }

            text+=`<input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("airline_date_search").appendChild(node);
            node = document.createElement("div");
            document.getElementById('is_combo_price').disabled = true;
            document.getElementById('checkbox_combo_price').style.display = "none";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('ori_airline_top').style.display = "inline-block";
            document.getElementById('mc_airline_default').innerHTML = "";
            document.getElementById('mc_airline_paxs').innerHTML = "";
            airline_counter_config = 0;
            counter_airline_search = 0;

            document.getElementById("airline_departure").value = document.getElementById("airline_departure_temp").value;
            document.getElementById("airline_return").value = document.getElementById("airline_departure").value;

            var picker_airline_departure = new Lightpick({
                field: document.getElementById('airline_departure'),
                singleDate: true,
                startDate: $("#airline_departure").val(),
                minDate: moment(),
                maxDate: moment().subtract(-1, 'years'),
            });

            quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
            quantity_child_flight = parseInt(document.getElementById('child_flight').value);
            quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);

//            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
//            $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");

        }
        else if(selected_value == "roundtrip"){
            $('#span_radio_airline_type').text('Round Trip');
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");

            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('is_combo_price').checked = true;
            document.getElementById('checkbox_combo_price').style.display = "inline-flex";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('ori_airline_top').style.display = "inline-block";
            document.getElementById('mc_airline_default').innerHTML = "";
            document.getElementById('mc_airline_paxs').innerHTML = "";

            airline_counter_config = 0;
            counter_airline_search = 0;

            if(template == 4){
                text+=`
                <span class="span-search-ticket">Departure - Return</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" value="{{airline_request.departure}} - {{airline_request.return}}" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }
            else{
                text+=`
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" value="{{airline_request.departure}} - {{airline_request.return}}" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly style="background:white;">
                </div>`;
            }

            text+=`
            <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
            <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

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

                var picker_airline_departure_return = new Lightpick({
                    field: document.getElementById('airline_departure_return'),
                    singleDate: false,
                    hoveringTooltip: false,
                    startDate: $('#airline_departure').val(),
                    endDate: date_tomorrow,
                    minDate: moment(),
                    maxDate: moment().subtract(-1, 'years'),
                    onSelect: function(start, end){
                        $("#airline_departure").val(start.format('DD MMM YYYY'));
                        $("#airline_return").val(end.format('DD MMM YYYY'));
                    }
                });
            }
            else{
                document.getElementById("airline_departure").value = document.getElementById("airline_departure_temp").value;
                document.getElementById("airline_return").value = document.getElementById("airline_return_temp").value;
                document.getElementById("airline_departure_return").value = document.getElementById("airline_departure").value + '-' + document.getElementById("airline_return").value;

                var picker_airline_departure_return = new Lightpick({
                    field: document.getElementById('airline_departure_return'),
                    singleDate: false,
                    hoveringTooltip: false,
                    startDate: $('#airline_departure').val(),
                    endDate: $('#airline_return').val(),
                    minDate: moment(),
                    maxDate: moment().subtract(-1, 'years'),
                    onSelect: function(start, end){
                        $("#airline_departure").val(start.format('DD MMM YYYY'));
                        $("#airline_return").val(end.format('DD MMM YYYY'));
                    }
                });

            }

            quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
            quantity_child_flight = parseInt(document.getElementById('child_flight').value);
            quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);

//            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
//            $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
        }
        else if (selected_value == "multicity"){
            $('#span_radio_airline_type').text('Multi City');
            airline_counter_config = 0;
            counter_airline_search = 0;
            text_mc='';

            text_mc += `
            <div class="row">
                <div class="col-lg-12">
                    <div id="mc_airline_add" style="background:none !important; margin-bottom:15px;"></div>
                    <div style="text-align:left;">
                        <button type="button" id="add_mc_btn" class="primary-btn-ad" onclick="add_multi_city('search');"><i class="fas fa-plus"></i> Add Flight</button>
                        <button type="button" id="del_mc_btn" class="primary-btn-white-cancel" onclick="del_multi_city();"><i class="fas fa-trash-alt"></i> Delete Flight</button>
                    </div>
                </div>
            </div>`;

            document.getElementById('mc_airline_default').innerHTML = text_mc;
            document.getElementById('ori_airline').style.display = "none";
            document.getElementById('ori_airline_top').style.display = "none";
            document.getElementById('is_combo_price').checked = true;
            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('checkbox_combo_price').style.display = "inline-flex";
            airline_request_counter = airline_request.counter;
            if(airline_request_counter == 0)
                airline_request_counter = 2
            for(var airline_counter=0;airline_counter<parseInt(airline_request_counter);airline_counter++){
                add_multi_city('search');
            }

            quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
            quantity_child_flight = parseInt(document.getElementById('child_flight').value);
            quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);

//            $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
//            $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
            //func_check_provider()
        }
    });

    $('#radio_insurance_search').click(function(){
        selected_value = $("input[name='radio_insurance_type']:checked").val();
        if (selected_value == "Annual"){
            $("#insurance_date").val(moment().subtract(-1, 'days').format('DD MMM YYYY') + ' - ' + moment().subtract(-1, 'days').subtract(-1, 'years').format('DD MMM YYYY'));

            $('input[name="insurance_date"]').daterangepicker({
                singleDatePicker: true,
                autoUpdateInput: false,
                minDate: moment().subtract(-1, 'days'),
                maxDate: moment().subtract(-1, 'years'),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });

            $('input[name="insurance_date"]').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('DD MMM YYYY') + ' - ' + moment(picker.startDate).subtract(-1, 'years').format('DD MMM YYYY'));
                $("#insurance_date").val(picker.startDate.format('DD MMM YYYY') + ' - ' + moment(picker.startDate).subtract(-1, 'years').format('DD MMM YYYY'));
                setTimeout(function(){
                    $("#show_total_pax_insurance").click();
                }, 200);
            });
        }
        else{
            $('input[name="insurance_date"]').daterangepicker({
                singleDatePicker: false,
                autoUpdateInput: true,
                autoApply: true,
                startDate: moment(),
                endDate: moment().subtract(-2, 'days'),
                minDate: moment().subtract(-1, 'days'),
                maxDate: moment().subtract(-1, 'years'),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });

            $('input[name="insurance_date"]').on('apply.daterangepicker', function(ev, picker) {
                setTimeout(function(){
                    $("#show_total_pax_insurance").click();
                }, 200);
            });
        }
    });



});

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

function hide_loading(){
    $('.next-loading').removeClass("running");
    $('.next-loading').prop('disabled', false);
    $('.payment_method').prop('disabled', false).niceSelect('update');
    $(".payment_acq *").prop('disabled',false);
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
    if(typeof(adult) !== 'undefined'){
        for (var i=1; i <= parseInt(adult); i++){
            paxs = document.getElementById('adult_paxs'+i);
            paxs_up = document.getElementById('adult_up_paxs'+i);
            paxs_down = document.getElementById('adult_down_paxs'+i);
        }
    }
    if(typeof(infant) !== 'undefined'){
        for (var i=1; i <= parseInt(infant); i++){
            paxs = document.getElementById('infant_paxs'+i);
            paxs_up = document.getElementById('infant_up_paxs'+i);
            paxs_down = document.getElementById('infant_down_paxs'+i);
        }
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

    if(typeof(adult) !== 'undefined'){
        for (var i=1; i <= parseInt(adult); i++){
            paxs = document.getElementById('adult_paxs'+i);
            paxs_up = document.getElementById('adult_up_paxs'+i);
            paxs_down = document.getElementById('adult_down_paxs'+i);
        }
    }

    if(typeof(child) !== 'undefined'){
        for (var i=1; i <= parseInt(child); i++){
            paxs = document.getElementById('child_paxs'+i);
            paxs_up = document.getElementById('child_up_paxs'+i);
            paxs_down = document.getElementById('child_down_paxs'+i);
        }
    }

    if(typeof(infant) !== 'undefined'){
        for (var i=1; i <= parseInt(infant); i++){
            paxs = document.getElementById('infant_paxs'+i);
            paxs_up = document.getElementById('infant_up_paxs'+i);
            paxs_down = document.getElementById('infant_down_paxs'+i);
        }
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

function show_visa_details(key){
    var flight = document.getElementById('detail_visa'+key);
    var flight_down = document.getElementById('visa_details_down'+key);
    var flight_up = document.getElementById('visa_details_up'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight.style.display = "block";
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight.style.display = "none";
    }
}

function show_flight_details(key){
    var journey = document.getElementById('journey'+key);
    var flight = document.getElementById('detail_departjourney'+key);
    var flight_down_pc = document.getElementById('flight_details_down_pc'+key);
    var flight_up_pc = document.getElementById('flight_details_up_pc'+key);
    var flight_down = document.getElementById('flight_details_down'+key);
    var flight_up = document.getElementById('flight_details_up'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight_up_pc.style.display = "block";
        flight_down_pc.style.display = "none";
        flight.style.display = "block";
        journey.style.marginBottom = "15px";
        journey.style.border= "1px solid "+color;
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight_up_pc.style.display = "none";
        flight_down_pc.style.display = "block";
        flight.style.display = "none";
        journey.style.marginBottom = "15px";
        journey.style.border= "1px solid #cdcdcd";
    }
}

function show_train_details(key){
    var flight = document.getElementById('detail_departjourney'+key);
    var flight_down_pc = document.getElementById('train_details_down_pc'+key);
    var flight_up_pc = document.getElementById('train_details_up_pc'+key);
    var flight_down = document.getElementById('train_details_down'+key);
    var flight_up = document.getElementById('train_details_up'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight_up_pc.style.display = "block";
        flight_down_pc.style.display = "none";
        flight.style.display = "block";
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight_up_pc.style.display = "none";
        flight_down_pc.style.display = "block";
        flight.style.display = "none";
    }
}

function show_flight_details2(key){
    var journey = document.getElementById('journey_pick'+key);
    var flight = document.getElementById('detail_departjourney_pick'+key);
    var flight_down = document.getElementById('flight_details_down2'+key);
    var flight_up = document.getElementById('flight_details_up2'+key);
    var flight_down_pc = document.getElementById('flight_details_down_pc2'+key);
    var flight_up_pc = document.getElementById('flight_details_up_pc2'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight_up_pc.style.display = "block";
        flight_down_pc.style.display = "none";
        flight.style.display = "block";
        journey.style.marginBottom = "15px";
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight_up_pc.style.display = "none";
        flight_down_pc.style.display = "block";
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

function delete_birth_date(type, id){
    document.getElementById(type+'_birth_date'+id).value = "";
}

function delete_country_of_issued(type, id){
    document.getElementById('select2-'+type+'_country_of_issued'+id+'_id-container').innerHTML = "Country Of Issued";
    document.getElementById(type+'_country_of_issued'+id+'_id').value = "";
    document.getElementById(type+'_country_of_issued'+id).value = "";
    $('#'+type+'_country_of_issued'+id+'_id').val('').trigger('change');

}

function show_hide_change_search(){
    var change_search_box = document.getElementById("change_search_box");

    if (change_search_box.style.display === "none") {
        change_search_box.style.display = "block";
        document.getElementById("overlay-search-box").style.display = "block";
        $('html, body').animate({
            scrollTop: $("#change_search_box").offset().top - 150
        }, 500);
        document.getElementById("change_search_text").innerHTML = "<i class='fas fa-times' style='font-size:18px;'></i>";
    }
    else {
        change_search_box.style.display = "none";
        document.getElementById("overlay-search-box").style.display = "none";
        document.getElementById("change_search_text").innerHTML = "<i class='fas fa-search' style='font-size:18px;'></i>";
    }
}

function go_to_change_search(id_div){
    var change_search_box = document.getElementById(id_div);

    if (change_search_box.style.display === "none") {
        change_search_box.style.display = "block";
        document.getElementById("change_search_text").innerHTML = "<i class='fas fa-times' style='font-size:18px;'></i>";
    }
    else {
        change_search_box.style.display = "none";
        document.getElementById("change_search_text").innerHTML = "<i class='fas fa-search' style='font-size:18px;'></i>";
    }

    $('html, body').animate({
        scrollTop: $("#div-search-overlay").offset().top - 150
    }, 500);
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

function show_hide_facilities(id){
    var span_facilities_up = document.getElementById("span-facilities-up"+id);
    var span_facilities_down = document.getElementById("span-facilities-down"+id);
    var div_facilities = document.getElementById("div-facilities"+id);

    if (span_facilities_up.style.display === "none") {
        span_facilities_down.style.display = "none";
        div_facilities.style.display = "none";
        span_facilities_up.style.display = "block";
    }
    else {
        span_facilities_down.style.display = "block";
        div_facilities.style.display = "block";
        span_facilities_up.style.display = "none";
    }
}

function show_hide_subtotal(id){
    var span_subtotal_up = document.getElementById("span-subtotal-up"+id);
    var span_subtotal_down = document.getElementById("span-subtotal-down"+id);
    var div_subtotal = document.getElementById("div-subtotal"+id);

    if (span_subtotal_up.style.display === "none") {
        span_subtotal_down.style.display = "none";
        div_subtotal.style.display = "none";
        span_subtotal_up.style.display = "block";
    }
    else {
        span_subtotal_down.style.display = "block";
        div_subtotal.style.display = "block";
        span_subtotal_up.style.display = "none";
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
                    split[i] = split[i].toUpperCase();
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
    if(type == "overview"){
        $(".content-hotel").removeClass("sticky-hotel-active");
        $("#overview-hotel").addClass("sticky-hotel-active");
    }
    else if(type == "select"){
        $(".content-hotel").removeClass("sticky-hotel-active");
        $("#select-room-hotel").addClass("sticky-hotel-active");
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
    else if(breadcrumbs_type == "group_booking"){
        var breadcrumbs = ["Home", "Request", "Confirm", "Booking", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "", ""];
    }
    else if(breadcrumbs_type == "event"){
        var breadcrumbs = ["Home", "Search", "Details", "Contact", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/event/search';", "location.href='/event/detail';", "location.href='/event/passenger';", "", ""];
    }else if(breadcrumbs_type == "medical"){
        var breadcrumbs = ["Home", "Passenger", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "", "", ""];
    }else if(breadcrumbs_type == "swabexpress"){
        var breadcrumbs = ["Home", "Passenger", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "", "", ""];
    }else if(breadcrumbs_type == "labpintar"){
        var breadcrumbs = ["Home", "Passenger", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "", "", ""];
    }else if(breadcrumbs_type == "mitrakeluarga"){
        var breadcrumbs = ["Home", "Passenger", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "", "", ""];
    }else if(breadcrumbs_type == "sentramedika"){
        var breadcrumbs = ["Home", "Passenger", "Review", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "", "", ""];
    }else if(breadcrumbs_type == "bus"){
        var breadcrumbs = ["Home", "Search", "Passenger", "Review", "Booking", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/bus';", "location.href='/bus/passenger';", "", "", ""];
    }else if(breadcrumbs_type == "insurance"){
        var breadcrumbs = ["Home", "Search", "Passenger", "Review", "Booking", "Issued"];
        var breadcrumbs_url = ["location.href='/dashboard';", "location.href='/insurance';", "location.href='/insurance/passenger';", "", "", ""];
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
    try{
        document.getElementById("change_search_box").style.zIndex = "98";
    }catch(err){
        console.log('err');
    }
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
        itinerary_div.style.display = "block";
    }
    else {
        itinerary_up.style.display = "inline-block";
        itinerary_down.style.display = "none";
        itinerary_div.style.display = "none";
    }
}

function showImageItinerary(index, idx){
    var show_image = document.getElementById('show_image_itinerary'+index+idx);
    //var show_image2 = document.getElementById('show_image_itinerary2'+index+idx);
    var image_itinerary = document.getElementById('image_itinerary'+index+idx);
    //var image_itinerary2 = document.getElementById('image_itinerary2'+index+idx);

    if (image_itinerary.style.display === "none") {
        show_image.innerHTML = "Hide image";
        //show_image2.innerHTML = "Hide image";
        image_itinerary.style.display = "block";
        //image_itinerary2.style.display = "block";
    }
    else {
        show_image.innerHTML = "Show image";
        //show_image2.innerHTML = "Show image";
        image_itinerary.style.display = "none";
        //image_itinerary2.style.display = "none";
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
                <img src="/static/tt_website/images/gif/loading-screen-white.gif" style="height:30px; width:30px;"/>
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
    }else if($pagination_type == "hotel_detail"){
        change_image_hotel_detail(numb);
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
function open_cos_seat_class(id1, id2){
    if ($("#provider_seat_content"+id1+id2).hasClass("show")) {
        $("#provider_seat_content"+id1+id2).dropdown("toggle");
    }else{
        setTimeout(function(){
            $("#show_choose_seat"+id1+id2).click();
        }, 200);
    }
}

function open_cos_seat_class_pick(id1, id2){
    if ($("#provider_seat_content_pick"+id1+id2).hasClass("show")) {
        $("#provider_seat_content_pick"+id1+id2).dropdown("toggle");
    }else{
        setTimeout(function(){
            $("#show_choose_seat_pick"+id1+id2).click();
        }, 200);
    }
}

//untuk next focus element d product search
function next_focus_element(product, from){
    if(product == 'airline'){
        if(from == 'route'){
            setTimeout(function(){
                $('.nice-select').removeClass("open");
                $("#show_total_pax_flight").click();
            }, 200);
        }else if(from == 'route1'){
            setTimeout(function(){
                $("#show_total_pax_flight1").click();
            }, 200);
        }else if(from == 'passenger'){
            setTimeout(function(){
                $("#show_provider_airline").click();
            }, 200);
        }else if(from == 'passenger1'){
            setTimeout(function(){
                $("#show_provider_airline1").click();
            }, 200);
        }else if(from == 'airline'){
            setTimeout(function(){
                $("#show_provider_airline").click();
                $('.class_airline_select').find('.nice-select').addClass("open");
            }, 200);
        }else if(from == 'class'){
            setTimeout(function(){
                $('.class_airline_select').find('.nice-select').removeClass("open");
                $("#origin_id_flight").focus();
            }, 200);
        }else if(from == 'preferred'){
            setTimeout(function(){
                $("#origin_id_flight1").focus();
            }, 200);
        }else{
            setTimeout(function(){
                $(''+from).focus();
                $(''+from).find('.nice-select').addClass("open");
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
    }else if(product == 'activity'){
        if(from == 'country'){
            setTimeout(function(){
                $("#show_country_city_activity").click();
            }, 200);
        }
        if(from == 'type'){
            setTimeout(function(){
                $("#show_type_category").click();
            }, 200);
        }
    }else if(product == 'tour'){
        if(from == 'country'){
            setTimeout(function(){
                $("#show_country_city_tour").click();
            }, 200);
        }
        if(from == 'time'){
            setTimeout(function(){
                $("#show_month_year_tour").click();
            }, 200);
        }
    }else if(product == 'train'){
        if(from == 'route'){
            setTimeout(function(){
                $('.nice-select').removeClass("open");
                $("#show_total_pax_train").click();
            }, 200);
        }else if(from == 'passenger'){
            setTimeout(function(){
                $("#train_origin").focus();
            }, 200);
        }else{
            setTimeout(function(){
                $(''+from).focus();
                $(''+from).find('.nice-select').addClass("open");
            }, 200);
        }

        if(from == 'passenger'){
            setTimeout(function(){
                $("#show_total_pax_train").click();
            }, 200);
        }
    }else if(product == 'bus'){
        if(from == 'passenger'){
            setTimeout(function(){
                $("#show_total_pax_bus").click();
            }, 200);
        }
    }else if(product == 'insurance'){
        if(from == 'plantrip'){
            setTimeout(function(){
                $('#insurance_date').focus();
            }, 200);
        }else if(from == 'passenger'){
            setTimeout(function(){
                $("#insurance_searchForm").click();
            }, 200);
        }else if(from == 'date'){
            setTimeout(function(){
                $('#insurance_date').focus();
            }, 200);
        }
    }
}

//for template 6 search box hide
function product_change_box(id){
    if(id == "choose"){
        document.getElementById("box_"+id).style.display = "block";
        document.getElementById("box_"+temp_product).style.display = "none";
    }else{
        document.getElementById("box_"+id).style.display = "block";
        document.getElementById("box_choose").style.display = "none";
        temp_product = id;
    }
}

//untuk navigate go_guide
function go_guide(id){
    $('html, body').animate({
        scrollTop: $("#"+id).offset().top
    }, 500);
}

//untuk navigate ke element
function go_to_element(id, min_top){
    $('html, body').animate({
        scrollTop: $("#"+id).offset().top - min_top
    }, 500);
}

function open_signin_modal(){
    $('#mylogintemplate6').modal('show');
    $('#overlay_menu_mobile').show();
}

function open_signup_modal(){
    $('#mylogintemplate6').modal('hide');
    $('#myModalb2c').modal('show');
}

function open_signin_close_signup_modal(){
    $('#myModalb2c').modal('hide');
    $('#mylogintemplate6').modal('show');
}

function please_wait_custom(text_value){
    document.getElementById("text_value_waiting").innerHTML = text_value;
}

function show_loading_reorder(product){
    $('.next-loading-reorder').addClass("running");
    $('.next-loading-reorder').prop('disabled', true);
    $('.issued_booking_btn').prop('disabled', true);
    $('#button-sync-status').prop('disabled', true);

    custom_waiting = '';
    if(product == 'airline'){
        custom_waiting += `
        <div id="waitFlightSearch" style="display:block;">
            <div class="center-div-t">
                <div>
                    <img src="/static/tt_website/images/gif/loading-screen-white.gif" style="height:30px; width:30px;"/>
                </div>
            </div>
            <div style="text-align:center">
                <span style="font-size:20px; font-weight:bold; color:`+text_color+`;" id="text_value_waiting">Set Request, please wait <img src="/static/tt_website/images/gif/loading-dot-white.gif" style="height:50px; width:50px;"/></span>
            </div>
        </div>`;
    }else if(product == 'train'){
        custom_waiting += `
        <div id="waitFlightSearch" style="display:block;">
            <div class="center-div-t">
                <div>
                    <img src="/static/tt_website/images/gif/loading-screen-white.gif" style="height:30px; width:30px;"/>
                </div>
            </div>
            <div style="text-align:center">
                <span style="font-size:20px; font-weight:bold; color:`+text_color+`;" id="text_value_waiting">Set Passenger, please wait <img src="/static/tt_website/images/gif/loading-dot-white.gif" style="height:50px; width:50px;"/></span>
            </div>
        </div>`;
    }
    document.getElementById("viewWaitingTransaction").innerHTML = custom_waiting;
    $("#waitingTransaction").modal('show');
}

//untuk notif overlay
function on_off_overlay_bar(class_box, overlay_class){
    var overlay_bm = document.getElementsByClassName(overlay_class)[0];

    if (overlay_bm.style.display === "none") {
        overlay_bm.style.display = "block";
    }else{
        overlay_bm.style.display = "none";
        if(class_box != 'checked_menu'){
            $("."+class_box).animate({
                width: "toggle",
                opacity: "toggle"
            });
        }else{
            $('.menu-has-children a').next().removeClass('nav-ul-d-block');
            $('#drop').prop('checked',false);
        }
    }
    $("body").css("overflowY", "");
}

//untuk tombol next dan prev
function next_prev_side_div(btn_from_id, btn_to_id, from_id, to_id, target_id){
    document.getElementById(btn_from_id+'_'+target_id).style.display = "none";
    document.getElementById(btn_to_id+'_'+target_id).style.display = "block";
    document.getElementById(from_id+'_'+target_id).style.display = "none";
    document.getElementById(to_id+'_'+target_id).style.display = "flex";
}

//untuk tombol next dan prev
function next_prev_sync(btn_from_id, btn_to_id, from_id, to_id){
    document.getElementById(btn_from_id).style.display = "none";
    document.getElementById(btn_to_id).style.display = "inline-block";
    document.getElementById(from_id).style.display = "none";
    document.getElementById(to_id).style.display = "block";
}

//untuk kosongin tombol di atas
function clear_btn_top(btn_pax_type, btn_pax_number){
    document.getElementById("button_tl_"+btn_pax_type+btn_pax_number).innerHTML = '';
    document.getElementById("button_tr_"+btn_pax_type+btn_pax_number).innerHTML = '';
}

//untuk close modal + reset
function close_modal_check(pax_ty, pax_num){
    clear_btn_top(pax_ty, pax_num);
    clear_search_pax(pax_ty, pax_num);
    //update_contact(pax_ty, pax_num);
    if(pax_num == ''){
        $('#myModal_'+pax_ty).modal('hide');
    }else{
        $('#myModal_'+pax_ty+pax_num).modal('hide');
    }
}

//untuk pointer events disable
function search_modal_pe_none(){
    $('.overlay_modal_custom').css('pointer-events','none');
    $('.modal_custom_close').css('pointer-events','none');
}

//untuk pointer events enable
function search_modal_pe_unset(){
    $('.overlay_modal_custom').css('pointer-events','unset');
    $('.modal_custom_close').css('pointer-events','unset');
}


function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function search_setting_page(default_li, default_tab){
	var tab_setting_arr = [];
    var settingSearchField = $("#input_search_setting");
	var settingBtn = $(".accordion")
    var filter = settingSearchField.val();

    settingBtn.each(function() {
        let next_accordion = this.nextElementSibling;
        if(filter != ''){
            var tab_id_filter = $(this).attr('data-tab'); //tab tab
            next_accordion.style.display = "none"; //close

            if($(this).text().search(new RegExp(filter, 'i')) < 0) {
                this.style.display = "none";
                this.style.maxHeight = null;
            }
            else {
                this.style.display = "block";
                this.style.maxHeight = null;

                tab_setting_arr.push(tab_id_filter);
            }
        }

        else{
            this.style.display = "block";
            this.style.maxHeight = null;
            next_accordion.style.display = "none"; //close

            tab_setting_arr = [];
        }
    });

    $('ul.main_menu_tabs li').removeClass('current');
    $('.main_menu_content').removeClass('current');

    if(tab_setting_arr.length != 0){
        var unique_setting = tab_setting_arr.filter(onlyUnique);
        for (var i=0;i<unique_setting.length; i++){
            $("#"+unique_setting[i]+"-li").addClass('current');
            $("#"+unique_setting[i]).addClass('current');
        }
    }else{
        $("#"+default_li).addClass('current');
        $("#"+default_tab).addClass('current');
    }
}

//untuk close modal + reset
function switch_modal(from_target, to_target){
    $('#'+from_target).modal('hide');

    setTimeout(function(){
        if(to_target == 'myModalSignIn'){
            $('#'+to_target).modal({backdrop: 'static', keyboard: false})
        }else{
            $('#'+to_target).modal('show');
        }
    }, 500);
}


function content_modal_custom(modal_id, modal_body, header_title, content){
    document.getElementById(modal_body).innerHTML = content;
    document.getElementById(modal_body+'_header').innerHTML = header_title;
    $('#'+modal_id).modal('show');
}

function hide_div(id){
    var div_show = document.getElementById(id);
    div_show.style.display = "none";
}

function show_div(id){
    var div_show = document.getElementById(id);
    div_show.style.display = "block";
}

function show_hide_div(id){
    var div_show = document.getElementById(id);

    if (div_show.style.display === "none") {
        div_show.style.display = "block";
    }
    else {
        div_show.style.display = "none";
    }
}

function next_input_otp(elem){
    setTimeout(() => {
      document.getElementById(elem).focus();
    }, 0);
}

function next_input_pin(){
    try{
        setTimeout(() => {
            document.getElementById('pin_otp_input1').select();
        }, 0);
    }catch(err){}
}


