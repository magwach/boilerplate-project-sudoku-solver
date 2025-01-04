class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const startIndex = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[startIndex + i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[column + i * 9] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const idx = (startRow + r) * 9 + (startCol + c);
        if (puzzleString[idx] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validateResult = this.validate(puzzleString);
    if (validateResult.error) return validateResult;

    const solveRecursive = (puzzle) => {
      const emptyIndex = puzzle.indexOf('.');
      if (emptyIndex === -1) {
        return puzzle;
      }
      const row = Math.floor(emptyIndex / 9);
      const column = emptyIndex % 9;

      for (let value = 1; value <= 9; value++) {
        const charValue = value.toString();
        if (
          this.checkRowPlacement(puzzle, row, column, charValue) &&
          this.checkColPlacement(puzzle, row, column, charValue) &&
          this.checkRegionPlacement(puzzle, row, column, charValue)
        ) {
          const newPuzzle = puzzle.substring(0, emptyIndex) + charValue + puzzle.substring(emptyIndex + 1);
          const solved = solveRecursive(newPuzzle);
          if (solved) {
            return solved;
          }
        }
      }
      return null;
    };

    const solution = solveRecursive(puzzleString);
    if (!solution) {
      return { error: 'Puzzle cannot be solved' };
    }
    return { solution };
  }
}

export default SudokuSolver;
