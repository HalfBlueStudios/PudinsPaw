
var overlayName = ".overlay";
var textToChange = "h1";
var picToChange = "img";
var opacityLevel = ".5";

var milisecondsFadeIn = 300;
var milisecondsFadeOut = 300;

var alreadyInAnimation = false;


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
}

var DoneAnimation = function()
{
    alreadyInAnimation = false;
}


$(document).ready(main);