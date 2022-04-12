var categories = ["nature", "space", "animals", ];
var pApiKey = "563492ad6f917000010000015d8387ef83034b6792272314a7fbbf6b";
// if inital page load has completed or not
var starting = true;

// if user is searching 
var searching = false;

// fetch data
var imageData;
var quoteData;

// get which page user is on
var currentPage = window.location.href;

// current image and quote on screen
var image;
var quote;

// array to hold favorites
var favorites = [];

//homepage elements
var homeHeader = document.querySelector("#index-header");
var homeQuote = document.querySelector("#quote");
var submitBtn = document.querySelector("#submit-button");
var searchBar = document.querySelector("#search-bar");
var randomBtn = document.querySelector("#random-button");

// meditation page elements
var medMain = document.querySelector("#meditation-area");
var medQuote = document.querySelector("#searched-quote");
var favBtn = document.querySelector("#save-button");

function storeImages(value){
    fetch("https://api.pexels.com/v1/search?query=" + value + "&per_page=25", {
        headers: {
            Authorization: pApiKey
        }
    })
    .then(function (response){
        return response.json()
    })
    .then(function(data){
        imageData = data.photos;

        // get quote data
        storeQuotes();
    })
    .catch(function(error){
        console.log(error.message);
    })
}

function storeQuotes() {
    const url = "https://zenquotes.io/api/quotes";
    const proxy = "https://octoproxymus.herokuapp.com/?secret=walrus&url=";
    fetch(proxy + url)
    .then(function (response){
            return  response.json() 
    })
    .then( function (data){
        quoteData = data;

        // check if page is starting up
        if(starting) {
            starting = false;
            loadHomePage();
        } else if(searching) {
            searchData();
        }
    })
    .catch(function(error){
        console.log(error.message);
    })
 }

// get a random value from any array
function getRandom(array){
     // random index
     var randIndex = Math.floor(Math.random() * array.length);
     return array[randIndex];
}

function loadStartupData() {
     // fetch and store images of random category
    storeImages(getRandom(categories));
}
// must execute after asynchronous functionality of fetches is complete
function loadHomePage() {
    var randomImage = getRandom(imageData);
    var randomQuote = getRandom(quoteData);

    // console.log(randomImage);
    // console.log(randomQuote);

    homeHeader.setAttribute("style", "background-image:url(" + randomImage.src.portrait +");")
    homeQuote.innerHTML = randomQuote.q + " </br>-" + randomQuote.a;
}

function searchData() {
    var randomImage = getRandom(imageData);
    var randomQuote = getRandom(quoteData);

    localStorage.setItem("search-result", JSON.stringify({
        image: randomImage,
        quote: randomQuote
    }))
    // go to meditation page
    window.location.href = "meditation.html";
}

function loadMeditation(object) {
    image = object.image;
    quote = object.quote; 

    // set main background image
    medMain.setAttribute("style", "background-image:url(" + image.src.portrait +");")

    // set quote text
    medQuote.innerHTML = quote.q + " </br>-" + quote.a;
}

function loadFavorites() {
    // if local storage has favoirtes, load them, else set item
    if(localStorage.getItem("favorites")) {
        favorites = JSON.parse(localStorage.getItem("favorites"));
    } else {
        saveFavorite();
    }
}

function saveFavorite(value) {
    // if value is not null, save it to favorites
    if(value) {
        favorites.push(value);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}


console.log(currentPage)
if (currentPage.includes("index.html")){
    // if current page is index.html
    // index.html event listeners
    submitBtn.addEventListener("click", function(event){
        event.preventDefault();
        if (searchBar.value) {
            searching = true;
            var keyword = searchBar.value.trim();
            // clear searchbar when value is saved
            searchBar.value = "";
    
            storeImages(keyword);
        }
    })

    randomBtn.addEventListener("click", function(event){
        searching = true;
        var keyword = getRandom(categories);
        storeImages(keyword);
    })
    
    loadStartupData();

} else if(currentPage.includes("meditation.html")){
    // if current page is meditation.html

    // favorite button event listener
    favBtn.addEventListener("click", function(event){
        var fav = JSON.parse(localStorage.getItem("search-result"));
        saveFavorite(fav);
    })


    // if search-data exists, get item from local storage
    console.log(localStorage.getItem("search-result"));
    if(localStorage.getItem("search-result")){
        loadMeditation(JSON.parse(localStorage.getItem("search-result")));
    }
    // load favorites from local storage
    loadFavorites();
}

//homepage interval to cycle through random image and quote every 10 seconds
setInterval(loadHomePage, 10000)
 

