import type { Task } from './Task';

export interface TaskList {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
  createdAt?: Date;
  updatedAt?: Date;
}