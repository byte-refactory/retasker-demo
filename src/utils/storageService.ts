import type { Task } from '../models/Task';
import type { TaskList } from '../models/TaskList';
import type { Theme } from './theme';
import {lightTheme} from './theme';

const TASK_LIST_STORAGE_KEY = 'retasker_task_lists';
const THEME_STORAGE_KEY = 'retasker_theme';

export class StorageService {

  // Get all task lists from localStorage
  static getTheme(): Theme {
    try {
      const data = localStorage.getItem(THEME_STORAGE_KEY) ;
      return data ? JSON.parse(data) : lightTheme;
    } catch (error) {
      console.error('Error reading task lists from localStorage:', error);
      return lightTheme;
    }
  }

  static setTheme(theme: Theme): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }

  // Get all task lists from localStorage
  static getTaskLists(): TaskList[] {
    try {
      const data = localStorage.getItem(TASK_LIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading task lists from localStorage:', error);
      return [];
    }
  }

  // Save all task lists to localStorage
  static saveTaskLists(taskLists: TaskList[]): void {
    try {
      localStorage.setItem(TASK_LIST_STORAGE_KEY, JSON.stringify(taskLists));
    } catch (error) {
      console.error('Error saving task lists to localStorage:', error);
    }
  }

  // TaskList CRUD operations
  static createTaskList(taskList: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'>): TaskList {
    const taskLists = this.getTaskLists();
    const newTaskList: TaskList = {
      ...taskList,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    taskLists.push(newTaskList);
    this.saveTaskLists(taskLists);
    return newTaskList;
  }

  static updateTaskList(id: string, updates: Partial<Omit<TaskList, 'id' | 'createdAt'>>): TaskList | null {
    const taskLists = this.getTaskLists();
    const index = taskLists.findIndex(list => list.id === id);
    
    if (index === -1) return null;
    
    taskLists[index] = {
      ...taskLists[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    this.saveTaskLists(taskLists);
    return taskLists[index];
  }

  static deleteTaskList(id: string): boolean {
    const taskLists = this.getTaskLists();
    const filteredLists = taskLists.filter(list => list.id !== id);
    
    if (filteredLists.length === taskLists.length) return false;
    
    this.saveTaskLists(filteredLists);
    return true;
  }

  // Task CRUD operations
  static createTask(taskListId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task | null {
    const taskLists = this.getTaskLists();
    const listIndex = taskLists.findIndex(list => list.id === taskListId);
    
    if (listIndex === -1) return null;
    
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    taskLists[listIndex].tasks.push(newTask);
    taskLists[listIndex].updatedAt = new Date();
    
    this.saveTaskLists(taskLists);
    return newTask;
  }

  static updateTask(taskListId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const taskLists = this.getTaskLists();
    const listIndex = taskLists.findIndex(list => list.id === taskListId);
    
    if (listIndex === -1) return null;
    
    const taskIndex = taskLists[listIndex].tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return null;
    
    taskLists[listIndex].tasks[taskIndex] = {
      ...taskLists[listIndex].tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    taskLists[listIndex].updatedAt = new Date();
    this.saveTaskLists(taskLists);
    return taskLists[listIndex].tasks[taskIndex];
  }

  static deleteTask(taskListId: string, taskId: string): boolean {
    const taskLists = this.getTaskLists();
    const listIndex = taskLists.findIndex(list => list.id === taskListId);
    
    if (listIndex === -1) return false;
    
    const originalLength = taskLists[listIndex].tasks.length;
    taskLists[listIndex].tasks = taskLists[listIndex].tasks.filter(task => task.id !== taskId);
    
    if (taskLists[listIndex].tasks.length === originalLength) return false;
    
    taskLists[listIndex].updatedAt = new Date();
    this.saveTaskLists(taskLists);
    return true;
  }

  // Move task between lists
  static moveTask(sourceListId: string, targetListId: string, taskId: string): boolean {
    const taskLists = this.getTaskLists();
    const sourceIndex = taskLists.findIndex(list => list.id === sourceListId);
    const targetIndex = taskLists.findIndex(list => list.id === targetListId);
    
    if (sourceIndex === -1 || targetIndex === -1) return false;
     
    const taskIndex = taskLists[sourceIndex].tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return false;
    
    const [movedTask] = taskLists[sourceIndex].tasks.splice(taskIndex, 1);
    movedTask.updatedAt = new Date();
    
    taskLists[targetIndex].tasks.push(movedTask);
    taskLists[sourceIndex].updatedAt = new Date();
    taskLists[targetIndex].updatedAt = new Date();
    
    this.saveTaskLists(taskLists);
    return true;
  }
}