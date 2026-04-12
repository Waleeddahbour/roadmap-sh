import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const cliPath = path.join(projectRoot, 'expenseTracker.js');
const expenseFilePath = path.join(projectRoot, 'tests', 'expenses.test.json');

const runCli = (args) => {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: projectRoot,
    encoding: 'utf-8',
    env: {
      ...process.env,
      EXPENSE_FILE_PATH: expenseFilePath,
    },
  });

  return {
    code: result.status ?? 0,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
};

const writeExpenses = async (expenses) => {
  await fs.writeFile(expenseFilePath, JSON.stringify(expenses, null, 2), 'utf-8');
};

const readExpenses = async () => {
  const raw = await fs.readFile(expenseFilePath, 'utf-8');
  return JSON.parse(raw);
};

beforeEach(async () => {
  await writeExpenses([]);
});

test('add creates a new expense', async () => {
  const result = runCli(['add', '-d', 'Lunch', '-a', '20']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /Expense added successfully \(ID: 1\)/);

  const expenses = await readExpenses();
  assert.equal(expenses.length, 1);
  assert.equal(expenses[0].description, 'Lunch');
  assert.equal(expenses[0].amount, 20);
});

test('add rejects non-numeric amount', async () => {
  const result = runCli(['add', '-d', 'Lunch', '-a', 'abc']);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Amount must be a valid number\./);

  const expenses = await readExpenses();
  assert.equal(expenses.length, 0);
});

test('update amount only keeps description unchanged', async () => {
  await writeExpenses([
    {
      id: 1,
      description: 'Food',
      amount: 10,
      createdAt: '2026-02-10T10:00:00.000Z',
      updatedAt: '2026-02-10T10:00:00.000Z',
    },
  ]);

  const result = runCli(['update', '1', '--amount', '50']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /Expense updated successfully \(ID: 1\)/);

  const expenses = await readExpenses();
  assert.equal(expenses[0].description, 'Food');
  assert.equal(expenses[0].amount, 50);
});

test('update rejects invalid id', () => {
  const result = runCli(['update', 'abc', '--amount', '50']);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /ID must be a positive integer\./);
});

test('update requires at least one field option', () => {
  const result = runCli(['update', '1']);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Please provide at least one field to update: --description or --amount/
  );
});

test('delete missing id does not remove existing expenses', async () => {
  await writeExpenses([
    {
      id: 1,
      description: 'Food',
      amount: 10,
      createdAt: '2026-02-10T10:00:00.000Z',
      updatedAt: '2026-02-10T10:00:00.000Z',
    },
  ]);

  const result = runCli(['delete', '999']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /No expense found with the ID: 999/);

  const expenses = await readExpenses();
  assert.equal(expenses.length, 1);
  assert.equal(expenses[0].id, 1);
});

test('delete existing id removes expense', async () => {
  await writeExpenses([
    {
      id: 1,
      description: 'Food',
      amount: 10,
      createdAt: '2026-02-10T10:00:00.000Z',
      updatedAt: '2026-02-10T10:00:00.000Z',
    },
  ]);

  const result = runCli(['delete', '1']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /deleted successfully/);

  const expenses = await readExpenses();
  assert.equal(expenses.length, 0);
});

test('list with no data prints empty message', () => {
  const result = runCli(['list']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /No expenses found\./);
});

test('summary filters by month and ignores non-numeric amounts', async () => {
  await writeExpenses([
    {
      id: 1,
      description: 'Lunch',
      amount: 20,
      createdAt: '2026-02-10T10:00:00.000Z',
      updatedAt: '2026-02-10T10:00:00.000Z',
    },
    {
      id: 2,
      description: 'Dinner',
      amount: 'bad',
      createdAt: '2026-02-11T10:00:00.000Z',
      updatedAt: '2026-02-11T10:00:00.000Z',
    },
    {
      id: 3,
      description: 'March item',
      amount: 30,
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
    },
  ]);

  const feb = runCli(['summary', '2']);
  assert.equal(feb.code, 0);
  assert.match(feb.stdout, /Total expense for month 2: \$20/);

  const all = runCli(['summary']);
  assert.equal(all.code, 0);
  assert.match(all.stdout, /Total expenses: \$50/);
});

test('summary rejects invalid month', () => {
  const result = runCli(['summary', '13']);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Month must be a number from 1 to 12\./);
});
