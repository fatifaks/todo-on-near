from near_sdk_py import Contract, view, call, init, Context
from typing import List, Dict, Optional

class Task:
    """
    Represents a todo task.
    """
    def __init__(self, id: int, title: str, completed: bool, owner: str):
        self.id = id
        self.title = title
        self.completed = completed
        self.owner = owner
    
    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "title": self.title,
            "completed": self.completed,
            "owner": self.owner
        }

class TodoContract(Contract):
    """
    A simple todo list contract that manages tasks for users.
    Each user can add, list, delete, and toggle their own tasks.
    """
    
    @init
    def initialize(self):
        """
        Initialize the contract with empty tasks list.
        """
        self.storage["tasks"] = []
        self.storage["next_id"] = 1
        return {"success": True}
    
    @call
    def add_task(self, title: str) -> Dict:
        """
        Add a new task to the todo list.
        """
        tasks = self.storage.get("tasks", [])
        next_id = self.storage.get("next_id", 1)
        owner = Context.predecessor_account_id()
        
        task = {
            "id": next_id,
            "title": title,
            "completed": False,
            "owner": owner
        }
        
        tasks.append(task)
        self.storage["tasks"] = tasks
        self.storage["next_id"] = next_id + 1
        
        self.log_info(f"Task added: {title} by {owner}")
        return task
    
    @view
    def list_tasks(self) -> List[Dict]:
        """
        Retrieve all tasks from the todo list.
        """
        return self.storage.get("tasks", [])
    
    @call
    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID. Only the task owner can delete their tasks.
        """
        tasks = self.storage.get("tasks", [])
        owner = Context.predecessor_account_id()
        
        task_index = None
        for i, task in enumerate(tasks):
            if task["id"] == task_id and task["owner"] == owner:
                task_index = i
                break
        
        if task_index is None:
            self.log_info(f"Task {task_id} not found or not owned by {owner}")
            return False
        
        tasks.pop(task_index)
        self.storage["tasks"] = tasks
        self.log_info(f"Task {task_id} deleted by {owner}")
        return True
    
    @call
    def toggle_task(self, task_id: int) -> bool:
        """
        Toggle the completed status of a task. Only the task owner can toggle their tasks.
        """
        tasks = self.storage.get("tasks", [])
        owner = Context.predecessor_account_id()
        
        task = None
        for t in tasks:
            if t["id"] == task_id and t["owner"] == owner:
                task = t
                break
        
        if task is None:
            self.log_info(f"Task {task_id} not found or not owned by {owner}")
            return False
        
        task["completed"] = not task["completed"]
        self.storage["tasks"] = tasks
        self.log_info(f"Task {task_id} toggled to {task['completed']}")
        return True
        