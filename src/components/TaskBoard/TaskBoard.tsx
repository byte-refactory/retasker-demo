import React from 'react';
import type { TaskList } from '../../models';
import TaskColumn from '../TaskColumn';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';

interface TaskBoardProps {
    taskLists?: TaskList[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ taskLists = [] }) => {
  const { theme } = useTheme();

  return (
    <div className="task-board">
      <h2 className="board-title" style={{ color: theme.text.primary }}>Task Board</h2>
      <div className="board-columns">
        {taskLists.map(taskList => (
          <TaskColumn key={taskList.id} taskList={taskList} />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
