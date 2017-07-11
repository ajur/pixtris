
export const game = {
    // board dimensions
    cols: 10,
    rows: 20,
    hiddenRows: 2,
    // number of frames between block falls one row
    fallSpeed: 30,
    fallSpeedMin: 3,
    fallSpeedupStep: 2,
    fallSpeedupDelay: 1800,
    // block will fall this time faster when drop key pressed
    dropModifier: 10
}

const SPRITE_SIZE = 32;

export const display = {
    // currently hardcoded block sprite size
    blockSize: SPRITE_SIZE,
    width: game.cols * SPRITE_SIZE,
    height: game.rows * SPRITE_SIZE
}

export const controls = {
    // controls key repeat speed
    repeatDelay: 2,
    initialRepeatDelay: 10
}

export default {game, display, controls};
