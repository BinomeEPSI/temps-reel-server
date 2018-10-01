function Paddle(x, y, width, height, canvas, maxSpeed) {
    Emitter.call(this);
    this.canvas=canvas;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = {
        x: 0,
        y: 0,
        max: {
            x: maxSpeed,
            y: maxSpeed
        }
    }

    this.addEventListener("collision", function(e) {
        var paddle = e.detail.me, eventType = e.detail.type;
        if(eventType == 'topWall' || eventType == 'bottomWall'){
            paddle.y = (eventType == 'topWall' ) ? 0 : paddle.canvas.height - paddle.height;
            paddle.speed.y = 0;
            paddle.consolider()
        }        
    });

    this.middleX=null;
    this.middleY=null;
    this.middleWidth=this.width/2;
    this.middleHeight=this.height/2;
    this.consolider()
}

Paddle.prototype.consolider = function () {
    this.boundary = {
        top: this.y,
        left: this.x,
        right: this.x + this.width,
        bottom: this.y + this.height
    }

    this.middleX = this.x + this.middleWidth;
    this.middleY = this.y + this.middleHeight;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.beginPath();

     /*  show middle point
    context.arc(this.middleX, this.middleY, 3, 2 * Math.PI, false);
    context.fillStyle = "#FF0000";
    context.fill();
    */
};

Paddle.prototype.collisionEv = function (type, and) {
    this.dispatchEvent(new CustomEvent("collision", { 
        'detail': {
            'type':type,
            'me': this,
            'with':and
        }
    }));
}

Paddle.prototype.collision = function(ball) {
    
    var circleDistance = {
        x: Math.abs(ball.x - this.middleX),
        y: Math.abs(ball.y - this.middleY)
    }

    if (circleDistance.x > (this.middleWidth + ball.r) || circleDistance.y > (this.middleHeight + ball.r)) {
        return false;
    }

    if (circleDistance.x <= this.middleWidth || circleDistance.y <= this.middleHeight) {
        return true;
    }

    cornerDistanceSq = Math.sqrt(circleDistance.x - this.middleWidth) +
        Math.sqrt(circleDistance.y - this.middleHeight);

    return (cornerDistanceSq <= (Math.sqrt(ball.r)));
}

Paddle.prototype.stop = function(){
    this.move(0,0);
}

Paddle.prototype.up = function(){
    this.move(0,-this.speed.max.y);
}

Paddle.prototype.down = function () {
    this.move(0, this.speed.max.y);
}


Paddle.prototype.update = function () {
    this.move(0,this.speed.y)
}


Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;

    this.speed.x = x;
    this.speed.y = y;

    if (this.y < 0) {
        this.collisionEv('topWall',this.canvas);
    } else if (this.y + this.height > this.canvas.height) {
        this.collisionEv('bottomWall',this.canvas);
    }

    this.consolider()
};