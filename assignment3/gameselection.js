let input, button, startGame = false;
let playerName = '';
let gamePaused = false;
let currentGame = null;
let showPauseMenuFlag = false; // Controls whether the pause menu is shown
let gameSelectionButtons = []; // Store game selection buttons
let gameSelectionImages = []; 
let comments = []; // Store comments

let pauseMenuButtons = []; // Store pause menu buttons

// Game instances
let gateGame;
let game2048;
let snakeGame;
let tetrisGame;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  window.addEventListener("keydown", function(event) {
    if ([37, 38, 39, 40].includes(event.keyCode)) { // check the direction keys
      event.preventDefault(); // prevent rolling the page
    }
  });

  input = createInput("").attribute("placeholder", "Type your name to continue");
  input.position(width / 2 - 200, height / 2);
  input.input(() => console.log("Typing: " + input.value()));

  button = createButton("Start Game");
  button.position(input.x + input.width + 10, height / 2);
  button.mousePressed(startGameCheck);

  document.getElementById("exit-button").style.display = "block";  // Exit button visible
  document.getElementById("back-button").style.display = "none";   // Back button hidden initially
}

function startGameCheck() {
  playerName = input.value().trim();
  if (playerName !== "") {
      startGame = true;
      input.hide();
      button.hide();

      document.getElementById("exit-button").style.display = "none"; // Hide Exit button
      document.getElementById("back-button").style.display = "block"; // Show Back button

      showGameSelection();
  } else {
      alert("Please enter your name before starting!");
  }
}

function showGameSelection() {
  background(50);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(`Welcome ${playerName}, please select a game`, width / 2, height / 5);

  document.getElementById("back-button").style.display = "block"; // Ensure Back button is visible
  document.getElementById("back-button").onclick = function () {
      location.reload(); // Refresh the page
  };

  gameSelectionButtons.forEach(btn => btn.remove());
  gameSelectionButtons = [];

  let images = {
      "gate": "gate.png",
      "2048": "2048.png",
      "snake": "snake.png",
      "tetris": "tetris.png"
  };

  let games = [
      { key: "gate", label: "Best game ever" },
      { key: "2048", label: "2048" },
      { key: "snake", label: "Snake" },
      { key: "tetris", label: "Tetris" }
  ];

  let spacing = width / games.length;
  let startX = spacing / 2;
  let yPosition = height / 2;

  for (let i = 0; i < games.length; i++) {
      let x = startX + i * spacing;

      let img = createImg(images[games[i].key], "Game Image");
      img.size(200, 200);
      img.position(x - 100, yPosition - 100);
      gameSelectionImages.push(img);

      let btn = createButton(games[i].label);
      btn.position(x - 75, yPosition + 130);
      btn.size(150, 40);
      btn.mousePressed(() => {
          hideGameSelectionUI();
          startGameLogic(games[i].key);
      });

      gameSelectionButtons.push(btn);
  }

  let commentInput = createInput("").attribute("placeholder", "Leave a comment");
  let commentY = height - 90; // change of y position
  commentInput.position(width / 2 - 200, commentY);
  let commentButton = createButton("Upload Comment");
  commentButton.position(commentInput.x + commentInput.width + 10, commentY);
  commentButton.mousePressed(() => {
    let comment = commentInput.value().trim();
    if (comment === "") {
        alert("Sorry, you cannot complete the message without entering content🤔"); 
    } else {
        comments.push(comment);
        commentInput.value(''); // clear the input field
        displayComments();
    }
});
}

function displayComments() {
  let yPosition = height - 150;
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  for (let i = 0; i < comments.length; i++) {
    text(comments[i], 20, yPosition);
    yPosition -= 20;
  }
}


// Function to hide images and buttons when a game starts
function hideGameSelectionUI() {
  gameSelectionButtons.forEach(btn => btn.remove());
  gameSelectionImages.forEach(img => img.remove());
  gameSelectionButtons = [];
  gameSelectionImages = [];
}

