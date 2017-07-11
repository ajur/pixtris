import config from '../config';
import State from '../utils/State';
import Board from './Board';
import Renderer from './Renderer';
import TetronimoSpawner from './TetronimoSpawner';

/**
 * GamePlay state provides main game logic
 */
export default class GamePlay extends State {
    constructor(game) {
        super();
        
        this.game = game;
        
        this.board = null;
        this.spawner = null;
        this.tetromino = null;
        
        this.renderer = new Renderer(config.game.rows, config.game.cols, config.game.hiddenRows, config.display.blockSize);
        this.addChild(this.renderer);
    }
    
    /**
     * Reset game
     */
    enter(opts) {
        if (opts.restart || this.board == null) {
            this.board = new Board(config.game.rows + config.game.hiddenRows, config.game.cols);
            this.spawner = new TetronimoSpawner();

            this.tetromino = null;
            this.tetrominoFallSpeed = config.game.fallSpeed;
            this.tetrominoFallSpeedMin = config.game.fallSpeedMin;
            this.tetrominoFallSpeedupStep = config.game.fallSpeedupStep;
            this.tetrominoFallSpeedupDelay = config.game.fallSpeedupDelay;
            this.tetrominoDropModifier = config.game.dropModifier;

            this.tetrominoFallTimer = this.tetrominoFallSpeed;
            this.tetrominoFallSpeedupTimer = this.tetrominoFallSpeedupDelay;

            this.rowsCleared = 0;
            this.score = 0;

            this.spawnTetromino();
        }
    }
    
    /**
     * Main update funcion
     * @param {Number} dt pixi timer deltaTime
     */
    update(dt) {
        if (this.game.key.escape.trigger() || this.game.key.space.trigger()) {
            this.game.setState('pause', {
                keepVisible: true,
                score:{
                    points: this.score,
                    lines: this.rowsCleared
                }});
        }
        
        if (this.tetromino) {
            this.updateTetromino();
        }
        
        this.renderer.updateFromBoard(this.board);
        this.renderer.updateFromTetromino(this.tetromino);
    }
    
    /**
     * Spawn new active tetromino and test for end game condition
     */
    spawnTetromino() {
        this.tetromino = this.spawner.spawn();
        this.tetromino.row = 0;
        this.tetromino.col = this.board.cols / 2 - 2;
        
        if (this.board.collides(this.tetromino.absolutePos(0, 0))) {
            this.lockTetromino();
            this.gameOver();
        }
    }
    
    /**
     * merge active tetromino with board
     */
    lockTetromino() {
        let fullRows = this.board.setAll(this.tetromino.absolutePos(), this.tetromino.color);
        this.tetromino = null;
        
        if (fullRows.length > 0) {
            this.updateScore(fullRows.length);
            this.board.cleanRows(fullRows);
        }
    }
    
    /**
     * handle game ending
     */
    gameOver() {
        this.game.scores.add(this.rowsCleared, this.score);
        this.game.setState('gameover', {keepVisible: true});
    }
    
    /**
     * Update terominos falling and handle user input
     */
    updateTetromino() {
        if (this.game.key.up.trigger()) {
            if (!this.board.collides(this.tetromino.absolutePos(0, 0, true))) {
                this.tetromino.rotate();
            } else if (!this.board.collides(this.tetromino.absolutePos(0, -1, true))) {
                --this.tetromino.col;
                this.tetromino.rotate();
            } else if (!this.board.collides(this.tetromino.absolutePos(0, 1, true))) {
                ++this.tetromino.col;
                this.tetromino.rotate();
            }
        }
        
        if (this.game.key.left.trigger() && !this.board.collides(this.tetromino.absolutePos(0, -1))) {
            --this.tetromino.col;
        }
        if (this.game.key.right.trigger() && !this.board.collides(this.tetromino.absolutePos(0, 1))) {
            ++this.tetromino.col;
        }
         
        let tickMod = this.game.key.down.pressed ? this.tetrominoDropModifier : 1;
        if ((--this.tetrominoFallSpeedupTimer) <= 0) {
            this.tetrominoFallSpeed = Math.max(this.tetrominoFallSpeedMin, this.tetrominoFallSpeed - this.tetrominoFallSpeedupStep);
            this.tetrominoFallSpeedupTimer = this.tetrominoFallSpeedupDelay;
            console.log('speed: ', this.tetrominoFallSpeed);
        }
        if ((this.tetrominoFallTimer -= tickMod) <= 0) {
            if (this.board.collides(this.tetromino.absolutePos(1, 0))) {
                this.lockTetromino();
                this.spawnTetromino();
            } else {
                ++this.tetromino.row;
                this.tetrominoFallTimer = this.tetrominoFallSpeed;
            }
        }
    }
    
    /**
     * Update score based on number of cleared rows
     * @param {Number} rows count of rows cleared in one move
     */
    updateScore(rows) {
        this.rowsCleared += rows;
        this.score += Math.pow(2, rows - 1);
    }
}
