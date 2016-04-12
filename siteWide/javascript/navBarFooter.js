
var selectedBarName = ".selectedBar";
var elementsUpdated = false;

var main = function()
{
    setFooter();
    var setUpElements = setInterval(function () {
    $('.pageFooter').css('width', $(window).width());
    $('.navigationBar').find('.navBox').css('width', $(window).width());
        $('.navigationBar').find('li').each(
            function () {
                var newWidth = $(this).find('h1').width() * 1.2;
                $(this).find(selectedBarName).css("width", newWidth);
                clearInterval(setUpElements);
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
    },100);
}

var setNavigationBar = function()
{
    $.get("siteWide/html/navBar.html", function (data) {
        $('.navigationBar').html(data);
    });
    main();
}

var setFooter = function () {
    $.get("siteWide/html/pageFooter.html", function (data) {
        $('.pageFooter').html(data);
    });
}


$(document).ready(setNavigationBar);
