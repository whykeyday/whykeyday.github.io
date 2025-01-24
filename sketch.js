let x = 50; // Initial x position of the square (in percentage of canvas width)
let y = 50; // Initial y position of the square (in percentage of canvas height)
let dx = 0; // Change in x position (velocity in x-direction)
let dy = 0; // Change in y position (velocity in y-direction)
let speed = 1.5; // Speed multiplier for movement
let squareSize = 5; // Size of the square (in percentage of canvas width)
let bgImage; // Variable to hold the background image

function preload() {
    // Load the background image
    bgImage = loadImage('./bg2.webp');
}

function setup() {
    // Create canvas and attach it to the container
    let canvas = createCanvas(windowWidth, windowHeight / 2);
    canvas.parent('canvas-container'); // Attach canvas to #canvas-container
}

function draw() {
    // Draw the background image
    background(bgImage);

    fill(0); // Black square

    // Calculate absolute positions and size based on percentages
    let absX = (x / 100) * width;
    let absY = (y / 100) * height;
    let absSize = (squareSize / 100) * width;

    // Draw the square
    rect(absX, absY, absSize, absSize);

    // Calculate the distance to the mouse
    let mouseDistX = mouseX - absX - absSize / 2;
    let mouseDistY = mouseY - absY - absSize / 2;
    let distance = dist(mouseX, mouseY, absX + absSize / 2, absY + absSize / 2);

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
    if (x < 0) x = 100; // If the square exits left, reappear on the right
    if (x > 100) x = 0; // If the square exits right, reappear on the left
    if (y < 0) y = 100; // If the square exits top, reappear at the bottom
    if (y > 100) y = 0; // If the square exits bottom, reappear at the top
}
