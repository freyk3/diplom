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
var appIsFinished = false;
var mainTemplate;
var secTempIsCorrect1,
    secTempIsCorrect2,
    secTempIsCorrect3,
    secTempIsCorrect4,
    viderjTimeIsCorrect,
    gomoDavlenIsCorrect;
var finishTemp,
    tempSec1,
    tempSec2,
    tempSec3,
    tempSec4,
    viderjTime,
    gomoDavlen;
var appIsStart = false;
var processIsStart = false;
// Переменные для таймера
function trim(string) { return string.replace (/\s+/g, " ").replace(/(^\s*)|(\s*)$/g, ''); }
var init=0;
var startDate;
var clocktimer;
var timer = 0;

var fs = require('fs');
var pathToStorage = require('path');
var Docxtemplater = require('docxtemplater');
var JSZip = require('jszip');

var usersFile = 'users.json';
var pathToUsersFile = pathToStorage.join(nw.App.dataPath, usersFile);
var contents = fs.readFileSync(pathToUsersFile, 'utf8');
var users = JSON.parse(contents);
var user;
for(var key in users)
{
    if (!users.hasOwnProperty(key)) continue;
    var tempUser = users[key];

    if(tempUser.login == sessionStorage.user)
    {
        user = tempUser;
        break;
    }
}

