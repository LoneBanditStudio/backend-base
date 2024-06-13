import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    // Declare a Chess board variable for game logic
    public board: Chess;
    // Declare a start time variable and move count
    private startTime: Date;
    private moveCount = 0;

    // Constructor to initialize player connections and game state
    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        // Send INIT_GAME message to both players to start the game
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }

    // Method to handle player moves during the game
    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }) {
        // Ensure correct player is making a move based on move count
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }

        // Attempt to make the move on the Chess board and handle errors
        try {
            this.board.move(move);
        } catch (e) {
            console.log(e);
            return;
        }

        // Check if the game is over and send GAME_OVER message to players
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }

        // Send MOVE message to the opponent player based on move count
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }

        // Increment move count for the next move
        this.moveCount++;
    }
}