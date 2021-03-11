if (localStorage.getItem("listened") === null) {
	localStorage.listened = "[]";
}

if (localStorage.getItem("unlistened") === null) {
  localStorage.unlistened = JSON.stringify(window.genres);
}

if (localStorage.getItem("favs") === null) {
	localStorage.favs = "[]"
}

var histisopen = false;
var favisopen = false;
var infoisopen = false;


function checkfav() {
	var x = event.clientX;
	var y = event.clientY;
	var stars = document.getElementsByClassName("star-five");
	if (stars.length === 0){}
	else {
		for (let d of stars) {
			var bounding = d.getBoundingClientRect();
			var left = bounding["left"] - 1;
			var right = bounding["right"] + 1;
			var ttop = bounding["top"] - 1;
			var bottom = bounding["bottom"] + 1;
			if (x > left && x < right && y > ttop && y < bottom) {
				togglefav(d.parentNode);
			}
		}
	}
}

function openwiki(genre) {
	var xhr = new XMLHttpRequest();
	var url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=1&gsrsearch=" + genre + " music";
	xhr.open('GET', url, true);

	xhr.onload = function(){
		var data = JSON.parse(this.response);
		var query = data.query;
		var pages = query.pages;
		var page = Object.values(pages)[0];
		var pagename = page.title;
		var wiki = document.getElementById("wiki");
		wiki.src = "https://en.wikipedia.org/wiki/" + pagename;
		}
	xhr.send();
}	

function wikiframe() {
	var wiki = document.getElementById("wiki");
	if (wiki.className == "wikiclosed") {
		wiki.className = "wikiopen";
	} else {
		wiki.className = "wikiclosed";
	}
}

function clearhist(){
	if (window.confirm("Are you sure you would like to reset your listening history?")){
		localStorage.listened = "[]";
		localStorage.unlistened = JSON.stringify(window.genres);
		updatehist();
	}
}

function showhist(){
	var histbox = document.getElementById("history");
	if (histisopen){
		histisopen = false;
		histbox.className = "closedhist";
		}
	 else{
		histisopen = true;
		histbox.className = "openhist";
	}
	updatehist();
}

function updatehist(){
	var histbox = document.getElementById("history");
	if (histisopen){
		var hist = JSON.parse(localStorage.getItem("listened")).reverse();
		var total = window.genres.length;
		var i;
		for (i = 0; i < total; i ++){
			if (document.contains(document.getElementById('hist' + i))){
				histbox.removeChild(document.getElementById('hist' + i));
			}
		}
		for (i = 0; i < hist.length; i++){
			var box = document.createElement('button');
			var item = hist[i]
			var name = "<div class='item'><span class = 'name'>" + item[0] + "</span>" + "<span class = 'time'>" + item[1].slice(4,21) + "</span></div>";
			box.id = 'hist' + i
			box.innerHTML = name;
			box.target = "_blank";
			try{
			box.setAttribute("onclick","openmusic('" + item[0].toString() + "')");
			} catch{box.setAttribute("onclick","openmusic('" + "null" + "')");}
			box.className = "histbutton";
			box.setAttribute("onmouseenter", "createfavstar(this)");
			box.setAttribute("onmouseleave", "mouse_leave(this)");
			box.setAttribute("genre", item[0]);
			histbox.appendChild(box);
		}
	}
}

function showfavs() {
	var favbox = document.getElementById("favourites");
	if (favisopen){
		favisopen = false;
		favbox.className = "closedfav";
		}
	 else{
		favisopen = true;
		favbox.className = "openfav";
	}
	updatefav();
}