var reportObj = {};
reportObj.errors = [];
reportObj.log = [];
reportObj.user = user;

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
    processIsStart = true;
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
            else
            {
                processIsStart = false;
                if(appIsFinished == false)
                {
                    clearPipes();
                    appIsFinished = true;
                    alert('Пастеризатор не догрел молоко до необходимой температуры. Просто запустите ещё раз.');
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
    document.getElementById('temperatura2').innerHTML = finishTemp +' °С';
    document.getElementById('jirnost2').innerHTML = mainTemplate.vihodJir;

    var id = setInterval(frame, 50);

    function frame() {
        var value = bar.style.height;
        if(value != '')
            value = value.substring(0, value.length - 1);

        if (+value >= 100) {
            finishLab2();
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


function chooseSec1() {
    if(!appIsStart)
        return;
    var temp = prompt('Введите температуру в °С:','');
    if(temp == '')
        return;

    if(temp >= mainTemplate.temperSec1Min && temp <= mainTemplate.temperSec1Max)
    {
        secTempIsCorrect1 = true;
        tempSec1 = temp;
        createLog('Верно выбрана температура в секции 1: '+temp+'°С');
    }
    else
    {
        secTempIsCorrect1 = false;
        createError('Неверно выбрана температура в секции 1: '+temp+'°С');
    }
}
function chooseSec2() {
    if(!appIsStart)
        return;
    var temp = prompt('Введите температуру в °С','');
    if(temp == '')
        return;

    if(temp >= mainTemplate.temperSec2Min && temp <= mainTemplate.temperSec2Max)
    {
        secTempIsCorrect2 = true;
        tempSec2 = temp;
        createLog('Верно выбрана температура в секции 2: '+temp+'°С');
    }
    else
    {
        secTempIsCorrect2 = false;
        createError('Неверно выбрана температура в секции 2: '+temp+'°С');
    }
}
function chooseSec3() {
    if(!appIsStart)
        return;
    var temp = prompt('Введите температуру в °С:','');
    if(temp == '')
        return;

    if(temp >= mainTemplate.temperSec3Min && temp <= mainTemplate.temperSec3Max)
    {
        secTempIsCorrect3 = true;
        tempSec3 = temp;
        createLog('Верно выбрана температура в секции 3: '+temp+'°С');
    }
    else
    {
        secTempIsCorrect3 = false;
        createError('Неверно выбрана температура в секции 3: '+temp+'°С');
    }

    var time = prompt('Введите время выдерживания в секундах:','');
    if(time == '')
        return;

    if(time == mainTemplate.viderjTime)
    {
        viderjTimeIsCorrect = true;
        viderjTime = time;
        createLog('Верно выбрано время выдержки в выдерживателе: '+time+' сек');
    }
    else
    {
        viderjTimeIsCorrect = false;
        createError('Неверно выбрано время выдержки в выдерживателе: '+time+' сек');
    }
}
function chooseSec4() {
    if(!appIsStart)
        return;
    var temp = prompt('Введите температуру в °С','');
    if(temp == '')
        return;
    finishTemp = temp;
    if(temp >= mainTemplate.temperSec4Min && temp <= mainTemplate.temperSec4Max)
    {
        secTempIsCorrect4 = true;
        tempSec4 = temp;
        createLog('Верно выбрана температура в секции 4: '+temp+'°С');
    }
    else
    {
        secTempIsCorrect4 = false;
        createError('Неверно выбрана температура в секции 4: '+temp+'°С');
    }
}
function chooseGomog() {
    if(!appIsStart)
        return;
    var davlen = prompt('Введите давление в МПа:','');
    if(davlen == '')
        return;

    if(davlen >= mainTemplate.gomoDavlenMin && davlen <= mainTemplate.gomoDavlenMax)
    {
        gomoDavlenIsCorrect = true;
        gomoDavlen = davlen;
        createLog('Верно выбрано давление в гомогенизаторе: '+davlen+' МПа');
    }
    else
    {
        gomoDavlenIsCorrect = false;
        createError('Неверно выбрано давление в гомогенизаторе: '+davlen+' МПа');
    }
}

function checkAll() {
    if(processIsStart)
        return;
    if(!appIsStart)
        return;

    if(secTempIsCorrect1 == undefined)
    {
        alert('Не установлена температура в секции 1');
        return;
    }
    if(secTempIsCorrect2 == undefined)
    {
        alert('Не установлена температура в секции 2');
        return;
    }
    if(secTempIsCorrect3 == undefined)
    {
        alert('Не установлена температура в секции 3');
        return;
    }
    if(viderjTimeIsCorrect == undefined)
    {
        alert('Не установлено время выдержки в выдерживателе');
        return;
    }
    if(secTempIsCorrect4 == undefined)
    {
        alert('Не установлена температура в секции 4');
        return;
    }
    if(gomoDavlenIsCorrect == undefined)
    {
        alert('Не установлено давление в гомогенизаторе');
        return;
    }

    if(secTempIsCorrect1 == true &&
        secTempIsCorrect2 == true &&
        secTempIsCorrect3 == true &&
        secTempIsCorrect4 == true &&
        viderjTimeIsCorrect == true &&
        gomoDavlenIsCorrect == true)
    {
        if(errorExist) {
            if (appIsFinished)
            {
                startAgain();
            }
            else
            {
                startWithError();
            }
        }
        else
        {
            appIsFinished = true;
            start();
        }

    }

    if(secTempIsCorrect1 == false)
        alert('Что-то пошло не так в секции 1');
    if(secTempIsCorrect2 == false)
        alert('Что-то пошло не так в секции 2');
    if(secTempIsCorrect3 == false || viderjTimeIsCorrect == false)
        alert('Что-то пошло не так в секции 3');
    if(secTempIsCorrect4 == false)
        alert('Что-то пошло не так в секции 4');
    if(gomoDavlenIsCorrect == false)
        alert('Что-то пошло не так в гомогенизаторе');

}

function finishLab2() {
    createLog('Работа окончена');
    createReport();
    alert('Работа окончена! Отчет можно найти в разделе отчетов');
    document.location.href='dashboard.html';
}

function tankInfo1() {
    if(!appIsStart)
        return;
    alert('Температура: '+mainTemplate.enterTemper+'\nЖирность: '+mainTemplate.enterJir+'\n\nНеобходимо получить\n\nТемпература: 4±2 °С\nЖирность: '+mainTemplate.vihodJir);
}

function createError(msg) {
    var errorObj = {};
    errorObj.time = timer;
    errorObj.message = msg;
    reportObj.errors.push(errorObj);
}
function createLog(msg) {
    var logObj = {};
    logObj.time = timer;
    logObj.message = msg;
    reportObj.log.push(logObj);
}

function createReport() {
    var content = fs.readFileSync("files/report_template_lab2.docx", "binary");
    var zip = new JSZip(content);
    var doc= new Docxtemplater().loadZip(zip);

    var date = new Date;
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month<10)
        month = '0'+month;
    if(day<10)
        day = '0'+day;

    var nowDate = day +'.'+month+'.'+year;
    doc.setData({
        "errors": reportObj.errors,
        "log": reportObj.log,

        "temperatura1": mainTemplate.enterTemper,
        "temperatura2": finishTemp,
        "jir1": mainTemplate.enterJir,
        "jir2": mainTemplate.vihodJir,
        "tempSec1": tempSec1,
        "tempSec2": tempSec2,
        "tempSec3": tempSec3,
        "tempSec4": tempSec4,
        "viderjTime": viderjTime,
        "gomoDavlen": gomoDavlen,

        "report_date": nowDate,

        'user.name': reportObj.user.name,
        'user.surname': reportObj.user.surname,
        'user.group': reportObj.user.group
    });

    doc.render();

    var buf = doc.getZip().generate({type:"nodebuffer"});

    var dirPath = pathToStorage.join(nw.App.dataPath, 'userReports/');
    if(!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath);
    var fileName = 'Lab№2 '+reportObj.user.surname+' '+nowDate+' '+date.getTime()+'.docx';
    var reportFile = 'userReports/'+fileName;
    var newReportPath = pathToStorage.join(nw.App.dataPath, reportFile);

    fs.open(newReportPath, 'wx+', function (err, fd) {
        if (err) {
            if (err.code === "EEXIST") {
                console.log('myfile already exists');
                return;
            } else {
                throw err;
            }
        }
        fs.writeFileSync(newReportPath,buf);
    });

    user.reports.push(fileName);
    users[user.login] = user;
    var jsonResponseUsers = JSON.stringify(users);
    fs.writeFileSync(pathToUsersFile,jsonResponseUsers);
}

var playButton = document.getElementById('playButton');
function startApp() {
    appIsStart = true;
    playButton.style.display = 'none';
    document.getElementById('timerDiv').style.display = 'block';
    document.getElementById('startButton').style.display = 'block';
    startTimer();
    createLog('Начало работы');
}
function startTimer() {
    if (init==0) {
        startDate = new Date();
        init=1;
    }
    var thisDate = new Date();
    var t = thisDate.getTime() - startDate.getTime();
    var ms = t%1000; t-=ms; ms=Math.floor(ms/10);
    t = Math.floor (t/1000);
    var s = t%60; t-=s;
    t = Math.floor (t/60);
    var m = t%60; t-=m;
    t = Math.floor (t/60);
    var h = t%60;
    if (h<10) h='0'+h;
    if (m<10) m='0'+m;
    if (s<10) s='0'+s;
    if (ms<10) ms='0'+ms;
    if (init==1) document.getElementById('timer').innerText = h + ':' + m + ':' + s + '.' + ms;
    timer = h + ':' + m + ':' + s + '.' + ms;
    clocktimer = setTimeout("startTimer()",10);
}