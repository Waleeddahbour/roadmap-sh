# Expense Tracker CLI

[Expense Tracker](https://roadmap.sh/projects/expense-tracker) project featured in the [Backend Roadmap](https://roadmap.sh/backend).

A simple command-line expense tracker built with Node.js and Commander.

## Features

- Add expenses with description and amount
- Update expense description and/or amount
- Delete expenses by ID
- List expenses in a table
- Show total summary (all expenses or by month)
- JSON file persistence (`expenses.json`)
- Automated tests for edge cases

## Requirements

- Node.js 18+

## Install

```bash
npm install
```

## Usage

```bash
node expenseTracker.js <command> [options]
```

### Commands

#### Add expense

```bash
node expenseTracker.js add -d "Lunch" -a 20
```

#### Update expense

```bash
node expenseTracker.js update 1 --description "Team Lunch"
node expenseTracker.js update 1 --amount 25
```

#### Delete expense

```bash
node expenseTracker.js delete 1
```

#### List expenses

```bash
node expenseTracker.js list
```

#### Summary (all)

```bash
node expenseTracker.js summary
```

#### Summary by month (1-12)

```bash
node expenseTracker.js summary 4
```

## Testing

Run tests:

```bash
npm test
```

Tests are isolated and use `tests/expenses.test.json` (they do not modify `expenses.json`).
