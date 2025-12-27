// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view } from 'near-sdk-js';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  owner: string;
}

@NearBindgen({})
class TodoContract {
  tasks: Task[] = [];
  nextId: number = 1;

  @call({})
  add_task({ title }: { title: string }): Task {
    // Initialize tasks array if undefined
    if (!this.tasks) {
      this.tasks = [];
    }
    if (!this.nextId) {
      this.nextId = 1;
    }
    
    const owner = near.predecessorAccountId();
    const task: Task = {
      id: this.nextId++,
      title,
      completed: false,
      owner,
    };
    this.tasks.push(task);
    near.log(`Task added: ${title} by ${owner}`);
    return task;
  }

  @view({})
  list_tasks(): Task[] {
    // Return empty array if tasks is undefined
    return this.tasks || [];
  }

  @call({})
  delete_task({ task_id }: { task_id: number }): boolean {
    // Initialize tasks array if undefined
    if (!this.tasks) {
      this.tasks = [];
    }
    
    const owner = near.predecessorAccountId();
    const taskIndex = this.tasks.findIndex(
      (task) => task.id === task_id && task.owner === owner
    );

    if (taskIndex === -1) {
      near.log(`Task ${task_id} not found or not owned by ${owner}`);
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    near.log(`Task ${task_id} deleted by ${owner}`);
    return true;
  }

  @call({})
  toggle_task({ task_id }: { task_id: number }): boolean {
    // Initialize tasks array if undefined
    if (!this.tasks) {
      this.tasks = [];
    }
    
    const owner = near.predecessorAccountId();
    const task = this.tasks.find(
      (task) => task.id === task_id && task.owner === owner
    );

    if (!task) {
      near.log(`Task ${task_id} not found or not owned by ${owner}`);
      return false;
    }

    task.completed = !task.completed;
    near.log(`Task ${task_id} toggled to ${task.completed}`);
    return true;
  }
}