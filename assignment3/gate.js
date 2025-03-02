class Game {
    constructor() {
      this.player = new Player();
      this.obstacles = [];
      this.powerUps = [];
      this.gameSpeed = 2;
      this.score = 0;
      this.numberOfClicks = 0; // Track the number of clicks
      this.setupIssueFunction(); // Call the setup function
    }
  
    setupIssueFunction() {
      // Run the issue function after 2 seconds
      setTimeout(() => {
        this.issue();
      }, 2000);
    }
  
    issue() {
        console.log("Issue function called"); // Debugging log
    
        // Array of exit messages for the buttons
        const exitMessages = [
            "Oh no, the game died! Quick, click me to revive it! 🙃",
            "Leaving so soon? You barely lasted! Click me if you're weak.",
            "Wow, running away already? I expected more. Click me, coward.",
            "No no no, you can't just leave! Click me to fix your mistakes.",
            "Hold up! You’re not allowed to go yet. Click me and behave.",
            "Oh, you actually thought clicking would work? Try again, genius.",
            "Pathetic attempt. Put some effort in—SMASH that button! 🔨",
            "Wow… That was a toddler tap. Hit it like you’ve got a backbone!",
            "HAHA! This is too easy. You’re falling for it every time. 🤡",
            "Okay okay, for real this time—this is the last one… or is it? 😏",
            "Fine, I guess you win… unless… just one more? No? Alright… 👀"
        ];
    
        let index = 0;
    
        const showNextButton = () => {
            if (index < exitMessages.length) {
                setTimeout(() => {
                    let btn = createButton(exitMessages[index]);
                    btn.position(random(50, windowWidth - 300), random(50, windowHeight - 100));
    
                    // Generate a random shape using border-radius
                    let borderRadius = `${random(0, 50)}% ${random(0, 50)}% ${random(0, 50)}% ${random(0, 50)}%`;
    
                    btn.style("background-color", color(random(100, 255), random(100, 255), random(100, 255)));
                    btn.style("padding", "15px");
                    btn.style("font-size", "16px");
                    btn.style("text-align", "center");
                    btn.style("border-radius", borderRadius);
                    btn.style("border", "2px solid white");
                    btn.style("max-width", "250px");
                    btn.style("word-wrap", "break-word");
                    btn.style("display", "inline-block");
    
                    // Ensure the button resizes to fit content
                    btn.style("width", "auto");
                    btn.style("height", "auto");
    
                    // Button color changes on hover
                    btn.mouseOver(() => {
                        btn.style("background-color", color(random(100, 255), random(100, 255), random(100, 255)));
                    });
    
                    // Button click logic
                    btn.mousePressed(() => {
                        btn.style("background-color", color(random(100, 255), random(100, 255), random(100, 255)));
                        btn.hide();
                        index++;
    
                        if (index === exitMessages.length) {
                            fullscreen(false);
                            window.location.reload();
                        } else {
                            showNextButton();
                        }
                    });
                }, 2000);
            }
        };
    
        showNextButton();
    }
    
  
    sillything() {
      console.log(`Button clicked ${this.numberOfClicks} times!`);
      // Add any additional logic for the sillything function
    }
  
    update() {
      this.player.update();
      if (frameCount % 60 === 0) {
        this.obstacles.push(new Obstacle());
      }
      this.obstacles.forEach((obs, index) => {
        obs.move();
        if (obs.hits(this.player)) this.resetGame();
        if (obs.offscreen()) this.obstacles.splice(index, 1);
      });
      if (frameCount % 150 === 0) {
        this.powerUps.push(new PowerUp());
      }
      this.powerUps.forEach((p, index) => {
        p.move();
        if (p.hits(this.player)) {
          this.score += 10;
          this.powerUps.splice(index, 1);
        }
        if (p.offscreen()) this.powerUps.splice(index, 1);
      });
    }
  
    show() {
      // background(50); // Remove this line
      this.player.show();
      this.obstacles.forEach(obs => obs.show());
      this.powerUps.forEach(p => p.show());
      fill(255);
      textSize(20);
      text(`Score: ${this.score}`, width - 80, 30);
    }
  
    resetGame() {
      this.player = new Player();
      this.obstacles = [];
      this.powerUps = [];
      this.score = 0;
    }
  
    handleKeyPress(keyCode) {
      // Arrow keys are already handled in the Player class
    }
  }
  
  class Player {
    constructor() {
      this.x = width / 4;
      this.y = height / 2;
      this.size = 20;
    }
    update() {
      if (keyIsDown(UP_ARROW)) this.y -= 5;
      if (keyIsDown(DOWN_ARROW)) this.y += 5;
      if (keyIsDown(LEFT_ARROW)) this.x -= 5;
      if (keyIsDown(RIGHT_ARROW)) this.x += 5;
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
    }
    show() {
      fill(0, 255, 0);
      ellipse(this.x, this.y, this.size);
    }
  }
  
  class Obstacle {
    constructor() {
      this.x = width;
      this.y = random(height);
      this.size = random(20, 40);
    }
    move() {
      this.x -= this.gameSpeed;
    }
    show() {
      fill(255, 0, 0);
      rect(this.x, this.y, this.size, this.size);
    }
    hits(player) {
      return collideRectCircle(this.x, this.y, this.size, this.size, player.x, player.y, player.size);
    }
    offscreen() {
      return this.x < -this.size;
    }
  }
  
  class PowerUp {
    constructor() {
      this.x = width;
      this.y = random(height);
      this.size = 15;
    }
    move() {
      this.x -= this.gameSpeed;
    }
    show() {
      fill(0, 0, 255);
      ellipse(this.x, this.y, this.size);
    }
    hits(player) {
      return collideCircleCircle(this.x, this.y, this.size, player.x, player.y, player.size);
    }
    offscreen() {
      return this.x < -this.size;
    }
  }