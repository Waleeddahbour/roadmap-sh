import { loadExpenses, saveExpenses } from "../utils/load-save.js";

const deleteExpense = async (id) => {
  const expenses = await loadExpenses();
  const toDelete = expenses.findIndex((expense) => expense.id === id);

  if (toDelete === -1) {
    console.log(`No expense found with the ID: ${id}`);
    return;
  }

  expenses.splice(toDelete, 1);
  await saveExpenses(expenses);
  console.log(`Expense with the ID: ${id} deleted successfully.`)
};

export { deleteExpense };