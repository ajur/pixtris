/* Pixtris - pixi.js tetris
 * by Adam Jurczyk <ajur.pl@gmail.com>
 */


// FIXME get rid of those globals
const BLOCK_SIZE = 16;
const BOARD_COLS = 10;
const BOARD_ROWS = 20;
const HIDDEN_ROWS = 0;
const SCREEN_WIDTH = BOARD_COLS * BLOCK_SIZE;
const SCREEN_HEIGHT = (BOARD_ROWS - HIDDEN_ROWS) * BLOCK_SIZE;

// each shape type has 4 rotations, each 4 block position [row,col] on 4x4 shape grid
const SHAPES = {
    i: [[[0,1],[1,1],[2,1],[3,1]],
        [[1,0],[1,1],[1,2],[1,3]],
        [[0,2],[1,2],[2,2],[3,2]],
        [[2,0],[2,1],[2,2],[2,3]]],
    j: [[[0,1],[1,1],[2,1],[2,0]],
        [[0,0],[1,0],[1,1],[1,2]],
        [[0,2],[0,1],[1,1],[2,1]],
        [[1,0],[1,1],[1,2],[2,2]]],
    l: [[[0,1],[1,1],[2,1],[2,2]],
        [[2,0],[1,0],[1,1],[1,2]],
        [[0,0],[0,1],[1,1],[2,1]],
        [[1,0],[1,1],[1,2],[0,2]]],
    o: [[[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]],
        [[0,0],[0,1],[1,0],[1,1]]],
    s: [[[2,0],[2,1],[1,1],[1,2]],
        [[0,0],[1,0],[1,1],[2,1]],
        [[1,0],[1,1],[0,1],[0,2]],
        [[0,1],[1,1],[1,2],[2,2]]],
    t: [[[1,0],[1,1],[1,2],[2,1]],
        [[0,1],[1,1],[2,1],[1,0]],
        [[0,1],[1,1],[1,0],[1,2]],
        [[0,1],[1,1],[2,1],[1,2]]],
    z: [[[1,0],[1,1],[2,1],[2,2]],
        [[0,1],[1,1],[1,0],[2,0]],
        [[0,0],[0,1],[1,1],[1,2]],
        [[0,2],[1,2],[1,1],[2,1]]]
};
const SHAPE_COLORS = {j: 'blue', s: 'green', t: 'purple', o: 'yellow', 
                      i: 'cyan', l: 'orange', z: 'red'};


const fancyTextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: ['#fff500', '#ff4e00'],
    stroke: '#934400',
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 1});

const simpleTextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 14,
    fill: '#fff500',
    stroke: '#934400',
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 1,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 1});


class Keyboard {
    constructor() {
        this.keyMap = {
            27: 'escape',
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        
        Object.values(this.keyMap).forEach(k => this[k] = false);
        
        window.addEventListener('keydown', this.onKeyChange.bind(this));
        window.addEventListener('keyup', this.onKeyChange.bind(this));
    }
    
    onKeyChange(evt) {
        let key = this.keyMap[evt.keyCode];
        if (key) {
            this[key] = (evt.type == 'keydown');
        }
    }
}

class GameMenu extends PIXI.Container {
    constructor(game) {
        super();
        this.game = game;
        
        this.title = new PIXI.Text('PIXTRIS', fancyTextStyle);
        this.title.anchor.set(0.5);
        this.title.x = this.game.app.view.width * 0.5;
        this.title.y = this.game.app.renderer.height * 0.25;

        this.addChild(this.title);
        
        this.info = new PIXI.Text('Press SPACE to play', simpleTextStyle);
        this.info.anchor.set(0.5);
        this.info.x = this.game.app.view.width * 0.5;
        this.info.y = this.game.app.renderer.height * 0.75;
        
        this.infoVisibilityCounter = 20;
        
        this.addChild(this.info);
    }
    
    update() {
        if (this.game.key.space) {
            this.game.setState('play');
        }
        
        if (--this.infoVisibilityCounter == 0) {
            this.infoVisibilityCounter = 45;
            this.info.visible = !this.info.visible;
        }
    }
}


class BlocksPool {
    constructor() {
        this.block_textures = {};
        this.pool = {};
        Object.values(SHAPE_COLORS).forEach(color => {
            this.block_textures[color] = PIXI.loader.resources['sprites.json'].textures['block_'+color+'.png'];
            this.pool[color] = [];
        });
    }
    
