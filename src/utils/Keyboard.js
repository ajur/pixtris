
import { controls as controlsConfig } from '../config';

// handled keys
const KEY_MAP = {
    27: 'escape',
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

/**
 * Represents key control and handle custom repeat delay
 */
class Key {
    constructor(code) {
        this.code = code;
        this.name = KEY_MAP[code];
        this.pressed = false;
        
        this.repeatsCount = 0;
        this.repeatTimer = 0;
    }
    
    /**
     * Update repeat counters and check if action should be triggered
     * @returns {boolean} true if action should be triggered
     */
    trigger() {
        if (this.pressed) {
            --this.repeatTimer;
            if (this.repeatTimer <= 0) {
                this.repeatTimer = (this.repeatsCount > 0)
                    ? controlsConfig.repeatDelay
                    : controlsConfig.initialRepeatDelay;
                ++this.repeatsCount;
                return true;
            }
        }
        return false;
    }
    
    onPress() {
        this.pressed = true;
    }
    
    onRelease() {
        this.pressed = false;
        this.repeatTimer = 0;
        this.repeatsCount = 0;
    }
}


/**
 * Handles keyboard controls for known keys
 * 
 * This class could be more generic, but its not needed for this game.
 */
export default class Keyboard {
    constructor() {
        this.keys = {};
        
        Object.keys(KEY_MAP).forEach(k => {
            let key = new Key(k);
            this.keys[k] = key;
            this[key.name] = key;
        });
        
        window.addEventListener('keydown', (evt) => {
            let key = this.keys[evt.keyCode];
            if (key) {
                key.onPress();
            }
        });
        window.addEventListener('keyup', (evt) => {
            let key = this.keys[evt.keyCode];
            if (key) {
                key.onRelease();
            }
        });
    }
}
