
import { Container } from 'pixi.js';

export default class State extends Container {
    constructor() {
        super();
        this.visible = false;
    }
    
    enter() {
        this.visible = true;
    }
    
    exit() {
        this.visible = false;
    }

    update(dt) {}
}
