import React from 'react';
import type { TaskList } from '../../models';
import { getContrastTextColor } from '../../utils';
import TaskCard from '../TaskCard';
import './TaskColumn.css';

interface TaskColumnProps {
  taskList: TaskList;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ taskList }) => {
  return (
    <div className="column">
      <h3 
        className="column-title" 
        style={{ 
          background: taskList.color,
          color: getContrastTextColor(taskList.color)
        }}
      >
        {taskList.name}
      </h3>
      <div className="column-content">
        {taskList.tasks.length > 0 ? (
          taskList.tasks.map(task => (
            <TaskCard key={task.id} task={task} columnColor={taskList.color} />
          ))
        ) : (
          <p className="empty-message">No tasks in this list</p>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
