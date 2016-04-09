
var main = function()
{

}


var setFooter = function () {
    $.get("siteWide/html/pageFooter.html", function (data) {
        $('.pageFooter').html(data);
    });
    main();
}

$(document).ready(setFooter);
