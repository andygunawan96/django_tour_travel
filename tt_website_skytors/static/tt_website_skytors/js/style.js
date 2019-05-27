
$(document).ready(function(){

    var sort_price=0;
    var sort_duration=0;
    var sort_departure=0;
    var sort_arrival=0;

    if ($(window).width() >= 992) {
        $('#filter-search-flight').show();
        $('#sorting-search-flight').show();
        $('#filter-search-train').show();
        $('#sorting-search-train').show();
        $('#mybuttonfiltersort').hide();
    }
    else {
        $('#filter-search-flight').hide();
        $('#sorting-search-flight').hide();
        $('#filter-search-train').hide();
        $('#sorting-search-train').hide();
        $('#mybuttonfiltersort').show();
    }


    $(window).click(function(e) {
        if ($(".ld-over-full-inverse").hasClass("running")) {
            $(".ld-over-full-inverse").removeClass("running");
        }
    });

    $(".img-min-ticket").hide();
    $(".img-min-filter").hide();

//    $('#A').click(function (e) { //Default mouse Position
//        alert(e.pageX + ' , ' + e.pageY);
//    });

    $(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#myBtnBTP').fadeIn(200);    // Fade in the arrow
    } else {
        $('#myBtnBTP').fadeOut(200);   // Else fade out the arrow
        }
    });

    $(window).resize(function() {
        if ($(window).width() >= 992) {
            $('#filter-search-flight').show();
            $('#sorting-search-flight').show();
            $('#filter-search-train').show();
            $('#sorting-search-train').show();
            $('#mybuttonfiltersort').hide();
            $("#myModalFilterSort").modal('hide');
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
//            document.getElementById("").style.display = "none";
//            document.getElementById("sorting-search-train2").style.display = "none";
//            document.getElementById("mybuttonfiltersort").style.display = "block";
        }
    });

    $('#return-to-top').click(function() {      // When arrow is clicked
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 500);
    });

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
    $("#show_adult_train").text(quantity_adult_train);
    $("#show_infant_train").text(quantity_infant_train);
    $('#show_total_pax_train').text(quantity_adult_train + " Adult, " +quantity_infant_train + " Infant");

    $('.right-plus-adult-train').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#train_adult').val());

        // If is not undefined
        if(quantity < 4){
            $('#train_adult').val(quantity + 1);
            $("#show_adult_train").text(quantity + 1);
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
            $("#show_adult_train").text(quantity - 1);
            quantity_adult_train = quantity - 1;

            if(quantity_adult_train < quantity_infant_train){
               quantity_infant_train = quantity_adult_train;
               $('#train_infant').val(quantity - 1);
               $("#show_infant_train").text(quantity_infant_train);
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
            $("#show_infant_train").text(quantity - 1);
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
    $("#show_adult_flight").text(quantity_adult_flight);
    $("#show_child_flight").text(quantity_child_flight);
    $("#show_infant_flight").text(quantity_infant_flight);
    $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");

    $('.right-plus-adult-flight').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#adult_flight').val());

        // If is not undefined
        if(quantity < 9){
            $('#adult_flight').val(quantity + 1);
            $("#show_adult_flight").text(quantity + 1);
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
            $("#show_adult_flight").text(quantity - 1);
            quantity_adult_flight = quantity - 1;

            if(quantity_adult_flight < quantity_infant_flight){
               quantity_infant_flight = quantity_adult_flight;
               $('#infant_flight').val(quantity - 1);
               $("#show_infant_flight").text(quantity_infant_flight);
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
            $("#show_child_flight").text(quantity + 1);
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
            $("#show_child_flight").text(quantity - 1);
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
            $("#show_infant_flight").text(quantity + 1);
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
            document.getElementById("left-plus-infant-flight").disabled = false;
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
            $("#show_infant_flight").text(quantity - 1);
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

    $("#airline_departure").on("change", function() {
        if ($('#directionflight').prop('checked')){
           var test3 = $("#airline_departure").datepicker('getDate', '+1d');
           var test4 = $("#airline_departure").datepicker('getDate');
           test3.setDate(test3.getDate()+1);
           $("#airline_return").datepicker('option', 'minDate', test4);

           if ($("#airline_departure").datepicker('getDate') >= $("#airline_return").datepicker('getDate'))
           {
               var test2 = $("#airline_departure").datepicker('getDate', '+1d');
               test2.setDate(test2.getDate()+1);
               $( ".airline_return" ).datepicker('setDate', test2);
           }
       }
    });

    var quantity_room_hotel = parseInt($('#hotel_room').val());
    var quantity_adult_hotel = parseInt($('#hotel_adult').val());
    var quantity_child_hotel = parseInt($('#hotel_child').val());
    $("#show_room_hotel").text(quantity_room_hotel);
    $("#show_adult_hotel").text(quantity_adult_hotel);
    $("#show_child_hotel").text(quantity_child_hotel);
    $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");

    $('.right-plus-room-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_room').val());

        if(quantity < 9){
            $('#hotel_room').val(quantity + 1);
            $("#show_room_hotel").text(quantity + 1);
            quantity_room_hotel = quantity + 1;

            if(quantity_room_hotel > quantity_adult_hotel){
                $('#hotel_adult').val(quantity + 1);
                $("#show_adult_hotel").text(quantity + 1);
                quantity_adult_hotel = quantity + 1;
            }

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
            $("#show_room_hotel").text(quantity - 1);
            quantity_room_hotel = quantity - 1;

            if(quantity_room_hotel < quantity_child_hotel){
               quantity_child_hotel = quantity_room_hotel;
               $('#hotel_child').val(quantity - 1);
               $("#show_child_hotel").text(quantity_child_hotel);
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
            $("#show_adult_hotel").text(quantity + 1);
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
            $("#show_adult_hotel").text(quantity - 1);
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
        if (quantity < quantity_room_hotel){
            $('#hotel_child').val(quantity + 1);
            $("#show_child_hotel").text(quantity + 1);
            quantity_child_hotel = quantity + 1;

            $('#show_total_pax_hotel').text(quantity_room_hotel + " Room, " + quantity_adult_hotel + " Adult, " +quantity_child_hotel + " Child");
            guest_child_age();
        }

        if(quantity_child_hotel == quantity_room_hotel){
            document.getElementById("right-plus-child-hotel").disabled = true;
            document.getElementById("left-minus-child-hotel").disabled = false;
        }

        if(quantity_child_hotel < quantity_room_hotel){
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
            $("#show_child_hotel").text(quantity - 1);
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

});


function showReturnDateAirline() {
    var test = $("#airline_departure").datepicker('getDate', '+1d');
    if ($('#directionflight').prop('checked')){
      $('#airline_return').prop('disabled', false);
      $('#is_combo_price').prop('readonly', false);
      var test2 = $("#airline_departure").datepicker('getDate');
      test.setDate(test.getDate()+1);
      $( ".airline_return" ).datepicker('setDate', test);
      $(".airline_return").datepicker('option', 'minDate', test2);
    } else {
      $('#airline_return').prop('disabled', true);
      $('#is_combo_price').prop('readonly', true);
      $( ".airline_return" ).datepicker('setDate','');
    }
}

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


function show_loading(){
    $('.next-search-train').addClass("running");
}


function show_paxs(pax_type, key){
    var paxs = document.getElementById(pax_type+'_paxs'+key);
    var paxs_down = document.getElementById(pax_type+'_down_paxs'+key);
    var paxs_up = document.getElementById(pax_type+'_up_paxs'+key);
    for (var i=1; i <= parseInt(adult); i++){
        paxs = document.getElementById('adult_paxs'+i);
        paxs_up = document.getElementById('adult_up_paxs'+i);
        paxs_down = document.getElementById('adult_down_paxs'+i);

        paxs.style.display = "none";
        paxs_down.style.display = "none";
        paxs_up.style.display = "block";
    }

    for (var i=1; i <= parseInt(infant); i++){
        paxs = document.getElementById('infant_paxs'+i);
        paxs_up = document.getElementById('infant_up_paxs'+i);
        paxs_down = document.getElementById('infant_down_paxs'+i);

        paxs.style.display = "none";
        paxs_down.style.display = "none";
        paxs_up.style.display = "block";
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


function show_paxs_airline(pax_type, key){
    var paxs = document.getElementById(pax_type+'_paxs'+key);
    var paxs_down = document.getElementById(pax_type+'_down_paxs'+key);
    var paxs_up = document.getElementById(pax_type+'_up_paxs'+key);

    for (var i=1; i <= parseInt(adult); i++){
        paxs = document.getElementById('adult_paxs'+i);
        paxs_up = document.getElementById('adult_up_paxs'+i);
        paxs_down = document.getElementById('adult_down_paxs'+i);

        paxs.style.display = "none";
        paxs_down.style.display = "none";
        paxs_up.style.display = "block";
    }

    for (var i=1; i <= parseInt(child); i++){
        paxs = document.getElementById('child_paxs'+i);
        paxs_up = document.getElementById('child_up_paxs'+i);
        paxs_down = document.getElementById('child_down_paxs'+i);

        paxs.style.display = "none";
        paxs_down.style.display = "none";
        paxs_up.style.display = "block";
    }

    for (var i=1; i <= parseInt(infant); i++){
        paxs = document.getElementById('infant_paxs'+i);
        paxs_up = document.getElementById('infant_up_paxs'+i);
        paxs_down = document.getElementById('infant_down_paxs'+i);

        paxs.style.display = "none";
        paxs_down.style.display = "none";
        paxs_up.style.display = "block";
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

function show_flight_details(key){
    var journey = document.getElementById('journey'+key);
    var flight = document.getElementById('detail_departjourney'+key);
    var flight_down = document.getElementById('flight_details_down'+key);
    var flight_up = document.getElementById('flight_details_up'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight.style.display = "block";
        journey.style.marginBottom = "0px";
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight.style.display = "none";
        journey.style.marginBottom = "15px";
    }
}

function show_flight_details2(key){
    var journey = document.getElementById('journey2'+key);
    var flight = document.getElementById('detail_departjourney2'+key);
    var flight_down = document.getElementById('flight_details_down2'+key);
    var flight_up = document.getElementById('flight_details_up2'+key);

    if (flight.style.display === "none") {
        flight_up.style.display = "block";
        flight_down.style.display = "none";
        flight.style.display = "block";
        journey.style.marginBottom = "0px";
    }
    else {
        flight_up.style.display = "none";
        flight_down.style.display = "block";
        flight.style.display = "none";
        journey.style.marginBottom = "15px";
    }
}
