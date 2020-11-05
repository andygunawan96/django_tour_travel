function number_format(number, decimals, dec_point, thousands_sep) {
// *     example: number_format(1234.56, 2, ',', ' ');
// *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

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


// as a note maybe in the future get report overall, get report book issued, and get report chanel can be in 1 function
function get_report_overall(){
    console.log("GET REPORT");
    var reportChart = $('#first_chart_report');
    var secondReportChart = $('#second_chart_report');
    var thirdReportChart = $('#third_chart_report');
    //getToken();
    $.ajax({
        type: 'POST',
        url: '/webservice/report',
        headers: {
            'action': "get_report_alles",
        },
        data: {
            'signature': signature,
            'provider_type': "overall",
            'type': "overall"
        },
        success: function(result){
            console.log("This one sparks joy");
            console.log(result);

            $("#get_report_startdate").val(result.start_date);
//            console.log(data.date.end);
            $("#get_report_enddate").val(result.end_date);

            // first graph (issued ratio something)
            var config = {
                type: 'bar',
                data: {
                    labels: result.raw_data.result.response.first_graph.label,
                    datasets: [{
                        label: 'Issued reservation',
                        stack: 'Stack 0',
                        backgroundColor: 'orange',
                        yAxisID: 'y-axis-1',
                        data: result.raw_data.result.response.first_graph.data
                    },{
                        label: 'Revenue',
                        stack: 'Stack 1',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'green',
                        data: result.raw_data.result.response.first_graph.data2
                    },{
                        label: 'Average',
                        stack: 'Stack 2',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'blue',
                        data: result.raw_data.result.response.first_graph.data3
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
                            scaleLabel: {
                                display: true,
                                labelString: '# of data'
                            }
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
                            stack: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Rupiah'
                            }
                        }],
                        xAxes: [{
                            stack: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, chart){
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label;
                                return datasetLabel + ' ' + number_format(tooltipItem.yLabel, 2);
                            }
                        }
                    }
                }
            }
            reportChart.data("ChartJs", config);
            var ctx = reportChart[0].getContext("2d");

            first_chart_object = new Chart(ctx, config);

            // second graph
            var second_config = {
                type: 'line',
                data:{
                    labels: result.raw_data.result.response.second_graph.label,
                    datasets: [{
                        labels: 'Booked',
					    borderColor: 'red',
					    data: result.raw_data.result.response.second_graph.data
                    }, {
                        labels: 'Issued',
                        backgroundColor: 'blue',
					    borderColor: 'blue',
					    data: result.raw_data.result.response.second_graph.data2
                    }]
                },
                option: {
                    responsive: true,
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: "Book-Issued Report"
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Time'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value'
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, chart){
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label;
                                return datasetLabel + ' ' + number_format(tooltipItem.yLabel, 2);
                            }
                        }
                    }
                }
            }
            secondReportChart.data("ChartJs", second_config);
            var second_ctx = secondReportChart[0].getContext("2d");

            second_chart_object = new Chart(second_ctx, second_config);

            // third graph
            var third_config = {
                type: 'bar',
                data: {
                    labels: result.raw_data.result.response.third_graph.label,
                    datasets: [{
                        label: '# of reservation',
                        stack: 'Stack 0',
                        backgroundColor: 'orange',
                        yAxisID: 'y-axis-1',
                        data: result.raw_data.result.response.third_graph.data2
                    },{
                        label: 'Revenue',
                        stack: 'Stack 1',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'green',
                        data: result.raw_data.result.response.third_graph.data
                    },{
                        label: 'Average',
                        stack: 'Stack 2',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'blue',
                        data: result.raw_data.result.response.third_graph.data3
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: "Agent Rank Report"
                    },
                    scales: {
                        yAxes: [{
                            // config label handler untuk jumlah data
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'left',
							id: 'y-axis-1',
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                labelString: '# of data'
                            }
                        },{
                            // config label handler untuk IDR
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'right',
							id: 'y-axis-2',
							gridLines: {
								drawOnChartArea: false
							},
                            ticks: {
                                beginAtZero: true,
                                callback: function(value, index, values) {
                                    return 'IDR ' + number_format(value);
                                }
                            },
                            stack: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Rupiah'
                            }
                        }],
                        xAxes: [{
                            stack: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Agent'
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, chart){
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label;
                                return datasetLabel + ' ' + number_format(tooltipItem.yLabel, 2);
                            }
                        }
                    }
                }
            }

            thirdReportChart.data("ChartJs", third_config);
            var third_ctx = thirdReportChart[0].getContext("2d");

            third_chart_object = new Chart(third_ctx, third_config);

            // peripherals
            $('#total_rupiah').html(result.raw_data.result.response.total_rupiah);
            $('#average_rupiah').html(result.raw_data.result.response.average_rupiah);

            // overview section
            contents = overview_overall(result.raw_data.result.response.first_overview);
            $('#first_overview_content').html(contents);

            // second overview secction
            second_contents = overview_book_issued(result.raw_data.result.response.second_overview);
            $('#second_overview_content').html(second_contents);

            /////////////////////////////////
            // handler of dynamic session
            /////////////////////////////////

            //provider data
            var provider_datalist = ``;
            result.raw_data.result.response.dependencies.provider_type.forEach(function(item, index){
                provider_datalist += `<option value="overall_`+ item +`">`+ item +`</option>`
            });

            //sub provider data
