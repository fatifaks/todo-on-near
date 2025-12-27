// Find all our documentation at https://docs.near.org
use near_sdk::{env, log, near, AccountId};

#[near(serializers = [json, borsh])]
#[derive(Clone)]
pub struct Task {
    pub id: u64,
    pub title: String,
    pub completed: bool,
    pub owner: AccountId,
}

#[near(contract_state)]
pub struct TodoContract {
    tasks: Vec<Task>,
    next_id: u64,
}

impl Default for TodoContract {
    fn default() -> Self {
        Self {
            tasks: Vec::new(),
            next_id: 1,
        }
    }
}

#[near]
impl TodoContract {
    pub fn add_task(&mut self, title: String) -> Task {
        let owner = env::predecessor_account_id();
        let task = Task {
            id: self.next_id,
            title: title.clone(),
            completed: false,
            owner: owner.clone(),
        };

        self.tasks.push(task.clone());
        self.next_id += 1;

        log!("Task added: {} by {}", title, owner);
        task
    }

    pub fn list_tasks(&self) -> Vec<Task> {
        self.tasks.clone()
    }

    pub fn delete_task(&mut self, task_id: u64) -> bool {
        let owner = env::predecessor_account_id();
        
        if let Some(index) = self.tasks.iter().position(|task| task.id == task_id && task.owner == owner) {
            self.tasks.remove(index);
            log!("Task {} deleted by {}", task_id, owner);
            true
        } else {
            log!("Task {} not found or not owned by {}", task_id, owner);
            false
        }
    }

    pub fn toggle_task(&mut self, task_id: u64) -> bool {
        let owner = env::predecessor_account_id();
        
        if let Some(task) = self.tasks.iter_mut().find(|task| task.id == task_id && task.owner == owner) {
            task.completed = !task.completed;
            log!("Task {} toggled to {}", task_id, task.completed);
            true
        } else {
            log!("Task {} not found or not owned by {}", task_id, owner);
            false
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn get_context(predecessor: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    #[test]
    fn test_add_task() {
        let context = get_context("alice.near".parse().unwrap());
        testing_env!(context.build());

        let mut contract = TodoContract::default();
        let task = contract.add_task("Buy groceries".to_string());

        assert_eq!(task.id, 1);
        assert_eq!(task.title, "Buy groceries");
        assert_eq!(task.completed, false);
        assert_eq!(task.owner.to_string(), "alice.near");
        assert_eq!(contract.list_tasks().len(), 1);
    }

    #[test]
    fn test_list_tasks() {
        let context = get_context("alice.near".parse().unwrap());
        testing_env!(context.build());

        let mut contract = TodoContract::default();
        contract.add_task("Task 1".to_string());
        contract.add_task("Task 2".to_string());

        let tasks = contract.list_tasks();
        assert_eq!(tasks.len(), 2);
        assert_eq!(tasks[0].title, "Task 1");
        assert_eq!(tasks[1].title, "Task 2");
    }

    #[test]
    fn test_delete_task() {
        let context = get_context("alice.near".parse().unwrap());
        testing_env!(context.build());

        let mut contract = TodoContract::default();
        let task = contract.add_task("Task to delete".to_string());
        let task_id = task.id;

        assert_eq!(contract.list_tasks().len(), 1);

        let result = contract.delete_task(task_id);
        assert!(result);
        assert_eq!(contract.list_tasks().len(), 0);
    }

    #[test]
    fn test_delete_task_not_owner() {
        let alice_context = get_context("alice.near".parse().unwrap());
        testing_env!(alice_context.build());

        let mut contract = TodoContract::default();
        let task = contract.add_task("Alice's task".to_string());
        let task_id = task.id;

        let bob_context = get_context("bob.near".parse().unwrap());
        testing_env!(bob_context.build());

        let result = contract.delete_task(task_id);
        assert!(!result);
        assert_eq!(contract.list_tasks().len(), 1);
    }

    #[test]
    fn test_toggle_task() {
        let context = get_context("alice.near".parse().unwrap());
        testing_env!(context.build());

        let mut contract = TodoContract::default();
        let task = contract.add_task("Task to toggle".to_string());
        let task_id = task.id;

        assert!(!contract.list_tasks()[0].completed);

        contract.toggle_task(task_id);
        assert!(contract.list_tasks()[0].completed);

        contract.toggle_task(task_id);
        assert!(!contract.list_tasks()[0].completed);
    }

    #[test]
    fn test_toggle_task_not_owner() {
        let alice_context = get_context("alice.near".parse().unwrap());
        testing_env!(alice_context.build());

        let mut contract = TodoContract::default();
        let task = contract.add_task("Alice's task".to_string());
        let task_id = task.id;

        let bob_context = get_context("bob.near".parse().unwrap());
        testing_env!(bob_context.build());

        let result = contract.toggle_task(task_id);
        assert!(!result);
        assert!(!contract.list_tasks()[0].completed);
    }
}
