import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import type { Task } from '../models';
import { useTaskLists } from './TaskListsContext';

// DragDrop context type
interface DragDropContextType {
    // State
    isDragging: boolean;
    activeTask: Task | null;

    // Event handlers
    handleDragStart: (event: DragStartEvent) => void;
    handleDragOver: (event: DragOverEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    handleDragCancel: () => void;
}

// Create context
const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

// Provider props
interface DragDropProviderProps {
    children: ReactNode;
}

// DragDrop provider component
export function DragDropProvider({ children }: DragDropProviderProps) {
    const { taskLists, moveTaskToPosition } = useTaskLists();

    // State
    const [isDragging, setIsDragging] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Helper function to find container
    const findContainerIdByTaskId = useCallback((taskId: string) => {
        for (const list of taskLists) {
            if (list.tasks.find(t => t.id === taskId)) {
                return list.id;
            }
        }
        return null;
    }, [taskLists]);

    // Drag event handlers
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const taskId = active.id as string;

        setIsDragging(true);

        // Find the active task
        for (const list of taskLists) {
            const task = list.tasks.find(t => t.id === taskId);
            if (task) {
                setActiveTask(task);
                break;
            }
        }
    }, [taskLists]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the active and over containers
        const activeContainerId = findContainerIdByTaskId(activeId);

        // If over is a droppable area, it might not have a task ID, so we use the ID directly
        let overContainerId = findContainerIdByTaskId(overId);
        const overTaskId = overContainerId ? overId : null;
        overContainerId = overContainerId || overId;

        if (!activeContainerId || !overContainerId) return;

        // If we're in the same container, let SortableContext handle it
        if (activeContainerId === overContainerId) return;

        // Only move for cross-container drag if we're actually changing containers
        // This prevents redundant state updates that could cause infinite re-renders
        const activeList = taskLists.find(list => list.id === activeContainerId);
        const overList = taskLists.find(list => list.id === overContainerId);

        if (!activeList || !overList) return;

        const activeTask = activeList.tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        // Check if the task is already in the target container to avoid redundant moves
        const taskAlreadyInTarget = overList.tasks.some(t => t.id === activeId);
        if (taskAlreadyInTarget) return;

        const overTaskIndex = overTaskId ? overList.tasks.findIndex(t => t.id === overId) : 0;

        moveTaskToPosition(activeContainerId, overContainerId, activeId, overTaskIndex);
    }, [taskLists, findContainerIdByTaskId, moveTaskToPosition]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        setIsDragging(false);
        setActiveTask(null);

        if (!over) {
            // If dropped outside, do nothing
            return;
        }

        const taskId = active.id as string;
        const overId = over.id as string;

        // Handle within-column sorting that wasn't handled by onDragOver
        const activeContainer = findContainerIdByTaskId(taskId);
        const overContainer = findContainerIdByTaskId(overId) || overId;

        if (activeContainer && overContainer && activeContainer === overContainer) {
            // This is within-column sorting - handle it here
            const containerList = taskLists.find(list => list.id === activeContainer);
            if (containerList) {
                const activeIndex = containerList.tasks.findIndex(t => t.id === taskId);
                const overIndex = containerList.tasks.findIndex(t => t.id === overId);

                if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                    moveTaskToPosition(activeContainer, activeContainer, taskId, overIndex);
                }
            }
        }

        // For cross-container drops, the onDragOver handler has already moved the task
        // The position is now final
    }, [taskLists, findContainerIdByTaskId, moveTaskToPosition]);

    const handleDragCancel = useCallback(() => {

    }, []);

    const contextValue: DragDropContextType = {
        // State
        isDragging,
        activeTask,

        // Event handlers
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel
    };

    return (
        <DragDropContext.Provider value={contextValue}>
            {children}
        </DragDropContext.Provider>
    );
}

// Custom hook to use drag drop
export function useDragDrop(): DragDropContextType {
    const context = useContext(DragDropContext);
    if (context === undefined) {
        throw new Error('useDragDrop must be used within a DragDropProvider');
    }
    return context;
}
