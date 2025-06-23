import React from 'react';
import TaskBoard from '../../components/TaskBoard';
import type { TaskList } from '../../models';
import { useTheme } from '../../contexts/ThemeContext';
import './TaskBoardPage.css';

const TaskBoardPage: React.FC = () => {
  const { theme } = useTheme();

  // Sample task lists - in a real app, this would come from state management or API
  const toDoList: TaskList = {
    id: 'to-do',
    name: 'To Do',
    color: '#007bff',
    tasks: [
      {
        id: '1',
        title: 'Setup project structure',
        description: 'Create the basic folder structure and initial components'
      },
      {
        id: '2',
        title: 'Create TaskBoard component',
        description: 'Build a kanban-style task board with three columns'
      },
      {
        id: '3',
        title: 'Add task management features',
        description: 'Implement add, edit, and delete functionality for tasks'
      },
      {
        id: '4',
        title: 'Style the application',
        description: 'Add CSS styling to make the app look professional'
      }
    ]
  };

  const inProgressList: TaskList = {
    id: 'in-progress',
    name: 'In Progress',
    color: 'LightGreen',
    tasks: [
      {
        id: '6',
        title: 'Setup project structure',
        description: 'Create the basic folder structure and initial components'
      },
      {
        id: '7',
        title: 'Create TaskBoard component',
        description: 'Build a kanban-style task board with three columns'
      },
      {
        id: '8',
        title: 'Sample Task',
        description: 'This is a sample task in progress. It can be edited or deleted as needed. ' +
        'It is currently being worked on by the team. It may require additional resources or collaboration with other team members to complete. ' +
        'The task is expected to take a few days to finish, and updates will be provided regularly. ' +
        'Please check back for progress updates and any changes to the task details.'
      }
    ]
  };

  const doneList: TaskList = {
    id: 'done',
    name: 'Done',
    color: '#28a745',
    tasks: []
  };

  const taskLists = [toDoList, inProgressList, doneList];

  return (
    <div className="task-board-page" style={{ backgroundColor: theme.background.primary }}>
      <TaskBoard taskLists={taskLists} />
    </div>
  );
};

export default TaskBoardPage;
