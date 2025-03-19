var bubbles = [];
var score = 0;
var timeRemaining = 200;
var currentTime = 0;
var backgroundVideo;
var videoTop;
var capture;
var img;
var bubbleImgs = [];
var img; // Declare the variable for the image

function preload() {
    // Preload three bubble images
    bubbleImgs.push(loadImage('cat.jpg'));
    bubbleImgs.push(loadImage('dog.jpg'));
    bubbleImgs.push(loadImage('di.webp'));

}

function createBubbles(numberOfBubbles) {
    for (var i = 0; i < numberOfBubbles; i++) {
        var randomImg = random(bubbleImgs); // Randomly select a bubble image
        var bubble = {
            diameter: 50, // Adjust bubble size
            pos: createVector(random(50, width - 50), random(50, height - 50)),
            vel: p5.Vector.random2D().mult(2), // Moderate speed
            img: randomImg, // Assign image to the bubble
            draw: function () {
                imageMode(CENTER);
                image(this.img, this.pos.x, this.pos.y, this.diameter, this.diameter);
                this.pos.add(this.vel);

                // Bounce off edges
                if (this.pos.y < this.diameter / 2 || this.pos.y > height - this.diameter / 2) {
                    var n = createVector(0, 1);
                    this.vel.reflect(n);
                }
                if (this.pos.x < this.diameter / 2 || this.pos.x > width - this.diameter / 2) {
                    var n = createVector(1, 0);
                    this.vel.reflect(n);
                }
            }
        };
        bubbles.push(bubble);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Background Video
    backgroundVideo = createVideo('fishbg.mp4', () => {
        backgroundVideo.loop();
        backgroundVideo.volume(0); // Mute audio
        backgroundVideo.hide(); // Hide HTML element
    });

    // Top Video
    videoTop = createVideo('flowerv.mp4', () => {
        videoTop.loop();
        videoTop.volume(0);
        videoTop.hide();
    });

    // Camera (Webcam)
    capture = createCapture(VIDEO);
    capture.size(300, 200);
    capture.hide();

    // Image using createImg() to meet the requirement
    img = createImg('bgm.png', 'BGM Image');
    img.position(20, height - 200); // Position it at the bottom left
    img.style('transform', 'scaleX(-1)'); // Flip horizontally
    img.size(200, 200); // Resize if needed

    // Define camera collision area (bottom-right corner)
    cameraBox = {
        x: width - 320,
        y: height - 200,
        w: 300,
        h: 200
    };

    // Create bubbles
    createBubbles(10);
}

function draw() {
    background(100);

    // Display Background Video
    image(backgroundVideo, 0, 0, 4000, 2000);

    // Display Other Videos
    image(videoTop, 10, 10, 600, 300);
    
    // Display Camera Feed (Bottom-Right)
    let camX = width - 160;
    let camY = height - 60;
    image(capture, camX, camY, 300, 200);

    // Bubble-Camera Collision
    for (let bubble of bubbles) {
        if (bubble.pos.x + bubble.diameter / 2 > cameraBox.x &&
            bubble.pos.x - bubble.diameter / 2 < cameraBox.x + cameraBox.w &&
            bubble.pos.y + bubble.diameter / 2 > cameraBox.y &&
            bubble.pos.y - bubble.diameter / 2 < cameraBox.y + cameraBox.h) {
            
            var n = createVector(1, 1);
            bubble.vel.reflect(n);
        }
    }

    // Bubble-BGM Collision
    let imgX = 100;
    let imgY = height - 200;
    let imgWidth = 250;
    let imgHeight = 250;

    bubbles = bubbles.filter(bubble => {
        let bubbleX = bubble.pos.x;
        let bubbleY = bubble.pos.y;
        let bubbleRadius = bubble.diameter / 2;

        // Remove bubble if it collides with bgm image
        if (
            bubbleX + bubbleRadius > imgX &&
            bubbleX - bubbleRadius < imgX + imgWidth &&
            bubbleY + bubbleRadius > imgY &&
            bubbleY - bubbleRadius < imgY + imgHeight
        ) {
            return false;
        }
        return true;
    });

    // Bubble-Bubble Collision
    for (let bubble of bubbles) {
        for (let otherBubble of bubbles) {
            if (bubble === otherBubble) continue;
            if (bubble.pos.dist(otherBubble.pos) < bubble.diameter / 2 + otherBubble.diameter / 2) {
                var n = createVector(1, 1);
                bubble.vel.reflect(n);
            }
        }
    }

    // Draw Bubbles (Using Random Images)
    for (let bubble of bubbles) {
        bubble.draw();
    }



    // Display Score & Timer
    fill(0);
    textSize(20);
    text(`Score: ${score}`, 10, 150);

    currentTime += deltaTime;
    timeRemaining = 200 - currentTime / 1000;
    text(`Time: ${timeRemaining.toFixed(1)}`, 10, 130);

    // End Game Condition
    if (timeRemaining <= 0) {
        bubbles = [];
        noLoop();
    }
}

function mousePressed() {
    // Click to Pop Bubbles
    for (let bubble of bubbles) {
        let mouseVec = createVector(mouseX, mouseY);
        let distance = bubble.pos.dist(mouseVec);
        if (distance < bubble.diameter / 2) {
            score++;
            bubble.popMe = true;
        }
    }
    bubbles = bubbles.filter(bubble => !bubble.popMe);

    // If only one bubble left, add more
    if (bubbles.length <= 1) {
        createBubbles(5);
    }
}
