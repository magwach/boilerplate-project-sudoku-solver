import { suite, test } from 'mocha';
import { assert } from 'chai';
import SudokuSolver from '../controllers/sudoku-solver.js';

const solver = new SudokuSolver();

suite('Unit Tests', () => {
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....3.....45.37.9.2.1.6..5..';
  const invalidCharPuzzle = '1.5..2.84..63.12.7.2..5..a..9..1....8.2.3674.3.7.2..9....3.....45.37.9.2.1.6..5..';
  const shortPuzzle = '1.5..2.84..63.12.7.2..5..';
  const expectedSolution = '135762984946381257728459613694517832812936745357824196489173526573698421261245379';

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.deepEqual(solver.validate(validPuzzle), { valid: true });
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.deepEqual(solver.validate(invalidCharPuzzle), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.deepEqual(solver.validate(shortPuzzle), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, '5'));
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 1, '8'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 1, '9'));
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.deepEqual(solver.solve(validPuzzle), { solution: expectedSolution });
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.deepEqual(solver.solve(shortPuzzle), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.deepEqual(solver.solve(validPuzzle), { solution: expectedSolution });
  });
});
