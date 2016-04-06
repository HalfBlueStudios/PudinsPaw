var step = function(step, stepNumber)
{
    this.stepRef = step;
    this.stepNum = stepNumber;
}

var onStep = 0;
var currentSteps = 0;
var allSteps = [];

var getAllSteps = function ()
{
    $('.allSteps').find('.step').each(
    function () {
        allSteps[currentSteps] = new step(this, currentSteps);
        currentSteps++;
    }
    );
}

var getStepId = function(stepToGet)
{
    for(var i = 0; i < allSteps.length; i++)
    {
        if(allSteps[i].stepRef == stepToGet)
        {
            return (i);
        }
    }
}

var setStepAsDone = function(stepToChange)
{
    $(stepToChange).find('.circle').css("background-color", "green");
    $(stepToChange).find('.circleConnectorLine').css("background-color", "green");
}

var setStepInProgress = function(stepToChange)
{
    $(stepToChange).find('.circle').css("background-color", "orange");
    $(stepToChange).find('.circleConnectorLine').css("background-color", "orange");
}

var setUpCircleSelector = function()
{
    $('.OptionSelector').css("width", "650px");
    $('.OptionSelector').css("height", "450px");
    $('.OptionSelector').css("border-radius", "50%");
    $('.OptionSelector').css("border-color", "orange");
    $('.OptionSelector').css("background-color", "red");
}

var setUpOptions = function(numToSet)
{
    var addString = "";
    var addClassString = "<div class=\"stepOption\"></div>";
    for(var i = 0; i < numToSet; i++)
    {
        addString += addClassString;
    }
    $('.optionSelector').html(addString);
}

var main = function ()
{
    getAllSteps();
    setUpOptions(4);
    $('.allSteps').find('.step').click( function () {
        setStepInProgress(this);
    });
    setStepInProgress(allSteps[0].stepRef);
    setUpCircleSelector();
    $('.optionSelector').children('.stepOption').each(function () {
    });
}

$(document).ready(main);