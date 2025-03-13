var fireworks = [];
var addTriangles = true;
var colorPalettes = [
    [ [0, 102, 204], [51, 153, 255], [102, 204, 255], [153, 204, 255] ], // Blue Shades
    [ [255, 204, 0], [255, 153, 51], [255, 102, 0], [204, 102, 0] ],   // Yellow/Orange
    [ [255, 51, 51], [204, 0, 0], [153, 0, 0], [102, 0, 0] ],         // Red Shades
    [ [102, 204, 0], [51, 153, 51], [0, 102, 0], [0, 51, 0] ],        // Green Shades
    [ [204, 0, 204], [153, 51, 204], [102, 0, 153], [51, 0, 102] ],   // Purple Shades
    [ [0, 204, 204], [0, 153, 153], [0, 102, 102], [0, 51, 51] ],     // Cyan Shades
    [ [255, 255, 255], [200, 200, 200], [150, 150, 150], [100, 100, 100] ] // White/Grey
];
var shapes = ['circle', 'heart', 'emoji', 'star', 'meteor'];
var emojis = ['😊', '😂', '🤣', '😍', '🤩', '🥳', '🎆', '🎇', '🌟', '💥', '🔥', '💫', '✨', '💖', '🚀'];

function createFirework(x, y) {
    let numFireworks = floor(random(2, 6)); // Randomly spawn 2-5 fireworks at a time
    for (let i = 0; i < numFireworks; i++) {
        let shape = random(shapes);
        let colorSet = random(colorPalettes); // Select a single palette for one firework
        let fireworkEmoji = random(emojis); // Each firework uses the same emoji
        for (let j = 0; j < 50; j++) { // Each firework has 50 particles
            let colorChoice = random(colorSet);
            let size = random(4, 12); // Smaller and varied sizes
            let speedFactor = random(0.5, 2); // Random speed variation
            var ember = {
                x: x,
                y: y,
                xspeed: random(-3, 3) * speedFactor,
                yspeed: random(-3, 3) * speedFactor,
                alpha: 255,
                rotation: random(TWO_PI),
                size: size,
                shape: shape,
                colour: color(colorChoice[0], colorChoice[1], colorChoice[2], 255),
                draw: function () {
                    fill(this.colour);
                    noStroke();
                    push();
                    translate(this.x, this.y);
                    rotate(this.rotation);
                    
                    if (this.shape === 'circle') {
                        ellipse(0, 0, this.size);
                    } else if (this.shape === 'heart') {
                        beginShape();
                        vertex(0, -this.size);
                        bezierVertex(-this.size, -this.size * 1.5, -this.size * 1.5, 0, 0, this.size);
                        bezierVertex(this.size * 1.5, 0, this.size, -this.size * 1.5, 0, -this.size);
                        endShape(CLOSE);
                    } else if (this.shape === 'emoji') {
                        textSize(this.size);
                        text(fireworkEmoji, 0, 0);
                    } else if (this.shape === 'star') {
                        beginShape();
                        for (let k = 0; k < 10; k++) {
                            let angle = TWO_PI * k / 10;
                            let r = k % 2 === 0 ? this.size : this.size / 2;
                            vertex(cos(angle) * r, sin(angle) * r);
                        }
                        endShape(CLOSE);
                    } else if (this.shape === 'meteor') {
                        beginShape();
                        vertex(0, 0);
                        vertex(this.size * 2, this.size * 0.5);
                        vertex(this.size * 3, this.size);
                        vertex(this.size, this.size * 2);
                        vertex(0, this.size * 3);
                        endShape(CLOSE);
                    }
                    pop();
                    this.update();
                },
                update: function () {
                    this.x += this.xspeed;
                    this.y += this.yspeed;
                    this.yspeed += 0.05;
                    this.alpha -= 4;
                    this.colour.setAlpha(this.alpha);
                },
            };
            fireworks.push(ember);
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    clear(); // Removes any default background
}

function draw() {
    clear(); // Ensures transparency, removing previous black background
    for (let ember of fireworks) {
        ember.draw();
    }
    
    fireworks = fireworks.filter(ember => ember.alpha > 0);
    
    if (frameCount % 60 === 0) {
        createFirework(random(width), random(height));
    }
}

function mousePressed() {
    createFirework(mouseX, mouseY);
}
