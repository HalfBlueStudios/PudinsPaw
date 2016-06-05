const NAME_OF_COLOR_HOLDER = "colorOptions";
const NAME_OF_ALL_OPTIONS = ".allOptions"
const NAME_OF_CURRENT_SELECTION = ".currentSelectionChoice";
const NAME_OF_PREVIOUS_SELECTIONS = ".previousSelections";


var currentOptionNumber = 0;

var currentNumberOfColors = 0;

var ctx;
var canvas;
var baseImage;

var displayedCanvas;
var dispalyedCtx;

var coloringCanvas;
var coloringCtx;

const IMAGE_WIDTH = 700;
const IMAGE_HEIGHT = 600;

var currentImageData;

var DRAW_IMAGE_WIDTH = 200;
var DRAW_IMAGE_HEIGHT = 150;

var canvasHeight;
var canvasPosition;

var chosenColors = [];

var chosenStyleObject;

var chosenTypeObject;

var chosenSizeObject;
var pixelsToRecolorList = [DRAW_IMAGE_WIDTH * DRAW_IMAGE_HEIGHT];
var mostImportantValuesList = [] //list with the most important value, followed by the number(0-2 to signify red, green, or blue) that it will be compared with
                                //to find value for a certain color number, do colornum * 2;

const startPic = "homepage/images/snapbackProduct.png"; //"buildACollar/baseTypeImages/snapBase.jpg";
const startPath = "buildACollar";

var finishedLoading = true;

var setUpCanvas = function()
{
    $('#coloringCanvas').css("width", IMAGE_WIDTH); //coloring canvas used to load picture of new color/image and use that picture to recolor the collar
    $('#coloringCanvas').css("height", IMAGE_HEIGHT);
    $('#coloringCanvas').css("margin-top", "-" + IMAGE_HEIGHT + "px");

    $('#backgroundCanvas').css("margin-right", "-" + IMAGE_WIDTH + "px"); //used to hold the orignal collar so that changes are not permanent to canvas
    $('#backgroundCanvas').css("width", IMAGE_WIDTH);
    $('#backgroundCanvas').css("height", IMAGE_HEIGHT);
    $('#backgroundCanvas').css("margin-right", "-" + IMAGE_WIDTH + "px");
    $('#displayedCanvas').css("width", IMAGE_WIDTH); //what user sees, shows the preview of their order
    $('#displayedCanvas').css("height", IMAGE_HEIGHT);

    canvas = document.getElementById("backgroundCanvas");
    canvas.style.width = IMAGE_WIDTH / 2;
    canvas.style.height = IMAGE_HEIGHT / 2;
    ctx = canvas.getContext('2d');

    displayedCanvas = document.getElementById("displayedCanvas");
    displayedCtx = displayedCanvas.getContext('2d');
    displayedCanvas.style.width = IMAGE_WIDTH / 2;
    displayedCanvas.style.height = IMAGE_HEIGHT / 2;

    coloringCanvas = document.getElementById("coloringCanvas");
    coloringCtx = coloringCanvas.getContext('2d');
    coloringCanvas.style.width = IMAGE_WIDTH / 2;
    coloringCanvas.style.height = IMAGE_HEIGHT / 2;

    canvasHeight = parseInt($('.previewCanvas').css('height'));
    canvasPosition = parseInt($('.previewCanvas').position().top);
}

var resetCanvas = function(newUrl, callbackFunc, finalCallBackFunc)
{
    imageLoaded = false;
    baseImage = new Image();
    baseImage.src = newUrl;
    baseImage.onload = function () {
        displayedCtx.clearRect(0, 0, DRAW_IMAGE_WIDTH, DRAW_IMAGE_HEIGHT);
        ctx.drawImage(baseImage, 0, 0, DRAW_IMAGE_WIDTH, DRAW_IMAGE_HEIGHT);
        displayedCtx.drawImage(baseImage, 0, 0, DRAW_IMAGE_WIDTH, DRAW_IMAGE_HEIGHT);
        currentImageData = displayedCtx.getImageData(0, 0, displayedCanvas.width, displayedCanvas.height);
        callbackFunc(finalCallBackFunc);
    }
}

