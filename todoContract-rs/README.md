# Todo Contract - Rust

A simple todo list smart contract for NEAR Protocol written in Rust and python.

## Features

- **Add Task**: Create a new todo task with a title
- **List Tasks**: View all tasks in the todo list
- **Toggle Task**: Mark tasks as completed or incomplete
- **Delete Task**: Remove tasks from the list
- **Owner Protection**: Users can only modify their own tasks

## How to Build Locally?

Install [`cargo-near`](https://github.com/near/cargo-near) and run:

```bash
cargo near build
```

## How to Test Locally?

```bash
cargo test
```

## Contract Methods

### Call Methods (require transaction)

- `add_task(title: String) -> Task`: Add a new task
- `delete_task(task_id: u64) -> bool`: Delete a task by ID (only owner can delete)
- `toggle_task(task_id: u64) -> bool`: Toggle task completion status (only owner can toggle)

### View Methods (read-only)

- `list_tasks() -> Vec<Task>`: Get all tasks

### Task Structure

```rust
pub struct Task {
    pub id: u64,
    pub title: String,
    pub completed: bool,
    pub owner: AccountId,
}
```

## How to Deploy?

### Method 1: Using cargo-near (Recommended)

Install [`cargo-near`](https://github.com/near/cargo-near) and run:

For development/debugging:
```bash
cargo near deploy build-non-reproducible-wasm <account-id>
```

For production:
```bash
cargo near deploy build-reproducible-wasm <account-id>
```

### Method 2: Using NEAR CLI

First, build the contract:
```bash
cargo near build non-reproducible-wasm
```

Then deploy using NEAR CLI:
```bash
near deploy <account-id> --wasmFile target/near/todo_contract.wasm
```

Example:
```bash
near deploy <account-id> --wasmFile target/near/todo_contract.wasm
```

## CLI Usage Examples

Once deployed, interact with your contract using these commands:

### Add a Task

```bash
near call <account-id> add_task '{"title": "Your task title"}' --accountId <your-account>
```

Example:
```bash
near call <account-id> add_task '{"title": "Learn Rust"}' --accountId <account-id>
near call <account-id> add_task '{"title": "Build NEAR dApp"}' --accountId <account-id>
```

### List All Tasks

```bash
near view <account-id> list_tasks '{}'
```

Example:
```bash
near view <account-id> list_tasks '{}'
```

### Toggle Task (Mark Complete/Incomplete)

```bash
near call <account-id> toggle_task '{"task_id": <task-id>}' --accountId <your-account>
```

Example:
```bash
near call <account-id> toggle_task '{"task_id": 1}' --accountId <account-id>
```

### Delete a Task

```bash
near call <account-id> delete_task '{"task_id": <task-id>}' --accountId <your-account>
```

Example:
```bash
near call <account-id> delete_task '{"task_id": 1}' --accountId <account-id>
```

### Complete Workflow Example

```bash
# 1. Add tasks
near call <account-id> add_task '{"title": "Learn Rust"}' --accountId <account-id>
near call <account-id> add_task '{"title": "Build NEAR dApp"}' --accountId <account-id>

# 2. View all tasks
near view <account-id> list_tasks '{}'

# 3. Mark task 1 as complete
near call <account-id> toggle_task '{"task_id": 1}' --accountId <account-id>

# 4. View tasks to see the change
near view <account-id> list_tasks '{}'

# 5. Delete task 2
near call <account-id> delete_task '{"task_id": 2}' --accountId <account-id>

# 6. View final task list
near view <account-id> list_tasks '{}'
```

## Useful Links

- [cargo-near](https://github.com/near/cargo-near) - NEAR smart contract development toolkit for Rust
- [near CLI](https://near.cli.rs) - Interact with NEAR blockchain from command line
- [NEAR Rust SDK Documentation](https://docs.near.org/sdk/rust/introduction)
- [NEAR Documentation](https://docs.near.org)
- [NEAR StackOverflow](https://stackoverflow.com/questions/tagged/nearprotocol)
- [NEAR Discord](https://near.chat)
- [NEAR Telegram Developers Community Group](https://t.me/neardev)
- NEAR DevHub: [Telegram](https://t.me/neardevhub), [Twitter](https://twitter.com/neardevhub)
