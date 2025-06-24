import TaskBoard from '../../components/TaskBoard';
import { TaskListProvider, useTaskLists } from '../../contexts/TaskListsContext';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskBoardPage.css';
import { useEffect, useRef } from 'react';

function TaskBoardContent() {
  const { theme } = useTheme();
  const { taskLists, createTaskList } = useTaskLists();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && taskLists.length === 0) {
      initialized.current = true;
      // Create default task lists
      createTaskList({ name: 'To Do', hidden: false, color: '#007bff', tasks: [] });
      createTaskList({ name: 'In Progress', hidden: false, color: '#28a745', tasks: [] });
      createTaskList({ name: 'Done', hidden: false, color: '#6c757d', tasks: [] });
    }
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
