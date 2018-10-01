function Player(canvas) {
    Emitter.call(this);
    this.paddle = new Paddle(canvas.width-20,canvas.height/2-25, 10, 50, canvas, 4);
    this.prevCommand=null;
    var that = this
    window.addEventListener("keydown", function (event) {
        if (event.keyCode == 40 && that.prevCommand!='down'){
            that.paddle.down();
            that.controlEv('down');
            that.prevCommand='down';
        } else if (event.keyCode == 38 && that.prevCommand!='up'){
            that.paddle.up();
            that.controlEv('up');
            that.prevCommand='up';
        }
    });
    
    window.addEventListener("keyup", function (event) {
        if((event.keyCode == 38 || event.keyCode == 40) && that.prevCommand!='stop') {
            that.paddle.stop();
            that.controlEv('stop');
            that.prevCommand='stop';
        }
    });
}

Player.prototype.controlEv = function (type) {
    this.dispatchEvent(new CustomEvent("control", { 
        'detail': {
            'type':type,
            'me': this
        }
    }));
}

Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function () {
    this.paddle.update();
};