function updatefav(){
	var favbox = document.getElementById("favourites");
	if (favisopen){
		var favs = JSON.parse(localStorage.getItem("favs")).reverse();
		var total = window.genres.length;
		var i;
		for (i = 0; i < total; i ++){
			if (document.contains(document.getElementById('fav' + i))){
				favbox.removeChild(document.getElementById('fav' + i));
			}
		}
		for (i = 0; i < favs.length; i++){
			var box = document.createElement('button');
			var item = favs[i]
			var name = "<div class='item'><span class = 'nameF'>" + item + "</span></div>";
			box.id = 'fav' + i
			box.innerHTML = name;
			box.target = "_blank";
			try{
			box.setAttribute("onclick","openmusic('" + item.toString() + "')");
			} catch{box.setAttribute("onclick","openmusic('" + "null" + "')");}
			box.className = "histbutton";
			box.setAttribute("onmouseenter", "createfavstar(this)");
			box.setAttribute("onmouseleave", "mouse_leave(this)");
			box.setAttribute("genre", item);
			favbox.appendChild(box);
		}
	}
}
function createfavstar(x) {
	var favourites = JSON.parse(localStorage.getItem("favs"));
	try{
		x.removeChild(document.getElementById('star' + x.getAttribute("genre")));
	}
	catch{}
	var star = document.createElement("div");
	if (favourites.includes(x.getAttribute("genre")))
		if (x.id[0] === 'f') {
			star.className = "star-five active not-hist";
		} else {
			star.className = "star-five active";
		}
	else {
		if (x.id[0] === 'f') {
			star.className = "star-five not-hist";
		} else {
			star.className = "star-five";
		}
	}
	star.setAttribute("onclick","togglefav(this.parentNode); event.stopPropagation()");
	star.id = "star" + x.getAttribute("genre");
	x.appendChild(star);
}

function togglefav(x) {
	var favourites = JSON.parse(localStorage.getItem("favs"));
	var gen = x.getAttribute("genre")
	if (favourites.includes(gen)) {
		i = favourites.indexOf(gen);
		favourites.splice(i, 1);
		if (favourites.includes(x.getAttribute("genre")))
		if (x.id[0] === 'f') {
			document.getElementById('star' + gen).className = "star-five not-hist";
		} else {
			document.getElementById('star' + gen).className = "star-five";
		}
	} else {
		favourites.push(gen);
		if (x.id[0] === 'f') {
			document.getElementById('star' + gen).className = "star-five active not-hist";
		} else {
			document.getElementById('star' + gen).className = "star-five active";
		}
	}
	localStorage.favs = JSON.stringify(favourites);
	updatefav();
}

function mouse_leave(x) {
	avar = setTimeout(removefavstar, 3000, x);
}

function removefavstar(x) {
	var xcolour = window.getComputedStyle(x).getPropertyValue('background-color');
	if (xcolour ==="rgb(110, 5, 5)") {
		mouse_leave(x);
	}
	else{
		try{
			x.removeChild(document.getElementById('star' + x.getAttribute("genre")));
		}
		catch{}
	}
}

function save_genres(genres){
	localStorage.unlistened = JSON.stringify(genres);
}

function openarandomgenre(){
	[genre, genres] = randgenre(JSON.parse(localStorage.getItem("unlistened")));
	var oldhist = JSON.parse(localStorage.getItem("listened"));
	var time  = (new Date()).toString();
	oldhist.push([genre, time]);
	localStorage.listened = JSON.stringify(oldhist);
	openmusic(genre);
	save_genres(genres);
	updatehist();
}

function openmusic(genre){
	window.open('https://www.youtube.com/results?search_query=' + genre, "_blank");
	openwiki(genre);
}

function randgenre(genres){
	var genre = "";
	do {
		if (genres.length > 1){
			genreno = Math.floor(Math.random() * genres.length);
			genre = genres[genreno];
			genres.splice(genreno, 1);
		} else {
			alert("You have listened to all the music genres!");
			genre = "Nothing"
		}
	} while (genre == "==========\n");
	return [genre, genres]
}

function info(){
	var infobox = document.getElementById("info");
	if (infoisopen){
		infoisopen = false;
		infobox.className = "closedinfo";
		}
	 else{
		infoisopen = true;
		infobox.className = "openinfo";
	}
}