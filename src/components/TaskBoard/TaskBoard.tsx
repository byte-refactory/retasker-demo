import TaskColumn from '../TaskColumn';
import './TaskBoard.css';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskLists } from '../../contexts/TaskListsContext';
import { Settings } from 'lucide-react';
import ManageTaskListsModal from '../ManageTaskListsModal';
import { useState } from 'react';

function TaskBoard(): React.ReactElement {
  const { theme } = useTheme();
  const { taskLists, moveTask } = useTaskLists();
  const [isManageModalOpen, setManageModalOpen] = useState(false);
  const [dragState, setDragState] = useState<{ task: any; sourceListId: string } | null>(null);

  const handleTaskDragStart = (task: any, sourceListId: string) => {
    setDragState({ task, sourceListId });
  };

  const handleTaskDragEnd = () => {
    setDragState(null);
  };

  const handleTaskDrop = (task: any, targetListId: string) => {
    if (dragState && dragState.sourceListId !== targetListId) {
      moveTask(dragState.sourceListId, targetListId, task.id);
    }
    setDragState(null);
  };

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
      </div>      <div className="board-columns" role="group" aria-label="Task columns">
        {taskLists.filter(t => !t.hidden).map(taskList => (
          <TaskColumn 
            key={taskList.id} 
            taskList={taskList}
            onTaskDragStart={handleTaskDragStart}
            onTaskDragEnd={handleTaskDragEnd}
            onTaskDrop={handleTaskDrop}
          />
        ))}
      </div>
      <ManageTaskListsModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} />
    </main>
  );
}

export default TaskBoard;
