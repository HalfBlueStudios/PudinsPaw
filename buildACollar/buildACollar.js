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
    var percRedLow = redToMatch / total - redPerc;
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
    return (displayedImageData);
}

    var checkColorMatch = function(colorsToMatch, candidatePixel, percentMargin)
    {
        var percentToUse = 255 * percentMargin;
        var matchRed = colorsToMatch[0];
        var matchGreen = colorsToMatch[1];
        var matchBlue = colorsToMatch[2];

        var RToB_Ratio = matchRed / matchBlue;
        var RToG_Ratio = matchRed / matchGreen;
        var GToB_Ratio = matchGreen / matchBlue;

        var RToB_Distance = matchRed - matchBlue;
        var RToG_Distance = matchRed - matchGreen;
        var GToB_Distance = matchGreen - matchBlue;

        var candidateRed = candidatePixel[0];
        var candidateGreen = candidatePixel[1];
        var candidateBlue = candidatePixel[2];


        //are these affected by removing the absolute values?
        var RToB_Cand_Ratio = isNaN(candidateRed / candidateBlue) ? 0 : candidateRed / candidateBlue;
        var RToG_Cand_Ratio = isNaN (candidateRed / candidateGreen) ? 0 : candidateRed / candidateGreen;
        var GToB_Cand_Ratio = isNaN (candidateGreen / candidateBlue) ? 0 : candidateGreen / candidateBlue;

        var RToB_Cand_Distance = candidateRed - candidateBlue;
        var RToG_Cand_Distance = candidateRed - candidateGreen;
        var GToB_Cand_Distance = candidateGreen - candidateBlue;

        var RToBPerc = getPercentToColor(RToB_Distance, RToB_Ratio, RToB_Cand_Distance, RToB_Cand_Ratio);
        var RToGPerc = getPercentToColor(RToG_Distance, RToG_Ratio, RToG_Cand_Distance, RToG_Cand_Ratio);
        var GToBPerc = getPercentToColor(GToB_Distance, GToB_Ratio, GToB_Cand_Distance, GToB_Cand_Ratio);
        var totalPerc = RToBPerc + RToGPerc + GToBPerc;
        var percToUse = 2;
        if (RToBPerc < percToUse && RToGPerc < percToUse  && GToBPerc < percToUse) {
            return (true);
        }
            //console.log("R To B percent: " + RToBPerc);
            /*
            if(RToBCand < RToB + percentMargin && RToBCand > RToB - percentMargin &&
                RToGCand < RToG  + percentMargin && RToGCand > RToG - percentMargin &&
                GToBCand < GToB + percentMargin && GToBCand > GToB - percentMargin)
            {
                console.log("matching RG " + RToGCand + " to " + RToG);
                console.log("matching RB " + RToBCand + " to " + RToG);
                console.log("matching GB " + GToBCand + " to " + GToB); 
                return(true);
            }
            else
            {
                return(false);
            }
            */
            //console.log("R to b is " + RToBPerc + " beacuse " + RToB_Distance + " " + RToB_Ratio + " " + RToB_Cand_Distance + " " + RToB_Cand_Ratio);
            //console.log("R to g is " + RToGPerc);
            //console.log("G to B is " + GToBPerc);
            //console.log("returned false because " + totalPerc + " is greater than " + percentMargin);
        else
        {
            return (false);
        }

    }


    var getPercentToColor = function(colorDistance, colorRatio, candDistance, candRatio)
    {
        var multiplyByTwo = false;

        //getting ratio num
        var perRatio = 0;
        if ((colorRatio > 0 && candRatio < 0) || colorRatio < 0 && candRatio > 0)
        {
            perRatio = Math.abs(colorRatio) + Math.abs(candRatio);
        }
        else
        {
            perRatio = Math.abs(colorRatio - candRatio);
        }
        if (isNaN(Math.abs(colorDistance))) {
            alert("stop 1!");
        }


        //getting distance num
        if ((colorDistance < 0 && candDistance > 0) || (candDistance < 0 && colorDistance > 0))
        {
            //console.log("multiply by two....Activated!!!!!!");
            multiplyByTwo = true;
        }
        colorDistance = colorDistance;
        candDistance = candDistance;
        candDistance = (candDistance == 0) ? 1 : candDistance;
        var distance_perc = colorDistance / candDistance;
        if (distance_perc > 2)
        {
            var temp = distance_perc;
            var counter = 0;
            RToB_distance_perc = 0;
            temp--; //get rid of 1 to normalize
            while(temp > 1)
            {
                temp--;
                counter++;
                //console.log("in loop with " + candDistance + " temp is " + temp);
                distance_perc += colorDistance;
            }
            var ammountBetween = candDistance - (colorDistance * counter);
            var divideAmmount = (Math.abs(colorDistance - ammountBetween) == 0) ? 1 : (Math.abs(colorDistance - ammountBetween));
            if(isNaN(Math.abs(colorDistance - ammountBetween))) 
            {
                alert("stop 2!");
            }
            distance_perc += colorDistance / divideAmmount;
        }
        else if (distance_perc > 1)
        {
            var ammountBetween = candDistance - colorDistance;
            var divideAmmount = (Math.abs(colorDistance - ammountBetween) == 0) ? 1 : (Math.abs(colorDistance - ammountBetween));
            if (isNaN(Math.abs(colorDistance - ammountBetween))) {
                alert("stop 3!");
            }
            distance_perc = colorDistance / divideAmmount;
        }
        if (multiplyByTwo == true)
        {
            distance_perc *= 2;
        }
        //console.log(perRatio + " * " + distance_perc + " = " + (perRatio * distance_perc));
        return Math.abs(perRatio * distance_perc);
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
    changeColors(snapInner, parseColor(newInner), 200);
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
   changeColors(snapOuter,parseColor(newOuter), 0.4);
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