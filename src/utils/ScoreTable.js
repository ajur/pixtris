
/**
 * Keep track of recent scores
 */
export default class ScoreTable {
    
    constructor() {
        this.scores = [];
    }
    
    add(lines, points) {
        this.scores.unshift({
            lines,
            points,
            date: new Date()
        });
        console.log('Newest score: ', this.scores[0]);
    }
    
    getNewest() {
        if (this.scores.length > 0) {
            return this.scores[0];
        }
    }
}
