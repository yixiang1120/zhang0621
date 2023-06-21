// 建立一個新的Date物件
var today = new Date();

var year = today.getFullYear();

var month = today.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;

var date = today.getDate();
date = (date < 10 ? "0" : "") + date;

var fullDate = year + '/' + month + '/' + date;
console.log(fullDate);

var res;

$(document).ready(function() {
    let newId = 0;
    
    $('.btn-success').click(function() {
        var message = $('textarea[name="message"]').val();
        console.log(message);

        let newDiseaseData = {
            "id": newId, // 假設新資料的 id 為 3
            "date": "2023/06/21", // 你的日期
            "question": message, // 你的問題
            "answer": "請稍候..." // 你的答案
        };
        res.push(newDiseaseData);


        
        $.ajax({
            url: 'https://vmlabjsonserver.azurewebsites.net/diseasedata', 
            type: 'POST',
            data: JSON.stringify({disease: res}),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                // 將所有標題的內容更新為新的文字
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    setInterval(function() {
        $.ajax({
            url: 'https://vmlabjsonserver.azurewebsites.net/diseasedata', 
            type: 'GET',
            success: function(response) {
                //let lastId = response.disease[response.disease.length - 1].id;            
                console.log(response.disease);
                res = response.disease;
                newId = res.length + 1;
                console.log("eeeeee");

                console.log(res[0]);
                //console.log(res.length);
                $('.list-unstyled').empty(); // 清空先前的資料
                response.disease.forEach(function(item){
                    let listItem = 
                        `<li>
                            <div class="block">
                                <div class="block_content">
                                    <h2 class="title">
                                        <a>${item.question}</a>
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
    }, 2000);

    $.ajax({
        url: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-007?Authorization=CWB-3A297C76-6D21-4A45-9589-498002971EAE&locationName=%E6%A5%8A%E6%A2%85%E5%8D%80&elementName=PoP12h,T,RH,Wx',
        type: "GET",
        data: { location: "楊梅區" },
        success: function (response) {
            console.log(response);
            updateWeather(response);
        }
    });

    
    function updateWeather(data) {
    }
});


