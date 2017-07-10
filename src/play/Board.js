
export default class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        
        for (let i = 0; i < this.rows; ++i) {
            let row = [];
            for (let j = 0; j < this.cols; ++j) {
                row.push(false);
            }
            this.grid.push(row);
        }
    }
    
    collides(positions) {
        let row, col;
        for(let i = 0; i < positions.length; ++i) {
            row = positions[i][0];
            col = positions[i][1];
            if (row < 0 || row >= this.rows ||
                col < 0 || col >= this.cols ||
                this.grid[row][col]) {
                
                return true;
            }
        }
        return false;
    }
    
    isFull(row) {
        return this.grid[row].every(cell => !!cell);
    }
    
    setAll(positions, val) {
        let i,row,col,block;
        let rowsToCheck = new Set();
        for(i=0; i < positions.length; ++i) {
            this.grid[positions[i][0]][positions[i][1]] = val;
            rowsToCheck.add(positions[i][0]);
        }
        return Array.from(rowsToCheck).filter(this.isFull, this);
    }
    
    cleanRows(rows) {
        rows.sort((a,b) => a - b);
        let emptyRows = [];
        for (let i = rows.length - 1; i >= 0; --i) {
            this.grid.splice(rows[i], 1);
            let row = [];
            for (let j = 0; j < this.cols; ++j) {
                row.push(false);
            }
            emptyRows.push(row);
        }
        Array.prototype.unshift.apply(this.grid, emptyRows);
    }
    
    set(row, col, val) {
        this.grid[row][col] = val;
        return (this.isFull(row)) ? [row] : [];
    }
    
    get(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        } else {
            return null;
        }
    }
}