//loads new color, then calls changeColor when completed loading
var loadNewColor = function(newUrl, colorNum, percentMargin, permChangeColor)
{
    colorImage = new Image();
    colorImage.src = newUrl;
    console.log("starting new load of " + newUrl + " ...");
    colorImage.onload = function () {
        coloringCtx.drawImage(colorImage, 0, 0, DRAW_IMAGE_WIDTH, DRAW_IMAGE_HEIGHT);
        if (permChangeColor == true)
        {
            currentImageData = changeColors(colorNum, percentMargin);
        }
        else
        {
            changeColors(colorNum, percentMargin);
        }
    };
}

var drawImage = function () {
    ctx.drawImage(imageToUse, 0, 0);
}

var adjectPixelFoundCheck = function(pixelNum, foundPixelList)
{
    var listToCheck = getAdjacentPixelList(pixelNum);
    var retVal = 1;
    for (var i = 0; i < listToCheck.length; i++)
    {
        if (foundPixelList[listToCheck[i]] == true)
        {
            //console.log(listToCheck + " is not colored in adjancency to ");
            retVal++;
        }
        else
        {
            //console.log(listToCheck + " is not colored in adjancency to ");
        }
    }
    return (retVal);
}

var getAdjacentPixelList = function(indexPix)
{
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var retList = [];
    retList.push(indexPix);
    var leftEdgePixel = false;
    var rightEdgePixel = false;
    if(indexPix % canvasWidth == 0)
    {
        leftEdgePixel = true;
    }
    else if(indexPix + 1 % canvasWidth == 0)
    {
        rightEdgePixel = true
    }
    if(indexPix - canvasWidth >= 0)
    {
        retList.push(indexPix - canvasWidth);
    }
    if(indexPix + canvasWidth <= (canvasHeight * canvasWidth))
    {
        retList.push(indexPix + canvasWidth);
    }
    //console.log("at this point we have length of " + retList.length + " with leftedge being " + leftEdgePixel + " and right edge being " + rightEdgePixel);
    retList.forEach(function (pixNumber) {
        if(leftEdgePixel == false)
        {
            retList.push(pixNumber - 1);
        }
        if(rightEdgePixel == false)
        {
            retList.push(pixNumber + 1);
        }
    });
    return (retList);
}

var getXYCordinate = function(numToCheck)
{ 
    width = IMAGE_WIDTH;
    orgY = (numToCheck / width);
    retY = (numToCheck / width).toFixed(0);
    if (retY > orgY)
    {
        retY--;
    }
    retX = numToCheck - (width * retY);
    var retArray = [];
    retArray[0] = retX; 
    retArray[1] = retY;
    return(retArray);
}

var changeColors = function (colorNum, percentMargin)
{
    var displayedImageData = displayedCtx.getImageData(0, 0, displayedCanvas.width, displayedCanvas.height);
    var displayedData = displayedImageData.data;

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var coloringImageData = coloringCtx.getImageData(0, 0, canvas.width, canvas.height);
    var coloringData = coloringImageData.data;

    var numPixels = 0;
    for (var i = 0; i < data.length; i += 4)
    {
        var pixelIndex = i / 4;
        if (pixelsToRecolorList[colorNum][pixelIndex] == true)
        {
            var redToUse = coloringData[i];
            var greenToUse = coloringData[i + 1];
            var blueToUse = coloringData[i + 2];
            var percentToUse = data[i + mostImportantValuesList[colorNum * 2]] / mostImportantValuesList[(colorNum * 2) - 1];
            displayedData[i] = redToUse * percentToUse
            displayedData[i + 1] = greenToUse * percentToUse;
            displayedData[i + 2] = blueToUse * percentToUse;
            numPixels++;
        }
    }
    displayedCtx.putImageData(displayedImageData, 0, 0);
    return (displayedImageData);
}