    get(color) {
        let block = this.pool[color].pop();
        if (!block) {
            block = new PIXI.Sprite(this.block_textures[color]);
            block.blockColor = color;
        }
        return block;
    }
    
    get4(color) {
        return [0,0,0,0].map(()=>this.get(color));
    }
    
    ret(block) {
        this.pool[block.blockColor].push(block);
    }
}


class TetronimoSpawner {
    constructor() {
        this.pool = new BlocksPool();
        this.queue = [];
        this.refillQueue();
    }
    
    newTetromino(shape) {
        return new Tetromino(this.pool.get4(SHAPE_COLORS[shape]), shape);
    }
    
    refillQueue() {
        let s = 'izlstzo';
        let a = (s+s+s+s).split('');
        for (let i = a.length; i > 0; --i) {
            let j = Math.floor(Math.random() * i);
            let tmp = a[i-1];
            a[i-1] = a[j];
            a[j] = tmp;
        }
        this.queue = a.concat(this.queue);
    }
    
    spawn() {
        if(this.queue.length < 2) {
            this.refillQueue();
        }
        return this.newTetromino(this.queue.pop());
    }
}


class Tetromino extends PIXI.Container {
    constructor(blocks, shapeType) {
        super();
        
        this.shapeType = shapeType;
        this.shapeRotation = 0;
        this.shape = SHAPES[this.shapeType][this.rotation];
        
        this.blocks = blocks;
        this.blocks.forEach(b => this.addChild(b));
        this.moveBlocks();
        
        this.gridPos = {row: 0, col: 0};
    }
    
    get row() {
        return this.gridPos.row;
    }
    
    set row(val) {
        this.gridPos.row = val;
        this.y = val * BLOCK_SIZE;
    }
    
    get col() {
        return this.gridPos.col;
    }
    
    set col(val) {
        this.gridPos.col = val;
        this.x = val * BLOCK_SIZE;
    }
    
    moveBlocks() {
        for (let i=0; i<4; ++i) {
            this.blocks[i].x = this.shape[i][1] * BLOCK_SIZE;  // x from col
            this.blocks[i].y = this.shape[i][0] * BLOCK_SIZE;  // y from row
        }
    }
    
    rotate() {
        this.shapeRotation = (this.shapeRotation + 1) % 4;
        this.shape = SHAPES[this.shapeType][this.shapeRotation];
        this.moveBlocks();
    }
    
    dropBlocks() {
        this.blocks.forEach(b => this.removeChild(b));
        return this.blocks;
    }
    
    absolutePos(shiftRow, shiftCol, rotate) {
        let shape = rotate ? SHAPES[this.shapeType][(this.shapeRotation+1)%4] : this.shape;
        
        return shape.map(pos => [this.row + shiftRow + pos[0],
                                 this.col + shiftCol + pos[1]]);
    }
}


class Board extends PIXI.Container {
    constructor(rows, cols) {
        super();
        
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        for (let i = 0; i < this.rows; ++i) {
            let row = [];
            for (let j = 0; j < this.cols; ++j) {
                row.push(null);
            }
            this.grid.push(row);
        }
    }
    
    collides(positions) {
        let row, col;
        for(let i = 0; i < positions.length; ++i) {
            row = positions[i][0];
            col = positions[i][1];
            if (row < 0 || row >= this.rows ||
                col < 0 || col >= this.cols ||
                this.grid[row][col]) {
                
                return true;
            }
        }
        return false;
    } 
    
    add(blocks, positions) {
        let i,row,col,block;
        for(i=0; i < positions.length; ++i) {
            row = positions[i][0];
            col = positions[i][1];
            block = blocks[i];
            block.x = col * BLOCK_SIZE;
            block.y = row * BLOCK_SIZE;
            this.grid[row][col] = block;
            this.addChild(block);
        }
    }
}


class GamePlay extends PIXI.Container {
    constructor(game) {
        super();
        this.game = game;
        this.spawner = new TetronimoSpawner();
        this.board = new Board(BOARD_ROWS, BOARD_COLS);
        this.addChild(this.board);
        
        this.activeBlock = null;
    }
    
    start() {
        this.fallSpeed = 30;
        this.active_block_tick = this.fallSpeed;
        
        this.moveDelay = 12;
        this.speedMoveDelay = false;
        this.active_block_move_left = 0;
        this.active_block_move_right = 0;
        this.active_block_rotate = 0;
        
        this.spawnActive();
    }
    
