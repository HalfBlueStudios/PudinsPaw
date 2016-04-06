
var selectedBarName = ".selectedBar";

var main = function()
{
    setNavigationBar();
    $('.navigationBar').find('.navBox').css('width', $(window).width());
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

var setNavigationBar = function()
{
    $('.navigationBar').html("<div class=\"navBox\" height:200px width:300px>" +
        "<ul>" +
            "<li>" +
                "<div class=\"selectedWrapper\">" +
                    "<div class=\"selectedBar\"></div>" +
                "</div>" +
                "<h1><a href=\"HomePage.html\">Home</a></h1>" +
            "</li>" +
            "<li>" +
                "<div class=\"selectedWrapper\">" +
                    "<div class=\"selectedBar\"></div>" +
                "</div>" +
                "<h1><a href=\"buildACollar.html\">Build a collar</a></h1>" +
            "</li>" +
            "<li>" +
                "<div class=\"selectedWrapper\">" +
                    "<div class=\"selectedBar\"></div>" +
                "</div>" +
                "<h1><a href=\"Petimonials.html\">About Us</a></h1>" +
            "</li>" +
        "</ul>" +
        "<div class=\"userBar\">" +
            "<ul>" +
                "<li>" +
                    "<h1>Account</h1>" +
                "</li>" +
                "<li>" +
                    "<img src=\"siteWide/images/shopping_cart_icon.png\" />" +
                "</li>" +
            "</ul>" +
        "</div>" +
    "</div>");
}


$(document).ready(main);
