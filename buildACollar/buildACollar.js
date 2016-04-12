
var currentcolor;

var selectedBarName = ".selectedBar";

var maginOfError = 120;
var mainColorMargin = 100;

var colorMargin = 10;

var outerRedValue = 118;
var outerGreenValue = 195;
var outerBlueValue = 101;

var outerRedToUse = 2;
var outerGreenToUse = 250;
var outerBlueToUse = 151;

var mostPromenentValue = outerRedToUse;

var ctx;
var canvas;
var baseImage;

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 800;


var setUpCanvas = function()
{
    $('#imageCanvas').css("width", IMAGE_WIDTH);
    $('#imageCanvas').css("height", IMAGE_WIDTH);
    canvas = document.getElementById("imageCanvas");
    ctx = canvas.getContext('2d');
}

var resetCanvas = function()
{
    baseImage = new Image();
    baseImage.src = "buildACollar/baseTypeImages/snapBase.jpg";
    baseImage.onload = function () {
        ctx.drawImage(baseImage, 0, 0, 300, 300);
    }
}


var drawImage = function () {
    ctx.drawImage(imageToUse, 0, 0);
}

var ChangeColor = function () {
    var mostPromenentValue;
    if (outerRedToUse >= outerBlueToUse && outerRedToUse >= outerGreenToUse) {
        mostPromenentValue = outerRedToUse;
    }
    else if (outerBlueToUse >= outerGreenToUse && outerBlueToUse >= outerRedToUse) {
        mostPromenentValue = outerBlueToUse;
    }
    else {
        mostPromenentValue = outerGreenToUse;
    }
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var canvasToPut = document.getElementById("lastCanvas");
    var canvasToPutData = canvasToPut.getContext("2d");
    for (var i = 0; i < data.length; i += 4) {
        if (data[i + 1] - colorMargin > data[i + 2] && data[i + 1] - colorMargin > data[i]) {
            var percentToUse = data[i + 1] / mostPromenentValue;
            data[i] = outerRedToUse * percentToUse;//(data[i] / redToUse) * redToUse;
            data[i + 1] = outerGreenToUse * percentToUse; //(data[i + 1] / greenToUse) * greenToUse;
            data[i + 2] = outerBlueToUse * percentToUse; //(data[i + 2] / blueToUse) * blueToUse;
        }
    }
    canvasToPutData.putImageData(imageData, 0, 0);
}















var main = function ()
{
    setUpCanvas();
    resetCanvas();
    setUpOptions();
    attachHandlers();
}

var changeInnerColor = function(newInner)
{
    alert("new inner is " + newInner);
    newInner.
    redToUse = newInner.R;
    greenToUse = 250;
    blueToUse = 151;

    var mostPromenentValue = redToUse;
}

var changeOuterColor = function (newInner)
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
                    changeInnerColor($(this).children("img").css("background-color"));
                }
                else if (optionType == "colorOptions2") {
                    changeOuterColor($(this).children("img").css("background-color"));
                }

            }
        );

    }, 100);
}

var setUpOptions = function()
{
    $.get("buildACollar/options.html", function (data) {
        $('#colorOptions1').html(data);
        $('#colorOptions2').html(data);
    });
}

$(document).ready(main);