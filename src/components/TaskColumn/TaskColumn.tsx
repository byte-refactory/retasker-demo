import type { TaskList } from '../../models';
import { getContrastTextColor } from '../../utils';
import TaskCard from '../TaskCard';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskColumn.css';

interface TaskColumnProps {
  taskList: TaskList;
}

function TaskColumn({ taskList }: TaskColumnProps) {
  const { theme } = useTheme();  
  return (
    <section 
      className="column" 
      aria-labelledby={`column-${taskList.id}-title`}
      style={{
        backgroundColor: theme.taskBoard.columnBackground, 
        borderColor: theme.taskBoard.columnBorder
      }}
    >
      <h3 
        id={`column-${taskList.id}-title`}
        className="column-title" 
        style={{ 
          background: taskList.color,
          color: getContrastTextColor(taskList.color)
        }}
      >
        {taskList.name}
      </h3>
      <div className="column-content" role="list" aria-label={`Tasks in ${taskList.name}`}>
        {taskList.tasks.length > 0 ? (
          taskList.tasks.map(task => (
            <TaskCard key={task.id} task={task} columnColor={taskList.color} />
          ))
        ) : (
          <p className="empty-message" role="status" aria-live="polite">
            No tasks in this list
          </p>
        )}
      </div>    </section>
  );
}

export default TaskColumn;
