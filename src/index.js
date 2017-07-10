import { Application, loader } from 'pixi.js';

import config from './config';
import Game from './Game';

let app = new Application(config.display.width, config.display.height, {});
document.body.appendChild(app.view);

let game = new Game(app);

loader.add('blocks', 'sprites.json').load(() => game.run())
