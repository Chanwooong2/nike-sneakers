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
    const today = date.getMonth()+1+"/"+date.getDate();
    const todaySneakers = sneakers.filter(item => item.drawDate === today);

    console.log(today);
    // console.log(todaySneakers);
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
