function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w &&
           obj1.x + obj1.w > obj2.x &&
           obj1.y < obj2.y + obj2.h &&
           obj1.y + obj1.h > obj2.y;
}


function checkCircleCollision(obj1, obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let distance = sqrt(dx * dx + dy * dy);
    let radiusSum = (obj1.w / 2) + (obj2.w / 2);
    return distance < radiusSum;
}

function handleCollision(obj1, obj2) {
    if (checkCollision(obj1, obj2)) {
        let tempXSpeed = obj1.xSpeed;
        let tempYSpeed = obj1.ySpeed;
        obj1.xSpeed = obj2.xSpeed;
        obj1.ySpeed = obj2.ySpeed;
        obj2.xSpeed = tempXSpeed;
        obj2.ySpeed = tempYSpeed;
    }
}

function handleCollisionStar(obj1, obj2) {
    if (checkCircleCollision(obj1, obj2)) {
        obj1.xSpeed *= -1;
        obj1.ySpeed *= -1;
        obj2.xSpeed *= -1;
        obj2.ySpeed *= -1;
    }
}

var redBrick = {
    x: 0,
    y: 0,
    w: 50, 
    h: 50,
    xSpeed: 8,
    ySpeed: 8,
    colour: 'red',

    draw: function(){
        fill(this.colour);
        rect(this.x, this.y, this.w, this.h);
    },

    move: function(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x > width - this.w || this.x < 0){
            this.xSpeed *= -1;
        }
        if (this.y > height - this.h || this.y < 0){
            this.ySpeed *= -1;
        }
    }
};

var blueBrick = {
    x: 1080,
    y: 0,
    w: 60, 
    h: 60,
    xSpeed: 5,
    ySpeed: 5,
    colour: "#9ACDFF",

    draw: function(){
        fill(this.colour);
        if (this.colour === 'yellow') {
            ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
        } else {
            rect(this.x, this.y, this.w, this.h);
        }
    },

    move: function(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x > width - this.w || this.x < 0){
            this.xSpeed *= -1;
        }
        if (this.y > height - this.h || this.y < 0){
            this.ySpeed *= -1;
        }

        this.colour = (this.x > width / 2) ? 'yellow' : "#9ACDFF";
    }
};

var star = {
    x: windowWidth / 3,
    y: windowHeight / 3,
    w: 70, 
    h: 70,
    colour: 'white',
    stroke: 'purple',
    strokeWeight: 2,
    radius1: 30,
    radius2: 70,
    npoints: 5,
    angle: 0,
    shape: 'star',
    lastSwitch: 0,
    heartScale: 1,
    heartScaleDirection: 1,

    isMouseOver: function() {
        let d = dist(mouseX, mouseY, this.x, this.y);
        return d < this.radius2;
    },

    draw: function(){
        if (this.isMouseOver()) {
            this.colour = "#B9AEFF";
        } else {
            this.colour = 'white';
        }

        stroke(this.stroke);
        strokeWeight(this.strokeWeight);
        fill(this.colour);
        push();
        translate(this.x, this.y);

        if (this.shape === 'star') {
            let angle = (Math.PI * 2) / this.npoints;
            let halfAngle = angle / 2.0;
            rotate(this.angle);
            beginShape();
            for (let a = 0; a < Math.PI * 2; a += angle) {
                let sx = cos(a) * this.radius2;
                let sy = sin(a) * this.radius2;
                vertex(sx, sy);
                sx = cos(a + halfAngle) * this.radius1;
                sy = sin(a + halfAngle) * this.radius1;
                vertex(sx, sy);
            }
            endShape(CLOSE);
        } else if (this.shape === 'heart') {
            scale(this.heartScale);
            beginShape();
            for (let t = 0; t < Math.PI * 2; t += 0.01) {
                let x = 16 * pow(sin(t), 3);
                let y = - (13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t));
                vertex(x * 2, y * 2);
            }
            endShape(CLOSE);
        }

        pop();
    },

    move: function(){
        this.angle += 0.006;

        if (millis() - this.lastSwitch > 5000) {
            this.shape = this.shape === 'star' ? 'heart' : 'star';
            this.lastSwitch = millis();
        }

        if (this.shape === 'heart') {
            this.heartScale += 0.01 * this.heartScaleDirection;
            if (this.heartScale > 1.2 || this.heartScale < 0.8) {
                this.heartScaleDirection *= -1;
            }
        }
    }
};

function setup(){
    createCanvas(windowWidth, windowHeight);
    redBrick.w = windowHeight / 15;
    redBrick.h = windowHeight / 15;
    blueBrick.w = windowHeight / 12;
    blueBrick.h = windowHeight / 12;
    star.w = windowHeight / 10;
    star.h = windowHeight / 10;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    redBrick.w = windowHeight / 15;
    redBrick.h = windowHeight / 15;
    blueBrick.w = windowHeight / 12;
    blueBrick.h = windowHeight / 12;
    star.w = windowHeight / 10;
    star.h = windowHeight / 10;
}

function draw(){
    background("#FFF0F0");

    redBrick.draw();
    redBrick.move();
    
    blueBrick.draw();
    blueBrick.move();
    
    star.draw(); 
    star.move();  

    handleCollision(redBrick, blueBrick);
    handleCollisionStar(redBrick, star);
    handleCollisionStar(blueBrick, star);
}
