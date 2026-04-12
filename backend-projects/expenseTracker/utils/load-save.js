import fs from 'node:fs/promises';
import path from "node:path";


const __dirname = import.meta.dirname;
const expenseFilePath = process.env.EXPENSE_FILE_PATH || path.join(__dirname, '..', 'expenses.json');

const loadExpenses = async () => {
  try {
    const expenses = await fs.readFile(expenseFilePath, 'utf-8');
    return JSON.parse(expenses);
  } catch(err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(expenseFilePath, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
};


const saveExpenses = async (expenses) => {
  await fs.writeFile(expenseFilePath, JSON.stringify(expenses, null, 2), 'utf-8');
};

export { loadExpenses, saveExpenses };