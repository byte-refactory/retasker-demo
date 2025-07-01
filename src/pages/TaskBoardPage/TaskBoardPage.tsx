import TaskBoard from '../../components/TaskBoard';
import { TaskListProvider } from '../../contexts/TaskListsContext';
import { DragDropProvider } from '../../contexts/DragDropContext';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskBoardPage.css';

function TaskBoardPage() {
  const { theme } = useTheme();

  return (
    <TaskListProvider>
      <DragDropProvider>
        <div className="task-board-page" style={{ backgroundColor: theme.background.primary }}>
          <TaskBoard />
        </div>
      </DragDropProvider>
    </TaskListProvider>
  );
}

export default TaskBoardPage;
