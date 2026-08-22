const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses.controller');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const { expenseSchema } = require('../validators/expense.schema');

router.use(authMiddleware);

router.get('/budget/:tripId', expensesController.getBudget);
router.get('/', expensesController.getExpenses);
router.post('/', validate(expenseSchema), expensesController.addExpense);
router.put('/:id', validate(expenseSchema.partial()), expensesController.updateExpense);
router.delete('/:id', expensesController.deleteExpense);

module.exports = router;
