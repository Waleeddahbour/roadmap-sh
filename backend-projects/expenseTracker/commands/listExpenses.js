import { loadExpenses } from "../utils/load-save.js";

const listExpenses = async () => {
  const expenses = await loadExpenses();
  if (!expenses.length) return console.log('No expenses found.');

  console.table(
    expenses.map((expense) => ({
      ID: expense.id,
      Date: expense.createdAt?.slice(0, 10) ?? 'N/A',
      Description: expense.description,
      Amount: `$${expense.amount}`,
    }))
  );
};
export { listExpenses };