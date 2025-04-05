let score = 0;
let highscore = 0;
let playername = '';
let highscorename = 'Unknown';
let playernameInput, resetButton;
let previousPlayername = ""; // Added variable to store the previous name

let data;              // JSON data
let bgm;
let catImage;
let catImages = [];
let bgColor;
let musicOn = true;

let allthekitties = [];
let currentkitty = 0;
let kittyposition = {x: 100, y: 100, w: 100, h: 100};
let dogImages = [];
let currentDog = 0;
let dogPosition = { x: 300, y: 300, w: 100, h: 100 };

function preload() {
  data = loadJSON('data.json'); // Load JSON
  let url = 'https://api.thecatapi.com/v1/images/search?limit=10';
  loadJSON(url, successCallback);
  let dogUrl = 'https://api.thedogapi.com/v1/images/search?limit=10';
  loadJSON(dogUrl, successDogCallback);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(20);
  textAlign(CENTER);

  // Initial background color
  bgColor = color(255, 200, 200);

  // Load music
  bgm = loadSound(data.music, () => {
    userStartAudio().then(() => {
      if (!bgm.isPlaying()) bgm.loop();
    });
  });

  // Load images (from local JSON)
  for (let imgPath of data.images) {
    catImages.push(loadImage(imgPath));
  }

  // Load local highscore
  if (getItem('highscore') !== null) {
    highscore = int(getItem('highscore'));
    highscorename = getItem('highscorename');
  }

  playernameInput = createInput();
  playernameInput.attribute('placeholder', 'Player');
  playernameInput.position(windowWidth / 2 - 140, windowHeight / 7);

  // Clear placeholder 'Player' text on first input if it matches
  let cleared = false;
  playernameInput.input(() => {
    if (!cleared && playernameInput.value() === 'Player') {
      playernameInput.value('');
      cleared = true;
    }
  });
  playernameInput.elt.focus(); // Focus the input field initially

  resetButton = createButton('🔄Reset');
  resetButton.position(windowWidth / 2 + 40, windowHeight / 7);
  resetButton.mousePressed(() => {
    clearStorage(); // Clear local storage
    highscore = 0;
    highscorename = 'Unknown';
    score = 0; // Reset current score as well
  });

  // Initialize displaying a cat image (from local images)
  catImage = random(catImages);
  // Music button event listener
  document.getElementById('toggleMusic').addEventListener('click', toggleMusic);
}

function draw() {
  // Background color changes based on mouse position
  let r = map(mouseX, 0, width, 255, 180);   // A bit more red based on mouseX
  let g = map(mouseY, 0, height, 180, 200);  // A bit less green based on mouseY
  let b = map(mouseX + mouseY, 0, width + height, 255, 230); // A bit more blue based on mouseX+mouseY
  background(r, g, b);

  playername = playernameInput.value();
  let currentName = playernameInput.value();
  // If the player name changes, reset the score
  if (currentName !== previousPlayername) {
    score = 0;
    previousPlayername = currentName;
  }

  // Draw the center clickable circle
  fill(255);
  ellipse(width / 2, height / 2, 100, 100);

  // Display text information
  fill(0);
  text(`Score: ${score}`, width / 2, 30);
  text(`Player: ${playername}`, width / 2, 60);
  text(`Highscore: ${highscore} by ${highscorename}`, width / 2, 90);

  // Display the local cat image at the bottom center
  image(catImage, width / 2 - 50, height - 150, 100, 100);

  // Draw the API cat (if loaded)
  if (allthekitties.length > 0) {
    image(allthekitties[currentkitty], kittyposition.x, kittyposition.y, kittyposition.w, kittyposition.h);
  }
  // Draw the API dog (if loaded)
  if (dogImages.length > 0 && dogImages[currentDog]) {
    image(dogImages[currentDog], dogPosition.x, dogPosition.y, dogPosition.w, dogPosition.h);
  }
  console.log("allthekitties (API cats loaded):", allthekitties.length, "dogImages (API dogs loaded):", dogImages.length);
}

function mousePressed() {
  // Check if the center circle was clicked
  if (dist(mouseX, mouseY, width / 2, height / 2) < 50) {
    addScore();
  }

  // Check if the dog was clicked
  if (
    mouseX > dogPosition.x && mouseX < dogPosition.x + dogPosition.w &&
    mouseY > dogPosition.y && mouseY < dogPosition.y + dogPosition.h &&
    dogImages.length > 0 // Ensure dog images are loaded before interacting
  ) {
    score--; // Deduct score
    currentDog = (currentDog + 1) % dogImages.length; // Cycle to next dog
    // Move dog to a new random position
    dogPosition.x = random(width - dogPosition.w);
    dogPosition.y = random(height - dogPosition.h);
  }

  // Check if the API cat was clicked
  if (
    mouseX > kittyposition.x && mouseX < kittyposition.x + kittyposition.w &&
    mouseY > kittyposition.y && mouseY < kittyposition.y + kittyposition.h &&
    allthekitties.length > 0 // Ensure cat images are loaded before interacting
  ) {
    addScore();

    // Show the next cat at a random position
    currentkitty = (currentkitty + 1) % allthekitties.length;
    kittyposition.x = random(width - kittyposition.w);
    kittyposition.y = random(height - kittyposition.h);
  }
}

function addScore() {
  score++;
  // Update highscore if current score is higher
  if (score > highscore) {
    highscore = score;
    highscorename = playername || 'Unknown'; // Use 'Unknown' if name is empty
    storeItem('highscore', highscore);
    storeItem('highscorename', highscorename);
  }
}

function toggleMusic() {
  if (musicOn) {
    bgm.setVolume(0); // Mute
    document.getElementById('toggleMusic').innerText = '🔈 Music On'; // Update button text
  } else {
    bgm.setVolume(1); // Unmute (set volume to 1)
    document.getElementById('toggleMusic').innerText = '🔇 Music Off'; // Update button text
  }
  musicOn = !musicOn; // Toggle the state
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reposition UI elements on resize
  playernameInput.position(windowWidth / 2 - 140, windowHeight / 7);
  resetButton.position(windowWidth / 2 + 40, windowHeight / 7);
}

// Callback function for successful loading of cat images from API
function successCallback(data){
  for(let kitty of data){
    let img = createImg(kitty.url); // Create an HTML img element
    img.hide(); // Don't display directly in HTML DOM
    allthekitties.push(img); // Add the p5.Image object to the array
  }
}

// Callback function for successful loading of dog images from API
function successDogCallback(data) {
  for (let dog of data) {
    // Use loadImage for p5 compatibility (unlike createImg used for cats)
    loadImage(dog.url,
      (img) => {
        dogImages.push(img); // Successfully loaded, add to array
      },
      (err) => {
        // Log error if a dog image fails to load
        console.error("🐶 Failed to load dog image:", err, dog.url);
      }
    );
  }
}