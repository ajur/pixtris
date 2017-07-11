
import {Text} from 'pixi.js';

import BaseMenu from './BaseMenu';


/**
 * Display Game Over screen
 */
export default class GamePaused extends BaseMenu {
    constructor(game) {
        super(game, 'PAUSED', 'Press SPACE to continue\nPress ESCAPE to restart');
        
        this.scoreInfo = new Text('Last score', this.info.style);
        this.scoreInfo.anchor.set(0.5);
        this.scoreInfo.x = this.game.app.view.width * 0.5;
        this.scoreInfo.y = this.game.app.renderer.height * 0.50;
        this.addChild(this.scoreInfo);
    }
    
    enter(opts) {
        if (opts.score) {
            this.scoreInfo.text = `Score: ${opts.score.points}\nLines: ${opts.score.lines}`;
            this.scoreInfo.visible = true;
        } else {
            this.scoreInfo.visible = false;
        }
    }
    
    update(dt) {
        super.update(dt);
        
        if (this.game.key.space.trigger()) {
            this.game.setState('play', {restart: false});
        } else if (this.game.key.escape.trigger()) {
            this.game.setState('play', {restart: true});
        }
    }
}
