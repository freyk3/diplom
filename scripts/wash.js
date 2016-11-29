/**
 * Created by Freyk on 28.11.2016.
 */

function Button(numb,str) {
    this.numb = numb;
    this.isPressed = false;
    this.message = str+' наливается...';
}
var button0 = new Button(0,'Холодная вода'),
    button1 = new Button(1,'Щелочь NaOH'),
    button2 = new Button(2,'Кислота HNO3'),
    button3 = new Button(3,'Дез. раствор'),
    button4 = new Button(4,'Горячая вода');
var buttons = [button0,button1,button2,button3,button4];

function launch(numb) {
    var button = buttons[numb];
    var message = document.getElementById('progressText');

    if(isFilling)
    {
        alert('Ожидайте окончания процесса');
    }
    else
    {
        if(button.isPressed)
        {
            alert('Уже запускали');
            return;
        }

        if(numb == 0)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            moveBar(0);
        } else if(numb == 1 && button0.isPressed)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            moveBar(1);
        } else if(numb == 2 && button0.isPressed && button1.isPressed)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            moveBar(2);
        } else if(numb == 3 && button0.isPressed && button1.isPressed && button2.isPressed)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            moveBar(3);
        } else if(numb == 4 && button0.isPressed && button1.isPressed && button2.isPressed && button3.isPressed)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            moveBar(4);
        } else
        {
            alert('Неправильно!');
        }
    }

}

function moveBar(numb) {
    var elem = document.getElementById("myBar");
    var width = 1;
    isFilling = true;
    var id = setInterval(frame, 50);
    function frame() {
        if (width >= 100) {
            isFilling = false;
            clearInterval(id);
            if(numb == 4)
                alert('Работа окончена!');
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}

var isFilling = false;