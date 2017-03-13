window.GlobalLink = "http://developer.chrome.com/extensions/cookies.html";
window.GlobalTTL = 60 * 1000 * 60 * 24 * 7 * 31;

function clickCommentSpoiler(e) {
	document.getElementById('h_sp').style.top = '0px';
	document.getElementById('siz').style.height = '108px';
	document.getElementById('imgBlock').style.display = 'block';
	document.getElementById("imgBlock").style.left = '290px';
}

function clickSaveGroupSpoiler(e) {
	document.getElementById("imgBlock").style.left = '2px';
	chrome.tabs.getSelected(null,function(tab) {
			window.tablink = tab.id;
	});
	
	chrome.tabs.getAllInWindow(null,function(tabs) {
		var commonData='';
		for(var i=0; i<tabs.length; i++)
			commonData += "<div class='dsc'><input type='checkbox' value='"+i+"'"+((window.tablink == tabs[i].id)?'checked':'')+"/>"+tabs[i].url+"</div>";
		document.getElementById('imgBlock').getElementsByClassName('groupBlock')[0].getElementsByClassName('group')[0].innerHTML = commonData;
	});
	
	// Заполнение <select> option-ами
		chrome.cookies.getAll(
		{domain: 'developer.chrome.com'},
			function(cookies) {
				var groupNamesArray = new Array();
				for(i = 0; i < cookies.length; i++){
					if(cookies[i].name.indexOf('#group') != -1)
					{
						var current = cookies[i].value;
						
						if(!groupNamesArray.length) groupNamesArray[groupNamesArray.length]=cookies[i].value;
						
						var cntEl=0;
						for(var j=0; j<groupNamesArray.length; j++)
							if(groupNamesArray[j] != current) cntEl++;
						
						if(cntEl==groupNamesArray.length)
							groupNamesArray[groupNamesArray.length]=cookies[i].value;
					}
				}
				
				var selectText = '';
				for(var j=0; j<groupNamesArray.length; j++)
					selectText += "<option>"+groupNamesArray[j]+"</option>";
				
				document.getElementById('listId').innerHTML = selectText;
			}
		);
}

function clickFixedCheckbox(e) {
	if(document.getElementById("fixed").checked){
		var date = new Date(new Date().getTime() + window.GlobalTTL);
		document.cookie = "setMsgBox = true; path=/; expires=" + date.toUTCString();
	}
	else {
		var date = new Date(0);
		document.cookie = "setMsgBox=; path=/; expires=" + date.toUTCString();
	}
}

function removeCookies(domain, name){
	chrome.cookies.remove({ "name": name, "url": domain},
	function (cookie) {
		//console.log(JSON.stringify(cookie));
		//console.log(chrome.extension.lastError);
		//console.log(chrome.runtime.lastError);
	});
}

function setCookies(domain, name, value, expirationDate) {
	expirationDate=expirationDate-0;
	var UNIX_TIMESTAMP = Math.round((new Date().getTime()+expirationDate) / 1000);
	chrome.cookies.set({ "name": name, "url": domain, "value": value, "expirationDate": UNIX_TIMESTAMP},
	function (cookie) {
		//console.log(JSON.stringify(cookie));
		//console.log(chrome.extension.lastError);
		//console.log(chrome.runtime.lastError);
	});
}

function clickSaveButton(e) {
	document.getElementById('h_sp').style.top = '-96px';
	document.getElementById('siz').style.height = '37px';
	rewriteLastCookie();
}

document.addEventListener( "DOMContentLoaded" , function () {	
	//Проверяем cookie галочки (настройки)
	if(document.cookie.substr(document.cookie.indexOf('setMsgBox='),14)=='setMsgBox=true'){
		clickCommentSpoiler();
		document.getElementById("fixed").checked = 'true';
	}
	
	// Сохраняем текущую вкладку
	//saveTabToCookie();

	// Обрабатываем события
	document.getElementById("sp_1").addEventListener( "click" , clickCommentSpoiler);//clickHandler2
	document.getElementById("sp_2").addEventListener( "click" , clickSaveGroupSpoiler);//clickHandler3
	document.getElementById("fixed").addEventListener( "click" , clickFixedCheckbox);//clickHandler
	document.getElementById("Button2").addEventListener( "click" , clickSaveButton);//clickHandler4
	document.getElementById("saveGroupButton").addEventListener( "click" , clickSaveGroupButton);
});

