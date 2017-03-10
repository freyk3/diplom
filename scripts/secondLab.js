/**
 * Created by Freyk on 28.02.2017.
 */

//Базовые установки
var animationSpeed = 10;
var rashirTankDelay = 2000;
var gomogDelay = 5000;
var separatorDelay = 5000;
var viderjDelay = 10000;

var vertPipes = [];
var horzPipes = [];
var errorExist;
var mainTemplate;
var secTempIsCorrect1 = false,
    secTempIsCorrect2 = false,
    secTempIsCorrect3 = false,
    secTempIsCorrect4 = false,
    viderjTimeIsCorrect = false,
    gomoDavlenIsCorrect = false;

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
    rashirTankDelay,
    horzPipes[3],
    horzPipes[4],
    vertPipes[5],
    vertPipes[9],
    horzPipes[9],
    separatorDelay,
    horzPipes[10],
    vertPipes[11],
    horzPipes[11],
    vertPipes[10],
    vertPipes[6],
    gomogDelay,
    vertPipes[7],
    horzPipes[5],
    viderjDelay,
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
    rashirTankDelay,
    horzPipes[3],
    horzPipes[4],
    vertPipes[5],
    vertPipes[9],
    horzPipes[9],
    separatorDelay,
    horzPipes[10],
    vertPipes[11],
    horzPipes[11],
    vertPipes[10],
    vertPipes[6],
    gomogDelay,
    vertPipes[7],
    horzPipes[5],
    viderjDelay,
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
    separatorDelay,
    horzPipes[10],
    vertPipes[11],
    horzPipes[11],
    vertPipes[10],
    vertPipes[6],
    gomogDelay,
    vertPipes[7],
    horzPipes[5],
    viderjDelay,
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

var templateNumb = randomInteger(0,3);
mainTemplate = templates[templateNumb];
console.log('Номер шаблона: '+templateNumb);
var errorNumb = randomInteger(0,3);
if(errorNumb == 0) //для обеспечения 1 к 4 появление ошибки
    errorExist = true;
else
    errorExist = false;
console.log('Наличие ошибки: '+errorExist);


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
            if(mainPipes[iterator].id == 'horzPipe11')
                progressSlivkiBar();
            if(mainPipes[iterator].id == 'vertPipe13')
                progressFinishProductBar();

            iterator++;
            if(iterator < mainPipes.length)
            {
                if(typeof mainPipes[iterator] == 'object')
                    pipeAnimation();
                else if(typeof mainPipes[iterator] == 'number')
                {
                    var timeout = mainPipes[iterator];
                    iterator++;
                    setTimeout(pipeAnimation,timeout);
                }
            }

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

function progressSlivkiBar() {
    var bar = document.getElementById('barIndicator0');

    var id = setInterval(frame, 50);

    function frame() {
        var value = bar.style.height;
        if(value != '')
            value = value.substring(0, value.length - 1);

        if (+value >= 100) {
            clearInterval(id);
        } else {
            if (value == '')
                bar.style.height = 1 + '%';
            else {
                value = 1 + +value;
                bar.style.height = value + '%';
            }
        }

    }
}

function progressFinishProductBar() {
    var bar = document.getElementById('barIndicator1');

    var id = setInterval(frame, 50);

    function frame() {
        var value = bar.style.height;
        if(value != '')
            value = value.substring(0, value.length - 1);

        if (+value >= 100) {
            clearInterval(id);
        } else {
            if (value == '')
                bar.style.height = 1 + '%';
            else {
                value = 1 + +value;
                bar.style.height = value + '%';
            }
        }

    }
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function test() {
    var errorNumb = randomInteger(0,3);
    if(errorNumb == 0) //для обеспечения 1 к 4 появление ошибки
        errorExist = true;
    else
        errorExist = false;
    console.log('Наличие ошибки: '+errorExist);
}

function chooseSec1() {
    var temp = prompt('Введите температуру в °С','');
    if(temp == '')
        return;

    if(temp > mainTemplate.temperSec1Min && temp < mainTemplate.temperSec1Max)
    {
        d();//тут будет чтото
    }
    else
        alert('Неверно!');
}
function chooseSec2() {

}
function chooseSec3() {

}
function chooseSec4() {

}
function chooseGomog() {

}
function chooseViderj() {

}