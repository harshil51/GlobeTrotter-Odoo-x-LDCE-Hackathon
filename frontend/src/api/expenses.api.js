import api from './client';

export const expensesApi = {
  getBudget: (tripId) => api.get(`/expenses/budget/${tripId}`),
  getExpenses: (tripId) => api.get('/expenses', { params: { tripId } }),
  addExpense: (expenseData) => api.post('/expenses', expenseData),
  updateExpense: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};
