
var overlayName = ".overlay";
var textToChange = "h1";
var picToChange = "img";
var opacityLevel = ".5";

var milisecondsFadeIn = 300;
var milisecondsFadeOut = 300;

var alreadyInAnimation = false;

var slideElements = [];
var slideWidths = [];
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
                var posToPut = window.innerWidth / 2 - (parseInt(slideElements[0].css("width")) / 2);
                console.log("windows width is " + window.innerWidth);
                console.log("array size is " + slideElements.length);
                for (i = 0; i < slideElements.length; i++) {
                    var newWidth = parseInt(slideElements[i].children("img").css("width")) + 4;
                    slideWidths[i] = newWidth; //have to keep widths of slide elements in array, since once offscreen they have width of zero
                    slideElements[i].css("left", posToPut + "px");
                    console.log("pos before" + posToPut + " now adding " + newWidth);
                    posToPut += newWidth;
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
        var widthToMove;
        var targetPos;
        var ammountToMove;
        if (placeInSlideShow + 1 >= slideElements.length) { //if at end of array, use element zero
            widthToMove = parseInt(slideWidths[0]);
            targetPos = (window.innerWidth / 2) - (widthToMove / 2);
            ammountToMove = parseInt(slideElements[0].css("left")) - targetPos;
        }
        else {
            widthToMove = parseInt(slideWidths[placeInSlideShow + 1]);
            targetPos = (window.innerWidth / 2) - (widthToMove / 2);
            ammountToMove = parseInt(slideElements[placeInSlideShow + 1].css("left")) - targetPos;
        }
        console.log("width to move " + widthToMove + "place in slide show " + placeInSlideShow);
        var numMoved = 0;
        for(i = 0; i < slideElements.length; i++)
        {
            slideElements[i].animate({ left: "-=" + ammountToMove}, 1000, function () {
                numMoved++;
                if(numMoved == slideElements.length)
                {
                    replaceSlideElements();
                }
            });
            if(i == placeInSlideShow)
            {
                slideElements[i].animate({ opacity: .4 }, { duration: 1000, queue: false });
            }
            if(i == placeInSlideShow + 1 || (placeInSlideShow + 1 >= slideElements.length && i == 0))
            {
                slideElements[i].animate({ opacity: 1 }, { duration: 1000, queue: false });
            }
        }
        placeInSlideShow++;
        if (placeInSlideShow >= slideElements.length) {
            placeInSlideShow = 0;
        }
    }, 5000);
}

/*-----------------replace slide elements ---------------------------------
    checks if any slide pictures are completely off the left hand side of the screen
    if so, puts their position at the end of the line of pictures on the right
*/
var replaceSlideElements = function()
{
    console.log("checking elements!");
    for(i = 0; i < slideElements.length; i++)
    {
        if(parseInt(slideElements[i].css("left")) + slideWidths[i] < 0)
        {
            var furthestRight = 0; //the furthest right space to put a slide element
            var widthToMove = 0; //width of the furthest right element, must add so elements are not placed ontop of each other
            for(k = 0; k < slideElements.length; k++)
            {
                if(parseInt(slideElements[k].css("left")) > furthestRight)
                {
                    furthestRight = parseInt(slideElements[k].css("left"));
                    widthToMove = slideWidths[k];
                }
            }
            console.log("ammount to move is combo of " + furthestRight + " and width of " + widthToMove);
            var ammountToMove = furthestRight + widthToMove;
            slideElements[i].stop();
            slideElements[i].css("left", ammountToMove + "px");
        }
    }
}

$(document).ready(main);