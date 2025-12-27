# Todo Contract (TypeScript)

A smart contract for managing todo tasks on the NEAR network. Each task has an ID, title, completion status, and owner.

```ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
  owner: string;
}

@NearBindgen({})
class TodoContract {
  @call({})
  add_task({ title }: { title: string }): Task
  
  @view({})
  list_tasks(): Task[]
  
  @call({})
  delete_task({ task_id }: { task_id: number }): boolean
  
  @call({})
  toggle_task({ task_id }: { task_id: number }): boolean
}
```

<br />

# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16.
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Test the Contract
Install dependencies and build the contract:

```bash
npm install
npm run build
```

Run the tests:

```bash
npm test
```

<br />

## 2. Create an Account and Deploy the Contract
You can create a new account and deploy the contract by running:

```bash
near create-account <your-account.testnet> --useFaucet
near deploy <your-account.testnet> build/todo_contract.wasm
```

<br />


## 3. Using the Contract

### List All Tasks

`list_tasks` is a read-only method (aka `view` method) that returns all tasks.

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
# Use near-cli to list all tasks
near view <your-account.testnet> list_tasks
```

<br />

### Add a New Task
`add_task` creates a new task and assigns it to the caller.

```bash
# Use near-cli to add a task
near call oxman2025.testnet add_task '{"title":"Buy groceries"}' --accountId oxman2025.testnet
```

<br />

### Toggle Task Completion
`toggle_task` marks a task as completed or incomplete. Only the task owner can toggle their own tasks.

```bash
# Use near-cli to toggle a task
near call <your-account.testnet> toggle_task '{"task_id":1}' --accountId <your-account.testnet>
```

<br />

### Delete a Task
`delete_task` removes a task from the list. Only the task owner can delete their own tasks.

```bash
# Use near-cli to delete a task
near call <your-account.testnet> delete_task '{"task_id":1}' --accountId <your-account.testnet>
```

**Tip:** If you would like to interact with the contract using another account, first login into NEAR using:

```bash
# Use near-cli to login your NEAR account
near login
```

and then use the logged account to sign the transaction: `--accountId <another-account>`.