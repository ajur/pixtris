
import Tetromino, { SHAPE_COLORS } from './Tetromino';

const shapeTypes = Object.keys(SHAPE_COLORS).join('');

/**
 * Provide tetromino shapes queue, that gives fair randomness,
 * but lacks iritating single shape long strikes.
 */
export default class TetronimoSpawner {
    constructor() {
        this.queue = [];
        this.refillQueue();
    }
    
    /**
     * refill tetromino shapes queue, with semi-random ordering
     */
    refillQueue() {
        let a = (shapeTypes+shapeTypes+shapeTypes+shapeTypes).split('');
        // shuffle
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