var resetStyle = function()
{
    pixelsToRecolorList = [];
    mostImportantValuesList = [];
}

var parsePicture = function(colorToMatch, colorNum, percentMargin)
{
    var redToMatch = colorToMatch[0];
    var greenToMatch = colorToMatch[1];
    var blueToMatch = colorToMatch[2];

    var mostPromenentValue = getMostPromenentValue(colorToMatch);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) 
    {
        var currentPixel = [data[i], data[i + 1], data[i + 2]];
        var pixelIndex = i / 4;
        checkPixel(colorToMatch,data, pixelIndex, getMostPromenentValue(colorToMatch), colorNum, percentMargin); //checks pixel and updates its list
    }

}

var getMostPromenentValue = function(colorToCheck)
{
    if (colorToCheck[0] >= colorToCheck[2] && colorToCheck[0] >= colorToCheck[1]) 
    {
        return(1);
    }
    else if (colorToCheck[1] >= colorToCheck[2] && colorToCheck[1] >= colorToCheck[0]) 
    {
        return(1);
    }
    else 
    {
        return(2);
    }
}

//checks to see if the pixel should be changed in recoloring or not
var checkPixel = function(colorToMatch, data, pixIndex, mostPromenentValue, colorNumber, percentMargin)
{
    var translatedPixPosition = pixIndex * 4;
    var candidateColors = [];
    candidateColors[0] = data[translatedPixPosition];
    candidateColors[1] = data[translatedPixPosition + 1];
    candidateColors[2] = data[translatedPixPosition + 2];

    if (checkColorMatch(colorToMatch, candidateColors, percentMargin, pixIndex, pixelsToRecolorList[colorNumber]) == true)
    {
        (pixelsToRecolorList[colorNumber])[pixIndex] = true;
        recheckAdjacentPixels(colorToMatch, data, pixIndex, mostPromenentValue, colorNumber, percentMargin);
    }
    else
    {
        (pixelsToRecolorList[colorNumber])[pixIndex] = false;
    }
}

var recheckAdjacentPixels = function (colorToMatch, data, pixIndex, mostPromenentValue, colorNumber, percentMargin)
{
    adjacent = getAdjacentPixelList(pixIndex);
    for(i = 0; i < adjacent.length; i++)
    {
        pixIndexToCheck = adjacent[i];
        if(pixelsToRecolorList[colorNumber][pixIndexToCheck] != true)
        {
            //console.log("rechecking " + pixIndexToCheck);
            checkPixel(colorToMatch, data, pixIndexToCheck, mostPromenentValue, colorNumber, percentMargin);
            if(pixelsToRecolorList[colorNumber][pixIndexToCheck] == true)
            {
                //console.log("changed pixel!");
            }
        }
    }
}

//returns true if color should be changed, false otherwise
var checkColorMatch = function(colorsToMatch, candidatePixel, percentMargin, placeInArray, arrayToUse)
    {
        //if color doesn't even romtely match, don't waste resources on other checks
        if (initialColorCheck(colorsToMatch, candidatePixel, placeInArray, arrayToUse) == false)
        {
            return;
        }
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
        var numAdj = adjectPixelFoundCheck(placeInArray, arrayToUse);
        var percToUse = percentMargin * numAdj; //30 * numAdj;
        if (RToBPerc < percToUse && RToGPerc < percToUse  && GToBPerc < percToUse) {
            return (true);
        }
        else
        {
            return (false);
        }

    }

