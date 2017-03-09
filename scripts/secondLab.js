/**
 * Created by Freyk on 28.02.2017.
 */

var vertPipes = [];
var horzPipes = [];

//Базовые установки
var animationSpeed = 10;
var firstPouDelay = 100;
var secondPouDelay = 100;
var thirdPouDelay = 100;
var fourthPouDelay = 100;
var gomogDelay = 1000;
var separatorDelay = 100;
var viderjDelay = 100;

var mainPipes;
for(var i=1; i<14; i++)
{
    vertPipes[i] = document.getElementById('vertPipe'+i);
}
for(var j=1; j<13; j++)
{
    horzPipes[j] = document.getElementById('horzPipe'+j);
}
var correctPipes = [vertPipes[1],
    horzPipes[1],
    vertPipes[2],
    horzPipes[2],
    vertPipes[3],
    horzPipes[3],
    horzPipes[4],
    vertPipes[5],
    vertPipes[9],
    horzPipes[9],
    horzPipes[10],
    vertPipes[11],
    horzPipes[11],
    vertPipes[10],
    vertPipes[6],
    vertPipes[7],
    horzPipes[5],
    horzPipes[6],
    vertPipes[12],
    horzPipes[12],
    vertPipes[13]
];
var inCorrectPipes = [vertPipes[1],
    horzPipes[1],
    vertPipes[2],
    horzPipes[2],
    vertPipes[3],
    horzPipes[3],
    horzPipes[4],
    vertPipes[5],
    vertPipes[9],
    horzPipes[9],
    horzPipes[10],
    vertPipes[11],
    horzPipes[11],
    vertPipes[10],
    vertPipes[6],
    vertPipes[7],
    horzPipes[5],
    horzPipes[8],
    vertPipes[8],
    horzPipes[7],
    vertPipes[4]

];
var againCorrectPipes = [
    horzPipes[3],
    horzPipes[4],
    vertPipes[5],
    vertPipes[9],
    horzPipes[9],
    horzPipes[10],
    vertPipes[11],
    horzPipes[11],
    vertPipes[10],
    vertPipes[6],
    vertPipes[7],
    horzPipes[5],
    horzPipes[6],
    vertPipes[12],
    horzPipes[12],
    vertPipes[13]
];
var iterator;
function start() {
    mainPipes = correctPipes;
    iterator = 0;
    pipeAnimation();
}
function startWithError() {
    mainPipes = inCorrectPipes;
    iterator = 0;
    pipeAnimation();
}
function startAgain() {
    mainPipes = againCorrectPipes;
    iterator = 0;
    pipeAnimation();
}

function pipeAnimation() {
    var pipe = mainPipes[iterator];
    var internalPipe = pipe.firstElementChild;
    var lenght = internalPipe.getAttribute('data-lenght');
    var isVertical = internalPipe.className == "innerPipesVert";

    var id = setInterval(frame, animationSpeed);

    function frame() {
        var value;
        if(isVertical)
            value = internalPipe.style.height;
        else
            value = internalPipe.style.width;
        if(value != '')
            value = value.substring(0, value.length - 2);

        if (+value >= lenght) {
            iterator++;
            if(iterator < mainPipes.length)
                pipeAnimation();
            clearInterval(id);
        } else {
            if(isVertical)
            {
                if(value == '')
                    internalPipe.style.height = 1 + 'px';
                else
                {
                    value = 1 + +value;
                    internalPipe.style.height = value + 'px';
                }
            }
            else 
            {
                if(value == '')
                    internalPipe.style.width = 1 + 'px';
                else
                {
                    value = 1 + +value;
                    internalPipe.style.width = value + 'px';
                }
            }
                
        }
    }
}

function clearPipes() {
    var pipe;
    var internalPipe;
    for(var v = 1; v < vertPipes.length; v++)
    {
        pipe = vertPipes[v];
        internalPipe = pipe.firstElementChild;
        internalPipe.style.height = '0px';

    }
    for(var h = 1; h < horzPipes.length; h++)
    {
        pipe = horzPipes[h];
        internalPipe = pipe.firstElementChild;
        internalPipe.style.width = '0px';
    }
}
