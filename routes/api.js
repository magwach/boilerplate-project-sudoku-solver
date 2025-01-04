'use strict';

import SudokuSolver from '../controllers/sudoku-solver.js';

export default function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validateResult = solver.validate(puzzle);
      if (validateResult.error) {
        return res.json(validateResult);
      }

      // Validate coordinate
      if (
        coordinate.length !== 2 ||
        !/[A-I]/i.test(coordinate[0]) ||
        !/[1-9]/.test(coordinate[1])
      ) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const row = coordinate[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(coordinate[1], 10) - 1;

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // Check if the value already exists at the given position
      const currentValue = puzzle[row * 9 + col];
      if (currentValue === value) {
        return res.json({ valid: true }); // The value is already placed and valid
      }

      // Check for conflicts
      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

      res.json({
        valid: conflicts.length === 0,
        ...(conflicts.length > 0 && { conflict: conflicts }),
      });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      const result = solver.solve(puzzle);
      res.json(result);
    });
};
