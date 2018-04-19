"use strict";

var form = document.getElementById("search-form");

form.addEventListener("submit", function (event) {
    event.preventDefault(); //Prevents page from reloading
    var query = this.elements.query.value;  
    sendApiRequestToSpotify(query); 
    sendApiRequestToOmdb(query);
});


function sendApiRequestToOmdb(input) { 
    var omdbAPI = new XMLHttpRequest();
    var omdbURL = "http://www.omdbapi.com/?s=" + input + "&type=movie&apikey=f630776";

    omdbAPI.addEventListener("load", function () {
        var result = JSON.parse(this.responseText); //Parse the JSON answer

        for (let i = 0; i < 3; i++) {   //I only want three results
            var div = document.createElement('div');    //Creates a new div
            div.className = "movie-item";   //Name it movie-item
            var title = document.createElement('h1');
            title.innerHTML = result.Search[i].Title + "<br> (" + result.Search[i].Year + ")";
            div.appendChild(title); //Append the title to the movie-item div
            var img = document.createElement('img');    //Create a new image element
            img.setAttribute('src', result.Search[i].Poster);
            div.appendChild(img);
            document.getElementById('result').appendChild(div);
        }
    });

    omdbAPI.open("get", omdbURL, true);
    omdbAPI.send();
}


document.getElementById('spotify-login').addEventListener('click', logInToSpotify);

function sendApiRequestToSpotify(input) {
    var omdbAPI = new XMLHttpRequest();

    omdbAPI.onreadystatechange = function(){ //When the state of xmlreq is ready, this will happen
        if (omdbAPI.readyState == XMLHttpRequest.DONE) { //Make sure the xmlrequest is done
            var result = JSON.parse(omdbAPI.responseText) //Parse the json
            //Creates three artist items
            for (let i = 0; i < 3; i++) {
                const element = result.artists.items[i];
                var div = document.createElement('div');
                div.className = "artist-item";
                var title = document.createElement('h1');
                title.innerHTML = result.artists.items[i].name;
                div.appendChild(title);
                var img = document.createElement('img');
                img.setAttribute('src', result.artists.items[i].images[2].url);
                div.appendChild(img);
                document.getElementById('result').appendChild(div);
            }
        }
    }

    omdbAPI.open("GET", "https://api.spotify.com/v1/search?q=" + input + "&type=artist", true);
    var accessToken = parseHashFromUri();
    omdbAPI.setRequestHeader('Authorization', 'Bearer ' + accessToken); //Set the accesstoken in the header
    var omdbURL = "https://api.spotify.com/v1/search?q=" + input + "&type=artist"; 
    omdbAPI.send();
}

//Gets the access token given from spotify via the uri rom redirect
function parseHashFromUri() {
    var lochash = location.hash.substr(1),
        access_token = lochash.substr(lochash.indexOf('access_token='))
            .split('&')[0]
            .split('=')[1];
    return access_token;
}

//Redirects the user to spotifies access prompt
function logInToSpotify() {
    window.location.replace('https://accounts.spotify.com/authorize?client_id=67b4cf636c734394ad73acbe00bcdafc&redirect_uri=http://WebShare.mah.se/af8516&response_type=token');
}

