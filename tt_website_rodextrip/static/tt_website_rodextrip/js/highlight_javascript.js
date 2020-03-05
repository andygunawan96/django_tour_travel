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
            <div class="col-lg-10 col-md-10 col-sm-10">
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" name="highlight_url`+counter_highlight+`" id="highlight_url`+counter_highlight+`" placeholder="Highlight URL " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Highlight URL '" value="`+data+`">
                </div>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-1" style="color:`+text_color+`;padding-top:10px;">
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

function get_highlight(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_highlight_url',
       },
       data: {},
       success: function(msg) {
            for(i in msg){
                add_table_of_highlight(msg[i]);
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel detail request </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function save_highlight(){
    data = [];
    for(i=1;i<=counter_highlight;i++){
        data.push(document.getElementById('highlight_url'+i).value);
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
            Swal.fire({
              type: 'success',
              title: 'Update',
              text: 'Highlight url update!'
            })
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error hotel detail request </span>' + errorThrown,
            })
       },timeout: 60000
    });
}