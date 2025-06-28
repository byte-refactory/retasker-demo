import { Plus } from 'lucide-react';
import type { TaskList } from '../../models';
import { getContrastTextColor } from '../../utils';
import TaskCard from '../TaskCard';
import CreateTaskModal from '../CreateTaskModal';
import useModal from '../../hooks/useModal';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskColumn.css';

interface TaskColumnProps {
  taskList: TaskList;
}

function TaskColumn({ taskList }: TaskColumnProps) {
  const { theme } = useTheme();
  const createTaskModal = useModal();

  const handleAddTask = () => {
    createTaskModal.open();
  };

  const headerTextColor = getContrastTextColor(taskList.color);

  return (
    <>
      <section
        className="column"
        aria-labelledby={`column-${taskList.id}-title`}
        data-task-column="true"
        data-column-id={taskList.id}
        style={{
          backgroundColor: theme.taskBoard.columnBackground,
          borderColor: theme.taskBoard.columnBorder
        }}
    >
      <div
        className="column-header"
        style={{
          background: taskList.color,
        }}
      >
        <h3
          id={`column-${taskList.id}-title`}
          className="column-title"
          style={{
            color: headerTextColor
          }}
        >
          {taskList.name}
        </h3>
        <button
          className="add-task-button"
          onClick={handleAddTask}
          aria-label={`Add task to ${taskList.name}`}
          style={{
            color: headerTextColor,
            borderColor: headerTextColor,
            backgroundColor: 'transparent',
          }}
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="column-content" role="list" aria-label={`Tasks in ${taskList.name}`}>
        {taskList.tasks.length > 0 ? (
          taskList.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              columnColor={taskList.color}
            />
          ))
        ) : (
          <p className="empty-message" role="status" aria-live="polite">
            No tasks in this list
          </p>
        )}
      </div>
    </section>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createTaskModal.isOpen}
        onClose={createTaskModal.close}
        taskListId={taskList.id}
        taskListName={taskList.name}
      />
    </>
  );
}

export default TaskColumn;
