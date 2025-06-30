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
    moveTaskToPosition: (sourceListId: string, targetListId: string, taskId: string, position: number) => boolean;
    reorderTaskLists: (orderedIds: string[]) => void;
    resetToDefaults: () => void;
}

const TaskListContext = createContext<TaskListContextType | undefined>(undefined);

// Default task lists factory function
const getDefaults = (): TaskList[] => {
    const defaultLists: TaskList[] = [
        {
            id: crypto.randomUUID(),
            name: 'To Do',
            hidden: false,
            color: '#007bff',
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: crypto.randomUUID(),
            name: 'In Progress',
            hidden: false,
            color: '#28a745',
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: crypto.randomUUID(),
            name: 'Done',
            hidden: false,
            color: '#6c757d',
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    return defaultLists;
};

interface TaskListProviderProps {
    children: ReactNode;
}

export function TaskListProvider({ children }: TaskListProviderProps) {
    const [taskLists, setTaskLists] = useState<TaskList[]>(() => {
        const storedLists = StorageService.getTaskLists();

        // If no task lists exist, create default ones
        if (storedLists.length === 0) {
            // Save the default lists immediately
            const defaultLists = getDefaults();
            StorageService.saveTaskLists(defaultLists);
            return defaultLists;
        }

        return storedLists;
    });

    // Sync to localStorage whenever taskLists change
    useEffect(() => {
        StorageService.saveTaskLists(taskLists);
    }, [taskLists]);

    const refreshTaskLists = () => {
        setTaskLists(StorageService.getTaskLists());
    };
    const createTaskList = (taskList: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTaskList: TaskList = {
            ...taskList,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setTaskLists(prev => [...prev, newTaskList]);
        return newTaskList;
    };

    const updateTaskList = (id: string, updates: Partial<Omit<TaskList, 'id' | 'createdAt'>>) => {
        let updatedTaskList: TaskList | null = null;
        setTaskLists(prev => {
            const updatedTaskLists = prev.map(list => {
                if (list.id === id) {
                    updatedTaskList = { ...list, ...updates, updatedAt: new Date() };
                    return updatedTaskList;
                }
                return list;
            });
            return updatedTaskLists;
        });
        return updatedTaskList;
    };

    const deleteTaskList = (id: string) => {
        let found = false;
        setTaskLists(prev => {
            const filtered = prev.filter(list => {
                if (list.id === id) {
                    found = true;
                    return false;
                }
                return true;
            });
            return filtered;
        });
        return found;
    };

    const createTask = (taskListId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        let created = false;
        setTaskLists(prev => prev.map(list => {
            if (list.id === taskListId) {
                created = true;
                return {
                    ...list,
                    tasks: [...list.tasks, newTask],
                    updatedAt: new Date()
                };
            }
            return list;
        }));

        return created ? newTask : null;
    };

    const updateTask = (taskListId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
        let updatedTask: Task | null = null;
        setTaskLists(prev => prev.map(list => {
            if (list.id === taskListId) {
                return {
                    ...list,
                    tasks: list.tasks.map(task => {
                        if (task.id === taskId) {
                            updatedTask = { ...task, ...updates, updatedAt: new Date() };
                            return updatedTask;
                        }
                        return task;
                    }),
                    updatedAt: new Date()
                };
            }
            return list;
        }));
        return updatedTask;
    };

    const deleteTask = (taskListId: string, taskId: string) => {
        let found = false;
        setTaskLists(prev => prev.map(list => {
            if (list.id === taskListId) {
                const filteredTasks = list.tasks.filter(task => {
                    if (task.id === taskId) {
                        found = true;
                        return false;
                    }
                    return true;
                });
                return {
                    ...list,
                    tasks: filteredTasks,
                    updatedAt: new Date()
                };
            }
            return list;
        }));
        return found;
    };

    const moveTask = (sourceListId: string, targetListId: string, taskId: string) => {
        let taskToMove: Task | null = null;
        let found = false;

        // First, find and remove the task from source list
        setTaskLists(prev => {
            return prev.map(list => {
                if (list.id === sourceListId) {
                    const taskIndex = list.tasks.findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        taskToMove = list.tasks[taskIndex];
                        found = true;
                        return {
                            ...list,
                            tasks: list.tasks.filter(task => task.id !== taskId),
                            updatedAt: new Date()
                        };
                    }
                }
                return list;
            });
        });

        // Then add it to the target list
        if (found && taskToMove) {
            setTaskLists(prev => prev.map(list => {
                if (list.id === targetListId) {
                    return {
                        ...list,
                        tasks: [...list.tasks, { ...taskToMove!, updatedAt: new Date() }],
                        updatedAt: new Date()
                    };
                }
                return list;
            }));
        }

        return found;
    };

    const moveTaskToPosition = (sourceListId: string, targetListId: string, taskId: string, position: number) => {
        let taskToMove: Task | null = null;
        let found = false;
        
        setTaskLists(prev => {
            let updated = prev.map(list => {
                if (list.id === sourceListId) {
                    const taskIndex = list.tasks.findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        taskToMove = list.tasks[taskIndex];
                        found = true;
                        return {
                            ...list,
                            tasks: list.tasks.filter(task => task.id !== taskId),
                            updatedAt: new Date()
                        };
                    }
                }
                return list;
            });
            
            // Then add it to the target list at the specified position
            if (found && taskToMove) {
                updated = updated.map(list => {
                    if (list.id === targetListId) {
                        const newTasks = [...list.tasks];
                        // Ensure position is within bounds
                        const insertAt = Math.max(0, Math.min(position, newTasks.length));
                        newTasks.splice(insertAt, 0, { ...taskToMove!, updatedAt: new Date() });
                        return {
                            ...list,
                            tasks: newTasks,
                            updatedAt: new Date()
                        };
                    }
                    return list;
                });
            }
            
            return updated;
        });
        
        return found;
    };

    const reorderTaskLists = (orderedIds: string[]) => {
        setTaskLists(prev => {
            const visible = prev.filter(l => !l.hidden);
            const hidden = prev.filter(l => l.hidden);
            const reordered = orderedIds
                .map(id => visible.find(l => l.id === id))
                .filter(Boolean) as TaskList[];
            return [...reordered, ...hidden];
        });
    };

    const resetToDefaults = () => {
        setTaskLists(getDefaults());
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
        moveTaskToPosition,
        reorderTaskLists, // add to context
        resetToDefaults,
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