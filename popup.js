function clickHandler(e) {
	document.getElementById('accessText').style.webkitAnimationName = "none";
	document.getElementById('accessText').style.webkitAnimationName = "hidden";
	setTimeout(function(){
		document.getElementById('accessText').hidden="true";
		document.getElementById("textBlock").hidden=false;
	}, 1000);  
}

document.addEventListener( "DOMContentLoaded" , function () {
	document.getElementById("textBlock").hidden=true;
	document.getElementById("sp1").addEventListener( "click" , clickHandler);

});