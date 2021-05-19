const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const BASE_URL = "https://www.nike.com";
const FILEPATH = "../data/sneakersInformation.json"
let parsingObjs = [];

webScraping();

function webScraping(){
	scrapingDetailPage(BASE_URL + "/kr/launch/?type=upcoming&activeDate=date-filter:AFTER_DATE");
}

function scrapingDetailPage(url){
	axios.get(url).then(response => {
		const $ = cheerio.load(response.data);
		$(".item-list-wrap li.pb2-sm a:contains('THE DRAW 진행예정')").each((index, element) =>{
			scrapingSneakersInfo(BASE_URL + $(element).attr('href'));
		});
	});
}

function scrapingSneakersInfo(targetUrl){
	axios.get(targetUrl).then(response => {
		let $ = cheerio.load(response.data);

		let imgUrl = $("[data-ui-gallery-fullscreen-image='3']").prop('src');
		imgUrl = imgUrl == undefined ? $(".snkrs-gallery-item .image-component").prop('src') : imgUrl;
		
		let dateInfo = [];
		$(".draw-info").each((idx, ele) => { 
			if(idx != $(".draw-info").length-1)
			return dateInfo.push($(ele).text()); 
		});

		let current = new Date();

		parsingObjs.push({
			title : $(".product-info h1").text(),
			theme : $(".product-info h5").text(),
			releasePrice : $(".product-info div.headline-5").text(),
			imgUrl : imgUrl,
			drawPageUrl : targetUrl,
			dateInfo : dateInfo,
			drawStartTime: dateInfo[0].match(/\d{1,2}[:]\d{1,2}/gm)[0],
			drawYear: current.getFullYear(),
			drawDate: dateInfo[0].match(/\d{1,2}[/]\d{1,2}/gm)[0],
			drawDay: dateInfo[0].match(/\(.\)/gm)[0]
		});
		// console.log(parsingObjs);
		updateSneakersJson()
	});
}

function updateSneakersJson(){
	var resultDataFile = fs.createWriteStream(FILEPATH, {flags : 'w+'});
	resultDataFile.write("sneakers=" + JSON.stringify(parsingObjs));
}