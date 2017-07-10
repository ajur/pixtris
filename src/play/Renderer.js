
import * as PIXI from 'pixi.js';

/**
 * Render board and avtive teromino using PIXI.js
 */
export default class Renderer extends PIXI.Container {
    
    /**
     * Initialize renderer
     * @param {Number} rows       Number of visible rows
     * @param {Number} cols       Number of visible columns
     * @param {Number} rowsOffset Number of rows in model to skip from rendering
     * @param {Number} blockSize  Target block size
     */
    constructor(rows, cols, rowsOffset, blockSize) {
        super();
        
        this.rows = rows;
        this.cols = cols;
        this.rowsOffset = rowsOffset;
        this.blockSize = blockSize;
        
        this.textures = PIXI.loader.resources.blocks.textures;
        
        this.sprites = [];
        
        for (let i = 0; i < this.rows; ++i) {
            let row = [];
            for (let j = 0; j < this.cols; ++j) {
                let spr = new PIXI.Sprite(this.textures.background);
                row.push(spr);
                spr.x = j * this.blockSize;
                spr.y = i * this.blockSize;
                spr.blockColor = null;
                this.addChild(spr);
            }
            this.sprites.push(row);
        }
    }
    
    updateColor(row, col, color) {
        if(row < 0) return;
        let sprite = this.sprites[row][col];
        if (sprite.blockColor != color) {
            sprite.blockColor = color;
            sprite.texture = this.textures[color] || this.textures.background;
        }
    }
    
    updateFromBoard(board) {
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                this.updateColor(i, j, board.get(i + this.rowsOffset, j));
            }
        }
    }
    
    updateFromTetromino(tetromino) {
        if (tetromino) {
            tetromino.absolutePos().forEach(pos => {
                this.updateColor(pos[0] - this.rowsOffset, pos[1], tetromino.color);
            });
        }
    }
}