/**
 * Created by Freyk on 10.10.2016.
 */
var fs = require('fs');
var pathToStorage = require('path');
var Docxtemplater = require('docxtemplater');
var JSZip = require('jszip');

var file = 'temp_report_first_vars.json';
var usersFile = 'users.json';
var filePath = pathToStorage.join(nw.App.dataPath, file);
var pathToUsersFile = pathToStorage.join(nw.App.dataPath, usersFile);
fs.open(filePath, 'wx', function (err, fd) {
    if (err) {
        if (err.code === "EEXIST") {
            fs.writeFileSync(filePath,'{}');
            return;
        } else {
            throw err;
        }
    }
    fs.writeFileSync(filePath,'{}');
});
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


function Point(numb,pointArr,isStart,isFinish) {
    this.numb = numb;
    this.pointArr = pointArr;
    this.isActivated = false;
    this.isStart = isStart;
    this.isFinish = isFinish;
    this.changeStatus = function () {
        if(this.isActivated == true)
        {
            this.domElem.style.background = 'url(/images/Kran_zakryty.jpg)';
            this.domElem.style.backgroundSize ='contain';
            this.isActivated = false;
        }
        else
        {
            this.domElem.style.background = 'url(/images/Kran_otkryty.jpg)';
            this.domElem.style.backgroundSize ='contain';
            this.isActivated = true;
        }
    };
    this.domElem = document.getElementById('point'+this.numb);
}
function Path() {
    this.startPoint = {};
    this.lastPoint = {};
    this.points = [];
    this.finishedPoint = {};
    this.isStarted = false;
    this.isFinished = false;
    this.colorPipe = function (point)
    {
        var point1 = this.lastPoint.numb,
            point2 = point.numb,
            pipe = document.getElementById('pipe'+point1+point2) != null ? document.getElementById('pipe'+point1+point2) : document.getElementById('pipe'+point2+point1);
            pipe.style.backgroundColor = 'white';
    };
    this.throwPath = function (newTime) {
        var points = this.points;
        var time = 0;
        var car = this.findCar();

        if(newTime !== undefined)
            time = newTime;
        var timerId = setTimeout(function () {
            car.filter1.deactivateFilter();
            car.filter2.deactivateFilter();
            for (var i = 0; i < points.length; i++)
            {
                if(i == 0)
                {
                    points[i].changeStatus();
                    document.getElementById('pipe'+points[i].numb).style.backgroundColor = 'rgb(246,144,33)';
                }
                else
                {
                    points[i].changeStatus();
                    var pipe = document.getElementById('pipe'+points[i].numb+points[i-1].numb) != null ? document.getElementById('pipe'+points[i].numb+points[i-1].numb) : document.getElementById('pipe'+points[i-1].numb+points[i].numb);
                    pipe.style.backgroundColor = 'rgb(246,144,33)';
                }
            }
        },time);
    };
    this.provideMilk = function () {
        var litres = prompt('Введите количество литров, которые пойдут в данный танк','');
        var firstPoint = this.points[0].numb;
        var lastPoint = this.points[this.points.length-1].numb;
        var car = this.findCar();
        var barrel = barrels[lastPoint];
        if(litres != null)
            if(isInteger(litres))
            {
                if(car.volume < litres)
                {
                    alert('В молоковозе нет столько молока');
                }
                else if(barrel.fullVolume - barrel.value < litres)
                {
                    alert('В танк больше не влезет');
                }
                else
                {
                    var timeOfFilling = barrel.addMilk(litres,car.numb);
                    if(timeOfFilling !== undefined)
                        car.volume = car.volume - litres;
                }
            }
            else
            {
                alert('Введите корректное число');
            }


        this.throwPath(timeOfFilling ? timeOfFilling : '');
        insertCarValue();
    };
    this.findCar = function () {
        var firstPoint = this.points[0].numb;
        var car;
        switch (firstPoint) {
            case 4:
                car = cars[0];
                break;
            case 8:
                car = cars[1];
                break;
            case 12:
                car = cars[2];
                break;
            case 16:
                car = cars[3];
                break;
        }
        return car;
    }
}

