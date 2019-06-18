class_of_service = [
    [
        'eco', 'Economy Class'
    ],[
        'pre', 'Premium Economy'
    ],[
        'bus', 'Business Class'
    ]
]

var myVarCarrier;
var myVarOriginDestination;

function search_carrier(){
    clearTimeout(myVarCarrier);
    myVarCarrier = setTimeout(function() {
        find = '';
        find = document.getElementById('carrier_name').value.toLowerCase();
        document.getElementById("list_carrier_name").innerHTML = '';
        if(find.length>1){
            console.log(find);
            text = '';
            issued_offline_data.carrier_id.forEach((obj)=> {
              if(obj.name.toString().toLowerCase().search(find) !== -1 || obj.code.toString().toLowerCase().search(find) !== -1){
                node = document.createElement("div");
                node.innerHTML = `<option value="`+obj.name+`">`+obj.code+`</option>`;
                document.getElementById("list_carrier_name").appendChild(node);
              }
            });
        }
    }, 500);
}

function search_origin_departure(val,sequence){
    clearTimeout(myVarOriginDestination);
    myVarOriginDestination = setTimeout(function() {
        find = '';
        console.log(val);
        console.log(sequence);
        if(val == 'origin'){
            find = document.getElementById(val+sequence).value.toLowerCase();
            document.getElementById("airline_origin_name"+sequence).innerHTML = '';
        }else if(val == 'destination'){
            find = document.getElementById(val+sequence).value.toLowerCase();
            document.getElementById("airline_destination_name"+sequence).innerHTML = '';
        }
        if(find.length>1){
            text = '';
            destination.forEach((obj)=> {
              if(obj.name.toString().toLowerCase().search(find) !== -1 || obj.code.toString().toLowerCase().search(find) !== -1){
                node = document.createElement("div");
                node.innerHTML = `<option value="`+obj.code + ` - ` + obj.name+`">`+obj.code+`</option>`;
                if(val == 'origin')
                    document.getElementById("airline_origin_name"+sequence).appendChild(node);
                else if(val == 'destination')
                    document.getElementById("airline_destination_name"+sequence).appendChild(node);
              }
            });
        }
    }, 500);
}

function change_transaction_type(){
    if(document.getElementById('transaction_type').value  == 'airline' || document.getElementById('transaction_type').value  == 'train'){
        document.getElementById('show_line').hidden = false;
    }else{
        document.getElementById('show_line').hidden = true;
    }
}

function add_table_of_passenger(){
    text= '';
    var node = document.createElement("tr");
    text += `
        <td>`+(parseInt(counter_passenger)+1)+`</td>
        <td>
            <span id='name_pax`+counter_passenger+`' name='name_pax`+counter_passenger+`'></span>
            <input id="id_passenger`+counter_passenger+`" name="id_passenger`+counter_passenger+`" type="hidden"/>
        </td>
        <td>
            <span id='pax_type`+counter_passenger+`' name='pax_type`+counter_passenger+`'></span>
        </td>
        `;
    text += `
        <td>
            <div style="text-align:center;">
                <button type="button" class="primary-btn" style="border-radius: 28px; margin-bottom:5px;" data-toggle="modal" data-target="#myModalPassenger`+counter_passenger+`"><i class="fas fa-search"></i></button>
                <button type="button" class="primary-delete" style="border-radius: 28px;"><i class="fas fa-trash-alt"></i></button>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="myModalPassenger`+counter_passenger+`" role="dialog">
                <div class="modal-dialog">

                  <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Passenger</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <input type="text" id="train`+(counter_passenger+1)+`_search" placeholder="Search" />
                            <button type="button" class="btn btn-default" onclick="search_passenger('','`+(counter_passenger+1)+`','issued_offline')">Search</button>
                            <div id="search_result`+(counter_passenger+1)+`" style="overflow:auto;height:200px;">

                            </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </td>`;
    node.innerHTML = text;
    node.setAttribute('id', 'table_passenger'+counter_passenger);
    document.getElementById("table_of_passenger").appendChild(node);
    counter_passenger++;
}

function delete_table_of_passenger(){
    if(counter_passenger != 0){
        counter_passenger--;
        var element = document.getElementById('table_passenger'+counter_passenger);
        element.parentNode.removeChild(element);
    }
}

