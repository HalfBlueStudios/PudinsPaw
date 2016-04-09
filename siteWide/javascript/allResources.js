
var main = function()
{
    $.get("siteWide/html/siteWideIncludes.html", function (data) {
        $('head').append(data);
    });
}

$(document).ready(main);