let x = 50; 
let y = 50; 
let dx = 0; // Change in x position (velocity in x-direction)
let dy = 0; // Change in y position (velocity in y-direction)
let speed = 1; 
let img_grade; // Variable to hold the image
let bgImage; // Variable to hold the background image

function preload() {
    bgImage = loadImage('./bg2.webp');
    img_grade = loadImage('./grade.png');
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight / 2);
    canvas.parent('canvas-container'); // Attach canvas to #canvas-container
    console.log("canvas width: ", windowWidth);
    console.log("canvas height: ", windowHeight/2);
}

function draw() {
    background(bgImage);

    // Calculate absolute positions and size based on percentages
    let absX = (x / 100) * width;
    let absY = (y / 100) * height;
    let imgWidth = 100; // Width of the image in pixels
    let imgHeight = 100; // Height of the image in pixels

    // Draw the image
    image(img_grade, absX, absY, imgWidth, imgHeight);

    // Calculate the distance to the mouse
    let mouseDistX = mouseX - (absX + imgWidth / 2);
    let mouseDistY = mouseY - (absY + imgHeight / 2);
    let distance = dist(mouseX, mouseY, absX + imgWidth / 2, absY + imgHeight / 2);

    // If the mouse is close, apply force in the opposite direction
    if (distance < 150) { // Adjust interaction radius
        dx -= (mouseDistX / distance) * speed;
        dy -= (mouseDistY / distance) * speed;
    }

    // Update position with velocity (percentage-based)
    x += (dx / width) * 100; // Convert velocity to percentage of width
    y += (dy / height) * 100; // Convert velocity to percentage of height

    // Dampen the velocity to simulate friction
    dx *= 0.95; // Friction factor for x
    dy *= 0.95; // Friction factor for y

    // Wrap around edges (percentage-based)
    if (x < 0) x = 100; // If the image exits left, reappear on the right
    if (x > 100) x = 0; // If the image exits right, reappear on the left
    if (y < 0) y = 100; // If the image exits top, reappear at the bottom
    if (y > 100) y = 0; // If the image exits bottom, reappear at the top
    // Log the values of x and y every second
    setInterval(() => {
        console.log('block x axis is:', x);
        console.log('block y axis is:', y);
    }, 2000); // Log every 2000ms (2 second)
}
