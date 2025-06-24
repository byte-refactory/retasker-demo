import type { TaskList } from '../../models';
import TaskColumn from '../TaskColumn';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';
import { Settings } from 'lucide-react';
import ManageTaskListsModal from '../ManageTaskListsModal';
import { useState } from 'react';

interface TaskBoardProps {
  taskLists?: TaskList[];
}

function TaskBoard({ taskLists = [] }: TaskBoardProps) {
  const { theme } = useTheme();
  const [isManageModalOpen, setManageModalOpen] = useState(false);

  return (
    <main className="task-board" role="main">
      <div className="board-title-row">
        <h2 className="board-title" style={{ color: theme.text.primary }}>Task Board</h2>
        <button
          className="board-config-btn"
          aria-label="Configure board"
          title="Configure board"
          style={{ color: theme.text.secondary, background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8, padding: 4, borderRadius: 4 }}
          onClick={() => setManageModalOpen(true)}
        >
          <Settings size={22} />
        </button>
      </div>
      <div className="board-columns" role="group" aria-label="Task columns">
        {taskLists.map(taskList => (
          <TaskColumn 
            key={taskList.id} 
            taskList={taskList} 
          />
        ))}
      </div>
      <ManageTaskListsModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} />
    </main>
  );
}

export default TaskBoard;
