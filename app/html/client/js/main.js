var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};

var canvas = document.createElement("canvas");
var width = 500;
var height = 300;
canvas.width = width;
canvas.height = height;

var context = canvas.getContext('2d');
//context.transform(1, 0, 0, -1, 0, canvas.height)
var player = new Player(canvas);
var apiPlayer = new PlayerAPI(canvas);
var ball = new Ball(canvas);
var api = new API();

var computer = new Computer(canvas, player.paddle);
computer.active = false

//ball.addEventListener("collision", function (e) {
//console.log(e.detail.type);
//});

player.addEventListener("control", function (e) {
    console.log(e.detail.type);
    if (api.isGameStarted()) {
        api.sendMessage(function (res) {
            console.log(res)
        }, api.opponent, e.detail.type)
    }
});

api.addEventListener("messageReceived", function (e) {
    console.info("Message received ! ")
    console.log(e.detail);
    var message = e.detail.data.data;
    var currentUser = e.detail.data.currentUser;
    switch (message) {
        case "start":
            startGame(function () {
                ball.init()
                ball.invertSpeedX() // l'host engage

                var buttons = document.getElementsByClassName('button-users');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].classList.add('hidden')
                }
            }); // Synchro d'horloge
            break;
        case "down":
            apiPlayer.paddle.down()
            break;
        case "up":
            apiPlayer.paddle.up()
            break;
        case "stop":
            apiPlayer.paddle.stop();
            break;
    }
    api.getMessage()
})

var keysDown = {};
window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

var render = function () {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.update(ball);
    apiPlayer.render();
    if (ball != undefined) {
        ball.render();
    }
};

var update = function () {
    player.update();
    computer.update(ball);
    apiPlayer.update();
    if (ball != undefined) {
        ball.update(player.paddle, apiPlayer.paddle);
    }
};

var step = function () {
    update();
    render();
    animate(step);
};

var startGame = function (callback) {
    var msInterval = 50
    var secondsBeforeStart = 5;
    var t = new Date();
    t.setSeconds(t.getSeconds() + secondsBeforeStart);
    var msTimerObjective = t.getTime();

    var intervalBeforeStart = setInterval(function () {
        var now = new Date();
        now.setMilliseconds(now.getMilliseconds() - api.delta);
        var msTimerNow = now.getTime();
        var msTimeLeft = msTimerObjective - msTimerNow;

        document.getElementById("timer").innerHTML = msTimeLeft + " ms before start...";

        if (msTimeLeft < 0) {
            clearInterval(intervalBeforeStart);
            document.getElementById("timer").innerHTML = "START NOW !";
            callback();
        }
    }, msInterval)
}

document.body.appendChild(canvas);
animate(step);