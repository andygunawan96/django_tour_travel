
$(document).ready(function(){

    var sort_price=0;
    var sort_duration=0;
    var sort_departure=0;
    var sort_arrival=0;

    $("#myModalPopUp").modal('show');
//    $(window).load(function() {
//    });

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
    $('.button-search').click(function() {      // When arrow is clicked
        $('.button-search').addClass("running");
    });

    $('#return-to-top').click(function() {      // When arrow is clicked
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 500);
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

    $('.right-plus-room-hotel').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        var quantity = parseInt($('#hotel_room').val());

        if(quantity < 9){
            $('#hotel_room').val(quantity + 1);
            quantity_room_hotel = quantity + 1;

            if(quantity_room_hotel > quantity_adult_hotel){
                $('#hotel_adult').val(quantity + 1);
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

    $('#information-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-information-hotel").offset().top - 155
        }, 500)
    });

    $('#facility-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-facility-hotel").offset().top - 140
        }, 500)
    });

    $('#select-room-hotel').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-select-room-hotel").offset().top - 140
        }, 500)
    });

    $('#about-partnership').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-about-partnership").offset().top - 100
        }, 500)
    });

    $('#register-partnership').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-register-partnership").offset().top - 100
        }, 500)
    });

    $('#register-partnership-citra').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-register-partnership").offset().top - 100
        }, 500)
    });
    $('#register-partnership-japro').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-register-partnership").offset().top - 100
        }, 500)
    });

    $('#register-partnership-fipro').click(function(e){
        $('html, body').animate({
            scrollTop: $("div.div-register-partnership").offset().top - 100
        }, 500)
    });


    $('#radio_airline_search').change(function(){
        selected_value = $("input[name='radio_airline_type']:checked").val();
        if (selected_value == "oneway"){
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");
            text+=`
            <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
            </div>
            <input type="hidden" class="form-control date-picker airline_return" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("airline_date_search").appendChild(node);
            node = document.createElement("div");
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
        }
        else if(selected_value == "roundtrip"){
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");
            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('checkbox_combo_price').style.display = "block";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('mc_airline_default').innerHTML = "";
            airline_counter_config = 0;
            counter_airline_search = 0;
            text+=`
            <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly>
            </div>

            <input type="hidden" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
            <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

            node.innerHTML = text;
            document.getElementById("airline_date_search").appendChild(node);
            node = document.createElement("div");

            $("#airline_departure").val(moment().format('DD MMM YYYY'));
            $("#airline_return").val(moment().subtract(-1, 'days').format('DD MMM YYYY'));

            $('input[name="airline_departure_return"]').daterangepicker({
              singleDatePicker: false,
              autoUpdateInput: true,
              opens: 'center',
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
            });
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
//
//                    <div class="banner-right">
//                        <div class="tab-content" id="mc_airline_add" style="padding-top:15px; background:none !important;">
//                        </div>
//                    </div>
//                </div>
//            </div>`;

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

            document.getElementById('mc_airline_default').innerHTML = text_mc;
            document.getElementById('ori_airline').style.display = "none";
            document.getElementById('is_combo_price').disabled = false;
//            document.getElementById('is_combo_price').checked = false;
            document.getElementById('checkbox_combo_price').style.display = "block";

            add_multi_city('home');
            add_multi_city('home');
            $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
        }
    });

    $('#radio_airline_change_search').change(function(){
        selected_value = $("input[name='radio_airline_type']:checked").val();
        if (selected_value == "oneway"){
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");
            text+=`
            <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="airline_departure" id="airline_departure" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
            </div>
            <input type="hidden" class="form-control" name="airline_return" id="airline_return" placeholder="Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Return Date '" autocomplete="off">`;

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
        }
        else if(selected_value == "roundtrip"){
            document.getElementById("airline_date_search").innerHTML = '';
            text='';
            var node = document.createElement("div");

            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('checkbox_combo_price').style.display = "block";
            document.getElementById('ori_airline').style.display = "block";
            document.getElementById('mc_airline_default').innerHTML = "";

            airline_counter_config = 0;
            counter_airline_search = 0;

            text+=`
            <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure - Return</span>
            <div class="input-container-search-ticket">
                <input type="text" class="form-control" name="airline_departure_return" id="airline_departure_return" value="{{airline_request.departure}} - {{airline_request.return}}" placeholder="Departure Date - Return Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date - Return Date '" autocomplete="off" readonly>
            </div>
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

                $('input[name="airline_departure_return"]').daterangepicker({
                  singleDatePicker: false,
                  autoUpdateInput: true,
                  opens: 'center',
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

            document.getElementById('mc_airline_default').innerHTML = text_mc;
            document.getElementById('ori_airline').style.display = "none";
            document.getElementById('is_combo_price').disabled = true;
            document.getElementById('is_combo_price').disabled = false;
            document.getElementById('checkbox_combo_price').style.display = "block";
            airline_request_counter = airline_request.counter;
            if(airline_request_counter == 0)
                airline_request_counter = 2
            for(var airline_counter=0;airline_counter<parseInt(airline_request_counter);airline_counter++){
                add_multi_city('search');
            }
            $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");

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

function show_hide_change_search(){
    var change_search_box = document.getElementById("change_search_box");

    if (change_search_box.style.display === "none") {
        change_search_box.style.display = "block";
    }
    else {
        change_search_box.style.display = "none";
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