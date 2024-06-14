import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";
import { joingame, joinsecondplayer } from "./Web3";


export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    // Constructor to initialize GameManager class
    constructor() {
        this.games = []; // Initialize games array
        this.pendingUser = null; // Initialize pendingUser to null
        this.users = []; // Initialize users array
    }

    // Method to add a user to the game
    addUser(socket: WebSocket) {
        this.users.push(socket); // Add user to users array
        this.addHandler(socket); // Call addHandler method for added user
    }

    // Method to remove a user from the game
    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket); // Remove user from users array
        // Stop the game here because the user left
    }

    // Private method to add event handler for WebSocket messages
    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString()); // Parse incoming message
            //To  verify token deposit on web3 functions here
            // Handling INIT_GAME message
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket); // Create a new Game instance with players
                    this.games.push(game); // Add game to games array
                    this.pendingUser = null; // Reset pendingUser
                    joinsecondplayer
                } else {
                    this.pendingUser = socket; // Set pendingUser as the current socket
                    joingame
                }
            }

            // Handling MOVE message
            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket); // Find game containing the socket
                if (game) {
                    game.makeMove(socket, message.move); // Make a move in the game
                }
            }
        });
    }
}