var initialColorCheck = function(colorsToMatch, candidatePixel, pixelIndex, foundPixelList)
    {
        var redColor = colorsToMatch[0];
        var greenColor = colorsToMatch[1];
        var blueColor = colorsToMatch[2];

        var candRed = candidatePixel[0];
        var candGreen = candidatePixel[1];
        var candBlue = candidatePixel[2];

        var marginToCheck = .4;
        var numAdjacent = adjectPixelFoundCheck(pixelIndex, foundPixelList);
        marginToCheck /= numAdjacent;
        var impColor = findMostImportantColor(colorsToMatch);

        if (((candidatePixel[0] + (Math.abs(colorsToMatch[impColor] - colorsToMatch[0])) * marginToCheck) < candidatePixel[impColor] || impColor == 0) &&
            ((candidatePixel[1] + (Math.abs(colorsToMatch[impColor] - colorsToMatch[1])) * marginToCheck) < candidatePixel[impColor] || impColor == 1) &&
            ((candidatePixel[2] + (Math.abs(colorsToMatch[impColor] - colorsToMatch[2])) * marginToCheck) < candidatePixel[impColor] || impColor == 2)
            )
        {
            return (true);
        }
        else
        {
            return (false);
        }



    }

var findMostImportantColor = function(colorToMatch)
    {
        var redToMatch = colorToMatch[0];
        var greenToMatch = colorToMatch[1];
        var blueToMatch = colorToMatch[2];
        if (redToMatch >= blueToMatch && redToMatch >= greenToMatch) {
            mostPromenentValue = redToMatch;
            return(0);
        }
        else if (greenToMatch >= blueToMatch && greenToMatch >= redToMatch) {
            
            return(1);
        }
        else {
            return (2);
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
        var distance_perc = Math.abs(colorDistance / candDistance);
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
            distance_perc += Math.abs(colorDistance / divideAmmount);
        }
        else if (distance_perc > 1)
        {
            var ammountBetween = candDistance - colorDistance;
            var divideAmmount = (Math.abs(colorDistance - ammountBetween) == 0) ? 1 : (Math.abs(colorDistance - ammountBetween));
            distance_perc = Math.abs(colorDistance / divideAmmount);
        }
        if (multiplyByTwo == true)
        {
            distance_perc *= 2;
        }
        //console.log(perRatio + " * " + distance_perc + " = " + (perRatio * distance_perc));
        return Math.abs(perRatio * distance_perc);
    }

/*------------------Selection made------------------------------------
    Function to change the current selection into previous selection list
    then animates previous selection list down to accomidate new selection
    finally loads new option into current selectiom

    THIS CLASS HAS DANGER OF STACK OVERFLOW DUE TO RECURSIVE NATURE
*/
var selectionMade = function(classToFetch, finalCallBack)
{
    console.log("class to fetch is " + classToFetch);
    if (classToFetch == undefined) //no paramater passed
    {
        classToFetch = "";
    }
    var setOfOptions = $(NAME_OF_ALL_OPTIONS).children();
    for (i = currentOptionNumber; i < setOfOptions.length; i++)
    {
        var nextOption = setOfOptions.eq(i);
        if (nextOption.attr('class') != undefined && nextOption.attr('class').includes(classToFetch) == true) {
            console.log("new selection name: " + nextOption.attr('class') + " with height of " + nextOption.css("height"));
            $(NAME_OF_CURRENT_SELECTION).animate({ marginTop: "+=" + nextOption.css("height") }, 1000, function () {
                finishSelection(nextOption, finalCallBack);
            });
            currentOptionNumber = i + 1;
            return;
        }
    }
}

/*-----------------------finish Selection-----------------------------------
    Sister function to selectionMade
    Executes once the animation for selecting an option has completed
    finishes change the styles and loads in new one
*/
var finishSelection = function(nextOption, finalCallBack)
{
    console.log("in finished selection");
    $(NAME_OF_PREVIOUS_SELECTIONS).prepend($(NAME_OF_CURRENT_SELECTION).html());
    $(NAME_OF_CURRENT_SELECTION).css("margin-top", "-=" + nextOption.css("height"));
    var classDec = "<div style=\"opacity:0\" class = '" + nextOption.attr('class') + "'>"
    $(NAME_OF_CURRENT_SELECTION).html(classDec + nextOption.html());
    var newSelection = $(NAME_OF_CURRENT_SELECTION).find("." + nextOption.attr('class'));
    if (newSelection == undefined)
    {
        console.log("undefined!");
    }
    else
    {
        console.log("class: " + newSelection.attr('class'));
    }
    checkIfPopUpReady();
    newSelection.stop().animate({ opacity: 1 }, 500, function () //CHANGE BACK TO 8000
    {
        if (finalCallBack != undefined) {
            finalCallBack();
        }
    });
}

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

