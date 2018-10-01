function Ball(canvas) {
    Emitter.call(this);
    this.canvas=canvas;
    this.r=7;
    this.boundary={};
    this.middleX=null;
    this.middleY=null;
    this.stop();
    this.consolider();

    this.addEventListener("collision", function(e) {
        var ball = e.detail.me, eventType = e.detail.type;
        if(eventType == 'rightWall' || eventType == 'leftWall'){
            ball.init()
        }
        if(eventType == 'topWall' || eventType == 'bottomWall'){
            ball.y = (eventType == 'topWall' ) ? ball.r : ball.canvas.height-ball.r;
            ball.invertSpeedY();
        }
        if(eventType=='paddle') {
            var paddle=e.detail.with;
            ball.invertSpeedX();
            ball.speed.y += (paddle.speed.y / 2);
            ball.x += ball.speed.x;
         }        
    });

}

Ball.prototype.consolider = function(){
    this.boundary = {
        top : this.y - this.r,
        left : this.x - this.r,
        right : this.x + this.r,
        bottom : this.y + this.r
    }

    this.middleX=this.x;
    this.middleY=this.y;
}

Ball.prototype.init = function () {
    this.y = canvas.height/2;
    this.x = canvas.width/2;

    this.speed={
        x:3,
        y:0
    }
}

Ball.prototype.stop = function () {
    this.init()
    this.speed={
        x:0,
        y:0
    }
}

Ball.prototype.invertSpeedX = function () {
    this.speed.x*=-1;
}

Ball.prototype.invertSpeedY = function () {
    this.speed.y*=-1;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 2 * Math.PI, false);
    context.fillStyle = "#FFFFFF";
    context.fill();

    /*  show middle point
    context.beginPath();
    context.arc(this.x, this.y, 3, 2 * Math.PI, false);
    context.fillStyle = "#FF0000";
    context.fill();
    */
};

Ball.prototype.collisionEv = function (type, and) {
    this.dispatchEvent(new CustomEvent("collision", { 
        'detail': {
            'type':type,
            'me':this,
            'with':and
        }
    }));
}

Ball.prototype.update = function (paddle1, paddle2) {
    this.y += this.speed.y;
    this.x += this.speed.x;
    
    if (this.boundary.left < 0) {
        this.collisionEv('leftWall',this.canvas);
    } else if (this.boundary.right > this.canvas.width) {
        this.collisionEv('rightWall', this.canvas);
    }
    
    if (this.boundary.top < 0) {
        this.collisionEv('topWall', this.canvas);
    } else if (this.boundary.bottom > this.canvas.height) {
        this.collisionEv('bottomWall',this.canvas);
    }

    if(paddle1.collision(this)){
        this.collisionEv('paddle', paddle1);
    }

    if(paddle2.collision(this)){
        this.collisionEv('paddle', paddle2);
    }

    this.consolider();
};

