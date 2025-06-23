import { useEffect} from 'react';
import TaskBoard from '../../components/TaskBoard';
import { TaskListProvider, useTaskLists } from '../../contexts/TaskListsContext';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskBoardPage.css';

function TaskBoardContent() {
  const { theme } = useTheme();
  const { taskLists, createTaskList } = useTaskLists();
  // Create default task lists if none exist
  useEffect(() => {
    // Only initialize after we've confirmed the context has loaded
    // Skip if the function isn't available yet
    if (!createTaskList) {
      return;
    }

    // Use setTimeout to defer execution until after all synchronous React renders complete
    // This ensures the context has finished its initial state updates before we check taskLists.length
    const timer = setTimeout(() => {
      if (taskLists.length === 0) {
        
        // Create default task lists
        createTaskList({
          name: 'To Do',
          color: '#007bff',
          tasks: []
        });
        
        createTaskList({
          name: 'In Progress',
          color: '#28a745',
          tasks: []
        });
        
        createTaskList({
          name: 'Done',
          color: '#6c757d',
          tasks: []
        });
      }
    }, 1);

    return () => clearTimeout(timer);
  }, [taskLists, createTaskList]);

  return (
    <div className="task-board-page" style={{ backgroundColor: theme.background.primary }}>
      <TaskBoard taskLists={taskLists} />
    </div>
  );
}

function TaskBoardPage() {
  return (
    <TaskListProvider>
      <TaskBoardContent />
    </TaskListProvider>
  );
}

export default TaskBoardPage;
