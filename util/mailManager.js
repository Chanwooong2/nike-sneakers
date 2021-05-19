const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const dataHandling = require('./mailDataHandling.js');

const transporter = nodemailer.createTransport(smtpTransport({
	service : 'gmail', 
	host : 'smtp.gmail.com',
	auth :{
		user : 'mcw0219Dev@gmail.com',
		pass : process.env.mail_pass
	}
}));

const mailOptions = {
	from : 'mcw0219Dev@gmail.com',
	to : getReceiverList(),
	subject : 'Nike The Draw!',
	html : getMailData()
};

const mailQueue = dataHandling.getMailContents();

const cron = require('node-cron');
let mailTask;
let taskList = [];
for(let i=0; i < mailQueue.length; i++){
	let schedule = timeToCronExpression(mailQueue[i].criteria);
	console.log(`schedule : ${schedule}`);
	mailTask = cron.schedule(schedule, () =>{
		transporter.sendMail(mailOptions, function(err, info){
			if(err){
				console.log(err);
			}else{
				console.log(`Success! ${info.response}`);
			}
			console.log(taskList[0])
			taskList[0].stop();
			taskList.splice(0,1);
		});
	});
	taskList.push(mailTask);
}

// 시간을 cron 표기로 변환하는 함수
// 9시간 계산
function timeToCronExpression(timeStr){
	let hour = Number(timeStr.split(":")[0]);
	const minute = Number(timeStr.split(":")[1]);
	
	hour = hour < 9 ? hour - 9 + 24 : hour = hour - 9;

	return minute+ " " +hour+" * * *";
}

function getMailData(){
    let mailHtml = "";

    mailHtml += "<div style=\"width: 100%;\">";
    mailHtml += "	<div style=\"text-align: center;font-size: 1.3em;font-weight: bold;padding:10px;cursor:pointer;border-radius: 30px;margin: 5px auto;background: #f1b848;width: 260px;position: absolute;left: calc(50% - 130px);\"><a style=\"text-decoration: none;color:#291a60;\" href=\"https://chanwooong2.github.io/nike-sneakers/nike-sneakers.html\">Go Chanwoong's<br>👟Sneakers Page👟</a></div>";
    mailHtml += "	<div style=\"text-align: center;font-size:2em;font-weight: bold;padding:10px;cursor:pointer;border-radius: 30px;margin: 5px auto;background: #000;color: #fff;width: 260px;line-height: 40px;position: absolute;left: calc(50% - 130px);top: 95px;\"><a style=\"text-decoration: none;color:#fff;\" href=\"https://www.nike.com/kr/launch/?type=upcoming&activeDate=date-filter:AFTER_DATE\">Go Nike.com</a></div>";
    mailHtml += "</div>";

    return mailHtml;
}

function getReceiverList(){
	const receiverFile = require('fs');
    const data = receiverFile.readFileSync('../data/receiverInfo.json', 'utf8');
    const receiverInfo = JSON.parse(data);
	let result = receiverInfo.addressList.join(", ");
	
	console.log(`receiverList : [${result}]`);
	return result;
}