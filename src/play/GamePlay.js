import config from '../config';
import State from '../utils/State';
import Board from './Board';
import Renderer from './Renderer';
import { TetronimoSpawner } from './tetromino';


export default class GamePlay extends State {
    constructor(game) {
        super();
        
        this.game = game;
        
        this.renderer = new Renderer(config.game.rows, config.game.cols, config.game.hiddenRows, config.display.blockSize);
        this.addChild(this.renderer);
    }
    
    enter() {
        super.enter();
        
        this.board = new Board(config.game.rows + config.game.hiddenRows, config.game.cols);
        this.spawner = new TetronimoSpawner();
        
        this.tetromino = null;
        this.tetrominoFallTimer = 0;
        this.tetrominoFallSpeed = config.game.fallSpeed;
        this.tetrominoDropModifier = config.game.dropModifier;
        
        this.rowsCleared = 0;
        this.score = 0;
        
        this.spawnTetromino();
    }
    
    exit() {}
    
    update(dt) {
        if (this.game.key.escape.trigger()) {
            this.game.setState('menu');
        }
        
        if (this.tetromino) {
            this.updateTetromino();
        }
        
        this.renderer.updateFromBoard(this.board);
        this.renderer.updateFromTetromino(this.tetromino);
    }
    
    spawnTetromino() {
        this.tetromino = this.spawner.spawn();
        this.tetromino.row = 0;
        this.tetromino.col = this.board.cols / 2 - 2;
        
        if (this.board.collides(this.tetromino.absolutePos(0, 0))) {
            this.lockTetromino();
            this.gameOver();
        }
    }
    
    lockTetromino() {
        let fullRows = this.board.setAll(this.tetromino.absolutePos(), this.tetromino.color);
        this.tetromino = null;
        
        if (fullRows.length > 0) {
            this.updateScore(fullRows.length);
            this.board.cleanRows(fullRows);
        }
    }
    
    gameOver() {
        this.game.scores.add(this.rowsCleared, this.score);
        this.game.setState('gameover');
    }
    
    updateTetromino() {
        if (this.game.key.up.trigger() && !this.board.collides(this.tetromino.absolutePos(0, 0, true))) {
            this.tetromino.rotate();
        }
        
        if (this.game.key.left.trigger() && !this.board.collides(this.tetromino.absolutePos(0, -1))) {
            --this.tetromino.col;
        }
        if (this.game.key.right.trigger() && !this.board.collides(this.tetromino.absolutePos(0, 1))) {
            ++this.tetromino.col;
        }
         
        let tickMod = this.game.key.down.pressed ? this.tetrominoDropModifier : 1;
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
    
    updateScore(rows) {
        this.rowsCleared += rows;
        this.score += Math.pow(2, rows - 1);
    }
}
