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
        if (this.board[row][col] === ' ') {
            this.board[row][col] = player;
        }
    }

    playGame() {
        let player = 'X';
        while (true) {
            this.printBoard();
            let row = prompt(`Player ${player}, enter your move row (0, 1, or 2):`);
            let col = prompt(`Player ${player}, enter your move column (0, 1, or 2):`);
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
