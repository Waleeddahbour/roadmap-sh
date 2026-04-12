# TaskTracker

Sample solution for the [task-tracker](https://roadmap.sh/projects/task-tracker) challenge from [roadmap.sh](https://roadmap.sh/).
A simple Node.js command-line task tracker that stores tasks in a local `tasks.json` file.

## Features

- Add tasks
- Update task descriptions
- Delete tasks
- Mark tasks by status
- List all tasks or filter by status
- Auto-creates `tasks.json` if it does not exist

## Requirements

- Node.js 18+

## Install

```bash
npm install
```

## Run

Start with nodemon:

```bash
npm start
```

Run commands directly:

```bash
node task-cli.js <command>
```

## Commands

### Add a task

```bash
node task-cli.js add "Go to gym"
node task-cli.js add "Finish project" done
node task-cli.js add "Build CLI" in-progress
```

### Update a task

```bash
node task-cli.js update 1 "Go to the gym at 6pm"
```

### Delete a task

```bash
node task-cli.js delete 1
```

### Mark a task

```bash
node task-cli.js mark 1 done
node task-cli.js mark 1 todo
node task-cli.js mark 1 in-progress
```

### List tasks

```bash
node task-cli.js list
node task-cli.js list todo
node task-cli.js list done
node task-cli.js list in-progress
```

## Valid Status Values

- `todo`
- `done`
- `in-progress`

## Data Storage

Tasks are stored in `tasks.json` as an array of objects like this:

```json
[
  {
    "id": 1,
    "description": "Go to gym",
    "status": "todo",
    "createdAt": "2026-04-11T13:40:22.385Z",
    "updatedAt": "2026-04-11T13:40:22.385Z"
  }
]
```

## Notes

- IDs are generated automatically.
- If a task ID does not exist, the CLI prints a helpful message.
- Invalid commands or arguments show usage instructions.
