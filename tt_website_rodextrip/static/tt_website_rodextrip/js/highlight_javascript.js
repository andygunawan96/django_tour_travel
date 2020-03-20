counter_highlight = 0;
function add_table_of_highlight(data){
    text = '';
    counter_highlight = counter_highlight + 1;
    var node = document.createElement("div");
    text+=`
        <div class='row' id="highlight`+counter_highlight+`_id">
            <div class="col-lg-1 col-md-1 col-sm-1" style="color:`+text_color+`;padding-top:10px;">
                `+counter_highlight+`
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4">
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="highlight_title`+counter_highlight+`" id="highlight_title`+counter_highlight+`" placeholder="Title " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Title '" value="`+data[0]+`">
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6">
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="highlight_url`+counter_highlight+`" id="highlight_url`+counter_highlight+`" placeholder="Highlight URL " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Highlight URL '" value="`+data[1]+`">
                </div>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-1" style="color:`+text_color+`;">
                <button type="button" class="primary-delete-date" onclick="delete_table_of_highlight(`+counter_highlight+`)">
                    <i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i>
                </button>
            </div>
        </div>`;
    node.innerHTML = text;
    document.getElementById("highlight_div").appendChild(node);
}

function delete_table_of_highlight(val){
    try{
        document.getElementById(`highlight`+val+`_id`).remove();
    }catch(err){
        try{
            document.getElementById(`highlight`+val+`_id`).remove();
        }catch(err){}
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
            if(type == 'setting'){
                document.getElementById("highlight_div").innerHTML = '';
                counter_highlight = 0;
                for(i in msg){
                    add_table_of_highlight(msg[i]);
                }
            }else if(type == 'header'){
                text = '';
                for(i in msg){
                    text += `<li><a href="`+msg[i][1]+`" target="_blank">`+msg[i][0]+`</a></li>`;
                }
                if(msg.length == 0)
                    text += `<li>No Highlight</li>`;
                document.getElementById('highlight_header_div').innerHTML = text;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error hotel detail request </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function save_highlight(){
    data = [];
    for(i=1;i<=counter_highlight;i++){
        try{
            data.push([document.getElementById('highlight_title'+i).value,document.getElementById('highlight_url'+i).value]);
        }catch(err){}
    }
    console.log(data);
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
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error hotel detail request </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}