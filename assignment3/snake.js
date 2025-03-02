class SnakeGame {
    constructor() {
        this.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
        this.direction = { x: 1, y: 0 };
        this.food = this.spawnFood();
        this.bonus = null; // Bonus starts as null
        this.moveInterval = 10;
        this.moveCounter = 0;
        this.bonusTimer = millis();
        this.bonusActive = false;
        this.snakeColor = this.getRandomPastelColor(); // Set initial random pastel color
    }

    getRandomPastelColor() {
        const pastelColors = [
            "#FFB6C1", // Light Pink
            "#FFDAB9", // Peach Puff
            "#E6E6FA", // Lavender
            "#B0E0E6", // Powder Blue
            "#98FB98", // Pale Green
            "#FFFACD", // Lemon Chiffon
            "#F5DEB3", // Wheat
            "#FAEBD7", // Antique White
            "#D8BFD8", // Thistle
            "#FFC0CB"  // Pink
        ];
        return random(pastelColors);
    }

    spawnFood() {
        return { x: floor(random(0, 20)), y: floor(random(0, 20)) };
    }

    spawnBonus() {
        this.bonus = { x: floor(random(0, 20)), y: floor(random(0, 20)) };
        this.bonusActive = true;
    }

    update() {
        this.moveCounter++;
        if (this.moveCounter < this.moveInterval) return;
        this.moveCounter = 0;

        let head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

        // Check for collision with walls
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            this.gameOver();
            return;
        }

        // Check for collision with itself
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }

        // If the snake eats food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.spawnFood();
            this.snake.push({});
            this.snakeColor = this.getRandomPastelColor(); // Change color when eating food
            if (this.snake.length % 5 === 0) {
                this.moveInterval = max(3, this.moveInterval - 1); // Increase speed
            }
        } else {
            this.snake.pop();
        }

        // Spawn bonus every 10 seconds if not already active
        if (!this.bonusActive && millis() - this.bonusTimer > 10000) {
            this.spawnBonus();
        }

        if (this.bonusActive && head.x === this.bonus.x && head.y === this.bonus.y) {
            for (let i = 0; i < 10; i++) this.snake.push({});
            this.snakeColor = this.getRandomPastelColor(); // Change color when eating bonus
            this.bonus = null;
            this.bonusActive = false;
            this.bonusTimer = millis(); // Reset timer after collecting bonus
        }

        this.snake.unshift(head);
    }

    show() {
        background(50);
        fill(255);
        textSize(24);
        textAlign(CENTER, CENTER);

        // Move title outside the play area
        text("Snake Game", width / 2, (height - 400) / 2 - 30);

        // Display score above the title
        textSize(18);
        text(`Score: ${this.snake.length-3}`, width / 2, (height - 400) / 2 - 60);

        // Define the grid size
        let gridSize = 400; // 20 tiles * 20px each
        let startX = (width - gridSize) / 2; // Center horizontally
        let startY = (height - gridSize) / 2; // Center vertically

        // Draw the game border
        stroke(255, 0, 0);
        noFill();
        rect(startX, startY, gridSize, gridSize);
        noStroke();

        // Draw the snake
        fill(this.snakeColor);
        for (let segment of this.snake) {
            rect(startX + segment.x * 20, startY + segment.y * 20, 20, 20);
        }

        // Draw the food
        fill(255, 0, 0);
        rect(startX + this.food.x * 20, startY + this.food.y * 20, 20, 20);

        // Draw the bonus if active
        if (this.bonusActive) {
            fill(255, 255, 0);
            text("★", startX + this.bonus.x * 20 + 10, startY + this.bonus.y * 20 + 10);
        }
    }

    handleKeyPress(keyCode) {
        if (keyCode === UP_ARROW && this.direction.y === 0) {
            this.direction = { x: 0, y: -1 };
        } else if (keyCode === DOWN_ARROW && this.direction.y === 0) {
            this.direction = { x: 0, y: 1 };
        } else if (keyCode === LEFT_ARROW && this.direction.x === 0) {
            this.direction = { x: -1, y: 0 };
        } else if (keyCode === RIGHT_ARROW && this.direction.x === 0) {
            this.direction = { x: 1, y: 0 };
        }
    }

    gameOver() {
        this.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
        this.direction = { x: 1, y: 0 };
        this.food = this.spawnFood();
        this.moveInterval = 10;
        this.bonus = null;
        this.bonusActive = false;
        this.bonusTimer = millis();
        this.snakeColor = this.getRandomPastelColor(); // Reset to a random pastel color
    }
}