    spawnActive() {
        this.activeBlock = this.spawner.spawn();
        this.activeBlock.row = 0;
        this.activeBlock.col = BOARD_COLS / 2 - 2;
        this.addChild(this.activeBlock);
        
        if (this.board.collides(this.activeBlock.absolutePos(0, 0))) {
            this.lockActive();
            this.activeBlock = null;
            this.gameOver();
        }
    }
    
    lockActive() {
        this.board.add(this.activeBlock.dropBlocks(), this.activeBlock.absolutePos(0, 0));
    }
    
    gameOver() {
        this.title = new PIXI.Text('GAME\nOVER', fancyTextStyle);
        this.title.anchor.set(0.5);
        this.title.x = this.game.app.view.width * 0.5;
        this.title.y = this.game.app.renderer.height * 0.5;

        this.addChild(this.title);
    }
    
    update() {
        if (this.game.key.escape) {
            this.game.setState('menu');
        }
        
        if (this.activeBlock) {
            this.updateActive();
        }
    }
        
    updateActive() {
        if (this.active_block_move_left > 0) {
            --this.active_block_move_left;
        }
        if (this.active_block_move_right > 0) {
            --this.active_block_move_right;
        }
        if (this.active_block_rotate > 0) {
            --this.active_block_rotate;
        }
        
        if (this.game.key.up) {
            if (this.active_block_rotate == 0 &&
                !this.board.collides(this.activeBlock.absolutePos(0, 0, true))) {
                this.activeBlock.rotate();
                this.active_block_rotate = this.moveDelay;
            }
        } else {
            this.active_block_rotate = 0;
        }
        
        if (this.game.key.left) {
            if (this.active_block_move_left == 0 &&
                !this.board.collides(this.activeBlock.absolutePos(0, -1))) {
                
                --this.activeBlock.col;
                
                if (this.speedMoveDelay) {
                    this.active_block_move_left = this.moveDelay / 4;
                } else {
                    this.active_block_move_left = this.moveDelay;
                    this.speedMoveDelay = true;
                }
            }
        } else {
            this.active_block_move_left = 0;
            this.speedMoveDelay = false;
        }
        if (this.game.key.right) {
            if (this.active_block_move_right == 0 &&
                !this.board.collides(this.activeBlock.absolutePos(0, 1))) {
                ++this.activeBlock.col;
                
                if (this.speedMoveDelay) {
                    this.active_block_move_right = this.moveDelay / 4;
                } else {
                    this.active_block_move_right = this.moveDelay;
                    this.speedMoveDelay = true;
                }
            }
        } else {
            this.active_block_move_right = 0;
            this.speedMoveDelay = false;
        }
         
        let tickMod = 1;
        if (this.game.key.down) {
            tickMod = 10;
        }
        if ((this.active_block_tick -= tickMod) <= 0) {
            if (this.board.collides(this.activeBlock.absolutePos(1, 0))) {
                this.lockActive();
                this.spawnActive();
            } else {
                ++this.activeBlock.row;
                this.active_block_tick = this.fallSpeed;
            }
        }
    }
}



class Game {
    constructor() {
        this.app = new PIXI.Application(SCREEN_WIDTH, SCREEN_HEIGHT, {});
        document.body.appendChild(this.app.view);
        
        PIXI.loader.add('sprites.json').load(this.init.bind(this));
    }
    
    init() {
        let background = new PIXI.extras.TilingSprite(
            PIXI.loader.resources['sprites.json'].textures['background.png'], 
            this.app.renderer.width,
            this.app.renderer.height);
        this.app.stage.addChild(background);
        
        this.key = new Keyboard();
        
        this.gameStates = {
            play: new GamePlay(this),
            menu: new GameMenu(this)
        };
        
        this.state = this.gameStates.menu;
        this.app.stage.addChild(this.state);
        this.app.ticker.add(this.state.update, this.state);
    }
        
    setState(state) {
        this.app.ticker.remove(this.state.update, this.state);
        this.app.stage.removeChild(this.state);
        this.state = this.gameStates[state];
        this.app.stage.addChild(this.state);
        this.state.start && this.state.start();
        this.state.update && this.app.ticker.add(this.state.update, this.state);
    }
}


const game = new Game();
