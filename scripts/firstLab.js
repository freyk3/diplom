/**
 * Created by Freyk on 10.10.2016.
 */
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
        console.log('путь скинулся');
        /* здесь будет функция по скидыванию пути */
        var points = this.points;
        var time = 0;
        if(newTime !== undefined)
            time = newTime;
        var timerId = setTimeout(function () {
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
        var barrel = barrels[lastPoint];

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
            car.volume = car.volume - litres;
            var timeOfFilling = barrel.addMilk(litres);
        }

        this.throwPath(timeOfFilling ? timeOfFilling : '');
        insertCarValue();
    }
}

function Barrel(progressNumb) {
    this.numb = progressNumb;
    this.fullVolume = 20000;
    this.value = 0;
    this.progressBar = document.getElementById('barIndicator'+progressNumb);
    this.addMilk = function (litres) {
        var percentStep = 200; //это шаг изменения 1 процента. 100% - 20000кг, следовательно 1% - 200
        var animationSpeed = 6; //примерная скорость чтобы 10000 2мин заливалось
        var elem = this.progressBar;
        var tempValue = this.value;
        var newValue = tempValue + +litres;
        var tempVar = 0;
        var timeOfFilling = +litres*animationSpeed;
        this.value = this.value + +litres;
        //elem.previousElementSibling.innerHTML = this.value;
        var id = setInterval(frame, animationSpeed);

        function frame() {
            if (tempValue >= newValue) {
                clearInterval(id);
            } else {
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
        /*
        if(this.value > 105) //ну при 105 лпрогресс перекрывает числа, но над этим подумать надо ещё
            elem.previousElementSibling.style.color = 'white';
        else
            elem.previousElementSibling.style.color = 'black';
        */
        return timeOfFilling;

    }
}

function Car(numb) {
    this.numb = numb;
    this.volume = 10000;
    this.isActive = true; //приехала машина\ещё не приехала
    this.carVolume = document.getElementById('carVolume'+this.numb);
}

function Filter(numb) {
    this.numb = numb;
    this.maxVolume = 5000;
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

    }

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
var car0 = new Car(0),
    car1 = new Car(1),
    car2 = new Car(2),
    car3 = new Car(3);
var filter01 = new Filter('01'),
    filter02 = new Filter('02'),
    filter11 = new Filter('11'),
    filter12 = new Filter('12'),
    filter21 = new Filter('21'),
    filter22 = new Filter('22'),
    filter31 = new Filter('31'),
    filter032 = new Filter('32');
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
        return;

    var point = points[numb];
    if(point.isActivated == false)
    {
        if(point.isStart == true && pathIsStarted == false)
        {
            var pipe = document.getElementById('pipe'+point.numb);
            pathIsStarted = true;
            path = new Path();
            path.startPoint = point;
            path.lastPoint = point;
            path.points.push(point);
            path.isStarted = true;
            point.changeStatus();
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
    pauseButton.style.display = '';
    startTimer();
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
    clocktimer = setTimeout("startTimer()",10);
}
function pauseApp()
{
    alert('Я не знаю зачем тут пауза, но на, держи');
}

function activateFreeze(numb) {
    var freeze = freezes[numb];
    freeze.activate();
    var buttonOn = document.getElementById('freezeButton'+numb+'1');
    var buttonOff = document.getElementById('freezeButton'+numb+'2');
    buttonOn.style.display = 'none';
    buttonOff.style.display = '';
}
function deactivateFreeze(numb) {
    var freeze = freezes[numb];
    freeze.deactivate();
    var buttonOn = document.getElementById('freezeButton'+numb+'1');
    var buttonOff = document.getElementById('freezeButton'+numb+'2');
    buttonOn.style.display = '';
    buttonOff.style.display = 'none';
}

function showWaybill(numb)
{
    switch (numb) {
        case 0:
            waybill = waybill0;
            break;
        case 1:
            waybill = waybill1;
            break;
        case 2:
            waybill = waybill2;
            break;
        case 3:
            waybill = waybill3;
            break;
    }
    var str = 'Сорт: '+waybill.sort+'\nНомер машины: '+waybill.numbOfCar+'\nКислотность: '+waybill.kislot+'\nГруппа чистоты: '+waybill.clearGroup+'\nПлотность: '+waybill.plotnost+'\nМассовая доля жира: '+waybill.jir+'\nМассовая доля белка: '+waybill.belok+'\nТемпература: '+waybill.t+'\nТемпература замерзания: '+waybill.tz;
    alert(str);
}
//Накладные
var waybill0 = {
    sort: 'Еще не установлен',
    numbOfCar: 'м401ко',
    kislot: '16,80°T',
    clearGroup: 'I',
    plotnost: '1028,0 кг/м3',
    jir: '3,8%',
    belok: '3,0%',
    t: '5,0 °С',
    tz: 'минус 0,530 °С'
};
var waybill1 = {
    sort: 'Еще не установлен',
    numbOfCar: 'м402ко',
    kislot: '18,80°Т',
    clearGroup: 'II',
    plotnost: '1028,0 кг/м3',
    jir: '3,4%',
    belok: '3,0%',
    t: '6,5 °С',
    tz: 'минус 0,520°С'
};
var waybill2 = {
    sort: 'Еще не установлен',
    numbOfCar: 'м403ко',
    kislot: '20,00°Т',
    clearGroup: 'II',
    plotnost: '1027,0 кг/м3',
    jir: '3,6%',
    belok: '3,0%',
    t: '6,0 °С',
    tz: 'минус 0,525°С'
};
var waybill3 = {
    sort: 'Еще не установлен',
    numbOfCar: 'м404ко',
    kislot: '16,50°Т',
    clearGroup: 'II',
    plotnost: '1027,0 кг/м3',
    jir: '3,6%',
    belok: '3,0%',
    t: '5,8 °С',
    tz: 'минус 0,520°С'
};

//лаборатория
function labMessage(numb)
{
    var str;
    var labBlock = document.getElementById('labBlock');
    var div = document.createElement('div');
    switch (numb) {
        case 0:
            div.innerHTML = '<span><strong>Машина '+(numb+1)+'</strong></span><br><span>Температура замерзания: минус 0,528 °С</span><br><span>Ингибирующие вещества не обнаружены.</span><br><br>';
            break;
        case 1:
            div.innerHTML = '<span><strong>Машина '+(numb+1)+'</strong></span><br><span>Температура замерзания: минус 0,522 °С</span><br><span>Ингибирующие вещества не обнаружены.</span><br><br>';
            break;
        case 2:
            div.innerHTML = '<span><strong>Машина '+(numb+1)+'</strong></span><br><span>Массовая доля жира: 3,4%</span><br><span>Ингибирующие вещества не обнаружены.</span><br><br>';
            break;
        case 3:
            div.innerHTML = '<span><strong>Машина '+(numb+1)+'</strong></span><br><span>Кислотность: 15,90 °Т</span><br><span>Плотность: 1023,0 кг/м3</span><br><span>Массовая доля жира: 3,0%</span><br><span>Температура: 18 °С</span><br><span>Температура замерзания: минус 0,512 °С</span><br><span>Обнаружены ингибирующие вещества!</span><br><br>';
            break;
    }
    labBlock.appendChild(div);
}

//Отказ от машины
function rejectCar(numb) {
    var car = cars[numb];
    var isRejected = confirm("Вы уверены что хотите отказаться принимать эту машину?");
    if(isRejected)
    {
        if(car.numb != 3)
        {
            alert('Неверно')
        }
        else
        {
            car.isActive = false;
        }
    }
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
var pauseButton = document.getElementById('pauseButton');
var exitButton = document.getElementById('exitButton');

insertCarValue();


