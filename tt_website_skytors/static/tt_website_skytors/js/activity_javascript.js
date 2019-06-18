jQuery(document).ready(function ($) {
	var slideCount = $('#slider ul li').length;
	var slideWidth = $('.themespark-detail-images').width();
	var slideHeight = $('.themespark-detail-images').height();
	var sliderUlWidth = slideCount * slideWidth;

    if (slideCount > 2){
        setInterval(function () {
            moveRight();
        }, 4000);
        $('#slider ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
    }

	$('#slider').css({ width: slideWidth, height: slideHeight });
    $('#slider ul li').css({ width: slideWidth, height: slideHeight });
    $('#slider ul li img').css({ width: slideWidth, height: slideHeight });
    $('#slider ul li:last-child').prependTo('#slider ul');

    function moveRight() {
        $('#slider ul').animate({
            left: - slideWidth
        }, 800, function () {
            $('#slider ul li:first-child').appendTo('#slider ul');
            $('#slider ul').css('left', '');
        });
    };
});


function set_sub_category(){
    var text = `<option value="0" selected="">Sub Categories</option>`;
    var sub_category_list = sub_category[document.getElementById('themespark_category').value.split(' - ')[1]];
    for(i in sub_category_list){
        text +=`<option value="`+sub_category_list[i].id+`">`+sub_category_list[i].name+`</option>`
    }
    document.getElementById('themespark_sub_category').innerHTML = text;
//    themespark_sub_category
}

function set_city(){
    var text = `<option value="" selected="">Cities</option>`;
    var country = {};
    for(i in activity_country){
       if(activity_country[i].id == parseInt(document.getElementById('themespark_countries').value)){
           country = activity_country[i];
           break;
       }
    }
    for(i in country.city){
        console.log(country.city);
        text +=`<option value="`+country.city[i].id+`">`+country.city[i].name+`</option>`
    }
    document.getElementById('themespark_cities').innerHTML = text;
    $('#themespark_cities').niceSelect('update');
}

function triggered(){
    try{
        if($state == 0){
            document.getElementById('search').hidden = true;
            $state = 1;
        }else{
            document.getElementById('search').hidden = false;
            $state = 0;
        }
    }catch(err){
        document.getElementById('search').hidden = false;
        $state = 0;
    }
}

function getrupiah(price){
    var pj = price.toString().length;
    var temp = price.toString();
    var priceshow="";
    for(x=0;x<pj;x++){
        if((pj-x)%3==0 && x!=0){
        priceshow+=",";
        }
        priceshow+=temp.charAt(x);
    }
    return priceshow;

}

function pick_activity(val){
    console.log(val);
}

function update_pax(){
    activity_table_detail();
}

function activity_table_detail(){
   var grand_total = 0;
   var grand_commission = 0;
   text = '';
   name = response.name.replace(/&#39;/g,"'");
   name = name.replace(/&amp;/g, '&');
   console.log(name);
   $test = response.name+'\n'+document.getElementById('product_type').innerHTML+
           '\nVisit Date : '+document.getElementById('activity_date').value+
           '\n\n';

   try{
       if(document.getElementById('adult_passenger').value != 0){
           text+= `<div class="row">
                        <div class="col-xs-3">Adult</div>
                        <div class="col-xs-1">X</div>
                        <div class="col-xs-1">`+document.getElementById('adult_passenger').value+`</div>
                        <div class="col-xs-3"></div>
                        <div class="col-xs-3" style="padding-right: 0; text-align: right;">`;

           text+= getrupiah(activity_date[event_pick][activity_date_pick].prices.adults[document.getElementById('adult_passenger').value].sale_price) +`</div>
               </div>`;

       $test += document.getElementById('adult_passenger').value + ' Adult Price IDR ' + getrupiah(activity_date[event_pick][activity_date_pick].prices.adults[document.getElementById('adult_passenger').value].sale_price)+'\n';
       grand_total += parseInt(document.getElementById('adult_passenger').value) * activity_date[event_pick][activity_date_pick].prices.adults[document.getElementById('adult_passenger').value].sale_price;
       grand_commission += parseInt(document.getElementById('adult_passenger').value) * activity_date[event_pick][activity_date_pick].prices.adults[document.getElementById('adult_passenger').value].commission_price;
       }
   }catch(err){

   }
   try{
       if(document.getElementById('senior_passenger').value != 0){
           text+= `<div class="row">
                        <div class="col-xs-3">Senior</div>
                        <div class="col-xs-1">X</div>
                        <div class="col-xs-1">`+document.getElementById('senior_passenger').value+`</div>
                        <div class="col-xs-3"></div>
                        <div class="col-xs-3" style="padding-right: 0; text-align: right;">`;
           text+= getrupiah(activity_date[event_pick][activity_date_pick].prices.seniors[document.getElementById('senior_passenger').value].sale_price) +`</div>
               </div>`;
       $test += document.getElementById('senior_passenger').value+' Senior Price IDR '+getrupiah(activity_date[event_pick][activity_date_pick].prices.seniors[document.getElementById('senior_passenger').value].sale_price)+'\n';
       grand_total+= parseInt(document.getElementById('senior_passenger').value) * activity_date[event_pick][activity_date_pick].prices.seniors[document.getElementById('senior_passenger').value].sale_price;
       grand_commission += parseInt(document.getElementById('senior_passenger').value) * activity_date[event_pick][activity_date_pick].prices.seniors[document.getElementById('senior_passenger').value].commission_price;
       }
   }catch(err){

   }
   try{
       if(document.getElementById('children_passenger').value != 0){
           text+= `<div class="row">
                        <div class="col-xs-3">Child</div>
                        <div class="col-xs-1">X</div>
                        <div class="col-xs-1">`+document.getElementById('children_passenger').value+`</div>
                        <div class="col-xs-3"></div>
                        <div class="col-xs-3" style="padding-right: 0; text-align: right;">`;
           text+= getrupiah(activity_date[event_pick][activity_date_pick].prices.children[document.getElementById('children_passenger').value].sale_price) +`</div>
               </div>`;
       $test += document.getElementById('children_passenger').value+' Child Price IDR '+getrupiah(activity_date[event_pick][activity_date_pick].prices.children[document.getElementById('children_passenger').value].sale_price)+'\n';
       grand_total += parseInt(document.getElementById('children_passenger').value) * activity_date[event_pick][activity_date_pick].prices.children[document.getElementById('children_passenger').value].sale_price;
       grand_commission += parseInt(document.getElementById('children_passenger').value) * activity_date[event_pick][activity_date_pick].prices.children[document.getElementById('children_passenger').value].commission_price;
       }
   }catch(err){

   }
   try{
       if(document.getElementById('infant_passenger').value != 0){
           text+= `<div class="row">
                        <div class="col-xs-3">Infant</div>
                        <div class="col-xs-1">X</div>
                        <div class="col-xs-1">`+document.getElementById('infant_passenger').value+`</div>
                        <div class="col-xs-3"></div>
                        <div class="col-xs-3" style="padding-right: 0; text-align: right;">0</div>
                   </div>`;
       $test += document.getElementById('infant_passenger').value+' Infant Price IDR '+getrupiah(0)+'\n';
       }
   }catch(err){

   }

   if(additional_price != 0)
       $test += 'Additional price IDR '+getrupiah(additional_price)+'\n';


   $test+= '\nGrand Total : IDR '+ getrupiah(grand_total)+
           '\nPrices and availability may change at any time';
   console.log(grand_total);
   text+= `<div class="row">
                <div class="col-xs-8">Additional Charge</div>
                <div class="col-xs-3" style="padding-right: 0; text-align: right;" id='additional_price'>`+additional_price+`</div>
           </div>`;
   text+= `<hr style="padding:0px;">
           <div class="row">
                <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                <div class="col-xs-3" style="padding-right: 0; text-align: right;">`+getrupiah(grand_total)+`</div>
           </div>

           <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px;">Your Commission: IDR `+getrupiah(grand_commission)+`</span><br>
                    </div>
                </div>
           </div>

           <div class="row" style="margin:20px 0px 0px 0px; text-align:center;">
               <div class="col-xs-12">
                   <input type="button" class="primary-btn-ticket" data-toggle="modal" data-target="#copiedModal" onclick="copy_data();" value="Copy" style="width:100%;"/>
               </div>
           </div>
           <div class="row" style="margin:10px 0px 10px 0px; text-align:center;">
               <div class="col-xs-12">
                    <input type="button" id="show_commission_button" class="primary-btn-ticket" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
               </div>

                <div id="copiedModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4>Copy</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <span style="font-weight:bold">Copied!</span>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
           `;
   document.getElementById('activity_detail_table').innerHTML = text;
   text_btn = `
       <center>
       <button type="button" class="primary-btn-ticket" value="Next" onclick='check_detail();' style="width:90%;">
            Next
            <i class="fas fa-angle-right"></i>
       </button><br/>
       </center>
   `;
   document.getElementById('activity_detail_next_btn').innerHTML = text_btn;
}


function activity_table_detail2(adult, senior, child, infant, pagetype){
   var grand_total = 0;
   var grand_commission = 0;
   text = '';
   name = response.name.replace(/&#39;/g,"'");
   name = name.replace(/&amp;/g, '&');
   $test = response.name+'\n'+document.getElementById('product_type_title').innerHTML+
           '\nVisit Date : '+price.date.split('-')[2]+' '+month[price.date.split('-')[1]]+' '+price.date.split('-')[0]+
           '\n\n';


   try{
       if(passenger.adult != 0){
           text+= `<div class="row">
                        <div class="col-xs-3">Adult</div>
                        <div class="col-xs-1">X</div>
                        <div class="col-xs-1">`+passenger.adult+`</div>
                        <div class="col-xs-6" style="padding-right: 5; text-align: right;">`;
           text+= getrupiah(price.prices.adults[passenger.adult].sale_price) +`</div>
               </div>`;

           $test += passenger.adult+' Adult Price IDR '+getrupiah(price.prices.adults[passenger.adult].sale_price)+'\n';
           grand_total += parseInt(adult) * price.prices.adults[passenger.adult].sale_price;
           grand_commission += parseInt(adult) * price.prices.adults[passenger.adult].commission_price;
       }
   }catch(err){

   }
   try{
       if(passenger.senior != 0){
           text+= `<div class="row">
                        <div class="col-xs-3">Senior</div>
                        <div class="col-xs-1">X</div>
                        <div class="col-xs-1">`+passenger.senior+`</div>
                        <div class="col-xs-6" style="padding-right: 5; text-align: right;">`;
           text+= getrupiah(price.prices.seniors[passenger.senior].sale_price) +`</div>
               </div>`;
       $test += passenger.senior+' Senior Price IDR '+getrupiah(price.prices.seniors[passenger.senior].sale_price)+'\n';
       grand_total+= parseInt(senior) * price.prices.seniors[passenger.senior].sale_price;
       grand_commission += parseInt(senior) * price.prices.seniors[passenger.senior].commission_price;
       }
   }catch(err){

   }
   try{
       if(passenger.child != 0){
           text+= `<div class="row">
                        <div class="col-xs-3">Child</div>
                        <div class="col-xs-1">X</div>
                        <div class="col-xs-1">`+passenger.child+`</div>
                        <div class="col-xs-6" style="padding-right: 5; text-align: right;">`;
           text+= getrupiah(price.prices.children[passenger.child].sale_price) +`</div>
               </div>`;
       $test += passenger.child+' Child Price IDR '+getrupiah(price.prices.children[passenger.child].sale_price)+'\n';
       grand_total += parseInt(child) * price.prices.children[passenger.child].sale_price;
       grand_commission += parseInt(child) * price.prices.children[passenger.child].commission_price;
       }
   }catch(err){

   }
   try{
       if(passenger.infant != 0){
           text+= `<div class="row">
                        <div class="col-xs-3">Infant</div>
                        <div class="col-xs-1">X</div>
                        <div class="col-xs-1">`+passenger.infant+`</div>
                        <div class="col-xs-6" style="padding-right: 5; text-align: right;">0</div>
                   </div>`;
       $test += passenger.infant+' Infant Price IDR '+getrupiah(0)+'\n';
       }
   }catch(err){

   }

   if(additional_price != 0)
       $test += 'Additional price IDR '+getrupiah(additional_price)+'\n';


   $test+= '\nGrand Total : IDR '+ getrupiah(grand_total)+
           '\nPrices and availability may change at any time';
   console.log(grand_total);
   text+= `<div class="row">
                <div class="col-xs-8">Additional Charge</div>
                <div class="col-xs-3" style="padding-right: 0; text-align: right;" id='additional_price'>`+additional_price+`</div>
           </div>`;
   text+= `<hr style="padding:0px;">
           <div class="row">
                <div class="col-xs-8"><span style="font-weight:bold">Grand Total</span></div>
                <div class="col-xs-3" style="padding-right: 0; text-align: right;">`+getrupiah(grand_total)+`</div>
           </div>

           <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px;">Your Commission: IDR `+getrupiah(grand_commission)+`</span><br>
                    </div>
                </div>
           </div>

           <div class="row" style="margin:20px 0px 0px 0px; text-align:center;">
               <div class="col-xs-12">`;
   text += `<div class="row">
                       <div class="col-xs-12">
                           <input type="button" class="primary-btn-ticket" data-toggle="modal" data-target="#copiedModal" onclick="copy_data();" value="Copy" style="width:100%;"/>
                       </div>
                 </div>`;

   text+= `</div>
           </div>
           <div class="row" style="margin:10px 0px 10px 0px; text-align:center;">
               <div class="col-xs-12">
                    <input type="button" id="show_commission_button" class="primary-btn-ticket" value="Show Commission" style="width:100%;" onclick="show_commission();"/>
               </div>
           </div>
           <div style="text-align:center;">
                <div id="copiedModal" class="modal fade" role="dialog">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4>Copy</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <span style="font-weight:bold">Copied!</span>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           `;
   document.getElementById('activity_detail_table').innerHTML = text;
   if (pagetype == 'passenger')
   {
        text_btn = `
            <center>
            <button type="button" class="primary-btn-ticket" value="Next" onclick='check_passenger();' style="width:90%;">
                Next
                <i class="fas fa-angle-right"></i>
            </button>
            <br/>
            </center>
       `;
       document.getElementById('activity_detail_next_btn').innerHTML = text_btn;
   }
}

function copy_data(){
    const el = document.createElement('textarea');
    el.value = $test;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function show_commission(){
    var sc = document.getElementById("show_commission");
    var scs = document.getElementById("show_commission_button");
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}

function check_flight(value){
    var checkword = "^[A-Z0-9][A-Z0-9][0-9]{0,4}$";
    if(value.match(checkword)!=null){
        return true;
    }else{

        return false;
    }
}

//check detail
function check_detail(){
    text = '' ;
    check = 0;
    pax = 0;
    console.log(activity_date_pick);
    console.log(activity_date[event_pick][parseInt(activity_date_pick)].date);
    console.log(activity_date[event_pick][parseInt(activity_date_pick)].available);

    date = document.getElementById('activity_date').value.split(' ')[2]+'-'+month[document.getElementById('activity_date').value.split(' ')[1]]+'-'+document.getElementById('activity_date').value.split(' ')[0]
    console.log(date);
    //check tiket
    if(activity_date[event_pick][parseInt(activity_date_pick)].date == date && activity_date[event_pick][parseInt(activity_date_pick)].available == false)
        text+='Visit date not available please pick other date!\n';

    //check pax
    if(activity_type[activity_type_pick].allowChildren!=0)
        if(activity_type[activity_type_pick].minChildren <= document.getElementById('children_passenger').value)
            pax += parseInt(document.getElementById('children_passenger').value);
        else
            text+='Child passenger minimum'+ activity_type[activity_type_pick].minChildren +'!\n';
    if(activity_type[activity_type_pick].allowInfant!=0)
        if(activity_type[activity_type_pick].minInfant <= document.getElementById('infant_passenger').value)
            pax += parseInt(document.getElementById('infant_passenger').value);
        else
            text+='Infant passenger minimum'+ activity_type[activity_type_pick].minInfant +'!\n';
    if(activity_type[activity_type_pick].maxPax!=0)
        if(activity_type[activity_type_pick].minPax <= document.getElementById('adult_passenger').value)
            pax += parseInt(document.getElementById('adult_passenger').value);
        else
            text+='Adult passenger minimum'+ activity_type[activity_type_pick].minPax +'!\n';
    if(activity_type[activity_type_pick].allowSeniors!=0)
        if(activity_type[activity_type_pick].minSenior <= document.getElementById('senior_passenger').value)
            pax += parseInt(document.getElementById('senior_passenger').value);
        else
            text+='Senior passenger minimum'+ activity_type[activity_type_pick].minSenior +'!\n';
    console.log(pax);
    console.log(activity_type[activity_type_pick].maxGroup);
    if(pax > activity_type[activity_type_pick].maxGroup)
        text+= 'Total Passenger must below than '+activity_type[activity_type_pick].maxGroup;
    //check perbooking
    for(i in activity_type[activity_type_pick].options.perBooking){
        if(activity_type[activity_type_pick].options.perBooking[i].name != 'Guest age' &&
           activity_type[activity_type_pick].options.perBooking[i].name != 'Full name' &&
           activity_type[activity_type_pick].options.perBooking[i].name != 'Gender' &&
           activity_type[activity_type_pick].options.perBooking[i].name != 'Nationality' &&
           activity_type[activity_type_pick].options.perBooking[i].name != 'Date of birth'){
            if(activity_type[activity_type_pick].options.perBooking[i].required == true){
                //use regex bemyguest
                if(activity_type[activity_type_pick].options.perBooking[i].formatRegex != false){
                    if(check_regex(document.getElementById('perbooking'+i).value, activity_type[activity_type_pick].options.perBooking[i].formatRegex)==false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';
                }
                //no regex
                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 1){
                    if(document.getElementById('perbooking'+i).value== '')
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 2){
                    for(j in activity_type[activity_type_pick].options.perBooking[i].items){
                        console.log(document.getElementById('perbooking'+i+j).checked);
                        if(document.getElementById('perbooking'+i+j).checked==true)
                            check=1;
                    }
                    console.log(check);
                    if(check==0)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';
                    check=0;
                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 3)
                    if(check_number(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';

                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 4)
                    if(check_word(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';

                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 6)
                    if(check_date(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';

                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 7){
                    console.log(document.getElementById('perbooking'+i));

                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 8){
                    console.log(document.getElementById('perbooking'+i));

                }else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 10)
                    if(check_time(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';

                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 11)
                    if(check_date_time(document.getElementById('perbooking'+i+'0').value+' '+document.getElementById('perbooking'+i+'1').value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';
                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 12)
                    if(check_word(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';
                else if(activity_type[activity_type_pick].options.perBooking[i].inputType == 14)
                    if(check_flight(document.getElementById('perbooking'+i).value) == false)
                        text+= 'Please check your '+activity_type[activity_type_pick].options.perBooking[i].name+'\n';
            }
        }
    }

    //check timeslot bemyguest
    if(response.provider == 'bemyguest'){
        if(activity_type[activity_type_pick].timeslots.length > 0){

            var sel = document.getElementById('timeslot');
            if (sel.value != '') {
                check=1;
            }
            if(check==0){
                text+= 'Please pick timeslot\n';
            }
        }
    }

    if(text==''){
        //gotopax
        detail_to_passenger_page();
    }else{
        alert(text);
    }
}

function check_passenger(){
    //booker
    error_log = '';
    if(document.getElementById('booker_title').value!= '' &&
       document.getElementById('booker_first_name').value!= '' &&
       document.getElementById('booker_last_name').value!='' &&
       document.getElementById('booker_nationality').value!='' &&
       document.getElementById('booker_email').value!='' &&
       document.getElementById('booker_phone_code').value!='' &&
       document.getElementById('booker_phone').value!= ''){

        if(check_name(document.getElementById('booker_title').value,
                        document.getElementById('booker_first_name').value,
                        document.getElementById('booker_last_name').value,
                        25) == false)
            error_log+= 'Total of Booker name maximum 25 characters!\n';
        if(check_phone_number(document.getElementById('booker_phone').value)==false)
            error_log+= 'Phone number Booker only contain number 8 - 12 digits!\n';
        if(check_email(document.getElementById('booker_email').value)==false)
            error_log+= 'Invalid Booker email!\n';
       //adult
       for(i=1;i<=passenger.adult;i++){
           if(document.getElementById('adult_title'+i).value != '' &&
           document.getElementById('adult_first_name'+i).value != '' &&
           document.getElementById('adult_last_name'+i).value != '' &&
           document.getElementById('adult_nationality'+i).value != '' &&
           document.getElementById('adult_phone_code'+i).value != '' &&
           document.getElementById('adult_phone'+i).value != ''){
               if(check_name(document.getElementById('adult_title'+i).value,
               document.getElementById('adult_first_name'+i).value,
               document.getElementById('adult_last_name'+i).value,
               25) == false)
                   error_log+= 'Total of adult '+i+' name maximum 25 characters!\n';
               if(check_date(document.getElementById('adult_birth_date'+i).value)==false)
                   error_log+= 'Birth date wrong for passenger adult '+i+'!\n';
               for(j in detail.perPax){
                   console.log('detail perpax');
                   console.log(detail);
                   console.log(detail.perPax[j]);
                   if(detail.perPax[j].name != 'Gender' && detail.perPax[j].name !=  'Full name' && detail.perPax[j].name !=  'Guest age' && detail.perPax[j].name !=  'Nationality' && detail.perPax[j].name !=  'Date of birth'){
                        if(detail.perPax[j].required == true){
                            //use regex bemyguest
                            if(detail.perPax[j].formatRegex != false){
                                if(check_regex(document.getElementById('adult_perpax'+i+'_'+j).value, detail.perPax[j].formatRegex)==false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                            }
                            //no regex
                            else if(detail.perPax[j].inputType == 1){
                                if(document.getElementById('adult_perpax'+i+'_'+j).value=='')
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                            }else if(detail.perPax[j].inputType == 2){
                                for(k in detail.perPax[j].items){
                                    if(document.getElementById('adult_perpax'+i+'_'+j+'_'+k).checked==true)
                                        check=1;
                                }
                                if(check==0)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                                check=0;
                            }else if(detail.perPax[j].inputType == 3)
                                if(check_number(document.getElementById('adult_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 4)
                                if(check_word(document.getElementById('adult_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 6)
                                if(check_date(document.getElementById('adult_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 7){
                                console.log(document.getElementById('adult_perpax'+i+'_'+j));

                            }else if(detail.perPax[j].inputType == 8){
                                console.log('here');
                                console.log(document.getElementById('adult_perpax'+i+'_'+j));

                            }else if(detail.perPax[j].inputType == 10)
                                if(check_time(document.getElementById('adult_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 11)
                                if(check_date_time(document.getElementById('adult_perpax'+i+'_'+j+'0').value+' '+document.getElementById('perpax'+i+'_'+j+'1').value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 12)
                                if(check_word(document.getElementById('adult_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 14)
                                if(check_flight(document.getElementById('adult_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                        }
                   }
               }

           }else{
               error_log+= 'Please fill all the blank for Adult passenger '+i+'!\n';
           }
       }

       //senior
       for(i=1;i<=passenger.senior;i++){
           if(document.getElementById('senior_title'+i).value != '' &&
           document.getElementById('senior_first_name'+i).value != '' &&
           document.getElementById('senior_last_name'+i).value != '' &&
           document.getElementById('senior_nationality'+i).value != '' &&
           document.getElementById('senior_phone_code'+i).value != '' &&
           document.getElementById('senior_phone'+i).value != ''){
               if(check_name(document.getElementById('senior_title'+i).value,
               document.getElementById('senior_first_name'+i).value,
               document.getElementById('senior_last_name'+i).value, 25) == false)
                   error_log+= 'Total of senior '+i+' name maximum 25 characters!\n';
               if(check_date(document.getElementById('child_birth_date'+i).value)==false)
                   error_log+= 'Birth date wrong for passenger senior '+i+'!\n';

               for(j in detail.perPax){
                   if(detail.perPax[j].name != 'Gender' && detail.perPax[j].name !=  'Full name' && detail.perPax[j].name !=  'Guest age' && detail.perPax[j].name !=  'Nationality' && detail.perPax[j].name !=  'Date of birth'){
                        if(detail.perPax[j].required == true){
                            //use regex bemyguest
                            if(detail.perPax[j].formatRegex != false){
                                if(check_regex(document.getElementById('senior_perpax'+i+'_'+j).value, detail.perPax[j].formatRegex)==false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                            }
                            //no regex
                            else if(detail.perPax[j].inputType == 1){
                                if(document.getElementById('senior_perpax'+i+'_'+j).value=='')
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                            }else if(detail.perPax[j].inputType == 2){
                                for(k in detail.perPax[j].items){
                                    if(document.getElementById('senior_perpax'+i+'_'+j+'_'+k).checked==true)
                                        check=1;
                                }
                                if(check==0)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                                check=0;
                            }else if(detail.perPax[j].inputType == 3)
                                if(check_number(document.getElementById('senior_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 4)
                                if(check_word(document.getElementById('senior_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 6)
                                if(check_date(document.getElementById('senior_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 7){


                            }else if(detail.perPax[j].inputType == 8){


                            }else if(detail.perPax[j].inputType == 10)
                                if(check_time(document.getElementById('senior_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 11)
                                if(check_date_time(document.getElementById('senior_perpax'+i+'_'+j+'0').value+' '+document.getElementById('perpax'+i+'_'+j+'1').value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 12)
                                if(check_word(document.getElementById('senior_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 14)
                                if(check_flight(document.getElementById('senior_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                        }
                   }
               }

           }else{
                error_log+= 'Please fill all the blank for Senior passenger '+i+'!\n';
           }
       }

       //child
       for(i=1;i<=passenger.child;i++){
           document.getElementById('child_phone_code'+i).value = document.getElementById('booker_phone_code').value;
           document.getElementById('child_phone'+i).value = document.getElementById('booker_phone').value;
           document.getElementById('child_email'+i).value = document.getElementById('booker_email').value;
           if(document.getElementById('child_title'+i).value != '' &&
           document.getElementById('child_first_name'+i).value != '' &&
           document.getElementById('child_last_name'+i).value != '' &&
           document.getElementById('child_nationality'+i).value != '' &&
           document.getElementById('child_phone_code'+i).value != '' &&
           document.getElementById('child_phone'+i).value != ''){
               if(check_name(document.getElementById('child_title'+i).value,
               document.getElementById('child_first_name'+i).value,
               document.getElementById('child_last_name'+i).value, 25) == false)
                   error_log+= 'Total of child '+i+' name maximum 25 characters!\n';
               if(check_date(document.getElementById('child_birth_date'+i).value)==false)
                   error_log+= 'Birth date wrong for passenger child '+i+'!\n';

               for(j in detail.perPax){
                   if(detail.perPax[j].name != 'Gender' && detail.perPax[j].name !=  'Full name' && detail.perPax[j].name !=  'Guest age' && detail.perPax[j].name !=  'Nationality' && detail.perPax[j].name !=  'Date of birth'){
                        if(detail.perPax[j].required == true){
                            //use regex bemyguest
                            if(detail.perPax[j].formatRegex != false){
                                if(check_regex(document.getElementById('child_perpax'+i+'_'+j).value, detail.perPax[j].formatRegex)==false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                            }
                            //no regex
                            else if(detail.perPax[j].inputType == 1){
                                if(document.getElementById('adult_perpax'+i+'_'+j).value=='')
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                            }else if(detail.perPax[j].inputType == 2){
                                for(k in detail.perPax[j].items){
                                    if(document.getElementById('child_perpax'+i+'_'+j+'_'+k).checked==true)
                                        check=1;
                                }
                                if(check==0)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                                check=0;
                            }else if(detail.perPax[j].inputType == 3)
                                if(check_number(document.getElementById('child_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 4)
                                if(check_word(document.getElementById('child_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 6)
                                if(check_date(document.getElementById('child_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 7){


                            }else if(detail.perPax[j].inputType == 8){


                            }else if(detail.perPax[j].inputType == 10)
                                if(check_time(document.getElementById('child_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 11)
                                if(check_date_time(document.getElementById('child_perpax'+i+'_'+j+'0').value+' '+document.getElementById('perpax'+i+'_'+j+'1').value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 12)
                                if(check_word(document.getElementById('child_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 14)
                                if(check_flight(document.getElementById('child_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                        }
                   }
               }

           }else{
                error_log+= 'Please fill all the blank for Child passenger '+i+'!\n';
           }
       }

       //infant
       for(i=1;i<=passenger.infant;i++){
           document.getElementById('infant_phone_code'+i).value = document.getElementById('booker_phone_code').value;
           document.getElementById('infant_phone'+i).value = document.getElementById('booker_phone').value;
           document.getElementById('infant_email'+i).value = document.getElementById('booker_email').value;
//           alert(document.getElementById('booker_phone').value);
           if(document.getElementById('infant_title'+i).value != '' &&
           document.getElementById('infant_first_name'+i).value != '' &&
           document.getElementById('infant_last_name'+i).value != '' &&
           document.getElementById('infant_nationality'+i).value != '' &&
           document.getElementById('infant_phone_code'+i).value != '' &&
           document.getElementById('infant_phone'+i).value != ''){
               if(check_name(document.getElementById('infant_title'+i).value,
               document.getElementById('infant_first_name'+i).value,
               document.getElementById('infant_last_name'+i).value, 25) == false)
                   error_log+= 'Total of infant '+i+' name maximum 25 characters!\n';
               if(check_date(document.getElementById('infant_birth_date'+i).value)==false)
                   error_log+= 'Birth date wrong for passenger infant '+i+'!\n';

               for(j in detail.perPax){
                   if(detail.perPax[j].name != 'Gender' && detail.perPax[j].name !=  'Full name' && detail.perPax[j].name !=  'Guest age' && detail.perPax[j].name !=  'Nationality' && detail.perPax[j].name !=  'Date of birth'){
                        if(detail.perPax[j].required == true){
                            //use regex bemyguest
                            if(detail.perPax[j].formatRegex != false){
                                if(check_regex(document.getElementById('infant_perpax'+i+'_'+j).value, detail.perPax[j].formatRegex)==false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                            }
                            //no regex
                            else if(detail.perPax[j].inputType == 1){
                                if(document.getElementById('adult_perpax'+i+'_'+j).value=='')
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                            }else if(detail.perPax[j].inputType == 2){
                                for(k in detail.perPax[j].items){
                                    if(document.getElementById('infant_perpax'+i+'_'+j+'_'+k).checked==true)
                                        check=1;
                                }
                                if(check==0)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                                check=0;
                            }else if(detail.perPax[j].inputType == 3)
                                if(check_number(document.getElementById('infant_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 4)
                                if(check_word(document.getElementById('infant_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 6)
                                if(check_date(document.getElementById('infant_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 7){


                            }else if(detail.perPax[j].inputType == 8){


                            }else if(detail.perPax[j].inputType == 10)
                                if(check_time(document.getElementById('infant_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 11)
                                if(check_date_time(document.getElementById('infant_perpax'+i+'_'+j+'0').value+' '+document.getElementById('perpax'+i+'_'+j+'1').value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 12)
                                if(check_word(document.getElementById('infant_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';

                            else if(detail.perPax[j].inputType == 14)
                                if(check_flight(document.getElementById('infant_perpax'+i+'_'+j).value) == false)
                                    text+= 'Please check your '+detail.perPax[j].name+'\n';
                        }
                   }
               }

           }else{
                error_log+= 'Please fill all the blank for Infant passenger '+i+'!\n';
           }
       }
       if(error_log==''){
           document.getElementById('additional_price').value = additional_price;
           document.getElementById('activity_review').submit();
       }else
           alert(error_log);
     }else{
        alert('Please Fill all the blank !');
     }
}

function change_date_activity(){

    document.getElementById('activity_detail_table').innerHTML = '';
    for(i in activity_date[event_pick]){
        if(activity_date[event_pick][i].date == moment(document.getElementById('activity_date').value).format('YYYY-MM-DD')){
            if(activity_date[event_pick][i].available == false){
                document.getElementById('activity_date_desc').innerHTML = `
                <small id="departure_date_themespark_desc" class="hidden" style="color: red;">Ticket is unavailable on this date</small>
                `;
            }else{
                document.getElementById('activity_date_desc').innerHTML = '';
            }
            activity_date_pick = i;
            activity_table_detail();
            break;
        }
    }
}

function change_event(val){
    event_pick = val;
    activity_table_detail();
}

function timeslot_change(val){
    activity_timeslot = val;
}

//perbooking

function input_type_change_perbooking(val){
    if(document.getElementById('perbooking'+val).value != ''){
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick + activity_type[activity_type_pick].options.perBooking[val].price;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = activity_type[activity_type_pick].options.perBooking[val].price;
    }else{
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = 0;
    }
    activity_table_detail();
}

function input_type11_change_perbooking(val, val1){
    if(document.getElementById('perbooking'+val+val1).value != ''){
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick + activity_type[activity_type_pick].options.perBooking[val].price;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = activity_type[activity_type_pick].options.perBooking[val].price;
    }else{
        additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick;
        activity_type[activity_type_pick].options.perBooking[val].price_pick = 0;
    }
    activity_table_detail();
}

function input_type5_change_perbooking(val){
    if(document.getElementById('perbooking'+val).checked == true){
        additional_price += activity_type[activity_type_pick].options.perBooking[val].price;
    }else if(document.getElementById('perbooking'+val).checked == false){
        additional_price -= activity_type[activity_type_pick].options.perBooking[val].price;
    }
    activity_table_detail();
}

function input_type1_change_perbooking(val){
    for(i in activity_type[activity_type_pick].options.perBooking[val].items){
        if(document.getElementById('perbooking'+val).value == activity_type[activity_type_pick].options.perBooking[val].items[i].value){
            additional_price = additional_price - activity_type[activity_type_pick].options.perBooking[val].price_pick + activity_type[activity_type_pick].options.perBooking[val].items[i].price;
            activity_type[activity_type_pick].options.perBooking[val].price_pick = activity_type[activity_type_pick].options.perBooking[val].items[i].price;
            break;
        }
    }
    activity_table_detail();
}

function input_type2_change_perbooking(val,val1){
    additional_price -= activity_type[activity_type_pick].options.perBooking[val].price_pick;
    activity_type[activity_type_pick].options.perBooking[val].price_pick = 0;
    for(i in activity_type[activity_type_pick].options.perBooking[val].items){
        if(document.getElementById('perbooking'+val+val1).checked == true)
            activity_type[activity_type_pick].options.perBooking[val].price_pick += activity_type[activity_type_pick].options.perBooking[val].items[i].price;
    }
    additional_price += additional_price + activity_type[activity_type_pick].options.perBooking[val].price_pick;
    activity_table_detail();
}

//perpax

function input_type_change_perpax(val, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = document.getElementById('adult_perpax'+val+'_'+inputType).value;
    else if(type == 'infant')
        perpax = document.getElementById('infant_perpax'+val+'_'+inputType).value;
    else if(type == 'child')
        perpax = document.getElementById('child_perpax'+val+'_'+inputType).value;
    else if(type == 'senior')
        perpax = document.getElementById('senior_perpax'+val+'_'+inputType).value;
    if(perpax != ''){
        additional_price = additional_price - detail.perPax[val].price_pick + detail.perPax[val].price;
        detail.perPax[val].price_pick = detail.perPax[val].price;
    }else{
        additional_price = additional_price - detail.perPax.price_pick;
        detail.perPax[val].price_pick = 0;
    }
    activity_table_detail();
}

function input_type11_change_perpax(val, val1, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = document.getElementById('adult_perpax'+val+'_'+inputType+val1).value;
    else if(type == 'infant')
        perpax = document.getElementById('infant_perpax'+val+'_'+inputType+val1).value;
    else if(type == 'child')
        perpax = document.getElementById('child_perpax'+val+'_'+inputType+val1).value;
    else if(type == 'senior')
        perpax = document.getElementById('senior_perpax'+val+'_'+inputType+val1).value;

    if(perpax != ''){
        additional_price = additional_price - detail.perPax[val].price_pick + detail.perPax[val].price;
        detail.perPax[val].price_pick = detail.perPax[val].price;
    }else{
        additional_price = additional_price - detail.perPax[val].price_pick;
        detail.perPax[val].price_pick = 0;
    }
    activity_table_detail();
}

function input_type5_change_perpax(val, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = document.getElementById('adult_perpax'+val+'_'+inputType).checked;
    else if(type == 'infant')
        perpax = document.getElementById('infant_perpax'+val+'_'+inputType).checked;
    else if(type == 'child')
        perpax = document.getElementById('child_perpax'+val+'_'+inputType).checked;
    else if(type == 'senior')
        perpax = document.getElementById('senior_perpax'+val+'_'+inputType).checked;

    if(perpax == true){
        additional_price += detail.perPax[val].price;
    }else if(perpax == false){
        additional_price -= detail.perPax[val].price;
    }
    activity_table_detail();
}

function input_type1_change_perpax(val, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = document.getElementById('adult_perpax'+val+'_'+inputType).value;
    else if(type == 'infant')
        perpax = document.getElementById('infant_perpax'+val+'_'+inputType).value;
    else if(type == 'child')
        perpax = document.getElementById('child_perpax'+val+'_'+inputType).value;
    else if(type == 'senior')
        perpax = document.getElementById('senior_perpax'+val+'_'+inputType).value;

    for(i in detail.perPax[val].items){
        if(perpax == detail.perPax[val].items[i].value){
            additional_price = additional_price - detail.perPax[val].price_pick + detail.perPax[val].items[i].price;
            detail.perPax[val].price_pick = detail.perPax[val].items[i].price;
            break;
        }
    }
    activity_table_detail();
}

function input_type2_change_perpax(val,val1, type, inputType){
    var perpax = '';
    if(type == 'adult')
        perpax = 'adult_perpax'+val+'_'+inputType;
    else if(type == 'infant')
        perpax = 'infant_perpax'+val+'_'+inputType;
    else if(type == 'child')
        perpax = 'child_perpax'+val+'_'+inputType;
    else if(type == 'senior')
        perpax = 'senior_perpax'+val+'_'+inputType;

    additional_price -= detail.perPax[val].price_pick;
    detail.perPax[val].price_pick = 0;
    for(i in detail.perPax[val].items){
        if(document.getElementById(perpax+'_'+val1).checked == true)
            detail.perPax[val].price_pick += detail.perPax[val].items[i].price;
    }
    additional_price += additional_price - detail.perPax[val].price_pick;
    activity_table_detail();
}
