var ctx;
var canvas;
var baseImage;

var displayedCanvas;
var dispalyedCtx;

const IMAGE_WIDTH = 700;
const IMAGE_HEIGHT = 600;

var currentImageData;
var snapOuter = [81,155,80];
var snapInner = [47, 46, 77];

var currentInnerRGB;
var currentOuterRGB;

var canvasHeight;
var canvasPosition;

var chosenInnerColorObject;
var chosenOuterColorObject;

var chosenStyleObject;

var chosenTypeObject;

var chosenSizeObject;

const startPic = "buildACollar/baseTypeImages/snapBase.jpg"
const startPath = "buildACollar";


var setUpCanvas = function()
{
    $('#backgroundCanvas').css("width", IMAGE_WIDTH);
    $('#backgroundCanvas').css("height", IMAGE_HEIGHT);
    $('#backgroundCanvas').css("margin-right", "-" + IMAGE_WIDTH + "px");
    $('#displayedCanvas').css("width", IMAGE_WIDTH);
    $('#displayedCanvas').css("height", IMAGE_HEIGHT);
    canvas = document.getElementById("backgroundCanvas");
    ctx = canvas.getContext('2d');
    displayedCanvas = document.getElementById("displayedCanvas");
    displayedCtx = displayedCanvas.getContext('2d');
    canvasHeight = parseInt($('.previewCanvas').css('height'));
    canvasPosition = parseInt($('.previewCanvas').position().top);
}

var resetCanvas = function(newUrl)
{
    baseImage = new Image();
    baseImage.src = newUrl;
    baseImage.onload = function () {
        ctx.drawImage(baseImage, 0, 0, 200, 150);
        displayedCtx.drawImage(baseImage, 0, 0, 200, 150);
        currentImageData = displayedCtx.getImageData(0, 0, displayedCanvas.width, displayedCanvas.height);
    }
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


    var redPerc = 0;
    var bluePerc = 0;
    var greenPerc = 0;
    var colorToCheck;

    var redToMatch = colorToMatch[0];
    var greenToMatch = colorToMatch[1];
    var blueToMatch = colorToMatch[2];
    if (redToMatch >= blueToMatch && redToMatch >= greenToMatch) {
        mostPromenentValue = redToMatch;
        colorToCheck = 0;
    }
    else if (blueToMatch >= greenToMatch && blueToMatch >= redToMatch) {
        mostPromenentValue = blueToMatch;
        colorToCheck = 2;
    }
    else {
        mostPromenentValue = greenToMatch;
        colorToCheck = 1;
        var redPerc = percentMargin / 1.5;
        var bluePerc = percentMargin / 1.5;
        var greenPerc = percentMargin * 4;
    }
    var total = redToMatch + greenToMatch + blueToMatch;
    var percRedHigh = redToMatch / total  + redPerc;
    console.log("per red h: " + percRedHigh);
    var percRedLow = redToMatch / total - redPerc;
    console.log("per red l: " + percRedLow);
    var percGreenHigh = greenToMatch / total + greenPerc;
    var percGreenLow = greenToMatch / total  - greenPerc;
    var percBlueHigh = blueToMatch / total + bluePerc;
    var percBlueLow = blueToMatch / total - bluePerc;

    var displayedImageData = displayedCtx.getImageData(0, 0, displayedCanvas.width, displayedCanvas.height);
    var displayedData = displayedImageData.data;
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var canvasToPut = canvas;
    var canvasToPutData = canvasToPut.getContext("2d");
    for (var i = 0; i < data.length; i += 4) {
        //if (data[i + 1] - colorMargin > data[i + 2] && data[i + 1] - colorMargin > data[i]) {
        //if (data[i + colorToCheck] >= data[i] && data[i + colorToCheck] >= data[i + 1] && data[i + colorToCheck] >= data[i + 2]) {
        var currentPixel = [data[i], data[i + 1], data[i + 2]];
        if(checkColorMatch(colorToMatch, currentPixel,percentMargin) == true) 
        {
            var pixelTotal = data[i] + data[i + 1] + data[i + 2];
            var testRed = data[i] / pixelTotal;
            var testGreen = data[1 + 1] / pixelTotal;
            var testBlue = data[i + 2] / pixelTotal;
            //if (testRed < percRedHigh && testRed > percRedLow &&
            //    testGreen < percGreenHigh && testGreen > percGreenLow &&
            //    testBlue < percBlueHigh && testBlue > percBlueLow)
                //gToBTest < gToBHigh && gToBTest > gToBLow)
            //{
                var percentToUse = data[i + colorToCheck] / mostPromenentValue;
                displayedData[i] = redToUse * percentToUse;//(data[i] / redToUse) * redToUse;
                displayedData[i + 1] = greenToUse * percentToUse; //(data[i + 1] / greenToUse) * greenToUse;
                displayedData[i + 2] = blueToUse * percentToUse; //(data[i + 2] / blueToUse) * blueToUse;
                numPixels++;
            //}
        }
    }
    displayedCtx.putImageData(displayedImageData, 0, 0);
    console.log("num pixels changed: " + numPixels);
    return (displayedImageData);
}

    var checkColorMatch = function(colorsToMatch, candidatePixel, percentMargin)
    {
        matchRed = colorsToMatch[0];
        matchGreen = colorsToMatch[1];
        matchBlue = colorsToMatch[2];
        RToB = matchRed / matchBlue;
        RToG = matchGreen / matchGreen;
        GToB = matchGreen / matchBlue;

        candidateRed = candidatePixel[0];
        candidateGreen = candidatePixel[1];
        candidateBlue = candidatePixel[2];
        RToBCand = candidateRed / candidateBlue;
        RToGCand = candidateRed / candidateGreen;
        GToBCand = candidateGreen / candidateBlue;

        if(RToBCand < RToB * ( 1  +percentMargin) && RToBCand > RToB * (1 - percentMargin) &&
            RToGCand < RToG * ( 1  +percentMargin) && RToGCand > RToG * (1 - percentMargin) &&
            GToBCand < GToB * ( 1  +percentMargin) && GToBCand > GToB * (1 - percentMargin))
        {
            return(true);
        }
        else
        {
            return(false);
        }

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
    resetCanvas(startPic);
    setUpOptions();
    attachHandlers();
    currentImageData = displayedCtx.getImageData(0, 0, canvas.width, canvas.height);
}

