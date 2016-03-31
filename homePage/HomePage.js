
var overlayName = ".overlay";
var textToChange = "h1";
var picToChange = "img";
var opacityLevel = ".5";

var milisecondsFadeIn = 300;
var milisecondsFadeOut = 300;


var main = function()
{
    $('.option').mouseover(
        function ()
        {
            $(this).children(textToChange).fadeTo(milisecondsFadeIn, 1);
            $(this).children(overlayName).fadeTo(milisecondsFadeIn,opacityLevel);
            //$(this).children(overlayName).css("opacity", opacityLevel);
        }
        );
    $('.option').mouseleave(
        function()
        {
            $(this).children(textToChange).fadeTo(milisecondsFadeOut, 0);
            $(this).children(overlayName).fadeTo(milisecondsFadeOut, 0);
            //$(this).children(overlayName).css("opacity", 0);
        }
        );
}


$(document).ready(main);