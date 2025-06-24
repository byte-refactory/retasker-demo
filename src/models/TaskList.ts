import type { Task } from './Task';

export interface TaskList {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
  hidden?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}