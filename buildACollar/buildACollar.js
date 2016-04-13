
var currentcolor;

var selectedBarName = ".selectedBar";

var maginOfError = 120;
var mainColorMargin = 100;

var colorMargin = 10;

var outerRedValue = 118;
var outerGreenValue = 195;
var outerBlueValue = 101;

var ctx;
var canvas;
var baseImage;

var displayedCanvas;
var dispalyedCtx;

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 400;

var currentImageData;
var snapOuter = [81,155,80];
var snapInner = [47,46,77];


var setUpCanvas = function()
{
    $('#backgroundCanvas').css("width", IMAGE_WIDTH);
    $('#backgroundCanvas').css("height", IMAGE_HEIGHT);
    $('#displayedCanvas').css("width", IMAGE_WIDTH);
    $('#displayedCanvas').css("height", IMAGE_HEIGHT);
    canvas = document.getElementById("backgroundCanvas");
    ctx = canvas.getContext('2d');
    displayedCanvas = document.getElementById("displayedCanvas");
    displayedCtx = displayedCanvas.getContext('2d');
}

var resetCanvas = function()
{
    baseImage = new Image();
    baseImage.src = "buildACollar/baseTypeImages/snapBase.jpg";
    baseImage.onload = function () {
        ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);
        displayedCtx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);
    }
    currentImageData = displayedCtx.getImageData(0, 0, displayedCanvas.width, displayedCanvas.height);
}


var drawImage = function () {
    ctx.drawImage(imageToUse, 0, 0);
}

var changeColors = function (colorToMatch, newColors, percentMargin) {
    var mostPromenentValue;
    var numPixels = 0;
    var redToUse = newColors[0];
    var greenToUse = newColors[1];
    var blueToUse = newColors[2];
    var colorToCheck;
    if (redToUse >= blueToUse && redToUse >= greenToUse) {
        mostPromenentValue = redToUse;
        colorToCheck = 0;
    }
    else if (blueToUse >= greenToUse && blueToUse >= redToUse) {
        mostPromenentValue = blueToUse;
        colorToCheck = 2;
    }
    else {
        mostPromenentValue = greenToUse;
        colorToCheck = 1;
    }

    var redToMatch = colorToMatch[0];
    var greenToMatch = colorToMatch[1];
    var blueToMatch = colorToMatch[2];
    var rToGHigh = redToMatch / greenToMatch * (1 + percentMargin);
    var rToGLow = redToMatch / greenToMatch * (1 - percentMargin);
    var rToBHigh = redToMatch / blueToMatch * (1 + percentMargin);
    var rToBLow = redToMatch / blueToMatch * (1 - percentMargin);
    var gToBHigh = greenToMatch / blueToMatch * (1 + percentMargin);
    var gToBLow = greenToMatch / blueToMatch * (1 - percentMargin);

    var displayedCanvas = document.getElementById("displayedCanvas");
    var dispalyedCtx = canvas.getContext('2d');
    var displayedImageData = ctx.getImageData(0, 0, displayedCanvas.width, displayedCanvas.height);
    var displayedData = displayedImageData.data;
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var canvasToPut = canvas;
    var canvasToPutData = canvasToPut.getContext("2d");
    for (var i = 0; i < data.length; i += 4) {
        //if (data[i + 1] - colorMargin > data[i + 2] && data[i + 1] - colorMargin > data[i]) {
        var rToGTest = data[i] / data[i + 1];
        var rToBTest = data[1] / data[i + 2];
        var gToBTest = data[i + 1] / data[i + 2];
        if //(rToGTest < rToGHigh && rToGTest > rToGLow &&
            (rToBTest < rToBHigh && rToBTest > rToBLow) //&&)
            //gToBTest < gToBHigh && gToBTest > gToBLow)
        {
            var percentToUse = data[colorToCheck] / mostPromenentValue;
            displayedData[i] = redToUse * percentToUse;//(data[i] / redToUse) * redToUse;
            displayedData[i + 1] = greenToUse * percentToUse; //(data[i + 1] / greenToUse) * greenToUse;
            displayedData[i + 2] = blueToUse * percentToUse; //(data[i + 2] / blueToUse) * blueToUse;
            numPixels++;
        }
        else
        {

        }
    }
    displayedCtx.putImageData(displayedImageData, 0, 0);
    console.log("num pixels changed: " + numPixels);
    return (displayedImageData);
}









//rgb(3,2,1

var parseColor = function (colorToParse)
{
    var RstartIndex = colorToParse.indexOf('(') + 1;
    var RendIndex = colorToParse.indexOf(',');
    var redVal = parseInt(colorToParse.substring(RstartIndex, RendIndex));
    var GendIndex = colorToParse.indexOf(',',RendIndex + 1);
    var greenVal = parseInt(colorToParse.substring(RendIndex + 1, GendIndex));
    var BendIndex = colorToParse.indexOf(')');
    var blueVal = parseInt(colorToParse.substring(GendIndex + 1, BendIndex));
    var retValues = [];
    retValues[0] = redVal;
    retValues[1] = greenVal;
    retValues[2] = blueVal;
    return (retValues);
}




var main = function ()
{
    setUpCanvas();
    resetCanvas();
    setUpOptions();
    attachHandlers();
}

var previewChangeInnerColor = function(newInner)
{
    newInner.
    redToUse = newInner.R;
    greenToUse = 250;
    blueToUse = 151;
}

var previewChangeOuterColor = function (newOuter)
{
    changeColors(snapOuter,parseColor(newOuter), 0.2);
}

var changeOuterColor = function(newOuter)
{
    currentImageData = changeColors(snapOuter,parseColor(newOuter),0.2);
}

var changeInnerColor = function(newInner)
{

}

var attachHandlers = function () {
    var setUpElements = setInterval(function () {
        $('.colorOption').find('img').each(
      function () {
          clearInterval(setUpElements);
      }
      );
        $('.colorOption').mouseover(
            function () {
                var optionType = $(this).parent().parent().attr('id');
                if (optionType == "colorOptions1") {
                    previewChangeInnerColor($(this).children("img").css("background-color"));
                }
                else if (optionType == "colorOptions2") {
                    previewChangeOuterColor($(this).children("img").css("background-color"));
                }

            }
        );

        $('.colorOption').click(
            function () {
                var optionType = $(this).parent().parent().attr('id');
                if (optionType == "colorOptions1") {
                    changeInnerColor($(this).children("img").css("background-color"));
                }
                else if (optionType == "colorOptions2") {
                    changeOuterColor($(this).children("img").css("background-color"));
                }

            }
        );

        $('.colorOption').mouseleave(
            function () {
                resetColor();
            }
        );

    }, 100);
}

var resetColor = function()
{
    displayedCtx.putImageData(currentImageData, 0, 0);
}

var setUpOptions = function()
{
    $.get("buildACollar/options.html", function (data) {
        $('#colorOptions1').html(data);
        $('#colorOptions2').html(data);
    });
}

$(document).ready(main);