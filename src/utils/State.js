
import { Container } from 'pixi.js';


/**
 * Base class for game states.
 * Extends PIXI.Container for easy state switching.
 */
export default class State extends Container {
    constructor() {
        super();
        this.visible = false;
    }
    
    /**
     * action on state enter
     */
    enter() {
        this.visible = true;
    }
    
    /**
     * action on state exit
     */
    exit() {
        this.visible = false;
    }
    
    /**
     * action on state update (game loop)
     * @param {Number} dt PIXI timer deltaTime
     */
    update(dt) {}
}
