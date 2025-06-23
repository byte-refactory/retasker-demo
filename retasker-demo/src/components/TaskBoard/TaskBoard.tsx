import React from 'react';
import type { TaskList } from '../../models';
import TaskColumn from '../TaskColumn';
import './TaskBoard.css';

interface TaskBoardProps {
    taskLists?: TaskList[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ taskLists = [] }) => {
  return (
    <div className="task-board">
      <h2 className="board-title">Task Board</h2>
      <div className="board-columns">
        {taskLists.map(taskList => (
          <TaskColumn key={taskList.id} taskList={taskList} />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
