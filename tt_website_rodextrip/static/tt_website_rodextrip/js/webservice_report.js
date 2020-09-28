function get_peripherals(card_id, header){
    console.log("LETSGO");
    console.log(header);
    getToken();
    $.ajax({
        type: "POST",
        url: "/webservice/report",
        headers: {
            'action': header
        },
        data: {
            'signature': signature
        },
        success: function(result){
            console.log("RETURN LETSGO");
            console.log(result);
            $('#' + card_id).html(result.result.response.data);
        }
    })
}

function get_report(canvas_id, action, report_title, report_of, type="default"){
    console.log("Get Report");
    var reportChart = canvas_id;
    getToken();
    $.ajax({
        type: "POST",
        url: "/webservice/report",
        headers: {
            'action': "get_report",
        },
        data: {
            'signature': signature,
            'report_of': report_of,
            'type': type.toLowerCase()
        },
        success: function(result){
            console.log("HELLO");
            console.log(result);
            console.log("WORLD");
            console.log(result.raw_data.result.response.overall_graph);
//            $('#' + action + "_startdate").val(data.date.start)
//            console.log(data.date.end);
//            $('#' + action + "_enddate").val(data.date.end)

            var config = {
                type: 'bar',
                data: {
                    labels: result.raw_data.result.response.overall_graph.label,
                    datasets: [{
                        label: 'Number of data',
                        backgroundColor: 'orange',
                        data: result.raw_data.result.response.overall_graph.data
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: report_title
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                    }
                }
            }
            reportChart.data("ChartJs", config);
            var ctx = reportChart[0].getContext("2d");

            chart_object = new Chart(ctx, config);
        },
        error: function(result){
            console.log("Error");
        }
    });
}

$('.update_chart').submit(function(evt){
    evt.preventDefault();
    $('.report_button').prop('disabled', true);
    var field_id = $(this).attr('id');
    var reportChart = $('#chart_' + field_id);
    var config = reportChart.data("ChartJs");
    var postdata = $(this).serialize();
    postdata += "&type=custom";
    $.ajax({
        url: "/webservice/backend",
        data: postdata,
        type: 'POST',
        headers: {
            'action': "update_chart_custom"
        },
        success: function(data){
            console.log(data);
            //console.log(data.date.start);
            $('#' + data.action + "_startdate").value = data.date.start
            //console.log(data.date.end);
            $('#' + data.action + "_enddate").value = data.date.end
            config.data = {
                labels: data.label,
                    datasets: [{
                        label: 'Number of data',
                        backgroundColor: 'orange',
                        data: data.data
                    }]
            }
            reportChart.data("ChartJs", config);
            var ctx = reportChart[0].getContext("2d");
            chart_object = new Chart(ctx, config);
            chart_object.update();
            setTimeout(function(){
              $('.report_button').prop('disabled', false);
            }, 1000);
        }
    });
});

function update_chart(button_class, canvas_id, action, report_title, type="days"){
    console.log("UPDATE UPDATE");
//    $('.' + button_class).prop('disabled', true);
    var reportChart = canvas_id;
    var config = canvas_id.data("ChartJs");

//    console.log(config);
//    getToken();
    $.ajax({
        url: "/webservice/backend",
        headers: {
            'action': action
        },
        data: {
            'type': type
        },
        type: 'POST',
        success: function(data){
            console.log(data);
//            console.log(data.date.start);
//            $('#' + action + "_startdate").val(data.date.start);
////            console.log(data.date.end);
//            $('#' + action + "_enddate").val(data.date.end);
//            config.data = {
//                labels: data.label,
//                    datasets: [{
//                        label: 'Number of data',
//                        backgroundColor: 'orange',
//                        data: data.data
//                    }]
//            }
//            reportChart.data("ChartJs", config);
//            var ctx = reportChart[0].getContext("2d");
//            chart_object = new Chart(ctx, config);
//            chart_object.update();
//            setTimeout(function(){
//              $('.' + button_class).prop('disabled', false);
//            }, 1000);
        }
    });
}


//function update_chart(){
//    console.log("UPDATE UPDATE");
//}