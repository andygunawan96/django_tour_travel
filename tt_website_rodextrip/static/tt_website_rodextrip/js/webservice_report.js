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

function get_report_overall(){
    console.log("GET REPORT");
    var reportChart = $('#chart_report');
    getToken();
    $.ajax({
        type: 'POST',
        url: '/webservice/report',
        headers: {
            'action': "get_report_alles",
        },
        data: {
            'signature': signature,
            'report_of': "overall",
            'type': "overall"
        },
        success: function(result){
//            console.log("This one sparks joy");
//            console.log(result);

            $("#get_report_startdate").val(result.start_date);
//            console.log(data.date.end);
            $("#get_report_enddate").val(result.end_date);

            var config = {
                type: 'bar',
                data: {
                    labels: result.raw_data.result.response.graph.label,
                    datasets: [{
                        label: 'Issued reservation',
                        stack: 'Stack 0',
                        backgroundColor: 'orange',
                        yAxisID: 'y-axis-1',
                        data: result.raw_data.result.response.graph.data
                    },{
                        label: 'Total',
                        stack: 'Stack 1',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'green',
                        data: result.raw_data.result.response.graph.data2
                    },{
                        label: 'Average',
                        stack: 'Stack 2',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'blue',
                        data: result.raw_data.result.response.graph.data3
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: "Overview Report"
                    },
                    scales: {
                        yAxes: [{
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'left',
							id: 'y-axis-1',
                            ticks: {
                                beginAtZero: true
                            },
                        },{
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'right',
							id: 'y-axis-2',
							gridLines: {
								drawOnChartArea: false
							},
                            ticks: {
                                beginAtZero: true
                            },
                            stack: true
                        }],
                        xAxes: [{
                            stack: true
                        }]
                    }
                }
            }
            reportChart.data("ChartJs", config);
            var ctx = reportChart[0].getContext("2d");

            chart_object = new Chart(ctx, config);

            // peripherals
            $('#total_rupiah').html(result.raw_data.result.response.total_rupiah);
            $('#average_rupiah').html(result.raw_data.result.response.average_rupiah);

            // overview section
//            contents = "<h2>Group by Category</h2>";
//            contents += `<table>`;
//            for (key in result.raw_data.result.response.overview){
//                console.log(key);
//                console.log(result.raw_data.result.response.overview[key].provider);
//                contents += `<tr><td>` + result.raw_data.result.response.overview[key].provider + `</td><td>` + result.raw_data.result.response.overview[key].issued + `</td></tr>`;
//            }
//            contents += `</table>`;

            $('#overview_content').html(contents);
        },
        error: function(result){
            console.log("Error");
        }
    });
}

$('#report_form').submit(function(evt){
    evt.preventDefault();
    // check if date is bigger than 30 days
    var start = $('#get_report_startdate').val();
    var end = $('#get_report_enddate').val();
    var group = $('#group_by').val();

    var date1 = new Date(start);
    var date2 = new Date(end);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    if (Difference_In_Days > 35 && group != 'month'){
        if(alert("result will be presented in months")){}
        else {
            var group = $('#group_by').val('month');
        }
    }

    $('#update_chart_button').prop('disabled', true);
    $('.report_button').prop('disabled', true);
    var field_id = $('#field_id').val();
    var reportChart = $('#' + field_id);
    var config = reportChart.data("ChartJs");
    var postdata = $(this).serialize();
    postdata += "&type=custom&signature=" + signature;
    $.ajax({
        url: "/webservice/report",
        data: postdata,
        type: 'POST',
        headers: {
            'action': "update_chart"
        },
        success: function(result){
//            console.log(result);
            //console.log(data.date.start);
            $("#get_report_startdate").val(result.start_date);
//            console.log(data.date.end);
            $("#get_report_enddate").val(result.end_date);
            config.data = {
                labels: result.raw_data.result.response.graph.label,
                datasets: [{
                        label: 'Issued reservation',
                        stack: 'Stack 0',
                        backgroundColor: 'orange',
                        yAxisID: 'y-axis-1',
                        data: result.raw_data.result.response.graph.data
                    },{
                        label: 'Total',
                        stack: 'Stack 1',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'green',
                        data: result.raw_data.result.response.graph.data2
                    },{
                        label: 'Average',
                        stack: 'Stack 2',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'blue',
                        data: result.raw_data.result.response.graph.data3
                    }]
            }
            reportChart.data("ChartJs", config);
            var ctx = reportChart[0].getContext("2d");
            chart_object = new Chart(ctx, config);
            chart_object.update();

            // peripherals
            $('#total_rupiah').html(result.raw_data.result.response.total_rupiah);
            $('#average_rupiah').html(result.raw_data.result.response.average_rupiah);

             $('#update_chart_button').prop('disabled', false);
//            setTimeout(function(){
//              $('.report_button').prop('disabled', false);
//            }, 1000);
        }
    });
});

function update_chart(button_class, canvas_id, action, report_title, report_of, type="days"){
    console.log("UPDATE UPDATE");
//    $('.' + button_class).prop('disabled', true);
    var reportChart = canvas_id;
    var config = canvas_id.data("ChartJs");

//    console.log(config);
    getToken();
    $.ajax({
        url: "/webservice/report",
        headers: {
            'action': action
        },
        data: {
            'signature': signature,
            'type': type.toLowerCase(),
            'report_of': report_of,
        },
        type: 'POST',
        success: function(data){
            console.log(data);
//            console.log(data.date.start);
            $('#' + action + "_startdate").val(data.start_date);
//            console.log(data.date.end);
            $('#' + action + "_enddate").val(data.end_date);
            config.data = {
                labels: data.raw_data.result.response.overall_graph.label,
                datasets: [{
                    label: 'Number of data',
                    backgroundColor: 'orange',
                    data: data.raw_data.result.response.overall_graph.data
                }]
            }
            reportChart.data("ChartJs", config);
            var ctx = reportChart[0].getContext("2d");
            chart_object = new Chart(ctx, config);
            chart_object.update();
            setTimeout(function(){
              $('.' + button_class).prop('disabled', false);
            }, 1000);
        }
    });
}


//function update_chart(){
//    console.log("UPDATE UPDATE");
//}