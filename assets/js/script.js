var categories = ["nature", "space", "animals", ];
var pApiKey = "563492ad6f917000010000015d8387ef83034b6792272314a7fbbf6b";
// if inital page load has completed or not
var started = false;

// fetch data
var imageData;
var quoteData;

//homepage header
var homeHeader = document.querySelector("#index-header");

function storeImages(value){
    fetch("https://api.pexels.com/v1/search?query=" + value + "&per_page=25", {
        headers: {
            Authorization: pApiKey
        }
    })
    .then(function (response){
        return response.json()
    }).then(function(data){
        imageData = data.photos;

        // check if page is not started and quote data is not null
        if (!started && quoteData) {
            started = true;
            loadHomePage();
        }
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

        // check if page is not started and image data is not null
        if (!started && imageData) {
            started = true;
            loadHomePage();
        }
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
    storeQuotes();
 }

 // must execute after asynchronous functionality of fetches is complete
 function loadHomePage() {
    var randomImage = getRandom(imageData);
    var randomQuote = getRandom(quoteData);

    console.log(randomImage);

    homeHeader.setAttribute("style", "background-image:url(" + randomImage.src.large +");")

 }

 // on start of page
 loadStartupData();