from near_pytest.testing import NearTestCase
import json

class TestTodoContract(NearTestCase):
    @classmethod
    def setup_class(cls):
        """Compile and deploy the todo contract."""
        super().setup_class()
        
        # Compile the contract
        wasm_path = cls.compile_contract(
            "path to contract.py",
            single_file=True
        )
        
        # Deploy the contract
        cls.contract_account = cls.create_account("contract")
        cls.instance = cls.deploy_contract(cls.contract_account, wasm_path)
        
        # Initialize the contract
        cls.instance.call_as(
            account=cls.contract_account,
            method_name="initialize",
            args={},
        )
        
        # Create test users
        cls.user1 = cls.create_account("user1")
        cls.user2 = cls.create_account("user2")
        
        # Save state for future resets
        cls.save_state()
    
    def setup_method(self):
        """Reset state before each test method."""
        self.reset_state()
        
    def test_add_task(self):
        """Test adding a new task."""
        result = self.instance.call_as(
            account=self.user1,
            method_name="add_task",
            args={"title": "Buy groceries"}
        )
        task = json.loads(result.text)
        
        assert task["id"] == 1
        assert task["title"] == "Buy groceries"
        assert task["completed"] == False
        assert task["owner"] == self.user1.account_id
        
    def test_list_tasks(self):
        """Test listing all tasks."""
        # Initially empty
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert len(tasks) == 0
        
        # Add tasks
        self.instance.call_as(
            account=self.user1,
            method_name="add_task",
            args={"title": "Task 1"}
        )
        self.instance.call_as(
            account=self.user2,
            method_name="add_task",
            args={"title": "Task 2"}
        )
        
        # List all tasks
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert len(tasks) == 2
        assert tasks[0]["title"] == "Task 1"
        assert tasks[1]["title"] == "Task 2"
        
    def test_delete_task(self):
        """Test deleting a task."""
        # Add a task
        result = self.instance.call_as(
            account=self.user1,
            method_name="add_task",
            args={"title": "Task to delete"}
        )
        task = json.loads(result.text)
        task_id = task["id"]
        
        # Delete the task
        result = self.instance.call_as(
            account=self.user1,
            method_name="delete_task",
            args={"task_id": task_id}
        )
        success = json.loads(result.text)
        assert success == True
        
        # Verify task is deleted
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert len(tasks) == 0
        
    def test_delete_task_wrong_owner(self):
        """Test that users can only delete their own tasks."""
        # User1 adds a task
        result = self.instance.call_as(
            account=self.user1,
            method_name="add_task",
            args={"title": "User1's task"}
        )
        task = json.loads(result.text)
        task_id = task["id"]
        
        # User2 tries to delete user1's task
        result = self.instance.call_as(
            account=self.user2,
            method_name="delete_task",
            args={"task_id": task_id}
        )
        success = json.loads(result.text)
        assert success == False
        
        # Verify task still exists
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert len(tasks) == 1
        
    def test_toggle_task(self):
        """Test toggling task completion status."""
        # Add a task
        result = self.instance.call_as(
            account=self.user1,
            method_name="add_task",
            args={"title": "Task to toggle"}
        )
        task = json.loads(result.text)
        task_id = task["id"]
        
        # Toggle to completed
        result = self.instance.call_as(
            account=self.user1,
            method_name="toggle_task",
            args={"task_id": task_id}
        )
        success = json.loads(result.text)
        assert success == True
        
        # Verify task is completed
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert tasks[0]["completed"] == True
        
        # Toggle back to incomplete
        result = self.instance.call_as(
            account=self.user1,
            method_name="toggle_task",
            args={"task_id": task_id}
        )
        success = json.loads(result.text)
        assert success == True
        
        # Verify task is incomplete
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert tasks[0]["completed"] == False
        
    def test_toggle_task_wrong_owner(self):
        """Test that users can only toggle their own tasks."""
        # User1 adds a task
        result = self.instance.call_as(
            account=self.user1,
            method_name="add_task",
            args={"title": "User1's task"}
        )
        task = json.loads(result.text)
        task_id = task["id"]
        
        # User2 tries to toggle user1's task
        result = self.instance.call_as(
            account=self.user2,
            method_name="toggle_task",
            args={"task_id": task_id}
        )
        success = json.loads(result.text)
        assert success == False
        
        # Verify task is still incomplete
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert tasks[0]["completed"] == False
        
    def test_multiple_tasks(self):
        """Test adding and managing multiple tasks."""
        # Add multiple tasks
        for i in range(1, 4):
            self.instance.call_as(
                account=self.user1,
                method_name="add_task",
                args={"title": f"Task {i}"}
            )
        
        # List tasks
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert len(tasks) == 3
        
        # Toggle second task
        self.instance.call_as(
            account=self.user1,
            method_name="toggle_task",
            args={"task_id": 2}
        )
        
        # Delete first task
        self.instance.call_as(
            account=self.user1,
            method_name="delete_task",
            args={"task_id": 1}
        )
        
        # Verify final state
        result = self.instance.call_as(
            account=self.user1,
            method_name="list_tasks"
        )
        tasks = json.loads(result.text)
        assert len(tasks) == 2
        assert tasks[0]["id"] == 2
        assert tasks[0]["completed"] == True
        assert tasks[1]["id"] == 3
        assert tasks[1]["completed"] == False
        