function Barrel(progressNumb) {
    this.numb = progressNumb;
    this.fullVolume = 20000;
    this.value = 0;
    this.progressBar = document.getElementById('barIndicator'+progressNumb);
    this.addMilk = function (litres,numbOfCar) {
        var percentStep = 200; //это шаг изменения 1 процента. 100% - 20000кг, следовательно 1% - 200
        var animationSpeed = 12; //примерная скорость чтобы 10000 2мин заливалось
        var elem = this.progressBar;
        var tempValue = this.value;
        var newValue = tempValue + +litres;
        var tempVar = 0;
        var timeOfFilling = +litres*animationSpeed;
        var car = cars[numbOfCar];
        var freeze = freezes[numbOfCar];
        var temperature;
        var filter;
        if(freeze.isActivated == true)
            temperature = '3';
        else
            temperature = car.milkChar.t;

        if(this.milkChar.sort == 1 && car.milkChar.sort == 2)
        {
            createError('Попытка испортить 1 категорию в танке '+this.numb);
            alert('Попытка испортить 1 категорию');
            return;
        }
        if(temperature > 6)
        {
            createError('Попытка залить молоко в танк с высокой температурой ('+temperature+')');
            alert('Слишком высокая температура молока!');
            return;
        }

        freeze.isLocked = true;
        createLog('В танк №'+this.numb+' заливают '+litres+'л молока из машины №'+car.numb);

        if(this.milkChar.sort == 0)
        {
            this.milkChar.sort = car.milkChar.sort;
            this.milkChar.kislot = car.milkChar.kislot;
            this.milkChar.clearGroup = car.milkChar.clearGroup;
            this.milkChar.plotnost = car.milkChar.plotnost;
            this.milkChar.jir = car.milkChar.jir;
            this.milkChar.belok = car.milkChar.belok;
            this.milkChar.t = temperature;
            this.milkChar.tz = car.milkChar.tz;
        }
        else
        {
            if(this.milkChar.sort == 2 && car.milkChar.sort == 1)
                this.milkChar.sort = 2;

            this.milkChar.kislot = Math.round(((this.milkChar.kislot*this.value)+(car.milkChar.kislot*litres))/(this.value+ +litres));
            this.milkChar.plotnost = Math.round((((this.milkChar.plotnost*this.value)+(car.milkChar.plotnost*litres))/(this.value+ +litres))*10)/10;
            this.milkChar.jir = Math.round((((this.milkChar.jir*this.value)+(car.milkChar.jir*litres))/(this.value+ +litres))*10)/10;
            this.milkChar.belok = car.milkChar.belok;
            this.milkChar.t = Math.round(((this.milkChar.t*this.value)+(temperature*litres))/(this.value+ +litres));
            this.milkChar.tz = Math.round((((this.milkChar.tz*this.value)+(car.milkChar.tz*litres))/(this.value+ +litres))*1000)/1000;
            if(this.milkChar.clearGroup == 'II' && car.milkChar.clearGroup == 'I')
                this.milkChar.clearGroup = 'II';

        }

        this.value = this.value + +litres;

        var id = setInterval(frame, animationSpeed);

        function frame() {
            if (tempValue >= newValue) {
                clearInterval(id);
                freeze.isLocked = false;
                filter.deactivateFilter();
                if(car.volume == 0)
                    car.isEmpty = true;
                if(car0.isEmpty == true && car1.isEmpty == true && car2.isEmpty == true && car3.isEmpty == true && checkFilters())
                    goToWash();
            } else {
                if(car.filter1.isWorking)
                {
                    filter = car.filter1;
                    car.filter2.isActive = false;
                }
                else
                {
                    filter = car.filter2;
                    car.filter1.isActive = false;
                }
                if( filter.isActive == false)
                {
                    filter.isActive = true;
                    filter.activateFilter();
                }
                filter.activateFilter();
                filter.limit = filter.limit - 1;
                if(filter.limit == 0)
                {
                    filter.deactivateFilter();
                    filter.breakFilter();
                    filter.changeFilter();
                    filter = filter.findNeibFilter();
                }
                tempValue++;
                tempVar++;
                elem.previousElementSibling.innerHTML = tempValue;
                if(tempVar >= percentStep)
                {
                    var height = elem.style.height;
                    if(height == '')
                        elem.style.height = 1 + '%';
                    else
                    {
                        var value = elem.style.height;
                        value = value.substring(0, value.length - 1);
                        value = 1 + +value;
                        elem.style.height = value + '%';
                    }
                    tempVar= 0;
                }
            }
        }

        return timeOfFilling;

    };
    this.milkChar = {
        sort: 0,
        kislot: 0,
        clearGroup: 0,
        plotnost: 0,
        jir: 0,
        belok: 0,
        t: 0,
        tz: 0
    }
}

