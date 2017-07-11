
import BaseMenu from './BaseMenu';


/**
 * Display Main Menu screen
 */
export default class GameMenu extends BaseMenu {
    constructor(game) {
        super(game, 'PIXTRIS');
        
        this.game = game;
    }
    
    update(dt) {
        super.update(dt);
        
        if (this.game.key.space.trigger()) {
            this.game.setState('play', {restart: true});
        }
    }
}