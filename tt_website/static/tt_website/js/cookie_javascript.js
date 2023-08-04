function setCookie(cname, cvalue, type) {
    if(type == 'promotion'){
        end_second = moment().endOf('day').diff(moment(), 'seconds');
    }else if(type == 'tac'){
        end_second = moment().subtract(-6, 'months').endOf('day').diff(moment(), 'seconds');
    }

    const next_date = new Date();
    next_date.setTime(next_date.getTime() + (end_second*1000));
    let expires = "expires="+next_date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(variable) {
    var name = variable + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(type, check, page, version) {
    cookie_page = page;
    //cookie di home
    if(cookie_page == 'home'){
        //terms_first terms_none promotion_first
        if(type == 'tac'){
            cookie_tac = getCookie("modal_tac"); //load content
            if(check == 'load'){ //first load page
                new_version = parseInt(version);
                if(cookie_tac != ''){ //cookie data
                    const myArrayTac = cookie_tac.split(".");
                    if(typeof myArrayTac[1] === "undefined"){
                        old_version = 0;
                    }else{
                        old_version = parseInt(myArrayTac[1]);
                    }
                    if(myArrayTac[0] == 'hide' && old_version >= new_version) {
                        $("#myModalTac").modal('hide');
                        checkCookie('promotion', 'load', 'home', '');
                    }
                    else if(myArrayTac[0] == 'show') {
                        if(template != 2){
                            $("#myModalTac").modal('show');
                        }else{
                            $("#myModalTac").modal();
                        }
                    }
                }
                else{   //cookie data not found
                    old_version = 0;
                }

                if(old_version < new_version){ //update content cookie
                    modal_tac = 'show.'+new_version;
                    if(template != 2){
                        $("#myModalTac").modal('show');
                    }else{
                        $("#myModalTac").modal();
                    }
                    setCookie("modal_tac", modal_tac, 'tac');
                }
            }
            else if(check == 'update'){    //update cookie dari admin setting
                if ($('#agree_tac').is(':checked')) {
                    if(old_version < new_version){
                        modal_tac = 'hide.'+new_version;
                    }else{
                        modal_tac = 'hide.'+old_version;
                    }
                    $("#myModalTac").modal('hide');
                    setCookie("modal_tac", modal_tac, 'tac');
                    checkCookie('promotion', 'load', 'home', '');
                    document.getElementById("tac_span").style = "border: unset;";
                }
                else{
                    document.getElementById("tac_span").style = "border: 2px solid red;";
                }
            }
        }
        else if(type == 'promotion'){
            cookie_promotion = getCookie("modal_promotion");
            if(check == 'load'){
                if(cookie_promotion != ''){
                    if(cookie_promotion == 'hide') {
                        modal_promo = 'hide';
                        $("#myModalPromotion").modal('hide');
                    }
                    else{
                        modal_promo = 'show';
                        if(template != 2){
                            $("#myModalPromotion").modal('show');
                        }else{
                            $("#myModalPromotion").modal();
                        }
                    }
                }else{
                    modal_promo = 'show';
                    if(template != 2){
                        $("#myModalPromotion").modal('show');
                    }else{
                        $("#myModalPromotion").modal();
                    }
                }
            }
            else if(check == 'update'){
                if ($('#dont_show_again').is(':checked')) {
                    modal_promo = 'hide';
                }else{
                    modal_promo = 'show';
                }
            }
            setCookie("modal_promotion", modal_promo, 'promotion');
        }
    }
}

// set cookie one time till browser close
function document_set_cookie(name, value){
    document.cookie = name + '=' + value;
}