
var overlayName = ".overlay";
var textToChange = "h1";
var picToChange = "img";
var opacityLevel = ".5";

var main = function()
{
    $('.option').mouseover(
        function ()
        {
            $(this).children(textToChange).css("visibility", "visible");
            $(this).children(overlayName).css("opacity", opacityLevel);
        }
        );
    $('.option').mouseleave(
        function()
        {
            $(this).children(textToChange).css("visibility", "hidden");
            $(this).children(overlayName).css("opacity", 0);
        }
        );
}


$(document).ready(main);