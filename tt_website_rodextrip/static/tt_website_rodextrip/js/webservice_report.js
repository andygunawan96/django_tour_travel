date_day = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
}
$(document).ready(function(){
    result_data = [];
    var now = moment().format('dddd DD');
    $('#date_report').daterangepicker({
        "showDropdowns": true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'This Week': [moment().subtract(date_day[now.split(' ')[0]], 'days'), moment()],
            'Last Week': [moment().subtract(date_day[now.split(' ')[0]]+7, 'days'), moment().subtract(date_day[now.split(' ')[0]]+1, 'days')],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        },
        "alwaysShowCalendars": true,
        "startDate": moment().startOf('month'),
        "endDate": moment().endOf('month'),
        "maxDate": moment().endOf('month'),
        "opens": "center",
        locale: {
            format: 'DD MMM YYYY',
        }
    }, function(start, end, label) {
        $('#get_report_startdate').val(start.format('YYYY-MM-DD'));
        $('#get_report_enddate').val(end.format('YYYY-MM-DD'));
    });

    $('#provider_type').change(function(e){
        var value_provider_type = $( "#provider_type option:selected" ).text();
        filter_provider(result_data, value_provider_type);
    });

    $('#agent_type').change(function(e){
        var value_agent_type = $( "#agent_type option:selected" ).attr('label');
        filter_agent(result_data, value_agent_type);
    });
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
            'type': "overall",
            'start_date': moment().startOf('month').format('YYYY-MM-DD'),
            'end_date': moment().endOf('month').format('YYYY-MM-DD'),
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
                $('#profit_agent').html(number_format(result.raw_data.result.response.profit_agent, 2));
                $('#profit_agent_card').show();
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

            if(result.raw_data.result.response.dependencies.is_ho != 1){
                third_contents = overview_customer(result.raw_data.result.response.third_overview);
                $('#third_overview_content').html(third_contents);
            } else {
                third_contents = overview_chanel(result.raw_data.result.response.third_overview);
                $('#third_overview_content').html(third_contents);
            }

            /////////////////////////////////
            // handler of dynamic session
            /////////////////////////////////

            result_data = result;

            var value_type = $('#provider_type').children(':selected').attr('value');

            //provider type data
            var provider_type_datalist = ``;
            result.raw_data.result.response.dependencies.provider_type.forEach(function(item, index){
                provider_type_datalist += `<option value="overall_`+ item +`">`+ item +`</option>`
            });

            //provider data
            if(value_type == 'overall'){
                var provider_datalist = ``;
                result.raw_data.result.response.dependencies.provider.forEach(function(item){
                    if(item['code'] == ""){
                        provider_datalist += `<option value="`+ item['code'] +`">`+ item['name'] +`</option>`
                    }
                });
            }

            // agent type
            var agent_type_datalist = ``;
            result.raw_data.result.response.dependencies.agent_type.forEach(function(item){
                agent_type_datalist += `<option value="`+ item['code'] +`" label="`+ item['id'] +`">`+ item['name'] +`</option>`;
            });

            // proceed with agent data
            var agent_datalist = ``;
            result.raw_data.result.response.dependencies.agent_list.forEach(function(item){
                if(item['seq_id'] == ""){
                    agent_datalist += `<option value="`+ item['seq_id'] +`">`+ item['name'] +`</option>`;
                }
            });

            $('#loading-report').hide();

            // for debugging purposes
//            console.log(agent_datalist);
//            console.log(agent_type_datalist);
//            console.log(provider_datalist);
//            console.log(agent_datalist);

            // after document ready then show the input field and all
            $(document).ready(function(){
                //destroy niceselect

                $('#provider').niceSelect('destroy');
                $('#agent').niceSelect('destroy');
                // populating provider type
                $('#provider_type').append(provider_type_datalist);

                // populating provider selector
                $('#provider').append(provider_datalist);
                $('#provider').select2();
                // change agent selector to text and dropdown (user can type the name of provider)
                // populating agent type selector
                // agent list will be empty list if agent is not HO
                $('#agent_type').append(agent_type_datalist);

                // populating agent selector
                // agent list will be empty list if agent is not HO
                $('#agent').append(agent_datalist);
                // change agent selector to text and dropdown (user can type the name of the agent)
                $('#agent').select2();

                $('#provider_type').niceSelect('update');
                $('#agent_type').niceSelect('update');
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
    $('#loading-report').show();
    $('.report_button').prop('disabled', true);
    $('html, body').animate({
        scrollTop: $("#loading-report").offset().top - 25
    }, 500);

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
                $('#profit_agent').html(number_format(result.raw_data.result.response.profit_agent, 2));
                $('#profit_agent_card').show();
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

            if(contents != ''){
                $('#first_overview_content').html(contents);
                $('#div_overview_first').show();
            }else{
                $('#div_overview_first').hide();
            }

            // second overview secction
            second_contents = overview_book_issued(result.raw_data.result.response.second_overview);
            if(div_overview_second != ''){
                $('#second_overview_content').html(second_contents);
                $('#div_overview_second').show();
            }else{
                $('#div_overview_second').hide();
            }

            if(result.raw_data.result.response.dependencies.is_ho != 1){
                third_contents = overview_customer(result.raw_data.result.response.third_overview);
                $('#third_overview_content').html(third_contents);
            } else {
                third_contents = overview_chanel(result.raw_data.result.response.third_overview);
                $('#third_overview_content').html(third_contents);
            }

            // enabled button
             $('#update_chart_button').prop('disabled', false);
             $('#loading-report').hide();

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
    var total = 0;

    // first section of overview
    content += `
    <div class="mb-3" style="overflow:auto;">
        <table class="table">
            <thead>
                <tr>
                    <th style="width:50%;">Provider</th>
                    <th style="width:50%;"># of Issued</th>
                </tr>
            </thead>
            <tbody>
    `;

    // iterate every data
    for (i in data){
        total += data[i]['counter']
        content += `
            <tr>
                <td>`+ data[i]['provider'] +`</td>
                <td>`+ data[i]['counter'] +`</td>
            </tr>
        `;
    }

    // close the html tag
    content += `
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>`+ total +`</strong></td>
            </tr>
                    </tbody>
                </table>
            </div>
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
        <h3 class="mb-2"><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Sector Summary</h3>
        <div class="mb-3" style="overflow:auto;">
        <table class="table" style="border:1px solid #cdcdcd;">
            <thead>
                <tr>
                    <th>Sector</th>
                    <th># of Trans.</th>
                    <th>One way</th>
                    <th>Return</th>
                    <th>Multi City</th>
                    <th>Revenue</th>
                    <th>Passengers</th>
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
        </div>
    `;


    // Domestic table
    content += `
    <h3 class="mb-2"><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Top Domestic Route</h3>
        <div class="mb-3" style="overflow:auto;">
        <table class="table" style="border:1px solid #cdcdcd;">
            <thead>
                <tr>
                    <th>Departure</th>
                    <th>Destination</th>
                    <th>Counter</th>
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
        </div>
    `;

    // International table
    content += `
        <h3 class="mb-2"><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Top International Route</h3>
        <div class="mb-3" style="overflow:auto;">
        <table class="table" style="border:1px solid #cdcdcd;">
            <thead>
                <tr>
                    <th>Departure</th>
                    <th>Destination</th>
                    <th># of Transactions</th>
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
        </div>
    `;

    // depart issued section
    content += `
        <h3 class="mb-2"><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Issued to Depart(International)</h3>
        <div class="mb-3" style="overflow:auto;">
        <table class="table" style="border:1px solid #cdcdcd;">
            <thead>
                <tr>
                    <th># of days</th>
                    <th>counter</th>
                    <th>passenger</th>
                </tr>
            </thead>
            <tbody>
    `;

    // populate depart issued table
    for (i in data['international_issued_depart']){
        content += `
            <tr>
                <td>`+ data['international_issued_depart'][i]['day'] +`</td>
                <td>`+ data['international_issued_depart'][i]['counter'] +`</td>
                <td>`+ data['international_issued_depart'][i]['passenger'] +`</td>
            </tr>
        `;
    }

    // end of depart issued table
    content += `
            </tbody>
        </table>
        </div>
    `;

    content += `
        <h3 class="mb-2"><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Issued to Depart (Domestic)</h3>
        <div class="mb-3" style="overflow:auto;">
        <table class="table" style="border:1px solid #cdcdcd;">
            <thead>
                <tr>
                    <th># of days</th>
                    <th>counter</th>
                    <th>passenger</th>
                </tr>
            </thead>
            <tbody>
    `;

    // populate depart issued table
    for (i in data['domestic_issued_depart']){
        content += `
            <tr>
                <td>`+ data['domestic_issued_depart'][i]['day'] +`</td>
                <td>`+ data['domestic_issued_depart'][i]['counter'] +`</td>
                <td>`+ data['domestic_issued_depart'][i]['passenger'] +`</td>
            </tr>
        `;
    }

    // end of depart issued table
    content += `
            </tbody>
        </table>
        </div>
    `;

    // graph of departure and destination
    content += `
        <div class="row">
            <div class="col-md-6">
                <h4>Depart From</h4>
                <canvas id="departure_graph" class="canvas_half"></canvas>
            </div>
            <div class="col-md-6">
                <h4>Destination</h4>
                <canvas id="destination_graph" class="canvas_half"></canvas>
            </div>
        </div>
        <br/>
        <h3><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Top Airline</h3>
            <hr/>
    `;

    // top 9 carrier and others summary
    for (i in data['carrier']){
        content += `
            <div class="header" style="border:1px solid #cdcdcd; padding:15px;">
                <div class="row">
                    <div class="col-lg-10">
                        <h5 style="color:`+text_color+`; background:`+color+`; padding:5px; width:fit-content; width: -moz-fit-content;">`+ data['carrier'][i]['carrier_name'] +`</h5>
                        <div class="row">
                            <div class="col-md-3 col-sm-6">
                                <span style="font-weight:600;"># of Reservation</span>
                                <span style="float:right; color:`+color+`;">`+ data['carrier'][i]['counter'] +`</span>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <span style="font-weight:600;">Revenue</span>
                                <span style="float:right; color:`+color+`;">IDR `+ number_format(data['carrier'][i]['revenue'],2) +`</span>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <span style="font-weight:600;">Passenger</span>
                                <span style="float:right; color:`+color+`;">`+ data['carrier'][i]['passenger'] +` <i class="fa fa-user" aria-hidden="true"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <span id="report_airline`+i+`" onclick="report_dropdown_id('airline',`+i+`);" style="font-weight:700; color:`+color+`; cursor:pointer;" class="center_vh"> See Detail <i class="fas fa-chevron-down"></i></span>
                    </div>
                </div>
            </div>
            <div class="content mb-3" id="div_report_airline`+i+`" style="border-color: #cdcdcd; border-style: solid; border-width: 0px 1px 1px 1px; display:none; overflow:auto;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Departure</th>
                            <th>Destination</th>
                            <th># of Reservation</th>
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
            <br/>
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
    <div class="mb-3" style="overflow:auto;">
        <table class="table">
            <thead>
                <tr>
                    <th>Destination</th>
                    <th># of Transaction</th>
                    <th># of Passengers</th>
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
    </div>
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
        <h3><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Issued Check in</h3>
        <hr>
        <table class="table">
            <thead>
                <tr>
                    <td># of days</td>
                    <td># of reservation</td>
                    <td>Passenger</td>
                </tr>
            </thead>
            <tbody>
    `;

    for(i in data['issued_depart']){
        content += `
            <tr>
                <td>`+ data['issued_depart'][i]['day'] +`</td>
                <td>`+ data['issued_depart'][i]['counter'] +`</td>
                <td>`+ data['issued_depart'][i]['passenger'] +`</td>
            </tr>
        `;
    }

    // end of depart checkin table
    content += `
            </tbody>
        </table>
    `;

    // top cities result
    content += `
        <h3><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Top Cities</h3>
        <hr>
    `;

    for (i in data['location']){
        content += `
            <div class="header" style="border:1px solid #cdcdcd; padding:15px;">
                <div class="row">
                    <div class="col-lg-10">
                        <h5 style="color:`+text_color+`; background:`+color+`; padding:5px; width:fit-content; width: -moz-fit-content;">`+ data['location'][i]['city'];
                        if(data['location'][i]['country'] != ''){
                            content += ` - `+ data['location'][i]['country'];
                        }
                        content += `
                        </h5>
                        <div class="row">
                            <div class="col-md-3 col-sm-6">
                                <span style="font-weight:600;"># of Reservation</span>
                                <span style="float:right; color:`+color+`;">`+ data['location'][i]['counter'] +`</span>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <span style="font-weight:600;">Revenue</span>
                                <span style="float:right; color:`+color+`;">IDR `+ data['location'][i]['revenue'] +`</span>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <span style="font-weight:600;">Passenger</span>
                                <span style="float:right; color:`+color+`;">`+ data['location'][i]['passenger'] +` <i class="fa fa-user" aria-hidden="true"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <span id="report_airline`+i+`" onclick="report_dropdown_id('airline',`+i+`);" style="font-weight:700; color:`+color+`; cursor:pointer;" class="center_vh"> See Detail <i class="fas fa-chevron-down"></i></span>
                    </div>
                </div>
            </div>
            <div class="content mb-3" id="div_report_airline`+i+`" style="border-color: #cdcdcd; border-style: solid; border-width: 0px 1px 1px 1px; display:none; overflow:auto;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Hotel Name</th>
                            <th># of Reservation</th>
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
            <br/>
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
        <h3><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Sector Summary</h3>
        <div class="mb-3" style="overflow:auto;">
        <table class="table">
            <thead>
                <tr>
                    <th>Sector</th>
                    <th># of Trans.</th>
                    <th>One way</th>
                    <th>Return</th>
                    <th>Multi City</th>
                    <th>Revenue</th>
                    <th>Passengers</th>
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
        </div>
    `;

    // first table
    content += `
    <h3 class="mb-2"><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Top Domestic Route</h3>
        <div class="mb-3" style="overflow:auto;">
        <table class="table">
            <thead>
                <tr>
                    <th>Departure</th>
                    <th>Destination</th>
                    <th># of Transactions</th>
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
        </div>
    `;

    // issued depart report
    content += `
        <h3 class="mb-2"><i class="fas fa-chevron-circle-right" style="color:`+color+`;"></i> Issued Depart</h3>
        <hr>
        <table class="table">
            <thead>
                <tr>
                    <th># of days</th>
                    <th># of reservation</th>
                    <th>passenger</th>
                </tr>
            </thead>
            <tbody>
    `;

    for(i in data['issued_depart']){
        content += `
            <tr>
                <td>`+ data['issued_depart'][i]['day'] +`</td>
                <td>`+ data['issued_depart'][i]['counter'] +`</td>
                <td>`+ data['issued_depart'][i]['passenger'] +`</td>
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
        <div class="mb-3" style="overflow:auto;">
        <table class="table">
            <thead>
                <tr>
                    <th>Country</th>
                    <th># of Transaction</th>
                    <th># of Passenger</th>
                </tr>
            </thead>
            <tbody>
    `;
    // content
    for(i in data){
        content += `
            <tr>
                <td>`+ data[i]['country'] +`</td>
                <td>`+ data[i]['counter'] +`</td>
                <td>`+ data[i]['passenger'] +`</td>
            </tr>
        `;
    }

    // close table
    content += `
            </tbody>
        </table>
        </div>
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
        <div class="mb-3" style="overflow:auto;">
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
        </div>
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
        <div class="mb-3" style="overflow:auto;">
        <table class="table">
            <thead>
                <tr>
                    <th>Provider</th>
                    <th># Reservation</th>
                    <th>Book</th>
                    <th>Issued</th>
                    <th>Expired</th>
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
    content += `
            </tbody>
        </table>
    </div>
    `;

    // return result
    return content;
}

// handler for overview data
// input is object that has been trim to the exact object needed to print
// in chanel/cutomer rank for HO, and later on for agent
// return.raw_data.result.response.second_overview
// second because book issued will always be in tab 2
// will also  be use to name the section(s)
function overview_chanel(data){
    // start of table
    var content = `
        <div class="mb-3" style="overflow:auto;">
        <table class="table">
            <thead>
                <tr>
                    <th>Agent</th>
                    <th># Reservation</th>
                    <th>Revenue</th>
                    <th>Profit</th>
                </tr>
            </thead>
            <tbody>
    `;

    for(i in data){
        content += `
            <tr>
                <td>`+ data[i]['agent_name'] +`</td>
                <td>`+ data[i]['reservation'] +`</td>
                <td>`+ number_format(data[i]['revenue'], 2) +`</td>
                <td>`+ number_format(data[i]['profit'], 2) +`</td>
            </tr>
        `;
    }

    // end of the table
    content += `
            </tbody>
        </table>
    `;

    return content
}

function overview_customer(data){
    // start of table
    var content = `
        <div class="mb-3" style="overflow:auto;">
        <table class="table">
            <thead>
                <tr>
                    <th>Agent</th>
                    <th># Reservation</th>
                    <th>Revenue</th>
                    <th>Profit</th>
                </tr>
            </thead>
            <tbody>
    `;

    for(i in data){
        content += `
            <tr>
                <td>`+ data[i]['customer_name'] +`</td>
                <td>`+ data[i]['reservation'] +`</td>
                <td>`+ number_format(data[i]['revenue'], 2) +`</td>
                <td>`+ number_format(data[i]['profit'], 2) +`</td>
            </tr>
        `;
    }

    // end of the table
    content += `
            </tbody>
        </table>
    `;

    return content
}

function filter_provider(result, provider_type_text){
    document.getElementById('provider').innerHTML = '';

    var provider_datalist = ``;
    provider_datalist += `<option value="" selected>All Provider</option>`;

    result.raw_data.result.response.dependencies.provider.forEach(function(item){
        var prov_type = item['provider_type'].toLowerCase();
        if(prov_type == provider_type_text){
            provider_datalist += `<option value="`+ item['code'] +`">`+ item['name'] +`</option>`;
        }
    });

    $('#provider').append(provider_datalist);
    $('#provider').select2();
}

function filter_agent(result, agent_type_label){
    document.getElementById('agent').innerHTML = '';

    var agent_datalist = ``;
    agent_datalist += `<option value="" selected>All Agent</option>`;
    result.raw_data.result.response.dependencies.agent_list.forEach(function(item){
        var agent_type = parseInt(agent_type_label);
        if(item['agent_type_id'] == agent_type){
            agent_datalist += `<option value="`+ item['seq_id'] +`">`+ item['name'] +`</option>`;
        }
    });

    $('#agent').append(agent_datalist);
    $('#agent').select2();
}

function report_dropdown_id(type,id){
    var report_show = document.getElementById('report_'+type+id);
    var report_div = document.getElementById('div_report_'+type+id);

    if (report_div.style.display === "none") {
        report_show.innerHTML = ` Hide Detail <i class="fas fa-chevron-up"></i>`;
        report_div.style.display = "block";
    }
    else {
        report_show.innerHTML = ` See Detail <i class="fas fa-chevron-down"></i>`;
        report_div.style.display = "none";
    }
}