//            var sub_provider_datalist = ``;
//            result.raw_data.result.response.dependencies.sub_provider.forEach(function(item){
//                sub_provider_datalist += `<option value="`+ item['code'] +`">`+ item['name'] +`</option>`
//            }

            // agent type
            var agent_type_datalist = ``;
            result.raw_data.result.response.dependencies.agent_type.forEach(function(item){
                agent_type_datalist += `<option value="`+ item['code'] +`">`+ item['name'] +`</option>`;
            });

            // proceed with agent data
            var agent_datalist = ``;
            result.raw_data.result.response.dependencies.agent_list.forEach(function(item){
                agent_datalist += `<option value="`+ item['seq_id'] +`">`+ item['name'] +`</option>`;
            });

            // for debugging purposes
//            console.log(agent_datalist);
//            console.log(agent_type_datalist);
//            console.log(provider_datalist);
            console.log(agent_datalist);

            // after document ready then show the input field and all
            $(document).ready(function(){

                $('#provider').append(provider_datalist);
                $('#agent_type').append(agent_type_datalist);
                $('#agent').append(agent_datalist);
                $('#agent').selectize({
                      sortField: 'text'
                  });
                  if(result.raw_data.result.response.dependencies.is_ho == 1){
                    $('#agent_selector').show();
                  }
            });
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

