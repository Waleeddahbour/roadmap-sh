import { loadExpenses } from "../utils/load-save.js";


const expenseSummary = async (month) => {
  const expenses = await loadExpenses();
  
  const monthNumber = month !== undefined ? Number(month) : undefined;
  if (monthNumber !== undefined && (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12)) {
    console.error("Month must be a number from 1 to 12.");
    process.exit(1);
  }

  const filteredExpenses = monthNumber === undefined ? expenses
  : expenses.filter((expense) => {
    const date = new Date(expense.createdAt);
    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const m = date.getMonth() + 1;
    return m === monthNumber;
  });

  const total = filteredExpenses.reduce((sum, expense) => {
    const value = Number(expense.amount);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  const message = monthNumber === undefined ? `Total expenses: $${total}`
  : `Total expense for month ${monthNumber}: $${total}`;

  console.log(message);
  
};

export { expenseSummary };