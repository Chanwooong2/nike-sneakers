window.onload = function(){
	dispSneakersCard();
}

function dispSneakersCard(){
	const container = document.getElementsByClassName('sneakers-card-list')[0];

	sneakers.sort((a, b)=> (new Date(a.drawYear+"/"+a.drawDate+" "+a.drawStartTime)) - (new Date(b.drawYear+"/"+b.drawDate+" "+b.drawStartTime)));

	let innerHtml="";
	sneakers.forEach(item => {
		innerHtml += "<div class=\"sneakers-card\">";
		innerHtml += "	<div class=\"sneakers-release-date\">"+ item.drawDate +"<span>"+ item.drawDay +"</span></div>";
		innerHtml += "	<div class=\"sneakers-theme\">"+ item.theme +"</div>";
		innerHtml += "	<div class=\"sneakers-img\"><img src=\""+ item.imgUrl +"\" alt=\""+ item.theme +" loading...\" loading=\"lazy\"></div>";
		innerHtml += "	<div class=\"sneakers-title\">"+ item.title +"</div>";
		innerHtml += "	<div class=\"sneakers-detail-time\">"+ item.dateInfo.join("<br>") +"</div>";
		innerHtml += "	<button class=\"sneakers-button\" onclick=\"window.open('"+ item.drawPageUrl +"')\" title=\"Go! ✨Nike✨\"></button>";
		innerHtml += "</div>";
	})
	container.innerHTML = innerHtml;
}

let bgDirection = "R";
window.onmousedown = function(){
	let movingBg = document.getElementsByClassName("moving");
	if(bgDirection == "R"){
		bgDirection = "L";
		document.documentElement.style.setProperty('--direction', '-1');
	}else{
		bgDirection = "R";
		document.documentElement.style.setProperty('--direction', '1');
	}
}