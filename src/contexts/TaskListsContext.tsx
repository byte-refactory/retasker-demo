import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../models/Task';
import type { TaskList } from '../models/TaskList';
import { StorageService } from '../utils/storageService';

interface TaskListContextType {
  taskLists: TaskList[];
  refreshTaskLists: () => void;
  createTaskList: (taskList: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'>) => TaskList;
  updateTaskList: (id: string, updates: Partial<Omit<TaskList, 'id' | 'createdAt'>>) => TaskList | null;
  deleteTaskList: (id: string) => boolean;
  createTask: (taskListId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task | null;
  updateTask: (taskListId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Task | null;
  deleteTask: (taskListId: string, taskId: string) => boolean;
  moveTask: (sourceListId: string, targetListId: string, taskId: string) => boolean;
}

const TaskListContext = createContext<TaskListContextType | undefined>(undefined);

interface TaskListProviderProps {
  children: ReactNode;
}

export function TaskListProvider({ children }: TaskListProviderProps) {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  const refreshTaskLists = () => {
    setTaskLists(StorageService.getTaskLists());
  };

  useEffect(() => {
    refreshTaskLists();
  }, []);

  const createTaskList = (taskList: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTaskList = StorageService.createTaskList(taskList);
    refreshTaskLists();
    return newTaskList;
  };

  const updateTaskList = (id: string, updates: Partial<Omit<TaskList, 'id' | 'createdAt'>>) => {
    const updatedTaskList = StorageService.updateTaskList(id, updates);
    refreshTaskLists();
    return updatedTaskList;
  };

  const deleteTaskList = (id: string) => {
    const success = StorageService.deleteTaskList(id);
    refreshTaskLists();
    return success;
  };

  const createTask = (taskListId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask = StorageService.createTask(taskListId, task);
    refreshTaskLists();
    return newTask;
  };

  const updateTask = (taskListId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const updatedTask = StorageService.updateTask(taskListId, taskId, updates);
    refreshTaskLists();
    return updatedTask;
  };

  const deleteTask = (taskListId: string, taskId: string) => {
    const success = StorageService.deleteTask(taskListId, taskId);
    refreshTaskLists();
    return success;
  };

  const moveTask = (sourceListId: string, targetListId: string, taskId: string) => {
    const success = StorageService.moveTask(sourceListId, targetListId, taskId);
    refreshTaskLists();
    return success;
  };

  const contextValue: TaskListContextType = {
    taskLists,
    refreshTaskLists,
    createTaskList,
    updateTaskList,
    deleteTaskList,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };

  return (
    <TaskListContext.Provider value={contextValue}>
      {children}
    </TaskListContext.Provider>
  );
}

export function useTaskLists(): TaskListContextType {
  const context = useContext(TaskListContext);
  if (context === undefined) {
    throw new Error('useTaskLists must be used within a TaskListProvider');
  }
  return context;
}