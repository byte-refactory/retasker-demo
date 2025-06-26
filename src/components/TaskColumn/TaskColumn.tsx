import { Plus } from 'lucide-react';
import type { TaskList } from '../../models';
import { getContrastTextColor } from '../../utils';
import { useDroppable } from '../../hooks';
import TaskCard from '../TaskCard';
import CreateTaskModal from '../CreateTaskModal';
import useModal from '../../hooks/useModal';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskColumn.css';

interface TaskColumnProps {
  taskList: TaskList;
  onTaskDragStart?: (task: any, sourceListId: string) => void;
  onTaskDragEnd?: (task: any) => void;
  onTaskDrop?: (task: any, targetListId: string, mouseY?: number) => void;
}

function TaskColumn({ taskList, onTaskDragStart, onTaskDragEnd, onTaskDrop }: TaskColumnProps) {
  const { theme } = useTheme();
  const createTaskModal = useModal(); const { dropRef, isOver } = useDroppable({
    accept: 'task',
    onDrop: (dragItem, _dropTarget, mousePosition) => {
      onTaskDrop?.(dragItem.data, taskList.id, mousePosition?.y);
    },
  });

  const handleAddTask = () => {
    createTaskModal.open();
  };
  const handleTaskDragStart = (task: any) => {
    onTaskDragStart?.(task, taskList.id);
  };

  const handleTaskDragEnd = (task: any) => {
    onTaskDragEnd?.(task);
  };

  const headerTextColor = getContrastTextColor(taskList.color);

  return (
    <>      <section
      ref={dropRef}
      className={`column ${isOver ? 'column-drag-over' : ''}`}
      aria-labelledby={`column-${taskList.id}-title`}
      data-task-column="true"
      data-column-id={taskList.id}
      style={{
        backgroundColor: isOver ? theme.taskBoard.columnDragHoverBackground : theme.taskBoard.columnBackground,
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
              onDragStart={handleTaskDragStart}
              onDragEnd={handleTaskDragEnd}
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
