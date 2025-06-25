import { useRef, useState, useEffect } from 'react';

export interface DragItem {
  id: string;
  type: string;
  data?: any;
}

export interface DragState {
  isDragging: boolean;
  dragItem: DragItem | null;
  dragOffset: { x: number; y: number };
  dragPosition: { x: number; y: number };
}

export interface UseDraggableOptions {
  item: DragItem;
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (item: DragItem) => void;
}

export interface UseDroppableOptions {
  accept: string | string[];
  onDrop?: (item: DragItem, dropTarget: any) => void;
  onDragOver?: (item: DragItem) => void;
  onDragLeave?: () => void;
}

export function useDraggable({ item, onDragStart, onDragEnd }: UseDraggableOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const initialElementPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;

    const rect = dragRef.current.getBoundingClientRect();
    initialMousePos.current = { x: e.clientX, y: e.clientY };
    initialElementPos.current = { x: rect.left, y: rect.top };

    setIsDragging(true);
    onDragStart?.(item);

    // Store drag data globally for drop detection
    globalDragState = {
      ...globalDragState,
      isDragging: true,
      dragItem: item,
      dragOffset: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      dragPosition: { x: e.clientX, y: e.clientY },
    };
    
    // Notify listeners
    dragStateListeners.forEach(listener => listener(globalDragState));

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;

      const deltaX = e.clientX - initialMousePos.current.x;
      const deltaY = e.clientY - initialMousePos.current.y;

      dragRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      dragRef.current.style.zIndex = '9999';
      dragRef.current.style.pointerEvents = 'none';

      // Update global position
      globalDragState = {
        ...globalDragState,
        dragPosition: { x: e.clientX, y: e.clientY },
      };
      dragStateListeners.forEach(listener => listener(globalDragState));
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (dragRef.current) {
        dragRef.current.style.transform = '';
        dragRef.current.style.zIndex = '';
        dragRef.current.style.pointerEvents = '';
      }

      // Check if we're over a drop zone
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const dropZone = elementBelow?.closest('[data-drop-zone]');
      
      if (dropZone && globalDragState.dragItem) {
        const onDropHandler = (dropZone as any)._onDrop;
        if (onDropHandler) {
          onDropHandler(globalDragState.dragItem);
        }
      }

      setIsDragging(false);
      onDragEnd?.(item);

      // Reset global state
      globalDragState = {
        isDragging: false,
        dragItem: null,
        dragOffset: { x: 0, y: 0 },
        dragPosition: { x: 0, y: 0 },
      };
      dragStateListeners.forEach(listener => listener(globalDragState));

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    dragRef,
    isDragging,
    dragProps: {
      onMouseDown: handleMouseDown,
      style: {
        cursor: 'grab',
        userSelect: 'none' as const,
        transition: isDragging ? 'none' : 'transform 0.2s ease',
      },
    },
  };
}

export function useDroppable({ accept, onDrop, onDragLeave }: UseDroppableOptions) {
  const [isOver, setIsOver] = useState(false);
  const dropRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = dropRef.current;
    if (!element) return;

    // Mark as drop zone
    element.setAttribute('data-drop-zone', 'true');
    (element as any)._onDrop = (dragItem: DragItem) => {
      const acceptTypes = Array.isArray(accept) ? accept : [accept];
      if (acceptTypes.includes(dragItem.type)) {
        onDrop?.(dragItem, element);
      }
    };

    const handleMouseEnter = () => {
      if (globalDragState.isDragging) {
        setIsOver(true);
      }
    };

    const handleMouseLeave = () => {
      if (globalDragState.isDragging) {
        setIsOver(false);
        onDragLeave?.();
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeAttribute('data-drop-zone');
      delete (element as any)._onDrop;
    };
  }, [accept, onDrop, onDragLeave]);

  // Listen for global drag state changes to reset isOver when drag ends
  useEffect(() => {
    const handleDragStateChange = (state: DragState) => {
      if (!state.isDragging) {
        setIsOver(false);
      }
    };

    dragStateListeners.add(handleDragStateChange);
    
    return () => {
      dragStateListeners.delete(handleDragStateChange);
    };
  }, []);

  return {
    dropRef,
    isOver,
    dropProps: {},
  };
}

// Global drag state management
let globalDragState: DragState = {
  isDragging: false,
  dragItem: null,
  dragOffset: { x: 0, y: 0 },
  dragPosition: { x: 0, y: 0 },
};

const dragStateListeners = new Set<(state: DragState) => void>();

export function useDragState() {
  const [state] = useState(globalDragState);

  const subscribe = (listener: (state: DragState) => void) => {
    dragStateListeners.add(listener);
    return () => dragStateListeners.delete(listener);
  };

  const updateDragState = (newState: Partial<DragState>) => {
    globalDragState = { ...globalDragState, ...newState };
    dragStateListeners.forEach(listener => listener(globalDragState));
  };

  return {
    state,
    updateDragState,
    subscribe,
  };
}