function Car(numb) {
    this.numb = numb;
    this.volume = 16000;
    this.isActive = true; //приехала машина\ещё не приехала
    this.carVolume = document.getElementById('carVolume'+this.numb);
    this.milkChar = milkChars[carMilkChars[this.numb]];
    this.waybill = waybills[carMilkChars[this.numb]];
    this.isEmpty = false;
    this.findFilter = function (numbOfFilter) {
        for(var i = 0; i<filters.length; i++)
        {
            if(filters[i].numb == (this.numb+String(numbOfFilter)))
                return filters[i];
        }
    };
    this.filter1 = this.findFilter(1);
    this.filter2 = this.findFilter(2);
    this.findActiveFilter = function () {
        if(this.filter1.isActive == true)
            return this.filter1;
        else if(this.filter2.isActive == true)
            return this.filter2;
    };
    this.defineNeSort = function () {
        if(this.milkChar.sort == 1 || this.milkChar.sort == 2)
            return false;
        else
            return true;
    };
    this.neSort = this.defineNeSort();
}

function Filter(numb) {
    this.numb = numb;
    this.limit = 8000;
    this.maxLimit = 8000;
    this.domFilter = document.getElementById('filter'+this.numb);
    this.activateFilter = function () {
        var numbOfFilters = this.numb.substring(0, this.numb.length - 1);
        var pipe1 = document.getElementById('fromCarPipe'+numbOfFilters+'1');
        var pipe2 = document.getElementById('fromCarPipe'+numbOfFilters+'2');
        var pipe3 = document.getElementById('fromCarPipe'+this.numb+'1');
        var pipe4 = document.getElementById('fromCarPipe'+this.numb+'2');
        pipe1.style.backgroundColor ='white';
        pipe2.style.backgroundColor ='white';
        pipe3.style.backgroundColor ='white';
        pipe4.style.backgroundColor ='white';
        this.isActive = true;
    };
    this.deactivateFilter = function () {
        var numbOfFilters = this.numb.substring(0, this.numb.length - 1);
        var pipe1 = document.getElementById('fromCarPipe'+numbOfFilters+'1');
        var pipe2 = document.getElementById('fromCarPipe'+numbOfFilters+'2');
        var pipe3 = document.getElementById('fromCarPipe'+this.numb+'1');
        var pipe4 = document.getElementById('fromCarPipe'+this.numb+'2');
        pipe1.style.backgroundColor = 'rgb(246,144,33)';
        pipe2.style.backgroundColor = 'rgb(246,144,33)';
        pipe3.style.backgroundColor = 'rgb(246,144,33)';
        pipe4.style.backgroundColor = 'rgb(246,144,33)';
        this.isActive = false;
    };
    this.isWorking = true;
    this.isActive = false;
    this.filterImg = document.getElementById('filter'+this.numb);
    this.breakFilter = function () {
        this.filterImg.src="/images/Filtr_na_zamenu.jpg";
        this.isWorking = false;
        this.isActive = false;
        this.repairButton.style.display = 'block';
    };
    this.findNeibFilter = function () {
        var numbOfNeibFilter;
        if(this.numb.substr(1,1) == 1)
            numbOfNeibFilter = this.numb.substr(0,1) + '2';
        else
            numbOfNeibFilter = this.numb.substr(0,1) + '1';
        for(var i = 0; i<filters.length; i++)
        {
            if(filters[i].numb == numbOfNeibFilter)
                return filters[i];
        }
    };
    this.changeFilter = function () {
        var neibFilter = this.findNeibFilter();
        neibFilter.activateFilter();
        neibFilter.isActive = true;
    };
    this.repairButton = document.getElementById('repairButton'+this.numb);
    this.repairText = document.getElementById('repairText'+this.numb);
}

