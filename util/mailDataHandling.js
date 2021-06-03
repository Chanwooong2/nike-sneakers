module.exports = {getMailContents};

function getMailContents(){
    const sneakers = getSneakersJsonData();
    const todaySneakers = getTodaySneakersList(sneakers);
    const mailQueue = getMailQueue(todaySneakers);

    return mailQueue;
}

function getSneakersJsonData(){
    const fs = require('fs');
    const data = fs.readFileSync('../data/sneakersInformation.json', 'utf8').slice(9);
    const sneakers = JSON.parse(data);

    // 시간순 정렬
    sneakers.sort((a, b) => (new Date(a.drawYear+"/"+a.drawDate+" "+a.drawStartTime)) - (new Date(b.drawYear+"/"+b.drawDate+" "+b.drawStartTime)));

    return sneakers;
}

// 오늘 드로우 대상 리스트
function getTodaySneakersList(sneakers){
    const date = new Date();
    let today;
    
    // Issue : GitHub Actions의 스케쥴러가 제 시간에 돌지 않고 0 ~ 2시간30분 정도 딜레이 발생하는 현상
    // '0 22 * * *' 로 설정 > 한국시간 기준 오전 7시 예정
    // 세계시간 기준 딜레이 포함해서 22, 23시에 실행 시 날짜 하루 추가
    if(date.getHours() > 21){
        // 9시 이전에 돌았을 경우 (날짜가 하루 전날이라 안걸렷을 것)
        today = date.getMonth()+1+"/"+(date.getDate()+1);
    }else{
        // 10시 이후에 돌았을 경우 (10시에 드로우하는 것이 안 걸림)
        today = date.getMonth()+1+"/"+date.getDate();
    }
    const todaySneakers = sneakers.filter(item => item.drawDate === today);

    console.log(today);
    return todaySneakers;
}

function getMailQueue(todaySneakers){
    const mailQueue = [];
    let criteria = todaySneakers.length !== 0 ? todaySneakers[0].drawStartTime : "";
    let tmpArr = [];
    console.log(`criteria : ${criteria}`);
    for(let i=0; i< todaySneakers.length; i++){
        if(criteria !== todaySneakers[i].drawStartTime){
            mailQueue.push({criteria:criteria, sneakersList:tmpArr});
            criteria = todaySneakers[i].drawStartTime;
            tmpArr = [];
        }
        tmpArr.push(todaySneakers[i]);
        if(i === todaySneakers.length-1){
            mailQueue.push({criteria:criteria, sneakersList:tmpArr});
        }
    }
    
    console.log(mailQueue);
    return mailQueue;
}