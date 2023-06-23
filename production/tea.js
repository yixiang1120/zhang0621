// 建立一個新的Date物件
var today = new Date();

var year = today.getFullYear();

var month = today.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;

var date = today.getDate();
date = (date < 10 ? "0" : "") + date;

var fullDate = year + '/' + month + '/' + date;
console.log(fullDate);

var currentHour = today.getHours();
var currentMinute = today.getMinutes();
currentMinute = (currentMinute < 10 ? "0" : "") + currentMinute;

var currentSecond = today.getSeconds();
var formattedTime = currentHour + ":" + currentMinute;


var res_disease;
var res_bug;

let newId_disease = 0;
let newId_bug = 0;

var input_disease = 0;
var input_bug = 0;
var humidity_w = 59;
var temp_w = 15;
var rain_w = 0;

var switch_water = 0;
var switch_fans = 0;
var switch_rain = 0;

var ready = 0;

$(document).ready(function() {
    //判斷病害，並post到json
    $('.btn-disease').click(function() {
        var message = $('textarea[name="message-d"]').val();
        if (message == '') {
            alert('請輸入問題');
            return;
        }
        $('textarea[name="message-d"]').val('');
        input_disease = 1;
        console.log(message);
        let newDiseaseData = {
            "id": newId_disease, 
            "date": fullDate,
            "question": message, 
            "answer": "請稍候..." 
        };
        res_disease.push(newDiseaseData);
        let records = {
            "input": input_disease,
            "disease": res_disease
        };
        console.log(records);

        
        $.ajax({
            url: 'https://vmlabjsonserver.azurewebsites.net/diseasedata', 
            type: 'POST',
            data: JSON.stringify({records: records}),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
        
    });

    //判斷害蟲，並post到json
    $('.btn-bug').click(function() {
        var message = $('textarea[name="message-b"]').val();
        if (message == '') {
            alert('請輸入問題');
            return;
        }
        $('textarea[name="message-b"]').val('');
        input_bug = 1;
        console.log(message);
        let newBugData = {
            "id": newId_bug, 
            "date": fullDate,
            "question": message, 
            "answer": "請稍候..." 
        };
        res_bug.push(newBugData);
        let records = {
            "input": input_bug,
            "bug": res_bug
        };
        console.log(records);

        
        $.ajax({
            url: 'https://vmlabjsonserver.azurewebsites.net/bugdata', 
            type: 'POST',
            data: JSON.stringify({records: records}),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
        
    });



    setInterval(function() {
        //病害
        $.ajax({
            url: 'https://vmlabjsonserver.azurewebsites.net/diseasedata', 
            type: 'GET',
            success: function(response) {
                console.log(response);
                var test = response.records.disease;
                var sortedData = test.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (dateB - dateA === 0) {
                        return b.id - a.id; // 相同日期按照id升序排序
                    }
                    return dateB - dateA; // 日期降序排序               
                });

                res_disease = response.records.disease;
                newId_disease = res_disease.length + 1;
                $('.list-1').empty(); // 清空先前的資料
                sortedData.forEach(function(item){
                    let listItem = 
                        `<li>
                            <div class="block">
                                <div class="block_content">
                                    <h2 class="title">
                                        <a><strong>${item.question}</strong></a>
                                    </h2>
                                    <div class="byline">
                                        <span>${item.date}</span> by <a>Team095</a>
                                    </div>
                                    <p class="excerpt"> 
                                        <a>${item.answer}</a>
                                    </p>
                                </div>
                            </div>
                        </li>`;
                    $('.list-1').append(listItem);
                });
            },
            error: function(error) {
                console.log(error);
            }
        });


        //害蟲
        $.ajax({
            url: 'https://vmlabjsonserver.azurewebsites.net/bugdata', 
            type: 'GET',
            success: function(response) {
                console.log(response);
                var test = response.records.bug;
                var sortedData = test.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    if (dateB - dateA === 0) {
                        return b.id - a.id; // 相同日期按照id升序排序
                    }
                    return dateB - dateA; // 日期降序排序               
                });

                res_bug = response.records.bug;
                newId_bug = res_bug.length + 1;
                $('.list-2').empty(); // 清空先前的資料
                sortedData.forEach(function(item){
                    let listItem = 
                        `<li>
                            <div class="block">
                                <div class="block_content">
                                    <h2 class="title">
                                        <a><strong>${item.question}</strong></a>
                                    </h2>
                                    <div class="byline">
                                        <span>${item.date}</span> by <a>Team095</a>
                                    </div>
                                    <p class="excerpt"> 
                                        <a>${item.answer}</a>
                                    </p>
                                </div>
                            </div>
                        </li>`;
                    $('.list-2').append(listItem);
                });
            },
            error: function(error) {
                console.log(error);
            }
        });

        //氣象
            $.ajax({
                url: 'https://vmlabjsonserver.azurewebsites.net/weatherdata', // 替換為您的 API URL
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    // 解析 API 回應數據
                    var weatherData = response.record.weather[0];
                    var location = response.record.weather[0].area;
                    var date = response.record.weather[0].time;
                    console.log(location + ' ' + date);
                    // 更新計數值
                    $('.count.h_temperature').text(weatherData.h_temperature + "°C");
                    $('.count.a_temperature').text(weatherData.a_temperature + "°C");
                    $('.count.humidity').text(weatherData.humidity + "%");
                    $('.count.rain').text(weatherData.rain + "mm");
                    $('.time-text').text(date + "更新");
                },
                error: function(xhr, status, error) {
                    console.error(error); // 處理錯誤
                },
                
            });
    }, 2000);



    //通知
    $.ajax({
        url: 'https://vmlabjsonserver.azurewebsites.net/notify', // 替換為您的 API URL
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            var records = response.records;
            records.sort(function(a, b) {
                // 按日期降序排序
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                if (dateA > dateB) {
                    return -1;
                    } else if (dateA < dateB) {
                    return 1;
                    } else {
                    // 如果日期相同，则按ID降序排序
                    if (a.id > b.id) {
                        return -1;
                    } else if (a.id < b.id) {
                        return 1;
                    } else {
                        return 0;
                    }
                    }
                });
            var dropdownMenu = $('.dropdown-menu');
            dropdownMenu.empty();
            var todoList = $('.to_do');
            todoList.empty();

            records.forEach(function(record) {
                var listItem = $('<li class="nav-item"></li>');
                var anchor = $('<a class="dropdown-item"></a>');
                var image = $('<span class="image"><img src="images/img.jpg" alt="Profile Image" /></span>');
                var content = $('<span></span>');
                var name = $('<span></span>').html('<strong>系統通知</strong>');
                var time = $('<span class="time"></span>').text(record.date);
                var message = $('<span class="message"></span>').text(record.question);
                content.append(name, time);
                anchor.append(image, content, message);
                listItem.append(anchor);
                dropdownMenu.append(listItem);

                if(record.answer != '') {
                    var newItem = $('<li></li>');
                    var checkbox = $('<input type="checkbox" class="flat">');
                    var formattedAnswer = record.answer.replace(/(\d+\.)\s/g, "<br>$1 ");
                    var answer = $('<span class="answer"></span>').html(formattedAnswer);

                    newItem.append($('<p></p>').append(checkbox, answer));
                    todoList.append(newItem);
                    newItem.data('record-id', record.id);
                }
            });
        },
        error: function(xhr, status, error) {
            console.log('error:', error);
        }
    });        
    //土壤方法
    $.ajax({
        url: 'https://vmlabjsonserver.azurewebsites.net/soilmethod',
        type: 'GET',
        success: function(response) {
            console.log(response);
            var methodContent = response.method;
            console.log(methodContent);
            $('.x_title.soil-method').html('<h4>建議施肥措施: ' + methodContent + '</h4>');
            var newItem = '<li><p><input type="checkbox" class="flat">' + methodContent + '</p></li>';
            // 将新的列表项添加到相应的位置
            $('.to_do').append(newItem);
            $('.to_do li:last-child').find('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
        });
        
        todoinit();
        },
        error: function(error) {
            console.log(error);
        }
    });
    
    //土壤資訊
    $.ajax({
        url: 'https://vmlabjsonserver.azurewebsites.net/soildata',
        type: 'GET',
        success: function(response) {
            console.log(response);
    
            // 獲取 API 回應中的土壤數據
            var soilData = response.records.soil[0];
    
            // 更新有機質數據 範圍為0至4
            var organicContent = soilData.organicRange[0];
            var organicProgress = (organicContent / 4) * 100; // 計算比例
            $('.widget_summary:eq(0) .progress-bar').css('width', organicProgress + '%');
            $('.widget_summary:eq(0) .progress-bar span').text(organicProgress + '% Complete');
            $('.widget_summary:eq(0) .w_right span').text(organicContent + '%');

            // 更新有效性磷數據 範圍為0至10
            var pContent = soilData.pRange[0];
            var pProgress = (pContent / 10) * 100; // 計算比例
            $('.widget_summary:eq(1) .progress-bar').css('width', pProgress + '%');
            $('.widget_summary:eq(1) .progress-bar span').text(pProgress + '% Complete');
            $('.widget_summary:eq(1) .w_right span').text(pContent + 'ppm');

            // 更新交換性鉀數據 範圍為0至200
            var kContent = soilData.kRange[0];
            var kProgress = (kContent / 200) * 100; // 計算比例
            $('.widget_summary:eq(2) .progress-bar').css('width', kProgress + '%');
            $('.widget_summary:eq(2) .progress-bar span').text(kProgress + '% Complete');
            $('.widget_summary:eq(2) .w_right span').text(kContent + 'ppm');

        },
        error: function(error) {
            console.log(error);
        }
    });

    //天氣
    $.ajax({
        url: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-007',
        method: 'GET',
        data: {
            Authorization: 'CWB-3A297C76-6D21-4A45-9589-498002971EAE',
            locationName: '楊梅區',
            elementName: 'PoP12h,T,RH,Wx'
        },
        success: function(response) {
            //console.log(response);
            var data = response.records.locations[0].location[0].weatherElement;

            var locationsName = response.records.locations[0].locationsName;
            var locationName = response.records.locations[0].location[0].locationName;
            var weatherDescription = data.find(function(element) {
                return element.elementName === 'Wx';
            }).time[0].elementValue[0].value;

            $('#locationsName h2 small').text(locationsName);
            var h2Element = document.getElementById('locationName').querySelector('h2');
            h2Element.innerHTML = locationName + '<br><i>' + weatherDescription + '</i>';
            var w_icon = getWeatherIcon(weatherDescription)
            $('.weather-icon').find('canvas').attr('id', w_icon);

            var startTime = data[0].time[0].startTime;
            var date = new Date(startTime);
            var options = { weekday: 'long', timeZone: 'Asia/Taipei' };
            var dayOfWeek = date.toLocaleDateString('zh-TW', options);
            var formattedDate = date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
            $('.temperature b').text(dayOfWeek);
            $('.temperature').append(formattedDate);

            var temp = data.find(function(element) {
                return element.elementName === 'T';
            }).time[0].elementValue[0].value;
            //console.log(temp);
            $('.today_temp').text(temp + '°C');


            var timeData = data.find(function(element) {
                return element.elementName === 'Wx';
            }).time;
            var rhData = data.find(function(element) {
                return element.elementName === 'RH';
            }).time;
            var TData = data.find(function(element) {
                return element.elementName === 'T';
            }).time;
            var rainfallData = data.find(function(element) {
                return element.elementName === 'PoP12h';
            }).time;
            
            var timeValueArray = [];
            for (var i = 0; i < timeData.length; i++) {
                var startTime = timeData[i].startTime;
                var value = timeData[i].elementValue[0].value;
                var rhValue = rhData[i].elementValue[0].value;
                var tValue = TData[i].elementValue[0].value;
                var rainfallValue = rainfallData[i].elementValue[0].value;
                if (startTime.endsWith("06:00:00")) {
                    timeValueArray.push({
                    time: startTime,
                    value: value,
                    rhValue: rhValue,
                    TData: tValue,
                    rainfallValue: rainfallValue
                    });
                }
            }
            console.log(timeValueArray);


            // 更新每個天氣資訊的元素
            $('.daily-weather').each(function(index) {
                var day = moment(timeValueArray[index].time).format('ddd'); // 取得星期幾的縮寫
                var degrees = timeValueArray[index].tValue;
                var wx = timeValueArray[index].value;
                var humidity = timeValueArray[index].rhValue;
                var weatherIconID = getWeatherIcon(wx, index); // 取得天氣圖示的ID
                var weatherIcon = weatherIconID.split('-')[0]; // 去掉ID后面的数字
                //console.log("icon:" + weatherIcon);
                //console.log(weatherIcon);
                // 更新每個天氣資訊的內容
                $(this).find('.day').text(day);
                $(this).find('.degrees').text(degrees);
                $(this).find('canvas').attr('id', weatherIconID);
                $(this).find('canvas').attr('data-icon', weatherIcon); // 添加自定义属性以便识别天气图标
                $(this).find('h5').text(humidity+ '％');
                init_skycons();
            });
            
            function getWeatherIcon(weatherDescription, index) {
                if (weatherDescription.includes('晴')) {
                    if (weatherDescription.includes('雲')) {
                        return 'partly-cloudy-day-' + index;
                    } else {
                        return 'clear-day-' + index;
                    }
                } else if (weatherDescription.includes('雨')) {
                    return 'rain-' + index;
                } else if (weatherDescription.includes('霧')) {
                    return 'fog-' + index;
                } else if (weatherDescription.includes('雲')) {
                    return 'cloudy-' + index;
                } else if (weatherDescription.includes('雪')) {
                    return 'snow-' + index;
                } else {
                    return 'partly-cloudy-day-' + index;
                }
            }
        },
        error: function(error) {
            console.log('發生錯誤：', error);
        }
    });
    //自動灑水
    $.ajax({
        url: 'https://vmlabjsonserver.azurewebsites.net/switch_water', // 替換為您的 API URL
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            switch_water = response.switch;
            humidity_w  = response.humidity;
            if(switch_water == 1) {
                $('#myonoffswitch').prop('checked', true); // 開啟開關
                var statusText = document.getElementById("statusText");
                statusText.innerHTML = fullDate + " " + formattedTime + " 開啟";
            } else {
                $('#myonoffswitch').prop('checked', false); // 關閉開關
                var statusText = document.getElementById("statusText");
                statusText.textContent = fullDate + " " + formattedTime + " 關閉";
            }
            //.log(switch_water);
        },
        error: function(xhr, status, error) {
            console.error(error); // 處理錯誤
        }
    });

    //防霜扇
    $.ajax({
        url: 'https://vmlabjsonserver.azurewebsites.net/switch_fans', // 替換為您的 API URL
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            switch_fans = response.switch;
            temp_w  = response.temp;
            console.log("tt", temp_w);
            if(switch_fans == 1) {
                $('#myonoffswitch').prop('checked', true); // 開啟開關
                var statusText = document.getElementById("statusText2");
                statusText.innerHTML = fullDate + " " + formattedTime + " 開啟";
            } else {
                $('#myonoffswitch').prop('checked', false); // 關閉開關
                var statusText = document.getElementById("statusText2");
                statusText.textContent = fullDate + " " + formattedTime + " 關閉";
            }
        },
        error: function(xhr, status, error) {
            console.error(error); // 處理錯誤
        }
    });

});


