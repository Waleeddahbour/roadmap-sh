import { loadExpenses, saveExpenses } from "../utils/load-save.js";

const now = () => new Date().toISOString();

const updateExpense = async (id, description, amount) => {
  const expenses = await loadExpenses();
  const toUpdate = expenses.find((expense) => expense.id === id);

  if (!toUpdate) {
    console.error(`Expense not found for ID: ${id}`);
    process.exit(1);
  }

  if (description !== undefined) {
    toUpdate.description = description;
  }

  if (amount !== undefined) {
    toUpdate.amount = Number(amount);
  }

  toUpdate.updatedAt = now();

  await saveExpenses(expenses);
  console.log(`Expense updated successfully (ID: ${id})`);
};

export { updateExpense };