var main = function (startingName)
{
    setUpCanvas();
    setUpOptions();
    //setUpPopUp();
    attachHandlers();
    selectionMade(undefined,partial(checkPreSelectedArgs, startingName)); //displays first set of options    
    //loadDefaultOptions();
}

var loadDefaultOptions = function()
{
    var numX = 0;
    var loadDefaults = setInterval(function () {
        var styleOption = $('.styleOption').first();
        if(styleOption != undefined)
        {
            selectionMade();
            clearInterval(loadDefaults);
        }
    }, 100);
}

var previewChangeColor = function(newColorObj)
{
    var newPicUrl = getBackgroundImageFromUrl(newColorObj.children("img").css("background-image"));
    var optionType = newColorObj.parent().parent().attr('id');
    var colorNum = optionType[optionType.length - 1]; //gets what number color the color selected belongs to
    loadNewColor(newPicUrl, colorNum, 0.2, false);
}

var changeColor = function(newColorObj)
{
    var newPicUrl = getBackgroundImageFromUrl(newColorObj.children("img").css("background-image"));
    var optionType = newColorObj.parent().parent().attr('id');
    var colorNum = optionType[optionType.length - 1]; //gets what number color the color selected belongs to
    var colorName = newColorObj.children("h1").html();
    if (chosenColors[colorNum] == newColorObj) //color already selected
    {
        return;
    }
    else
    {
        if (chosenColors[colorNum] != undefined)
        {
            if ( $(NAME_OF_CURRENT_SELECTION).find('.' + chosenColors[colorNum].attr("class")).attr("class") == undefined)
            {
                var allColors = $(NAME_OF_PREVIOUS_SELECTIONS).find('.' + chosenColors[colorNum].attr("class"));
                var currentSelection = allColors.first();
                var num = 0;
                while(currentSelection.attr('class') != undefined)
                {
                    if(getBackgroundImageFromUrl(currentSelection.children("img").css("background-image")) == chosenColors[colorNum].children("img").css("background-image"))
                    {
                        chosenColors[colorNum] = currentSelection;
                        break;
                    }
                    else
                    {
                        console.log("compared " + getBackgroundImageFromUrl(currentSelection.children("img").css("background-image")) + " and " + chosenColors[colorNum].children("img").css("background-image"));
                    }
                    num++;
                    currentSelection = allColors.eq(num);
                }
            }
            else
            {
                console.log("id found is " + $(NAME_OF_CURRENT_SELECTION).find('#' + chosenColors[colorNum].attr("id")).attr("id"));
            }
            console.log("defined!");
            chosenColors[colorNum].children("img").css("border-style", "none"); //gets rid of visual selector on old selection
        }
        console.log("undefined!");
        chosenColors[colorNum] = newColorObj;
    }
    chosenColors[colorNum].children("img").css("border-style", "solid");
    loadNewColor(newPicUrl, colorNum, 0.2, true);
}

var checkIfAllColorsSelected = function()
{
    var totalColors = chosenColors[0];
    for(i = 1; i <= totalColors; i++)
    {
        if(chosenColors[i] == undefined)
        {
            console.log("not all colors selected!");
            return; //not all colors chosen yet
        }
    }
    console.log("all colors selected!");
    selectionMade();
}