function Freeze(numb) {
    this.numb = numb;
    this.isActivated = false;
    this.activate = function () {
        this.isActivated = true;
        this.domElem.src = '/images/Okhladitel_vklyuchen.jpg';
    };
    this.deactivate = function () {
        this.isActivated = false;
        this.domElem.src = '/images/Okhladitel_vyklyuchen.jpg';
    };
    this.domElem = document.getElementById('freeze'+this.numb);
    this.isLocked = false;
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

var point0 = new Point(0,[], false, true),
    point1 = new Point(1,[], false, true),
    point2 = new Point(2,[], false, true),
    point3 = new Point(3,[], false, true),
    point4 = new Point(4,[0,5,8],true,false),
    point5 = new Point(5,[1,4,6,9],false,false),
    point6 = new Point(6,[2,5,7,10],false,false),
    point7 = new Point(7,[3,6,11],false,false),
    point8 = new Point(8,[4,9,12],true,false),
    point9 = new Point(9,[5,8,10,13], false, false),
    point10 = new Point(10,[6,9,11,14], false, false),
    point11 = new Point(11,[7,10,15], false, false),
    point12 = new Point(12,[8,13,16],true,false),
    point13 = new Point(13,[9,12,14,17],false,false),
    point14 = new Point(14,[10,13,15,18],false,false),
    point15 = new Point(15,[11,14,19],false,false),
    point16 = new Point(16,[12,17],true,false),
    point17 = new Point(17,[16,13,18],false,false),
    point18 = new Point(18,[17,19,14],false,false),
    point19 = new Point(19,[15,18],false,false);
var barrel0 = new Barrel(0),
    barrel1 = new Barrel(1),
    barrel2 = new Barrel(2),
    barrel3 = new Barrel(3);
var filter01 = new Filter('01'),
    filter02 = new Filter('02'),
    filter11 = new Filter('11'),
    filter12 = new Filter('12'),
    filter21 = new Filter('21'),
    filter22 = new Filter('22'),
    filter31 = new Filter('31'),
    filter32 = new Filter('32');
var filters = [filter01,filter02,filter11,filter12,filter21,filter22,filter31,filter32];


var sorts = [1,2,2,3];
var carChars = [];
var carMilkChars = [];
for(var i = 0; i<4; i++)
{
    var rand = randomInteger(0,(sorts.length - 1));
    carChars.push(sorts[rand]);
    sorts.splice(rand,1);
}
var milkcharCar0numb = carChars[0];
var milkcharCar1numb = carChars[1];
var milkcharCar2numb = carChars[2];
var milkcharCar3numb = carChars[3];

var milkcharCar0 = getRandomTemplate(milkcharCar0numb);
var milkcharCar1 = getRandomTemplate(milkcharCar1numb);
if(milkcharCar1 == milkcharCar0)
    while (milkcharCar1 == milkcharCar0)
        milkcharCar1 = getRandomTemplate(milkcharCar1numb);
var milkcharCar2 = getRandomTemplate(milkcharCar2numb);
if(milkcharCar2 == milkcharCar1 || milkcharCar2 == milkcharCar0)
    while(milkcharCar2 == milkcharCar1 || milkcharCar2 == milkcharCar0)
        milkcharCar2 = getRandomTemplate(milkcharCar2numb);
var milkcharCar3 = getRandomTemplate(milkcharCar3numb);
if(milkcharCar3 == milkcharCar2 || milkcharCar3 == milkcharCar1 || milkcharCar3 == milkcharCar0)
    while (milkcharCar3 == milkcharCar2 || milkcharCar3 == milkcharCar1 || milkcharCar3 == milkcharCar0)
        milkcharCar3 = getRandomTemplate(milkcharCar3numb);

carMilkChars.push(milkcharCar0,milkcharCar1,milkcharCar2,milkcharCar3);
console.log(carMilkChars);


function getRandomTemplate(numb) {
    var rand;
    switch (numb) {
        case 1:
            rand = randomInteger(0,2);
            break;
        case 2:
            rand = randomInteger(3,8);
            break;
        case 3:
            rand = randomInteger(9,11);
            break;
    }
    return rand;
}

var car0 = new Car(0),
    car1 = new Car(1),
    car2 = new Car(2),
    car3 = new Car(3);
var freeze0 = new Freeze(0),
    freeze1 = new Freeze(1),
    freeze2 = new Freeze(2),
    freeze3 = new Freeze(3);

var points = [point0,point1,point2,point3,point4,point5,point6,point7,point8,point9,point10,point11,point12,point13,point14,point15,point16,point17,point18,point19];
var barrels = [barrel0,barrel1,barrel2,barrel3];
var cars = [car0,car1,car2,car3];
var freezes = [freeze0,freeze1,freeze2,freeze3];
var pathIsStarted = false;
var path;

function activatePoint(numb)
{
    if(appIsStart != true)
    {
        alert('Программа не начала работать (Кнопка "запуск" сверху слева)');
        return;
    }

    var car;
    var point = points[numb];
    if(point.isActivated == false)
    {
        if(point.isStart == true && pathIsStarted == false)
        {
            switch (numb) {
                case 4:
                    car = cars[0];
                    break;
                case 8:
                    car = cars[1];
                    break;
                case 12:
                    car = cars[2];
                    break;
                case 16:
                    car = cars[3];
                    break;
            }
            if(car.isActive == false)
            {
                alert('От машины отказались');
                return;
            }
            if(car.waybill.sort == 'Несортовое')
            {
                alert('Молоко несортовое!');
                return;
            }
            if(car.waybill.sort != 1 && car.waybill.sort != 2)
            {
                alert('Не выбран сорт');
                return;
            }

            var filter;
            if(car.filter1.isWorking)
                filter = car.filter1;
            else
                filter = car.filter2;
            var pipe = document.getElementById('pipe'+point.numb);
            pathIsStarted = true;
            path = new Path();
            path.startPoint = point;
            path.lastPoint = point;
            path.points.push(point);
            path.isStarted = true;
            point.changeStatus();
            filter.activateFilter();
            filter.isActive = true;
            pipe.style.backgroundColor = 'white';
            checkFreePoints(path);
        }
        else if (pathIsStarted == true)
        {
            var lastPoint = path.lastPoint;
            for (var i=0; i<lastPoint.pointArr.length; i++)
            {
                if((lastPoint.pointArr[i] == numb))
                {
                    if(point.isFinish == false)
                    {
                        path.points.push(point);
                        point.changeStatus();
                        path.colorPipe(point);
                        path.lastPoint = point;
                        checkFreePoints(path);
                    }
                    else
                    {
                        pathIsStarted = false;
                        path.points.push(point);
                        point.changeStatus();
                        path.colorPipe(point);
                        path.lastPoint = point;
                        path.provideMilk();
                        path = {};
                    }
                }
            }
        }
    }
}

function checkFreePoints(path) {
    var lastPoint = path.lastPoint,
        adjacentPoints = path.lastPoint.pointArr,
        boolFreePoints = true;

    for(var i=0; i<adjacentPoints.length; i++)
    {
        var adjacentPoint = points[adjacentPoints[i]];
        if(adjacentPoint.isActivated == false)
            boolFreePoints = false;
    }

    if(boolFreePoints == true)
    {
        path.throwPath();
        path = {};
        pathIsStarted = false;
    }
}

function insertCarValue() {
    for(var i = 0; i<cars.length; i++)
    {
        var car = cars[i];
        car.carVolume.innerText = car.volume;
    }
}
function startApp() {
    appIsStart = true;
    playButton.style.display = 'none';
    document.getElementById('timerDiv').style.height = '40px';
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

function activateFreeze(numb) {
    var freeze = freezes[numb];
    if(freeze.isLocked == true)
        return;
    freeze.activate();
    var buttonOn = document.getElementById('freezeButton'+numb+'1');
    var buttonOff = document.getElementById('freezeButton'+numb+'2');
    buttonOn.style.display = 'none';
    buttonOff.style.display = '';
}
function deactivateFreeze(numb) {
    var freeze = freezes[numb];
    if(freeze.isLocked == true)
        return;
    freeze.deactivate();
    var buttonOn = document.getElementById('freezeButton'+numb+'1');
    var buttonOff = document.getElementById('freezeButton'+numb+'2');
    buttonOn.style.display = '';
    buttonOff.style.display = 'none';
}

function showWaybill(numb)
{
    if(appIsStart != true)
    {
        return;
    }

    var car = cars[numb];
    var str = 'Сорт: '+car.waybill.sort+'\nНомер машины: '+car.waybill.numbOfCar+'\nКислотность: '+car.waybill.kislot+'\nГруппа чистоты: '+car.waybill.clearGroup+'\nПлотность: '+car.waybill.plotnost+'\nМассовая доля жира: '+car.waybill.jir+'\nМассовая доля белка: '+car.waybill.belok+'\nТемпература: '+car.waybill.t+'\nТемпература замерзания: '+car.waybill.tz;
    alert(str);
}

//лаборатория
function labMessage(numb)
{
    if(appIsStart != true)
    {
        return;
    }

    var str;
    var labBlock = document.getElementById('labBlock');
    var div = document.createElement('div');
    var car = cars[numb];
    div.innerHTML = '<span><strong>Машина '+(numb+1)+'</strong><br>'+car.milkChar.labMes;
    labBlock.appendChild(div);
}

//Отказ от машины
function rejectCar(numb) {
    if(appIsStart != true)
    {
        return;
    }

    var car = cars[numb];
    if(car.isEmpty == true)
        return;
    var isRejected = confirm("Вы уверены что хотите отказаться принимать эту машину?");
    if(isRejected)
    {
        if(car.neSort == false)
        {
            createError('Попытка отказаться от машины №'+car.numb);
            alert('Неверно')
        }
        else
        {
            waybills[numb].sort = 'Несортовое';
            car.waybill.sort = 'Несортовое';
            car.isEmpty = true;
            car.isActive = false;
            if(car0.isEmpty == true && car1.isEmpty == true && car2.isEmpty == true && car3.isEmpty == true && checkFilters())
                goToWash();
        }
    }
}

//Выбор сорта
function chooseSort(numb) {
    if(appIsStart != true)
    {
        return;
    }
    var car = cars[numb];
    if(car.waybill.sort == 1 || car.waybill.sort == 2 || car.waybill.sort == 'Несортовое')
        return;

    var rigthSort = car.milkChar.sort;
    var sort = prompt('Введите сорт');
    if(sort == null)
        return;
    if(sort != rigthSort)
    {
        createError('Неверно определен сорт молока у машины №'+car.numb+'. Введен сорт '+sort+'. Верный сорт: '+car.milkChar.sort);
        alert('Неверно!');
        return;
    }
    createLog('Выбран верный сорт молока в машине №'+car.numb)
    waybills[numb].sort = sort;
    car.waybill.sort = sort;
}

//Мойка
function goToWash() {
    sessionStorage.timer = startDate.getTime();
    setReportForm();
    alert('На мойку!');
    document.location.href='wash.html';
}

//Формирование отчета
function setReportForm() {

    reportObj.car0 = car0.milkChar;
    reportObj.car1 = car1.milkChar;
    reportObj.car2 = car2.milkChar;
    reportObj.car3 = car3.milkChar;

    reportObj.barrel0 = barrel0.milkChar;
    reportObj.barrel1 = barrel1.milkChar;
    reportObj.barrel2 = barrel2.milkChar;
    reportObj.barrel3 = barrel3.milkChar;

    var jsonResponse = JSON.stringify(reportObj);
    fs.writeFileSync(filePath,jsonResponse);
}

//Сведенья о том что в бочке
function showBarrel(numb) {
    var barrel = barrels[numb];
    if(barrel.milkChar.sort == 0)
        alert('Танк пуст');
    else
    {
        var str = 'Сорт в данном танке: '+barrel.milkChar.sort+'\nКислотность: '+barrel.milkChar.kislot+'\nГруппа чистоты: '+barrel.milkChar.clearGroup+'\nПлотность: '+barrel.milkChar.plotnost+'\nМассовая доля жира: '+barrel.milkChar.jir+'\nМассовая доля белка: '+barrel.milkChar.belok+'\nТемпература: '+barrel.milkChar.t+'\nТемпература замерзания: '+barrel.milkChar.tz;
        alert(str);
    }

}

//Починка фильтра
function repairFilter(numbOfFilter) {
    var filter = findFilterByNumb(numbOfFilter);
    var neibFilter = filter.findNeibFilter();
    var button = document.getElementById('repairButton'+filter.numb);
    button.style.display = 'none';
    filter.isWorking = true;
    filter.limit = filter.maxLimit;
    filter.filterImg.src="/images/Filtr_rabochiy.jpg";
    neibFilter.deactivateFilter();

    if(car0.isEmpty == true && car1.isEmpty == true && car2.isEmpty == true && car3.isEmpty == true && checkFilters())
        goToWash();
}

//Поиск фильтра
function findFilterByNumb (numbOfFilter) {
    for(var i = 0; i<filters.length; i++)
    {
        if(filters[i].numb == (String(numbOfFilter)))
            return filters[i];
    }
}

function finishLab() {
    var isAgree = confirm("Вы уверены что хотите прервать выполнение работы и сформировать отчет?");
    if(isAgree)
    {
        alert('Работа окончена досрочно');
        createLog('Работа окончена досрочно');
        createError('Работа не окончена. Не пройдет этап мойки');
        setReportForm();
        createReport();
        document.location.href='dashboard.html';
    }
}

function createReport() {
    var content = fs.readFileSync("files/report_template.docx", "binary");
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

        "car0.carnumb": reportObj.car0.numbOfCar,
        "car0.kislot": reportObj.car0.kislot,
        "car0.sort": reportObj.car0.sort,
        "car0.clearGroup": reportObj.car0.clearGroup,
        "car0.plotnost": reportObj.car0.plotnost,
        "car0.jir": reportObj.car0.jir,
        "car0.belok": reportObj.car0.belok,
        "car0.t": reportObj.car0.t,
        "car0.tz": reportObj.car0.tz,

        "car1.carnumb": reportObj.car1.numbOfCar,
        "car1.kislot": reportObj.car1.kislot,
        "car1.sort": reportObj.car1.sort,
        "car1.clearGroup": reportObj.car1.clearGroup,
        "car1.plotnost": reportObj.car1.plotnost,
        "car1.jir": reportObj.car1.jir,
        "car1.belok": reportObj.car1.belok,
        "car1.t": reportObj.car1.t,
        "car1.tz": reportObj.car1.tz,

        "car2.carnumb": reportObj.car2.numbOfCar,
        "car2.kislot": reportObj.car2.kislot,
        "car2.sort": reportObj.car2.sort,
        "car2.clearGroup": reportObj.car2.clearGroup,
        "car2.plotnost": reportObj.car2.plotnost,
        "car2.jir": reportObj.car2.jir,
        "car2.belok": reportObj.car2.belok,
        "car2.t": reportObj.car2.t,
        "car2.tz": reportObj.car2.tz,

        "car3.carnumb": reportObj.car3.numbOfCar,
        "car3.kislot": reportObj.car3.kislot,
        "car3.sort": reportObj.car3.sort,
        "car3.clearGroup": reportObj.car3.clearGroup,
        "car3.plotnost": reportObj.car3.plotnost,
        "car3.jir": reportObj.car3.jir,
        "car3.belok": reportObj.car3.belok,
        "car3.t": reportObj.car3.t,
        "car3.tz": reportObj.car3.tz,

        "barrel0.kislot": reportObj.barrel0.kislot,
        "barrel0.sort": reportObj.barrel0.sort,
        "barrel0.clearGroup": reportObj.barrel0.clearGroup,
        "barrel0.plotnost": reportObj.barrel0.plotnost,
        "barrel0.jir": reportObj.barrel0.jir,
        "barrel0.belok": reportObj.barrel0.belok,
        "barrel0.t": reportObj.barrel0.t,
        "barrel0.tz": reportObj.barrel0.tz,

        "barrel1.carnumb": reportObj.barrel1.numbOfCar,
        "barrel1.kislot": reportObj.barrel1.kislot,
        "barrel1.sort": reportObj.barrel1.sort,
        "barrel1.clearGroup": reportObj.barrel1.clearGroup,
        "barrel1.plotnost": reportObj.barrel1.plotnost,
        "barrel1.jir": reportObj.barrel1.jir,
        "barrel1.belok": reportObj.barrel1.belok,
        "barrel1.t": reportObj.barrel1.t,
        "barrel1.tz": reportObj.barrel1.tz,

        "barrel2.carnumb": reportObj.barrel2.numbOfCar,
        "barrel2.kislot": reportObj.barrel2.kislot,
        "barrel2.sort": reportObj.barrel2.sort,
        "barrel2.clearGroup": reportObj.barrel2.clearGroup,
        "barrel2.plotnost": reportObj.barrel2.plotnost,
        "barrel2.jir": reportObj.barrel2.jir,
        "barrel2.belok": reportObj.barrel2.belok,
        "barrel2.t": reportObj.barrel2.t,
        "barrel2.tz": reportObj.barrel2.tz,

        "barrel3.carnumb": reportObj.barrel3.numbOfCar,
        "barrel3.kislot": reportObj.barrel3.kislot,
        "barrel3.sort": reportObj.barrel3.sort,
        "barrel3.clearGroup": reportObj.barrel3.clearGroup,
        "barrel3.plotnost": reportObj.barrel3.plotnost,
        "barrel3.jir": reportObj.barrel3.jir,
        "barrel3.belok": reportObj.barrel3.belok,
        "barrel3.t": reportObj.barrel3.t,
        "barrel3.tz": reportObj.barrel3.tz,

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
    var fileName = reportObj.user.surname+' '+nowDate+' '+date.getTime()+'.docx';
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

function checkFilters() {
    if(filter01.isWorking == true && filter02.isWorking == true && filter11.isWorking == true && filter12.isWorking == true && filter21.isWorking == true && filter22.isWorking == true && filter31.isWorking == true && filter32.isWorking == true)
        return true;
    else
        return false;
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

// Переменные для таймера
function trim(string) { return string.replace (/\s+/g, " ").replace(/(^\s*)|(\s*)$/g, ''); }
var init=0;
var startDate;
var clocktimer;
var timer = 0;

/* Всё что будет происходить сразу после загрузки */
var appIsStart = false;
var playButton = document.getElementById('playButton');
var finishLines = 0;
insertCarValue();

function isInteger(num) {
    return num-Math.floor(num)==0;
}


