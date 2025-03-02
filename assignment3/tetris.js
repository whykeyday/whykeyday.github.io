class Tetris {
    constructor() {
        this.board = Array.from({ length: 20 }, () => Array(10).fill(0));
        this.pieces = [
            [[1, 1, 1, 1]], // I piece
            [[1, 1], [1, 1]], // O piece
            [[0, 1, 0], [1, 1, 1]], // T piece
            [[1, 1, 0], [0, 1, 1]], // S piece
            [[0, 1, 1], [1, 1, 0]], // Z piece
            [[1, 1, 1], [1, 0, 0]], // L piece
            [[1, 1, 1], [0, 0, 1]]  // J piece
        ];
        this.colors = [
            "#FFB6C1", // Light Pink
            "#FFDAB9", // Peach Puff
            "#E6E6FA", // Lavender
            "#B0E0E6", // Powder Blue
            "#98FB98", // Pale Green
            "#FFFACD", // Lemon Chiffon
            "#FAEBD7", // Antique White
            "#D8BFD8", // Thistle
            "#FFC0CB"  // Pink
        ]; // Assign unique colors for each piece type

        this.lastPieceIndex = -1; // Track last piece index
        this.lastColorIndex = -1; // Track last color index
        this.currentPiece = this.getRandomPiece();
        this.pieceX = 4;
        this.pieceY = 0;
        this.dropInterval = 30;
        this.dropCounter = 0;
        this.score = 0; // Initialize score
    }

    getRandomPiece() {
        let newPieceIndex, newColorIndex;

        // Ensure a different shape than the last one
        do {
            newPieceIndex = Math.floor(Math.random() * this.pieces.length);
        } while (newPieceIndex === this.lastPieceIndex);

        // Ensure a different color than the last one
        do {
            newColorIndex = Math.floor(Math.random() * this.colors.length);
        } while (newColorIndex === this.lastColorIndex);

        // Store last used indexes
        this.lastPieceIndex = newPieceIndex;
        this.lastColorIndex = newColorIndex;

        this.pieceColor = this.colors[newColorIndex]; // Assign new color
        return this.pieces[newPieceIndex];
    }

    getPieceColor() {
        return this.pieceColor;
    }

    update() {
        this.dropCounter++;
        if (this.dropCounter > this.dropInterval) {
            if (!this.checkCollision(this.pieceX, this.pieceY + 1, this.currentPiece)) {
                this.pieceY++;
            } else {
                this.placePiece();
                this.currentPiece = this.getRandomPiece();
                this.pieceX = 4;
                this.pieceY = 0;
                if (this.checkCollision(this.pieceX, this.pieceY, this.currentPiece)) {
                    this.resetGame(); // Game over
                }
            }
            this.dropCounter = 0;
        }
    }

    show() {
        background(50);
        fill(255);
        textSize(24);
        textAlign(CENTER, CENTER);
        text("Tetris", width / 2, (height - 600) / 2 - 30); // Move title above play area

        // Show score
        textSize(18);
        text(`Score: ${this.score}`, width / 2, (height - 600) / 2 - 60); // Move score above the title

        // Define the grid size
        let gridWidth = 300; // 10 columns * 30px each
        let gridHeight = 600; // 20 rows * 30px each
        let startX = (width - gridWidth) / 2; // Center horizontally
        let startY = (height - gridHeight) / 2; // Center vertically

        // Draw the game border
        stroke(0, 0, 255);
        noFill();
        rect(startX, startY, gridWidth, gridHeight);
        noStroke();

        // Draw the static blocks on the board
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col]) {
                    fill(this.board[row][col]); // Use stored color
                    stroke(50);
                    rect(startX + col * 30, startY + row * 30, 30, 30);
                }
            }
        }

        // Draw the current falling piece
        fill(this.pieceColor);
        stroke(50);
        for (let row = 0; row < this.currentPiece.length; row++) {
            for (let col = 0; col < this.currentPiece[row].length; col++) {
                if (this.currentPiece[row][col]) {
                    rect(startX + (this.pieceX + col) * 30, startY + (this.pieceY + row) * 30, 30, 30);
                }
            }
        }
        noStroke();
    }

    handleKeyPress(keyCode) {
        if (keyCode === LEFT_ARROW && !this.checkCollision(this.pieceX - 1, this.pieceY, this.currentPiece)) {
            this.pieceX--;
        } else if (keyCode === RIGHT_ARROW && !this.checkCollision(this.pieceX + 1, this.pieceY, this.currentPiece)) {
            this.pieceX++;
        } else if (keyCode === DOWN_ARROW && !this.checkCollision(this.pieceX, this.pieceY + 1, this.currentPiece)) {
            this.pieceY++;
        } else if (keyCode === UP_ARROW) {
            this.rotatePiece();
        }
    }

    rotatePiece() {
        let rotated = this.currentPiece[0].map((_, i) => this.currentPiece.map(row => row[i])).reverse();
        if (!this.checkCollision(this.pieceX, this.pieceY, rotated)) {
            this.currentPiece = rotated;
        }
    }

    checkCollision(x, y, piece) {
        for (let row = 0; row < piece.length; row++) {
            for (let col = 0; col < piece[row].length; col++) {
                if (piece[row][col]) {
                    let newX = x + col;
                    let newY = y + row;
                    if (newX < 0 || newX >= 10 || newY >= 20 || (newY >= 0 && this.board[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    placePiece() {
        for (let row = 0; row < this.currentPiece.length; row++) {
            for (let col = 0; col < this.currentPiece[row].length; col++) {
                if (this.currentPiece[row][col]) {
                    this.board[this.pieceY + row][this.pieceX + col] = this.pieceColor;
                }
            }
        }
        this.clearLines();
    }

    clearLines() {
        let linesCleared = 0;
        this.board = this.board.filter(row => {
            if (row.every(cell => cell !== 0)) {
                linesCleared++;
                return false; // Remove the row
            }
            return true;
        });

        // Add new empty rows at the top
        while (this.board.length < 20) {
            this.board.unshift(Array(10).fill(0));
        }

        // Calculate and update score based on lines cleared
        if (linesCleared > 0) {
            this.score += Math.pow(2, linesCleared) * 1;
        }
    }

    resetGame() {
        this.board = Array.from({ length: 20 }, () => Array(10).fill(0));
        this.currentPiece = this.getRandomPiece();
        this.pieceX = 4;
        this.pieceY = 0;
        this.score = 0; // Reset score
    }
}
