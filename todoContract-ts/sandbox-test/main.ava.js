import anyTest from 'ava';
import { Worker } from 'near-workspaces';
import { setDefaultResultOrder } from 'dns'; setDefaultResultOrder('ipv4first'); // temp fix for node >v17

/**
 *  @typedef {import('near-workspaces').NearAccount} NearAccount
 *  @type {import('ava').TestFn<{worker: Worker, accounts: Record<string, NearAccount>}>}
 */
const test = anyTest;

test.beforeEach(async t => {
  // Create sandbox
  const worker = t.context.worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('test-account');

  // Get wasm file path from package.json test script in folder above
  await contract.deploy(
    process.argv[2],
  );

  // Save state for test runs, it is unique for each test
  t.context.accounts = { root, contract };
});

test.afterEach.always(async (t) => {
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('add_task: should add a new task', async (t) => {
  const { root, contract } = t.context.accounts;
  
  const task = await root.call(contract, 'add_task', { title: 'Buy groceries' });
  
  t.is(task.title, 'Buy groceries');
  t.is(task.completed, false);
  t.is(task.owner, root.accountId);
  t.is(task.id, 1);
});

test('add_task: should add multiple tasks with incremental IDs', async (t) => {
  const { root, contract } = t.context.accounts;
  
  const task1 = await root.call(contract, 'add_task', { title: 'Task 1' });
  const task2 = await root.call(contract, 'add_task', { title: 'Task 2' });
  const task3 = await root.call(contract, 'add_task', { title: 'Task 3' });
  
  t.is(task1.id, 1);
  t.is(task2.id, 2);
  t.is(task3.id, 3);
});

test('list_tasks: should return empty list initially', async (t) => {
  const { contract } = t.context.accounts;
  
  const tasks = await contract.view('list_tasks', {});
  
  t.deepEqual(tasks, []);
});

test('list_tasks: should return all added tasks', async (t) => {
  const { root, contract } = t.context.accounts;
  
  await root.call(contract, 'add_task', { title: 'Task 1' });
  await root.call(contract, 'add_task', { title: 'Task 2' });
  await root.call(contract, 'add_task', { title: 'Task 3' });
  
  const tasks = await contract.view('list_tasks', {});
  
  t.is(tasks.length, 3);
  t.is(tasks[0].title, 'Task 1');
  t.is(tasks[1].title, 'Task 2');
  t.is(tasks[2].title, 'Task 3');
});

test('delete_task: should delete an existing task', async (t) => {
  const { root, contract } = t.context.accounts;
  
  const task = await root.call(contract, 'add_task', { title: 'To be deleted' });
  const result = await root.call(contract, 'delete_task', { task_id: task.id });
  
  t.is(result, true);
  
  const tasks = await contract.view('list_tasks', {});
  t.is(tasks.length, 0);
});

test('delete_task: should return false for non-existent task', async (t) => {
  const { root, contract } = t.context.accounts;
  
  const result = await root.call(contract, 'delete_task', { task_id: 999 });
  
  t.is(result, false);
});

test('delete_task: should only delete task owned by caller', async (t) => {
  const { root, contract } = t.context.accounts;
  const alice = await t.context.worker.rootAccount.createSubAccount('alice');
  
  // Root adds a task
  const task = await root.call(contract, 'add_task', { title: 'Root task' });
  
  // Alice tries to delete root's task
  const result = await alice.call(contract, 'delete_task', { task_id: task.id });
  
  t.is(result, false);
  
  // Task should still exist
  const tasks = await contract.view('list_tasks', {});
  t.is(tasks.length, 1);
});

test('toggle_task: should toggle task completion status', async (t) => {
  const { root, contract } = t.context.accounts;
  
  const task = await root.call(contract, 'add_task', { title: 'Toggle me' });
  
  // Toggle to completed
  await root.call(contract, 'toggle_task', { task_id: task.id });
  let tasks = await contract.view('list_tasks', {});
  t.is(tasks[0].completed, true);
  
  // Toggle back to incomplete
  await root.call(contract, 'toggle_task', { task_id: task.id });
  tasks = await contract.view('list_tasks', {});
  t.is(tasks[0].completed, false);
});

test('full workflow: add, list, complete, and delete tasks', async (t) => {
  const { root, contract } = t.context.accounts;
  
  // Add tasks
  await root.call(contract, 'add_task', { title: 'Task 1' });
  const task2 = await root.call(contract, 'add_task', { title: 'Task 2' });
  await root.call(contract, 'add_task', { title: 'Task 3' });
  
  // List all tasks
  let tasks = await contract.view('list_tasks', {});
  t.is(tasks.length, 3);
  
  // Complete task 2
  await root.call(contract, 'toggle_task', { task_id: task2.id });
  tasks = await contract.view('list_tasks', {});
  t.is(tasks[1].completed, true);
  
  // Delete task 2
  await root.call(contract, 'delete_task', { task_id: task2.id });
  tasks = await contract.view('list_tasks', {});
  t.is(tasks.length, 2);
  t.is(tasks[0].title, 'Task 1');
  t.is(tasks[1].title, 'Task 3');
});