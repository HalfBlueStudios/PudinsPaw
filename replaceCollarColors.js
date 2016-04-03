var selectedBarName = ".selectedBar";

var maginOfError = 120;
var mainColorMargin = 100;

var colorMargin = 10;

var redValue = 118;
var greenValue = 195;
var blueValue = 101;

var redToUse = 2;
var greenToUse = 250;
var blueToUse = 151;

var mostPromenentValue = redToUse;


var main = function () {
    var canvas = document.getElementById("firstCanvas");
    var ctx = canvas.getContext('2d');
    var imageToUse = new Image();
    imageToUse.src = "Test1 copy.jpg";
    imageToUse.onload = function()
    {
        ctx.drawImage(imageToUse, 0, 0, 200, 200);
    }
    $("button").click(function () {
        ChangeColor(ctx, canvas);
    }
    );
}

var drawImage = function()
{
    var canvas = document.getElementById("firstCanvas");
    var ctx = canvas.getContext('2d');
    ctx.drawImage(imageToUse, 0, 0);
    ChangeColor(ctx, canvas);
}

var ChangeColor = function(ctx, canvas)
{
    var mostPromenentValue;
    if (redToUse >= blueToUse && redToUse >= greenToUse)
    {
        mostPromenentValue = redToUse;
    }
    else if (blueToUse >= greenToUse && blueToUse >= redToUse)
    {
        mostPromenentValue = blueToUse;
    }
    else
    {
        mostPromenentValue = greenToUse;
    }
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var canvasToPut = document.getElementById("lastCanvas");
    var canvasToPutData = canvasToPut.getContext("2d");
    for(var i = 0; i < data.length; i +=4)
    {
        if (//(data[i] <= redValue + mainColorMargin && data[i] >= redValue - mainColorMargin) &&
            //(data[i + 1] <= greenValue + maginOfError && data[i + 1] >= greenValue - maginOfError) &&
            //(data[i + 2] <= blueValue + maginOfError && data[i + 1] >= blueValue - maginOfError) &&
            data[i + 1] - colorMargin  > data[i + 2] && data[i + 1] - colorMargin > data[i])
        { 
            var percentToUse = data[i + 1] / mostPromenentValue;
            //data[i] = data[i + 1];
            //data[i + 1] = 0;
            //data[i + 2] = 0;
            data[i] = redToUse * percentToUse;//(data[i] / redToUse) * redToUse;
            data[i + 1] = greenToUse * percentToUse; //(data[i + 1] / greenToUse) * greenToUse;
            data[i + 2] = blueToUse * percentToUse; //(data[i + 2] / blueToUse) * blueToUse;
        }
    }
    canvasToPutData.putImageData(imageData, 0, 0);
}


$(document).ready(main);