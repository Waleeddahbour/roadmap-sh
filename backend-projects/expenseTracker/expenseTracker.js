import { Command } from "commander";
import { addExpense } from "./commands/addExpense.js";
import { updateExpense } from "./commands/updateExpense.js";
import { deleteExpense } from "./commands/deleteExpense.js";
import { listExpenses } from "./commands/listExpenses.js";
import { expenseSummary } from "./commands/expenseSummary.js";


const program = new Command();

program
  .name('Expense Tracker')
  .description('Simple expenses tracker')
  .version('1.0.0');

program
  .command('add')
  .requiredOption('-d, --description <string>', 'What did you spend on?')
  .requiredOption('-a, --amount <number>', 'How much did you spend on it?')
  .action(async (options) => {
    const amount = Number(options.amount);
    if (!Number.isFinite(amount)) {
      console.error('Amount must be a valid number.');
      process.exit(1);
    }

    await addExpense(options.description, amount);
  });

program
  .command('update <id>')
  .option('-d, --description <string>')
  .option('-a, --amount <number>')
  .action(async (id, options) => {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
      console.error('ID must be a positive integer.');
      process.exit(1);
    }

    const { description, amount } = options;

    if (description === undefined && amount === undefined) {
      console.error('Please provide at least one field to update: --description or --amount');
      process.exit(1);
    }

    if (amount !== undefined && !Number.isFinite(Number(amount))) {
      console.error('Amount must be a valid number.');
      process.exit(1);
    }

    await updateExpense(parsedId, description, amount);
  });

program
  .command('delete <id>')
  .action(async (id) => {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
      console.error('ID must be a positive integer.');
      process.exit(1);
    }

    await deleteExpense(parsedId);
  });

program
  .command('list')
  .action(() => listExpenses());

program
  .command('summary [month]')
  .action((month) => expenseSummary(month !== undefined ? Number(month) : undefined));


program.parse(process.argv);