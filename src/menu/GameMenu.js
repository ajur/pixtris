
import {Text, TextStyle} from 'pixi.js';

import State from '../utils/State';


export const fancyTextStyle = new TextStyle({
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

export const simpleTextStyle = new TextStyle({
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


export default class GameMenu extends State {
    constructor(game) {
        super();
        
        this.game = game;
        
        this.title = new Text('PIXTRIS', fancyTextStyle);
        this.title.anchor.set(0.5);
        this.title.x = this.game.app.view.width * 0.5;
        this.title.y = this.game.app.renderer.height * 0.25;

        this.addChild(this.title);
        
        this.info = new Text('Press SPACE to play', simpleTextStyle);
        this.info.anchor.set(0.5);
        this.info.x = this.game.app.view.width * 0.5;
        this.info.y = this.game.app.renderer.height * 0.75;
        
        this.infoVisibilityCounter = 20;
        
        this.addChild(this.info);
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