//    if (Difference_In_Days > 35 && group != 'month'){
//        if(alert("result will be presented in months")){}
//        else {
//            var group = $('#group_by').val('month');
//        }
//    }

    // disable button while updating chart, this prevent of double click (causing chart broken)
    $('#update_chart_button').prop('disabled', true);
    $('.report_button').prop('disabled', true);

    // get respected chart by id
    var reportChart = $('#first_chart_report');
    var secondReportChart = $('#second_chart_report');
    var thirdReportChart = $('#third_chart_report');

    // highlight "to update" config
    var config = reportChart.data("ChartJs");
    var secondConfig = secondReportChart.data("ChartJs");
    var thirdConfig = thirdReportChart.data("ChartJs");

    // prepare data
    var postdata = $(this).serialize();
    postdata += "&type=custom&signature=" + signature;

    // post data
    $.ajax({
        url: "/webservice/report",
        data: postdata,
        type: 'POST',
        headers: {
            'action': "update_chart"
        },
        success: function(result){
            // for debugging purpose
            console.log(result);
            //console.log(data.date.start);
//            $("#get_report_startdate").val(result.start_date);
//            console.log(data.date.end);
//            $("#get_report_enddate").val(result.end_date);

            // update the first chart
            config.data = {
                labels: result.raw_data.result.response.first_graph.label,
                datasets: [{
                    label: 'Issued reservation',
                    stack: 'Stack 0',
                    backgroundColor: 'orange',
                    yAxisID: 'y-axis-1',
                    data: result.raw_data.result.response.first_graph.data
                },{
                    label: 'Revenue',
                    stack: 'Stack 1',
                    yAxisID: 'y-axis-2',
                    backgroundColor: 'green',
                    data: result.raw_data.result.response.first_graph.data2
                },{
                    label: 'Average',
                    stack: 'Stack 2',
                    yAxisID: 'y-axis-2',
                    backgroundColor: 'blue',
                    data: result.raw_data.result.response.first_graph.data3
                }]
            }
            reportChart.data("ChartJs", config);
            var ctx = reportChart[0].getContext("2d");
            chart_object = new Chart(ctx, config);
            chart_object.update();

            // update second chart
            secondConfig.data = {
                labels: result.raw_data.result.response.second_graph.label,
                datasets: [{
                    labels: 'Booked',
                    borderColor: 'red',
                    data: result.raw_data.result.response.second_graph.data
                }, {
                    labels: 'Issued',
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: result.raw_data.result.response.second_graph.data2
                }]
            }
            secondReportChart.data("ChartJs", secondConfig);
            var secondCtx = secondReportChart[0].getContext("2d");
            second_chart_object = new Chart(secondCtx, secondConfig);
            second_chart_object.update();

            //update third chart
            thirdConfig.data = {
                labels: result.raw_data.result.response.third_graph.label,
                datasets: [{
                    label: '# of reservation',
                    stack: 'Stack 0',
                    backgroundColor: 'orange',
                    yAxisID: 'y-axis-1',
                    data: result.raw_data.result.response.third_graph.data2
                },{
                    label: 'Revenue',
                    stack: 'Stack 1',
                    yAxisID: 'y-axis-2',
                    backgroundColor: 'green',
                    data: result.raw_data.result.response.third_graph.data
                },{
                    label: 'Average',
                    stack: 'Stack 2',
                    yAxisID: 'y-axis-2',
                    backgroundColor: 'blue',
                    data: result.raw_data.result.response.third_graph.data3
                }]
            }
            thirdReportChart.data("ChartJs", thirdConfig);
            var third_ctx = thirdReportChart[0].getContext("2d");
            third_chart_object = new Chart(third_ctx, thirdConfig);
            third_chart_object.update();

            // peripherals
            $('#total_rupiah').html(result.raw_data.result.response.total_rupiah);
            $('#average_rupiah').html(result.raw_data.result.response.average_rupiah);

            // overview section
            contents = overview_overall(result.raw_data.result.response.first_overview);
            $('#first_overview_content').html(contents);

            // second overview secction
            second_contents = overview_book_issued(result.raw_data.result.response.second_overview);
            $('#second_overview_content').html(second_contents);

            // enabled button
             $('#update_chart_button').prop('disabled', false);

            // process complete!
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

// handler for overview data
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_overall(data){
    // declare return variable
    var content = ``;

    // first section of overview
    content += `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Provider</th>
                            <th># of issued</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    // iterate every data
    for (i in data){
        content += `
            <tr>
                <td>`+ data[i]['provider'] +`</td>
                <td>`+ data[i]['counter'] +`</td>
            </tr>
        `;
    }

    // close the html tag
    content += `
                    </tbody>
                </table>
    `;

    // return content
    return content
}

// handler for overview data
// input is object that has been trim to the exact object needed to print
// in book issued case means
// return.raw_data.result.response.second_overview
// second because book issued will always be in tab 2
// will also  be use to name the section(s)
function overview_book_issued(data){
    // declare a return variable
    var content = ``;

    // first section of overview
    content += `
        <table class="table">
            <thead>
                <tr>
                    <th>Provider</th>
                    <th># reservation</th>
                    <th>book</th>
                    <th>issued</th>
                    <th>expired</th>
                </tr>
            </thead>
            <tbody>
    `;

    // iterate every data
    for (i in data){
        content += `
            <tr>
                <td>`+ data[i]['provider'] +`</td>
                <td>`+ data[i]['counter'] +`</td>
                <td>`+ data[i]['booked'] +`</td>
                <td>`+ data[i]['issued'] +`</td>
            </tr>
        `;
    }

    // return result
    return content;
}