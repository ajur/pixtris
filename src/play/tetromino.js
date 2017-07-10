
// each shape type has 4 rotations, each 4 block position [row,col] on 4x4 shape grid
export const SHAPES = {
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

export const SHAPE_COLORS = {j: 'blue', s: 'green', t: 'purple', o: 'yellow', 
                      i: 'cyan', l: 'orange', z: 'red'};


export class TetronimoSpawner {
    constructor() {
        this.queue = [];
        this.refillQueue();
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
        return new Tetromino(this.queue.pop());
    }
}


export class Tetromino {
    constructor(shapeType) {
        this.shapeType = shapeType;
        this.color = SHAPE_COLORS[shapeType];
        this.shapeRotation = 0;
        this.shape = SHAPES[this.shapeType][this.shapeRotation];
        
        // left top of shape 4x4 grid
        this.row = 0;
        this.col = 0;
    }
    
    rotate() {
        this.shapeRotation = (this.shapeRotation + 1) % 4;
        this.shape = SHAPES[this.shapeType][this.shapeRotation];
    }
    
    absolutePos(shiftRow = 0, shiftCol = 0, rotate = false) {
        let shape = rotate ? SHAPES[this.shapeType][(this.shapeRotation+1)%4] : this.shape;
        return shape.map(pos => [this.row + shiftRow + pos[0],
                                 this.col + shiftCol + pos[1]]);
    }
}
