
export const game = {
    // board dimensions
    cols: 10,
    rows: 20,
    hiddenRows: 2,
    // number of frames between block falls one row
    fallSpeed: 30,
    // block will fall this time faster when drop key pressed
    dropModifier: 10
}

export const display = {
    // currently hardcoded block sprite size
    blockSize: 16,
    width: game.cols * 16,
    height: game.rows * 16
}

export const controls = {
    // controls key repeat speed
    repeatDelay: 4,
    initialRepeatDelay: 12
}

export default {game, display, controls};
