class Game2048 {
    constructor() {
        this.initGame();
    }

    initGame() {
        this.grid = this.createEmptyGrid();
        this.spawnTile();
        this.spawnTile();
        this.gameOver = false;
    }

    createEmptyGrid() {
        return Array(4).fill(null).map(() => Array(4).fill(0));
    }

    spawnTile() {
        let emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length > 0) {
            let { r, c } = random(emptyCells);
            this.grid[r][c] = random(1) < 0.9 ? 2 : 4;
        }
    }

    isGameOver() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.grid[r][c] === 0) return false;
                if (c < 3 && this.grid[r][c] === this.grid[r][c + 1]) return false;
                if (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) return false;
            }
        }
        return true;
    }

    move(direction) {
        if (this.gameOver) return;

        let moved = this.performMove(direction);
        if (moved) {
            this.spawnTile();
        }

        if (this.isGameOver()) {
            this.gameOver = true;
            setTimeout(() => this.restartGame(), 1000);
        }
    }

    restartGame() {
        this.initGame();
    }

    performMove(direction) {
        let moved = false;

        if (direction === "left") {
            for (let r = 0; r < 4; r++) {
                let newRow = this.slideAndMerge(this.grid[r]);
                if (!this.arraysEqual(newRow, this.grid[r])) {
                    this.grid[r] = newRow;
                    moved = true;
                }
            }
        } else if (direction === "right") {
            for (let r = 0; r < 4; r++) {
                let reversed = [...this.grid[r]].reverse();
                let newRow = this.slideAndMerge(reversed).reverse();
                if (!this.arraysEqual(newRow, this.grid[r])) {
                    this.grid[r] = newRow;
                    moved = true;
                }
            }
        } else if (direction === "up") {
            for (let c = 0; c < 4; c++) {
                let column = this.getColumn(c);
                let newColumn = this.slideAndMerge(column);
                if (!this.arraysEqual(newColumn, column)) {
                    this.setColumn(c, newColumn);
                    moved = true;
                }
            }
        } else if (direction === "down") {
            for (let c = 0; c < 4; c++) {
                let column = this.getColumn(c).reverse();
                let newColumn = this.slideAndMerge(column).reverse();
                if (!this.arraysEqual(newColumn, column.reverse())) {
                    this.setColumn(c, newColumn);
                    moved = true;
                }
            }
        }

        return moved;
    }

    slideAndMerge(row) {
        let newRow = row.filter(num => num !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow[i + 1] = 0;
            }
        }
        newRow = newRow.filter(num => num !== 0);
        return [...newRow, ...Array(4 - newRow.length).fill(0)];
    }

    arraysEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    getColumn(colIndex) {
        return this.grid.map(row => row[colIndex]);
    }

    setColumn(colIndex, newColumn) {
        for (let r = 0; r < 4; r++) {
            this.grid[r][colIndex] = newColumn[r];
        }
    }

    show() {
        background(50);
        textSize(24);
        fill(255);
        textAlign(CENTER, CENTER);
        text("2048", width / 2, 40);

        let tileSize = 100;
        let startX = (width - tileSize * 4) / 2;
        let startY = (height - tileSize * 4) / 2;

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                let x = startX + c * tileSize;
                let y = startY + r * tileSize;
                fill(this.getTileColor(this.grid[r][c]));
                rect(x, y, tileSize, tileSize, 10);

                if (this.grid[r][c] !== 0) {
                    fill(0);
                    textSize(32);
                    text(this.grid[r][c], x + tileSize / 2, y + tileSize / 2);
                }
            }
        }

        if (this.gameOver) {
            fill(255, 0, 0);
            textSize(36);
            text("Game Over! Restarting...", width / 2, height / 2);
        }
    }

    getTileColor(value) {
        let colors = {
            0: "#CDC1B4", 2: "#EEE4DA", 4: "#EDE0C8", 8: "#F2B179",
            16: "#F59563", 32: "#F67C5F", 64: "#F65E3B", 128: "#EDCF72",
            256: "#EDCC61", 512: "#EDC850", 1024: "#EDC53F", 2048: "#EDC22E"
        };
        return colors[value] || "#3C3A32";
    }
  
    
    handleKeyPress(keyCode) {
      let moved = false;
      if (keyCode === UP_ARROW) {
        moved = this.moveUp();
      } else if (keyCode === DOWN_ARROW) {
        moved = this.moveDown();
      } else if (keyCode === LEFT_ARROW) {
        moved = this.moveLeft();
      } else if (keyCode === RIGHT_ARROW) {
        moved = this.moveRight();
      }
      if (moved) this.spawnTile();
    }
  
    moveUp() {
      return this.move((r, c) => r > 0, (r, c) => [r - 1, c]);
    }
  
    moveDown() {
      return this.move((r, c) => r < 3, (r, c) => [r + 1, c]);
    }
  
    moveLeft() {
      return this.move((r, c) => c > 0, (r, c) => [r, c - 1]);
    }
  
    moveRight() {
      return this.move((r, c) => c < 3, (r, c) => [r, c + 1]);
    }
  
    move(canMove, getNext) {
      let moved = false;
      for (let times = 0; times < 3; times++) {
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            if (this.grid[r][c] !== 0 && canMove(r, c)) {
              let [nr, nc] = getNext(r, c);
              if (this.grid[nr][nc] === 0) {
                this.grid[nr][nc] = this.grid[r][c];
                this.grid[r][c] = 0;
                moved = true;
              } else if (this.grid[nr][nc] === this.grid[r][c]) {
                this.grid[nr][nc] *= 2;
                this.grid[r][c] = 0;
                moved = true;
              }
            }
          }
        }
      }
      return moved;
    }
  }