var attachHandlers = function () {
        /*----------------color select handlers------------------*/
        $(NAME_OF_CURRENT_SELECTION).on("mouseover", ".colorOption", 
            function () {
                previewChangeColor($(this));

            }
        );

        $(NAME_OF_CURRENT_SELECTION).on("mouseleave", ".colorOption",
        function () {
            resetColor();
        }
        );

        $(NAME_OF_PREVIOUS_SELECTIONS).on("mouseover", ".colorOption",
        function () {
            previewChangeColor($(this));
        }
        );

        $(NAME_OF_PREVIOUS_SELECTIONS).on("mouseleave", ".colorOption",
        function () {
            resetColor();
        }
        );


        $(NAME_OF_CURRENT_SELECTION).on("click",".colorOption",
            function () {
                changeColor($(this));
                checkIfAllColorsSelected();
            }
        );

        $(NAME_OF_PREVIOUS_SELECTIONS).on("click", ".colorOption",
                function () {
                    changeColor($(this));
                }
            );

        /*--------------------style option handlers-----------------*/

        var currentStyleFunc = function (evt) {
            changeStyle($(this), selectionMade);
            $(this).css("color", "teal");
        };
        $(NAME_OF_CURRENT_SELECTION).one("click", ".styleOption", currentStyleFunc);

        $(NAME_OF_PREVIOUS_SELECTIONS).on("click", ".styleOption",
           function (evt) {
               changeStyle($(this), resizeColorOptions);
           });

        /*-----------------type option handlers--------------------*/
        $(NAME_OF_CURRENT_SELECTION).on("click", ".typeOption",
            function (evt) {
                $(this).css("color", "teal");
                if ($(this).find("load").first().parent().attr("class") != undefined) {
                    var functionName = $(this).find("load").first().html();
                    eval(functionName);
                }
                else {
                    selectionMade();
                }
            //changeType($(this));
            });

        $(NAME_OF_PREVIOUS_SELECTIONS).on("click", ".typeOption",
            function (evt) {
                console.log("click! type");
                //changeType($(this));
            });

        /*----------------size option handlers---------------------*/
        $(NAME_OF_CURRENT_SELECTION).on("click", ".sizeOption",
               function () {
                   selectionMade();
               }
           );

}

var changeStyle = function(newStyleObject, finalCallBackFunc)
{
    console.log("changing style!");
    if (newStyleObject == chosenStyleObject)
    {
        return;
    }
    var picturePath = getBackgroundImageFromUrl(newStyleObject.css("background-image"));
    chosenStyleObject = newStyleObject;
    resetCanvas(picturePath, finishChangingStyle, finalCallBackFunc);
}

//second half to change style function - gets called once loading of picture completes
var finishChangingStyle = function(finalCallBackFunc)
{
    resetStyle();
    var numColors = 0;
    chosenStyleObject.find('color').each(function () {
        numColors++;
        if (numColors > currentNumberOfColors)
        {
            addNewColorOptionRow(numColors);
        }
        var newArray = [DRAW_IMAGE_WIDTH * DRAW_IMAGE_HEIGHT];
        for (var i = 0; i < newArray.length; i++)
        {
            newArray[i] = false;
        }
        pixelsToRecolorList[numColors] = newArray;
        //gets new colors from options.html file, alpha is the percentage match to use
        var newColors = (parseColor($(this).css("background-color")));
        var mostImpVal = getMostPromenentValue(newColors);
        mostImportantValuesList[(numColors * 2) - 1] = newColors[mostImpVal];
        mostImportantValuesList[numColors * 2] = mostImpVal;
        parsePicture(parseColor($(this).css("background-color")), numColors, $(this).text()); //still need to insert right percent margin
        //TODO: SET NUMBER OF COLORS BASED ON NUM COLORS
    })
    chosenColors[0] = numColors;
    loadAllColors(numColors, finalCallBackFunc);
}

