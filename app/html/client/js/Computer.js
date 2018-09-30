function Computer(canvas, paddle) {
    this.canvas = canvas;
    this.paddle = paddle;
    this.active=true
}

Computer.prototype.fireKeyboardEvent = function(event, keycode) {
    var keyboardEvent = document.createEventObject ?
        document.createEventObject() : document.createEvent("Events");

    if (keyboardEvent.initEvent) {
        keyboardEvent.initEvent(event, true, true);
    }

    keyboardEvent.keyCode = keycode;
    keyboardEvent.which = keycode;

    document.dispatchEvent ? document.dispatchEvent(keyboardEvent)
        : document.fireEvent(event, keyboardEvent);
}

Computer.prototype.update = function (ball) {
    if(this.active){
        var y_pos = ball.y;
        var diff = this.paddle.middleY - y_pos;
        if (diff < 0 && diff < -4) {
            //this.keyDown('(')
            this.fireKeyboardEvent("keydown", 40);
        } else if (diff > 0 && diff > 4) {
            // this.keyDown('&')
            this.fireKeyboardEvent("keydown", 38);
        } else {
            this.fireKeyboardEvent("keyup", 40);
        }
    }
};

