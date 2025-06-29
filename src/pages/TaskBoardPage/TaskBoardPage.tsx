import TaskBoard from '../../components/TaskBoard';
import { TaskListProvider } from '../../contexts/TaskListsContext';
import { DragDropProvider } from '../../contexts/DragDropContext';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskBoardPage.css';

function TaskBoardContent() {
  const { theme } = useTheme();

  return (
    <div className="task-board-page" style={{ backgroundColor: theme.background.primary }}>
      <TaskBoard />
    </div>
  );
}

function TaskBoardPage() {
  return (
    <TaskListProvider>
      <DragDropProvider>
        <TaskBoardContent />
      </DragDropProvider>
    </TaskListProvider>
  );
}

export default TaskBoardPage;
