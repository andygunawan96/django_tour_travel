counter_highlight = 0;
function add_table_of_highlight(data){
    text = '';
    counter_highlight = counter_highlight + 1;
    var node = document.createElement("div");
    text+=`
    <div class='row' id="highlight`+counter_highlight+`_id">
        <div class="col-lg-12" style="padding:15px; border-bottom:1px solid #cdcdcd;">
            <div class="row">
                <div class="col-xs-6">
                    <h5>Highlight #`+counter_highlight+`</h5>
                </div>
                <div class="col-xs-6" style="text-align:right;">
                    <button type="button" class="primary-delete-date" onclick="delete_table_of_highlight(`+counter_highlight+`)">
                        Delete <i class="fa fa-times" style="color:#E92B2B;font-size:20px;"></i>
                    </button>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                    <h6 style="margin-bottom:10px;">Title</h6>
                    <div class="input-container-search-ticket">`;
                        if(data.title == '' || data.title == undefined)
                            text+=`<input type="text" class="form-control" name="highlight_title`+counter_highlight+`" id="highlight_title`+counter_highlight+`" placeholder="Title " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Title '" value="">`;
                        else
                            text+=`<input type="text" class="form-control" name="highlight_title`+counter_highlight+`" id="highlight_title`+counter_highlight+`" placeholder="Title " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Title '" value="`+data.title+`">`;
                    text+=`
                    </div>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                    <h6 style="margin-bottom:10px;">URL</h6>
                    <div class="input-container-search-ticket">`;
                        if(data.title == '' || data.title == undefined)
                            text+=`<input type="text" class="form-control" name="highlight_url`+counter_highlight+`" id="highlight_url`+counter_highlight+`" placeholder="Highlight URL " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Highlight URL '" value="">`;
                        else
                            text+=`<input type="text" class="form-control" name="highlight_url`+counter_highlight+`" id="highlight_url`+counter_highlight+`" placeholder="Highlight URL " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Highlight URL '" value="`+data.url+`">`;
                    text+=`
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    node.innerHTML = text;
    document.getElementById("highlight_div").appendChild(node);
}

function delete_table_of_highlight(val){
    try{
        document.getElementById(`highlight`+val+`_id`).remove();
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
        try{
            document.getElementById(`highlight`+val+`_id`).remove();
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
    }
}

function get_highlight(type){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_highlight_url',
       },
       data: {},
       success: function(msg) {
            //add template
            if(type == 'setting'){
                document.getElementById("highlight_div").innerHTML = '';
                counter_highlight = 0;
                for(i in msg){
                    add_table_of_highlight(msg[i]);
                }
            }else if(type == 'header'){
                text = '';
                for(i in msg){
                    text += `<li><a href="`+msg[i].url+`" target="_blank">`+msg[i].title+`</a></li>`;
                }
                if(msg.length == 0){
                    if(template == 6 || template == 7){
                        text += `<li class="menu_header" style="margin-left:0px; color:black; font-size:13px;">No Highlight</li>`;
                    }else{
                        text += `<li class="menu_header">No Highlight</li>`;
                    }
                }
                document.getElementById('highlight_header_div').innerHTML = text;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get highlight url');
       },timeout: 60000
    });
}

function save_highlight(){
    data = [];
    for(i=1;i<=counter_highlight;i++){
        try{
            data.push([document.getElementById('highlight_title'+i).value,document.getElementById('highlight_url'+i).value]);
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'set_highlight_url',
       },
       data: {
            'data': JSON.stringify(data)
       },
       success: function(msg) {
            get_highlight('setting');
            get_highlight('header');
            Swal.fire({
              type: 'success',
              title: 'Update',
              text: 'Highlight url update!'
            })
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update highlight url');
       },timeout: 60000
    });
}