function todoinit() {
    $('input.flat').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    }).on('ifChecked', function () {
        var $input = $(this); // 保存当前输入框的引用
        setTimeout(function () {
            $input.closest('li').fadeOut(500, function () {
                $(this).remove(); // 删除父级列表项
            });
        }, 2000); // 2秒的延迟时间
    });
}



function init_skycons() {

    if (typeof (Skycons) === 'undefined') { return; }
    console.log('init_skycons');

    var icons = new Skycons({
        "color": "#73879C"
    }),
        list = [
            "clear-day", "clear-night", "partly-cloudy-day",
            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            "fog"
        ],
        i;

        var weatherIcons = document.querySelectorAll('canvas[data-icon]');

        for (var i = 0; i < weatherIcons.length; i++) {
            var iconName = weatherIcons[i].getAttribute('data-icon');
            icons.set(weatherIcons[i], iconName);
            console.log(iconName);
        }
    
    icons.play();

}



function init_gauge() {

    if (typeof (Gauge) === 'undefined') { return; }

    console.log('init_gauge [' + $('.gauge-chart').length + ']');

    console.log('init_gauge');


    var chart_gauge_settings = {
        lines: 12,
        angle: 0,
        lineWidth: 0.4,
        pointer: {
            length: 0.75,
            strokeWidth: 0.042,
            color: '#1D212A'
        },
        limitMax: 'false',
        colorStart: '#1ABC9C',
        colorStop: '#1ABC9C',
        strokeColor: '#F0F3F3',
        generateGradient: true
    };


    setTimeout(function() {
        if ($('#chart_gauge_01').length) {
            var chart_gauge_01_elem = document.getElementById('chart_gauge_01');
            var chart_gauge_01 = new Gauge(chart_gauge_01_elem).setOptions(chart_gauge_settings);
        }

        if ($('#gauge-text').length) {
            chart_gauge_01.maxValue = 100;
            chart_gauge_01.animationSpeed = 20;
            chart_gauge_01.set(humidity_w);
            console.log(humidity_w);
            chart_gauge_01.setTextField(document.getElementById("gauge-text"));
            var intervalId = setInterval(function() {
                if (humidity_w < 80 && switch_water == 1) {
                    humidity_w += 1;
                    chart_gauge_01.animationSpeed = 20;
                    chart_gauge_01.set(humidity_w);
                } else {
                    clearInterval(intervalId); 
                }
            }, 20000);   
        }

        if ($('#chart_gauge_02').length) {
            var chart_gauge_02_elem = document.getElementById('chart_gauge_02');
            var chart_gauge_02 = new Gauge(chart_gauge_02_elem).setOptions(chart_gauge_settings);
        }
    
        if ($('#gauge-text2').length) {
            chart_gauge_02.maxValue = 40;
            chart_gauge_02.animationSpeed = 20;
            chart_gauge_02.set(temp_w);
            chart_gauge_02.setTextField(document.getElementById("gauge-text2"));
            var intervalId = setInterval(function() {
                if (temp_w < 19 && switch_fans == 1) {
                    temp_w += 1;
                    chart_gauge_02.animationSpeed = 20;
                    chart_gauge_02.set(temp_w);
                } else {
                    clearInterval(intervalId); 
                }
            }, 30000);   
        }


        if ($('#chart_gauge_03').length) {
            var chart_gauge_03_elem = document.getElementById('chart_gauge_03');
            var chart_gauge_03 = new Gauge(chart_gauge_03_elem).setOptions(chart_gauge_settings);
        }
    
        if ($('#gauge-text3').length) {
            chart_gauge_03.maxValue = 200;
            chart_gauge_03.animationSpeed = 20;
            chart_gauge_03.set(temp_w);
            chart_gauge_03.setTextField(document.getElementById("gauge-text3"));
            var intervalId = setInterval(function() {
                if (temp_w < 19 && switch_fans == 1) {
                    temp_w += 1;
                    chart_gauge_02.animationSpeed = 20;
                    chart_gauge_02.set(temp_w);
                } else {
                    clearInterval(intervalId); 
                }
            }, 30000);   
        }


        if ($('#gauge-text3').length) {
            chart_gauge_03.maxValue = 200;
            chart_gauge_03.animationSpeed = 32;
            chart_gauge_03.set(1);
            chart_gauge_03.setTextField(document.getElementById("gauge-text3"));
            $('#myonoffswitch3').click(function() {
                if(this.checked)
                {
                    setTimeout(function() {
                        chart_gauge_03.animationSpeed = 20000;
                        chart_gauge_03.set(200);
                    }, 4000);
                }
                else{
                    chart_gauge_03.set(parseInt(document.getElementById("gauge-text3").textContent));
                }
            });
        }


    }, 4000); // 等待2000毫秒後開始第二次動畫

    var checkGaugeValue = setInterval(function() {
        var gaugeValue = document.getElementById("gauge-text").textContent;
        humidity_w  = parseInt(gaugeValue);
        if(humidity_w > 79) {
            $('#myonoffswitch').prop('checked', false); // 关闭开关
            switch_water = 0;
            if(switch_water == 1) {
                $('#myonoffswitch').prop('checked', true); // 開啟開關
                var statusText = document.getElementById("statusText");
                statusText.innerHTML = fullDate + " " + formattedTime + " 開啟";
            } else {
                $('#myonoffswitch').prop('checked', false); // 關閉開關
                var statusText = document.getElementById("statusText");
                statusText.textContent = fullDate + " " + formattedTime + " 關閉";
            }
            var update = {
                "humidity": parseInt(humidity_w),
                "switch": parseInt(switch_water)
            };
            $.ajax({
                url: 'https://vmlabjsonserver.azurewebsites.net/switch_water', // 替換為您的 API URL
                method: 'POST',
                data: JSON.stringify(update),
                contentType: 'application/json; charset=utf-8',
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
            clearInterval(checkGaugeValue); // 停止定期检查
        }
    }, 10000);
} 

$('#myonoffswitch').click(function() {
    if(this.checked)
    {
        if(humidity_w < 80){
            switch_water = 1;
            var statusText = document.getElementById("statusText");
            statusText.innerHTML = fullDate + " " + formattedTime + " 開啟";
        }
        if(humidity_w == 80){
            alert("目前已達到濕度標準，無需澆水");
            $('#myonoffswitch').prop('checked', false); // 关闭开关
            switch_water = 0;
        }
    }
    else{
        switch_water = 0;
        var statusText = document.getElementById("statusText");
        statusText.textContent = fullDate + " " + formattedTime + " 關閉";
    }
});

$('#myonoffswitch2').click(function() {
    if(this.checked)
    {
        if(temp_w < 19){
            switch_fans = 1;
            var statusText = document.getElementById("statusText2");
            statusText.innerHTML = fullDate + " " + formattedTime + " 開啟";
        }
        if(temp_w >= 19){
            alert("目前已達到溫度標準，無需開啟風扇");
            $('#myonoffswitch2').prop('checked', false);
            switch_fans = 0;
        }
    }
    else{
        switch_fans = 0;
        var statusText = document.getElementById("statusText2");
        statusText.textContent = fullDate + " " + formattedTime + " 關閉";
    }
});