// 建立一個新的Date物件
var today = new Date();

var year = today.getFullYear();

var month = today.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;

var date = today.getDate();
date = (date < 10 ? "0" : "") + date;

var fullDate = year + '/' + month + '/' + date;
console.log(fullDate);

var res_disease;
var res_bug;

let newId_disease = 0;
let newId_bug = 0;

var input_disease = 0;
var input_bug = 0;


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
                $('.list-unstyled').empty(); // 清空先前的資料
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
                    $('.list-unstyled').append(listItem);
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
                $('.list-unstyled-2').empty(); // 清空先前的資料
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
                    $('.list-unstyled-2').append(listItem);
                });
            },
            error: function(error) {
                console.log(error);
            }
        });

        //氣象
        $(document).ready(function() {
            // 發送 AJAX 請求獲取數據
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
                    $('.count.h_temperature').text(weatherData.h_temperature);
                    $('.count.a_temperature').text(weatherData.a_temperature);
                    $('.count.humidity').text(weatherData.humidity);
                    $('.count.rain').text(weatherData.rain);
                    $('.time-text').text(date + "更新");

                },
                error: function(xhr, status, error) {
                    console.error(error); // 處理錯誤
                }
            });
        });
        
    }, 2000);

    //土壤方法
    $.ajax({
        url: 'https://vmlabjsonserver.azurewebsites.net/soilmethod',
        type: 'GET',
        success: function(response) {
            console.log(response);
            var methodContent = response.method;
            $('.x_title.soil-method').html('<h4>建議施肥措施: ' + methodContent + '</h4>');
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
                //console.log(wx);
                var humidity = timeValueArray[index].rhValue;
                var weatherIcon = getWeatherIcon(wx); // 根據風速取得天氣圖示代碼
                //console.log(weatherIcon);
                // 更新每個天氣資訊的內容
                $(this).find('.day').text(day);
                $(this).find('.degrees').text(degrees);
                $(this).find('canvas').attr('id', weatherIcon);
                $(this).find('h5').text(humidity+ '％');
            });
            
            function getWeatherIcon(weatherDescription) {
                if (weatherDescription.includes('晴')) {
                    if (weatherDescription.includes('雲')) {
                        return 'partly-cloudy-day';
                    } else {
                        return 'clear-day';
                    }
                    } else if (weatherDescription.includes('雨')) {
                    return 'rain';
                    } else if (weatherDescription.includes('霧')) {
                    return 'fog';
                    } else if (weatherDescription.includes('雲')) {
                    return 'cloudy';
                    } else if (weatherDescription.includes('雪')) {
                    return 'snow';
                    } else {
                    // 如果無法判斷描述，回傳預設的圖示代碼
                    return 'partly-cloudy-day';
                    }
                }
                init_skycons();
            },
            error: function(error) {
            console.log('發生錯誤：', error);
            }
    });
});


