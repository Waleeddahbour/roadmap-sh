import { loadExpenses, saveExpenses } from "../utils/load-save.js";

const now = () => new Date().toISOString();

const addExpense = async (description, amount) => {
  const expenses = await loadExpenses();
  const currentMaxId = expenses.reduce((maxId, expense) => Math.max(maxId, Number(expense.id) || 0), 0);
  const newId = currentMaxId + 1;
  const expense = {
    id: newId,
    description,
    amount,
    createdAt: now(),
    updatedAt: now()
  }

  expenses.push(expense);
  await saveExpenses(expenses);
  console.log(`Expense added successfully (ID: ${newId})`);
};

export { addExpense };