function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}

function saveTabToCookie()
{
	chrome.tabs.getSelected(null,function(tab) {
		var tablink = tab.url;
		var tabTitle = tab.title;
		var tabFavIconUrl = tab.favIconUrl;
		chrome.cookies.getAll(
		{domain: 'developer.chrome.com'},
		function(cookies) {
			var cnt=-1;
			for(i = 0; i < cookies.length; i++)
				if(cookies[i].name == 'links_count')
					cnt=parseInt(cookies[i].value);
			
			if(cnt != -1){
				removeCookies(window.GlobalLink, "links_count");
				setCookies(window.GlobalLink, "links_count", ""+parseInt(cnt+1), window.GlobalTTL);
				
				createBookmark(cnt, tabFavIconUrl, tablink, document.getElementById('input').value, "", tabTitle, window.GlobalTTL);
			}
			else {
				setCookies(window.GlobalLink, "links_count", "1", window.GlobalTTL);
				createBookmark(0, tabFavIconUrl, tablink, document.getElementById('input').value, "", tabTitle, window.GlobalTTL);
			}
		});
	});
}

function createBookmark(id, favicon, _link, description, group, title, TTL){
	setCookies(window.GlobalLink, "id_"+id+"#link", _link, TTL);
	setCookies(window.GlobalLink, "id_"+id+"#description", description, TTL);
	setCookies(window.GlobalLink, "id_"+id+"#group", group, TTL);
	setCookies(window.GlobalLink, "id_"+id+"#title", title, TTL);
	setCookies(window.GlobalLink, "id_"+id+"#favicon", favicon, TTL);
}

function removeBookmark(id){
	removeCookies(window.GlobalLink, "id_"+id+"#link");
	removeCookies(window.GlobalLink, "id_"+id+"#description");
	removeCookies(window.GlobalLink, "id_"+id+"#group");
	removeCookies(window.GlobalLink, "id_"+id+"#title");
	removeCookies(window.GlobalLink, "id_"+id+"#favicon");
}

function rewriteLastCookie(){

	chrome.cookies.getAll(
		{domain: 'developer.chrome.com'},
		function(cookies) {
			var cnt=-1;
			for(i = 0; i < cookies.length; i++) 
				if(cookies[i].name == 'links_count')
					cnt=parseInt(cookies[i].value);
			
			if(cnt != -1)
				setCookies("http://developer.chrome.com/extensions/cookies.html", "id_"+(cnt-1)+"#description", document.getElementById('input').value, 60 * 1000 * 60 * 24 * 7 * 31);
	});
}

function clickSaveGroupButton(e) {
	chrome.tabs.getAllInWindow(null,function(tabs) {
		chrome.cookies.getAll(
		{domain: 'developer.chrome.com'},
			function(cookies) {
				var cnt=-1;
				for(i = 0; i < cookies.length; i++)
					if(cookies[i].name == 'links_count')
						cnt=parseInt(cookies[i].value);
				
				if(cnt != -1){
					if(cnt >= 1) removeBookmark(parseInt(cnt-1));
					if(cnt == 0)removeCookies(window.GlobalLink, "links_count");
					
					var noOneIsChecked=true;
					for(var i=0; i<tabs.length; i++)
					{
						var elemInput = document.getElementById('imgBlock').getElementsByClassName('groupBlock')[0].getElementsByClassName('group')[0].getElementsByClassName('dsc')[i].getElementsByTagName('input')[0];
						var group = document.getElementById('lstGroup').value;
						if(elemInput.checked)
						{
							removeCookies(window.GlobalLink, "links_count");
							setCookies(window.GlobalLink, "links_count", ""+parseInt(cnt), window.GlobalTTL);
							createBookmark(parseInt((cnt!=0)?(cnt-1):cnt), tabs[i].favIconUrl, tabs[i].url, '', group, tabs[i].title, window.GlobalTTL);
							cnt++;
							noOneIsChecked=false;
						}
					}
					if(noOneIsChecked){
						removeCookies(window.GlobalLink, "links_count");
						setCookies(window.GlobalLink, "links_count", ""+parseInt(cnt-1), window.GlobalTTL);
					}
				}
			}
		);
	});

	document.getElementById('h_sp').style.top = '-96px';
	document.getElementById('siz').style.height = '37px';
	document.getElementById('imgBlock').style.display = 'none';
}