function add_table_of_line(){
    text= '';
    var node = document.createElement("tr");
    text += `
    <td>`+(parseInt(counter_line)+1)+`</td>
    <td>
        <input list="airline_origin_name`+counter_line+`" id="origin`+counter_line+`" class="form-control" name="origin`+counter_line+`" onkeyup="search_origin_departure('origin',`+counter_line+`);" />
        <datalist id="airline_origin_name`+counter_line+`"/>
    </td>
    <td>
        <input list="airline_destination_name`+counter_line+`" id="destination`+counter_line+`" class="form-control" name="destination`+counter_line+`" onkeyup="search_origin_departure('destination',`+counter_line+`);" />
        <datalist id="airline_destination_name`+counter_line+`"/>
    </td>
    <td>
        <input type="datetime-local" id='departure`+counter_line+`' class="form-control" name='departure`+counter_line+`' placeholder="datetime"/>
    </td>
    <td>
        <input type="datetime-local" id='arrival`+counter_line+`' class="form-control" name='arrival`+counter_line+`' placeholder="datetime"/>
    </td>
    <td><input type="text" class="form-control" id='carrier_code`+counter_line+`' name='carrier_code`+counter_line+`' placeholder="Carrier Code"></td>
    <td><input type="text" class="form-control" id='carrier_number`+counter_line+`' name='carrier_number`+counter_line+`' placeholder="Carrier Number"></td>
    <td>
        <div class="input-container-search-ticket btn-group">
            <div class="form-select" id="default-select">
                <select id='class`+counter_line+`' name='class`+counter_line+`' class="form-control" style="height:42px;">`;
                for(i in class_of_service)
                    text+=`<option value="`+class_of_service[i][0]+`">`+class_of_service[i][1]+`</option>`;
                    text+=`
                </select>
            </div>
        </div>
    </td>
    <td><input type="text" class="form-control" id='sub_class`+counter_line+`' name='sub_class`+counter_line+`' placeholder="Sub Class"></td>
    <td><button type="button" class="primary-delete" style="border-radius: 28px;"><i class="fas fa-trash-alt"></i></button></td>`;
    node.innerHTML = text;
    $('#class'+counter_line).niceSelect('update');
    node.setAttribute('id', 'table_line'+counter_line);
    document.getElementById("table_of_line").appendChild(node);
    counter_line++;
}

function delete_table_of_line(){
    if(counter_line != 0){
        counter_line--;
        var element = document.getElementById('table_line'+counter_line);
        element.parentNode.removeChild(element);
    }
}

function table_issued_offline_history(data){
    text= '';
    var node = document.createElement("tr");
    for(i in data){
        data_search.push(data[i]);
        text+=`
        <tr>
        <td>`+(parseInt(data_counter)+1)+`</td>
        <td>`+data[i].name+`</td>`;
        text+= `<td>`+data[i].provider+`</td>`;
        text+= `<td>`+data[i].pnr+`</td>`;
        text+= `<td>`+data[i].agent_id+`</td>`;
        if(data[i].state == 'draft'){
            text+= `<td>Draft</td>`;
        }
        else if(data[i].state == 'confirm'){
            text+= `<td>Confirm</td>`;
        }
        else if(data[i].state == 'paid'){
            text+= `<td>Paid</td>`;
        }
        else if(data[i].state == 'posted'){
            text+= `<td>Done</td>`;
        }
        else if(data[i].state == 'refund'){
            text+= `<td>Refund</td>`;
        }
        else if(data[i].state == 'expired'){
            text+= `<td>Expired</td>`;
        }
        else if(data[i].state == 'cancel'){
            text+= `<td>Cancelled</td>`;
        }

        text+= `<td>`+data[i].total_sale_price+`</td>`;
        text+= `<td>`+data[i].expired_date+`</td>`;
        text+= `</tr>`;
        node.innerHTML = text;
        document.getElementById("table_issued_offline").appendChild(node);
        node = document.createElement("tr");
        $('#loading-search-issued-off-history').hide();
//                   document.getElementById('airlines_ticket').innerHTML += text;
        text = '';
        data_counter++;
    }
}