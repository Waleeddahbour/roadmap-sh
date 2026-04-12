import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tasksFilePath =  path.join(__dirname, 'tasks.json');

const loadTasks = async (tasksFilePath) => {
  try{
    const tasks = await fs.readFile(tasksFilePath, "utf-8");
    console.log('File already exists.')
    return JSON.parse(tasks);
  } catch(err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(tasksFilePath, '[]');
      console.log('file created successfully');
      const tasks = await fs.readFile(tasksFilePath, "utf-8");
      return JSON.parse(tasks)
    }
    throw err;
  }
};

const saveTasks = async () => { await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8'); };

const tasks = await loadTasks(tasksFilePath);
const findTask = (id) => tasks.find(task => task.id === parseInt(id));
const now = () => new Date().toISOString();

const addTask = async (description, status="todo") => {
  const newId = tasks.length === 0 ? 1 : tasks.at(-1).id + 1;
  const newTask = {
    id: newId,
    description: description,
    status: status,
    createdAt: now(),
    updatedAt: now()
  };
  tasks.push(newTask);
  await saveTasks();
  console.log(`Added successfully (ID: ${newId})`);
};

const updateTask = async (id, update) => {  
  const toUpdate = findTask(id);
  if (!toUpdate) {
    console.log(`Task with ID ${id} not found`);
    return;
  }
  toUpdate.description = update;
  toUpdate.updatedAt = now();
  await saveTasks();
  console.log('Updated successfully');

};

const deleteTask = async (id) => {
  const taskIndex = tasks.findIndex(task => task.id === Number(id));
  if (taskIndex === -1) {
    console.log(`Task with ID ${id} not found`);
    return;
  }
  tasks.splice(taskIndex, 1);
  await saveTasks();
  console.log("deleted successfully")
};

const markTask = async (id, status) => {
  const toUpdate = findTask(id);
  if (!toUpdate) {
    console.log(`Task with ID ${id} not found`);
    return;
  }
  toUpdate.status = status;
  toUpdate.updatedAt = now();
  await saveTasks();
  console.log(`Status updated to ${status}`)
};

const listTasks = (status) => {
  const toList = status ? tasks.filter(task => task.status === status) : tasks;
  console.log(toList)
};

const args = process.argv;
const command = process.argv[2];
const validStatuses = ['todo', 'done', 'in-progress'];

const printUsage = (message) => {
  if (message) {
    console.log(`Error: ${message}`);
  }
  console.log('Usage:');
  console.log('  node task-cli.js add "description" [todo|done|in-progress]');
  console.log('  node task-cli.js update <id> "new description"');
  console.log('  node task-cli.js delete <id>');
  console.log('  node task-cli.js mark <id> <todo|done|in-progress>');
  console.log('  node task-cli.js list [todo|done|in-progress]');
};

const runCommand = async () => {
  console.log(args);
  switch (command) {
    case 'add':
      if (!args[3]) {
        printUsage('Missing description for add command.');
        break;
      }
      if (args[4] && !validStatuses.includes(args[4])) {
        printUsage(`Invalid status for add command. Use ${validStatuses}.`);
        break;
      }
      await addTask(args[3], args[4]);
      break;
    case 'update':
      if (!args[3] || !args[4]) {
        printUsage('Update command requires: <id> and "new description".');
        break;
      }
      await updateTask(args[3], args[4]);
      break;
    case 'delete':
      if (!args[3]) {
        printUsage('Delete command requires: <id>.');
        break;
      }
      await deleteTask(args[3]);
      break;
    case 'mark':
      if (!args[3] || !args[4]) {
        printUsage('Mark command requires: <id> and <todo|done|in-progress>.');
        break;
      }
      if (!validStatuses.includes(args[4])) {
        printUsage(`Invalid status for mark command. Use ${validStatuses}.`);
        break;
      }
      await markTask(args[3], args[4]);
      break;
    case 'list':
      if (args[3] && !validStatuses.includes(args[3])) {
        printUsage(`Invalid optional status for list command. use ${validStatuses}`);
        break;
      }
      listTasks(args[3]);
      break
    default:
      printUsage(`Unknown command: ${command || '(none)'}`)
  }
};

runCommand().catch((err) => {
  console.error(err.message);
  process.exit(1);
});