class TicTacToe {
    board: string[][];

    constructor() {
        this.board = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
    }

    printBoard() {
        for (let i = 0; i < 3; i++) {
            console.log(this.board[i].join(' | '));
            if (i < 2) {
                console.log('---------');
            }
        }
    }

    checkWin(player: string): boolean {
        // Check rows, columns and diagonals for a win
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] === player && this.board[i][1] === player && this.board[i][2] === player) {
                return true;
            }
            if (this.board[0][i] === player && this.board[1][i] === player && this.board[2][i] === player) {
                return true;
            }
        }
        if (this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) {
            return true;
        }
        if (this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player) {
            return true;
        }
        return false;
    }

    makeMove(row: number, col: number, player: string) {
        if (this.board[row][col] !== ' ') {
            throw new Error('This spot is already filled');
        }
        this.board[row][col] = player;
    }

    getWinningMove(player: string): [number, number] | null {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === ' ') {
                    this.board[row][col] = player;
                    if (this.checkWin(player)) {
                        this.board[row][col] = ' ';
                        return [row, col];
                    }
                    this.board[row][col] = ' ';
                }
            }
        }
        return null;
    }

    getRandomValidMove(): [number, number] {
        let validMoves: [number, number][] = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === ' ') {
                    validMoves.push([row, col]);
                }
            }
        }
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    playGame() {
        let player = 'X';
        while (true) {
            this.printBoard();
            let row: number;
            let col: number;
            if (player === 'X') {
                row = Number(prompt(`Player ${player}, enter your move row (0, 1, or 2):`));
                col = Number(prompt(`Player ${player}, enter your move column (0, 1, or 2):`));
            } else {
                [row, col] = this.getRandomValidMove();
                console.log(`Computer chose row ${row} and column ${col}`);
            }
            this.makeMove(row, col, player);
            if (this.checkWin(player)) {
                console.log(`Player ${player} wins!`);
                break;
            }
            player = player === 'X' ? 'O' : 'X';
        }
    }
}

let game = new TicTacToe();
game.playGame();
