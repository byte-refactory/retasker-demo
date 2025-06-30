import { Plus } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { TaskList, Task } from '../../models';
import { getContrastTextColor } from '../../utils';
import TaskCard from '../TaskCard';
import SaveEditModal from '../SaveEditModal';
import useModal from '../../hooks/useModal';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskColumn.css';

interface TaskColumnProps {
  taskList: TaskList;
  onEditTask?: (task: Task) => void;
}

function TaskColumn({ taskList, onEditTask }: TaskColumnProps) {
  const { theme } = useTheme();
  const createTaskModal = useModal();
  
  const { setNodeRef, isOver } = useDroppable({
    id: taskList.id,
  });

  const taskIds = taskList.tasks.map(task => task.id);

  const handleAddTask = () => {
    createTaskModal.open();
  };

  const headerTextColor = getContrastTextColor(taskList.color);

  return (
    <>
      <section
        ref={setNodeRef}
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
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {taskList.tasks.length > 0 ? (
            taskList.tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                columnColor={taskList.color}
                onEdit={onEditTask}
              />
            ))
          ) : (
            <p className="empty-message" role="status" aria-live="polite">
              No tasks in this list
            </p>
          )}
        </SortableContext>
      </div>
    </section>

      {/* Create Task Modal */}
      <SaveEditModal
        isOpen={createTaskModal.isOpen}
        onClose={createTaskModal.close}
        taskListId={taskList.id}
        taskListName={taskList.name}
      />
    </>
  );
}

export default TaskColumn;
