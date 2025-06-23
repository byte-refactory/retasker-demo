import type { TaskList } from '../../models';
import TaskColumn from '../TaskColumn';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';

interface TaskBoardProps {
  taskLists?: TaskList[];
}

function TaskBoard({ taskLists = [] }: TaskBoardProps) {
  const { theme } = useTheme();

  return (
    <main className="task-board" role="main">
      <h2 className="board-title" style={{ color: theme.text.primary }}>Task Board</h2>
      <div className="board-columns" role="group" aria-label="Task columns">
        {taskLists.map(taskList => (
          <TaskColumn 
            key={taskList.id} 
            taskList={taskList} 
          />
        ))}
      </div>
    </main>
  );
}

export default TaskBoard;
