if (localStorage.getItem("listened") === null) {
	localStorage.listened = "[]";
}

if (localStorage.getItem("unlistened") === null) {
  localStorage.unlistened = JSON.stringify(window.genres);
}

var histisopen = false;


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
			var name = "<span class='item'><span class = 'name'>" + item[0] + "</span>" + "<span class = 'time'>" + item[1].slice(4,21) + "</span></span>";
			box.id = 'hist' + i
			box.innerHTML = name;
			box.target = "_blank";
			box.setAttribute("onclick","openmusic('" + item[0].toString() + "')");
			box.className = "histbutton";
			histbox.appendChild(box);
		}
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
	document.getElementById("genre_label").innerHTML = genre;
	window.open('https://www.youtube.com/results?search_query=' + genre, "_blank");
}

function randgenre(genres){
	var genre = "";
	do {
		if (genres.length > 0){
			genreno = Math.floor(Math.random() * genres.length);
			genre = genres[genreno];
			delete genres [genreno];
		} else {
			alert("You have listened to all the music genres!");
			genre = "Nothing"
		}
	} while (genre == "==========\n");
	return [genre, genres]
}