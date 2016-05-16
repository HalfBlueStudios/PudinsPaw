
var overlayName = ".overlay";
var textToChange = "h1";
var picToChange = "img";
var opacityLevel = ".5";

var milisecondsFadeIn = 300;
var milisecondsFadeOut = 300;

var alreadyInAnimation = false;

var slideElements = [];
var placeInSlideShow = 0;

var main = function()
{
    $('.option').mouseover(
        function ()
        {
            $(this).children(textToChange).fadeTo(milisecondsFadeIn, 1);
            $(this).children(overlayName).fadeTo(milisecondsFadeIn, opacityLevel, DoneAnimation);
                //$(this).children(overlayName).css("opacity", opacityLevel);
        }
        );
    $('.option').mouseleave(
        function()
        {
            $(this).children(textToChange).stop().fadeTo();
            $(this).children(overlayName).stop().fadeTo();
            $(this).children(textToChange).fadeOut(milisecondsFadeOut);
            $(this).children(overlayName).fadeOut(milisecondsFadeOut);
            //$(this).children(overlayName).css("opacity", 0);
        }
        );
    $(".slideBox").each(function () {
       //$(this).animate({marginLeft: "-=" + "33.5%" }, 2000);
    });
    setUpSlideShow();
}

var DoneAnimation = function()
{
    alreadyInAnimation = false;
}

/*----------------set up slide show-----------------
    Loads all slide show pictures using ajax
    when complete starts slide show by calling startSlideShow
*/
var setUpSlideShow = function()
{
    var margin = 4;
    $('.bannerSlideShow').load("homePage/slideShowElements.html #slidePics", function ()
    {
        putSlidesInArray();
        var waitForWindow = setInterval(function () {
            console.log("waiting for windows load");
            $(document).ready(function () {
                clearInterval(waitForWindow);
                var posToPut = window.innerWidth / 3;
                console.log("windows width is " + window.innerWidth);
                console.log("array size is " + slideElements.length);
                for (i = 0; i < slideElements.length; i++) {
                    slideElements[i].css("left", posToPut + "px");
                    posToPut += parseInt(slideElements[i].children("img").css("width")) + 4;
                    console.log("pos to put is " + posToPut);
                    if (i == 0) {
                        slideElements[i].animate({ opacity: +1 }, 1000);
                    }
                    else {
                        slideElements[i].animate({ opacity: +.4 }, 1000);
                    }
                }
            });
        }, 1000);
    });
    startSlideShow();
}

/*---------------------put slides in array------------------------
    Puts all loaded slides into array to easily manage them
    
*/
var putSlidesInArray = function()
{
    slideElements = [];
    $('.bannerSlideShow').find(".slideBox").each(function ()
    {
        slideElements[slideElements.length] = $(this);
        $(this).css("opacity", "0");
    });
}

/*--------------start slide show----------------------
    Starts slide show by animating all slideBoxes to the left every 5 seconds
    annimates by the ammount of the previous picture, so it pushes it off screen
*/
var startSlideShow = function()
{
    var slideShow = setInterval(function () {
        console.log("moving");
        var widthToMove = slideElements[placeInSlideShow].children("img").css("width");
        console.log("width to move " + widthToMove + "place in slide show " + placeInSlideShow);
        for(i = 0; i < slideElements.length; i++)
        {
            slideElements[i].animate({ left: "-=" + widthToMove }, 1000);
            if(i == placeInSlideShow)
            {
                slideElements[i].animate({ opacity: .4 }, { duration: 1000, queue: false });
            }
            if(i == placeInSlideShow + 1)
            {
                slideElements[i].animate({ opacity: 1 }, { duration: 1000, queue: false });
            }
        }
        placeInSlideShow++;
    }, 5000);
}

$(document).ready(main);