import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  DndContext, 
  // DragOverlay, 
  TouchSensor, 
  MouseSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
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
    
    // Batched drag processing
    const pendingDragEvent = useRef<DragOverEvent | null>(null);
    const lastProcessedEventId = useRef<string>('');
    const processingInterval = 100; // ms

    // Configure sensors for mobile and desktop support
    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
            distance: 10,
        },
    });
    
    const touchSensor = useSensor(TouchSensor, {
        // Press delay of 10ms for better mobile performance, with tolerance of 8px of movement
        activationConstraint: {
            delay: 10,
            tolerance: 8,
        },
    });
    
    const sensors = useSensors(mouseSensor, touchSensor);

    // Helper function to find container
    const findContainerIdByTaskId = useCallback((taskId: string) => {
        for (const list of taskLists) {
            if (list.tasks.find(t => t.id === taskId)) {
                return list.id;
            }
        }
        return null;
    }, [taskLists]);

    // Process the actual drag logic (separated from event capture)
    const processDragEvent = useCallback((event: DragOverEvent) => {
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
    }, [findContainerIdByTaskId, moveTaskToPosition, taskLists]);

    // React-style continuous timer using useEffect
    useEffect(() => {
        const timer = setInterval(() => {            
            // Only process if we're currently dragging
            if (!isDragging) return;
            
            if (pendingDragEvent.current) {
                // Create a unique ID for this event
                const eventId = `${pendingDragEvent.current.active.id}-${pendingDragEvent.current.over?.id}-${Date.now()}`;
                
                // Only process if we haven't processed this exact event
                if (eventId !== lastProcessedEventId.current) {
                    processDragEvent(pendingDragEvent.current);
                    lastProcessedEventId.current = eventId;
                }
            }
        }, processingInterval);

        return () => clearInterval(timer);
    }, [isDragging, processDragEvent, processingInterval]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            lastProcessedEventId.current = '';
            pendingDragEvent.current = null;
        };
    }, []);

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

        // Reset tracking for new drag operation
        lastProcessedEventId.current = '';
    }, [taskLists]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { over } = event;

        if (!over) return;

        // Store the latest event for processing
        pendingDragEvent.current = event;
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        setIsDragging(false);
        setActiveTask(null);

        // Reset tracking
        lastProcessedEventId.current = '';
        
        // Process any remaining pending event one final time
        if (pendingDragEvent.current) {
            processDragEvent(pendingDragEvent.current);
            pendingDragEvent.current = null;
        }

        if (!over) {
            // If dropped outside, do nothing
            return;
        }

        const taskId = active.id as string;
        const overId = over.id as string;

        // Handle within-column sorting that wasn't handled by onDragOver
        const activeContainer = findContainerIdByTaskId(taskId);
        const overContainer = findContainerIdByTaskId(overId) || overId;

        const overList = taskLists.find(list => list.id === overContainer);

        if(overList && activeContainer && overContainer) {
            const overIndex = overList.tasks.findIndex(t => t.id === overId) ?? 0;
            moveTaskToPosition(activeContainer, overContainer, taskId, overIndex);
        }
    }, [taskLists, findContainerIdByTaskId, moveTaskToPosition, processDragEvent]);

    const handleDragCancel = useCallback(() => {
        setIsDragging(false);
        setActiveTask(null);
        
        // Reset tracking
        lastProcessedEventId.current = '';
        pendingDragEvent.current = null;
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
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                {children}

            </DndContext>
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