var addNewColorOptionRow = function(colorNum)
{
    console.log("adding new color " + colorNum);
    $("." + NAME_OF_COLOR_HOLDER).append("<div class=\"pictureOptionBox\">" +
                                         "<h1>Select the " + colorNum + getNumberEnding(colorNum) + " color</h1>" +
                                         "<div class=\"pictureOptions\" id=\"colorOptionBox" + colorNum + "\"></div>" + 
                                         "</div>"
     );
    

}

var getNumberEnding = function(numToCheck)
{
    if(numToCheck == 1)
    {
        return "st";
    }
    if(numToCheck == 2)
    {
        return "nd";
    }
    if( numToCheck == 3)
    {
        return "rd";
    }
    else
    {
        return "th";
    }
}

var getBackgroundImageFromUrl = function(strToUse)
{
    var startPart = strToUse.indexOf(startPath);
    var endPart = strToUse.indexOf('"', startPart);
    return(strToUse.substring(startPart, endPart));
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
    chosenTypeObject = newTypeObject;
    resetCanvas(picturePath);
}

var resetColor = function()
{
    displayedCtx.putImageData(currentImageData, 0,0);
}

//loads color options into each option box
var loadAllColors = function(numColors, finalCallBackFunc)
{
        if (numColors < currentNumberOfColors)
        {
            var numColorsToChange = currentNumberOfColors - (numColors);
            var colorsRemoved = 0;
            var objectsToRemove = [];
            for(i = currentNumberOfColors; i > numColors; i--)
            {
                var searchString = '#colorOptionBox' + i;
                var animationObj = $('.colorOptions').find(searchString).parent();
                animationObj.css("overflow", "hidden");
                animationObj.css("position", "relative");
                animationObj.css("position", "absoltute");
                console.log("before animation!");
                animationObj.first().stop().animate({ left: "3000px" }, 1000, function () {
                    console.log("done with animation!");
                    colorsRemoved++;
                    objectsToRemove[objectsToRemove.length] = $(this);
                    if (colorsRemoved == numColorsToChange)
                    {
                        var heightChange = (numColorsToChange * parseInt($(this).css("height")) + "px");
                        $(NAME_OF_PREVIOUS_SELECTIONS).css("margin-top", heightChange);
                        for (k = 0; k < objectsToRemove.length; k++)
                        {
                            objectsToRemove[k].remove();
                        }
                       $(NAME_OF_PREVIOUS_SELECTIONS).animate({marginTop: "0px"}, 1000);
                    }
                });
            }
            console.log("num colors before is " + numColors);
            currentNumberOfColors = numColors;
        }
        else if(numColors > currentNumberOfColors)
        {
            var numLoaded = 0;
            for (i = 1; i <= numColors; i++) {
                var searchString = '#colorOptionBox' + i;
                $('.colorOptions').find(searchString).each(function () {
                    $(this).load("buildACollar/options.html #regularColors", function()
                    {
                        numLoaded++;
                        console.log("numloaded is " + numLoaded + " and num colors is " + numColors);
                        if (numLoaded == numColors) {
                            console.log("num loaded before is " + numLoaded);
                            currentNumberOfColors = numLoaded;
                            if (finalCallBackFunc != null) {
                                finalCallBackFunc();
                            }
                        }
                        return;
                    });
                }
                );
            }
        }
}

/*---------------resize color options-------------------
    Function to move previous selections down to accomidate more color options
    WILL HAVE TO BE CHANGED ONCE ALL COLORS ARE IN THE PREVIOUS COLOR SELECTION PART
*/
var resizeColorOptions = function()
{
    var newNumColors = $(NAME_OF_CURRENT_SELECTION).find(".pictureOptionBox");
    var startNum = currentNumberOfColors;
    var ammountToMove = 0;
    var boxesHidden = [];
    for (i = startNum; i < newNumColors.length; i++)
    {
        var newColorBox = newNumColors.eq(i);
        ammountToMove += parseInt(newColorBox.css("height"));
        ammountToMove += parseInt(newColorBox.css("margin-bottom"));
        newColorBox.css("opacity", "0");
        newColorBox.css("position", "absolute");
        console.log("ammount to move is " + ammountToMove);
        boxesHidden[boxesHidden.length] = newColorBox;
    }
    console.log("AMMOUNT TO MOVE IS " + ammountToMove);
    $(NAME_OF_PREVIOUS_SELECTIONS).animate({ marginTop: "+=" + ammountToMove }, 1000, function ()
    {
        for(i = 0; i < boxesHidden.length; i++)
        {
            boxesHidden[i].css("position", "relative");
            console.log("setting " + i + " to relative");
            boxesHidden[i].animate({ opacity: +1000 }, 8000)
        }
        $(NAME_OF_PREVIOUS_SELECTIONS).css("margin-top", "-=" + ammountToMove + "px");
    });
}