var previewChangeInnerColor = function(newInner)
{
    changeColors(snapInner, parseColor(newInner), 0.2);
}

var changeInnerColor = function (innerObject)
{
    if (chosenInnerColorObject != null && chosenInnerColorObject != innerObject)
    {
        chosenInnerColorObject.children("img").css("border-style", "hidden");
    }
    innerObject.children("img").css("border-style", "solid");
    chosenInnerColorObject = innerObject;
    var newInner = innerObject.children("img").css("background-color");
    currentInnerRGB = newInner;
    currentImageData = changeColors(snapInner, parseColor(newInner), 0.2);
}


var previewChangeOuterColor = function (newOuter)
{
    changeColors(snapOuter,parseColor(newOuter), 0.05);
}

var changeOuterColor = function(outerObject)
{
    if (chosenOuterColorObject != null && chosenOuterColorObject != outerObject) {
        chosenOuterColorObject.children("img").css("border-style", "hidden");
    }
    outerObject.children("img").css("border-style", "solid");
    chosenOuterColorObject = outerObject;
    var newOuter = outerObject.children("img").css("background-color");
    currentOuterRGB = newOuter;
    currentImageData = changeColors(snapOuter,parseColor(newOuter),0.2);
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
                    changeInnerColor($(this));
                }
                else if (optionType == "colorOptions2") {
                    changeOuterColor($(this));
                }

            }
        );

        $('.colorOption').mouseleave(
            function () {
                resetColor();
            }
        );
        $('.styleOption').click(
            function () {
                changeStyle($(this));
            }
        );
        $('.typeOption').click(function(){
            changeType($(this));
        });
        /*
        $(window).scroll(function () {
            var positionToCompare = (canvasHeight /2 + canvasPosition);
            var windowScroll = parseInt($(window).scrollTop());
            if (windowScroll > positionToCompare)//(canvasHeight + canvasPosition));
            {
                console.log("found true!");
                $('.previewCanvas').css("position", "absolute");
                $('.allOptions').css("margin-top", canvasHeight);
                $(".previewCanvas").stop().animate({ "marginTop": ($(window).scrollTop() - positionToCompare) + "px"}, "fast");
            }
            else
            {
                $('.previewCanvas').css("top", "canvasPosition");
            }
        });
        */
    }, 100);
}

var changeStyle = function(newStyleObject)
{
    if (newStyleObject == chosenStyleObject)
    {
        return;
    }
    var picturePath = newStyleObject.css("background-image");
    var startPart = picturePath.indexOf(startPath);
    var endPart = picturePath.indexOf('"', startPart);
    picturePath = picturePath.substring(startPart, endPart);
    chosenStyleObject = newStyleObject;
    resetCanvas(picturePath);
}

var changeType = function(newTypeObject)
{
    if (newTypeObject == chosenTypeObject)
    {
        return;
    }
    var picturePath = newTypeObject.css("background-image");
    var startPart = picturePath.indexOf(startPath);
    var endPart = picturePath.indexOf('"', startPart);
    picturePath = picturePath.substring(startPart, endPart);
    chosenTypeObject = newPictureObject;
    resetCanvas(picturePath);
}

var resetColor = function()
{
    displayedCtx.putImageData(currentImageData, 0,0);
    console.log("putting back color!");
}

var setUpOptions = function()
{
    $('#colorOptions1').load("buildACollar/options.html #regularColors");
    $('#colorOptions2').load("buildACollar/options.html #regularColors");
    $('#styleSelectOptions').load("buildACollar/options.html #styles");
    $('#typeSelectOptions').load("buildACollar/options.html #types");
    $('#sizeSelectOptions').load("buildACollar/options.html #sizes");
}

$(document).ready(main);