function startGameLogic(game) {
  currentGame = game;
  window.currentGame = game;

  // Hide Back button in game mode
  document.getElementById("back-button").style.display = "none";

  gameSelectionButtons.forEach(btn => btn.hide());

  if (game === 'gate') {
      gateGame = new Game();
      enterFullScreen();
  } else if (game === '2048') {
      game2048 = new Game2048();
      enterFullScreen();
  } else if (game === 'snake') {
      snakeGame = new SnakeGame();
      enterFullScreen();
  } else if (game === 'tetris') {
      tetrisGame = new Tetris();
      enterFullScreen();
  }
}

function enterFullScreen() {
  let fs = fullscreen();
  if (!fs) {
    fullscreen(true);
  }
}

function draw() {
  if (!startGame) {
    background(50);
    fill(255);
    textSize(24);
    text("Enter your name to Start", width / 2, height / 3);
    return;
  }

  // Clear the game selection text when a game is selected
  if (currentGame !== null) {
    background(50); // Clear the background
  }

  // Only update the game logic if the game is not paused
  if (!gamePaused) {
    if (currentGame === 'gate') {
      gateGame.update();
      gateGame.show();
    } else if (currentGame === '2048') {
      game2048.show();
    } else if (currentGame === 'snake') {
      snakeGame.update();
      snakeGame.show();
    } else if (currentGame === 'tetris') {
      tetrisGame.update();
      tetrisGame.show();
    }
  }

  // Show pause menu only if the game is paused and the flag is true
  if (gamePaused && showPauseMenuFlag) {
    showPauseMenu();
  }
}

function showPauseMenu() {
  // Dark overlay for pause menu
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  // Pause menu text
  fill(255);
  textSize(24);
  text("Paused", width / 2, height / 2 - 50);

  // Clear existing pause menu buttons
  pauseMenuButtons.forEach(btn => btn.remove());
  pauseMenuButtons = [];

  // Resume button
  let resumeButton = createButton("Resume");
  resumeButton.position(width / 2 - 50, height / 2);
  resumeButton.mousePressed(() => {
    resumeGame();
  });
  pauseMenuButtons.push(resumeButton);

  // Exit button
  let exitButton = createButton("Exit");
  exitButton.position(width / 2 - 50, height / 2 + 50);
  exitButton.mousePressed(() => {
    exitGame();
  });
  pauseMenuButtons.push(exitButton);
}

function resumeGame() {
  gamePaused = false;
  showPauseMenuFlag = false; // Hide the pause menu
  fullscreen(true);

  // Remove all pause menu buttons
  pauseMenuButtons.forEach(btn => btn.remove());
  pauseMenuButtons = [];
}

function exitGame() {
  gamePaused = false;
  showPauseMenuFlag = false;
  fullscreen(false);
  currentGame = null;
  window.currentGame = null;

  pauseMenuButtons.forEach(btn => btn.remove());
  pauseMenuButtons = [];

  showGameSelection();

  document.getElementById("back-button").onclick = function () {
      location.reload(); // Reset back button behavior
  };
}

function keyPressed() {
  if (keyCode === ENTER && !startGame) {
    startGameCheck(); // Start game when Enter is pressed
  }
  if (key === 'F') {
    fullscreen(!fullscreen()); // Toggle full-screen mode
  }

  // Only allow ESC to pause if a game is active
  if (key === 'Escape' && currentGame !== null) {
    gamePaused = !gamePaused; // Toggle pause state
    showPauseMenuFlag = gamePaused; // Show pause menu only if game is paused
  }

  // Delegate key events to the active game
  if (currentGame === 'gate') {
    gateGame.handleKeyPress(keyCode);
  } else if (currentGame === '2048') {
    game2048.handleKeyPress(keyCode);
  } else if (currentGame === 'snake') {
    snakeGame.handleKeyPress(keyCode);
  } else if (currentGame === 'tetris') {
    tetrisGame.handleKeyPress(keyCode);
  }
}