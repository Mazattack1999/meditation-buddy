var categories = ["nature", "space", "animals", "zen", "dogs", "camping", "element", "ocean"];
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
var searchModal = document.querySelector("#search-modal");

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
            //homepage interval to cycle through random image and quote every 10 seconds
            setInterval(function(){
                //load page if there is image data
                if (imageData.length > 0){
                    loadHomePage()
                }
            }, 10000)
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

    if (imageData.length > 0) {
        // go to meditation page
        window.location.href = "meditation.html";
    } else {
        searchModal.classList.remove("is-hidden");
    }
    
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

function createFavoritesList() {
    // favorites page elements
    var favList = document.querySelector("#favorites");

    // loop through favorites array
    for (var i = 0; i < favorites.length; i++) {
        var currentImage = favorites[i].image;
        var currentQuote = favorites[i].quote;

        // create a container for the image and quote
        var favContainer = document.createElement("li");
        favContainer.classList.add("is-flex", "is-justify-content-space-between", "mt-2", "ml-auto");

        // create img tag 
        var img = document.createElement("img");
        img.setAttribute("alt", currentImage.alt);
        img.setAttribute("src", currentImage.src.portrait);
        // append img to favContainer
        favContainer.appendChild(img);

        // create p tag
        var p = document.createElement("p");
        p.classList.add("is-size-6-mobile", "is-size-5-tablet", "is-size-2-desktop")
        p.innerHTML = currentQuote.q + " </br> -" + currentQuote.a;
        // append p to favContainer
        favContainer.appendChild(p);

        // append favContainer to favList
        favList.appendChild(favContainer);
    }
}


console.log(currentPage, window.location.pathname)
if(currentPage.includes("meditation.html")){
    // if current page is meditation.html

    // favorite button event listener
    favBtn.addEventListener("click", function(event){
        var fav = JSON.parse(localStorage.getItem("search-result"));
        saveFavorite(fav);
        // hide favorite button so user can't click it again
        favBtn.classList.add("is-hidden");
    })


    // if search-data exists, get item from local storage
    console.log(localStorage.getItem("search-result"));
    if(localStorage.getItem("search-result")){
        loadMeditation(JSON.parse(localStorage.getItem("search-result")));
    }
    // load favorites from local storage
    loadFavorites();
} else if (currentPage.includes("favorites.html")){

    //load favorites from local storage
    loadFavorites();

    createFavoritesList();
} else if (currentPage.includes("index.html") || window.location.pathname === "/meditation-buddy/"){
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
}


 

