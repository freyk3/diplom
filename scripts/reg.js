/**
 * Created by Freyk on 26.10.2016.
 */
var fs = require('fs');
var path = require('path');
var file = 'users.json';
var filePath = path.join(nw.App.dataPath, file);

function reg() {
    var contents = fs.readFileSync(filePath, 'utf8');
    var users = JSON.parse(contents);
    var inputLogin = document.getElementById('inputLogin').value;
    var inputName = document.getElementById('inputName').value;
    var inputSurname = document.getElementById('inputSurname').value;
    var inputGroup = document.getElementById('inputGroup').value;
    var inputPassword = document.getElementById('inputPassword').value;
    var inputConfirmPassword = document.getElementById('inputConfirmPassword').value;
    var user;

    for(var key in users)
    {
        if (!users.hasOwnProperty(key)) continue;
        var tempUser = users[key];

        if(tempUser.login == inputLogin)
        {
            user = tempUser;
            break;
        }
    }

    /* Блок ошибок */
    if(inputLogin == '' || inputPassword == '' || inputConfirmPassword == '')
    {
        alert('Введите данные');
        return;
    }
    if(inputPassword != inputConfirmPassword)
    {
        alert('Пароли не совпадают');
        return;
    }
    if (user !== undefined)
    {
        alert('Такой логин уже существует');
        return;
    }

    var newUser = {
        login: inputLogin,
        name: inputName,
        surname: inputSurname,
        group: inputGroup,
        password: inputPassword,
        reports: []
    };
    users[inputLogin] = newUser;
    var jsonResponse = JSON.stringify(users);
    fs.writeFileSync(filePath,jsonResponse);
    document.location.href='login.html';

}