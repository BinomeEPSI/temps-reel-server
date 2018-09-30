function PlayerAPI(canvas) {
    this.canvas = canvas;
    this.paddle = new Paddle(10, canvas.height / 2 - 25, 10, 50, canvas, 4);
}

PlayerAPI.prototype.render = function () {
    this.paddle.render();
};

PlayerAPI.prototype.update = function (ball) {
    this.paddle.update();
};

