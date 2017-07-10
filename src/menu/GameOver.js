
import {Text} from 'pixi.js';

import State from '../utils/State';
import {fancyTextStyle, simpleTextStyle} from './GameMenu';


/**
 * Display Game Over screen
 */
export default class GameOver extends State {
    constructor(game) {
        super();
        
        this.game = game;
        
        this.title = new Text('GAME\nOVER', fancyTextStyle);
        this.title.anchor.set(0.5);
        this.title.x = this.game.app.view.width * 0.5;
        this.title.y = this.game.app.renderer.height * 0.20;
        this.addChild(this.title);
        
        this.scoreInfo = new Text('Last score', simpleTextStyle);
        this.scoreInfo.anchor.set(0.5);
        this.scoreInfo.x = this.game.app.view.width * 0.5;
        this.scoreInfo.y = this.game.app.renderer.height * 0.50;
        this.addChild(this.scoreInfo);
        
        this.info = new Text('Press SPACE to play', simpleTextStyle);
        this.info.anchor.set(0.5);
        this.info.x = this.game.app.view.width * 0.5;
        this.info.y = this.game.app.renderer.height * 0.80;
        
        this.infoVisibilityCounter = 20;
        
        this.addChild(this.info);
    }
    
    enter() {
        super.enter();
        
        let score = this.game.scores.getNewest();
        this.scoreInfo.text = `Score: ${score.points}\nLines: ${score.lines}`;
    }
    
    update() {
        if (this.game.key.space.pressed) {
            this.game.setState('play');
        }
        
        if (--this.infoVisibilityCounter == 0) {
            this.infoVisibilityCounter = 45;
            this.info.visible = !this.info.visible;
        }
    }
}
