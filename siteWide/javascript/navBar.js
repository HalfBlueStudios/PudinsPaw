
var selectedBarName = ".selectedBar";

var main = function()
{
    $('.navigationBar').find('li').each(
        function () {
            var newWidth = $(this).find('h1').width() * 1.2;
            $(this).find(selectedBarName).css("width", newWidth);
        }
        );
    $('.navigationBar').find('li').mouseleave(
        function () {
            $(this).find(selectedBarName).css("visibility", "hidden");
        }
        );
    $('.navigationBar').find('li').mouseover(
        function () {
            $(this).find(selectedBarName).css("visibility", "visible");
        }
        );
}


$(document).ready(main);