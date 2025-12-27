import { useState, useEffect, useCallback } from 'react';
import { useWalletSelector } from '@near-wallet-selector/react-hook';
import { TodoContract } from '@/config';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  owner: string;
}

export const TodoApp = () => {
  const { signedAccountId, callFunction, viewFunction } = useWalletSelector();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    if (!signedAccountId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const result = await viewFunction({
        contractId: TodoContract,
        method: 'list_tasks',
        args: {},
      });
      
      setTasks(Array.isArray(result) ? result : []);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      setError(`Failed to load tasks: ${err.message}`);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [signedAccountId, viewFunction]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      setError('Please enter a task title');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await callFunction({
        contractId: TodoContract,
        method: 'add_task',
        args: { title: newTaskTitle },
        gas: '30000000000000',
        deposit: '0',
      });
      
      setNewTaskTitle('');
      await loadTasks();
    } catch (err: any) {
      console.error('Failed to add task:', err);
      setError(`Failed to add task: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: number) => {
    try {
      setLoading(true);
      setError('');
      await callFunction({
        contractId: TodoContract,
        method: 'toggle_task',
        args: { task_id: taskId },
        gas: '30000000000000',
        deposit: '0',
      });
      await loadTasks();
    } catch (err: any) {
      console.error('Failed to toggle task:', err);
      setError('Failed to toggle task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      setLoading(true);
      setError('');
      await callFunction({
        contractId: TodoContract,
        method: 'delete_task',
        args: { task_id: taskId },
        gas: '30000000000000',
        deposit: '0',
      });
      await loadTasks();
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      addTask();
    }
  };

  if (!signedAccountId) {
    return (
      <div className="todo-container">
        <div className="welcome-card">
          <h2>Welcome to NEAR Todo App</h2>
          <p>Please login with your NEAR wallet to manage your tasks</p>
        </div>
      </div>
    );
  }

  const userTasks = tasks.filter(task => task.owner === signedAccountId);
  const completedCount = userTasks.filter(task => task.completed).length;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>My Tasks</h1>
        <p className="task-summary">
          {completedCount} of {userTasks.length} completed
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="add-task-section">
        <input
          type="text"
          className="form-control task-input"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          className="btn btn-primary add-btn"
          onClick={addTask}
          disabled={loading || !newTaskTitle.trim()}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {loading && userTasks.length === 0 ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : userTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {userTasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-content">
                <input
                  type="checkbox"
                  className="form-check-input task-checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  disabled={loading}
                />
                <span className="task-title">{task.title}</span>
              </div>
              <button
                className="btn btn-danger btn-sm delete-btn"
                onClick={() => deleteTask(task.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