var checkIfPopUpReady = function()
{
    var popUp = $(NAME_OF_CURRENT_SELECTION).find(".measuringPopUp").first();
    if (popUp.attr('class') != undefined)
    {
        $("#dialog").dialog();
        var zinTimer = setInterval(function () {
            $('#dialog').zIndex(20);
                console.log("current index is " + $('#dialog').zIndex());
        }, 200);
    }
}

var setUpOptions = function()
{
    $('#styleSelectOptions').load("buildACollar/options.html #styles");
    $('#typeSelectOptions').load("buildACollar/options.html #types");
    $('#sizeSelectOptions').load("buildACollar/options.html #allSizes");
}

var setUpPopUp = function(popUpHolder)
{
    $(".ui-dialog").css("position", "absolute");
    $(".ui-dialog").css("width", "1000px");
    $(NAME_OF_CURRENT_SELECTION).find("#dialog").dialog({
        position: {
            my: "middle",
            at: "top+25%",
            of: $(".content"),
            collision: "none",
  
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'relative');
            $(event.target).parent().css('z-index', '10');
        },
        modal: false,
        resizable: false,
        closeOnEscape: false,
        autoOpen: false,
        height: 500,
        width: 500,
        dialogClass: "dialog",
        //show: {effect: 'bounce', duration: 350, times: 3}
        show: { effect: 'fade', duration: 1000 }
    });
   
    $(".ui-dialog-titlebar").css("display", "block");
    $(".ui-dialog-title").css("background-color", "red");
    $(".ui-dialog-title").css("font-size", "35px");
    $(".ui-dialog-title").css("background-color", "red");
    $(".ui-widget-header").css("display", "block");
    $(".ui-widget-content").css("background-color", "darkgrey");
    $(".ui-widget-content").css("font-size", "12px");
    $(".ui-corner-all").css("background-color", "darkgrey");
    $(".ui-resizable-n").css("background-image", "none");
}

var startFunc = function (startingName)
{
    $(document).ready(function ($) {
        main(startingName);
    });
}

/*-----------------check pre selected args -------------------------
    function to check arguments selected on the homepage 
    automatically makes the selections if they exist
*/
var checkPreSelectedArgs = function(allArgs)
{
    //USING TIMEOUTS TO SELECT THE NEXT ITEM IN THE LIST?
    console.log("in check args! with length of " + allArgs.length);
    for(i = 0; i < allArgs.length; i++)
    {
        var allChildren = $(NAME_OF_CURRENT_SELECTION).children();
        console.log("all children length is " + allChildren.length);
        for(k = 0; k < allChildren.length; k++)
        {
            var currentCheck = allChildren.eq(k);
            var allText = currentCheck.find("h1");
            for (j = 0; j < allText.length; j++)
            {
                var innerText = allText.eq(j).html();
                console.log("checking " + innerText + " against " + allArgs[i]);
                if (innerText == allArgs[i])
                {
                    console.log("FOUND ARG " + innerText);
                    allText.eq(j).parent().trigger("click", function () {
                        console.log("finished with the trigger!");
                    });
                }

            }
        }
    }
}

/*------------------helper functions-------------------*/
function partial(func /*, 0..n args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
}