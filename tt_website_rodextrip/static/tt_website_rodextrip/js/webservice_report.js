$('#timeframe').change(function(e){
    // get selected value
    var value = $(this).children(':selected').attr('value');
    // declare todays date object
    var d = new Date();
    $('#date_field').hide();
    if (value == '0'){
        $('#get_report_startdate').val(d.toISOString().split('T')[0]);
        $('#get_report_enddate').val(d.toISOString().split('T')[0]);
    } else if (value == '1'){
        d.setDate(d.getDate() - 1);
        $('#get_report_enddate').val(d.toISOString().split('T')[0]);
        $('#get_report_startdate').val(d.toISOString().split('T')[0]);
    } else if (value == '7'){
        $('#get_report_enddate').val(d.toISOString().split('T')[0]);
        var date_diff = d.getDay() - 1;
        if (date_diff < 0){
            d.setDate(d.getDate() - 7);
            $('#get_report_startdate').val(d.toISOString().split('T')[0]);
        } else {
            d.setDate(d.getDate() - date_diff);
            $('#get_report_startdate').val(d.toISOString().split('T')[0]);
        }
    } else if (value == '30'){
        $('#get_report_enddate').val(d.toISOString().split('T')[0]);
        var date_diff = d.getDate() - 1;
        if (date_diff < 1){
            $('#get_report_startdate').val(d.toISOString().split('T')[0]);
        } else {
            d.setDate(d.getDate() - date_diff);
            $('#get_report_startdate').val(d.toISOString().split('T')[0]);
        }
    } else if (value == '-30'){
        // subtract date to last day of previous month
        var date_diff = d.getDate();
        d.setDate(d.getDate() - date_diff);
        // get how many date within particular month
        date_diff = d.getDate() - 1;
        // set end date to last day of the month
        $('#get_report_enddate').val(d.toISOString().split('T')[0]);
        // set date to the first date of the month
        d.setDate(d.getDate() - date_diff);
        $('#get_report_startdate').val(d.toISOString().split('T')[0]);
    } else if (value == 'default'){
        $('#get_report_enddate').val(d.toISOString().split('T')[0]);
        d.setDate(d.getDate() - 30);
        $('#get_report_startdate').val(d.toISOString().split('T')[0]);
    } else {
        $('#date_field').show();
    }
});

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
    getToken();
    $.ajax({
        type: 'POST',
        url: '/webservice/report',
        headers: {
            'action': "get_report_alles",
        },
        data: {
            'signature': signature,
            'provider_type': "overall",
            'provider': '',
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
                    },{
                        label: 'Profit',
                        stack: 'Stack 3',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'red',
                        data: result.raw_data.result.response.first_graph.data4
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
                    },{
                        label: 'Profit',
                        stack: 'Stack 3',
                        yAxisID: 'y-axis-2',
                        backgroundColor: 'red',
                        data: result.raw_data.result.response.third_graph.data4
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
            $('#total_rupiah').html(number_format(result.raw_data.result.response.total_rupiah, 2));
            $('#average_rupiah').html(number_format(result.raw_data.result.response.average_rupiah, 2));
            if(result.raw_data.result.response.dependencies.is_ho == 1){
                $('#profit_rupiah').html(number_format(result.raw_data.result.response.profit_total, 2));
                $('#profit_ho').html(number_format(result.raw_data.result.response.profit_ho, 2));
                $('#profit_ho_card').show();
            } else {
                $('#profit_rupiah').html(number_format(result.raw_data.result.response.profit_total, 2));
            }

            // overview section
            contents = overview_overall(result.raw_data.result.response.first_overview);
            $('#first_overview_content').html(contents);

            // second overview secction
            second_contents = overview_book_issued(result.raw_data.result.response.second_overview);
            $('#second_overview_content').html(second_contents);

            /////////////////////////////////
            // handler of dynamic session
            /////////////////////////////////

            //provider type data
            var provider_type_datalist = ``;
            result.raw_data.result.response.dependencies.provider_type.forEach(function(item, index){
                provider_type_datalist += `<option value="overall_`+ item +`">`+ item +`</option>`
            });

            //provider data
            var provider_datalist = ``;
            result.raw_data.result.response.dependencies.provider.forEach(function(item){
                provider_datalist += `<option value="`+ item['code'] +`">`+ item['name'] +`</option>`
            });

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
//            console.log(agent_datalist);

            // after document ready then show the input field and all
            $(document).ready(function(){
                //destroy niceselect
                $('#provider_type').niceSelect('destroy');
                $('#provider').niceSelect('destroy');
                $('#agent_type').niceSelect('destroy');
                $('#agent').niceSelect('destroy');
                $('#group_by').niceSelect('destroy');
                // populating provider type
                $('#provider_type').append(provider_type_datalist);

                // populating provider selector
                $('#provider').append(provider_datalist);
                // change agent selector to text and dropdown (user can type the name of provider)
                $('#provider').selectize({
                      sortField: 'text'
                  });

                // populating agent type selector
                // agent list will be empty list if agent is not HO
                $('#agent_type').append(agent_type_datalist);

                // populating agent selector
                // agent list will be empty list if agent is not HO
                $('#agent').append(agent_datalist);
                // change agent selector to text and dropdown (user can type the name of the agent)
                $('#agent').selectize({
                      sortField: 'text'
                  });

                // if agent is HO then shows the agent type and agent selector
                // if not then hide
                if(result.raw_data.result.response.dependencies.is_ho == 1){
                    $('#agent_selector').show();
                }
            });
        },
        error: function(result){
            console.log("Error");
        },timeout: 300000
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

    // get provider type
    var provider_type = $('#provider_type').val();

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
                },{
                    label: 'Profit',
                    stack: 'Stack 3',
                    yAxisID: 'y-axis-2',
                    backgroundColor: 'red',
                    data: result.raw_data.result.response.first_graph.data4
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
                    label: 'Booked',
                    borderColor: 'red',
                    data: result.raw_data.result.response.second_graph.data
                }, {
                    label: 'Issued',
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
                },{
                    label: 'Profit',
                    stack: 'Stack 3',
                    yAxisID: 'y-axis-2',
                    backgroundColor: 'red',
                    data: result.raw_data.result.response.third_graph.data4
                }]
            }
            thirdReportChart.data("ChartJs", thirdConfig);
            var third_ctx = thirdReportChart[0].getContext("2d");
            third_chart_object = new Chart(third_ctx, thirdConfig);
            third_chart_object.update();

            // peripherals
            $('#total_rupiah').html(number_format(result.raw_data.result.response.total_rupiah, 2));
            $('#average_rupiah').html(number_format(result.raw_data.result.response.average_rupiah, 2));
            if(result.raw_data.result.response.dependencies.is_ho == 1){
                $('#profit_rupiah').html(number_format(result.raw_data.result.response.profit_total, 2));
                $('#profit_ho').html(number_format(result.raw_data.result.response.profit_ho, 2));
                $('#profit_ho_card').show();
            } else {
                $('#profit_rupiah').html(number_format(result.raw_data.result.response.profit_total, 2));
            }

            // "First" overview section
            if (provider_type == 'overall'){
                contents = overview_overall(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_airline'){
                contents = overview_airline(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_activity'){
                contents = overview_activity(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_event'){
                contents = overview_event(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_hotel'){
                contents = overview_hotel(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_train'){
                contents = overview_train(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_tour'){
                contents = overview_tour(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_ppob'){
                contents = overview_ppob(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_visa'){
                contents = overview_visa(result.raw_data.result.response.first_overview);
            } else if (provider_type == 'overall_offline'){
                contents = overview_offline(result.raw_data.result.response.first_overview);
            } else {
                contents = ``;
            }
            $('#first_overview_content').html(contents);

            // second overview secction
            second_contents = overview_book_issued(result.raw_data.result.response.second_overview);
            $('#second_overview_content').html(second_contents);

            // enabled button
             $('#update_chart_button').prop('disabled', false);

            if(provider_type == 'overall_airline'){
                overview_airline_chart(result.raw_data.result.response.first_overview);
            }
            // process complete!
        },timeout: 300000
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

// handler for overview data for airline
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_airline(data){
//    console.log(data);
    // declare return
    var content = ``;

    // counter sector and direction summary
    // will split the table into col-6
    content += `
        <h4>Sector Summary</h4>
        <table class="table">
            <thead>
                <tr>
                    <td>Sector</td>
                    <td># of trans.</td>
                    <td>One way</td>
                    <td>Return</td>
                    <td>Multi City</td>
                    <td>Revenue</td>
                    <td>Passengers</td>
                </tr>
            </thead>
            <tbody>
    `;
    // populate sector table
    for(i in data['sector_summary']){
        content += `
            <tr>
                <td>`+ data['sector_summary'][i]['sector'] +`</td>
                <td>`+ data['sector_summary'][i]['counter'] +`</td>
                <td>`+ data['sector_summary'][i]['one_way'] +`</td>
                <td>`+ data['sector_summary'][i]['return'] +`</td>
                <td>`+ data['sector_summary'][i]['multi_city'] +`</td>
                <td>IDR `+ number_format(data['sector_summary'][i]['valuation']) +`</td>
                <td>`+ data['sector_summary'][i]['passenger_count'] +`</td>
            </tr>
        `;
    }

    content += `
            </tbody>
        </table>
    `;


    // Domestic table
    content += `
    <h3>Top Domestic Route</h3>
        <table class="table">
            <thead>
                <tr>
                    <td>Departure</td>
                    <td>Destination</td>
                    <td>Counter</td>
                </tr>
            </thead>
            <tbody>
    `;
    // Domestic table data
    for (i in data['domestic']){
        content += `
            <tr>
                <td>`+ data['domestic'][i]['departure'] +`</td>
                <td>`+ data['domestic'][i]['destination'] +`</td>
                <td>`+ data['domestic'][i]['counter'] +`</td>
            </tr>
        `;
    }
    // close first table
    content += `
            </tbody>
        </table>
    `;

    // International table
    content += `
        <h3>Top International Route</h3>
        <table class="table">
            <thead>
                <tr>
                    <td>Departure</td>
                    <td>Destination</td>
                    <td># of transactions</td>
                </tr>
            </thead>
            <tbody>
    `;
    // International table data
    for (i in data['international']){
        content += `
            <tr>
                <td>`+ data['international'][i]['departure'] +`</td>
                <td>`+ data['international'][i]['destination'] +`</td>
                <td>`+ data['international'][i]['counter'] +`</td>
            </tr>
        `;
    }
    // close International table
    content += `
            </tbody>
        </table>
        <h3>Top Airline</h3>
            <hr>
    `;

    // graph of departure and destination
    content += `
        <div class="row">
            <div class="col-md-6">
                <h4>Depart From</h4>
                <canvas id="departure_graph"></canvas>
            </div>
            <div class="col-md-6">
                <h4>Destination</h4>
                <canvas id="destination_graph"></canvas>
            </div>
        </div>
        <hr>
    `;

    // top 9 carrier and others summary
    for (i in data['carrier']){
        content += `
            <div class="header">
                <div class="row">
                    <div class="col-md-3 col-sm-6">
                        <h5>`+ data['carrier'][i]['carrier_name'] +`</h5>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        # of reservation
                        <p style="float:right">`+ data['carrier'][i]['counter'] +`</p>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        Revenue
                        <p style="float:right">IDR `+ number_format(data['carrier'][i]['revenue'],2) +`</p>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        Passenger
                        <p style="float:right">`+ data['carrier'][i]['passenger'] +` <i class="fa fa-user" aria-hidden="true"></i></p>
                    </div>
                </div>
            </div>
            <div class="content">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Departure</th>
                            <th>Destination</th>
                            <th># of reservation</th>
                            <th>Passengers</th>
                        </tr>
                    <thead>
                    <tbody>
        `;
        for (j in data['carrier'][i]['route']){
            content += `
                <tr>
                    <td>`+ data['carrier'][i]['route'][j]['departure'] +`</td>
                    <td>`+ data['carrier'][i]['route'][j]['destination'] +`</td>
                    <td>`+ data['carrier'][i]['route'][j]['counter'] +`</td>
                    <td>`+ data['carrier'][i]['route'][j]['passenger'] + ` <i class="fa fa-user" aria-hidden="true"></i></td>
                </tr>
            `;
        }

        content += `
                    </tbody>
                </table>
            </div>
            <hr>
        `;
    }

    return content
}

// create chart for overview_ariline
function overview_airline_chart(data){
console.log(data);
    var departure = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: data['departure_graph']['data'],
                backgroundColor: [
                    'blue',
                    'orange',
                    'yellow',
                    'green',
                    'red',
                    'blue',
                    'orange',
                    'yellow',
                    'green',
                    'red',
                    'blue',
                    'orange',
                    'yellow',
                    'green',
                    'red',
                    'blue',
                    'orange',
                    'yellow',
                    'green',
                    'red',
                ],
                label: 'Departure Cities'
            }],
            labels: data['departure_graph']['label']
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: ''
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    var ctx = document.getElementById('departure_graph').getContext('2d');
	departure_Doughnut = new Chart(ctx, departure);

	var destination = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: data['destination_graph']['data'],
                backgroundColor: [
                    'orange',
                    'yellow',
                    'green',
                    'blue',
                    'purple',
                    'red',
                    'orange',
                    'yellow',
                    'green',
                    'blue',
                    'purple',
                    'red',
                    'orange',
                    'yellow',
                    'green',
                    'blue',
                    'purple',
                    'red',
                    'orange',
                    'yellow',
                    'green',
                    'blue',
                    'purple',
                    'red',
                ],
                label: 'Destination Cities'
            }],
            labels: data['destination_graph']['label']
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: ''
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    var second_ctx = document.getElementById('destination_graph').getContext('2d');
	destination_Doughnut = new Chart(second_ctx, destination);
}

// handler for overview data for activity
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_activity(data){
    var content = ``;

    // first table
    content += `
        <table class="table">
            <thead>
                <tr>
                    <td>Destination</td>
                    <td># of Transaction</td>
                    <td># of Passengers</td>
                </tr>
            </thead>
            <tbody>
    `;
    // loop the data
    for(i in data){
        content += `
            <tr>
                <td>`+ data[i]['product'] +`</td>
                <td>`+ data[i]['counter'] +`</td>
                <td>`+ data[i]['passenger'] +`</td>
            </tr>
        `;
    }
    // close of table
    content += `
            </tbody>
        </table>
    `;

    return content;
}

// handler for overview data for event
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_event(data){
    var content = ``;

    return content;
}

// handler for overview data for hotel
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_hotel(data){
    var content = `
        <h3>Top Cities</h3>
        <hr>
    `;

    for (i in data['location']){
        content += `
            <div class="header">
                <h5>`+ data['location'][i]['city'] +` - `+ data['location'][i]['country'] +`</h5>
                <p style="float:right">`+ data['location'][i]['counter'] +`</p>
            </div>
            <div class="content">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Hotel Name</th>
                            <th># of reservation</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        for (j in data['location'][i]['hotel']){
            content += `
                <tr>
                    <td>`+ data['location'][i]['hotel'][j]['name'] +`</td>
                    <td>`+ data['location'][i]['hotel'][j]['counter'] +`</td>
                </tr>
            `;
        }
        content += `
                    </tbody>
                </table>
            </div>
        `;
    }

    return content;
}

// handler for overview data for ppob
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_ppob(data){
    var content = ``;

    return content;
}

// handler for overview data for train
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_train(data){
    var content = ``;

    // counter sector and direction summary
    // will split the table into col-6
    content += `
        <h4>Sector Summary</h4>
        <table class="table">
            <thead>
                <tr>
                    <td>Sector</td>
                    <td># of trans.</td>
                    <td>One way</td>
                    <td>Return</td>
                    <td>Multi City</td>
                    <td>Revenue</td>
                    <td>Passengers</td>
                </tr>
            </thead>
            <tbody>
    `;
    // populate sector table
    for(i in data['sector_summary']){
        content += `
            <tr>
                <td>`+ data['sector_summary'][i]['sector'] +`</td>
                <td>`+ data['sector_summary'][i]['counter'] +`</td>
                <td>`+ data['sector_summary'][i]['one_way'] +`</td>
                <td>`+ data['sector_summary'][i]['return'] +`</td>
                <td>`+ data['sector_summary'][i]['multi_city'] +`</td>
                <td>IDR `+ number_format(data['sector_summary'][i]['valuation']) +`</td>
                <td>`+ data['sector_summary'][i]['passenger_count'] +`</td>
            </tr>
        `;
    }

    content += `
            </tbody>
        </table>
    `;

    // first table
    content += `
    <h3>Top Domestic Route</h3>
        <table class="table">
            <thead>
                <tr>
                    <td>Departure</td>
                    <td>Destination</td>
                    <td># of transactions</td>
                </tr>
            </thead>
            <tbody>
    `;

    // first table data
    for (i in data['domestic']){
        content += `
            <tr>
                <td>`+ data['domestic'][i]['departure'] +`</td>
                <td>`+ data['domestic'][i]['destination'] +`</td>
                <td>`+ data['domestic'][i]['counter'] +`</td>
            </tr>
        `;
    }
    // close first table
    content += `
            </tbody>
        </table>
    `;

    return content;
}

// handler for overview data for tour
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_tour(data){
    var content = ``;

    return content;
}

// handler for overview data for visa
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_visa(data){
    var content = ``;
    // table
    content += `
        <table class="table">
            <thead>
                <tr>
                    <th>Country</th>
                    <th># of transaction</th>
                    <th># of passenger</th>
                </tr>
            </thead>
            <tbody>
    `;
    // content
    for(i in data){
        content += `
            <tr>
                <td>`+ data[i]['product'] +`</td>
                <td>`+ data[i]['counter'] +`</td>
                <td>`+ data[i]['passenger'] +`</td>
            </tr>
        `;
    }

    // close table
    content += `
            </tbody>
        </table>
    `;
    return content;
}

// handler for overview data for offline
// input is object that has been trim to the exact object needed to print
// in overall case means
// return.raw_data.result.response.first_overview
// why first, this will be the default page (hence first section)
// will also  be use to name the section(s)
function overview_offline(data){
    var content = ``;

    // beginning of table
    content += `
        <table class="table">
            <thead>
                <tr>
                    <th>Provider</th>
                    <th>Counter</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
    `;

    for(i in data){
        content += `
            <tr>
                <td>`+ data[i]['category'] +` - `+ data[i]['provider_type'] +`</td>
                <td>`+ data[i]['counter'] +`</td>
                <td>`+ data[i]['amount'] +`</td>
            </tr>
        `;
    }
    // end of table
    content += `
            </tbody>
        </table>
    `;
    return content;
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
                <td>`+ data[i]['cancel2'] +`</td>
            </tr>
        `;
    }

    // return result
    return content;
}